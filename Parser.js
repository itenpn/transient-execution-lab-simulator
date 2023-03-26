const MIN_REG_NUM = 0;
const MAX_REG_NUM = 31;

const tokenizeLine = (line) => {
  return line
    .trim()
    .split(/[ ,]+/)
    .filter((a) => a.length > 0);
};

const tokenizeLines = (lines) => {
  const commands = lines
    .map((line) => tokenizeLine(line))
    .filter((tokenArray) => tokenArray.length > 0);
  return commands;
};

const nameToInstruction = Object.fromEntries(
  Object.entries(INSTRUCTIONS).map((entry) => [
    entry[1].name,
    INSTRUCTIONS[entry[0]],
  ])
);

const parseInputToken = (token) => {
  const numericalValue = parseInt(token);
  if (!Number.isNaN(numericalValue)) {
    return { type: INSTRUCTION_INPUT.CONSTANT, value: numericalValue };
  }
  if (token.match(/[Rr]\d+/)) {
    const regNumText = token.slice(1);
    const regNum = parseInt(regNumText);
    if (Number.isNaN(regNum) || regNum < MIN_REG_NUM || regNum > MAX_REG_NUM)
      throw new Error(`${regNumText} is not a valid register.`);
    return { type: INSTRUCTION_INPUT.REGISTER, value: regNum };
  }
  return { type: INSTRUCTION_INPUT.STRING, value: token };
};

const instructionFromTokens = (tokens) => {
  const name = tokens[0];
  const instructionDefinition = nameToInstruction[name];
  if (!instructionDefinition)
    throw new Error(`Cannot find instruction with name ${name}.`);

  const inputTokens = tokens.slice(1);
  if (inputTokens.length !== instructionDefinition.inputs.length)
    throw new Error(
      `Expected ${instructionDefinition.inputs.length} inputs for instruction ${name}, found ${inputTokens.length}.`
    );

  const zipped = inputTokens.map((e, i) => [
    e,
    instructionDefinition.inputs[i],
  ]);
  const inputs = zipped.map(([inputToken, inputDefinition], index) => {
    const { type, value } = parseInputToken(inputToken);
    if (!inputDefinition.allowed_types.includes(type)) {
      const paramNum = index + 1;
      const allowedTypesString = inputDefinition.allowed_types.join(", ");
      throw new Error(
        `Instruction '${instructionDefinition.name}' parameter ${paramNum} allows types [${allowedTypesString}], found ${type}.`
      );
    }
    return { type, value };
  });
  return { name, inputs };
};

const findNextNonlabelInstruction = (instructions, labelIndex) => {
  for (let i = labelIndex + 1; i < instructions.length; i++) {
    if (instructions[i].name !== INSTRUCTIONS.LABEL.name) {
      return instructions[i];
    }
  }
  // If there were no instructions after the label, loop back to the top
  return instructions[0];
};

const extractLabels = (instructions) => {
  const withRandomIds = instructions.map((inst) => {
    return { ...inst, id: Math.random() };
  });
  const noLabels = withRandomIds.filter(
    (inst) => inst.name !== INSTRUCTIONS.LABEL.name
  );
  const onlyLabels = withRandomIds.filter(
    (inst) => inst.name === INSTRUCTIONS.LABEL.name
  );
  const labels = onlyLabels.map((labelInst) => {
    const name = labelInst.inputs[0].value.replace(":", "");
    const labelIndex = withRandomIds.findIndex(
      (inst) => inst.id === labelInst.id
    );
    const nextNonLabelInstruction = findNextNonlabelInstruction(
      withRandomIds,
      labelIndex
    );
    const index = noLabels.findIndex(
      (inst) => inst.id === nextNonLabelInstruction.id
    );
    return { name, index };
  });
  return labels;
};

class Program {
  constructor(file) {
    const lines = file.split(/\r\n|\n/);
    const linesTokens = tokenizeLines(lines);

    const determineName = () => {
      const firstLineTokens = linesTokens[0];
      if (firstLineTokens.length !== 1 || firstLineTokens[0][0] !== ";")
        throw new Error("First line of program should be `;{program_name}`");
      return firstLineTokens[0].slice(1);
    };
    const name = determineName();

    const instructionsTokens = linesTokens.slice(1);
    const allInstructions = instructionsTokens.map(instructionFromTokens);

    const labels = extractLabels(allInstructions);
    const nonLabelInstructions = allInstructions.filter(
      (inst) => inst.name !== INSTRUCTIONS.LABEL.name
    );

    this.name = name;
    this.instructions = nonLabelInstructions;
    this.labels = labels;
  }
}

// export { Program };
