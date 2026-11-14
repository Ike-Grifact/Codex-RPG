import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {actorData, equipmentData, importSiteData} from "../module/creation.mjs";
import {faceLabels, registerCodexDice, showCodexDice} from "../module/dice-so-nice.mjs";
import {buildPool, FACES, resolveRoll, xpLedger} from "../module/rules.mjs";

test("converte a ficha exportada com seu inventário e recursos de troca", () => {
  const [draft] = importSiteData({
    schema: "codex-html-playtest-v1",
    character: {
      schema: "codex-html-playtest-v1", name: "Lia", level: 6, xpEarned: 4, legacyXPRefund: 1,
      attributes: {forca: 2, invalid: 6}, practices: {armas_conjuracao: 1},
      life: 0, courage: 7, skills: ["armas-leves", "futura"],
      trade: {resources: {ervas: 8}},
      items: [{name: "Cota", type: "armadura", weight: "medio", hp: 0, max: 15, equipped: true}],
    },
  }, "humanoid");
  assert.equal(draft.type, "humanoid");
  assert.equal(xpLedger(draft.system).grant, 25);
  assert.equal(draft.system.life.value, 0);
  assert.equal(draft.system.attributes.invalid, undefined);
  assert.deepEqual(draft.system.skills, ["armas-leves"]);
  assert.match(draft.system.notes, /futura/);
  assert.equal(draft.items[0].system.equipped, true);
  assert.deepEqual(draft.items[0].system.integrity, {value: 0, max: 15});
  assert.equal(draft.items[1].system.quantity * draft.items[1].system.weight, .1);
  assert.throws(() => importSiteData({name: "Formato desconhecido"}), /JSON exportado/);
});

test("importa criatura comum, monstro e humanoide como Actors separados", () => {
  const common = {kind: "criatura", name: "Lobo", xp: 10, attributes: {forca: 1, vigor: 2}, threatGrade: 2,
    pavorLocal: 9, items: [{name: "Coleira", qty: 2, weight: .125}], abilities: "Faro"};
  const [animal, monster, humanoid] = importSiteData({schema: "codex-conflito-v1", roster: [
    common, {...common, kind: "monstro"}, {...common, kind: "humanoide"},
  ]});
  assert.deepEqual([animal.type, monster.type, humanoid.type], ["animal", "creature", "humanoid"]);
  assert.equal(animal.system.abilities, "Faro");
  assert.equal(animal.system.pavorLocal, 2);
  assert.equal(animal.items[0].system.quantity, 2);
  assert.equal(xpLedger(animal.system).grant, 10);
  assert.equal(xpLedger(humanoid.system).grant, 30);
  const selection = {base: {group: "attribute", key: "forca"}, attribute: {group: "attribute", key: "vigor"}};
  const pool = buildPool(animal.system, selection);
  assert.equal(pool.ok, true);
  assert.deepEqual(pool.pool.map(d => d.sides), [6, 6, 6]);
  assert.deepEqual(buildPool(monster.system, selection).pool.map(d => d.sides), [10, 10, 10]);
  assert.equal(resolveRoll(pool.pool.map(d => ({...d, face: 6})), pool.pool.map(d => d.id), {animal: true}).ok, false);
  const quick = actorData("humanoid", {}, true);
  assert.equal(xpLedger(quick.system).spent, 3);
  assert.equal(equipmentData("consumable", "Antídoto").system.kind, "consumable");
  assert.equal(equipmentData("misc", "", "0").name, "Faca");
});

test("Dice So Nice usa as faces do Codex e anima a pilha já avaliada só para quem rolou", async () => {
  const calls = [];
  const presets = [];
  const dice3d = {
    addSystem(system) { assert.equal(system.id, "codex-rpg-foundry"); },
    addDicePreset(preset) { presets.push(preset); },
    async showForRoll(...args) { calls.push(args); },
  };
  registerCodexDice(dice3d);
  assert.deepEqual(presets.map(preset => preset.type), ["d4","d6","d10","d12","d20"]);
  for (const [sides, faces] of Object.entries(FACES)) {
    const labels = faceLabels(sides);
    assert.equal(labels.length, Number(sides));
    labels.forEach((label, i) => {
      assert.ok(label.endsWith(faces[i].join("") + (i + 1 === faces.length ? "-max.png" : ".png")));
      const png = readFileSync(new URL("../" + label.split("/").slice(2).join("/"), import.meta.url));
      assert.equal(png.readUInt32BE(16), 256);
      assert.equal(png.readUInt32BE(20), 256);
    });
  }
  const user = {id: "player"};
  const roll = {dice: [{results: [{result: 6}]}]};
  globalThis.game = {user, dice3d};
  await showCodexDice(roll);
  assert.deepEqual(calls, [[roll, user, false]]);
  assert.equal(roll.dice[0].options.appearance.system, "codex-rpg-foundry");
  assert.equal(roll.dice[0].results[0].result, 6);
  delete game.dice3d;
  await showCodexDice(roll);
  assert.equal(calls.length, 1);
});
