const {chromium}=require("playwright");
const assert=(condition,message)=>{if(!condition)throw new Error(message)};
async function validate(page,label){
 const report=await page.locator("#gene-builder-map").evaluate(root=>{
  const issues=[],nodes=[...root.querySelectorAll(".fp-gene-skill")];
  const suffixes=[" XP suficiente, requisitos pendentes"," ramificação futura"," adquirida"," disponível"];
  const rows=[];
  for(const node of nodes){
   const text=node.querySelector(".fp-gene-node-label");
   const spans=[...text.querySelectorAll("tspan")];
   const aria=node.getAttribute("aria-label")||"";
   const suffix=suffixes.find(s=>aria.endsWith(s));
   const full=suffix?aria.slice(0,-suffix.length):aria;
   const displayed=spans.map(t=>t.textContent).join(" ");
   if(full!==displayed)issues.push(full+" está abreviado como "+displayed);
   if(!spans.length||spans.length>3)issues.push(full+" ocupa "+spans.length+" linhas");
   const rect=text.getBBox();
   if(rect.width>210.5)issues.push(full+" excede largura do nó: "+rect.width);
   const circle=node.querySelector("circle"),cx=Number(circle.getAttribute("cx")),cy=Number(circle.getAttribute("cy"));
   rows.push({full,cx,cy,lowest:rect.y+rect.height});
  }
  // Os nós alinhados na mesma coluna devem deixar espaço livre para a próxima bolinha.
  for(const n of rows){
   const next=rows.filter(v=>v.cy>n.cy&&Math.abs(v.cx-n.cx)<115).sort((a,b)=>a.cy-b.cy)[0];
   if(next&&n.lowest>next.cy-17)issues.push(n.full+" invade a bolinha seguinte: "+next.full);
  }
  return {checked:nodes.length,issues};
 });
 assert(report.checked>=10,label+": poucas Perícias renderizadas ("+report.checked+")");
 assert(!report.issues.length,label+": "+report.issues.join(" | "));
 return report;
}
(async()=>{
 const browser=await chromium.launch({headless:true});
 try {
  for(const [name,width,height] of [["desktop",1366,900],["celular",390,844]]){
   const ctx=await browser.newContext({viewport:{width,height},isMobile:name==="celular",hasTouch:name==="celular"});
   const page=await ctx.newPage(),errors=[];
   page.on("pageerror",e=>errors.push(e.message));
   await page.goto("http://127.0.0.1:8000/prototipo-ficha/?modo=humanoide-rapido",{waitUntil:"domcontentloaded"});
   await page.waitForSelector("#gene-builder-map .fp-gene-node-label tspan");
   // Exibe as futuras ramificações para verificar também as Perícias longas ocultas inicialmente.
   const toggle=page.locator('[data-action="gene-future"]').first();
   if(await toggle.count()&&await toggle.isVisible())await toggle.click();
   const r=await validate(page,name);
   const after=page.locator('#gene-builder-map .fp-gene-skill[data-gene-id="criar-item-foco-magia"]');
   assert(await after.count()===1,name+": nó Criar Item de Foco e Magia ausente");
   assert((await after.locator('.fp-gene-node-label tspan').allTextContents()).join(" ")==="Criar Item de Foco e Magia",
     name+": rótulo longo cortado");
   assert(!errors.length,name+": JS: "+errors.join(" | "));
   console.log("PASS "+name+": "+r.checked+" rótulos completos, sem colisões ou abreviações.");
   await ctx.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e.stack||e);process.exitCode=1;});
