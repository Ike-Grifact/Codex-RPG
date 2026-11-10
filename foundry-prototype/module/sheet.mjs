/* Codex RPG — ficha de Personagem, Foundry VTT v14. */
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,SITUATIONS,sourceDice,sourceLabel,
  buildPool,resolveRoll,lifeMax,naturalDE,balance,maxPP,keepLimit,loadCapacity,mayComplement,affinity}
  from "./rules.mjs";
import {rollPool,dieSvg,escapeHTML} from "./roll-engine.mjs";
const NS="codex-rpg-foundry";
const emptyDraft=()=>({base:null,attribute:null,complement:null});
const emptyOptions=()=>({mode:"normal",contextApproved:false,de:1,situation:"neutral",
  weightEnabled:false,attackWeight:"leve",targetWeight:"medio",extraKeep:false,step:false,
  combatBonus:false,cancelP:0,convertPairs:0});
const sourceKey=(group,key)=>group+"."+key;
const eq=(a,b)=>!!a&&a.group===b?.group&&a.key===b?.key;
function cards(list,group,s,draft){
 return list.map(([key,label])=>({
  key,group,label:sourceLabel(group,key,s),grade:Number(s[{attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group]]?.[key]||0),
  dice:sourceDice(group,key,s).map(sides=>({sides,icon:dieSvg(sides)})),
  isBase:eq(draft.base,{group,key}),isAttribute:eq(draft.attribute,{group,key}),
  isComplement:eq(draft.complement,{group,key})
 }));
}
function initialMode(system,base){
 if(base?.group!=="practice"||base.key!=="armas_conjuracao")return"normal";
 if(system.skills.includes("armas1"))return"armas";
 if(system.skills.includes("aprendiz"))return"conjuracao";
 return"armas"; // A validação impedirá ativar sem Perícia.
}
function printableSymbols(s){
 return (s[0]?s[0]+"ᛋ ":"")+(s[1]?s[1]+"ᚨ ":"")+(s[2]?s[2]+"ᚦ":"")||"Vazio";
}
function coloredSymbols(s){
 return [["e","ᛋ",s[0]],["a","ᚨ",s[1]],["p","ᚦ",s[2]]]
  .filter(x=>x[2]>0).map(x=>'<b class="codex-rune codex-rune-'+x[0]+'">'+x[2]+x[1]+'</b>').join(" ")||"Vazio";
}
export class CodexCharacterSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2){
 static DEFAULT_OPTIONS={
  classes:["codex-rpg","codex-character-sheet"],
  position:{width:1120,height:820},
  window:{resizable:true},
  actions:{
   chooseSource:CodexCharacterSheet.chooseSource,
   adjustGrade:CodexCharacterSheet.adjustGrade,
   adjustResource:CodexCharacterSheet.adjustResource,
   toggleSkill:CodexCharacterSheet.toggleSkill,
   clearDraft:CodexCharacterSheet.clearDraft,
   executeRoll:CodexCharacterSheet.executeRoll,
   toggleKept:CodexCharacterSheet.toggleKept,
   finalizeRoll:CodexCharacterSheet.finalizeRoll,
   addEquipment:CodexCharacterSheet.addEquipment,
   openEquipment:CodexCharacterSheet.openEquipment,
   toggleEquip:CodexCharacterSheet.toggleEquip,
   adjustIntegrity:CodexCharacterSheet.adjustIntegrity,
   removeEquipment:CodexCharacterSheet.removeEquipment
  }
 };
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/character-sheet.hbs"}};
 constructor(options={}){
  super(options);
  this._draft=emptyDraft();
  this._opts=emptyOptions();
  this._pending=null;
  this._busy=false;
 }
 async _prepareContext(options){
  const ctx=await super._prepareContext(options);
  const actor=this.actor,s=actor.system,d=this._draft;
  this._pending=actor.getFlag(NS,"pendingRoll")||null;
  ctx.codex={
   actorName:actor.name,portrait:actor.img,logo:"systems/codex-rpg-foundry/assets/codex-logo.svg",
   concept:s.concept,origin:s.origin,virtue:s.virtue,personality:s.personality,
   level:s.level,life:s.life.value,lifeMax:lifeMax(s),medical:s.life.medical,
   courage:s.courage,pp:s.pp,ppMax:maxPP(s.level),de:naturalDE(s),
   balance:balance(s),capacity:loadCapacity(s),xp:s.xp,
   attributes:cards(ATTRIBUTES,"attribute",s,d),
   knowledges:cards(KNOWLEDGES,"knowledge",s,d),
   practices:cards(PRACTICES,"practice",s,d),
   skills:SKILLS.map(k=>({...k,owned:s.skills.includes(k.id)})),
   gear:actor.items.filter(i=>i.type==="equipment").map(i=>({
     id:i.id,name:i.name,kind:i.system.kind,grade:i.system.grade,weight:i.system.weight,
     quantity:i.system.quantity,equipped:i.system.equipped,
     integrity:i.system.integrity.value,integrityMax:i.system.integrity.max
   })),
   selectedBase:d.base?sourceLabel(d.base.group,d.base.key,s):"",
   selectedAttribute:d.attribute?sourceLabel(d.attribute.group,d.attribute.key,s):"",
   selectedComplement:d.complement?sourceLabel(d.complement.group,d.complement.key,s):"",
   selecting:!!d.base&&!d.attribute,
   preparing:!!d.base&&!!d.attribute&&!this._pending,
   hasPending:!!this._pending,
   isOwner:actor.isOwner,
   canKeep:!this._busy
  };
  if(ctx.codex.preparing){
    const isShared=d.base.group==="practice"&&d.base.key==="armas_conjuracao";
    const allowed=mayComplement(s,d.base,this._opts.mode);
    const plan=buildPool(s,d,{mode:this._opts.mode,contextApproved:this._opts.contextApproved,step:this._opts.step});
    ctx.codex.prepare={
      isShared,mode:this._opts.mode,modeArmas:this._opts.mode==="armas",modeConjuracao:this._opts.mode==="conjuracao",
      canComplement:allowed,contextApproved:this._opts.contextApproved,
      de:this._opts.de,situations:Object.entries(SITUATIONS).map(([id,v])=>({id,label:v.label,selected:id===this._opts.situation})),
      weightEnabled:this._opts.weightEnabled,attackWeight:this._opts.attackWeight,targetWeight:this._opts.targetWeight,
      attackWeightLeve:this._opts.attackWeight==="leve",attackWeightMedio:this._opts.attackWeight==="medio",attackWeightPesado:this._opts.attackWeight==="pesado",
      targetWeightLeve:this._opts.targetWeight==="leve",targetWeightMedio:this._opts.targetWeight==="medio",targetWeightPesado:this._opts.targetWeight==="pesado",
      extraKeep:this._opts.extraKeep,step:this._opts.step,combatBonus:this._opts.combatBonus,
      hasCombatSkill:s.skills.includes("combate"),canExecute:plan.ok&&actor.isOwner,
      errors:plan.errors,pool:plan.pool.map(d=>({sides:d.sides,label:sourceLabel(d.group,d.key,s),icon:dieSvg(d.sides)})),
      poolCount:plan.pool.length,keepNatural:keepLimit(s.level,false),
      keepWithCourage:keepLimit(s.level,true)
    };
  }
  if(this._pending){
    const p=this._pending;
    let summary=null;
    if(p.selected.length)try{summary=resolveRoll(p.dice,p.selected,{...p.options,courage:s.courage,
      weight:p.options.weightEnabled?affinity(p.options.attackWeight,p.options.targetWeight):0});}
      catch(e){summary={ok:false,errors:[e.message]};}
    const selectedCount=p.selected.length;
    ctx.codex.pending={
      dice:p.dice.map(d=>({...d,icon:dieSvg(d.sides),label:sourceLabel(d.group,d.key,s),
        selected:p.selected.includes(d.id),symbolsText:printableSymbols(d.symbols),symbolsHTML:coloredSymbols(d.symbols)})),
      selectedCount,canFinalize:summary?.ok&&actor.isOwner,
      summary,errors:summary?.errors||[],de:p.options.de,formula:p.formula,
      limit:keepLimit(s.level,p.options.extraKeep),extraKeep:p.options.extraKeep,
      cancelP:p.options.cancelP,convertPairs:p.options.convertPairs,
      rawP:summary?.raw?.p||0,rawA:summary?.raw?.a||0,
      cost:Number(p.options.extraKeep)+Number(p.options.step)
    };
  }
  return ctx;
 }
 async _onRender(context,options){
  await super._onRender(context,options);
  // Eventos de edição/entrada são registrados somente no corpo atual do render.
  const part=this.element?.querySelector(".codex-foundry-root");
  if(part)part.addEventListener("change",event=>this._onFieldChange(event));
 }
 async _onFieldChange(event){
  const el=event.target;
  if(el.dataset.field){
   if(!this.actor.isOwner)return;
   const allowed=["name","system.concept","system.origin","system.virtue","system.personality","system.level"];
   if(!allowed.includes(el.dataset.field))return;
   let value=el.value;
   if(el.dataset.field==="system.level")value=Math.max(1,Math.min(20,Number(value)||1));
   await this.actor.update({[el.dataset.field]:value});return;
  }
  if(el.dataset.rollOption){
   const key=el.dataset.rollOption;
   if(!Object.hasOwn(this._opts,key))return;
   this._opts[key]=el.type==="checkbox"?el.checked:el.type==="number"?Number(el.value):el.value;
   if(key==="de")this._opts.de=Math.max(0,Math.min(30,Number(this._opts.de)||0));
   if(key==="mode"){this._draft.complement=null;this._opts.contextApproved=false;}
   this.render();return;
  }
  if(el.dataset.pendingOption&&this._pending){
   const key=el.dataset.pendingOption;
   if(!["cancelP","convertPairs"].includes(key))return;
   this._pending.options[key]=Math.max(0,Math.floor(Number(el.value)||0));
   await this.actor.setFlag(NS,"pendingRoll",this._pending);
   this.render();
  }
 }
 static async chooseSource(event,target){
  if(this._pending||this._busy)return;
  const group=target.dataset.group,key=target.dataset.key;
  if(!["attribute","knowledge","practice"].includes(group))return;
  const validGroup={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES}[group];
  if(!validGroup.some(x=>x[0]===key))return;
  const candidate={group,key},d=this._draft;
  if(group==="attribute"){
    if(!d.base){ui.notifications.info("Escolha primeiro um Conhecimento ou uma Prática: a base define o tipo de ação.");return;}
    d.attribute=eq(d.attribute,candidate)?null:candidate;
    if(!d.attribute)d.complement=null;
  }else if(!d.base||!d.attribute){
    if(eq(d.base,candidate)){this._draft=emptyDraft();this._opts=emptyOptions();}
    else{this._draft={base:candidate,attribute:null,complement:null};
      this._opts=emptyOptions();this._opts.mode=initialMode(this.actor.system,candidate);}
  }else if(eq(d.base,candidate)){
    this._draft=emptyDraft();this._opts=emptyOptions();
  }else{
    if(!mayComplement(this.actor.system,d.base,this._opts.mode)){
      ui.notifications.warn("Terceira fonte exige Perícia aplicável. Selecione a habilitação em Perícias.");return;
    }
    d.complement=eq(d.complement,candidate)?null:candidate;
    this._opts.contextApproved=false;
  }
  this.render();
 }
 static async adjustGrade(event,target){
  if(!this.actor.isOwner||this._pending)return;
  const group=target.dataset.group,key=target.dataset.key,delta=Number(target.dataset.delta);
  const list={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES}[group];
  if(!list?.some(x=>x[0]===key)||![-1,1].includes(delta))return;
  const field={attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group];
  const current=Number(this.actor.system[field][key]||0),next=Math.min(6,Math.max(0,current+delta));
  await this.actor.update({["system."+field+"."+key]:next});
 }
 static async adjustResource(event,target){
  if(!this.actor.isOwner)return;
  const resource=target.dataset.resource,delta=Number(target.dataset.delta);
  const max={"system.life.value":lifeMax(this.actor.system),"system.courage":10,"system.pp":maxPP(this.actor.system.level)}[resource];
  if(max===undefined||![-1,1].includes(delta))return;
  const value=resource==="system.life.value"?this.actor.system.life.value:resource==="system.courage"?this.actor.system.courage:this.actor.system.pp;
  await this.actor.update({[resource]:Math.max(0,Math.min(max,value+delta))});
 }
 static async toggleSkill(event,target){
  if(!this.actor.isOwner||this._pending)return;
  const id=target.dataset.key;
  if(!SKILLS.some(x=>x.id===id))return;
  const skills=[...this.actor.system.skills];
  if(skills.includes(id))skills.splice(skills.indexOf(id),1);else skills.push(id);
  await this.actor.update({"system.skills":skills});
 }
 static clearDraft(){
  if(this._pending)return;
  this._draft=emptyDraft();this._opts=emptyOptions();this.render();
 }
 static async executeRoll(){
  if(this._busy||this._pending||!this.actor.isOwner)return;
  this._busy=true;
  try{
   const opts={...this._opts},s=this.actor.system;
   if(Number(opts.extraKeep)+Number(opts.step)>s.courage)throw Error("Coragem insuficiente para os custos prévios.");
   const plan=buildPool(s,this._draft,{mode:opts.mode,contextApproved:opts.contextApproved,step:opts.step});
   if(!plan.ok)throw Error(plan.errors.join("\n"));
   const result=await rollPool(plan.pool);
   // Resultado já visto é persistido como pendência; nenhum gasto definitivo aqui.
   const pending={version:1,id:crypto.randomUUID(),created:Date.now(),base:this._draft.base,
     attribute:this._draft.attribute,complement:this._draft.complement,formula:result.formula,
     dice:result.dice,selected:[],options:opts};
   await this.actor.setFlag(NS,"pendingRoll",pending);
   this._pending=pending;this._draft=emptyDraft();this._opts=emptyOptions();
   this.render();
  }catch(err){ui.notifications.error("Codex: "+err.message);}
  finally{this._busy=false;}
 }
 static async toggleKept(event,target){
  if(!this.actor.isOwner||this._busy||!this._pending)return;
  const id=target.dataset.id,p=this._pending;
  if(!p.dice.some(x=>x.id===id))return;
  const chosen=new Set(p.selected);
  if(chosen.has(id))chosen.delete(id);
  else{
   if(chosen.size>=keepLimit(this.actor.system.level,p.options.extraKeep)){
     ui.notifications.warn("Limite de dados mantidos atingido.");return;
   }
   chosen.add(id);
  }
  p.selected=[...chosen];
  p.options.cancelP=0;p.options.convertPairs=0;
  await this.actor.setFlag(NS,"pendingRoll",p);
  this.render();
 }
 static async finalizeRoll(){
  if(this._busy||!this._pending||!this.actor.isOwner)return;
  this._busy=true;
  try{
   const p=this._pending,s=this.actor.system;
   const cost=Number(p.options.extraKeep)+Number(p.options.step);
   const result=resolveRoll(p.dice,p.selected,{...p.options,courage:s.courage,
     weight:p.options.weightEnabled?affinity(p.options.attackWeight,p.options.targetWeight):0});
   if(!result.ok)throw Error(result.errors.join("\n"));
   if(s.courage<cost)throw Error("Coragem mudou durante a ação. Verifique os recursos.");
   const chosen=p.dice.filter(x=>p.selected.includes(x.id));
   const detail=chosen.map(d=>'<li>d'+d.sides+' ('+escapeHTML(sourceLabel(d.group,d.key,s))+'): '+d.face+' → '+escapeHTML(printableSymbols(d.symbols))+'</li>').join("");
   const mainAction=p.base?.group==="practice"&&p.base.key==="armas_conjuracao"?(p.options.mode==="conjuracao"?"Conjuração":"Armas"):sourceLabel(p.base.group,p.base.key,s);
   const composition=escapeHTML(mainAction)+" + "+escapeHTML(sourceLabel(p.attribute.group,p.attribute.key,s))+(p.complement?" + "+escapeHTML(sourceLabel(p.complement.group,p.complement.key,s)):"");
   const content='<div class="codex-chat-result"><h3>Codex RPG · '+escapeHTML(mainAction)+' · '+escapeHTML(result.outcome)+'</h3><p><strong>Composição:</strong> '+composition+'</p>'+
    '<p><strong>DE atingida:</strong> '+result.reached+' / '+result.de+'</p>'+
    '<p><strong>Êxitos:</strong> '+result.e+' · <strong>Antecipar restante:</strong> '+result.aRemaining+
    ' · <strong>Pavor residual:</strong> '+result.p+'</p>'+
    '<p><strong>Dano básico:</strong> '+result.damage+' (aplicar proteções e efeitos pertinentes)</p><ul>'+detail+'</ul>'+
    '<small>Gastos confirmados: '+cost+' Coragem. Transferência de Pavor e consequências narrativas exigem resolução de cena.</small></div>';
   await this.actor.update({"system.courage":s.courage-cost});
   await ChatMessage.create({user:game.user.id,speaker:ChatMessage.getSpeaker({actor:this.actor}),content,
     flags:{[NS]:{rollId:p.id,result:{...result,selected:undefined},dice:p.dice,kept:p.selected,source:p.base}}});
   await this.actor.unsetFlag(NS,"pendingRoll");
   this._pending=null;this.render();
  }catch(err){ui.notifications.error("Codex: "+err.message);}
  finally{this._busy=false;}
 }
 static async addEquipment(){
  if(!this.actor.isOwner)return;
  await this.actor.createEmbeddedDocuments("Item",[{
   name:"Novo equipamento",type:"equipment",
   system:{kind:"weapon",grade:1,quantity:1,weight:0.5,equipped:false,integrity:{value:0,max:0}}
  }]);
 }
 static async openEquipment(event,target){
  const item=this.actor.items.get(target.dataset.id);
  if(item)item.sheet.render({force:true});
 }
 static async toggleEquip(event,target){
  const item=this.actor.items.get(target.dataset.id);
  if(!this.actor.isOwner||!item)return;
  await item.update({"system.equipped":!item.system.equipped});
 }
 static async adjustIntegrity(event,target){
  const item=this.actor.items.get(target.dataset.id),delta=Number(target.dataset.delta);
  if(!this.actor.isOwner||!item||![-1,1].includes(delta))return;
  await item.update({"system.integrity.value":Math.max(0,Math.min(item.system.integrity.max,item.system.integrity.value+delta))});
 }
 static async removeEquipment(event,target){
  if(!this.actor.isOwner)return;
  const item=this.actor.items.get(target.dataset.id);
  if(item&&confirm('Excluir o equipamento "'+item.name+'"?'))await item.delete();
 }
 async close(options={}){
  this._draft=emptyDraft();this._opts=emptyOptions();
  return super.close(options);
 }
}