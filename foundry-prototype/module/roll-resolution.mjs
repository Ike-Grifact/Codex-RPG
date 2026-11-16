import {buildPool, resolveRoll, compareKeptOptions, affinity, keepLimit, maxPP, monsterCap, sourceLabel, faceSymbols} from "./rules.mjs";
import {defenseDE, dodgeDE, equippedDie} from "./equipment-logic.mjs";
import {escapeHTML, rollPool} from "./roll-engine.mjs";
import {faceIcons} from "./dice-icons.mjs";

export const rollNamespace = "codex-rpg-foundry";
const humanoid = actor => ["humanoid", "monsterHumanoid"].includes(actor.type);
export const usesLocal = actor => actor.type === "creature" || actor.type === "animal";
export const keepLevel = actor => humanoid(actor) ? (actor.system.threatGrade >= 2 ? 6 : 1) : actor.system.level;
export const keepForActor = (actor, extra) => actor.system.animalRules ? 2 : keepLimit(
  actor.system.monsterRules ? actor.system.threatGrade : keepLevel(actor), extra, actor.system.monsterRules,
);
const costToActivate = (actor, combat, requested = 1) => actor.type !== "character" && !actor.system.animalRules && combat ? requested : 0;

export async function preparePendingRoll(actor, request, user, game) {
  const {selection, options: input = {}, sceneId, targetIds = []} = request;
  if (!selection || !Array.isArray(targetIds) || targetIds.length > 1) throw Error("Selecione no máximo um alvo.");
  const system = actor.system;
  const {
    mode = "normal", de = 1, situation = "neutral", stepDieId = "", equipmentId = "",
    attackWeight, targetWeight,
  } = input;
  if (!["normal", "armas", "conjuracao"].includes(mode)) throw Error("Modo de rolagem inválido.");
  if (!Number.isInteger(de) || de < 0 || de > 30) throw Error("Informe uma DE inteira de 0 a 30.");
  if (![stepDieId, equipmentId].every(id => typeof id === "string")) throw Error("Fonte de dado inválida.");
  const step = !system.animalRules && input.step === true;
  const extraKeep = system.animalRules ? 0 : Math.max(0, Math.min(system.monsterRules ? 2 : 1, Math.trunc(Number(input.extraKeep)) || 0));
  const scene = game.scenes.get(sceneId);
  const combat = game.combats.find(entry => entry.started && entry.scene?.id === scene?.id);
  const target = combat && targetIds.length ? scene?.tokens.get(targetIds[0])?.actor : null;
  if (combat && targetIds.length && !target?.system.attributes) throw Error("Token alvo sem ficha válida.");
  const item = actor.items.get(equipmentId);
  const equipmentDie = item ? equippedDie(actor, item, mode) : 0;
  if (equipmentId && !equipmentDie) throw Error("Equipamento não habilitado por Perícia ou elemento.");
  const plan = buildPool(system, selection, {
    mode, contextApproved: input.contextApproved === true, step, stepDieId, equipmentDie,
  });
  if (!plan.ok) throw Error(plan.errors.join(" "));
  if (step && system.courage < 1) throw Error("Coragem insuficiente para elevar o dado.");
  const elevation = combat ? `${combat.id}:${combat.round}` : null;
  if (step && elevation && actor.getFlag(rollNamespace, "lastElevation") === elevation) {
    throw Error("A elevação comum já foi usada nesta rodada.");
  }
  const requestedCost = Number(input.activationPavor ?? 1);
  if (![1, 2, 3].includes(requestedCost)) throw Error("Custo de ativação local inválido.");
  const activationCost = costToActivate(actor, combat, requestedCost);
  if (activationCost > (system.pavorLocal ?? 0)) throw Error("Pavor local insuficiente para a ativação.");
  const {dice, formula, roll} = await rollPool(plan.pool);
  const pending = {
    version: 3, id: foundry.utils.randomID(), created: Date.now(), requester: user.id,
    base: selection.base, second: selection.second ?? selection.attribute, complement: selection.complement ?? null,
    formula, dice, selected: [], options: {
      mode, equipmentId, de: target ? (input.targetDodges === true ? dodgeDE(target) : defenseDE(target)) : de, situation, step, extraKeep,
      stepPaid: step, activationCost, combatId: combat?.id ?? null, combatRound: combat?.round ?? null, threatGrade: system.threatGrade,
      attackWeight, targetWeight, weightEnabled: input.weightEnabled === true,
      noisy: Boolean(item?.system.properties?.includes("Barulhenta")),
      targetActorUuid: target?.uuid ?? null, targetName: target?.name ?? "",
      cancelP: 0, convertPairs: 0, characteristic: "", secondCharacteristic: "", activationPayment: "courage",
    },
  };
  const changes = {};
  if (step) {
    changes["system.courage"] = system.courage - 1;
    if (elevation) changes[`flags.${rollNamespace}.lastElevation`] = elevation;
  }
  return {pending, roll, changes};
}

function optionsFor(actor, options) {
  const s = actor.system;
  return {
    ...options, step: options.step && !options.stepPaid, level: keepLevel(actor), courage: s.courage, monster: s.monsterRules,
    animal: s.animalRules, threatGrade: s.threatGrade, hostile: actor.type !== "character",
    weight: options.weightEnabled ? affinity(options.attackWeight, options.targetWeight) : 0,
  };
}

export function alternativesFor(actor, pending) {
  return compareKeptOptions(pending.dice, optionsFor(actor, pending.options), 4);
}

export function rollResult(actor, pending) {
  const options = optionsFor(actor, pending.options);
  const kept = pending.dice.filter(die => pending.selected.includes(die.id));
  const critical = kept.length >= 2 && kept.every(die => die.face === die.sides);
  const bonusP = options.noisy ? (critical ? 2 : 1) : 0;
  return resolveRoll(pending.dice, pending.selected, {...options, bonusP});
}

export function resolvePendingRoll(actor, pending, game) {
  const s = actor.system;
  const o = pending.options;
  if (o.threatGrade != null && actor.type !== "character" && o.threatGrade !== s.threatGrade) {
    throw Error("O Grau mudou. Descarte esta rolagem e prepare outra.");
  }
  const result = rollResult(actor, pending);
  if (!result.ok) throw Error(result.errors.join(" "));

  const extra = Math.max(0, pending.selected.length - keepForActor(actor, 0));
  let courage = Number(Boolean(o.step && !o.stepPaid)) + (usesLocal(actor) ? 0 : extra);
  const pavor = (o.activationCost ?? costToActivate(actor, game.combat?.started)) + (usesLocal(actor) ? extra : 0);
  let pp = 0;
  const item = actor.items.get(o.equipmentId);
  const active = [o.characteristic, o.secondCharacteristic].filter(Boolean);
  if (active.length) {
    if (!result.success || !equippedDie(actor, item, o.mode) || active.some(name => !item.system.properties.includes(name))) {
      throw Error("A característica exige acerto e equipamento habilitado.");
    }
    if (o.secondCharacteristic && (!o.characteristic || !result.critical || active[0] === active[1])) {
      throw Error("A segunda característica exige duas escolhas distintas em um acerto crítico.");
    }
    if (!result.critical || active.length === 2) {
      if (actor.type !== "character") throw Error("Custo de técnica paga para a oposição pendente de adjudicação.");
      if (o.activationPayment === "pp") pp = 1;
      else courage += 1;
    }
  }

  if (courage > s.courage || pp > s.pp || pavor > s.pavorLocal) throw Error("Recursos insuficientes para confirmar.");
  let ally;
  if (o.passAllyId) {
    const combat = game.combats.get(o.combatId);
    ally = combat?.combatants.get(o.passAllyId);
    if (!combat?.started || (o.combatRound != null && combat.round !== o.combatRound) || !ally?.actor || ally.actor.uuid === actor.uuid || ally.actor.uuid === o.targetActorUuid
      || result.aRemaining < 1) throw Error("Para passar a oportunidade, escolha um aliado e reserve 1 Antecipar.");
    result.aRemaining -= 1;
  }
  const localAfterCost = s.pavorLocal - pavor;
  const localReward = Math.min(result.monsterCriticalPavor, Math.max(0, monsterCap(s.threatGrade) - localAfterCost));
  const changes = {};
  if (courage || result.criticalRefundCourage) changes["system.courage"] = Math.min(10, s.courage - courage + result.criticalRefundCourage);
  if (pp || result.criticalRefundPP) changes["system.pp"] = Math.min(maxPP(s.level), s.pp - pp + result.criticalRefundPP);
  if (pavor || localReward) changes["system.pavorLocal"] = localAfterCost + localReward;
  // Dados rolados uma única vez; o chat informa a face e as runas de cada dado.
  const chosenIds=new Set(pending.selected);
  const cards=pending.dice.map(die=>{
    const chosen=chosenIds.has(die.id),symbols=die.symbols??faceSymbols(die.sides,die.face);
    const marks=faceIcons(symbols);
    return '<div class="codex-chat-die '+(chosen?'is-kept':'is-discarded')+'" role="listitem">'+
      '<div class="codex-chat-die-kind">d'+die.sides+' · '+escapeHTML(sourceLabel(die.group,die.key))+'</div>'+
      '<div class="codex-chat-die-face codex-face-icons" role="img" aria-label="Face '+die.face+'">'+marks+'</div>'+
      '<div class="codex-chat-die-marks">'+(chosen?'Mantido na ação':'Não mantido')+'</div>'+
      '<small>'+(chosen?'MANTIDO':'DESCARTADO')+'</small></div>';
  }).join("");
  const kept='<div class="codex-chat-dice" role="list">'+cards+'</div>';
  const sources = [pending.base, pending.second ?? pending.attribute, pending.complement].filter(Boolean)
    .map(source => escapeHTML(sourceLabel(source.group, source.key))).join(" + ");
  const overflow = result.monsterCriticalPavor - localReward;
  const content = `<div class="codex-chat-result"><h3>Codex RPG · ${escapeHTML(result.outcome)}</h3>
    <p>${sources}${o.targetName ? ` · Alvo ${escapeHTML(o.targetName)}` : ""}</p>
    <p>DE ${result.reached}/${result.de} · ᛋ ${result.e} · ᚨ ${result.aRemaining} · ᚦ ${result.p}</p>
    ${result.critical ? `<p>Crítico · ${result.critical} faces máximas mantidas.</p>` : ""}
    ${active.length ? `<p>Características · ${active.map(escapeHTML).join(", ")}.</p>` : ""}
    <p>Dano básico ${result.damage} · Narrador aplica à Integridade/Vida e decide condições.</p>
    <p>Custo · ${courage + Number(Boolean(o.stepPaid))} Coragem, ${pp} PP, ${pavor} Pavor local.</p>
    ${ally ? `<p>1A para passar a oportunidade a ${escapeHTML(ally.name)} · validação do Narrador.</p>` : ""}
    ${result.p ? `<p>Pavor residual · ${result.p}P para o Narrador encaminhar conforme o alvo.</p>` : ""}
    ${overflow ? `<p>Crítico · ${overflow}P excedentes para a reserva pública, até o teto.</p>` : ""}
    <p class="codex-chat-dice-heading">Dados rolados · ${pending.selected.length} de ${pending.dice.length} mantidos</p>\n    ${kept}</div>`;
  const {selected, ...summary} = result;
  const combat = game.combats.get(o.combatId);
  const adjudication = {
    combatId: combat?.id ?? null, round: o.combatRound ?? combat?.round ?? null, allyId: ally?.id ?? null,
    targetUuid: o.targetActorUuid, p: result.p,
  };
  return {changes, content, result: {...summary, costs: {courage, pp, pavor}, localReward, overflow}, adjudication};
}
