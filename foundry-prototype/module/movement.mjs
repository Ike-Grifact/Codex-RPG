export const standardMovement = system =>
  8 + (Number(system.attributes?.agilidade)||0) + Math.floor((Number(system.practices?.atletismo)||0)/3);

const metresPerUnit = {
 "":1,m:1,metro:1,metros:1,meter:1,meters:1,ft:.3048,foot:.3048,feet:.3048,"pé":.3048,"pés":.3048,
};
const movementColors={exito:0x267A45,antecipar:0x2369BB,pavor:0x542176};

export function movementBudget(system,distance,units){
 const scale=metresPerUnit[String(units??"").trim().toLowerCase()];
 if(!Number.isFinite(scale)||!Number.isFinite(distance))return null;
 const used=distance*scale,max=standardMovement(system);
 let band="exito";
 if(used-max*2>1e-6)band="pavor";
 else if(used-max>1e-6)band="antecipar";
 return {max,used,band};
}

function colorMovement(style,waypoint){
 const color=movementColors[waypoint.codexMovement?.band];
 return color?{...style,color}:style;
}

export function registerCodexMovement(){
 const NativeRuler=CONFIG.Token.rulerClass;
 if(!NativeRuler)return;
 CONFIG.Token.rulerClass=class CodexTokenRuler extends NativeRuler {
  _preparePath(path){
   super._preparePath(path);
   const actor=this.token.actor;
   if(!path.length||!actor?.isOwner||!actor.system?.attributes)return;
   // The native path includes the recorded combat turn and the full proposed route.
   const budget=movementBudget(actor.system,path.at(-1).measurement.distance,canvas.grid.units);
   if(budget)for(const waypoint of path)waypoint.codexMovement=budget;
  }
  _getSegmentStyle(waypoint){
   return colorMovement(super._getSegmentStyle(waypoint),waypoint);
  }
  _getWaypointStyle(waypoint){
   return colorMovement(super._getWaypointStyle(waypoint),waypoint);
  }
  _getGridHighlightStyle(waypoint,offset){
   return colorMovement(super._getGridHighlightStyle(waypoint,offset),waypoint);
  }
  _getWaypointLabelContext(waypoint,state){
   const context=super._getWaypointLabelContext(waypoint,state);
   const budget=waypoint.codexMovement;
   if(!context||waypoint.next||!budget)return context;
   context.cost={total:budget.used.toLocaleString(game.i18n.lang,{maximumFractionDigits:2}),units:`m / ${budget.max} m`};
   context.cssClass+=` codex-movement-${budget.band}`;
   return context;
  }
 };
}
