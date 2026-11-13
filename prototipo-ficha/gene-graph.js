/* Codex Genético — fontes no centro e ao redor; ramificações só quando acessíveis.
 * Ligações são afinidades temáticas, nunca pré-requisitos automáticos. */
(function(){"use strict";
const W=1600,BASE_Y=145,ROW=111,SKILL_Y=900;
const GRADE_MAX=6;
// Mesmos traços poliédricos de dieIcon() no criador: mantém identidade do rolador.
const DICE_SHAPES={
 4:'<polygon points="21,4 39,36 3,36"/><path d="M21 4 L21 27 L3 36 M21 27 L39 36"/>',
 6:'<polygon points="21,3 37,12 37,30 21,39 5,30 5,12"/><path d="M5 12 L21 21 L37 12 M21 21 L21 39"/>',
 10:'<polygon points="21,2 35,14 32,32 21,40 10,32 7,14"/><path d="M7 14 L21 9 L35 14 M21 9 L21 40 M7 14 L21 25 L35 14 M21 25 L10 32 M21 25 L32 32"/>',
 12:'<polygon points="21,2 35,8 40,21 34,34 21,40 8,34 2,21 7,8"/><path d="M21 9 L31 16 L28 29 L14 29 L11 16 Z M21 2 L21 9 M35 8 L31 16 M40 21 L31 16 M34 34 L28 29 M21 40 L28 29 M8 34 L14 29 M2 21 L11 16 M7 8 L11 16"/>'
};
function dnaStrands(){
 const center=800,left=[],right=[];let rungs='';
 for(let i=0;i<=75;i++){
  const y=102+i*9.1,offset=78*Math.sin((y-102)*2*Math.PI/270);
  left.push((i?'L':'M')+(center+offset).toFixed(1)+' '+y.toFixed(1));
  right.push((i?'L':'M')+(center-offset).toFixed(1)+' '+y.toFixed(1));
  if(i%6===0)rungs+='<line class="fp-gene-dna-rung" x1="'+(center+offset).toFixed(1)+'" y1="'+y.toFixed(1)+'" x2="'+(center-offset).toFixed(1)+'" y2="'+y.toFixed(1)+'"/>';
 }
 return '<g class="fp-gene-double-helix" aria-hidden="true"><path class="fp-gene-dna-strand a" d="'+left.join(" ")+'"/><path class="fp-gene-dna-strand b" d="'+right.join(" ")+'"/>'+rungs+'</g>';
}
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
function position(nodes,branches=[]){
 const byId=new Map(nodes.map(n=>[n.id,n]));
 for(const [i,key] of baseAttr.entries()){const n=byId.get("attr:"+key);if(n){n.x=800;n.y=BASE_Y+i*ROW;}}
 for(const [i,key] of baseKnow.entries()){const n=byId.get("know:"+key);if(n){n.x=265;n.y=BASE_Y+i*ROW;}}
 for(const [i,key] of basePractice.entries()){const n=byId.get("practice:"+key);if(n){n.x=1335;n.y=BASE_Y+i*ROW;}}
 // Grafo de afinidades temáticas já registrado no visualizador clássico.
 // Posições estáveis, inclusive quando nós bloqueados são ocultados.
 const groups=[
  {name:"COMBATE E ARMAS",branch:[0,1,2,3,7,8],xs:[125,358,591,824],y:955},
  {name:"CONJURAÇÃO E ELEMENTOS",branch:[5],xs:[1130,1400],y:955},
  {name:"RECUPERAÇÃO",branch:[4],xs:[180,410],y:2060},
  {name:"SOCIAL E AÇÕES",branch:[6],xs:[670,905],y:2060},
  {name:"FURTIVIDADE",branch:[9],xs:[1170,1410],y:2060}
 ];
 const assigned=new Set();
 for(const group of groups){
  const ids=[...new Set(group.branch.flatMap(i=>branches[i]||[]))]
    .filter(id=>byId.has(id)&&!assigned.has(id));
  ids.forEach((id,i)=>{
   const n=byId.get(id);
   n.x=group.xs[i%group.xs.length];
   n.y=group.y+Math.floor(i/group.xs.length)*112;
   assigned.add(id);
  });
 }
 const rest=nodes.filter(n=>n.type==="skill"&&!assigned.has(n.id))
  .sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
 rest.forEach((n,i)=>{n.x=160+(i%6)*255;n.y=2500+Math.floor(i/6)*112;});
 return Math.max(1170,...nodes.filter(n=>n.type==="skill").map(n=>n.y+110));
}
function edge(a,b,cls){
 if(!a||!b)return"";
 // Curvas suaves, apenas em conexões selecionadas. Evita cruzamento permanente em massa.
 const x=(a.x+b.x)/2;
 return '<path class="fp-gene-relation '+cls+'" d="M'+a.x+' '+a.y+' C'+x+' '+a.y+' '+x+' '+b.y+' '+b.x+' '+b.y+'"/>';
}
function card(n,edit){
 const c=n.type==="attr"?"attr":n.type==="know"?"know":"practice";
 const width=342,height=86,x=n.x-width/2,y=n.y-height/2;
 const icons=n.dice||[];
 const iconGap=icons.length===3?62:70;
 const iconStart=n.x-(icons.length-1)*iconGap/2;
 const dice=icons.map((die,i)=>{
  const cx=iconStart+i*iconGap,cy=n.y+18;
  const sides=Number(die.slice(1)),poly=DICE_SHAPES[sides]||DICE_SHAPES[4];
  // Repete o dado do modo de listas: linha poliédrica sem preenchimento, dN ao lado.
  return '<g class="fp-gene-die-inline is-d'+sides+'">'+
   '<g class="fp-gene-die-poly" transform="translate('+(cx-20)+' '+(cy-14)+') scale(.67)">'+poly+'</g>'+
   '<text x="'+(cx+10)+'" y="'+(cy+4)+'" class="fp-gene-die-name">d'+sides+'</text></g>';
 }).join("");
 const label=esc(n.name),pending=n.previewGrade!==undefined&&n.previewGrade!==n.grade;
 const canDown=edit&&n.previewGrade>0;
 const canUp=edit&&n.previewGrade<GRADE_MAX&&n.canRaise;
 const makeButton=(delta,enabled,posX,text,aria)=>
  '<g role="button" tabindex="'+(enabled?'0':'-1')+'" class="fp-gene-grade-button'+(enabled?'':' is-disabled')+
  '" data-gene-grade="'+delta+'" data-gene-id="'+esc(n.id)+'" aria-label="'+aria+'" aria-disabled="'+(!enabled)+'">'+
  '<rect x="'+posX+'" y="'+(n.y+4)+'" width="32" height="29" rx="8"/>'+
  '<text x="'+(posX+16)+'" y="'+(n.y+25)+'" text-anchor="middle">'+text+'</text></g>';
 const control=edit?makeButton(-1,canDown,x+14,"−","Diminuir "+label)+
  makeButton(1,canUp,x+width-46,"+","Aumentar "+label):"";
 return '<g class="fp-gene-node fp-gene-card type-'+c+(n.selected?' is-selected':'')+(pending?' is-pending':'')+
  '" data-gene-id="'+esc(n.id)+'" role="button" tabindex="0" aria-label="'+label+' grau '+(n.previewGrade??n.grade)+'">'+
  '<title>'+label+' — '+esc(n.label||"")+'</title>'+
  '<rect class="fp-gene-card-fill" x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'" rx="13"/>'+
  '<text class="fp-gene-card-title" x="'+(x+18)+'" y="'+(y+28)+'">'+label+'</text>'+
  '<text class="fp-gene-card-grade" x="'+(x+width-18)+'" y="'+(y+27)+'" text-anchor="end">GRAU '+(n.previewGrade??n.grade)+(pending?' *':'')+'</text>'+
  '<line class="fp-gene-card-separator" x1="'+(x+17)+'" x2="'+(x+width-17)+'" y1="'+(y+38)+'" y2="'+(y+38)+'"/>'+
  control+dice+'</g>';
}
function skill(n){
 const shortened=n.name.length>22?n.name.slice(0,21)+"…":n.name;
 return '<g class="fp-gene-node fp-gene-skill is-'+n.state+(n.selected?' is-selected':'')+'" data-gene-id="'+esc(n.id)+'" role="button" tabindex="0" aria-label="'+esc(n.name)+' '+(n.state==="owned"?"adquirida":n.state==="available"?"disponível":n.state==="potential"?"XP suficiente, requisitos pendentes":"ramificação futura")+'">'+
  '<title>'+esc(n.name+' — '+(n.label||""))+'</title>'+
  '<circle class="fp-gene-dot" cx="'+n.x+'" cy="'+n.y+'" r="15"/>'+
  '<text class="fp-gene-node-label" x="'+n.x+'" y="'+(n.y+39)+'" text-anchor="middle">'+esc(shortened)+'</text></g>';
}
function draw(nodes,height,selected,affinity,branches,edit,camera){
 const byId=new Map(nodes.map(n=>[n.id,n]));
 let svg='<svg class="fp-gene-svg fp-gene-overview" viewBox="0 0 '+W+' '+height+'" role="img" aria-label="Codex Genético: Atributos no centro, Conhecimentos à esquerda, Práticas à direita e ramificações disponíveis abaixo.">'+
  '<defs><pattern id="codex-gene-dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor" opacity=".11"/></pattern></defs>'+
  '<rect width="'+W+'" height="'+height+'" fill="url(#codex-gene-dots)"/>'+
  '<g class="fp-gene-viewport" transform="translate('+camera.x+' '+camera.y+') scale('+camera.zoom+')">'+
  '<text class="fp-gene-column-title is-know" x="265" y="66" text-anchor="middle">CONHECIMENTOS</text>'+
  '<text class="fp-gene-column-title is-attr" x="800" y="66" text-anchor="middle">ATRIBUTOS</text>'+
  '<text class="fp-gene-column-title is-practice" x="1335" y="66" text-anchor="middle">PRÁTICAS</text>'+
  dnaStrands();
 // Ligações de ramificações vindas do mesmo grafo temático usado no modo Obsidian.
 // NÃO equivalem a requisitos, que seguem exclusivamente skillReq().
 const connected=new Set();
 for(const branch of branches){
  for(let i=1;i<branch.length;i++){
   const a=byId.get(branch[i-1]),b=byId.get(branch[i]);
   if(!a||!b)continue;
   const signature=[a.id,b.id].sort().join("|");
   if(connected.has(signature))continue;connected.add(signature);
   const highlighted=selected===a.id||selected===b.id;
   svg+=edge(a,b,"fp-gene-skill-link"+(highlighted?" is-related":""));
  }
 }
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
 const nodePosition=node=>node.getBoundingClientRect().top-root.getBoundingClientRect().top;
 listeners.add(root);
 root.addEventListener("click",event=>{
  const g=event.target.closest("[data-gene-grade]");
  if(g){event.stopPropagation();if(g.getAttribute("aria-disabled")!=="true")root.__geneActions?.onAdjust?.(g.dataset.geneId,Number(g.dataset.geneGrade));return;}
  const node=event.target.closest("[data-gene-id]");
  if(node)root.__geneActions?.onSelect?.(node.dataset.geneId,nodePosition(node));
 });
 root.addEventListener("keydown",event=>{
  if(event.key!=="Enter"&&event.key!==" ")return;
  const node=event.target.closest("[data-gene-grade],[data-gene-id]");if(!node)return;
  event.preventDefault();
  const button=node.closest("[data-gene-grade]");
  if(button){if(button.getAttribute("aria-disabled")!=="true")root.__geneActions?.onAdjust?.(button.dataset.geneId,Number(button.dataset.geneGrade));}
  else root.__geneActions?.onSelect?.(node.dataset.geneId,nodePosition(node));
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
function render(root,{skills=[],branches=[],affinity={},selected="",filter="related",query="",showFuture=false,edit=false,onSelect=()=>{},onAdjust=()=>{}}={}){
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
 const height=position(all,branches),cam=getCamera(root);
 root.innerHTML=draw(visible,height,selected,affinity,branches,edit,cam);
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
