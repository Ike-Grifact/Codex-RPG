/* Codex RPG — Criar Conflito: editor local e independente de contas. */
import {KINDS,WEIGHT,uid,blank,normalize,stats,ledger,dice,ATTRIBUTES,KNOWLEDGES,
 PRACTICES,SKILLS,encounterSummary,narratorCap,remainingKinds,afterItem,clamp,quickHumanoid}
 from "./rules.mjs";
import {skillPrerequisite} from "../foundry-prototype/module/equipment-logic.mjs";
import {canDeclareJoint} from "./roll-engine.mjs";
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
 let s={players:4,publicPavor:2,partyXp:80,roster:[],active:null};
 try{
  const raw=JSON.parse(localStorage.getItem(KEY)||"null");
  if(raw&&typeof raw==="object"){
   s.players=Math.floor(clamp(raw.players,0,30));
   s.partyXp=Math.floor(clamp(raw.partyXp,0,99999));
   s.publicPavor=Math.floor(clamp(raw.publicPavor,0,narratorCap(s.players)));
   s.roster=Array.isArray(raw.roster)?raw.roster.slice(0,80).map(normalize):[];
   s.active=s.roster.some(x=>x.id===raw.active)?raw.active:s.roster[0]?.id||null;
  }
 }catch(e){console.warn("Codex: dados locais de conflito inválidos",e);}
 return s;
}
let model=load(),noticeTimer=null;
function consumeQuickHumanoid(){
 let raw;
 try{raw=localStorage.getItem(HUMANOID_INBOX_KEY);}catch(e){return "";}
 if(!raw)return "";
 if(model.roster.length>=80)return "Limite de 80 fichas. O humanoide permanece salvo no criador rápido.";
 try{
  const incoming=JSON.parse(raw);
  if(incoming?.schema!=="codex-humanoide-rapido-v1"||incoming.character?.kind!=="humanoide")throw Error("Tipo de pacote inválido");
  const unit=normalize(incoming.character);
  if(unit.kind!=="humanoide")throw Error("Tipo inválido");
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
  summary.count?"ATENÇÃO: escolha ao menos um Líder.":"Ao menos um Líder por conflito.";
 el("encounter-xp").textContent=fmt(total)+" XP";
 el("party-xp").value=party;
 el("xp-compare").textContent=summary.overbudget?"Há "+summary.overbudget+" ficha(s) acima do XP autorizado.":
  !summary.count?"Grau não determina desafio automaticamente.":
  total<party?"XP das ameaças inferior ao grupo: não há XP por enfrentamento, conforme o SRD.":
  total===party?"XP igual: recompensa-base elegível; fórmula pendente.":
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
   '<button type="button" class="cf-threat-pick" data-open="'+esc(t.id)+'" aria-pressed="'+chosen+'"><span><strong>'+esc(t.name||"Sem nome")+'</strong><small>'+esc(KINDS[t.kind])+
   ' · Grau '+t.threatGrade+'</small></span><span aria-hidden="true">'+(t.leader?'★':'›')+'</span></button>'+
   '<div class="cf-threat-counts"><span>'+t.life+'/'+x.life+' Vida</span><span>DE '+x.de+'</span>'+
   '<span class="is-purple">'+t.pavorLocal+'/'+x.limitLocal+' P</span>'+
   '<span'+(over?' style="color:#e6a1a1"':'')+'>'+x.xp.spent+'/'+x.xp.grant+' XP</span></div>'+
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
  const cost=group==="attr"?(t.kind==="monstro"?[0,2,8,20,38,66,102]:[0,1,3,7,15,31,55]):
   [0,2,8,20,38,66,102];
  const note=grade<6?"Próximo grau: "+(cost[grade+1]-cost[grade])+" XP":"Grau máximo";
  return '<div class="cf-grade is-'+group+'"><strong>'+esc(name)+' · Grau '+grade+'</strong>'+
   '<div class="cf-grade-controls"><button type="button" data-grade="'+group+'" data-key="'+key+'" data-delta="-1"'+(grade===0?' disabled':'')+' aria-label="Diminuir '+esc(name)+'">−</button>'+
   '<div class="cf-die-row">'+dieIcons(numbers)+'</div>'+
   '<button type="button" data-grade="'+group+'" data-key="'+key+'" data-delta="1"'+(grade===6?' disabled':'')+' aria-label="Aumentar '+esc(name)+'">+</button></div>'+
   '<small>'+note+'</small></div>';
 }).join("")+'</div>';
}
function skillPanel(t){
 if(t.kind!=="humanoide")return '<p>Capacidades naturais de criaturas são registradas como texto, sem conceder poderes humanos automaticamente.</p>';
 return '<p>Humanoides usam Perícias de personagens. A ferramenta contabiliza o XP, mas requisitos ainda não verificados pelo protótipo exigem consulta ao SRD.</p>'+
  '<details open><summary>Selecionar Perícias e ver custo</summary><p class="cf-note">Marque uma Perícia quando os requisitos e o XP permitirem. As demais ficam desabilitadas até desenvolver as fontes necessárias.</p><div class="cf-skills">'+SKILLS.filter(it=>Number.isInteger(it.cost)).map(it=>{
   const valid=skillPrerequisite({...t,monsterRules:false},it.id);
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
   '<div class="cf-item"><span>'+esc(it.name)+' · '+it.qty+' un. · '+fmt(it.weight*it.qty)+' Alto</span>'+
   '<button type="button" data-remove-item="'+esc(it.id)+'" aria-label="Remover '+esc(it.name)+'">Remover</button></div>').join(""):
   '<p class="cf-note">Nenhum item cadastrado.</p>')+'</div></section>';
}
function editorHTML(t){
 const x=stats(t),human=t.kind==="humanoide",extra=x.keepCostP,pLocal=x.limitLocal;
 const keepAvail=human?x.keepBase:x.keepBase+Math.min(t.pavorLocal,2);
 return '<div class="cf-edit-hero"><div><span class="eyebrow">FICHA DE AMEAÇA · '+esc(KINDS[t.kind])+'</span>'+
  '<h2>'+esc(t.name||"Ameaça sem nome")+'</h2>'+
  '<p>Grau e orçamento de XP são independentes. Compre os graus usando os valores oficiais e confira requisitos especiais antes da sessão.</p></div>'+
  '<div class="cf-actions"><button type="button" data-copy="'+esc(t.id)+'">Duplicar ficha</button>'+
   '<button type="button" data-delete="'+esc(t.id)+'">Excluir</button></div></div>'+
  '<div class="cf-fields">'+field("Nome","name",{wide:true})+
  field("Tipo de criatura","kind",{type:"select",choices:Object.entries(KINDS)})+
  field("Grau da ameaça","threatGrade",{type:"number",min:1,max:6})+
  field("Conceito / origem","concept",{wide:true})+
  (human?field("Nível do humanoide","level",{type:"number",min:1,max:20}):"")+
  field(human?"XP adicional (20 iniciais)":"Orçamento de XP definido pelo Mestre","xp",{type:"number",min:0,max:50000})+
  '<label class="cf-check"><input type="checkbox" data-field="leader"'+(t.leader?' checked':'')+'> É Líder</label></div>'+
  '<div class="cf-stat-grid">'+
  '<div class="cf-stat cf-stat-life"><small>VIDA ATUAL / MÁXIMA</small><strong>'+t.life+' / '+x.life+'</strong>'+
  '<div class="cf-life-actions"><button type="button" data-life="-1"'+(t.life<=0?' disabled':'')+' aria-label="Reduzir Vida em um">−</button>'+
  '<label>Vida atual<input type="number" data-field="life" min="0" max="'+x.life+'" step="1" value="'+t.life+'" aria-label="Editar Vida atual"></label>'+
  '<button type="button" data-life="1"'+(t.life>=x.life?' disabled':'')+' aria-label="Aumentar Vida em um">+</button></div>'+
  '<button type="button" class="cf-life-full" data-life-full'+(t.life>=x.life?' disabled':'')+'>Restaurar ao máximo</button>'+
  '<small>Máximo calculado pelos Atributos; aumentos não curam automaticamente.</small></div>'+
  [['DE',x.de],['XP GASTO',x.xp.spent+' / '+x.xp.grant],['XP LIVRE',x.xp.remaining],['DADOS MANTIDOS',t.keep+' / '+x.keepMax]]
   .map(([label,val],i)=>'<div class="cf-stat'+(i===2&&x.xp.remaining<0?' is-warning':i===3?' is-purple':'')+'"><small>'+label+'</small><strong>'+val+'</strong></div>').join("")+
  '</div>'+(x.xp.remaining<0?'<p class="cf-warning">XP gasto excede o orçamento em '+(-x.xp.remaining)+' XP. Aumente o orçamento ou reduza graus.</p>':"")+
  '<section class="cf-panel"><h3>Pavor local e retenção</h3>'+
  '<div class="cf-local-row"><strong>Pavor '+t.pavorLocal+' / '+pLocal+'</strong>'+
  '<button type="button" data-local="-1"'+(t.pavorLocal===0?' disabled':'')+'>− P local</button>'+
  '<button type="button" data-local="1"'+(t.pavorLocal>=pLocal?' disabled':'')+'>+ P local</button></div>'+
  '<div class="cf-local-row"><span>Dados mantidos planejados: <b>'+t.keep+'</b></span>'+
  '<button type="button" data-keep="-1"'+(t.keep<=2?' disabled':'')+'>−</button>'+
  '<button type="button" data-keep="1"'+(t.keep>=x.keepMax?' disabled':'')+'>+</button></div>'+
  '<p class="cf-note">'+(human?'Humanoides seguem Marcos e custos de Coragem das fichas de jogadores; a retenção não é gratuita.':
   'Ação básica: 2 dados. Cada dado adicional mantido custa 1P local, e somente com dados/capacidades disponíveis.')+
  (human?'':' Retenção planejada: '+extra+'P por oportunidade.')+'</p>'+
  (!human&&extra>t.pavorLocal?'<p class="cf-warning">São necessários '+extra+'P para manter '+t.keep+' dados nesta oportunidade, mas a ficha possui '+t.pavorLocal+'P. O teto da ficha não concede esse Pavor gratuitamente.</p>':"")+
  (keepAvail<t.keep&&!human?'<p class="cf-note">Acumule Pavor antes de executar a retenção pretendida.</p>':"")+'</section>'+
  '<section class="cf-panel"><h3>Atributos · dados e graus</h3>'+
  '<p>'+(t.kind==="monstro"?'Monstro extraordinário: grau 1 compra 1d10 por 2 XP; grau 6 atinge 3d12.':'Progressão comum: grau 1 compra 1d6 por 1 XP.')+
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
function render(){renderSummary();renderRoster();const t=selected();el("editor").innerHTML=t?editorHTML(t):'<div class="cf-empty">Adicione a primeira criatura para montar o encontro.</div>';}
function update(field,value){
 const t=selected();if(!t)return;
 if(field==="kind"){
  if(!Object.hasOwn(KINDS,value)||t.kind===value)return;
  if(!confirm("Mudar o tipo aplica outra tabela de XP e dados. Manter os graus, mas recalcular seus custos?"))return render();
  t.kind=value;
  if(value!=="humanoide"){t.knowledges=blank().knowledges;t.practices=blank().practices;t.skills=[];}
 }else if(field==="leader")t.leader=!!value;
 else if(["name","concept","notes","abilities"].includes(field))t[field]=String(value).slice(0,field==="notes"||field==="abilities"?4000:160);
 else if(["threatGrade","level","xp","life","pavorLocal","keep"].includes(field))
  t[field]=Math.floor(clamp(value,field==="keep"?2:field==="level"||field==="threatGrade"?1:0,
   field==="keep"?4:field==="level"?20:field==="threatGrade"?6:field==="xp"?50000:999));
 t.pavorLocal=Math.min(t.pavorLocal,stats(t).limitLocal);
 t.keep=Math.min(t.keep,stats(t).keepMax);
 t.life=Math.min(t.life,stats(t).life);
 save();render();
}
function gradeChange(group,key,delta){
 const t=selected();if(!t)return;
 const prop={attr:"attributes",know:"knowledges",practice:"practices"}[group];
 if(!prop||(group!=="attr"&&t.kind!=="humanoide")||!Object.hasOwn(t[prop],key))return;
 const prev=t[prop][key],next=Math.floor(clamp(prev+delta,0,6));if(prev===next)return;
 t[prop][key]=next;
 if(delta>0&&ledger(t).remaining<0){t[prop][key]=prev;return notice("XP insuficiente. Ajuste o orçamento de XP antes de comprar o próximo grau.");}
 t.life=Math.min(t.life,stats(t).life);
 save();render();
}
function addKind(kind){
 if(model.roster.length>=80)return notice("Limite de 80 fichas por conflito.");
 const t=blank(Object.hasOwn(KINDS,kind)?kind:"monstro");
 if(!model.roster.length)t.leader=true;
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
 const t=selected(),item=SKILLS.find(x=>x.id===id);if(!t||t.kind!=="humanoide"||!item)return;
 if(checked&&(!skillPrerequisite({...t,monsterRules:false},id)))return notice("Requisitos não atendidos.");
 if(checked&&!t.skills.includes(id))t.skills.push(id);
 else if(!checked)t.skills=t.skills.filter(x=>x!==id);
 if(ledger(t).remaining<0){t.skills=t.skills.filter(x=>x!==id);return notice("XP insuficiente para esta Perícia.");}
 save();render();
}
function addCatalogItem(){
 const t=selected(),idx=Math.floor(Number(el("catalog-choose")?.value)),it=catalog[idx];if(!t||!it)return;
 const qty=Math.floor(clamp(el("item-quantity")?.value,1,99)),weight=catalogWeight(it);
 const next=afterItem(t,{weight,qty}),limit=stats(t).capacity;
 if(next>limit+1e-9&&!confirm("ATENÇÃO: "+qty+" × "+it.name+" ultrapassam a carga ("+fmt(next)+" / "+fmt(limit)+" Alto). A penalidade por sobrecarga está PENDENTE. Adicionar mesmo assim?"))return;
 t.items.push({id:uid(),name:it.name,weight,qty});
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
  model={players:Math.floor(clamp(raw.players,0,30)),publicPavor:0,
   partyXp:Math.floor(clamp(raw.partyXp,0,99999)),roster:raw.roster.slice(0,80).map(normalize),active:raw.active};
  model.publicPavor=Math.floor(clamp(raw.publicPavor,0,narratorCap(model.players)));
  if(!model.roster.some(t=>t.id===model.active))model.active=model.roster[0]?.id||null;
  save();render();notice("Conflito importado com "+model.roster.length+" fichas.");
 }catch(e){notice("Arquivo inválido: não foi possível importar este conflito.");}
}
document.addEventListener("click",event=>{
 const b=event.target.closest("button");if(!b)return;
 if(b.id==="add-threat"||b.id==="add-quick")return addKind(el("new-kind").value);
 if(b.id==="add-human-quick"){window.location.assign("../prototipo-ficha/?modo=humanoide-rapido");return;}
  if(b.id==="add-human-basic")return addQuickHumanoid();
 if(b.hasAttribute("data-life-full"))return adjustLife(0,true);
 if(b.dataset.life)return adjustLife(Number(b.dataset.life));
 if(b.id==="export-encounter")return exportJson();
 if(b.dataset.open){model.active=b.dataset.open;save();render();return;}
 if(b.dataset.copy)return duplicate(b.dataset.copy);
 if(b.dataset.delete)return remove(b.dataset.delete);
 if(b.hasAttribute("data-joint"))return publicJointSpend(Number(b.dataset.joint));
 if(b.dataset.players){model.players=Math.floor(clamp(model.players+Number(b.dataset.players),0,30));model.publicPavor=Math.min(model.publicPavor,narratorCap(model.players));save();renderSummary();return;}
 if(b.dataset.public)return pavorDelta(Number(b.dataset.public));
 if(b.dataset.grade)return gradeChange(b.dataset.grade,b.dataset.key,Number(b.dataset.delta));
 if(b.dataset.local){const t=selected();if(!t)return;t.pavorLocal=Math.floor(clamp(t.pavorLocal+Number(b.dataset.local),0,stats(t).limitLocal));save();render();return;}
 if(b.dataset.keep){const t=selected();if(!t)return;t.keep=Math.floor(clamp(t.keep+Number(b.dataset.keep),2,stats(t).keepMax));save();render();return;}
 if(b.hasAttribute("data-add-catalog"))return addCatalogItem();
 if(b.dataset.removeItem){const t=selected();if(!t)return;t.items=t.items.filter(i=>i.id!==b.dataset.removeItem);save();render();}
});
document.addEventListener("change",event=>{
 const target=event.target;
 if(target.id==="player-count"){model.players=Math.floor(clamp(target.value,0,30));model.publicPavor=Math.min(model.publicPavor,narratorCap(model.players));save();renderSummary();return;}
 if(target.id==="party-xp"){model.partyXp=Math.floor(clamp(target.value,0,99999));save();renderSummary();return;}
 if(target.id==="import-encounter"){void importJson(target.files?.[0]);target.value="";return;}
 if(target.dataset.skill){toggleSkill(target.dataset.skill,target.checked);return;}
 if(target.dataset.field)update(target.dataset.field,target.type==="checkbox"?target.checked:target.value);
});
const quickImportNotice=consumeQuickHumanoid();
render();
if(quickImportNotice)notice(quickImportNotice);