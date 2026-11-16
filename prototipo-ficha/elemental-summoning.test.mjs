import test from "node:test";
import assert from "node:assert/strict";
import {ELEMENT_SKILL_IDS,INVOCACAO_ELEMENTAL_XP,eligibleElementalSkills,canBuyElementalSummoning,summonableElementalSizes,canSummonElemental} from "./elemental-summoning.mjs";
test("Invocação Elemental exige foco (que habilita Psique) e Domar Pequena",()=>{
 assert.equal(INVOCACAO_ELEMENTAL_XP,1);
 const full=["criar-item-foco-magia","domar-criatura-pequena","fogo"];
 for(const missing of ["criar-item-foco-magia","domar-criatura-pequena"])assert.equal(canBuyElementalSummoning(full.filter(x=>x!==missing)),false);
 assert.equal(canBuyElementalSummoning(full),true);
 assert.equal(canBuyElementalSummoning(["criar-item-foco-magia","domar-criatura-pequena"]),true);
 assert.equal(canBuyElementalSummoning(["criar-item-foco-magia","domar-criatura-pequena","mestre"]),true);
 assert.equal(canBuyElementalSummoning(["criar-item-foco-magia","domar-criatura-pequena","psique"]),true);
});
test("O porte e o elemento são limitados às Perícias adquiridas, sem conceder compras gratuitas",()=>{
 const s=["invocacao-elemental","criar-item-foco-magia","domar-criatura-pequena","agua","domar-criatura-media"];
 assert.deepEqual(summonableElementalSizes(s),["pequena","media"]);
 assert.equal(canSummonElemental({skills:s,element:"agua",size:"media"}),true);
 assert.equal(canSummonElemental({skills:s,element:"agua",size:"grande"}),false);
 assert.equal(canSummonElemental({skills:s,element:"fogo",size:"pequena"}),false);
 assert.equal(canSummonElemental({skills:s.filter(x=>x!=="invocacao-elemental"),element:"agua",size:"pequena"}),false);
 assert.deepEqual(eligibleElementalSkills([...ELEMENT_SKILL_IDS]),[...ELEMENT_SKILL_IDS]);
});
test("Psique é habilitada pelo foco, sem Perícia separada; Combinar ainda pendente",()=>{
 const s=["invocacao-elemental","criar-item-foco-magia","domar-criatura-pequena","terra","mestre"];
 assert.equal(canSummonElemental({skills:s,element:"terra",size:"pequena"}),true);
 assert.equal(canSummonElemental({skills:s,element:"psique",size:"pequena"}),true);
 assert.equal(canSummonElemental({skills:s,element:"psiquico",size:"pequena"}),true);
 assert.equal(canSummonElemental({skills:s,element:"psíquico",size:"pequena"}),true);
 assert.equal(canSummonElemental({skills:s.filter(x=>x!=="criar-item-foco-magia"),element:"psique",size:"pequena"}),false);
 assert.deepEqual(eligibleElementalSkills(["criar-item-foco-magia"]),["psique"]);
 assert.deepEqual(eligibleElementalSkills([]),[]);
});
