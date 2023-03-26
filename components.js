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
