export const standardMovement = system =>
  8 + (Number(system.attributes?.agilidade)||0) + Math.floor((Number(system.practices?.atletismo)||0)/3);

const metresPerUnit = {
 m:1,metro:1,metros:1,meter:1,meters:1,ft:.3048,foot:.3048,feet:.3048,"pé":.3048,"pés":.3048,
};

export function movementBudget(system,distance,units){
 const scale=metresPerUnit[String(units).trim().toLowerCase()];
 if(!scale||!Number.isFinite(distance))return null;
 const used=distance*scale,max=standardMovement(system);
 return {max,used,exceeded:used-max>1e-6};
}

export function registerCodexMovement(){
 const NativeRuler=CONFIG.Token.rulerClass;
 if(!NativeRuler)return;
 CONFIG.Token.rulerClass=class CodexTokenRuler extends NativeRuler {
  _getWaypointLabelContext(waypoint,state){
   const context=super._getWaypointLabelContext(waypoint,state);
   const actor=this.token.actor;
   if(!context||waypoint.next||!actor?.isOwner||!actor.system?.attributes)return context;
   const budget=movementBudget(actor.system,waypoint.measurement.distance,context.units);
   if(!budget)return context;
   context.cost={total:budget.used.toLocaleString(game.i18n.lang,{maximumFractionDigits:2}),units:"m / "+budget.max+" m"};
   if(budget.exceeded)context.cssClass+=" codex-movement-over";
   return context;
  }
 };
}
