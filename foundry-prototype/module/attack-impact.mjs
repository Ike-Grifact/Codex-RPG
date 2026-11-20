import {equippedArmor} from "./equipment-logic.mjs";
import {lifeMax,maxCourage,monsterCap} from "./rules.mjs";

const ns="codex-rpg-foundry";

// Escala experimental registrada no Livro v0.5. O teto continua no Livro vigente.
export function basicLifeLoss(damage) {
 if(damage<=0)return 0;
 if(damage<=5)return 1;
 return damage<=8?2:3;
}

export function planAttackImpact(target,impact,{autoLife=true}={}) {
 const system=target.system;
 const field=target.type==="character"?"courage":"pavorLocal";
 const cap=field==="courage"?maxCourage(system.level):monsterCap(system.threatGrade);
 const current=Number(system[field])||0;
 const pavor=Math.min(Math.max(0,cap-current),impact.pavor);
 const changes=pavor?{["system."+field]:current+pavor}:{};
 const receipt={pavor,pavorField:field,overflow:impact.pavor-pavor,integrity:0,life:0,manual:0,complex:false};
 if(!impact.damage)return {changes,receipt};

 const armor=equippedArmor(target);
 const physical=impact.mode==="armas";
 const elementalProtection=!physical&&armor?.system.properties?.some(value=>/resist|imun/i.test(value));
 if(impact.manualDamage||impact.special||elementalProtection||
    impact.element==="veneno"||system.transformation?.kind==="elemental"||system.transformation?.lifePending){
  return {changes,receipt:{...receipt,manual:impact.damage,complex:true}};
 }
 if(physical&&armor?.system.category==="muito-pesado")return {changes,receipt:{...receipt,immune:true}};

 const integrity=Math.max(0,Number(armor?.system.integrity?.value)||0);
 const absorbed=Math.min(integrity,impact.damage);
 if(absorbed){
  changes.items=[...target.items].map(item=>{
   const data=item.toObject();
   if(item.id===armor.id)data.system.integrity.value=integrity-absorbed;
   return data;
  });
 }
 const remaining=impact.damage-absorbed;
 // A consequência do golpe colossal depende da mesa.
 const colossal=remaining>=3*lifeMax(system);
 const loss=autoLife&&!colossal?Math.min(system.life.value,basicLifeLoss(remaining)):0;
 if(loss){
  receipt.lifeBefore=system.life.value;
  receipt.lifeAfter=system.life.value-loss;
  changes["system.life.value"]=receipt.lifeAfter;
 }
 return {changes,receipt:{...receipt,integrity:absorbed,life:loss,manual:colossal||!autoLife?remaining:0}};
}

export async function applyAttackImpact(impact,rollId,game,resolveUuid) {
 const token=await resolveUuid(impact.tokenUuid);
 const target=token?.actor;
 if(!target||target.uuid!==impact.actorUuid)return {missing:true};
 const key="impactReceipts";
 const previous=target.getFlag(ns,key)?.[rollId];
 if(previous)return previous;
 if(game.user&&!game.user.isActiveGM)throw Error("O Narrador ativo mudou. Retome a ação.");
 const {changes,receipt}=planAttackImpact(target,impact,{autoLife:game.settings?.get(ns,"experimentalLifeDamage")??true});
 // Uma mesma atualização persiste os efeitos e o recibo da rolagem, inclusive no token sintético.
 await target.update({...changes,["flags."+ns+"."+key+"."+rollId]:receipt});
 const saved=token.actor?.getFlag(ns,key)?.[rollId];
 if(!saved)throw Error("O impacto ainda não foi confirmado no alvo. Use Retomar publicação.");
 return saved;
}

export function impactSummary(receipt,privateDefense) {
 if(receipt.missing)return "O token original saiu da cena. Resolva o impacto na mesa.";
 const messages=[];
 if(receipt.immune)messages.push("A armadura bloqueou o dano físico.");
 if(receipt.integrity)messages.push(privateDefense?"Dano aplicado à Integridade.":receipt.integrity+" de dano à Integridade.");
 if(receipt.life){
  const detail=receipt.lifeBefore!=null&&receipt.lifeAfter!=null
   ?`Vida do alvo ${receipt.lifeBefore} → ${receipt.lifeAfter} (−${receipt.life}).`
   :`Vida do alvo −${receipt.life}.`;
  messages.push(privateDefense?"Dano aplicado à Vida.":detail);
 }
 if(receipt.manual)messages.push(receipt.complex?"Proteção ou efeito especial: resolva o dano na mesa.":"Dano restante para resolução na mesa.");
 if(receipt.pavor)messages.push(receipt.pavorField==="courage"?"Coragem concedida ao alvo.":"Pavor transferido ao alvo.");
 if(receipt.overflow)messages.push("Pavor excedente para adjudicação.");
 return messages.join(" ");
}
