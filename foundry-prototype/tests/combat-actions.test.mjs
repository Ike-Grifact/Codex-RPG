import test from "node:test";
import assert from "node:assert/strict";
import {actorData} from "../module/creation.mjs";
import {basicLifeLoss,planAttackImpact,applyAttackImpact} from "../module/attack-impact.mjs";
import {standardMovement,movementBudget} from "../module/movement.mjs";
import {prepareCombatAction,changeRollSource} from "../module/combat-action.mjs";
import {buildPool} from "../module/rules.mjs";
import {enqueueRoll} from "../module/roll-workflow.mjs";
import {pendingRollEntry,pendingRollFor} from "../module/roll-resolution.mjs";

const ns="codex-rpg-foundry";
const user={id:"player",viewedScene:"s"};
const rollId="ATTACK0000000001";
class ItemCollection extends Map{
 [Symbol.iterator](){return this.values();}
 find(predicate){return [...this.values()].find(predicate);}
}
function actor(type,id,options={}){
 const doc={...actorData(type,options),id,uuid:"Actor."+id,items:new ItemCollection(),flags:{},updates:0,
  testUserPermission:()=>true,
  getFlag(scope,key){return this.flags[scope]?.[key];},
  async update(changes){
   this.updates++;
   for(const [key,value] of Object.entries(structuredClone(changes))){
    if(key==="items"){for(const item of value)this.items.get(item._id).system=item.system;continue;}
    const parts=key.split(".");
    const last=parts.pop(),parent=parts.reduce((object,part)=>object[part]??={},this);
    parent[last]=value;
   }
  },
  async unsetFlag(scope,key){delete this.flags[scope][key];},
 };
 return doc;
}
function armor(target){
 const source={_id:"vest",type:"equipment",name:"Armadura",system:{
  kind:"armor",equipped:true,grade:1,category:"leve",integrity:{value:1,max:7},description:"Personalizada"
 }};
 const item={...structuredClone(source),id:source._id,toObject(){return {...source,system:structuredClone(this.system)};}};
 target.items.set(item.id,item);
 return item;
}

test("deslocamento segue Agilidade e grupos completos de três em Atletismo",()=>{
 assert.equal(standardMovement({attributes:{agilidade:2},practices:{atletismo:3}}),11);
 assert.equal(standardMovement({attributes:{agilidade:1},practices:{atletismo:2}}),9);
 assert.deepEqual(movementBudget({attributes:{agilidade:2}},40,"ft"),{max:10,used:12.192,band:"antecipar"});
 assert.equal(movementBudget({},100,"polegadas de mapa"),null);
});

test("a régua aplica as três faixas ao total do turno, incluindo mapas sem unidade",()=>{
 const system={attributes:{agilidade:4},practices:{atletismo:3}};
 assert.deepEqual([0,13,14,26,27].map(total=>movementBudget(system,total,"").band),
  ["exito","exito","antecipar","antecipar","pavor"]);
 assert.equal(movementBudget(system,13/.3048,"ft").band,"exito");
 assert.equal(movementBudget(system,26/.3048,"ft").band,"antecipar");
});

test("o desarmado exige Disciplina na pilha, dispensa Perícia de arma e permite trocar o Atributo",()=>{
 const pc=actor("character","pc",{});
 const draft=prepareCombatAction(pc,"attack");
 assert.equal(draft.base.key,"armas_conjuracao");
 assert.equal(buildPool(pc.system,draft,{mode:"armas",actionType:"attack"}).ok,true);
 assert.equal(buildPool(pc.system,draft,{mode:"armas",actionType:"attack",equipmentDie:6}).ok,false);
 assert.equal(changeRollSource(pc.system,draft,"base","practice:atletismo",true),null);
 assert.equal(changeRollSource(pc.system,draft,"second","attribute:agilidade",true).second.key,"agilidade");
 const enemy=actor("creature","enemy",{});
 const brute=prepareCombatAction(enemy,"attack");
 assert.equal(buildPool(enemy.system,brute,{mode:"armas",actionType:"attack"}).ok,true);
});

test("ataque básico gasta a Integridade, consome só a Vida correspondente e limita reservas",()=>{
 const enemy=actor("creature","enemy",{pavorLocal:3});
 armor(enemy);
 const {changes,receipt}=planAttackImpact(enemy,{mode:"armas",damage:7,pavor:3});
 assert.equal(changes.items[0].system.integrity.value,0);
 assert.equal(changes.items[0].system.description,"Personalizada");
 assert.equal(changes["system.life.value"],2);
 assert.equal(changes["system.pavorLocal"],4);
 assert.deepEqual([receipt.integrity,receipt.life,receipt.pavor,receipt.overflow],[1,2,1,2]);
 assert.deepEqual([0,1,5,6,8,9].map(basicLifeLoss),[0,1,1,2,2,3]);
 const pc=actor("character","pc",{courage:8});
 const failed=planAttackImpact(pc,{mode:"armas",damage:0,pavor:3});
 assert.deepEqual(failed.changes,{"system.courage":10});
});

test("efeitos especiais e dano colossal ficam manuais e token removido não redireciona para o Actor",async()=>{
 const target=actor("character","pc");
 assert.equal(planAttackImpact(target,{mode:"conjuracao",element:"veneno",damage:3,pavor:0}).receipt.manual,3);
 assert.equal(planAttackImpact(target,{mode:"armas",damage:12,pavor:0}).receipt.life,0);
 assert.equal(planAttackImpact(target,{mode:"armas",damage:3,pavor:0},{autoLife:false}).receipt.manual,3);
 assert.deepEqual(await applyAttackImpact({tokenUuid:"Scene.s.Token.t",actorUuid:"Actor.outro"},rollId,{},async()=>({actor:target})),{missing:true});
 assert.equal(target.updates,0);
});

test("tokens desvinculados retomam apenas a rolagem salva na própria instância",()=>{
 const base=actor("creature","enemy");
 const previous={id:"base",version:3,publication:{id:"base-message"}};
 base.flags[ns]={pendingRoll:previous};
 const delta=actor("creature","delta");
 const token={isToken:true,token:{delta},getFlag:(namespace,key)=>({
  ...base.getFlag(namespace,key),...delta.getFlag(namespace,key),
 })};
 assert.equal(pendingRollFor(base),previous);
 assert.equal(pendingRollFor(token),null);
 delta.flags[ns]={pendingRoll:{id:"old-token"}};
 assert.deepEqual(pendingRollEntry(token),{key:"pendingRoll",roll:{id:"old-token",version:3,publication:undefined}});
 const rolled={id:"token",version:6,selected:[],options:{mode:"armas"}};
 delta.flags[ns]={tokenPendingRoll:rolled};
 assert.equal(pendingRollFor(token),rolled);
});

test("retomar o chat após falha não repete dano, Pavor ou cobrança; dados descartados não transferem Pavor",async()=>{
 const attacker=actor("character","pc"),target=actor("creature","enemy");
 const vest=armor(target);
 const targetUuid="Scene.s.Token.t";
 const messages=new Map();
 const game={messages,combats:new Map()};
 const resolveUuid=async uuid=>uuid===targetUuid?{actor:target}:null;
 const pending={id:rollId,version:6,selected:["a","b"],dice:[
  {id:"a",group:"attribute",key:"forca",sides:6,face:6},
  {id:"b",group:"practice",key:"armas_conjuracao",sides:10,face:9},
  {id:"ignored",group:"practice",key:"atletismo",sides:10,face:9},
 ],options:{mode:"armas",actionType:"attack",targetActorUuid:target.uuid,targetTokenUuid:targetUuid,de:2,activationCost:0}};
 attacker.flags[ns]={pendingRoll:pending};
 let fail=true;
 const chat={getSpeaker:()=>({actor:attacker.id}),async create(source){
  if(fail)throw Error("Chat indisponível");
  messages.set(source._id,{getFlag:(namespace,key)=>source.flags[namespace][key],source});
 }};
 const send=()=>enqueueRoll(attacker,user,{action:"finish",id:rollId},{game,chat,resolveUuid});
 await assert.rejects(send(),/indisponível/);
 assert.deepEqual([target.system.life.value,target.system.pavorLocal,vest.system.integrity.value],[3,1,0]);
 fail=false;
 await Promise.all([send(),send()]);
 assert.equal(target.updates,1);
 assert.equal(messages.size,1);
 assert.match([...messages.values()][0].source.content,/Pavor transferido ao alvo/);
 assert.equal([...messages.values()][0].source.flags[ns].adjudication.autoTarget,true);
 assert.equal([...messages.values()][0].source.flags[ns].adjudication.targetTokenUuid,targetUuid);
});

test("conjurador com elemento adquirido rola sem consulta de aprovação do Narrador",async()=>{
 const caster=actor("character","caster",{skills:["fogo"],attributes:{inteligencia:1},practices:{armas_conjuracao:1}});
 const selection=prepareCombatAction(caster,"spell");
 const game={scenes:new Map(),combats:[]};
 globalThis.foundry={utils:{randomID:()=>rollId}};
 globalThis.Roll=class {constructor(formula){this.dice=formula.split(" + ").map(()=>({results:[{result:1}]}));}async evaluate(){return this;}toJSON(){return {};}}
 try{
  const deps={game,confirm:async()=>assert.fail("Não deve pedir aprovação")};
  const response=await enqueueRoll(caster,user,{action:"start",selection,options:{mode:"conjuracao",actionType:"spell",element:"fogo"}},deps);
  assert.equal(response.started,true);
  assert.equal(caster.getFlag(ns,"pendingRoll").options.element,"fogo");
  await caster.unsetFlag(ns,"pendingRoll");
  const focus={id:"f",system:{kind:"focus",equipped:true,grade:1,category:"leve",die:6,element:"Fogo"}};
  caster.items.set(focus.id,focus);
  assert.throws(()=>prepareCombatAction(caster,"spell",{},focus.id),/habilitação/);
  caster.system.skills.push("criar-item-foco-magia");
  const focused=await enqueueRoll(caster,user,{action:"start",selection,options:{mode:"conjuracao",actionType:"spell",equipmentId:"f"}},deps);
  assert.equal(focused.started,true);
  const roll=caster.getFlag(ns,"pendingRoll");
  assert.equal(roll.options.element,"fogo");
  assert.equal(roll.dice.filter(d=>d.group==="equipment").length,1);
 }finally{delete globalThis.Roll;delete globalThis.foundry;}
});
