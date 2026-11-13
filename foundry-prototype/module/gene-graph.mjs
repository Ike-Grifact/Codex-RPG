/* Codex Genético — criação, distribuição e navegação. Conexões são afinidades, nunca requisitos inventados. */
(function(){"use strict";
let camera={zoom:1,x:0,y:0},selectedId="";
const active=new WeakSet();
const esc=x=>String(x??"").replace(/[&<>"']/g,v=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[v]));
const clean=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const clamp=(v,l,h)=>Math.max(l,Math.min(h,v));
const bridge={protecao:"vigor",astronomia:"inteligencia",medicina:"inteligencia",alquimia:"inteligencia",
 engenharia:"destreza",erudicao:"inteligencia",armas_conjuracao:"forca",atletismo:"vigor",
 furtividade:"agilidade",artesao:"destreza",apresentacao:"influencia",coleta:"inteligencia"};
function position(nodes){
 const attr=nodes.filter(n=>n.type==="attr"),source=nodes.filter(n=>n.type==="know"||n.type==="practice");
 const skills=nodes.filter(n=>n.type==="skill");
 attr.forEach((n,i)=>{n.x=640+(i%2?-45:45);n.y=114+i*102;n.category="dna";});
 source.forEach((n,i)=>{
  const angle=-Math.PI/2+Math.PI/12+i*Math.PI*2/Math.max(1,source.length);
  n.x=640+285*Math.cos(angle);n.y=370+278*Math.sin(angle);n.category="orbit";
 });
 skills.sort((a,b)=>a.id.localeCompare(b.id));
 skills.forEach((n,i)=>{
  const angle=-Math.PI/2+(i+.25)*Math.PI*2/Math.max(1,skills.length);
  const radiusX=i%2?542:488,radiusY=i%2?333:313;
  n.x=640+radiusX*Math.cos(angle);n.y=370+radiusY*Math.sin(angle);
  n.category="branch";
 });
}
function connections(nodes,branches,affinity){
 const map=new Map(nodes.map(n=>[n.id,n])),edges=new Map();
 const add=(a,b,type)=>{
  if(!map.has(a)||!map.has(b)||a===b)return;
  const key=[a,b].sort().join("→");if(!edges.has(key))edges.set(key,{a,b,type});
 };
 const attrs=nodes.filter(n=>n.type==="attr").sort((a,b)=>a.y-b.y);
 for(let i=1;i<attrs.length;i++)add(attrs[i-1].id,attrs[i].id,"dna");
 for(const n of nodes.filter(x=>x.type==="practice"||x.type==="know"))add(n.id,"attr:"+(bridge[n.key]||"inteligencia"),"source");
 for(const n of nodes.filter(x=>x.type==="skill")){
  const aff=affinity[n.id]||[];
  for(const source of aff)if(map.has(source))add(n.id,source,"affinity");
 }
 for(const chain of branches)for(let i=1;i<chain.length;i++)add(chain[i-1],chain[i],"branch");
 return [...edges.values()];
}
function draw(nodes,edges){
 const map=new Map(nodes.map(n=>[n.id,n]));
 let svg='<svg class="fp-gene-svg" viewBox="0 0 1280 740" role="img" aria-label="Codex Genético. Atributos formam uma dupla hélice central; Conhecimentos e Práticas orbitam os Atributos; Perícias se conectam aos ramos. Verde adquirido, azul disponível, cinza bloqueado.">'+
 '<defs><pattern id="gene-dots" width="36" height="36" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.1" fill="currentColor" opacity=".12"/></pattern></defs>'+
 '<rect width="1280" height="740" fill="url(#gene-dots)"/>'+
 '<g class="fp-gene-viewport" transform="translate('+camera.x+' '+camera.y+') scale('+camera.zoom+')">'+
 '<ellipse cx="640" cy="370" rx="290" ry="287" fill="none" stroke="currentColor" stroke-opacity=".19" stroke-dasharray="7 8" stroke-width="1.5"/>'+
 '<ellipse cx="640" cy="370" rx="520" ry="324" fill="none" stroke="currentColor" stroke-opacity=".09" stroke-width="1.2"/>'+
 '<text x="640" y="48" text-anchor="middle" class="fp-gene-cluster-label">SEU CÓDIGO GENÉTICO</text>'+
 '<text x="640" y="727" text-anchor="middle" class="fp-gene-cluster-label">ATRIBUTOS · FONTES · PERÍCIAS</text>';
 const attr=nodes.filter(n=>n.type==="attr").sort((a,b)=>a.y-b.y);
 if(attr.length===6){
  svg+='<path class="fp-gene-dna-strand a" d="M680 75 C540 147 735 177 595 249 S735 353 595 455 S735 555 595 657"/>'+
   '<path class="fp-gene-dna-strand b" d="M595 75 C735 147 540 177 680 249 S540 353 680 455 S540 555 680 657"/>';
  for(const node of attr)svg+='<line class="fp-gene-dna-rung" x1="'+(node.x-42)+'" y1="'+node.y+'" x2="'+(node.x+42)+'" y2="'+node.y+'"/>';
 }
 for(const e of edges){
  const a=map.get(e.a),b=map.get(e.b);
  const activeLink=selectedId&&[e.a,e.b].includes(selectedId);
  const owned=a.state==="owned"&&b.state==="owned";
  svg+='<line class="fp-gene-edge'+(activeLink?" active":"")+(owned?" completed":"")+'" data-gene-link="'+e.type+
   '" x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'"/>';
 }
 for(const n of nodes){
  const chosen=n.id===selectedId,near=edges.some(e=>(e.a===n.id&&e.b===selectedId)||(e.b===n.id&&e.a===selectedId));
  const showLabel=n.type!=="skill"||chosen||near||n.state==="owned"||n.state==="available";
  const short=n.name.replace(/^(Perícia (em|de) |Maestria (em|de) )/i,"");
  const label=short.length>19?short.slice(0,18)+"…":short;
  const radius=n.type==="attr"?21:n.type==="skill"?10:15;
  const r=chosen?radius+2:radius;
  svg+='<g class="fp-gene-node is-'+n.state+' type-'+n.type+(chosen?" is-selected":"")+'" role="button" tabindex="0" data-gene-id="'+esc(n.id)+
   '" aria-label="'+esc(n.name+(n.grade!==undefined?" grau "+n.grade:"")+". "+(n.state==="owned"?"Adquirido":n.state==="available"?"Disponível":"Bloqueado"))+'" aria-pressed="'+String(chosen)+
   '" transform="translate('+n.x+' '+n.y+')"><circle class="fp-gene-hit" r="'+(r+10)+'"/>'+
   '<circle class="fp-gene-dot" r="'+r+'"/>'+
   (n.type!=="skill"?'<text class="fp-gene-inside" text-anchor="middle" dominant-baseline="middle">'+esc(n.type==="attr"?"ᛋ":n.type==="know"?"ᚨ":"ᛋ")+'</text>':"")+
   (n.grade!==undefined?'<text class="fp-gene-grade" y="'+(r+12)+'" text-anchor="middle">G'+n.grade+'</text>':"")+
   (showLabel?'<text class="fp-gene-node-label" y="'+(r+27)+'" text-anchor="middle">'+esc(label)+'</text>':"")+
   '<title>'+esc(n.name+" — "+(n.label||""))+'</title></g>';
 }
 return svg+'</g></svg>';
}
function transform(root){const v=root?.querySelector(".fp-gene-viewport");if(v)v.setAttribute("transform","translate("+camera.x+" "+camera.y+") scale("+camera.zoom+")");}
function bind(root,onSelect){
 if(active.has(root))return;active.add(root);
 root.addEventListener("click",event=>{const n=event.target.closest("[data-gene-id]");if(n)onSelect(n.dataset.geneId);});
 root.addEventListener("keydown",event=>{const n=event.target.closest("[data-gene-id]");if(n&&(event.key==="Enter"||event.key===" ")){event.preventDefault();onSelect(n.dataset.geneId);}});
 let start=null;
 root.addEventListener("pointerdown",event=>{
  if(event.target.closest("[data-gene-id]"))return;
  start={clientX:event.clientX,clientY:event.clientY,x:camera.x,y:camera.y};
  root.setPointerCapture?.(event.pointerId);
 });
 root.addEventListener("pointermove",event=>{
  if(!start)return;
  const rect=root.getBoundingClientRect();
  camera.x=start.x+(event.clientX-start.clientX)*1280/Math.max(1,rect.width);
  camera.y=start.y+(event.clientY-start.clientY)*740/Math.max(1,rect.height);
  transform(root);
 });
 root.addEventListener("pointerup",()=>start=null);
 root.addEventListener("pointercancel",()=>start=null);
 root.addEventListener("wheel",event=>{
  if(!event.deltaY)return;event.preventDefault();
  camera.zoom=clamp(camera.zoom*(event.deltaY<0?1.12:.89),.58,2.7);transform(root);
 },{passive:false});
}
function render(root,{skills,branches=[],affinity={},selected="",filter="related",query="",onSelect=()=>{}}={}){
 if(!root)return;selectedId=selected;
 const all=skills.filter(n=>n&&n.type&&n.type!=="hidden").map(n=>({...n,category:n.category||"",key:n.key||n.id?.split(":")[1]}));
 const term=clean(query),selectedSkill=all.find(n=>n.id===selected);
 let visible=all.filter(n=>{
  if(n.type!=="skill")return true;
  if(term&&!clean(n.name+" "+n.id).includes(term))return false;
  if(filter==="all")return true;
  if(filter==="owned")return n.state==="owned"||n.id===selected;
  if(filter==="available")return n.state==="available"||n.id===selected;
  return n.state==="owned"||n.state==="available"||n.id===selected||
    (affinity[n.id]||[]).includes(selected)||branches.some(chain=>chain.includes(n.id)&&chain.includes(selected));
 });
 if(selectedSkill&&!visible.some(n=>n.id===selectedSkill.id))visible.push(selectedSkill);
 position(visible);const edges=connections(visible,branches,affinity);
 root.innerHTML=draw(visible,edges);bind(root,onSelect);
}
function zoom(root,dir){if(dir===0)camera={zoom:1,x:0,y:0};else camera.zoom=clamp(camera.zoom*(dir>0?1.18:1/1.18),.58,2.7);transform(root);}
window.CodexGeneGraph={render,zoom};
})();