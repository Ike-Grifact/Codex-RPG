/* Codex RPG — motor matemático independente do Foundry. Estado: protótipo. */
export const ATTRIBUTES=[["forca","Força"],["agilidade","Agilidade"],["destreza","Destreza"],["inteligencia","Inteligência"],["influencia","Influência"],["vigor","Vigor"]];
export const KNOWLEDGES=[["protecao","Proteção"],["astronomia","Astronomia"],["medicina","Medicina"],["alquimia","Alquimia"],["engenharia","Engenharia"],["erudicao","Erudição"]];
export const PRACTICES=[["armas_conjuracao","Disciplina"],["atletismo","Atletismo"],["furtividade","Furtividade"],["artesao","Artesão"],["apresentacao","Apresentação"],["coleta","Coleta"]];
import {SKILLS} from "./skill-catalog.mjs";
export {SKILLS};
export const ATTRIBUTE_DICE=[[4],[6],[6,6],[6,6,6],[6,6,10],[6,10,10],[10,10,10]];
export const TRAINING_DICE=[[6],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
export const MONSTER_DICE=[[4],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
export const FACES={
4:[[1,0,0],[0,1,0],[0,0,1],[0,0,0]],
6:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0]],
10:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,1,0]],
12:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1],[1,2,1],[0,0,2]],
20:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,1,0],[2,1,0],[2,1,1],[2,2,1],[2,2,1],[0,0,2],[2,2,0],[3,2,0],[4,2,0],[0,0,4],[4,2,0],[5,2,1],[6,2,1],[8,0,0]]
};
export const GROUPS={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES};
export const SITUATIONS={
 superior:{label:"Vantagem Absoluta",e:1,a:0},
 advantage:{label:"Vantagem",e:0,a:1},
 neutral:{label:"Normal",e:0,a:0},
 disadvantage:{label:"Desvantagem",e:0,a:-1},
 inferior:{label:"Desvantagem Absoluta",e:-1,a:0},
 luck:{label:"Ação de Sorte",e:-2,a:0}
};
export const XP_ATTRIBUTE=[0,1,3,7,15,31,55];
export const XP_TRAINING=[0,2,8,20,38,66,102];
export const CREATION_REFERENCE={attributes:20,training:20,skills:20,total:20}; // EXPERIMENTAL: XP único compartilhado.
const legacyD4=[[0,0,0],[0,0,0],[0,0,1],[0,1,1]];
export function faceSymbols(sides,face,legacyD4Faces=false){
 if(!FACES[sides]||!Number.isInteger(face)||face<1||face>sides)throw Error("Face inválida.");
 return [...(sides===4&&legacyD4Faces?legacyD4:FACES[sides])[face-1]];
}
export function sourceLabel(group,key){
 return (GROUPS[group]||[]).find(x=>x[0]===key)?.[1]|| (group==="equipment"?"Equipamento":"");
}
export function sourceDice(group,key,system){
 if(!(GROUPS[group]||[]).some(x=>x[0]===key))throw Error("Fonte inválida.");
 const field={attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group];
 const grade=Number(system?.[field]?.[key]||0);
 if(!Number.isInteger(grade)||grade<0||grade>6)throw Error("Grau inválido.");
 return [...(group==="attribute"?(system?.monsterRules?MONSTER_DICE:ATTRIBUTE_DICE):TRAINING_DICE)[grade]];
}
export const lifeMax=s=>4+Number(s.attributes?.vigor||0)+Math.floor(Number(s.attributes?.forca||0)/2);
export function healthByLife(s,currentLife){
 const extra=lifeMax(s)-4;
 const bands=[1+Math.ceil(extra/2),1+Math.floor(extra/2),1,1];
 const life=Math.min(lifeMax(s),Math.max(0,Math.trunc(currentLife)||0));
 if(life===0)return {id:"morto",label:"Morto",e:0,a:0,p:0,coragem:0,bands};
 if(life===1)return {id:"inconsciente",label:"Inconsciente",e:-2,a:0,p:2,coragem:2,bands};
 if(life===2)return {id:"incapacitado",label:"Incapacitado",e:-1,a:0,p:1,coragem:1,bands};
 if(life<=2+bands[1])return {id:"ferido",label:"Ferido",e:0,a:-1,p:0,coragem:0,bands};
 return {id:"saudavel",label:"Saudável",e:0,a:0,p:0,coragem:0,bands};
}
export const naturalDE=s=>Math.min(9,Number(s.attributes?.agilidade||0)+Math.floor(Number(s.attributes?.destreza||0)/2)+Math.floor(Number(s.attributes?.vigor||0)/2)+Math.floor(Number(s.practices?.atletismo||0)/3));
export const balance=s=>Number(s.attributes?.agilidade||0)>Number(s.attributes?.vigor||0)?"Leve":Number(s.attributes?.agilidade||0)<Number(s.attributes?.vigor||0)?"Pesado":"Médio";
export const maxPP=level=>level>=20?3:level>=10?2:level>=5?1:0;
export const keepLimit=(level,extra=false,monster=false)=>monster?Math.min(Number(level)>=2?4:3,2+Math.max(0,Math.min(2,Number(extra)||0))):Math.min(4,(level>=6?3:2)+(extra?1:0));
export const narratorCap=players=>2+Math.max(0,Math.floor(Number(players)||0));
export const monsterCap=grade=>Math.min(8,Math.max(1,Math.min(6,Math.floor(Number(grade)||1)))+3);
export const loadCapacity=s=>1+Math.floor(Number(s.attributes?.forca||0)/3)+Math.floor(Number(s.attributes?.vigor||0)/3)+Math.floor(Number(s.practices?.armas_conjuracao||0)/3)+Math.floor(Number(s.practices?.atletismo||0)/3); // Fórmula da ficha vigente.
export const affinity=(attack,target)=>({leve:{leve:0,medio:1,pesado:-1},medio:{leve:1,medio:-1,pesado:0},pesado:{leve:-1,medio:0,pesado:1}})[attack]?.[target]??0;
const skillCosts=new Map(SKILLS.map(row=>[row.id,row.legacyCost??row.cost]));
export function xpLedger(s){
 const attr=ATTRIBUTES.reduce((n,[k])=>n+(s.monsterRules||s.monsterHumanoidRules?XP_TRAINING:XP_ATTRIBUTE)[Number(s.attributes?.[k]||0)],0);
 const knowledge=KNOWLEDGES.reduce((n,[k])=>n+XP_TRAINING[Number(s.knowledges?.[k]||0)],0);
 const practices=PRACTICES.reduce((n,[k])=>n+XP_TRAINING[Number(s.practices?.[k]||0)],0);
 const perks=(s.skills||[]).reduce((n,id)=>n+(skillCosts.get(id)??0),0);
 const spent=attr+knowledge+practices+perks,grant=Number(s.xp||0)+(s.monsterRules||s.animalRules||s.monsterHumanoidRules?0:CREATION_REFERENCE.total);
 return {attributes:attr,training:knowledge+practices,skills:perks,spent,grant,left:grant-spent,
  state:s.monsterRules||s.animalRules||s.monsterHumanoidRules?"Orçamento definido pelo Narrador.":"20 XP iniciais compartilhados EXPERIMENTAIS; sem reservas por categoria."};
}
export const isDiscipline = source => source?.group === "practice" && source.key === "armas_conjuracao";
export const attributesOnly = system => Boolean(system.monsterRules || system.animalRules);
export const disciplineNeedsAttribute = sources => sources.some(isDiscipline) && !sources.some(source=>source?.group==="attribute");

function validSource(source) {
 return source && Object.hasOwn(GROUPS,source.group) && GROUPS[source.group].some(([key])=>key===source.key);
}

export function sourcePairError(system,base,second){
 if(!validSource(base)||!validSource(second))return "Selecione duas fontes válidas.";
 if(attributesOnly(system)){
  if(base.group!=="attribute"||second.group!=="attribute"||base.key===second.key)return "Escolha dois Atributos diferentes.";
 }else if(base.group===second.group)return "As duas primeiras fontes devem ser de categorias diferentes.";
 if(disciplineNeedsAttribute([base,second]))return "Disciplina deve ser combinada com um Atributo.";
 return "";
}

export function canRepeatDiscipline(system,base,second){
 const skills=system.skills||[];
 return !attributesOnly(system) && [base,second].some(isDiscipline)
  && (skills.includes("maestria-manejo-duplo") || skills.includes("manejo-duplo"));
}

export function mayComplement(system,base,second){
 if(attributesOnly(system))return false;
 const skills=system.skills||[];
 return skills.includes("disciplina-avancada") || skills.includes("combinacao")
  || (skills.includes("furtividade-avancada") && [base,second].some(source=>source?.group==="practice"&&source.key==="furtividade"));
}

export function buildPool(system,selection,{mode="normal",contextApproved=false,step=false,stepDieId="",equipmentDie=0}={}){
 const errors=[],pool=[],b=selection?.base,a=selection?.second??selection?.attribute,c=selection?.complement;
 const pairError=sourcePairError(system,b,a);
 if(pairError)errors.push(pairError);
 const sources=[b,a,c].filter(Boolean);
 if(c){
  const duplicate=[b,a].some(source=>source?.group===c.group&&source.key===c.key);
  const repeatedDiscipline=duplicate&&isDiscipline(c);
  if(!validSource(c)||attributesOnly(system))errors.push("Complemento inválido para esta ficha.");
  else if(!pairError&&disciplineNeedsAttribute(sources))errors.push("Disciplina deve ser combinada com um Atributo.");
  else if(repeatedDiscipline&&(!canRepeatDiscipline(system,b,a)||mode!=="armas"))errors.push("Repetir Disciplina exige Manejo Duplo e o modo Armas.");
  else if(duplicate&&!repeatedDiscipline)errors.push("O complemento deve ser uma fonte diferente.");
  else if(!repeatedDiscipline&&!mayComplement(system,b,a))errors.push("O complemento exige uma Perícia que o habilite.");
  else if(!repeatedDiscipline&&!contextApproved)errors.push("Confirme pertinência do complemento.");
 }
 if(sources.some(isDiscipline)){
  const skills=system.skills||[];
  const armed=["armas-leves","armas-medias","armas-pesadas","armas-longo-alcance","armas-fogo","pugilismo","arremesso","maestria-arremesso-armas","manejo-duplo","maestria-manejo-duplo"];
  if(mode==="armas"&&!armed.some(id=>skills.includes(id)))errors.push("Disciplina armada exige Perícia correspondente.");
  if(mode==="conjuracao"&&!skills.includes("criar-item-foco-magia"))errors.push("Conjuração exige Criar Item de Foco e Magia.");
  if(mode!=="armas"&&mode!=="conjuracao")errors.push("Escolha Armas ou Conjuração.");
 }
 if(!errors.length){
  const occurrences=new Map();
  for(const src of sources){
   const sourceId=src.group+"."+src.key;
   const occurrence=occurrences.get(sourceId)??0;
   occurrences.set(sourceId,occurrence+1);
   for(const [i,sides] of sourceDice(src.group,src.key,system).entries()){
    const id=sourceId+"."+i+(occurrence?"."+occurrence:"");
    pool.push({id,group:src.group,key:src.key,sides});
   }
  }
  if(equipmentDie){
   if(![6,10,12].includes(Number(equipmentDie)))errors.push("Dado de equipamento inválido.");
   else pool.push({id:"equipment.0",group:"equipment",key:"equipment",sides:Number(equipmentDie)});
  }
  if(step){
   // Elevação do SRD 0-Z.2: selecionar um dado específico da pilha.
   const d=pool.find(x=>x.id===stepDieId),next={4:6,6:10,10:12}[d?.sides];
   if(!next)errors.push("Escolha um dado da pilha d4, d6 ou d10 para elevar.");
   else d.sides=next;
  }
 }
 if(pool.length>9)errors.push("Máximo absoluto de nove dados rolados.");
 if(pool.filter(x=>x.sides===20).length>2)errors.push("Máximo regular de dois d20.");
 return {ok:errors.length===0,errors,pool};
}
// Comparador determinístico das faces já roladas. Não rerrola dados nem
// consome recursos: apenas apresenta alternativas legais de manutenção.
// Compra inicial orientada: os únicos gastos obrigatórios são Atributo G1
// e Conhecimento OU Prática G1. O saldo continua livre, sem reservas por categoria.
export function starterPurchasePlan(system,attributeId,trainingGroup,trainingKey){
 if(system?.monsterRules||system?.animalRules)return{ok:false,error:"Esta criatura não usa a compra inicial humana."};
 const attributes=system?.attributes||{},knowledge=system?.knowledges||{},practice=system?.practices||{};
 if(!ATTRIBUTES.some(([id])=>id===attributeId))return{ok:false,error:"Escolha um Atributo válido."};
 const group=trainingGroup==="knowledge"?KNOWLEDGES:trainingGroup==="practice"?PRACTICES:[];
 if(!group.some(([id])=>id===trainingKey))return{ok:false,error:"Escolha um Conhecimento ou Prática válido."};
 const hasAttribute=ATTRIBUTES.some(([id])=>Number(attributes[id]||0)>=1);
 const hasTraining=[...KNOWLEDGES.map(([id])=>knowledge[id]),...PRACTICES.map(([id])=>practice[id])]
   .some(grade=>Number(grade||0)>=1);
 const changes={};
 if(!hasAttribute)changes["system.attributes."+attributeId]=1;
 if(!hasTraining)changes["system."+(trainingGroup==="knowledge"?"knowledges":"practices")+"."+trainingKey]=1;
 const cost=(hasAttribute?0:XP_ATTRIBUTE[1])+(hasTraining?0:XP_TRAINING[1]);
 const ledger=xpLedger(system);
 return {ok:ledger.left>=cost,changes,cost,available:ledger.left,remaining:ledger.left-cost,
  complete:hasAttribute&&hasTraining,error:ledger.left<cost?"XP disponível insuficiente para concluir as compras mínimas.":""};
}
export function compareKeptOptions(rolled,options={},limit=5){
 if(!Array.isArray(rolled)||!rolled.length||rolled.length>9)return [];
 const maximum=options.animal?2:keepLimit(options.monster?options.threatGrade:options.level,options.extraKeep,!!options.monster);
 const results=[];
 function visit(start,ids){
  if(ids.length){
   const bonusP=options.noisy?(ids.length>=2&&
    rolled.filter(d=>ids.includes(d.id)).every(d=>d.face===d.sides)?2:1):Number(options.bonusP||0);
   const r=resolveRoll(rolled,ids,{...options,bonusP,cancelP:0,convertPairs:0});
   if(r.ok)results.push({ids:[...ids],dice:r.selected.map(d=>"d"+d.sides+": "+d.face),
    e:r.e,p:r.p,a:r.aRemaining,reached:r.reached,damage:r.damage,
    success:r.success,outcome:r.outcome,critical:r.critical,
    clean:r.success&&r.p===0});
  }
  if(ids.length>=maximum)return;
  for(let i=start;i<rolled.length;i++)visit(i+1,[...ids,rolled[i].id]);
 }
 visit(0,[]);
 return results.sort((a,b)=>Number(b.success)-Number(a.success)||
  Number(b.clean)-Number(a.clean)||b.reached-a.reached||a.p-b.p||b.damage-a.damage)
 .slice(0,Math.max(1,Math.min(12,Math.floor(Number(limit)||5))));
}
export function resolveRoll(rolled,selectedIds,options={}){
 const {de=1,level=1,extraKeep=false,step=false,courage=10,situation="neutral",
  weight=0,cancelP=0,convertPairs=0,skillBonusE=0,monster=false,hostile=false,animal=false,threatGrade=1,bonusA=0,bonusP=0,health=null,legacyD4Faces=false}=options;
 const errors=[],kept=rolled.filter(d=>selectedIds.includes(d.id));
 if(kept.length!==new Set(selectedIds).size)errors.push("Dados mantidos não encontrados.");
 const maxKeep=animal?2:keepLimit(monster?threatGrade:level,extraKeep,monster);
 if(kept.length<1||kept.length>maxKeep)errors.push("Retenção fora do limite.");

 const extraKept=Math.max(0,kept.length-(animal?2:keepLimit(monster?threatGrade:level,0,monster)));
  if(extraKept+Number(step)>(monster?99:courage))errors.push("Coragem insuficiente.");
 const raw=[0,0,0];for(const d of kept)faceSymbols(d.sides,d.face,legacyD4Faces).forEach((v,i)=>raw[i]+=v);
 const crit=kept.length>=2&&kept.every(d=>d.face===d.sides);
 let convertedCrit=0,extraCritE=0,extraCritA=0;
 if(crit){convertedCrit=raw[2]>0?1:0;extraCritE=kept.length>=3?1:0;extraCritA=kept.length>=3?1:0;}
 const st=SITUATIONS[situation]||SITUATIONS.neutral;
 const a=Math.max(0,raw[1]+extraCritA+st.a+Number(weight)+Number(bonusA)+(health?.a??0));
 const pBefore=Math.max(0,raw[2]-convertedCrit+Number(bonusP)+(health?.p??0));
 if(!Number.isInteger(cancelP)||cancelP<0||cancelP>Math.min(pBefore,a))errors.push("Anulação de Pavor inválida.");
 if(!Number.isInteger(convertPairs)||convertPairs<0||cancelP+2*convertPairs>a)errors.push("Conversão 2A → 1E inválida.");
 const e=Math.max(0,raw[0]+convertedCrit+extraCritE+st.e+convertPairs+Number(skillBonusE)+(health?.e??0)),p=Math.max(0,pBefore-cancelP),reached=e+p,success=reached>=de;
 const outcome=success?(p===0?"Acerto sem Pavor":p>e?"Acerto com Pavor":"Acerto neutro (com Pavor mantido)"):(p>0?"Falha com Pavor":e>0?"Falha com Êxito":"Falha");
 const rawDamage=e+Math.floor(p/2),damage=success?rawDamage*(crit&&kept.length===4?2:1):0;
 const critical=crit?kept.length:0,refund=crit?(kept.length>=3?2:1):0;
 return{ok:errors.length===0,errors,raw:{e:raw[0],a:raw[1],p:raw[2]},e,p,aRemaining:a-cancelP-2*convertPairs,
  reached,de,success,outcome,damage,critical,criticalRefundCourage:monster||hostile?0:refund,
  criticalRefundPP:monster||hostile?0:refund,monsterCriticalPavor:!animal&&(monster||hostile)?2*refund:0,
  freeCharacteristics:success&&crit?1:0,selected:kept};
}
