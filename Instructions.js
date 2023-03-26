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
  },
  SHIFTL: {
    name: "shiftl",
    cycles: 1,
    class: MATH,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
  },
  SHIFTR: {
    name: "shiftr",
    cycles: 1,
    class: MATH,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
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
  },
  COPY: {
    name: "copy",
    cycles: 1,
    class: OTHER,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
  },
  FLUSH: {
    name: "flush",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [CONSTANT, REGISTER] }],
  },
  CYCLETIME: {
    name: "cycletime",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: WRITE, allowed_types: [REGISTER] }],
  },
  NOP: {
    name: "nop",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [REGISTER, CONSTANT] }],
  },
  FAULT: {
    name: "fault",
    cycles: 50,
    class: OTHER,
    inputs: [],
  },
  CHECKSECRET: {
    name: "checksecret",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [REGISTER] }],
  },
  RET: {
    name: "ret",
    cycles: 1,
    class: OTHER,
    inputs: [],
  },
  EXEC: {
    name: "exec",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [STRING] }],
  },
  LABEL: {
    name: "label",
    cycles: 0,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [STRING] }],
  },
  LOAD: {
    name: "load",
    cycles: 10,
    class: MEMORY,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: WRITE, allowed_types: [REGISTER] },
    ],
  },
  STORE: {
    name: "store",
    cycles: 10,
    class: MEMORY,
    inputs: [
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
      { dependency: READ, allowed_types: [CONSTANT, REGISTER] },
    ],
  },
  LOADSECRET: {
    name: "loadsecret",
    cycles: 1,
    class: MEMORY,
    inputs: [{ dependency: READ, allowed_types: [CONSTANT] }],
  },
  JMPIFZERO: {
    name: "jmpifzero",
    cycles: 5,
    class: JUMP,
    inputs: [
      { dependency: READ, allowed_types: [REGISTER] },
      { dependency: READ, allowed_types: [STRING] },
    ],
  },
  JMPIFNOTZERO: {
    name: "jmpifnotzero",
    cycles: 5,
    class: JUMP,
    inputs: [
      { dependency: READ, allowed_types: [REGISTER] },
      { dependency: READ, allowed_types: [STRING] },
    ],
  },
  JMP: {
    name: "jmp",
    cycles: 1,
    class: JUMP,
    inputs: [{ dependency: READ, allowed_types: [STRING] }],
  },
};

// export {
//   INSTRUCTION_CLASS,
//   INSTRUCTION_DEPENDENCY,
//   INSTRUCTION_INPUT,
//   INSTRUCTIONS,
// };
