let cpu = null;

/* Handles opening up a file  */
function handleFile(input) {
  const file = input.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const file = e.target.result;
    const Prog = new Program(file, []);
    cpu = new CpuSim([Prog]);
  };

  reader.onerror = (e) => {
    console.error(e.target.error.name);
  };

  reader.readAsText(file);
}

function handleNextCycle() {
  console.log(cpu.getCycleNum());
  const didCommit = cpu.nextCycle()[0];
  document.getElementById("cycleView").innerText = `Cycle: ${cpu.getCycleNum()}`;
  document.getElementById("secretView").innerText = `Secret: 0x${cpu.secret.toString(16)}`;
  document.getElementById("cacheRep").innerHTML = "";
  document.getElementById("cacheRep").appendChild(renderCache(cpu));
  document.getElementById("instRep").innerHTML = "";
  document
    .getElementById("instRep")
    .appendChild(renderInstructionStream(cpu.getInstructionStreamReps()[0]));
  document.getElementById("regRep").innerHTML = "";
  document.getElementById("regRep").appendChild(renderRegisters(cpu.getRegisterReps()[0]));
  return didCommit;
}

function handleGoToNextCommit() {
  while (cpu.getRunningStatus()[0] && !handleNextCycle());
}

document.getElementById("file").onchange = handleFile;
document.getElementById("next-button").onclick = handleNextCycle;
document.getElementById("commit-button").onclick = handleGoToNextCommit;
