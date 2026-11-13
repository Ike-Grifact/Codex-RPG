/* Codex Genético: rede de navegação e progressão, sem criar requisitos novos. */
(function(){
"use strict";
const NS="http://www.w3.org/2000/svg";
const centers={marcial:[280,205],magia:[805,185],furtividade:[330,485],social:[680,485],suporte:[1015,485],livre:[585,340]};
const categoryTitle={marcial:"Combate",magia:"Conjuração",furtividade:"Furtividade",social:"Social e Montaria",suporte:"Suporte e Sobrevivência",livre:"Combinações"};
let view={zoom:1,x:0,y:0},drag=null,selectedId="",activeContainer=null;
const clean=s=>String(s??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().trim();
const esc=s=>String(s??"").replace(/[&<>"']/g,x=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[x]));
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
function classify(skill,groups){
 if(groups.includes("magia"))return"magia";
 if(groups.includes("furtividade"))return"furtividade";
 if(groups.includes("social"))return"social";
 if(groups.includes("suporte"))return"suporte";
 if(groups.includes("marcial"))return"marcial";
 return"livre";
}
function coords(nodes){
 const bags={};for(const n of nodes)(bags[n.category]??=[]).push(n);
 for(const [cat,arr] of Object.entries(bags)){
  arr.sort((a,b)=>a.id.localeCompare(b.id));
  const [cx,cy]=centers[cat];let i=0;
  for(const n of arr){const ring=Math.floor(i/7),index=i%7,slots=Math.min(7,arr.length-ring*7);
   const angle=(index/Math.max(1,slots))*Math.PI*2+(ring%2?.34:-.2);
   const radius=cat==="magia"?46+ring*52:cat==="marcial"?40+ring*47:34+ring*44;
   n.x=Math.round(cx+Math.cos(angle)*radius);n.y=Math.round(cy+Math.sin(angle)*radius);i++;
  }
 }
}
function graphBody(nodes,branches){
 const map=new Map(nodes.map(n=>[n.id,n])),lines=new Set(),edges=[];
 for(const chain of branches){
  for(let i=1;i<chain.length;i++){
   const a=chain[i-1],b=chain[i];if(!map.has(a)||!map.has(b)||a===b)continue;
   const key=[a,b].sort().join("|");if(lines.has(key))continue;lines.add(key);edges.push({a,b});
  }
 }
 let svg='<svg class="fp-gene-svg" viewBox="0 0 1180 680" role="img" aria-label="Mapa interativo de Perícias. Verde adquirida, azul disponível, neutra bloqueada. Use os controles ou o mouse para explorar.">'+
 '<defs><pattern id="gene-grid" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0V35" fill="none" stroke="currentColor" stroke-opacity=".13" stroke-width=".8"/></pattern></defs>'+
 '<rect width="1180" height="680" fill="url(#gene-grid)" class="fp-gene-background"/>'+
 '<g class="fp-gene-viewport" transform="translate('+view.x+' '+view.y+') scale('+view.zoom+')">';
 for(const [key,center] of Object.entries(centers))svg+='<text class="fp-gene-cluster-label" x="'+center[0]+'" y="'+(center[1]-80)+'" text-anchor="middle">'+esc(categoryTitle[key])+'</text>';
 for(const {a,b} of edges){
  const aa=map.get(a),bb=map.get(b);
  svg+='<line class="fp-gene-edge'+(a===selectedId||b===selectedId?" active":"")+'" x1="'+aa.x+'" y1="'+aa.y+'" x2="'+bb.x+'" y2="'+bb.y+'"/>';
 }
 for(const n of nodes){
  const chosen=n.id===selectedId,neighbour=edges.some(e=>e.a===n.id&&e.b===selectedId||e.b===n.id&&e.a===selectedId);
  const bright=chosen||neighbour||n.state==="owned"||n.state==="available";
  const r=chosen?15:n.state==="owned"?11:9;
  svg+='<g class="fp-gene-node is-'+n.state+(chosen?" is-selected":"")+'" data-gene-id="'+esc(n.id)+'" role="button" tabindex="0" aria-label="'+esc(n.name+' · '+n.label)+'" aria-pressed="'+String(chosen)+'" transform="translate('+n.x+' '+n.y+')">'+
   '<circle r="'+(r+7)+'" class="fp-gene-hit"/><circle r="'+r+'" class="fp-gene-dot"/>'+
   (chosen?'<circle r="'+(r+5)+'" class="fp-gene-halo"/>':"")+
   (bright?'<text class="fp-gene-node-label" y="'+(r+17)+'" text-anchor="middle">'+esc(n.shortName)+'</text>':"")+
   '<title>'+esc(n.name+" — "+n.label)+'</title></g>';
 }
 return svg+'</g></svg>';
}
function applyTransform(container){
 const viewport=container?.querySelector(".fp-gene-viewport");
 if(viewport)viewport.setAttribute("transform","translate("+view.x+" "+view.y+") scale("+view.zoom+")");
}
function install(container,onSelect){
 if(activeContainer===container)return;
 activeContainer=container;
 container.addEventListener("click",event=>{const n=event.target.closest("[data-gene-id]");if(n)onSelect(n.dataset.geneId);});
 container.addEventListener("keydown",event=>{const n=event.target.closest("[data-gene-id]");if(n&&(event.key==="Enter"||event.key===" ")){event.preventDefault();onSelect(n.dataset.geneId);}});
 container.addEventListener("pointerdown",event=>{
  if(event.target.closest("[data-gene-id]"))return;
  drag={startX:event.clientX,startY:event.clientY,x:view.x,y:view.y};
  if(container.setPointerCapture)container.setPointerCapture(event.pointerId);
 });
 container.addEventListener("pointermove",event=>{
  if(!drag)return;
  const rect=container.getBoundingClientRect(),sx=1180/Math.max(1,rect.width),sy=680/Math.max(1,rect.height);
  view.x=drag.x+(event.clientX-drag.startX)*sx;
  view.y=drag.y+(event.clientY-drag.startY)*sy;
  applyTransform(container);
 });
 container.addEventListener("pointerup",()=>drag=null);
 container.addEventListener("pointercancel",()=>drag=null);
 container.addEventListener("wheel",event=>{
  if(!event.ctrlKey&&event.deltaY===0)return;
  event.preventDefault();view.zoom=clamp(view.zoom*(event.deltaY<0?1.13:.885),.58,2.5);applyTransform(container);
 },{passive:false});
}
function render(container,{skills,branches,selected="",filter="related",query="",onSelect}){
 if(!container)return;
 selectedId=selected;
 const known=skills.filter(n=>n.category!=="hidden"),lookup=new Map(known.map(n=>[n.id,n]));
 const classified=known.map(n=>{
  const groups=[];
  if(branches.some((b,i)=>i===5&&b.includes(n.id)))groups.push("magia");
  if(branches.some((b,i)=>[0,1,2,3,7,8].includes(i)&&b.includes(n.id)))groups.push("marcial");
  if(branches.some((b,i)=>i===9&&b.includes(n.id)))groups.push("furtividade");
  if(branches.some((b,i)=>i===6&&b.includes(n.id)))groups.push("social");
  if(branches.some((b,i)=>i===4&&b.includes(n.id)))groups.push("suporte");
  const name=n.name.replace(/^(Perícia em |Perícia de |Maestria em |Perícia )/i,"");
  return {...n,groups,category:classify(n,groups),shortName:name.length>23?name.slice(0,22)+"…":name};
 });
 const norm=clean(query);
 let visible=classified.filter(n=>(!norm||clean(n.name+" "+n.id).includes(norm))&&(
  filter==="all"||filter==="related"&&(n.state==="owned"||n.state==="available"||n.id===selected||branches.some(b=>b.includes(n.id)&&b.some(k=>lookup.get(k)?.state==="owned")))||
  filter==="owned"&&n.state==="owned"||filter==="available"&&n.state==="available"||n.category===filter));
 if(selected&&lookup.has(selected)&&!visible.some(n=>n.id===selected)){const focused=classified.find(n=>n.id===selected);if(focused)visible=[...visible,focused];}
 coords(visible);container.innerHTML=graphBody(visible,branches);
 install(container,onSelect);
}
function zoom(container,direction){
 if(direction===0)view={zoom:1,x:0,y:0};
 else view.zoom=clamp(view.zoom*(direction>0?1.2:1/1.2),.58,2.5);
 applyTransform(container);
}
window.CodexGeneGraph={render,zoom};
})();