import {buildPool, resolveRoll, compareKeptOptions, affinity, keepLimit, maxCourage, passiveAnticipar,monsterCap, sourceLabel, faceSymbols, healthByLife,criticalCount,isMaximumFace} from "./rules.mjs";
import {equippedDie} from "./equipment-logic.mjs";
import {lookupTarget} from "./roll-targets.mjs";
import {escapeHTML, rollPool} from "./roll-engine.mjs";
import {faceIcons} from "./dice-icons.mjs";
import {canAsura,canUseTechnique,sphereRound,sphereState} from "./techniques.mjs";
import {spellPlan,focusCharges,runeBarrier,ELEMENTS} from "./conjuration.mjs";

export const rollNamespace = "codex-rpg-foundry";
export function pendingRollEntry(actor) {
  const document = actor?.isToken ? actor.token?.delta : actor;
  const key = actor?.isToken ? "tokenPendingRoll" : "pendingRoll";
  const saved = document?.getFlag(rollNamespace, key);
  const legacy = actor?.isToken && !saved && document?.getFlag(rollNamespace, "pendingRoll");
  if (!legacy?.id) return {key, roll: saved ?? null};
  // Deltas antigos podem conter apenas os campos diferentes da ficha-base.
  const roll = actor.getFlag(rollNamespace, "pendingRoll");
  return {key: "pendingRoll", roll: {...roll, publication: legacy.publication ? roll.publication : undefined}};
}
export const pendingRollFor = actor => pendingRollEntry(actor).roll;
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
    mode = "normal", actionType = "", de = 1, situation = "neutral", stepDieId = "", equipmentId = "",
    attackWeight, targetWeight,
  } = input;
  if (!["normal", "armas", "conjuracao"].includes(mode)) throw Error("Modo de rolagem inválido.");
  if (!["","attack","spell"].includes(actionType) ||
      (actionType==="attack"&&mode!=="armas") || (actionType==="spell"&&mode!=="conjuracao")) throw Error("Ação ofensiva inválida.");
  const magic=mode==="conjuracao"?spellPlan(actor,input):null;
  if(magic?.shield&&targetIds.length)throw Error("O Escudo Rúnico é uma ação defensiva.");
  if (!Number.isInteger(de) || de < 0 || de > 30) throw Error("Informe uma DE inteira de 0 a 30.");
  if (![stepDieId, equipmentId].every(id => typeof id === "string")) throw Error("Fonte de dado inválida.");
  const step = !system.animalRules && input.step === true;
  const extraKeep = system.animalRules ? 0 : Math.max(0, Math.min(system.monsterRules ? 2 : 1, Math.trunc(Number(input.extraKeep)) || 0));
  const health = actor.type==="character" && system.life ? healthByLife(system,system.life.value) : null;
  if(health?.id==="morto")throw Error("Vida zero: o personagem não pode agir.");
  if(step&&system.courage<1)throw Error("Coragem insuficiente para reforçar o dado.");
  if((health?.coragem??0)+Number(step)+(magic?.courage??0)>system.courage)throw Error("Coragem insuficiente para agir neste estado de Saúde.");
  const scene = game.scenes.get(sceneId);
  const combat = game.combats.find(entry => entry.started && entry.scene?.id === scene?.id);
  const target = lookupTarget(game, user, sceneId, targetIds, input.targetDodges === true);
  if(actionType&&target?.actorUuid===actor.uuid)throw Error("Escolha outro token como alvo do ataque.");
  const item = actor.items.get(magic?.focusId??equipmentId);
  const equipmentDie = item ? equippedDie(actor, item, mode) : 0;
  if (!magic && equipmentId && !equipmentDie) throw Error("Equipamento não habilitado por Perícia ou elemento.");
  const element=magic?.element??"";
  const lightHands=input.lightHands===true,potionResearch=input.potionResearch===true,stealthAttack=input.stealthAttack===true;
  const asuraDieId=input.asuraDieId??"";
  const round=sphereRound(combat);
  if(lightHands&&(actionType||input.weightEnabled||!canUseTechnique(system,"maos-leves")))throw Error("Mãos Leves indisponível para esta ação.");
  if(potionResearch&&(mode!=="normal"||lightHands||!canUseTechnique(system,"pesquisa-avancada-pocoes")))throw Error("Pesquisa Avançada em Poções exige criação de poção em teste não mágico.");
  if(stealthAttack&&(actionType!=="attack"||item?.system.kind!=="weapon"||!equipmentDie||!canUseTechnique(system,"golpe-furtivo")))
    throw Error("Golpe Furtivo exige ataque com arma equipada e Perícia válida.");
  if(typeof asuraDieId!=="string"||asuraDieId&&(actionType!=="attack"||!canAsura(system,round,item)))
    throw Error("Asura exige Disciplina corpo a corpo e 5 esferas de rodada anterior.");
  const additionalCost=(magic?.courage??0)+Number(Boolean(asuraDieId));
  const preparationCost=(health?.coragem??0)+Number(step)+additionalCost+(!usesLocal(actor)?extraKeep:0);
  if(magic&&preparationCost>5)throw Error("Máximo de 5 Coragens por rolagem de conjuração.");
  if(preparationCost>system.courage)
    throw Error("Coragem insuficiente para os custos de preparação.");
  const plan = buildPool(system, selection, {
    mode, actionType, contextApproved: input.contextApproved === true, step, stepDieId, equipmentDie,lightHands,stealthAttack,asuraDieId,
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
    version: 6, id: foundry.utils.randomID(), created: Date.now(), requester: user.id,
    base: selection.base, second: selection.second ?? selection.attribute, complement: selection.complement ?? null,
    formula, dice, selected: [], options: {
      health, mode, actionType, equipmentId:item?.id??"", element, magic,asura:Boolean(asuraDieId),sphereRound:round,lightHands,potionResearch,stealthAttack,manualDamage:input.manualDamage===true,de: target && !target.publicDefense ? null : (target?.de ?? de), privateDefense: Boolean(target && !target.publicDefense), situation, step, extraKeep,bonusA:passiveAnticipar(system,selection),
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
    ...options, step: options.step && !options.stepPaid, level: keepLevel(actor), courage: s.courage - (options.health?.coragem??0) - (options.magic?.courage??0) - Number(Boolean(options.asura)), skillBonusE:Number(Boolean(options.potionResearch)), monster: s.monsterRules,
    animal: s.animalRules, threatGrade: s.threatGrade, hostile: actor.type !== "character", requireAttributeInPool:Boolean(options.actionType),
    weight: options.weightEnabled ? affinity(options.attackWeight, options.targetWeight) : 0,
  };
}

export function alternativesFor(actor, pending, de = pending.options.de) {
  return compareKeptOptions(pending.dice, {...optionsFor(actor, pending.options), legacyD4Faces:pending.version!=null&&pending.version<4, de}, 4);
}

export function rollResult(actor, pending, de = pending.options.de) {
  const options = {...optionsFor(actor, pending.options), legacyD4Faces:pending.version!=null&&pending.version<4, de};
  const kept = pending.dice.filter(die => pending.selected.includes(die.id));
  const critical = criticalCount(kept);
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
  let courage = (o.health?.coragem??0) + (o.magic?.courage??0) + Number(Boolean(o.asura)) + Number(Boolean(o.step && !o.stepPaid)) + (usesLocal(actor) ? 0 : extra);
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

  if(o.magic&&courage+Number(Boolean(o.stepPaid))>5)throw Error("Máximo de 5 Coragens por rolagem de conjuração.");
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
  const magic=o.magic;
  if(o.asura){
    const spheres=sphereState(s,o.sphereRound);
    if(!canAsura(s,o.sphereRound,item))throw Error("O Punho Supremo de Asura exige 5 Esferas Espirituais.");
    changes["system.spiritualSpheres"]={...spheres,count:0};
  }
  if(magic?.charges){
    if(!item||focusCharges(item)<magic.charges)throw Error("Cargas insuficientes no foco antes de finalizar.");
    changes.items=[...actor.items.values()].map(owned=>{
      const data=owned.toObject();
      if(owned.id===item.id)data.system.focusCharges=focusCharges(item)-magic.charges;
      return data;
    });
  }
  if(magic?.shield&&!s.runeShieldFreeUsed)changes["system.runeShieldFreeUsed"]=true;
  const form=s.transformation;
  if(form?.kind==='animal'&&((form.size==='media'&&result.p>result.e)||(form.size==='grande'&&result.p>0)))changes['system.transformation']={};
  if (courage || result.criticalRefundCourage) changes["system.courage"] = Math.min(Math.max(s.courage,maxCourage(s.level)), s.courage - courage + result.criticalRefundCourage);
  if (pavor || localReward) changes["system.pavorLocal"] = localAfterCost + localReward;
  // Dados rolados uma única vez; o chat informa a face e as runas de cada dado.
  const chosenIds=new Set(pending.selected);
  const cards=pending.dice.map(die=>{
    const chosen=chosenIds.has(die.id),symbols=die.symbols??faceSymbols(die.sides,die.face,pending.version<4);
    const maximum=isMaximumFace(die),marks=faceIcons(symbols,maximum);
    return '<div class="codex-chat-die '+(chosen?'is-kept':'is-discarded')+'" role="listitem">'+
      '<div class="codex-chat-die-kind">d'+die.sides+' · '+escapeHTML(sourceLabel(die.group,die.key))+(die.asura?" · Asura":die.elevated?" · Elevação":die.reinforced?" · Reforço legado":"")+'</div>'+
      '<div class="codex-chat-die-face codex-face-icons" role="img" aria-label="Face '+die.face+(maximum?' · máxima':'')+'">'+marks+'</div>'+
      '<div class="codex-chat-die-marks">'+(chosen?'Mantido na ação':'Não mantido')+'</div>'+
      '<small>'+(chosen?'MANTIDO':'DESCARTADO')+'</small></div>';
  }).join("");
  const kept='<div class="codex-chat-dice" role="list">'+cards+'</div>';
  const sources = [pending.base, pending.second ?? pending.attribute, pending.complement].filter(Boolean)
    .map(source => escapeHTML(sourceLabel(source.group, source.key))).join(" + ");
  const overflow = result.monsterCriticalPavor - localReward;
  const offensive=Boolean(o.actionType&&!magic?.shield);
  const impact=offensive&&o.targetTokenUuid?{
    tokenUuid:o.targetTokenUuid,actorUuid:o.targetActorUuid,damage:result.damage,pavor:result.p,mode:o.mode,element:o.element,
    manualDamage:o.manualDamage,special:active.length>0||item?.system.kind==="firearm"&&item.system.properties?.includes("Perfurante"),
  }:null;
  const generic=pending.version>=6&&!offensive;
  const label=o.asura?"Punho Supremo de Asura":o.lightHands?"Mãos Leves":magic?.shield?"Escudo Rúnico":o.actionType==="attack"?"Ataque":o.actionType==="spell"?"Conjuração":"Codex RPG";
  const barrier=magic?.shield?runeBarrier(result.e,result.p):null;
  const content = `<div class="codex-chat-result"><h3>${label} · ${escapeHTML(result.outcome)}</h3>
    <p>${sources}${o.targetName ? ` · Alvo ${escapeHTML(o.targetName)}` : ""}</p>
    ${o.asura?'<p>5 Esferas Espirituais consumidas · dano neutro.</p>':""}
    ${o.stealthAttack?'<p>Golpe Furtivo · um dado adicional da arma.</p>':""}
    ${o.potionResearch?'<p>Pesquisa Avançada em Poções · +1 Êxito.</p>':""}
    ${o.element?'<p>Elemento · '+escapeHTML(o.element)+'</p>':''}
    ${magic?'<p>G'+magic.grade+' · '+(magic.turns===1?'imediata':magic.turns+' turnos')+' · '+magic.charges+' cargas'+(magic.amplify?' · amplificada':'')+(magic.pathMeters?' · trajetória '+magic.pathMeters+' m':'')+'</p>':''}
    ${barrier?'<p>Barreira por 1 rodada · '+barrier.e+' E e '+barrier.p+' P · DE e Integridade simbólica '+barrier.de+
     '. Resistência a '+escapeHTML(ELEMENTS.find(([id])=>id===magic.element)[1])+': 0,5 de dano por E e 0 por P. Resolva a barreira na mesa.</p>':''}
    <p>Total ${result.reached} · DE ${o.privateDefense ? "reservada" : result.de} · ᛋ ${result.e} · ᚨ ${result.aRemaining} · ᚦ ${result.p}</p>
    ${result.critical ? `<p>Crítico · ${result.critical} faces máximas mantidas.</p>` : ""}
    ${active.length ? `<p>Características · ${active.map(escapeHTML).join(", ")}.</p>` : ""}
    ${!generic?`<p>Dano básico ${result.damage}${impact?"":" · resolução na mesa"}.</p>`:""}
    ${o.health ? `<p>Saúde ao agir · ${o.health.label}.</p>` : ""}
    <p>Custo · ${courage + Number(Boolean(o.stepPaid))} Coragem, ${pavor} Pavor local.</p>
    ${ally ? `<p>1A para passar a oportunidade a ${escapeHTML(ally.name)} · validação do Narrador.</p>` : ""}
    ${result.p&&!impact ? `<p>Pavor residual · ${result.p}P para resolução na mesa.</p>` : ""}
    ${overflow ? `<p>Crítico · ${overflow}P excedentes para adjudicação na reserva pública.</p>` : ""}
    <p class="codex-chat-dice-heading">Dados rolados · ${pending.selected.length} de ${pending.dice.length} mantidos</p>\n    ${kept}</div>`;
  const {selected, ...summary} = publicRollResult(result, o.privateDefense);
  const combat = game.combats.get(o.combatId);
  const adjudication = {
    combatId: combat?.id ?? null, round: o.combatRound ?? combat?.round ?? null, allyId: ally?.id ?? null,
    targetUuid: o.targetActorUuid, targetTokenUuid: o.targetTokenUuid,
    p: result.p, autoTarget:Boolean(impact), isTest:generic,
  };
  return {changes, content, result: {...summary, costs: {courage, pavor}, localReward, overflow}, adjudication,impact};
}

export function publicRollResult(result, privateDefense) {
  if (!privateDefense) return result;
  const {de, ...visible} = result;
  return visible;
}
