/* Codex RPG — ficha de Actor para Foundry v14. */
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SITUATIONS,
 sourceDice,sourceLabel,faceSymbols,buildPool,canElevateSource,hasSmallCompanion,starterPurchasePlan,lifeMax,healthByLife,balance,maxCourage,
 loadCapacity,mayComplement,canRepeatDiscipline,sourcePairError,isDiscipline,disciplineNeedsAttribute,attributesOnly,xpLedger,monsterCap,isMaximumFace} from "./rules.mjs";
import {requestRoll} from "./roll-workflow.mjs";
import {keepForActor,rollResult,alternativesFor,usesLocal,pendingRollFor,castingFor} from "./roll-resolution.mjs";
import {dieSvg,faceIcons} from "./dice-icons.mjs";
import {equippedDie,equippedArmor,defenseDisplay,effectiveWeaponRange,carriedWeight} from "./equipment-logic.mjs";
import {actorKinds} from "./creation.mjs";
import {createCodexActor,createCodexItem} from "./creation-ui.mjs";
import {showCodexDice} from "./dice-so-nice.mjs";
import {G1_CATALOG} from "./catalog.mjs";
import {equipmentView} from './equipment-view.mjs';
import {RACES,hasSkill,racialBand,isRuna} from "./races.mjs";
import {spellPlan,compatibleFoci,focusElement,focusCharges,magicTiming,availableElements} from "./conjuration.mjs";
import {prepareCombatAction,selectionOptions,changeRollSource} from "./combat-action.mjs";
import {canAsura,canUseTechnique,fulminanteFor,sphereRound,sphereState,weaponMastery} from "./techniques.mjs";
import {historicalBardNames} from "./bard.mjs";
import {standardMovement} from "./movement.mjs";
import {actionResource,healthCost,spendActionResource,spentInRound} from "./combat-resources.mjs";
const NS="codex-rpg-foundry";
const draft=()=>({base:null,second:null,complement:null});
const defaults=()=>({mode:"normal",actionType:"",manualDamage:false,de:1,situation:"neutral",extraKeep:false,activationPavor:1,step:false,stepDieId:"",
 weightEnabled:false,attackWeight:"leve",targetWeight:"medio",combatBonus:false,
 cancelP:0,convertPairs:0,equipmentId:"",element:"",focusId:"",magicGrade:1,magicSecondElement:"",magicSecondFocusId:"",magicCharges:0,magicAmplify:false,
 magicGradeConfirmed:false,magicPathMeters:0,runeShield:false,
 fulminante:false,companionHelp:false,lightHands:false,potionResearch:false,stealthAttack:false,asuraDieId:"",characteristic:"",secondCharacteristic:"",activationPayment:"courage"});
const eq=(x,y)=>!!x&&x.group===y.group&&x.key===y.key;
const desktopRollMedia="(min-width: 851px) and (hover: hover) and (pointer: fine)";
const sheetTabs=[
 ["play","Jogar","Rolagens e ações"],["evolution","Evolução","XP e investimentos"],
 ["genetic","Codex Genético","Mapa de Perícias"],["inventory","Inventário","Equipamentos e VT"]
];
const inventoryTabs=[
 ["bag","Mochila e equipamentos","▣"],["wallet","Bolsa · VT","◈"],
 ["shop","Mercado e compras","✧"]
];
function cards(list,group,s,d){
 return list.map(([key])=>({key,group,label:sourceLabel(group,key,s),
 xpLabel:{discount:"↓ XP reduzido",elevated:"↑ XP aumentado"}[racialBand(s,group,key)],
 grade:Number(s[{attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group]]?.[key]||0),
 dice:sourceDice(group,key,s).map(sides=>({sides,icon:dieSvg(sides)})),
 isSelected:[d.base,d.second,d.complement].some(source=>eq(source,{group,key})),
 isBase:eq(d.base,{group,key}),isSecond:eq(d.second,{group,key}),isComplement:eq(d.complement,{group,key})&&!isRepeat(d)}));
}
const markerText=v=>(v[0]?v[0]+"ᛋ ":"")+(v[1]?v[1]+"ᚨ ":"")+(v[2]?v[2]+"ᚦ":"")||"Vazio";
const carriedItems=carriedWeight;
const carryClasses=(capacity,used)=>Object.fromEntries([["leve",.125],["medio",.5],["pesado",1]]
 .map(([k,w])=>[k,Math.floor((Math.max(0,capacity-used)+1e-9)/w)]));
function selectedItem(actor,opts){return actor.items.get(opts.equipmentId)||null;}
const isRepeat=d=>isDiscipline(d.complement)&&[d.base,d.second].some(isDiscipline);
export class CodexCharacterSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2){
 static DEFAULT_OPTIONS={classes:["codex-rpg","codex-character-sheet"],position:{width:1120,height:820},
 window:{resizable:true},actions:{
 sheetPage(_event,target){return this._selectSheetPage(target.dataset.page);},
 inventoryPage(_event,target){this._inventoryPage=target.dataset.pane;this._showSheetState(this.element);},
 resourceDetails(_event,target){this._selectResource(target.dataset.vital);},
 createCharacter(){return createCodexActor();},
 resolveCast(_event,target){return this._request({action:"resolveCast",id:target.dataset.id,cancel:target.dataset.cancel==="true"});},
 saveCompanion(){
  const form=this.element.querySelector("[data-small-companion]");
  return this._request({action:"companion",name:form.querySelector("[data-companion-name]").value,
   species:form.querySelector("[data-companion-species]").value,present:form.querySelector("[data-companion-present]").checked});
 },
 lightHands:CodexCharacterSheet.lightHands,
 sphere(_event,target){return this._request({action:"sphere",kind:target.dataset.kind});},
 chooseSource:CodexCharacterSheet.chooseSource,repeatDiscipline:CodexCharacterSheet.repeatDiscipline,showRoll:CodexCharacterSheet.showRoll,adjustGrade:CodexCharacterSheet.adjustGrade,toggleEditing:CodexCharacterSheet.toggleEditing,
 adjustResource:CodexCharacterSheet.adjustResource,closeRoll:CodexCharacterSheet.closeRoll,
 clearDraft:CodexCharacterSheet.clearDraft,executeRoll:CodexCharacterSheet.executeRoll,
 toggleKept:CodexCharacterSheet.toggleKept,discardRoll:CodexCharacterSheet.discardRoll,applyComparison:CodexCharacterSheet.applyComparison,
 purchaseStarter:CodexCharacterSheet.purchaseStarter,finalizeRoll:CodexCharacterSheet.finalizeRoll,
 addEquipment:CodexCharacterSheet.addEquipment,openEquipment:CodexCharacterSheet.openEquipment,
 toggleEquip:CodexCharacterSheet.toggleEquip,adjustIntegrity:CodexCharacterSheet.adjustIntegrity,
 removeEquipment:CodexCharacterSheet.removeEquipment,addCatalogEquipment:CodexCharacterSheet.addCatalogEquipment,
 editPortrait:CodexCharacterSheet.editPortrait,adjustPavor:CodexCharacterSheet.adjustPavor
 ,rest(_event,target){return this._request({action:'rest',kind:target.dataset.kind});},transform:CodexCharacterSheet.transform
 ,buyEquipment:CodexCharacterSheet.buyEquipment,prepareAction:CodexCharacterSheet.prepareAction,
 prepareEquipment:CodexCharacterSheet.prepareEquipment,cravarEquipment:CodexCharacterSheet.cravarEquipment,
 attackShortcut(_event,target){
  return this._request({action:"attackShortcut",itemId:target.dataset.id,enabled:target.dataset.enabled==="true"});
 }
 }};
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/character-sheet.hbs",scrollable:[""]}};
 constructor(options={}){
  super(options);
  this._draft=draft();this._opts=defaults();this._pending=null;
  this._rollOpen=false;this._busy=false;this._editing=false;
  this._equipmentFilters={family:'all',weight:'all',shopFamily:'all',shopWeight:'all'};
  this._sheetPage="play";
  this._inventoryPage="bag";
  this._scrollPositions=new Map();
 }
 get title(){return [actorKinds[this.actor?.type],this.actor?.name].filter(Boolean).join(" · ")||super.title;}
 async _prepareContext(options){
  const ctx=await super._prepareContext(options),actor=this.actor,s=actor.system,d=this._draft,monster=!!s.monsterRules,animal=!!s.animalRules,attributesOnly=monster||animal||s.transformation?.kind==='animal',ledger=xpLedger(s),
   used=carriedItems(actor),carryMax=loadCapacity(s),
   hasFirstAttribute=ATTRIBUTES.some(([key])=>Number(s.attributes?.[key]||0)>=1),
   hasTraining=[...KNOWLEDGES.map(([k])=>s.knowledges?.[k]),...PRACTICES.map(([k])=>s.practices?.[k])].some(n=>Number(n||0)>=1);
  this._pending=pendingRollFor(actor);
  const canPrepare=actor.isOwner&&!this._editing&&!this._pending&&!actor.getFlag(NS,"creationPending");
  const elements=availableElements(s),round=sphereRound(game.combat),spheres=sphereState(s,round);
  const available=s[actionResource(actor)]??0,resourceName=usesLocal(actor)?"Pavor local":"Coragem";
  const companion=hasSkill(s,"domar-criatura-pequena")?{...s.companion,serpente:s.companion?.species==="serpente",active:hasSmallCompanion(s)}:null;
  const castingPending=castingFor(actor);
  if(this._pending)this._editing=false;
  const canOpenDNA=actor.isOwner&&!attributesOnly;
  if(!canOpenDNA&&this._sheetPage==="genetic")this._sheetPage="play";
  const defense=defenseDisplay(actor);
  const wornArmor=equippedArmor(actor);
  const armorSys=wornArmor?.system,armorMax=Math.max(0,Number(armorSys?.integrity?.max)||0);
  const armorCurrent=Math.min(armorMax,Math.max(0,Number(armorSys?.integrity?.value)||0));
  const armorCard=wornArmor?{
   id:wornArmor.id,name:wornArmor.name,integrity:armorCurrent,maximum:armorMax,
   hasMaximum:armorMax>0
  }:null;
  ctx.codex={
   sphere:canPrepare&&!attributesOnly&&canUseTechnique(s,"invocar-esfera-espiritual")?{
    ...spheres,ready:canAsura(s,round),manualRound:game.user.isGM&&!round,
    canCreate:spheres.createdThisRound<5&&spheres.count<5&&s.courage>0,
    absorb:canUseTechnique(s,"absorver-esferas"),step:canUseTechnique(s,"passo-etereo"),
    ranged:canUseTechnique(s,"disparo-esferas-espirituais")
   }:null,
   lightHands:canPrepare&&!attributesOnly&&canUseTechnique(s,"maos-leves"),
   equipment:equipmentView(actor,this._equipmentFilters),hasDruidic:s.skills.includes('pericia-druidica'),transformed:!!s.transformation?.kind,
   movement:standardMovement(s),canAttack:canPrepare,canCast:canPrepare&&!attributesOnly&&elements.length>0,
   actorName:actor.name,portrait:actor.img,defaultPortrait:actor.img==="icons/svg/mystery-man.svg",editing:this._editing&&actor.isOwner,
   canOpenDNA,canCreateCharacter:Actor.implementation.canUserCreate(game.user),appId:this.id,isGM:game.user.isGM,
   pages:sheetTabs.filter(([id])=>id!=="genetic"||canOpenDNA).map(([id,label,description])=>({id,label,description})),
   inventoryPages:inventoryTabs.map(([id,label,icon])=>({id,label,icon})),
   identityOpen:this.element?.querySelector(".codex-identity-details")?.open,
   progressOpen:this.element?.querySelector(".codex-creation-panel")?.open ?? (!attributesOnly&&!s.monsterHumanoidRules&&!(hasFirstAttribute&&hasTraining)),
   actorTypeLabel:actorKinds[actor.type],
   sheetLocation:actor.isToken?"Token na cena":actor.prototypeToken?.actorLink===false?"Ficha-base":"",
   concept:s.concept,race:RACES[s.race]?.name,virtue:s.virtue,personality:s.personality,
   notes:s.notes,abilities:s.abilities,leader:s.leader,isHostile:actor.type!=="character",
   level:s.level,life:s.life.value,lifeMax:lifeMax(s),medical:s.life.medical,
   health:healthByLife(s,s.life.value),healthActionCost:healthCost(actor,healthByLife(s,s.life.value)),companion,castingPending,resourceName,
   courageSpent:spentInRound(actor,game.combat),inCombat:!!game.combat?.started,
   sangramento:s.status?.sangramento,envenenado:s.status?.envenenado,
   courage:s.courage,courageMax:maxCourage(s.level),de:defense.de,deCalculation:defense.calculation,deCondition:defense.condition,armorCard,
   balance:balance(s),capacity:carryMax,loadUsed:used,loadFree:Math.max(0,carryMax-used),
    carryClasses:carryClasses(carryMax,used),overloaded:used>carryMax+1e-9,
    loadPercent:Math.min(100,Math.round(100*used/carryMax)),loadMeter:Math.min(used,carryMax),
    historicalBard:historicalBardNames(actor),
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
   const {mode,actionType}=this._opts;
   const casting=mode==="conjuracao",foci=casting?compatibleFoci(actor,this._opts.element):[];
   const item=casting?foci.find(i=>i.id===this._opts.focusId):selectedItem(actor,this._opts);
   const die=item?equippedDie(actor,item,mode):0;
   const secondFoci=casting&&this._opts.magicGrade===4?compatibleFoci(actor,this._opts.magicSecondElement):[];
   const secondFocus=secondFoci.find(i=>i.id===this._opts.magicSecondFocusId);
   const grade=this._opts.magicGrade,fullMagic=grade===4;
   const maxCharges=item?Math.min({1:0,2:1,3:2,4:3}[grade],focusCharges(item),fullMagic?(secondFocus?focusCharges(secondFocus):0):Infinity):0;
   const fulminante=actionType==="attack"?fulminanteFor(actor,item):"";
   const companionHelp=Boolean(actionType&&companion?.active);
   let magic;
   if(casting)try{magic=spellPlan(actor,this._opts);}catch(error){magic={error:error.message};}
   const stealthAvailable=actionType==="attack"&&item?.system.kind==="weapon"&&die&&canUseTechnique(s,"golpe-furtivo");
   const potionAvailable=mode==="normal"&&!this._opts.lightHands&&canUseTechnique(s,"pesquisa-avancada-pocoes");
   const asuraAvailable=actionType==="attack"&&canAsura(s,round,item,available);
   const buildOptions={mode,actionType,contextApproved:true,equipmentDie:die,magicGrade:grade,fulminante:this._opts.fulminante?fulminante:"",lightHands:this._opts.lightHands,
    stealthAttack:this._opts.stealthAttack&&stealthAvailable};
   const rawPlan=buildPool(s,d,buildOptions);
   const plan=buildPool(s,d,{...buildOptions,step:this._opts.step,stepDieId:this._opts.stepDieId,asuraDieId:this._opts.asuraDieId});
   if(ctx.codex.health.id==="morto")plan.errors.push("Vida zero: a ficha não pode agir.");
   const cost=healthCost(actor,ctx.codex.health)+Number(this._opts.step)+(magic?.courage??0)+
    Number(Boolean(this._opts.asuraDieId))+Number(this._opts.fulminante)+Number(this._opts.companionHelp)+Number(this._opts.extraKeep);
   try{spendActionResource(actor,cost,game.combat);}catch(error){plan.errors.push(error.message);}
   if(casting&&castingPending)plan.errors.push("Resolva primeiro a conjuração em preparação.");
   if(this._opts.equipmentId&&!die){plan.errors.push("Equipamento indisponível para esta ação.");plan.ok=false;}
   if(magic?.error){plan.errors.push(magic.error);plan.ok=false;}
   if(this._opts.asuraDieId&&!asuraAvailable){plan.errors.push("Asura precisa de arma corpo a corpo ou mãos vazias.");plan.ok=false;}
   const targets=this._opts.runeShield?[]:[...game.user.targets];
   let target=null,targetError="";
   if(targets.length===1){
    this._lastTargetId=targets[0].document?.uuid;
    try{
     target=await requestRoll(actor,{action:"target",sceneId:canvas.scene?.id,targetIds:targets.map(token=>token.id)});
    }catch(error){targetError=error.message;}
   }else if(targets.length>1)targetError="Selecione apenas um alvo para esta ação.";
   else if(this._targetLost&&!this._opts.runeShield)targetError="O alvo saiu do mapa. Selecione outro Token.";
   if(targetError)plan.errors.push(targetError);
   plan.ok=plan.errors.length===0;
   ctx.codex.prepare={
    fixedSources:this._opts.lightHands,baseName:sourceLabel(d.base.group,d.base.key,s),secondName:sourceLabel(d.second.group,d.second.key,s),stealthAvailable,stealthAttack:this._opts.stealthAttack,potionAvailable,potionResearch:this._opts.potionResearch,
    asuraAvailable,asuraOptions:rawPlan.pool.map(x=>({id:x.id,label:sourceLabel(x.group,x.key,s)+" · d"+x.sides,selected:x.id===this._opts.asuraDieId})),
    actionLabel:this._opts.lightHands?"Mãos Leves":actionType==="spell"?"Conjurar":actionType==="attack"?"Atacar":"Preparar teste",
    offensive:Boolean(actionType),lockedDiscipline:Boolean(actionType&&!attributesOnly),
    repeatedDiscipline:isRepeat(d),canRepeatDisc:mode==="armas"&&canRepeatDiscipline(s,d.base,d.second)&&(!d.complement||isRepeat(d)),
    modeArmas:mode==="armas",casting,fulminante,fulminanteActive:this._opts.fulminante,companionHelp,companionActive:this._opts.companionHelp,
    magic:casting?{
     grades:[1,2,3,4].map(value=>({value,selected:value===this._opts.magicGrade})),
     confirmGrade:this._opts.magicGrade>1,gradeConfirmed:this._opts.magicGradeConfirmed,
     turns:magicTiming(this._opts.magicGrade,this._opts.magicCharges),
     courage:magic?.courage??0,
     charges:this._opts.magicCharges,maxCharges,fullMagic,
     secondElements:elements.filter(([id])=>id!==this._opts.element).map(([key,label])=>({key,label,selected:this._opts.magicSecondElement===key})),
     secondFoci:secondFoci.map(i=>({id:i.id,name:i.name,charges:focusCharges(i),selected:i.id===secondFocus?.id})),
     amplify:this._opts.magicAmplify,hasFocus:Boolean(item),
     wind:this._opts.element==="vento",pathMeters:this._opts.magicPathMeters||"",windRange:[4,8,16,16][grade-1],
     canShield:isRuna(s)&&this._opts.magicGrade===1&&this._opts.element!=="psiquico",shield:this._opts.runeShield,
     acid:["fogo","veneno"].includes(this._opts.element)&&["fogo","veneno","improviso"].every(id=>hasSkill(s,id)),
     mastery:hasSkill(s,"mestre"),
     foci:foci.map(i=>({id:i.id,name:i.name,charges:focusCharges(i),grade:i.system.grade,selected:i.id===item?.id})),
    }:null,
    de:this._opts.de,manualDamage:this._opts.manualDamage,
    baseOptions:selectionOptions(s,d,"base",Boolean(actionType)),secondOptions:selectionOptions(s,d,"second",Boolean(actionType)),
    complementOptions:this._opts.lightHands?[]:selectionOptions(s,d,"complement",Boolean(actionType)),
    elements:elements.map(([key,label])=>({key,label,selected:this._opts.element===key})),
    situations:Object.entries(SITUATIONS).map(([id,x])=>({id,label:x.label,selected:this._opts.situation===id})),
    weightEnabled:this._opts.weightEnabled,attackWeight:this._opts.attackWeight,targetWeight:this._opts.targetWeight,
    attackWeightLeve:this._opts.attackWeight==="leve",attackWeightMedio:this._opts.attackWeight==="medio",attackWeightPesado:this._opts.attackWeight==="pesado",
    targetWeightLeve:this._opts.targetWeight==="leve",targetWeightMedio:this._opts.targetWeight==="medio",targetWeightPesado:this._opts.targetWeight==="pesado",
    extraKeep:this._opts.extraKeep,extraZero:Number(this._opts.extraKeep)===0,extraOne:Number(this._opts.extraKeep)===1,extraTwo:Number(this._opts.extraKeep)===2,
    step:this._opts.step,combatBonus:false,hasCombatSkill:false,
    stepOptions:[d.base,d.second,d.complement].filter(source=>source&&canElevateSource(s,source))
     .map(source=>({id:source.group+"."+source.key,label:sourceLabel(source.group,source.key,s)}))
     .filter((source,index,all)=>all.findIndex(other=>source.id===other.id)===index)
     .map(source=>({...source,selected:source.id===this._opts.stepDieId})),
    equipmentOptions:actor.items.filter(i=>i.type==="equipment"&&equippedDie(actor,i,mode))
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
   const symbolsFor=die=>die.symbols??faceSymbols(die.sides,die.face,p.version<4);
   const markerHTML=die=>faceIcons(symbolsFor(die),isMaximumFace(die));
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
      .filter(Boolean).map(d=>({sides:d.sides,face:d.face,symbolsHTML:markerHTML(d),icon:dieSvg(d.sides)}))}));
   const propertyNames=(item?.system.properties??[]).filter(name=>name!=="Barulhenta");
   const mastery=canUseTechnique(s,weaponMastery(item));
   const extra=Math.max(0,p.selected.length-keepForActor(actor,0));
   const pendingCost=healthCost(actor,p.options.health)+(p.options.magic?.courage??0)+Number(Boolean(p.options.asura))+
    Number(Boolean(p.options.fulminante))+Number(Boolean(p.options.companionHelp))+extra;
   ctx.codex.pending={
    dice:p.dice.map(x=>({...x,icon:dieSvg(x.sides),label:sourceLabel(x.group,x.key,s)+(x.elevated?" · Elevação":x.reinforced?" · Reforço legado":""),
      selected:p.selected.includes(x.id),symbolsText:markerText(symbolsFor(x)),symbolsHTML:markerHTML(x),maximum:isMaximumFace(x)})),
    selectedCount:p.selected.length,canFinalize:!this._busy&&actor.isOwner&&(p.publication||summary?.ok),summary,errors:summary?.errors||[],
    publishing:!!p.publication,targetOptions:(p.options.combatId?game.combats.get(p.options.combatId):null)?.combatants.filter(c=>c.actor&&c.actor.uuid!==actor.uuid&&c.actor.uuid!==p.options.targetActorUuid).map(c=>({id:c.id,name:c.name,selected:p.options.passAllyId===c.id}))??[],
    de:p.options.privateDefense?"Reservada":p.options.de,formula:p.formula,targetName:p.options.targetName||"",hasTarget:!!p.options.targetName,
    critical:summary?.critical||0,
    properties:propertyNames.map(name=>({name,selected:p.options.characteristic===name,selectedSecond:p.options.secondCharacteristic===name,selectedThird:p.options.thirdCharacteristic===name})),
    hasProperties:propertyNames.length>0,canThird:p.version>=7&&mastery&&summary?.critical,
    canBlockPiercing:game.user.isGM&&[p.options.characteristic,p.options.secondCharacteristic,p.options.thirdCharacteristic].includes("Perfurante"),
    piercingBlocked:p.options.piercingBlocked,
    limit:keepForActor(actor,p.options.extraKeep),extraKeep:p.options.extraKeep,
    cancelP:p.options.cancelP,convertPairs:p.options.convertPairs,
    rawP:summary?.raw?.p||0,rawA:summary?.raw?.a||0,
    localCost:usesLocal(actor)?pendingCost:0,courageCost:usesLocal(actor)?0:pendingCost
   };
  }
  return ctx;
 }
 _preSyncPartState(partId,newElement,priorElement,state){
  super._preSyncPartState(partId,newElement,priorElement,state);
  state.contentScroll=priorElement.closest(".window-content")?.scrollTop;
  state.openDetails=[...priorElement.querySelectorAll('details[data-sync][open]')].map(el=>el.dataset.sync);
  this._rollScroll=priorElement.querySelector(".codex-roll-surface")?.scrollTop??0;
 }
 _syncPartState(partId,newElement,priorElement,state){
  super._syncPartState(partId,newElement,priorElement,state);
  for(const detail of newElement.querySelectorAll('details[data-sync]'))detail.open=state.openDetails?.includes(detail.dataset.sync)??false;
  this._showSheetState(newElement);
  const content=newElement.closest(".window-content");
  if(content&&state.contentScroll!=null)content.scrollTop=state.contentScroll;
 }
 async _onRender(ctx,options){
  await super._onRender(ctx,options);
  const root=this.element.querySelector(".codex-sheet");
  root.addEventListener("change",event=>this._change(event));
  root.addEventListener("keydown",event=>{
   if(event.key==="Escape"&&this._resource&&event.target.closest(".codex-vitals")){
    event.stopPropagation();
    const button=root.querySelector('[data-vital="'+this._resource+'"]');
    this._selectResource();
    button?.focus({preventScroll:true});
   }
  });
  this._showSheetState(root);
  if(!this._rollMedia){
   this._rollMedia=window.matchMedia(desktopRollMedia);
   this._rollMediaChanged=()=>this._configureRollSurface();
   this._rollMedia.addEventListener("change",this._rollMediaChanged);
   this._rollEscape=event=>{
    if(event.key!=="Escape"||!this.element?.querySelector(".codex-roll-surface:popover-open"))return;
    event.preventDefault();
    event.stopImmediatePropagation();
    CodexCharacterSheet.closeRoll.call(this);
    this.element.querySelector('[data-action="showRoll"]')?.focus({preventScroll:true});
   };
   window.addEventListener("keydown",this._rollEscape,{capture:true});
   this._rollResize=()=>{
    const panel=this.element?.querySelector(".codex-roll-surface:popover-open");
    if(panel)this._positionRollSurface(panel);
   };
   window.addEventListener("resize",this._rollResize);
  }
  this._configureRollSurface();
  if(this._sheetPage==="genetic")await this._showGeneticMap();
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
   const fields=["name","system.concept","system.virtue","system.personality","system.notes","system.abilities","system.leader","system.level","system.xp","system.threatGrade"];
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
   this._opts[key]=el.type==="checkbox"?el.checked:el.type==="number"||["extraKeep","magicGrade"].includes(key)?Number(el.value):el.value;
   if(["element","focusId","magicGrade","magicSecondElement","magicSecondFocusId"].includes(key)){
    this._opts.magicCharges=0;
    if(key==="magicSecondElement")this._opts.magicSecondFocusId="";
    if(key==="element"&&this._opts.magicSecondElement===this._opts.element){this._opts.magicSecondElement="";this._opts.magicSecondFocusId="";}
    if(key==="element"){
     this._opts.focusId="";this._opts.magicPathMeters=0;
    }
    if(key==="magicGrade"||key==="element"){
     this._opts.magicGradeConfirmed=false;this._opts.runeShield=false;
    }
    if(!this._opts.focusId)this._opts.magicAmplify=false;
   }
   if(key==="de")this._opts.de=Math.max(0,Math.min(30,Number(this._opts.de)||0));
   if(["equipmentId","focusId"].includes(key)||(key==="step"&&!this._opts.step))this._opts.stepDieId="";
   if(["equipmentId","stealthAttack"].includes(key))this._opts.asuraDieId="";
   if(key==="equipmentId"){this._opts.stealthAttack=false;this._opts.fulminante=false;}
   this.render();return;
  }
  if(el.dataset.rollSource&&this._draft.second&&!this._pending&&!this._editing&&!this._opts.lightHands){
   const selection=changeRollSource(this.actor.system,this._draft,el.dataset.rollSource,el.value,Boolean(this._opts.actionType));
   if(selection){this._draft=selection;this._opts.stepDieId="";this._opts.asuraDieId="";await this.render();}
   return;
  }
  if(el.dataset.pendingOption&&this._pending){
   const key=el.dataset.pendingOption;
   const value=key==="piercingBlocked"?el.checked:["cancelP","convertPairs"].includes(key)?Math.max(0,Math.floor(Number(el.value)||0)):String(el.value);
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
 _showSheetState(root){
  for(const panel of root.querySelectorAll("[data-sheet-panel]"))panel.hidden=panel.dataset.sheetPanel!==this._sheetPage;
  for(const button of root.querySelectorAll(".codex-sheet-tabs [data-page]")){
   if(button.dataset.page===this._sheetPage)button.setAttribute("aria-current","page");
   else button.removeAttribute("aria-current");
  }
  for(const panel of root.querySelectorAll("[data-inventory-panel]"))panel.hidden=panel.dataset.inventoryPanel!==this._inventoryPage;
  for(const button of root.querySelectorAll(".codex-inventory-tabs [data-pane]")){
   if(button.dataset.pane===this._inventoryPage)button.setAttribute("aria-current","page");
   else button.removeAttribute("aria-current");
  }
  this._showResource(root);
  const host=root.querySelector("[data-genetic-host]");
  if(host&&this._embeddedDNA?.element&&!host.contains(this._embeddedDNA.element))host.append(this._embeddedDNA.element);
 }
 _showResource(root){
  for(const panel of root.querySelectorAll("[data-vital-panel]"))panel.hidden=panel.dataset.vitalPanel!==this._resource;
  for(const button of root.querySelectorAll("[data-vital]"))button.setAttribute("aria-expanded",String(button.dataset.vital===this._resource));
 }
 _selectResource(vital){
  this._resource=this._resource===vital?null:vital;
  this._showResource(this.element.querySelector(".codex-sheet"));
 }
 async _selectSheetPage(page){
  if(!sheetTabs.some(([id])=>id===page)||page==="genetic"&&(!this.actor.isOwner||attributesOnly(this.actor.system)))return;
  const content=this.element.querySelector(".window-content");
  if(this._sheetPage!==page){
   this._scrollPositions.set(this._sheetPage,content.scrollTop);
   this._sheetPage=page;
   this._selectResource();
   this._showSheetState(content);
   this._configureRollSurface();
   content.scrollTop=this._scrollPositions.get(page)??0;
  }
  if(page==="genetic")await this._showGeneticMap();
 }
 async _showGeneticMap(){
  if(this._embeddedDNA){
   this._embeddedDNA.refresh();
   return;
  }
  this._embeddingDNA??=import("./dna.mjs").then(({embedCodexDNA})=>
   embedCodexDNA(this.actor,()=>this.element?.querySelector("[data-genetic-host]")));
  try{this._embeddedDNA=await this._embeddingDNA;}
  catch(error){ui.notifications.error("Codex Genético: "+error.message);}
  finally{this._embeddingDNA=null;}
 }
 static async toggleEditing(){
  if(!this.actor.isOwner||this._busy||this._pending)return;
  this._editing=!this._editing;
  this._draft=draft();this._opts=defaults();
  if(!this._editing&&this._sheetPage==="evolution")await this._selectSheetPage("play");
  return this.render();
 }
 _configureRollSurface(){
  const panel=this.element?.querySelector(".codex-roll-surface");
  if(!panel?.querySelector(".codex-roll-prep,.codex-roll-results"))return;
  if(this._sheetPage!=="play"){
   // Preserve a posição do rolador quando a ficha mudar de aba.
   if(panel.matches(":popover-open")){panel.rollIntent=null;panel.hidePopover();}
   return;
  }
  if(!this._rollMedia.matches||typeof panel.showPopover!=="function"){
   panel.removeAttribute("popover");
   panel.removeAttribute("role");
   return;
  }
  if(!panel.hasAttribute("popover")){
   panel.setAttribute("popover","auto");
   panel.setAttribute("role","dialog");
   panel.addEventListener("toggle",event=>{
    if(event.newState==="closed"&&panel.isConnected&&panel.hasAttribute("popover")&&panel.rollIntent===this._rollIntent)this._rollOpen=false;
   });
   this._bindRollDrag(panel);
  }
  if(this._rollOpen){
   panel.rollIntent=this._rollIntent;
   if(!panel.matches(":popover-open"))panel.showPopover();
   this._positionRollSurface(panel);
   panel.scrollTop=this._rollScroll??0;
  }
 }
 _positionRollSurface(panel,position=this._rollPosition){
  const {width,height}=panel.getBoundingClientRect();
  const anchor=this._rollAnchor;
  const margin=12,gap=8;
  const below=anchor&&anchor.bottom+gap+height+margin<=window.innerHeight;
  const above=anchor&&anchor.top-gap-height>=margin;
  const left=position?.left??anchor?.left??(window.innerWidth-width)/2;
  const top=position?.top??(below?anchor.bottom+gap:above?anchor.top-gap-height:(window.innerHeight-height)/2);
  const clamp=(value,space)=>Math.max(margin,Math.min(value,space-margin));
  const point={left:clamp(left,window.innerWidth-width),top:clamp(top,window.innerHeight-height)};
  panel.style.left=point.left+"px";
  panel.style.top=point.top+"px";
  if(position)this._rollPosition=point;
 }
 _bindRollDrag(panel){
  const handle=panel.querySelector("[data-roll-drag]");
  if(!handle||handle.dataset.dragReady)return;
  handle.dataset.dragReady="true";
  let drag;
  handle.addEventListener("pointerdown",event=>{
   if(event.button!==0||!event.isPrimary||!panel.matches(":popover-open"))return;
   const bounds=panel.getBoundingClientRect();
   drag={id:event.pointerId,offsetX:event.clientX-bounds.left,offsetY:event.clientY-bounds.top};
   handle.setPointerCapture(event.pointerId);
   handle.classList.add("is-dragging");
   event.preventDefault();
  });
  handle.addEventListener("pointermove",event=>{
   if(drag?.id!==event.pointerId)return;
   this._positionRollSurface(panel,{left:event.clientX-drag.offsetX,top:event.clientY-drag.offsetY});
  });
  handle.addEventListener("lostpointercapture",()=>{
   drag=null;
   handle.classList.remove("is-dragging");
  });
  handle.addEventListener("keydown",event=>{
   const direction={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]}[event.key];
   if(!direction||!panel.matches(":popover-open"))return;
   event.preventDefault();
   event.stopPropagation();
   const {left,top}=panel.getBoundingClientRect();
   const step=event.shiftKey?40:10;
   this._positionRollSurface(panel,{left:left+step*direction[0],top:top+step*direction[1]});
  });
 }
 _openRollNear(target){
  this._rollOpen=true;
  this._rollIntent=(this._rollIntent??0)+1;
  this._rollAnchor=target?.getBoundingClientRect()??null;
  this._rollScroll=0;
 }
 static async showRoll(event,target){
  const near=this._sheetPage==="play"?target:null;
  if(this._sheetPage!=="play")await this._selectSheetPage("play");
  this._openRollNear(near);
  this._configureRollSurface();
  const panel=this.element?.querySelector(".codex-roll-surface");
  if(panel?.matches(":popover-open")){
   if(event?.detail===0)panel.querySelector('[data-action="closeRoll"]')?.focus({preventScroll:true});
  }else panel?.scrollIntoView({block:"start"});
 }
 static closeRoll(){
  this._rollOpen=false;
  this.element?.querySelector(".codex-roll-surface:popover-open")?.hidePopover();
 }
 static async chooseSource(_event,target){
  if(this._busy||this._editing)return;
  if(this._pending){ui.notifications.info("Finalize ou descarte a rolagem pendente antes de escolher novas fontes.");return;}
  const {group,key}=target.dataset;
  const list={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES};
  if(!Object.hasOwn(list,group)||!list[group].some(([id])=>id===key))return;
  if(this._opts.lightHands){this._opts=defaults();this._draft=draft();}
  const system=this.actor.system,d=this._draft,candidate={group,key};
  if(this._opts.actionType){
   const slot=group==="attribute"?"second":"complement";
   const next=changeRollSource(system,d,slot,eq(d.complement,candidate)?"":group+":"+key,true);
   if(next){this._draft=next;this._opts.stepDieId="";this._opts.asuraDieId="";this._openRollNear(target);return this.render();}
   return;
  }
  const present=[d.base,d.second,d.complement].filter(Boolean);
  const index=present.findIndex(source=>eq(source,candidate));
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
  this._opts.stepDieId="";
  if(d.second)this._openRollNear(target);
  else this._rollOpen=false;
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
 static clearDraft(){if(this._pending)return;this._draft=draft();this._opts=defaults();this._rollOpen=false;this.render();}
 async _request(request){
  if(this._busy||!this.actor.isOwner)return;
  this._busy=true;
  try{
   const response=await requestRoll(this.actor,request);
   if(request.action==='transform'){this._draft=draft();this._opts={...defaults(),de:this._opts.de};}
   if(request.action==="start"&&response?.started){
    this._draft=draft();
    this._opts=defaults();
    this._rollScroll=0;
    void showCodexDice(foundry.dice.Roll.fromData(response.roll));
   }
  }catch(e){ui.notifications.error("Codex: "+e.message);}
  finally{
   this._busy=false;
   this.render();
  }
 }
 static executeRoll(){
  if(this._pending||this._editing||(this._targetLost&&!game.user.targets.size&&!this._opts.runeShield))return;
  return this._request({
   action:"start",selection:this._draft,options:{...this._opts,contextApproved:true},
   sceneId:canvas.scene?.id,targetIds:this._opts.runeShield?[]:[...game.user.targets].map(token=>token.id)
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
 static lightHands(_event,target){
  if(!this.actor.isOwner||this._editing||this._pending||!canUseTechnique(this.actor.system,"maos-leves"))return;
  this._draft={base:{group:"practice",key:"armas_conjuracao"},second:{group:"practice",key:"furtividade"},complement:null};
  this._opts={...defaults(),de:this._opts.de,lightHands:true};
  this._openRollNear(target);return this.render();
 }
 static prepareAction(_event,target){return this._prepareCombat(target.dataset.kind,target);}
 static prepareEquipment(_event,target){
  const item=this.actor.items.get(target.dataset.id);
  return this._prepareCombat(item?.system.kind==="focus"?"spell":"attack",target,target.dataset.id);
 }
 async _prepareCombat(actionType,target,equipmentId=""){
  if(!this.actor.isOwner||!["attack","spell"].includes(actionType))return;
  if(this._editing){ui.notifications.warn('Conclua a edição antes de rolar.');return;}
  if(this._busy||this._pending||pendingRollFor(this.actor)){ui.notifications.warn('Finalize a rolagem pendente.');return;}
  try{
   const near=this._sheetPage==="play"?target:null;
   if(this._sheetPage!=="play")await this._selectSheetPage("play");
   this._draft=prepareCombatAction(this.actor,actionType,this._draft,equipmentId);
   this._opts={...defaults(),de:this._opts.de,actionType,mode:actionType==="spell"?"conjuracao":"armas",equipmentId};
   if(actionType==="spell"){
    const item=this.actor.items.get(equipmentId);
    this._opts.element=item?focusElement(item):availableElements(this.actor.system)[0]?.[0]??"";
    this._opts.focusId=equipmentId;
    this._opts.equipmentId="";
   }
   this._openRollNear(near);
   await this.render();
   if(!this._rollMedia.matches)this.element?.querySelector(".codex-roll-prep")?.scrollIntoView({block:"start"});
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
  if(!item||!this.actor.isOwner)return;
  return this._request({action:"equipment",itemId:item.id,path:"equipped",value:!item.system.equipped});
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
  await (this._embeddedDNA??await this._embeddingDNA?.catch(()=>null))?.close();
  this._embeddedDNA=null;
  this._sheetPage="play";
  this._inventoryPage="bag";
  this._resource=null;
  this._scrollPositions.clear();
  this._draft=draft();
  this._opts=defaults();
  this._editing=false;
  this._lastTargetId=null;
  this._targetLost=false;
  this._rollMedia?.removeEventListener("change",this._rollMediaChanged);
  window.removeEventListener("keydown",this._rollEscape,{capture:true});
  window.removeEventListener("resize",this._rollResize);
  this._rollMedia=null;
  this._rollOpen=false;
  this._rollAnchor=null;
  this._rollPosition=null;
  for(const [event,id] of this._targetHooks??[])Hooks.off(event,id);
  this._targetHooks=null;
  return super.close(options);
 }
}
