import {SKILLS, sourceDice, xpLedger} from "./rules.mjs";
import {creationMissing, developmentGroups, gradeDetails, skillDetails} from "./advancement.mjs";
import {requestRoll} from "./roll-workflow.mjs";
import {escapeHTML as esc} from "./roll-engine.mjs";
import {dieSvg} from "./dice-icons.mjs";

import {summonPlan} from "./summon-planning.mjs";
import {showSkill} from "./skill-catalog.mjs";

const ns="codex-rpg-foundry";
const applications=new Map();
const dateFormat=new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"});
const groups=Object.entries(developmentGroups);
const graphGroups=Object.fromEntries(groups.map(([key,group])=>[group.graph,key]));

function graphicalNodes(system,creationPending,locked){
 const sources=groups.flatMap(([kind,group])=>group.list.map(([key])=>{
  const row=gradeDetails(system,kind,key,creationPending);
  return {
   type:group.graph,id:group.graph+":"+key,key,name:row.name,
   grade:row.grade,previewGrade:row.grade,canRaise:!locked&&row.canBuy,canLower:!locked&&row.canLower,
   dice:sourceDice(kind,key,system).map(n=>"d"+n)
  };
 }));
 const skills=SKILLS.filter(row=>showSkill(row,system)).map(skill=>{
  const row=skillDetails(system,skill.id);
  return {type:"skill",id:skill.id,name:row.name,label:row.blocker||row.cost+" XP",
   state:row.owned?"owned":row.canBuy?"available":!row.pending&&row.affordable&&!row.met?"potential":"locked"};
 });
 return [...sources,...skills];
}

function detailMarkup(system,id,{locked,creationPending,requiresApproval}){
 const [type,key] = id.split(":");
 const disabled=locked?" disabled":"";
 if(graphGroups[type]){
  const group=graphGroups[type],row=gradeDetails(system,group,key,creationPending);
  const dice=sourceDice(group,key,system).map(sides=>'<span class="codex-small-die">'+dieSvg(sides)+'<b>d'+sides+'</b></span>').join("");
  const tier=row.cost!==null?"<p>Próximo Grau: "+row.cost+" XP.</p>":"<p>Grau máximo.</p>";
  const button=(delta,label,enabled)=>
   '<button type="button" data-action="adjustGrade" data-delta="'+delta+'" data-grade="'+row.grade+
   '" aria-label="'+label+'"'+(!enabled?" disabled":disabled)+'>'+(delta>0?"+":"−")+'</button>';
  const controls='<div class="codex-dna-grade">'+button(-1,"Diminuir Grau",row.canLower)+
   '<strong>Grau '+row.grade+'</strong>'+button(1,"Aumentar Grau",row.canBuy)+'</div>';
  const notes=[row.raiseBlocker&&row.cost!==null?row.raiseBlocker:"",
   row.lowerBlocker,requiresApproval&&row.canLower?"A redução solicita autorização ao Narrador.":"",
   locked?"Evolução indisponível durante uma rolagem ou alteração em andamento.":""].filter(Boolean);
  return '<h3>'+esc(row.name)+'</h3>'+controls+'<div class="codex-dice-strip">'+dice+'</div>'+tier+
   (row.canLower?'<p>Redução libera '+row.refund+' XP.</p>':'')+
   notes.map(note=>'<p class="codex-dna-note">'+esc(note)+'</p>').join("");
 }
 const row=skillDetails(system,id);
 const alternativeMarkup=row.alternatives.map(branch=>"<ul>"+branch.map(item=>
  '<li class="'+(item.met?"met":"unmet")+'">'+(item.met?"✓ ":"○ ")+esc(item.name)+'</li>').join("")+"</ul>").join("<p>ou</p>");
 return '<h3>'+esc(row.name)+'</h3><p>'+(row.pending?'XP de aquisição pendente':row.cost+' XP')+'</p><p>'+esc(row.detail)+'</p>'+
  (alternativeMarkup?'<h4>Requisitos</h4>'+alternativeMarkup:'')+
  (row.owned?'<p>Adquirida</p>':'<button type="button" data-action="buy"'+(!row.canBuy?" disabled":disabled)+'>Comprar Perícia</button>')+
  (!row.owned&&row.blocker?'<p>'+esc(row.blocker)+'</p>':'');
}

function center(shape){
 if(!shape)return null;
 if(shape.tagName==="circle")return [Number(shape.getAttribute("cx")),Number(shape.getAttribute("cy"))];
 return [Number(shape.getAttribute("x"))+Number(shape.getAttribute("width"))/2,
  Number(shape.getAttribute("y"))+Number(shape.getAttribute("height"))/2];
}

function markRequirements(root,selected,system){
 if(graphGroups[selected.split(":")[0]])return;
 const node=key=>root.querySelector('[data-gene-id="'+CSS.escape(key)+'"]');
 const viewport=root.querySelector(".fp-gene-viewport");
 const from=center(node(selected)?.querySelector("circle"));
 if(!viewport||!from)return;
 const requirements=new Map(skillDetails(system,selected).alternatives.flat().map(item=>[item.node,item]));
 for(const [key,item] of requirements){
  const target=node(key.replace(/^skill:/,""));
  const to=center(target?.querySelector("rect,circle"));
  if(!to)continue;
  const line=root.ownerDocument.createElementNS("http://www.w3.org/2000/svg","line");
  line.setAttribute("class","codex-dna-requirement "+(item.met?"met":"unmet"));
  line.setAttribute("x1",String(from[0]));line.setAttribute("y1",String(from[1]));
  line.setAttribute("x2",String(to[0]));line.setAttribute("y2",String(to[1]));
  viewport.insertBefore(line,viewport.querySelector(".fp-gene-node"));
 }
}


const sizeLabels={pequena:"Pequeno",media:"Médio",grande:"Grande"};
const elementLabels={psique:"Psique",fogo:"Fogo",agua:"Água",vento:"Ar",terra:"Terra",sagrado:"Sagrado",veneno:"Veneno",sangue:"Sangue",trevas:"Trevas"};
function optionList(keys, labels){
 return keys.map(id=>'<option value="'+esc(id)+'">'+esc(labels[id])+'</option>').join("");
}
function summoningMarkup(rules,system){
 const sizes=optionList(rules.summonableElementalSizes(system.skills),sizeLabels);
 const elements=optionList(rules.eligibleElementalSkills(system.skills),elementLabels);
 if(!sizes||!elements)return "";
 const payment='<option value="courage">Coragem</option><option value="pp">PP</option>';
 const mastery=system.skills.includes("mestre");
 return '<section class="codex-summon-plan" data-summon-plan><h4>Planejar invocação</h4>'+
  '<label>Porte <select name="size">'+sizes+'</select></label>'+
  '<label>Elemento <select name="first">'+elements+'</select></label>'+
  (mastery&&system.skills.includes("improviso")?'<label>Segundo elemento <select name="second"><option value="">Nenhum</option>'+elements+'</select></label>':'')+
  '<label>Custo-base <select name="base">'+payment+'</select></label>'+
  (mastery?'<label>Ativar Maestria <select name="mastery"><option value="">Sem Maestria</option>'+payment+'</select></label>':'')+
  '<label>Tokens <input name="count" type="number" min="1" step="1" value="1"></label>'+
  '<div data-summon-split hidden><label>Vida total <input name="life" type="number" min="1" step="1"></label>'+
  '<label>DE da ficha <input name="de" type="number" min="0" step="1"></label></div>'+
  '<p data-summon-summary role="status"></p><small>O Narrador confirma a ativação, mantém uma única ficha ativa por conjurador e aplica efeitos, ações e dissipação.</small></section>';
}

export class CodexDNA extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.api.ApplicationV2) {
 static DEFAULT_OPTIONS={
  classes:["codex-rpg","codex-dna"],position:{width:1040,height:780},window:{title:"Codex Genético",resizable:true},
  actions:{stage:CodexDNA.stage,buy:CodexDNA.buy,adjustGrade:CodexDNA.adjustGrade,adjustXP:CodexDNA.adjustXP,complete:CodexDNA.complete,classic:CodexDNA.classic}
 };
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/dna.hbs"}};

 constructor(actor,stage){
  super();
  this.actor=actor;
  this.stageName=stage;
  this.selected="attr:forca";
 }
 async _prepareContext(){
  return {canManageXP:game.user.isGM,actorName:this.actor.name,concept:this.actor.system.concept,origin:this.actor.system.origin,
   categories:groups.map(([key,group])=>({label:group.label,description:group.description})),
  };
 }
 async _onRender(context,options){
  await super._onRender(context,options);
  const root=this.element.querySelector(".codex-dna-root");
  root.addEventListener("change",async event=>{
   const planner=event.target.closest("[data-summon-plan]");
   if(planner){this.updateSummonPlan(planner);return;}
   const field=event.target.dataset.identity;
   if(!["name","system.concept","system.origin"].includes(field)||!this.actor.isOwner)return;
   const value=event.target.value.trim();
   if(field==="name"&&!value){event.target.value=this.actor.name;return;}
   try{await this.actor.update({[field]:value});}catch(error){ui.notifications.error(error.message);}
  });
  this.actorHook??=Hooks.on("updateActor",actor=>{if(actor.uuid===this.actor.uuid)this.refresh();});
  this.refresh();
 }
 refresh(){
  if(!this.rendered)return;
  const root=this.element.querySelector(".codex-dna-root");
  if(!root)return;
  const system=this.actor.system,ledger=xpLedger(system);
  const pendingRoll=Boolean(this.actor.getFlag(ns,"pendingRoll"));
  const locked=pendingRoll||Boolean(this.busy);
  const creationPending=Boolean(this.actor.getFlag(ns,"creationPending"));
  const missing=creationMissing(system);
  root.querySelector("[data-dna-name]").textContent=this.actor.name;
  for(const field of ["formation","additional","grant","spent","left"]){
   root.querySelector('[data-dna-xp="'+field+'"]').textContent=ledger[field]+" XP";
  }
  const panel=root.querySelector("[data-dna-xp-management]");
  if(panel){
   panel.querySelectorAll("button,input").forEach(el=>{el.disabled=locked;});
   const list=panel.querySelector("[data-dna-xp-history]");
   const history=this.actor.getFlag(ns,"xpHistory")??[];
   list.replaceChildren(...history.slice().reverse().map(entry=>{
    const item=root.ownerDocument.createElement("li");
    item.textContent=dateFormat.format(entry.at)+" · "+(entry.userName||entry.userId)+" · "+
     (entry.delta>0?"+":"")+entry.delta+" XP ("+entry.previous+" → "+entry.next+")";
    return item;
   }));
   panel.querySelector("[data-dna-xp-empty]").hidden=history.length>0;
   panel.querySelector("[data-dna-xp-locked]").hidden=!locked;
  }
  for(const stage of root.querySelectorAll("[data-dna-panel]"))stage.hidden=stage.dataset.dnaPanel!==this.stageName;
  for(const element of root.querySelectorAll('[data-action="stage"]'))element.setAttribute("aria-pressed",String(element.dataset.stage===this.stageName));
  root.querySelector('[data-action="complete"]').hidden=!creationPending;
  root.querySelector('[data-action="complete"]').disabled=locked||missing.attr||missing.training||ledger.left<0;
  root.querySelector("[data-dna-creation]").textContent=creationPending
   ? [missing.attr?"Falta um Atributo G1.":"",missing.training?"Falta um Conhecimento ou uma Prática G1.":""].filter(Boolean).join(" ")
   : "";
  if(this.stageName!=="map")return;
  const map=root.querySelector("[data-dna-map]");
  const active=map.ownerDocument.activeElement;
  const mapFocus=map.contains(active)?active.closest("[data-gene-id]")?.dataset:null;
  const nodes=graphicalNodes(system,creationPending,locked);
  window.CodexGeneGraph.render(map,{
   skills:nodes,selected:this.selected,showFuture:true,edit:true,
   onAdjust:(id,delta)=>{
    const row=nodes.find(node=>node.id===id);
    if(!row||(delta>0?!row.canRaise:!row.canLower))return;
    this.selected=id;
    void this.changeGrade(id,delta,row.grade);
   },
   onSelect:id=>{
    this.selected=id;
    this.refresh();
   },
  });
  markRequirements(map,this.selected,system);
  if(mapFocus){
   const card=map.querySelector('.fp-gene-node[data-gene-id="'+CSS.escape(mapFocus.geneId)+'"]');
   const control=mapFocus.geneGrade&&card?.querySelector('[data-gene-grade="'+mapFocus.geneGrade+'"][aria-disabled="false"]');
   (control||card)?.focus({preventScroll:true});
  }
  const detail=root.querySelector("[data-dna-detail]");
  const gradeFocus=detail.contains(active)?active.dataset.delta:null;
  detail.innerHTML=detailMarkup(system,this.selected,{locked,creationPending,requiresApproval:!game.user.isGM&&!creationPending});
  if(gradeFocus)detail.querySelector('[data-delta="'+gradeFocus+'"]:enabled')?.focus({preventScroll:true});
  if(this.selected==="invocacao-elemental"&&system.skills.includes(this.selected)){
   detail.insertAdjacentHTML("beforeend",summoningMarkup(this.summonRules,system));
   const planner=detail.querySelector("[data-summon-plan]");
   if(planner)this.updateSummonPlan(planner);
  }
 }
 updateSummonPlan(planner){
  const inputs=Object.fromEntries([...planner.querySelectorAll("select,input")].map(el=>[el.name,el.value]));
  const count=Number(inputs.count),summary=planner.querySelector("[data-summon-summary]");
  planner.querySelector("[data-summon-split]").hidden=count<=1;
  try{
   if(count>1&&(inputs.life===""||inputs.de===""))throw Error("Informe a Vida total e a DE da ficha da invocação.");
   const de=Number(inputs.de);
   if(count>1&&(!Number.isSafeInteger(de)||de<0))throw Error("Informe uma DE inteira a partir de zero.");
   const plan=summonPlan(this.summonRules,this.actor.system,{...inputs,count,life:Number(inputs.life),de});
   const lines=[plan.xpTotal+" XP próprios · "+plan.courage+" Coragem · "+plan.pp+" PP.",
    plan.dice.rolled+" dado(s) de Atributo, até "+plan.dice.maxKept+" mantido(s). Um turno antecipável e um beneficiário por ação conjunta."];
   if(plan.split)lines.push(plan.split.exact?plan.split.xpPerToken+" XP e "+plan.split.lifePerToken+" Vida por token · DE "+plan.split.defenseDE+" preservada.": "Divisão com restos. A distribuição exige decisão do Narrador.");
   if(plan.stillBody)lines.push("Projeção de Psique: o corpo do conjurador permanece imóvel.");
   if(plan.necromancy)lines.push("Sangue + Trevas: Necromancia.");
   summary.textContent=lines.join(" ");
  }catch(error){summary.textContent=error.message;}
 }
 static stage(_event,target){
  this.stageName=target.dataset.stage;
  this.refresh();
 }
 static buy(){
  return this.submit({action:"advance",advance:{kind:"skill",key:this.selected}});
 }
 static adjustGrade(_event,target){
  return this.changeGrade(this.selected,Number(target.dataset.delta),Number(target.dataset.grade));
 }
 changeGrade(id,delta,expectedGrade){
  const [type,key]=id.split(":");
  return this.submit({action:"advance",advance:{kind:"grade",group:graphGroups[type],key,delta,expectedGrade}});
 }
 static async adjustXP(_event,target){
  if(!game.user.isGM)return;
  const input=this.element.querySelector("[data-dna-xp-amount]");
  const amount=Number(input.value);
  if(!Number.isSafeInteger(amount)||amount<=0){
   ui.notifications.warn("Informe uma quantidade inteira de XP maior que zero.");
   input.focus();
   return;
  }
  const delta=Number(target.dataset.delta)*amount;
  if(await this.submit({action:"adjustXP",delta,expectedXP:this.actor.system.xp}))input.value="";
 }
 async submit(request){
  if(this.busy||this.actor.getFlag(ns,"pendingRoll"))return false;
  this.busy=true;
  const status=this.element?.querySelector("[data-dna-status]");
  const asksNarrator=request.advance?.kind==="grade"&&request.advance.delta===-1&&
   !game.user.isGM&&!this.actor.getFlag(ns,"creationPending");
  if(status&&asksNarrator)status.hidden=false;
  try{
   await requestRoll(this.actor,request);
   return true;
  }catch(error){ui.notifications.warn(error.message);return false;}
  finally{if(status)status.hidden=true;this.busy=false;this.refresh();}
 }
 static async complete(){
  try{
   await requestRoll(this.actor,{action:"completeCreation"});
   await this.close();
   await this.actor.sheet.render({force:true});
  }catch(error){ui.notifications.warn(error.message);}
 }
 static async classic(){
  await this.close();
  await this.actor.sheet.render({force:true});
 }
 async close(options={}){
  if(this.actorHook!=null)Hooks.off("updateActor",this.actorHook);
  this.actorHook=null;
  applications.delete(this.actor.uuid);
  return super.close(options);
 }
}

export async function openCodexDNA(actor,stage="map"){
 if(!actor.isOwner||actor.system.monsterRules||actor.system.animalRules)return;
 try{
  if(!window.CodexGeneGraph)await import("./codex-gene-graph.js");
  const app=applications.get(actor.uuid)??new CodexDNA(actor,stage);
  app.summonRules??=await import("./elemental-summoning.mjs");
  applications.set(actor.uuid,app);
  return await app.render({force:true});
 }catch(error){ui.notifications.error("Codex Genético: "+error.message);}
}
