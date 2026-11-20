import {monsterCap,maxCourage} from "./rules.mjs";
import {rollNamespace as NS} from "./roll-resolution.mjs";

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

export function registerCombatAdjudication() {
  Hooks.on("renderChatMessageHTML", (message, html) => {
    if (!game.user.isActiveGM) return;
    const data = message.getFlag(NS, "adjudication");
    if (!data) return;
    const content = html.querySelector(".codex-chat-result");
    if (!content) return;
    const add = (label, work) => {
      const button = content.ownerDocument.createElement("button");
      button.type = "button";
      button.textContent = label;
      button.addEventListener("click", async () => {
        button.disabled = true;
        try {
          await work(message, data);
          button.textContent = "Registrado";
        } catch (error) {
          button.disabled = false;
          ui.notifications.error(error.message);
        }
      });
      content.append(button);
    };
    if (data.targetUuid && data.p > 0) add(`Aplicar ${data.p}P residual ao alvo`, applyResidual);
    if (data.allyId) add("Validar passagem de oportunidade", approvePass);
  });
}
