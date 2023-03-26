/* 
    This file is a series of handlers for each instruction. Divided between memory, branch, math, and other instructions
*/

// import INSTRUCTION_INPUT from "./Instructions";

//MEMORY INSTRUCTIONS
function handleFlush(
  params,
  readReg,
  writeReg,
  queueRead,
  queueWrite,
  flush,
  loadSecret
) {
  const cacheLineParam = params[0];
  let addr = 0;
  if (cacheLineParam.type === INSTRUCTION_INPUT.REGISTER) {
    addr = readReg(cacheLineParam.value);
  } else {
    addr = cacheLineParam.value;
  }
  flush(addr);
}

function handleLoad(
  params,
  readReg,
  writeReg,
  queueRead,
  queueWrite,
  flush,
  loadSecret
) {
  const addrParam = params[0];
  let addr = 0;
  if (addrParam.type === INSTRUCTION_INPUT.REGISTER) {
    addr = readReg(addrParam.value);
  } else {
    addr = addrParam.value;
  }
  const regNum = params[1].value;
  queueRead(addr, regNum);
}

function handleStore(
  params,
  readReg,
  writeReg,
  queueRead,
  queueWrite,
  flush,
  loadSecret
) {
  const addrParam = params[1];
  let addr = 0;
  if (addrParam.type === INSTRUCTION_INPUT.REGISTER) {
    addr = readReg(addrParam.value);
  } else {
    addr = addrParam.value;
  }
  const regNum = params[0].value;
  const data = readReg(regNum);
  queueWrite(addr, data);
}

function handleLoadSecret(
  params,
  readReg,
  writeReg,
  queueRead,
  queueWrite,
  flush,
  loadSecret
) {
  const addr = params[0].value;
  loadSecret(addr);
}

//BRANCH INSTRUCTIONS
function handleJmp(params, readReg, performJump) {
  const label = params[0].value;
  performJump(label);
}

function handleJmpIfZero(params, readReg, performJump) {
  const regNum = params[0].value;
  const label = params[1].value;
  const val = readReg(regNum);
  if (val === 0) performJump(label);
}

function handleJmpIfNotZero(params, readReg, performJump) {
  const regNum = params[0].value;
  const label = params[1].value;
  const val = readReg(regNum);
  if (val !== 0) performJump(label);
}

//MATH INSTRUCTIONS
function handleAdd(params, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(outParamReg, val1 + val2);
}

function handleSub(params, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(outParamReg, val1 - val2);
}

function handleMul(params, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(outParamReg, val1 * val2);
}

function handleDiv(params, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(outParamReg, Math.floor(val1 / val2));
}

function handleAnd(params, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(outParamReg, val1 & val2);
}

function handleOr(params, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(outParamReg, val1 | val2);
}

function handleShiftL(params, readReg, writeReg) {
  const shiftCount = params[0].value;
  const regNum = params[1].value;
  const val = readReg(regNum);
  writeReg(regNum, val << shiftCount);
}

function handleShiftR(params, readReg, writeReg) {
  const shiftCount = params[0].value;
  const regNum = params[1].value;
  const val = readReg(regNum);
  writeReg(regNum, val >> shiftCount);
}

//OTHER INSTRUCTIONS
function handleCycleTime(
  params,
  readReg,
  writeReg,
  cycle,
  secret,
  execProgram
) {
  const regNum = params[0].value;
  writeReg(regNum, cycle);
}

function handleNop(params, readReg, writeReg, cycle, secret, execProgram) {}

function handleCopy(params, readReg, writeReg, cycle, secret, execProgram) {
  const valParam = params[0];
  const regNum = params[1].value;
  let val = 0;
  if (valParam.type === INSTRUCTION_INPUT.REGISTER) {
    val = readReg(valParam.value);
  } else {
    val = valParam.value;
  }
  writeReg(regNum, val);
}

function handleFault(params, readReg, writeReg, cycle, secret, execProgram) {
  //TODO: Figure out how to make fault work
}

function handleCheck(params, readReg, writeReg, cycle, secret, execProgram) {
  const regNum = params[0].value;
  const givenSecret = readReg(regNum);
  secret(givenSecret);
}

function handleRet(params, readReg, writeReg, cycle, secret, execProgram) {
  //TODO: Figure out how to terminate early
}

function handleExec(params, readReg, writeReg, cycle, secret, execProgram) {
  const prog = params[0].value;
  execProgram(prog);
}

// export {
//   handleAdd,
//   handleCheck,
//   handleCopy,
//   handleCycleTime,
//   handleAnd,
//   handleDiv,
//   handleExec,
//   handleFault,
//   handleFlush,
//   handleJmp,
//   handleJmpIfNotZero,
//   handleJmpIfZero,
//   handleLoad,
//   handleLoadSecret,
//   handleMul,
//   handleNop,
//   handleOr,
//   handleRet,
//   handleShiftL,
//   handleShiftR,
//   handleStore,
//   handleSub,
// };
