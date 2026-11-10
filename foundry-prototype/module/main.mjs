/* Protótipo isolado: Foundry VTT v14, identidade Codex RPG. */
import {CodexCharacterData,CodexEquipmentData} from "./data-model.mjs";
import {CodexCharacterSheet} from "./sheet.mjs";
import {CodexEquipmentSheet} from "./item-sheet.mjs";

Hooks.once("init",()=>{
  CONFIG.Actor.dataModels.character=CodexCharacterData;
  CONFIG.Item.dataModels.equipment=CodexEquipmentData;
  const sheets=foundry.applications.apps.DocumentSheetConfig;
  sheets.registerSheet(foundry.documents.Actor,game.system.id,CodexCharacterSheet,{
    types:["character"],makeDefault:true,label:"Codex RPG — Ficha jogável (protótipo)"
  });
  sheets.registerSheet(foundry.documents.Item,game.system.id,CodexEquipmentSheet,{
    types:["equipment"],makeDefault:true,label:"Codex RPG — Equipamento (protótipo)"
  });
  console.info("Codex RPG | Protótipo Foundry 0.1.0 carregado.");
});
