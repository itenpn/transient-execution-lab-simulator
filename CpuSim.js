class CpuSim {
  constructor(programs) {
    this.num_cores = programs.length;
    this.programList = programs;
    this.secret = Math.floor(Math.random() * 0xff);
    this.memory = new MemorySim(this.num_cores);
    this.cycle = 0;

    this.cores = this.programList.map(
      (prog, index) =>
        new CoreSim(
          prog.instructions,
          prog.labels,
          this.memory,
          index,
          this.secret
        )
    );
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

  getSecret() {
    return this.secret;
  }

  execProgram(program) {}
}
