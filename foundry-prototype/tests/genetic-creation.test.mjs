import test from "node:test";
import assert from "node:assert/strict";
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,CREATION_REFERENCE,xpLedger,hasStarterSources,mayComplement} from "../module/rules.mjs";
import {canSpendXP} from "../module/equipment-logic.mjs";
const blank=()=>({attributes:Object.fromEntries(ATTRIBUTES.map(([id])=>[id,0])),
 knowledges:Object.fromEntries(KNOWLEDGES.map(([id])=>[id,0])),
 practices:Object.fromEntries(PRACTICES.map(([id])=>[id,0])),
 skills:[],monsterRules:false,level:1,xp:0,xpRetired:{attributes:0,training:0,skills:0}});
test("19 XP são compartilhados, não existem cotas rígidas por categoria",()=>{
 const s=blank();
 assert.equal(CREATION_REFERENCE.total,19);
 assert.equal(xpLedger(s).grant,19);
 assert.equal(xpLedger(s).left,19);
 assert.equal(canSpendXP(s,12,"attributes"),true);
 assert.equal(canSpendXP(s,12,"training"),true);
 assert.equal(canSpendXP(s,12,"skills"),true);
 assert.equal(canSpendXP(s,20,"skills"),false);
});
test("a construção inicial exige Atributo desenvolvido e Conhecimento ou Prática desenvolvido",()=>{
 const s=blank();
 assert.equal(hasStarterSources(s),false);
 s.attributes.inteligencia=1;assert.equal(hasStarterSources(s),false);
 s.practices.armas_conjuracao=1;assert.equal(hasStarterSources(s),true);
 const costs=xpLedger(s);
 assert.equal(costs.attributes,1);assert.equal(costs.training,2);assert.equal(costs.left,16);
});
test("Artista Marcial é a Perícia válida; protótipos não conferem terceira fonte ou custo",()=>{
 const s=blank();
 assert.equal(SKILLS.some(x=>x.id==="artista-marcial"),true);
 assert.equal(SKILLS.some(x=>["marciais","combinacao"].includes(x.id)),false);
 s.skills=["marciais","combinacao"];
 assert.equal(xpLedger(s).skills,0);
 assert.equal(mayComplement(s,{group:"practice",key:"armas_conjuracao"},"armas"),false);
 s.skills=["disciplina-avancada"];
 assert.equal(mayComplement(s,{group:"practice",key:"armas_conjuracao"},"armas"),true);
});
