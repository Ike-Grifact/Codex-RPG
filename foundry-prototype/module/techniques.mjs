import {hasSkill} from "./races.mjs";
import {skillDetails} from "./advancement.mjs";
import {maxCourage} from "./rules.mjs";

export const canUseTechnique=(system,id)=>hasSkill(system,id)&&skillDetails(system,id).met;
export const sphereRound=combat=>combat?.started?combat.id+":"+combat.round:"";
export const sphereState=(system,round)=>{
 const spheres=system.spiritualSpheres??{};
 return {count:spheres.count??0,round,createdThisRound:spheres.round===round||!spheres.round?spheres.createdThisRound??0:0};
};

export function spherePlan(system,action,round,userIsGM){
 const spheres=sphereState(system,round);
 if(!canUseTechnique(system,"invocar-esfera-espiritual"))throw Error("Invocar Esfera Espiritual indisponível.");
 const changes={"system.spiritualSpheres":spheres};
 if(action==="create"){
  if(spheres.createdThisRound>=5||spheres.count>=5||system.courage<1)throw Error("Limite da rodada, reserva cheia ou Coragem insuficiente.");
  spheres.count++;spheres.createdThisRound++;
  changes["system.courage"]=system.courage-1;
 }else if(action==="nextRound"&&userIsGM&&!round){
  spheres.createdThisRound=0;
 }else if(action==="absorb"&&canUseTechnique(system,"absorver-esferas")&&spheres.count){
  changes["system.courage"]=system.courage+Math.min(spheres.count,Math.max(0,maxCourage(system.level)-system.courage));
  spheres.count=0;
 }else if(["passo-etereo","disparo-esferas-espirituais"].includes(action)&&canUseTechnique(system,action)&&spheres.count){
  spheres.count--;
 }else throw Error("Ação de Esferas Espirituais indisponível.");
 return changes;
}

export function isMeleeWeapon(item){
 return !item||item.system.kind==="weapon"&&item.system.equipped&&item.system.range<=2&&
  !item.system.properties?.includes("À Distância");
}

export function canAsura(system,round,item){
 const spheres=sphereState(system,round);
 return canUseTechnique(system,"invocar-esfera-espiritual")&&spheres.count===5&&spheres.createdThisRound===0&&system.courage>=1&&isMeleeWeapon(item);
}
