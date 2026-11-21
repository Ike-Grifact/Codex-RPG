import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const dir=dirname(fileURLToPath(import.meta.url));
const load=path=>readFileSync(join(dir,path),"utf8");
const app=load("app.js");
const book=load("../docs/livro-do-jogador.md");
const srd=load("../docs/srd-continuidade-v0.87.md");
const graph=load("gene-graph.js");
const index=load("../pericias/index.html");
const manejo=load("../pericias/manejo-perfeito-armas-corpo-a-corpo.html");
const legacyPage=load("../pericias/maestria-arma-certa.html");
function part(start,end) {
 const a=app.indexOf(start),b=app.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,"Trecho do criador não encontrado: "+start);
 return app.slice(a,b);
}

const reqFactory=new Function("state","owned",
 'const WEAPON_MASTERY_TYPES=[];const APPROVED_WEAPON_MASTERY_PURCHASE={};'+
 'const ADVANCED_SOURCE_DEFS=[];const SOURCE_PROPS={};'+
 'const racialGrants=()=>[];const ownsSkill=id=>owned.includes(id);'+
 part("function skillReq(","function dependentsValid(")+"return skillReq;");
function requirement(skills,destreza=2){
 const state={race:"humano",attributes:{destreza},practices:{armas_conjuracao:2},knowledges:{}};
 return reqFactory(state,skills)("manejo-perfeito",state);
}
const aff=part("function affinity(","function score(){");
const roller=part(" const situation=SITUATIONS[p.opts.situation]||SITUATIONS.normal;"," const cancel=clamp(");
const evaluate=new Function("hasSkill","itemKind","equipped","attackWeight","targetWeight","condition","mode","weightEnabled",
 'const p={mode,base:{group:"practice",key:"armas_conjuracao"},third:null,opts:{'+
 'situation:condition,attackWeight,targetWeight,weightEnabled,maosLeves:false,shieldThrowId:""}};'+
 'const item=itemKind?{type:itemKind,equipped}:null;'+
 'const SITUATIONS={normal:["Normal",0,0],absoluta:["Vantagem absoluta",1,0]};'+
 'const ownsSkill=id=>id==="manejo-perfeito"&&hasSkill;'+
 'const raw=[2,1,0],critTier=0,criticalConverted=0,properties=[],health={a:0};'+
 aff+roller+'return {eBase,aPool,manejoPerfeitoActive,manejoPerfeitoGolpeCerto};');
function scenario({hasSkill=true,itemKind="arma",equipped=true,attackWeight="leve",targetWeight="medio",condition="normal",mode="armas",weightEnabled=true}={}){
 return evaluate(hasSkill,itemKind,equipped,attackWeight,targetWeight,condition,mode,weightEnabled);
}

test("Manejo Perfeito é uma compra única de 1 XP, condicionada a Disciplina Avançada + Destreza 2",()=>{
 const row=part('"manejo-perfeito",','"golpe-fulminante",');
 assert.match(row,/"Manejo Perfeito — Armas Corpo a Corpo"/);
 assert.match(row,/\n  1\n \]/);
 assert.equal(requirement(["disciplina-avancada"],2),null);
 assert.match(requirement([],2),/Disciplina Avançada/);
 assert.match(requirement(["disciplina-avancada"],1),/Destreza 2/);
 assert.match(app,/"manejo-perfeito": "Disciplina Avançada \+ Destreza 2"/);
 assert.match(app,/"manejo-perfeito":\[\["p:armas_conjuracao:2","a:destreza:2","s:disciplina-avancada"\]\]/);
 assert.match(manejo,/Custo de aquisição<\/dt><dd>1 XP/);
 assert.match(manejo,/Disciplina Avançada \+ Destreza 2/);
});

test("O confronto favorável substitui +1A por +1E somente com Manejo Perfeito e arma válida",()=>{
 const base=scenario({hasSkill:false}),buff=scenario();
 assert.deepEqual({E:base.eBase,A:base.aPool},{E:2,A:2});
 assert.deepEqual({E:buff.eBase,A:buff.aPool},{E:3,A:1});
 assert.equal(buff.manejoPerfeitoActive,true);
 assert.equal(buff.manejoPerfeitoGolpeCerto,false);
 for(const ctx of [
  {targetWeight:"leve"},{weightEnabled:false},{itemKind:"foco"},
  {equipped:false},{mode:"conjuracao"}
 ])assert.equal(scenario(ctx).manejoPerfeitoActive,false,JSON.stringify(ctx));
});

test("Golpe Certo é gatilho condicional com Vantagem Absoluta preexistente, sem segundo +1E",()=>{
 const result=scenario({condition:"absoluta"});
 assert.equal(result.manejoPerfeitoActive,true);
 assert.equal(result.manejoPerfeitoGolpeCerto,true);
 assert.deepEqual({E:result.eBase,A:result.aPool},{E:3,A:1});
 assert.match(app,/golpeCertoTriggered:!!s\.manejoPerfeitoGolpeCerto/);
 assert.match(app,/efeito numérico está PENDENTE/);
 assert.match(srd,/PENDENTE:[^\n]*Golpe Certo/);
});

test("Arma Certa não é comprável, não aparece no mapa nem no catálogo, mas seu link histórico funciona",()=>{
 const skillList=part("const SKILLS=[","const SKILL_SOURCE_CONNECTIONS=");
 assert.doesNotMatch(skillList,/\"arma-certa\"/);
 assert.doesNotMatch(graph,/\"arma-certa\"/);
 assert.doesNotMatch(index,/href="maestria-arma-certa\.html"/);
 assert.match(index,/href="manejo-perfeito-armas-corpo-a-corpo\.html"/);
 assert.match(legacyPage,/Perícia independente/);
 assert.match(legacyPage,/href="manejo-perfeito-armas-corpo-a-corpo\.html"/);
 assert.match(srd,/Arma Certa deixa de existir como Perícia independente/);
 assert.match(book,/\*\*Manejo Perfeito — Armas Corpo a Corpo\*\* \| \*\*1\*\*/);
 assert.doesNotMatch(book,/\| \*\*Arma Certa\*\* \|/);
});

test("Fichas antigas arma-certa são migradas para manejo-perfeito sem compras duplicadas",()=>{
 const line=app.split("\n").find(l=>l.trim().startsWith("const rawSkills=Array.isArray(v.skills)"));
 assert.ok(line,"Migração deve ocorrer na normalização de fichas");
 const migrate=new Function("v",line+" return rawSkills;");
 assert.deepEqual(migrate({skills:["arma-certa"]}),["manejo-perfeito"]);
 assert.deepEqual(migrate({skills:["arma-certa","manejo-perfeito"]}),["manejo-perfeito"]);
 assert.deepEqual(migrate({skills:["disciplina-avancada","arma-certa","manejo-perfeito"]}),
  ["disciplina-avancada","manejo-perfeito"]);
 assert.deepEqual(migrate({skills:["manejo-perfeito"]}),["manejo-perfeito"]);
 assert.deepEqual(migrate({skills:[]}),[]);
 assert.match(app,/s\.skills=\[\.\.\.new Set\(rawSkills\.filter/);
 assert.match(srd,/sem dupla cobrança/);
});
