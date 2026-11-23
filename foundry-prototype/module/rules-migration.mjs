import {xpLedger} from './rules.mjs';
import {catalogArmorMigration} from './equipment-migration.mjs';
const ns='codex-rpg-foundry';
export async function migrateRules(){
 if(!game.user.isActiveGM)return;
 const synthetic = [...game.scenes].flatMap(scene => [...scene.tokens]
  .filter(token => !token.actorLink && token.actor).map(token => token.actor));
 for(const item of game.items){
  const integrity=catalogArmorMigration(item);
  if(integrity)await item.update({"system.integrity":integrity});
 }
 for(const actor of [...game.actors,...synthetic]){
  const armorUpdates=[...actor.items].flatMap(item=>{
   const integrity=catalogArmorMigration(item);
   return integrity?[{_id:item.id,"system.integrity":integrity}]:[];
  });
  if(armorUpdates.length)await actor.updateEmbeddedDocuments("Item",armorUpdates);
  const update={};
  if(actor.type!=="character"&&actor.system.courage)update["system.courage"]=0;
  if(actor.system.skills?.includes("arma-certa"))update["system.skills"]=[...new Set(actor.system.skills.map(id=>id==="arma-certa"?"manejo-perfeito":id))];
  if(Object.keys(update).length)await actor.update(update);
 }
 for(const actor of game.actors){
  if(actor.getFlag(ns,'rulesMigration')?.version==='1.0')continue;
  const oldVersion=actor._stats?.systemVersion;
  if(actor.system.creationBudget!==20)continue;
  const history={version:'1.0',from:oldVersion,at:Date.now(),userId:game.user.id,
   skills:[...actor.system.skills],xp:actor.system.xp,spentCurrent:xpLedger(actor.system).spent,legacyPP:actor.system.pp??0,previousFormation:20};
  // O patrimônio de formação já concedido fica identificado na ficha histórica.
  // As novas compras usam os custos vigentes, e a lista de aquisições é preservada.
  await actor.update({'system.creationBudget':20,['flags.'+ns+'.rulesMigration']:history});
 }
}
