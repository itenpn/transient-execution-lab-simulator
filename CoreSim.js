class CoreSim {
  constructor(program, memorySim, pid, secret, getCycleNum) {
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
  }

  nextCycle() {
    const memActions = this.memory.getCurrCycleActions(this.pid);
    if (this.status) this.findAndAddInstruction();
    this.handleInstructions(memActions);
    this.instPointer++;
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
    };

    //Step 2: determine if the instruction has a dependency
    let dependentInsts = [];
    for (let i = this.instructionStream.length - 1; i >= 0; i--) {
      let instCheck = this.instructionStream[i];
      if (!instCheck.committed) {
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
    console.log("NEW INST OBJ", instObj);
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
        console.log("FINISHED", actionInst);
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
    if (instruction.dependencies.length > 0) {
      if (
        instruction.dependencies.filter((dep) => {
          const depInst = this.instructionStream[dep.dependentId];
          return !depInst.finished;
        }).length > 0
      )
        return;
    }

    instruction.cyclesLeft--;
    switch (instruction.classDef) {
      case INSTRUCTION_CLASS.JUMP:
        break;
      case INSTRUCTION_CLASS.MATH:
        if (instruction.cyclesLeft <= 0) {
          instruction.operation(
            instruction.inputs,
            instruction.id,
            this.readReg.bind(this),
            this.writeReg.bind(this)
          );
          instruction.finished = true;
        }
        break;
      case INSTRUCTION_CLASS.MEMORY:
        if (!instruction.memStarted) {
          console.log("STARTED MEMORY", instruction);
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
        if (instruction.cyclesLeft <= 0) {
          console.log("FINISHED", instruction);
          instruction.operation(
            instruction.inputs,
            instruction.id,
            this.readReg.bind(this),
            this.writeReg.bind(this),
            this.getCycleNum(),
            this.checkSecret.bind(this),
            this.execProgram.bind(this),
            this.terminate.bind(this)
          );
          instruction.finished = true;
        }
        break;
    }
  }

  writeReg(instId, regNum, data) {
    console.log(`inst ${instId} writes ${data} to R${regNum}`);
    this.tempRegisters[instId].find((temp) => temp.value === regNum).output =
      data;
  }

  readReg(instId, regNum) {
    console.log(`inst ${instId} reads R${regNum}`);
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
    this.instPointer = labelIndex;
  }

  queueRead(instId, addr, regNum) {
    console.log(`inst ${instId} requests read to 0x${addr.toString(16)}`);
    this.memory.loadData(instId, addr, this.pid, regNum);
  }

  queueWrite(instId, addr, data) {
    console.log(
      `inst ${instId} requests write of ${data} to 0x${addr.toString(16)}`
    );
    this.memory.storeData(instId, addr, this.pid, data);
  }

  flush(addr) {
    this.memory.flush(addr, this.pid);
  }

  loadSecret(addr) {
    this.memoruy.loadSecret(addr, this.pid);
  }

  getCycleNum() {
    return this.getCycleNum();
  }

  terminate() {
    this.memory.terminateProcess(this.pid);
    this.status = false;
  }

  execProgram(prog) {}

  checkSecret(secret) {}
}
