import test from "node:test";
import assert from "node:assert/strict";
import {defenseDE} from "../module/equipment-logic.mjs";

const base=()=>({monsterRules:false,attributes:{agilidade:2,destreza:0,vigor:0},practices:{atletismo:0}});
const actor=(category,equipped=true,system=base())=>({system,items:category?[{
 type:"equipment",system:{kind:"armor",category,equipped}
}]:[]});

test("Armadura Leve reduz 1 DE em toda defesa; remover recupera DE",()=>{
 assert.equal(defenseDE(actor("leve")),2);
 assert.equal(defenseDE(actor("leve",false)),3);
 assert.equal(defenseDE(actor(null)),3);
});
test("Categorias de armadura têm modificadores DE 0/-1/-2/-3/-4",()=>{
 assert.equal(defenseDE(actor("muito-leve")),3);
 assert.equal(defenseDE(actor("leve")),2);
 assert.equal(defenseDE(actor("medio")),1);
 assert.equal(defenseDE(actor("pesado")),0);
 assert.equal(defenseDE(actor("muito-pesado")),0);
});
test("DE natural não excede 11, limite final 12, sem empilhar duas armaduras",()=>{
 const system={...base(),attributes:{agilidade:6,destreza:6,vigor:6},practices:{atletismo:6}};
 assert.equal(defenseDE(actor("muito-leve",true,system)),11);
 assert.ok(defenseDE(actor("muito-leve",true,system))<=12);
 const both=actor("muito-leve");both.items.push({type:"equipment",system:{kind:"armor",equipped:true,category:"leve"}});
 assert.equal(defenseDE(both),3);
});


test("v0.149: base 2, metade de Agilidade+Vigor+Destreza, sem Atletismo; monstros preservados" ,()=>{
 const attrs={agilidade:1,destreza:2,vigor:4};
 const humanoid={...base(),attributes:attrs,practices:{atletismo:3}};
 const monster={...humanoid,monsterRules:true};
 assert.equal(defenseDE(actor(null,true,humanoid)),5);
 assert.equal(defenseDE(actor(null,true,monster)),2);
});

test("Maestria em Escudos permite DE 12",()=>{const a=actor("muito-leve",true,{...base(),attributes:{agilidade:6,destreza:6,vigor:6},skills:["maestria-escudos"]});a.items.push({type:"equipment",system:{kind:"shield",equipped:true}});assert.equal(defenseDE(a),12);});
