import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,SITUATIONS,XP_ATTRIBUTE,XP_TRAINING,
 sourceDice,sourceLabel,lifeMax,balance,maxPP,loadCapacity,mayComplement,xpLedger,monsterCap,hasStarterSources} from "./rules.mjs";
import "./gene-graph.mjs";
import {dieSvg,runeHTML,runeText} from "./roll-engine.mjs";
import {canSpendXP,defenseDE,skillRequirements} from "./equipment-logic.mjs";
import {G1_CATALOG} from "./catalog.mjs";
import {NS,draft,options,rulesFor,usesPavor,retention,prepareRoll,rollSummary,requestRoll,availableProperties} from "./roll-workflow.mjs";

const GROUPS={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES};
const FIELDS={attribute:"attributes",knowledge:"knowledges",practice:"practices"};
const same=(a,b)=>a?.key===b?.key&&a?.group===b?.group;
const attributes=[["Atributos","attribute"],["Práticas","practice"],["Conhecimentos","knowledge"]];
const tabs=[["overview","Jogar"],["training","Evolução"],["skills","Perícias"],["inventory","Inventário e Combate"]];
const creationSteps=[["Identidade","Quem é seu Aprendiz?"],["Codex Genético","19 XP compartilhados"],["Revisão","Confirmar personagem"]];
const reported=error=>{console.error("Codex RPG",error);ui.notifications.error("Codex · "+error.message);};
const notify=message=>ui.notifications.warn(message);
const selectedOptions=(values,value)=>values.map(([key,label])=>({key,label,selected:key===value}));

export class CodexCharacterSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2){
 static DEFAULT_OPTIONS={classes:["codex-rpg","codex-character-sheet"],position:{width:1050,height:780},
  window:{resizable:true},actions:{
   selectTab:CodexCharacterSheet.selectTab,selectMode:CodexCharacterSheet.selectMode,
   wizardStep:CodexCharacterSheet.wizardStep,finishCreation:CodexCharacterSheet.finishCreation,
   chooseSource:CodexCharacterSheet.chooseSource,clearDraft:CodexCharacterSheet.clearDraft,
   executeRoll:CodexCharacterSheet.executeRoll,toggleKept:CodexCharacterSheet.toggleKept,finalizeRoll:CodexCharacterSheet.finalizeRoll,
   adjustGrade:CodexCharacterSheet.adjustGrade,toggleSkill:CodexCharacterSheet.toggleSkill,adjustResource:CodexCharacterSheet.adjustResource,
   addEquipment:CodexCharacterSheet.addEquipment,openEquipment:CodexCharacterSheet.openEquipment,toggleEquip:CodexCharacterSheet.toggleEquip,
   removeEquipment:CodexCharacterSheet.removeEquipment,addCatalogEquipment:CodexCharacterSheet.addCatalogEquipment
  }};
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/character-sheet.hbs",scrollable:[".codex-scroll"]}};
 _draft=draft();
 _opts=options();
 _tab="overview";
 _mode="play";
 _wizardStep=0;
 _wizardReached=0;
 _creationVisited=false;
 _skillSearch="";
 _geneSelected="attr:forca";
 _geneNodes=[];
 _geneAffinity={};
 _busy=false;
 _refreshHooks=[];

 get pending(){return this.actor.getFlag(NS,"pendingRoll");}
 get title(){return this.actor.name;}
 get editing(){return this.actor.isOwner&&this._mode!=="play"&&!this.pending;}
 get administrative(){return this.editing&&this._mode==="admin"&&game.user.isGM;}
 get inCreation(){return this.actor.system.creationOpen;}
 async run(mutation){
  if(this._busy||!this.actor.isOwner)return;
  this._busy=true;
  try{
   if(navigator.locks)await navigator.locks.request(NS+":"+this.actor.uuid,mutation);
   else await mutation();
  }catch(error){reported(error);}
  finally{this._busy=false;await this.render();}
 }
 async _prepareContext(options){
  const ctx=await super._prepareContext(options), actor=this.actor,s=rulesFor(actor);
  const monster=actor.type==="creature",pavor=usesPavor(actor);
  if(!this._creationVisited){this._creationVisited=true;
   if(!monster&&actor.isOwner&&s.creationOpen){this._mode="edit";this._tab="training";}
  }
  const wizard=this._tab==="training"&&this.editing&&!!s.creationOpen&&!monster;
  const activeStep=this._wizardStep;
  const items=actor.items.filter(i=>i.type==="equipment");
  const ledger=xpLedger(s), pending=this.pending, selection=this._draft;
  const targets=[...game.user.targets],inCombat=!!game.combat?.started;
  const preparing=!pending&&!!selection.base&&!!selection.attribute&&this._mode==="play";
  const shared=selection.base?.key==="armas_conjuracao";
  const equipment=items.filter(i=>i.system.equipped&&
   (this._opts.mode==="conjuracao"?["focus","spell","magic"]:["weapon","firearm"]).includes(i.system.kind));
  const resource=(label,path,value,max,edit=true)=>({label,path,value,max,edit:edit&&actor.isOwner});
  const resources=[resource("Vida","life",s.life.value,lifeMax(s))];
  if(pavor)resources.push(resource("Pavor local","pavor",s.pavorLocal,monsterCap(s.threatGrade),game.user.isGM));
  else resources.push(resource("Coragem","courage",s.courage,10),resource("PP","pp",s.pp,maxPP(s.level)));
  const label=source=>source?sourceLabel(source.group,source.key):"";
  const groups=attributes.filter(([,group])=>!monster||group==="attribute").map(([title,group])=>({
   title,sources:GROUPS[group].map(([key,name])=>{
    const src={group,key},grade=s[FIELDS[group]][key],gradeScale=group==="attribute"&&!monster?XP_ATTRIBUTE:XP_TRAINING;
    return {...src,name,grade,dice:sourceDice(group,key,s).map(n=>"d"+n).join(" + "),
     nextCost:grade<6?gradeScale[grade+1]-gradeScale[grade]:null,
     picked:same(selection.base,src)||same(selection.attribute,src)||same(selection.complement,src)};
   })
  }));
  const modes=shared||monster?selectedOptions(
   [["normal","Teste comum"],["armas",monster?"Ataque natural":"Ataque com arma"],
    ...(!monster?[["conjuracao","Conjuração"]]:[])],this._opts.mode):null;
  const plan=preparing?prepareRoll(actor,selection,this._opts,targets,inCombat):null;
  const prepare=preparing?{
   modes,showGear:this._opts.mode!=="normal"&&!monster,isMagic:this._opts.mode==="conjuracao",
   gear:equipment.map(item=>({id:item.id,name:item.name,selected:item.id===this._opts.equipmentId})),
   condition:selectedOptions(Object.entries(SITUATIONS).map(([key,x])=>[key,x.label+({"superior":" (+1E)","advantage":" (+1A)","disadvantage":" (−1A)","inferior":" (−1E)","luck":" (−2E)"}[key]??"")]),this._opts.situation),
   extra:selectedOptions([[0,"Natural · "+retention(actor,0)],[1,"+1 mantido · 1 "+plan.resource],
    ...(monster&&s.threatGrade>=5?[[2,"+2 mantidos · 2 Pavor local"]]:[])].filter(([key])=>key===0||retention(actor,key)>retention(actor,0)),Number(this._opts.extraKeep)),
   target:plan.options.targetName,targetDE:plan.options.de,manualDE:this._opts.de,
   contextApproved:this._opts.contextApproved,complement:label(selection.complement),step:this._opts.step,
   pool:plan.pool.map(d=>({icon:dieSvg(d.sides),sides:d.sides,label:d.group==="equipment"?plan.options.equipmentName:label(d)})),
   count:plan.pool.length,warnings:[plan.gear?.reason].filter(Boolean),
   errors:plan.errors,canRoll:actor.isOwner&&plan.ok,cost:plan.cost,resource:plan.resource,
   showDual:this._opts.mode==="armas"&&!monster,dual:this._opts.dual
  }:null;
  const summary=pending?.selected.length&&!pending.publication?rollSummary(actor,pending):null;
  const active=pending?availableProperties(actor,pending.options):[];
  const combat=pending?(game.combats.get(pending.options.combatId)??game.combat):null;
  const participates=combat?.combatants.some(c=>c.actor?.uuid===actor.uuid);
  const allies=pending?.options.inCombat&&participates?combat.combatants
   .filter(c=>c.actor&&c.actor.uuid!==actor.uuid&&c.actor.uuid!==pending.options.targetActorUuid):[];
  const result=pending?{
   publishing:!!pending.publication,canFinish:actor.isOwner&&(!!pending.publication||summary?.ok),
   dice:pending.dice.map(d=>({...d,icon:dieSvg(d.sides),label:d.group==="equipment"?pending.options.equipmentName||"Equipamento":label(d),
    kept:pending.selected.includes(d.id),maximal:d.face===d.sides,text:runeText(d.symbols),runes:runeHTML(d.symbols)})),
   count:pending.selected.length,limit:retention(actor,pending.options.extraKeep),summary,
   target:pending.options.targetName,de:pending.options.de,hasDE:pending.options.de!=null,
   cancelP:pending.options.cancelP,convertPairs:pending.options.convertPairs,passA:pending.options.passA,
   allies:allies?.map(c=>({key:c.id,label:c.name,selected:c.id===pending.options.allyId})),
   hasProperties:(summary?.success&&active.length>0)||!!pending.options.characteristic,
   second:summary?.critical>0&&!pavor,paid:!pavor&&(!summary?.critical||!!pending.options.secondCharacteristic),
   properties:selectedOptions(active.map(name=>[name,name]),pending.options.characteristic),
   secondProperties:selectedOptions(active.filter(name=>name!==pending.options.characteristic).map(name=>[name,name]),pending.options.secondCharacteristic),
   payment:selectedOptions([["courage","2 Coragens"],["pp","1 PP"]],pending.options.activationPayment),
   resource:pavor?"Pavor local":"Coragem"
  }:null;

  ctx.codex={name:actor.name,portrait:actor.img,s,monster,pavor,owner:actor.isOwner,gm:game.user.isGM,
   role:monster?"Criatura":actor.type==="humanoid"?(pavor?"Humanoide · oposição":"Humanoide"):"Personagem",
   editing:this.editing,admin:this.administrative,creation:this.inCreation,
   canReverse:this.inCreation||this.administrative,humanoid:actor.type==="humanoid",
   modes:selectedOptions(actor.isOwner?[["play","Jogar"],["edit",this.inCreation?"Criar":"Editar"],...(game.user.isGM?[["admin","Administração"]]:[])]:[],this._mode),
   tabs:selectedOptions(tabs,this._tab),overview:this._tab==="overview",training:this._tab==="training"&&!wizard,
   skillsPage:this._tab==="skills",inventory:this._tab==="inventory",
   wizard,wizardStep:activeStep,wizardSteps:creationSteps.map(([name,subtitle],i)=>({
    index:i,name,subtitle,selected:i===activeStep,complete:i<activeStep,available:i<=this._wizardReached+1,next:i===activeStep+1,prev:i===activeStep-1
   })),wizardTitle:creationSteps[activeStep][0],wizardSubtitle:creationSteps[activeStep][1],
   wizardIdentity:activeStep===0,wizardGenetic:activeStep===1,wizardReview:activeStep===2,
   wizardGroups:[],
   geneDetail:null,
   wizardCanFinish:ledger.left>=0&&hasStarterSources(s)&&!!String(actor.name||"").trim(),wizardPrev:activeStep>0,
   wizardLast:activeStep===creationSteps.length-1,skillSearch:this._skillSearch,
   ownedSkills:monster?[]:SKILLS.filter(skill=>s.skills.includes(skill.id)).map(skill=>({
    name:skill.name,detail:skill.detail.slice(0,130),element:["fogo","agua","vento","terra","sagrado","trevas","veneno","sangue"].includes(skill.id)})),
   ownedElements:monster?[]:SKILLS.filter(skill=>s.skills.includes(skill.id)&&["fogo","agua","vento","terra","sagrado","trevas","veneno","sangue"].includes(skill.id)).map(skill=>({name:skill.name})),
   equippedGear:items.filter(i=>i.system.equipped).map(i=>({name:i.name,summary:(i.system.properties||[]).join(" · "),
    die:i.system.die?"d"+i.system.die:"Proteção"})),
   resources,de:defenseDE(actor,s.defense),defense:selectedOptions([["natural","Defesa natural"],["equipped","Defesa com armadura"],["dodge","Esquiva"]],s.defense),
   balance:balance(s),capacity:loadCapacity(s),load:Number(items.reduce((total,i)=>total+i.system.weight*i.system.quantity,0).toFixed(3)),
   ledger,groups,
   showBattle:!!pending||this._mode==="play"&&!!selection.base,
   base:label(selection.base),attribute:label(selection.attribute),
   complementAllowed:!!selection.attribute&&mayComplement(s,selection.base,this._opts.mode),
   eligibleComplements:selection.attribute&&mayComplement(s,selection.base,this._opts.mode)?groups.flatMap(g=>g.sources)
    .filter(src=>!same(src,selection.base)&&!same(src,selection.attribute)).map(src=>({...src,key:src.group+"."+src.key,selected:same(src,selection.complement)})):[],
   sourceGroups:groups.filter(group=>monster||group.title!=="Atributos"),attributeGroup:groups[0],
   pickAttribute:!!selection.base&&!pending,prepare,result,hasPending:!!pending,
   skills:monster?[]:SKILLS.filter(skill=>!this._skillSearch.trim()||
   (skill.name+" "+skill.detail).toLocaleLowerCase("pt-BR").includes(this._skillSearch.toLocaleLowerCase("pt-BR").trim())).map(skill=>{
    const request=skillRequirements(s,skill.id),owned=s.skills.includes(skill.id);
    return {...skill,request,owned,canBuy:request.met&&canSpendXP(s,skill.cost,"skills")};
   }),
   gear:items.map(i=>({id:i.id,name:i.name,...i.system.toObject()})),
   catalog:G1_CATALOG.map((item,index)=>({id:index,name:item.name}))
  };
  if(wizard){
   const startedAttribute=ATTRIBUTES.some(([key])=>Number(s.attributes?.[key]||0)>=1);
   const sources=[
    ...ATTRIBUTES.map(([key,name])=>({group:"attribute",type:"attr",key,name})),
    ...KNOWLEDGES.map(([key,name])=>({group:"knowledge",type:"know",key,name})),
    ...PRACTICES.map(([key,name])=>({group:"practice",type:"practice",key,name}))
   ];
   const geneNodes=sources.map(node=>{
    const grade=Number(s[FIELDS[node.group]]?.[node.key]||0),scale=node.group==="attribute"?XP_ATTRIBUTE:XP_TRAINING;
    const next=grade<6?scale[grade+1]-scale[grade]:null;
    const allowed=node.group==="attribute"||startedAttribute;
    return {...node,id:node.type+":"+node.key,grade,next,
     state:grade>0?"owned":allowed&&next!==null&&canSpendXP(s,next,node.group==="attribute"?"attributes":"training")?"available":"locked",
     dice:sourceDice(node.group,node.key,s).map(n=>"d"+n).join(" + ")};
   });
   const affinities={};
   for(const skill of SKILLS){
    const label=skillRequirements(s,skill.id).label.toLowerCase();
    const references=[["força","attr:forca"],["agilidade","attr:agilidade"],["destreza","attr:destreza"],
     ["inteligência","attr:inteligencia"],["influência","attr:influencia"],["vigor","attr:vigor"],
     ["disciplina","practice:armas_conjuracao"],["atletismo","practice:atletismo"],
     ["furtividade","practice:furtividade"],["artesão","practice:artesao"],
     ["apresentação","practice:apresentacao"],["coleta","practice:coleta"],
     ["medicina","know:medicina"],["alquimia","know:alquimia"],
     ["proteção","know:protecao"],["erudição","know:erudicao"]];
    affinities[skill.id]=references.filter(([name])=>label.includes(name)).map(([,node])=>node);
    const owned=s.skills.includes(skill.id),request=skillRequirements(s,skill.id);
    geneNodes.push({type:"skill",id:skill.id,name:skill.name,
     state:owned?"owned":hasStarterSources(s)&&request.met&&canSpendXP(s,skill.cost,"skills")?"available":"locked",
     label:request.label,detail:skill.detail,cost:skill.cost});
   }
   this._geneNodes=geneNodes;this._geneAffinity=affinities;
   const chosen=geneNodes.find(node=>node.id===this._geneSelected)||geneNodes[0];
   const isSkill=chosen.type==="skill",sourceGroup=chosen.type==="attr"?"attribute":chosen.type==="know"?"knowledge":"practice";
   ctx.codex.geneDetail={...chosen,isSkill,sourceGroup,
    canRaise:!isSkill&&chosen.next!==null&&(chosen.group==="attribute"||startedAttribute)&&
      canSpendXP(s,chosen.next,chosen.group==="attribute"?"attributes":"training"),canLower:!isSkill&&chosen.grade>0,
    canBuy:isSkill&&chosen.state==="available",owned:isSkill&&chosen.state==="owned",
    request:isSkill?skillRequirements(s,chosen.id).label:"",
    nextCost:chosen.next??0};
  }
  return ctx;
 }
 _onRender(ctx,options){
  super._onRender(ctx,options);
  const body=this.element.querySelector(".codex-foundry-root");
  if(body&&!body.dataset.bound){
   body.dataset.bound="true";
   body.addEventListener("change",event=>this._change(event));
  }
  const graph=this.element.querySelector("[data-codex-gene]");
  if(graph&&window.CodexGeneGraph&&this._geneNodes.length){
   window.CodexGeneGraph.render(graph,{skills:this._geneNodes,branches:[],affinity:this._geneAffinity,
    selected:this._geneSelected,filter:"all",onSelect:id=>{this._geneSelected=id;this.render();}});
  }
  if(!this._refreshHooks.length){
   this._refreshHooks=[
    ["targetToken",Hooks.on("targetToken",user=>{if(user===game.user&&this._draft.base)this.render();})],
    ["updateCombat",Hooks.on("updateCombat",()=>{if(this._draft.base||this.pending)this.render();})],
    ["updateActor",Hooks.on("updateActor",actor=>{
     if(this._draft.base&&[...game.user.targets].some(token=>token.actor?.uuid===actor.uuid))this.render();
    })]
   ];
  }
 }
 _onClose(options){
  for(const [hook,id] of this._refreshHooks)Hooks.off(hook,id);
  this._refreshHooks=[];
  super._onClose(options);
 }
 async _change(event){
  const input=event.target;
  if(!this.actor.isOwner||this._busy)return;
  if(input.dataset.skillSearch!==undefined){this._skillSearch=String(input.value||"").slice(0,100);await this.render();return;}
  if(input.dataset.option&&!this.pending&&this._mode==="play"){
   const key=input.dataset.option;
   if(key==="complement"){
    const [group,key]=input.value.split(".");
    this._draft.complement=key?{group,key}:null;
    this._opts.contextApproved=false;
   }else if(Object.hasOwn(this._opts,key)){
    this._opts[key]=input.type==="checkbox"?input.checked:key==="extraKeep"?Number(input.value):input.value;
    if(key==="mode"){this._opts.equipmentId="";this._opts.dual=false;this._draft.complement=null;this._opts.contextApproved=false;}
   }
   await this.render();return;
  }
  if(input.dataset.pendingOption){
   await this.run(async()=>{
    const p=this.pending,key=input.dataset.pendingOption;
    if(!p||p.publication)return;
    const value=input.type==="number"?Math.max(0,Math.floor(Number(input.value)||0)):input.type==="checkbox"?input.checked:input.value;
    await requestRoll(this.actor,{action:"choose",id:p.id,key,value});
   });
   return;
  }
  if(input.dataset.field){
   await this.run(async()=>{
    const field=input.dataset.field;
    const admin=["system.level","system.xp","system.threatGrade","system.opposition","system.creationOpen"];
    const identity=["name","system.concept","system.origin","system.virtue","system.personality","system.notes"];
    if(field==="system.defense"){
     if(["natural","equipped","dodge"].includes(input.value))await this.actor.update({[field]:input.value});
     return;
    }
    if(!this.editing||(!identity.includes(field)&&!(this.administrative&&admin.includes(field))))return;
    let value=input.type==="checkbox"?input.checked:input.value;
    const bounds={"system.level":[1,20],"system.xp":[0,Number.MAX_SAFE_INTEGER],"system.threatGrade":[1,6]};
    if(bounds[field])value=Math.max(bounds[field][0],Math.min(bounds[field][1],Math.floor(Number(value)||0)));
    const changes={[field]:value};
    if(field==="system.threatGrade"&&usesPavor(this.actor))changes["system.pavorLocal"]=Math.min(this.actor.system.pavorLocal,monsterCap(value));
    await this.actor.update(changes);
   });
  }
 }
 static async wizardStep(event,button){
  if(!this.inCreation||!this.editing||this.actor.type==="creature"||this.pending)return;
  const next=Math.floor(Number(button.dataset.step));
  if(!Number.isInteger(next)||next<0||next>=creationSteps.length||next>this._wizardReached+1)return;
  if(next>0&&!String(this.actor.name||"").trim())return notify("Informe um nome antes de avançar.");
  if(next===2&&!hasStarterSources(rulesFor(this.actor)))return notify("Desenvolva um Atributo e um Conhecimento ou Prática antes da revisão.");
  this._wizardStep=next;this._wizardReached=Math.max(this._wizardReached,next);await this.render();
 }
 static async finishCreation(){
  if(!this.inCreation||!this.editing||this.actor.type==="creature"||this.pending)return;
  if(!hasStarterSources(rulesFor(this.actor)))return notify("Desenvolva ao menos um Atributo e um Conhecimento ou Prática.");
  if(xpLedger(rulesFor(this.actor)).left<0)return notify("Investimento acima do XP disponível.");
  const approved=await foundry.applications.api.DialogV2.confirm({
   window:{title:"Concluir criação · Codex RPG"},
   content:"<p>Concluir a criação do Aprendiz? As Perícias e fontes compradas continuam na ficha. O XP inicial não usado permanece livre conforme as regras atuais.</p>",rejectClose:false});
  if(!approved)return;
  await this.run(async()=>{await this.actor.update({"system.creationOpen":false});this._mode="play";this._tab="overview";});
 }
 static async selectTab(event,button){
  if(!tabs.some(([key])=>key===button.dataset.tab))return;
  this._tab=button.dataset.tab;await this.render();
 }
 static async selectMode(event,button){
  const mode=button.dataset.mode;
  if(!this.actor.isOwner||this.pending||!["play","edit","admin"].includes(mode)||mode==="admin"&&!game.user.isGM)return;
  this._mode=mode;this._tab=mode==="play"?"overview":"training";if(mode==="edit"&&this.inCreation)this._wizardStep=0;await this.render();
 }
 static async chooseSource(event,button){
  if(this._busy||this.pending||this._mode!=="play"||!this.actor.isOwner)return;
  const {group,key}=button.dataset,source={group,key},monster=this.actor.type==="creature";
  if(!GROUPS[group]?.some(([id])=>id===key)||monster&&group!=="attribute")return;
  const slot=monster?button.dataset.slot:group==="attribute"?"attribute":"base";
  if(slot==="attribute"&&(!this._draft.base||same(this._draft.base,source)))return;
  if(slot==="base"){
   this._draft={...draft(),base:source};
   this._opts=options();
  }else{
   this._draft.attribute=source;
   this._draft.complement=null;
   this._opts.contextApproved=false;
  }
  await this.render();
 }
 static async clearDraft(){
  if(this.pending||this._busy)return;
  this._draft=draft();this._opts=options();await this.render();
 }
 static async executeRoll(){
  await this.run(async()=>{
   if(this._mode!=="play"||this.pending)return;
   await requestRoll(this.actor,{action:"start",selection:this._draft,config:this._opts,
    sceneId:canvas.scene?.id,targetIds:[...game.user.targets].map(token=>token.id)});
   this._draft=draft();this._opts=options();
  });
 }
 static async toggleKept(event,button){
  await this.run(async()=>{
   const p=this.pending;
   if(p)await requestRoll(this.actor,{action:"choose",id:p.id,dieId:button.dataset.id});
  });
 }
 static async finalizeRoll(){
  const id=this.pending?.id;
  if(id)await this.run(()=>requestRoll(this.actor,{action:"finish",id}));
 }
 static async adjustGrade(event,button){
  await this.run(async()=>{
   if(!this.editing)return;
   const {group,key,delta}=button.dataset,s=rulesFor(this.actor),field=FIELDS[group];
   if(!GROUPS[group]?.some(([id])=>id===key)||![-1,1].includes(Number(delta))||s.monsterRules&&group!=="attribute")return;
   if(this.inCreation&&group!=="attribute"&&Number(delta)>0&&
      !ATTRIBUTES.some(([name])=>Number(s.attributes?.[name]||0)>=1)){
    return notify("Comece com pelo menos um Atributo na hélice do Codex Genético.");
   }
   const current=s[field][key],next=Math.max(0,Math.min(6,current+Number(delta)));
   if(current===next)return;
   const scale=group==="attribute"&&!s.monsterRules?XP_ATTRIBUTE:XP_TRAINING;
   const difference=scale[next]-scale[current],bucket=group==="attribute"?"attributes":"training";
   if(difference>0&&!this.administrative&&!canSpendXP(s,difference,bucket))return notify("XP disponível insuficiente para este grau.");
   if(difference<0&&!this.inCreation&&!this.administrative)return notify("Reversão disponível na criação ou na administração do Narrador.");
   const changes={["system."+field+"."+key]:next};
   if(difference<0&&!this.administrative){
    const after={...s,[field]:{...s[field],[key]:next}};
    const dependent=s.skills.find(id=>skillRequirements(s,id).met&&!skillRequirements(after,id).met);
    if(dependent)return notify("Reverta primeiro a Perícia "+(SKILLS.find(x=>x.id===dependent)?.name??dependent)+".");
   }
   if(difference<0&&!this.inCreation)changes["system.xpRetired."+bucket]=(s.xpRetired?.[bucket]??0)-difference;
   await this.actor.update(changes);
  });
 }
 static async toggleSkill(event,button){
  await this.run(async()=>{
   if(!this.editing||this.actor.type==="creature")return;
   const skill=SKILLS.find(x=>x.id===button.dataset.key);
   if(!skill)return;
   const s=rulesFor(this.actor),owned=s.skills.includes(skill.id);
   const changes={};
   if(owned){
    if(!this.inCreation&&!this.administrative)return notify("Reversão disponível na criação ou na administração do Narrador.");
    const skills=s.skills.filter(id=>id!==skill.id);
    if(!this.administrative&&skills.some(id=>skillRequirements(s,id).met&&!skillRequirements({...s,skills},id).met)){
     return notify("Reverta primeiro as Perícias que dependem desta.");
    }
    if(!this.inCreation)changes["system.xpRetired.skills"]=(s.xpRetired?.skills??0)+(s.skillCosts?.[skill.id]??skill.cost);
    changes["system.skills"]=skills;
    changes["system.skillCosts.-="+skill.id]=null;
   }else{
    if(this.inCreation&&!hasStarterSources(s))return notify("Desenvolva primeiro um Atributo e um Conhecimento ou Prática.");
    const req=skillRequirements(s,skill.id);
    if(!req.met&&!this.administrative)return notify(req.label);
    if(!this.administrative&&!canSpendXP(s,skill.cost,"skills"))return notify("XP insuficiente para esta Perícia.");
    changes["system.skills"]=[...s.skills,skill.id];
    changes["system.skillCosts."+skill.id]=skill.cost;
   }
   await this.actor.update(changes);
  });
 }
 static async adjustResource(event,button){
  await this.run(async()=>{
   if(this.pending)return notify("Finalize a ação pendente antes de alterar recursos.");
   const {resource,delta}=button.dataset,s=this.actor.system;
   const pavor=usesPavor(this.actor);
   const resourceData={life:["life.value",s.life.value,lifeMax(s)],...(!pavor?{
    courage:["courage",s.courage,10],pp:["pp",s.pp,maxPP(s.level)]
   }:game.user.isGM?{pavor:["pavorLocal",s.pavorLocal,monsterCap(s.threatGrade)]}:{})}[resource];
   if(!resourceData||![-1,1].includes(Number(delta)))return;
   const [field,value,max]=resourceData;
   await this.actor.update({["system."+field]:Math.max(0,Math.min(max,value+Number(delta)))});
  });
 }
 static async addEquipment(){
  await this.run(()=>this.actor.createEmbeddedDocuments("Item",[{name:"Novo equipamento",type:"equipment"}]));
 }
 static async addCatalogEquipment(){
  const index=this.element.querySelector("[data-catalog-choice]")?.value;
  const row=index==null?null:G1_CATALOG[Number(index)];
  if(!row)return;
  const {name,...system}=structuredClone(row);
  await this.run(()=>this.actor.createEmbeddedDocuments("Item",[{name,type:"equipment",system}]));
 }
 static async openEquipment(event,button){
  await this.actor.items.get(button.dataset.id)?.sheet.render({force:true});
 }
 static async toggleEquip(event,button){
  await this.run(async()=>{
   if(this.pending)return notify("Finalize a ação antes de trocar o equipamento.");
   const item=this.actor.items.get(button.dataset.id);
   if(item)await item.update({"system.equipped":!item.system.equipped});
  });
 }
 static async removeEquipment(event,button){
  const item=this.actor.items.get(button.dataset.id);
  if(!item||!this.editing)return;
  const remove=await foundry.applications.api.DialogV2.confirm({
   window:{title:"Excluir equipamento"},content:"<p>Excluir este item do inventário?</p>",rejectClose:false
  });
  if(remove)await this.run(()=>item.delete());
 }
}
