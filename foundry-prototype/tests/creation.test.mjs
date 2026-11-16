import assert from "node:assert/strict";
import test from "node:test";
import {actorData, equipmentData, importSiteData} from "../module/creation.mjs";
import {faceLabels, faceImageLabels, registerCodexDice, showCodexDice} from "../module/dice-so-nice.mjs";
import {generateRuneFaces} from "../scripts/rune-faces-generator.mjs";
import {mkdtempSync,readdirSync,readFileSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
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
  assert.equal(animal.system.pavorLocal, 5);
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

test("Dice So Nice usa as faces atuais e anima a mesma pilha para toda a mesa", async () => {
  const calls = [];
  const presets = [],colorsets=[];
  const dice3d = {
    addSystem(system) { assert.equal(system.id, "codex-rpg-foundry"); },
    addColorset(colorset) { colorsets.push(colorset); },
    addDicePreset(preset) { presets.push(preset); },
    async showForRoll(...args) { calls.push(args); },
  };
  registerCodexDice(dice3d);
  assert.deepEqual(presets.map(preset => preset.type), ["d4","d6","d10","d12","d20"]);
  assert.equal(presets.find(preset => preset.type === "d4").fontScale, 0.82);
  assert.equal(presets.find(preset => preset.type === "d10").fontScale, 1.02);
   assert.equal(presets.find(preset => preset.type === "d4").labelScale, 0.66);
   assert.deepEqual(presets.find(preset => preset.type === "d10").labels,faceImageLabels(10));
  assert.equal(colorsets.length,1);
  assert.equal(colorsets[0].background,"#181a1d");
  assert.deepEqual(faceLabels(10)[9],"ᛋᛋ ᚨ");
  for (const [sides, faces] of Object.entries(FACES)) {
    const labels = faceLabels(sides);
    assert.equal(labels.length, Number(sides));
    labels.forEach((label, i) => {
      const [e,a,p]=faces[i];
      assert.equal(label, ["ᛋ".repeat(e),"ᚨ".repeat(a),"ᚦ".repeat(p)].filter(Boolean).join(" ")||" ");
      assert.ok(!label.endsWith(".png"),"Rótulos rúnicos Unicode continuam disponíveis para depuração");
       assert.match(faceImageLabels(sides)[i],/assets\/dice\/runes\/e\d+-a\d+-p\d+\.png$/);
    });
  }
  const user = {id: "player"};
  const roll = {dice: [{results: [{result: 6}]}]};
  globalThis.game = {user, dice3d};
  const box = Promise.withResolvers();
  dice3d._boxReady = box.promise;
  const animation = showCodexDice(roll);
  assert.equal(calls.length, 0);
  box.resolve();
  await animation;
  assert.deepEqual(calls, [[roll, user, true]]);
  assert.equal(roll.dice[0].options.appearance.system, "codex-rpg-foundry");
  assert.equal(roll.dice[0].options.appearance.colorset, "codex-runas");
  assert.equal(roll.dice[0].results[0].result, 6);
  delete game.dice3d;
  await showCodexDice(roll);
  assert.equal(calls.length, 1);
});

test("o empacotamento gera 20 faces PNG distintas com a paleta oficial",()=>{
 const target=mkdtempSync(join(tmpdir(),"codex-runas-"));
 try{
  assert.equal(generateRuneFaces(target),20);
  const files=readdirSync(target);
  assert.equal(files.length,20);
  assert.ok(files.includes("e2-a1-p0.png"));
  const image=readFileSync(join(target,"e2-a1-p0.png"));
  assert.deepEqual([...image.subarray(0,8)],[137,80,78,71,13,10,26,10]);
  assert.equal(image.readUInt32BE(16),256);
  assert.equal(image.readUInt32BE(20),256);
  assert.ok(image.includes(Buffer.from([38,122,69,35,105,187,84,33,118,221,225,232])));
 }finally{rmSync(target,{recursive:true,force:true});}
});
