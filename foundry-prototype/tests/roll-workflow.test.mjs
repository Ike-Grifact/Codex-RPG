import assert from "node:assert/strict";
import test from "node:test";
import {enqueueRoll} from "../module/roll-workflow.mjs";
import {keepForActor, rollNamespace as NS} from "../module/roll-resolution.mjs";

const flag = `flags.${NS}.pendingRoll`;
const user = {id: "player"};
const id = "ABCDEF0123456789";
function fixture(behavior = {}) {
  const messages = new Map();
  const pendingRoll = {
    version: 3, id, selected: ["a"],
    dice: [{id:"a", group:"attribute", key:"forca", sides:6, face:2}],
    options: {step:true, de:1, activationCost:0, combatId:null},
  };
  const actor = {
    uuid:"Actor.test", type:"character",
    system:{level:1, courage:10, pp:0, pavorLocal:0},
    pending: pendingRoll, debits:0, items:new Map(),
    testUserPermission: u => u.id === user.id,
    getFlag: () => actor.pending,
    async update(changes) {
      if (Object.hasOwn(changes, "system.courage")) {
        actor.system.courage = changes["system.courage"];
        actor.debits++;
      }
      actor.pending = structuredClone(changes[flag]);
    },
    async unsetFlag() {
      if (behavior.failCleanup) throw Error("Desconectado ao limpar");
      actor.pending = null;
    },
  };
  let sends = 0;
  const chat = {
    getSpeaker: () => ({actor: "test"}),
    async create(source, options) {
      assert.equal(options.keepId, true);
      sends++;
      if (behavior.failSend) throw Error("Chat indisponível");
      assert.ok(!messages.has(source._id));
      messages.set(source._id, {getFlag: (ns,key)=>source.flags[ns]?.[key], source});
      if (behavior.loseAck) throw Error("Resposta perdida");
    },
  };
  const game={messages, combats:new Map()};
  const send=(action="finish", more={}, who=user)=>enqueueRoll(actor,who,{action,id,...more},{game,chat});
  return {actor, messages, send, sends:()=>sends};
}

test("O chat preserva faces e runas de todos os dados e distingue descarte", async()=>{
  const {actor,messages,send}=fixture();
  actor.pending.dice=[
    {id:"a",group:"attribute",key:"forca",sides:6,face:6},
    {id:"b",group:"attribute",key:"vigor",sides:6,face:3}
  ];
  await send();
  const content=messages.get(id).source.content;
  assert.match(content,/codex-chat-dice/);
  assert.match(content,/d6 · Força/);
  assert.match(content,/d6 · Vigor/);
  assert.match(content,/codex-chat-rune-e/);
  assert.match(content,/codex-chat-rune-p/);
  assert.match(content,/MANTIDO/);
  assert.match(content,/DESCARTADO/);
  assert.match(content,/Dados rolados · 1 de 2 mantidos/);
});
test("duas confirmações concorrentes de um rollId fazem um débito e uma publicação", async () => {
  const {actor,messages,send,sends}=fixture();
  await Promise.all([send(),send()]);
  assert.equal(actor.system.courage,9);
  assert.equal(actor.debits,1);
  assert.equal(messages.size,1);
  assert.equal(messages.get(id).source.author,user.id);
  assert.equal(messages.get(id).getFlag(NS,"rollId"),id);
  assert.equal(sends(),1);
  assert.equal(actor.pending,null);
});

test("falha no chat preserva publicação, retoma ao reconectar e rejeita editar depois do débito", async () => {
  const behavior={failSend:true};
  const {actor,messages,send,sends}=fixture(behavior);
  await assert.rejects(send(), /Chat indisponível/);
  assert.equal(actor.pending.publication.id,id);
  assert.equal(actor.system.courage,9);
  assert.equal(messages.size,0);
  await assert.rejects(send("keep",{ids:[]}), /foi confirmada/);
  await assert.rejects(send("discard"), /foi confirmada/);
  behavior.failSend=false;
  await send();
  assert.equal(sends(),2);
  assert.equal(actor.debits,1);
  assert.equal(messages.size,1);
  assert.equal(actor.pending,null);
});

test("resposta perdida e limpeza interrompida não replicam a publicação", async () => {
  const behavior={loseAck:true,failCleanup:true};
  const {actor,messages,send,sends}=fixture(behavior);
  await assert.rejects(send(), /Desconectado ao limpar/);
  behavior.failCleanup=false;
  await send();
  assert.equal(actor.debits,1);
  assert.equal(sends(),1);
  assert.equal(messages.size,1);
});

test("permissão, identificador antigo e dados mantidos são validados na autoridade", async () => {
  const {actor,send}=fixture();
  await assert.rejects(send("finish",{}, {id:"outsider"}), /Sem permissão/);
  await send("finish",{id:"OUTRO"});
  await assert.rejects(send("keep",{ids:["missing"]}), /Seleção de dados inválida/);
  assert.equal(actor.system.courage,10);
  assert.deepEqual(actor.pending.selected,["a"]);
  await send("discard");
  assert.equal(actor.pending,null);
  assert.equal(actor.debits,0);
});

test("retenção por Grau distingue humanoide, monstro extraordinário e criatura legada", () => {
  const actor=(type, threatGrade, rules={})=>({type,system:{level:1,threatGrade,...rules}});
  assert.equal(keepForActor(actor("humanoid",1),1),3);
  assert.equal(keepForActor(actor("humanoid",2),0),3);
  assert.equal(keepForActor(actor("monsterHumanoid",2),1),4);
  assert.equal(keepForActor(actor("creature",2,{monsterRules:true}),2),4);
  assert.equal(keepForActor(actor("animal",6,{animalRules:true}),2),2);
});

import {catalogArmorMigration} from "../module/equipment-migration.mjs";
import {actorData} from "../module/creation.mjs";
import {sourceDice, xpLedger} from "../module/rules.mjs";

test("migração opcional de armadura G1 conserva histórico de dano e ignora peças personalizadas", () => {
  const original = {name:"Armadura Leve", type:"equipment", system:{
    kind:"armor", category:"leve", grade:1, weight:.125, priceVT:5, integrity:{max:10,value:8},
  }};
  assert.deepEqual(catalogArmorMigration(original), {max:7,value:5});
  assert.deepEqual(original.system.integrity, {max:10,value:8});
  for (const changes of [{grade:2}, {kind:"shield"}, {description:"Armadura única"}, {integrity:{max:11,value:8}}]) {
    assert.equal(catalogArmorMigration({...original,system:{...original.system,...changes}}),undefined);
  }
});

test("Humanoide Monstro usa custo elevado, orçamento informado e dados provisórios humanos", () => {
  const {type,system}=actorData("monsterHumanoid",{xp:14,attributes:{forca:1},practices:{atletismo:1}});
  assert.equal(type,"monsterHumanoid");
  assert.equal(xpLedger(system).grant,14);
  assert.equal(xpLedger(system).spent,4);
  assert.deepEqual(sourceDice("attribute","forca",system),[6]);
});
