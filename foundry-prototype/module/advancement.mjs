import {ATTRIBUTES, KNOWLEDGES, PRACTICES, SKILLS, XP_ATTRIBUTE, XP_TRAINING, xpLedger, starterPurchasePlan} from "./rules.mjs";

import {requirements} from "./skill-catalog.mjs";

export const developmentGroups = {
  attribute: {field:"attributes", label:"Atributos", graph:"attr", list:ATTRIBUTES, description:"Capacidades naturais que entram na pilha de dados."},
  knowledge: {field:"knowledges", label:"Conhecimentos", graph:"know", list:KNOWLEDGES, description:"Formações que fornecem dados conforme o Grau."},
  practice: {field:"practices", label:"Práticas", graph:"practice", list:PRACTICES, description:"Técnicas treinadas, como Atletismo e Disciplina."},
};
const groupsByPrefix = {a:"attribute", k:"knowledge", p:"practice"};
const entries = new Map(SKILLS.map(skill=>[skill.id,skill]));

function requirement(system,value){
  const [kind,key,grade] = value.split(":");
  if(kind==="s"){
    return {node:"skill:"+key, name:entries.get(key)?.name??key, met:system.skills?.includes(key) || (key==="maestria-manejo-duplo"&&system.skills?.includes("manejo-duplo"))};
  }
  const group=developmentGroups[groupsByPrefix[kind]];
  return {node:group.graph+":"+key, name:(group.list.find(([id])=>id===key)?.[1]??key)+" G"+grade, met:Number(system[group.field]?.[key]??0)>=Number(grade)};
}

export function skillDetails(system,id){
  const skill=entries.get(id);
  if(!skill)throw Error("Perícia indisponível.");
  const alternatives=(requirements[id]??[]).map(branch=>branch.map(entry=>requirement(system,entry)));
  const owned=system.skills?.includes(id) || (id==="maestria-manejo-duplo"&&system.skills?.includes("manejo-duplo"));
  const met=!alternatives.length||alternatives.some(branch=>branch.every(item=>item.met));
  const pending=!Number.isInteger(skill.cost);
  const left=xpLedger(system).left;
  const missing=alternatives.filter(branch=>branch.some(item=>!item.met)).map(branch=>branch.filter(item=>!item.met).map(item=>item.name).join(" + "));
  const blocker=skill.legacy?"Compra encerrada. Perícia preservada em fichas existentes.":pending?"Compra pendente de custo ou regra de aquisição.":!met?"Falta "+missing.join(" ou ")+".":left<skill.cost?"XP insuficiente.": "";
  return {...skill, alternatives, owned:Boolean(owned), canBuy:!owned&&!blocker, pending, met, affordable:left>=skill.cost, blocker};
}

export function gradeDetails(system,group,key,creationPending=false){
  const meta=Object.hasOwn(developmentGroups,group)?developmentGroups[group]:null;
  const name=meta?.list.find(([id])=>id===key)?.[1];
  if(!name)throw Error("Fonte indisponível.");
  const grade=Number(system[meta.field]?.[key]??0);
  const scale=group==="attribute"&&!system.monsterRules&&!system.monsterHumanoidRules?XP_ATTRIBUTE:XP_TRAINING;
  const cost=grade<6?scale[grade+1]-scale[grade]:null;
  const refund=grade>0?scale[grade]-scale[grade-1]:null;
  const withGrade=value=>({...system,[meta.field]:{...system[meta.field],[key]:value}});
  const raiseBlocker=cost===null?"Grau máximo (G6).":xpLedger(system).left<cost?"XP insuficiente.":
    creationPending?starterReserveBlocker(withGrade(grade+1)):"";
  const lowerBlocker=refund===null?"Grau mínimo (G0).":gradeRemovalBlocker(system,withGrade(grade-1));
  return {name,grade,cost,refund,field:meta.field,canBuy:!raiseBlocker,canLower:!lowerBlocker,raiseBlocker,lowerBlocker};
}

export function creationMissing(system){
  return {
    attr:!ATTRIBUTES.some(([key])=>(system.attributes?.[key]??0)>=1),
    training:![...KNOWLEDGES.map(([key])=>system.knowledges?.[key]),...PRACTICES.map(([key])=>system.practices?.[key])].some(value=>value>=1),
  };
}

function starterReserveBlocker(system){
  const missing=creationMissing(system);
  const reserve=(missing.attr?XP_ATTRIBUTE[1]:0)+(missing.training?XP_TRAINING[1]:0);
  return reserve>xpLedger(system).left?"Reserve "+reserve+" XP para a formação mínima do Aprendiz.":"";
}

function lostRequirement(previous,next){
  for(const id of next.skills??[]){
    if(!entries.has(id))continue;
    const trained=system=>(requirements[id]??[]).some(branch=>branch.every(entry=>requirement(system,entry).met));
    if(trained(previous)&&!trained(next)){
      return "A alteração retiraria um requisito de "+entries.get(id).name+".";
    }
  }
  return "";
}

function gradeRemovalBlocker(previous,next){
  const prerequisite=lostRequirement(previous,next);
  if(prerequisite)return prerequisite;
  if(previous.monsterRules||previous.animalRules||previous.monsterHumanoidRules)return "";
  const before=creationMissing(previous),after=creationMissing(next);
  if(!before.attr&&after.attr)return "Adquira outro Atributo G1 antes de remover o último.";
  if(!before.training&&after.training)return "Adquira outro Conhecimento ou Prática G1 antes de remover o último.";
  return "";
}

export function xpAdjustmentPlan(system,request){
  const ledger=xpLedger(system),{delta,expectedXP}=request;
  if(!Number.isSafeInteger(delta)||delta===0)throw Error("Informe uma quantidade inteira de XP.");
  if(expectedXP!==ledger.additional)throw Error("O saldo de XP mudou. Confira o valor atual e tente novamente.");
  const next=ledger.additional+delta;
  if(!Number.isSafeInteger(next)||!Number.isSafeInteger(ledger.formation+next)||next<0){
    throw Error("O XP adicional deve ser um inteiro não negativo.");
  }
  if(delta<0&&ledger.formation+next<ledger.spent)throw Error("O XP total ficaria abaixo do XP já investido.");
  return {previous:ledger.additional,next,delta};
}

export function advancementPlan(system,request,creationPending=false){
  if(request.kind==="grade"){
    const {group,key,delta}=request;
    if(![-1,1].includes(delta))throw Error("Alteração de Grau inválida.");
    if((system.monsterRules||system.animalRules)&&group!=="attribute")throw Error("Esta ficha só evolui Atributos.");
    const row=gradeDetails(system,group,key,creationPending);
    if(request.expectedGrade!==undefined&&row.grade!==request.expectedGrade){
      throw Error("Este Grau mudou. Confira o valor atual e tente novamente.");
    }
    const blocker=delta>0?row.raiseBlocker:row.lowerBlocker;
    if(blocker)throw Error(blocker);
    return {["system."+row.field+"."+key]:row.grade+delta};
  }
  if(system.monsterRules||system.animalRules)throw Error("Este tipo de ficha não usa formação humana.");
  if(request.kind==="skill"){
    const row=skillDetails(system,request.key);
    if(request.remove===true){
      if(!row.owned)throw Error("Perícia ainda não adquirida.");
      const skills=(system.skills??[]).filter(id=>id!==request.key&&!(request.key==="maestria-manejo-duplo"&&id==="manejo-duplo"));
      const blocker=lostRequirement(system,{...system,skills});
      if(blocker)throw Error(blocker);
      return {"system.skills":skills};
    }
    if(!row.canBuy)throw Error(row.owned?"Perícia já adquirida.":row.blocker);
    const skills=[...(system.skills??[]),request.key];
    const blocker=creationPending&&starterReserveBlocker({...system,skills});
    if(blocker)throw Error(blocker);
    return {"system.skills":skills};
  }
  if(request.kind==="starter"){
    const plan=starterPurchasePlan(system,request.attribute,request.group,request.key);
    if(!plan.ok)throw Error(plan.error);
    return plan.changes;
  }
  throw Error("Operação de evolução inválida.");
}
