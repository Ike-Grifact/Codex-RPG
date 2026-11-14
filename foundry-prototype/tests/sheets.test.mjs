import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {dieSvg} from "../module/dice-icons.mjs";

class ApplicationV2 {
  rendered = false;
  render() {
    this.rendered = true;
    return this;
  }
}
globalThis.foundry = {
  applications: {api: {ApplicationV2, HandlebarsApplicationMixin: Base => Base}},
};
const {CodexPavorHUD, openPublicPavor, registerPublicPavor, transferCombatPavor} = await import("../module/pavor-panel.mjs");

test("reserva pública começa em 2P, mantém zero salvo e aplica os limites da mesa", async () => {
  const stored = new Map();
  const config = new Map();
  const messages = [];
  const hooks = new Map();
  globalThis.Hooks = {on: (name, callback) => hooks.set(name, callback)};
  globalThis.ui = {notifications: {info: message => messages.push(message)}};
  globalThis.game = {
    user: {isGM: true, isActiveGM: true},
    users: [{isGM: true}, {isGM: false}, {isGM: false}],
    settings: {
      register(_namespace, key, data) { config.set(key, data); },
      get(_namespace, key) { return stored.get(key) ?? config.get(key).default; },
      async set(_namespace, key, value) {
        stored.set(key, value);
        config.get(key).onChange();
      },
    },
  };

  registerPublicPavor();
  const panel = openPublicPavor();
  assert.equal(openPublicPavor(), panel);
  const step = (action, delta) => action(null, {dataset: {delta: String(delta)}});
  const adjust = delta => step(CodexPavorHUD.adjust, delta);
  const adjustPlayers = delta => step(CodexPavorHUD.adjustPlayers, delta);
  let info = await panel._prepareContext();
  assert.deepEqual([info.players, info.value, info.cap], [2, 2, 4]);
  await Promise.all([adjust(-1), adjust(-1)]);
  await adjustPlayers(1);
  assert.equal((await panel._prepareContext()).players, 3);
  await hooks.get("ready")();
  info = await panel._prepareContext();
  assert.equal(info.value, 0);
  assert.equal(info.canRemoveOne, false);
  assert.equal(info.slots.length, 5);
  assert.equal(info.slots.filter(slot => slot.filled).length, 0);
  assert.equal(info.round, null);

  const flags = new Map();
  game.combat = {
    started: true,
    round: 1,
    getFlag: (_namespace, key) => flags.get(key),
    async setFlag(_namespace, key, value) {
      flags.set(key, value);
      hooks.get("updateCombat")();
    },
  };
  await Promise.all(Array.from({length: 7}, () => adjust(1)));
  info = await panel._prepareContext();
  assert.deepEqual([info.automatic, info.value, info.cap, info.room], [false, 5, 5, 0]);
  assert.equal(info.roundPavor, 5);
  assert.equal(info.slots.filter(slot => slot.filled).length, 5);
  await adjust(-1);
  assert.equal((await panel._prepareContext()).roundPavor, 5);
  game.combat.round = 2;
  await hooks.get("updateCombat")();
  info = await panel._prepareContext();
  assert.deepEqual([info.round, info.roundPavor, info.value], [2, 0, 4]);
  await adjust(1);
  assert.equal((await panel._prepareContext()).roundPavor, 1);

  // A rewarded critical goes through the same ledger, after the local reserve.
  await adjust(-1);
  await adjust(-1);
  const monster = {type: "creature", system: {threatGrade: 2, pavorLocal: 1}};
  monster.update = async updates => { monster.system.pavorLocal = updates["system.pavorLocal"]; };
  game.actors = new Map([["threat", monster]]);
  game.users = new Map([["gm", game.user]]);
  await transferCombatPavor({
    user: {id: "gm"},
    getFlag: () => ({actorId: "threat", p: 0, monsterCriticalPavor: 3}),
  });
  assert.equal(monster.system.pavorLocal, 2);
  assert.deepEqual([(await panel._prepareContext()).value, (await panel._prepareContext()).roundPavor], [5, 3]);
  game.combat.round = 1;
  assert.equal((await panel._prepareContext()).roundPavor, 5);
  game.users = [{isGM: true}, {isGM: false}, {isGM: false}];
  game.combat = null;
  await hooks.get("deleteCombat")();
  assert.equal((await panel._prepareContext()).round, null);

  await Promise.all([adjustPlayers(-1), adjustPlayers(-1)]);
  info = await panel._prepareContext();
  assert.deepEqual([info.value, info.cap], [3, 3]);
  assert.match(messages.at(-1), /Excedente removido: 1P/);
  await adjustPlayers(-2);
  assert.equal((await panel._prepareContext()).players, 1);
  await CodexPavorHUD.useRegisteredPlayers();
  assert.equal((await panel._prepareContext()).automatic, true);
  game.users = [{isGM: true}];
  await hooks.get("deleteUser")();
  assert.equal(stored.get("publicPavor"), 2);
  game.user.isGM = false;
  await adjust(-1);
  await adjustPlayers(1);
  assert.equal((await panel._prepareContext()).value, 2);
  assert.equal(openPublicPavor(), undefined);
});

test("dados do Foundry reutilizam exatamente as formas e o viewBox do criador web", () => {
  const website = readFileSync(new URL("../../prototipo-ficha/app.js", import.meta.url), "utf8");
  const [, geometry] = /function dieIcon\(n\)\{\s*const shapes=\{([\s\S]*?)\n\s*\};/.exec(website);
  for (const sides of [4, 6, 10, 12, 20]) {
    const [, expected] = new RegExp(`\\b${sides}:'([^']+)'`).exec(geometry);
    const icon = dieSvg(sides);
    assert.match(icon, new RegExp(`assets/dice/d${sides}\\.svg`));
    const svg = readFileSync(new URL(`../assets/dice/d${sides}.svg`, import.meta.url), "utf8").trim();
    const [, shape] = /^<svg[^>]*>(.*)<\/svg>$/.exec(svg);
    assert.equal(shape, expected);
    assert.match(svg, /viewBox="0 0 42 42"/);
  }
  assert.equal(dieSvg(0), "");
});
