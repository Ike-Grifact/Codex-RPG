import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {characteristicActivationPayment} from "../module/equipment-logic.mjs";

test("Foundry: característica paga consome 1 Coragem, inclusive em rolagens legadas",()=>{
 assert.deepEqual(characteristicActivationPayment(),{courage:1});
 assert.deepEqual(characteristicActivationPayment("pp"),{courage:1});
 const sheet=readFileSync(new URL("../module/sheet.mjs",import.meta.url),"utf8");
 assert.match(sheet,/characteristicActivationPayment\(\)/);
 assert.doesNotMatch(sheet,/payPP|system\.pp|criticalRefundPP/);
});
