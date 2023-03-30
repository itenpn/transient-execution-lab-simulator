let cpu = null;

/* Handles opening up a file  */
function handleFile(input) {
  const file = input.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const file = e.target.result;
    const Prog = new Program(file);
    cpu = new CpuSim([Prog]);
  };

  reader.onerror = (e) => {
    console.error(e.target.error.name);
  };

  reader.readAsText(file);
}

function handleNextCycle() {
  console.log("cpu", cpu);
  cpu.nextCycle();
  document.getElementById(
    "cycleView"
  ).innerText = `Cycle: ${cpu.getCycleNum()}`;
  document.getElementById("cacheRep").innerHTML = "";
  document.getElementById("cacheRep").appendChild(renderCache(cpu));
  document.getElementById("instRep").innerHTML = "";
  document
    .getElementById("instRep")
    .appendChild(renderInstructionStream(cpu.getInstructionStreamReps()[0]));
  document.getElementById("regRep").innerHTML = "";
  document
    .getElementById("regRep")
    .appendChild(renderRegisters(cpu.getRegisterReps()[0]));
}

document.getElementById("file").onchange = handleFile;
document.getElementById("next-button").onclick = handleNextCycle;
