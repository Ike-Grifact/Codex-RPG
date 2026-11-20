/* Controle de equipamento e orçamento para a ficha Foundry. */
import {xpLedger} from "./rules.mjs";
import {skillDetails} from './advancement.mjs';

const isRangedWeapon = item => item?.properties?.some(property=>property.toLowerCase()==="à distância");
const elementalSkill={ar:"vento",vento:"vento",agua:"agua",fogo:"fogo",terra:"terra",
 sagrado:"sagrado",veneno:"veneno",sangue:"sangue",trevas:"trevas"};
export function effectiveWeaponRange(system,item){
 if(!["weapon","firearm"].includes(item?.kind))return 0;
 const base=Math.max(0,Number(item.range)||0);
 const skills=system.skills??[];
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
 const keys=s.skills||[];
 if(mode==="conjuracao"){
  if(k!=="focus"&&!["spell","magic"].includes(k))return 0;
  if(!keys.includes("criar-item-foco-magia"))return 0;
  const el=(item.system.element||"").toLowerCase().trim().normalize("NFD").replace(/\p{Diacritic}/gu,"");
  if(el&&!["psiquico","psique"].includes(el)&&!keys.includes(elementalSkill[el]))return 0;
 }else if(mode==="armas"){
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
export function equippedArmor(actor){
 if(actor.system.transformation?.kind)return;
 const s=actor.system,maxGrade=s.level>=20?4:s.level>=10?3:s.level>=5?2:1;
 return actor.items.find(item=>item.type==='equipment'&&item.system.kind==='armor'&&item.system.equipped&&
  (item.system.grade??1)<=maxGrade&&(item.system.category!=='muito-pesado'||(s.attributes.vigor>=6&&s.practices?.atletismo>=6)));
}
export function carriedWeight(actor){
 const items=actor.items?.values?[...actor.items.values()]:[...(actor.items??[])];
 return items.filter(item=>item.type==='equipment').reduce((sum,item)=>sum+
  (Number(item.system.weight)||0)*Math.max(0,Number(item.system.quantity??1))+
  (item.system.kind==='shield'?({medio:.5,pesado:1}[item.system.embeddedWeapon]??0):0),0);
}
/* Modificador exclusivo de Esquiva; não altera DE geral nem empilha armaduras. */
export function dodgeBonus(actor){
 if(actor.system.transformation?.kind)return 0;
 const armor=equippedArmor(actor);
 return armor?.system?.category==="muito-leve"?2:armor?.system?.category==="leve"?1:0;
}
export function dodgeDE(actor){return defenseDE(actor);}
/* Um único valor final é apresentado. O bônus positivo de armadura
 * segue condicionado à Esquiva; alvos sem esquiva usam defenseDE(actor). */
export function defenseDisplay(actor){
 const worn=equippedArmor(actor);
 const cat=worn?.system?.category||"";
 const natural=defenseDE({system:actor.system,items:[]});
 const penalty=cat==="pesado"?1:cat==="muito-pesado"?2:0;
 const bonus=dodgeBonus(actor);
 const de=dodgeDE(actor),modifier=bonus-penalty;
 const types={"muito-leve":"Muito Leve","leve":"Leve","medio":"Média",
  "pesado":"Pesada","muito-pesado":"Muito Pesada"};
 const source=types[cat]||"Armadura";
 const calculation=modifier?"Natural "+natural+" "+(modifier>0?"+":"−")+" "+Math.abs(modifier)+" ("+source+") = "+de+
  (natural-penalty<0?" (mínimo 0)":""):"Natural "+natural+" · sem modificador = "+de;
 const condition=bonus?"Modificador de armadura aplicável a todas as defesas.":
  penalty?"Penalidade da armadura aplicada à defesa.":worn?"Armadura sem modificador de DE.":"Sem armadura equipada.";
 return {de,natural,modifier,calculation,condition};
}
export function defenseDE(actor){
 const natural=actor?.system?Math.max(0,Number(actor.system.monsterRules?Number(actor.system.attributes?.agilidade||0)+Math.floor(Number(actor.system.attributes?.destreza||0)/2):0)):0;
 const s=actor.system;
 const general=Math.min(9,Number(s.attributes.agilidade||0)+Math.floor(Number(s.attributes.destreza||0)/2)+(s.monsterRules?0:Math.floor(Number(s.attributes.vigor||0)/2)+Math.floor(Number(s.practices?.atletismo||0)/3)));
 let modifier=0;
 for(const armor of [equippedArmor(actor)].filter(Boolean)){
  if(armor.system.category==="pesado")modifier=-1;
  if(armor.system.category==="muito-pesado")modifier=-2;
  break; // Mais de uma armadura: não empilhar sem regra.
 }
 return Math.min(12,Math.max(0,(s.monsterRules?Math.min(9,natural):general)+modifier+dodgeBonus(actor)));
}
