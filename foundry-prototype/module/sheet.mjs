import {showSkill} from "./skill-catalog.mjs";
/* Codex RPG — ficha e criação de Actor para Foundry v14. Protótipo não validado no cliente. */
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,SITUATIONS,
 sourceDice,sourceLabel,faceSymbols,buildPool,canReinforceDie,starterPurchasePlan,lifeMax,healthByLife,balance,maxCourage,
 loadCapacity,mayComplement,canRepeatDiscipline,sourcePairError,isDiscipline,disciplineNeedsAttribute,attributesOnly,xpLedger,monsterCap} from "./rules.mjs";
import {requestRoll} from "./roll-workflow.mjs";
import {keepForActor,rollResult,alternativesFor,usesLocal} from "./roll-resolution.mjs";
import {dieSvg,faceIcons} from "./dice-icons.mjs";
import {equippedDie,defenseDisplay,effectiveWeaponRange,carriedWeight} from "./equipment-logic.mjs";
import {actorKinds} from "./creation.mjs";
import {createCodexItem} from "./creation-ui.mjs";
import {showCodexDice} from "./dice-so-nice.mjs";
import {G1_CATALOG} from "./catalog.mjs";
import {equipmentView} from './equipment-view.mjs';
import {openSkillDefinition} from './compendium-data.mjs';
import {quickEquipmentPlan} from './equipment-workflow.mjs';
import {skillDetails,skillRefundPlan} from "./advancement.mjs";
const NS="codex-rpg-foundry";
const draft=()=>({base:null,second:null,complement:null});
const defaults=()=>({mode:"normal",de:1,situation:"neutral",extraKeep:false,targetDodges:false,activationPavor:1,step:false,stepDieId:"",contextApproved:false,
 weightEnabled:false,attackWeight:"leve",targetWeight:"medio",combatBonus:false,
 cancelP:0,convertPairs:0,equipmentId:"",element:"",sourceContext:"",characteristic:"",secondCharacteristic:"",activationPayment:"courage"});
const eq=(x,y)=>!!x&&x.group===y.group&&x.key===y.key;
function cards(list,group,s,d){
 return list.map(([key,label])=>({key,group,label:sourceLabel(group,key,s),
 grade:Number(s[{attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group]]?.[key]||0),
 dice:sourceDice(group,key,s).map(sides=>({sides,icon:dieSvg(sides)})),
 isSelected:[d.base,d.second,d.complement].some(source=>eq(source,{group,key})),
 isBase:eq(d.base,{group,key}),isSecond:eq(d.second,{group,key}),isComplement:eq(d.complement,{group,key})&&!isRepeat(d)}));
}
const markerText=v=>(v[0]?v[0]+"ᛋ ":"")+(v[1]?v[1]+"ᚨ ":"")+(v[2]?v[2]+"ᚦ":"")||"Vazio";
const markerHTML = faceIcons;
const symbolsFor = die => die.symbols ?? faceSymbols(die.sides,die.face);
const carriedItems=carriedWeight;
const carryClasses=(capacity,used)=>Object.fromEntries([["leve",.125],["medio",.5],["pesado",1]]
 .map(([k,w])=>[k,Math.floor((Math.max(0,capacity-used)+1e-9)/w)]));
function selectedItem(actor,opts){return actor.items.get(opts.equipmentId)||null;}
const hasDiscipline=d=>[d.base,d.second,d.complement].some(isDiscipline);
const isRepeat=d=>isDiscipline(d.complement)&&[d.base,d.second].some(isDiscipline);
export class CodexCharacterSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2){
 static DEFAULT_OPTIONS={classes:["codex-rpg","codex-character-sheet"],position:{width:1120,height:820},
 window:{resizable:true},actions:{
 openDNA:CodexCharacterSheet.openDNA,chooseSource:CodexCharacterSheet.chooseSource,repeatDiscipline:CodexCharacterSheet.repeatDiscipline,showRoll:CodexCharacterSheet.showRoll,adjustGrade:CodexCharacterSheet.adjustGrade,toggleEditing:CodexCharacterSheet.toggleEditing,
 adjustResource:CodexCharacterSheet.adjustResource,toggleSkill:CodexCharacterSheet.toggleSkill,
 clearDraft:CodexCharacterSheet.clearDraft,executeRoll:CodexCharacterSheet.executeRoll,
 toggleKept:CodexCharacterSheet.toggleKept,discardRoll:CodexCharacterSheet.discardRoll,applyComparison:CodexCharacterSheet.applyComparison,
 purchaseStarter:CodexCharacterSheet.purchaseStarter,finalizeRoll:CodexCharacterSheet.finalizeRoll,
 addEquipment:CodexCharacterSheet.addEquipment,openEquipment:CodexCharacterSheet.openEquipment,
 toggleEquip:CodexCharacterSheet.toggleEquip,adjustIntegrity:CodexCharacterSheet.adjustIntegrity,
 removeEquipment:CodexCharacterSheet.removeEquipment,addCatalogEquipment:CodexCharacterSheet.addCatalogEquipment,
 editPortrait:CodexCharacterSheet.editPortrait,adjustPavor:CodexCharacterSheet.adjustPavor
 ,rest(_event,target){return this._request({action:'rest',kind:target.dataset.kind});},transform:CodexCharacterSheet.transform
 ,consultSkill(_event,target){return openSkillDefinition(target.dataset.key);}
 ,buyEquipment:CodexCharacterSheet.buyEquipment,quickEquipment:CodexCharacterSheet.quickEquipment,
 prepareEquipment:CodexCharacterSheet.prepareEquipment,cravarEquipment:CodexCharacterSheet.cravarEquipment
 }};
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/character-sheet.hbs",scrollable:[""]}};
 constructor(options={}){super(options);this._draft=draft();this._opts=defaults();this._pending=null;this._busy=false;this._editing=false;this._equipmentFilters={family:'all',weight:'all',shopFamily:'all',shopWeight:'all'};}
 async _prepareContext(options){
  const ctx=await super._prepareContext(options),actor=this.actor,s=actor.system,d=this._draft,monster=!!s.monsterRules,animal=!!s.animalRules,attributesOnly=monster||animal||s.transformation?.kind==='animal',ledger=xpLedger(s),
   used=carriedItems(actor),carryMax=loadCapacity(s),
   hasFirstAttribute=ATTRIBUTES.some(([key])=>Number(s.attributes?.[key]||0)>=1),
   hasTraining=[...KNOWLEDGES.map(([k])=>s.knowledges?.[k]),...PRACTICES.map(([k])=>s.practices?.[k])].some(n=>Number(n||0)>=1);
  this._pending=actor.getFlag(NS,"pendingRoll")||null;
  if(this._pending)this._editing=false;
  const defense=defenseDisplay(actor);
  const wornArmor=actor.items.find(i=>i.type==="equipment"&&i.system?.kind==="armor"&&i.system?.equipped);
  const armorSys=wornArmor?.system,armorMax=Math.max(0,Number(armorSys?.integrity?.max)||0);
  const armorCurrent=Math.min(armorMax,Math.max(0,Number(armorSys?.integrity?.value)||0));
  const armorCard=wornArmor?{
   id:wornArmor.id,name:wornArmor.name,integrity:armorCurrent,maximum:armorMax,
   noIntegrity:armorMax===0,hasMaximum:armorMax>0,
   percent:armorMax?Math.round(100*armorCurrent/armorMax):0
  }:null;
  ctx.codex={
   equipment:equipmentView(actor,this._equipmentFilters),hasDruidic:s.skills.includes('pericia-druidica'),transformed:!!s.transformation?.kind,
   actorName:actor.name,portrait:actor.img,editing:this._editing&&actor.isOwner,
   canOpenDNA:actor.isOwner&&!attributesOnly&&!this._pending,
   identityOpen:this.element?.querySelector(".codex-identity-details")?.open,
   progressOpen:this.element?.querySelector(".codex-creation-panel")?.open ?? (!attributesOnly&&!s.monsterHumanoidRules&&!(hasFirstAttribute&&hasTraining)),
   actorTypeLabel:actorKinds[actor.type],
   concept:s.concept,origin:s.origin,virtue:s.virtue,personality:s.personality,
   notes:s.notes,abilities:s.abilities,leader:s.leader,isHostile:actor.type!=="character",
   level:s.level,life:s.life.value,lifeMax:lifeMax(s),medical:s.life.medical,
   health:healthByLife(s,s.life.value),healthApplied:actor.type==="character",
   courage:s.courage,courageMax:maxCourage(s.level),de:defense.de,deCalculation:defense.calculation,deCondition:defense.condition,armorCard,
   balance:balance(s),capacity:carryMax,loadUsed:used,loadFree:Math.max(0,carryMax-used),
    carryClasses:carryClasses(carryMax,used),overloaded:used>carryMax+1e-9,
    xp:s.xp,canAdjustXP:game.user.isGM&&!this._pending,xpLedger:ledger,hasCreationMinimum:s.monsterHumanoidRules||(hasFirstAttribute&&hasTraining),
    starterAttributes:ATTRIBUTES.map(([id,name])=>({id,name})),
    starterTraining:[
     ...KNOWLEDGES.map(([id,name])=>({value:"knowledge:"+id,name:"Conhecimento · "+name})),
     ...PRACTICES.map(([id,name])=>({value:"practice:"+id,name:"Prática · "+name}))
    ],
   isMonster:monster,isAnimal:animal,attributesOnly,isHumanoid:["humanoid","monsterHumanoid"].includes(actor.type),
   threatGrade:s.threatGrade,pavorLocal:s.pavorLocal,pavorCap:monsterCap(s.threatGrade),
   catalog:G1_CATALOG.map((row,i)=>({id:String(i),name:row.name})),
   attributes:cards(ATTRIBUTES,"attribute",s,d),
   knowledges:attributesOnly?[]:cards(KNOWLEDGES,"knowledge",s,d),
   practices:attributesOnly?[]:cards(PRACTICES,"practice",s,d),
   skills:attributesOnly?[]:SKILLS.filter(row=>showSkill(row,s)).map(k=>skillDetails(s,k.id)),
   gear:actor.items.filter(i=>i.type==="equipment").map(i=>({
    id:i.id,name:i.name,kind:i.system.kind,grade:i.system.grade,weight:i.system.weight,
    quantity:i.system.quantity,equipped:i.system.equipped,range:effectiveWeaponRange(s,i.system),
    integrity:i.system.integrity.value,integrityMax:i.system.integrity.max,die:i.system.die,dieIcon:dieSvg(i.system.die),priceVT:i.system.priceVT
   })),
   selectedBase:d.base?sourceLabel(d.base.group,d.base.key,s):"",
   selectedSecond:d.second?sourceLabel(d.second.group,d.second.key,s):"",
   selectedComplement:d.complement?sourceLabel(d.complement.group,d.complement.key,s):"",
   selecting:!!d.base&&!d.second,preparing:!!d.base&&!!d.second&&!this._editing&&!this._pending,
   hasPending:!!this._pending,isOwner:actor.isOwner,canKeep:!this._busy
  };
  if(ctx.codex.preparing){
   const item=selectedItem(actor,this._opts),die=item?equippedDie(actor,item,this._opts.mode):0;
   const rawPlan=buildPool(s,d,{mode:this._opts.mode,contextApproved:this._opts.contextApproved,equipmentDie:die});
    const plan=buildPool(s,d,{mode:this._opts.mode,contextApproved:this._opts.contextApproved,
     step:this._opts.step,stepDieId:this._opts.stepDieId,equipmentDie:die});
   if(actor.type==="character"&&(ctx.codex.health.id==="morto"||s.courage<ctx.codex.health.coragem+Number(this._opts.step))){
    plan.errors.push(ctx.codex.health.id==="morto"?"Vida zero: o personagem não pode agir.":"Coragem insuficiente para agir neste estado de Saúde.");plan.ok=false;
   }
   if(item&&!die){plan.errors.push("Item sem Perícia pertinente, não equipado ou elemento não habilitado.");plan.ok=false;}
      const isShared=hasDiscipline(d),targets=[...game.user.targets];
   let target=null,targetError="";
   if(targets.length===1){
    this._lastTargetId=targets[0].document?.uuid;
    try{
     target=await requestRoll(actor,{action:"target",sceneId:canvas.scene?.id,targetIds:targets.map(token=>token.id),dodges:this._opts.targetDodges});
    }catch(error){targetError=error.message;}
   }else if(targets.length>1)targetError="Selecione apenas um alvo para esta ação.";
   else if(this._targetLost)targetError="O alvo saiu do mapa. Selecione outro Token.";
   if(targetError)plan.errors.push(targetError);
   ctx.codex.prepare={
    isShared,repeatedDiscipline:isRepeat(d),canRepeatDisc:canRepeatDiscipline(s,d.base,d.second)&&(!d.complement||isRepeat(d)),mode:this._opts.mode,modeArmas:this._opts.mode==="armas",modeConjuracao:this._opts.mode==="conjuracao",
    contextApproved:this._opts.contextApproved,targetDodges:this._opts.targetDodges,de:this._opts.de,sourceContext:this._opts.sourceContext,
    elements:['psiquico','vento','agua','terra','fogo','sagrado','sangue','trevas','veneno'].filter(key=>s.skills.includes(key==='psiquico'?'criar-item-foco-magia':key)).map(key=>({key,selected:this._opts.element===key})),
    localCostOptions:[1,2,3].map(cost=>({cost,selected:Number(this._opts.activationPavor)===cost})),
    situations:Object.entries(SITUATIONS).map(([id,x])=>({id,label:x.label,selected:this._opts.situation===id})),
    weightEnabled:this._opts.weightEnabled,attackWeight:this._opts.attackWeight,targetWeight:this._opts.targetWeight,
    attackWeightLeve:this._opts.attackWeight==="leve",attackWeightMedio:this._opts.attackWeight==="medio",attackWeightPesado:this._opts.attackWeight==="pesado",
    targetWeightLeve:this._opts.targetWeight==="leve",targetWeightMedio:this._opts.targetWeight==="medio",targetWeightPesado:this._opts.targetWeight==="pesado",
    extraKeep:this._opts.extraKeep,extraZero:Number(this._opts.extraKeep)===0,extraOne:Number(this._opts.extraKeep)===1,extraTwo:Number(this._opts.extraKeep)===2,
    step:this._opts.step,combatBonus:false,hasCombatSkill:false,
     stepOptions:rawPlan.pool.filter(canReinforceDie)
      .map(x=>({id:x.id,label:sourceLabel(x.group,x.key,s)+(x.id.endsWith(".1")&&x.id.split(".").length===4?" (2ª)":"")+" · dado "+(Number(x.id.split(".")[2]??0)+1)+" · d"+x.sides,
       selected:x.id===this._opts.stepDieId})),
    equipmentOptions:actor.items.filter(i=>i.type==="equipment"&&i.system.equipped&&["weapon","firearm","focus"].includes(i.system.kind))
      .map(i=>({id:i.id,name:i.name,selected:i.id===this._opts.equipmentId})),
    targetName:target?.name??"",targetDE:target?.de??"Reservada",hasTarget:Boolean(target),inCombat:!!game.combat?.started,
    canExecute:plan.ok&&!targetError&&actor.isOwner&&!actor.getFlag(NS,"creationPending"),errors:plan.errors,
    pool:plan.pool.map(x=>({sides:x.sides,label:sourceLabel(x.group,x.key,s)+(x.elevated?" · Elevação":x.reinforced?" · Reforço legado":""),icon:dieSvg(x.sides)})),
    effectiveRange:die&&this._opts.mode==="armas"?effectiveWeaponRange(s,item.system):0,
    poolCount:plan.pool.length,keepNatural:keepForActor(actor,0)
   };
  }
  if(this._pending){
   const p=this._pending,item=selectedItem(actor,p.options);
   let summary=null,comparisons=[];
   if(!p.publication)try{
    if(p.options.privateDefense){
     const preview=await requestRoll(actor,{action:"preview",id:p.id});
     summary=preview?.summary;
     comparisons=preview?.comparisons??[];
    }else{
     if(p.selected.length)summary=rollResult(actor,p);
     comparisons=alternativesFor(actor,p);
    }
   }catch(e){summary={ok:false,errors:[e.message]};}
   this._comparisonIds=comparisons.map(option=>option.ids);
   ctx.codex.comparisons=comparisons
     .map((x,i)=>({...x,position:i+1,keptDice:x.ids.map(id=>p.dice.find(d=>d.id===id))
      .filter(Boolean).map(d=>({sides:d.sides,face:d.face,symbolsHTML:markerHTML(symbolsFor(d)),icon:dieSvg(d.sides)}))}));
   ctx.codex.pending={
    dice:p.dice.map(x=>({...x,icon:dieSvg(x.sides),label:sourceLabel(x.group,x.key,s)+(x.elevated?" · Elevação":x.reinforced?" · Reforço legado":""),
      selected:p.selected.includes(x.id),symbolsText:markerText(symbolsFor(x)),symbolsHTML:markerHTML(symbolsFor(x))})),
    selectedCount:p.selected.length,canFinalize:!this._busy&&actor.isOwner&&(p.publication||summary?.ok),summary,errors:summary?.errors||[],
    publishing:!!p.publication,targetOptions:(p.options.combatId?game.combats.get(p.options.combatId):null)?.combatants.filter(c=>c.actor&&c.actor.uuid!==actor.uuid&&c.actor.uuid!==p.options.targetActorUuid).map(c=>({id:c.id,name:c.name,selected:p.options.passAllyId===c.id}))??[],
    de:p.options.privateDefense?"Reservada":p.options.de,formula:p.formula,targetName:p.options.targetName||"",hasTarget:!!p.options.targetName,
    critical:summary?.critical||0,
    properties:(item?.system.properties||[]).map(name=>({name,selected:p.options.characteristic===name,selectedSecond:p.options.secondCharacteristic===name})),
    hasProperties:!!item?.system.properties?.length,paymentPP:p.options.activationPayment==="pp",paymentCourage:p.options.activationPayment!=="pp",
    limit:keepForActor(actor,p.options.extraKeep),extraKeep:p.options.extraKeep,
    cancelP:p.options.cancelP,convertPairs:p.options.convertPairs,
    rawP:summary?.raw?.p||0,rawA:summary?.raw?.a||0,
    localCost:(p.options.activationCost??0)+(usesLocal(actor)?Math.max(0,p.selected.length-keepForActor(actor,0)):0),
    courageCost:(p.options.health?.coragem??0)+Number(Boolean(p.options.step&&!p.options.stepPaid))+(usesLocal(actor)?0:Math.max(0,p.selected.length-keepForActor(actor,0)))
   };
  }
  return ctx;
 }
 _preSyncPartState(partId,newElement,priorElement,state){
  super._preSyncPartState(partId,newElement,priorElement,state);
  state.contentScroll=priorElement.closest(".window-content")?.scrollTop;
  state.openDetails=[...priorElement.querySelectorAll('details[data-sync][open]')].map(el=>el.dataset.sync);
 }
 _syncPartState(partId,newElement,priorElement,state){
  super._syncPartState(partId,newElement,priorElement,state);
  const content=newElement.closest(".window-content");
  if(content&&state.contentScroll!=null)content.scrollTop=state.contentScroll;
  for(const detail of newElement.querySelectorAll('details[data-sync]'))detail.open=state.openDetails?.includes(detail.dataset.sync)??false;
 }
 async _onRender(ctx,options){
  await super._onRender(ctx,options);
  this.element?.querySelector(".codex-foundry-root")?.addEventListener("change",event=>this._change(event));
  this._targetHooks??=[
   ["targetToken",Hooks.on("targetToken",(user,token,targeted)=>{
    if(user.id!==game.user.id||this._pending)return;
    if(targeted){this._targetLost=false;this._lastTargetId=token.document?.uuid;}
    else if(token.document?.parent?.tokens.has(token.id)&&this._lastTargetId===token.document.uuid)this._lastTargetId=null;
    if(this._draft.second)void this.render();
   })],
   ["deleteToken",Hooks.on("deleteToken",token=>{
    if(this._pending||token.uuid!==this._lastTargetId)return;
    this._targetLost=true;
    if(this._draft.second)void this.render();
   })],
   ["canvasReady",Hooks.on("canvasReady",()=>{
    this._lastTargetId=null;
    this._targetLost=false;
    if(this._draft.second&&!this._pending)void this.render();
   })],
  ];
 }
 async _change(event){
  const el=event.target;
  if(el.dataset.equipmentFilter){
   this._equipmentFilters[el.dataset.equipmentFilter]=el.value;
   this.render();return;
  }
  if(el.dataset.itemField){
   const value=el.type==='checkbox'?el.checked:el.type==='number'?Number(el.value):el.dataset.itemField==='properties'?el.value.split(',').map(x=>x.trim()).filter(Boolean):el.value;
   return this._request({action:'equipment',itemId:el.dataset.id,path:el.dataset.itemField,value});
  }
  if(el.dataset.field){
   if(!this.actor.isOwner||!this._editing)return;
   const fields=["name","system.concept","system.origin","system.virtue","system.personality","system.notes","system.abilities","system.leader","system.level","system.xp","system.threatGrade"];
   if(!fields.includes(el.dataset.field))return;
   let value=el.type==="checkbox"?el.checked:el.value;
   if(el.dataset.field==="system.level")value=Math.max(1,Math.min(20,Math.floor(Number(value)||1)));
   if(el.dataset.field==="system.xp"){
    if(!game.user.isGM||this._pending)return;
    const expectedXP=this.actor.system.xp,delta=el.value!==""?Number(el.value)-expectedXP:NaN;
    if(delta===0)return;
    return this._request({action:"adjustXP",delta,expectedXP});
   }
   if(el.dataset.field==="system.threatGrade"){
    value=Math.max(1,Math.min(6,Math.floor(Number(value)||1)));
    return this._request({action:"grade",value});
   }
   await this.actor.update({[el.dataset.field]:value});return;
  }
  if(el.dataset.rollOption){
   const key=el.dataset.rollOption;if(!Object.hasOwn(this._opts,key))return;
   this._opts[key]=el.type==="checkbox"?el.checked:el.type==="number"?Number(el.value):key==="extraKeep"?Number(el.value):el.value;
   if(key==="de")this._opts.de=Math.max(0,Math.min(30,Number(this._opts.de)||0));
   if(key==="mode"){if(this._opts.mode!=="armas"&&isRepeat(this._draft))this._draft.complement=null;this._opts.contextApproved=false;this._opts.equipmentId="";this._opts.stepDieId="";}
    if(key==="equipmentId"||(key==="step"&&!this._opts.step))this._opts.stepDieId="";
   this.render();return;
  }
  if(el.dataset.pendingOption&&this._pending){
   const key=el.dataset.pendingOption;
   const value=["cancelP","convertPairs"].includes(key)?Math.max(0,Math.floor(Number(el.value)||0)):String(el.value);
   await this._request({action:"option",key,value,id:this._pending.id});
  }
 }
 static async purchaseStarter(){
  if(!this._editing||!this.actor.isOwner||this._pending||this.actor.system.monsterRules||this.actor.system.animalRules)return;
  const attr=this.element?.querySelector("[data-starter-attr]")?.value;
  const picked=this.element?.querySelector("[data-starter-training]")?.value||"";
  const [group,key]=picked.split(":");
  const plan=starterPurchasePlan(this.actor.system,attr,group,key);
  if(!plan.ok){ui.notifications.warn(plan.error);return;}
  if(plan.complete){ui.notifications.info("Compras mínimas atendidas. XP restante livre.");return;}
  const message="Comprar as capacidades iniciais em falta por "+plan.cost+" XP?\n"+
   "Um Atributo G1 e um Conhecimento ou Prática G1.\n"+
   "XP disponível: "+plan.available+" → "+plan.remaining+".";
  if(!confirm(message))return;
  await this._request({action:"advance",advance:{kind:"starter",attribute:attr,group,key}});
 }
 static async openDNA(){
  if(!this.actor.isOwner)return;
  const {openCodexDNA}=await import("./dna.mjs");
  await openCodexDNA(this.actor,this.actor.getFlag(NS,"creationPending")?"development":"map");
 }
 static async toggleEditing(){
  if(!this.actor.isOwner||this._busy||this._pending)return;
  this._editing=!this._editing;
  this._draft=draft();this._opts=defaults();
  return this.render();
 }
 static showRoll(_event,target){
  const section=target.dataset.section==="pending"?".codex-roll-results":".codex-roll-prep";
  this.element?.querySelector(section)?.scrollIntoView({block:"start"});
 }
 static async chooseSource(_event,target){
  if(this._busy||this._editing)return;
  if(this._pending){ui.notifications.info("Finalize ou descarte a rolagem pendente antes de escolher novas fontes.");return;}
  const {group,key}=target.dataset;
  const list={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES};
  if(!Object.hasOwn(list,group)||!list[group].some(([id])=>id===key))return;
  const system=this.actor.system,d=this._draft,candidate={group,key};
  const present=[d.base,d.second,d.complement].filter(Boolean);
  const index=present.findIndex(source=>eq(source,candidate));
  const previousDiscipline=hasDiscipline(d);
  if(index>=0){
   const rest=present.filter((source,i)=>i!==index&&(!isRepeat(d)||!isDiscipline(candidate)||i!==2));
   const [base=null,second=null,complement=null]=rest;
   d.base=base;
   d.second=second&&!sourcePairError(system,base,second)?second:null;
   d.complement=d.second?complement:null;
  }else if(!d.base){
   if(attributesOnly(system)&&group!=="attribute")return;
   d.base=candidate;
  }else if(!d.second){
   const error=sourcePairError(system,d.base,candidate);
   if(error){ui.notifications.info(error);return;}
   d.second=candidate;
  }else if(!d.complement&&mayComplement(system,d.base,d.second)){
   if(disciplineNeedsAttribute([d.base,d.second,candidate])){
    ui.notifications.info("Disciplina deve ser combinada com um Atributo.");
    return;
   }
   d.complement=candidate;
  }else{
   ui.notifications.info(d.complement?"Retire uma fonte para escolher outra.":"As duas fontes desta ação estão selecionadas.");
   return;
  }
  if(hasDiscipline(d)!==previousDiscipline){
   this._opts.mode=hasDiscipline(d)?(['criar-item-foco-magia','vento','agua','terra','fogo','sagrado','sangue','trevas','veneno'].some(id=>system.skills.includes(id))?"conjuracao":"armas"):"normal";
   this._opts.equipmentId="";
  }
  this._opts.contextApproved=false;
  this._opts.stepDieId="";
  return this.render();
 }
 static async repeatDiscipline(){
  if(this._busy||this._pending||this._editing)return;
  const d=this._draft;
  if(!d.second||!canRepeatDiscipline(this.actor.system,d.base,d.second))return;
  if(d.complement&&!isRepeat(d))return;
  d.complement=isRepeat(d)?null:[d.base,d.second].find(isDiscipline);
  if(d.complement&&this._opts.mode!=="armas"){
   this._opts.mode="armas";
   this._opts.equipmentId="";
  }
  this._opts.contextApproved=false;
  this._opts.stepDieId="";
  return this.render();
 }
 static adjustGrade(_event,target){
  if(!this._editing||!this.actor.isOwner||this._pending)return;
  const {group,key,delta,grade}=target.dataset;
  return this._request({action:"advance",advance:{kind:"grade",group,key,delta:Number(delta),expectedGrade:Number(grade)}});
 }
 static async adjustResource(event,target){
  if(!this.actor.isOwner)return;
  const field=target.dataset.resource,delta=Number(target.dataset.delta),s=this.actor.system;
  const caps={"system.life.value":lifeMax(s),"system.courage":maxCourage(s.level)};
  if(!(field in caps)||![-1,1].includes(delta))return;
  return this._request({action:'resource',field,delta});
 }
 static toggleSkill(_event,target){
  if(!this._editing||!this.actor.isOwner||this._pending||this._busy)return;
  const key=target.dataset.key;
  if(!skillDetails(this.actor.system,key).owned)return this._request({action:"advance",advance:{kind:"skill",key}});
  const plan=skillRefundPlan(this.actor.system,key);
  if(plan.blocker){ui.notifications.warn(plan.blocker);return;}
  if((!game.user.isGM||this.actor.getFlag(NS,"creationPending"))&&!confirm("Devolver "+plan.name+" e recuperar "+plan.refund+" XP?"))return;
  return this._request({action:"advance",advance:{kind:"skill",key,remove:true,expectedRefund:plan.refund}});
 }
 static clearDraft(){if(this._pending)return;this._draft=draft();this._opts=defaults();this.render();}
 async _request(request){
  if(this._busy||!this.actor.isOwner)return;
  this._busy=true;
  try{
   const response=await requestRoll(this.actor,request);
   if(request.action==='transform'){this._draft=draft();this._opts={...defaults(),de:this._opts.de};}
   if(request.action==="start"&&response?.started){
    this._draft=draft();
    this._opts=defaults();
    void showCodexDice(foundry.dice.Roll.fromData(response.roll));
   }
  }catch(e){ui.notifications.error("Codex: "+e.message);}
  finally{
   this._busy=false;
   this.render();
  }
 }
 static executeRoll(){
  if(this._pending||this._editing||(this._targetLost&&!game.user.targets.size))return;
  return this._request({
   action:"start",selection:this._draft,options:this._opts,
   sceneId:canvas.scene?.id,targetIds:[...game.user.targets].map(token=>token.id)
  });
 }
 static async discardRoll(){
  const pending=this._pending;
  if(!this.actor.isOwner||!pending||pending.publication||this._busy)return;
  const accepted=await foundry.applications.api.DialogV2.confirm({
   window:{title:"Descartar rolagem"},content:"As faces serão descartadas. A Coragem já paga pelo reforço permanece gasta.",rejectClose:false
  });
  if(accepted)await this._request({action:"discard",id:pending.id});
 }
 static toggleKept(_event,target){
  const p=this._pending;
  if(!p||p.publication)return;
  const id=target.dataset.id;
  const ids=p.selected.includes(id)?p.selected.filter(kept=>kept!==id):[...p.selected,id];
  return this._request({action:"keep",id:p.id,ids});
 }
 static applyComparison(_event,target){
  const p=this._pending;
  if(!p||p.publication)return;
  const ids=this._comparisonIds?.[Number(target.dataset.index)];
  if(ids)return this._request({action:"keep",id:p.id,ids});
 }
 static finalizeRoll(){
  if(this._pending)return this._request({action:"finish",id:this._pending.id});
 }
 static async addEquipment(){
  if(!this._editing||!this.actor.isOwner)return;
  return createCodexItem(this.actor);
 }
 static async transform(){
  if(this._busy||this._pending||this._editing)return;
  if(this.actor.system.transformation?.kind)return this._request({action:'transform',revert:true});
  const chosen=await foundry.applications.api.DialogV2.prompt({window:{title:'Transformação Druídica'},
   content:'<label>Forma<select name="size"><option value="pequena">Pequena · 0 Coragem · 1 Atributo</option><option value="media">Média · 1 Coragem · 2 Atributos</option><option value="grande">Grande · 1 Coragem · 3 Atributos</option></select></label><p>Aprimoramento aprovado: 2d6+1d10 → 2d10+1d12. Outras composições e o ganho de Vida por Vigor exigem adjudicação.</p>'+ATTRIBUTES.map(([id,name])=>'<label><input type="checkbox" name="attributes" value="'+id+'">'+name+'</label>').join(''),
   ok:{label:'Transformar',callback:(_event,button)=>({size:button.form.elements.size.value,attributes:[...button.form.querySelectorAll('[name="attributes"]:checked')].map(input=>input.value)})},rejectClose:false});
  if(chosen)return this._request({action:'transform',...chosen});
 }
 static async buyEquipment(_event,target){
  if(this._buying||this._busy||this._pending||!this.actor.isOwner)return;
  this._buying=true;
  try{
  const quantity=Number(target.closest('[data-shop-row]').querySelector('[data-shop-quantity]').value);
  const row=G1_CATALOG.find(row=>row.name===target.dataset.name);
  if(!Number.isInteger(quantity)||quantity<1||quantity>99||!row)return;
  const accepted=await foundry.applications.api.DialogV2.confirm({window:{title:'Comprar equipamento'},
   content:'<p>Comprar '+quantity+' × '+foundry.utils.escapeHTML(target.dataset.name)+' por '+row.priceVT*quantity+' VT em recursos?</p>',rejectClose:false,
   yes:{label:'Confirmar compra'},no:{label:'Cancelar'}});
  if(!accepted)return;
  return this._request({action:'purchase',id:crypto.randomUUID(),name:target.dataset.name,quantity});
  }finally{this._buying=false;}
 }
 static prepareEquipment(_event,target){return this._useEquipment(target.dataset.id,false);}
 static quickEquipment(_event,target){return this._useEquipment(target.dataset.id,true);}
 _useEquipment(id,roll){
  if(this._editing){ui.notifications.warn('Conclua a edição antes de rolar.');return;}
  if(this._busy||this._pending||this.actor.getFlag(NS,'pendingRoll')){ui.notifications.warn('Finalize a rolagem pendente.');return;}
  try{
   const plan=quickEquipmentPlan(this.actor,id,this._draft,this._opts);
   this._draft=plan.selection;this._opts=plan.options;
   if(roll)return CodexCharacterSheet.executeRoll.call(this);
   this.render();
  }catch(error){ui.notifications.warn(error.message);}
 }
 static async cravarEquipment(_event,target){
  const item=this.actor.items.get(target.dataset.id);
  if(item?.system.kind!=='shield'||this._busy||this._pending)return;
  const hits=Number(target.closest('details').querySelector('[data-cravar-hits]').value);
  if(!Number.isInteger(hits)||hits<1)return;
  const accepted=await foundry.applications.api.DialogV2.confirm({window:{title:'Cravar no escudo'},content:'Aplicar −'+hits+' Integridade após acerto e ativação de Cravar? A consequência de Integridade zero exige adjudicação.',rejectClose:false});
  if(accepted)return this._request({action:'equipment',itemId:item.id,path:'integrity.value',value:Math.max(0,item.system.integrity.value-hits)});
 }
 static async addCatalogEquipment(){
  if(!this._editing||!this.actor.isOwner)return;
  const n=Number(this.element?.querySelector("[data-catalog-choice]")?.value),row=G1_CATALOG[n];
  if(!row)return;
  const {name,...system}=structuredClone(row);
  const projected=carriedItems(this.actor)+(Number(system.weight)||0)*Math.max(1,Number(system.quantity)||1),
    capacity=loadCapacity(this.actor.system);
  if(projected>capacity+1e-9)
   ui.notifications.warn("ATENÇÃO: "+name+" excederá a capacidade de carga ("+projected.toFixed(3)+" / "+capacity+
    " Alto). As penalidades exatas por sobrecarga ainda são PENDENTES no SRD.");
  await this.actor.createEmbeddedDocuments("Item",[{name,type:"equipment",system}]);
 }
 static async openEquipment(event,target){
  if(!this._editing)return;
  this.actor.items.get(target.dataset.id)?.sheet.render({force:true});
 }
 static async toggleEquip(event,target){
  const item=this.actor.items.get(target.dataset.id);
  if(item&&this.actor.isOwner)await item.update({"system.equipped":!item.system.equipped});
 }
 static async adjustIntegrity(event,target){
  const item=this.actor.items.get(target.dataset.id),delta=Number(target.dataset.delta);
  if(item&&this.actor.isOwner&&Math.abs(delta)===1)await item.update({
   "system.integrity.value":Math.max(0,Math.min(item.system.integrity.max,item.system.integrity.value+delta))});
 }
 static async removeEquipment(event,target){
  const item=this.actor.items.get(target.dataset.id);
  if(item&&this._editing&&this.actor.isOwner&&confirm('Excluir "'+item.name+'"?'))await item.delete();
 }
 static async editPortrait(){
  if(!this._editing||!this.actor.isOwner)return;
  const picker=new foundry.applications.apps.FilePicker.implementation({
   type:"image",current:this.actor.img,document:this.actor,
   callback:img=>this.actor.update({img})
  });
  await picker.browse();
 }
 static async adjustPavor(event,target){
  if(!game.user.isGM)return;
  const delta=Number(target.dataset.delta),s=this.actor.system;
  if(Math.abs(delta)!==1)return;
  await this.actor.update({"system.pavorLocal":Math.max(0,Math.min(monsterCap(s.threatGrade),s.pavorLocal+delta))});
 }
 async close(options={}){
  this._draft=draft();
  this._opts=defaults();
  this._editing=false;
  this._lastTargetId=null;
  this._targetLost=false;
  for(const [event,id] of this._targetHooks??[])Hooks.off(event,id);
  this._targetHooks=null;
  return super.close(options);
 }
}
