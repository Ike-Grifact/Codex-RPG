import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,sourceDice,xpLedger,maxCourage} from "./rules.mjs";
import {advancementPlan} from "./advancement.mjs";
import {RACES,PURE_ELEMENTS,RUNE_ELEMENTS,allOwnedSkills,gradeXPTable,skillNameFor,isRuna} from "./races.mjs";
import {G1_CATALOG} from "./catalog.mjs";
import {RESOURCE_NAMES,STARTING_VT,startingResources,purchasableEquipment} from "./equipment-workflow.mjs";
import {carriedWeight} from "./equipment-logic.mjs";
import {standardMovement} from "./movement.mjs";
import {dieSvg} from "./dice-icons.mjs";
import {iconMarkup,equipmentIconId} from "./iconography.mjs";
import {newCharacterDraft,creationIdentity,validateCreationIdentity,creationStarter,creationStarterKey,
 characterBuild,characterInventory,completeCharacterDraft} from "./character-creation.mjs";

const ns="codex-rpg-foundry";
const steps=["Identidade","Escolhas iniciais","Distribuir XP","VT e equipamentos","Revisão"];
const sourceGroups=[
 {id:"attribute",field:"attributes",label:"Atributos",rows:ATTRIBUTES},
 {id:"knowledge",field:"knowledges",label:"Conhecimentos",rows:KNOWLEDGES},
 {id:"practice",field:"practices",label:"Práticas",rows:PRACTICES},
];
const resourceRows=Object.entries(RESOURCE_NAMES);
const elementChoices=race=>race==="lucker_puro"?PURE_ELEMENTS:race==="runa_espinhos"?RUNE_ELEMENTS:[];
const optionRows=(rows,value)=>rows.map(([id,label])=>({id,label,selected:id===value}));
const blankPortrait="icons/svg/mystery-man.svg";
let wizard;

export class CodexCharacterWizard extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2){
 static DEFAULT_OPTIONS={
  classes:["codex-rpg","codex-character-wizard"],
  window:{title:"Criador de personagem · Codex RPG",resizable:true},
  position:{width:1040,height:800},
  actions:{
   wizardNext(){return this.next();},wizardBack(){return this.goTo(this.draft.step-1);},
   wizardJump(_event,target){return this.goTo(Number(target.dataset.step));},
   wizardSource(_event,target){
    if(this.busy)return;
    this.draft.starter[target.dataset.group]=target.dataset.value;
    return this.refresh();
   },
   wizardPortrait(){return this.choosePortrait();},
   wizardBuy(){return this.buy();},wizardAllocation(){return this.run(()=>{this.readTrade();return this.refresh();});},
   wizardRemove(_event,target){return this.run(()=>{
    this.readTrade();this.draft.orders.splice(Number(target.dataset.index),1);return this.refresh();
   });},
   wizardEquip(_event,target){return this.equip(Number(target.dataset.index));},
   wizardFinish(){return this.finish();},
  }
 };
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/character-wizard.hbs",scrollable:[""]}};

 constructor(){
  super();
  this.storageKey=ns+".creator."+game.world.id+"."+game.user.id;
  this.draft=newCharacterDraft();
  try{
   const saved=JSON.parse(localStorage.getItem(this.storageKey));
   if(saved?.id&&Number.isInteger(saved.step)&&saved.step>=0&&saved.step<steps.length){
    // Refazer o cálculo aqui detecta um rascunho antigo cuja regra mudou.
    characterBuild(saved);
    this.draft=saved;
   }
  }catch{}
  this.draft.id??=foundry.utils.randomID();
 }
 persist(){
  try{localStorage.setItem(this.storageKey,JSON.stringify(this.draft));}catch{}
 }
 refresh(){
  this.persist();
  return this.render();
 }

 summary(){
  const {system}=characterBuild(this.draft);
  const ledger=xpLedger(system);
  const inventory=characterInventory(this.draft,system);
  return {system,ledger,inventory,life:system.life.value,courage:maxCourage(system.level),movement:standardMovement(system),
   weight:carriedWeight(inventory)};
 }
 async _prepareContext(){
  const {identity,starter,step}=this.draft;
  const {system,ledger,inventory,life,courage,movement,weight}=this.summary();
  const base=creationIdentity(this.draft).system;
  const ownedSkills=new Set(allOwnedSkills(system));
  const plan=creationStarter(this.draft,base);
  const choices=sourceGroups.map(group=>({...group,options:group.rows.map(([id,label])=>{
   const value=group.id==="attribute"?id:group.id+":"+id;
   const grade=base[group.field][id]??0;
   const sides=sourceDice(group.id,id,base)[0];
   return {id,label,value,selected:group.id==="attribute"?starter.attribute===value:starter.training===value,
    cost:grade>=1?0:gradeXPTable(base,group.id,id)[1],dice:dieSvg(sides),sides,
    targetDice:dieSvg(sourceDice(group.id,id,{...base,[group.field]:{...base[group.field],[id]:1}})[0]),
    targetSides:group.id==="attribute"?6:10};
  })}));
  return {
   identity,step,steps:steps.map((label,index)=>({label,index,active:index===step,disabled:index>=step})),
   identityStep:step===0,starterStep:step===1,developmentStep:step===2,tradeStep:step===3,reviewStep:step===4,
   canBack:step>0,portrait:identity.img||blankPortrait,hasPortrait:Boolean(identity.img),
   races:optionRows(Object.entries(RACES).map(([id,race])=>[id,race.name]),identity.race),
   raceName:RACES[identity.race]?.name,raceDescription:RACES[identity.race]?.description,elements:optionRows(elementChoices(identity.race),identity.element),
   racialGifts:RACES[identity.race]?.favored.map(id=>ATTRIBUTES.find(([key])=>key===id)?.[1]).join(" e "),
   choices:choices.map(group=>({...group,starterGroup:group.id==="attribute"?"attribute":"training"})),
   plan:plan.ok?plan:null,resources:resourceRows.map(([id,label])=>({id,label,qty:this.draft.allocation[id]})),
   payment:optionRows(resourceRows,this.draft.preferredResource),startingVT:STARTING_VT,
   catalog:G1_CATALOG.filter(purchasableEquipment).map(row=>({name:row.name,cost:row.priceVT})),
   purchases:inventory.purchases.map((item,index)=>({index,name:item.name,quantity:item.system.quantity,
    icon:iconMarkup(equipmentIconId({name:item.name,...item.system})),equipped:item.system.equipped,
    cannotEquip:isRuna(system)&&item.system.kind==="armor"})),
   wallet:inventory.items.filter(item=>item.system.kind==="resource").map(item=>({name:item.name,quantity:item.system.quantity})),
   sources:sourceGroups.map(group=>({label:group.label,rows:group.rows.filter(([id])=>system[group.field][id]>=1)
    .map(([id,label])=>({label,grade:system[group.field][id]}))})),
   skills:SKILLS.filter(row=>ownedSkills.has(row.id)).map(row=>skillNameFor(system,row)),
   ledger,vt:inventory.vt,life,courage,movement,weight
  };
 }
 async _onRender(context,options){
  await super._onRender(context,options);
  const root=this.element.querySelector(".codex-wizard");
  root.addEventListener("input",event=>{
   const field=event.target.dataset.wizardText;
   if(!field||!Object.hasOwn(this.draft.identity,field))return;
   this.draft.identity[field]=event.target.value;
   const preview=root.querySelector("[data-wizard-name]");
   if(field==="name"&&preview)preview.textContent=event.target.value.trim()||"Novo Aprendiz";
   this.persist();
  });
  root.addEventListener("change",event=>{
   const field=event.target.dataset.wizardSelect;
   if(field==="race"&&Object.hasOwn(RACES,event.target.value)){
    this.draft.identity.race=event.target.value;
    this.draft.identity.element="";
    void this.refresh();
   }else if(field==="element"){
    this.draft.identity.element=event.target.value;
    this.persist();
   }
  });
  if(this.draft.step===2)await this.showDNA();
 }
 async showDNA(){
  this.draftSystem=characterBuild(this.draft).system;
  const host=()=>this.element?.querySelector("[data-wizard-dna]");
  if(this.dna){
   if(this.dna.element&&!host()?.contains(this.dna.element))host()?.append(this.dna.element);
   this.dna.refresh();
   return;
  }
  const {embedDraftDNA}=await import("./dna.mjs");
  const owner=this;
  const draftActor={
   get system(){return owner.draftSystem;},
   get name(){return owner.draft.identity.name;},
   getFlag(scope,key){return scope===ns&&key==="creationPending";},
  };
  this.dna=await embedDraftDNA(draftActor,host,request=>this.advance(request));
 }
 advance(request){
  const {system}=characterBuild(this.draft);
  advancementPlan(system,request,true);
  this.draft.advances.push(request);
  this.draftSystem=characterBuild(this.draft).system;
  this.persist();
  this.refreshXP();
 }
 refreshXP(){
  const {system}=characterBuild(this.draft),ledger=xpLedger(system);
  for(const key of ["spent","left"]){
   const el=this.element?.querySelector('[data-wizard-xp="'+key+'"]');
   if(el)el.textContent=ledger[key]+" XP";
  }
  this.element.querySelector('[data-wizard-stat="life"]').textContent=system.life.value;
  this.element.querySelector('[data-wizard-stat="movement"]').textContent=standardMovement(system)+" m";
 }
 async choosePortrait(){
  const picker=new foundry.applications.apps.FilePicker.implementation({
   type:"image",current:this.draft.identity.img,
   callback:img=>{this.draft.identity.img=img;return this.refresh();}
  });
  await picker.browse();
 }
 async run(task){
  if(this.busy)return;
  this.busy=true;
  try{return await task();}
  catch(error){ui.notifications.warn(error.message);}
  finally{this.busy=false;}
 }
 async goTo(step){
  if(!Number.isInteger(step)||step<0||step>=this.draft.step)return;
  return this.run(async()=>{
   this.draft.step=step;
   return this.refresh();
  });
 }
 async next(){
  return this.run(async()=>{
   const draft=this.draft;
   if(draft.step===0)validateCreationIdentity(draft);
   if(draft.step===1){
    const plan=creationStarter(draft);
    if(!plan.ok)throw Error(plan.error);
    const key=creationStarterKey(draft);
    if(key!==draft.confirmed&&draft.advances.length){
     const ok=await foundry.applications.api.DialogV2.confirm({window:{title:"Recalcular formação"},
      content:"<p>As novas escolhas reiniciam a distribuição livre de XP deste rascunho. Os equipamentos ficam preservados.</p>",
      yes:{label:"Recalcular"},no:{label:"Voltar"},rejectClose:false});
     if(!ok)return;
     draft.advances=[];
    }
    draft.confirmed=key;
   }
   if(draft.step===3)this.readTrade();
   if(draft.step<4)draft.step++;
   return this.refresh();
  });
 }
 readTrade(){
  const fields=[...this.element.querySelectorAll("[data-wizard-vt]")];
  if(!fields.length)return;
  const allocation=Object.fromEntries(fields.map(el=>[el.dataset.wizardVt,el.valueAsNumber]));
  startingResources(allocation);
  this.draft.allocation=allocation;
  this.draft.preferredResource=this.element.querySelector("[data-wizard-payment]").value;
  this.persist();
 }
 async buy(){
  return this.run(()=>{
   const name=this.element.querySelector("[data-wizard-equipment]").value;
   if(!name)throw Error("Escolha um equipamento do catálogo.");
   this.readTrade();
   const quantity=this.element.querySelector("[data-wizard-quantity]").valueAsNumber;
   const order={id:foundry.utils.randomID(),name,quantity};
   characterInventory({...this.draft,orders:[...this.draft.orders,order]});
   this.draft.orders.push(order);
   return this.refresh();
  });
 }
 equip(index){
  return this.run(()=>{
   this.readTrade();
   const {system}=characterBuild(this.draft);
   const row=characterInventory(this.draft,system).purchases[index];
   if(!row)return;
   if(isRuna(system)&&row.system.kind==="armor")throw Error("Runa Espinhos não pode equipar armaduras físicas.");
   this.draft.orders[index].equipped=!row.system.equipped;
   return this.refresh();
  });
 }
 async finish(){
  return this.run(async()=>{
   if(this.draft.step!==4)return;
   if(!Actor.implementation.canUserCreate(game.user))throw Error("Sua função não pode criar Actors neste mundo.");
   const source=completeCharacterDraft(this.draft);
   const id=this.draft.id;
   const prior=game.actors.get(id);
   if(prior&&(!prior.isOwner||prior.getFlag(ns,"characterDraftId")!==id))throw Error("O identificador da ficha já está ocupado.");
   const actor=prior??await Actor.implementation.create({...source,_id:id,flags:{[ns]:{characterDraftId:id}}},{keepId:true});
   if(!actor)throw Error("O Foundry não concluiu a criação.");
   this.finished=true;
   try{localStorage.removeItem(this.storageKey);}catch{}
   await this.close();
   await actor.sheet.render({force:true});
  });
 }
 async close(options={}){
  if(!this.finished)this.persist();
  await this.dna?.close();
  if(wizard===this)wizard=null;
  return super.close(options);
 }
}

export function openCharacterWizard(){
 if(!Actor.implementation.canUserCreate(game.user))return;
 wizard??=new CodexCharacterWizard();
 return wizard.render({force:true});
}
