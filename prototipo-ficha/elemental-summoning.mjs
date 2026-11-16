/** Codex RPG v0.49 — requisitos verificáveis para compra e porte de Invocação Elemental.
 * Criar Item de Foco e Magia habilita Psique; não resolve magia, posse ou Combinar.
 */
export const ELEMENT_SKILL_IDS=Object.freeze(["fogo","agua","vento","terra","sagrado","veneno","sangue","trevas"]);
export const DOMAR_BY_SIZE=Object.freeze({pequena:"domar-criatura-pequena",media:"domar-criatura-media",grande:"domar-criatura-grande"});
export const INVOCACAO_ELEMENTAL_XP=1;
export const PSIQUE_HABILITATION_SKILL="criar-item-foco-magia";
export const PSIQUE_ELEMENT="psique";
const normalizeElement=element=>element==="psiquico"||element==="psíquico"?PSIQUE_ELEMENT:element;
export function eligibleElementalSkills(skills=[]){
 const s=new Set(Array.isArray(skills)?skills:[]);
 return [...(s.has(PSIQUE_HABILITATION_SKILL)?[PSIQUE_ELEMENT]:[]),...ELEMENT_SKILL_IDS.filter(id=>s.has(id))];
}
export function canBuyElementalSummoning(skills=[]){
 const s=new Set(Array.isArray(skills)?skills:[]);
 return s.has(PSIQUE_HABILITATION_SKILL)&&s.has("domar-criatura-pequena")&&eligibleElementalSkills(skills).length>0;
}
export function summonableElementalSizes(skills=[]){
 const s=new Set(Array.isArray(skills)?skills:[]);
 if(!s.has("invocacao-elemental")||!canBuyElementalSummoning(skills))return [];
 return Object.entries(DOMAR_BY_SIZE).filter(([,id])=>s.has(id)).map(([size])=>size);
}
export function canSummonElemental({skills=[],element,size}={}){
 const s=new Set(Array.isArray(skills)?skills:[]);
 return eligibleElementalSkills(skills).includes(normalizeElement(element))
  &&summonableElementalSizes(skills).includes(size)
  &&s.has(DOMAR_BY_SIZE[size]);
}
