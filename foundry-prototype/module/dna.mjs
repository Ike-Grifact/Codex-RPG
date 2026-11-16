import {SKILLS, sourceDice, xpLedger} from "./rules.mjs";
import {creationMissing, developmentGroups, gradeDetails, skillDetails} from "./advancement.mjs";
import {requestRoll} from "./roll-workflow.mjs";
import {escapeHTML as esc} from "./roll-engine.mjs";
import {dieSvg} from "./dice-icons.mjs";

import {summonPlan} from "./summon-planning.mjs";
import {showSkill} from "./skill-catalog.mjs";

const ns="codex-rpg-foundry";
const applications=new Map();
const groups=Object.entries(developmentGroups);
const graphGroups=Object.fromEntries(groups.map(([key,group])=>[group.graph,key]));

function graphicalNodes(system){
 const sources=groups.flatMap(([kind,group])=>group.list.map(([key,name])=>({
  type:group.graph, id:group.graph+":"+key, key, name,
  grade:system[group.field]?.[key]??0, dice:sourceDice(kind,key,system).map(n=>"d"+n)
 })));
 const skills=SKILLS.filter(row=>showSkill(row,system)).map(skill=>{
  const row=skillDetails(system,skill.id);
  return {type:"skill",id:skill.id,name:row.name,label:row.blocker||row.cost+" XP",
   state:row.owned?"owned":row.canBuy?"available":!row.pending&&row.affordable&&!row.met?"potential":"locked"};
 });
 return [...sources,...skills];
}

function detailMarkup(system,id,pendingRoll){
 const [type,key] = id.split(":");
 const disabled=pendingRoll?" disabled":"";
 if(graphGroups[type]){
  const group=graphGroups[type],row=gradeDetails(system,group,key);
  const dice=sourceDice(group,key,system).map(sides=>'<span class="codex-small-die">'+dieSvg(sides)+'<b>d'+sides+'</b></span>').join("");
  const tier=row.cost!==null?"<p>Próximo Grau: "+row.cost+" XP.</p>":"<p>Grau máximo.</p>";
  const upgrade=row.cost!==null?'<button type="button" data-action="buy"'+(!row.canBuy?" disabled":disabled)+'>Comprar Grau '+(row.grade+1)+'</button>':"";
  return '<h3>'+esc(row.name)+'</h3><p>Grau '+row.grade+'</p><div class="codex-dice-strip">'+dice+'</div>'+tier+upgrade+
   (row.cost!==null&&!row.canBuy?"<p>XP insuficiente.</p>":"");
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
  actions:{stage:CodexDNA.stage,buy:CodexDNA.buy,complete:CodexDNA.complete,classic:CodexDNA.classic}
 };
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/dna.hbs"}};

 constructor(actor,stage){
  super();
  this.actor=actor;
  this.stageName=stage;
  this.selected="attr:forca";
 }
 async _prepareContext(){
  return {actorName:this.actor.name,concept:this.actor.system.concept,origin:this.actor.system.origin,
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
  const creationPending=Boolean(this.actor.getFlag(ns,"creationPending"));
  const missing=creationMissing(system);
  root.querySelector("[data-dna-name]").textContent=this.actor.name;
  root.querySelector("[data-dna-budget]").textContent=ledger.spent+" XP gastos · "+ledger.left+" XP disponíveis";
  for(const stage of root.querySelectorAll("[data-dna-panel]"))stage.hidden=stage.dataset.dnaPanel!==this.stageName;
  for(const element of root.querySelectorAll('[data-action="stage"]'))element.setAttribute("aria-pressed",String(element.dataset.stage===this.stageName));
  root.querySelector('[data-action="complete"]').hidden=!creationPending;
  root.querySelector('[data-action="complete"]').disabled=missing.attr||missing.training||ledger.left<0;
  root.querySelector("[data-dna-creation]").textContent=creationPending
   ? [missing.attr?"Falta um Atributo G1.":"",missing.training?"Falta um Conhecimento ou uma Prática G1.":""].filter(Boolean).join(" ")
   : "";
  if(this.stageName!=="map")return;
  const map=root.querySelector("[data-dna-map]");
  const focused=map.contains(map.ownerDocument.activeElement);
  window.CodexGeneGraph.render(map,{
   skills:graphicalNodes(system),selected:this.selected,showFuture:true,onSelect:id=>{
    this.selected=id;
    this.refresh();
   },
  });
  markRequirements(map,this.selected,system);
  if(focused)map.querySelector('[data-gene-id="'+CSS.escape(this.selected)+'"]')?.focus({preventScroll:true});
  const detail=root.querySelector("[data-dna-detail]");
  detail.innerHTML=detailMarkup(system,this.selected,pendingRoll);
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
 static async buy(){
  if(this.busy)return;
  this.busy=true;
  try{
   const [type,key]=this.selected.split(":");
   const group=graphGroups[type];
   const advance=group?{kind:"grade",group,key,delta:1}:{kind:"skill",key:this.selected};
   await requestRoll(this.actor,{action:"advance",advance});
  }catch(error){ui.notifications.warn(error.message);}
  finally{this.busy=false;this.refresh();}
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
