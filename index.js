import CoreSim from "./CoreSim";

/* Handles opening up a file  */
function handleFile(input) {
  const file = input.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const file = e.target.result;
    const lines = file.split(/\r\n|\n/);
    //TODO: Do something with the file
    console.log(tokenizeRriscFile(lines));
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
