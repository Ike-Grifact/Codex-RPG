import test from "node:test";
import assert from "node:assert/strict";
import {ELEMENT_SKILL_IDS,INVOCACAO_ELEMENTAL_XP,MAX_INVOCATION_SHEETS,MAX_DIRECT_TAMED_SHEETS,GROUPED_ZOMBIE_EXAMPLE,psychicProjectionRequiresStillBody,eligibleElementalSkills,canBuyElementalSummoning,summonableElementalSizes,canSummonElemental,COMBINATION_SKILLS,DUAL_ELEMENT_EXTRA_COURAGE,MASTERED_SUMMON_EXTRA_ACTIVATION,ANTICIPATED_SUMMON_TURNS,canCombineSummonedElements,splitSummonTokens,summonAnticipatedTurn} from "./elemental-summoning.mjs";
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
test("Psique é habilitada pelo foco; Combinar exige Improviso + Maestria",()=>{
 const s=["invocacao-elemental","criar-item-foco-magia","domar-criatura-pequena","terra","mestre"];
 assert.equal(canSummonElemental({skills:s,element:"terra",size:"pequena"}),true);
 assert.equal(canSummonElemental({skills:s,element:"psique",size:"pequena"}),true);
 assert.equal(canSummonElemental({skills:s,element:"psiquico",size:"pequena"}),true);
 assert.equal(canSummonElemental({skills:s,element:"psíquico",size:"pequena"}),true);
 assert.equal(canSummonElemental({skills:s.filter(x=>x!=="criar-item-foco-magia"),element:"psique",size:"pequena"}),false);
 assert.deepEqual(eligibleElementalSkills(["criar-item-foco-magia"]),["psique"]);
 assert.deepEqual(eligibleElementalSkills([]),[]);
});

test("Uma invocação/ficha por conjurador; até duas fichas de Domar diretamente controladas",()=>{
 assert.equal(MAX_INVOCATION_SHEETS,1);
 assert.equal(MAX_DIRECT_TAMED_SHEETS,2);
});
test("Várias criaturas reais podem compartilhar uma ficha Grande, com XP e recursos únicos",()=>{
 assert.deepEqual(GROUPED_ZOMBIE_EXAMPLE,{
  realMediumBodies:3,mechanicalSize:"grande",controlledSheets:1,
  xpEntries:1,sharedMechanicalLife:true,sharedActionBudget:true
 });
});
test("Invocar Psique projeta a mente e deixa o corpo do conjurador parado",()=>{
 for(const nome of ["psique","psíquico","psiquico"])
  assert.equal(psychicProjectionRequiresStillBody(nome),true);
 assert.equal(psychicProjectionRequiresStillBody(["psique","trevas"]),true);
 assert.equal(psychicProjectionRequiresStillBody(["sagrado","psique"]),true);
 assert.equal(psychicProjectionRequiresStillBody(["terra","fogo"]),false);
 assert.equal(psychicProjectionRequiresStillBody("sagrado"),false);
});

test("Combinar dois elementos requer Improviso + Maestria e ambas as habilitações",()=>{
 assert.deepEqual([...COMBINATION_SKILLS],["improviso","mestre"]);
 assert.equal(DUAL_ELEMENT_EXTRA_COURAGE,1);
 assert.deepEqual([...MASTERED_SUMMON_EXTRA_ACTIVATION],["1 PP","1 Coragem"]);
 const full=["invocacao-elemental","criar-item-foco-magia","domar-criatura-pequena","improviso","mestre","trevas"];
 assert.equal(canCombineSummonedElements({skills:full,elements:["psique","trevas"]}),true);
 assert.equal(canCombineSummonedElements({skills:full,elements:["psíquico","trevas"]}),true);
 assert.equal(canCombineSummonedElements({skills:full,elements:["psique","sagrado"]}),false);
 assert.equal(canCombineSummonedElements({skills:full,elements:["trevas","trevas"]}),false);
 assert.equal(canCombineSummonedElements({skills:full.filter(x=>x!=="improviso"),elements:["psique","trevas"]}),false);
 assert.equal(canCombineSummonedElements({skills:full.filter(x=>x!=="mestre"),elements:["psique","trevas"]}),false);
 assert.equal(canCombineSummonedElements({skills:full.filter(x=>x!=="invocacao-elemental"),elements:["psique","trevas"]}),false);
});
test("Separar fichas divide XP/Vida sem multiplicar XP ou alterar DE",()=>{
 const s=splitSummonTokens({xpTotal:60,lifeTotal:12,tokenCount:3,defenseDE:5});
 assert.deepEqual([s.exact,s.xpPerToken,s.lifePerToken,s.defenseDE,s.maxTurnsPerAnticipation,s.areaDamage],
  [true,20,4,5,1,"normal"]);
 assert.equal(s.xpPerToken*s.tokenCount,s.totalXP);
 assert.equal(s.lifePerToken*s.tokenCount,s.totalLife);
 assert.equal(s.requiresRemainderDecision,false);
});
test("Divisão inexata sinaliza restos, sem inventar arredondamentos",()=>{
 const s=splitSummonTokens({xpTotal:61,lifeTotal:11,tokenCount:3,defenseDE:4});
 assert.deepEqual([s.xpRemainder,s.lifeRemainder,s.exact,s.requiresRemainderDecision],[1,2,false,true]);
 assert.equal(s.xpPerToken,null);
 assert.equal(s.lifePerToken,null);
 assert.equal(s.defenseDE,4);
 assert.equal(splitSummonTokens({xpTotal:20,lifeTotal:1,tokenCount:2}).exact,false);
 assert.throws(()=>splitSummonTokens({xpTotal:20,lifeTotal:0,tokenCount:2}),RangeError);
 assert.throws(()=>splitSummonTokens({xpTotal:20.5,lifeTotal:2,tokenCount:2}),RangeError);
 assert.throws(()=>splitSummonTokens({xpTotal:20,lifeTotal:2,tokenCount:0}),RangeError);
});
test("A invocação inteira só fornece um turno antecipável entre todos os tokens",()=>{
 assert.equal(ANTICIPATED_SUMMON_TURNS,1);
 for(const mode of ["individual","ajudar-conjurador","ajudar-aliado"]){
  const action=summonAnticipatedTurn({tokenCount:3,selectedToken:2,mode});
  assert.deepEqual([action.selectedToken,action.turns,action.otherTokensReceiveTurns,action.normalAnticipationAndJointCostsApply],
   [2,1,false,true]);
 }
 assert.throws(()=>summonAnticipatedTurn({tokenCount:3,selectedToken:3}),RangeError);
 assert.throws(()=>summonAnticipatedTurn({tokenCount:3,selectedToken:1,mode:"dois-turnos"}),RangeError);
});
