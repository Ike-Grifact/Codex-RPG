/* Rolagem básica de criaturas do Criar Conflito.
   Reutiliza as faces e a resolução oficiais do Foundry. Sem automação de alvos,
   dano corporal, transferência de Pavor residual ou iniciação de turnos. */
import {sourceDice,faceSymbols,resolveRoll,buildPool,keepLimit,SITUATIONS,narratorCap} from "./codex-rules.mjs";
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
/** A fonte base humana é Conhecimento/Prática + Atributo; Disciplina exige modo e habilitação. */
export function humanoidPool(unit,baseGroup,baseKey,attributeKey,mode="normal"){
 if(!unit||!isHumanoidKind(unit.kind))return {ok:false,error:"Esta rolagem exige um NPC humanoide."};
 if(!["knowledge","practice"].includes(baseGroup))
  return {ok:false,error:"Escolha um Conhecimento ou uma Prática como fonte base."};
 const result=buildPool({...unit,monsterRules:false},{
  base:{group:baseGroup,key:baseKey},attribute:{group:"attribute",key:attributeKey}
 },{mode});
 return result.ok?{ok:true,pool:result.pool}:{ok:false,error:result.errors.join("; ")};
}

/** Versão básica do teste humanoide; efeitos de Perícias e dados de equipamento não são automáticos. */
export function previewHumanoidRoll(unit,rolled,keptIds,options={}){
 if(!unit||!isHumanoidKind(unit.kind))return {ok:false,error:"Selecione um humanoide."};
 const de=Number(options.de),situation=String(options.situation||"neutral");
 const kept=Array.isArray(keptIds)?[...new Set(keptIds)]:[];
 const extraKeep=!!options.extraKeep;
 // Ameaça Grau 2 equivale narrativamente a jogador nível 5,
 // mas o teto inimigo de quatro dados é uma regra própria do Grau, não do Marco.
 const naturalKeep=Number(unit.threatGrade)>=2?3:2;
 const limit=Math.min(4,naturalKeep+Number(extraKeep));
 // Pagar só pelo quarto dado efetivamente mantido: ativar o controle sem usá-lo
 // não consome Coragem. A autorização ainda é necessária para passar do limite natural.
 const paidExtraKeep=extraKeep&&kept.length>naturalKeep;
 const courageCost=Number(paidExtraKeep)+Number(!!options.stepDieId);
 if(!Array.isArray(rolled)||rolled.length<2||rolled.length>9||new Set(rolled.map(d=>d.id)).size!==rolled.length)
  return {ok:false,error:"Pilha de dados inválida."};
 if(!Number.isInteger(de)||de<0||de>30)return {ok:false,error:"Informe DE entre 0 e 30."};
 if(!Object.hasOwn(SITUATIONS,situation))return {ok:false,error:"Modificador de situação desconhecido."};
 if(kept.length<1||kept.length>limit)return {ok:false,error:"Escolha de 1 até "+limit+" dados mantidos neste Marco."};
 if(courageCost>Number(unit.courage??10))return {ok:false,error:"Coragem insuficiente para retenção e elevação."};
 if(kept.some(id=>!rolled.some(d=>d.id===id)))return {ok:false,error:"Dado não pertence à pilha."};
 const cancelP=Number(options.cancelP||0),convertPairs=Number(options.convertPairs||0),passA=!!options.passA;
 if(!Number.isInteger(cancelP)||!Number.isInteger(convertPairs))
  return {ok:false,error:"Gastos de Antecipar precisam ser inteiros."};
 const result=resolveRoll(rolled,kept,{de,situation,level:Number(unit.level||1),
  monster:false,hostile:true,enemyKeepLimit:limit,extraKeep:paidExtraKeep,
  courage:Number(unit.courage??10),cancelP,convertPairs});
 if(!result.ok)return {ok:false,error:result.errors.join("; ")};
 if(passA&&result.aRemaining<1)return {ok:false,error:"Falta Antecipar para passar a oportunidade."};
 return {ok:true,cost:0,courageCost,result,passA,remainingA:result.aRemaining-Number(passA),
  criticalPavor:result.monsterCriticalPavor||0};
}

/** Composição com duas fontes livres e terceira habilitada; a validação é a mesma do motor de rolagens. */
export function composeActionPool(unit,selection={},stepDieId=""){
 if(!unit)return {ok:false,error:"Selecione uma ficha."};
 const human=isHumanoidKind(unit.kind),system=toSystem(unit);
 const first=selection.firstSource||(human?
  {group:selection.baseGroup,key:selection.baseKey}:{group:"attribute",key:selection.first});
 const second=selection.secondSource||(human?
  {group:"attribute",key:selection.attribute}:{group:"attribute",key:selection.second});
 const extra=selection.extra||null,sources=[first,second,...(extra?[extra]:[])];
 const discipline=sources.some(src=>src.group==="practice"&&src.key==="armas_conjuracao");
 const mode=discipline?(selection.mode||"armas"):"normal";
 const result=buildPool(system,{base:first,attribute:second,complement:extra},{
  mode,contextApproved:!!selection.contextOK,step:!!stepDieId,stepDieId
 });
 if(!result.ok)return {ok:false,error:result.errors.join(" ")};
 if(result.pool.length<2||result.pool.length>9)return {ok:false,error:"A pilha deve ter de 2 a 9 dados."};
 return {ok:true,pool:result.pool,sources};
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
 const cost=unit?.kind==="monstro"?Math.max(0,count-2)+Number(!!options.stepDieId):0;
 if(!unit||isHumanoidKind(unit.kind))return {ok:false,error:"Este simulador é para criaturas não humanoides."};
 if(!Array.isArray(rolled)||rolled.length<2||rolled.length>9||new Set(rolled.map(d=>d.id)).size!==rolled.length)
  return {ok:false,error:"Pilha de dados inválida."};
 if(!Number.isInteger(de)||de<0||de>30)return {ok:false,error:"Informe DE entre 0 e 30."};
 if(!Object.hasOwn(SITUATIONS,situation))return {ok:false,error:"Modificador de situação desconhecido."};
 if(count<1||count>Math.min(cap,Number(unit?.keep||2)))return {ok:false,error:"Selecione até "+Math.min(cap,Number(unit?.keep||2))+" dados mantidos."};
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
 const before=Number(unit.pavorLocal||0),spent=Number(preview.cost||0),courageSpent=Number(preview.courageCost||0);
 if(before<spent)return {ok:false,error:"Pavor local insuficiente."};
 if(courageSpent>Number(unit.courage??0))return {ok:false,error:"Coragem insuficiente."};
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
