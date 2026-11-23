import test from "node:test";
import assert from "node:assert/strict";
import {catalogArmorMigration} from "../module/equipment-migration.mjs";
import {G1_CATALOG} from "../module/catalog.mjs";
import {buildPool, resolveRoll, hasSmallCompanion, lifeMax, healthByLife} from "../module/rules.mjs";
import {spellPlan} from "../module/conjuration.mjs";
import {spendActionResource, healthCost} from "../module/combat-resources.mjs";
import {planAttackImpact} from "../module/attack-impact.mjs";
import {defenseDE} from "../module/equipment-logic.mjs";

const selection={base:{group:"practice",key:"armas_conjuracao"},second:{group:"attribute",key:"forca"}};
const system={level:1,attributes:{forca:1,agilidade:1,destreza:1,vigor:1},skills:["fogo","agua","criar-item-foco-magia","armas-leves"],practices:{armas_conjuracao:1},life:{value:5},courage:10,pavorLocal:4};
const item=(name,overrides={})=>{
 const {name:label,...data}=G1_CATALOG.find(row=>row.name===name);
 return {id:label,name:label,type:"equipment",system:{...data,...overrides},toObject(){return {_id:this.id,system:structuredClone(this.system)};}};
};

test("a revisão v0.90 migra os dois históricos, preserva dano e distingue escudos, G2 e peças próprias",()=>{
 const old=[["Roupas Simples",3,2],["Armadura Leve",7,5,10],["Armadura Média",12,8,15],["Armadura Pesada",17,12,20]];
 for(const [name,previous,max,older] of old){
  for(const prior of [previous,older].filter(Boolean)){
   const standard=item(name,{integrity:{max:prior,value:prior-1}});
   const changed=catalogArmorMigration(standard);
   assert.deepEqual(changed,{value:max-1,max});
   assert.equal(catalogArmorMigration(item(name,{integrity:changed})),undefined);
   assert.equal(catalogArmorMigration(item(name,{...standard.system,grade:2})),undefined);
   assert.equal(catalogArmorMigration(item(name,{...standard.system,description:"Peça da campanha"})),undefined);
  }
 }
 assert.equal(catalogArmorMigration(item("Escudo Pesado",{integrity:{max:20,value:19}})),undefined);
});

test("G2 gasta uma carga para 1 turno, G4 usa 2d12, dois elementos e 1A",()=>{
 const caster={system,items:new Map(["fogo","agua"].map(id=>[id,{id,system:{kind:"focus",element:id,grade:3,focusCharges:3}}]))};
 const g2={element:"fogo",focusId:"fogo",magicGrade:2,magicGradeConfirmed:true};
 assert.equal(spellPlan(caster,g2).turns,2);
 assert.equal(spellPlan(caster,{...g2,magicCharges:1}).turns,1);
 assert.throws(()=>spellPlan(caster,{...g2,magicCharges:2}),/cargas/);
 const g4={...g2,magicGrade:4,magicSecondElement:"agua",magicSecondFocusId:"agua",magicCharges:3};
 assert.deepEqual([spellPlan(caster,g4).turns,spellPlan(caster,g4).courage],[3,2]);
 assert.throws(()=>spellPlan(caster,{...g4,magicSecondElement:"fogo"}),/distintos/);
 assert.throws(()=>spellPlan(caster,{...g4,magicSecondFocusId:""}),/cargas/);
 const plan=buildPool(system,selection,{mode:"conjuracao",actionType:"spell",magicGrade:4,equipmentDie:6});
 assert.deepEqual(plan.pool.filter(die=>die.group==="magic").map(die=>die.sides),[12,12]);
 assert.equal(plan.pool.some(die=>die.group==="equipment"),false);
 assert.equal(resolveRoll([{id:"d",sides:4,face:1}],["d"],{magicMixA:1}).ok,false);
});

test("Fulminante eleva um dado de arma e dobra d12 sem acumular com Perfurante",()=>{
 for(const [equipmentDie,expected] of [[6,[10]],[10,[12]],[12,[12,12]]]){
  const plan=buildPool(system,selection,{equipmentDie,fulminante:"golpe-fulminante"});
  assert.deepEqual(plan.pool.filter(die=>die.group==="equipment").map(die=>die.sides),expected);
 }
 const dice=[{id:"e",sides:10,face:9},{id:"p",sides:4,face:3}];
 const result=resolveRoll(dice,["e","p"],{de:0,fulminante:true,fullPavorDamage:true});
 assert.equal(result.damage,result.e+result.p);
});

test("DE e recursos seguem o tipo de Actor e respeitam o gasto persistido da rodada",()=>{
 const shield=item("Escudo Leve",{equipped:true});
 const armor=item("Roupas Simples",{equipped:true});
 const actor={type:"character",system:{...system,skills:[...system.skills,"maestria-escudos"]},items:[shield,armor],
  getFlag:()=>({key:"c:2",amount:4})};
 assert.equal(defenseDE(actor),5);
 const round={id:"c",round:2,started:true};
 assert.equal(spendActionResource(actor,1,round)["flags.codex-rpg-foundry.courageSpent"].amount,5);
 assert.throws(()=>spendActionResource(actor,2,round),/rodada/);
 assert.equal(spendActionResource(actor,2,{...round,round:3})["system.courage"],8);
 assert.deepEqual(spendActionResource({...actor,type:"humanoid"},2,round),{"system.pavorLocal":2});
 assert.equal(healthCost({...actor,type:"creature",system:{...actor.system,monsterRules:true}},healthByLife(actor.system,2)),0);
});

test("o patamar exige acerto sem armadura; transbordo e crítico permanecem na mesa",()=>{
 const armor=item("Armadura Leve",{equipped:true,integrity:{max:5,value:2}});
 const target={type:"character",system,items:[]};
 const attack={mode:"armas",damage:4,reached:5,pavor:0};
 assert.equal(planAttackImpact(target,attack).changes["system.life.value"],3);
 assert.equal(planAttackImpact(target,{...attack,reached:4}).receipt.manual,4);
 assert.equal(planAttackImpact(target,{...attack,critical:2}).receipt.life,0);
 const protectedHit=planAttackImpact({...target,items:[armor]},attack);
 assert.equal(protectedHit.receipt.integrity,2);
 assert.equal(protectedHit.receipt.life,0);
 assert.equal(protectedHit.receipt.manual,2);
});

test("companheiro presente eleva o máximo e o veneno exige Sangramento anterior",()=>{
 const domador={...system,skills:[...system.skills,"domar-criatura-pequena"],companion:{name:"Ira",species:"serpente",present:true}};
 assert.equal(hasSmallCompanion(domador),true);assert.equal(lifeMax(domador),lifeMax(system)+1);
 assert.equal(lifeMax({...domador,skills:[]}),lifeMax(system));
 const hit={mode:"armas",reached:4,damage:3,pavor:0,veneno:true,sangramento:true};
 const target={type:"humanoid",system:{...system,status:{}},items:[]};
 assert.equal(planAttackImpact(target,hit).receipt.envenenado,false);
 assert.equal(planAttackImpact({...target,system:{...target.system,status:{sangramento:true}}},hit).receipt.envenenado,true);
});
