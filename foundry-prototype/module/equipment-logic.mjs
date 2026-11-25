/* Controle de equipamento e orçamento para a ficha Foundry. */
import {SKILLS,xpLedger} from "./rules.mjs";
export function equippedDie(actor,item,mode){
 if(!item||!item.system.equipped)return 0;
 const s=actor.system,k=item.system.kind,cat=item.system.category;
 const keys=s.skills||[];
 if(mode==="conjuracao"){
  // SRD v0.89: foco habilita/encurta a conjuração, mas NUNCA concede dado.
  return 0;
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
// Fogo G4 é conjuração conjunta de dois G3, ainda não automatizada nesta ficha.
// Para Fogo individual, G1/G2 são gratuitos com a Perícia e G3 custa 1 Coragem.
export function fireActivationCourage(grade,hasFireSkill){
 const n=Number(grade);
 if(!hasFireSkill||![1,2,3].includes(n))return null;
 return n===3?1:0;
}
export function characteristicActivationPayment(){
 return {courage:1}; // Ativação paga: recurso único, sem alternativa legada.
}
export function canSpendXP(system,delta){
 const ledger=xpLedger(system);
 return !!system.monsterRules||ledger.spent+delta<=ledger.grant;
}
export function defenseDE(actor){
 const s=actor.system,a=s.attributes||{};
 if(s.monsterRules)return Math.min(9,Math.max(0,Number(a.agilidade||0)+Math.floor(Number(a.destreza||0)/2)));
 const natural=Math.min(11,2+Math.floor((Number(a.agilidade||0)+Number(a.vigor||0)+Number(a.destreza||0))/2));
 let modifier=0;
 for(const armor of (actor.items||[]).filter(i=>i.type==="equipment"&&i.system.kind==="armor"&&i.system.equipped)){
  const cat=String(armor.system.category||"").toLowerCase().replace(/[_ ]/g,"-");
  modifier=({"muito-leve":0,leve:-1,medio:-2,pesado:-3,"muito-pesado":-4})[cat]||0;
  break;
 }
 const shield=(s.skills||[]).includes("maestria-escudos")&&(actor.items||[]).some(i=>i.type==="equipment"&&i.system.kind==="shield"&&i.system.equipped)?1:0;
 return Math.min(12,Math.max(0,natural+modifier+shield));
}
