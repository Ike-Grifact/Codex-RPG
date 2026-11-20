import test from "node:test";
import assert from "node:assert/strict";
import * as rules from "../../prototipo-ficha/elemental-summoning.mjs";
import {skillDetails} from "../module/advancement.mjs";
import {summonPlan} from "../module/summon-planning.mjs";

const focus="criar-item-foco-magia";
const small=rules.DOMAR_BY_SIZE.pequena;
const character={attributes:{influencia:2,inteligencia:1},knowledges:{},practices:{apresentacao:1},
 skills:[focus],xp:45,life:{value:4},courage:4,pp:2};
const summon="invocacao-elemental";

test("Invocação compra por 1 XP com foco e Domar Pequena; Psique já habilitada pelo foco",()=>{
 const absent=skillDetails(character,summon);
 assert.match(absent.blocker,/Domar Criatura Pequena/);
 assert.equal(absent.canBuy,false);
 const eligible={...character,skills:[focus,small]};
 assert.equal(skillDetails(eligible,summon).cost,1);
 assert.equal(skillDetails(eligible,summon).canBuy,true);
 assert.equal(skillDetails(eligible,rules.DOMAR_BY_SIZE.media).canBuy,false);
 assert.equal(skillDetails(eligible,"pericia-druidica").canBuy,false);
});

test("Planejamento valida porte, recursos, combinação, Saúde e divisão de tokens",()=>{
 const trained={...character,skills:[focus,small,summon]};
 const start={first:"psique",size:"pequena"};
 const basic=summonPlan(rules,trained,start);
 assert.deepEqual([basic.courage,basic.dice.rolled,basic.stillBody,basic.xpTotal],[1,1,true,60]);
 assert.throws(()=>summonPlan(rules,trained,{...start,size:"grande"}),/Porte/);
 assert.throws(()=>summonPlan(rules,trained,{...start,second:"terra"}),/Improviso/);
 assert.throws(()=>summonPlan(rules,{...trained,courage:0},start),/insuficientes/);
 assert.throws(()=>summonPlan(rules,{...trained,life:{value:2}},start),/Saúde/);
 const master={...trained,skills:[...trained.skills,"improviso","mestre","sangue","trevas",rules.DOMAR_BY_SIZE.grande]};
 const full=summonPlan(rules,master,{size:"grande",first:"sangue",second:"trevas",base:"courage",mastery:"courage",life:12,count:3,de:4});
 assert.deepEqual([full.courage,full.dice.maxKept,full.split.xpPerToken,full.split.lifePerToken,full.split.defenseDE,full.turns,full.maxSheets,full.necromancy],[3,3,20,4,4,1,1,true]);
 assert.equal(summonPlan(rules,master,{...start,life:7,count:3,de:4}).split.exact,false);
});
