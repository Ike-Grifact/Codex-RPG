
const ns="codex-rpg-foundry";

export const usesLocal=actor=>actor.type!=="character";
export const actionResource=actor=>usesLocal(actor)?"pavorLocal":"courage";
export const healthCost=(actor,health)=>actor.system.monsterRules||actor.system.animalRules?0:(health?.coragem??0);
export const spentInRound=(actor,combat)=>{
 const previous=actor.getFlag?.(ns,"courageSpent");
 return combat?.started&&previous?.key===combat.id+":"+combat.round?(previous.amount??0):0;
};

export function spendActionResource(actor,amount,combat){
 if(!amount)return {};
 const field=actionResource(actor);
 const available=actor.system[field]??0;
 if(available<amount)throw Error(usesLocal(actor)?"Pavor local insuficiente.":"Coragem insuficiente.");
 if(!usesLocal(actor)&&spentInRound(actor,combat)+amount>5)
  throw Error("Máximo de 5 Coragens por rodada.");
 const changes={["system."+field]:available-amount};
 if(!usesLocal(actor)&&combat?.started)changes["flags."+ns+".courageSpent"]={
  key:combat.id+":"+combat.round,amount:spentInRound(actor,combat)+amount,
 };
 return changes;
}
