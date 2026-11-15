import {escapeHTML} from "./roll-engine.mjs";

export function jointPlan(combat, leaderId, allies, targetId, balance) {
  if (!combat?.started) throw Error("Inicie o combate para declarar um golpe conjunto.");
  const roster = combat.combatants;
  const leader = roster.get(leaderId);
  if (!leader?.actor?.system.leader || leader.defeated || leader.actor.type === "character") {
    throw Error("Escolha uma ameaça ativa com Liderança.");
  }
  const unique = new Set(allies.filter(Boolean));
  if (unique.size < 1 || unique.size > 2 || unique.size !== allies.filter(Boolean).length || unique.has(leaderId)) {
    throw Error("Escolha um ou dois aliados diferentes do Líder.");
  }
  const target = roster.get(targetId);
  if (!target?.actor || target.defeated || targetId === leaderId || unique.has(targetId)) throw Error("Escolha um alvo distinto.");
  const participants = [...unique].map(id => roster.get(id));
  if (participants.some(unit => !unit?.actor || unit.defeated)) throw Error("Um aliado está indisponível.");
  const cost = participants.length;
  if (balance < cost) throw Error(`O golpe conjunto exige ${cost}P da reserva pública.`);
  return {leader, participants, target, cost};
}

export async function openJointPlan(combat, currentBalance) {
  if (!game.user.isActiveGM || !combat?.started) return;
  const active = combat.combatants.filter(unit => unit.actor && !unit.defeated);
  const options = list => list.map(unit => `<option value="${unit.id}">${escapeHTML(unit.name)}</option>`).join("");
  const leaders = active.filter(unit => unit.actor.system.leader && unit.actor.type !== "character");
  if (!leaders.length) return ui.notifications.warn("Marque Liderança na ficha da ameaça que comandará.");
  const data = await foundry.applications.api.DialogV2.input({
    window: {title:"Planejar golpe conjunto"},
    content: `<label>Líder <select name="leader">${options(leaders)}</select></label>
      <label>Aliado <select name="ally">${options(active)}</select></label>
      <label>Segundo aliado <select name="second"><option value="">Nenhum</option>${options(active)}</select></label>
      <label>Alvo <select name="target">${options(active)}</select></label>`,
    ok: {label:"Registrar planejamento"}, rejectClose:false,
  });
  if (!data || !game.user.isActiveGM) return;
  const {leader, participants, target, cost} = jointPlan(combat, data.leader, [data.ally,data.second], data.target, currentBalance());
  await ChatMessage.create({content:`<div class="codex-chat-result"><h3>Golpe conjunto · planejamento</h3>
    <p>${[leader,...participants].map(unit=>escapeHTML(unit.name)).join(" + ")} → ${escapeHTML(target.name)}</p>
    <p>Ao validar a declaração, gaste ${cost}P na HUD. Confira as oportunidades, o foco de Provocar e os custos de ativação de cada participante.</p></div>`});
}
