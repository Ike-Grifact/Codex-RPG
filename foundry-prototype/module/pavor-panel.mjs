import {narratorCap} from "./rules.mjs";

export const NS = "codex-rpg-foundry";
export const publicPavorDefault = 2;
const automaticPlayers = -1;
let pendingWrite = Promise.resolve();
let hud;

export function publicPavorState(players, value) {
  const cap = narratorCap(players);
  const balance = Math.max(0, Math.min(cap, Math.trunc(Number(value)) || 0));
  return {players, cap, value: balance, room: cap - balance};
}

function readReserve() {
  const configured = game.settings.get(NS, "publicPavorPlayers");
  const automatic = configured === automaticPlayers;
  const players = automatic ? game.users.filter(user => !user.isGM).length : configured;
  return {
    ...publicPavorState(players, game.settings.get(NS, "publicPavor")),
    automatic,
  };
}

function queueWrite(update) {
  const job = pendingWrite.then(update);
  pendingWrite = job.catch(() => {});
  return job;
}

async function changeReserve(delta) {
  const {value, players} = readReserve();
  const next = publicPavorState(players, value + delta);
  if (next.value === value) return;

  const combat = game.combat;
  const round = combat?.started ? combat.round : null;
  await game.settings.set(NS, "publicPavor", next.value);
  if (round && next.value > value) {
    const credits = combat.getFlag(NS, "publicPavorCredits") ?? {};
    await combat.setFlag(NS, "publicPavorCredits", {
      ...credits, [round]: (credits[round] ?? 0) + next.value - value,
    });
  }
}

async function setPlayers(players) {
  const current = readReserve();
  const count = players === automaticPlayers ? game.users.filter(user => !user.isGM).length : players;
  const next = publicPavorState(count, current.value);
  const stored = game.settings.get(NS, "publicPavor");
  if (stored !== next.value) await game.settings.set(NS, "publicPavor", next.value);
  await game.settings.set(NS, "publicPavorPlayers", players);
  const discarded = Math.max(0, current.value - next.value);
  if (discarded) ui.notifications.info(`Teto ajustado para ${next.cap}P. Excedente removido: ${discarded}P.`);
}

export function refreshPublicPavor() {
  if (hud?.rendered) return hud.render();
}

export function openPublicPavor() {
  if (!game.user.isGM) return;
  hud ??= new CodexPavorHUD();
  return hud.render({force: true});
}

export function registerPublicPavor() {
  game.settings.register(NS, "publicPavor", {
    name: "Saldo do Pavor público",
    scope: "world", config: false, type: Number, default: publicPavorDefault,
    onChange: refreshPublicPavor,
  });
  game.settings.register(NS, "publicPavorPlayers", {
    name: "Jogadores para o teto de Pavor público",
    scope: "world", config: false, type: Number, default: automaticPlayers,
    onChange: refreshPublicPavor,
  });

  function syncPlayerCount() {
    refreshPublicPavor();
    if (!game.user.isActiveGM) return;
    return queueWrite(async () => {
      const reserve = readReserve();
      if (game.settings.get(NS, "publicPavor") !== reserve.value) {
        await game.settings.set(NS, "publicPavor", reserve.value);
      }
    }).catch(error => console.error("Codex RPG: limite de Pavor", error));
  }

  for (const hook of ["ready", "createUser", "updateUser", "deleteUser"]) {
    Hooks.on(hook, syncPlayerCount);
  }
  for (const hook of ["createCombat", "updateCombat", "deleteCombat", "renderCombatTracker", "canvasReady"]) {
    Hooks.on(hook, refreshPublicPavor);
  }
}

export class CodexPavorHUD extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
  static DEFAULT_OPTIONS = {
    id: "codex-pavor-hud",
    window: {frame: false, positioned: false},
    actions: {
      adjust: CodexPavorHUD.adjust,
      adjustPlayers: CodexPavorHUD.adjustPlayers,
      useRegisteredPlayers: CodexPavorHUD.useRegisteredPlayers,
    },
  };

  static PARTS = {body: {template: "systems/codex-rpg-foundry/templates/pavor-panel.hbs"}};

  async _insertElement(element, options) {
    const top = element.ownerDocument.getElementById("ui-top");
    if (top) top.append(element);
    else await super._insertElement(element, options);
  }

  async _prepareContext() {
    const reserve = readReserve();
    const combat = game.combat;
    const round = combat?.started ? combat.round : null;
    const roundPavor = round ? combat.getFlag(NS, "publicPavorCredits")?.[round] ?? 0 : 0;
    return {
      ...reserve,
      round,
      roundPavor,
      canRemoveOne: reserve.value > 0,
      canAddOne: reserve.room > 0,
      canRemovePlayer: reserve.players > 0,
      canAddPlayer: reserve.players < Number.MAX_SAFE_INTEGER - 2,
    };
  }

  static async adjust(_event, target) {
    if (!game.user.isGM) return;
    const delta = Number(target.dataset.delta);
    if (delta !== -1 && delta !== 1) return;
    await queueWrite(() => changeReserve(delta));
  }

  static async adjustPlayers(_event, target) {
    if (!game.user.isGM) return;
    const delta = Number(target.dataset.delta);
    if (delta !== -1 && delta !== 1) return;
    await queueWrite(() => {
      const players = readReserve().players + delta;
      if (players >= 0 && players <= Number.MAX_SAFE_INTEGER - 2) return setPlayers(players);
    });
  }

  static async useRegisteredPlayers() {
    if (!game.user.isGM) return;
    await queueWrite(() => setPlayers(automaticPlayers));
  }
}

export async function transferCombatPavor(message){
 if(!game.user.isActiveGM||!game.combat?.started)return;
 const obj=message.getFlag(NS,"transfer");
 if(!obj||!obj.actorId||!Number.isInteger(obj.p)||obj.p<0||obj.p>20)return;
 const owner=game.actors.get(obj.actorId),user=game.users.get(message.user?.id);
 if(!owner||!user||!(user.isGM||owner.testUserPermission(user,"OWNER")))return;
 if(obj.targetUuid){
  const target=await fromUuid(obj.targetUuid);
  if(target&&["character","humanoid","creature"].includes(target.type)){
   const add=Math.max(0,obj.p);
   if(obj.targetType==="character")
    await target.update({"system.courage":Math.min(10,Number(target.system.courage||0)+add)});
   else {
    const cap=Math.max(1,Math.min(6,Number(target.system.threatGrade||1)));
    await target.update({"system.pavorLocal":Math.min(cap,Number(target.system.pavorLocal||0)+add)});
    // Excedente de Pavor do ataque permanece para resolução manual do Narrador.
   }
  }
 }
 if(obj.monsterCriticalPavor&&["creature","humanoid"].includes(owner.type)){
  const cap=Math.max(1,Math.min(6,Number(owner.system.threatGrade||1)));
  const available=Math.max(0,cap-Number(owner.system.pavorLocal||0));
  const saved=Math.min(available,obj.monsterCriticalPavor);
  if(saved)await owner.update({"system.pavorLocal":Number(owner.system.pavorLocal||0)+saved});
  const overflow=obj.monsterCriticalPavor-saved;
  if(overflow){
   await queueWrite(() => changeReserve(overflow));
  }
 }
}
