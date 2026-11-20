import {monsterCap,maxCourage,isMaximumFace} from "./rules.mjs";
import {rollNamespace as NS} from "./roll-resolution.mjs";
import {faceIcons} from "./dice-icons.mjs";
import {impactSummary} from "./attack-impact.mjs";

const queues = new Map();

function serialize(uuid, work) {
  const previous = queues.get(uuid) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(work);
  queues.set(uuid, next);
  return next.finally(() => {
    if (queues.get(uuid) === next) queues.delete(uuid);
  });
}

async function applyResidual(message, data) {
  const target = await fromUuid(data.targetUuid);
  if (!target?.isOwner) throw Error("Alvo indisponível.");
  await serialize(target.uuid, async () => {
    if (!game.user.isActiveGM) return;
    const applied = target.getFlag(NS, "appliedPavor") ?? {};
    if (Object.hasOwn(applied, message.id)) return;
    const field = target.type === "character" ? "courage" : "pavorLocal";
    const limit = field === "courage" ? maxCourage(target.system.level) : monsterCap(target.system.threatGrade);
    const value = Math.min(limit, target.system[field] + data.p);
    await target.update({
      ["system." + field]: value,
      [`flags.${NS}.appliedPavor.${message.id}`]: true,
    });
  });
}

async function approvePass(message, data) {
  const combat = game.combats.get(data.combatId);
  if (!combat?.started || combat.round !== data.round) throw Error("A rodada da passagem já terminou.");
  await serialize(combat.uuid, async () => {
    if (!game.user.isActiveGM || combat.round !== data.round) return;
    const ally = combat.combatants.get(data.allyId);
    if (!ally?.actor || ally.defeated) throw Error("Aliado indisponível.");
    const passed = combat.getFlag(NS, "passedOpportunities") ?? {};
    const key = `r${data.round}-${ally.id}`;
    if (passed[key] === message.id) return;
    if (passed[key]) throw Error("Este aliado já recebeu uma antecipação nesta rodada.");
    await combat.setFlag(NS, "passedOpportunities", {...passed, [key]: message.id});
    ui.notifications.info(`Oportunidade passada a ${ally.name}. Conduza o turno na mesa.`);
  });
}

function inspectableImpactTarget(data) {
  if (!data.autoTarget || typeof data.targetUuid !== "string") return null;
  // Cartas anteriores a targetTokenUuid já guardavam o UUID completo do Actor sintético.
  const tokenUuid = data.targetTokenUuid ?? (data.targetUuid.startsWith("Scene.") ? data.targetUuid.split(".Actor.")[0] : null);
  const token = tokenUuid ? fromUuidSync(tokenUuid, {strict: false}) : null;
  const target = tokenUuid ? token?.actor : fromUuidSync(data.targetUuid, {strict: false});
  if (target?.uuid !== data.targetUuid || (token?.hidden && !game.user.isGM)) return null;
  return target.testUserPermission(game.user, "OBSERVER") ? target : null;
}

async function openImpactTarget(_message, data) {
  const target = inspectableImpactTarget(data);
  if (!target?.sheet) throw Error("A ficha do alvo da rolagem está indisponível.");
  const sheet = target.sheet;
  await sheet.render({force: true});
  sheet.element?.querySelector(".codex-resources")?.scrollIntoView({block: "nearest"});
}

export function registerCombatAdjudication() {
  Hooks.on("renderChatMessageHTML", (message, html) => {
    const content = html.querySelector(".codex-chat-result");
    if (!content) return;
    const dice = message.getFlag(NS, "dice");
    const faces = content.querySelectorAll(".codex-chat-die-face");
    if (Array.isArray(dice) && dice.length === faces.length) faces.forEach((face, i) => {
      const die = dice[i];
      if (!Array.isArray(die?.symbols)) return;
      const maximum = isMaximumFace(die);
      face.innerHTML = faceIcons(die.symbols, maximum);
      if (maximum) face.setAttribute("aria-label", `Face ${die.face} · máxima`);
    });
    const data = message.getFlag(NS, "adjudication");
    if (!data) return;
    const add = (label, work, register = true) => {
      const button = content.ownerDocument.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          await work(message, data);
          if (register) {
            button.textContent = "Registrado";
            return;
          }
        } catch (error) {
          ui.notifications.error(error.message);
        }
        button.disabled = false;
      });
      content.append(button);
    };
    const target = inspectableImpactTarget(data);
    if (target) {
      const receipt = target.getFlag(NS, "impactReceipts")?.[message.getFlag(NS, "rollId")];
      const summary = content.querySelector(".codex-chat-impact");
      if (receipt && summary) summary.textContent = impactSummary(receipt, false);
      add("Abrir ficha do alvo", openImpactTarget, false);
    }
    if (!game.user.isActiveGM) return;
    if (data.targetUuid && data.p > 0 && !data.autoTarget && !data.isTest) add(`Aplicar ${data.p}P residual ao alvo`, applyResidual);
    if (data.allyId) add("Validar passagem de oportunidade", approvePass);
  });
}
