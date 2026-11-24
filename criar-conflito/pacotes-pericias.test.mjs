import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {blank,SKILLS,ledger,humanoidRacialGrants,humanoidSkillRequirement,
 isVisiblePlayerSkill,ATTRIBUTES,KNOWLEDGES,PRACTICES,ADVANCED_SOURCE_DEFS} from "./rules.mjs";
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
 for(const id of ["fogo","pericia-druidica","criar-item-foco-magia","golpe-furtivo","maestria-em-apresentacao","saque-rapido"])
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

test("Pacote de Foco no Lucker Puro custa só os graus faltantes e registra aquisição",()=>{
 const t=blank("humanoide");t.race="lucker_puro";t.pureElement="fogo";
 t.attributes.inteligencia=1;t.attributes.destreza=1;
 const initial=ledger(t),purchase=plan(t,"criar-item-foco-magia");
 assert.ok(purchase);
 assert.equal(purchase.cost,4,"Disciplina 1 (2 XP) + Artesão 1 (2 XP), Foco 0 XP");
 assert.equal(purchase.state.practices.armas_conjuracao,1);
 assert.equal(purchase.state.practices.artesao,1);
 assert.ok(purchase.state.skills.includes("criar-item-foco-magia"));
 assert.equal(ledger(purchase.state).skills,0);
 assert.equal(plan(purchase.state,"criar-item-foco-magia"),null,"Não compra duas vezes");
 assert.equal(ledger(t).spent,initial.spent,"Simulação não cobra antes de confirmar");
 const spent=t.practices; // Compra exclusivamente gratuita após os três graus.
 t.practices={...spent,armas_conjuracao:1,artesao:1};
 const free=plan(t,"criar-item-foco-magia");
 assert.equal(free.cost,0);
 assert.equal(free.state.skills.includes("criar-item-foco-magia"),true);
 assert.equal(plan(blank("humanoide"),"criar-item-foco-magia").cost,6,
  "Origem humana comum continua pagando 1 XP da Perícia e os três graus");
});

test("12 Perícias Avançadas requerem Grau 3, preservando custos, extras e compras conjuntas",()=>{
 assert.equal(ADVANCED_SOURCE_DEFS.length,12);
 for(const spec of ADVANCED_SOURCE_DEFS){
  const t=blank("humanoide"),field=spec.group==="practice"?"practices":"knowledges";
  t[field][spec.key]=2;
  if(spec.id==="furtividade-avancada"){
   t.attributes.destreza=2;t.attributes.agilidade=1;t.skills.push("furtividade");
  }
  assert.match(humanoidSkillRequirement(t,spec.id),/Requer/,spec.id+" inválida em G2");
  t[field][spec.key]=3;
  assert.equal(humanoidSkillRequirement(t,spec.id),null,spec.id+" válida em G3");
  const token=(spec.group==="practice"?"p:":"k:")+spec.key+":3";
  assert.equal(GENE_AUTO_REQUIREMENTS[spec.id][0].includes(token),true,spec.id+" autocompra usa G3");
 }
 const base=blank("humanoide"),p=plan(base,"disciplina-avancada");
 assert.ok(p);
 assert.equal(p.cost,9,"Disciplina G3 8 XP + Perícia 1 XP");
 assert.equal(p.after,6);
 assert.equal(p.state.practices.armas_conjuracao,3);
 assert.ok(p.state.skills.includes("disciplina-avancada"));
 const older=blank("humanoide");older.practices.armas_conjuracao=2;older.skills=["disciplina-avancada"];
 assert.match(humanoidSkillRequirement(older,"disciplina-avancada"),/Disciplina 3/,
  "Ficha antiga mantém o registro, mas G2 não satisfaz o novo requisito");
 assert.equal(ledger(older).skills,1,"Não modifica nem devolve o custo original");
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

test("Especializações em Armas compráveis custam 1 XP, pedem atributos e não exigem Perícia de peso para aquisição",()=>{
 const known=[
  ["maestria-adagas",{agilidade:2,destreza:2}],
  ["maestria-espadas",{forca:2,destreza:2}],
  ["maestria-machados",{forca:2,destreza:1}],
  ["maestria-martelos",{forca:3,destreza:1,vigor:1}],
  ["maestria-hastes",{forca:2,agilidade:1,destreza:1}],
  ["maestria-cajados",{destreza:2}],
  ["maestria-punhos",{forca:1,agilidade:1,destreza:1,vigor:1}]
 ];
 for(const [id,req] of known){
  const row=SKILLS.find(x=>x.id===id);
  assert.equal(row?.cost,1,id+" custa 1 XP");
  const initial=blank("humanoide");initial.skills=[];
  for(const [attr,grade] of Object.entries(req))initial.attributes[attr]=grade;
  assert.equal(humanoidSkillRequirement(initial,id),null,id+" compra sem Perícia de peso");
  for(const [attr,grade] of Object.entries(req)){
   const missing=structuredClone(initial);missing.attributes[attr]=grade-1;
   assert.match(humanoidSkillRequirement(missing,id),/Requer/,id+" exige "+attr+" "+grade);
  }
  const planRow=plan(blank("humanoide"),id);
  assert.ok(planRow,id+" pacote de requisitos calculável");
  assert.ok(planRow.state.skills.includes(id));
  for(const [attr,grade] of Object.entries(req))
   assert.equal(planRow.state.attributes[attr],grade,id+" compra atributo "+attr);
 }
 for(const id of ["maestria-arcos","maestria-bestas","maestria-arremessos","maestria-longo-alcance"]){
  assert.equal(SKILLS.find(x=>x.id===id)?.cost,1,id+" tem custo conhecido");
  assert.match(humanoidSkillRequirement(blank("humanoide"),id),/PENDENTES/,id+" precisa dos requisitos ainda não definidos");
  assert.equal(plan(blank("humanoide"),id),null,"Bloqueia compra sem inventar requisitos: "+id);
 }
 const human=blank("humanoide");human.race="humano";
 assert.ok(humanoidRacialGrants(human).includes("maestria-armas-fogo"));
 assert.equal(ledger(human).skills,0,"Concessão Humano não consome XP");
});
test("Artista Marcial exige Atletismo 1 e inclui a Prática na compra automática",()=>{
 const character=blank("humanoide");
 character.practices.armas_conjuracao=2;
 character.attributes.destreza=2;
 character.practices.atletismo=0;
 character.skills.push("pugilismo");
 assert.match(humanoidSkillRequirement(character,"artista-marcial"),/Atletismo 1/);
 character.practices.atletismo=1;
 assert.equal(humanoidSkillRequirement(character,"artista-marcial"),null);
 assert.ok(GENE_AUTO_REQUIREMENTS["artista-marcial"][0].includes("p:atletismo:1"));
});
