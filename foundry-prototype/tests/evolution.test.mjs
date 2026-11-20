import test from "node:test";
import assert from "node:assert/strict";
import {gradeDetails} from "../module/advancement.mjs";
import {xpLedger} from "../module/rules.mjs";
import {enqueueRoll} from "../module/roll-workflow.mjs";

const ns="codex-rpg-foundry";
const player={id:"player",name:"Jogador",isGM:false};
const gm={id:"gm",name:"Narrador",isGM:true,isActiveGM:true};
const deps={game:{user:gm}};

function fixture({creationPending=false}={}){
 const flags={creationPending};
 const actor={uuid:"Actor.evolution",name:"Lia",flags,
  system:{xp:0,attributes:{forca:1,influencia:2},knowledges:{medicina:1},practices:{armas_conjuracao:1},skills:[]},
  testUserPermission: user=>user===player||user.isGM,
  getFlag:(_,key)=>flags[key],unsetFlag:async(_,key)=>{delete flags[key];},
  async update(changes){
   for(const [path,value] of Object.entries(changes)){
    const [root,...rest]=path.split(".");
    const keys=root==="system"?rest:rest.slice(1);
    let target=root==="system"?this.system:flags;
    for(const key of keys.slice(0,-1))target=target[key];
    target[keys.at(-1)]=structuredClone(value);
   }
  }};
 return actor;
}

const grade=(group,key,delta,expectedGrade)=>({action:"advance",advance:{kind:"grade",group,key,delta,expectedGrade}});
const xp=(delta,expectedXP=0)=>({action:"adjustXP",delta,expectedXP});

test("grades debitam e devolvem apenas o custo incremental enquanto criam a ficha",async()=>{
 const actor=fixture({creationPending:true});
 const initial=xpLedger(actor.system);
 assert.equal(initial.formation,15);
 assert.equal(initial.additional,0);
 await enqueueRoll(actor,player,grade("attribute","influencia",1,2),deps);
 assert.equal(xpLedger(actor.system).left,initial.left-3);
 await enqueueRoll(actor,player,grade("attribute","influencia",-1,3),deps);
 assert.equal(xpLedger(actor.system).left,initial.left);
 await enqueueRoll(actor,player,grade("knowledge","medicina",1,1),deps);
 assert.equal(gradeDetails(actor.system,"knowledge","medicina").refund,2);
 await enqueueRoll(actor,player,grade("knowledge","medicina",-1,2),deps);
 assert.equal(xpLedger(actor.system).left,initial.left);
});

test("graus respeitam extremos, saldo, requisito e formação mínima existente",async()=>{
 const actor=fixture();
 actor.system.attributes={forca:1,destreza:0};
 actor.system.knowledges.medicina=0;
 await assert.rejects(enqueueRoll(actor,gm,grade("attribute","forca",-1,1),deps),/outro Atributo G1/);
 await assert.rejects(enqueueRoll(actor,gm,grade("practice","armas_conjuracao",-1,1),deps),/outro Conhecimento ou Prática/);
 await assert.rejects(enqueueRoll(actor,gm,grade("attribute","destreza",-1,0),deps),/mínimo/);
 actor.system.attributes.forca=6;
 await assert.rejects(enqueueRoll(actor,gm,grade("attribute","forca",1,6),deps),/máximo/);
 await assert.rejects(enqueueRoll(actor,gm,grade("attribute","destreza",1,0),deps),/XP insuficiente/);
 actor.system.knowledges.medicina=1;
 actor.system.skills=["armas-leves"];
 await assert.rejects(enqueueRoll(actor,gm,grade("practice","armas_conjuracao",-1,1),deps),/requisito/);
});

test("jogador continua evoluindo após concluir, com autorização para redução e controle de duplo envio",async()=>{
 const actor=fixture({creationPending:true});
 await enqueueRoll(actor,player,{action:"completeCreation"},deps);
 const buy=grade("attribute","influencia",1,2);
 const concurrent=await Promise.allSettled([enqueueRoll(actor,player,buy,deps),enqueueRoll(actor,player,buy,deps)]);
 assert.deepEqual(concurrent.map(x=>x.status),["fulfilled","rejected"]);
 assert.equal(actor.system.attributes.influencia,3);
 const lower=grade("attribute","influencia",-1,3);
 await assert.rejects(enqueueRoll(actor,player,lower,{...deps,confirm:async()=>false}),/não foi autorizada/);
 assert.equal(actor.system.attributes.influencia,3);
 await enqueueRoll(actor,player,lower,{...deps,confirm:async()=>true});
 assert.equal(actor.system.attributes.influencia,2);
 actor.flags.pendingRoll={};
 await assert.rejects(enqueueRoll(actor,player,buy,deps),/rolagem/);
});

test("somente Narrador ajusta XP, com histórico e confirmação sem ultrapassar o investimento",async()=>{
 const actor=fixture();
 await assert.rejects(enqueueRoll(actor,player,xp(5),deps),/Somente o Narrador/);
 assert.equal(actor.system.xp,0);
 const before=Date.now();
 await enqueueRoll(actor,gm,xp(5),deps);
 assert.equal(xpLedger(actor.system).grant,20);
 assert.equal(actor.flags.xpHistory[0].userId,gm.id);
 assert.ok(actor.flags.xpHistory[0].at>=before);
 assert.deepEqual(actor.flags.xpHistory.map(({previous,next,delta})=>[previous,next,delta]),[[0,5,5]]);
 await assert.rejects(enqueueRoll(actor,gm,xp(5),deps),/saldo de XP mudou/);
 await assert.rejects(enqueueRoll(actor,gm,xp(-1,5),{...deps,confirm:async()=>false}),/cancelada/);
 await enqueueRoll(actor,gm,xp(-1,5),{...deps,confirm:async()=>true});
 assert.equal(actor.system.xp,4);
 actor.system.attributes.influencia=4; actor.system.practices.artesao=1; // 18 XP investidos no saldo de 19.
 actor.system.skills=["armas-leves"];
 await assert.rejects(enqueueRoll(actor,gm,xp(-3,4),deps),/XP já investido/);
 assert.deepEqual(actor.flags.xpHistory.map(({previous,next,delta})=>[previous,next,delta]),[[0,5,5],[5,4,-1]]);
});
