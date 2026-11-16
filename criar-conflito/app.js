/* Codex RPG — Criar Conflito: editor local e independente de contas. */
import {KINDS,LEGACY_KINDS,isHumanoidKind,monsterAttributeCost,WEIGHT,uid,blank,normalize,stats,ledger,dice,ATTRIBUTES,KNOWLEDGES,
 PRACTICES,SKILLS,encounterSummary,narratorCap,remainingKinds,afterItem,clamp,quickHumanoid,COMPANION_TYPES,normalizeCompanions,companionEncounterXP}
 from "./rules.mjs?v=20261115-kinds1";
import {skillPrerequisite} from "../foundry-prototype/module/equipment-logic.mjs";
import {canDeclareJoint,creaturePool,humanoidPool,composeActionPool,rollCreatureFaces,previewCreatureRoll,previewHumanoidRoll,settleCreatureRoll,faceSymbols,SITUATIONS}
 from "./roll-engine.mjs?v=20261115-kinds1";
const KEY="codex-rpg-criar-conflito-v1";
const HUMANOID_INBOX_KEY="codex-rpg-conflito-humanoide-inbox-v1";
const el=id=>document.getElementById(id);
const esc=value=>String(value??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const fmt=n=>Number(n).toLocaleString("pt-BR",{maximumFractionDigits:4});
const catalog=(window.CODEX_G1_CATALOG||[]).filter(x=>Number(x.grade)===1&&x.kind!=="focus");
const diePath={
 4:'<polygon points="21,4 39,36 3,36"/><path d="M21 4 L21 27 L3 36 M21 27 L39 36"/>',
 6:'<polygon points="21,3 37,12 37,30 21,39 5,30 5,12"/><path d="M5 12 L21 21 L37 12 M21 21 L21 39"/>',
 10:'<polygon points="21,2 35,14 32,32 21,40 10,32 7,14"/><path d="M7 14 L21 9 L35 14 M21 9 L21 40 M7 14 L21 25 L35 14 M21 25 L10 32 M21 25 L32 32"/>',
 12:'<polygon points="21,2 35,8 40,21 34,34 21,40 8,34 2,21 7,8"/><path d="M21 9 L31 16 L28 29 L14 29 L11 16 Z M21 2 L21 9 M35 8 L31 16 M40 21 L31 16 M34 34 L28 29 M21 40 L28 29 M8 34 L14 29 M2 21 L11 16 M7 8 L11 16"/>'
};
const dieIcons=values=>(values||[]).map(n=>'<span class="cf-die d'+n+'"><svg width="21" height="21" viewBox="0 0 42 42" fill="none" stroke="currentColor" stroke-width="1.7">'+(diePath[n]||diePath[4])+'</svg> d'+n+'</span>').join("");
function load(){
 let s={players:4,publicPavor:2,partyXp:80,companions:normalizeCompanions({},4),roster:[],active:null,rollHistory:[]};
 try{
  const raw=JSON.parse(localStorage.getItem(KEY)||"null");
  if(raw&&typeof raw==="object"){
   s.players=Math.floor(clamp(raw.players,0,30));
   s.partyXp=Math.floor(clamp(raw.partyXp,0,99999));
   s.companions=normalizeCompanions(raw.companions,s.players);
   s.publicPavor=Math.floor(clamp(raw.publicPavor,0,narratorCap(s.players)));
    s.roster=Array.isArray(raw.roster)?raw.roster.slice(0,80).map(unit=>{
    if(Array.isArray(unit?.items))unit.items=unit.items.map(item=>{
      if(item.kind||item.integrityMax!==undefined)return item;
      const entry=catalog.find(x=>x.name===item.name);
      return entry?{...item,kind:entry.kind,integrityMax:entry.integrity?.max??0,
       integrity:entry.integrity?.value??0,equipped:false}:item;
    });
    return normalize(unit);
   }):[];
   s.active=s.roster.some(x=>x.id===raw.active)?raw.active:s.roster[0]?.id||null;
    s.lastRoll=raw.lastRoll&&typeof raw.lastRoll==="object"?raw.lastRoll:null;
   s.rollHistory=Array.isArray(raw.rollHistory)?raw.rollHistory.slice(0,300).filter(e=>e&&typeof e==="object"):[];
  }
 }catch(e){console.warn("Codex: dados locais de conflito inválidos",e);}
 return s;
}
let model=load(),noticeTimer=null,creatureRoll=null,conflictMode="edit",rollDraft=null,conflictActionTab="skills";
function draftFor(t){
 if(rollDraft?.id!==t.id){
  const trained=[...KNOWLEDGES.map(([key])=>({group:"knowledge",key,grade:t.knowledges[key]})),
   ...PRACTICES.map(([key])=>({group:"practice",key,grade:t.practices[key]}))]
   .find(x=>x.grade>0);
  const attribute=ATTRIBUTES.find(([key])=>t.attributes[key]>0)?.[0]||"forca";
  rollDraft={id:t.id,baseGroup:trained?.group||"practice",baseKey:trained?.key||"atletismo",
   attribute,first:"forca",second:"vigor",mode:"armas",extra:null,contextOK:false,
   step:false,stepDieId:"",extraKeep:isHumanoidKind(t.kind)&&t.threatGrade>=2,de:Math.max(1,stats(t).de),situation:"neutral",declaredSkill:"",declaredAction:""};
 }
 return rollDraft;
}
function selectionFor(t,d){
 return isHumanoidKind(t.kind)?
  {baseGroup:d.baseGroup,baseKey:d.baseKey,attribute:d.attribute,mode:d.mode,extra:d.extra,contextOK:d.contextOK}:
  {first:d.first,second:d.second,extra:d.extra,contextOK:d.contextOK};
}
function scrollToRoll(){el("cf-roll-panel")?.scrollIntoView({behavior:"smooth",block:"start"});}
function storeHistory(t,r,preview,settlement){
 const record={id:uid(),date:new Date().toISOString(),unitId:t.id,unit:t.name,kind:t.kind,
  sources:r.sources||[],mode:r.mode||"normal",declaredSkill:r.declaredSkill||"",declaredAction:r.declaredAction||"",de:r.de,situation:r.situation,
  dice:r.dice.map(d=>({group:d.group,key:d.key,sides:d.sides,baseSides:d.baseSides||d.sides,face:d.face,
   kept:r.selected.includes(d.id),symbols:faceSymbols(d.sides,d.face)})),
  outcome:preview.result.outcome,reached:preview.result.reached,success:preview.result.success,
  e:preview.result.e,a:preview.remainingA,p:preview.result.p,damage:preview.result.damage,
  critical:preview.result.critical||0,extraKeep:!!r.extraKeep,stepDieId:r.stepDieId||"",
  pavorSpent:settlement.spent||0,courageSpent:settlement.courageSpent||0,
  localGain:settlement.localGain||0,publicGain:settlement.publicGain||0,
  cancelP:r.cancelP,convertPairs:r.convertPairs,passA:r.passA};
 model.rollHistory=[record,...(model.rollHistory||[])].slice(0,300);
}
function downloadText(text,filename,mime){
 const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),anchor=document.createElement("a");
 anchor.href=url;anchor.download=filename;anchor.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function exportRollHistory(){
 const cols=["Data","Ficha","Tipo","Ação declarada","Perícia declarada","Fontes","DE","Resultado","E","A livre","P","Dano","Crítico","Coragem gasta","Pavor gasto","Dados rolados"];
 const csv=[cols,...(model.rollHistory||[]).map(x=>[
 x.date,x.unit,x.kind,x.declaredAction||"",x.declaredSkill||"",(x.sources||[]).map(y=>y.group+":"+y.key).join(" + "),x.de,x.outcome,
 x.e,x.a,x.p,x.damage,x.critical,x.courageSpent,x.pavorSpent,
 (x.dice||[]).map(d=>"d"+d.sides+":"+d.face+(d.kept?"(mantido)":"(descartado)")).join(" | ")
 ])].map(row=>row.map(v=>'"'+String(v??"").replace(/"/g,'""')+'"').join(";")).join("\r\n");
 downloadText("\uFEFF"+csv,"codex-conflito-playtest-rolagens.csv","text/csv;charset=utf-8");
}
function consumeQuickHumanoid(){
 let raw;
 try{raw=localStorage.getItem(HUMANOID_INBOX_KEY);}catch(e){return "";}
 if(!raw)return "";
 if(model.roster.length>=80)return "Limite de 80 fichas. O humanoide permanece salvo no criador rápido.";
 try{
  const incoming=JSON.parse(raw);
  if(incoming?.schema!=="codex-humanoide-rapido-v1"||incoming.character?.kind!=="humanoide")throw Error("Tipo de pacote inválido");
  const unit=normalize(incoming.character);
  if(!isHumanoidKind(unit.kind))throw Error("Tipo inválido");
  model.roster.push(unit);model.active=unit.id;
  save();
  localStorage.removeItem(HUMANOID_INBOX_KEY);
  return "Humano comum adicionado ao conflito com "+ledger(unit).spent+" XP investidos.";
 }catch(e){return "Não foi possível importar a ficha rápida. A construção permanece no criador de humanoides.";}
}

const selected=()=>model.roster.find(x=>x.id===model.active)||null;
function save(){
 try{localStorage.setItem(KEY,JSON.stringify(model));}
 catch(e){notice("Não foi possível salvar neste navegador. Exporte o conflito em JSON.");}
}
function notice(text){
 const p=el("notice");p.textContent=text;p.hidden=false;
 clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>p.hidden=true,4700);
}
function pavorDelta(value){model.publicPavor=Math.floor(clamp(model.publicPavor+value,0,narratorCap(model.players)));save();renderSummary();}
function renderSummary(){
 const summary=encounterSummary(model.roster,model.players),total=summary.totalXP,party=model.partyXp;
 const allies=companionEncounterXP(model.companions,model.players),effectiveParty=party+allies.xp;
 el("player-count").value=model.players;
 el("public-count").textContent=model.publicPavor+" / "+summary.publicCap+" P";
 const joint=el("public-joint-actions");
 if(joint)joint.innerHTML=[2,3].map(n=>{
  const allow=canDeclareJoint(model.roster,model.publicPavor,n);
  return '<button type="button" data-joint="'+n+'"'+(allow.ok?'':' disabled')+'>'+
   'Líder + '+(n-1)+' aliado(s) · '+allow.cost+'P</button>';
 }).join("");
 el("roster-count").textContent=summary.count+" ficha"+(summary.count===1?"":"s");
 el("leader-count").textContent=summary.leaders?
  summary.leaders+" Líder"+(summary.leaders===1?"":"es")+" cadastrado"+(summary.leaders===1?"":"s"):
  summary.count?"Sem líder — permitido para inimigos comuns.":"Liderança opcional.";
 el("encounter-xp").textContent=fmt(total)+" XP";
 el("party-xp").value=party;
 el("companion-xp-total").textContent=allies.missing.length?
  fmt(allies.xp)+" XP informados; sem XP definido: "+allies.missing.join(", "):
  fmt(allies.xp)+" XP de "+allies.count+" companheiro(s)";
 el("party-effective-xp").textContent=(allies.missing.length?"Orçamento parcial: ":"Grupo + companheiros: ")+fmt(effectiveParty)+" XP";
 for(const type of COMPANION_TYPES){
  const record=allies.normalized[type],count=el("companion-count-"+type),xp=el("companion-xp-"+type);
  if(count){count.value=record.count;count.max=model.players;}
  if(xp)xp.value=record.xpTotal===null?"":record.xpTotal;
 }
 el("xp-compare").textContent=allies.missing.length?"XP pendente de companheiros: "+allies.missing.join(", ")+". Informe para concluir a comparação.":
  summary.overbudget?"Há "+summary.overbudget+" ficha(s) acima do XP autorizado.":
  !summary.count?"Grau não determina desafio automaticamente.":
  total<effectiveParty?"XP das ameaças inferior ao grupo: não há XP por enfrentamento, conforme o SRD.":
  total===effectiveParty?"XP igual: recompensa-base elegível; fórmula pendente.":
  "XP das ameaças superior ao grupo: potencial de recompensa maior; fórmula pendente.";
}
function publicJointSpend(n){
 const check=canDeclareJoint(model.roster,model.publicPavor,n);
 if(!check.ok)return notice("Requer Líder vivo, participantes e Pavor público suficiente.");
 if(!confirm("Gastar "+check.cost+"P público para Líder + "+(n-1)+
  " aliado(s)? A declaração não rola os dados; custos locais e alvos continuam manuais."))return;
 model.publicPavor-=check.cost;save();renderSummary();
 notice("Gasto de "+check.cost+"P público registrado para a ação conjunta.");
}
function renderRoster(){
 el("roster").innerHTML=model.roster.length?model.roster.map(t=>{
  const x=stats(t),chosen=t.id===model.active,over=x.xp.remaining<0;
  return '<article class="cf-threat-card'+(chosen?' is-active':'')+'">'+
   '<button type="button" class="cf-threat-pick" data-open="'+esc(t.id)+'" aria-pressed="'+chosen+'"><span><strong>'+esc(t.name||"Sem nome")+'</strong><small>'+esc(KINDS[t.kind]||LEGACY_KINDS[t.kind]||t.kind)+
   ' · Grau '+t.threatGrade+'</small></span><span aria-hidden="true">'+(t.leader?'★':'›')+'</span></button>'+
   '<div class="cf-threat-counts"><span>'+t.life+'/'+x.life+' Vida</span><span>DE '+x.de+'</span>'+
   '<span class="is-purple">'+t.pavorLocal+'/'+x.limitLocal+' P</span>'+
   '<span'+(over?' style="color:#e6a1a1"':'')+'>'+x.xp.spent+'/'+x.xp.grant+' XP</span>'+
   (t.items.some(it=>it.kind==="armor")?'<span>Armadura '+t.items.filter(it=>it.kind==="armor").map(it=>it.integrity+"/"+it.integrityMax).join(", ")+'</span>':'')+
   '</div>'+
   '<div class="cf-threat-actions"><button type="button" data-copy="'+esc(t.id)+'">Duplicar</button>'+
   '<button type="button" data-delete="'+esc(t.id)+'">Excluir</button></div></article>';
 }).join(""):'<p class="cf-description">Nenhuma ficha neste conflito. Use “Criar ficha” para começar.</p>';
}
function field(label,key,options={}){
 const t=selected(),value=t[key]??"",type=options.type||"text";
 const classes=options.wide?" cf-wide":options.full?" cf-full":"";
 const html=type==="textarea"?'<textarea data-field="'+key+'" maxlength="'+(options.max||4000)+'" rows="4">'+esc(value)+'</textarea>':
  type==="select"?'<select data-field="'+key+'">'+options.choices.map(([k,v])=>'<option value="'+esc(k)+'"'+(k===value?' selected':'')+'>'+esc(v)+'</option>').join("")+'</select>':
  '<input type="'+type+'" data-field="'+key+'" value="'+esc(value)+'"'+
   (type==="number"?' min="'+(options.min??0)+'" max="'+(options.max??9999)+'" step="1"':'')+' maxlength="'+(options.max||160)+'">';
 return '<label class="'+classes+'">'+label+html+'</label>';
}
function gradeCards(t,group,entries){
 const prop={attr:"attributes",know:"knowledges",practice:"practices"}[group];
 return '<div class="cf-grade-group">'+entries.map(([key,name])=>{
  const grade=Number(t[prop][key]||0);
  const numbers=group==="attr"?dice(t,key):(()=>{const diceTable=[[6],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];return diceTable[grade];})();
  const cost=group==="attr"?(monsterAttributeCost(t.kind)?[0,2,8,20,38,66,102]:[0,1,3,7,15,31,55]):
   [0,2,8,20,38,66,102];
  const note=grade<6?"Próximo grau: "+(cost[grade+1]-cost[grade])+" XP":"Grau máximo";
  return '<div class="cf-grade is-'+group+'"><strong>'+esc(name)+' · Grau '+grade+'</strong>'+
   '<div class="cf-grade-controls"><button type="button" data-grade="'+group+'" data-key="'+key+'" data-delta="-1"'+(grade===0?' disabled':'')+' aria-label="Diminuir '+esc(name)+'">−</button>'+
   '<div class="cf-die-row">'+dieIcons(numbers)+'</div>'+
   '<button type="button" data-grade="'+group+'" data-key="'+key+'" data-delta="1"'+(grade===6?' disabled':'')+' aria-label="Aumentar '+esc(name)+'">+</button></div>'+
   '<small>'+note+'</small></div>';
 }).join("")+'</div>';
}
function canBuySkill(t,id){
 if(id==="invocacao-elemental"){
  const skills=new Set(t?.skills||[]);
  return skills.has("criar-item-foco-magia")&&skills.has("domar-criatura-pequena")&&["fogo","agua","vento","terra","sagrado","veneno","sangue","trevas"].some(x=>skills.has(x));
 }
 if(["domar-criatura-pequena","domar-criatura-media","domar-criatura-grande"].includes(id))
  return Number(t?.attributes?.influencia||0)>=(id==="domar-criatura-pequena"?2:id==="domar-criatura-media"?3:4)&&Number(t?.attributes?.inteligencia||0)>=1&&Number(t?.practices?.apresentacao||0)>=1;
 return skillPrerequisite({...t,monsterRules:false},id);
}
function skillPanel(t){
 if(!isHumanoidKind(t.kind))return '<p>Capacidades naturais de criaturas são registradas como texto, sem conceder poderes humanos automaticamente.</p>';
 return '<p>Humanoides usam Perícias de personagens. A ferramenta contabiliza o XP, mas requisitos ainda não verificados pelo protótipo exigem consulta ao SRD.</p>'+
  '<details open><summary>Selecionar Perícias e ver custo</summary><p class="cf-note">Marque uma Perícia quando os requisitos e o XP permitirem. As demais ficam desabilitadas até desenvolver as fontes necessárias.</p><div class="cf-skills">'+SKILLS.filter(it=>Number.isInteger(it.cost)&&(!["combate","armas"].includes(it.id)||t.skills.includes(it.id))).map(it=>{
   const valid=canBuySkill(t,it.id);
   return '<label class="cf-skill"><input type="checkbox" data-skill="'+esc(it.id)+'"'+(t.skills.includes(it.id)?' checked':'')+
    (valid?'':' disabled')+'><span>'+esc(it.name)+' · '+it.cost+' XP'+(valid?'':' (requisito pendente)')+'</span></label>';
  }).join("")+'</div></details>';
}
function itemOptions(){
 return catalog.map((it,i)=>'<option value="'+i+'">'+esc(it.name)+' · '+it.priceVT+' VT* · '+fmt(catalogWeight(it))+' Alto</option>').join("");
}
function catalogWeight(it){
 const base=Number(it.weight)||WEIGHT[it.category==="pesado"?"pesado":it.category==="medio"?"medio":"leve"];
 return (it.properties||[]).includes("Muito Leve")?base*.5:base;
}
function inventory(t,x){
 const free=x.capacity-x.used,counts=remainingKinds(t);
 return '<section class="cf-panel"><h3>Equipamento e carga</h3>'+
  '<p>Inventário do encontro. Os preços G1 são propostos; adicionar um item aqui não simula uma compra com VT nem concede uma Perícia.</p>'+
  '<div class="cf-weight-status">'+
  '<strong'+(free<-1e-9?' style="color:#e9a7a7"':'')+'>Carga física: '+fmt(x.used)+' / '+fmt(x.capacity)+' Alto</strong>'+
  (free<-1e-9?'<p class="cf-warning">Capacidade de carga excedida por '+fmt(-free)+' Alto. Penalidade mecânica pendente.</p>':'')+
  '<div class="cf-weight-counts"><span><b>'+counts.leve+'</b> leves</span><span><b>'+counts.medio+'</b> médios</span><span><b>'+counts.pesado+'</b> pesados</span></div>'+
  '<p class="cf-note">Quantidades alternativas, não somadas. Itens equipados também pesam.</p></div>'+
  (catalog.length?'<div class="cf-form-row"><label>Adicionar do catálogo G1<select id="catalog-choose">'+itemOptions()+'</select></label>'+
   '<label>Quantidade<input id="item-quantity" type="number" min="1" max="99" value="1"></label>'+
   '<button type="button" data-add-catalog>Adicionar ao inventário</button></div>':
   '<p class="cf-note">Catálogo indisponível nesta página.</p>')+
  '<div class="cf-items">'+(t.items.length?t.items.map(it=>
   '<div class="cf-item"><div class="cf-item-descriptor"><strong>'+esc(it.name)+'</strong>'+
   '<small>'+it.qty+' un. · '+fmt(it.weight*it.qty)+' Alto · '+esc(it.kind==="armor"?"Armadura":it.kind==="shield"?"Escudo":"Equipamento")+'</small>'+
   (it.kind==="armor"||it.kind==="shield"?'<span class="cf-integrity-label">Integridade: <strong>'+
    (it.integrityMax?it.integrity+" / "+it.integrityMax:"Sem Integridade definida")+'</strong></span>':'')+'</div>'+
   ((it.kind==="armor"||it.kind==="shield")&&it.integrityMax?'<div class="cf-integrity-actions">'+
    '<button type="button" data-integrity="'+esc(it.id)+'" data-delta="-1" aria-label="Reduzir Integridade de '+esc(it.name)+'">−</button>'+
    '<button type="button" data-integrity="'+esc(it.id)+'" data-delta="1" aria-label="Recuperar Integridade de '+esc(it.name)+'">+</button></div>':'')+
   '<button type="button" data-remove-item="'+esc(it.id)+'" aria-label="Remover '+esc(it.name)+'">Remover</button></div>').join(""):
   '<p class="cf-note">Nenhum item cadastrado.</p>')+
  '<p class="cf-note">Integridades G1 conforme SRD v0.44: Muito Leve 0, Leve 7, Média 12, Pesada 17. Para Graus superiores sem valor documentado, o total permanece PENDENTE. O dano deve ser registrado manualmente.</p></div></section>';
}


function rollSourceCards(t){
 const d=draftFor(t),human=isHumanoidKind(t.kind);
 const rows=[
  {title:"Atributos",group:"attribute",defs:ATTRIBUTES,field:"attributes"},
  ...(human?[
   {title:"Conhecimentos",group:"knowledge",defs:KNOWLEDGES,field:"knowledges"},
   {title:"Práticas",group:"practice",defs:PRACTICES,field:"practices"}
  ]:[])
 ];
 const cards=rows.map(row=>'<section class="cf-source-section"><h3>'+row.title+'</h3>'+
  '<div class="cf-source-grid">'+row.defs.map(([key,name])=>{
   const grade=Number(t[row.field][key]||0);
   const chosen=d.extra?.group===row.group&&d.extra?.key===key?"Complemento":
    row.group==="attribute"?(human&&d.attribute===key?"Atributo":
      !human&&d.first===key?"Base":!human&&d.second===key?"Segundo":""):
    human&&d.baseGroup===row.group&&d.baseKey===key?"Base":"";
   const group=row.group==="attribute"?"attribute":row.group;
   const sides=group==="attribute"?dice(t,key):
    [[6],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]][grade];
   return '<button type="button" class="cf-source-card'+(chosen?' is-selected':'')+'" data-roll-source="'+group+
    '" data-source-key="'+key+'" aria-pressed="'+Boolean(chosen)+'"><span class="cf-source-name">'+esc(name)+
    ' <small>G'+grade+'</small></span><span class="cf-source-dice">'+dieIcons(sides||[])+'</span>'+
    (chosen?'<b>'+chosen+'</b>':'')+'</button>';
  }).join("")+'</div></section>').join("");
 const comp=composeActionPool(t,selectionFor(t,d),"");
 return '<section class="cf-panel cf-click-sources"><h3>Componha a ação com um clique</h3>'+
  '<p class="cf-note">Selecione as fontes na ficha. '+(human?
   "Uma Base de Conhecimento ou Prática + um Atributo; a terceira fonte só com habilitação.":"Dois Atributos diferentes e pertinentes; Grau 5+ pode habilitar uma terceira fonte conforme regra.")+
   ' A escolha não compra graus e não gasta recursos.</p>'+cards+
  '<label class="cf-context-toggle"><input type="checkbox" id="cf-pick-extra"'+(d.pickExtra?' checked':'')+'> Clicar para escolher a terceira fonte (se habilitada)</label>'+
  (d.extra?'<div class="cf-extra-preview"><span>Complemento: '+esc(d.extra.group+" · "+d.extra.key)+'</span>'+
   '<label><input type="checkbox" id="cf-context-ok"'+(d.contextOK?' checked':'')+'> Narrador confirma a pertinência</label>'+
   '<button type="button" data-clear-extra>Retirar complemento</button></div>':'')+
  (!comp.ok?'<p class="cf-note">Preparação: '+esc(comp.error)+'</p>':
   '<p class="cf-note">Pilha inicial: <strong>'+comp.pool.map(x=>'d'+x.sides).join(" + ")+'</strong>. Ajuste Coragem, dado elevado e DE no painel abaixo.</p>')+
  '</section>';
}
function historyPanel(t){
 const list=model.rollHistory||[],scope=model.historyScope==="selected"?"selected":"all";
 const records=(scope==="selected"?list.filter(x=>x.unitId===t.id):list).slice(0,50);
 return '<section id="cf-roll-history" class="cf-panel cf-history" aria-label="Histórico de rolagens de playtest">'+
  '<div class="cf-history-head"><div><h3>Histórico de rolagens</h3><p class="cf-note">'+list.length+
  ' registradas neste conflito · armazenadas no navegador e incluídas no JSON</p></div>'+
  '<div class="cf-history-actions"><button type="button" data-history-scope="'+(scope==="all"?"selected":"all")+'">'+
  (scope==="all"?"Ver só esta ficha":"Ver todas as fichas")+'</button><button type="button" data-export-rolls>Exportar CSV</button>'+
  '<button type="button" data-clear-rolls>Limpar histórico</button></div></div>'+
  (records.length?records.map(x=>{
   const date=x.date?new Date(x.date).toLocaleString("pt-BR"):"Sem data";
   return '<details class="cf-history-entry"><summary><strong>'+esc(x.unit||"Sem nome")+'</strong>'+
    '<span>'+esc(date)+'</span><span>'+esc(x.declaredAction||"Teste básico")+' · '+esc(x.outcome||"Resultado")+
    ' · '+Number(x.reached||0)+'/DE '+Number(x.de||0)+'</span></summary>'+
    '<p>Fontes: '+esc((x.sources||[]).map(y=>y.group+":"+y.key).join(" + "))+'</p>'+
    (x.declaredSkill?'<p>Perícia declarada: '+esc(SKILLS.find(z=>z.id===x.declaredSkill)?.name||x.declaredSkill)+'</p>':'')+
    '<p>ᛋ '+Number(x.e||0)+'E · ᚨ '+Number(x.a||0)+'A · ᚦ '+Number(x.p||0)+'P · Dano básico '+Number(x.damage||0)+
    ' · Crítico '+Number(x.critical||0)+'</p>'+
    '<p>Coragem '+Number(x.courageSpent||0)+' · Pavor local '+Number(x.pavorSpent||0)+
    ' · Elevação '+esc(x.stepDieId||"nenhuma")+'</p>'+
    '<p>Faces: '+esc((x.dice||[]).map(d=>'d'+d.sides+' face '+d.face+(d.kept?' (mantido)':' (descartado)')).join(" · "))+'</p></details>';
  }).join(""):'<p class="cf-note">Nenhuma rolagem confirmada neste filtro. Faça um teste e confirme para documentar o playtest.</p>')+
  (list.length>50?'<p class="cf-note">Exibidas 50 entradas mais recentes; o CSV inclui todas as até 300 preservadas.</p>':'')+
  '</section>';
}

const ELEMENTAL_NPC_SKILLS=new Set(["fogo","agua","vento","terra","psiquico","veneno","sagrado","trevas","sangue"]);
/** Atalhos declarativos: não concedem automaticamente efeitos especiais ou dados extras. */
function threatActions(t){
 const human=isHumanoidKind(t.kind),d=draftFor(t),tabs=[["weapons","Armas"],["elements","Elementos"],["skills","Perícias"]];
 const owned=(t.skills||[]).map(id=>SKILLS.find(row=>row.id===id)).filter(Boolean);
 const skills=owned.filter(row=>conflictActionTab==="elements"?ELEMENTAL_NPC_SKILLS.has(row.id):!ELEMENTAL_NPC_SKILLS.has(row.id));
 const weapons=(t.items||[]).filter(item=>item.kind==="weapon");
 let cards="";
 if(conflictActionTab==="skills"||conflictActionTab==="elements"){
  cards=human?skills.map(row=>'<button type="button" class="cf-action-choice'+(d.declaredSkill===row.id?" is-selected":"")+
   '" data-conflict-action="skill" data-action-skill="'+esc(row.id)+'"><strong>'+esc(row.name)+'</strong>'+
   '<small>Declarar na ação · requisitos, ativação e efeitos conforme SRD</small></button>').join("")+
   (!skills.length?'<p class="cf-note">Nenhuma Perícia desta categoria foi comprada.</p>':""):
   '<p class="cf-note">Capacidades extraordinárias são registradas na Edição e resolvidas com o Narrador.</p>';
 }else{
  cards='<button type="button" class="cf-action-choice" data-conflict-action="basic">Teste básico com fontes selecionadas</button>'+
   weapons.map(item=>'<button type="button" class="cf-action-choice" data-conflict-action="weapon" data-action-item="'+
   esc(item.id)+'"><strong>'+esc(item.name)+'</strong><small>Preparar Disciplina; escolha Atributo pertinente</small></button>').join("")+
   (!weapons.length?'<p class="cf-note">Armas cadastradas no Inventário aparecem aqui.</p>':"");
 }
 return '<section class="cf-panel cf-action-shortcuts"><h3>Ações da ficha</h3>'+
  '<div class="cf-action-tabs" role="group" aria-label="Categorias de ações">'+tabs.map(([id,name])=>
   '<button type="button" data-action-tab="'+id+'" aria-pressed="'+(conflictActionTab===id)+'"'+
   (conflictActionTab===id?' class="is-active"':'')+'>'+name+'</button>').join("")+'</div>'+
  '<div class="cf-action-choice-list">'+cards+'</div>'+
  (d.declaredAction?'<p class="cf-note"><strong>Ação declarada:</strong> '+esc(d.declaredAction)+
   ' · efeitos específicos continuam sujeitos à habilitação.</p>':'')+'</section>';
}
function prepareThreatAction(kind,skillId,itemId){
 const t=selected();if(!t)return;
 if(creatureRoll?.id===t.id)return notice("Confirme ou descarte a rolagem atual antes de escolher outra ação.");
 const d=draftFor(t);
 const row=SKILLS.find(x=>x.id===skillId&&t.skills.includes(x.id));
 const item=t.items.find(x=>x.id===itemId);
 if(kind==="skill"&&!row)return notice("A Perícia não foi adquirida neste NPC.");
 if(kind==="weapon"&&!item)return notice("O equipamento não pertence à ficha.");
 if(kind==="skill"&&ELEMENTAL_NPC_SKILLS.has(skillId)){
  if(!t.skills.includes("criar-item-foco-magia"))return notice("Conjuração requer Criar Item de Foco e Magia e foco habilitado.");
  d.baseGroup="practice";d.baseKey="armas_conjuracao";d.mode="conjuracao";
 }else if(kind==="weapon"&&isHumanoidKind(t.kind)){
  d.baseGroup="practice";d.baseKey="armas_conjuracao";d.mode="armas";
 }
 d.declaredSkill=row?.id||"";
 d.declaredAction=row?.name||item?.name||(kind==="basic"?"Teste básico":"Ação natural");
 render();
}

function rollWorkspace(t){
 const d=draftFor(t);
 return '<div class="cf-roll-workspace"><div class="cf-roll-heading"><div><span class="eyebrow">MODO ROLAGEM</span>'+
  '<h2>'+esc(t.name||"Ameaça")+'</h2><p>Selecione fontes, prepare a pilha e registre cada teste.'+
  (stats(t).playerEquivalentLevel?' Grau 2 corresponde à ameaça de um jogador nível 5, mas a retenção usa o Grau.':'')+'</p></div>'+
  '<div class="cf-roll-resources"><span>Pavor local <b>'+t.pavorLocal+' / '+stats(t).limitLocal+'</b></span>'+
  (isHumanoidKind(t.kind)?'<span>Coragem <b>'+t.courage+' / 10</b>'+
   ' <button type="button" data-courage="-1" aria-label="Gastar Coragem manualmente">−</button>'+
   ' <button type="button" data-courage="1" aria-label="Recuperar Coragem manualmente">+</button></span>':'')+
  '</div></div><div class="cf-roll-layout"><div class="cf-roll-sources">'+rollSourceCards(t)+'</div>'+
  '<div class="cf-roll-primary">'+threatActions(t)+rollPane(t)+'</div></div>'+historyPanel(t)+'</div>';
}

function rollPane(t){
 const human=isHumanoidKind(t.kind),r=creatureRoll?.id===t.id?creatureRoll:null,d=draftFor(t);
 const choice=(values,current)=>values.map(([key,name])=>
  '<option value="'+key+'"'+(key===current?' selected':'')+'>'+esc(name)+'</option>').join("");
 const trained=[...KNOWLEDGES.map(([key])=>({group:"knowledge",key,grade:t.knowledges[key]})),
  ...PRACTICES.filter(([key])=>key!=="armas_conjuracao").map(([key])=>({group:"practice",key,grade:t.practices[key]}))]
  .find(x=>x.grade>0);
 const group=r?.group||d.baseGroup||trained?.group||"practice";
 const baseKey=r?.baseKey||d.baseKey||(trained?.group===group?trained.key:group==="practice"?"atletismo":"protecao");
 const attrDefault=ATTRIBUTES.find(([key])=>Number(t.attributes[key]||0)>0)?.[0]||"forca";
 const attrKey=r?.attribute||d.attribute||attrDefault;
 const first=r?.first||d.first||"forca",second=r?.second||d.second||"vigor";
 const sources=group==="knowledge"?KNOWLEDGES:PRACTICES;
 const sourceConfig=human?(
  '<label>Fonte base<select id="cf-roll-group"'+(r?' disabled':'')+'>'+
   '<option value="knowledge"'+(group==="knowledge"?' selected':'')+'>Conhecimento</option>'+
   '<option value="practice"'+(group==="practice"?' selected':'')+'>Prática</option></select></label>'+
  '<label>Conhecimento ou Prática<select id="cf-roll-base"'+(r?' disabled':'')+'>'+choice(sources,baseKey)+'</select></label>'+
  '<label>Atributo pertinente<select id="cf-roll-attr"'+(r?' disabled':'')+'>'+choice(ATTRIBUTES,attrKey)+'</select></label>'+
  '<label>Aplicação da Disciplina<select id="cf-roll-mode"'+(r||baseKey!=="armas_conjuracao"?' disabled':'')+'>'+
   '<option value="armas"'+((r?.mode||d.mode||"armas")==="armas"?' selected':'')+'>Armas (Disciplina básica livre)</option>'+
   '<option value="conjuracao"'+((r?.mode||d.mode)==="conjuracao"?' selected':'')+'>Conjuração (foco habilitado)</option>'+
   '</select></label>'
 ):(
  '<label>Atributo base<select id="cf-roll-first"'+(r?' disabled':'')+'>'+choice(ATTRIBUTES,first)+'</select></label>'+
  '<label>Outro Atributo<select id="cf-roll-second"'+(r?' disabled':'')+'>'+choice(ATTRIBUTES,second)+'</select></label>'
 );
 const sel=r?.selected||[];
 const result=r?(human?previewHumanoidRoll(t,r.dice,sel,{
  de:r.de,situation:r.situation,cancelP:r.cancelP,convertPairs:r.convertPairs,passA:r.passA,extraKeep:r.extraKeep,stepDieId:r.stepDieId
 }):previewCreatureRoll(t,r.dice,sel,{
  de:r.de,situation:r.situation,cancelP:r.cancelP,convertPairs:r.convertPairs,passA:r.passA,stepDieId:r.stepDieId
 })):null;
 const runes=["ᛋ","ᚨ","ᚦ"],colors=["E","A","P"];
 const dice=r?'<div class="cf-roll-dice">'+r.dice.map(d=>{
  const kept=sel.includes(d.id);
  const marks=faceSymbols(d.sides,d.face).map((qty,i)=>
   Array(qty).fill(0).map(()=>'<span class="cf-symbol cf-symbol-'+colors[i]+(d.face===d.sides?' is-max':'')+'">'+runes[i]+'</span>').join("")).join("")||"Vazio";
  return '<label class="cf-roll-die'+(kept?' is-kept':'')+'">'+
   '<input type="checkbox" data-roll-keep="'+esc(d.id)+'"'+(kept?' checked':'')+'>'+
   dieIcons([d.sides])+'<b>Face '+d.face+'</b><span>'+marks+'</span>'+
   '<small>'+(kept?'Mantido':'Descartado')+'</small></label>';
 }).join("")+'</div>':"";
 const outcome=r?'<div class="cf-roll-outcome">'+(result.ok?
  '<strong>'+esc(result.result.outcome)+' · '+result.result.reached+' / DE '+r.de+'</strong>'+
  '<p>ᛋ '+result.result.e+'E · ᚨ '+result.remainingA+'A livre · ᚦ '+result.result.p+'P residual · Dano básico '+result.result.damage+'</p>'+
  '<p>Gasto de retenção: '+result.cost+'P local · '+(result.courageCost||0)+' Coragem'+(result.criticalPavor?' · Crítico gera '+result.criticalPavor+'P nas reservas':'')+'</p>':
  '<p class="cf-warning">'+esc(result.error)+'</p>')+
  '<button type="button" data-roll-confirm class="cf-primary"'+(result.ok?'':' disabled')+'>Confirmar resultado e recursos</button></div>':"";
 const last=model.lastRoll?.id===t.id?'<p class="cf-note">Última rolagem confirmada: '+esc(model.lastRoll.outcome)+
  ' · '+model.lastRoll.e+'E / '+model.lastRoll.p+'P · custo local '+model.lastRoll.spent+'P.</p>':"";
 const help=human?
  'Escolha uma Prática ou Conhecimento e um Atributo pertinente. Disciplina marcial básica é permitida; Conjuração requer a habilitação pertinente. Sem Perícia ou equipamento automático: efeitos especiais e bônus devem ser resolvidos à parte. A retenção adicional por Coragem é registrada e descontada ao confirmar a rolagem.':
  'Escolha dois Atributos pertinentes. Dados descartados não produzem símbolos. Fontes adicionais, equipamentos, alvos e efeitos especiais ainda exigem resolução específica.';
 const allowed=human?stats(t).keepBase+Number(!!(r?.extraKeep??d.extraKeep)):t.keep;
 const originalPool=composeActionPool(t,selectionFor(t,d),"");
 const stepOptions=originalPool.ok?originalPool.pool.filter(x=>[4,6,10].includes(x.baseSides)):[];
 const prepare=!r&&(human||t.kind==="monstro")?'<div class="cf-roll-config cf-roll-preparation">'+
  (human?'<label class="cf-roll-switch"><input type="checkbox" id="cf-roll-extra"'+(d.extraKeep?' checked':'')+
   '> Manter dado adicional (1 Coragem)</label>':'')+
  '<label class="cf-roll-switch"><input type="checkbox" id="cf-roll-step"'+(d.step?' checked':'')+
  '> Elevar dado antes de rolar ('+(human?'1 Coragem':'1 Pavor local')+')</label>'+
  (d.step?'<label>Escolher dado elegível<select id="cf-roll-step-die"><option value="">Selecione o dado</option>'+
   stepOptions.map(x=>'<option value="'+esc(x.id)+'"'+(d.stepDieId===x.id?' selected':'')+'>'+
   esc(x.group+" · "+x.key+" · d"+x.baseSides+" → d"+({4:6,6:10,10:12}[x.baseSides]))+
   '</option>').join("")+'</select></label>':'')+'</div>':"";
 const extraHint=d.extra?'<p class="cf-note">Terceira fonte: '+esc(d.extra.group+" / "+d.extra.key)+
  ' · pertinência '+(d.contextOK?"confirmada":"pendente")+'</p>':"";

 return '<section class="cf-panel cf-roll-panel" id="cf-roll-panel"><h3>Rolagem de '+(human?'humanoide':'criatura')+'</h3>'+
  '<p class="cf-note">'+help+'</p>'+
  '<div class="cf-roll-config">'+sourceConfig+
  '<label>DE (Dificuldade de Êxito)<input id="cf-roll-de"'+(r?' disabled':'')+' type="number" min="0" max="30" value="'+(r?.de??d.de)+'"></label>'+
  '<label>Situação<select id="cf-roll-situation"'+(r?' disabled':'')+'>'+Object.entries(SITUATIONS).map(([key,v])=>
   '<option value="'+key+'"'+((r?.situation||d.situation)===key?' selected':'')+'>'+esc(v.label)+'</option>').join("")+'</select></label></div>'+
  prepare+extraHint+'<div class="cf-roll-toolbar"><button class="cf-primary" type="button" data-roll-start>'+(r?'Rolar novamente':'Rolar dados')+'</button>'+
  (r?'<button type="button" data-roll-clear>Alterar fontes</button>':"")+
  '<span>Até '+allowed+' dados mantidos'+(human?' · Coragem '+t.courage+'/10':
   ' · '+Math.max(0,t.keep-2)+'P local se mantiver todos os planejados')+'</span></div>'+
  dice+(r?'<div class="cf-roll-config">'+
   '<label>Anular P (1A por P)<input type="number" data-roll-param="cancelP" min="0" max="9" value="'+r.cancelP+'"></label>'+
   '<label>2A → 1E<input type="number" data-roll-param="convertPairs" min="0" max="9" value="'+r.convertPairs+'"></label>'+
   '<label>Passar oportunidade (1A)<input type="checkbox" data-roll-param="passA"'+(r.passA?' checked':'')+'></label></div>':"")+
  outcome+last+
  '<p class="cf-note">O dano não é aplicado automaticamente. Pavor inimigo residual pode gerar Coragem ao jogador alvo; o Narrador distribui manualmente.</p></section>';
}
function refreshRoll(){const e=el("cf-roll-panel"),t=selected();if(e&&t)e.outerHTML=rollPane(t);}
function beginCreatureRoll(){
 const t=selected();if(!t)return;
 const d=draftFor(t),human=isHumanoidKind(t.kind);
 if(human){
  d.baseGroup=el("cf-roll-group")?.value||d.baseGroup;
  d.baseKey=el("cf-roll-base")?.value||d.baseKey;
  d.attribute=el("cf-roll-attr")?.value||d.attribute;
  d.mode=d.baseKey==="armas_conjuracao"?(el("cf-roll-mode")?.value||"armas"):"normal";
 }else{
  d.first=el("cf-roll-first")?.value||d.first;d.second=el("cf-roll-second")?.value||d.second;
 }
 d.de=Math.floor(clamp(el("cf-roll-de")?.value??d.de,0,30));
 d.situation=el("cf-roll-situation")?.value||d.situation;
 if(d.step&&!d.stepDieId)return notice("Escolha o dado de Atributo, Conhecimento ou Prática que será elevado.");
 if(t.kind==="criatura"&&d.step)return notice("Elevação especial de criaturas comuns não está habilitada.");
 if(creatureRoll?.id===t.id&&!confirm("Descartar a rolagem não confirmada e gerar novos dados?"))return;
 const composed=composeActionPool(t,selectionFor(t,d),d.step?d.stepDieId:"");
 if(!composed.ok)return notice(composed.error);
 const courageCost=human?Number(!!d.extraKeep)+Number(!!d.step):0;
 const pavorCost=t.kind==="monstro"?Number(!!d.step):0;
 if(human&&courageCost>t.courage)return notice("Coragem insuficiente para preparar a rolagem.");
 if(pavorCost>t.pavorLocal)return notice("Pavor local insuficiente para elevar o dado.");
 const generated=rollCreatureFaces(composed.pool);
 const planned=human?stats(t).keepBase+Number(!!d.extraKeep):t.kind==="monstro"?t.keep:2;
 const count=Math.min(planned,generated.length);
 creatureRoll={id:t.id,first:d.first,second:d.second,group:d.baseGroup,
  baseKey:d.baseKey,attribute:d.attribute,mode:d.mode,
  sources:composed.sources,declaredSkill:d.declaredSkill||"",declaredAction:d.declaredAction||"",de:d.de,situation:d.situation,
  extraKeep:human&&!!d.extraKeep,stepDieId:d.step?d.stepDieId:"",
  dice:generated,selected:generated.slice(0,count).map(x=>x.id),
  cancelP:0,convertPairs:0,passA:false};
 refreshRoll();if(innerWidth<760)scrollToRoll();
}
function confirmCreatureRoll(){
 const t=selected(),r=creatureRoll;
 if(!t||!r||r.id!==t.id)return;
 const preview=(isHumanoidKind(t.kind)?previewHumanoidRoll:previewCreatureRoll)(t,r.dice,r.selected,{
  de:r.de,situation:r.situation,cancelP:r.cancelP,convertPairs:r.convertPairs,
  passA:r.passA,extraKeep:r.extraKeep,stepDieId:r.stepDieId});
 if(!preview.ok)return notice(preview.error);
 const settlement=settleCreatureRoll(t,model.publicPavor,model.players,preview);
 if(!settlement.ok)return notice(settlement.error);
 if(!confirm("Confirmar esta rolagem e registrar no playtest? "+
  "Custo: "+(settlement.spent||0)+" Pavor local e "+(settlement.courageSpent||0)+" Coragem. "+
  "Dano básico "+preview.result.damage+" e Pavor residual "+settlement.residualPavor+
  " exigem interpretação/aplicação pelo Narrador."))return;
 const index=model.roster.findIndex(x=>x.id===t.id);if(index<0)return;
 storeHistory(t,r,preview,settlement);
 model.roster[index]=settlement.unit;model.publicPavor=settlement.publicPavor;
 model.lastRoll={id:t.id,outcome:preview.result.outcome,e:preview.result.e,p:preview.result.p,
  a:preview.remainingA,spent:settlement.spent};
 creatureRoll=null;save();render();
 notice("Rolagem confirmada e registrada no histórico para playtest.");
}
function editorHTML(t){
 const x=stats(t),human=isHumanoidKind(t.kind),extra=x.keepCostP,pLocal=x.limitLocal;
 const keepAvail=human?x.keepBase:x.keepBase+Math.min(t.pavorLocal,2);
 return '<div class="cf-edit-hero"><div><span class="eyebrow">FICHA DE AMEAÇA · '+esc(KINDS[t.kind]||LEGACY_KINDS[t.kind]||t.kind)+'</span>'+
  '<h2>'+esc(t.name||"Ameaça sem nome")+'</h2>'+
  '<p>Grau e orçamento de XP são independentes. Compre os graus usando os valores oficiais e confira requisitos especiais antes da sessão.</p></div>'+
  '<div class="cf-actions"><button type="button" data-open-roll class="cf-primary">Modo Rolagem</button><button type="button" data-copy="'+esc(t.id)+'">Duplicar ficha</button>'+
   '<button type="button" data-delete="'+esc(t.id)+'">Excluir</button></div></div>'+
  '<div class="cf-fields">'+field("Nome","name",{wide:true})+
  field("Tipo de criatura","kind",{type:"select",choices:Object.entries({...KINDS,...(t.kind==="criatura"?LEGACY_KINDS:{})})})+
  field("Grau da ameaça","threatGrade",{type:"number",min:1,max:6})+
  field("Conceito / origem","concept",{wide:true})+
  (human?field("Nível do humanoide","level",{type:"number",min:1,max:20}):"")+
  field(t.kind==="humanoide"?"XP adicional (20 iniciais)":"Orçamento de XP definido pelo Mestre","xp",{type:"number",min:0,max:50000})+
  '<label class="cf-check"><input type="checkbox" data-field="leader"'+(t.leader?' checked':'')+'> É Líder</label></div>'+
  (x.playerEquivalentLevel?'<p class="cf-note">Equivalência de ameaça: Grau 2 ≈ jogador de nível 5. O Grau define seu teto próprio de 4 dados mantidos; a equivalência não altera XP nem nível da ficha.</p>':'')+
  '<div class="cf-stat-grid">'+
  '<div class="cf-stat cf-stat-life"><small>VIDA ATUAL / MÁXIMA</small><strong>'+t.life+' / '+x.life+'</strong>'+
  '<div class="cf-life-actions"><button type="button" data-life="-1"'+(t.life<=0?' disabled':'')+' aria-label="Reduzir Vida em um">−</button>'+
  '<label>Vida atual<input type="number" data-field="life" min="0" max="'+x.life+'" step="1" value="'+t.life+'" aria-label="Editar Vida atual"></label>'+
  '<button type="button" data-life="1"'+(t.life>=x.life?' disabled':'')+' aria-label="Aumentar Vida em um">+</button></div>'+
  '<button type="button" class="cf-life-full" data-life-full'+(t.life>=x.life?' disabled':'')+'>Restaurar ao máximo</button>'+
  '<small>Máximo calculado pelos Atributos; aumentos não curam automaticamente.</small></div>'+
  [['DE',x.de],['XP GASTO',x.xp.spent+' / '+x.xp.grant],['XP LIVRE',x.xp.remaining],['DADOS MANTIDOS',(human?x.keepMax:t.keep)+' / '+x.keepMax]]
   .map(([label,val],i)=>'<div class="cf-stat'+(i===2&&x.xp.remaining<0?' is-warning':i===3?' is-purple':'')+'"><small>'+label+'</small><strong>'+val+'</strong></div>').join("")+
  '</div>'+(x.xp.remaining<0?'<p class="cf-warning">XP gasto excede o orçamento em '+(-x.xp.remaining)+' XP. Aumente o orçamento ou reduza graus.</p>':"")+
  '<section class="cf-panel"><h3>Pavor local e retenção</h3>'+
  '<div class="cf-local-row"><strong>Pavor '+t.pavorLocal+' / '+pLocal+'</strong>'+
  '<button type="button" data-local="-1"'+(t.pavorLocal===0?' disabled':'')+'>− P local</button>'+
  '<button type="button" data-local="1"'+(t.pavorLocal>=pLocal?' disabled':'')+'>+ P local</button></div>'+
  '<div class="cf-local-row"><span>'+(human?'Limite de retenção pelo Grau':'Dados mantidos planejados')+': <b>'+(human?x.keepMax:t.keep)+'</b></span>'+
  (human?'':'<button type="button" data-keep="-1"'+(t.keep<=2?' disabled':'')+'>−</button>')+
  (human?'':'<button type="button" data-keep="1"'+(t.keep>=x.keepMax?' disabled':'')+'>+</button>')+'</div>'+
  '<p class="cf-note">'+(human?'Retenção de inimigo pelo Grau da ameaça (independente do nível): Grau 1 permite 2 naturais + 1 por Coragem; Grau 2+ permite 3 naturais + 1 por Coragem, total 4. A Coragem efetivamente gasta é descontada ao confirmar a rolagem.':
   'Ação básica: 2 dados. Cada dado adicional mantido custa 1P local, e somente com dados/capacidades disponíveis.')+
  (human?'':' Retenção planejada: '+extra+'P por oportunidade.')+'</p>'+
  (!human&&extra>t.pavorLocal?'<p class="cf-warning">São necessários '+extra+'P para manter '+t.keep+' dados nesta oportunidade, mas a ficha possui '+t.pavorLocal+'P. O teto da ficha não concede esse Pavor gratuitamente.</p>':"")+
  (keepAvail<t.keep&&!human?'<p class="cf-note">Acumule Pavor antes de executar a retenção pretendida.</p>':"")+'</section>'+

  '<section class="cf-panel"><h3>Atributos · dados e graus</h3>'+
  '<p>'+(t.kind==="monstro"?'Criatura/Monstro: Atributos usam a tabela de Conhecimentos/Práticas, com a escala de dados de criaturas extraordinárias.':
  t.kind==="humanoide-monstro"?'Humanoide Monstro: Atributos, Conhecimentos e Práticas usam a tabela de treinamento; Perícias mantêm os próprios custos. Sua rolagem permanece no modelo humanoide até definição específica.':
  'Humanoide: Atributo grau 1 custa 1 XP; Conhecimentos e Práticas seguem a tabela de treinamento.')+
  ' Fontes respeitam o máximo de nove dados rolados por ação.</p>'+
  gradeCards(t,"attr",ATTRIBUTES)+'</section>'+
  (human?'<section class="cf-panel"><h3>Conhecimentos</h3>'+gradeCards(t,"know",KNOWLEDGES)+'</section>'+
   '<section class="cf-panel"><h3>Práticas · Disciplina é uma única Prática</h3>'+gradeCards(t,"practice",PRACTICES)+'</section>':"")+
  '<section class="cf-panel"><h3>Perícias e capacidades</h3>'+skillPanel(t)+
  '<label class="cf-form-row" style="display:flex;flex-direction:column;align-items:stretch;margin-top:12px">Capacidades naturais, imunidades e observações de uso<textarea class="cf-note-input" data-field="abilities" rows="4" maxlength="4000">'+esc(t.abilities)+'</textarea></label></section>'+
  inventory(t,x)+
  '<section class="cf-panel"><h3>Condução narrativa</h3><label>Objetivos, comportamento, condições e anotações do encontro'+
  '<textarea class="cf-note-input" data-field="notes" rows="4" maxlength="4000">'+esc(t.notes)+'</textarea></label>'+
  '<p class="cf-note">Ação conjunta, passagem de protagonismo e distribuição de Pavor exigem decisões do Narrador. Nenhum Pavor público é descontado automaticamente.</p></section>';
}
function render(){
 renderSummary();renderRoster();
 const t=selected();
 const tabs=t?'<div class="cf-mode-tabs" role="group" aria-label="Modo da ficha">'+
  '<button type="button" data-conflict-mode="edit" aria-pressed="'+(conflictMode==="edit")+
   '" class="'+(conflictMode==="edit"?"is-active":"")+'">Edição</button>'+
  '<button type="button" data-conflict-mode="roll" aria-pressed="'+(conflictMode==="roll")+
   '" class="'+(conflictMode==="roll"?"is-active":"")+'">Rolagem</button></div>':"";
 el("editor").innerHTML=t?tabs+(conflictMode==="roll"?rollWorkspace(t):editorHTML(t)):
  '<div class="cf-empty">Adicione a primeira criatura para montar o encontro.</div>';
}
function update(field,value){
 const t=selected();if(!t)return;
 if(field==="kind"){
  if(!Object.hasOwn(KINDS,value)||t.kind===value)return;
  if(!confirm("Mudar o tipo aplica outra tabela de XP e dados. Manter os graus, mas recalcular seus custos?"))return render();
  const previousKind=t.kind;t.kind=value;creatureRoll=null;
  if(!isHumanoidKind(value)){t.knowledges=blank().knowledges;t.practices=blank().practices;t.skills=[];}
  else if(!isHumanoidKind(previousKind))t.courage=10;
 }else if(field==="leader")t.leader=!!value;
 else if(["name","concept","notes","abilities"].includes(field))t[field]=String(value).slice(0,field==="notes"||field==="abilities"?4000:160);
 else if(["threatGrade","level","xp","life","pavorLocal","keep"].includes(field)){
  const oldGrade=t.threatGrade;
  t[field]=Math.floor(clamp(value,field==="keep"?2:field==="level"||field==="threatGrade"?1:0,
   field==="keep"?4:field==="level"?20:field==="threatGrade"?6:field==="xp"?50000:999));
  if(field==="threatGrade"&&oldGrade!==t.threatGrade){
   rollDraft=null;creatureRoll=null; // nunca reaproveitar uma prévia de Grau antigo
  }
 }
 t.pavorLocal=Math.min(t.pavorLocal,stats(t).limitLocal);
 t.keep=Math.min(t.keep,stats(t).keepMax);
 t.life=Math.min(t.life,stats(t).life);
 save();render();
}
function gradeChange(group,key,delta){
 const t=selected();if(!t)return;
 const prop={attr:"attributes",know:"knowledges",practice:"practices"}[group];
 if(!prop||(group!=="attr"&&!isHumanoidKind(t.kind))||!Object.hasOwn(t[prop],key))return;
 const prev=t[prop][key],next=Math.floor(clamp(prev+delta,0,6));if(prev===next)return;
 t[prop][key]=next;creatureRoll=null;
 if(delta>0&&ledger(t).remaining<0){t[prop][key]=prev;return notice("XP insuficiente. Ajuste o orçamento de XP antes de comprar o próximo grau.");}
 t.life=Math.min(t.life,stats(t).life);
 save();render();
}
function addKind(kind){
 if(model.roster.length>=80)return notice("Limite de 80 fichas por conflito.");
 const t=blank(Object.hasOwn(KINDS,kind)?kind:"monstro");
 
 model.roster.push(t);model.active=t.id;save();render();
 el("editor-shell").scrollIntoView({behavior:"smooth",block:"start"});
}
function addQuickHumanoid(){
 if(model.roster.length>=80)return notice("Limite de 80 fichas por conflito.");
 const t=quickHumanoid();
 model.roster.push(t);model.active=t.id;
 save();render();
 el("editor-shell").scrollIntoView({behavior:"smooth",block:"start"});
 notice("Humano comum criado com formação mínima. Desenvolva suas capacidades e selecione Perícias na ficha.");
}
function adjustLife(delta,fill=false){
 const t=selected();if(!t)return;
 const max=stats(t).life;
 t.life=fill?max:Math.floor(clamp(t.life+delta,0,max));
 save();render();
}
function duplicate(id){
 const source=model.roster.find(x=>x.id===id);if(!source)return;
 if(model.roster.length>=80)return notice("Limite de 80 fichas por conflito.");
 const t=normalize({...source,id:uid(),name:source.name+" (cópia)",leader:false});
 model.roster.push(t);model.active=t.id;save();render();
}
function remove(id){
 const t=model.roster.find(x=>x.id===id);if(!t)return;
 if(!confirm("Excluir a ficha "+t.name+" deste conflito?"))return;
 model.roster=model.roster.filter(x=>x.id!==id);
 if(model.active===id)model.active=model.roster[0]?.id||null;
 save();render();
}
function toggleSkill(id,checked){
 const t=selected(),item=SKILLS.find(x=>x.id===id);if(!t||!isHumanoidKind(t.kind)||!item)return;
 if(checked&&!canBuySkill(t,id))return notice("Requisitos não atendidos.");
 if(checked&&!t.skills.includes(id))t.skills.push(id);
 else if(!checked)t.skills=t.skills.filter(x=>x!==id);
 if(ledger(t).remaining<0){t.skills=t.skills.filter(x=>x!==id);return notice("XP insuficiente para esta Perícia.");}
 save();render();
}
function adjustIntegrity(id,delta){
 const t=selected(),item=t?.items.find(x=>x.id===id);
 if(!item||item.integrityMax<=0)return;
 item.integrity=Math.floor(clamp(item.integrity+delta,0,item.integrityMax));
 save();render();
}
function addCatalogItem(){
 const t=selected(),idx=Math.floor(Number(el("catalog-choose")?.value)),it=catalog[idx];if(!t||!it)return;
 const qty=Math.floor(clamp(el("item-quantity")?.value,1,99)),weight=catalogWeight(it);
 const next=afterItem(t,{weight,qty}),limit=stats(t).capacity;
 if(next>limit+1e-9&&!confirm("ATENÇÃO: "+qty+" × "+it.name+" ultrapassam a carga ("+fmt(next)+" / "+fmt(limit)+" Alto). A penalidade por sobrecarga está PENDENTE. Adicionar mesmo assim?"))return;
 t.items.push({id:uid(),name:it.name,weight,qty,kind:it.kind,
 integrityMax:Math.max(0,Number(it.integrity?.max)||0),
 integrity:Math.max(0,Number(it.integrity?.value)||0),equipped:false});
 save();render();notice("Item adicionado à ficha: "+it.name+".");
}
function exportJson(){
 const text=JSON.stringify({schema:"codex-conflito-v1",...model},null,2),blob=new Blob([text],{type:"application/json"});
 const url=URL.createObjectURL(blob),link=document.createElement("a");link.href=url;link.download="codex-conflito.json";link.click();
 setTimeout(()=>URL.revokeObjectURL(url),2000);
}
async function importJson(file){
 if(!file||file.size>2_000_000)return notice("Selecione um JSON com até 2 MB.");
 try{
  const raw=JSON.parse(await file.text());
  if(raw.schema!=="codex-conflito-v1"||!Array.isArray(raw.roster))throw Error("Formato inválido");
  if(!confirm("Substituir o conflito atual pelo arquivo importado?"))return;
  model={players:Math.floor(clamp(raw.players,0,30)),publicPavor:0,lastRoll:raw.lastRoll||null,
   rollHistory:Array.isArray(raw.rollHistory)?raw.rollHistory.slice(0,300):[],
   partyXp:Math.floor(clamp(raw.partyXp,0,99999)),companions:normalizeCompanions(raw.companions,raw.players),roster:raw.roster.slice(0,80).map(normalize),active:raw.active};
  model.publicPavor=Math.floor(clamp(raw.publicPavor,0,narratorCap(model.players)));
  if(!model.roster.some(t=>t.id===model.active))model.active=model.roster[0]?.id||null;
  save();render();notice("Conflito importado com "+model.roster.length+" fichas.");
 }catch(e){notice("Arquivo inválido: não foi possível importar este conflito.");}
}
document.addEventListener("click",event=>{
 const b=event.target.closest("button");if(!b)return;
 if(b.id==="add-threat"||b.id==="add-quick")return addKind(el("new-kind").value);
 if(b.id==="add-human-quick"){window.location.assign("../prototipo-ficha/?npc=1");return;}
  if(b.id==="add-human-basic")return addQuickHumanoid();
 if(b.hasAttribute("data-life-full"))return adjustLife(0,true);
 if(b.dataset.life)return adjustLife(Number(b.dataset.life));
 if(b.id==="export-encounter")return exportJson();
 if(b.hasAttribute("data-open-roll")){conflictMode="roll";render();scrollToRoll();return;}
 if(b.dataset.conflictMode){conflictMode=b.dataset.conflictMode==="roll"?"roll":"edit";render();return;}
 if(b.dataset.courage){const t=selected();if(!t||!isHumanoidKind(t.kind))return;
  t.courage=Math.floor(clamp(t.courage+Number(b.dataset.courage),0,10));save();render();return;}
 if(b.dataset.integrity){adjustIntegrity(b.dataset.integrity,Number(b.dataset.delta)||0);return;}
 if(b.hasAttribute("data-export-rolls")){exportRollHistory();return;}
 if(b.hasAttribute("data-clear-rolls")){if(confirm("Apagar todo o histórico de rolagens? Exporte CSV ou JSON antes de limpar.")){
   model.rollHistory=[];save();render();}return;}
 if(b.dataset.historyScope){model.historyScope=b.dataset.historyScope;save();render();return;}
 if(b.hasAttribute("data-clear-extra")){const d=draftFor(selected());d.extra=null;d.contextOK=false;d.stepDieId="";render();return;}
 if(b.dataset.rollSource){
  const t=selected();if(!t||conflictMode!=="roll")return;
  if(creatureRoll?.id===t.id)return notice("Confirme ou descarte a rolagem atual antes de trocar as fontes.");
  const d=draftFor(t),group=b.dataset.rollSource,key=b.dataset.sourceKey;
  if(d.pickExtra){
   const duplicate=isHumanoidKind(t.kind)?
    (group==="attribute"&&d.attribute===key||group===d.baseGroup&&d.baseKey===key):
    (key===d.first||key===d.second);
   if(duplicate)return notice("Escolha uma terceira fonte diferente.");
   d.extra={group,key};d.contextOK=false;d.pickExtra=false;
  }else if(isHumanoidKind(t.kind)){
   if(group==="attribute")d.attribute=key;else{d.baseGroup=group;d.baseKey=key;
    d.mode=key==="armas_conjuracao"?"armas":"normal";}
  }else if(group==="attribute"){
   if(!d.firstClicked){d.first=key;d.firstClicked=true;}
   else if(d.first!==key){d.second=key;d.firstClicked=false;}
   else return notice("Selecione outro Atributo distinto.");
  }
  d.stepDieId="";render();return;
 }
 if(b.dataset.actionTab){conflictActionTab=["weapons","elements","skills"].includes(b.dataset.actionTab)?b.dataset.actionTab:"skills";render();return;}
 if(b.dataset.conflictAction)return prepareThreatAction(b.dataset.conflictAction,b.dataset.actionSkill,b.dataset.actionItem);
 if(b.hasAttribute("data-roll-start"))return beginCreatureRoll();
 if(b.hasAttribute("data-roll-clear")){creatureRoll=null;render();return;}
 if(b.hasAttribute("data-roll-confirm"))return confirmCreatureRoll();
 if(b.dataset.open){model.active=b.dataset.open;creatureRoll=null;rollDraft=null;save();render();return;}
 if(b.dataset.copy)return duplicate(b.dataset.copy);
 if(b.dataset.delete)return remove(b.dataset.delete);
 if(b.hasAttribute("data-joint"))return publicJointSpend(Number(b.dataset.joint));
 if(b.dataset.players){model.players=Math.floor(clamp(model.players+Number(b.dataset.players),0,30));model.publicPavor=Math.min(model.publicPavor,narratorCap(model.players));model.companions=normalizeCompanions(model.companions,model.players);save();renderSummary();return;}
 if(b.dataset.public)return pavorDelta(Number(b.dataset.public));
 if(b.dataset.grade)return gradeChange(b.dataset.grade,b.dataset.key,Number(b.dataset.delta));
 if(b.dataset.local){const t=selected();if(!t)return;t.pavorLocal=Math.floor(clamp(t.pavorLocal+Number(b.dataset.local),0,stats(t).limitLocal));save();render();return;}
 if(b.dataset.keep){const t=selected();if(!t)return;t.keep=Math.floor(clamp(t.keep+Number(b.dataset.keep),2,stats(t).keepMax));save();render();return;}
 if(b.hasAttribute("data-add-catalog"))return addCatalogItem();
 if(b.dataset.removeItem){const t=selected();if(!t)return;t.items=t.items.filter(i=>i.id!==b.dataset.removeItem);save();render();}
});
document.addEventListener("change",event=>{
 const target=event.target;
 if(target.dataset.rollKeep&&creatureRoll){
   const t=selected(),r=creatureRoll,id=target.dataset.rollKeep,max=isHumanoidKind(t.kind)?stats(t).keepBase+Number(!!r.extraKeep):t.kind==="monstro"?t.keep:2;
   if(target.checked){if(r.selected.length>=max){notice("Desmarque antes um dado.");return refreshRoll();}r.selected.push(id);}
   else r.selected=r.selected.filter(x=>x!==id);
   refreshRoll();return;
  }
  if(target.dataset.rollParam&&creatureRoll){
   const k=target.dataset.rollParam;
   if(k==="passA")creatureRoll.passA=target.checked;
   else if(k==="cancelP"||k==="convertPairs")creatureRoll[k]=Math.floor(clamp(target.value,0,9));
   refreshRoll();return;
  }
  if(target.id==="cf-pick-extra"){const d=draftFor(selected());d.pickExtra=target.checked;render();return;}
 if(target.id==="cf-context-ok"){const d=draftFor(selected());d.contextOK=target.checked;render();return;}
 if(target.id==="cf-roll-extra"){const d=draftFor(selected());d.extraKeep=target.checked;render();return;}
 if(target.id==="cf-roll-step"){const d=draftFor(selected());d.step=target.checked;if(!d.step)d.stepDieId="";render();return;}
 if(target.id==="cf-roll-step-die"){draftFor(selected()).stepDieId=target.value;return;}
 if(target.id==="cf-roll-de"){draftFor(selected()).de=Math.floor(clamp(target.value,0,30));return;}
 if(target.id==="cf-roll-situation"){draftFor(selected()).situation=target.value;return;}
 if(target.id==="cf-roll-mode"){draftFor(selected()).mode=target.value;return;}
 if(target.id==="cf-roll-attr"){draftFor(selected()).attribute=target.value;return;}
 if(target.id==="cf-roll-first"){draftFor(selected()).first=target.value;return;}
 if(target.id==="cf-roll-second"){draftFor(selected()).second=target.value;return;}
 if(target.id==="cf-roll-group"){
  const group=target.value,list=el("cf-roll-base"),options=group==="knowledge"?KNOWLEDGES:PRACTICES;
  const d=draftFor(selected());d.baseGroup=group;
  const t=selected();
  if(list&&t){
   const field=group==="knowledge"?"knowledges":"practices";
   const first=options.find(([key])=>key!=="armas_conjuracao"&&t[field][key]>0)?.[0]||
    (group==="knowledge"?"protecao":"atletismo");
   list.innerHTML=options.map(([key,name])=>'<option value="'+key+'"'+(key===first?' selected':'')+'>'+esc(name)+'</option>').join("");
   d.baseKey=first;d.mode=first==="armas_conjuracao"?"armas":"normal";
   const mode=el("cf-roll-mode");if(mode)mode.disabled=first!=="armas_conjuracao";
  }
  return;
 }
 if(target.id==="cf-roll-base"){
  const d=draftFor(selected());d.baseKey=target.value;d.mode=target.value==="armas_conjuracao"?"armas":"normal";
  const mode=el("cf-roll-mode");if(mode)mode.disabled=target.value!=="armas_conjuracao";return;
 }
 if(target.id==="player-count"){model.players=Math.floor(clamp(target.value,0,30));model.publicPavor=Math.min(model.publicPavor,narratorCap(model.players));model.companions=normalizeCompanions(model.companions,model.players);save();renderSummary();return;}
 if(target.id==="party-xp"){model.partyXp=Math.floor(clamp(target.value,0,99999));save();renderSummary();return;}
  if(target.dataset.companion){
   const type=target.dataset.companion,field=target.dataset.companionField;
   if(!COMPANION_TYPES.includes(type)||!["count","xpTotal"].includes(field))return;
   const data=normalizeCompanions(model.companions,model.players);
   data[type][field]=field==="xpTotal"&&target.value===""?null:target.value;
   model.companions=normalizeCompanions(data,model.players);
   save();renderSummary();return;
  }
 if(target.id==="import-encounter"){void importJson(target.files?.[0]);target.value="";return;}
 if(target.dataset.skill){toggleSkill(target.dataset.skill,target.checked);return;}
 if(target.dataset.field)update(target.dataset.field,target.type==="checkbox"?target.checked:target.value);
});
const quickImportNotice=consumeQuickHumanoid();
render();
if(quickImportNotice)notice(quickImportNotice);