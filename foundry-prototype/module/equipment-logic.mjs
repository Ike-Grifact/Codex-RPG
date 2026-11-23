/* Controle de equipamento e orçamento para a ficha Foundry. */
import {naturalDE,xpLedger,loadCapacity} from "./rules.mjs";
import {skillDetails} from './advancement.mjs';
import {allOwnedSkills,isRuna} from './races.mjs';

const isRangedWeapon = item => item?.properties?.some(property=>property.toLowerCase()==="à distância");
export function effectiveWeaponRange(system,item){
 if(!["weapon","firearm"].includes(item?.kind))return 0;
 const base=Math.max(0,Number(item.range)||0);
 const skills=allOwnedSkills(system);
 if(!base||!skills.includes("olhos-de-aguia"))return base;
 const eligible=item.kind==="firearm"?skills.includes("armas-fogo"):
  isRangedWeapon(item)&&skills.includes("armas-longo-alcance");
 return base+(eligible?8:0);
}
export function equippedDie(actor,item,mode){
 if(actor.system.transformation?.kind==='animal')return 0;
 if(!item||!item.system.equipped)return 0;
 const s=actor.system,k=item.system.kind,cat=item.system.category;
 const maxGrade=s.level>=20?4:s.level>=10?3:s.level>=5?2:1;
 if(item.system.grade>maxGrade||cat==='pendente')return 0;
 const keys=allOwnedSkills(s);
 if(mode==="armas"){
  if(!["weapon","firearm"].includes(k))return 0;
  if(k==="firearm"){if(!keys.includes("armas-fogo"))return 0;}
  else {
   const long=isRangedWeapon(item.system);
   const categorySkill={leve:"armas-leves",medio:"armas-medias",pesado:"armas-pesadas"}[cat];
   if(long?!keys.includes('armas-longo-alcance'):!keys.includes(categorySkill))return 0;
  }
 }else return 0;
 const die=Number(item.system.die)||({leve:6,medio:10,pesado:12}[cat]||0);
 return [6,10,12].includes(die)?(mode==='conjuracao'?6:die):0;
}
export function skillPrerequisite(system,id){
 return skillDetails(system,id==='manejo-duplo'?'maestria-manejo-duplo':id).met;
}
export function canSpendXP(system,delta){
 const ledger=xpLedger(system);
 return Number.isFinite(delta)&&delta>=0&&ledger.spent+delta<=ledger.grant;
}
export function armorFits(system,item){
 if(item.type!=="equipment"||item.system.kind!=="armor"||system.transformation?.kind||isRuna(system))return false;
 const maxGrade=system.level>=20?4:system.level>=10?3:system.level>=5?2:1;
 return (item.system.grade??1)<=maxGrade&&
  (item.system.category!=="muito-pesado"||(system.attributes.vigor>=6&&system.practices?.atletismo>=6));
}
export function equippedArmor(actor){
 return actor.items.find(item=>item.system.equipped&&armorFits(actor.system,item));
}
export function carriedWeight(actor){
 const items=actor.items?.values?[...actor.items.values()]:[...(actor.items??[])];
 return items.filter(item=>item.type==='equipment').reduce((sum,item)=>sum+
  (Number(item.system.weight)||0)*Math.max(0,Number(item.system.quantity??1))+
  (item.system.kind==='shield'?({medio:.5,pesado:1}[item.system.embeddedWeapon]??0):0),0);
}
const armorNames={"muito-leve":"Muito Leve",leve:"Leve",medio:"Média",pesado:"Pesada","muito-pesado":"Muito Pesada"};
export function armorWeightLabel(actor){
 return armorNames[equippedArmor(actor)?.system.category]??"Sem armadura";
}
export function loadStatus(system,used){
 const capacity=loadCapacity(system);
 const percent=Math.round(1e9*100*used/capacity)/1e9;
 const balance=percent>=100?"Muito Pesado":percent>=75?"Pesado":percent>=50?"Médio":percent>=25?"Leve":"Muito Leve";
 return {used,capacity,percent,balance,overloaded:percent>100+1e-9,warning:percent>=75};
}
const armorModifiers={"muito-leve":2,leve:1,medio:0,pesado:-1,"muito-pesado":-2};
const defenseParts=actor=>{
 const armor=equippedArmor(actor);
 const modifier=armorModifiers[armor?.system.category]??0;
 const mastery=Number(allOwnedSkills(actor.system).includes("maestria-escudos")&&
  actor.items.some(item=>item.type==="equipment"&&item.system.kind==="shield"&&item.system.equipped));
 const natural=naturalDE(actor.system);
 return {armor,modifier,mastery,natural,de:Math.min(12,Math.max(0,natural+modifier+mastery))};
};
// Bônus iguais na defesa normal e na esquiva.
export function dodgeBonus(actor){return Math.max(0,armorModifiers[equippedArmor(actor)?.system.category]??0);}
export const defenseDE=actor=>defenseParts(actor).de;
export const dodgeDE=defenseDE;
export function defenseDisplay(actor){
 const {armor,modifier,mastery,natural,de}=defenseParts(actor);
 const sign=modifier<0?"− ":"+ ";
 const adjustments=[modifier?sign+Math.abs(modifier)+" ("+armorNames[armor.system.category]+")":"",mastery?"+ 1 (Maestria em Escudos)":""].filter(Boolean);
 return {de,natural,modifier,calculation:"Natural "+natural+(adjustments.length?" "+adjustments.join(" "):" · sem modificadores")+" = "+de,
  condition:armor?"Modificador da armadura aplicável a todas as defesas.":"Sem armadura equipada."};
}
