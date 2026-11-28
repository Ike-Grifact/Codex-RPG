/* Codex Genético — fontes no centro e ao redor; ramificações só quando acessíveis.
 * Ligações são afinidades temáticas, nunca pré-requisitos automáticos. */
(function(){"use strict";
const W=3400,BASE_Y=630,ROW=112,SOURCE_CENTER_X=1700;
// Os quatro anéis laterais envolvem as fontes centrais; o layout não altera afinidades ou requisitos.
const GRADE_MAX=6;
// Mesmos traços poliédricos de dieIcon() no criador: mantém identidade do rolador.
const DICE_SHAPES={
 4:'<polygon points="21,4 39,36 3,36"/><path d="M21 4 L21 27 L3 36 M21 27 L39 36"/>',
 6:'<polygon points="21,3 37,12 37,30 21,39 5,30 5,12"/><path d="M5 12 L21 21 L37 12 M21 21 L21 39"/>',
 10:'<polygon points="21,2 35,14 32,32 21,40 10,32 7,14"/><path d="M7 14 L21 9 L35 14 M21 9 L21 40 M7 14 L21 25 L35 14 M21 25 L10 32 M21 25 L32 32"/>',
 12:'<polygon points="21,2 35,8 40,21 34,34 21,40 8,34 2,21 7,8"/><path d="M21 9 L31 16 L28 29 L14 29 L11 16 Z M21 2 L21 9 M35 8 L31 16 M40 21 L31 16 M34 34 L28 29 M21 40 L28 29 M8 34 L14 29 M2 21 L11 16 M7 8 L11 16"/>'
};
function dnaStrands(){
 const center=SOURCE_CENTER_X,left=[],right=[];let rungs='';
 for(let i=0;i<=75;i++){
  const y=(BASE_Y-55)+i*9.1,offset=78*Math.sin(i*9.1*2*Math.PI/270);
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
const getCamera=root=>{if(!cameras.has(root))cameras.set(root,{zoom:1,x:0,y:0,initialized:false});return cameras.get(root);};
// Famílias visuais com identificadores estáveis para futuros ícones.
// Afinidade temática não substitui os requisitos de skillReq().
// Pictogramas são apenas apresentação; não alteram o modelo de perícias.
const GENE_SKILL_PICTOGRAMS=Object.freeze({
 "armas-leves":"arma-adaga","armas-medias":"arma-espada","armas-pesadas":"arma-montante","maestria-martelos":"arma-montante",
 "armas-longo-alcance":"arma-arco","maestria-arremesso-armas":"arma-arremesso",
 "armas-fogo":"arma-pistola","pugilismo":"arma-punhos",
 "maestria-armas-fogo":"arma-pistola","maestria-punhos":"arma-punhos",
 "maestria-espadas":"arma-espada","maestria-adagas":"arma-adaga",
 "maestria-machados":"arma-montante",
 "maestria-hastes":"arma-lanca","maestria-cajados":"arma-lanca",
 "maestria-arcos":"arma-arco","maestria-bestas":"arma-arco",
 "maestria-arremessos":"arma-arremesso","maestria-longo-alcance":"arma-arco",
 "criar-item-foco-magia":"magia-foco","escudo-arcano":"armadura-escudo-arcano",
 "maestria-escudos":"armadura-escudo","escudo-bumerangue":"arma-arremesso",
  "sacrificio-heroico":"armadura-escudo","escudo-refletor":"armadura-escudo","sentido-elemental":"magia-circulo","deteccao-elemental":"magia-circulo",
 "improviso":"magia-circulo","invocacao-elemental":"magia-circulo",
  "cancelar-magia":"magia-circulo","mudanca-elemental":"magia-transformacao","desencantar":"magia-circulo","espelho-magico":"armadura-escudo-arcano",
 "maos-leves":"categoria-furtividade","pericia-armadilha":"categoria-furtividade","golpe-furtivo":"arma-adaga",
 "bioetica":"categoria-natureza","pesquisa-avancada-pocoes":"magia-circulo",
 "corpo-fechado":"arma-punhos","dilema":"arma-punhos","impacto-psiquico":"magia-circulo",
 "invocar-esfera-espiritual":"magia-circulo","passo-etereo":"magia-circulo",
 "absorver-esferas":"magia-circulo","disparo-esferas-espirituais":"magia-circulo",
 "pericia-druidica":"categoria-natureza","transformacao-elemental":"magia-transformacao",
 "fogo":"elemento-fogo","agua":"elemento-agua","vento":"elemento-ar","terra":"elemento-terra",
 "sagrado":"elemento-sagrado","sangue":"elemento-sangue","trevas":"elemento-trevas","veneno":"elemento-veneno"
});
// Cada Perícia visualmente ativa pertence a uma única constelação temática.
// Esta classificação é independente do catálogo e NÃO é pré-requisito de compra.
const GENE_CONSTELLATIONS=[
 {id:"escudos",label:"ESCUDOS FÍSICOS",column:0,skills:["maestria-escudos","escudo-refletor","escudo-bumerangue","sacrificio-heroico"]},
 {id:"armas",label:"ARMAS E MANEJO",column:0,skills:["armas-leves","armas-medias","armas-pesadas","maestria-martelos","maestria-adagas","maestria-espadas","maestria-machados","maestria-hastes","maestria-cajados","disciplina-avancada","manejo-perfeito","maestria-manejo-duplo"]},
 {id:"corporal",label:"CORPO A CORPO",column:0,skills:["pugilismo","maestria-punhos","artista-marcial","golpe-fulminante","espalhar-golpe","golpe-baixo","corpo-fechado","dilema"]},
 {id:"furtividade",label:"FURTIVIDADE",column:0,skills:["furtividade","furtividade-avancada","maos-leves","golpe-furtivo","pericia-armadilha"]},
 {id:"disparos",label:"ARMAS DE LONGO ALCANCE",column:0,skills:["armas-longo-alcance","olhos-de-aguia","maestria-arcos","maestria-bestas","maestria-longo-alcance","maestria-arremesso-armas","maestria-arremessos","disparo-fulminante","disparo-multiplo","disparo-violento","disparo-tatico","armas-fogo","maestria-armas-fogo"]},
 {id:"cavalaria",label:"CAVALARIA E MONTARIAS",column:0,skills:["montar","pericia-montaria","montaria-epica"]},
 {id:"conjuracao",label:"CONJURAÇÃO",column:1,skills:["criar-item-foco-magia","encantar-com-elemento","escudo-arcano","conjuracao-equilibrada","concentracao-refinada","cancelar-magia","desencantar","espelho-magico"]},
 {id:"elementos",label:"ELEMENTOS",column:1,skills:["fogo","agua","vento","terra","sagrado","veneno","sangue","trevas","improviso","mestre","invocacao-elemental","transformacao-elemental","mudanca-elemental","sentido-elemental","deteccao-elemental"]},
 {id:"psiquico",label:"PSÍQUICO E ESFERAS",column:1,skills:["invocar-esfera-espiritual","passo-etereo","absorver-esferas","disparo-esferas-espirituais","impacto-psiquico"]},
 {id:"natureza",label:"NATUREZA E DRUIDISMO",column:1,skills:["domar-criatura-pequena","domar-criatura-media","domar-criatura-grande","pericia-druidica"]},
 {id:"alquimia",label:"ALQUIMIA E POÇÕES",column:1,skills:["alquimia-avancada","criar-veneno","criar-antidoto","pesquisa-avancada-pocoes","bioetica","transfusao","transfusao-sanguinaria"]},
 {id:"apresentacao",label:"APRESENTAÇÃO E BARDO",column:2,skills:["apresentacao-avancada","pericia-em-instrumentos","maestria-em-apresentacao","voz-encantadora"]},
 {id:"artesao",label:"ARTESÃO E FORJA",column:2,skills:["artesao-avancado","ferreiro","ferreiro-elemental","resistencia-a-fogo"]},
 {id:"coleta",label:"COLETA",column:2,skills:["coleta-avancada"]},
 {id:"recuperacao",label:"RECUPERAÇÃO E SOBREVIVÊNCIA",column:2,skills:["medicina-avancada","recuperacao-vigorosa","recuperacao-movimento","instinto-sobrevivencia","recobrar-coragem"]},
 {id:"conhecimentos-avancados",label:"CONHECIMENTOS AVANÇADOS",column:2,skills:["protecao-avancada","astronomia-avancada","engenharia-avancada","erudicao-avancada"]},
 {id:"influencia",label:"INFLUÊNCIA E INTERAÇÃO",column:2,skills:["provocacao-sofisticada"]},
 {id:"atletismo",label:"ATLETISMO",column:2,skills:["atletismo-avancado"]}
];
// Duas faixas de constelações de cada lado das fontes centrais.
// Em vez de um catálogo muito comprido abaixo da ficha, os ramos envolvem a hélice
// e são distribuídos por afinidade, com alturas proporcionais ao número de nós.
// Famílias maiores permanecem nas laterais; quatro grupos ocupam os espaços
// acima e abaixo das fontes, fechando o anel sem cobrir as cartas centrais.
const ORBIT_LANES=Object.freeze([
 {x:44,ids:["armas","corporal","furtividade"]},
 {x:590,ids:["disparos","conjuracao","elementos"]},
 {x:2290,ids:["natureza","alquimia","apresentacao","artesao","coleta"]},
 {x:2836,ids:["conhecimentos-avancados","influencia","atletismo"]}
]);
const ORBIT_ARCS=Object.freeze([
 {id:"escudos",x:1150,y:240,side:"top"},
 {id:"psiquico",x:1740,y:240,side:"top"},
 {id:"cavalaria",x:1150,y:1360,side:"bottom"},
 {id:"recuperacao",x:1740,y:1360,side:"bottom"}
]);
const ORBIT_WIDTH=520,ORBIT_ROW=112,ORBIT_GAP=24;
function position(nodes,branches=[]){
 const byId=new Map(nodes.map(n=>[n.id,n]));
 const sourceCenters={attr:SOURCE_CENTER_X,know:1320,practice:2080};
 for(const [group,items] of [["attr",baseAttr],["know",baseKnow],["practice",basePractice]]){
  for(const [i,key] of items.entries()){
   const node=byId.get(group+":"+key);
   if(node){node.x=sourceCenters[group];node.y=BASE_Y+i*ROW;}
  }
 }
 // Cada Perícia pertence a uma única constelação. As famílias sem nós visíveis
 // permanecem fora do SVG, mas os espaços de sua órbita são preservados.
 const seen=new Set();
 const definitions=GENE_CONSTELLATIONS.map(def=>{
  const members=def.skills.filter(id=>!seen.has(id)&&byId.get(id)?.type==="skill").map(id=>{seen.add(id);return byId.get(id);});
  return {...def,nodes:members};
 });
 const unknown=nodes.filter(n=>n.type==="skill"&&!seen.has(n.id)).sort((a,b)=>a.name.localeCompare(b.name,"pt-BR"));
 if(unknown.length)definitions.push({id:"outros",label:"OUTRAS PERÍCIAS",nodes:unknown});
 const byFamily=new Map(definitions.map(def=>[def.id,def]));
 const rowsFor=def=>Math.max(1,Math.ceil(def.skills?.length?def.skills.length/3:def.nodes.length/3));
 const heightFor=def=>166+(rowsFor(def)-1)*ORBIT_ROW;
 const centerY=BASE_Y+ROW*2.5,groups=[];
 let bottom=BASE_Y+ROW*6+140;
 for(const lane of ORBIT_LANES){
  const defs=lane.ids.map(id=>byFamily.get(id)).filter(Boolean);
  const total=defs.reduce((sum,def)=>sum+heightFor(def),0)+Math.max(0,defs.length-1)*ORBIT_GAP;
  let top=Math.max(44,Math.round(centerY-total/2));
  for(const family of defs){
   const fullHeight=heightFor(family);
   const visible=family.nodes;
   if(visible.length){
    visible.forEach((node,i)=>{
     const row=Math.floor(i/3),count=Math.min(3,visible.length-row*3),inRow=i-row*3;
     node.x=Math.round(lane.x+ORBIT_WIDTH/2+(inRow-(count-1)/2)*160);
     node.y=top+88+row*ORBIT_ROW;
     node.geneFamily=family.id;
    });
    const activeHeight=Math.min(fullHeight,166+(Math.ceil(visible.length/3)-1)*ORBIT_ROW);
    groups.push({id:family.id,label:family.label,x:lane.x,y:top,width:ORBIT_WIDTH,height:activeHeight,nodes:visible});
   }
   top+=fullHeight+ORBIT_GAP;
  }
  bottom=Math.max(bottom,top);
 }
 // Arcos superior e inferior aproveitam o espaço vertical antes vazio.
 // Mesmos tamanhos de nó e mesmo cálculo de posição das faixas laterais.
 for(const slot of ORBIT_ARCS){
  const family=byFamily.get(slot.id);
  if(!family)continue;
  const visible=family.nodes,fullHeight=heightFor(family);
  if(!visible.length)continue;
  visible.forEach((node,i)=>{
   const row=Math.floor(i/3),count=Math.min(3,visible.length-row*3),inRow=i-row*3;
   node.x=Math.round(slot.x+ORBIT_WIDTH/2+(inRow-(count-1)/2)*160);
   node.y=slot.y+88+row*ORBIT_ROW;
   node.geneFamily=family.id;
  });
  const activeHeight=Math.min(fullHeight,166+(Math.ceil(visible.length/3)-1)*ORBIT_ROW);
  groups.push({id:family.id,label:family.label,x:slot.x,y:slot.y,width:ORBIT_WIDTH,
   height:activeHeight,nodes:visible,orbitSide:slot.side});
  bottom=Math.max(bottom,slot.y+activeHeight+ORBIT_GAP);
 }
 if(unknown.length){
  const x=W/2-ORBIT_WIDTH/2,y=bottom+20,rows=Math.ceil(unknown.length/3);
  unknown.forEach((node,i)=>{const row=Math.floor(i/3),count=Math.min(3,unknown.length-row*3);
   node.x=Math.round(x+ORBIT_WIDTH/2+(i-row*3-(count-1)/2)*160);
   node.y=y+88+row*ORBIT_ROW;node.geneFamily="outros";
  });
  const height=166+(rows-1)*ORBIT_ROW;
  groups.push({id:"outros",label:"OUTRAS PERÍCIAS",x,y,width:ORBIT_WIDTH,height,nodes:unknown});
  bottom=y+height+ORBIT_GAP;
 }
 return {height:Math.max(1800,bottom+35),groups};
}
function edge(a,b,cls){
 if(!a||!b)return"";
 // Curvas suaves, apenas em conexões selecionadas. Evita cruzamento permanente em massa.
 const x=(a.x+b.x)/2;
 return '<path data-gene-from="'+esc(a.id)+'" data-gene-to="'+esc(b.id)+'" class="fp-gene-relation '+cls+'" d="M'+a.x+' '+a.y+' C'+x+' '+a.y+' '+x+' '+b.y+' '+b.x+' '+b.y+'"/>';
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
 const xpBand=["discount","elevated"].includes(n.xpBand)?n.xpBand:"normal";
 const xpMarker=xpBand==="normal"?"":'<g class="fp-gene-racial-mark is-'+xpBand+'" aria-hidden="true">'+
  '<circle cx="'+(x+width-7)+'" cy="'+(y+9)+'" r="13"/>'+
  '<text x="'+(x+width-7)+'" y="'+(y+14)+'" text-anchor="middle">'+(xpBand==="discount"?"↓":"↑")+'</text></g>';
 const canDown=edit&&n.previewGrade>(n.minGrade||0);
 const canUp=edit&&n.previewGrade<GRADE_MAX&&n.canRaise;
 const makeButton=(delta,enabled,posX,text,aria)=>
  '<g role="button" tabindex="'+(enabled?'0':'-1')+'" class="fp-gene-grade-button'+(enabled?'':' is-disabled')+
  '" data-gene-grade="'+delta+'" data-gene-id="'+esc(n.id)+'" aria-label="'+aria+'" aria-disabled="'+(!enabled)+'">'+
  '<rect x="'+posX+'" y="'+(n.y+4)+'" width="32" height="29" rx="8"/>'+
  '<text x="'+(posX+16)+'" y="'+(n.y+25)+'" text-anchor="middle">'+text+'</text></g>';
 const control=edit?makeButton(-1,canDown,x+14,"−","Diminuir "+label)+
  makeButton(1,canUp,x+width-46,"+","Aumentar "+label):"";
 return '<g class="fp-gene-node fp-gene-card type-'+c+(n.selected?' is-selected':'')+(pending?' is-pending':'')+
  (xpBand==="normal"?"":" is-xp-"+xpBand)+
  '" data-gene-id="'+esc(n.id)+'" data-racial-xp="'+xpBand+'" role="button" tabindex="0" aria-label="'+label+' grau '+(n.previewGrade??n.grade)+(xpBand==="normal"?"":"; "+esc(n.xpLabel||"XP racial diferenciado"))+'">'+
  '<title>'+label+' — '+esc(n.label||"")+(xpBand==="normal"?"":" — "+esc(n.xpLabel||"XP racial diferenciado"))+'</title>'+
  '<rect class="fp-gene-card-fill" x="'+x+'" y="'+y+'" width="'+width+'" height="'+height+'" rx="13"/>'+
  '<text class="fp-gene-card-title" x="'+(x+18)+'" y="'+(y+28)+'">'+label+'</text>'+
  '<text class="fp-gene-card-grade" x="'+(x+width-18)+'" y="'+(y+27)+'" text-anchor="end">GRAU '+(n.previewGrade??n.grade)+(n.minGrade?' · ORIGEM':'')+(pending?' *':'')+'</text>'+
  '<line class="fp-gene-card-separator" x1="'+(x+17)+'" x2="'+(x+width-17)+'" y1="'+(y+38)+'" y2="'+(y+38)+'"/>'+
  control+dice+xpMarker+'</g>';
}
function splitSkillLabel(name,maxChars){
 const original=String(name||"").trim();
 // Montar Animal (Vantagem) e Perícia em Montaria (+1A) são Perícias distintas;
 // não esconder o prefixo de Perícia em Montaria, como acontecia no mapa.
 // No grafo o nome completo permanece no title e aria-label; o rótulo curto
 // evita repetir "Especialização em Armas" e sobrepor famílias vizinhas.
 const weaponFamily=/^Especialização em Armas(?:\s+—\s+|\s+de\s+|\s+)(.+)$/i.exec(original);
 const compact=weaponFamily?weaponFamily[1]:/^Perícia em Montaria$/i.test(original)?original:original
  .replace(/^Perícia em Elemento\s+/i,"Elemento ")
  .replace(/^Perícia em\s+/i,"").replace(/^Perícia\s+/i,"");
 const parts=compact.split(/\s+/),lines=[];let current="";
 for(const word of parts){
  const next=current?current+" "+word:word;
  if(current&&next.length>maxChars){lines.push(current);current=word;}
  else current=next;
 }
 if(current)lines.push(current);
 if(lines.length>2){
  const tail=lines.slice(1).join(" ");
  lines.splice(1,lines.length-1,tail.length>maxChars?tail.slice(0,maxChars-1)+"…":tail);
 }
 return lines.length?lines:[""];
}
function skill(n){
 // Letras pequenas e em até duas linhas; full name no title e aria-label.
 const lines=splitSkillLabel(n.name,16);
 const label=lines.map((line,i)=>'<tspan x="'+n.x+'" dy="'+(i?18:0)+'">'+esc(line)+'</tspan>').join("");
 const pictogram=GENE_SKILL_PICTOGRAMS[n.id];
 const smallIcon=pictogram?
  '<image class="fp-gene-skill-pictogram" href="../assets/icons/codex/'+pictogram+'.svg" x="'+(n.x-16)+'" y="'+(n.y-16)+'" width="32" height="32" pointer-events="none" aria-hidden="true"/>':"";
 return '<g class="fp-gene-node fp-gene-skill is-'+n.state+(n.selected?' is-selected':'')+'" data-gene-id="'+esc(n.id)+'" data-gene-family="'+esc(n.geneFamily||"outros")+'" data-gene-icon-key="'+esc(n.id)+'" role="button" tabindex="0" aria-label="'+esc(n.name)+' '+(n.state==="owned"?"adquirida":n.state==="available"?"disponível":n.state==="potential"?"XP suficiente, requisitos pendentes":"ramificação futura")+'">'+
  '<title>'+esc(n.name+' — '+(n.label||""))+'</title>'+
  '<circle class="fp-gene-skill-hit" cx="'+n.x+'" cy="'+n.y+'" r="35"/>'+
  '<circle class="fp-gene-dot" cx="'+n.x+'" cy="'+n.y+'" r="20"/>'+smallIcon+
  '<text class="fp-gene-node-label" x="'+n.x+'" y="'+(n.y+39)+'" text-anchor="middle">'+label+'</text></g>';
}
function draw(nodes,height,selected,affinity,branches,groups,edit,camera){
 const byId=new Map(nodes.map(n=>[n.id,n]));
 let svg='<svg class="fp-gene-svg fp-gene-overview" viewBox="0 0 '+W+' '+height+'" role="img" aria-label="Codex Genético: Atributos, Conhecimentos e Práticas no centro, cercados por constelações temáticas de Perícias.">'+
  '<defs><pattern id="codex-gene-dots" width="28" height="28" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="currentColor" opacity=".11"/></pattern></defs>'+
  '<rect width="'+W+'" height="'+height+'" fill="url(#codex-gene-dots)"/>'+
  '<g class="fp-gene-viewport" transform="translate('+camera.x+' '+camera.y+') scale('+camera.zoom+')">'+
  '<ellipse class="fp-gene-orbit-guide" cx="'+SOURCE_CENTER_X+'" cy="'+(BASE_Y+ROW*2.5)+'" rx="620" ry="515"/>'+
  '<text class="fp-gene-column-title is-know" x="1320" y="'+(BASE_Y-78)+'" text-anchor="middle">CONHECIMENTOS</text>'+
  '<text class="fp-gene-column-title is-attr" x="'+SOURCE_CENTER_X+'" y="'+(BASE_Y-78)+'" text-anchor="middle">ATRIBUTOS</text>'+
  '<text class="fp-gene-column-title is-practice" x="2080" y="'+(BASE_Y-78)+'" text-anchor="middle">PRÁTICAS</text>'+
  dnaStrands();
 // Regiões da constelação e seus traços internos. Conexões são afinidades,
 // não uma exigência de comprar a Perícia anterior.
 for(const family of groups){
  svg+='<g class="fp-gene-constellation" data-gene-family="'+esc(family.id)+'" aria-hidden="true">'+
   '<rect class="fp-gene-constellation-border" x="'+(family.x+6)+'" y="'+(family.y+4)+'" width="'+(family.width-12)+'" height="'+(family.height-10)+'" rx="26"/>'+
   '<image class="fp-gene-constellation-icon" href="../assets/icons/codex/categoria-'+family.id+'.svg" x="'+(family.x+20)+'" y="'+(family.y+14)+'" width="34" height="34" pointer-events="none" aria-hidden="true"/>'+
   '<line class="fp-gene-constellation-cap" x1="'+(family.x+22)+'" x2="'+(family.x+66)+'" y1="'+(family.y+55)+'" y2="'+(family.y+55)+'"/>'+
   '<text class="fp-gene-constellation-title" x="'+(family.x+65)+'" y="'+(family.y+34)+'">'+esc(family.label)+'</text></g>';
  const members=family.nodes;
  members.forEach((n,i)=>{
   if(i%3>0&&Math.floor(i/3)===Math.floor((i-1)/3)){
    const prev=members[i-1],active=selected===prev.id||selected===n.id;
    svg+=edge(prev,n,"fp-gene-skill-link"+(active?" is-related":""));
   }
   if(i>=3){
    const prev=members[i-3],active=selected===prev.id||selected===n.id;
    // Domar e Druídica ocupam a mesma área temática, mas são ramos independentes.
    if(family.id!=="natureza"||(![prev.id,n.id].includes("pericia-druidica")))
     svg+=edge(prev,n,"fp-gene-skill-link"+(active?" is-related":""));
   }
  });
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
 svg+='<text class="fp-gene-column-title is-skills" x="'+SOURCE_CENTER_X+'" y="'+(BASE_Y+ROW*6+3)+'" text-anchor="middle">PERÍCIAS · ÓRBITAS TEMÁTICAS</text>';
 if(!skills.length)svg+='<text class="fp-gene-empty-text" x="'+SOURCE_CENTER_X+'" y="'+(BASE_Y+ROW*6+170)+'" text-anchor="middle">Nenhuma Perícia disponível. Desenvolva fontes ou mostre as futuras.</text>';
 for(const n of skills)svg+=skill({...n,selected:n.id===selected});
 return svg+'</g></svg>';
}
const MIN_ZOOM=.55,MAX_ZOOM=12;
function canvasSvg(root){return root?.querySelector(".fp-gene-overview");}
function svgPoint(root,clientX,clientY){
 const svg=canvasSvg(root);
 if(!svg)return{x:W/2,y:500};
 const matrix=svg.getScreenCTM?.();
 if(matrix&&svg.createSVGPoint){
  const p=svg.createSVGPoint();p.x=clientX;p.y=clientY;
  return p.matrixTransform(matrix.inverse());
 }
 const rect=svg.getBoundingClientRect(),vb=svg.viewBox.baseVal;
 return {x:(clientX-rect.left)*vb.width/Math.max(rect.width,1),
  y:(clientY-rect.top)*vb.height/Math.max(rect.height,1)};
}
function syncCanvas(root){
 const svg=canvasSvg(root);if(!svg)return;
 // O mapa usa uma janela real. Todo o grafo continua no SVG e é visitável por arraste.
 const w=root.clientWidth,h=root.clientHeight;
 if(w&&h)svg.setAttribute("viewBox","0 0 "+W+" "+(W*h/w));
 const cam=getCamera(root);
 if(!cam.initialized&&w&&h){
  cam.initialized=true;
  cam.zoom=clamp(W/w*(w<620?.76:.62),MIN_ZOOM,MAX_ZOOM);
  // Inicializar sobre as fontes centrais, com constelações ao redor.
  // O seletor de ramo evita ter de aproximar ou afastar manualmente tudo.
  const screenH=W*h/w;
  cam.x=W/2-SOURCE_CENTER_X*cam.zoom;
  cam.y=screenH/2-(BASE_Y+ROW*2.5)*cam.zoom;
 }
}
function applyTransform(root){
 const cam=getCamera(root),v=root.querySelector(".fp-gene-viewport");
 const rounded=n=>Math.abs(n)<1e-7?"0":String(Number(n.toFixed(4)));
 if(v)v.setAttribute("transform","translate("+rounded(cam.x)+" "+rounded(cam.y)+") scale("+rounded(cam.zoom)+")");
 const label=root.querySelector("[data-gene-scale]");
 if(label)label.textContent=Math.round(cam.zoom*100)+"%";
}
function zoomAt(root,factor,clientX,clientY){
 const cam=getCamera(root),newZoom=clamp(cam.zoom*factor,MIN_ZOOM,MAX_ZOOM);
 if(newZoom===cam.zoom)return;
 const cursor=svgPoint(root,clientX,clientY),ratio=newZoom/cam.zoom;
 cam.x=cursor.x-(cursor.x-cam.x)*ratio;
 cam.y=cursor.y-(cursor.y-cam.y)*ratio;
 cam.zoom=newZoom;
 applyTransform(root);
}
// Acesso rápido às constelações sem perder zoom, arraste nem seleção existente.
function jumpToFamily(root,id){
 const family=(root.__geneFamilies||[]).find(g=>g.id===id),svg=canvasSvg(root);
 if(!family||!svg)return;
 const box=svg.viewBox.baseVal,cam=getCamera(root),isMobile=root.clientWidth<620;
 const target=isMobile?8:7;
 const fitX=box.width/(family.width+60),fitY=box.height/(family.height+90);
 cam.zoom=clamp(Math.min(target,fitX,fitY),MIN_ZOOM,MAX_ZOOM);
 cam.x=box.width/2-(family.x+family.width/2)*cam.zoom;
 cam.y=box.height/2-(family.y+family.height/2)*cam.zoom;
 applyTransform(root);
}
function panBy(root,fromX,fromY,toX,toY){
 const cam=getCamera(root),a=svgPoint(root,fromX,fromY),b=svgPoint(root,toX,toY);
 cam.x+=b.x-a.x;cam.y+=b.y-a.y;applyTransform(root);
}
function centerOf(root){
 const r=canvasSvg(root)?.getBoundingClientRect()||root.getBoundingClientRect();
 return{x:r.left+r.width/2,y:r.top+r.height/2};
}
function resetView(root){
 const cam=getCamera(root);
 cam.initialized=false;
 syncCanvas(root);
 applyTransform(root);
}
function bind(root){
 if(listeners.has(root))return;
 listeners.add(root);
 root.tabIndex=0;
 root.setAttribute("aria-keyshortcuts","ArrowUp ArrowDown ArrowLeft ArrowRight + - 0");
 const nodePosition=node=>node.getBoundingClientRect().top-root.getBoundingClientRect().top;
 root.addEventListener("change",event=>{const picker=event.target.closest("[data-gene-family-jump]");if(picker){if(picker.value==="fontes")resetView(root);else jumpToFamily(root,picker.value);picker.value="";}});
 const pointers=new Map(),handledTouchNav=new WeakSet();
 let pinch=null,dragging=false,suppressClick=false;
 const setMoving=value=>{dragging=value;root.classList.toggle("is-dragging",value);};
 const midpoint=()=>{
  const list=[...pointers.values()].slice(0,2),p=list[0],q=list[1];
  return {x:(p.x+q.x)/2,y:(p.y+q.y)/2,dist:Math.hypot(p.x-q.x,p.y-q.y)};
 };
 const capture=id=>{try{root.setPointerCapture(id);}catch{}};
 const release=id=>{try{if(root.hasPointerCapture(id))root.releasePointerCapture(id);}catch{}};
 // O clique após arrastar não seleciona/compra acidentalmente um nó.
 root.addEventListener("click",event=>{
  if(!suppressClick)return;
  // Controles flutuantes são nova intenção; não herdar o bloqueio do arraste.
  if(event.target.closest("[data-gene-nav],[data-action=gene-future],[data-gene-family-jump]")){suppressClick=false;return;}
  event.preventDefault();event.stopImmediatePropagation();suppressClick=false;
 },true);
 root.addEventListener("click",event=>{
  const nav=event.target.closest("[data-gene-nav]");
  if(nav){event.stopPropagation();
   if(handledTouchNav.has(nav)){handledTouchNav.delete(nav);return;}
   zoom(root,Number(nav.dataset.geneNav));return;
  }
  const grade=event.target.closest("[data-gene-grade]");
  if(grade){event.stopPropagation();
   if(grade.getAttribute("aria-disabled")!=="true")root.__geneActions?.onAdjust?.(grade.dataset.geneId,Number(grade.dataset.geneGrade));
   return;
  }
  const node=event.target.closest("[data-gene-id]");
  if(node)root.__geneActions?.onSelect?.(node.dataset.geneId,nodePosition(node));
 });
 root.addEventListener("keydown",event=>{
  if(event.altKey||event.metaKey||event.ctrlKey||event.target.closest("input,textarea,select"))return;
  if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].includes(event.key)){
   event.preventDefault();
   const step=105/getCamera(root).zoom,cam=getCamera(root);
   if(event.key==="ArrowUp")cam.y+=step;
   if(event.key==="ArrowDown")cam.y-=step;
   if(event.key==="ArrowLeft")cam.x+=step;
   if(event.key==="ArrowRight")cam.x-=step;
   applyTransform(root);return;
  }
  if(event.key==="+"||event.key==="="||event.key==="-"){
   event.preventDefault();zoom(root,event.key==="-"?-1:1);return;
  }
  if(event.key==="0"||event.key==="Home"){event.preventDefault();zoom(root,0);return;}
  if(event.key!=="Enter"&&event.key!==" ")return;
  const node=event.target.closest("[data-gene-grade],[data-gene-id]");if(!node)return;
  event.preventDefault();
  const grade=node.closest("[data-gene-grade]");
  if(grade){if(grade.getAttribute("aria-disabled")!=="true")root.__geneActions?.onAdjust?.(grade.dataset.geneId,Number(grade.dataset.geneGrade));}
  else root.__geneActions?.onSelect?.(node.dataset.geneId,nodePosition(node));
 });
 root.addEventListener("pointerdown",event=>{
  // Um toque novo é uma nova intenção: não bloquear o botão após uma pinça.
  // O click originado no gesto anterior continua protegido até sua conclusão.
  if(!pointers.size)suppressClick=false;
  if(event.pointerType==="mouse"&&event.button!==0)return;
  if(event.target.closest("[data-gene-nav],[data-gene-grade],[data-gene-family-jump],[data-action=gene-future]"))return;
  pointers.set(event.pointerId,{x:event.clientX,y:event.clientY,downX:event.clientX,downY:event.clientY});
  if(pointers.size===2){
   pinch=midpoint();setMoving(true);
   for(const id of pointers.keys())capture(id);
  }else if(pointers.size===1&&!event.target.closest("[data-gene-id]"))capture(event.pointerId);
 });
 root.addEventListener("pointermove",event=>{
  const p=pointers.get(event.pointerId);if(!p)return;
  const oldX=p.x,oldY=p.y;p.x=event.clientX;p.y=event.clientY;
  if(pointers.size>=2){
   const next=midpoint();
   if(pinch&&pinch.dist>0&&next.dist>0){
    panBy(root,pinch.x,pinch.y,next.x,next.y);
    zoomAt(root,next.dist/pinch.dist,next.x,next.y);
   }
   pinch=next;setMoving(true);return;
  }
  if(!dragging&&Math.hypot(p.x-p.downX,p.y-p.downY)>5){
   setMoving(true);capture(event.pointerId);
  }
  if(dragging)panBy(root,oldX,oldY,p.x,p.y);
 });
 const endPointer=event=>{
  if(!pointers.has(event.pointerId))return;
  const wasMoving=dragging||!!pinch;
  pointers.delete(event.pointerId);release(event.pointerId);
  if(pointers.size>=2)pinch=midpoint();
  else if(pointers.size===1){
   pinch=null;
   const p=[...pointers.values()][0];p.downX=p.x;p.downY=p.y;
   setMoving(false);
  }else{pinch=null;setMoving(false);}
  if(wasMoving){
   suppressClick=true;
   // Click gerado após pointerup é síncrono; limpar se não houver clique.
   setTimeout(()=>{suppressClick=false;},0);
  }
 };
 root.addEventListener("pointerup",endPointer);
 // Em alguns navegadores móveis, a pinça suprime o click sintético seguinte.
 // Aplicar controles flutuantes também no pointerup tátil (sem duplicar em click).
 root.addEventListener("pointerup",event=>{
  if(event.pointerType!=="touch")return;
  const nav=event.target.closest("[data-gene-nav]");
  if(!nav)return;
  handledTouchNav.add(nav);
  zoom(root,Number(nav.dataset.geneNav));
  setTimeout(()=>handledTouchNav.delete(nav),450);
 });
 root.addEventListener("pointercancel",endPointer);
 root.addEventListener("lostpointercapture",event=>{
  if(!pointers.has(event.pointerId))return;
  pointers.delete(event.pointerId);
  if(!pointers.size){pinch=null;setMoving(false);}
 });
 root.addEventListener("wheel",event=>{
  if(event.target.closest("[data-gene-family-jump],[data-action=gene-future]"))return;
  if(!event.deltaY&&!event.deltaX)return;
  event.preventDefault();
  if(event.shiftKey&&event.deltaX)panBy(root,0,0,-event.deltaX,0);
  else zoomAt(root,Math.exp(-event.deltaY*.002),event.clientX,event.clientY);
 },{passive:false});
 root.addEventListener("dblclick",event=>{
  if(event.target.closest("[data-gene-grade],[data-gene-nav],[data-action=gene-future],[data-gene-family-jump]"))return;
  event.preventDefault();
  zoomAt(root,1.35,event.clientX,event.clientY);
 });
 // Uma única inscrição por mapa; posições recalculadas ao redimensionar a janela.
 if(typeof ResizeObserver!=="undefined"){
  const observer=new ResizeObserver(()=>{syncCanvas(root);applyTransform(root);});
  observer.observe(root);
 }
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
 const {height,groups}=position(visible,branches),cam=getCamera(root);
 root.__geneFamilies=groups;
 root.innerHTML=draw(visible,height,selected,affinity,branches,groups,edit,cam)+
  '<div class="fp-gene-gesture-hint" aria-hidden="true">Arraste para mover · Roda do mouse ou pinça para zoom</div>'+
  '<div class="fp-gene-family-jump"><label for="fp-gene-family-'+(root.id||"map")+'">Ir para ramo</label><select id="fp-gene-family-'+esc(root.id||"map")+'" data-gene-family-jump aria-label="Ir diretamente para um ramo temático do Codex Genético"><option value="">Escolher ramo…</option><option value="fontes">Fontes centrais</option>'+groups.map(g=>'<option value="'+esc(g.id)+'">'+esc(g.label)+'</option>').join("")+'</select></div>'+ 
  '<button type="button" class="fp-gene-future-float" data-action="gene-future" aria-pressed="'+showFuture+'" title="Mostrar ou ocultar Perícias futuras sem sair do mapa">'+(showFuture?'Ocultar futuras':'Mostrar futuras')+'</button>'+
  '<div class="fp-gene-nav-float" aria-label="Navegação do Codex Genético">'+
  '<button type="button" data-gene-nav="-1" aria-label="Afastar o mapa">−</button>'+
  '<button type="button" data-gene-nav="0" aria-label="Centralizar o mapa">⦿</button>'+
  '<button type="button" data-gene-nav="1" aria-label="Aproximar o mapa">+</button>'+
  '<span data-gene-scale aria-live="off">100%</span></div>';
 bind(root);
 syncCanvas(root);applyTransform(root);
}
function zoom(root,dir){
 if(!root)return;
 if(dir===0){resetView(root);return;}
 const center=centerOf(root);
 zoomAt(root,dir>0?1.2:1/1.2,center.x,center.y);
}
window.CodexGeneGraph={render,zoom};
})();
