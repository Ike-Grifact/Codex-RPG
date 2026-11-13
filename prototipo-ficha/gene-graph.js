/* Codex Genético — fontes no centro e ao redor; ramificações só quando acessíveis.
 * Ligações são afinidades temáticas, nunca pré-requisitos automáticos. */
(function(){"use strict";
const W=1600,BASE_Y=145,ROW=111,SKILL_Y=900;
const GRADE_MAX=6;
const esc=x=>String(x??"").replace(/[&<>"']/g,v=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[v]));
const clean=x=>String(x??"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const clamp=(v,l,h)=>Math.max(l,Math.min(h,v));
const baseAttr=["forca","agilidade","destreza","inteligencia","influencia","vigor"];
const baseKnow=["protecao","medicina","astronomia","alquimia","engenharia","erudicao"];
const basePractice=["atletismo","armas_conjuracao","furtividade","artesao","apresentacao","coleta"];
const sourcesAffinity={
 "know:protecao":["destreza","inteligencia"],
 "know:astronomia":["inteligencia"],
 "know:medicina":["inteligencia","destreza"],
 "know:alquimia":["inteligencia"],
 "know:engenharia":["inteligencia"],
 "know:erudicao":["inteligencia","influencia"],
 "practice:atletismo":["forca","agilidade","destreza"],
 "practice:armas_conjuracao":["forca","inteligencia"],
 "practice:furtividade":["destreza","agilidade"],
 "practice:artesao":["destreza","forca"],
 "practice:apresentacao":["influencia"],
 "practice:coleta":["destreza","forca","inteligencia"]
};
const cameras=new WeakMap(),listeners=new WeakSet();
const getCamera=root=>{if(!cameras.has(root))cameras.set(root,{zoom:1,x:0,y:0});return cameras.get(root);};
function position(nodes){
 const byId=new Map(nodes.map(n=>[n.id,n]));
 for(const [i,key] of baseAttr.entries()){const n=byId.get("attr:"+key);if(n){n.x=800;n.y=BASE_Y+i*ROW;}}
 for(const [i,key] of baseKnow.entries()){const n=byId.get("know:"+key);if(n){n.x=265;n.y=BASE_Y+i*ROW;}}
 for(const [i,key] of basePractice.entries()){const n=byId.get("practice:"+key);if(n){n.x=1335;n.y=BASE_Y+i*ROW;}}
 const skills=nodes.filter(n=>n.type==="skill").sort((a,b)=>{
  const rank=n=>n.state==="owned"?0:n.state==="available"?1:2;
  return rank(a)-rank(b)||a.name.localeCompare(b.name,"pt-BR");
 });
 skills.forEach((n,i)=>{n.x=115+(i%7)*221;n.y=SKILL_Y+Math.floor(i/7)*72;});
 return Math.max(1000,SKILL_Y+Math.ceil(skills.length/7)*72+70);
}
function edge(a,b,cls){
 if(!a||!b)return"";
 // Curvas suaves, apenas em conexões selecionadas. Evita cruzamento permanente em massa.
 const x=(a.x+b.x)/2;
 return '<path class="fp-gene-relation '+cls+'" d="M'+a.x+' '+a.y+' C'+x+' '+a.y+' '+x+' '+b.y+' '+b.x+' '+b.y+'"/>';
}
function card(n,edit){
 const c=n.type==="attr"?"attr":n.type==="know"?"know":"practice";
 const width=c==="attr"?270:294;
 const height=72;
 const x=n.x-width/2,y=n.y-height/2;
 const dice=(n.dice||[]).map((d,i)=>{
  const x=n.x+((i+0.5)-(n.dice.length/2))*39,y=n.y-61;
  const sides=Number(d.slice(1));
  const shape=sides===4?'<polygon points="'+(x-15)+','+(y+10)+' '+(x+15)+','+(y+10)+' '+x+','+(y-13)+'"/>':
   sides===6?'<rect x="'+(x-14)+'" y="'+(y-14)+'" width="28" height="28" rx="5"/>':
   sides===10?'<polygon points="'+x+','+(y-16)+' '+(x+15)+','+(y-3)+' '+(x+11)+','+(y+15)+' '+(x-11)+','+(y+15)+' '+(x-15)+','+(y-3)+'"/>':
   sides===12?'<polygon points="'+x+','+(y-16)+' '+(x+15)+','+(y-8)+' '+(x+15)+','+(y+9)+' '+x+','+(y+16)+' '+(x-15)+','+(y+9)+' '+(x-15)+','+(y-8)+'"/>':
   '<circle cx="'+x+'" cy="'+y+'" r="15"/>';
  return '<g class="fp-gene-die-shape">'+shape+'<text x="'+x+'" y="'+(y+5)+'" text-anchor="middle">'+esc(d)+'</text></g>';
 }).join("");
 const pending=n.previewGrade!==undefined&&n.previewGrade!==n.grade;
 const label=esc(n.name);
 const canDown=edit&&n.previewGrade>0;
 const canUp=edit&&n.previewGrade<GRADE_MAX&&n.canRaise;
 const control=edit?'<g class="fp-gene-node-controls" aria-label="Ajustar grau de '+label+'">'+
  '<g role="button" tabindex="'+(canDown?'0':'-1')+'" class="fp-gene-grade-button'+(canDown?'':' is-disabled')+'" data-gene-grade="-1" data-gene-id="'+esc(n.id)+'" aria-label="Diminuir '+label+'" aria-disabled="'+(!canDown)+'">'+
  '<rect x="'+(n.x+width/2-88)+'" y="'+(n.y-13)+'" width="31" height="27" rx="7"/><text x="'+(n.x+width/2-72.5)+'" y="'+(n.y+5)+'" text-anchor="middle">−</text></g>'+
  '<g role="button" tabindex="'+(canUp?'0':'-1')+'" class="fp-gene-grade-button'+(canUp?'':' is-disabled')+'" data-gene-grade="1" data-gene-id="'+esc(n.id)+'" aria-label="Aumentar '+label+'" aria-disabled="'+(!canUp)+'">'+
  '<rect x="'+(n.x+width/2-49)+'" y="'+(n.y-13)+'" width="31" height="27" rx="7"/><text x="'+(n.x+width/2-33.5)+'" y="'+(n.y+5)+'" text-anchor="middle">+</text></g></g>':"";
 const textWidth=edit?width-120:width-42;
 return '<g class="fp-gene-node fp-gene-card type-'+c+(n.selected?' is-selected':'')+(pending?' is-pending':'')+'" data-gene-id="'+esc(n.id)+'" role="button" tabindex="0" aria-label="'+label+' grau '+(n.previewGrade??n.grade)+'">'+
  '<title>'+label+' — '+esc(n.label||"")+'</title>'+
  '<rect class="fp-gene-card-fill" x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'" rx="14"/>'+
  dice+
  '<text class="fp-gene-card-title" x="'+(x+17)+'" y="'+(y+29)+'">'+label+'</text>'+
  '<text class="fp-gene-card-grade" x="'+(x+17)+'" y="'+(y+52)+'">Grau '+(n.previewGrade??n.grade)+(pending?' · a confirmar':'')+'</text>'+
  control+'</g>';
}
function skill(n){
 const shortened=n.name.length>22?n.name.slice(0,21)+"…":n.name;
 return '<g class="fp-gene-node fp-gene-skill is-'+n.state+(n.selected?' is-selected':'')+'" data-gene-id="'+esc(n.id)+'" role="button" tabindex="0" aria-label="'+esc(n.name)+' '+(n.state==="owned"?"adquirida":n.state==="available"?"disponível":"ramificação futura")+'">'+
  '<title>'+esc(n.name+' — '+(n.label||""))+'</title>'+
  '<circle class="fp-gene-dot" cx="'+n.x+'" cy="'+n.y+'" r="14"/>'+
  '<text class="fp-gene-node-label" x="'+(n.x+23)+'" y="'+(n.y+5)+'">'+esc(shortened)+'</text></g>';
}
function draw(nodes,height,selected,affinity,edit,camera){
 const byId=new Map(nodes.map(n=>[n.id,n]));
 let svg='<svg class="fp-gene-svg fp-gene-overview" viewBox="0 0 '+W+' '+height+'" role="img" aria-label="Codex Genético: Atributos no centro, Conhecimentos à esquerda, Práticas à direita e ramificações disponíveis abaixo.">'+
  '<defs><pattern id="codex-gene-dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor" opacity=".11"/></pattern></defs>'+
  '<rect width="'+W+'" height="'+height+'" fill="url(#codex-gene-dots)"/>'+
  '<g class="fp-gene-viewport" transform="translate('+camera.x+' '+camera.y+') scale('+camera.zoom+')">'+
  '<text class="fp-gene-column-title is-know" x="265" y="66" text-anchor="middle">CONHECIMENTOS · ESTUDO</text>'+
  '<text class="fp-gene-column-title is-attr" x="800" y="66" text-anchor="middle">ATRIBUTOS · CAPACIDADES</text>'+
  '<text class="fp-gene-column-title is-practice" x="1335" y="66" text-anchor="middle">PRÁTICAS · TREINAMENTO</text>'+
  '<path class="fp-gene-dna-spine" d="M800 110 V755"/>';
 // As afinidades aparecem apenas ao selecionar a fonte — sem rede de cruzamentos.
 const active=byId.get(selected);
 if(active){
  if(active.type==="know"||active.type==="practice"){
   for(const attribute of sourcesAffinity[active.id]||[])svg+=edge(active,byId.get("attr:"+attribute),"active");
  }else if(active.type==="attr"){
   for(const source of nodes.filter(n=>n.type==="know"||n.type==="practice")){
    if((sourcesAffinity[source.id]||[]).includes(active.key))svg+=edge(active,source,"active");
   }
  }else if(active.type==="skill"){
   for(const source of (affinity[active.id]||[]).slice(0,4))svg+=edge(active,byId.get(source),"active");
  }
 }
 for(const n of nodes.filter(n=>n.type!=="skill"))svg+=card({...n,selected:n.id===selected},edit);
 const skills=nodes.filter(n=>n.type==="skill");
 svg+='<line class="fp-gene-branch-rule" x1="75" x2="1525" y1="829" y2="829"/>'+
  '<text class="fp-gene-column-title is-skills" x="800" y="865" text-anchor="middle">RAMIFICAÇÕES · PERÍCIAS</text>';
 if(!skills.length)svg+='<text class="fp-gene-empty-text" x="800" y="935" text-anchor="middle">Nenhuma Perícia disponível no momento. Desenvolva fontes para habilitar novos caminhos.</text>';
 for(const n of skills)svg+=skill({...n,selected:n.id===selected});
 return svg+'</g></svg>';
}
function applyTransform(root){
 const cam=getCamera(root),v=root.querySelector(".fp-gene-viewport");
 if(v)v.setAttribute("transform","translate("+cam.x+" "+cam.y+") scale("+cam.zoom+")");
}
function bind(root){
 if(listeners.has(root))return;
 listeners.add(root);
 root.addEventListener("click",event=>{
  const g=event.target.closest("[data-gene-grade]");
  if(g){event.stopPropagation();if(g.getAttribute("aria-disabled")!=="true")root.__geneActions?.onAdjust?.(g.dataset.geneId,Number(g.dataset.geneGrade));return;}
  const node=event.target.closest("[data-gene-id]");
  if(node)root.__geneActions?.onSelect?.(node.dataset.geneId);
 });
 root.addEventListener("keydown",event=>{
  if(event.key!=="Enter"&&event.key!==" ")return;
  const node=event.target.closest("[data-gene-grade],[data-gene-id]");if(!node)return;
  event.preventDefault();
  const button=node.closest("[data-gene-grade]");
  if(button){if(button.getAttribute("aria-disabled")!=="true")root.__geneActions?.onAdjust?.(button.dataset.geneId,Number(button.dataset.geneGrade));}
  else root.__geneActions?.onSelect?.(node.dataset.geneId);
 });
 let start=null;
 root.addEventListener("pointerdown",event=>{
  if(event.target.closest("[data-gene-id]"))return;
  const cam=getCamera(root);start={clientX:event.clientX,clientY:event.clientY,x:cam.x,y:cam.y};
  root.setPointerCapture?.(event.pointerId);
 });
 root.addEventListener("pointermove",event=>{
  if(!start)return;
  const rect=root.getBoundingClientRect(),svg=root.querySelector("svg"),cam=getCamera(root);
  const vb=svg?.viewBox?.baseVal;cam.x=start.x+(event.clientX-start.clientX)*(vb?.width||W)/Math.max(1,rect.width);
  cam.y=start.y+(event.clientY-start.clientY)*(vb?.height||1000)/Math.max(1,rect.height);
  applyTransform(root);
 });
 root.addEventListener("pointerup",()=>start=null);
 root.addEventListener("pointercancel",()=>start=null);
 root.addEventListener("wheel",event=>{
  if(!event.deltaY)return;event.preventDefault();
  const cam=getCamera(root);cam.zoom=clamp(cam.zoom*(event.deltaY<0?1.1:.91),.65,2.5);applyTransform(root);
 },{passive:false});
}
function render(root,{skills=[],affinity={},selected="",filter="related",query="",showFuture=false,edit=false,onSelect=()=>{},onAdjust=()=>{}}={}){
 if(!root)return;
 root.__geneActions={onSelect,onAdjust};
 const all=skills.filter(n=>n&&n.type&&n.type!=="hidden").map(n=>({...n,key:n.key||n.id?.split(":")[1]}));
 const term=clean(query);
 let visible=all.filter(n=>n.type!=="skill"||(!term||clean(n.name+" "+n.id).includes(term))&&(showFuture||n.state!=="locked"));
 // No modo de ficha, os filtros clássicos continuam válidos, sem esconder as fontes.
 if(!edit){
  visible=visible.filter(n=>n.type!=="skill"||filter==="all"||filter==="related"||(
   filter==="owned"?n.state==="owned":filter==="available"?n.state==="available":true));
 }
 const height=position(visible),cam=getCamera(root);
 root.innerHTML=draw(visible,height,selected,affinity,edit,cam);
 bind(root);
}
function zoom(root,dir){
 if(!root)return;const cam=getCamera(root);
 if(dir===0){cam.zoom=1;cam.x=0;cam.y=0;}
 else cam.zoom=clamp(cam.zoom*(dir>0?1.16:1/1.16),.65,2.5);
 applyTransform(root);
}
window.CodexGeneGraph={render,zoom};
})();
