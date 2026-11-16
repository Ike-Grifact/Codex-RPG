/* Codex RPG — sistema Foundry VTT v14. */
import {CodexCharacterData,CodexHumanoidData,CodexAnimalData,CodexMonsterData,CodexMonsterHumanoidData,CodexEquipmentData} from "./data-model.mjs";
import {registerCombatAdjudication} from "./combat-adjudication.mjs";
import {registerDefenseSettings} from "./roll-targets.mjs";
import {registerRollQueries} from "./roll-workflow.mjs";
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
Hooks.on("createChatMessage",(message)=>{transferCombatPavor(message).catch(e=>console.error("Codex RPG: Pavor",e));});
