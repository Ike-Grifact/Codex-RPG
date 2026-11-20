import test from 'node:test';
import assert from 'node:assert/strict';

globalThis.foundry={data:{fields:{}},abstract:{TypeDataModel:class{static migrateData(source){return source;}}}};
const {CodexCharacterData}=await import('../module/data-model.mjs');
const {migrateRules}=await import('../module/rules-migration.mjs');

test('carregamento histórico conserva formação 20, enquanto atualizações parciais e fichas novas conservam 15',()=>{
 const source={level:1,attributes:{forca:1},knowledges:{},practices:{atletismo:1},skills:['futura'],life:{value:4},xp:7,courage:10,pp:3};
 const old=CodexCharacterData.migrateData(structuredClone(source));
 assert.equal(old.creationBudget,20);assert.equal(old.xp,7);assert.equal(old.pp,3);assert.deepEqual(old.skills,['futura']);
 const fresh=CodexCharacterData.migrateData({...source,creationBudget:15});assert.equal(fresh.creationBudget,15);
 const partial=CodexCharacterData.migrateData({attributes:{inteligencia:1},skills:['fogo']});
 assert.equal(Object.hasOwn(partial,'creationBudget'),false);
 assert.deepEqual(partial,{attributes:{inteligencia:1},skills:['fogo']});
});
test('migração registra a origem uma única vez e conserva XP, Perícias e PP histórico sem converter recursos',async()=>{
 const actor={system:{level:1,creationBudget:20,attributes:{forca:1},knowledges:{},practices:{atletismo:1},skills:['futura','manejo-duplo'],xp:7,pp:3,courage:12},_stats:{systemVersion:'0.2.1.15'},
  getFlag(){return this.record;},async update(changes){this.updates=(this.updates??0)+1;this.record=changes['flags.codex-rpg-foundry.rulesMigration'];}};
 globalThis.game={user:{isActiveGM:true,id:'gm'},actors:[actor]};
 const before=structuredClone(actor.system);await migrateRules();await migrateRules();
 assert.equal(actor.updates,1);assert.deepEqual(actor.system,before);
 assert.deepEqual(actor.record.skills,before.skills);assert.equal(actor.record.legacyPP,3);assert.equal(actor.record.xp,7);
});
