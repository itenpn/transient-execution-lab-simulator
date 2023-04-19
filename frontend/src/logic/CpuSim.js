import { MemorySim } from "./MemorySim";
import { CoreSim } from "./CoreSim";

const BRANCH_STRONG_TAKEN = 3;
const BRANCH_WEAK_TAKEN = 2;
const BRANCH_WEAK_NOTTAKEN = 1;
const BRANCH_STRONG_NOTTAKEN = 0;

class CpuSim {
  constructor(programs) {
    this.num_cores = programs.length;
    this.programList = programs;
    this.secret = Math.floor(Math.random() * 0xff);
    this.memory = new MemorySim(this.num_cores, this.secret);
    this.cycle = 0;
    this.branchPredictor = new Int8Array(10);
    this.lockCheckSecret = false;
    this.guessSecretCorrect = false;

    this.cores = this.programList.map(
      (prog, index) =>
        new CoreSim(
          prog,
          this.memory,
          index,
          this.secret,
          this.getCycleNum.bind(this),
          this.predictBranch.bind(this),
          this.updateBranchPredictor.bind(this),
          this.execProgram.bind(this),
          this.handleSecretCheck.bind(this)
        )
    );
  }

  handleSecretCheck(result) {
    this.lockCheckSecret = true;
    this.guessSecretCorrect = result;
    this.cores.forEach((core) => (core.status = false));
  }

  getRunningStatus() {
    return this.cores.map((core) => core.status);
  }

  getInstructionStreamReps() {
    return this.cores.map((core) => core.getInstructionStreamRep());
  }

  getRegisterReps() {
    return this.cores.map((core) => core.getRegisters());
  }

  predictBranch(instId) {
    const history = this.branchPredictor[instId % 10];
    return history === BRANCH_STRONG_TAKEN || history === BRANCH_WEAK_TAKEN;
  }

  updateBranchPredictor(instId, truth) {
    if (this.lockCheckSecret) return;
    const history = this.branchPredictor[instId % 10];
    const increment = truth ? 1 : -1;
    if (
      history + increment >= BRANCH_STRONG_NOTTAKEN &&
      history + increment <= BRANCH_STRONG_TAKEN
    ) {
      this.branchPredictor[instId % 10] = history + increment;
    }
  }

  nextCycle() {
    if (this.lockCheckSecret) return false;
    this.memory.nextCycle();
    const commits = this.cores.map((core) => core.nextCycle());
    this.cycle++;
    return commits;
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

  execProgram(programName) {
    if (this.lockCheckSecret) return;
    const core = this.cores.find((core) => core.program.name === programName);
    core.restartCore();
  }
}

export { CpuSim };
