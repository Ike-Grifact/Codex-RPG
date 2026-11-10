/* Codex RPG v0.26: núcleo puro do protótipo. Não usa regras de Assimilação. */
export const ATTRIBUTES=[["forca","Força"],["agilidade","Agilidade"],["destreza","Destreza"],["inteligencia","Inteligência"],["influencia","Influência"],["vigor","Vigor"]];
export const KNOWLEDGES=[["protecao","Proteção"],["astronomia","Astronomia"],["medicina","Medicina"],["alquimia","Alquimia"],["engenharia","Engenharia"],["erudicao","Erudição"]];
export const PRACTICES=[["armas_conjuracao","Armas ou Conjuração"],["atletismo","Atletismo"],["furtividade","Furtividade"],["artesao","Artesão"],["apresentacao","Apresentação"],["coleta","Coleta"]];
export const SKILLS=[
{id:"armas1",name:"Armas 1",cost:2,detail:"Habilita categoria de arma, sem fonte adicional."},
{id:"aprendiz",name:"Aprendiz de Conjurador",cost:2,detail:"Habilita magia inicial com a Prática compartilhada."},
{id:"combinacao",name:"Combinação de Fontes",cost:2,detail:"Permite propor complemento pertinente, a validar."},
{id:"perito_conjurador",name:"Perito Conjurador",cost:2,detail:"Propõe complemento pertinente para conjuração."},
{id:"marciais",name:"Artes Marciais",cost:1,detail:"Especialização em Punhos, condições incompletas."},
{id:"combate",name:"Combate",cost:1,detail:"+1 Antecipar em combate pertinente."}];
export const ATTRIBUTE_DICE=[[4],[6],[6,6],[6,6,6],[6,6,10],[6,10,10],[10,10,10]];
export const TRAINING_DICE=[[6],[10],[10,10],[10,10,10],[10,10,12],[10,12,12],[12,12,12]];
export const FACES={
4:[[0,0,0],[0,0,0],[0,0,1],[0,1,1]],
6:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0]],
10:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1]],
12:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,2,1],[0,0,2]],
20:[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,1,0],[2,1,0],[2,1,1],[2,2,1],[2,2,1],[0,0,2],[2,2,0],[3,2,0],[4,2,0],[0,0,4],[4,2,0],[5,2,1],[6,2,1],[8,0,0]]
};
// O d12 é intencionalmente declarado separadamente para verificar as doze faces.
FACES[12]=[[0,0,0],[0,0,0],[0,0,1],[0,0,1],[0,1,1],[1,0,0],[2,0,0],[1,1,0],[1,1,1],[2,0,1],[1,2,1],[0,0,2]];
export const GROUPS={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES};
export const SITUATIONS={superior:{label:"Vantagem absoluta",e:1,a:0},advantage:{label:"Vantagem",e:0,a:1},neutral:{label:"Normal",e:0,a:0},disadvantage:{label:"Desvantagem",e:0,a:-1},inferior:{label:"Desvantagem absoluta",e:-1,a:0},luck:{label:"Ação de Sorte",e:-2,a:0}};
export function faceSymbols(sides,face){
 if(!FACES[sides]||!Number.isInteger(face)||face<1||face>sides)throw Error("Face incompatível.");
 return [...FACES[sides][face-1]];
}
export function sourceLabel(group,key,system){
 const item=(GROUPS[group]||[]).find(x=>x[0]===key);if(!item)return "";
 if(group!=="practice"||key!=="armas_conjuracao")return item[1];
 const skills=system?.skills||[];
 if(skills.includes("armas1")&&skills.includes("aprendiz"))return"Armas / Conjuração";
 if(skills.includes("aprendiz"))return"Conjuração";
 if(skills.includes("armas1"))return"Armas";
 return"Armas ou Conjuração";
}
export function sourceDice(group,key,system){
 if(!(GROUPS[group]||[]).some(x=>x[0]===key))throw Error("Fonte inválida.");
 const field={attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group];
 const g=Number(system?.[field]?.[key]||0);
 if(!Number.isInteger(g)||g<0||g>6)throw Error("Grau inválido.");
 return [...(group==="attribute"?ATTRIBUTE_DICE:TRAINING_DICE)[g]];
}
export const lifeMax=s=>3+Number(s.attributes.vigor||0)+Math.floor(Number(s.attributes.forca||0)/2);
export const naturalDE=s=>Number(s.attributes.agilidade||0)+Math.floor(Number(s.attributes.destreza||0)/2);
export const balance=s=>s.attributes.agilidade>s.attributes.vigor?"Leve":s.attributes.agilidade<s.attributes.vigor?"Pesado":"Médio";
export const maxPP=level=>level>=20?3:level>=10?2:level>=5?1:0;
export const keepLimit=(level,extra=false)=>Math.min(4,(level>=6?3:2)+(extra?1:0));
export const loadCapacity=s=>1+Math.floor(Number(s.attributes.forca||0)/3)+Math.floor(Number(s.attributes.vigor||0)/3)+Math.floor(Number(s.practices.armas_conjuracao||0)/3)+Math.floor(Number(s.practices.atletismo||0)/3); // Contribuição compartilhada: PENDENTE.
export function affinity(attack,target){return({leve:{leve:0,medio:1,pesado:-1},medio:{leve:1,medio:-1,pesado:0},pesado:{leve:-1,medio:0,pesado:1}})[attack]?.[target]??0;}
export function mayComplement(system,base,mode){
 const sk=system.skills||[];
 if(sk.includes("combinacao"))return true;
 return base?.group==="practice"&&base.key==="armas_conjuracao"&&mode==="conjuracao"&&sk.includes("perito_conjurador");
}
export function buildPool(system,selection,{mode="normal",contextApproved=false,step=false}={}){
 const errors=[],pool=[];
 const b=selection?.base,a=selection?.attribute,c=selection?.complement;
 if(!b||!["practice","knowledge"].includes(b.group)||!(GROUPS[b.group]||[]).some(x=>x[0]===b.key))errors.push("Comece por uma Prática ou Conhecimento.");
 if(!a||a.group!=="attribute"||!ATTRIBUTES.some(x=>x[0]===a.key))errors.push("A segunda fonte deve ser um Atributo.");
 if(c){
  if(!["practice","knowledge"].includes(c.group)||!(GROUPS[c.group]||[]).some(x=>x[0]===c.key))errors.push("Complemento deve ser Conhecimento ou Prática.");
  if(b&&b.group===c.group&&b.key===c.key)errors.push("Uma fonte não pode ser duplicada.");
  if(!mayComplement(system,b,mode))errors.push("Terceira fonte exige Perícia de combinação aplicável.");
  else if(!contextApproved)errors.push("Valide a pertinência do complemento com o Narrador.");
 }
 if(b?.group==="practice"&&b.key==="armas_conjuracao"){
  if(mode==="armas"&&!(system.skills||[]).includes("armas1"))errors.push("Armas requer habilitação Armas 1.");
  if(mode==="conjuracao"&&!(system.skills||[]).includes("aprendiz"))errors.push("Conjuração requer Aprendiz de Conjurador.");
  if(!["armas","conjuracao"].includes(mode))errors.push("Escolha Armas ou Conjuração como uso desta Prática.");
 }
 if(!errors.length){
  for(const src of [b,a,...(c?[c]:[])])for(const [i,sides] of sourceDice(src.group,src.key,system).entries())pool.push({id:src.group+"."+src.key+"."+i,group:src.group,key:src.key,sides});
  if(step){
   const d=pool.find(x=>x.group==="attribute"),next={4:6,6:10,10:12}[d?.sides];
   if(!next)errors.push("Elevação de passo indisponível.");
   else d.sides=next;
  }
 }
 if(pool.length>9)errors.push("A pilha ultrapassa nove dados.");
 if(pool.filter(x=>x.sides===20).length>2)errors.push("Não são permitidos mais de dois d20 regulares.");
 return{ok:!errors.length,errors,pool};
}
export function resolveRoll(rolled,selectedIds,options={}){
 const {de=1,level=1,extraKeep=false,step=false,courage=10,situation="neutral",weight=0,combatBonus=false,cancelP=0,convertPairs=0,skillBonusE=0}=options;
 const errors=[],selected=rolled.filter(d=>selectedIds.includes(d.id));
 if(selected.length!==new Set(selectedIds).size)errors.push("Seleção de dados inválida.");
 if(!selected.length||selected.length>keepLimit(level,extraKeep))errors.push("Limite de dados mantidos inválido.");
 if(!selected.some(d=>d.group==="attribute"))errors.push("É obrigatório manter dado de Atributo.");
 if(Number(extraKeep)+Number(step)>courage)errors.push("Coragem insuficiente.");
 const raw=[0,0,0];
 for(const d of selected){const v=faceSymbols(d.sides,d.face);v.forEach((n,i)=>raw[i]+=n);}
 const st=SITUATIONS[situation]||SITUATIONS.neutral;
 const a=Math.max(0,raw[1]+st.a+Number(weight)+(combatBonus?1:0));
 if(!Number.isInteger(cancelP)||cancelP<0||cancelP>Math.min(raw[2],a))errors.push("Gasto inválido para anular Pavor.");
 if(!Number.isInteger(convertPairs)||convertPairs<0||cancelP+2*convertPairs>a)errors.push("Antecipar insuficiente.");
 if(!Number.isInteger(skillBonusE)||skillBonusE<0||skillBonusE>2)errors.push("Teto cumulativo de bônus de Perícia: +2E.");
 const e=Math.max(0,raw[0]+st.e+convertPairs+skillBonusE),p=raw[2]-cancelP,reached=e+p,success=reached>=de;
 const outcome=success?(p===0?"Acerto puro":p>e?"Acerto com Pavor predominante":"Acerto normal com Pavor"):(p===0?"Falha limpa":p>e?"Falha com Pavor predominante":"Falha com Pavor");
 return{ok:!errors.length,errors,raw:{e:raw[0],a:raw[1],p:raw[2]},e,p,aRemaining:a-cancelP-2*convertPairs,reached,de,success,outcome,damage:success?e+Math.floor(p/2):0,selected};
}
