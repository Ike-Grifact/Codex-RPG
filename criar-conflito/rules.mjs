/* Criar Conflito — cálculos independentes da interface; SRD v0.39. */
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,XP_ATTRIBUTE,XP_TRAINING,SKILLS,
 sourceDice,lifeMax,naturalDE,keepLimit,monsterCap,narratorCap,loadCapacity}
 from "../foundry-prototype/module/rules.mjs";
export {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,sourceDice,narratorCap};
export const KINDS={criatura:"Criatura comum / animal",monstro:"Monstro extraordinário",humanoide:"Monstro humanoide"};
export const WEIGHT={leve:.125,medio:.5,pesado:1,"muito-leve":.0125,"muito-pesado":2};
export const uid=()=>globalThis.crypto?.randomUUID?.()||"cr-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,8);
export const clamp=(n,min,max)=>Math.min(max,Math.max(min,Number.isFinite(Number(n))?Number(n):min));
export function blank(kind="monstro"){
 const humanoid=kind==="humanoide",monster=kind==="monstro";
 return {id:uid(),kind,name:humanoid?"Novo humanoide":monster?"Novo monstro":"Nova criatura",
 concept:"",notes:"",leader:false,threatGrade:1,level:1,
 xp:0,attributes:Object.fromEntries(ATTRIBUTES.map(([k])=>[k,0])),
 knowledges:Object.fromEntries(KNOWLEDGES.map(([k])=>[k,0])),
 practices:Object.fromEntries(PRACTICES.map(([k])=>[k,0])),
 skills:[],life:3,pavorLocal:0,keep:2,abilities:"",items:[]};
}
/* Criação rápida de NPC: mínimo humano aprovado (1 XP atributo + 2 XP prática).
   Sem habilidades, itens ou XP adicionais gratuitos. */
export function quickHumanoid(){
 const t=blank("humanoide");
 t.name="Humano comum";
 t.concept="Oponente humanoide";
 t.attributes.forca=1;
 t.practices.disciplina=1;
 t.life=stats(t).life;
 return t;
}
export function toSystem(t){
 return {...t,monsterRules:t.kind==="monstro",
  attributes:{...t.attributes},knowledges:{...t.knowledges},practices:{...t.practices},
  skills:[...t.skills],level:clamp(t.level,1,20),threatGrade:clamp(t.threatGrade,1,6)};
}
export function ledger(t){
 const s=toSystem(t),monster=t.kind==="monstro",humanoid=t.kind==="humanoide";
 const attrs=ATTRIBUTES.reduce((n,[k])=>n+(monster?XP_TRAINING:XP_ATTRIBUTE)[clamp(s.attributes[k],0,6)],0);
 const training=humanoid?[...KNOWLEDGES.map(x=>["knowledges",x[0]]),...PRACTICES.map(x=>["practices",x[0]])]
  .reduce((n,[group,key])=>n+XP_TRAINING[clamp(s[group][key],0,6)],0):0;
 const skills=humanoid?s.skills.reduce((n,id)=>n+Number(SKILLS.find(x=>x.id===id)?.cost||0),0):0;
 const spent=attrs+training+skills,grant=clamp(t.xp,0,50000)+(humanoid?20:0);
 return {attrs,training,skills,spent,grant,remaining:grant-spent};
}
export function dice(t,key){return sourceDice("attribute",key,toSystem(t));}
export function stats(t){
 const s=toSystem(t),monster=t.kind==="monstro",human=t.kind==="humanoide",grade=clamp(t.threatGrade,1,6);
 const life=lifeMax(s),defense=monster?Math.min(9,Number(s.attributes.agilidade||0)+Math.floor(Number(s.attributes.destreza||0)/2)):naturalDE(s);
 const maxKeep=human?keepLimit(s.level,true,false):grade>=5?4:3;
 const naturalKeep=human?keepLimit(s.level,false,false):2;
 return {life,de:defense,limitLocal:monsterCap(grade),keepBase:naturalKeep,keepMax:maxKeep,
  keepCostP:human?0:Math.max(0,Number(t.keep||2)-2),
  xp:ledger(t),capacity:loadCapacity(s),used:weightUsed(t)};
}
export function weightUsed(t){return(t.items||[]).reduce((n,it)=>n+Number(it.weight||0)*Math.max(1,Number(it.qty||1)),0);}
export function afterItem(t,item){const x=Number(item.weight)||0,qty=Math.max(1,Number(item.qty||1));return weightUsed(t)+x*qty;}
export function remainingKinds(t){
 const free=Math.max(0,loadCapacity(toSystem(t))-weightUsed(t));
 return {leve:Math.floor((free+1e-9)/WEIGHT.leve),medio:Math.floor((free+1e-9)/WEIGHT.medio),pesado:Math.floor((free+1e-9)/WEIGHT.pesado)};
}
export function normalize(raw){
 if(!raw||typeof raw!=="object")return blank("monstro");
 const kind=Object.hasOwn(KINDS,raw.kind)?raw.kind:"monstro",t=blank(kind);
 for(const k of ["name","concept","notes","abilities"])t[k]=String(raw[k]||"").slice(0,k==="notes"||k==="abilities"?4000:160);
 t.leader=!!raw.leader;
 for(const k of ["level","threatGrade","xp","life","pavorLocal","keep"]){
  const [min,max]=k==="level"?[1,20]:k==="threatGrade"?[1,6]:k==="keep"?[2,4]:k==="xp"?[0,50000]:[0,999];
  t[k]=Math.floor(clamp(raw[k]??t[k],min,max));
 }
 for(const [group,defs] of [["attributes",ATTRIBUTES],["knowledges",KNOWLEDGES],["practices",PRACTICES]])
  for(const [key] of defs)t[group][key]=Math.floor(clamp(raw[group]?.[key],0,6));
 t.skills=Array.isArray(raw.skills)?[...new Set(raw.skills.filter(id=>SKILLS.some(s=>s.id===id)))]:[];
 t.items=Array.isArray(raw.items)?raw.items.slice(0,70).map(i=>({
  id:String(i.id||uid()).slice(0,100),name:String(i.name||"Item").slice(0,90),
  weight:clamp(i.weight,0,100),qty:Math.floor(clamp(i.qty,1,99))
 })):[];
 t.id=String(raw.id||uid()).slice(0,110);
 const st=stats(t);t.pavorLocal=Math.min(t.pavorLocal,st.limitLocal);
 t.keep=Math.min(t.keep,st.keepMax);
 return t;
}
export function encounterSummary(roster,players){
 const units=roster.map(normalize),publicCap=narratorCap(players);
 return {totalXP:units.reduce((n,u)=>n+ledger(u).spent,0),
  leaders:units.filter(u=>u.leader).length,publicCap,
  count:units.length,overbudget:units.filter(u=>ledger(u).remaining<0).length};
}