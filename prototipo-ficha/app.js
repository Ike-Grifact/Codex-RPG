/* Codex RPG — protótipo HTML independente. Regras v0.26. Não afeta o criador atual. */
(function(){
"use strict";
const SAVE_KEY="codex-html-ficha-prototipo-v1",THEME_KEY="codex-html-ficha-tema-v1";
const A=[["forca","Força"],["agilidade","Agilidade"],["destreza","Destreza"],["inteligencia","Inteligência"],["influencia","Influência"],["vigor","Vigor"]];
const K=[["protecao","Proteção"],["astronomia","Astronomia"],["medicina","Medicina"],["alquimia","Alquimia"],["engenharia","Engenharia"],["erudicao","Erudição"]];
const P=[["armas_conjuracao","Armas ou Conjuração"],["atletismo","Atletismo"],["furtividade","Furtividade"],["artesao","Artesão"],["apresentacao","Apresentação"],["coleta","Coleta"]];
const GROUPS={attr:A,know:K,practice:P},SOURCE_PROPS={attr:"attributes",know:"knowledges",practice:"practices"};
const DICE_ATTR=[[4],[6],[6,6],[6,6,6],[6,6,10],[6,10,10],[10,10,10]];
const DICE_FORM=[[6],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
const FACES={
 4:[[0,0,0],[0,0,0],[0,0,1],[0,1,1]],
 6:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0]],
 10:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1]],
 12:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1],[1,2,1],[0,0,2]],
 20:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,1,0],[2,1,0],[2,1,1],[2,2,1],[2,2,1],[0,0,2],[2,2,0],[3,2,0],[4,2,0],[0,0,4],[4,2,0],[5,2,1],[6,2,1],[8,0,0]]
};
const AT_COST=[0,1,3,7,15,31,55];
const TRAIN_COST=[0,2,8,20,38,66,102];
const CREATE_BUDGET={attr:7,training:7,skills:5}; // EXPERIMENTAL.
const XP_LEVEL_REFERENCE=[0,19,31,46,64,86,110,137,167,200,235,271,309,349,391,434,478,523,569,616,664]; // EXPERIMENTAL, não fixa nível.
const SKILLS=[
 ["combate","Combate","+1A em combate pertinente.",1],
 ["armas","Armas 1","Habilita uma categoria de arma, inclusive Punhos.",2],
 ["marciais","Artes Marciais","Especialização em Punhos. Requisito provisório em playtest.",1],
 ["montar","Montar Animal","Requer Influência grau 2.",2],
 ["combinacao","Combinação de Fontes","Habilita propor a terceira fonte pertinente.",2],
 ["aprendiz","Aprendiz de Conjurador","Conjuração inicial com Psique, sem segunda Prática.",2],
 ["magia","Magia Única","Criar uma magia inicial do Grau permitido.",1],
 ["peritoconj","Perito Conjurador","Combinação pertinente à Conjuração.",2],
 ["improviso","Improviso Mágico","Usa elemento disponível na cena.",1],
 ["mestre","Mestre Elementalista","Segundo elemento custa 1A; +1A em conjuração.",5],
 ["fogo","Elemento: Fogo","Habilitação de Fogo.",1],
 ["agua","Elemento: Água","Habilitação de Água.",1],
 ["raio","Elemento: Raio","Habilitação de Raio.",1],
 ["vento","Elemento: Vento","Habilitação de Vento.",1],
 ["terra","Elemento: Terra","Habilitação de Terra.",1],
 ["sagrado","Magia Sagrada","Recuperação de Coragem sob condições.",3],
 ["veneno","Magia de Veneno","Penalidades sob condições.",3],
 ["sangue","Magia de Sangue","Magia Grau 2 ainda não disponível.",3],
 ["trevas","Magia de Trevas","Magia Grau 2 ainda não disponível.",3],
 ["arma-certa","Maestria Arma Certa","+1E com peso favorável. Custo de XP pendente.",null]
];
const WEIGHTS={muito_leve:["Muito leve",.0125],leve:["Leve",.125],medio:["Médio",.5],alto:["Alto / Pesado",1],extremo:["Extremo",2]};
const SITUATIONS={normal:["Normal",0,0],vantagem:["Vantagem (+1A)",0,1],desvantagem:["Desvantagem (−1A)",0,-1],absoluta:["Vantagem absoluta (+1E)",1,0],desv_absoluta:["Desvantagem absoluta (−1E)",-1,0],sorte:["Ação de Sorte (−2E)",-2,0]};
const $=id=>document.getElementById(id),esc=x=>String(x??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const clamp=(v,min,max)=>Math.min(max,Math.max(min,Number(v)||0));
const key=x=>x?x.group+"."+x.key:"";
const same=(a,b)=>!!a&&!!b&&key(a)===key(b);
const pad=n=>Number(n).toLocaleString("pt-BR",{maximumFractionDigits:4});
const getId=()=>typeof crypto!=="undefined"&&crypto.randomUUID?crypto.randomUUID():"item-"+Date.now()+"-"+Math.floor(Math.random()*1e6);
function defaultState(){return{
 schema:"codex-html-playtest-v1",name:"",concept:"",origin:"Humano",virtue:"",personality:"",portrait:"",
 level:1,attributes:{},knowledges:{},practices:{},skills:[],weaponFocus:"leve",creationLocked:false,
 xpEarned:0,xpHistory:[],life:3,courage:10,pp:0,xp:0,
 items:[],notes:"",pending:null,history:[],courageUsedTurn:false
};}
let state=defaultState(),draft=null,toastTimer=null;
const freshDraft=()=>({base:null,attribute:null,third:null,mode:"normal",de:1,situation:"normal",
  extraKeep:false,step:false,combatBonus:false,weightEnabled:false,attackWeight:"leve",targetWeight:"medio",
  contextOK:false});
function load(){
 try{const saved=localStorage.getItem(SAVE_KEY);if(saved)state=normalize(JSON.parse(saved));}catch(e){console.warn("Codex: armazenamento indisponível",e);}
 draft=freshDraft();
 document.documentElement.dataset.theme=localStorage.getItem(THEME_KEY)==="light"?"light":"dark";
 syncFields();render();
}
function normalize(v){
 const s=defaultState();
 if(!v||typeof v!=="object")return s;
 for(const id of ["name","concept","origin","virtue","personality","notes"]){
  if(typeof v[id]==="string")s[id]=v[id].slice(0,id==="notes"?5000:100);
 }
 if(typeof v.portrait==="string"&&v.portrait.startsWith("data:image/")&&v.portrait.length<1600000)s.portrait=v.portrait;
 s.level=clamp(Math.floor(v.level||1),1,20);
 for(const group of Object.keys(GROUPS)){
  for(const [id] of GROUPS[group])s[SOURCE_PROPS[group]][id]=clamp(Math.floor(v[SOURCE_PROPS[group]]?.[id]||0),0,6);
 }
  s.skills=[...new Set(Array.isArray(v.skills)?v.skills.filter(x=>SKILLS.some(y=>y[0]===x&&Number.isInteger(y[3]))):[])];
 s.weaponFocus=["leve","medio","pesado","distancia","Punhos"].includes(v.weaponFocus)?v.weaponFocus:"leve";
 s.xpEarned=clamp(Math.floor(v.xpEarned??v.xp??0),0,1000000);
 s.creationLocked=!!v.creationLocked||s.level>1;
 s.xpHistory=Array.isArray(v.xpHistory)?v.xpHistory.slice(0,60).map(x=>({
  at:String(x.at||"").slice(0,40),amount:clamp(Math.floor(x.amount),0,1000000),note:String(x.note||"").slice(0,100)
 })):[];
 s.life=clamp(Math.floor(v.life),0,maxLife(s));
 s.courage=clamp(Math.floor(v.courage??10),0,10);
 s.pp=clamp(Math.floor(v.pp),0,maxPP(s.level));
 s.xp=clamp(Math.floor(v.xp),0,1e9);
 s.items=Array.isArray(v.items)?v.items.slice(0,150).map(item=>normalizeItem(item)):[];
 s.history=Array.isArray(v.history)?v.history.slice(0,20):[];
 s.courageUsedTurn=!!v.courageUsedTurn;
 if(v.pending&&Array.isArray(v.pending.dice)&&Array.isArray(v.pending.selected)&&v.pending.dice.length<=9){
  s.pending={...v.pending,selected:v.pending.selected.filter(x=>typeof x==="string")};
 }
 return s;
}
function normalizeItem(it={}){
 const type=["arma","armadura","escudo","foco","ferramenta","outro"].includes(it.type)?it.type:"outro";
 const weight=Object.hasOwn(WEIGHTS,it.weight)?it.weight:"leve";
 const grade=clamp(Math.floor(it.grade??1),1,4),qty=clamp(Math.floor(it.qty??1),1,99);
 const max=clamp(Math.floor(it.max??0),0,999);
 return {id:String(it.id||getId()).slice(0,80),name:String(it.name||"Item sem nome").slice(0,90),
  type,weight,grade,qty,max,hp:clamp(Math.floor(it.hp??max),0,max),equipped:!!it.equipped};
}
function save(){
 try{localStorage.setItem(SAVE_KEY,JSON.stringify(state));$("save-indicator").textContent="Salvo neste navegador";}catch(e){
  $("save-indicator").textContent="Não foi possível salvar; exporte a ficha.";console.warn(e);
 }
}
function toast(msg){const t=$("toast");t.textContent=msg;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),2800);}
function maxLife(s=state){return 3+(s.attributes.vigor||0)+Math.floor((s.attributes.forca||0)/2);}
function maxPP(l=state.level){return l>=20?3:l>=10?2:l>=5?1:0;}
function xpCosts(s=state){
 const attributes=A.reduce((n,[k])=>n+AT_COST[s.attributes[k]||0],0);
 const training=K.reduce((n,[k])=>n+TRAIN_COST[s.knowledges[k]||0],0)+P.reduce((n,[k])=>n+TRAIN_COST[s.practices[k]||0],0);
 const skills=s.skills.reduce((n,id)=>n+(SKILLS.find(x=>x[0]===id)?.[3]||0),0);
 const generalSpent=Math.max(0,attributes-CREATE_BUDGET.attr)+Math.max(0,training-CREATE_BUDGET.training)+Math.max(0,skills-CREATE_BUDGET.skills);
 return {attributes,training,skills,total:attributes+training+skills,generalSpent,free:(s.xpEarned||0)-generalSpent};
}
function xpStepCost(group,k,delta){
 const table=group==="attr"?AT_COST:TRAIN_COST,field=SOURCE_PROPS[group];
 const g=state[field][k]||0,next=clamp(g+delta,0,6);
 return Math.max(0,table[next]-table[g]);
}
function canAfford(group,cost){
 const totals=xpCosts(),cat=group==="attr"?"attributes":group==="skills"?"skills":"training";
 const cap=group==="attr"?CREATE_BUDGET.attr:group==="skills"?CREATE_BUDGET.skills:CREATE_BUDGET.training;
 const additional=Math.max(0,totals[cat]+cost-cap)-Math.max(0,totals[cat]-cap);
 return cost>=0&&totals.free>=additional;
}
function skillReq(id,s=state){
 const has=x=>s.skills.includes(x);
 if(id==="arma-certa")return"Custo de XP e requisitos definitivos ainda pendentes.";
 if(id==="marciais"&&(!has("armas")||s.weaponFocus!=="Punhos"||(s.practices.armas_conjuracao||0)<1))
  return"EXPERIMENTAL: requer Armas 1 (foco Punhos) e Prática Armas grau 1.";
 if(id==="montar"&&(s.attributes.influencia||0)<2)return"Requer Influência grau 2.";
 if(["magia","peritoconj","improviso","mestre","fogo","agua","raio","vento","terra","sagrado","veneno","sangue","trevas"].includes(id)&&!has("aprendiz"))
  return"Requer Aprendiz de Conjurador.";
 if(id==="sangue"||id==="trevas")return"Magia Grau 2 ainda não disponível neste protótipo.";
 return null;
}
function dependentsValid(testState){
 const invalid=testState.skills.find(id=>skillReq(id,testState));
 return invalid?skillReq(invalid,testState):null;
}
function movement(s=state){return 8+(s.attributes.agilidade||0)+Math.floor((s.practices.atletismo||0)/3);}
function renderXP(){
 const x=xpCosts();
 $("xp-total-spent").textContent=x.total+" XP";
 $("xp-earned-text").textContent=(state.xpEarned||0)+" XP";
 $("xp-free-text").textContent=(x.free<0?"−":"")+Math.abs(x.free)+" XP";
 $("xp-free-text").classList.toggle("fp-negative",x.free<0);
 $("build-status").textContent=state.creationLocked?"Progressão · compras permanentes":"Aprendiz · orçamento experimental";
 $("lock-creation").disabled=state.creationLocked||!!state.pending||x.free<0;
 $("lock-creation").textContent=state.creationLocked?"Criação concluída ✓":"Concluir criação";
 $("level-up").disabled=state.level>=20||!!state.pending||x.free<0;
 $("xp-award").disabled=!!state.pending;
 $("xp-next-level").textContent=state.level>=20?"Nível máximo":XP_LEVEL_REFERENCE[state.level+1]+" XP*";
 for(const [type,used,id] of [["attr",x.attributes,"xp-attr"],["training",x.training,"xp-training"],["skills",x.skills,"xp-skill"]]){
  const cap=CREATE_BUDGET[type];
  $(id+"-caption").textContent=used+" / "+cap+" XP"+(used>cap?" · excedente de evolução":"");
  const bar=$(id+"-bar");bar.style.width=Math.min(100,used/cap*100)+"%";bar.classList.toggle("over",used>cap);
 }
 $("xp-feedback").textContent=x.free<0?"Saldo insuficiente: faltam "+Math.abs(x.free)+" XP. Adicione XP ou reorganize as compras ainda não consolidadas.":
  "As compras consomem primeiro o orçamento da categoria. O excedente utiliza XP de evolução."+ (state.creationLocked?" Após a criação não há reembolso livre.":"");
 $("char-level").value=state.level;
}
function deNatural(){return (state.attributes.agilidade||0)+Math.floor((state.attributes.destreza||0)/2);}
function balance(){const a=state.attributes.agilidade||0,v=state.attributes.vigor||0;return a>v?"Leve":a<v?"Pesado":"Médio";}
function capacity(){return 1+Math.floor((state.attributes.forca||0)/3)+Math.floor((state.attributes.vigor||0)/3)+Math.floor((state.practices.armas_conjuracao||0)/3)+Math.floor((state.practices.atletismo||0)/3);}
function loadUsed(){return state.items.reduce((n,it)=>n+WEIGHTS[it.weight][1]*it.qty,0);}
function keepLimit(extra=false){return Math.min(4,(state.level>=6?3:2)+(extra?1:0));}
function face(sides,number){return FACES[sides]?.[number-1]||[0,0,0];}
function dataDice(g,grade){return [...(g==="attr"?DICE_ATTR:DICE_FORM)[grade||0]];}
function label(g,k){
 if(g==="practice"&&k==="armas_conjuracao"){
  if(state.skills.includes("armas")&&state.skills.includes("aprendiz"))return "Armas / Conjuração";
  if(state.skills.includes("aprendiz"))return"Conjuração";
  if(state.skills.includes("armas"))return"Armas";
 }
 const source=(GROUPS[g]||[]).find(x=>x[0]===k);return source?.[1]||k;
}
function dieIcon(n){
 const shapes={
 4:'<polygon points="21,4 39,36 3,36"/><path d="M21 4 L21 27 L3 36 M21 27 L39 36"/>',
 6:'<polygon points="21,3 37,12 37,30 21,39 5,30 5,12"/><path d="M5 12 L21 21 L37 12 M21 21 L21 39"/>',
 10:'<polygon points="21,2 35,14 32,32 21,40 10,32 7,14"/><path d="M7 14 L21 9 L35 14 M21 9 L21 40 M7 14 L21 25 L35 14 M21 25 L10 32 M21 25 L32 32"/>',
 12:'<polygon points="21,2 35,8 40,21 34,34 21,40 8,34 2,21 7,8"/><path d="M21 9 L31 16 L28 29 L14 29 L11 16 Z M21 2 L21 9 M35 8 L31 16 M40 21 L31 16 M34 34 L28 29 M21 40 L28 29 M8 34 L14 29 M2 21 L11 16 M7 8 L11 16"/>',
 20:'<polygon points="21,2 34,8 40,21 34,35 21,40 8,35 2,21 8,8"/><path d="M21 2 L21 40 M8 8 L34 35 M34 8 L8 35 M2 21 L40 21 M8 8 L21 21 L34 8 M8 35 L21 21 L34 35"/>'
 };
 return '<svg viewBox="0 0 42 42" aria-hidden="true">'+(shapes[n]||shapes[4])+'</svg>';
}
function symbolMarkup(symbols){
 if(!symbols.some(Boolean))return'<span>—</span>';
 return ['e','a','p'].map((type,i)=>symbols[i]?'<span class="'+type+'">'+symbols[i]+['ᛋ','ᚨ','ᚦ'][i]+'</span>':"").join("");
}
function syncFields(){
 for(const [id,key] of [["char-name","name"],["char-concept","concept"],["char-origin","origin"],["char-virtue","virtue"],["char-personality","personality"],["char-notes","notes"]]){
  $(id).value=state[key];
 }
 $("char-level").value=state.level;
 $("portrait-image").src=state.portrait||"../assets/codex-logo.svg";
}
function render(){renderVitals();renderXP();renderSources();renderComposer();renderSkills();renderInventory();}
function renderVitals(){
 const lifeMaxValue=maxLife();state.life=clamp(state.life,0,lifeMaxValue);state.pp=clamp(state.pp,0,maxPP());
 $("life-text").textContent=state.life+" / "+lifeMaxValue;
 $("courage-text").textContent=state.courage+" / 10";
 $("pp-text").textContent=state.pp+" / "+maxPP();
 $("de-text").textContent=deNatural();$("balance-text").textContent=balance();
 $("load-text").textContent=pad(loadUsed())+" / "+capacity();
 $("move-text").textContent=movement()+" m";
 $("move-caption").textContent="8 + "+(state.attributes.agilidade||0)+" Agilidade + ⌊"+(state.practices.atletismo||0)+"/3⌋ Atletismo";
 const ratio=lifeMaxValue?state.life/lifeMaxValue:0;
 const tier=ratio>2/3?3:ratio>1/3?2:1;
 $("life-boxes").innerHTML=[1,2,3].map(i=>'<span class="'+(i<=tier?"filled":"")+(tier===1?" critical":"")+'"></span>').join("");
 $("life-recovery").textContent=state.life===0?"Vida zerada · procedimento pendente":tier===3?"Faixa 3/3 · 1 Vida por dia":tier===2?"Faixa 2/3 · 1 semana por Vida":"Faixa 1/3 · Medicina + 1 semana por Vida";
}
function renderSources(){
 for(const group of ["know","attr","practice"]){
  const html=GROUPS[group].map(([id,name])=>{
   const g=state[SOURCE_PROPS[group]][id]||0,source={group,key:id};
   const nextCost=xpStepCost(group,id,1),canRaise=g<6&&canAfford(group,nextCost);
   const canReduce=g>0&&!state.creationLocked&&!state.pending;
   const isBase=same(source,draft.base),isAttr=same(source,draft.attribute),isThird=same(source,draft.third);
   const flag=isBase?"BASE":isAttr?"ATRIBUTO":isThird?"COMPLEMENTO":"";
   const title=label(group,id),dice=dataDice(group,g);
   return '<div class="fp-source-item '+(isBase?"fp-is-base":isAttr?"fp-is-attr":isThird?"fp-is-third":"")+'">'+
    '<button type="button" class="fp-source-pick" data-action="source" data-group="'+group+'" data-key="'+id+'" aria-pressed="'+!!flag+'" '+(state.pending?"disabled":"")+'>'+
    '<span class="fp-src-title"><span>'+esc(title)+'</span>'+(flag?'<span class="fp-flag">'+flag+'</span>':"")+'</span>'+
    '<span class="fp-dice-list">'+dice.map(n=>'<span class="fp-die-badge fp-die-d'+n+'">'+dieIcon(n)+'<span>d'+n+'</span></span>').join("")+'</span></button>'+
    '<div class="fp-grade-controls"><button type="button" data-action="grade" data-group="'+group+'" data-key="'+id+'" data-delta="1" aria-label="Aumentar grau de '+esc(title)+'" '+(!canRaise||state.pending?"disabled":"")+'>+</button>'+
    '<b>'+g+'</b><button type="button" data-action="grade" data-group="'+group+'" data-key="'+id+'" data-delta="-1" aria-label="Reduzir grau de '+esc(title)+'" '+(!canReduce?"disabled":"")+'>−</button><small class="fp-xp-step-cost">'+(g<6?'+'+nextCost+' XP':'MAX')+'</small></div></div>';
  }).join("");
  $({know:"knowledge-list",attr:"attribute-list",practice:"practice-list"}[group]).innerHTML=html;
 }
}
function mayThird(){
 return state.skills.includes("combinacao")||
 (draft.base?.group==="practice"&&draft.base?.key==="armas_conjuracao"&&draft.mode==="conjuracao"&&state.skills.includes("peritoconj"));
}
function canUseShared(){
 if(draft.base?.group!=="practice"||draft.base.key!=="armas_conjuracao")return true;
 return draft.mode==="armas"?state.skills.includes("armas"):draft.mode==="conjuracao"?state.skills.includes("aprendiz"):false;
}
function selectSource(group,k){
 if(state.pending){toast("Finalize ou descarte a rolagem pendente primeiro.");return;}
 const source={group,key:k};
 if(group==="attr"){
  if(!draft.base){toast("Primeiro escolha um Conhecimento ou Prática como Base.");return;}
  draft.attribute=same(source,draft.attribute)?null:source;
  if(!draft.attribute){draft.third=null;draft.contextOK=false;}
 }else if(!draft.base){
  draft=freshDraft();draft.base=source;draft.mode=k==="armas_conjuracao"?modeDefault():"normal";
 }else if(same(source,draft.base)){
  draft=freshDraft();
 }else if(!draft.attribute){
  draft.base=source;draft.mode=k==="armas_conjuracao"?modeDefault():"normal";
 }else{
  if(!mayThird()){toast("Terceira fonte exige uma Perícia pertinente de combinação.");return;}
  draft.third=same(source,draft.third)?null:source;draft.contextOK=false;
 }
 renderSources();renderComposer();
 if(draft.base&&draft.attribute&&!draft.third)toast("Combinação básica pronta. Revise a preparação antes de rolar.");
}
function modeDefault(){return state.skills.includes("armas")?"armas":state.skills.includes("aprendiz")?"conjuracao":"armas";}
function buildPool(){
 const errors=[],pool=[];
 if(!draft.base||!draft.attribute)return{errors:["Selecione Base e Atributo."],pool};
 if(draft.third){
  if(same(draft.third,draft.base))errors.push("Não duplique a mesma fonte.");
  if(!mayThird())errors.push("Falta Perícia pertinente para a terceira fonte.");
  else if(!draft.contextOK)errors.push("Confirme a pertinência da terceira fonte com o Narrador.");
 }
 if(!canUseShared())errors.push(draft.mode==="conjuracao"?"Conjurar requer Aprendiz de Conjurador.":"Uso marcial especializado requer Armas 1.");
 for(const s of [draft.base,draft.attribute,...(draft.third?[draft.third]:[])]){
  const grade=state[SOURCE_PROPS[s.group]][s.key]||0;
  dataDice(s.group,grade).forEach((sides,index)=>pool.push({id:key(s)+":"+index,group:s.group,key:s.key,sides}));
 }
 if(draft.step){
  const attr=pool.find(d=>d.group==="attr");const next={4:6,6:10,10:12}[attr?.sides];
  if(next)attr.sides=next;
  else errors.push("Esse dado de Atributo não permite elevação comum.");
 }
 if(pool.length>9)errors.push("A pilha ultrapassa o limite de 9 dados rolados.");
 if(Number(draft.extraKeep)+Number(draft.step)>state.courage)errors.push("Coragem insuficiente para os custos de preparação.");
 if(draft.de<0||draft.de>30)errors.push("DE deve ficar entre 0 e 30.");
 return{errors,pool};
}
function renderComposer(){
 const box=$("composer-content"),stat=$("composer-status");
 if(state.pending){stat.textContent="Rolagem pendente";box.innerHTML=renderPending();return;}
 if(!draft.base){
  stat.textContent="Aguardando uma Base";
  box.innerHTML='<div class="fp-empty"><div class="fp-empty-glyph">ᚨ</div><h4>Seu teste começa aqui.</h4><p>Escolha primeiro um Conhecimento ou uma Prática na ficha. O primeiro clique define a natureza da ação; o Atributo vem depois.</p></div>'+
   '<div class="fp-alert">Experimente <strong>Armas → Força → Apresentação</strong> e depois inverta a Base. A composição numérica pode ser igual, mas o tipo de teste muda.</div>'+
   (state.history.length?'<p class="fp-caption">Última ação: '+esc(state.history[0].name)+' · '+esc(state.history[0].outcome)+'</p>':"");
  return;
 }
 stat.textContent=draft.attribute?"Revisar antes de rolar":"Escolha um Atributo";
 const step='<div class="fp-selection-steps"><div class="fp-step-box base"><small>01 · BASE</small><strong>'+esc(label(draft.base.group,draft.base.key))+'</strong></div>'+
 '<div class="fp-step-box attr"><small>02 · ATRIBUTO</small><strong>'+(draft.attribute?esc(label(draft.attribute.group,draft.attribute.key)):"Selecione...")+'</strong></div>'+
 '<div class="fp-step-box third"><small>03 · COMPLEMENTO</small><strong>'+(draft.third?esc(label(draft.third.group,draft.third.key)):"Opcional")+'</strong></div></div>';
 if(!draft.attribute){
  box.innerHTML=step+'<p class="fp-prepare-description">A Base já foi definida. Clique em um Atributo na coluna central. Nenhum dado será rolado sem sua confirmação.</p>'+
   '<div class="fp-composer-actions"><button type="button" class="fp-secondary" data-action="clear">Limpar seleção</button></div>';return;
 }
 const {errors,pool}=buildPool(),cost=Number(draft.extraKeep)+Number(draft.step);
 const isShared=draft.base.group==="practice"&&draft.base.key==="armas_conjuracao";
 const usage=isShared?(draft.mode==="conjuracao"?"Conjuração":"Armas"):label(draft.base.group,draft.base.key);
 const select=(field,values,selected)=>'<select data-option="'+field+'">'+values.map(([id,name])=>'<option value="'+id+'"'+(selected===id?" selected":"")+'>'+esc(name)+'</option>').join("")+'</select>';
 const modes=[["armas","Armas"],["conjuracao","Conjuração"]];
 const weight=[["leve","Leve"],["medio","Médio"],["pesado","Pesado"]];
 const checks= '<label class="fp-checkline"><input type="checkbox" data-option="extraKeep"'+(draft.extraKeep?" checked":"")+'> Manter 1 dado adicional (1 Coragem)</label>'+
 '<label class="fp-checkline"><input type="checkbox" data-option="step"'+(draft.step?" checked":"")+'> Elevar o primeiro dado de Atributo (1 Coragem)</label>'+
 (state.skills.includes("combate")?'<label class="fp-checkline full"><input type="checkbox" data-option="combatBonus"'+(draft.combatBonus?" checked":"")+'> Aplicar Combate +1A (somente quando pertinente)</label>':"")+
 '<label class="fp-checkline full"><input type="checkbox" data-option="weightEnabled"'+(draft.weightEnabled?" checked":"")+'> Aplicar afinidade de peso do ataque × balanço do alvo (se pertinente)</label>'+
 (draft.third?'<label class="fp-checkline fp-context full"><input type="checkbox" data-option="contextOK"'+(draft.contextOK?" checked":"")+'> Confirmo que a Perícia permite este complemento na ação declarada, sob validação do Narrador.</label>':"");
 const options='<div class="fp-form-grid">'+(isShared?'<label class="fp-form-field full">Uso da Prática compartilhada '+select("mode",modes,draft.mode)+'</label>':"")+
 '<label class="fp-form-field">Dificuldade de Êxito <input data-option="de" type="number" min="0" max="30" value="'+draft.de+'"></label>'+
 '<label class="fp-form-field">Condição da ação '+select("situation",Object.entries(SITUATIONS).map(([k,v])=>[k,v[0]]),draft.situation)+'</label>'+
 (draft.weightEnabled?'<label class="fp-form-field">Peso do ataque '+select("attackWeight",weight,draft.attackWeight)+'</label><label class="fp-form-field">Balanço do alvo '+select("targetWeight",weight,draft.targetWeight)+'</label>':"")+
 checks+'</div>';
 const poolHTML='<div class="fp-pill-row">'+pool.map(d=>'<span class="fp-pool-die">'+dieIcon(d.sides)+' d'+d.sides+' <span>'+esc(label(d.group,d.key))+'</span></span>').join("")+'</div>';
 box.innerHTML=step+'<div class="fp-prepare-title">'+esc(usage)+'</div><p class="fp-prepare-description">A Base determina o tipo de ação. Atributo e complemento não alteram sua natureza automaticamente.</p>'+
 options+'<p class="fp-caption" style="margin-top:10px">Pilha: '+pool.length+'/9 dados · Retenção: '+keepLimit(false)+' ou '+keepLimit(true)+' com Coragem · Custo previsto: '+cost+' Coragem.</p>'+poolHTML+
 (draft.third?'<p class="fp-caption">Para trocar o complemento, clique em outra Prática ou Conhecimento. Para trocar a Base, limpe a seleção e comece novamente.</p>':
 '<p class="fp-caption">'+(mayThird()?"Uma terceira fonte pode ser acrescentada por clique, respeitando a habilitação e a confirmação contextual.":"Sem Perícia pertinente de combinação, este teste utiliza somente duas fontes.")+'</p>')+
 errors.map(x=>'<div class="fp-alert invalid">'+esc(x)+'</div>').join("")+
 '<div class="fp-composer-actions"><button class="fp-secondary" type="button" data-action="clear">Limpar</button>'+
 '<button class="fp-primary-btn" type="button" data-action="roll"'+(errors.length?" disabled":"")+'>Rolar dados →</button></div>';
}
function randomFace(n){
 if(typeof crypto!=="undefined"&&crypto.getRandomValues){
  const limit=0x100000000-(0x100000000%n),buf=new Uint32Array(1);
  do{crypto.getRandomValues(buf);}while(buf[0]>=limit);
  return(buf[0]%n)+1;
 }
 return Math.floor(Math.random()*n)+1;
}
function roll(){
 if(state.pending){toast("Uma rolagem anterior aguarda finalização.");return;}
 const data=buildPool();
 if(data.errors.length){toast(data.errors[0]);renderComposer();return;}
 state.pending={created:new Date().toISOString(),base:{...draft.base},attribute:{...draft.attribute},
  third:draft.third?{...draft.third}:null,mode:draft.mode,
  opts:{de:draft.de,situation:draft.situation,extraKeep:draft.extraKeep,step:draft.step,combatBonus:draft.combatBonus,
    weightEnabled:draft.weightEnabled,attackWeight:draft.attackWeight,targetWeight:draft.targetWeight},
  dice:data.pool.map(d=>({...d,face:randomFace(d.sides)})),selected:[],cancelP:0,pairs:0,pass:0};
 draft=freshDraft();save();render();
 toast("Dados rolados. Agora escolha quais manter.");
}
function affinity(attack,target){
 const matrix={leve:{leve:0,medio:1,pesado:-1},medio:{leve:1,medio:-1,pesado:0},pesado:{leve:-1,medio:0,pesado:1}};
 return matrix[attack]?.[target]||0;
}
function score(){
 const p=state.pending;if(!p)return null;
 const dice=p.dice.filter(x=>p.selected.includes(x.id)),errs=[];
 if(dice.length===0)errs.push("Selecione os dados que deseja manter.");
 if(dice.length>keepLimit(p.opts.extraKeep))errs.push("Limite de retenção excedido.");
 if(!dice.some(x=>x.group==="attr"))errs.push("É obrigatório manter pelo menos um dado de Atributo.");
 const raw=[0,0,0];
 for(const d of dice){const f=face(d.sides,d.face);for(let i=0;i<3;i++)raw[i]+=f[i];}
 const situation=SITUATIONS[p.opts.situation]||SITUATIONS.normal;
 const w=p.opts.weightEnabled?affinity(p.opts.attackWeight,p.opts.targetWeight):0;
 const eBase=Math.max(0,raw[0]+situation[1]);
 const aPool=Math.max(0,raw[1]+situation[2]+w+(p.opts.combatBonus?1:0));
 const cancel=clamp(Math.floor(p.cancelP),0,999),pairs=clamp(Math.floor(p.pairs),0,999),pass=clamp(Math.floor(p.pass),0,1);
 if(cancel>raw[2])errs.push("Não há tantos Pavor para anular.");
 if(cancel+2*pairs+pass>aPool)errs.push("Antecipar insuficiente para os gastos selecionados.");
 const E=eBase+pairs,P=Math.max(0,raw[2]-cancel),remainingA=Math.max(0,aPool-cancel-2*pairs-pass);
 const reached=E+P,success=reached>=p.opts.de;
 const outcome=success?(P===0?"Acerto puro":P>E?"Acerto com Pavor predominante":"Acerto normal com Pavor")
 :(P===0?"Falha limpa":P>E?"Falha com Pavor predominante":"Falha com Pavor");
 const courageCost=Number(p.opts.extraKeep)+Number(p.opts.step);
 if(courageCost>state.courage)errs.push("Coragem insuficiente para a rolagem preparada.");
 return{dice,raw,E,P,remainingA,reached,success,outcome,damage:success?E+Math.floor(P/2):0,errors:errs,
  aPool,courageCost};
}
function renderPending(){
 const p=state.pending,s=score(),de=p.opts.de,cost=s.courageCost;
 const desc=esc(label(p.base.group,p.base.key))+" + "+esc(label(p.attribute.group,p.attribute.key))+
  (p.third?" + "+esc(label(p.third.group,p.third.key)):"");
 const dice='<div class="fp-rolled-dice">'+p.dice.map(d=>'<button type="button" class="fp-roll-die fp-die-d'+d.sides+' '+(p.selected.includes(d.id)?"kept":"")+'" data-action="keep" data-id="'+esc(d.id)+'" aria-pressed="'+p.selected.includes(d.id)+'">'+dieIcon(d.sides)+
  '<strong class="fp-face">'+d.face+'</strong><span class="fp-die-source">'+esc(label(d.group,d.key))+' · d'+d.sides+'</span><span class="fp-symbol-line">'+symbolMarkup(face(d.sides,d.face))+'</span></button>').join("")+'</div>';
 const selectNumber=(k,labelText,max,value)=>'<label class="fp-form-field">'+labelText+'<select data-pending="'+k+'">'+
 Array.from({length:Math.max(1,max+1)},(_,i)=>'<option value="'+i+'"'+(Number(value)===i?" selected":"")+'>'+i+'</option>').join("")+'</select></label>';
 const controls='<div class="fp-form-grid">'+
 selectNumber("cancelP","Anular Pavor (1A por 1P)",Math.min(s.raw[2],s.aPool),p.cancelP)+
 selectNumber("pairs","Converter 2A em 1E",Math.floor(s.aPool/2),p.pairs)+
 selectNumber("pass","Passar ação ao aliado (1A)",1,p.pass)+'</div>';
 const stats='<div class="fp-outcome"><h4>'+esc(s.outcome)+'</h4><div class="fp-outcome-stats">'+
 '<div class="fp-outcome-stat">DE alcançada<b>'+s.reached+' / '+de+'</b></div>'+
 '<div class="fp-outcome-stat"><span class="fp-rune fp-rune-e">Êxito ᛋ</span><b>'+s.E+'</b></div>'+
 '<div class="fp-outcome-stat"><span class="fp-rune fp-rune-a">Antecipar ᚨ</span><b>'+s.remainingA+'</b></div>'+
 '<div class="fp-outcome-stat"><span class="fp-rune fp-rune-p">Pavor ᚦ</span><b>'+s.P+'</b></div></div>'+
 '<p class="fp-caption" style="margin-top:9px">Dano básico se acertar: '+s.damage+'. Pavor não anulado conserva o risco e a transferência pertinente.</p></div>';
 return '<div class="fp-alert"><strong>Resultado já sorteado.</strong> '+desc+'. A rolagem ficará salva até ser finalizada ou descartada explicitamente.</div>'+
 '<p class="fp-caption" style="margin:11px 0">Mantenha até '+keepLimit(p.opts.extraKeep)+' dados, incluindo um Atributo. '+s.dice.length+' selecionado(s). Custo previsto: '+cost+' Coragem.</p>'+dice+controls+
 (s.dice.length?stats:"<p class=\"fp-caption\" style=\"margin-top:10px\">Clique nos dados que deseja manter. Só eles geram símbolos.</p>")+
 s.errors.filter(x=>x!=="Selecione os dados que deseja manter.").map(x=>'<div class="fp-alert invalid">'+esc(x)+'</div>').join("")+
 (s.dice.length&&!s.errors.length?"":'<div class="fp-alert">A finalização só fica disponível após uma retenção válida.</div>')+
 '<div class="fp-composer-actions"><button class="fp-secondary" data-action="discard" type="button">Descartar teste...</button>'+
 '<button class="fp-primary-btn" data-action="finalize" type="button"'+(s.errors.length?" disabled":"")+'>Finalizar ação</button></div>';
}
function finalize(){
 const p=state.pending,s=score();
 if(!p||s.errors.length){toast(s?.errors?.[0]||"Rolagem inválida.");return;}
 state.courage=clamp(state.courage-s.courageCost,0,10);
 const baseName=p.base.group==="practice"&&p.base.key==="armas_conjuracao"?(p.mode==="conjuracao"?"Conjuração":"Armas"):label(p.base.group,p.base.key);
 const name=baseName+" + "+label(p.attribute.group,p.attribute.key)+(p.third?" + "+label(p.third.group,p.third.key):"");
 state.history.unshift({date:new Date().toISOString(),name,outcome:s.outcome,de:p.opts.de,reached:s.reached,
  E:s.E,A:s.remainingA,P:s.P,faces:s.dice.map(d=>({id:d.id,sides:d.sides,face:d.face}))});
 state.history=state.history.slice(0,20);state.pending=null;save();render();
 toast(s.outcome+" · DE "+s.reached+"/"+p.opts.de);
}
function updateGrade(group,id,delta){
 if(state.pending){toast("Finalize a rolagem antes de modificar fontes.");return;}
 const p=SOURCE_PROPS[group];if(!p||!GROUPS[group].some(x=>x[0]===id)||![-1,1].includes(delta))return;
 const old=state[p][id]||0,next=clamp(old+delta,0,6);
 if(next===old)return;
 const purchaseCost=delta>0?xpStepCost(group,id,1):0;
 if(delta>0){
  if(!canAfford(group,purchaseCost)){toast("XP insuficiente: este avanço custa "+purchaseCost+" XP.");return;}
 }else{
  if(state.creationLocked){toast("Compras consolidadas não podem ser devolvidas.");return;}
  const tmp=structuredClone(state);tmp[p][id]=next;
  const problem=dependentsValid(tmp);
  if(problem){toast("Não é possível reduzir: "+problem);return;}
 }
 state[p][id]=next;
 render();save();
 if(delta>0)toast("Grau "+next+" comprado por "+purchaseCost+" XP.");
}
function adjustResource(resource,delta){
 const max=resource==="life"?maxLife():resource==="pp"?maxPP():10;
 state[resource]=clamp(state[resource]+delta,0,max);renderVitals();save();
}
function renderSkills(){
 $("skills-list").innerHTML=SKILLS.map(([id,name,detail,cost])=>{
  const owned=state.skills.includes(id),req=skillReq(id),affordable=Number.isInteger(cost)&&canAfford("skills",cost);
  const disabled=!!state.pending||(!owned&&(!!req||!affordable))||(owned&&state.creationLocked);
  const note=req||(!owned&&!affordable?"XP insuficiente.":"");
  const text=owned?(state.creationLocked?"Adquirida ✓":"Desfazer"):cost===null?"PENDENTE":"Comprar · "+cost+" XP";
  return'<div class="fp-skill '+(owned?"owned":"")+(req?" fp-skill-locked":"")+'"><div><strong>'+esc(name)+'</strong>'+
   '<small>'+esc(detail)+'</small>'+(note?'<small class="fp-skill-req">'+esc(note)+'</small>':"")+
   '</div><button type="button" data-action="skill" data-id="'+id+'" aria-pressed="'+owned+'" title="'+esc(note||"")+'"'+(disabled?" disabled":"")+'>'+text+'</button></div>';
 }).join("");
 $("weapon-focus-wrap").hidden=!state.skills.includes("armas");
 $("weapon-focus").value=state.weaponFocus;
 $("weapon-focus").disabled=state.creationLocked||!!state.pending;
 $("convert-courage").disabled=state.level<5||state.courage<2||state.pp>=maxPP()||state.courageUsedTurn;
 $("courage-skill-message").textContent=state.level<5?"Perícia em Coragem: disponível a partir do nível 5.":state.courageUsedTurn?"Conversão já usada neste turno.":"A conversão pode ser usada uma vez por turno.";
}
function inventorySelect(field,value,values,id){
 return'<select data-item-field="'+field+'" data-id="'+esc(id)+'">'+values.map(([k,v])=>'<option value="'+k+'"'+(k===value?" selected":"")+'>'+esc(v)+'</option>').join("")+'</select>';
}
function renderInventory(){
 const load=loadUsed(),max=capacity(),fill=$("load-bar-fill");
 fill.style.width=Math.min(100,max?load/max*100:0)+"%";fill.classList.toggle("over",load>max);
 $("load-caption").textContent="Ocupação estimada: "+pad(load)+" / "+max+" Alto"+(load>max?" · capacidade excedida":"")+". Não inclui bônus de equipamentos ainda pendentes.";
 $("inventory-list").innerHTML=state.items.length?state.items.map(it=>{
  const types=[["arma","Arma"],["armadura","Armadura"],["escudo","Escudo"],["foco","Foco"],["ferramenta","Ferramenta"],["outro","Outro"]];
  return'<div class="fp-item"><input type="text" value="'+esc(it.name)+'" data-id="'+esc(it.id)+'" data-item-field="name" maxlength="90" aria-label="Nome do item">'+
  inventorySelect("type",it.type,types,it.id)+
  inventorySelect("weight",it.weight,Object.entries(WEIGHTS).map(([id,values])=>[id,values[0]]),it.id)+
  '<div class="fp-item-controls"><button type="button" data-action="integrity" data-id="'+esc(it.id)+'" data-delta="-1" aria-label="Reduzir integridade">−</button><b>'+it.hp+'/'+it.max+'</b>'+
  '<button type="button" data-action="integrity" data-id="'+esc(it.id)+'" data-delta="1" aria-label="Aumentar integridade">+</button>'+
  '<button type="button" class="'+(it.equipped?"fp-item-equipped":"")+'" data-action="equip" data-id="'+esc(it.id)+'" title="Equipar/guardar">'+(it.equipped?"✓":"○")+'</button>'+
  '<button type="button" data-action="delete-item" data-id="'+esc(it.id)+'" title="Excluir item">×</button></div>'+
  '<div class="fp-item-hint"><label>Grau <input type="number" data-item-field="grade" data-id="'+esc(it.id)+'" min="1" max="4" value="'+it.grade+'" style="width:40px"></label> · '+
  '<label>Qtd. <input type="number" data-item-field="qty" data-id="'+esc(it.id)+'" min="1" max="99" value="'+it.qty+'" style="width:44px"></label> · '+
  '<label>Integridade máxima <input type="number" data-item-field="max" data-id="'+esc(it.id)+'" min="0" max="999" value="'+it.max+'" style="width:50px"></label>'+
  ' · '+(it.equipped?"Equipado":"No inventário")+'</div></div>';
 }).join(""):'<div class="fp-empty-list">Nenhum item cadastrado. Use <strong>+ Item</strong> para simular equipamento e carga.</div>';
}
function demo(){
 const s=defaultState();
 s.name="Aprendiz de exemplo";s.concept="Artista de combate";s.origin="Humano";s.virtue="Determinação";s.personality="Criativo";
 s.level=6;s.attributes={forca:2,agilidade:3,destreza:2,inteligencia:1,influencia:1,vigor:3};
 s.knowledges={alquimia:1,medicina:0,protecao:1};
 s.practices={armas_conjuracao:2,atletismo:1,furtividade:1,apresentacao:2};
 s.skills=["armas","aprendiz","combinacao","combate"];
 s.creationLocked=true;s.xpEarned=80;s.weaponFocus="medio";
 s.xpHistory=[{at:new Date().toISOString(),amount:80,note:"XP de exemplo para testar evolução"}];
 s.courage=8;s.pp=1;s.life=maxLife(s)-1;
 s.items=[normalizeItem({name:"Espada de treinamento",type:"arma",weight:"medio",grade:1,qty:1,equipped:true,max:0,hp:0}),
  normalizeItem({name:"Armadura de demonstração",type:"armadura",weight:"alto",grade:2,qty:1,equipped:true,max:5,hp:4}),
  normalizeItem({name:"Bolsa de suprimentos",type:"outro",weight:"leve",grade:1,qty:1})];
 s.notes="Exemplo ilustrativo para navegar e testar a interface. Os equipamentos não representam fichas oficiais.";
 return s;
}
function download(){
 const blob=new Blob([JSON.stringify({schema:"codex-html-playtest-v1",exportedAt:new Date().toISOString(),character:state},null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="codex-ficha-prototipo.json";document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),500);
}
function fromCreator(v){
 const s=defaultState(),old=v.character||v;
 for(const x of ["name","concept","origin","virtue","personality","notes"])if(typeof old[x]==="string")s[x]=old[x];
 const attrNames={Força:"forca",Agilidade:"agilidade",Destreza:"destreza",Inteligência:"inteligencia",Influência:"influencia",Vigor:"vigor"};
 const sources={Proteção:"protecao",Astronomia:"astronomia",Medicina:"medicina",Alquimia:"alquimia",Engenharia:"engenharia",Erudição:"erudicao",Armas:"armas_conjuracao",Conjuração:"armas_conjuracao",Atletismo:"atletismo",Furtividade:"furtividade",Artesão:"artesao",Apresentação:"apresentacao",Coleta:"coleta"};
 for(const [name,id] of Object.entries(attrNames))s.attributes[id]=old.attributes?.[name]||0;
 for(const [name,id] of Object.entries(sources))if(name in(old.sources||{})){
  const dest=K.some(x=>x[0]===id)?"knowledges":"practices";
  s[dest][id]=Math.max(s[dest][id]||0,old.sources[name]||0);
 }
 const map={armas:"armas",aprendiz:"aprendiz",combinacao:"combinacao",peritoconj:"peritoconj",marciais:"marciais",combate:"combate",magia:"magia",fogo:"fogo",agua:"agua",sagrado:"sagrado"};
 s.skills=(old.skills||[]).map(x=>map[x]).filter(Boolean);s.courage=old.courage??10;s.life=maxLife(s);
 return s;
}
async function importFile(file){
 try{const txt=await file.text();if(txt.length>2500000)throw Error("Arquivo muito grande.");
  const input=JSON.parse(txt),raw=input.character||input;
  const isNew=raw.schema==="codex-html-playtest-v1";
  const v=isNew?raw:fromCreator(input);
  if(!confirm("Substituir a ficha atual pelos dados importados?"))return;
  state=normalize(v);draft=freshDraft();syncFields();render();save();
  toast(isNew?"Ficha importada.":"Ficha do criador importada parcialmente. Confira os dados.");
 }catch(e){toast("Falha ao importar: "+e.message);}
}
function onClick(event){
 const button=event.target.closest("button");if(!button)return;
 const action=button.dataset.action;
 if(!action)return;
 const {group,key:source,delta,id}=button.dataset;
 switch(action){
 case "source":selectSource(group,source);break;
 case "grade":updateGrade(group,source,Number(delta));break;
 case "clear":draft=freshDraft();renderSources();renderComposer();break;
 case "roll":roll();break;
 case "keep":{
  const p=state.pending;if(!p)return;
  const selected=new Set(p.selected);
  if(selected.has(id))selected.delete(id);
  else if(selected.size>=keepLimit(p.opts.extraKeep)){toast("Limite de dados mantidos atingido.");return;}
  else selected.add(id);
  p.selected=[...selected];p.cancelP=0;p.pairs=0;p.pass=0;save();renderComposer();break;
 }
 case "finalize":finalize();break;
 case "discard":
  if(!state.pending)return;
  if(confirm("Descartar a rolagem já revelada? Isso deve ocorrer apenas por decisão do Narrador; os dados não serão reaproveitados.")){
   state.pending=null;save();render();toast("Rolagem descartada por confirmação.");
  }break;
 case "skill":{
  if(state.pending){toast("Finalize a rolagem antes de modificar Perícias.");return;}
  const skill=SKILLS.find(x=>x[0]===id);if(!skill)return;
  const existing=state.skills.indexOf(id);
  if(existing<0){
   const reason=skillReq(id);
   if(reason){toast(reason);return;}
   if(!Number.isInteger(skill[3])){toast("Custo pendente.");return;}
   if(!canAfford("skills",skill[3])){toast("XP insuficiente: "+skill[3]+" XP necessários.");return;}
   state.skills.push(id);toast("Perícia comprada: "+skill[1]+" · "+skill[3]+" XP.");
  }else{
   if(state.creationLocked){toast("Compra consolidada; não há devolução automática.");return;}
   const tmp=structuredClone(state);tmp.skills=tmp.skills.filter(x=>x!==id);
   const problem=dependentsValid(tmp);if(problem){toast("Outra Perícia depende desta: "+problem);return;}
   state.skills.splice(existing,1);toast("Compra de criação desfeita.");
  }
  if(draft.third&&!mayThird())draft.third=null;
  if(draft.base?.key==="armas_conjuracao")draft.mode=modeDefault();
  render();save();break;
 }
 case "integrity":{
  const it=state.items.find(x=>x.id===id);if(it){it.hp=clamp(it.hp+Number(delta),0,it.max);renderInventory();save();}break;
 }
 case "equip":{
  const it=state.items.find(x=>x.id===id);if(!it)return;
  if(!it.equipped&&it.type==="armadura"&&it.grade>=2&&state.level<5){toast("Armadura Grau 2 requer nível 5 para equipar.");return;}
  it.equipped=!it.equipped;renderInventory();save();break;
 }
 case "delete-item":{
  const it=state.items.find(x=>x.id===id);if(!it)return;
  if(confirm('Excluir "'+it.name+'"?')){state.items=state.items.filter(x=>x.id!==id);renderInventory();renderVitals();save();}break;
 }
 }
}
function onChange(event){
 const el=event.target;
 if(el.dataset.option){
  const k=el.dataset.option;
  if(!Object.hasOwn(draft,k))return;
  draft[k]=el.type==="checkbox"?el.checked:el.type==="number"?clamp(Math.floor(el.value),0,30):el.value;
  if(k==="mode"){draft.third=null;draft.contextOK=false;}
  renderSources();renderComposer();return;
 }
 if(el.dataset.pending&&state.pending){
  const k=el.dataset.pending;
  if(!["cancelP","pairs","pass"].includes(k))return;
  state.pending[k]=clamp(Math.floor(el.value),0,k==="pass"?1:20);save();renderComposer();return;
 }
 if(el.dataset.itemField){
  const it=state.items.find(x=>x.id===el.dataset.id);if(!it)return;
  const k=el.dataset.itemField;
  if(k==="name")it.name=el.value.slice(0,90);
  else if(k==="type")it.type=["arma","armadura","escudo","foco","ferramenta","outro"].includes(el.value)?el.value:"outro";
  else if(k==="weight")it.weight=Object.hasOwn(WEIGHTS,el.value)?el.value:"leve";
  else if(k==="qty")it.qty=clamp(Math.floor(el.value),1,99);
  else if(k==="grade"){it.grade=clamp(Math.floor(el.value),1,4);if(it.equipped&&it.type==="armadura"&&it.grade>=2&&state.level<5){it.equipped=false;toast("Peça retirada: Grau 2 exige nível 5.");}}
  else if(k==="max"){it.max=clamp(Math.floor(el.value),0,999);it.hp=clamp(it.hp,0,it.max);}
  renderInventory();renderVitals();save();return;
 }
}
function bind(){
 document.addEventListener("click",onClick);
 document.addEventListener("click",event=>{
  const b=event.target.closest("button[data-resource]");if(b)adjustResource(b.dataset.resource,Number(b.dataset.delta));
 });
 document.addEventListener("change",onChange);
 for(const [id,field] of [["char-name","name"],["char-concept","concept"],["char-origin","origin"],["char-virtue","virtue"],["char-personality","personality"],["char-notes","notes"]]){
  $(id).addEventListener("input",function(){state[field]=this.value;save();});
 }
 $("char-level").addEventListener("change",function(){this.value=state.level;});
 $("xp-award").addEventListener("click",()=>{
  if(state.pending){toast("Finalize a rolagem antes de conceder XP.");return;}
  const amount=Math.floor(Number($("xp-award-amount").value));
  if(!Number.isSafeInteger(amount)||amount<1||amount>9999){toast("Informe de 1 a 9999 XP.");return;}
  if(state.xpEarned+amount>1000000){toast("XP acumulado acima do limite desta ferramenta.");return;}
  if(!state.creationLocked){state.creationLocked=true;toast("Criação concluída ao receber XP de evolução.");}
  state.xpEarned+=amount;
  state.xpHistory.unshift({at:new Date().toISOString(),amount,note:"XP concedidos manualmente"});
  state.xpHistory=state.xpHistory.slice(0,60);
  render();save();toast("+"+amount+" XP de evolução disponíveis para compra.");
 });
 $("lock-creation").addEventListener("click",()=>{
  if(state.pending||state.creationLocked||xpCosts().free<0)return;
  if(!confirm("Concluir a criação do Aprendiz? Compras já feitas deixarão de ser reversíveis."))return;
  state.creationLocked=true;render();save();toast("Criação concluída. Novos avanços custam XP.");
 });
 $("level-up").addEventListener("click",()=>{
  if(state.pending||state.level>=20||xpCosts().free<0)return;
  const next=state.level+1;
  if(!confirm("Evoluir para o nível "+next+"? A curva de XP é experimental: nenhuma quantidade será concedida automaticamente."))return;
  state.level=next;state.creationLocked=true;
  render();save();toast("Nível "+next+" alcançado. Distribua o XP recebido conforme a campanha.");
 });
 $("weapon-focus").addEventListener("change",event=>{
  if(state.creationLocked||state.pending){event.target.value=state.weaponFocus;return;}
  const previous=state.weaponFocus,selected=event.target.value;
  if(!["leve","medio","pesado","distancia","Punhos"].includes(selected))return;
  state.weaponFocus=selected;
  const reason=dependentsValid(state);
  if(reason){state.weaponFocus=previous;event.target.value=previous;toast("Especialização bloqueada: "+reason);return;}
  render();save();
 });
 $("theme-toggle").addEventListener("click",()=>{
  const next=document.documentElement.dataset.theme==="light"?"dark":"light";
  document.documentElement.dataset.theme=next;
  localStorage.setItem(THEME_KEY,next);
 });
 $("demo-load").addEventListener("click",()=>{
  if(!confirm("Carregar uma ficha de exemplo? A ficha atual será substituída (você pode exportá-la antes)."))return;
  state=demo();draft=freshDraft();syncFields();render();save();toast("Exemplo carregado. Experimente selecionar Armas → Força → Apresentação.");
 });
 $("reset-sheet").addEventListener("click",()=>{
  if(!confirm("Reiniciar todos os dados deste protótipo?"))return;
  state=defaultState();draft=freshDraft();syncFields();render();save();toast("Protótipo reiniciado.");
 });
 $("export-json").addEventListener("click",download);
 $("import-trigger").addEventListener("click",()=>$("import-json").click());
 $("import-json").addEventListener("change",async event=>{const f=event.target.files?.[0];if(f)await importFile(f);event.target.value="";});
 $("portrait-trigger").addEventListener("click",()=>$("portrait-input").click());
 $("portrait-input").addEventListener("change",event=>{
  const f=event.target.files?.[0];if(!f)return;
  if(f.size>1000000||!["image/jpeg","image/png","image/webp"].includes(f.type)){toast("Use PNG, JPG ou WebP de até 1 MB.");return;}
  const reader=new FileReader();
  reader.onload=()=>{if(String(reader.result).length>1550000){toast("Imagem grande demais para o salvamento local.");return;}
   state.portrait=String(reader.result);$("portrait-image").src=state.portrait;save();toast("Retrato atualizado.");};
  reader.readAsDataURL(f);event.target.value="";
 });
 $("add-item").addEventListener("click",()=>{
  state.items.push(normalizeItem({name:"Novo equipamento",type:"outro",weight:"leve",grade:1,max:0}));renderInventory();renderVitals();save();
 });
 $("convert-courage").addEventListener("click",()=>{
  if(state.level<5||state.courageUsedTurn||state.courage<2||state.pp>=maxPP())return;
  state.courage-=2;state.pp++;state.courageUsedTurn=true;renderVitals();renderSkills();save();toast("Perícia em Coragem: 2 Coragens convertidas em 1 PP.");
 });
 $("reset-turn").addEventListener("click",()=>{state.courageUsedTurn=false;renderSkills();save();toast("Nova oportunidade: conversão em Coragem liberada.");});
 window.addEventListener("storage",event=>{if(event.key===SAVE_KEY&&event.newValue){toast("A ficha foi alterada em outra aba. Recarregue para sincronizar.");}});
}
bind();load();
})();