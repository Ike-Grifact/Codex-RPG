import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {characteristicActivationPayment,fireActivationCourage} from "../module/equipment-logic.mjs";

test("Foundry: característica paga consome 1 Coragem, inclusive em rolagens legadas",()=>{
 assert.deepEqual(characteristicActivationPayment(),{courage:1});
 assert.deepEqual(characteristicActivationPayment("pp"),{courage:1});
 const sheet=readFileSync(new URL("../module/sheet.mjs",import.meta.url),"utf8");
 assert.match(sheet,/characteristicActivationPayment\(\)/);
 assert.doesNotMatch(sheet,/payPP|system\.pp|criticalRefundPP/);
});

test("Fogo: G1 e G2 gratuitos com Perícia; G3 custa 1 Coragem, G4 composta é manual",()=>{
 assert.equal(fireActivationCourage(1,true),0);
 assert.equal(fireActivationCourage(2,true),0);
 assert.equal(fireActivationCourage(3,true),1);
 assert.equal(fireActivationCourage(2,false),null);
 assert.equal(fireActivationCourage(4,true),null);
 const sheet=readFileSync(new URL("../module/sheet.mjs",import.meta.url),"utf8");
 assert.match(sheet,/result\.success&&fireGrade\)cost\+=fireCost/);
 assert.match(sheet,/paidFeature==="Elemental"/);
 assert.match(sheet,/fireGradeConfirmed/);
});
