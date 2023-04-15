/* 
    This file is a series of handlers for each instruction. Divided between memory, branch, math, and other instructions
*/

import { INSTRUCTION_INPUT } from "./Instructions";

//MEMORY INSTRUCTIONS
function handleFlush(params, instId, readReg, writeReg, queueRead, queueWrite, flush, loadSecret) {
  const cacheLineParam = params[0];
  let addr = 0;
  if (cacheLineParam.type === INSTRUCTION_INPUT.REGISTER) {
    addr = readReg(instId, cacheLineParam.value);
  } else {
    addr = cacheLineParam.value;
  }
  flush(addr);
}

function handleLoad(params, instId, readReg, writeReg, queueRead, queueWrite, flush, loadSecret) {
  const addrParam = params[0];
  let addr = 0;
  if (addrParam.type === INSTRUCTION_INPUT.REGISTER) {
    addr = readReg(instId, addrParam.value);
  } else {
    addr = addrParam.value;
  }
  const regNum = params[1].value;
  queueRead(instId, addr, regNum);
}

function handleStore(params, instId, readReg, writeReg, queueRead, queueWrite, flush, loadSecret) {
  const addrParam = params[1];
  let addr = 0;
  if (addrParam.type === INSTRUCTION_INPUT.REGISTER) {
    addr = readReg(instId, addrParam.value);
  } else {
    addr = addrParam.value;
  }
  const regNum = params[0].value;
  const data = readReg(instId, regNum);
  queueWrite(instId, addr, data);
}

function handleLoadSecret(
  params,
  instId,
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
function handleJmp(params, instId, readReg, performJump) {
  const label = params[0].value;
  return true;
}

function handleJmpIfZero(params, instId, readReg, performJump) {
  const regNum = params[0].value;
  const label = params[1].value;
  const val = readReg(instId, regNum);
  if (val === 0) {
    return true;
  }
  return false;
}

function handleJmpIfNotZero(params, instId, readReg, performJump) {
  const regNum = params[0].value;
  const label = params[1].value;
  const val = readReg(instId, regNum);
  if (val !== 0) {
    return true;
  }
  return false;
}

//MATH INSTRUCTIONS
function handleAdd(params, instId, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(instId, valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(instId, valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(instId, outParamReg, val1 + val2);
}

function handleSub(params, instId, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(instId, valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(instId, valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(instId, outParamReg, val1 - val2);
}

function handleMul(params, instId, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(instId, valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(instId, valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(instId, outParamReg, val1 * val2);
}

function handleDiv(params, instId, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(instId, valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(instId, valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(instId, outParamReg, Math.floor(val1 / val2));
}

function handleAnd(params, instId, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(instId, valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(instId, valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(instId, outParamReg, val1 & val2);
}

function handleOr(params, instId, readReg, writeReg) {
  const valParam1 = params[0];
  let val1 = 0;
  if (valParam1.type === INSTRUCTION_INPUT.REGISTER) {
    val1 = readReg(instId, valParam1.value);
  } else {
    val1 = valParam1.value;
  }
  const valParam2 = params[1];
  let val2 = 0;
  if (valParam2.type === INSTRUCTION_INPUT.REGISTER) {
    val2 = readReg(instId, valParam2.value);
  } else {
    val2 = valParam2.value;
  }
  const outParamReg = params[2].value;
  writeReg(instId, outParamReg, val1 | val2);
}

function handleShiftL(params, instId, readReg, writeReg) {
  const shiftCount = params[0].value;
  const regNum = params[1].value;
  const val = readReg(instId, regNum);
  writeReg(instId, regNum, val << shiftCount);
}

function handleShiftR(params, instId, readReg, writeReg) {
  const shiftCount = params[0].value;
  const regNum = params[1].value;
  const val = readReg(instId, regNum);
  writeReg(instId, regNum, val >> shiftCount);
}

//OTHER INSTRUCTIONS
function handleCycleTime(params, instId, readReg, writeReg, cycle, secret, execProgram, terminate) {
  const regNum = params[0].value;
  writeReg(instId, regNum, cycle);
  return { terminate: false, checkPass: false };
}

function handleNop(params, instId, readReg, writeReg, cycle, secret, execProgram, terminate) {
  return { terminate: false, checkPass: false };
}

function handleCopy(params, instId, readReg, writeReg, cycle, secret, execProgram, terminate) {
  const valParam = params[0];
  const regNum = params[1].value;
  let val = 0;
  if (valParam.type === INSTRUCTION_INPUT.REGISTER) {
    val = readReg(instId, valParam.value);
  } else {
    val = valParam.value;
  }
  writeReg(instId, regNum, val);
}

function handleFault(params, instId, readReg, writeReg, cycle, secret, execProgram, terminate) {
  return { terminate: true, checkPass: false };
}

function handleCheck(params, instId, readReg, writeReg, cycle, secret, execProgram, terminate) {
  const regNum = params[0].value;
  const givenSecret = readReg(instId, regNum);
  const valid = secret(givenSecret);
  return { terminate: true, checkPass: valid };
}

function handleRet(params, instId, readReg, writeReg, cycle, secret, execProgram, terminate) {
  return { terminate: true, checkPass: false };
}

function handleExec(params, instId, readReg, writeReg, cycle, secret, execProgram, terminate) {
  const prog = params[0].value;
  execProgram(prog, instId);
  return { terminate: false, checkPass: false };
}

export {
  handleAdd,
  handleCheck,
  handleCopy,
  handleCycleTime,
  handleAnd,
  handleDiv,
  handleExec,
  handleFault,
  handleFlush,
  handleJmp,
  handleJmpIfNotZero,
  handleJmpIfZero,
  handleLoad,
  handleLoadSecret,
  handleMul,
  handleNop,
  handleOr,
  handleRet,
  handleShiftL,
  handleShiftR,
  handleStore,
  handleSub,
};
