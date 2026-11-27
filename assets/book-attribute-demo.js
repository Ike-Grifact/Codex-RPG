/* Exemplos didáticos isolados. Não leem nem gravam fichas. */
(() => {
  "use strict";
  const get = id => document.getElementById(id);
  const calc = get("apt-demo-capacidades");
  if (calc) {
    const inputs = ["agi","des","vig"].map(id => get("apt-demo-"+id));
    const update = () => {
      const [agi,des,vig] = inputs.map(input => Number(input.value));
      inputs.forEach(input => { calc.querySelector('output[for="'+input.id+'"]').textContent = input.value; });
      get("apt-demo-de").textContent = String(Math.min(8,2+Math.floor((agi+vig)/2)));
      get("apt-demo-mov").textContent = String(8+Math.floor((agi+des)/2));
    };
    inputs.forEach(input => input.addEventListener("input",update));
    update(); calc.hidden = false;
  }
  const health = get("apt-demo-saude");
  if (health) {
    const input = get("apt-demo-vida");
    const section = get("vida-saude");
    const tables = Array.from(document.querySelectorAll("table.health-demo-table"));
    const table = tables.find(t => t.querySelector("thead th")?.textContent.trim()==="Vida atual");
    const rows = table ? Array.from(table.querySelectorAll("tbody tr")) : [];
    if (rows.length !== 7 || !section) return;
    const update = () => {
      const value = Number(input.value);
      health.querySelector('output[for="apt-demo-vida"]').textContent = input.value;
      rows.forEach(row => {
        const active = row.cells[0].textContent.trim() === value+"/6";
        row.classList.toggle("apt-demo-health-selected",active && health.open);
        if (active) get("apt-demo-estado").textContent = value+"/6 · "+row.cells[2].textContent.trim()+" — "+row.cells[3].textContent.trim();
      });
    };
    input.addEventListener("input",update);
    health.addEventListener("toggle",update);
    update(); health.hidden = false;
  }
})();
