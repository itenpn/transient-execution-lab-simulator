import {
  INSTRUCTIONS,
  INSTRUCTION_CLASS,
  INSTRUCTION_DEPENDENCY,
  INSTRUCTION_INPUT,
} from "./Instructions";

class CoreSim {
  constructor(
    program,
    memorySim,
    pid,
    secret,
    getCycleNum,
    predictBranch,
    updateBranchPredictor,
    cpuExecProgram,
    handleSecretCheck
  ) {
    this.programStream = program.instructions;
    this.labels = program.labels;
    this.program = program;
    this.instructionStream = new Array();
    this.registers = new Int32Array(32);
    this.commitPointer = 0;
    this.instPointer = 0;
    this.memory = memorySim;
    this.status = true;
    this.pid = pid;
    this.secret = secret;
    this.getCycleNum = getCycleNum;
    this.instIdCounter = 0;
    this.tempRegisters = {};
    this.predictBranch = predictBranch;
    this.updateBranchPredictor = updateBranchPredictor;
    this.cpuExecProgram = cpuExecProgram;
    this.handleSecretCheck = handleSecretCheck;
    this.nopActive = false;
  }

  restartCore() {
    this.memory.terminateProcess(this.pid);
    this.status = true;
    this.tempRegisters = {};
    this.instructionStream = new Array();
    this.registers = new Int32Array(32);
    this.instIdCounter = 0;
    this.instPointer = 0;
    this.commitPointer = 0;
    this.nopActive = false;
  }

  nextCycle() {
    const memActions = this.memory.getCurrCycleActions(this.pid);
    if (this.status && !this.nopActive) this.findAndAddInstruction();
    this.handleInstructions(memActions);
    if (this.status && !this.nopActive) this.instPointer++;
    return this.handleCommit();
  }

  handleCommit() {
    if (this.commitPointer >= this.instructionStream.length) return false;
    const toBeCommitted = this.instructionStream[this.commitPointer];
    //console.log("WANT TO COMMIT ", this.pid, toBeCommitted);
    if (
      toBeCommitted.finished &&
      !toBeCommitted.errorBranchPrediction &&
      !toBeCommitted.errorMemoryAccess
    ) {
      const tempRegs = this.tempRegisters[this.commitPointer];
      toBeCommitted.committed = true;
      tempRegs.forEach((temp) => (this.registers[temp.value] = temp.output));
      this.commitPointer++;
      if (toBeCommitted.terminate) {
        this.status = false;
      }
      if (toBeCommitted.execProgram) {
        this.cpuExecProgram(toBeCommitted.execProgram);
      }
      if (toBeCommitted.name === "checksecret") {
        this.handleSecretCheck(toBeCommitted.checkPass);
      }

      return true;
    }
    if (toBeCommitted.errorBranchPrediction) {
      this.commitPointer++;
    } else if (toBeCommitted.errorMemoryAccess) {
      this.status = false;
    }
    return false;
  }

  findAndAddInstruction() {
    //Step 1: give the instruction an id and calculate how many cycles are needed
    const nextInst = this.programStream[this.instPointer];
    if (!nextInst) return;
    const instObj = {
      ...nextInst,
      id: this.instIdCounter,
      cyclesLeft: nextInst.cycles,
      committed: false,
      finished: false,
      memStarted: false,
      prediction: null,
      errorBranchPrediction: false,
      errorMemoryAccess: false,
      instPointerOriginal: this.instPointer,
      terminate: false,
      checkPass: false,
    };
    if (instObj.name === "nop") {
      instObj.cyclesLeft = nextInst.inputs[0].value;
    }

    //Step 2: determine if the instruction has a dependency
    let dependentInsts = [];
    for (let i = this.instructionStream.length - 1; i >= 0; i--) {
      let instCheck = this.instructionStream[i];
      if (!instCheck.committed && !instCheck.errorBranchPrediction) {
        //The instruction may be doing something that affects us
        //Find the registers that the instruction we are evaluating is using
        let instCheckRegInputs = instCheck.inputs.filter(
          (input) =>
            input.type === INSTRUCTION_INPUT.REGISTER &&
            input.dependency === INSTRUCTION_DEPENDENCY.WRITE
        );
        if (instCheckRegInputs.length < 0) continue;

        //Find the registers that our new instruciton is evaluating
        let nextInstRegInputs = nextInst.inputs.filter(
          (input) =>
            input.type === INSTRUCTION_INPUT.REGISTER &&
            input.dependency === INSTRUCTION_DEPENDENCY.READ
        );
        if (nextInstRegInputs.length < 0) continue;

        //See if there is any overlap
        nextInstRegInputs.forEach((regInput) => {
          let found = instCheckRegInputs.find(
            (input) => input.value === regInput.value
          );
          if (
            found &&
            !dependentInsts.find((dep) => dep.register === regInput.value)
          ) {
            dependentInsts.push({
              dependentId: instCheck.id,
              register: regInput.value,
            });
          }
        });
      }
    }
    instObj.dependencies = dependentInsts;

    //Step 3: create new temp registers
    this.tempRegisters[instObj.id] = nextInst.inputs
      .filter(
        (input) =>
          input.type === INSTRUCTION_INPUT.REGISTER &&
          input.dependency === INSTRUCTION_DEPENDENCY.WRITE
      )
      .map((a) => {
        return { ...a, output: null };
      });

    //Step 4: add instruction to queue
    this.instructionStream.push(instObj);
    this.instIdCounter++;
  }

  handleInstructions(memActions) {
    this.instructionStream.forEach(this.handleSingleInstruction, this);
    const inProgressMemInsts = this.instructionStream.filter(
      (inst) =>
        inst.classDef === INSTRUCTION_CLASS.MEMORY &&
        !inst.finished &&
        inst.memStarted
    );
    memActions.forEach((action) => {
      const actionInst = inProgressMemInsts.find(
        (inst) => action.instId === inst.id
      );
      if (actionInst) {
        actionInst.finished = true;
        actionInst.errorMemoryAccess = action.permFailure;
        if (action.type === "load") {
          const data = action.returnData;
          const regNum = action.destReg;
          this.writeReg(actionInst.id, regNum, data);
        }
      }
    });
  }

  handleSingleInstruction(instruction) {
    if (instruction.finished) return;
    //console.log("handling", this.pid, instruction);
    if (instruction.dependencies.length > 0) {
      if (
        instruction.dependencies.filter((dep) => {
          const depInst = this.instructionStream[dep.dependentId];
          return !depInst.finished;
        }).length > 0
      )
        return;
    }
    if (
      this.instructionStream
        .filter((inst) => inst.id < instruction.id)
        .some(
          (inst) =>
            inst.name === "nop" &&
            !inst.finished &&
            !inst.errorBranchPrediction &&
            !inst.errorMemoryAccess
        )
    ) {
      this.nopActive = true;
      return;
    } else {
      this.nopActive = false;
    }
    if (instruction.name === "cycletime") {
      if (
        this.instructionStream
          .filter((inst) => inst.id < instruction.id)
          .some(
            (inst) =>
              !inst.finished &&
              !inst.errorBranchPrediction &&
              !inst.errorMemoryAccess
          )
      )
        return;
    }
    switch (instruction.classDef) {
      case INSTRUCTION_CLASS.JUMP:
        //console.log("JUMP");
        //If we haven't made a prediction yet for the branch, do so now
        if (instruction.prediction === null) {
          const pred = this.predictBranch(instruction.instPointerOriginal);
          instruction.prediction = pred;
          //If we predict taken, then perform the jump ahead of time
          if (pred) {
            if (instruction.name === INSTRUCTIONS.JMP.name) {
              this.performJump(instruction.inputs[0].value);
            } else {
              this.performJump(instruction.inputs[1].value);
            }
          }
        }

        //Once done with the cycles we can process the branch
        if (instruction.cyclesLeft <= 0 && !instruction.errorBranchPrediction) {
          //first extract the ground truth of whether to jump or not
          const truth = instruction.operation(
            instruction.inputs,
            instruction.id,
            this.readReg.bind(this),
            this.performJump.bind(this)
          );
          instruction.finished = true;

          //Check if there was a prediction error
          if (instruction.prediction !== truth) {
            //Correct the pointer to grab the correct instructions
            if (truth) {
              if (instruction.name === INSTRUCTIONS.JMP.name) {
                this.performJump(instruction.inputs[0].value);
              } else {
                this.performJump(instruction.inputs[1].value);
              }
            } else {
              this.instPointer = instruction.instPointerOriginal;
            }

            //Mark all instructions after this one as incorrectly branched
            for (
              let i = instruction.id + 1;
              i < this.instructionStream.length;
              i++
            ) {
              this.instructionStream[i].errorBranchPrediction = true;
            }
          }

          //Update the predictor for later
          this.updateBranchPredictor(instruction.instPointerOriginal, truth);
        }
        break;
      case INSTRUCTION_CLASS.MATH:
        //Math just requires a check to see when it should be done, then do the math
        if (instruction.cyclesLeft <= 0) {
          instruction.operation(
            instruction.inputs,
            instruction.id,
            this.readReg.bind(this),
            this.writeReg.bind(this)
          );
          instruction.finished = true;
        }
        //console.log("MATH");
        break;
      case INSTRUCTION_CLASS.MEMORY:
        //If we haven't started the request, we need to queue up the memory sim for it
        //console.log("MEMORY");
        if (!instruction.memStarted) {
          instruction.memStarted = true;
          instruction.operation(
            instruction.inputs,
            instruction.id,
            this.readReg.bind(this),
            this.writeReg.bind(this),
            this.queueRead.bind(this),
            this.queueWrite.bind(this),
            this.flush.bind(this),
            this.loadSecret.bind(this)
          );
        }
        break;
      default:
        //handle the other instructions when they finish
        //console.log("OTHER");
        if (instruction.cyclesLeft <= 0) {
          const retVal = instruction.operation(
            instruction.inputs,
            instruction.id,
            this.readReg.bind(this),
            this.writeReg.bind(this),
            this.getCycleNum(),
            this.checkSecret.bind(this),
            this.execProgram.bind(this),
            this.terminate.bind(this),
            this.flush.bind(this)
          );
          instruction.finished = true;
          instruction.terminate = retVal.terminate;
          instruction.checkPass = retVal.checkPass;
        }
        break;
    }
    instruction.cyclesLeft--;
    //console.log("finish handling", this.pid, instruction);
  }

  writeReg(instId, regNum, data) {
    this.tempRegisters[instId].find((temp) => temp.value === regNum).output =
      data;
  }

  readReg(instId, regNum) {
    const instWork = this.instructionStream[instId];
    let depObj = instWork.dependencies.find((dep) => dep.register === regNum);
    if (depObj) {
      return this.tempRegisters[depObj.dependentId].find(
        (temp) => temp.value === regNum
      ).output;
    }
    return this.registers[regNum];
  }

  performJump(jumpLabel) {
    const labelObj = this.labels.find((label) => label.name === jumpLabel);
    const labelIndex = labelObj.index;
    this.instPointer = labelIndex - 1;
  }

  queueRead(instId, addr, regNum) {
    this.memory.loadData(instId, addr, this.pid, regNum);
  }

  queueWrite(instId, addr, data) {
    this.memory.storeData(instId, addr, this.pid, data);
  }

  flush(addr) {
    this.memory.flush(addr, this.pid);
  }

  loadSecret(addr) {
    this.memory.loadSecret(addr, this.pid);
  }

  getCycleNum() {
    return this.getCycleNum();
  }

  terminate(instId) {
    const inst = this.instructionStream[instId];
    if (inst.errorBranchPrediction) return;
    this.memory.terminateProcess(this.pid);
    this.status = false;
  }

  execProgram(prog, instId) {
    const inst = this.instructionStream[instId];
    inst.execProgram = prog;
  }

  checkSecret(secret) {
    return secret === this.secret;
  }

  getInstructionStreamRep() {
    return this.instructionStream;
  }

  getRegisters() {
    return this.registers;
  }
}

export { CoreSim };
