import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {blank,SKILLS,ledger,humanoidRacialGrants,humanoidSkillRequirement,
 isVisiblePlayerSkill,ATTRIBUTES,KNOWLEDGES,PRACTICES} from "./rules.mjs";
import {HIDDEN_PLAYER_SKILL_IDS,PLAYER_SKILLS} from "../prototipo-ficha/skills-catalog.mjs";
import {GENE_AUTO_REQUIREMENTS,planSkillPurchase} from "../prototipo-ficha/skill-auto-plan.mjs";

const GROUPS={attr:["attributes",ATTRIBUTES],know:["knowledges",KNOWLEDGES],practice:["practices",PRACTICES]};
function plan(t,id){
 return planSkillPurchase(id,t,{catalog:SKILLS,ledger,groups:GROUPS,
  grants:humanoidRacialGrants,requirements:(s,skillId)=>humanoidSkillRequirement(s,skillId),
  eligible:isVisiblePlayerSkill});
}
function sourceText(){return readFileSync(new URL("../prototipo-ficha/app.js",import.meta.url),"utf8");}
test("IDs internos ocultos são exatamente os do criador de personagens",()=>{
 const source=sourceText();
 const start=source.indexOf("const BARD_INTERNAL_EFFECTS=");
 const end=source.indexOf("\nconst visibleSkillCount",start);
 const hidden=new Function(source.slice(start,end)+"\nreturn [...HIDDEN_CATALOG_SKILLS];")();
 assert.deepEqual(HIDDEN_PLAYER_SKILL_IDS,hidden);
 assert.equal(hidden.length,19);
 assert.equal(PLAYER_SKILLS.length,123,"Catálogo bruto ainda preserva fichas antigas");
 assert.equal(PLAYER_SKILLS.filter(s=>isVisiblePlayerSkill(s.id)).length,104);
 for(const id of hidden){
  assert.equal(isVisiblePlayerSkill(id),false,"Não expor efeito/placeholder como Perícia: "+id);
  assert.equal(plan(blank("humanoide"),id),null,"Não permitir comprar efeito oculto: "+id);
 }
 for(const id of ["fogo","pericia-druidica","criar-item-foco-magia","golpe-furtivo","maestria-em-apresentacao"])
  assert.equal(isVisiblePlayerSkill(id),true,id+" é uma Perícia real ou de aquisição pendente");
});

test("Alternativas automáticas são espelho literal do criador",()=>{
 const source=sourceText();
 const start=source.indexOf("const GENE_AUTO_REQUIREMENTS=");
 const end=source.indexOf("\nfunction geneCandidateCopy(",start);
 assert.ok(start>=0&&end>start);
 const canonical=new Function(source.slice(start,end)+"\nreturn GENE_AUTO_REQUIREMENTS;")();
 assert.deepEqual(GENE_AUTO_REQUIREMENTS,canonical);
});

test("Compra automática de Golpe Furtivo inclui Disciplina 2 e Furtividade 2, custo total atômico",()=>{
 const t=blank("humanoide");
 const before=JSON.stringify(t),purchase=plan(t,"golpe-furtivo");
 assert.ok(purchase,"Deve ser possível comprar os requisitos com 15 XP");
 assert.equal(purchase.cost,9);
 assert.equal(purchase.after,6);
 assert.equal(purchase.state.practices.armas_conjuracao,2);
 assert.equal(purchase.state.practices.furtividade,2);
 assert.deepEqual(purchase.skills.map(x=>x.id),["golpe-furtivo"]);
 assert.equal(humanoidSkillRequirement(purchase.state,"golpe-furtivo"),null);
 assert.equal(JSON.stringify(t),before,"Simulação não pode alterar a ficha antes da confirmação");
});

test("Perícia avançada monta cadeia de dependências e evita XP parcial",()=>{
 const t=blank("humanoide"),purchase=plan(t,"furtividade-avancada");
 assert.ok(purchase,"Furtividade Avançada tem pacote dentro do orçamento inicial");
 for(const id of ["furtividade","furtividade-avancada"])
  assert.ok(purchase.state.skills.includes(id),"Faltou comprar "+id);
 assert.equal(humanoidSkillRequirement(purchase.state,"furtividade"),null);
 assert.equal(humanoidSkillRequirement(purchase.state,"furtividade-avancada"),null);
 assert.equal(purchase.after,15-purchase.cost);
 assert.equal(plan({...t,xp:0,attributes:{...t.attributes,forca:6}},"golpe-furtivo"),null,
  "Sem XP não pode executar compra parcial");
});

test("Custo PENDENTE, elementos internos e requisitos inviáveis nunca recebem XP inventado",()=>{
 const t=blank("humanoide");
 for(const id of ["dueto-improvisado","combate","armas","maestria-em-apresentacao","pericia-em-instrumentos"])
  assert.equal(plan(t,id),null,id+" não é pacote comprável");
 assert.equal(plan(t,"maos-leves"),null,"Custo completo de Mãos Leves não cabe em 15 XP");
});
