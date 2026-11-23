/* Codex RPG — sistema Foundry VTT v14. */
import {CodexCharacterData,CodexHumanoidData,CodexAnimalData,CodexMonsterData,CodexMonsterHumanoidData,CodexEquipmentData,CodexSkillData} from "./data-model.mjs";
import {bardEffectItem,splitBardSkills} from "./bard.mjs";
import {CodexSkillSheet} from './skill-sheet.mjs';
import {migrateRules} from './rules-migration.mjs';
import {registerCombatAdjudication} from "./combat-adjudication.mjs";
import {registerDefenseSettings} from "./roll-targets.mjs";
import {registerRollQueries} from "./roll-workflow.mjs";
import {startingResources} from "./equipment-workflow.mjs";
import {CodexCharacterSheet} from "./sheet.mjs";
import {CodexEquipmentSheet} from "./item-sheet.mjs";
import {registerCodexCreation} from "./creation-ui.mjs";
import {registerCodexDice} from "./dice-so-nice.mjs";
import {openPublicPavor,registerPublicPavor} from "./pavor-panel.mjs";
import {registerCodexMovement} from "./movement.mjs";
Hooks.once("diceSoNiceReady",registerCodexDice);
registerCodexCreation();
registerCombatAdjudication();
Hooks.once("init",()=>{
 CONFIG.Actor.dataModels.character=CodexCharacterData;
 CONFIG.Actor.dataModels.humanoid=CodexHumanoidData;
 CONFIG.Actor.dataModels.creature=CodexMonsterData;
 CONFIG.Actor.dataModels.animal=CodexAnimalData;
 CONFIG.Actor.dataModels.monsterHumanoid=CodexMonsterHumanoidData;
 CONFIG.Item.dataModels.equipment=CodexEquipmentData;
 CONFIG.Item.dataModels.skill=CodexSkillData;
 const sheet=foundry.applications.apps.DocumentSheetConfig;
 sheet.registerSheet(foundry.documents.Actor,game.system.id,CodexCharacterSheet,{
  types:["character","humanoid","animal","creature","monsterHumanoid"],makeDefault:true,label:"Codex RPG — Ficha do Actor"
 });
 sheet.registerSheet(foundry.documents.Item,game.system.id,CodexEquipmentSheet,{
  types:["equipment"],makeDefault:true,label:"Codex RPG — Item e equipamento"
 });
 sheet.registerSheet(foundry.documents.Item,game.system.id,CodexSkillSheet,{types:['skill'],makeDefault:true,label:'Codex RPG — Perícia'});
 registerPublicPavor();
 registerRollQueries();
 registerDefenseSettings();
 registerCodexMovement();
 game.settings.register("codex-rpg-foundry","experimentalLifeDamage",{
  name:"Aplicar perda experimental de Vida",
  hint:"Acerto com pelo menos 5 Êxitos + Pavor válidos tira 2 de Vida de alvo sem armadura. Abaixo do patamar e o excedente de Integridade são adjudicados.",
  scope:"world",config:true,type:Boolean,default:true
 });
});
Hooks.once("ready",()=>{
 if(game.user.isActiveGM)void migrateRules().catch(error=>ui.notifications.error('Codex: '+error.message));
 game.codex={openPavorPanel:openPublicPavor};
 if(game.user.isGM)game.codex.openPavorPanel();
});
const rejectBardSkill=()=>{
 ui.notifications.warn('Esta técnica integra a Maestria em Apresentação. Consulte seu repertório.');
 return false;
};
Hooks.on('preCreateItem',(item)=>{
 if(bardEffectItem(item))return rejectBardSkill();
 if(!item.parent)return;
 if(item.type==='skill'){
  ui.notifications.warn('Adquira a Perícia pelo Codex Genético. O Item define uma regra consultável.');return false;
 }
 if(!game.user.isGM){ui.notifications.warn('Compre pela Loja ou solicite a concessão ao Narrador.');return false;}
});
Hooks.on("preUpdateItem",(item,changes)=>{
 if(item.type!=="skill")return;
 const updated={type:item.type,name:changes.name??item.name,
  system:{canonicalId:foundry.utils.getProperty(changes,"system.canonicalId")??item.system.canonicalId}};
 if(!bardEffectItem(item)&&bardEffectItem(updated))return rejectBardSkill();
});
Hooks.on('preCreateActor',(actor)=>{
 const data=actor.toObject(),namespace='codex-rpg-foundry';
 const flags=data.flags?.[namespace];
 const stored=data.system.skills??[];
 const {skills,historical}=splitBardSkills([...new Set(stored.map(id=>id==="arma-certa"?"manejo-perfeito":id))]);
 const items=data.items??[],legacyItems=items.filter(bardEffectItem);
 const changes={'system.creationBudget':15};
 if(data.type!=='character')changes['system.courage']=0;
 if(historical.length||stored.includes("arma-certa"))changes['system.skills']=skills;
 if(historical.length||legacyItems.length){
  const old=flags?.bardLegacy;
  changes['flags.'+namespace+'.bardLegacy']={
   ids:[...new Set([...(old?.ids??[]),...historical])],
   items:[...(old?.items??[]),...legacyItems]
  };
 }
 const needsResources=data.type==='character'&&!flags?.imported&&!items.some(item=>item.system?.kind==='resource');
 if(needsResources)changes.items=startingResources();
 actor.updateSource(changes);
 // Antes da criação, a coleção só modifica o rascunho. O original já está na flag de histórico.
 for(const item of legacyItems)actor.items.delete(item._id);
});
Hooks.on("preUpdateActor",(_actor,changes,options,userId)=>{
 const life=foundry.utils.getProperty(changes,'system.life.value');
 if(game.users.get(userId)?.isGM&&_actor.system.transformation?.size==='pequena'&&typeof life==='number'&&life<_actor.system.life.value)foundry.utils.setProperty(changes,'system.transformation',{});
 if(game.users.get(userId)?.isGM)return;
 const paths=Object.keys(foundry.utils.flattenObject(changes)).map(path=>path.replace(/(^|\.)-=/g,"$1"));
 const protectedPath=/^(items|system\.(xp|creationBudget|transformation|attributes|knowledges|practices|skills|race|pureElement|runeElements|racialInitialAttributes|perseverancaUsed|runeShieldFreeUsed|spiritualSpheres|companion)|flags\.codex-rpg-foundry\.(rulesMigration|purchases|xpHistory|skillRefundHistory|creationPending|pendingRoll|tokenPendingRoll|lastElevation|impactReceipts|attackShortcuts|bardLegacy|courageSpent|casting))(\.|$)/;
 if(paths.some(path=>protectedPath.test(path)||["system","flags","flags.codex-rpg-foundry"].includes(path))||
   (options.recursive===false&&("system" in changes||"flags" in changes))){
  ui.notifications.warn("Use a evolução autorizada pelo Narrador para alterar graus, Perícias ou XP.");
  return false;
 }
});
