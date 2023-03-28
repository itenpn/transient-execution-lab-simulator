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
  }

  nextCycle() {
    if (!this.status) return;
    const inst = this.programStream[this.instPointer];
    //TODO: confirm the inst name and execute the instruction
    this.instPointer++;
  }

  writeReg(regNum, data) {
    this.registers[regNum] = data;
  }

  readReg(regNum) {
    return this.registers[regNum];
  }

  performJump(jumpLabel) {
    const labelObj = this.labels.find((label) => label.name === jumpLabel);
    const labelIndex = labelObj.index;
    this.instPointer = labelIndex;
  }

  queueRead(addr, regNum) {
    this.memory.loadData(addr, this.pid, regNum);
  }

  queueWrite(addr, data) {
    this.memory.storeData(addr, this.pid, data);
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
}
