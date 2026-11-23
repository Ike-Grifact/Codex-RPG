import test from "node:test";
import assert from "node:assert/strict";
import {advancementPlan,planSkillPackage,skillRefundPlan} from "../module/advancement.mjs";
import {searchSkills} from "../module/skill-catalog.mjs";
import {buildPool,canElevateSource,xpLedger} from "../module/rules.mjs";
import {enqueueRoll} from "../module/roll-workflow.mjs";
import {keepForActor,rollNamespace as NS} from "../module/roll-resolution.mjs";

const paid={attributes:{inteligencia:1},knowledges:{},practices:{armas_conjuracao:1,artesao:1},
 skills:["criar-item-foco-magia","fogo"],xp:0};

test("devolve só a Perícia principal e recupera XP investido, respeitando dependências e custo legado",()=>{
 const plan=skillRefundPlan(paid,"fogo");
 assert.equal(plan.refund,1);
 assert.deepEqual(plan.changes,{"system.skills":["criar-item-foco-magia"]});
 assert.equal(skillRefundPlan(paid,"criar-item-foco-magia").blocker,"");
 assert.match(skillRefundPlan({...paid,attributes:{inteligencia:2,vigor:1},skills:[...paid.skills,"escudo-arcano"]},"criar-item-foco-magia").blocker,/Escudo Arcano/);
 assert.throws(()=>advancementPlan(paid,{kind:"skill",key:"fogo",remove:true,expectedRefund:2}),/reembolso mudou/);
 const next={...paid,skills:plan.changes["system.skills"]};
 assert.equal(xpLedger(next).left,xpLedger(paid).left+1);
 assert.equal(next.xp,0);
 assert.equal(planSkillPackage(next,"fogo").status,"available");
 assert.equal(skillRefundPlan({...paid,skills:["recuperacao-vigorosa"]},"recuperacao-vigorosa").refund,1);
 assert.equal(skillRefundPlan({...paid,skills:["manejo-duplo"]},"maestria-manejo-duplo").refund,0);
});

test("devolução consolidada exige Narrador e registra um único ajuste na fila",async()=>{
 const flags={};
 const actor={uuid:"test.refund",name:"Aventureiro",system:structuredClone(paid),
  testUserPermission:user=>user.id==="p",getFlag:(_ns,key)=>flags[key],
  async update(changes){
   this.system.skills=changes["system.skills"];
   if(changes["flags."+NS+".skillRefundHistory"])flags.skillRefundHistory=changes["flags."+NS+".skillRefundHistory"];
  }};
 const user={id:"p",name:"Jogador"},game={user:{id:"gm",isActiveGM:true}};
 const request={action:"advance",advance:{kind:"skill",key:"fogo",remove:true,expectedRefund:1}};
 await assert.rejects(enqueueRoll(actor,user,request,{game,confirm:async()=>false}),/não foi autorizada/);
 assert.deepEqual(actor.system.skills,paid.skills);
 flags.pendingRoll={id:"pendente"};
 await assert.rejects(enqueueRoll(actor,user,request,{game,confirm:async()=>true}),/rolagem/);
 delete flags.pendingRoll;
 let confirmations=0;
 const deps={game,confirm:async()=>{confirmations++;return true;}};
 const twice=await Promise.allSettled([enqueueRoll(actor,user,request,deps),enqueueRoll(actor,user,request,deps)]);
 assert.deepEqual(twice.map(x=>x.status),["fulfilled","rejected"]);
 assert.equal(confirmations,1);
 assert.deepEqual(actor.system.skills,["criar-item-foco-magia"]);
 assert.equal(flags.skillRefundHistory.length,1);
 assert.deepEqual({...flags.skillRefundHistory[0],at:true},{skillId:"fogo",xpRefund:1,spentBefore:7,spentAfter:6,
  requestedBy:"p",authorizedBy:"gm",at:true});

 flags.creationPending=true;actor.system.skills=[...paid.skills];
 await enqueueRoll(actor,user,request,{game,confirm:()=>assert.fail("Criação usa a confirmação da ficha")});
 assert.equal(flags.skillRefundHistory.length,1);
 assert.equal(actor.system.xp,0);
});

test("busca parcial por nome ignora acentos e caixa e inclui legadas apenas quando adquiridas",()=>{
 assert.deepEqual(searchSkills("  ReCuPeRaCaO ",{skills:[]}).map(x=>x.id),["recuperacao-vigorosa","recuperacao-movimento"]);
 assert.equal(searchSkills("INVOCAÇÃO",{skills:[]})[0].id,"invocacao-elemental");
 assert.equal(searchSkills("sons inexistentes",{skills:[]}).length,0);
 assert.deepEqual(searchSkills("combate",{skills:["combate"]}).map(x=>x.id),["combate"]);
});

const selection={base:{group:"practice",key:"apresentacao"},second:{group:"attribute",key:"influencia"}};
const traits={attributes:{influencia:4},practices:{apresentacao:1},knowledges:{},skills:[]};
const opts={step:true,stepDieId:"practice.apresentacao.0"};

test("Influência G4 e Apresentação G1 elevam a Prática inteira para G2",()=>{
 const original=buildPool(traits,selection);
 const plan=buildPool(traits,selection,opts);
 assert.equal(original.pool.length,4);
 assert.ok(plan.ok);
 assert.deepEqual(plan.pool.map(d=>d.sides).sort((a,b)=>a-b),[6,6,10,10,10]);
 assert.equal(new Set(plan.pool.map(d=>d.id)).size,5);
 assert.equal(plan.pool.filter(d=>d.key==="apresentacao").length,2);
 assert.deepEqual(plan.pool.slice(2),original.pool.slice(1));
 assert.equal(canElevateSource(traits,{group:"magic",key:"Magia G4"}),false);
 const full={...traits,practices:{apresentacao:3},knowledges:{medicina:3},skills:["combinacao"]};
 const overflow=buildPool(full,{...selection,complement:{group:"knowledge",key:"medicina"}},{...opts,contextApproved:true,equipmentDie:6});
 assert.match(overflow.errors.join(" "),/nove dados/);
});

test("o uso por rodada e o débito único são persistidos no início. Retenção continua independente",async()=>{
 const savedFoundry=globalThis.foundry,savedRoll=globalThis.Roll;
 let id=0;
 globalThis.foundry={utils:{randomID:()=>String(++id).padStart(16,"0")}};
 globalThis.Roll=class {
  constructor(formula){this.formula=formula;this.dice=formula.split(" + ").map(s=>({faces:Number(s.slice(2)),results:[{result:2}]}));}
  async evaluate(){return this;}
  toJSON(){return {formula:this.formula,dice:this.dice};}
 };
 try{
  const flags={},updates=[],messages=new Map(),scene={id:"s"},combat={id:"c",started:true,round:1,scene};
  const game={scenes:new Map([["s",scene]]),combats:{find:fn=>[combat].find(fn),get:()=>combat},messages};
  const actor={uuid:"test.reinforcement",type:"character",items:new Map(),testUserPermission:()=>true,
   system:{...traits,level:1,courage:10,pp:0,pavorLocal:0},getFlag:(_ns,key)=>flags[key],
   unsetFlag:async(_ns,key)=>{delete flags[key];},
   async update(changes){
    updates.push(changes);
    for(const [key,val] of Object.entries(changes)){
     if(key==="system.courage")this.system.courage=val;
     else if(key.startsWith("flags."+NS+"."))flags[key.split(".").at(-1)]=val;
    }
   }};
  const chat={getSpeaker:()=>({actor:"a"}),async create(data){messages.set(data._id,{getFlag:(ns,key)=>data.flags[ns][key],data});}};
  const user={id:"p"},deps={game,chat},start={action:"start",sceneId:"s",selection,options:opts};
  const responses=await Promise.all([enqueueRoll(actor,user,start,deps),enqueueRoll(actor,user,start,deps)]);
  assert.deepEqual(responses.map(x=>x.started),[true,false]);
  assert.equal(keepForActor(actor,0),2);
  assert.equal(actor.system.courage,9);
  const pending=flags.pendingRoll;
  assert.equal(pending.dice.length,5);
  assert.equal(pending.dice[0].elevated,true);
  const command={id:pending.id};
  await assert.rejects(enqueueRoll(actor,user,{...command,action:"keep",ids:pending.dice.slice(0,3).map(x=>x.id)},deps),/limite/);
  await enqueueRoll(actor,user,{...command,action:"keep",ids:[pending.dice[0].id]},deps);
  await enqueueRoll(actor,user,{...command,action:"finish"},deps);
  assert.equal(actor.system.courage,9);
  assert.match(messages.get(pending.id).data.content,/d10 · Apresentação/);
  assert.equal(updates.filter(x=>Object.hasOwn(x,"system.courage")).length,1);
  await assert.rejects(enqueueRoll(actor,user,start,deps),/nesta rodada/);
  assert.equal(actor.system.courage,9);
  combat.round++;
  assert.ok((await enqueueRoll(actor,user,start,deps)).started);
  assert.equal(actor.system.courage,8);
 }finally{globalThis.foundry=savedFoundry;globalThis.Roll=savedRoll;}
});
