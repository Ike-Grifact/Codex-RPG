import {xpLedger} from './rules.mjs';
const ns='codex-rpg-foundry';
export async function migrateRules(){
 if(!game.user.isActiveGM)return;
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
