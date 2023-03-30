const BRANCH_STRONG_TAKEN = 3;
const BRANCH_WEAK_TAKEN = 2;
const BRANCH_WEAK_NOTTAKEN = 1;
const BRANCH_STRONG_NOTTAKEN = 0;

class CpuSim {
  constructor(programs) {
    this.num_cores = programs.length;
    this.programList = programs;
    this.secret = Math.floor(Math.random() * 0xff);
    this.memory = new MemorySim(this.num_cores);
    this.cycle = 0;
    this.branchPredictor = new Int8Array(10);

    this.cores = this.programList.map(
      (prog, index) =>
        new CoreSim(
          prog,
          this.memory,
          index,
          this.secret,
          this.getCycleNum.bind(this),
          this.predictBranch.bind(this),
          this.updateBranchPredictor.bind(this)
        )
    );
  }

  predictBranch(instId) {
    const history = this.branchPredictor[instId % 10];
    return history === BRANCH_STRONG_TAKEN || history === BRANCH_WEAK_NOTTAKEN;
  }

  updateBranchPredictor(instId, truth) {
    const history = this.branchPredictor[instId % 10];
    const increment = truth ? 1 : -1;
    if (
      history + increment >= BRANCH_STRONG_NOTTAKEN ||
      history + increment <= BRANCH_STRONG_TAKEN
    ) {
      this.branchPredictor[instId % 10] = history + increment;
    }
  }

  nextCycle() {
    this.memory.nextCycle();
    this.cores.forEach((core) => core.nextCycle());
    this.cycle++;
  }

  getCycleNum() {
    return this.cycle;
  }

  getCacheRep() {
    return this.memory.getCacheRep();
  }

  getSecret() {
    return this.secret;
  }

  execProgram(program) {}
}
