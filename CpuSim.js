import MemorySim from "./MemorySim";
import CoreSim from "./CoreSim";

export default class CpuSim {
  constructor(programs) {
    this.num_cores = programs.length;
    this.programList = programs;
    this.memory = new MemorySim(this.num_cores);
    this.cycle = 0;
  }

  nextCycle() {
    this.cycle++;
  }

  getCycleNum() {
    return this.cycle;
  }

  getCacheRep() {
    return this.memory.getCacheRep();
  }

  execProgram(program) {}
}
