import {SKILLS,BARD_MASTERY_SUMMARY} from "./skill-catalog.mjs";

export const bardMasteryId="maestria-em-apresentacao";
export const bardMastery=SKILLS.find(row=>row.id===bardMasteryId);
export const bardRepertoire={summary:BARD_MASTERY_SUMMARY,effects:bardMastery.effects};
const normalized=value=>String(value??"").trim().normalize("NFD").replace(/\p{M}/gu,"").toLowerCase().replace(/[^a-z0-9]+/g,"-");
const effectsByKey=new Map(bardRepertoire.effects.flatMap(effect=>[[effect.id,effect],[normalized(effect.name),effect]]));

export const internalBardEffect=value=>effectsByKey.get(normalized(value));
export const bardEffectItem=item=>item.type==="skill"
 ?internalBardEffect(item.system?.canonicalId)||internalBardEffect(item.name)
 :undefined;

export function splitBardSkills(ids){
 const skills=[],historical=[];
 for(const id of ids){
  (internalBardEffect(id)?historical:skills).push(id);
 }
 return {skills,historical};
}

export function historicalBardNames(actor){
 const archived=actor.getFlag("codex-rpg-foundry","bardLegacy");
 const effects=[...(actor.system.skills??[]),...(archived?.ids??[])].map(internalBardEffect);
 for(const item of [...actor.items,...(archived?.items??[])])effects.push(bardEffectItem(item));
 return [...new Set(effects.filter(Boolean).map(effect=>effect.name))].sort((a,b)=>a.localeCompare(b,"pt-BR"));
}
