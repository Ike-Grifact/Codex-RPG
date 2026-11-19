/* Codex RPG — sistema Foundry VTT v14. */
import {CodexCharacterData,CodexHumanoidData,CodexAnimalData,CodexMonsterData,CodexMonsterHumanoidData,CodexEquipmentData} from "./data-model.mjs";
import {registerCombatAdjudication} from "./combat-adjudication.mjs";
import {registerDefenseSettings} from "./roll-targets.mjs";
import {registerRollQueries} from "./roll-workflow.mjs";
import {startingResources} from "./equipment-workflow.mjs";
import {CodexCharacterSheet} from "./sheet.mjs";
import {CodexEquipmentSheet} from "./item-sheet.mjs";
import {registerCodexCreation} from "./creation-ui.mjs";
import {registerCodexDice} from "./dice-so-nice.mjs";
import {openPublicPavor,registerPublicPavor,transferCombatPavor} from "./pavor-panel.mjs";
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
 const sheet=foundry.applications.apps.DocumentSheetConfig;
 sheet.registerSheet(foundry.documents.Actor,game.system.id,CodexCharacterSheet,{
  types:["character","humanoid","animal","creature","monsterHumanoid"],makeDefault:true,label:"Codex RPG — Ficha do Actor"
 });
 sheet.registerSheet(foundry.documents.Item,game.system.id,CodexEquipmentSheet,{
  types:["equipment"],makeDefault:true,label:"Codex RPG — Item e equipamento"
 });
 registerPublicPavor();
 registerRollQueries();
 registerDefenseSettings();
});
Hooks.once("ready",()=>{
 game.codex={openPavorPanel:openPublicPavor};
 if(game.user.isGM)game.codex.openPavorPanel();
});
Hooks.on('preCreateActor',(actor,data)=>{
 if(data.type==='character'&&!data.flags?.['codex-rpg-foundry']?.imported&&!data.items?.some(item=>item.system?.kind==='resource')){
  actor.updateSource({items:[...(data.items??[]),...startingResources()]});
 }
});
Hooks.on("createChatMessage",(message)=>{transferCombatPavor(message).catch(e=>console.error("Codex RPG: Pavor",e));});

Hooks.on("preUpdateActor",(_actor,changes,options,userId)=>{
 if(game.users.get(userId)?.isGM)return;
 const paths=Object.keys(foundry.utils.flattenObject(changes)).map(path=>path.replace(/(^|\.)-=/g,"$1"));
 const protectedPath=/^(items|system\.(xp|attributes|knowledges|practices|skills)|flags\.codex-rpg-foundry\.(purchases|xpHistory|skillRefundHistory|creationPending|pendingRoll|lastElevation))(\.|$)/;
 if(paths.some(path=>protectedPath.test(path)||["system","flags","flags.codex-rpg-foundry"].includes(path))||
   (options.recursive===false&&("system" in changes||"flags" in changes))){
  ui.notifications.warn("Use a evolução autorizada pelo Narrador para alterar graus, Perícias ou XP.");
  return false;
 }
});
