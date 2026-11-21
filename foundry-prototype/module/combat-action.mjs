import {ATTRIBUTES,GROUPS,attributesOnly,isDiscipline,sourcePairError,mayComplement,disciplineNeedsAttribute} from "./rules.mjs";
import {equippedDie} from "./equipment-logic.mjs";
import {preferredQuickAttribute} from "./equipment-workflow.mjs";

import {availableElements} from "./conjuration.mjs";
export {availableElements};

export const sameSource=(a,b)=>!!a&&!!b&&a.group===b.group&&a.key===b.key;

export function prepareCombatAction(actor,action,previous={},equipmentId=""){
 const system=actor.system;
 if(action==="spell"&&(attributesOnly(system)||!availableElements(system).length)){
  throw Error("Conjurar exige uma habilitação elemental ou Criar Item de Foco e Magia.");
 }
 const mode=action==="spell"?"conjuracao":"armas";
 const item=actor.items.get(equipmentId);
 if(equipmentId&&!equippedDie(actor,item,mode))throw Error("Equipe o item e confira sua habilitação.");
 if(attributesOnly(system)){
  const keys=[...ATTRIBUTES].sort(([a],[b])=>(system.attributes?.[b]??0)-(system.attributes?.[a]??0)).map(([key])=>key);
  const chosen=[previous.base,previous.second].filter(source=>source?.group==="attribute").map(source=>source.key);
  const [first,second]=[...new Set([...chosen,...keys])];
  return {base:{group:"attribute",key:first},second:{group:"attribute",key:second},complement:null};
 }
 const selected=[previous.second,previous.base,previous.complement].find(source=>source?.group==="attribute");
 const key=selected?.key??(action==="spell"?"inteligencia":preferredQuickAttribute(system,item??{system:{}},previous)||"forca");
 return {base:{group:"practice",key:"armas_conjuracao"},second:{group:"attribute",key},complement:null};
}

function candidates(system,selection,slot,offensive){
 const {base,second}=selection;
 const onlyAttributes=attributesOnly(system);
 if(slot==="base"&&offensive&&!onlyAttributes)return [];
 const list=Object.entries(GROUPS).flatMap(([group,entries])=>
  entries.map(([key,label])=>({group,key,label,value:group+":"+key})));
 if(slot==="complement"){
  if(!mayComplement(system,base,second))return [];
  return list.filter(source=>!sameSource(source,base)&&!sameSource(source,second)&&
    (!onlyAttributes||source.group==="attribute")&&!disciplineNeedsAttribute([base,second,source]));
 }
 return list.filter(source=>{
  if(offensive&&source.group!=="attribute")return false;
  return !(slot==="base"?sourcePairError(system,source,second):sourcePairError(system,base,source));
 });
}

export function selectionOptions(system,selection,slot,offensive){
 return candidates(system,selection,slot,offensive)
  .map(source=>({...source,selected:sameSource(source,selection[slot])}));
}

export function changeRollSource(system,selection,slot,value,offensive){
 if(!["base","second","complement"].includes(slot))return null;
 const source=value?candidates(system,selection,slot,offensive).find(row=>row.value===value):null;
 if(!source&&(value||slot!=="complement"))return null;
 const next={...selection,[slot]:source?{group:source.group,key:source.key}:null};
 if(next.complement&&!candidates(system,next,"complement",offensive).some(row=>sameSource(row,next.complement))){
  const repeated=isDiscipline(next.complement)&&[next.base,next.second].some(isDiscipline);
  if(!repeated)next.complement=null;
 }
 return next;
}
