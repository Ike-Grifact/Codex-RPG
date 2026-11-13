/* Codex RPG — sistema Foundry VTT v14. */
import {CodexCharacterData,CodexHumanoidData,CodexMonsterData,CodexEquipmentData} from "./data-model.mjs";
import {CodexCharacterSheet} from "./sheet.mjs";
import {CodexEquipmentSheet} from "./item-sheet.mjs";
import {openPublicPavor,registerPublicPavor,transferCombatPavor} from "./pavor-panel.mjs";
Hooks.once("init",()=>{
 CONFIG.Actor.dataModels.character=CodexCharacterData;
 CONFIG.Actor.dataModels.humanoid=CodexHumanoidData;
 CONFIG.Actor.dataModels.creature=CodexMonsterData;
 CONFIG.Item.dataModels.equipment=CodexEquipmentData;
 const sheet=foundry.applications.apps.DocumentSheetConfig;
 sheet.registerSheet(foundry.documents.Actor,game.system.id,CodexCharacterSheet,{
  types:["character","humanoid","creature"],makeDefault:true,label:"Codex RPG — Ficha do Actor"
 });
 sheet.registerSheet(foundry.documents.Item,game.system.id,CodexEquipmentSheet,{
  types:["equipment"],makeDefault:true,label:"Codex RPG — Item e equipamento"
 });
 registerPublicPavor();
});
Hooks.once("ready",()=>{
 game.codex={openPavorPanel:openPublicPavor};
 if(game.user.isGM)game.codex.openPavorPanel();
});
Hooks.on("createChatMessage",(message)=>{transferCombatPavor(message).catch(e=>console.error("Codex RPG: Pavor",e));});
