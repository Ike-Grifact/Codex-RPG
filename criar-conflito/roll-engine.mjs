/* Rolagem básica de criaturas do Criar Conflito.
   Reutiliza as faces e a resolução oficiais do Foundry. Sem automação de alvos,
   dano corporal, transferência de Pavor residual ou iniciação de turnos. */
import {sourceDice,faceSymbols,resolveRoll,SITUATIONS,narratorCap} from "./codex-rules.mjs";
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,isHumanoidKind,toSystem,stats} from "./rules.mjs?v=20261115-kinds1";

const keys=new Set(ATTRIBUTES.map(([key])=>key));
export {faceSymbols,SITUATIONS};

export function creaturePool(unit,primary,secondary){
 if(!unit||isHumanoidKind(unit.kind))return {ok:false,error:"Humanoides devem usar a rolagem com Prática/Conhecimento e Atributo na ficha completa."};
 if(!keys.has(primary)||!keys.has(secondary)||primary===secondary)return {ok:false,error:"Escolha dois Atributos diferentes e pertinentes."};
 const system=toSystem(unit);
 const pool=[primary,secondary].flatMap(key=>sourceDice("attribute",key,system).map((sides,i)=>({
  id:"attribute."+key+"."+i,group:"attribute",key,sides
 })));
 if(pool.length<2||pool.length>9)return {ok:false,error:"A pilha deve ter de 2 a 9 dados."};
 return {ok:true,pool};
}
/** Usa as mesmas fontes e a mesma tabela do jogador. O inimigo paga Pavor local. */
export function humanoidPool(unit,baseGroup,baseKey,attributeKey,mode="normal"){
 if(!unit||!isHumanoidKind(unit.kind))return {ok:false,error:"Esta rolagem exige um NPC humanoide."};
 return composeActionPool(unit,{baseGroup,baseKey,attribute:attributeKey,mode});
}

/** Humanoides inimigos usam a pilha e os Marcos do jogador; custos de preparação em Pavor local. */
export function previewHumanoidRoll(unit,rolled,keptIds,options={}){
 if(!unit||!isHumanoidKind(unit.kind))return {ok:false,error:"Selecione um humanoide."};
 const de=Number(options.de),situation=String(options.situation||"neutral");
 const kept=Array.isArray(keptIds)?[...new Set(keptIds)]:[];
 const naturalKeep=Number(unit.threatGrade)>=2?3:2;
 const limit=Math.min(4,naturalKeep+Number(!!options.extraKeep));
 const spentRetention=Math.max(0,kept.length-naturalKeep);
 const step=Number(!!(options.stepSourceId||options.stepDieId));
 const cost=spentRetention+step;
 if(!Array.isArray(rolled)||rolled.length<2||rolled.length>9||new Set(rolled.map(d=>d.id)).size!==rolled.length)
  return {ok:false,error:"Pilha de dados inválida."};
 if(!Number.isInteger(de)||de<0||de>30)return {ok:false,error:"Informe DE entre 0 e 30."};
 if(!Object.hasOwn(SITUATIONS,situation))return {ok:false,error:"Modificador de situação desconhecido."};
 if(kept.length<1||kept.length>limit)return {ok:false,error:"Selecione de 1 a "+limit+" dados mantidos."};
 if(cost>Number(unit.pavorLocal||0))return {ok:false,error:"Pavor local insuficiente para retenção e elevação."};
 if(kept.some(id=>!rolled.some(d=>d.id===id)))return {ok:false,error:"Um dado mantido não pertence à pilha."};
 const cancelP=Number(options.cancelP||0),convertPairs=Number(options.convertPairs||0),passA=!!options.passA;
 if(!Number.isInteger(cancelP)||!Number.isInteger(convertPairs))return {ok:false,error:"Gastos de Antecipar inválidos."};
 const result=resolveRoll(rolled,kept,{de,situation,level:Number(unit.level||1),
  monster:false,hostile:true,enemyKeepLimit:limit,extraKeep:spentRetention>0,
  courage:10,cancelP,convertPairs});
 if(!result.ok)return {ok:false,error:result.errors.join("; ")};
 if(passA&&result.aRemaining<1)return {ok:false,error:"Falta Antecipar para passar a oportunidade."};
 return {ok:true,cost,courageCost:0,result,passA,remainingA:result.aRemaining-Number(passA),
  criticalPavor:result.monsterCriticalPavor||0};
}

/** Composição unificada. Humanos seguem o Codex Genético; monstros só combinam Atributos. */
export function composeActionPool(unit,selection={},stepSourceId="",equipment=null){
 if(!unit)return {ok:false,error:"Selecione uma ficha."};
 const human=isHumanoidKind(unit.kind),system=toSystem(unit),extra=selection.extra;
 const sources=human?[
  {group:selection.baseGroup,key:selection.baseKey},
  {group:"attribute",key:selection.attribute}
 ]:[{group:"attribute",key:selection.first},{group:"attribute",key:selection.second}];
 if(extra)sources.push(extra);
 const errors=[],ids=new Set();
 for(const src of sources){
  const defs=src.group==="attribute"?ATTRIBUTES:src.group==="knowledge"?KNOWLEDGES:src.group==="practice"?PRACTICES:[];
  if(!defs.some(([k])=>k===src.key))errors.push("Fonte inválida.");
  const id=src.group+":"+src.key;
  if(ids.has(id))errors.push("Não repita a mesma fonte.");
  ids.add(id);
 }
 if(human&&!["knowledge","practice"].includes(selection.baseGroup))errors.push("Escolha Conhecimento ou Prática como base.");
 if(human&&selection.baseKey==="armas_conjuracao"&&selection.mode==="conjuracao"&&
   !unit.skills.includes("criar-item-foco-magia")&&!["fogo","agua","vento","terra","sagrado","sangue","trevas","veneno"].some(x=>unit.skills.includes(x)))
  errors.push("Conjuração exige a habilitação pertinente.");
 if(extra){
  const srcId=selection.baseGroup==="knowledge"?"know":selection.baseGroup;
  const advancedId={
   "practice:armas_conjuracao":"disciplina-avancada","practice:furtividade":"furtividade-avancada",
   "practice:atletismo":"atletismo-avancado","practice:artesao":"artesao-avancado",
   "practice:apresentacao":"apresentacao-avancada","practice:coleta":"coleta-avancada",
   "knowledge:protecao":"protecao-avancada","knowledge:astronomia":"astronomia-avancada",
   "knowledge:medicina":"medicina-avancada","knowledge:alquimia":"alquimia-avancada",
   "knowledge:engenharia":"engenharia-avancada","knowledge:erudicao":"erudicao-avancada"
  }[selection.baseGroup+":"+selection.baseKey];
  const able=human?!!advancedId&&unit.skills.includes(advancedId)&&
   Number((selection.baseGroup==="knowledge"?unit.knowledges:unit.practices)[selection.baseKey]||0)>=2:
   Number(unit.threatGrade)>=5;
  if(!able)errors.push("Terceira fonte exige Perícia Avançada da base ou habilidade de monstro G5+.");
  if(human&&extra.group===selection.baseGroup)errors.push("Não combine Prática com Prática, nem Conhecimento com Conhecimento.");
  if(!human&&extra.group!=="attribute")errors.push("Criaturas extraordinárias usam apenas Atributos.");
 }
 const stepped=sources.find(x=>stepSourceId===x.group+"."+x.key);
 if(stepSourceId&&(!stepped||((system[
  stepped.group==="attribute"?"attributes":stepped.group==="knowledge"?"knowledges":"practices"
 ]?.[stepped.key]??6)>=6)))errors.push("Elevação exige uma fonte participante abaixo do Grau 6.");
 if(!human&&unit.kind==="criatura"&&stepSourceId)errors.push("Elevação da criatura comum ainda não habilitada.");
 if(errors.length)return {ok:false,error:errors.join(" ")};
 const pool=[];
 for(const src of sources){
  const field=src.group==="attribute"?"attributes":src.group==="knowledge"?"knowledges":"practices";
  const grade=system[field][src.key]||0,raised=stepSourceId===src.group+"."+src.key;
  const modified=raised?{...system,[field]:{...system[field],[src.key]:grade+1}}:system;
  for(const [index,sides] of sourceDice(src.group,src.key,modified).entries())
   pool.push({id:src.group+"."+src.key+"."+index,group:src.group,key:src.key,sides,baseSides:sides,temporaryStep:raised});
 }
 if(equipment){
  if(!human||selection.baseKey!=="armas_conjuracao")errors.push("Dados de equipamento exigem Disciplina de humanoide.");
  if(!equipment.equipped||![4,6,10,12].includes(Number(equipment.die)))errors.push("Equipe uma arma/foco válido.");
  if(!equipment.qualified)errors.push("Perícia necessária para habilitar o dado do equipamento.");
  if(!errors.length)pool.push({id:"equipment."+equipment.id+".0",group:"equipment",key:equipment.name,
   sides:Number(equipment.die),baseSides:Number(equipment.die)});
 }
 if(pool.length<2||pool.length>9)errors.push("A pilha deve conter entre 2 e 9 dados.");
 return errors.length?{ok:false,error:errors.join(" ")}:{ok:true,pool,sources};
}

export function rollCreatureFaces(pool,random=Math.random){
 return pool.map(d=>{
  const n=Number(random());
  if(!Number.isFinite(n)||n<0||n>=1)throw Error("Fonte de aleatoriedade fora do intervalo [0,1).");
  return {...d,face:Math.floor(n*d.sides)+1};
 });
}
export function previewCreatureRoll(unit,rolled,keptIds,options={}){
 const de=Number(options.de),situation=String(options.situation||"neutral");
 const kept=Array.isArray(keptIds)?[...new Set(keptIds)]:[];
 const count=kept.length;
 const cap=unit?.kind==="monstro"?stats(unit).keepMax:2;
 const cost=unit?.kind==="monstro"?Math.max(0,count-2)+Number(!!(options.stepSourceId||options.stepDieId)):0;
 if(!unit||isHumanoidKind(unit.kind))return {ok:false,error:"Este simulador é para criaturas não humanoides."};
 if(!Array.isArray(rolled)||rolled.length<2||rolled.length>9||new Set(rolled.map(d=>d.id)).size!==rolled.length)
  return {ok:false,error:"Pilha de dados inválida."};
 if(!Number.isInteger(de)||de<0||de>30)return {ok:false,error:"Informe DE entre 0 e 30."};
 if(!Object.hasOwn(SITUATIONS,situation))return {ok:false,error:"Modificador de situação desconhecido."};
 if(count<1||count>cap)return {ok:false,error:"Selecione até "+cap+" dados mantidos."};
 if(kept.some(id=>!rolled.some(d=>d.id===id)))return {ok:false,error:"Um dado mantido não pertence à pilha."};
 if(cost>Number(unit.pavorLocal||0))return {ok:false,error:"Pavor local insuficiente: a retenção exige "+cost+"P."};
 const cancelP=Number(options.cancelP||0),convertPairs=Number(options.convertPairs||0),passA=!!options.passA;
 if(!Number.isInteger(cancelP)||!Number.isInteger(convertPairs))return {ok:false,error:"Gastos de Antecipar precisam ser inteiros."};
 const result=resolveRoll(rolled,kept,{de,situation,monster:true,hostile:true,threatGrade:unit.threatGrade,
   extraKeep:Math.max(0,count-2),cancelP,convertPairs});
 if(!result.ok)return {ok:false,error:result.errors.join("; ")};
 if(passA&&result.aRemaining<1)return {ok:false,error:"Falta Antecipar para passar a oportunidade."};
 return {ok:true,cost,result,passA,remainingA:result.aRemaining-Number(passA),
   criticalPavor:unit.kind==="monstro"?result.monsterCriticalPavor:0};
}
export function settleCreatureRoll(unit,publicPavor,players,preview){
 if(!preview?.ok||!unit)return {ok:false,error:"Rolagem não confirmável."};
 const before=Number(unit.pavorLocal||0),spent=Number(preview.cost||0),courageSpent=0;
 if(before<spent)return {ok:false,error:"Pavor local insuficiente."};
 
 const localCap=stats(unit).limitLocal,publicCap=narratorCap(players);
 const afterSpent=before-spent;
 // Crítico: Pavor gerado cabe primeiro na reserva local, depois na pública.
 const generated=preview.criticalPavor||0;
 const localGain=Math.min(generated,Math.max(0,localCap-afterSpent));
 const publicGain=Math.min(generated-localGain,Math.max(0,publicCap-publicPavor));
 return {ok:true,unit:{...unit,pavorLocal:afterSpent+localGain,courage:Math.max(0,Number(unit.courage??0)-courageSpent)},
   publicPavor:publicPavor+publicGain,spent,courageSpent,generated,localGain,publicGain,
   overflow:generated-localGain-publicGain,
   residualPavor:preview.result.p,
   damage:preview.result.damage};
}
export function publicJointCost(participants){return Number.isInteger(participants)&&participants>=2&&participants<=3?participants-1:null;}
export function canDeclareJoint(roster,publicPavor,participants){
 const cost=publicJointCost(participants);
 const alive=(roster||[]).filter(t=>Number(t.life)>0);
 return {ok:cost!==null&&alive.length>=participants&&alive.some(t=>t.leader)&&publicPavor>=cost,
  cost,alive:alive.length,leaders:alive.filter(t=>t.leader).length};
}
