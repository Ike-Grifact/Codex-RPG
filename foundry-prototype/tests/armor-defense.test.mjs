import test from "node:test";
import assert from "node:assert/strict";
import {defenseDE} from "../module/equipment-logic.mjs";

const base=()=>({monsterRules:false,attributes:{agilidade:1,destreza:0,vigor:0},practices:{atletismo:0}});
const actor=(category,equipped=true,system=base())=>({system,items:category?[{
 type:"equipment",system:{kind:"armor",category,equipped}
}]:[]});

test("Armadura Leve vale +1 DE em toda defesa; remover reduz DE",()=>{
 assert.equal(defenseDE(actor("leve")),3);
 assert.equal(defenseDE(actor("leve",false)),2);
 assert.equal(defenseDE(actor(null)),2);
});
test("Categorias de armadura têm modificadores DE +2/+1/0/-1/-2",()=>{
 assert.equal(defenseDE(actor("muito-leve")),4);
 assert.equal(defenseDE(actor("leve")),3);
 assert.equal(defenseDE(actor("medio")),2);
 assert.equal(defenseDE(actor("pesado")),1);
 assert.equal(defenseDE(actor("muito-pesado")),0);
});
test("DE natural não excede 9, limite final 12, sem empilhar duas armaduras",()=>{
 const system={...base(),attributes:{agilidade:6,destreza:6,vigor:6},practices:{atletismo:6}};
 assert.equal(defenseDE(actor("muito-leve",true,system)),11);
 assert.ok(defenseDE(actor("muito-leve",true,system))<=12);
 const both=actor("muito-leve");both.items.push({type:"equipment",system:{kind:"armor",equipped:true,category:"leve"}});
 assert.equal(defenseDE(both),4);
});


test("v0.88: Vigor inteiro e +1 de base para humanoides; monstros continuam com sua fórmula própria",()=>{
 const attrs={agilidade:1,destreza:2,vigor:4};
 const humanoid={...base(),attributes:attrs,practices:{atletismo:3}};
 const monster={...humanoid,monsterRules:true};
 assert.equal(defenseDE(actor(null,true,humanoid)),8);
 assert.equal(defenseDE(actor(null,true,monster)),2);
});
