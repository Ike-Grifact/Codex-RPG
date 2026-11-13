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
const {CodexPavorPanel, openPublicPavor, registerPublicPavor} = await import("../module/pavor-panel.mjs");

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
  function setPlayers(valueAsNumber, mode, valid = true) {
    const input = {valueAsNumber, validity: {valid}, reportValidity() {}};
    return CodexPavorPanel.setPlayers.call({element: {querySelector: () => input}}, null, {dataset: {mode}});
  }
  const adjust = delta => CodexPavorPanel.adjust(null, {dataset: {delta: String(delta)}});
  let info = await panel._prepareContext();
  assert.deepEqual([info.players, info.value, info.cap], [2, 2, 4]);
  await adjust(-2);
  await hooks.get("ready")();
  info = await panel._prepareContext();
  assert.equal(info.value, 0);
  assert.equal(info.canRemoveOne, false);
  await setPlayers(3);
  await Promise.all([adjust(2), adjust(2), adjust(2)]);
  info = await panel._prepareContext();
  assert.deepEqual([info.automatic, info.value, info.cap, info.room], [false, 5, 5, 0]);
  await setPlayers(1);
  info = await panel._prepareContext();
  assert.deepEqual([info.value, info.cap], [3, 3]);
  assert.match(messages.at(-1), /2P acima do novo teto/);
  await setPlayers(-1, undefined, false);
  assert.equal((await panel._prepareContext()).automatic, false);
  await setPlayers(0, "auto");
  assert.equal((await panel._prepareContext()).automatic, true);
  game.users = [{isGM: true}];
  await hooks.get("deleteUser")();
  assert.equal(stored.get("publicPavor"), 2);
  game.user.isGM = false;
  await adjust(-1);
  await setPlayers(9);
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
