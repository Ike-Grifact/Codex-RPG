import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const dir=dirname(fileURLToPath(import.meta.url));
const get=path=>readFileSync(join(dir,path),"utf8");
const app=get("app.js");
const srd=get("../docs/srd-continuidade-v0.86.md");
const book=get("../docs/livro-do-jogador.md");
const verbete=get("../pericias/maestria-arma-certa.html");
const manejo=get("../pericias/manejo-perfeito-armas-corpo-a-corpo.html");
function part(start,end){
 const a=app.indexOf(start),b=app.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,"Encontrar trecho do código: "+start);
 return app.slice(a,b);
}

const reqFactory=new Function("state","owned",
 'const WEAPON_MASTERY_TYPES=[];const APPROVED_WEAPON_MASTERY_PURCHASE={};'+
 'const racialGrants=()=>[];const ownsSkill=(id)=>owned.includes(id);'+
 part("function skillReq(","function dependentsValid(")+
 "return skillReq;");
function requirement(skills,destreza=2){
 const state={race:"humano",attributes:{destreza},practices:{armas_conjuracao:2},knowledges:{}};
 return reqFactory(state,skills)("arma-certa",state);
}

const rollFragment=part(" const situation=SITUATIONS[p.opts.situation]||SITUATIONS.normal;"," const cancel=clamp(");
const affinityFragment=part("function affinity(","function score(){");
const scoreArmaCerta=new Function("hasSkill","itemKind","equipped","attackWeight","targetWeight","condition","mode","weightEnabled",
 'const p={mode,base:{group:"practice",key:"armas_conjuracao"},third:null,opts:{'+
 'situation:condition,attackWeight,targetWeight,weightEnabled,maosLeves:false,shieldThrowId:""}};'+
 'const item=itemKind?{type:itemKind,equipped}:null;'+
 'const SITUATIONS={normal:["Normal",0,0],absoluta:["Vantagem absoluta",1,0]};'+
 'const ownsSkill=id=>id==="arma-certa"&&hasSkill;'+
 'const raw=[2,1,0],critTier=0,criticalConverted=0,properties=[],health={a:0};'+
 affinityFragment+rollFragment+
 'return {eBase,aPool,armaCertaActive,armaCertaGolpeCerto};');
function scenario({hasSkill=true,itemKind="arma",equipped=true,attackWeight="leve",targetWeight="medio",condition="normal",mode="armas",weightEnabled=true}={}){
 return scoreArmaCerta(hasSkill,itemKind,equipped,attackWeight,targetWeight,condition,mode,weightEnabled);
}

test("Arma Certa: compra de 1 XP e requisito Disciplina Avançada + Destreza 2",()=>{
 assert.match(app,/"arma-certa",\s*"Arma Certa",[\s\S]*?\n  1\n \]/);
 assert.ok(requirement(["disciplina-avancada"],2)===null);
 assert.match(requirement([],2),/Disciplina Avançada/);
 assert.match(requirement(["disciplina-avancada"],1),/Destreza 2/);
 assert.match(app,/"arma-certa": "Disciplina Avançada \+ Destreza 2"/);
 assert.match(verbete,/1 XP/);
 assert.match(verbete,/Disciplina Avançada \+ Destreza 2/);
});

test("Arma Certa: confronto favorável troca +1A natural por Vantagem Absoluta (+1E)",()=>{
 const sem=scenario({hasSkill:false}),com=scenario();
 assert.deepEqual({E:sem.eBase,A:sem.aPool},{E:2,A:2});
 assert.deepEqual({E:com.eBase,A:com.aPool},{E:3,A:1});
 assert.equal(com.armaCertaActive,true);
 assert.equal(com.armaCertaGolpeCerto,false);
 assert.equal(scenario({targetWeight:"leve"}).armaCertaActive,false);
 assert.equal(scenario({weightEnabled:false}).armaCertaActive,false);
 assert.equal(scenario({itemKind:"foco"}).armaCertaActive,false);
 assert.equal(scenario({equipped:false}).armaCertaActive,false);
 assert.equal(scenario({mode:"conjuracao"}).armaCertaActive,false);
});

test("Golpe Certo: com Vantagem Absoluta preexistente registra gatilho sem segundo +1E",()=>{
 const r=scenario({condition:"absoluta"});
 assert.equal(r.armaCertaActive,true);
 assert.equal(r.armaCertaGolpeCerto,true);
 assert.deepEqual({E:r.eBase,A:r.aPool},{E:3,A:1});
 assert.match(app,/golpeCertoTriggered:!!s\.armaCertaGolpeCerto/);
 assert.match(app,/efeito numérico está PENDENTE/);
 assert.match(srd,/PENDENTE:[^\n]*Golpe Certo/);
});

test("Manejo Perfeito não herda Vantagem Absoluta nem Golpe Certo de Arma Certa",()=>{
 const trecho=part('"manejo-perfeito",','"golpe-fulminante",');
 assert.match(trecho,/PENDENTE: descrição e efeito próprios/);
 assert.match(trecho,/\n  null\n/);
 assert.doesNotMatch(trecho,/Arma certa: Vantagem Absoluta/);
 assert.match(manejo,/Efeito próprio e custo XP PENDENTES/);
 assert.match(book,/Manejo Perfeito[^\n]*Efeito verdadeiro \*\*PENDENTE\*\*/);
 assert.match(srd,/descrição verdadeira, custo e confirmação dos requisitos de Manejo Perfeito/);
 assert.match(verbete,/srd-continuidade-v0\.86\.md/);
});
