import test from "node:test";
import assert from "node:assert/strict";
import {actorData,importSiteData} from "../module/creation.mjs";
import {advancementPlan,gradeDetails,originChangePlan,planSkillPackage,skillDetails,skillRefundPlan} from "../module/advancement.mjs";
import {xpLedger,buildPool,starterPurchasePlan} from "../module/rules.mjs";
import {allOwnedSkills,gradeXPTable} from "../module/races.mjs";

test("as origens usam as tabelas oficiais no saldo, na compra e no reembolso",()=>{
 const system=actorData("character",{race:"lucker_sangue",attributes:{vigor:2,influencia:1},practices:{apresentacao:1}}).system;
 assert.deepEqual([system.attributes.vigor,system.attributes.agilidade],[2,1]);
 assert.deepEqual([xpLedger(system).attributes,xpLedger(system).training,xpLedger(system).skills,xpLedger(system).left],[4,3,0,8]);
 assert.equal(gradeDetails(system,"attribute","vigor").refund,2);
 assert.equal(gradeDetails(system,"attribute","agilidade").canLower,false);
 assert.equal(gradeDetails(system,"practice","apresentacao").cost,3);
 assert.equal(starterPurchasePlan({...system,practices:{}},"forca","practice","apresentacao").cost,3);
 const rune=actorData("character",{race:"runa_espinhos",runeElements:["terra","fogo"]}).system;
 assert.deepEqual(gradeXPTable(rune,"attribute","destreza"),[0,2,4,8,16,32,64]);
 assert.equal(xpLedger(rune).left,15);
});

test("Perícias raciais habilitam ações e pacotes sem duplicar compras ou dar reembolso",()=>{
 const system=actorData("character",{race:"runa_espinhos",runeElements:["terra","fogo"],practices:{armas_conjuracao:1}}).system;
 assert.deepEqual(system.skills,[]);
 assert.deepEqual(allOwnedSkills(system),["pugilismo","criar-item-foco-magia","terra","fogo"]);
 assert.equal(skillDetails(system,"fogo").owned,true);
 assert.equal(planSkillPackage(system,"pericia-druidica").cost,1);
 assert.match(skillRefundPlan(system,"fogo").blocker,/origem/);
 assert.throws(()=>advancementPlan(system,{kind:"skill",key:"fogo"}),/adquirida/);
 assert.equal(buildPool(system,{base:{group:"practice",key:"armas_conjuracao"},second:{group:"attribute",key:"forca"}},{mode:"armas"}).ok,true);
 const puro=actorData("character",{race:"lucker_puro",pureElement:"trevas"}).system;
 assert.deepEqual(allOwnedSkills(puro),["criar-item-foco-magia","trevas"]);
 assert.equal(puro.attributes.inteligencia,1);
 assert.equal(puro.attributes.destreza,1);
});

test("troca validada conserva graus comprados, bloqueia duplicatas e requer elementos válidos",()=>{
 const s=actorData("character",{race:"lucker_sangue",attributes:{vigor:2},practices:{atletismo:1}}).system;
 const result=originChangePlan(s,{race:"runa_espinhos",runeElements:["terra","fogo"]},true);
 assert.deepEqual([result["system.attributes"].vigor,result["system.attributes"].agilidade,result["system.attributes"].forca],[2,0,1]);
 assert.equal(originChangePlan({...s,life:{value:0}},{race:"runa_espinhos",runeElements:["terra","fogo"]},true)["system.life.value"],0);
 assert.throws(()=>originChangePlan(s,{race:"runa_espinhos",runeElements:["fogo","fogo"]},true),/sem repetir/);
 assert.throws(()=>originChangePlan({...s,skills:["fogo"]},{race:"runa_espinhos",runeElements:["terra","fogo"]},true),/Devolva primeiro/);
 const imported=importSiteData({schema:"codex-html-playtest-v1",origin:"Origem preservada",race:"lucker_puro",pureElement:"veneno",perseverancaUsed:true})[0];
 assert.deepEqual(allOwnedSkills(imported.system),["criar-item-foco-magia","veneno"]);
 assert.equal(imported.system.origin,"Origem preservada");
 assert.equal(imported.system.perseverancaUsed,true);
 const legacy=importSiteData({schema:"codex-html-playtest-v1",origin:"Lucker de Sangue"})[0];
 assert.equal(legacy.system.origin,"Lucker de Sangue");
 assert.equal(legacy.system.race,"");
 assert.deepEqual(allOwnedSkills(legacy.system),[]);
});
