/* Codex RPG — sistema Foundry VTT v14, protótipo 0.2.0. */
import {CodexCharacterData,CodexHumanoidData,CodexMonsterData,CodexEquipmentData} from "./data-model.mjs";
import {CodexCharacterSheet} from "./sheet.mjs";
import {CodexEquipmentSheet} from "./item-sheet.mjs";
import {CodexPavorPanel,transferCombatPavor,NS} from "./pavor-panel.mjs";
import {monsterCap} from "./rules.mjs";
// EXPERIMENTAL: ao iniciar cada encontro, a oposição (humanoides e criaturas) recebe sua reserva local cheia.
// Não se repete no começo de rodadas/turnos; os mesmos custos e oportunidades continuam em vigor.
export async function fillStartingEnemyPavor(combat){
 if(!game.user.isGM||!combat)return;
 const seen=new Set(),actors=[];
 for(const combatant of combat.combatants){
  const actor=combatant.actor;
  if(!actor||!["creature","humanoid"].includes(actor.type)||seen.has(actor.uuid))continue;
  seen.add(actor.uuid);
  actors.push(actor);
 }
 await Promise.all(actors.map(actor=>actor.update({"system.pavorLocal":monsterCap(actor.system.threatGrade)})));
}
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
 game.settings.register(NS,"publicPavor",{name:"Pavor público do Narrador",hint:"Saldo, com teto dinâmico de 2 + jogadores.",
  scope:"world",config:false,type:Number,default:2});
 console.info("Codex RPG | Foundry 0.2.0: Personagem, Humanoide, Criatura.");
});
Hooks.once("ready",()=>{
 game.codex={openPavorPanel:()=>new CodexPavorPanel().render({force:true})};
 if(game.user.isGM)game.codex.openPavorPanel();
});
Hooks.on("createChatMessage",(message)=>{transferCombatPavor(message).catch(e=>console.error("Codex RPG: Pavor",e));});
Hooks.on("combatStart",combat=>{fillStartingEnemyPavor(combat).catch(e=>console.error("Codex RPG: Pavor inicial",e));});
