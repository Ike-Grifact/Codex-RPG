import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {characteristicActivationPayment} from "../module/equipment-logic.mjs";

test("Foundry: características pagas consomem 1 PP ou 1 Coragem, nunca dois recursos",()=>{
 assert.deepEqual(characteristicActivationPayment("pp"),{pp:1,courage:0});
 assert.deepEqual(characteristicActivationPayment("courage"),{pp:0,courage:1});
 const sheet=readFileSync(new URL("../module/sheet.mjs",import.meta.url),"utf8");
 assert.match(sheet,/characteristicActivationPayment\(p\.options\.activationPayment\)/);
 assert.match(sheet,/payPP\+=activation\.pp;cost\+=activation\.courage/);
});
