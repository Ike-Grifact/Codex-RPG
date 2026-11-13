/* Rolagem básica de criaturas do Criar Conflito.
   Reutiliza as faces e a resolução oficiais do Foundry. Sem automação de alvos,
   dano corporal, transferência de Pavor residual ou iniciação de turnos. */
import {sourceDice,faceSymbols,resolveRoll,SITUATIONS,narratorCap} from "../foundry-prototype/module/rules.mjs";
import {ATTRIBUTES,toSystem,stats} from "./rules.mjs";

const keys=new Set(ATTRIBUTES.map(([key])=>key));
export {faceSymbols,SITUATIONS};

export function creaturePool(unit,primary,secondary){
 if(!unit||unit.kind==="humanoide")return {ok:false,error:"Humanoides devem usar a rolagem com Prática/Conhecimento e Atributo na ficha completa."};
 if(!keys.has(primary)||!keys.has(secondary)||primary===secondary)return {ok:false,error:"Escolha dois Atributos diferentes e pertinentes."};
 const system=toSystem(unit);
 const pool=[primary,secondary].flatMap(key=>sourceDice("attribute",key,system).map((sides,i)=>({
  id:"attribute."+key+"."+i,group:"attribute",key,sides
 })));
 if(pool.length<2||pool.length>9)return {ok:false,error:"A pilha deve ter de 2 a 9 dados."};
 return {ok:true,pool};
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
 const count=unit?.kind==="monstro"?Number(unit.keep||2):2;
 const cap=unit?.kind==="monstro"?stats(unit).keepMax:2;
 const cost=unit?.kind==="monstro"?Math.max(0,count-2):0;
 if(!unit||unit.kind==="humanoide")return {ok:false,error:"Este simulador é para criaturas não humanoides."};
 if(!Array.isArray(rolled)||rolled.length<2||rolled.length>9||new Set(rolled.map(d=>d.id)).size!==rolled.length)
  return {ok:false,error:"Pilha de dados inválida."};
 if(!Number.isInteger(de)||de<0||de>30)return {ok:false,error:"Informe DE entre 0 e 30."};
 if(!Object.hasOwn(SITUATIONS,situation))return {ok:false,error:"Modificador de situação desconhecido."};
 if(count>cap||kept.length!==count)return {ok:false,error:"Escolha exatamente "+count+" dados mantidos."};
 if(kept.some(id=>!rolled.some(d=>d.id===id)))return {ok:false,error:"Um dado mantido não pertence à pilha."};
 if(cost>Number(unit.pavorLocal||0))return {ok:false,error:"Pavor local insuficiente: a retenção exige "+cost+"P."};
 const cancelP=Number(options.cancelP||0),convertPairs=Number(options.convertPairs||0),passA=!!options.passA;
 if(!Number.isInteger(cancelP)||!Number.isInteger(convertPairs))return {ok:false,error:"Gastos de Antecipar precisam ser inteiros."};
 const result=resolveRoll(rolled,kept,{de,situation,monster:true,hostile:true,threatGrade:unit.threatGrade,
   extraKeep:cost,cancelP,convertPairs});
 if(!result.ok)return {ok:false,error:result.errors.join("; ")};
 if(passA&&result.aRemaining<1)return {ok:false,error:"Falta Antecipar para passar a oportunidade."};
 return {ok:true,cost,result,passA,remainingA:result.aRemaining-Number(passA),
   criticalPavor:unit.kind==="monstro"?result.monsterCriticalPavor:0};
}
export function settleCreatureRoll(unit,publicPavor,players,preview){
 if(!preview?.ok||!unit||unit.kind==="humanoide")return {ok:false,error:"Rolagem não confirmável."};
 const before=Number(unit.pavorLocal||0),spent=preview.cost;
 if(before<spent)return {ok:false,error:"Pavor local insuficiente."};
 const localCap=stats(unit).limitLocal,publicCap=narratorCap(players);
 const afterSpent=before-spent;
 // Crítico: Pavor gerado cabe primeiro na reserva local, depois na pública.
 const generated=preview.criticalPavor||0;
 const localGain=Math.min(generated,Math.max(0,localCap-afterSpent));
 const publicGain=Math.min(generated-localGain,Math.max(0,publicCap-publicPavor));
 return {ok:true,unit:{...unit,pavorLocal:afterSpent+localGain},
   publicPavor:publicPavor+publicGain,spent,generated,localGain,publicGain,
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
