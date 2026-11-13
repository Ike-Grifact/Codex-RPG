import {narratorCap} from "./rules.mjs";
import {NS} from "./roll-workflow.mjs";

const setting=(key)=>game.settings.get(NS,key);
const accounts=()=>game.users.filter(user=>user.hasRole(CONST.USER_ROLES.PLAYER)&&!user.isGM).length;
export const playerCount=()=>setting("campaignPlayers")<0?accounts():setting("campaignPlayers");
export const publicPavorCap=()=>narratorCap(playerCount());
export const boundPavor=(value,cap)=>Math.min(cap,Math.max(0,Math.trunc(Number(value)||0)));
let hud;
let adjustments=Promise.resolve();

export class CodexPavorPanel extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2){
 static DEFAULT_OPTIONS={id:"codex-pavor-hud",classes:["codex-rpg","codex-pavor-hud"],
  window:{frame:false,positioned:false},actions:{adjust:CodexPavorPanel.adjust}};
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/pavor-panel.hbs"}};
 async _insertElement(element,options){
  const top=document.querySelector("#ui-middle > #ui-top");
  if(top)top.append(element);
  else await super._insertElement(element,options);
 }
 async _prepareContext(){
  const cap=publicPavorCap(),value=boundPavor(setting("publicPavor"),cap);
  // Keep long campaign rosters scrollable within the HUD.
  const slots=Array.from({length:cap},(_,index)=>({filled:index<value}));
  return {cap,value,slots,isGM:game.user.isGM,full:value===cap,tooltip:`Pavor público: ${value}/${cap}`};
 }
 static async adjust(event,button){
  if(!game.user.isGM||game.users.activeGM?.id!==game.user.id)return;
  const delta=Number(button.dataset.delta);
  if(![-1,1].includes(delta))return;
  const run=async()=>{
   const cap=publicPavorCap();
   await game.settings.set(NS,"publicPavor",boundPavor(setting("publicPavor")+delta,cap));
  };
  adjustments=adjustments.then(run,run);
  try{await adjustments;}catch(error){console.error("Codex RPG · Pavor",error);ui.notifications.error(error.message);}
 }
}
export async function refreshPavor(){
 if(!game.ready)return;
 const show=(game.user.isGM||setting("showPavorToPlayers"))&&setting("showPavorLocally")&&
  (game.user.isGM||!setting("hideEmptyPavor")||setting("publicPavor")>0);
 if(show){
  hud??=new CodexPavorPanel();
  await hud.render({force:true});
 }else if(hud?.rendered)await hud.close();
}
async function refreshCap(){
 if(!game.ready)return;
 const cap=publicPavorCap(),value=setting("publicPavor");
 if(game.user.isGM&&game.users.activeGM?.id===game.user.id&&value!==boundPavor(value,cap)){
  await game.settings.set(NS,"publicPavor",boundPavor(value,cap));
 }
 await refreshPavor();
}
export function registerPavor(){
 const register=(key,config)=>game.settings.register(NS,key,config);
 register("publicPavor",{name:"Pavor público",scope:"world",config:false,type:Number,default:2,onChange:refreshPavor});
 register("campaignPlayers",{name:"Jogadores da campanha",
  hint:"Informe o total real. −1 usa as contas de jogador cadastradas, incluindo as desconectadas.",
  scope:"world",config:true,type:new foundry.data.fields.NumberField({integer:true,min:-1,max:1000,initial:-1}),default:-1,onChange:refreshCap});
 register("showPavorToPlayers",{name:"Exibir Pavor público aos jogadores",scope:"world",config:true,type:Boolean,default:false,onChange:refreshPavor});
 register("hideEmptyPavor",{name:"Ocultar HUD vazia para jogadores",scope:"world",config:true,type:Boolean,default:false,onChange:refreshPavor});
 register("showPavorLocally",{name:"Mostrar HUD de Pavor para mim",scope:"user",config:true,type:Boolean,default:true,onChange:refreshPavor});
 for(const event of ["canvasReady","updateScene","userConnected"])Hooks.on(event,refreshPavor);
 for(const event of ["createUser","updateUser","deleteUser"])Hooks.on(event,refreshCap);
 Hooks.once("ready",refreshCap);
}
