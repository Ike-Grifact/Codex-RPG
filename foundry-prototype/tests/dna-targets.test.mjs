import test from "node:test";
import assert from "node:assert/strict";
import {advancementPlan, creationMissing, skillDetails} from "../module/advancement.mjs";
import {lookupTarget, readDefense, sealDefense} from "../module/roll-targets.mjs";

const apprentice=()=>({attributes:{forca:0,agilidade:0,destreza:0,inteligencia:0,influencia:0,vigor:0},
 knowledges:{medicina:0},practices:{armas_conjuracao:0,atletismo:0,artesao:0},skills:[],xp:0});
test("O DNA compra com o orçamento nativo e identifica requisitos em falta",()=>{
 const actor=apprentice();
 assert.deepEqual(creationMissing(actor),{attr:true,training:true});
 assert.match(skillDetails(actor,"armas-leves").blocker,/Disciplina G1/);
 assert.throws(()=>advancementPlan(actor,{kind:"skill",key:"armas-leves"}),/Disciplina G1/);
 assert.deepEqual(advancementPlan(actor,{kind:"grade",group:"attribute",key:"forca",delta:1},true),{"system.attributes.forca":1});
 actor.attributes.forca=1;
 assert.deepEqual(advancementPlan(actor,{kind:"grade",group:"knowledge",key:"medicina",delta:1},true),{"system.knowledges.medicina":1});
 actor.knowledges.medicina=1;
 assert.deepEqual(creationMissing(actor),{attr:false,training:false});
 assert.deepEqual(advancementPlan(actor,{kind:"grade",group:"practice",key:"armas_conjuracao",delta:1}),{"system.practices.armas_conjuracao":1});
 actor.practices.armas_conjuracao=1;
 assert.deepEqual(advancementPlan(actor,{kind:"skill",key:"armas-leves"}),{"system.skills":["armas-leves"]});
 actor.skills=["armas-leves"];
 assert.throws(()=>advancementPlan(actor,{kind:"grade",group:"practice",key:"armas_conjuracao",delta:-1}),/requisito/);
 actor.attributes.forca=5;
 assert.throws(()=>advancementPlan(actor,{kind:"grade",group:"attribute",key:"forca",delta:1}),/XP insuficiente/);
});

test("O Token usa a DE do modo escolhido, mesmo sem combate, e respeita visibilidade",()=>{
 const user={isGM:false,viewedScene:"scene"};
 const actor={uuid:"Actor.defender",system:{attributes:{agilidade:3,destreza:0,vigor:0}},
  items:[{type:"equipment",system:{kind:"armor",equipped:true,category:"leve"}}],
  ownership:{default:0},testUserPermission:()=>false};
 const token={actor,name:"Gárgula",uuid:"Scene.scene.Token.defender",hidden:false};
 const game={scenes:new Map([["scene",{tokens:new Map([["defender",token]])}]])};
 const general=lookupTarget(game,user,"scene",["defender"]);
 assert.equal(general.de,3);
 assert.equal(general.canInspect,false);
 assert.equal(general.publicDefense,false);
 assert.equal(lookupTarget(game,user,"scene",["defender"],true).de,4);
 assert.throws(()=>lookupTarget(game,user,"scene",["gone"]),/indisponível/);
 assert.throws(()=>lookupTarget(game,user,"scene",["defender","gone"]),/apenas um/);
 token.hidden=true;
 assert.throws(()=>lookupTarget(game,user,"scene",["defender"]),/indisponível/);
 assert.equal(lookupTarget(game,{isGM:true},"scene",["defender"]).actorUuid,null);
});

test("A DE reservada fica cifrada no Actor e só é aberta com a chave local do Narrador",async()=>{
 const settings=()=>{
  const data=new Map();
  return {get:(_ns,key)=>data.get(key),set:async(_ns,key,value)=>data.set(key,value)};
 };
 const gm={settings:settings()},player={settings:settings()};
 const pending={id:"roll",options:{de:null,privateDefense:true}};
 pending.options.sealedDE=await sealDefense(gm,pending,7);
 assert.equal(pending.options.de,null);
 assert.equal(await readDefense(gm,pending),7);
 await assert.rejects(readDefense(player,pending),/navegador do Narrador/);
 await assert.rejects(readDefense(gm,{...pending,id:"outra rolagem"}),/navegador do Narrador/);
});
