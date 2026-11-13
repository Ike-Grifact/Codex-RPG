import {buildPool,keepLimit,maxPP,monsterCap,resolveRoll,sourceLabel} from "./rules.mjs";
import {defenseDE,equipmentEligibility,weaponProperties} from "./equipment-logic.mjs";
import {escapeHTML,rollPool,runeHTML,runeText} from "./roll-engine.mjs";

export const NS="codex-rpg-foundry";
export const pendingFlag="flags."+NS+".pendingRoll";
const queryName=NS+".roll";
const actorQueues=new Map();
export const draft=()=>({base:null,attribute:null,complement:null});
export const options=()=>({mode:"normal",de:"",situation:"neutral",extraKeep:0,step:false,
 contextApproved:false,equipmentId:"",dual:false,cancelP:0,convertPairs:0,passA:false,allyId:"",
 characteristic:"",secondCharacteristic:"",activationPayment:"courage"});

export function rulesFor(actor){
 return {...(actor.system.toObject?.()??actor.system),monsterRules:actor.type==="creature"};
}
export const usesPavor=actor=>actor.type==="creature"||(actor.type==="humanoid"&&actor.system.opposition===true);
export const retention=(actor,extra)=>keepLimit(
 actor.type==="creature"?actor.system.threatGrade:actor.system.level,extra,actor.type==="creature");
export function availableProperties(actor,options){
 if(options.active)return options.active;
 const item=actor.items.get(options.equipmentId);
 return weaponProperties(item,equipmentEligibility(actor,item,options.mode).specialist).active;
}
const costs=(actor,config)=>Number(config.step)+Number(config.extraKeep)
 +(usesPavor(actor)&&config.inCombat&&config.mode!=="normal"?1:0);

export function prepareRoll(actor,selection,config,targets,inCombat){
 const system=rulesFor(actor),item=actor.items.get(config.equipmentId);
 const gear=item?equipmentEligibility(actor,item,config.mode):null;
 const plan=buildPool(system,selection,{...config,equipmentDie:gear?.die??0});
 const {errors,pool}=plan;
 if(config.mode!=="normal"&&!system.monsterRules&&selection.base?.key!=="armas_conjuracao"){
  errors.push("Ataque com arma e conjuração usam Disciplina.");
 }
 if(config.equipmentId&&!gear?.usable)errors.push(gear?.reason??"Item selecionado indisponível.");
 if(config.mode==="conjuracao"&&!item)errors.push("Selecione um foco ou magia equipada com elemento habilitado.");
 if(config.dual)errors.push(system.skills.includes("maestria-manejo-duplo")?
  "PENDENTE · composição de Manejo Duplo e acúmulo de dados da besta de uma mão. Use uma arma neste teste.":
  "Manejo Duplo exige a Perícia correspondente.");
 if(inCombat&&targets.length>1)errors.push("Selecione no máximo um Token alvo.");
 if(inCombat&&targets.length===1&&!targets[0].actor)errors.push("O Token selecionado não possui Actor.");
 const target=inCombat?targets[0]?.actor:null;
 if(target&&!["character","humanoid","creature"].includes(target.type))errors.push("O Actor alvo não possui DE do Codex.");
 const de=target?.system.attributes?defenseDE(target,target.system.defense):config.de===""?null:Number(config.de);
 if(de!==null&&(!Number.isInteger(de)||de<0||de>30))errors.push("Informe uma DE inteira entre 0 e 30.");
 if(Number(config.extraKeep)&&retention(actor,config.extraKeep)===retention(actor,0))errors.push("O limite de retenção atual já foi atingido.");
 if(actor.type==="creature"&&Number(config.extraKeep)>1&&system.threatGrade<5)errors.push("Quatro dados mantidos exigem Grau 5 ou 6.");
 const configSnapshot={...config,de,inCombat,targetActorUuid:target?.uuid??null,targetName:target?.name??"",
  equipmentName:item?.name??"",
  bonusA:Number(selection.base?.key==="furtividade"&&system.skills.includes("furtividade")),
  ...weaponProperties(gear?.usable?item:null,gear?.specialist)};
 const cost=costs(actor,configSnapshot),resource=usesPavor(actor)?"Pavor local":"Coragem";
 if(cost>Number(usesPavor(actor)?system.pavorLocal:system.courage))errors.push(resource+" insuficiente.");
 return {ok:errors.length===0,errors,pool,gear,cost,resource,options:configSnapshot};
}

export function rollSummary(actor,pending){
 const s=actor.system,o=pending.options;
 const result=resolveRoll(pending.dice,pending.selected,{
  ...o,level:s.level,monster:actor.type==="creature",hostile:usesPavor(actor),
  threatGrade:s.threatGrade,courage:usesPavor(actor)?99:s.courage,
  canPass:!!(o.inCombat&&o.allyId&&(
   globalThis.game?.combats?.get(o.combatId)??globalThis.game?.combat
  )?.combatants?.get(o.allyId)?.actor),
  bonusP:o.bonusP??Number(o.noisy??false)
 });
 const pavor=usesPavor(actor);
 let cost=costs(actor,{...o,inCombat:o.inCombat??!!o.targetActorUuid}),payPP=0;
 const selected=[o.characteristic,o.secondCharacteristic].filter(Boolean);
 if(selected.length){
  if(!result.success)result.errors.push("Características especiais exigem acerto.");
  const active=availableProperties(actor,o);
  if(selected.some(name=>!active.includes(name)))result.errors.push("Característica sem habilitação neste ataque.");
  if(o.secondCharacteristic&&(!result.critical||!o.characteristic||o.characteristic===o.secondCharacteristic)){
   result.errors.push("Escolha duas características distintas em um crítico acertado.");
  }
  if(!result.critical||selected.length>1){
   if(pavor)result.errors.push("PENDENTE · custo de característica paga da oposição. Resolva com o Narrador.");
   else if(o.activationPayment==="pp")payPP=1;
   else cost+=2;
  }
 }
 if(payPP>s.pp)result.errors.push("PP insuficiente.");
 if(cost>(pavor?s.pavorLocal:s.courage))result.errors.push((pavor?"Pavor local":"Coragem")+" insuficiente.");
 const localBefore=Math.max(0,s.pavorLocal-cost);
 const reward=pavor?Math.min(result.monsterCriticalPavor,Math.max(0,monsterCap(s.threatGrade)-localBefore)):0;
 return {...result,ok:result.errors.length===0,cost,payPP,active:selected,localReward:reward,
  unallocatedPavor:result.monsterCriticalPavor-reward,
  resources:pavor?{"system.pavorLocal":Math.min(monsterCap(s.threatGrade),localBefore+reward)}:{
   "system.courage":Math.min(10,Math.max(0,s.courage-cost+result.criticalRefundCourage)),
   "system.pp":Math.min(maxPP(s.level),Math.max(0,s.pp-payPP+result.criticalRefundPP))
  }};
}

export async function startRoll(actor,selection,plan){
 if(!actor.isOwner||actor.getFlag(NS,"pendingRoll"))return;
 if(!plan.ok)throw Error(plan.errors.join(" "));
 const {dice,formula,roll}=await rollPool(plan.pool);
 const pending={version:3,id:foundry.utils.randomID(),created:Date.now(),...selection,formula,dice,
  roll:roll.toJSON(),selected:[],options:plan.options};
 await actor.update({[pendingFlag]:pending},{recursive:false});
}

function chatContent(pending,result){
 const o=pending.options;
 const kept=result.selected.map(d=>`<li>${escapeHTML(sourceLabel(d.group,d.key))} · d${d.sides} · face ${d.face}
  <span aria-label="${escapeHTML(runeText(d.symbols))}">${runeHTML(d.symbols)}</span></li>`).join("");
 const sources=[pending.base,pending.attribute,pending.complement].filter(Boolean)
  .map(d=>escapeHTML(sourceLabel(d.group,d.key))).join(" + ");
 return `<div class="codex-chat-result">
  <h3>${escapeHTML(result.outcome)}</h3><p>${sources}${o.equipmentName?` · ${escapeHTML(o.equipmentName)}`:""}</p>
  ${o.targetName?`<p>Alvo <strong>${escapeHTML(o.targetName)}</strong></p>`:""}
  ${result.de!=null?`<p>E + P <strong>${result.reached} / DE ${result.de}</strong></p>`:""}
  <p><span aria-label="${escapeHTML(runeText([result.e,result.aRemaining,result.p]))}">${runeHTML([result.e,result.aRemaining,result.p])}</span></p>
  ${result.critical?`<p><strong>Crítico</strong> · ${result.critical} faces máximas mantidas</p>`:""}
  ${o.passA?`<p>1 Antecipar reservado para passar a oportunidade a ${escapeHTML(o.allyName??"um aliado")}. O Narrador confirma a passagem.</p>`:""}
  ${result.active.length?`<p>Características escolhidas · ${result.active.map(escapeHTML).join(" + ")}. Efeitos resolvidos pelo Narrador.</p>`:""}
  ${o.targetActorUuid&&result.success?`<p>Dano básico ${result.damage} · aplicação pelo Narrador.</p>`:""}
  ${result.localReward?`<p>Crítico · +${result.localReward} Pavor local para a próxima rodada.</p>`:""}
  ${result.unallocatedPavor?`<p>Crítico · ${result.unallocatedPavor} P excedentes para adjudicação do Narrador.</p>`:""}
  ${result.p?`<p>${result.p} Pavor mantido · consequências resolvidas pelo Narrador.</p>`:""}
  <ul>${kept}</ul></div>`;
}

export async function finishRoll(actor,user=globalThis.game?.user){
 if(!actor.isOwner)return;
 let pending=actor.getFlag(NS,"pendingRoll");
 if(!pending)return;
 if(!pending.publication){
  const result=rollSummary(actor,pending);
  if(!result.ok)throw Error(result.errors.join(" "));
  const {selected,resources,...summary}=result;
  const id=pending.version>=3?pending.id:pending.id.replace(/-/g,"").slice(0,16);
  pending={...pending,publication:{id,content:chatContent(pending,result),result:summary}};
  await actor.update({...resources,[pendingFlag]:pending},{recursive:false});
 }
 const {publication}=pending;
 if(!game.messages.get(publication.id)&&!game.messages.some(m=>m.getFlag(NS,"rollId")===pending.id)){
  try{
   await foundry.documents.ChatMessage.create({
    _id:publication.id,author:user?.id,speaker:foundry.documents.ChatMessage.getSpeaker({actor}),content:publication.content,
    rolls:pending.roll?[JSON.stringify(pending.roll)]:[],
    flags:{[NS]:{rollId:pending.id,result:publication.result,dice:pending.dice,kept:pending.selected}}
   },{keepId:true});
  }catch(error){
   if(game.messages.get(publication.id)?.getFlag(NS,"rollId")!==pending.id)throw error;
  }
 }
 if(actor.getFlag(NS,"pendingRoll")?.id===pending.id)await actor.unsetFlag(NS,"pendingRoll");
}

async function mutateRoll(actor,user,request){
 if(!actor.isOwner||!actor.testUserPermission(user,"OWNER"))throw Error("Sem permissão para rolar por este Actor.");
 if(request.action==="start"){
  const {selection}=request;
  if(actor.getFlag(NS,"pendingRoll"))return;
  const config={...options()};
  const submitted=request.config??{};
  for(const key of ["mode","de","situation","equipmentId"]){
   if(typeof submitted[key]==="string")config[key]=submitted[key];
  }
  for(const key of ["step","contextApproved","dual"])config[key]=submitted[key]===true;
  config.extraKeep=[0,1,2].includes(submitted.extraKeep)?submitted.extraKeep:0;
  if(actor.type!=="creature"&&config.extraKeep===2)throw Error("A retenção adicional custa 1 Coragem.");
  const scene=game.scenes.get(request.sceneId);
  const targets=(request.targetIds??[]).map(id=>scene?.tokens.get(id)).filter(Boolean);
  const combat=game.combats.find(combat=>combat.scene?.id===scene?.id&&combat.started);
  const plan=prepareRoll(actor,selection,config,targets,!!combat);
  plan.options.combatId=combat?.id??null;
  await startRoll(actor,selection,plan);
  return;
 }
 const pending=actor.getFlag(NS,"pendingRoll");
 if(!pending||pending.id!==request.id)return;
 if(request.action==="finish"){
  await finishRoll(actor,user);
  return;
 }
 if(request.action!=="choose"||pending.publication)return;
 const {dieId,key,value}=request;
 const config={...pending.options};
 let selected=pending.selected;
 if(dieId){
  if(!pending.dice.some(d=>d.id===dieId))return;
  if(selected.includes(dieId))selected=selected.filter(id=>id!==dieId);
  else{
   if(selected.length>=retention(actor,config.extraKeep))throw Error("Limite de dados mantidos atingido.");
   selected=[...selected,dieId];
  }
  Object.assign(config,{cancelP:0,convertPairs:0,passA:false,characteristic:"",secondCharacteristic:""});
 }else{
  if(!["cancelP","convertPairs","passA","allyId","characteristic","secondCharacteristic","activationPayment"].includes(key))return;
  if(["cancelP","convertPairs"].includes(key)&&(!Number.isInteger(value)||value<0))return;
  if(key==="passA"&&typeof value!=="boolean")return;
  if(key==="activationPayment"&&!["pp","courage"].includes(value))return;
  config[key]=value;
  if(key==="characteristic")config.secondCharacteristic="";
  if(key==="allyId"){
   const ally=(game.combats.get(config.combatId)??game.combat)?.combatants.get(value);
   if(value&&(!ally?.actor||ally.actor.uuid===actor.uuid||ally.actor.uuid===config.targetActorUuid))return;
   config.allyName=ally?.name??"";
  }
 }
 await actor.update({[pendingFlag]:{...pending,selected,options:config}},{recursive:false});
}

function enqueueRoll(actor,user,request){
 const previous=actorQueues.get(actor.uuid)??Promise.resolve();
 const next=previous.catch(()=>{}).then(()=>mutateRoll(actor,user,request));
 actorQueues.set(actor.uuid,next);
 return next.finally(()=>{if(actorQueues.get(actor.uuid)===next)actorQueues.delete(actor.uuid);});
}

export function registerRollQueries(){
 CONFIG.queries[queryName]=async ({actorUuid,...request},{user})=>{
  if(!game.user.isGM||game.users.activeGM?.id!==game.user.id)throw Error("O Narrador ativo mudou. Tente de novo.");
  const actor=await fromUuid(actorUuid);
  if(actor?.documentName!=="Actor")throw Error("Actor indisponível.");
  await enqueueRoll(actor,user,request);
  return true;
 };
}

export async function requestRoll(actor,request){
 if(!actor.isOwner)return;
 const gm=game.users.activeGM;
 if(gm&&gm.id!==game.user.id&&game.user.hasPermission("QUERY_USER")){
  await gm.query(queryName,{...request,actorUuid:actor.uuid});
 }else{
  await enqueueRoll(actor,game.user,request);
 }
}
