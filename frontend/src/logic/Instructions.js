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
    description: "Assigns Input2 <- Input0 + Input1.",
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
    description: "Assigns Input2 <- Input0 - Input1.",
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
    description: "Assigns Input2 <- Input0 * Input1.",
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
    description: "Assigns Input2 <- Input0 / Input1.",
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
    description: "Assigns Input1 <- Input1 << Input0.",
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
    description: "Assigns Input1 <- Input1 >> Input0.",
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
    description: "Assigns Input2 <- Input0 & Input1.",
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
    description: "Assigns Input2 <- Input0 | Input1.",
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
    description: "Assigns (copies) Input1 <- Input0.",
  },
  FLUSH: {
    name: "flush",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [CONSTANT, REGISTER] }],
    operation: handleFlush,
    description: "Flushes the cache set associated with the address Input0.",
  },
  CYCLETIME: {
    name: "cycletime",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: WRITE, allowed_types: [REGISTER] }],
    operation: handleCycleTime,
    description: "On commit, writes the current cycle number into Input0.",
  },
  NOP: {
    name: "nop",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [REGISTER, CONSTANT] }],
    operation: handleNop,
    description: "Does nothing for Input0 cycles.",
  },
  FAULT: {
    name: "fault",
    cycles: 50,
    class: OTHER,
    inputs: [],
    operation: handleFault,
    description:
      "Induces a fault: no instruction on the same core can commit after this instruction does.",
  },
  CHECKSECRET: {
    name: "checksecret",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [REGISTER] }],
    operation: handleCheck,
    description:
      "Compares the value in Input1 to the CPU's secret. If match, induces win condition, otherwise induces lose condition. All CPU execution is stopped after this instruction.",
  },
  RET: {
    name: "ret",
    cycles: 1,
    class: OTHER,
    inputs: [],
    operation: handleRet,
    description:
      "After comitting, no more instructions on the same core can dispatch without a core reset.",
  },
  EXEC: {
    name: "exec",
    cycles: 1,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [STRING] }],
    operation: handleExec,
    description: "Restarts the core running the program with matching Input0.",
  },
  LABEL: {
    name: "label",
    cycles: 0,
    class: OTHER,
    inputs: [{ dependency: READ, allowed_types: [STRING] }],
    operation: () => {},
    description:
      "Dummy instruction that is 'compiled' out, only used for specifying targets of jumps.",
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
    description: "Loads the value at address Input0 into Input1.",
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
    description: "Stores the value in Input0 at address Input1.",
  },
  LOADSECRET: {
    name: "loadsecret",
    cycles: 1,
    class: MEMORY,
    inputs: [{ dependency: READ, allowed_types: [CONSTANT] }],
    operation: handleLoadSecret,
    description: "Puts the CPU secret into address Input0.",
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
    description:
      "Redirects the program counter to label specified by Input1 if Input0 == 0, otherwise nothing.",
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
    description:
      "Redirects the program counter to label specified by Input1 if Input0 != 0, otherwise nothing.",
  },
  JMP: {
    name: "jmp",
    cycles: 1,
    class: JUMP,
    inputs: [{ dependency: READ, allowed_types: [STRING] }],
    operation: handleJmp,
    description: "Redirects the program counter to label specified by Input0.",
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
