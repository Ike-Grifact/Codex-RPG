import test from "node:test";
import assert from "node:assert/strict";
import {newCharacterDraft,characterBuild,creationStarter,creationStarterKey,characterInventory,completeCharacterDraft,validateCreationIdentity} from "../module/character-creation.mjs";
import {xpLedger,starterPurchasePlan} from "../module/rules.mjs";
import {actorData} from "../module/creation.mjs";

function start(race="humano",element=""){
 const draft=newCharacterDraft();
 draft.identity={...draft.identity,name:"Aprendiz",race,element};
 draft.starter={attribute:"forca",training:"practice:armas_conjuracao"};
 return draft;
}

test("confirmar formação compra os dois graus de uma vez e o rascunho é reexecutável",()=>{
 const draft=start();
 assert.equal(characterBuild(draft).system.attributes.forca,1);
 assert.throws(()=>completeCharacterDraft(draft),/Confirme/);
 draft.confirmed=creationStarterKey(draft);
 draft.advances.push({kind:"grade",group:"attribute",key:"agilidade",expectedGrade:0,delta:1});
 const actor=completeCharacterDraft(draft);
 assert.equal(actor.system.attributes.forca,1);
 assert.equal(actor.system.attributes.agilidade,1);
 assert.equal(actor.system.practices.armas_conjuracao,1);
 assert.equal(xpLedger(actor.system).left,11);
 assert.equal(actor.items.length,5);
 assert.deepEqual(completeCharacterDraft(draft),actor);
 draft.starter.attribute="vigor";
 assert.throws(()=>completeCharacterDraft(draft),/Confirme/);
});

test("origem gratuita e custos raciais afetam a escolha explícita sem alterar a compra mínima clássica",()=>{
 const draft=start("lucker_sangue");
 assert.equal(creationStarter(draft).cost,3);
 const base=actorData("character",draft.identity).system;
 assert.equal(starterPurchasePlan(base,"forca","practice","armas_conjuracao").cost,2);
 draft.starter.attribute="vigor";
 draft.starter.training="practice:apresentacao";
 assert.equal(creationStarter(draft).cost,3);
 draft.confirmed=creationStarterKey(draft);
 assert.equal(xpLedger(completeCharacterDraft(draft).system).left,12);
 const rune=start("runa_espinhos");
 assert.throws(()=>validateCreationIdentity(rune),/elemento/);
 rune.identity.element="vento";
 rune.confirmed=creationStarterKey(rune);
 assert.deepEqual(completeCharacterDraft(rune).system.runeElements,["vento"]);
});

test("20 VT são distribuídos e a compra recalcula a bolsa sem gastar XP ou duplicar recursos",()=>{
 const draft=start();
 draft.confirmed=creationStarterKey(draft);
 const allocation={ervas:3,espolios:4,couro:5,comida:4,minerios:4};
 draft.allocation=allocation;
 draft.preferredResource="couro";
 draft.orders.push({id:"TEST12345",name:"Faca",quantity:1,equipped:true});
 const inventory=characterInventory(draft);
 assert.equal(inventory.vt,18);
 assert.equal(inventory.items.find(item=>item.name==="Couro").system.quantity,3);
 assert.equal(inventory.purchases[0].system.equipped,true);
 assert.equal(xpLedger(completeCharacterDraft(draft).system).left,12);
 assert.equal(characterInventory({...draft,orders:[]}).vt,20);
 assert.throws(()=>characterInventory({...draft,allocation:{...allocation,ervas:4}}),/exatamente 20/);
});
