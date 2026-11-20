import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import test from "node:test";
import {dieSvg,faceIcons} from "../module/dice-icons.mjs";

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
const {CodexPavorHUD, openPublicPavor, registerPublicPavor, prepareCombatPavor} = await import("../module/pavor-panel.mjs");

test("Preparação do combate: cada ameaça começa cheia uma única vez",async()=>{
 const actors=[
  {uuid:"a1",type:"creature",system:{threatGrade:1,pavorLocal:0}},
  {uuid:"a2",type:"humanoid",system:{threatGrade:2,pavorLocal:0}},
  {uuid:"a3",type:"animal",system:{threatGrade:6,pavorLocal:0}},
  {uuid:"p1",type:"character",system:{threatGrade:1,pavorLocal:0}}
 ];
 for(const a of actors)a.update=async update=>{a.system.pavorLocal=update["system.pavorLocal"];};
 let stored=null,updateCount=0;
 const combat={started:true,round:1,
  combatants:actors.map((actor,i)=>({id:String(i),actor})),
  getFlag:(_ns,key)=>key==="localPavorPrepared"?stored:null,
  async setFlag(_ns,key,v){if(key==="localPavorPrepared")stored=v;}
 };
 for(const a of actors){const old=a.update;a.update=async v=>{updateCount++;await old(v);};}
 globalThis.game={user:{isActiveGM:true}};
 const first=await prepareCombatPavor(combat);
 assert.equal(first.prepared,3);
 assert.deepEqual(actors.map(a=>a.system.pavorLocal),[4,5,8,0]);
 assert.equal(updateCount,3);
 actors[0].system.pavorLocal=2;
 const second=await prepareCombatPavor(combat);
 assert.equal(second.alreadyPrepared,true);
 assert.equal(actors[0].system.pavorLocal,2,"Não deve restaurar Pavor gasto em nova rodada");
 combat.round=2;
 await assert.rejects(()=>prepareCombatPavor(combat),/começo do conflito/);
});
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

  await adjust(-1);
  await adjust(-1);
  assert.deepEqual([(await panel._prepareContext()).value, (await panel._prepareContext()).roundPavor], [3, 1]);
  game.combat.round = 1;
  assert.equal((await panel._prepareContext()).roundPavor, 5);
  game.users = [{isGM: true}, {isGM: false}, {isGM: false}];
  game.combat = null;
  await hooks.get("deleteCombat")();
  assert.equal((await panel._prepareContext()).round, null);

  await adjust(1);
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

test("seleção visual de duas fontes e cartas sem polígonos flutuantes",()=>{
 const html=readFileSync(new URL("../templates/character-sheet.hbs",import.meta.url),"utf8");
 const css=readFileSync(new URL("../styles/codex-sheet.css",import.meta.url),"utf8");
 assert.match(html,/is-attributes-only/);
 assert.match(html,/1ª fonte/);
 assert.match(html,/2ª fonte/);
 assert.doesNotMatch(html,/Selecionar fonte/);
 assert.match(html,/data-action="chooseSource"/);
 assert.match(html,/class="codex-result-face codex-face-icons"/);
 assert.match(html,/class="codex-result-symbols/);
 assert.doesNotMatch(html,/<strong>\{\{this.face\}\}<\/strong><span>d/,"Layout antigo de face deve ser revogado");
 assert.match(css,/\.codex-source-layout\.is-attributes-only/);
 assert.match(css,/\.codex-result-die-head/);
 assert.match(css,/\.codex-chat-dice/);
  assert.match(html,/data-action="toggleEditing"/);
  assert.match(html,/@root\.codex\.editing/);
  assert.match(html,/is-playing/);
  assert.match(html,/is-editing/);
  assert.doesNotMatch(html,/<strong class="codex-result-face">\{\{this.face\}\}<\/strong>/);
  assert.match(css,/user-select:none/);
});

test("face visual apresenta todas as runas coloridas sem trocar o indice interno",()=>{
 const two=faceIcons([2,1,1]);
 assert.equal((two.match(/codex-face-symbol-e/g)??[]).length,2);
 assert.match(two,/codex-face-symbol-a/);
 assert.match(two,/codex-face-symbol-p/);
 assert.doesNotMatch(two,/×2|codex-face-maximum/);
 assert.equal((faceIcons([2,1,0],true).match(/codex-face-rune codex-face-maximum/g)??[]).length,3);
 assert.match(faceIcons([0,0,0]),/Face vazia/);
 assert.match(faceIcons([0,0,0],true),/Face máxima vazia/);
 assert.doesNotMatch(two,/>10<\/strong>/);
});
