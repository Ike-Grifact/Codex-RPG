import {CodexCharacterData,CodexHumanoidData,CodexMonsterData,CodexEquipmentData} from "./data-model.mjs";
import {CodexCharacterSheet} from "./sheet.mjs";
import {CodexEquipmentSheet} from "./item-sheet.mjs";
import {refreshPavor,registerPavor} from "./pavor-panel.mjs";
import {registerRollQueries} from "./roll-workflow.mjs";

Hooks.once("init",()=>{
 CONFIG.Actor.dataModels.character=CodexCharacterData;
 CONFIG.Actor.dataModels.humanoid=CodexHumanoidData;
 CONFIG.Actor.dataModels.creature=CodexMonsterData;
 CONFIG.Item.dataModels.equipment=CodexEquipmentData;
 const sheets=foundry.applications.apps.DocumentSheetConfig;
 sheets.registerSheet(foundry.documents.Actor,game.system.id,CodexCharacterSheet,{
  types:["character","humanoid","creature"],makeDefault:true,label:"Codex RPG — Ficha"
 });
 sheets.registerSheet(foundry.documents.Item,game.system.id,CodexEquipmentSheet,{
  types:["equipment"],makeDefault:true,label:"Codex RPG — Equipamento"
 });
 Hooks.on("preCreateActor",(actor,data)=>{
  if(["character","humanoid"].includes(actor.type)&&data.system?.creationOpen==null){
   actor.updateSource({"system.creationOpen":true});
  }
 });
 registerPavor();
 registerRollQueries();
});
Hooks.once("ready",()=>{game.codex={openPavorPanel:refreshPavor};});
