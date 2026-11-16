import {SUMMON_PARTS_BY_SIZE,summonDiceLimit,summonPartRoll} from "./elemental-summoning.mjs";
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
  const action=summonAnticipatedTurn({tokenCount:3,selectedToken:2,mode,...(mode==="ajudar-aliado"?{targetId:"aliado-1"}:{})});
  assert.deepEqual([action.selectedToken,action.turns,action.otherTokensReceiveTurns,action.normalAnticipationAndJointCostsApply],
   [2,1,false,true]);
 }
 assert.throws(()=>summonAnticipatedTurn({tokenCount:3,selectedToken:3}),RangeError);
 assert.throws(()=>summonAnticipatedTurn({tokenCount:3,selectedToken:1,mode:"dois-turnos"}),RangeError);
});


test("Invocação Pequena/Média/Grande rola um dado de Atributo por parte, mantém até 1/2/3",()=>{
 assert.deepEqual([SUMMON_PARTS_BY_SIZE.pequena,SUMMON_PARTS_BY_SIZE.media,SUMMON_PARTS_BY_SIZE.grande],[1,2,3]);
 for(const [size,n] of [["pequena",1],["media",2],["grande",3]]){
  assert.deepEqual(summonDiceLimit(size),{size,parts:n,rolled:n,maxKept:n,dicePerPart:1,source:"attribute",sheets:1});
  const dice=Array.from({length:n},(_,i)=>({part:i+1,attribute:["forca","destreza","vigor"][i],sides:6,face:i+1}));
  const outcome=summonPartRoll({size,dice});
  assert.equal(outcome.results.length,n);
  assert.equal(outcome.keptCount,n);
  assert.equal(outcome.extraTurns,0);
  assert.equal(outcome.automaticDEAggregation,false);
  assert.equal(outcome.sheets,1);
  assert.deepEqual(outcome.results.map(d=>d.part),dice.map(d=>d.part));
 }
});
test("Invocação Grande separa cada face e permite manter menos de três sem transformar em ações",()=>{
 const rolled=summonPartRoll({size:"grande",dice:[
  {part:3,attribute:"forca",sides:10,face:10},
  {part:1,attribute:"forca",sides:6,face:6},
  {part:2,attribute:"vigor",sides:12,face:12}
 ],keptParts:[1,3]});
 assert.deepEqual(rolled.results.map(x=>[x.part,x.face,x.kept]),[[1,6,true],[2,12,false],[3,10,true]]);
 assert.equal(rolled.keptCount,2);
 assert.equal(rolled.automaticDEAggregation,false);
 assert.throws(()=>summonDiceLimit("gigante"),RangeError);
 assert.throws(()=>summonPartRoll({size:"media",dice:[{part:1,attribute:"forca",sides:6,face:2}]}),RangeError);
 assert.throws(()=>summonPartRoll({size:"media",dice:[{part:1,attribute:"forca",sides:6,face:2},{part:1,attribute:"vigor",sides:6,face:1}]}),RangeError);
 assert.throws(()=>summonPartRoll({size:"pequena",dice:[{part:1,attribute:"disciplina",sides:10,face:3}]}),RangeError);
 assert.throws(()=>summonPartRoll({size:"pequena",dice:[{part:1,source:"practice",attribute:"forca",sides:10,face:3}]}),RangeError);
 assert.throws(()=>summonPartRoll({size:"pequena",dice:[{part:1,attribute:"forca",sides:6,face:7}]}),RangeError);
 assert.throws(()=>summonPartRoll({size:"grande",dice:[{part:1,attribute:"forca",sides:6,face:1},{part:2,attribute:"forca",sides:6,face:2},{part:3,attribute:"vigor",sides:6,face:3}],keptParts:[1,1]}),RangeError);
});

test("Token isolado de uma Grande rola um único dado da parte escolhida",()=>{
 const result=summonPartRoll({size:"grande",activePart:2,dice:[{part:2,attribute:"agilidade",sides:10,face:8}]});
 assert.deepEqual([result.rolled,result.maxKept,result.keptCount,result.activePart,result.results[0].part,result.extraTurns],[1,1,1,2,2,0]);
 assert.throws(()=>summonPartRoll({size:"grande",activePart:2,dice:[{part:1,attribute:"forca",sides:10,face:8}]}),RangeError);
 assert.throws(()=>summonPartRoll({size:"grande",activePart:4,dice:[{part:1,attribute:"forca",sides:10,face:8}]}),RangeError);
});


test("Uma invocação Grande transfere seus três dados mantidos para UM aliado em ação conjunta",()=>{
 const dice=[
  {part:1,attribute:"forca",sides:6,face:6},
  {part:2,attribute:"inteligencia",sides:10,face:8},
  {part:3,attribute:"destreza",sides:12,face:11}
 ];
 const result=summonPartRoll({size:"grande",dice,keptParts:[3,1,2],
  assignments:[
   {part:3,mode:"ajudar-aliado",targetId:"aliado-2"},
   {part:1,mode:"ajudar-aliado",targetId:"aliado-2"},
   {part:2,mode:"ajudar-aliado",targetId:"aliado-2"}
  ]});
 assert.deepEqual(result.results.map(d=>d.allocation),[
  {mode:"ajudar-aliado",targetId:"aliado-2"},
  {mode:"ajudar-aliado",targetId:"aliado-2"},
  {mode:"ajudar-aliado",targetId:"aliado-2"}
 ]);
 assert.equal(result.playerChoosesDice,true);
 assert.equal(result.playerChoosesKept,true);
 assert.equal(result.playerChoosesRecipients,true);
 assert.equal(result.oneRecipientPerJointAction,true);
 assert.equal(result.isJointAction,true);
 assert.deepEqual(result.jointRecipient,{mode:"ajudar-aliado",targetId:"aliado-2"});
 assert.equal(result.transferredDice.length,3);
 assert.deepEqual(result.transferredDice.map(d=>d.face),[6,8,11]);
 assert.equal(result.allocationPending,false);
 assert.equal(result.extraTurns,0);
 assert.equal(result.automaticDEAggregation,false);
 assert.equal(result.sheets,1);
});
test("A distribuição não duplica dados, não permite usar descartados nem cria bônus automáticos",()=>{
 const dice=[
  {part:1,attribute:"forca",sides:6,face:4},
  {part:2,attribute:"vigor",sides:10,face:8}
 ];
 const base={size:"media",dice,keptParts:[2]};
 const pending=summonPartRoll(base);
 assert.equal(pending.allocationPending,true);
 assert.equal(pending.results[0].kept,false);
 assert.equal(pending.results[1].kept,true);
 const allocated=summonPartRoll({...base,assignments:[{part:2,mode:"ajudar-aliado",targetId:"aliado-1"}]});
 assert.deepEqual(allocated.results.map(x=>x.allocation),[null,{mode:"ajudar-aliado",targetId:"aliado-1"}]);
 assert.throws(()=>summonPartRoll({...base,assignments:[{part:1,mode:"individual"}]}),RangeError);
 assert.throws(()=>summonPartRoll({...base,assignments:[
  {part:2,mode:"individual"},{part:2,mode:"ajudar-conjurador"}
 ]}),RangeError);
 assert.throws(()=>summonPartRoll({...base,assignments:[]}),RangeError);
 assert.throws(()=>summonPartRoll({...base,assignments:[{part:2,mode:"ajudar-aliado"}]}),RangeError);
 assert.throws(()=>summonPartRoll({...base,assignments:[{part:2,mode:"dar-acao-extra"}]}),RangeError);
 assert.throws(()=>summonPartRoll({...base,assignments:[{part:2,mode:"individual",targetId:"aliado-3"}]}),RangeError);
});
test("A invocação Média passa dois dados ao mesmo personagem, sem dividir a ajuda",()=>{
 const result=summonPartRoll({size:"media",dice:[
  {part:1,attribute:"forca",sides:10,face:7},
  {part:2,attribute:"destreza",sides:10,face:8}
 ],assignments:[
  {part:1,mode:"ajudar-aliado",targetId:"aliado-unico"},
  {part:2,mode:"ajudar-aliado",targetId:"aliado-unico"}
 ]});
 assert.equal(result.results.filter(x=>x.allocation?.targetId==="aliado-unico").length,2);
 assert.equal(result.transferredDice.length,2);
 assert.equal(result.keptCount,2);
 assert.equal(result.extraTurns,0);
});
test("Não pode repartir dados da mesma invocação entre dois aliados nem misturar apoio e ação própria",()=>{
 const dice=[
  {part:1,attribute:"forca",sides:6,face:6},
  {part:2,attribute:"destreza",sides:10,face:8},
  {part:3,attribute:"vigor",sides:10,face:7}
 ];
 const base={size:"grande",dice};
 assert.throws(()=>summonPartRoll({...base,assignments:[
  {part:1,mode:"ajudar-aliado",targetId:"guerreiro"},
  {part:2,mode:"ajudar-aliado",targetId:"mago"},
  {part:3,mode:"ajudar-aliado",targetId:"guerreiro"}]}),RangeError);
 assert.throws(()=>summonPartRoll({...base,assignments:[
  {part:1,mode:"ajudar-conjurador"},
  {part:2,mode:"ajudar-aliado",targetId:"guerreiro"},
  {part:3,mode:"ajudar-conjurador"}]}),RangeError);
 assert.throws(()=>summonPartRoll({...base,assignments:[
  {part:1,mode:"individual"},
  {part:2,mode:"ajudar-aliado",targetId:"guerreiro"},
  {part:3,mode:"individual"}]}),RangeError);
 const focused=summonPartRoll({...base,assignments:[
  {part:1,mode:"ajudar-conjurador"},
  {part:2,mode:"ajudar-conjurador"},
  {part:3,mode:"ajudar-conjurador"}]});
 assert.deepEqual(focused.jointRecipient,{mode:"ajudar-conjurador",targetId:null});
 assert.equal(focused.transferredDice.length,3);
 assert.equal(focused.extraTurns,0);
 const ownAction=summonPartRoll({...base,assignments:[
  {part:1,mode:"individual"},
  {part:2,mode:"individual"},
  {part:3,mode:"individual"}]});
 assert.equal(ownAction.isJointAction,false);
 assert.equal(ownAction.transferredDice.length,0);
});
test("Ação conjunta: uma invocação só apoia um personagem e antecipa um turno",()=>{
 const turn=summonAnticipatedTurn({tokenCount:3,groupAction:true,mode:"ajudar-aliado",targetId:"aliado-1"});
 assert.equal(turn.turns,1);
 assert.equal(turn.mode,"ajudar-aliado");
 assert.equal(turn.targetId,"aliado-1");
 assert.equal(turn.isJointAction,true);
 assert.equal(turn.selectedToken,null);
 assert.equal(turn.groupAction,true);
 assert.equal(turn.otherTokensReceiveTurns,false);
 assert.equal(turn.normalAnticipationAndJointCostsApply,true);
 assert.throws(()=>summonAnticipatedTurn({tokenCount:3,groupAction:"sim"}),RangeError);
 assert.throws(()=>summonAnticipatedTurn({tokenCount:3,groupAction:true,mode:"ajudar-aliado"}),RangeError);
 assert.throws(()=>summonAnticipatedTurn({tokenCount:3,groupAction:true,mode:"individual",targetId:"outro"}),RangeError);
 const self=summonAnticipatedTurn({tokenCount:3,groupAction:true,mode:"individual"});
 assert.equal(self.isJointAction,false);
 assert.equal(self.turns,1);
});
