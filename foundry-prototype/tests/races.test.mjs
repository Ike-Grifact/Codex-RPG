import test from "node:test";
import assert from "node:assert/strict";
import {actorData,importSiteData} from "../module/creation.mjs";
import {advancementPlan,gradeDetails,originChangePlan,planSkillPackage,skillDetails,skillRefundPlan,xpAdjustmentPlan,xpProgression} from "../module/advancement.mjs";
import {xpLedger,buildPool,starterPurchasePlan} from "../module/rules.mjs";
import {allOwnedSkills,gradeXPTable,hasSkill} from "../module/races.mjs";

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
 assert.deepEqual(allOwnedSkills(system),["pugilismo","criar-item-foco-magia","escudo-arcano","terra"]);
 assert.equal(skillDetails(system,"fogo").owned,false);
 assert.equal(skillDetails(system,"escudo-arcano").name,"Escudo Rúnico");
 assert.equal(skillDetails(system,"escudo-arcano").met,true);
 assert.deepEqual(system.runeElements,["terra","fogo"]);
 assert.equal(planSkillPackage(system,"pericia-druidica").cost,1);
 assert.match(skillRefundPlan(system,"terra").blocker,/origem/);
 assert.throws(()=>advancementPlan(system,{kind:"skill",key:"terra"}),/adquirida/);
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
 assert.throws(()=>originChangePlan(s,{race:"runa_espinhos",runeElements:["veneno"]},true),/elementos/);
 assert.throws(()=>originChangePlan({...s,skills:["terra"]},{race:"runa_espinhos",runeElements:["terra","fogo"]},true),/Devolva primeiro/);
 const imported=importSiteData({schema:"codex-html-playtest-v1",origin:"Origem preservada",race:"lucker_puro",pureElement:"veneno",perseverancaUsed:true})[0];
 assert.deepEqual(allOwnedSkills(imported.system),["criar-item-foco-magia","veneno"]);
 assert.equal(imported.system.origin,"Origem preservada");
 assert.equal(imported.system.perseverancaUsed,true);
 const legacy=importSiteData({schema:"codex-html-playtest-v1",origin:"Lucker de Sangue"})[0];
 assert.equal(legacy.system.origin,"Lucker de Sangue");
 assert.equal(legacy.system.race,"");
 assert.deepEqual(allOwnedSkills(legacy.system),[]);
});

test("referência de XP aceita o teto e preserva concessões antigas acima do limite",()=>{
 const s=actorData("character",{level:20,xp:244}).system;
 assert.deepEqual(xpProgression(s),{levelReference:260,cap:260,maxAdditional:245});
 assert.equal(xpAdjustmentPlan(s,{delta:1,expectedXP:244}).next,245);
 assert.throws(()=>xpAdjustmentPlan(s,{delta:2,expectedXP:244}),/teto/);
 const legacy={...s,creationBudget:20,xp:250};
 assert.equal(xpLedger(legacy).grant,270);
 assert.equal(xpProgression(legacy).maxAdditional,240);
 assert.equal(xpAdjustmentPlan(legacy,{delta:-1,expectedXP:250}).next,249);
 assert.throws(()=>xpAdjustmentPlan(legacy,{delta:1,expectedXP:250}),/teto/);
 assert.equal(xpAdjustmentPlan({...legacy,monsterRules:true},{delta:20,expectedXP:250}).next,270);
});

test("exclusividades raciais preservam histórico sem conceder uso ou compra",()=>{
 const human=actorData("character",{race:"humano",skills:["transfusao-sanguinaria"]}).system;
 assert.equal(hasSkill(human,"maestria-armas-fogo"),true);
 assert.equal(hasSkill(human,"armas-fogo"),false);
 assert.equal(hasSkill(human,"transfusao-sanguinaria"),false);
 assert.deepEqual(skillRefundPlan(human,"transfusao-sanguinaria").changes["system.skills"],[]);
 assert.match(planSkillPackage(human,"transfusao-sanguinaria").blocker,/Lucker de Sangue/);
});
