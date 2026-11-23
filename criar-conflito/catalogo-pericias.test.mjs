import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {SKILLS,blank,humanoidSkillRequirement,isPlayerCatalogSkill,ledger} from "./rules.mjs";
import {PLAYER_SKILLS,playerSkillRequirement} from "../prototipo-ficha/skills-catalog.mjs";
import {GENE_AUTO_REQUIREMENTS} from "../prototipo-ficha/skill-auto-plan.mjs";

function canonicalSource(){
 const source=readFileSync(new URL("../prototipo-ficha/app.js",import.meta.url),"utf8");
 const first=source.indexOf("const WEAPON_MASTERY_TYPES=");
 const sk=source.indexOf("const SKILLS=[",first);
 const end=source.indexOf("\n];",sk)+3;
 assert.ok(first>=0&&sk>first&&end>sk,"Não encontrou definições do catálogo da ficha de jogador");
 return new Function(source.slice(first,sk)+"\n"+source.slice(sk,end)+"\nreturn SKILLS;")();
}
test("Catálogo do inimigo espelha integralmente os 123 IDs, nomes, textos e custos da ficha",()=>{
 const original=canonicalSource();
 assert.equal(original.length,123);
 assert.deepEqual(PLAYER_SKILLS.map(x=>[x.id,x.name,x.detail,x.cost]),original);
 for(const entry of original){
  const match=SKILLS.find(x=>x.id===entry[0]);
  assert.ok(match,"Perícia ausente no inimigo: "+entry[0]);
  assert.equal(match.name,entry[1]);
  assert.equal(match.detail,entry[2]);
  assert.equal(match.cost,entry[3],"Custo incorreto em "+entry[0]);
  assert.equal(isPlayerCatalogSkill(entry[0]),true);
 }
 assert.equal(new Set(SKILLS.map(x=>x.id)).size,SKILLS.length,"IDs duplicados no editor");
});

test("Custo pendente permanece visível e não se transforma em compra gratuita",()=>{
 for(const id of ["dueto-improvisado","maestria-em-apresentacao","pericia-em-instrumentos","montaria-epica"]){
  const skill=SKILLS.find(x=>x.id===id);
  assert.ok(skill,"Perícia pendente precisa estar visível: "+id);
  assert.equal(skill.cost,null);
 }
 const adagas=SKILLS.find(x=>x.id==="maestria-adagas");
 assert.equal(adagas?.cost,1,"Preço de Maestria em Adagas agora é DEFINIDO");
 assert.match(humanoidSkillRequirement(blank("humanoide"),"maestria-adagas"),/Agilidade 2/,
  "Custo aprovado não dispensa os graus de compra");
 const t=blank("humanoide");t.skills=["dueto-improvisado"];
 assert.equal(ledger(t).skills,0,"Ficha legada pendente não cobra XP inventado");
});

test("Requisitos de Perícias avançadas são iguais aos do criador do jogador",()=>{
 const t=blank("humanoide");
 assert.equal(humanoidSkillRequirement(t,"maos-leves"),playerSkillRequirement("maos-leves",t));
 assert.match(humanoidSkillRequirement(t,"maos-leves"),/Furtividade 3/);
 t.practices.furtividade=3;
 t.practices.armas_conjuracao=3;
 t.knowledges.protecao=2;
 assert.equal(humanoidSkillRequirement(t,"maos-leves"),null);
 assert.match(humanoidSkillRequirement(t,"pericia-armadilha"),/Artesão 1/);
 assert.match(humanoidSkillRequirement(t,"ferreiro"),/Artesão 1/);
 assert.match(humanoidSkillRequirement(t,"maestria-espadas"),/Força 2/);
 assert.match(humanoidSkillRequirement(t,"bioetica"),/Alquimia 3/);
});

test("Painel de companheiros ocupa uma linha completa e mantém todos os IDs do orçamento",()=>{
 const html=readFileSync(new URL("./index.html",import.meta.url),"utf8");
 const css=readFileSync(new URL("./styles.css",import.meta.url),"utf8");
 assert.ok(html.includes('class="cf-top-dashboard cf-companion-dashboard"'));
 assert.ok(css.includes(".cf-companion-dashboard .cf-companion-budget"));
 assert.ok(css.includes("grid-template-columns:minmax(185px,1.05fr)"));
 assert.equal((html.match(/class="cf-companion-pair"/g)||[]).length,3);
 for(const category of ["pequena","media","grande"]){
  for(const field of ["count","xpTotal"]){
   assert.ok(html.includes('data-companion="'+category+'" data-companion-field="'+field+'"'),category+" "+field);
  }
 }
 assert.ok(html.includes('id="companion-xp-total"'));
 assert.ok(html.includes('id="party-effective-xp"'));
 assert.ok(html.includes("<details class=\"cf-companion-help\">"));
});

test("Editor oferece busca por nome/efeito e estados de aquisição sem esconder pendências",()=>{
 const app=readFileSync(new URL("./app.js",import.meta.url),"utf8");
 for(const marker of ["cf-skill-search","cf-skill-scope","cf-skill-card","Aquisição / custo de XP PENDENTE",
  "humanoidSkillRequirement(t,it.id)","refreshSkillFilters()"]){
  assert.ok(app.includes(marker),marker+" não apareceu no editor");
 }
 assert.ok(!app.includes("SKILLS.filter(it=>Number.isInteger(it.cost)"),"Filtro antigo escondia Perícias pendentes");
});

test("Especialização em Armas de Punho: 1 XP, quatro atributos e compra sem Pugilismo",()=>{
 const row=PLAYER_SKILLS.find(x=>x.id==="maestria-punhos");
 assert.equal(row?.name,"Especialização em Armas de Punho");
 assert.equal(row?.cost,1);
 const t=blank("humanoide");
 assert.match(playerSkillRequirement("maestria-punhos",t),/Força 1/);
 for(const a of ["forca","agilidade","destreza","vigor"])t.attributes[a]=1;
 assert.equal(playerSkillRequirement("maestria-punhos",t),null,"Pugilismo não é pré-requisito de compra");
 assert.equal(humanoidSkillRequirement(t,"maestria-punhos"),null,"Ficha do NPC segue os mesmos requisitos");
 assert.deepEqual(GENE_AUTO_REQUIREMENTS["maestria-punhos"],
  [["a:forca:1","a:agilidade:1","a:destreza:1","a:vigor:1"]]);
 for(const a of ["forca","agilidade","destreza","vigor"]){
  t.attributes[a]=0;
  assert.match(playerSkillRequirement("maestria-punhos",t),new RegExp(a==="forca"?"Força":a==="agilidade"?"Agilidade":a==="destreza"?"Destreza":"Vigor"));
  t.attributes[a]=1;
 }
});
