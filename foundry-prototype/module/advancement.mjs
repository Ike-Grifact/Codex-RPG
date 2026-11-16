import {ATTRIBUTES, KNOWLEDGES, PRACTICES, SKILLS, XP_ATTRIBUTE, XP_TRAINING, xpLedger, starterPurchasePlan} from "./rules.mjs";

export const developmentGroups = {
  attribute: {field:"attributes", label:"Atributos", graph:"attr", list:ATTRIBUTES, description:"Capacidades naturais que entram na pilha de dados."},
  knowledge: {field:"knowledges", label:"Conhecimentos", graph:"know", list:KNOWLEDGES, description:"Formações que fornecem dados conforme o Grau."},
  practice: {field:"practices", label:"Práticas", graph:"practice", list:PRACTICES, description:"Técnicas treinadas, como Atletismo e Disciplina."},
};
const groupsByPrefix = {a:"attribute", k:"knowledge", p:"practice"};
const entries = new Map(SKILLS.map(skill=>[skill.id,skill]));
// Alternativas de aquisição do Codex Genético web. Cada linha é uma combinação cumulativa.
const requirements = {
 "montar":[["a:influencia:2"]],
 "provocacao-sofisticada":[["a:influencia:2"]],
 "armas-leves":[["p:armas_conjuracao:1"]],
 "armas-medias":[["p:armas_conjuracao:1","a:forca:1"]],
 "armas-pesadas":[["p:armas_conjuracao:2","a:forca:2"]],
 "disciplina-avancada":[["p:armas_conjuracao:2"]],
 "recuperacao-vigorosa":[["a:vigor:3"]],
 "pugilismo":[["p:armas_conjuracao:1","a:forca:2","a:destreza:1"]],
 "artista-marcial":[["p:armas_conjuracao:2","a:destreza:2","s:pugilismo"]],
 "golpe-baixo":[["a:destreza:2","a:forca:1","a:agilidade:1"]],
 "furtividade":[["p:furtividade:2","a:destreza:2","a:agilidade:1"]],
 "furtividade-avancada":[["p:furtividade:2","s:furtividade"]],
 "criar-item-foco-magia":[["p:armas_conjuracao:1","a:inteligencia:1","p:artesao:1"]],
 "escudo-arcano":[["a:inteligencia:2","a:vigor:1","s:criar-item-foco-magia"]],
 "conjuracao-equilibrada":[["p:armas_conjuracao:2","a:inteligencia:2","a:destreza:2","s:criar-item-foco-magia"]],
 "improviso":[["p:armas_conjuracao:1","a:inteligencia:1","a:destreza:1","s:criar-item-foco-magia"]],
 "fogo":[["p:armas_conjuracao:1","a:inteligencia:1","s:criar-item-foco-magia"]],
 "agua":[["p:armas_conjuracao:1","a:inteligencia:1","s:criar-item-foco-magia"]],
 "vento":[["p:armas_conjuracao:1","a:inteligencia:1","s:criar-item-foco-magia"]],
 "terra":[["p:armas_conjuracao:1","a:inteligencia:1","s:criar-item-foco-magia"]],
 "sagrado":[["p:armas_conjuracao:2","a:inteligencia:2","s:criar-item-foco-magia"]],
 "sangue":[["p:armas_conjuracao:2","a:inteligencia:2","s:criar-item-foco-magia"]],
 "trevas":[["p:armas_conjuracao:2","a:inteligencia:2","s:criar-item-foco-magia"]],
 "veneno":[["p:armas_conjuracao:2","a:inteligencia:2","k:alquimia:2","k:medicina:2"]],
 "criar-veneno":[["p:artesao:1","a:inteligencia:2","k:alquimia:2","k:medicina:2"]],
 "criar-antidoto":[["p:artesao:1","a:inteligencia:2","k:alquimia:2","k:medicina:2","s:criar-veneno"]],
 "armas-longo-alcance":[["p:armas_conjuracao:1","a:destreza:2"]],
 "armas-fogo":[["p:armas_conjuracao:2","a:destreza:2"]],
 "maestria-arremesso-armas":[
  ["a:forca:2","a:destreza:2","a:agilidade:1","s:armas-leves"],
  ["a:forca:2","a:destreza:2","a:agilidade:1","s:armas-medias"],
  ["a:forca:2","a:destreza:2","a:agilidade:1","s:armas-pesadas"]],
 "golpe-fulminante":[
  ...["armas-leves","armas-medias","armas-pesadas","maestria-manejo-duplo","pugilismo"].map(id=>
   ["p:armas_conjuracao:2","a:forca:2","s:"+id])],
 "espalhar-golpe":[
  ...["armas-leves","armas-medias","armas-pesadas","maestria-manejo-duplo","pugilismo"].map(id=>
   ["p:armas_conjuracao:2","a:destreza:1","a:agilidade:1","s:golpe-fulminante","s:"+id])],
 "disparo-fulminante":[
  ...["armas-longo-alcance","maestria-arremesso-armas"].map(id=>
   ["p:armas_conjuracao:2","a:destreza:2","a:forca:1","s:"+id])],
 "disparo-multiplo":[
  ...["armas-longo-alcance","maestria-arremesso-armas"].map(id=>
   ["p:armas_conjuracao:2","a:destreza:2","a:agilidade:2","s:"+id,"s:disparo-fulminante"])],
 "disparo-violento":[
  ...["armas-longo-alcance","maestria-arremesso-armas"].flatMap(id=>[
   ["p:armas_conjuracao:2","a:destreza:2","a:forca:2","s:"+id],
   ["p:armas_conjuracao:2","a:destreza:2","a:forca:1","p:atletismo:1","s:"+id]])],
 "maestria-manejo-duplo":[
  ...["armas-leves","armas-medias","armas-pesadas","maestria-arremesso-armas","armas-fogo","armas-longo-alcance"].map(id=>
   ["a:forca:2","a:destreza:2","a:agilidade:1","s:disciplina-avancada","s:"+id])],
 "mestre":[
  ...["vento","sangue","agua","fogo","terra","veneno","sagrado","trevas"].map(id=>
   ["p:armas_conjuracao:3","a:inteligencia:3","a:destreza:3","s:criar-item-foco-magia","s:improviso","s:"+id])]
};
requirements.marciais=[["p:armas_conjuracao:1"]];
const pendingRules = new Set(["maestria-manejo-duplo"]);

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
  const pending=pendingRules.has(id)||!Number.isInteger(skill.cost);
  const left=xpLedger(system).left;
  const missing=alternatives.filter(branch=>branch.some(item=>!item.met)).map(branch=>branch.filter(item=>!item.met).map(item=>item.name).join(" + "));
  const blocker=pending?"Requisitos completos pendentes de decisão autoral.":!met?"Falta "+missing.join(" ou ")+".":left<skill.cost?"XP insuficiente.": "";
  return {...skill, alternatives, owned:Boolean(owned), canBuy:!owned&&!blocker, blocker};
}

export function gradeDetails(system,group,key){
  const meta=Object.hasOwn(developmentGroups,group)?developmentGroups[group]:null;
  const name=meta?.list.find(([id])=>id===key)?.[1];
  if(!name)throw Error("Fonte indisponível.");
  const grade=Number(system[meta.field]?.[key]??0);
  const scale=group==="attribute"&&!system.monsterRules&&!system.monsterHumanoidRules?XP_ATTRIBUTE:XP_TRAINING;
  const cost=grade<6?scale[grade+1]-scale[grade]:null;
  return {name, grade, cost, field:meta.field, canBuy:cost!==null&&xpLedger(system).left>=cost};
}

export function creationMissing(system){
  return {
    attr:!ATTRIBUTES.some(([key])=>(system.attributes?.[key]??0)>=1),
    training:![...KNOWLEDGES.map(([key])=>system.knowledges?.[key]),...PRACTICES.map(([key])=>system.practices?.[key])].some(value=>value>=1),
  };
}

function reserveStarter(system,creationPending){
  if(!creationPending)return;
  const missing=creationMissing(system);
  const reserve=(missing.attr?XP_ATTRIBUTE[1]:0)+(missing.training?XP_TRAINING[1]:0);
  if(reserve>xpLedger(system).left)throw Error("Reserve "+reserve+" XP para a formação mínima do Aprendiz.");
}

function checkDependents(previous,next){
  for(const id of next.skills??[]){
    if(!entries.has(id))continue;
    const before=skillDetails(previous,id).alternatives;
    const after=skillDetails(next,id).alternatives;
    if(before.some(branch=>branch.every(item=>item.met))&&!after.some(branch=>branch.every(item=>item.met))){
      throw Error("A alteração retiraria um requisito de "+entries.get(id).name+".");
    }
  }
}

export function advancementPlan(system,request,creationPending=false){
  if(request.kind==="grade"){
    const {group,key,delta}=request;
    if(![-1,1].includes(delta))throw Error("Alteração de Grau inválida.");
    if((system.monsterRules||system.animalRules)&&group!=="attribute")throw Error("Esta ficha só evolui Atributos.");
    const row=gradeDetails(system,group,key);
    const nextGrade=row.grade+delta;
    if(nextGrade<0||nextGrade>6)throw Error("Grau fora do limite.");
    if(delta>0&&!row.canBuy)throw Error("XP insuficiente.");
    const next={...system,[row.field]:{...system[row.field],[key]:nextGrade}};
    if(delta>0)reserveStarter(next,creationPending);
    else checkDependents(system,next);
    return {["system."+row.field+"."+key]:nextGrade};
  }
  if(system.monsterRules||system.animalRules)throw Error("Este tipo de ficha não usa formação humana.");
  if(request.kind==="skill"){
    const row=skillDetails(system,request.key);
    if(request.remove===true){
      if(!row.owned)throw Error("Perícia ainda não adquirida.");
      const skills=(system.skills??[]).filter(id=>id!==request.key&&!(request.key==="maestria-manejo-duplo"&&id==="manejo-duplo"));
      checkDependents(system,{...system,skills});
      return {"system.skills":skills};
    }
    if(!row.canBuy)throw Error(row.owned?"Perícia já adquirida.":row.blocker);
    const skills=[...(system.skills??[]),request.key];
    reserveStarter({...system,skills},creationPending);
    return {"system.skills":skills};
  }
  if(request.kind==="starter"){
    const plan=starterPurchasePlan(system,request.attribute,request.group,request.key);
    if(!plan.ok)throw Error(plan.error);
    return plan.changes;
  }
  throw Error("Operação de evolução inválida.");
}
