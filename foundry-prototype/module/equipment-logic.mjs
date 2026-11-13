/* Controle de equipamento e orçamento para a ficha Foundry. */
import {SKILLS,xpLedger} from "./rules.mjs";
export function equippedDie(actor,item,mode){
 if(!item||!item.system.equipped)return 0;
 const s=actor.system,k=item.system.kind,cat=item.system.category;
 const keys=s.skills||[];
 if(mode==="conjuracao"){
  if(k!=="focus"&&!["spell","magic"].includes(k))return 0;
  if(!keys.includes("criar-item-foco-magia"))return 0;
  const el=(item.system.element||"").toLowerCase().trim();
  if(el&&el!=="psiquico"&&el!=="psíquico"&&!keys.some(x=>x.includes("elemento")&&x.includes(el)))return 0;
 }else if(mode==="armas"){
  if(!["weapon","firearm"].includes(k))return 0;
  if(k==="firearm"){if(!keys.includes("armas-fogo"))return 0;}
  else {
   const long=Array.isArray(item.system.properties)&&item.system.properties.some(x=>x.toLowerCase()==="à distância");
   const categorySkill={leve:"armas-leves",medio:"armas-medias",pesado:"armas-pesadas"}[cat];
   if(!(keys.includes(categorySkill)||(long&&keys.includes("armas-longo-alcance"))))return 0;
  }
 }else return 0;
 const die=Number(item.system.die)||({leve:6,medio:10,pesado:12}[cat]||0);
 return [6,10,12].includes(die)?die:0;
}
export function skillPrerequisite(system,id){
 const a=system.attributes||{},p=system.practices||{},s=system.skills||[];
 const disc=Number(p.armas_conjuracao||0),arts=Number(p.artesao||0),
  force=Number(a.forca||0),dex=Number(a.destreza||0),intel=Number(a.inteligencia||0),agil=Number(a.agilidade||0);
 const req={
  "armas-leves":disc>=1,
  "armas-medias":disc>=1&&force>=1,
  "armas-pesadas":disc>=2&&force>=2,
  "armas-longo-alcance":disc>=1&&dex>=2,
  "armas-fogo":disc>=2&&dex>=2,
  "criar-item-foco-magia":disc>=1&&intel>=1&&arts>=1,
  "disciplina-avancada":disc>=2,
  "manejo-duplo":s.includes("disciplina-avancada")&&force>=2&&dex>=2&&agil>=1&&["armas-leves","armas-medias","armas-pesadas","armas-longo-alcance","armas-fogo"].some(x=>s.includes(x))
 };
 return req[id]??true;
}
export function canSpendXP(system,delta){
 const ledger=xpLedger(system);
 return Number.isFinite(delta)&&delta>=0&&ledger.spent+delta<=ledger.grant;
}
export function defenseDE(actor){
 const natural=actor?.system?Math.max(0,Number(actor.system.monsterRules?Number(actor.system.attributes?.agilidade||0)+Math.floor(Number(actor.system.attributes?.destreza||0)/2):0)):0;
 const s=actor.system;
 const general=Math.min(9,Number(s.attributes.agilidade||0)+Math.floor(Number(s.attributes.destreza||0)/2)+(s.monsterRules?0:Math.floor(Number(s.attributes.vigor||0)/2)+Math.floor(Number(s.practices?.atletismo||0)/3)));
 let modifier=0;
 for(const armor of actor.items.filter(i=>i.type==="equipment"&&i.system.kind==="armor"&&i.system.equipped)){
  if(armor.system.category==="pesado")modifier=-1;
  if(armor.system.category==="muito-pesado")modifier=-2;
  break; // Mais de uma armadura: não empilhar sem regra.
 }
 return Math.max(0,(s.monsterRules?Math.min(9,natural):general)+modifier);
}
