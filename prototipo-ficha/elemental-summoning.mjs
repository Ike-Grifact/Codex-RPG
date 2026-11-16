/** Codex RPG v0.49 — requisitos verificáveis para compra e porte de Invocação Elemental.
 * Não resolve magia, dano, posse ou as habilitações ainda pendentes de Psique/Combinar.
 */
export const ELEMENT_SKILL_IDS=Object.freeze(["fogo","agua","vento","terra","sagrado","veneno","sangue","trevas"]);
export const DOMAR_BY_SIZE=Object.freeze({pequena:"domar-criatura-pequena",media:"domar-criatura-media",grande:"domar-criatura-grande"});
export const INVOCACAO_ELEMENTAL_XP=1;
export function eligibleElementalSkills(skills=[]){
 const s=new Set(Array.isArray(skills)?skills:[]);
 return ELEMENT_SKILL_IDS.filter(id=>s.has(id));
}
export function canBuyElementalSummoning(skills=[]){
 const s=new Set(Array.isArray(skills)?skills:[]);
 return s.has("criar-item-foco-magia")&&s.has("domar-criatura-pequena")&&eligibleElementalSkills(skills).length>0;
}
export function summonableElementalSizes(skills=[]){
 const s=new Set(Array.isArray(skills)?skills:[]);
 if(!s.has("invocacao-elemental")||!canBuyElementalSummoning(skills))return [];
 return Object.entries(DOMAR_BY_SIZE).filter(([,id])=>s.has(id)).map(([size])=>size);
}
export function canSummonElemental({skills=[],element,size}={}){
 const s=new Set(Array.isArray(skills)?skills:[]);
 return eligibleElementalSkills(skills).includes(element)
  &&summonableElementalSizes(skills).includes(size)
  &&s.has(DOMAR_BY_SIZE[size]);
}
