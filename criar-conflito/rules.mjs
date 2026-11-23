/* Criar Conflito — cálculos independentes da interface; SRD v0.44. */
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,XP_ATTRIBUTE,XP_TRAINING,SKILLS as BASE_SKILLS,
 sourceDice,lifeMax,naturalDE,keepLimit,monsterCap,narratorCap,loadCapacity,maxCourage}
 from "./codex-rules.mjs?v=20261122-fulminantes-v1";
// Sincronização pontual com os dois IDs de custo definido na Ficha do jogador.
// Perícias com custo XP pendente não são habilitadas nem ganham custo inventado.
const PLAYER_DNA_EXTRA_SKILLS=[
 {id:"maestria-armas-fogo",name:"Maestria em Armas de Fogo (Humano)",detail:"Benefício gratuito exclusivo do Humano. Só ativa seus efeitos com a Perícia em Armas de Fogo habilitada.",cost:0},
 {id:"combate",name:"Combate",detail:"+1A em combate pertinente.",cost:1},
 {id:"armas",name:"Armas 1",detail:"Habilita uma categoria de arma, inclusive Punhos.",cost:2},
 {id:"domar-criatura-pequena",name:"Domar Criatura Pequena",detail:"1 XP; Influência 2 + Inteligência 1; Apresentação não é requisito de compra. Compra não é domesticação automática.",cost:1},
 {id:"domar-criatura-media",name:"Domar Criatura Média",detail:"1 XP; Influência 3 + Apresentação 1 + Inteligência 1 + Domar Criatura Pequena.",cost:1},
 {id:"domar-criatura-grande",name:"Domar Criatura Grande",detail:"1 XP; Influência 4 + Apresentação 2 + Inteligência 1 + Domar Criatura Pequena + Domar Criatura Média.",cost:1},
 {id:"olhos-de-aguia",name:"Olhos de Águia",detail:"1 XP. Destreza 3 + Disciplina 3 + (Armas de Longo Alcance OU Armas de Fogo). Aumenta em 8 m o alcance efetivo das armas à distância e de fogo habilitadas, sem custo adicional.",cost:1},
 {id:"concentracao-refinada",name:"Concentração Refinada",detail:"1 XP; Disciplina 2. Ao guardar 1 Antecipar em rolagem com Disciplina para a próxima rolagem, o símbolo vira 1 Êxito e você recebe Vantagem. Não pode usar a Perícia com inimigo a até 8 metros; 1E e Vantagem expiram ao usar, realizar outra ação ou completar descanso longo.",cost:1},
 {id:"invocacao-elemental",name:"Invocação Elemental",detail:"1 XP; Criar Item de Foco e Magia (habilita Psique) e Domar Pequena. Demais elementos exigem Perícia específica. Invocação: 1 Coragem; XP do invocador; porte por Domar. Dados de Atributo por porte: Pequena 1, Média 2, Grande 3; um dado por parte, até 3 mantidos na Grande. Jogador escolhe os dados e quais manter. Pode agir sozinho ou ajudar UM único personagem (conjurador ou aliado) em ação conjunta, passando a ele todos os dados mantidos, até três na Grande. Não dividir entre vários beneficiários. Uma ficha e um turno antecipável, sem duplicar dados ou ações.",cost:1}
];
export function canBuyDomarMedium(t){
 return Number(t?.attributes?.influencia||0)>=3
  &&Number(t?.attributes?.inteligencia||0)>=1
  &&Number(t?.practices?.apresentacao||0)>=1
  &&Array.isArray(t?.skills)&&t.skills.includes("domar-criatura-pequena");
}
export function canBuyDomarGrande(t){
 return Number(t?.attributes?.influencia||0)>=4
  &&Number(t?.attributes?.inteligencia||0)>=1
  &&Number(t?.practices?.apresentacao||0)>=2
  &&Array.isArray(t?.skills)
  &&t.skills.includes("domar-criatura-pequena")
  &&t.skills.includes("domar-criatura-media");
}
export const SKILLS=[...BASE_SKILLS,...PLAYER_DNA_EXTRA_SKILLS];
export {ATTRIBUTES,KNOWLEDGES,PRACTICES,sourceDice,narratorCap,maxCourage};
// Os três tipos oferecidos ao criar novas ameaças. "criatura" é apenas legado de fichas antigas.
export const KINDS={humanoide:"Humanoide",monstro:"Criatura/Monstro","humanoide-monstro":"Humanoide Monstro"};
export const LEGACY_KINDS={criatura:"Criatura comum (ficha antiga)"};
export const isHumanoidKind=kind=>kind==="humanoide"||kind==="humanoide-monstro";
export const monsterAttributeCost=kind=>kind==="monstro"||kind==="humanoide-monstro";
// As tabelas de Aprendizes da ficha atual são aplicadas somente a humanoides comuns.
// As escalas extraordinárias de monstros não são alteradas nesta sincronização.
const PLAYER_ATTRIBUTE_XP=[0,1,3,6,9,18,32];
const PLAYER_TRAINING_XP=[0,2,4,8,16,32,64];
const PLAYER_ATTRIBUTE_DISCOUNT=[0,0,2,4,7,12,24];
const PLAYER_ATTRIBUTE_ELEVATED=[0,2,4,8,16,32,64];
const PLAYER_TRAINING_ELEVATED=[0,3,6,12,24,48,96];
const PURE_ELEMENT_IDS=["fogo","agua","vento","terra","sagrado"];
const RUNE_ELEMENT_IDS=["vento","agua","terra","fogo"];
export function humanoidRacialGrants(t){
 if(t.kind!=="humanoide")return [];
 if(t.race==="humano")return ["maestria-armas-fogo"];
 if(t.race==="lucker_sangue")return ["sangue"];
 if(t.race==="lucker_puro")return ["criar-item-foco-magia",
  ...(PURE_ELEMENT_IDS.includes(t.pureElement)?[t.pureElement]:[])];
 if(t.race==="runa_espinhos")return ["pugilismo","criar-item-foco-magia","escudo-arcano",
  ...(RUNE_ELEMENT_IDS.includes(t.runeElements?.[0])?[t.runeElements[0]]:[])];
 return [];
}
export function humanoidSourceCost(t,group,key){
 const attr=group==="attr",normal=attr?PLAYER_ATTRIBUTE_XP:PLAYER_TRAINING_XP;
 if(t.kind!=="humanoide")return attr?(monsterAttributeCost(t.kind)?XP_TRAINING:XP_ATTRIBUTE):XP_TRAINING;
 if(t.race==="lucker_sangue"){
  if(attr&&["vigor","agilidade"].includes(key))return PLAYER_ATTRIBUTE_DISCOUNT;
  if(attr&&key==="influencia"||group==="practice"&&key==="apresentacao")
   return attr?PLAYER_ATTRIBUTE_ELEVATED:PLAYER_TRAINING_ELEVATED;
 }
 if(t.race==="lucker_puro"){
  if(attr&&["inteligencia","destreza"].includes(key))return PLAYER_ATTRIBUTE_DISCOUNT;
  if(attr&&key==="forca"||group==="practice"&&key==="atletismo")
   return attr?PLAYER_ATTRIBUTE_ELEVATED:PLAYER_TRAINING_ELEVATED;
 }
 if(t.race==="runa_espinhos"&&attr){
  if(["vigor","forca"].includes(key))return PLAYER_ATTRIBUTE_DISCOUNT;
  if(["agilidade","destreza"].includes(key))return PLAYER_ATTRIBUTE_ELEVATED;
 }
 return normal;
}
// Decisão autoral posterior à v0.44: ameaças G2+ podem reter até 4 dados.
// O custo adicional continua conforme a economia do tipo, sem retenção gratuita implícita.
export const enemyKeepCap=grade=>Number(grade)>=2?4:3;
export const enemyHumanoidFreeKeep=grade=>Number(grade)>=2?3:2;
// Equivalência autoral conhecida: G2 ameaça ≈ nível 5 de jogador. Outros Graus pendentes.
export const threatPlayerEquivalentLevel=grade=>Number(grade)===2?5:null;
export const WEIGHT={leve:.125,medio:.5,pesado:1,"muito-leve":.0125,"muito-pesado":2};
export const ARMOR_DE=Object.freeze({"muito-leve":2,leve:1,medio:0,pesado:-1,"muito-pesado":-2});
const ARMOR_NAMES=Object.freeze({"Roupas Simples":"muito-leve","Armadura Leve":"leve","Armadura Média":"medio","Armadura Pesada":"pesado"});
export function itemCategory(it={}){
 const raw=String(it.category|| (typeof it.weight==="string"?it.weight:"")||"").toLowerCase().replaceAll("_","-");
 const category=({alto:"pesado",extremo:"muito-pesado","muito-leve":"muito-leve",leve:"leve",medio:"medio",pesado:"pesado","muito-pesado":"muito-pesado"})[raw];
 return category||ARMOR_NAMES[it.name]||"";
}
export function canEquipArmor(t,it){
 if(!it||it.kind!=="armor")return true;
 if(t.race==="runa_espinhos")return false;
 const minLevel=Number(it.grade)>=4?20:Number(it.grade)>=3?10:Number(it.grade)>=2?5:1;
 if(Number(t.level||1)<minLevel)return false;
 if(itemCategory(it)==="muito-pesado"&&
   (Number(t.attributes?.vigor||0)<6||Number(t.practices?.atletismo||0)<6))return false;
 return true;
}
export function equippedArmor(t){
 return (t.items||[]).find(it=>it.kind==="armor"&&it.equipped&&canEquipArmor(t,it))||null;
}
export function armorDeModifier(t){
 const armor=equippedArmor(t);
 return armor?(ARMOR_DE[itemCategory(armor)]??0):0;
}
export const uid=()=>globalThis.crypto?.randomUUID?.()||"cr-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
export const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number.isFinite(Number(n))?Number(n):min));
export function blank(kind="monstro"){
 const humanoid=isHumanoidKind(kind),monster=kind==="monstro";
 return {id:uid(),kind,name:kind==="humanoide-monstro"?"Novo humanoide monstro":humanoid?"Novo humanoide":monster?"Novo monstro":"Nova criatura",
 concept:"",notes:"",race:"",pureElement:"",runeElements:["",""],leader:false,threatGrade:1,level:1,
 xp:0,attributes:Object.fromEntries(ATTRIBUTES.map(([k])=>[k,0])),
 knowledges:Object.fromEntries(KNOWLEDGES.map(([k])=>[k,0])),
 practices:Object.fromEntries(PRACTICES.map(([k])=>[k,0])),
 skills:[],life:4,pavorLocal:4,keep:2,courage:0,abilities:"",items:[]};
}
/* Criação rápida de NPC: mínimo humano aprovado (1 XP atributo + 2 XP prática).
   Sem habilidades, itens ou XP adicionais gratuitos. */
export function quickHumanoid(){
 const t=blank("humanoide");
 t.name="Humano comum";
 t.concept="Oponente humanoide";
 t.attributes.forca=1;
 t.practices.armas_conjuracao=1;
 t.life=stats(t).life;
 return t;
}
export function toSystem(t){
 return {...t,monsterRules:t.kind==="monstro",
  attributes:{...t.attributes},knowledges:{...t.knowledges},practices:{...t.practices},
  skills:[...t.skills],level:clamp(t.level,1,20),threatGrade:clamp(t.threatGrade,1,6)};
}
export function ledger(t){
 const s=toSystem(t),monster=monsterAttributeCost(t.kind),humanoid=isHumanoidKind(t.kind);
 const attrs=ATTRIBUTES.reduce((n,[k])=>n+
  (t.kind==="humanoide"?humanoidSourceCost(t,"attr",k):(monster?XP_TRAINING:XP_ATTRIBUTE))[clamp(s.attributes[k],0,6)],0);
 const training=humanoid?[...KNOWLEDGES.map(x=>["knowledges","know",x[0]]),
  ...PRACTICES.map(x=>["practices","practice",x[0]])]
  .reduce((n,[field,group,key])=>n+
   (t.kind==="humanoide"?humanoidSourceCost(t,group,key):XP_TRAINING)[clamp(s[field][key],0,6)],0):0;
 const free=new Set(humanoidRacialGrants(t));
 const skills=humanoid?s.skills.reduce((n,id)=>n+(free.has(id)?0:Number(SKILLS.find(x=>x.id===id)?.cost||0)),0):0;
 const spent=attrs+training+skills,grant=clamp(t.xp,0,50000)+(t.kind==="humanoide"?15:0);
 return {attrs,training,skills,spent,grant,remaining:grant-spent};
}
export function dice(t,key){return sourceDice("attribute",key,toSystem(t));}
export function stats(t){
 const s=toSystem(t),monster=t.kind==="monstro",human=isHumanoidKind(t.kind),grade=clamp(t.threatGrade,1,6);
 const life=lifeMax(s),baseDE=monster?Math.min(9,Number(s.attributes.agilidade||0)+Math.floor(Number(s.attributes.destreza||0)/2)):naturalDE(s);
 const armorDE=human?armorDeModifier(t):0;
 const shieldDE=human&&t.skills?.includes("maestria-escudos")&&t.items?.some(it=>it.kind==="shield"&&it.equipped)?1:0;
 const defense=human?Math.min(12,Math.max(0,baseDE+armorDE+shieldDE)):baseDE;
 const naturalKeep=human?enemyHumanoidFreeKeep(grade):2;
 const maxKeep=human?Math.min(4,naturalKeep+1):enemyKeepCap(grade);
 return {life,de:defense,baseDE,armorDE,shieldDE,playerEquivalentLevel:threatPlayerEquivalentLevel(grade),limitLocal:monsterCap(grade),keepBase:naturalKeep,keepMax:maxKeep,
  keepCostP:Math.max(0,Number(t.keep||2)-naturalKeep),
  xp:ledger(t),capacity:t.kind==="humanoide"?
   1+Math.floor((Number(s.attributes.forca||0)+Number(s.attributes.vigor||0)+Number(s.practices.atletismo||0))/3):
   loadCapacity(s),used:weightUsed(t)};
}
export function weightUsed(t){return(t.items||[]).reduce((n,it)=>n+Number(it.weight||0)*Math.max(1,Number(it.qty||1)),0);}
export function afterItem(t,item){const x=Number(item.weight)||0,qty=Math.max(1,Number(item.qty||1));return weightUsed(t)+x*qty;}
export function remainingKinds(t){
 const free=Math.max(0,loadCapacity(toSystem(t))-weightUsed(t));
 return {leve:Math.floor((free+1e-9)/WEIGHT.leve),medio:Math.floor((free+1e-9)/WEIGHT.medio),pesado:Math.floor((free+1e-9)/WEIGHT.pesado)};
}
/** Atualização de Integridade G1 de 22/11: preserva dano já sofrido e idempotência. */
export function migrateArmorIntegrity(it){
 if(!it||typeof it!=="object")return it;
 const kind=it.kind||({armadura:"armor"})[it.type];
 if(kind!=="armor"||Number(it.grade??1)!==1)return it;
 const newValues={"Roupas Simples":[2,[0,3]],"Armadura Leve":[5,[7,10]],"Armadura Média":[8,[12,15]],"Armadura Pesada":[12,[17,20]]};
 const spec=newValues[it.catalogId||it.name]||newValues[it.name];
 if(!spec)return it;
 const oldMax=Number(it.integrityMax??it.max??(typeof it.integrity==="object"?it.integrity.max:undefined)??0);
 if(!spec[1].includes(oldMax))return it;
 const had=Number(it.integrity?.value??(typeof it.integrity==="number"?it.integrity:it.hp??oldMax));
 const current=Math.min(spec[0],Math.max(0,spec[0]-Math.max(0,oldMax-had)));
 if(typeof it.integrity==="object")return {...it,integrity:{...it.integrity,max:spec[0],value:current},integrityMax:spec[0],max:spec[0],hp:current};
 return {...it,integrityMax:spec[0],integrity:current,max:spec[0],hp:current};
}
export function normalize(raw){
 if(!raw||typeof raw!=="object")return blank("monstro");
 const kind=Object.hasOwn(KINDS,raw.kind)||Object.hasOwn(LEGACY_KINDS,raw.kind)?raw.kind:"monstro",t=blank(kind);
 for(const k of ["name","concept","notes","abilities"])t[k]=String(raw[k]||"").slice(0,k==="notes"||k==="abilities"?4000:160);
 t.race=String(raw.race||"").slice(0,80);
 t.pureElement=PURE_ELEMENT_IDS.includes(raw.pureElement)?raw.pureElement:"";
 t.runeElements=Array.isArray(raw.runeElements)?
  [RUNE_ELEMENT_IDS.includes(raw.runeElements[0])?raw.runeElements[0]:"",
   RUNE_ELEMENT_IDS.includes(raw.runeElements[1])?raw.runeElements[1]:""]:["",""];
 t.leader=!!raw.leader;
 for(const k of ["level","threatGrade","xp","life","pavorLocal","keep","courage"]){
  const [min,max]=k==="level"?[1,20]:k==="threatGrade"?[1,6]:k==="keep"?[2,4]:k==="courage"?[0,maxCourage(raw.level??t.level)]:k==="xp"?[0,50000]:[0,999];
  t[k]=Math.floor(clamp(raw[k]??t[k],min,max));
 }
 t.courage=0; // Nenhum inimigo, inclusive humanoide, possui Coragem.
 for(const [group,defs] of [["attributes",ATTRIBUTES],["knowledges",KNOWLEDGES],["practices",PRACTICES]])
  for(const [key] of defs)t[group][key]=Math.floor(clamp(raw[group]?.[key],0,6));
 t.skills=[...new Set([...(Array.isArray(raw.skills)?raw.skills.filter(id=>SKILLS.some(s=>s.id===id)):[]),
  ...humanoidRacialGrants(t).filter(id=>SKILLS.some(s=>s.id===id))])];
 t.items=Array.isArray(raw.items)?raw.items.slice(0,70).map(original=>{
  const i=migrateArmorIntegrity(original);
  const max=Math.floor(clamp(i.integrityMax??i.max??0,0,999));
  const kind=["armor","shield","weapon","other"].includes(i.kind)?i.kind:
   ({armadura:"armor",escudo:"shield",arma:"weapon"})[i.type]||"other";
  const category=itemCategory(i);
  const weight=typeof i.weight==="number"?clamp(i.weight,0,100):
   (WEIGHT[category]??0);
  return {id:String(i.id||uid()).slice(0,100),name:String(i.name||"Item").slice(0,90),
   weight,qty:Math.floor(clamp(i.qty,1,99)),kind,category,
   grade:Math.floor(clamp(i.grade??1,1,4)),
   integrityMax:max,integrity:Math.floor(clamp(i.integrity??i.hp??max,0,max)),
   equipped:!!i.equipped};
 }):[];
 t.id=String(raw.id||uid()).slice(0,110);
 const st=stats(t);t.pavorLocal=Math.min(t.pavorLocal,st.limitLocal);
 t.keep=Math.min(t.keep,st.keepMax);
 return t;
}

export const COMPANION_TYPES=Object.freeze(["pequena","media","grande"]);
/** Registro de XP efetivo das criaturas presentes, sem presumir XP de criatura sem ficha. */
export function normalizeCompanions(value={},players=0){
 const limit=Math.floor(clamp(players,0,30));
 return Object.fromEntries(COMPANION_TYPES.map(type=>{
  const record=value&&typeof value==="object"?value[type]:null;
  const count=Math.floor(clamp(record?.count??0,0,limit));
  const raw=record?.xpTotal,n=Number(raw);
  const xpTotal=raw===undefined||raw===null||raw===""||!Number.isSafeInteger(n)||n<=0?null:Math.floor(clamp(n,1,999999));
  return [type,{count,xpTotal}];
 }));
}
export function companionEncounterXP(value={},players=0){
 const normalized=normalizeCompanions(value,players);
 const entries=Object.entries(normalized);
 return {normalized,
  count:entries.reduce((s,[,v])=>s+v.count,0),
  xp:entries.reduce((s,[,v])=>s+(v.count&&v.xpTotal!==null?v.xpTotal:0),0),
  missing:entries.filter(([,v])=>v.count>0&&v.xpTotal===null).map(([t])=>t)};
}
export function encounterSummary(roster,players){
 const units=roster.map(normalize),publicCap=narratorCap(players);
 return {totalXP:units.reduce((n,u)=>n+ledger(u).spent,0),
  leaders:units.filter(u=>u.leader).length,publicCap,
  count:units.length,overbudget:units.filter(u=>ledger(u).remaining<0).length};
}