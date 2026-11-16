/** SRD v0.48: ficha independente OPCIONAL de criatura Pequena domesticada. */
export const SMALL_ATTR_KEYS=Object.freeze(["forca","agilidade","destreza","inteligencia","influencia","vigor"]);
export const SMALL_ATTR_LABELS=Object.freeze(["Força","Agilidade","Destreza","Inteligência","Influência","Vigor"]);
/** EXPERIMENTAL: tabela-base de Atributos para a ficha opcional da Pequena; multiplicador 2x DEFINIDO. */
export const SMALL_ATTR_CUMULATIVE=Object.freeze([0,1,3,7,15,31,55]);
export const SMALL_FORCE_VIGOR_MULTIPLIER=2;
/** Vida inicial da Pequena sem desenvolvimento; compras podem elevar sua Vida máxima. */
export const SMALL_BASE_LIFE=1;
/** Alias histórico para o valor base; não é teto máximo da ficha desenvolvida. */
export const SMALL_INDEPENDENT_LIFE=SMALL_BASE_LIFE;
export function independentSmallCost(attributes={}){
 let xp=0;
 for(const key of SMALL_ATTR_KEYS){
  const grade=attributes?.[key]??0;
  if(!Number.isInteger(grade)||grade<0||grade>6)throw new RangeError("Grau inválido: "+key);
  xp+=SMALL_ATTR_CUMULATIVE[grade]*(key==="forca"||key==="vigor"?SMALL_FORCE_VIGOR_MULTIPLIER:1);
 }
 return xp;
}
/** Pequena: 1 Vida base + bônus de Vigor e de cada 2 Graus de Força. */
export function independentSmallLife(attributes={}){
 independentSmallCost(attributes); // também valida os Graus de Atributos
 return SMALL_BASE_LIFE+(attributes.vigor??0)+Math.floor((attributes.forca??0)/2);
}
export function smallCompanionBudget(playerTotalXP,attributes={}){
 if(!Number.isSafeInteger(playerTotalXP)||playerTotalXP<0)throw new RangeError("XP total do domador inválido");
 const spent=independentSmallCost(attributes);
 return {total:playerTotalXP,spent,remaining:playerTotalXP-spent,valid:spent<=playerTotalXP,
  ownLife:independentSmallLife(attributes),baseLife:SMALL_BASE_LIFE,lifeBonusToTamer:1};
}
