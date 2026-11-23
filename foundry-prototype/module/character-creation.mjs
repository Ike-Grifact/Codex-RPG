import {actorData} from "./creation.mjs";
import {advancementPlan,creationMissing} from "./advancement.mjs";
import {starterPurchasePlan,xpLedger,lifeMax} from "./rules.mjs";
import {armorFits} from "./equipment-logic.mjs";
import {racialChoicesComplete} from "./races.mjs";
import {purchaseItemsPlan,startingResources,walletValue,RESOURCE_NAMES} from "./equipment-workflow.mjs";

export function newCharacterDraft(){
 return {
  step:0,identity:{name:"",concept:"",race:"humano",element:"",virtue:"",personality:"",img:""},
  starter:{attribute:"",training:""},confirmed:"",advances:[],
  allocation:Object.fromEntries(Object.keys(RESOURCE_NAMES).map(key=>[key,4])),
  preferredResource:"ervas",orders:[],
 };
}

export function creationIdentity(draft){
 const {identity}=draft;
 return actorData("character",{...identity,pureElement:identity.element,runeElements:[identity.element]});
}

export function validateCreationIdentity(draft){
 if(!draft.identity.name.trim())throw Error("Informe o nome do personagem.");
 if(!racialChoicesComplete(creationIdentity(draft).system))throw Error("Escolha o elemento inicial da linhagem.");
}

export function creationStarterKey(draft){
 const {identity,starter}=draft;
 return JSON.stringify([identity.race,identity.element,starter.attribute,starter.training]);
}

export function creationStarter(draft,system=creationIdentity(draft).system){
 const [group,training]=draft.starter.training.split(":");
 return starterPurchasePlan(system,draft.starter.attribute,group,training,{specificAttribute:true});
}

function apply(system,changes){
 for(const [path,value] of Object.entries(changes)){
  const [,field,key]=path.split(".");
  if(key)system[field][key]=value;
  else system[field]=value;
 }
}

export function characterBuild(draft){
 const actor=creationIdentity(draft);
 const plan=creationStarter(draft,actor.system);
 if(!plan.ok)return actor;
 apply(actor.system,plan.changes);
 if(draft.confirmed===creationStarterKey(draft)){
  for(const request of draft.advances)apply(actor.system,advancementPlan(actor.system,request,true));
 }
 actor.system.life.value=lifeMax(actor.system);
 return actor;
}

export function characterInventory(draft,system=creationIdentity(draft).system){
 let items=startingResources(draft.allocation);
 const resourceCount=items.length;
 for(const order of draft.orders){
  const {items:next}=purchaseItemsPlan(items,{...order,preferredResource:order.preferredResource??draft.preferredResource});
  items=next;
  const item=items.at(-1);
  item.system.equipped=order.equipped===true&&(item.system.kind!=="armor"||armorFits(system,item));
  if(item.system.equipped&&item.system.kind==="armor"){
   for(const previous of items.slice(resourceCount,-1).filter(row=>row.system.kind==="armor"))previous.system.equipped=false;
  }
 }
 return {items,purchases:items.slice(resourceCount),vt:walletValue({items})};
}

export function completeCharacterDraft(draft){
 validateCreationIdentity(draft);
 if(draft.confirmed!==creationStarterKey(draft))throw Error("Confirme as escolhas iniciais.");
 const actor=characterBuild(draft);
 const missing=creationMissing(actor.system);
 if(missing.attr||missing.training)throw Error("A formação exige um Atributo e um Conhecimento ou Prática G1.");
 if(xpLedger(actor.system).left<0)throw Error("O orçamento de XP foi excedido.");
 actor.items=characterInventory(draft,actor.system).items;
 if(draft.identity.img)actor.img=draft.identity.img;
 return actor;
}
