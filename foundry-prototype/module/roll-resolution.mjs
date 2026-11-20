import {buildPool, resolveRoll, compareKeptOptions, affinity, keepLimit, maxCourage, passiveAnticipar,monsterCap, sourceLabel, faceSymbols, healthByLife} from "./rules.mjs";
import {equippedDie} from "./equipment-logic.mjs";
import {lookupTarget} from "./roll-targets.mjs";
import {escapeHTML, rollPool} from "./roll-engine.mjs";
import {faceIcons} from "./dice-icons.mjs";
import {hasSkill} from "./races.mjs";

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
  if(system.transformation?.kind==='animal'&&input.mode==='conjuracao')throw Error('A forma animal não pode conjurar.');
  if(system.transformation?.kind==='animal'&&(system.transformation.pendingAttributes?.length||system.transformation.lifePending))throw Error('O aprimoramento destes dados ou a Vida da forma exige adjudicação. Consulte o Narrador antes da rolagem automática.');
  const {
    mode = "normal", de = 1, situation = "neutral", stepDieId = "", equipmentId = "",
    attackWeight, targetWeight,
  } = input;
  if (!["normal", "armas", "conjuracao"].includes(mode)) throw Error("Modo de rolagem inválido.");
  if(mode==='conjuracao'&&!equipmentId){
    const skill=input.element==='psiquico'?'criar-item-foco-magia':input.element;
    if(!['psiquico','vento','agua','terra','fogo','sagrado','sangue','trevas','veneno'].includes(input.element)||!hasSkill(system,skill))throw Error('Selecione um elemento adquirido.');
    if(typeof input.sourceContext!=='string'||!input.sourceContext.trim()||input.sourceContext.length>500)throw Error('Descreva a fonte elemental e a preparação para o Narrador.');
  }
  if (!Number.isInteger(de) || de < 0 || de > 30) throw Error("Informe uma DE inteira de 0 a 30.");
  if (![stepDieId, equipmentId].every(id => typeof id === "string")) throw Error("Fonte de dado inválida.");
  const step = !system.animalRules && input.step === true;
  const extraKeep = system.animalRules ? 0 : Math.max(0, Math.min(system.monsterRules ? 2 : 1, Math.trunc(Number(input.extraKeep)) || 0));
  const health = actor.type==="character" && system.life ? healthByLife(system,system.life.value) : null;
  if(health?.id==="morto")throw Error("Vida zero: o personagem não pode agir.");
  if(step&&system.courage<1)throw Error("Coragem insuficiente para reforçar o dado.");
  if((health?.coragem??0)+Number(step)>system.courage)throw Error("Coragem insuficiente para agir neste estado de Saúde.");
  const scene = game.scenes.get(sceneId);
  const combat = game.combats.find(entry => entry.started && entry.scene?.id === scene?.id);
  const target = lookupTarget(game, user, sceneId, targetIds, input.targetDodges === true);
  const item = actor.items.get(equipmentId);
  const equipmentDie = item ? equippedDie(actor, item, mode) : 0;
  if (equipmentId && !equipmentDie) throw Error("Equipamento não habilitado por Perícia ou elemento.");
  const plan = buildPool(system, selection, {
    mode, contextApproved: input.contextApproved === true, step, stepDieId, equipmentDie,
  });
  if (!plan.ok) throw Error(plan.errors.join(" "));
  const elevation = combat ? `${combat.id}:${combat.round}` : null;
  if (step && elevation && actor.getFlag(rollNamespace, "lastElevation") === elevation) {
    throw Error("O reforço comum já foi usado nesta rodada.");
  }
  const requestedCost = Number(input.activationPavor ?? 1);
  if (![1, 2, 3].includes(requestedCost)) throw Error("Custo de ativação local inválido.");
  const activationCost = costToActivate(actor, combat, requestedCost);
  if (activationCost > (system.pavorLocal ?? 0)) throw Error("Pavor local insuficiente para a ativação.");
  const {dice, formula, roll} = await rollPool(plan.pool);
  const pending = {
    version: 5, id: foundry.utils.randomID(), created: Date.now(), requester: user.id,
    base: selection.base, second: selection.second ?? selection.attribute, complement: selection.complement ?? null,
    formula, dice, selected: [], options: {
      health, mode, equipmentId, element:input.element??'',sourceContext:input.sourceContext??'',de: target && !target.publicDefense ? null : (target?.de ?? de), privateDefense: Boolean(target && !target.publicDefense), situation, step, extraKeep,bonusA:passiveAnticipar(system,selection),
      stepPaid: step, activationCost, combatId: combat?.id ?? null, combatRound: combat?.round ?? null, threatGrade: system.threatGrade,
      attackWeight, targetWeight, weightEnabled: input.weightEnabled === true,
      noisy: Boolean(item?.system.properties?.includes("Barulhenta")),
      targetActorUuid: target?.actorUuid ?? null, targetTokenUuid: target?.tokenUuid ?? null, targetName: target?.name ?? "",
      cancelP: 0, convertPairs: 0, characteristic: "", secondCharacteristic: "", activationPayment: "courage",
    },
  };
  const changes = {};
  if (step) {
    changes["system.courage"] = system.courage - 1;
    if (elevation) changes[`flags.${rollNamespace}.lastElevation`] = elevation;
  }
  return {pending, roll, changes, privateDE: target?.de};
}

function optionsFor(actor, options) {
  const s = actor.system;
  return {
    ...options, step: options.step && !options.stepPaid, level: keepLevel(actor), courage: s.courage - (options.health?.coragem??0), monster: s.monsterRules,
    animal: s.animalRules, threatGrade: s.threatGrade, hostile: actor.type !== "character",
    weight: options.weightEnabled ? affinity(options.attackWeight, options.targetWeight) : 0,
  };
}

export function alternativesFor(actor, pending, de = pending.options.de) {
  return compareKeptOptions(pending.dice, {...optionsFor(actor, pending.options), legacyD4Faces:pending.version!=null&&pending.version<4, de}, 4);
}

export function rollResult(actor, pending, de = pending.options.de) {
  const options = {...optionsFor(actor, pending.options), legacyD4Faces:pending.version!=null&&pending.version<4, de};
  const kept = pending.dice.filter(die => pending.selected.includes(die.id));
  const critical = kept.length >= 2 && kept.every(die => die.face === die.sides);
  const bonusP = options.noisy ? (critical ? 2 : 1) : 0;
  return resolveRoll(pending.dice, pending.selected, {...options, bonusP});
}

export function resolvePendingRoll(actor, pending, game, de = pending.options.de) {
  const s = actor.system;
  const o = pending.options;
  if (o.threatGrade != null && actor.type !== "character" && o.threatGrade !== s.threatGrade) {
    throw Error("O Grau mudou. Descarte esta rolagem e prepare outra.");
  }
  const result = rollResult(actor, pending, de);
  if (!result.ok) throw Error(result.errors.join(" "));

  const extra = Math.max(0, pending.selected.length - keepForActor(actor, 0));
  let courage = (o.health?.coragem??0) + Number(Boolean(o.step && !o.stepPaid)) + (usesLocal(actor) ? 0 : extra);
  const pavor = (o.activationCost ?? costToActivate(actor, game.combat?.started)) + (usesLocal(actor) ? extra : 0);
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
      if(o.activationPayment==='pp')throw Error('PP foi revogado. Selecione Coragem para a ativação.');
      courage += 1;
    }
  }

  if (courage > s.courage || pavor > s.pavorLocal) throw Error("Recursos insuficientes para confirmar.");
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
  const form=s.transformation;
  if(form?.kind==='animal'&&((form.size==='media'&&result.p>result.e)||(form.size==='grande'&&result.p>0)))changes['system.transformation']={};
  if (courage || result.criticalRefundCourage) changes["system.courage"] = Math.min(Math.max(s.courage,maxCourage(s.level)), s.courage - courage + result.criticalRefundCourage);
  if (pavor || localReward) changes["system.pavorLocal"] = localAfterCost + localReward;
  // Dados rolados uma única vez; o chat informa a face e as runas de cada dado.
  const chosenIds=new Set(pending.selected);
  const cards=pending.dice.map(die=>{
    const chosen=chosenIds.has(die.id),symbols=die.symbols??faceSymbols(die.sides,die.face,pending.version<4);
    const marks=faceIcons(symbols);
    return '<div class="codex-chat-die '+(chosen?'is-kept':'is-discarded')+'" role="listitem">'+
      '<div class="codex-chat-die-kind">d'+die.sides+' · '+escapeHTML(sourceLabel(die.group,die.key))+(die.elevated?" · Elevação":die.reinforced?" · Reforço legado":"")+'</div>'+
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
    ${o.sourceContext?'<p>Fonte e preparação · '+escapeHTML(o.sourceContext)+'</p>':''}
    <p>Total ${result.reached} · DE ${o.privateDefense ? "reservada" : result.de} · ᛋ ${result.e} · ᚨ ${result.aRemaining} · ᚦ ${result.p}</p>
    ${result.critical ? `<p>Crítico · ${result.critical} faces máximas mantidas.</p>` : ""}
    ${active.length ? `<p>Características · ${active.map(escapeHTML).join(", ")}.</p>` : ""}
    <p>Dano básico ${result.damage} · Narrador aplica à Integridade/Vida e decide condições.</p>
    ${o.health ? `<p>Saúde ao agir · ${o.health.label}.</p>` : ""}
    <p>Custo · ${courage + Number(Boolean(o.stepPaid))} Coragem, ${pavor} Pavor local.</p>
    ${ally ? `<p>1A para passar a oportunidade a ${escapeHTML(ally.name)} · validação do Narrador.</p>` : ""}
    ${result.p ? `<p>Pavor residual · ${result.p}P para o Narrador encaminhar conforme o alvo.</p>` : ""}
    ${overflow ? `<p>Crítico · ${overflow}P excedentes para a reserva pública, até o teto.</p>` : ""}
    <p class="codex-chat-dice-heading">Dados rolados · ${pending.selected.length} de ${pending.dice.length} mantidos</p>\n    ${kept}</div>`;
  const {selected, ...summary} = publicRollResult(result, o.privateDefense);
  const combat = game.combats.get(o.combatId);
  const adjudication = {
    combatId: combat?.id ?? null, round: o.combatRound ?? combat?.round ?? null, allyId: ally?.id ?? null,
    targetUuid: o.targetActorUuid, p: result.p,
  };
  return {changes, content, result: {...summary, costs: {courage, pavor}, localReward, overflow}, adjudication};
}

export function publicRollResult(result, privateDefense) {
  if (!privateDefense) return result;
  const {de, ...visible} = result;
  return visible;
}
