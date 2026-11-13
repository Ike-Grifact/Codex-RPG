/* Codex RPG — ficha e criação de Actor para Foundry v14. Protótipo não validado no cliente. */
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,SITUATIONS,XP_ATTRIBUTE,XP_TRAINING,
 sourceDice,sourceLabel,buildPool,resolveRoll,compareKeptOptions,starterPurchasePlan,lifeMax,naturalDE,balance,maxPP,keepLimit,
 loadCapacity,mayComplement,affinity,xpLedger,monsterCap} from "./rules.mjs";
import {rollPool,escapeHTML} from "./roll-engine.mjs";
import {dieSvg} from "./dice-icons.mjs";
import {equippedDie,skillPrerequisite,canSpendXP,defenseDE} from "./equipment-logic.mjs";
import {G1_CATALOG} from "./catalog.mjs";
const NS="codex-rpg-foundry";
const draft=()=>({base:null,attribute:null,complement:null});
const defaults=()=>({mode:"normal",de:1,situation:"neutral",extraKeep:false,step:false,contextApproved:false,
 weightEnabled:false,attackWeight:"leve",targetWeight:"medio",combatBonus:false,
 cancelP:0,convertPairs:0,equipmentId:"",characteristic:"",secondCharacteristic:"",activationPayment:"courage"});
const eq=(x,y)=>!!x&&x.group===y.group&&x.key===y.key;
function cards(list,group,s,d){
 return list.map(([key,label])=>({key,group,label:sourceLabel(group,key,s),
 grade:Number(s[{attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group]]?.[key]||0),
 dice:sourceDice(group,key,s).map(sides=>({sides,icon:dieSvg(sides)})),
 isBase:eq(d.base,{group,key}),isAttribute:eq(d.attribute,{group,key}),isComplement:eq(d.complement,{group,key})}));
}
const markerText=v=>(v[0]?v[0]+"ᛋ ":"")+(v[1]?v[1]+"ᚨ ":"")+(v[2]?v[2]+"ᚦ":"")||"Vazio";
const markerHTML=v=>[["e","ᛋ",v[0]],["a","ᚨ",v[1]],["p","ᚦ",v[2]]].filter(x=>x[2]>0)
 .map(x=>'<b class="codex-rune codex-rune-'+x[0]+'">'+x[2]+x[1]+'</b>').join(" ")||"Vazio";
const isCrit=(dice,selected)=>{const k=dice.filter(d=>selected.includes(d.id));return k.length>=2&&k.every(d=>d.face===d.sides);};
const situate=(opts)=>opts.weightEnabled?affinity(opts.attackWeight,opts.targetWeight):0;
const carriedItems=actor=>actor.items.filter(i=>i.type==="equipment")
 .reduce((n,i)=>n+(Number(i.system.weight)||0)*Math.max(1,Number(i.system.quantity)||1),0);
const carryClasses=(capacity,used)=>Object.fromEntries([["leve",.125],["medio",.5],["pesado",1]]
 .map(([k,w])=>[k,Math.floor((Math.max(0,capacity-used)+1e-9)/w)]));
const bonusP=(dice,selected,opts)=>opts.noisy?(isCrit(dice,selected)?2:1):0;
function selectedItem(actor,opts){return actor.items.get(opts.equipmentId)||null;}
function modeFor(s,b){return b?.key==="armas_conjuracao"?((s.skills||[]).includes("criar-item-foco-magia")?"conjuracao":"armas"):"normal";}
export class CodexCharacterSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2){
 static DEFAULT_OPTIONS={classes:["codex-rpg","codex-character-sheet"],position:{width:1120,height:820},
 window:{resizable:true},actions:{
 chooseSource:CodexCharacterSheet.chooseSource,adjustGrade:CodexCharacterSheet.adjustGrade,
 adjustResource:CodexCharacterSheet.adjustResource,toggleSkill:CodexCharacterSheet.toggleSkill,
 clearDraft:CodexCharacterSheet.clearDraft,executeRoll:CodexCharacterSheet.executeRoll,
 toggleKept:CodexCharacterSheet.toggleKept,applyComparison:CodexCharacterSheet.applyComparison,
 purchaseStarter:CodexCharacterSheet.purchaseStarter,finalizeRoll:CodexCharacterSheet.finalizeRoll,
 addEquipment:CodexCharacterSheet.addEquipment,openEquipment:CodexCharacterSheet.openEquipment,
 toggleEquip:CodexCharacterSheet.toggleEquip,adjustIntegrity:CodexCharacterSheet.adjustIntegrity,
 removeEquipment:CodexCharacterSheet.removeEquipment,addCatalogEquipment:CodexCharacterSheet.addCatalogEquipment,
 editPortrait:CodexCharacterSheet.editPortrait,adjustPavor:CodexCharacterSheet.adjustPavor
 }};
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/character-sheet.hbs"}};
 constructor(options={}){super(options);this._draft=draft();this._opts=defaults();this._pending=null;this._busy=false;}
 async _prepareContext(options){
  const ctx=await super._prepareContext(options),actor=this.actor,s=actor.system,d=this._draft,monster=actor.type==="creature",ledger=xpLedger(s),
   used=carriedItems(actor),carryMax=loadCapacity(s),
   hasFirstAttribute=ATTRIBUTES.some(([key])=>Number(s.attributes?.[key]||0)>=1),
   hasTraining=[...KNOWLEDGES.map(([k])=>s.knowledges?.[k]),...PRACTICES.map(([k])=>s.practices?.[k])].some(n=>Number(n||0)>=1);
  this._pending=actor.getFlag(NS,"pendingRoll")||null;
  ctx.codex={
   actorName:actor.name,portrait:actor.img,
   identityOpen:this.element?.querySelector(".codex-identity-details")?.open,
   progressOpen:this.element?.querySelector(".codex-creation-panel")?.open ?? (!monster&&!(hasFirstAttribute&&hasTraining)),
   actorTypeLabel:{character:"Personagem",humanoid:"Oponente humanoide",creature:"Monstro extraordinário"}[actor.type],
   concept:s.concept,origin:s.origin,virtue:s.virtue,personality:s.personality,
   level:s.level,life:s.life.value,lifeMax:lifeMax(s),medical:s.life.medical,
   courage:s.courage,pp:s.pp,ppMax:maxPP(s.level),de:monster?defenseDE(actor):defenseDE(actor),
   balance:balance(s),capacity:carryMax,loadUsed:used,loadFree:Math.max(0,carryMax-used),
    carryClasses:carryClasses(carryMax,used),overloaded:used>carryMax+1e-9,
    xp:s.xp,xpLedger:ledger,hasCreationMinimum:hasFirstAttribute&&hasTraining,
    starterAttributes:ATTRIBUTES.map(([id,name])=>({id,name})),
    starterTraining:[
     ...KNOWLEDGES.map(([id,name])=>({value:"knowledge:"+id,name:"Conhecimento · "+name})),
     ...PRACTICES.map(([id,name])=>({value:"practice:"+id,name:"Prática · "+name}))
    ],
   isMonster:monster,isHumanoid:actor.type==="humanoid",
   threatGrade:s.threatGrade,pavorLocal:s.pavorLocal,pavorCap:monsterCap(s.threatGrade),
   catalog:G1_CATALOG.map((row,i)=>({id:String(i),name:row.name})),
   attributes:cards(ATTRIBUTES,"attribute",s,d),
   knowledges:monster?[]:cards(KNOWLEDGES,"knowledge",s,d),
   practices:monster?[]:cards(PRACTICES,"practice",s,d),
   skills:monster?[]:SKILLS.map(k=>({...k,detail:k.detail.slice(0,190),owned:s.skills.includes(k.id)})),
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
   const plan=buildPool(s,d,{mode:this._opts.mode,contextApproved:this._opts.contextApproved,step:this._opts.step,equipmentDie:die});
   if(item&&!die){plan.errors.push("Item sem Perícia pertinente, não equipado ou elemento não habilitado.");plan.ok=false;}
   const isShared=d.base.group==="practice"&&d.base.key==="armas_conjuracao",targets=[...game.user.targets];
   ctx.codex.prepare={
    isShared,mode:this._opts.mode,modeArmas:this._opts.mode==="armas",modeConjuracao:this._opts.mode==="conjuracao",
    contextApproved:this._opts.contextApproved,de:this._opts.de,
    situations:Object.entries(SITUATIONS).map(([id,x])=>({id,label:x.label,selected:this._opts.situation===id})),
    weightEnabled:this._opts.weightEnabled,attackWeight:this._opts.attackWeight,targetWeight:this._opts.targetWeight,
    attackWeightLeve:this._opts.attackWeight==="leve",attackWeightMedio:this._opts.attackWeight==="medio",attackWeightPesado:this._opts.attackWeight==="pesado",
    targetWeightLeve:this._opts.targetWeight==="leve",targetWeightMedio:this._opts.targetWeight==="medio",targetWeightPesado:this._opts.targetWeight==="pesado",
    extraKeep:this._opts.extraKeep,extraZero:Number(this._opts.extraKeep)===0,extraOne:Number(this._opts.extraKeep)===1,extraTwo:Number(this._opts.extraKeep)===2,
    step:this._opts.step,combatBonus:false,hasCombatSkill:false,
    equipmentOptions:actor.items.filter(i=>i.type==="equipment"&&i.system.equipped&&["weapon","firearm","focus"].includes(i.system.kind))
      .map(i=>({id:i.id,name:i.name,selected:i.id===this._opts.equipmentId})),
    targetName:targets.length===1?targets[0].actor?.name:"",hasTarget:targets.length===1,inCombat:!!game.combat?.started,
    canExecute:plan.ok&&actor.isOwner,errors:plan.errors,
    pool:plan.pool.map(x=>({sides:x.sides,label:sourceLabel(x.group,x.key,s),icon:dieSvg(x.sides)})),
    poolCount:plan.pool.length,keepNatural:keepLimit(monster?s.threatGrade:s.level,false,monster),
    keepWithCourage:keepLimit(monster?s.threatGrade:s.level,true,monster)
   };
  }
  if(this._pending){
   const p=this._pending,item=selectedItem(actor,p.options);
   let summary=null;
   if(p.selected.length)try{
    summary=resolveRoll(p.dice,p.selected,{...p.options,courage:s.courage,monster,
     threatGrade:s.threatGrade,weight:situate(p.options),bonusP:bonusP(p.dice,p.selected,p.options),hostile:actor.type==="humanoid"});
   }catch(e){summary={ok:false,errors:[e.message]};}
   ctx.codex.comparisons=compareKeptOptions(p.dice,{...p.options,level:s.level,monster,threatGrade:s.threatGrade,
     courage:s.courage,weight:situate(p.options),hostile:actor.type==="humanoid"},4)
     .map((x,i)=>({...x,position:i+1,keptDice:x.ids.map(id=>p.dice.find(d=>d.id===id))
      .filter(Boolean).map(d=>({sides:d.sides,face:d.face,icon:dieSvg(d.sides)}))}));
   ctx.codex.pending={
    dice:p.dice.map(x=>({...x,icon:dieSvg(x.sides),label:sourceLabel(x.group,x.key,s),
      selected:p.selected.includes(x.id),symbolsText:markerText(x.symbols),symbolsHTML:markerHTML(x.symbols)})),
    selectedCount:p.selected.length,canFinalize:summary?.ok&&actor.isOwner,summary,errors:summary?.errors||[],
    de:p.options.de,formula:p.formula,targetName:p.options.targetName||"",hasTarget:!!p.options.targetActorUuid,
    critical:summary?.critical||0,
    properties:(item?.system.properties||[]).map(name=>({name,selected:p.options.characteristic===name,selectedSecond:p.options.secondCharacteristic===name})),
    hasProperties:!!item?.system.properties?.length,paymentPP:p.options.activationPayment==="pp",paymentCourage:p.options.activationPayment!=="pp",
    limit:keepLimit(monster?s.threatGrade:s.level,p.options.extraKeep,monster),extraKeep:p.options.extraKeep,
    cancelP:p.options.cancelP,convertPairs:p.options.convertPairs,
    rawP:summary?.raw?.p||0,rawA:summary?.raw?.a||0,
    cost:Number(p.options.extraKeep)+Number(p.options.step)+(monster&&game.combat?.started?1:0)
   };
  }
  return ctx;
 }
 async _onRender(ctx,options){await super._onRender(ctx,options);this.element?.querySelector(".codex-foundry-root")?.addEventListener("change",e=>this._change(e));}
 async _change(event){
  const el=event.target;
  if(el.dataset.field){
   if(!this.actor.isOwner)return;
   const fields=["name","system.concept","system.origin","system.virtue","system.personality","system.level","system.xp","system.threatGrade"];
   if(!fields.includes(el.dataset.field))return;
   let value=el.value;
   if(el.dataset.field==="system.level")value=Math.max(1,Math.min(20,Math.floor(Number(value)||1)));
   if(el.dataset.field==="system.xp")value=Math.max(0,Math.floor(Number(value)||0));
   if(el.dataset.field==="system.threatGrade")value=Math.max(1,Math.min(6,Math.floor(Number(value)||1)));
   await this.actor.update({[el.dataset.field]:value});return;
  }
  if(el.dataset.rollOption){
   const key=el.dataset.rollOption;if(!Object.hasOwn(this._opts,key))return;
   this._opts[key]=el.type==="checkbox"?el.checked:el.type==="number"?Number(el.value):key==="extraKeep"?Number(el.value):el.value;
   if(key==="de")this._opts.de=Math.max(0,Math.min(30,Number(this._opts.de)||0));
   if(key==="mode"){this._draft.complement=null;this._opts.contextApproved=false;this._opts.equipmentId="";}
   this.render();return;
  }
  if(el.dataset.pendingOption&&this._pending){
   const key=el.dataset.pendingOption;
   if(!["cancelP","convertPairs","characteristic","secondCharacteristic","activationPayment"].includes(key))return;
   this._pending.options[key]=["cancelP","convertPairs"].includes(key)?Math.max(0,Math.floor(Number(el.value)||0)):String(el.value);
   await this.actor.setFlag(NS,"pendingRoll",this._pending);this.render();
  }
 }
 static async purchaseStarter(){
  if(!this.actor.isOwner||this._pending||this.actor.system.monsterRules)return;
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
  if(s.monsterRules){
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
   const scale=group==="attribute"&&!this.actor.system.monsterRules?XP_ATTRIBUTE:XP_TRAINING;
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
  if(!this.actor.isOwner||this._pending||this.actor.system.monsterRules)return;
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
 static async executeRoll(){
  if(this._busy||this._pending||!this.actor.isOwner)return;
  this._busy=true;
  try{
   const s=this.actor.system,opts={...this._opts},item=selectedItem(this.actor,opts),die=item?equippedDie(this.actor,item,opts.mode):0;
   if(item&&!die)throw Error("Equipamento não habilitado por Perícia/elemento.");
   const cost=Number(opts.extraKeep)+Number(opts.step)+(this.actor.type!=="character"&&game.combat?.started?1:0);
   if((this.actor.type!=="character"?s.pavorLocal:s.courage)<cost)throw Error(this.actor.type!=="character"?"Pavor local insuficiente.":"Coragem insuficiente.");
   const targets=[...game.user.targets];if(targets.length>1)throw Error("Selecione no máximo um alvo.");
   if(game.combat?.started&&targets.length&&targets[0].actor){
    const target=targets[0].actor;opts.targetActorUuid=target.uuid;opts.targetName=target.name;opts.targetType=target.type;
    opts.de=defenseDE(target);
   }
   opts.noisy=!!item?.system.properties?.includes("Barulhenta");
   const plan=buildPool(s,this._draft,{mode:opts.mode,contextApproved:opts.contextApproved,step:opts.step,equipmentDie:die});
   if(!plan.ok)throw Error(plan.errors.join(" "));
   const result=await rollPool(plan.pool),pending={version:2,id:crypto.randomUUID(),created:Date.now(),
    base:this._draft.base,attribute:this._draft.attribute,complement:this._draft.complement,
    formula:result.formula,dice:result.dice,selected:[],options:opts};
   await this.actor.setFlag(NS,"pendingRoll",pending);
   this._pending=pending;this._draft=draft();this._opts=defaults();this.render();
  }catch(e){ui.notifications.error("Codex: "+e.message);}
  finally{this._busy=false;}
 }
 static async toggleKept(event,target){
  if(!this.actor.isOwner||!this._pending||this._busy)return;
  const id=target.dataset.id,p=this._pending,s=this.actor.system;
  if(!p.dice.some(x=>x.id===id))return;
  const chosen=new Set(p.selected);
  if(chosen.has(id))chosen.delete(id);
  else{
   if(chosen.size>=keepLimit(s.monsterRules?s.threatGrade:s.level,p.options.extraKeep,s.monsterRules)){ui.notifications.warn("Limite de retenção.");return;}
   chosen.add(id);
  }
  p.selected=[...chosen];p.options.cancelP=0;p.options.convertPairs=0;
  await this.actor.setFlag(NS,"pendingRoll",p);this.render();
 }
 static async applyComparison(event,target){
  if(!this.actor.isOwner||this._busy||!this._pending)return;
  const p=this._pending,index=Number(target.dataset.index);
  if(!Number.isInteger(index)||index<0||index>=4)return;
  const s=this.actor.system,monster=!!s.monsterRules;
  const options=compareKeptOptions(p.dice,{...p.options,level:s.level,monster,
    threatGrade:s.threatGrade,courage:s.courage,weight:situate(p.options),
    hostile:this.actor.type==="humanoid"},4);
  const chosen=options[index];if(!chosen)return;
  p.selected=[...chosen.ids];
  p.options.cancelP=0;p.options.convertPairs=0;
  // Seleção da mesma rolagem, sem lançar novamente nem descontar recursos.
  await this.actor.setFlag(NS,"pendingRoll",p);this.render();
 }
 static async finalizeRoll(){
  if(this._busy||!this._pending||!this.actor.isOwner)return;
  this._busy=true;
  try{
   const p=this._pending,s=this.actor.system,item=selectedItem(this.actor,p.options);
   const result=resolveRoll(p.dice,p.selected,{...p.options,courage:s.courage,monster:s.monsterRules,threatGrade:s.threatGrade,
    weight:situate(p.options),bonusP:bonusP(p.dice,p.selected,p.options),hostile:this.actor.type==="humanoid"});
   if(!result.ok)throw Error(result.errors.join(" "));
   let cost=Number(p.options.extraKeep)+Number(p.options.step)+(this.actor.type!=="character"&&game.combat?.started?1:0),payPP=0;
   const available=item?.system.properties||[],first=p.options.characteristic||"",second=p.options.secondCharacteristic||"",active=[];
   if(result.success&&first){
    if(!available.includes(first))throw Error("Característica não pertence à arma.");
    active.push(first);
    if(second){
     if(!result.critical||!available.includes(second)||first===second)throw Error("Segunda característica exige crítico e opção distinta.");
     active.push(second);
    }
    const activations=result.critical?(second?1:0):1;
    if(activations){
     if(this.actor.type!=="character")throw Error("Custo de característica paga por adversários ainda PENDENTE; execute a característica manualmente.");
     if(p.options.activationPayment==="pp")payPP=1;
     else cost+=2;
    }
   }
   if(payPP>s.pp)throw Error("PP insuficiente.");
   if(cost>(this.actor.type!=="character"?s.pavorLocal:s.courage))throw Error("Recurso insuficiente após ativação.");
   const kept=p.dice.filter(x=>p.selected.includes(x.id));
   const detail=kept.map(x=>'<li><span class="codex-chat-die">'+dieSvg(x.sides)+'d'+x.sides+': face '+x.face+' → '+escapeHTML(markerText(x.symbols))+'</span></li>').join("");
   const mode=p.options.mode==="conjuracao"?"Conjuração":p.options.mode==="armas"?"Armas":sourceLabel(p.base.group,p.base.key,s);
   const text='<div class="codex-chat-result"><h3>Codex RPG · '+escapeHTML(mode)+' · '+escapeHTML(result.outcome)+'</h3>'+
    '<p><strong>Composição:</strong> '+escapeHTML(sourceLabel(p.base.group,p.base.key,s))+' + '+escapeHTML(sourceLabel(p.attribute.group,p.attribute.key,s))+'</p>'+
    (item?'<p><strong>Equipamento:</strong> '+escapeHTML(item.name)+'</p>':'')+
    (p.options.targetName?'<p><strong>Alvo:</strong> '+escapeHTML(p.options.targetName)+'</p>':'')+
    '<p><strong>DE:</strong> '+result.reached+' / '+result.de+'</p>'+
    '<p>ᛋ '+result.e+' · ᚨ '+result.aRemaining+' · ᚦ '+result.p+'</p>'+
    (result.critical?'<p><strong>CRÍTICO:</strong> '+result.critical+' dados mantidos na face máxima (automático).</p>':'')+
    (active.length?'<p><strong>Características escolhidas:</strong> '+active.map(escapeHTML).join(" + ")+'</p>':'')+
    '<p><strong>Dano básico:</strong> '+result.damage+' (proteção e aplicação de condições: adjudicação)</p>'+
    '<p><small>Custo bruto '+cost+(this.actor.type!=='character'?' Pavor local':' Coragem')+', '+payPP+' PP. Crítico recupera recursos conforme os tetos.</small></p><ul>'+detail+'</ul></div>';
   if(this.actor.type!=="character")await this.actor.update({"system.pavorLocal":s.pavorLocal-cost});
   else await this.actor.update({"system.courage":Math.min(10,s.courage-cost+result.criticalRefundCourage),
    "system.pp":Math.min(maxPP(s.level),s.pp-payPP+result.criticalRefundPP)});
   await ChatMessage.create({user:game.user.id,speaker:ChatMessage.getSpeaker({actor:this.actor}),content:text,
    flags:{[NS]:{rollId:p.id,result:{...result,selected:undefined},dice:p.dice,kept:p.selected,
     transfer:game.combat?.started&&(p.options.targetActorUuid||result.monsterCriticalPavor)?{
      actorId:this.actor.id,targetUuid:p.options.targetActorUuid,targetType:p.options.targetType,
      p:result.p,monsterCriticalPavor:result.monsterCriticalPavor
     }:null}}});
   await this.actor.unsetFlag(NS,"pendingRoll");this._pending=null;this.render();
  }catch(e){ui.notifications.error("Codex: "+e.message);}
  finally{this._busy=false;}
 }
 static async addEquipment(){
  if(!this.actor.isOwner)return;
  await this.actor.createEmbeddedDocuments("Item",[{name:"Novo Equipamento",type:"equipment",system:{kind:"weapon",category:"leve",grade:1}}]);
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
