import test from "node:test";
import assert from "node:assert/strict";
import {buildPool,keepLimit,resolveRoll,xpLedger} from "../module/rules.mjs";
import {canSpendXP,equipmentEligibility,skillRequirements,weaponProperties} from "../module/equipment-logic.mjs";
import {finishRoll,NS,options,pendingFlag,prepareRoll,rollSummary,usesPavor} from "../module/roll-workflow.mjs";
import {runeHTML,runeText} from "../module/roll-engine.mjs";

const base={group:"practice",key:"armas_conjuracao"};
const attribute={group:"attribute",key:"forca"};
const actor=(type="character",system={})=>({
 type,isOwner:true,uuid:"Actor.example",
 items:new Map(),
 system:{level:1,xp:0,skills:[],attributes:{forca:1},practices:{armas_conjuracao:1},knowledges:{},
  threatGrade:3,courage:3,pp:0,pavorLocal:0,...system}
});
const die=(id,group,sides,face)=>({id,group,key:group==="attribute"?"forca":"armas_conjuracao",sides,face,symbols:[0,0,0]});

test("Disciplina sem Perícia permite teste comum e golpe básico com Faca",()=>{
 const a=actor(),setup=options();
 let plan=prepareRoll(a,{base,attribute},setup,[],false);
 assert.equal(plan.ok,true);
 assert.equal(plan.options.de,null);
 const knife={name:"Faca",system:{equipped:true,kind:"weapon",category:"leve",die:6,properties:["Cortante"]}};
 a.items.set("knife",knife);
 plan=prepareRoll(a,{base,attribute},{...setup,mode:"armas",equipmentId:"knife"},[],false);
 assert.equal(plan.ok,true);
 assert.equal(plan.pool.length,2);
 assert.match(plan.gear.reason,/Perícia pertinente/);
 assert.deepEqual(plan.options.active,[]);
 a.system.skills.push("armas-leves");
 plan=prepareRoll(a,{base,attribute},{...setup,mode:"armas",equipmentId:"knife"},[],false);
 assert.equal(plan.pool.length,3);
 assert.deepEqual(plan.options.active,["Cortante"]);
 assert.match(prepareRoll(a,{base,attribute},{...setup,mode:"armas",dual:true},[],false).errors.join(),/exige a Perícia/);
});

test("foco elemental usa o identificador legado e exige foco equipado",()=>{
 const a=actor("character",{skills:["criar-item-foco-magia","agua"]});
 const focus={system:{equipped:true,kind:"focus",category:"medio",die:10,element:"Água"}};
 assert.equal(equipmentEligibility(a,focus,"conjuracao").die,10);
 focus.system.element="Ar";
 assert.match(equipmentEligibility(a,focus,"conjuracao").reason,/Perícia do elemento/);
 a.system.skills.push("vento");
 assert.equal(equipmentEligibility(a,focus,"conjuracao").die,10);
 focus.system.equipped=false;
 assert.equal(equipmentEligibility(a,focus,"conjuracao").usable,false);
});

test("as seis situações alteram os símbolos sem escolher crítico",()=>{
 const dice=[die("a","attribute",10,8),die("b","practice",10,8)];
 const expected={superior:[3,2],advantage:[2,3],neutral:[2,2],disadvantage:[2,1],inferior:[1,2],luck:[0,2]};
 for(const [situation,outcome] of Object.entries(expected)){
  const result=resolveRoll(dice,["a","b"],{situation});
  assert.deepEqual([result.e,result.aRemaining],outcome,situation);
  assert.equal(result.critical,0);
 }
});

test("os estados da DE distinguem risco, neutralidade e teste sem dificuldade",()=>{
 const dice=[die("a","attribute",6,6),die("b","practice",10,9),die("c","practice",12,12),die("d","practice",6,1)];
 const state=(ids,de)=>resolveRoll(dice,ids,{de}).outcome;
 assert.equal(state(["a"],1),"Acerto sem Pavor");
 assert.equal(state(["b"],2),"Acerto neutro (com Pavor mantido)");
 assert.equal(state(["c"],2),"Acerto com Pavor");
 assert.equal(state(["d"],1),"Falha");
 assert.equal(state(["a"],2),"Falha com Êxito");
 assert.equal(state(["b"],3),"Falha com Pavor");
 assert.equal(state(["b"],null),"Teste sem DE");
});

test("passar gasta Antecipar sem cancelar Pavor nem reaproveitar símbolos",()=>{
 const dice=[die("a","attribute",10,9),die("b","practice",12,11)];
 const result=resolveRoll(dice,["a","b"],{passA:true,canPass:true,cancelP:1});
 assert.equal(result.p,1);
 assert.equal(result.aRemaining,1);
 assert.equal(resolveRoll(dice,["a","b"],{passA:true,canPass:true,cancelP:1,convertPairs:1}).ok,false);
 assert.equal(resolveRoll(dice,["a","b"],{passA:true}).ok,false);
});

test("nove dados no máximo, retenção 2 a 4 e XP monstruoso separado",()=>{
 const a=actor("character",{level:6,skills:["disciplina-avancada"],attributes:{forca:3},practices:{armas_conjuracao:3,atletismo:3}});
 const selection={base,attribute,complement:{group:"practice",key:"atletismo"}};
 assert.equal(buildPool(a.system,selection,{contextApproved:true}).pool.length,9);
 assert.match(buildPool(a.system,selection,{contextApproved:true,equipmentDie:6}).errors.join(),/nove/);
 assert.deepEqual([keepLimit(1),keepLimit(6),keepLimit(6,1)],[2,3,4]);
 const s=actor("creature",{xp:8,attributes:{forca:2},practices:{}}).system;
 assert.equal(xpLedger({...s,monsterRules:true}).attributes,8);
 assert.equal(canSpendXP({...s,monsterRules:true},2,"attributes"),false);
 assert.equal(canSpendXP({...a.system,attributes:{forca:2},practices:{armas_conjuracao:1},skills:[]},4,"attributes"),false);
 assert.equal(xpLedger({skills:["armas","combate"]}).skills,3);
 const retired={...actor().system,xpRetired:{attributes:5,training:0,skills:0}};
 assert.equal(canSpendXP(retired,1,"attributes"),false);
 assert.equal(canSpendXP(retired,2,"training"),true);
 assert.equal(xpLedger(retired).retired,5);
 assert.match(skillRequirements(actor().system,"maestria-manejo-duplo").label,/Disciplina Avançada/);
});

test("oposição usa configuração explícita; crítico de criatura destina Pavor local e deixa excedente",()=>{
 assert.equal(usesPavor(actor("humanoid")),false);
 assert.equal(usesPavor(actor("humanoid",{opposition:true})),true);
 const monster=actor("creature",{pavorLocal:2,threatGrade:3});
 const pending={dice:[die("a","attribute",12,2),die("b","attribute",12,12),die("c","attribute",12,12)],
  selected:["b","c"],options:{...options(),de:4,inCombat:true,mode:"armas"}};
 const result=rollSummary(monster,pending);
 assert.equal(result.critical,2);
 assert.equal(result.outcome,"Acerto com Pavor");
 assert.equal(result.localReward,2);
 assert.equal(result.resources["system.pavorLocal"],3);
 assert.equal(result.unallocatedPavor,0);
 monster.system.threatGrade=1;
 monster.system.pavorLocal=1;
 const capped=rollSummary(monster,pending);
 assert.equal(capped.localReward,1);
 assert.equal(capped.unallocatedPavor,1);
 assert.ok(!Object.hasOwn(capped.resources,"system.courage"));
});

test("efeitos passivos e técnicos não aparecem entre as ativações",()=>{
 const item={name:"Lança",system:{properties:["Longa","Perfurante","Munição","Cartucho","Silenciosa"]}};
 assert.deepEqual(weaponProperties(item,true).active,["Perfurante"]);
 assert.equal(weaponProperties(item,true).criticalBonusA,2);
 assert.deepEqual(weaponProperties(item,false).active,[]);
 assert.match(runeHTML([2,1,3]),/ᛋᛋ.*ᚨ.*ᚦᚦᚦ/);
 assert.equal(runeText([2,1,0]),"2 Êxito, 1 Antecipar");
});

test("após erro no chat, republicar preserva o ID e cobra o custo uma vez",async()=>{
 const a=actor();
 let pending={version:3,id:"abc123abc123abc1",base,attribute,dice:[die("a","attribute",6,6)],
  selected:["a"],options:{...options(),de:1,step:true}};
 let charges=0,attempts=0;
 a.getFlag=()=>pending;
 a.update=async changes=>{
  charges++;
  a.system.courage=changes["system.courage"];
  pending=changes[pendingFlag];
 };
 a.unsetFlag=async()=>{pending=null;};
 const messages=new Map();
 messages.some=fn=>Array.from(messages.values()).some(fn);
 const oldGame=globalThis.game,oldFoundry=globalThis.foundry;
 globalThis.game={messages};
 globalThis.foundry={documents:{ChatMessage:{
  getSpeaker:()=>({}),create:async data=>{
   if(++attempts===1)throw Error("chat indisponível");
   messages.set(data._id,data);
  }
 }}};
 try{
  await assert.rejects(finishRoll(a),/indisponível/);
  assert.equal(pending.publication.id,pending.id);
  assert.equal(a.system.courage,2);
  await finishRoll(a);
  assert.equal(pending,null);
  assert.equal(charges,1);
  assert.equal(messages.size,1);
 }finally{
  globalThis.game=oldGame;
  globalThis.foundry=oldFoundry;
 }
});
