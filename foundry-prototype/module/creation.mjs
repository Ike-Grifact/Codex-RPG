import {catalogArmorMigration} from "./equipment-migration.mjs";
import {ATTRIBUTES, KNOWLEDGES, PRACTICES, SKILLS, lifeMax, maxPP,maxCourage, monsterCap} from "./rules.mjs";
import {G1_CATALOG} from "./catalog.mjs";
import {bardEffectItem,internalBardEffect,splitBardSkills} from "./bard.mjs";
import {RACES, withRacialOrigin, usesRacialRules, legacyPureElementUpdate} from "./races.mjs";

export const actorKinds = {
  character: "Aprendiz / personagem",
  humanoid: "Humanoide / NPC",
  monsterHumanoid: "Humanoide Monstro",
  animal: "Criatura comum / animal",
  creature: "Criatura / Monstro",
};
export const itemKinds = {
  ammunition:'Munição',container:'Aljava ou estojo',instrument:'Instrumento',kit:'Kit',adventurer:'Equipamento de aventureiro',
  weapon: "Arma", firearm: "Arma de fogo", armor: "Armadura", shield: "Escudo", focus: "Foco",
  tool: "Ferramenta", resource: "Recurso de troca", consumable: "Consumível", misc: "Outro",
};
const resources = {ervas: "Ervas", espolios: "Espólios", couro: "Couro", comida: "Comida", minerios: "Minérios"};
const weights = {muito_leve: .0125, leve: .125, medio: .5, alto: 1, extremo: 2};
const categories = {muito_leve: "muito-leve", leve: "leve", medio: "medio", alto: "pesado", extremo: "muito-pesado"};
const webItemTypes = {arma: "weapon", armadura: "armor", escudo: "shield", foco: "focus", ferramenta: "tool", outro: "misc"};
const encounterTypes = {criatura: "animal", monstro: "creature", humanoide: "humanoid", humanoideMonstro: "monsterHumanoid", "humanoide-monstro": "monsterHumanoid", humanoide_monstro: "monsterHumanoid"};
const supportedSkills = new Set([...SKILLS.map(skill => skill.id),"manejo-duplo"]);
const text = (value, limit = 160) => typeof value === "string" ? value.trim().slice(0, limit) : "";
const number = (value, min, max) => {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, n)) : min;
};
const integer = (value, min, max) => Math.floor(number(value, min, max));
const grades = (definitions, source) => Object.fromEntries(
  definitions.map(([id]) => [id, integer(source?.[id], 0, 6)]),
);

export function actorData(type, raw = {}, quick = false) {
  if (!Object.hasOwn(actorKinds, type)) throw new Error("Escolha um tipo de ficha válido.");
  const animal = type === "animal";
  const monster = type === "creature";
  const ids=animal||monster||!Array.isArray(raw.skills)?[]:
    [...new Set(raw.skills.filter(id=>typeof id==='string'&&id.length<=100).slice(0,500))];
  const {skills,historical}=splitBardSkills(ids);
  let system = {
    creationBudget:15,
    level: integer(raw.level, 1, 20),
    threatGrade: integer(raw.threatGrade, 1, 6),
    xp: integer(raw.xp, 0, 10000000),
    concept: text(raw.concept),
    origin: text(raw.origin) || (animal || monster ? "Criatura" : ""),
    race:"",
    perseverancaUsed:raw.perseverancaUsed===true,
    runeShieldFreeUsed:raw.runeShieldFreeUsed===true,
    spiritualSpheres:{count:integer(raw.spiritualSpheres?.count,0,5),createdThisRound:integer(raw.spiritualSpheres?.createdThisRound,0,5),round:""},
    virtue: text(raw.virtue),
    personality: text(raw.personality),
    notes: text(raw.notes, 5000),
    abilities: text(raw.abilities, 4000),
    leader: raw.leader === true,
    animalRules: animal,
    monsterRules: monster,
    monsterHumanoidRules: type === "monsterHumanoid",
    attributes: grades(ATTRIBUTES, raw.attributes),
    knowledges: animal || monster ? {} : grades(KNOWLEDGES, raw.knowledges),
    practices: animal || monster ? {} : grades(PRACTICES, raw.practices),
    skills,
    courage: type==="character"?integer(raw.courage ?? 10, 0, maxCourage(integer(raw.level,1,20))):0,
    pavorLocal: integer(raw.pavorLocal, 0, monsterCap(raw.threatGrade)),
  };
  if (quick && type === "humanoid") {
    system.attributes.forca = 1;
    system.practices.armas_conjuracao = 1;
  }
  if(usesRacialRules(system)&&raw.race!==""){
    const race=Object.hasOwn(RACES,raw.race)?raw.race:"humano";
    const recorded=Array.isArray(raw.racialInitialAttributes)?raw.racialInitialAttributes.filter(key=>RACES[race].favored.includes(key)):[];
    system=withRacialOrigin({...system,race,runeElements:Array.isArray(raw.runeElements)?raw.runeElements.slice(0,2).map(value=>text(value,20)):[],racialInitialAttributes:recorded},{...raw,race});
  }
  const historicalElement=legacyPureElementUpdate({...system,pureElement:raw.pureElement});
  if(historicalElement["system.notes"]!==undefined)system.notes=historicalElement["system.notes"];
  system.pp = integer(raw.pp, 0, maxPP(system.level));
  const companion=raw.smallCompanion??raw.companion;
  if(companion)system.companion={name:text(companion.name,70),species:companion.species==="serpente"?"serpente":"outro",present:companion.present===true};
  system.life = {value: integer(raw.life ?? lifeMax(system), 0, lifeMax(system))};
  return {name: text(raw.name) || (quick && type === "humanoid" ? "Humano comum" : actorKinds[type]), type, system,
    ...(historical.length?{flags:{"codex-rpg-foundry":{bardLegacy:{ids:historical}}}}:{})};
}

export function equipmentData(kind, name, catalogIndex = "") {
  if (catalogIndex !== "") {
    const index = Number(catalogIndex);
    const row = Number.isInteger(index) && index >= 0 ? G1_CATALOG[index] : undefined;
    if (!row) throw new Error("Escolha um item do catálogo válido.");
    const {name: catalogName, ...system} = structuredClone(row);
    return {name: text(name) || catalogName, type: "equipment", system};
  }
  if (!Object.hasOwn(itemKinds, kind)) throw new Error("Escolha um tipo de item válido.");
  return {name: text(name) || itemKinds[kind], type: "equipment", system: {kind}};
}

function webItem(raw) {
  const catalog=G1_CATALOG.find(row=>row.name===raw.catalogId);
  const kind = catalog?.kind ?? (raw.firearm && raw.type === "arma" ? "firearm"
    : Object.hasOwn(webItemTypes, raw.type) ? webItemTypes[raw.type] : "misc");
  const max = integer(raw.max, 0, 999);
  const durabilityMax = integer(raw.durabilityMax, 0, 999);
  const properties = Array.isArray(raw.properties) ? raw.properties.map(value => text(value)).filter(Boolean).slice(0, 24) : [];
  const className = Object.hasOwn(categories, raw.weight) ? categories[raw.weight] : "leve";
  const category = Object.hasOwn(categories, raw.category) ? categories[raw.category] : raw.category;
  const resistance = ["elementalResistance", "secondResistance", "specificImmunity"]
    .map(field => text(raw[field])).filter(Boolean);
  const item = {
    name: text(raw.name) || itemKinds[kind],
    type: "equipment",
    flags:{'codex-rpg-foundry':{webOriginal:structuredClone(raw)}},
    system: {
      catalogId:text(raw.catalogId),packSize:integer(raw.packSize,0,100000),storageCapacity:integer(raw.storageCapacity,0,100000),
      ammo:{value:integer(raw.ammoRemaining,0,100000),max:integer(Math.max(raw.packSize||0,raw.ammoRemaining||0),0,100000),reload:0,cartucho:''},
      associatedEquipment:text(raw.associatedEquipment),embeddedWeapon:text(raw.embeddedWeapon),
      kind, grade: integer(raw.grade, 1, 7), quantity: integer(raw.qty, 1, 99),
      weight: (Object.hasOwn(weights, raw.weight) ? weights[raw.weight] : weights.leve) * (properties.includes("Muito Leve") ? .5 : 1),
      category: Object.values(categories).includes(category) ? category : className,
      die: [6, 10, 12].includes(Number(raw.die)) ? Number(raw.die) : 0,
      focusCharges:kind==='focus'?integer(raw.focusCharges??raw.grade??1,0,integer(raw.grade,1,7)):null,
      equipped: raw.equipped === true, range: integer(raw.range, 0, 1000),
      priceVT: integer(raw.priceVT, 0, 10000), properties, element: text(raw.element, 40),
      integrity: {value: integer(raw.hp ?? max, 0, max), max},
      durability: {value: integer(raw.durability, 0, durabilityMax), max: durabilityMax},
      description: resistance.length ? "Proteção registrada no site: " + resistance.join(" · ") : "",
    },
  };
  item.system.integrity = catalogArmorMigration(item) ?? item.system.integrity;
  return item;
}

function encounterItem(raw) {
  return {
    name: text(raw.name) || "Equipamento do conflito", type: "equipment",
    system: {kind: "misc", weight: number(raw.weight, 0, 100), quantity: integer(raw.qty, 1, 99)},
  };
}

function tradeItems(raw) {
  return Object.entries(resources).flatMap(([key, name]) => {
    const quantity = integer(raw?.[key], 0, 100000);
    return quantity ? [{name, type: "equipment", system: {kind: "resource", weight: .0125, quantity, priceVT: 1}}] : [];
  });
}

function validEntries(entries, maximum) {
  return Array.isArray(entries) ? entries.filter(row => row && typeof row === "object").slice(0, maximum) : [];
}

export function importSiteData(payload, characterType = "character") {
  if (payload?.schema === "codex-conflito-v1") {
    const roster = validEntries(payload.roster, 100);
    if (!roster.length) throw new Error("O arquivo não tem fichas de conflito.");
    return roster.map(row => {
      if (!Object.hasOwn(encounterTypes, row.kind)) throw new Error("O conflito contém um tipo de ficha desconhecido.");
      return {...actorData(encounterTypes[row.kind], row), items: validEntries(row.items, 70).map(encounterItem)};
    });
  }

  const raw = payload?.character ?? payload;
  if (raw?.schema !== "codex-html-playtest-v1") {
    throw new Error("Use um JSON exportado pelo Criador de Fichas ou pelo Criar Conflito.");
  }
  if (!raw || typeof raw !== "object" || !["character", "humanoid"].includes(characterType)) {
    throw new Error("Escolha Personagem ou Humanoide para importar a ficha do Criador.");
  }
  const xp = integer(raw.xpEarned ?? raw.xp, 0, 1000000) + integer(raw.legacyXPRefund, 0, 1000000);
  const actor = actorData(characterType, {...raw,race:Object.hasOwn(RACES,raw.race)?raw.race:"",xp});
  const unknown = Array.isArray(raw.skills)
    ? raw.skills.filter(id => typeof id === "string" && !supportedSkills.has(id) && !internalBardEffect(id)) : [];
  if (unknown.length) {
    actor.system.notes = [actor.system.notes, "Perícias do site sem equivalente automatizado: " + unknown.join(", ")]
      .filter(Boolean).join("\n").slice(0, 5000);
  }
  const items=validEntries(raw.items,100);
  const historicalItems=items.filter(bardEffectItem);
  const codexFlags={...actor.flags?.["codex-rpg-foundry"],imported:true,sourceTrade:structuredClone(raw.trade??{})};
  if(historicalItems.length)codexFlags.bardLegacy={...codexFlags.bardLegacy,items:structuredClone(historicalItems)};
  return [{...actor,flags:{"codex-rpg-foundry":codexFlags},
    items:[...items.filter(item=>!bardEffectItem(item)).map(webItem),...tradeItems(raw.trade?.resources)]}];
}
