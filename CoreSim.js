class CoreSim {
  constructor(programStream, labels, memorySim, pid, secret) {
    this.programStream = programStream;
    this.labels = labels;
    this.instructionStream = new Array();
    this.registers = new Int32Array(32);
    this.commitPointer = 0;
    this.instPointer = 0;
    this.memory = memorySim;
    this.status = "running";
    this.pid = pid;
    this.secret = secret;
  }

  nextCycle() {
    if (this.status !== "running") return;
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
}
