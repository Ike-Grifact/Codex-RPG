import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import {advancementPlan,planSkillPackage,skillDetails} from "../module/advancement.mjs";
import {requirements} from "../module/skill-catalog.mjs";
import {xpLedger} from "../module/rules.mjs";
import {enqueueRoll} from "../module/roll-workflow.mjs";

const build=(values={})=>({attributes:{},knowledges:{},practices:{},skills:[],xp:0,...values});
const plan=(id,system=build({xp:60}),options)=>planSkillPackage(system,id,options);

test("o planejador usa o catálogo nativo e seus requisitos coincidem com o site onde os dois declaram a mesma compra",()=>{
 const source=readFileSync(new URL("../reference/site-catalog.json",import.meta.url),"utf8");
 const web=JSON.parse(source).requirements;
 for(const [id,branches] of Object.entries(web))assert.deepEqual(requirements[id],branches,id);
});

test("calcula fontes, custos e Perícias intermediárias dos sete pacotes solicitados sem alterar a ficha",()=>{
 const system=build({xp:60});
 const snapshot=structuredClone(system);
 const cases=[
  ["fogo",4,[],{inteligencia:1,armas_conjuracao:1}],
  ["furtividade-avancada",10,["furtividade"],{furtividade:2,destreza:2,agilidade:1}],
  ["criar-antidoto",15,["criar-veneno"],{inteligencia:2,alquimia:2,medicina:2,artesao:1}],
  ["mestre",26,["criar-item-foco-magia","improviso","vento"],{inteligencia:3,destreza:3,armas_conjuracao:3,artesao:1}],
  ["olhos-de-aguia",17,["armas-longo-alcance"],{destreza:3,armas_conjuracao:3}],
  ["invocacao-elemental",11,["criar-item-foco-magia","domar-criatura-pequena"],{inteligencia:1,influencia:2,armas_conjuracao:1,artesao:1}],
  ["pericia-druidica",8,["criar-item-foco-magia","terra"],
   {inteligencia:1,armas_conjuracao:1,artesao:1}],
 ];
 for(const [id,cost,intermediates,increases] of cases){
  const p=plan(id,system);
  assert.equal(p.status,"potential",id);
  assert.equal(p.cost,cost,id);
  assert.deepEqual(Object.fromEntries(p.increases.map(x=>[x.key,x.to])),increases,id);
  assert.deepEqual(p.intermediates.map(x=>x.id),intermediates,id);
  assert.deepEqual(p.changes["system.skills"],[...intermediates,id],id);
  assert.equal(p.before-p.after,cost,id);
  const purchased=structuredClone(system);
  for(const increase of p.increases)purchased[increase.field][increase.key]=increase.to;
  purchased.skills=p.changes["system.skills"];
  for(const key of purchased.skills)assert.equal(skillDetails(purchased,key).met,true,key);
  assert.equal(xpLedger(purchased).spent-xpLedger(system).spent,cost,id);
 }
 assert.deepEqual(system,snapshot);
});

test("alternativas aproveitam Perícias existentes e minimizam o custo global, inclusive dependências compartilhadas",()=>{
 const withFirearms=build({xp:60,skills:["armas-fogo"],attributes:{destreza:2},practices:{armas_conjuracao:2}});
 const eyes=plan("olhos-de-aguia",withFirearms);
 assert.equal(eyes.alternatives[0].option,1);
 assert.equal(eyes.cost,8);
 assert.deepEqual(eyes.intermediates,[]);
 const result=plan("fogo",build(),{rules:{
  fogo:[["s:escudo-arcano","s:conjuracao-equilibrada"]],
  "escudo-arcano":[["p:artesao:1"],["a:forca:2"]],
  "conjuracao-equilibrada":[["a:forca:2"]],
 }});
 assert.equal(result.cost,6);
 assert.equal(result.alternatives[0].option,1);
 assert.deepEqual(result.increases.map(x=>[x.key,x.to]),[["forca",2]]);
});

test("a cor acompanha o plano inteiro e a reserva de formação, com orçamento insuficiente exibindo o custo",()=>{
 const green=build({practices:{armas_conjuracao:1}});
 assert.equal(plan("armas-leves",green).status,"available");
 assert.deepEqual(advancementPlan(green,{kind:"skill",key:"armas-leves"}),{"system.skills":["armas-leves"]});
 assert.equal(plan("armas-leves").status,"potential");
 assert.equal(plan("armas-leves",{...green,skills:["armas-leves"]}).status,"owned");
 const unfunded=plan("pericia-druidica",build({creationBudget:0}));
 assert.equal(unfunded.cost,8);
 assert.equal(unfunded.status,"locked");
 assert.match(unfunded.blocker,/XP insuficiente/);
 const creation=build({attributes:{forca:3,influencia:3,agilidade:0}});
 assert.equal(plan("montar",creation).status,"available");
 const reserve=plan("montar",creation,{creationPending:true});
 assert.equal(reserve.status,"locked");
 assert.match(reserve.blocker,/Reserve 2 XP/);
 assert.equal(plan("fogo",build(),{creationPending:true}).cost,4);
});

test("bloqueia compras pendentes, legadas, fontes inválidas e ciclos com segurança",()=>{
 for(const id of ["transfusao","combate","combinacao"])assert.equal(plan(id).status,"locked");
 for(const token of ["s:transfusao","s:combate","a:inventado:2","p:coleta:7","s:ausente","s:fogo"]){
  assert.equal(plan("fogo",build(),{rules:{fogo:[[token]]}}).status,"locked",token);
 }
 const cycle={fogo:[["s:escudo-arcano"]],"escudo-arcano":[["s:fogo"]]};
 assert.equal(plan("fogo",build(),{rules:cycle}).status,"locked");
 assert.equal(plan("fogo",build({attributes:{inteligencia:7}})).status,"locked");
 assert.equal(plan("fogo",build({xp:-1})).status,"locked");
 assert.equal(plan("fogo",build({skills:["agua","agua"]})).status,"locked");
});

test("na fila do Narrador aplica um único update, rejeita pacote duplicado, obsoleto, pendente e sem propriedade",async()=>{
 const system=build();
 const updates=[];
 const actor={uuid:"Actor.pacote",system,testUserPermission:u=>u.id==="dono",
  getFlag:(_ns,key)=>key==="pendingRoll"?actor.pending:key==="creationPending",
  async update(changes){
   updates.push(changes);
   for(const [path,value] of Object.entries(changes)){
    const [,field,key]=path.split(".");
    if(key)system[field][key]=value;
    else system[field]=value;
   }
  }};
 const user={id:"dono"},deps={game:{user:{isActiveGM:true}}};
 const quote=plan("fogo",system,{creationPending:true}).quote;
 const request={action:"advance",advance:{kind:"skillPackage",key:"fogo",expectedPlan:quote}};
 await assert.rejects(enqueueRoll(actor,{id:"outro"},request,deps),/Sem permissão/);
 await assert.rejects(enqueueRoll(actor,user,request,{game:{user:{isActiveGM:false}}}),/Narrador ativo/);
 actor.pending={id:"roll"};
 await assert.rejects(enqueueRoll(actor,user,request,deps),/rolagem/);
 actor.pending=null;
 system.xp=1;
 await assert.rejects(enqueueRoll(actor,user,request,deps),/plano de compra mudou/);
 assert.deepEqual(updates,[]);
 system.xp=0;
 const simultaneous=await Promise.allSettled([enqueueRoll(actor,user,request,deps),enqueueRoll(actor,user,request,deps)]);
 assert.deepEqual(simultaneous.map(x=>x.status),["fulfilled","rejected"]);
 assert.equal(updates.length,1);
 assert.deepEqual(updates[0],{"system.attributes.inteligencia":1,"system.practices.armas_conjuracao":1,
  "system.skills":["fogo"]});
 assert.equal(xpLedger(system).left,11);
});
