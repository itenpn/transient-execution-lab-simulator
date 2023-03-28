/* Handles opening up a file  */
function handleFile(input) {
  const file = input.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const file = e.target.result;
    const Prog = new Program(file);
    const cpu = new CpuSim([Prog]);
    //TODO: Do something with the file
    console.log("cpu", cpu);
    for (let i = 0; i < 20; i++) {
      console.log("CYCLE", i);
      cpu.nextCycle();
    }
    document.getElementById("output-text").innerHTML = "";
    document.getElementById("output-text").appendChild(renderCache(cpu));
  };

  reader.onerror = (e) => {
    console.error(e.target.error.name);
  };

  reader.readAsText(file);
}

/* Given an array of the lines of a RRISC file, generates an array where each entry
	corresponds to each element of the command. */
function tokenizeRriscFile(lines) {
  let cmds = [];
  lines.forEach((line) => {
    cmds.push(
      line
        .trim()
        .split(/[ ,]/)
        .filter((a) => a.length > 0)
    );
  });
  return cmds.filter((a) => a.length > 0).filter((a) => a[0][0] !== ";");
}

document.getElementById("file").onchange = handleFile;
