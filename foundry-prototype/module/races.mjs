import {internalBardEffect} from "./bard.mjs";

// Tabelas acumuladas de G0 a G6 do Criador oficial, revisão 3948f58.
export const XP_ATTRIBUTE = [0,1,3,6,9,18,32];
export const XP_TRAINING = [0,2,4,8,16,32,64];
const discountedAttribute = [0,0,2,4,7,12,24];
const increasedTraining = [0,3,6,12,24,48,96];

export const RACES = {
  humano: {name:"Humano", description:"Perseverança Humana e Maestria em Armas de Fogo gratuitas. A Maestria não concede a Perícia Armas de Fogo.", favored:[], increased:[]},
  lucker_sangue: {name:"Lucker de Sangue", description:"Perícia de Sangue gratuita.", favored:["vigor","agilidade"], increased:["attribute:influencia","practice:apresentacao"]},
  lucker_puro: {name:"Lucker Puro", description:"Foco e um elemento inicial gratuitos.", favored:["inteligencia","destreza"], increased:["attribute:forca","practice:atletismo"]},
  runa_espinhos: {name:"Runa Espinhos", description:"Pugilismo, Foco, um elemento inicial e Escudo Rúnico gratuitos. A origem não equipa armaduras físicas.", favored:["vigor","forca"], increased:["attribute:agilidade","attribute:destreza"]},
};
export const PURE_ELEMENTS = [["sangue","Sangue"],["trevas","Trevas"],["veneno","Veneno"]];
export const RUNE_ELEMENTS = [["vento","Ar"],["agua","Água"],["terra","Terra"],["fogo","Fogo"]];
const hasElement = (list, id) => list.some(([key]) => key === id);

export const usesRacialRules = system => !system.monsterRules && !system.animalRules && !system.monsterHumanoidRules;
const originOf = system => usesRacialRules(system) && Object.hasOwn(RACES,system.race) ? RACES[system.race] : null;
export const racialGradeFloor = (system, group, key) => Number(group === "attribute" && !!originOf(system)?.favored.includes(key));

export function racialBand(system, group, key) {
  if (racialGradeFloor(system,group,key)) return "discount";
  return originOf(system)?.increased.includes(group+":"+key) ? "elevated" : "normal";
}

export function gradeXPTable(system, group, key) {
  const attribute = group === "attribute";
  if (attribute && (system.monsterRules || system.monsterHumanoidRules)) return XP_TRAINING;
  const band = racialBand(system,group,key);
  if (band === "discount") return discountedAttribute;
  if (band === "elevated") return attribute ? XP_TRAINING : increasedTraining;
  return attribute ? XP_ATTRIBUTE : XP_TRAINING;
}

export function racialChoicesComplete(system) {
  if (!originOf(system)) return true;
  if (system.race === "lucker_puro") return hasElement(PURE_ELEMENTS,system.pureElement);
  if (system.race !== "runa_espinhos") return true;
  const elements = system.runeElements;
  return hasElement(RUNE_ELEMENTS,elements?.[0]);
}

export function racialGrants(system) {
  if (!originOf(system)) return [];
  if (system.race === "humano") return ["maestria-armas-fogo"];
  if (system.race === "lucker_sangue") return ["sangue"];
  if (system.race === "lucker_puro") {
    return ["criar-item-foco-magia", ...(hasElement(PURE_ELEMENTS,system.pureElement) ? [system.pureElement] : [])];
  }
  if (system.race === "runa_espinhos") {
    const first = system.runeElements?.[0];
    return ["pugilismo","criar-item-foco-magia","escudo-arcano", ...(hasElement(RUNE_ELEMENTS,first) ? [first] : [])];
  }
  return [];
}

const exclusiveOrigins = {"maestria-armas-fogo":"humano","transfusao-sanguinaria":"lucker_sangue"};
export const canUseRacialSkill = (system,id) => !Object.hasOwn(exclusiveOrigins,id) ||
  (usesRacialRules(system) && system.race === exclusiveOrigins[id]);
export const allOwnedSkills = system => [...new Set([...(system.skills ?? []), ...racialGrants(system)])]
 .filter(id=>!internalBardEffect(id)&&canUseRacialSkill(system,id));
export const hasSkill = (system, id) => !internalBardEffect(id) && canUseRacialSkill(system,id) && Boolean(system.skills?.includes(id) ||
  (id === "maestria-manejo-duplo" && system.skills?.includes("manejo-duplo")) || racialGrants(system).includes(id));
export const isRuna = system => usesRacialRules(system) && system.race === "runa_espinhos";
export const skillNameFor = (system,skill) => isRuna(system) && skill.id === "escudo-arcano" ? "Escudo Rúnico" : skill.name;

export function withRacialOrigin(system, {race,pureElement,runeElements} = {}) {
  if (!usesRacialRules(system) || !Object.hasOwn(RACES,race)) throw Error("Origem inválida para esta ficha.");
  const next = {...system,race,attributes:{...system.attributes},
    pureElement:race === "lucker_puro" && hasElement(PURE_ELEMENTS,pureElement) ? pureElement : "",
    runeElements:race === "runa_espinhos" && Array.isArray(runeElements) ?
      [hasElement(RUNE_ELEMENTS,runeElements[0]) ? runeElements[0] : "",
        ...((system.race===race ? system.runeElements : []) ?? []).slice(1)] : []};
  const favored = RACES[race].favored;
  const previous = (system.racialInitialAttributes ?? []).filter(key => RACES[system.race]?.favored.includes(key));
  for (const key of previous) {
    if (!favored.includes(key) && next.attributes[key] === 1) next.attributes[key] = 0;
  }
  next.racialInitialAttributes = favored.filter(key => previous.includes(key) || !next.attributes[key]);
  for (const key of favored) next.attributes[key] = Math.max(1,next.attributes[key] ?? 0);
  return next;
}
