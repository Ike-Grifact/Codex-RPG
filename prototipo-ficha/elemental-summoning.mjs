/** Codex RPG v0.49 — requisitos verificáveis para compra e porte de Invocação Elemental.
 * Criar Item de Foco e Magia habilita Psique; não resolve magia, posse ou Combinar.
 */
export const ELEMENT_SKILL_IDS=Object.freeze(["fogo","agua","vento","terra","sagrado","veneno","sangue","trevas"]);
export const DOMAR_BY_SIZE=Object.freeze({pequena:"domar-criatura-pequena",media:"domar-criatura-media",grande:"domar-criatura-grande"});
export const INVOCACAO_ELEMENTAL_XP=1;
export const PSIQUE_HABILITATION_SKILL="criar-item-foco-magia";
export const PSIQUE_ELEMENT="psique";
/** Limites aprovados: apenas uma ficha de invocação ativa por conjurador;
 * duas fichas domesticadas sob controle direto por domador. */
export const MAX_INVOCATION_SHEETS=1;
export const MAX_DIRECT_TAMED_SHEETS=2;
/** Múltiplos corpos reais podem compartilhar uma única ficha de Grande.
 * Os procedimentos para dano/posicionamento de cada corpo são pendentes. */
export const GROUPED_ZOMBIE_EXAMPLE=Object.freeze({
 realMediumBodies:3,mechanicalSize:"grande",controlledSheets:1,
 xpEntries:1,sharedMechanicalLife:true,sharedActionBudget:true
});
/** Invocação de Psique (pura ou combinada) projeta a mente do conjurador:
 * o corpo físico permanece parado enquanto a manifestação é sustentada. */
export function psychicProjectionRequiresStillBody(elements){
 const list=Array.isArray(elements)?elements:[elements];
 return list.some(element=>normalizeElement(element)===PSIQUE_ELEMENT);
}
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
