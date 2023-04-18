import {
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
} from "./Operations";

const INSTRUCTION_CLASS = {
  MEMORY: "MEMORY",
  JUMP: "JUMP",
  MATH: "MATH",
  OTHER: "OTHER",
};
const MEMORY = INSTRUCTION_CLASS.MEMORY;
const JUMP = INSTRUCTION_CLASS.JUMP;
const MATH = INSTRUCTION_CLASS.MATH;
const OTHER = INSTRUCTION_CLASS.OTHER;

const INSTRUCTION_DEPENDENCY = {
  READ: "READ",
  WRITE: "WRITE",
};
const READ = INSTRUCTION_DEPENDENCY.READ;
const WRITE = INSTRUCTION_DEPENDENCY.WRITE;

const INSTRUCTION_INPUT = {
  CONSTANT: "CONSTANT",
  REGISTER: "REGISTER",
  STRING: "STRING",
};
const CONSTANT = INSTRUCTION_INPUT.CONSTANT;
const REGISTER = INSTRUCTION_INPUT.REGISTER;
const STRING = INSTRUCTION_INPUT.STRING;

const INSTRUCTIONS = {
  ADD: {
    name: "add",
    cycles: 1,
    class: MATH,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
    operation: handleAdd,
  },
  SUB: {
    name: "sub",
    cycles: 1,
    class: MATH,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
    operation: handleSub,
  },
  MUL: {
    name: "mul",
    cycles: 5,
    class: MATH,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
    operation: handleMul,
  },
  DIV: {
    name: "div",
    cycles: 5,
    class: MATH,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
    operation: handleDiv,
  },
  SHIFTL: {
    name: "shiftl",
    cycles: 1,
    class: MATH,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
    operation: handleShiftL,
  },
  SHIFTR: {
    name: "shiftr",
    cycles: 1,
    class: MATH,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
    operation: handleShiftR,
  },
  AND: {
    name: "and",
    cycles: 1,
    class: MATH,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
    operation: handleAnd,
  },
  OR: {
    name: "or",
    cycles: 1,
    class: MATH,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
    operation: handleOr,
  },
  COPY: {
    name: "copy",
    cycles: 1,
    class: OTHER,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
    operation: handleCopy,
  },
  FLUSH: {
    name: "flush",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [CONSTANT, REGISTER] }],
    operation: handleFlush,
  },
  CYCLETIME: {
    name: "cycletime",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: WRITE, allowed_types: [REGISTER] }],
    operation: handleCycleTime,
  },
  NOP: {
    name: "nop",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [REGISTER, CONSTANT] }],
    operation: handleNop,
  },
  FAULT: {
    name: "fault",
    cycles: 50,
    class: OTHER,
    inputs: [],
    operation: handleFault,
  },
  CHECKSECRET: {
    name: "checksecret",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [REGISTER] }],
    operation: handleCheck,
  },
  RET: {
    name: "ret",
    cycles: 1,
    class: OTHER,
    inputs: [],
    operation: handleRet,
  },
  EXEC: {
    name: "exec",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [STRING] }],
    operation: handleExec,
  },
  LABEL: {
    name: "label",
    cycles: 0,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [STRING] }],
    operation: () => {},
  },
  LOAD: {
    name: "load",
    cycles: 10,
    class: MEMORY,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
    operation: handleLoad,
  },
  STORE: {
    name: "store",
    cycles: 10,
    class: MEMORY,
    inputs: [
      { dependency: READ, allowed_types: [REGISTER] },
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
    ],
    operation: handleStore,
  },
  LOADSECRET: {
    name: "loadsecret",
    cycles: 1,
    class: MEMORY,
    inputs: [{ dependency: READ, allowed_types: [CONSTANT] }],
    operation: handleLoadSecret,
  },
  JMPIFZERO: {
    name: "jmpifzero",
    cycles: 5,
    class: JUMP,
    inputs: [
      { dependency: READ, allowed_types: [REGISTER] },
      { dependency: READ, allowed_types: [STRING] },
    ],
    operation: handleJmpIfZero,
  },
  JMPIFNOTZERO: {
    name: "jmpifnotzero",
    cycles: 5,
    class: JUMP,
    inputs: [
      { dependency: READ, allowed_types: [REGISTER] },
      { dependency: READ, allowed_types: [STRING] },
    ],
    operation: handleJmpIfNotZero,
  },
  JMP: {
    name: "jmp",
    cycles: 1,
    class: JUMP,
    inputs: [{ dependency: READ, allowed_types: [STRING] }],
    operation: handleJmp,
  },
};

function instructionToString(instruction) {
  const name = instruction.name;
  const inputs = instruction.inputs;
  let stringInputs = inputs.map((input) => {
    if (input.type === INSTRUCTION_INPUT.REGISTER) {
      return `R${input.value}`;
    }
    if (input.type === INSTRUCTION_INPUT.CONSTANT) {
      return `0x${input.value.toString(16)}`;
    }
    return input.value;
  });
  return `${name} ${stringInputs.join(", ")}`;
}

export {
  INSTRUCTION_CLASS,
  INSTRUCTION_DEPENDENCY,
  INSTRUCTION_INPUT,
  INSTRUCTIONS,
  instructionToString,
};
