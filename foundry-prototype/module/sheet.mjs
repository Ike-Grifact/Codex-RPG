/* Codex RPG — ficha e criação de Actor para Foundry v14. Protótipo não validado no cliente. */
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,SITUATIONS,XP_ATTRIBUTE,XP_TRAINING,
 sourceDice,sourceLabel,buildPool,starterPurchasePlan,lifeMax,balance,maxPP,
 loadCapacity,mayComplement,xpLedger,monsterCap} from "./rules.mjs";
import {requestRoll} from "./roll-workflow.mjs";
import {keepForActor,rollResult,alternativesFor,usesLocal} from "./roll-resolution.mjs";
import {dieSvg} from "./dice-icons.mjs";
import {equippedDie,skillPrerequisite,canSpendXP,defenseDE,defenseDisplay} from "./equipment-logic.mjs";
import {actorKinds} from "./creation.mjs";
import {createCodexItem} from "./creation-ui.mjs";
import {showCodexDice} from "./dice-so-nice.mjs";
import {G1_CATALOG} from "./catalog.mjs";
const NS="codex-rpg-foundry";
const draft=()=>({base:null,attribute:null,complement:null});
const defaults=()=>({mode:"normal",de:1,situation:"neutral",extraKeep:false,targetDodges:false,activationPavor:1,step:false,stepDieId:"",contextApproved:false,
 weightEnabled:false,attackWeight:"leve",targetWeight:"medio",combatBonus:false,
 cancelP:0,convertPairs:0,equipmentId:"",characteristic:"",secondCharacteristic:"",activationPayment:"courage"});
const eq=(x,y)=>!!x&&x.group===y.group&&x.key===y.key;
function cards(list,group,s,d){
 return list.map(([key,label])=>({key,group,label:sourceLabel(group,key,s),
 grade:Number(s[{attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group]]?.[key]||0),
 dice:sourceDice(group,key,s).map(sides=>({sides,icon:dieSvg(sides)})),
 isSelected:[d.base,d.attribute,d.complement].some(source=>eq(source,{group,key})),
 isBase:eq(d.base,{group,key}),isAttribute:eq(d.attribute,{group,key}),isComplement:eq(d.complement,{group,key})}));
}
const markerText=v=>(v[0]?v[0]+"ᛋ ":"")+(v[1]?v[1]+"ᚨ ":"")+(v[2]?v[2]+"ᚦ":"")||"Vazio";
const markerHTML = symbols => [["e","ᛋ"],["a","ᚨ"],["p","ᚦ"]]
 .map(([kind,rune],i)=>symbols[i]?`<b class="codex-rune codex-rune-${kind}">${rune.repeat(symbols[i])}</b>`:"").join("") || "Vazio";
const carriedItems=actor=>actor.items.filter(i=>i.type==="equipment")
 .reduce((n,i)=>n+(Number(i.system.weight)||0)*Math.max(1,Number(i.system.quantity)||1),0);
const carryClasses=(capacity,used)=>Object.fromEntries([["leve",.125],["medio",.5],["pesado",1]]
 .map(([k,w])=>[k,Math.floor((Math.max(0,capacity-used)+1e-9)/w)]));
function selectedItem(actor,opts){return actor.items.get(opts.equipmentId)||null;}
function modeFor(s,b){return b?.key==="armas_conjuracao"?((s.skills||[]).includes("criar-item-foco-magia")?"conjuracao":"armas"):"normal";}
export class CodexCharacterSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2){
 static DEFAULT_OPTIONS={classes:["codex-rpg","codex-character-sheet"],position:{width:1120,height:820},
 window:{resizable:true},actions:{
 chooseSource:CodexCharacterSheet.chooseSource,adjustGrade:CodexCharacterSheet.adjustGrade,
 adjustResource:CodexCharacterSheet.adjustResource,toggleSkill:CodexCharacterSheet.toggleSkill,
 clearDraft:CodexCharacterSheet.clearDraft,executeRoll:CodexCharacterSheet.executeRoll,
 toggleKept:CodexCharacterSheet.toggleKept,discardRoll:CodexCharacterSheet.discardRoll,applyComparison:CodexCharacterSheet.applyComparison,
 purchaseStarter:CodexCharacterSheet.purchaseStarter,finalizeRoll:CodexCharacterSheet.finalizeRoll,
 addEquipment:CodexCharacterSheet.addEquipment,openEquipment:CodexCharacterSheet.openEquipment,
 toggleEquip:CodexCharacterSheet.toggleEquip,adjustIntegrity:CodexCharacterSheet.adjustIntegrity,
 removeEquipment:CodexCharacterSheet.removeEquipment,addCatalogEquipment:CodexCharacterSheet.addCatalogEquipment,
 editPortrait:CodexCharacterSheet.editPortrait,adjustPavor:CodexCharacterSheet.adjustPavor
 }};
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/character-sheet.hbs"}};
 constructor(options={}){super(options);this._draft=draft();this._opts=defaults();this._pending=null;this._busy=false;}
 async _prepareContext(options){
  const ctx=await super._prepareContext(options),actor=this.actor,s=actor.system,d=this._draft,monster=!!s.monsterRules,animal=!!s.animalRules,attributesOnly=monster||animal,ledger=xpLedger(s),
   used=carriedItems(actor),carryMax=loadCapacity(s),
   hasFirstAttribute=ATTRIBUTES.some(([key])=>Number(s.attributes?.[key]||0)>=1),
   hasTraining=[...KNOWLEDGES.map(([k])=>s.knowledges?.[k]),...PRACTICES.map(([k])=>s.practices?.[k])].some(n=>Number(n||0)>=1);
  this._pending=actor.getFlag(NS,"pendingRoll")||null;
  const defense=defenseDisplay(actor);
  const wornArmor=actor.items.find(i=>i.type==="equipment"&&i.system?.kind==="armor"&&i.system?.equipped);
  const armorSys=wornArmor?.system,armorMax=Math.max(0,Number(armorSys?.integrity?.max)||0);
  const armorCurrent=Math.min(armorMax,Math.max(0,Number(armorSys?.integrity?.value)||0));
  const armorCard=wornArmor?{
   id:wornArmor.id,name:wornArmor.name,integrity:armorCurrent,maximum:armorMax,
   noIntegrity:armorSys.category==="muito-leve",hasMaximum:armorMax>0,
   percent:armorMax?Math.round(100*armorCurrent/armorMax):0
  }:null;
  ctx.codex={
   actorName:actor.name,portrait:actor.img,
   identityOpen:this.element?.querySelector(".codex-identity-details")?.open,
   progressOpen:this.element?.querySelector(".codex-creation-panel")?.open ?? (!attributesOnly&&!s.monsterHumanoidRules&&!(hasFirstAttribute&&hasTraining)),
   actorTypeLabel:actorKinds[actor.type],
   concept:s.concept,origin:s.origin,virtue:s.virtue,personality:s.personality,
   notes:s.notes,abilities:s.abilities,leader:s.leader,isHostile:actor.type!=="character",
   level:s.level,life:s.life.value,lifeMax:lifeMax(s),medical:s.life.medical,
   courage:s.courage,pp:s.pp,ppMax:maxPP(s.level),de:defense.de,deCalculation:defense.calculation,deCondition:defense.condition,armorCard,
   balance:balance(s),capacity:carryMax,loadUsed:used,loadFree:Math.max(0,carryMax-used),
    carryClasses:carryClasses(carryMax,used),overloaded:used>carryMax+1e-9,
    xp:s.xp,xpLedger:ledger,hasCreationMinimum:s.monsterHumanoidRules||(hasFirstAttribute&&hasTraining),
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
   skills:attributesOnly?[]:SKILLS.map(k=>({...k,detail:k.detail.slice(0,190),owned:s.skills.includes(k.id)})),
   gear:actor.items.filter(i=>i.type==="equipment").map(i=>({
    id:i.id,name:i.name,kind:i.system.kind,grade:i.system.grade,weight:i.system.weight,
    quantity:i.system.quantity,equipped:i.system.equipped,
    integrity:i.system.integrity.value,integrityMax:i.system.integrity.max,die:i.system.die,dieIcon:dieSvg(i.system.die),priceVT:i.system.priceVT
   })),
   selectedBase:d.base?sourceLabel(d.base.group,d.base.key,s):"",
   selectedAttribute:d.attribute?sourceLabel(d.attribute.group,d.attribute.key,s):"",
   selectedComplement:d.complement?sourceLabel(d.complement.group,d.complement.key,s):"",
   selecting:!!d.base&&!d.attribute,preparing:!!d.base&&!!d.attribute&&!this._pending,
   hasPending:!!this._pending,isOwner:actor.isOwner,canKeep:!this._busy
  };
  if(ctx.codex.preparing){
   const item=selectedItem(actor,this._opts),die=item?equippedDie(actor,item,this._opts.mode):0;
   const rawPlan=buildPool(s,d,{mode:this._opts.mode,contextApproved:this._opts.contextApproved,equipmentDie:die});
    const plan=buildPool(s,d,{mode:this._opts.mode,contextApproved:this._opts.contextApproved,
     step:this._opts.step,stepDieId:this._opts.stepDieId,equipmentDie:die});
   if(item&&!die){plan.errors.push("Item sem Perícia pertinente, não equipado ou elemento não habilitado.");plan.ok=false;}
   const isShared=d.base.group==="practice"&&d.base.key==="armas_conjuracao",targets=[...game.user.targets];
   ctx.codex.prepare={
    isShared,mode:this._opts.mode,modeArmas:this._opts.mode==="armas",modeConjuracao:this._opts.mode==="conjuracao",
    contextApproved:this._opts.contextApproved,targetDodges:this._opts.targetDodges,de:this._opts.de,
    localCostOptions:[1,2,3].map(cost=>({cost,selected:Number(this._opts.activationPavor)===cost})),
    situations:Object.entries(SITUATIONS).map(([id,x])=>({id,label:x.label,selected:this._opts.situation===id})),
    weightEnabled:this._opts.weightEnabled,attackWeight:this._opts.attackWeight,targetWeight:this._opts.targetWeight,
    attackWeightLeve:this._opts.attackWeight==="leve",attackWeightMedio:this._opts.attackWeight==="medio",attackWeightPesado:this._opts.attackWeight==="pesado",
    targetWeightLeve:this._opts.targetWeight==="leve",targetWeightMedio:this._opts.targetWeight==="medio",targetWeightPesado:this._opts.targetWeight==="pesado",
    extraKeep:this._opts.extraKeep,extraZero:Number(this._opts.extraKeep)===0,extraOne:Number(this._opts.extraKeep)===1,extraTwo:Number(this._opts.extraKeep)===2,
    step:this._opts.step,combatBonus:false,hasCombatSkill:false,
     stepOptions:rawPlan.pool.filter(x=>[4,6,10].includes(x.sides))
      .map(x=>({id:x.id,label:sourceLabel(x.group,x.key,s)+" · dado "+(Number(x.id.split(".").at(-1))+1)+" · d"+x.sides,
       selected:x.id===this._opts.stepDieId})),
    equipmentOptions:actor.items.filter(i=>i.type==="equipment"&&i.system.equipped&&["weapon","firearm","focus"].includes(i.system.kind))
      .map(i=>({id:i.id,name:i.name,selected:i.id===this._opts.equipmentId})),
    targetName:targets.length===1?targets[0].actor?.name:"",hasTarget:targets.length===1,inCombat:!!game.combat?.started,
    canExecute:plan.ok&&actor.isOwner,errors:plan.errors,
    pool:plan.pool.map(x=>({sides:x.sides,label:sourceLabel(x.group,x.key,s),icon:dieSvg(x.sides)})),
    poolCount:plan.pool.length,keepNatural:keepForActor(actor,0)
   };
  }
  if(this._pending){
   const p=this._pending,item=selectedItem(actor,p.options);
   let summary=null;
   if(p.selected.length&&!p.publication)try{
    summary=rollResult(actor,p);
   }catch(e){summary={ok:false,errors:[e.message]};}
   ctx.codex.comparisons=p.publication?[]:alternativesFor(actor,p)
     .map((x,i)=>({...x,position:i+1,keptDice:x.ids.map(id=>p.dice.find(d=>d.id===id))
      .filter(Boolean).map(d=>({sides:d.sides,face:d.face,icon:dieSvg(d.sides)}))}));
   ctx.codex.pending={
    dice:p.dice.map(x=>({...x,icon:dieSvg(x.sides),label:sourceLabel(x.group,x.key,s),
      selected:p.selected.includes(x.id),symbolsText:markerText(x.symbols),symbolsHTML:markerHTML(x.symbols)})),
    selectedCount:p.selected.length,canFinalize:!this._busy&&actor.isOwner&&(p.publication||summary?.ok),summary,errors:summary?.errors||[],
    publishing:!!p.publication,targetOptions:(p.options.combatId?game.combats.get(p.options.combatId):null)?.combatants.filter(c=>c.actor&&c.actor.uuid!==actor.uuid&&c.actor.uuid!==p.options.targetActorUuid).map(c=>({id:c.id,name:c.name,selected:p.options.passAllyId===c.id}))??[],
    de:p.options.de,formula:p.formula,targetName:p.options.targetName||"",hasTarget:!!p.options.targetActorUuid,
    critical:summary?.critical||0,
    properties:(item?.system.properties||[]).map(name=>({name,selected:p.options.characteristic===name,selectedSecond:p.options.secondCharacteristic===name})),
    hasProperties:!!item?.system.properties?.length,paymentPP:p.options.activationPayment==="pp",paymentCourage:p.options.activationPayment!=="pp",
    limit:keepForActor(actor,p.options.extraKeep),extraKeep:p.options.extraKeep,
    cancelP:p.options.cancelP,convertPairs:p.options.convertPairs,
    rawP:summary?.raw?.p||0,rawA:summary?.raw?.a||0,
    localCost:(p.options.activationCost??0)+(usesLocal(actor)?Math.max(0,p.selected.length-keepForActor(actor,0)):0),
    courageCost:Number(Boolean(p.options.step&&!p.options.stepPaid))+(usesLocal(actor)?0:Math.max(0,p.selected.length-keepForActor(actor,0)))
   };
  }
  return ctx;
 }
 async _onRender(ctx,options){await super._onRender(ctx,options);this.element?.querySelector(".codex-foundry-root")?.addEventListener("change",e=>this._change(e));}
 async _change(event){
  const el=event.target;
  if(el.dataset.field){
   if(!this.actor.isOwner)return;
   const fields=["name","system.concept","system.origin","system.virtue","system.personality","system.notes","system.abilities","system.leader","system.level","system.xp","system.threatGrade"];
   if(!fields.includes(el.dataset.field))return;
   let value=el.type==="checkbox"?el.checked:el.value;
   if(el.dataset.field==="system.level")value=Math.max(1,Math.min(20,Math.floor(Number(value)||1)));
   if(el.dataset.field==="system.xp")value=Math.max(0,Math.floor(Number(value)||0));
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
   if(key==="mode"){this._draft.complement=null;this._opts.contextApproved=false;this._opts.equipmentId="";this._opts.stepDieId="";}
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
  if(!this.actor.isOwner||this._pending||this.actor.system.monsterRules||this.actor.system.animalRules)return;
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
  await this.actor.update(plan.changes);
  ui.notifications.info("Compras iniciais aplicadas. Restam "+plan.remaining+" XP.");
 }
 static async chooseSource(event,target){
  if(this._busy||this._pending)return;
  const group=target.dataset.group,key=target.dataset.key,valid={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES}[group];
  if(!valid?.some(x=>x[0]===key))return;
  const s=this.actor.system,d=this._draft,candidate={group,key};
  if(s.monsterRules||s.animalRules){
   if(group!=="attribute")return;
   if(!d.base){this._draft={base:candidate,attribute:null,complement:null};this._opts=defaults();}
   else if(eq(d.base,candidate)){this._draft=draft();this._opts=defaults();}
   else if(!d.attribute)d.attribute=candidate;
   else if(mayComplement(s,d.base,"normal")){d.complement=eq(d.complement,candidate)?null:candidate;this._opts.contextApproved=false;}
   else {d.attribute=candidate;d.complement=null;}
   this.render();return;
  }
  if(group==="attribute"){
   if(!d.base){ui.notifications.info("Selecione a Prática ou Conhecimento de base.");return;}
   d.attribute=eq(d.attribute,candidate)?null:candidate;
   if(!d.attribute)d.complement=null;
  }else if(!d.base||!d.attribute){
   if(eq(d.base,candidate)){this._draft=draft();this._opts=defaults();}
   else {this._draft={base:candidate,attribute:null,complement:null};this._opts=defaults();this._opts.mode=modeFor(s,candidate);}
  }else if(eq(d.base,candidate)){this._draft=draft();this._opts=defaults();}
  else {
   if(!mayComplement(s,d.base,this._opts.mode)){ui.notifications.warn("Terceira fonte exige habilitação pertinente.");return;}
   d.complement=eq(d.complement,candidate)?null:candidate;this._opts.contextApproved=false;
  }
  this.render();
 }
 static async adjustGrade(event,target){
  if(!this.actor.isOwner||this._pending)return;
  const group=target.dataset.group,key=target.dataset.key,delta=Number(target.dataset.delta),valid={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES}[group];
  if(!valid?.some(x=>x[0]===key)||![-1,1].includes(delta))return;
  const field={attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group],current=Number(this.actor.system[field][key]||0),next=Math.min(6,Math.max(0,current+delta));
  if(next>current){
   const scale=group==="attribute"&&!this.actor.system.monsterRules&&!this.actor.system.monsterHumanoidRules?XP_ATTRIBUTE:XP_TRAINING;
   if(!canSpendXP(this.actor.system,scale[next]-scale[current])){ui.notifications.warn("XP disponível insuficiente.");return;}
  }
  await this.actor.update({["system."+field+"."+key]:next});
 }
 static async adjustResource(event,target){
  if(!this.actor.isOwner)return;
  const field=target.dataset.resource,delta=Number(target.dataset.delta),s=this.actor.system;
  const caps={"system.life.value":lifeMax(s),"system.courage":10,"system.pp":maxPP(s.level)};
  if(!(field in caps)||![-1,1].includes(delta))return;
  const current=field==="system.life.value"?s.life.value:field==="system.courage"?s.courage:s.pp;
  await this.actor.update({[field]:Math.max(0,Math.min(caps[field],current+delta))});
 }
 static async toggleSkill(event,target){
  if(!this.actor.isOwner||this._pending||this.actor.system.monsterRules||this.actor.system.animalRules)return;
  const id=target.dataset.key,entry=SKILLS.find(x=>x.id===id);if(!entry)return;
  const list=[...this.actor.system.skills],index=list.indexOf(id);
  if(index>=0)list.splice(index,1);
  else{
   if(!skillPrerequisite(this.actor.system,id)){ui.notifications.warn("Pré-requisito da Perícia não atendido.");return;}
   if(!canSpendXP(this.actor.system,entry.cost)){ui.notifications.warn("XP insuficiente.");return;}
   list.push(id);
  }
  await this.actor.update({"system.skills":list});
 }
 static clearDraft(){if(this._pending)return;this._draft=draft();this._opts=defaults();this.render();}
 async _request(request){
  if(this._busy||!this.actor.isOwner)return;
  this._busy=true;
  try{
   const response=await requestRoll(this.actor,request);
   if(request.action==="start"&&response?.started){
    this._draft=draft();
    this._opts=defaults();
    await showCodexDice(foundry.dice.Roll.fromData(response.roll));
   }
  }catch(e){ui.notifications.error("Codex: "+e.message);}
  finally{
   this._busy=false;
   this.render();
  }
 }
 static executeRoll(){
  if(this._pending)return;
  return this._request({
   action:"start",selection:this._draft,options:this._opts,
   sceneId:canvas.scene?.id,targetIds:[...game.user.targets].map(token=>token.id)
  });
 }
 static async discardRoll(){
  const pending=this._pending;
  if(!this.actor.isOwner||!pending||pending.publication||this._busy)return;
  const accepted=await foundry.applications.api.DialogV2.confirm({
   window:{title:"Descartar rolagem"},content:"As faces serão descartadas. A Coragem já paga por elevação permanece gasta.",rejectClose:false
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
  const chosen=alternativesFor(this.actor,p)[Number(target.dataset.index)];
  if(chosen)return this._request({action:"keep",id:p.id,ids:chosen.ids});
 }
 static finalizeRoll(){
  if(this._pending)return this._request({action:"finish",id:this._pending.id});
 }
 static async addEquipment(){
  return createCodexItem(this.actor);
 }
 static async addCatalogEquipment(){
  if(!this.actor.isOwner)return;
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
 static async openEquipment(event,target){this.actor.items.get(target.dataset.id)?.sheet.render({force:true});}
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
  if(item&&this.actor.isOwner&&confirm('Excluir "'+item.name+'"?'))await item.delete();
 }
 static async editPortrait(){
  if(!this.actor.isOwner)return;
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
 async close(options={}){this._draft=draft();this._opts=defaults();return super.close(options);}
}
