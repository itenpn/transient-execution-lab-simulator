const MAIN_MEMORY_SIZE = 1024;
const CACHE_SIZE = 256;
const PROCESS_MEM_START = 0x1000;

class MemorySim {
  constructor(num_cores, secret) {
    this.cache_rep = new Uint8Array(CACHE_SIZE); //The cache used between processes
    this.mem_rep = new Uint8Array(MAIN_MEMORY_SIZE * num_cores); //The main memory representation
    this.cache_ownership = new Int32Array(CACHE_SIZE); //Represents what addr is in this cache block
    this.mem_queue = new Array(); //Represents the current memory queue
    this.num_processes = num_cores;
    this.secret = secret;
    for (let i = 0; i < CACHE_SIZE; i++) {
      this.cache_rep[i] = Math.floor(Math.random() * 0xff);
    }
  }

  #convertAddrToIndex(addr) {
    if (
      addr < PROCESS_MEM_START ||
      addr > this.num_processes * PROCESS_MEM_START + MAIN_MEMORY_SIZE
    ) {
      return -1; //This address is outside of any region we represent
    }
    let startAddr = 0;
    let endAddr = 0;
    for (let i = this.num_processes; i > 0; i--) {
      startAddr = i * PROCESS_MEM_START;
      endAddr = startAddr + MAIN_MEMORY_SIZE;
      if (addr >= startAddr && addr < endAddr) {
        return (addr - startAddr) * (i - 1);
      }
    }
    return -1; //This address is between some region where we don't represent
  }

  nextCycle() {
    let completedActions = [];
    this.mem_queue.forEach((actionItem) => {
      actionItem.cycleWait = actionItem.cycleWait - 1;
      if (actionItem.cycleWait === 0) {
        actionItem.completed = true;
        if (actionItem.type === "load") {
          if (actionItem.outsideBounds) {
            //Case where data is outside the representation, Core should crash if committing this
            actionItem.returnData = Math.floor(Math.random() * 0xff);
          } else {
            //Case where you grabbed a valid address in the representation
            if (actionItem.inCache) {
              //If in the cache, just grab it, no further action needed
              actionItem.returnData = actionItem.cacheValue;
            } else {
              //not in the cache, so grab from main mem then update cache
              actionItem.returnData = this.mem_rep[actionItem.memIndex];
              if (!actionItem.permFailure) {
                this.cache_rep[actionItem.cacheIndex] =
                  this.mem_rep[actionItem.memIndex];
                this.cache_ownership[actionItem.cacheIndex] = actionItem.addr;
              }
            }
          }
        }
        if (actionItem.type === "store") {
          //if outside bounds, we do nothing here, Core should crash upon commit
          if (!actionItem.outsideBounds) {
            if (
              this.cache_ownership[actionItem.cacheIndex] === actionItem.addr
            ) {
              this.cache_rep[actionItem.cacheIndex] = actionItem.data;
              if (!actionItem.permFailure)
                this.mem_rep[actionItem.memIndex] = actionItem.data;
            } else {
              if (!actionItem.permFailure) {
                this.mem_rep[actionItem.memIndex] = actionItem.data;
                this.cache_ownership[actionItem.cacheIndex] = actionItem.addr;
                this.cache_rep[actionItem.cacheIndex] = actionItem.data;
              }
            }
          }
        }
        completedActions.push(actionItem);
      }
    });
    this.mem_queue = this.mem_queue.filter((a) => !a.completed);
    return completedActions;
  }

  terminateProcess(pid) {
    const startAddr = (pid + 1) * PROCESS_MEM_START;
    const endAddr = startAddr + MAIN_MEMORY_SIZE;
    for (let i = startAddr; i < endAddr; i++) {
      this.mem_rep[this.#convertAddrToIndex[i]] = 0;
      if (this.cache_ownership[i % 256] === i)
        this.cache_ownership[i % 256] = 0;
    }
  }

  getCacheRep() {
    return this.cache_rep;
  }

  loadData(addr, pid, dest) {
    const convertedAddr = this.#convertAddrToIndex(addr);
    const permFailure =
      convertedAddr === -1 ||
      addr >= (pid + 1) * PROCESS_MEM_START + MAIN_MEMORY_SIZE ||
      addr < (pid + 1) * PROCESS_MEM_START;
    const cacheAddr = addr % CACHE_SIZE;
    const inCache = this.cache_ownership[cacheAddr] === addr;
    const cycleWait = inCache ? 1 : 10;
    this.mem_queue.push({
      flavortext: `load ${addr.toString(16)} into R${dest}`,
      type: "load",
      destReg: dest,
      pid: pid,
      addr: addr,
      memIndex: convertedAddr,
      cacheIndex: cacheAddr,
      permFailure: permFailure,
      inCache: inCache,
      cacheValue: this.cache_rep[cacheAddr],
      cycleWait: cycleWait,
      outsideBounds: convertedAddr === -1,
      completed: false,
    });
    return permFailure;
  }

  storeData(addr, pid, data) {
    const convertedAddr = this.#convertAddrToIndex(addr);
    const permFailure =
      convertedAddr === -1 ||
      addr >= (pid + 1) * PROCESS_MEM_START + MAIN_MEMORY_SIZE ||
      addr < (pid + 1) * PROCESS_MEM_START;
    const cacheAddr = addr % CACHE_SIZE;
    const inCache = this.cache_ownership[cacheAddr] === addr;
    const cycleWait = inCache ? 1 : 10;
    this.mem_queue.push({
      flavortext: `store ${data.toString(16)} into ${addr.toString(16)}`,
      type: "store",
      data: data,
      pid: pid,
      addr: addr,
      memIndex: convertedAddr,
      cacheIndex: cacheAddr,
      permFailure: permFailure,
      inCache: inCache,
      cycleWait: cycleWait,
      outsideBounds: convertedAddr === -1,
      completed: false,
    });
    return permFailure;
  }

  flush(addr, pid) {
    const convertedAddr = this.#convertAddrToIndex(addr);
    const permFailure =
      convertedAddr === -1 ||
      addr >= (pid + 1) * PROCESS_MEM_START + MAIN_MEMORY_SIZE ||
      addr < (pid + 1) * PROCESS_MEM_START;
    const cacheAddr = addr % CACHE_SIZE;
    if (!permFailure) {
      this.cache_ownership[cacheAddr] = 0;
      this.cache_rep[cacheAddr] = 0;
    }
    return permFailure;
  }

  loadSecret(addr, pid) {
    const permFailure = pid !== 0;
    if (!permFailure) {
      this.mem_rep[addr] = this.secret;
      this.cache_rep[addr % 256] = this.secret;
      this.cache_ownership[addr % 256] = addr;
    }
    return permFailure;
  }
}
