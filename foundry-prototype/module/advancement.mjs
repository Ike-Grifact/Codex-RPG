import {ATTRIBUTES, KNOWLEDGES, PRACTICES, SKILLS, XP_ATTRIBUTE, XP_TRAINING, xpLedger, starterPurchasePlan} from "./rules.mjs";

import {requirements} from "./skill-catalog.mjs";

export const developmentGroups = {
  attribute: {field:"attributes", label:"Atributos", graph:"attr", list:ATTRIBUTES, description:"Capacidades naturais que entram na pilha de dados."},
  knowledge: {field:"knowledges", label:"Conhecimentos", graph:"know", list:KNOWLEDGES, description:"Formações que fornecem dados conforme o Grau."},
  practice: {field:"practices", label:"Práticas", graph:"practice", list:PRACTICES, description:"Técnicas treinadas, como Atletismo e Disciplina."},
};
const groupsByPrefix = {a:"attribute", k:"knowledge", p:"practice"};
const entries = new Map(SKILLS.map(skill=>[skill.id,skill]));

const ownsSkill=(system,id)=>system.skills?.includes(id)||
  (id==="maestria-manejo-duplo"&&system.skills?.includes("manejo-duplo"));
const purchasable=skill=>skill&&!skill.legacy&&Number.isSafeInteger(skill.cost)&&skill.cost>=0;
const branchesFor=(id,rules)=>Object.hasOwn(rules,id)?rules[id]:[[]];

function purchaseBlocker(skill){
  if(!skill)return "Perícia indisponível.";
  if(skill.legacy)return "Compra encerrada. Perícia preservada em fichas existentes.";
  return purchasable(skill)?"":"Compra pendente de custo ou regra de aquisição.";
}

function decodeRequirement(value){
  if(typeof value!=="string")return null;
  const [kind,key,rawGrade,...rest]=value.split(":");
  if(kind==="s"){
    return rawGrade===undefined&&entries.has(key)?{skill:key,node:"skill:"+key,name:entries.get(key).name}:null;
  }
  const group=Object.hasOwn(groupsByPrefix,kind)?developmentGroups[groupsByPrefix[kind]]:null;
  const name=group?.list.find(([id])=>id===key)?.[1];
  if(!name||rest.length||!/^[0-6]$/.test(rawGrade??""))return null;
  const grade=Number(rawGrade);
  return {field:group.field,key,grade,node:group.graph+":"+key,name:name+" G"+grade};
}

function requirementMet(system,req){
  if(!req)return false;
  return req.skill?ownsSkill(system,req.skill):(system[req.field]?.[req.key]??0)>=req.grade;
}

function requirement(system,value){
  const req=decodeRequirement(value);
  return req?{node:req.node,name:req.name,met:Boolean(requirementMet(system,req))}:
    {node:"",name:"Requisito inválido",met:false};
}

export function skillDetails(system,id){
  const skill=entries.get(id);
  if(!skill)throw Error("Perícia indisponível.");
  const alternatives=(requirements[id]??[]).map(branch=>branch.map(entry=>requirement(system,entry)));
  const owned=ownsSkill(system,id);
  const met=!alternatives.length||alternatives.some(branch=>branch.every(item=>item.met));
  const pending=!Number.isSafeInteger(skill.cost)||skill.cost<0;
  const left=xpLedger(system).left;
  const missing=alternatives.filter(branch=>branch.some(item=>!item.met)).map(branch=>branch.filter(item=>!item.met).map(item=>item.name).join(" + "));
  const blocker=purchaseBlocker(skill)||(!met?"Falta "+missing.join(" ou ")+".":left<skill.cost?"XP insuficiente.":"");
  return {...skill, alternatives, owned:Boolean(owned), canBuy:!owned&&!blocker, pending, met, blocker};
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
  for(const savedId of next.skills??[]){
    const id=savedId==="manejo-duplo"?"maestria-manejo-duplo":savedId;
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


function* resolvePackage(id,draft,ancestors,rules){
  if(ownsSkill(draft.system,id)){yield draft;return;}
  if(!purchasable(entries.get(id))||ancestors.includes(id))return;
  const branches=branchesFor(id,rules);
  if(!Array.isArray(branches))return;
  for(const [option,branch] of branches.entries()){
    if(!Array.isArray(branch))continue;
    const required=branch.map(decodeRequirement);
    if(required.some(req=>!req))continue;
    let system=draft.system;
    const skills=[];
    for(const req of required){
      if(req.skill)skills.push(req.skill);
      else if(!requirementMet(system,req)){
        system={...system,[req.field]:{...system[req.field],[req.key]:req.grade}};
      }
    }
    for(const result of resolveIntermediates(skills,0,{...draft,system},[...ancestors,id],rules)){
      if(!required.every(req=>requirementMet(result.system,req)))continue;
      const choices=branches.length>1?[...result.choices,{id,option,requirements:required.map(req=>req.name)}]:result.choices;
      yield {system:{...result.system,skills:[...result.system.skills,id]},choices};
    }
  }
}

function* resolveIntermediates(ids,index,draft,ancestors,rules){
  if(index===ids.length){yield draft;return;}
  // Mantenha alternativas intermediárias até avaliar o pacote inteiro. Uma
  // alternativa mais cara isoladamente pode compartilhar requisitos posteriores.
  for(const next of resolvePackage(ids[index],draft,ancestors,rules)){
    yield* resolveIntermediates(ids,index+1,next,ancestors,rules);
  }
}

export function planSkillPackage(system,id,{creationPending=false,rules=requirements}={}){
  const skill=entries.get(id),baseSkills=system.skills??[];
  const blocked=blocker=>({status:"locked",blocker});
  if(!Array.isArray(baseSkills)||baseSkills.some(key=>typeof key!=="string")||new Set(baseSkills).size!==baseSkills.length){
    return blocked("Dados de Perícias inválidos.");
  }
  if(ownsSkill(system,id))return {status:"owned"};
  if(system.monsterRules||system.animalRules)return blocked("Este tipo de ficha não usa formação humana.");
  const reason=purchaseBlocker(skill);
  if(reason)return blocked(reason);
  const grades=Object.values(developmentGroups).flatMap(group=>group.list.map(([key,name])=>({
    field:group.field,key,name,from:system[group.field]?.[key]??0,
  })));
  if(grades.some(({from})=>!Number.isInteger(from)||from<0||from>6))return blocked("Dados de Grau inválidos.");
  const additional=system.xp??0,before=xpLedger(system);
  if(!Number.isSafeInteger(additional)||additional<0||!Number.isSafeInteger(before.grant)||!Number.isSafeInteger(before.spent)){
    return blocked("Orçamento de XP inválido.");
  }

  let cheapest,eligible;
  for(const draft of resolvePackage(id,{system:{...system,skills:baseSkills},choices:[]},[],rules)){
    const next=xpLedger(draft.system),cost=next.spent-before.spent;
    const blocker=next.left<0?"XP insuficiente para o pacote completo.":
      creationPending?starterReserveBlocker(draft.system):"";
    const choice={...draft,cost,after:next.left,blocker};
    if(!cheapest||cost<cheapest.cost)cheapest=choice;
    if(!blocker&&(!eligible||cost<eligible.cost))eligible=choice;
  }
  const best=eligible??cheapest;
  if(!best)return blocked("Não há uma combinação válida para adquirir os requisitos.");

  const increases=grades.map(row=>({...row,to:best.system[row.field]?.[row.key]??0})).filter(row=>row.to>row.from);
  const acquired=best.system.skills.filter(key=>!baseSkills.includes(key));
  const changes=Object.fromEntries(increases.map(({field,key,to})=>["system."+field+"."+key,to]));
  changes["system.skills"]=best.system.skills;
  const status=best.blocker?"locked":increases.length||acquired.length>1?"potential":"available";
  const quote=JSON.stringify([id,best.cost,before.left,best.after,increases.map(({field,key,from,to})=>[field,key,from,to]),
    acquired,best.choices.map(choice=>[choice.id,choice.option])]);
  return {
    status,blocker:best.blocker,name:skill.name,cost:best.cost,before:before.left,after:best.after,
    increases,intermediates:acquired.filter(key=>key!==id).map(key=>({id:key,name:entries.get(key).name})),
    alternatives:best.choices.map(choice=>({...choice,name:entries.get(choice.id).name})),changes,quote,
  };
}


export function skillRefundPlan(system,id){
  const row=skillDetails(system,id);
  if(!row.owned)return {blocker:"Perícia ainda não adquirida."};
  const skills=(system.skills??[]).filter(key=>key!==id&&!(id==="maestria-manejo-duplo"&&key==="manejo-duplo"));
  const next={...system,skills},before=xpLedger(system),after=xpLedger(next);
  return {name:row.name,refund:before.spent-after.spent,spentBefore:before.spent,spentAfter:after.spent,
    blocker:lostRequirement(system,next),changes:{"system.skills":skills}};
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
  if(request.kind==="skillPackage"){
    const plan=planSkillPackage(system,request.key,{creationPending});
    if(plan.status==="owned")throw Error("Perícia já adquirida.");
    if(plan.blocker)throw Error(plan.blocker);
    if(plan.status!=="potential"||plan.quote!==request.expectedPlan){
      throw Error("O plano de compra mudou. Abra a Perícia e confirme o novo pacote.");
    }
    return plan.changes;
  }
  if(request.kind==="skill"){
    const row=skillDetails(system,request.key);
    if(request.remove===true){
      const plan=skillRefundPlan(system,request.key);
      if(plan.blocker)throw Error(plan.blocker);
      if(request.expectedRefund!==undefined&&plan.refund!==request.expectedRefund){
        throw Error("O reembolso mudou. Confira o novo valor.");
      }
      return plan.changes;
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
