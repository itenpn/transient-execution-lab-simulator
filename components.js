function renderCache(cpu) {
  const cache = cpu.getCacheRep();
  const baseTable = document.createElement("table");
  let row = document.createElement("tr");
  for (let i = 0; i < cache.length; i++) {
    if (i % 16 === 0) {
      if (i !== 0) baseTable.appendChild(row);
      row = document.createElement("tr");
    }
    let data = document.createElement("td");
    data.textContent = cache[i].toString(16);
    data.style = "border: 1px solid black;";
    row.appendChild(data);
  }
  return baseTable;
}

function convertInstructionToString(instruction) {
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

function renderInstructionStream(instructionStream) {
  const baseTable = document.createElement("table");
  baseTable.className = "tableSection";
  const header = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headerData = document.createElement("th");
  headerData.innerText = "Instruction";
  headerRow.appendChild(headerData);
  header.appendChild(headerRow);
  baseTable.appendChild(header);
  const tableBody = document.createElement("tbody");
  let row = document.createElement("tr");
  for (let i = 0; i < instructionStream.length; i++) {
    let data = document.createElement("td");
    let inst = instructionStream[i];
    data.textContent = convertInstructionToString(inst);
    if (inst.committed) {
      data.style = "background-color: grey";
    }
    if (inst.errorBranchPrediction) {
      data.style = "background-color: red";
    }
    row.appendChild(data);
    tableBody.appendChild(row);
    row = document.createElement("tr");
  }
  baseTable.appendChild(tableBody);
  return baseTable;
}

function renderRegisters(registers) {
  const baseTable = document.createElement("table");
  const header = document.createElement("thead");
  const headerRow = document.createElement("tr");
  const headerData = document.createElement("th");
  headerData.innerText = "Registers";
  headerRow.appendChild(headerData);
  header.appendChild(headerRow);
  baseTable.appendChild(header);
  let row = document.createElement("tr");
  for (let i = 0; i < 32; i++) {
    if (i % 2 === 0) {
      row = document.createElement("tr");
    }
    let data = document.createElement("td");
    data.textContent = `${registers[i].toString()}`;
    let regName = document.createElement("td");
    regName.innerHTML = `<b>R${i}</b>`;
    row.append(regName);
    row.appendChild(data);
    baseTable.appendChild(row);
  }
  return baseTable;
}
