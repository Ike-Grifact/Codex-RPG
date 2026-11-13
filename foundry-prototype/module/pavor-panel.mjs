/* Painel manual do Narrador: Pavor público limitado a 2 + jogadores. */
import {narratorCap} from "./rules.mjs";
export const NS="codex-rpg-foundry";
export const playerCount=()=>game.users.filter(u=>!u.isGM).length;
export class CodexPavorPanel extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2){
 static DEFAULT_OPTIONS={
  id:"codex-pavor-panel",classes:["codex-rpg","codex-pavor-panel"],position:{width:430,height:305},
  window:{title:"Codex RPG · Pavor público",resizable:false},
  actions:{adjust:CodexPavorPanel.adjust}
 };
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/pavor-panel.hbs"}};
 async _prepareContext(){
  const cap=narratorCap(playerCount()),value=game.settings.get(NS,"publicPavor");
  return {value,cap,room:cap-value,players:playerCount(),isGM:game.user.isGM};
 }
 static async adjust(event,target){
  if(!game.user.isGM)return;
  const val=Number(target.dataset.delta),cap=narratorCap(playerCount());
  if(!Number.isInteger(val)||Math.abs(val)>6)return;
  const cur=game.settings.get(NS,"publicPavor");
  await game.settings.set(NS,"publicPavor",Math.max(0,Math.min(cap,cur+val)));
  this.render();
 }
}
export async function transferCombatPavor(message){
 if(!game.user.isGM||!game.combat?.started)return;
 const obj=message.getFlag(NS,"transfer");
 if(!obj||!obj.actorId||!Number.isInteger(obj.p)||obj.p<0||obj.p>20)return;
 const owner=game.actors.get(obj.actorId),user=game.users.get(message.user?.id);
 if(!owner||!user||!(user.isGM||owner.testUserPermission(user,"OWNER")))return;
 if(obj.targetUuid){
  const target=await fromUuid(obj.targetUuid);
  if(target&&["character","humanoid","creature"].includes(target.type)){
   const add=Math.max(0,obj.p);
   if(obj.targetType==="character")
    await target.update({"system.courage":Math.min(10,Number(target.system.courage||0)+add)});
   else {
    const cap=Math.max(1,Math.min(6,Number(target.system.threatGrade||1)));
    await target.update({"system.pavorLocal":Math.min(cap,Number(target.system.pavorLocal||0)+add)});
    // Excedente de Pavor do ataque permanece para resolução manual do Narrador.
   }
  }
 }
 if(obj.monsterCriticalPavor&&["creature","humanoid"].includes(owner.type)){
  const cap=Math.max(1,Math.min(6,Number(owner.system.threatGrade||1)));
  const available=Math.max(0,cap-Number(owner.system.pavorLocal||0));
  const saved=Math.min(available,obj.monsterCriticalPavor);
  if(saved)await owner.update({"system.pavorLocal":Number(owner.system.pavorLocal||0)+saved});
  const overflow=obj.monsterCriticalPavor-saved;
  if(overflow){
   const publicCap=narratorCap(playerCount()),cur=game.settings.get(NS,"publicPavor");
   await game.settings.set(NS,"publicPavor",Math.min(publicCap,cur+overflow));
  }
 }
}
