import {SKILLS, sourceDice, xpLedger} from "./rules.mjs";
import {creationMissing, developmentGroups, gradeDetails, planSkillPackage, skillDetails, skillRefundPlan, xpProgression} from "./advancement.mjs";
import {requestRoll} from "./roll-workflow.mjs";
import {pendingRollFor} from "./roll-resolution.mjs";
import {openSkillDefinition} from './compendium-data.mjs';
import {escapeHTML as esc} from "./roll-engine.mjs";
import {dieSvg} from "./dice-icons.mjs";
import {iconBase,iconMarkup,skillIconId} from "./iconography.mjs";
import {RACES,PURE_ELEMENTS,RUNE_ELEMENTS,usesRacialRules,racialChoicesComplete,racialGrants,allOwnedSkills,skillNameFor,isRuna} from "./races.mjs";

import {canUseTechnique} from "./techniques.mjs";
import {summonPlan} from "./summon-planning.mjs";
import {bardMasteryId,bardRepertoire} from "./bard.mjs";
import {searchSkills, showSkill} from "./skill-catalog.mjs";

const ns="codex-rpg-foundry";
const applications=new Map();
const dateFormat=new Intl.DateTimeFormat("pt-BR",{dateStyle:"short",timeStyle:"short"});
const groups=Object.entries(developmentGroups);
const graphGroups=Object.fromEntries(groups.map(([key,group])=>[group.graph,key]));

function graphicalNodes(system,creationPending,locked,plans){
 const sources=groups.flatMap(([kind,group])=>group.list.map(([key])=>{
  const row=gradeDetails(system,kind,key,creationPending);
  return {
   type:group.graph,id:group.graph+":"+key,key,name:row.name,
   grade:row.grade,previewGrade:row.grade,canRaise:!locked&&row.canBuy,canLower:!locked&&row.canLower,
   xpBand:row.band,
   dice:sourceDice(kind,key,system).map(n=>"d"+n)
  };
 }));
 const skills=SKILLS.filter(row=>showSkill(row,system)).map(skill=>{
  const plan=plans.get(skill.id);
  return {type:"skill",id:skill.id,name:skillNameFor(system,skill),icon:skillIconId(skill.id,skill.family),label:plan.blocker||(plan.cost!=null?plan.cost+" XP":"Adquirida"),
   state:locked&&plan.status!=="owned"?"locked":plan.status};
 });
 return [...sources,...skills];
}

function detailMarkup(system,id,{locked,creationPending,requiresApproval,plan,draftBuilder}){
 const [type,key] = id.split(":");
 const disabled=locked?" disabled":"";
 if(graphGroups[type]){
  const group=graphGroups[type],row=gradeDetails(system,group,key,creationPending);
  const dice=sourceDice(group,key,system).map(sides=>'<span class="codex-small-die">'+dieSvg(sides)+'<b>d'+sides+'</b></span>').join("");
  const band={discount:"XP reduzido",elevated:"XP aumentado"}[row.band];
  const tier=(row.cost!==null?"<p>Próximo Grau · "+row.cost+" XP.</p>":"<p>Grau máximo.</p>")+
   (band?'<p class="codex-racial-'+row.band+'">'+band+' pela origem</p>':'');
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
 if(!plan)return "<p>Selecione uma capacidade do mapa.</p>";
 const row=skillDetails(system,id);
 const granted=racialGrants(system).includes(id)&&!system.skills.includes(id);
 const alternativeMarkup=row.alternatives.map(branch=>"<ul>"+branch.map(item=>
  '<li class="'+(item.met?"met":"unmet")+'">'+(item.met?"✓ ":"○ ")+esc(item.name)+'</li>').join("")+"</ul>").join("<p>ou</p>");
 const packageButton=plan.status==="potential"
  ?'<button type="button" data-action="buyPackage"'+disabled+'>Comprar Perícia + requisitos — '+plan.cost+' XP</button>'
  :'<button type="button" data-action="buy"'+(plan.status!=="available"?" disabled":disabled)+'>Comprar Perícia</button>';
 const refund=plan.status==="owned"||system.skills?.includes(id)?skillRefundPlan(system,id):null;
 const ownedMarkup=granted?'<p>Concedida pela origem · 0 XP</p>':refund?'<p>Adquirida</p><button type="button" data-action="refundSkill"'+
  (refund.blocker?" disabled":disabled)+'>Devolver Perícia — recuperar '+refund.refund+' XP</button>'+
  (refund.blocker?'<p class="codex-dna-note">'+esc(refund.blocker)+'</p>':
   !creationPending?'<p class="codex-dna-note">A devolução exige autorização do Narrador.</p>':""):"";
 const repertoire=id===bardMasteryId?'<section class="codex-bard-repertoire"><h4>Repertório da Maestria</h4><p>'+
  esc(bardRepertoire.summary)+'</p>'+bardRepertoire.effects.map(effect=>
   '<details><summary>'+esc(effect.name)+' <small>'+esc(effect.state)+'</small></summary><p>'+
   esc(effect.description)+'</p>'+(effect.conditions?'<p>'+esc(effect.conditions)+'</p>':'')+'</details>').join('')+'</section>':"";
 const requiredXP=plan.status==="locked"&&plan.cost!=null?" Pacote completo: "+plan.cost+" XP.":"";
 const declared=!draftBuilder&&["sentido-elemental","corpo-fechado","impacto-psiquico"].includes(id)&&canUseTechnique(system,id)
  ?'<button type="button" data-action="declareTechnique"'+(locked||system.courage<1?" disabled":disabled)+'>Declarar efeito (−1 Coragem)</button>':"";
 return '<h3>'+iconMarkup(skillIconId(row.id,row.family))+' '+esc(row.name)+'</h3>'+(granted?'':'<p>'+(row.pending?'XP de aquisição pendente':row.cost+' XP')+'</p>')+'<p>'+esc(row.detail)+'</p>'+
  (alternativeMarkup?'<h4>Requisitos</h4>'+alternativeMarkup:'')+
  '<button type="button" data-action="consultSkill">Consultar no Compendium</button>'+(refund?ownedMarkup:packageButton)+declared+repertoire+
  (plan.blocker?'<p class="codex-dna-note">'+esc(plan.blocker+requiredXP)+'</p>':'')+
  (locked&&plan.status!=="owned"?'<p class="codex-dna-note">Compra indisponível durante uma rolagem ou alteração em andamento.</p>':'');
}

function confirmPackage(plan){
 const list=(title,items)=>items.length?"<p><strong>"+title+"</strong></p><ul>"+
  items.map(line=>"<li>"+esc(line)+"</li>").join("")+"</ul>":"";
 const grades=plan.increases.map(row=>row.name+" G"+row.from+" → G"+row.to);
 const skills=plan.intermediates.map(row=>row.name);
 const alternatives=plan.alternatives.map(row=>row.name+" · "+row.requirements.join(" + "));
 return foundry.applications.api.DialogV2.confirm({
  window:{title:"Comprar Perícia + requisitos"},
  content:"<p><strong>"+esc(plan.name)+"</strong></p>"+
   list("Graus que serão aumentados",grades)+list("Perícias intermediárias",skills)+
   list("Alternativa escolhida",alternatives)+
   "<p>Custo total <strong>"+plan.cost+" XP</strong></p><p>XP disponível "+plan.before+" → "+plan.after+
   " XP</p>",
  yes:{label:"Confirmar compra"},no:{label:"Cancelar"},rejectClose:false,
 });
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
  if(!key)continue;
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
 const skills=allOwnedSkills(system);
 const sizes=optionList(rules.summonableElementalSizes(skills),sizeLabels);
 const elements=optionList(rules.eligibleElementalSkills(skills),elementLabels);
 if(!sizes||!elements)return "";
 const payment='<option value="courage">Coragem</option>';
 const mastery=skills.includes("mestre");
 return '<section class="codex-summon-plan" data-summon-plan><h4>Planejar invocação</h4>'+
  '<label>Porte <select name="size">'+sizes+'</select></label>'+
  '<label>Elemento <select name="first">'+elements+'</select></label>'+
  (mastery&&skills.includes("improviso")?'<label>Segundo elemento <select name="second"><option value="">Nenhum</option>'+elements+'</select></label>':'')+
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
  actions:{draftMode(_event,target){this.listMode=target.dataset.mode==="list";this.refresh();},
   draftSource(_event,target){this.selected=target.dataset.source;this.refresh();},declareTechnique:CodexDNA.declareTechnique,'gene-future'(){this.showFuture=!this.showFuture;this.refresh();},consultSkill(){return openSkillDefinition(this.selected);},stage:CodexDNA.stage,buy:CodexDNA.buy,buyPackage:CodexDNA.buyPackage,refundSkill:CodexDNA.refundSkill,chooseSkill:CodexDNA.chooseSkill,adjustGrade:CodexDNA.adjustGrade,adjustXP:CodexDNA.adjustXP,complete:CodexDNA.complete,classic:CodexDNA.classic,
   saveOrigin:CodexDNA.saveOrigin,resetRuneShield(){return this.submit({action:"resetRuneShield"});},perseverance(){return this.submit({action:"perseverance"});}}
 };
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/dna.hbs"}};

 constructor(actor,stage,host,draftAdvance){
  super(host?{window:{frame:false},position:{width:"auto",height:"auto"},classes:["codex-dna","codex-dna-inline"]}:{});
  this.host=host;
  this.draftAdvance=draftAdvance;
  this.actor=actor;
  this.stageName=stage;
  this.selected="attr:forca";
  this.showFuture=true;
 }
 async _insertElement(element,options){
  if(!this.host)return super._insertElement(element,options);
  this.host()?.append(element);
  // O ator e o Codex têm ações com nomes em comum.
  for(const type of ["click","auxclick"])element.addEventListener(type,event=>event.stopPropagation());
 }
 async _prepareContext(){
  return {embedded:Boolean(this.host),draftBuilder:Boolean(this.draftAdvance),canManageXP:game.user.isGM&&!this.draftAdvance,actorName:this.actor.name,concept:this.actor.system.concept,
   hasOrigin:usesRacialRules(this.actor.system),categories:groups.map(([key,group])=>({label:group.label,description:group.description})),
  };
 }
 async _onRender(context,options){
  await super._onRender(context,options);
  const root=this.element.querySelector(".codex-dna-root");
  root.querySelector("[data-dna-skill-query]").addEventListener("input",()=>this.renderSkillResults(root));
  root.addEventListener("change",async event=>{
   if(event.target.dataset.originRace!==undefined){
    this.originDraft={race:event.target.value,pureElement:"",runeElements:[]};
    this.renderOrigin(root);
    return;
   }
   if(event.target.dataset.originElement!==undefined){
    const system=this.actor.system;
    this.originDraft??={race:system.race,pureElement:system.pureElement,runeElements:[...system.runeElements]};
    if(event.target.dataset.originElement==="pure")this.originDraft.pureElement=event.target.value;
    else this.originDraft.runeElements[Number(event.target.dataset.originElement)]=event.target.value;
    return;
   }
   const planner=event.target.closest("[data-summon-plan]");
   if(planner){this.updateSummonPlan(planner);return;}
   const field=event.target.dataset.identity;
   if(!["name","system.concept"].includes(field)||!this.actor.isOwner)return;
   const value=event.target.value.trim();
   if(field==="name"&&!value){event.target.value=this.actor.name;return;}
   try{await this.actor.update({[field]:value});}catch(error){ui.notifications.error(error.message);}
  });
  if(!this.draftAdvance)this.actorHook??=Hooks.on("updateActor",actor=>{if(actor.uuid===this.actor.uuid)this.refresh();});
  this.refresh();
 }
 refresh(){
  if(!this.rendered)return;
  const root=this.element.querySelector(".codex-dna-root");
  if(!root)return;
  const system=this.actor.system,ledger=xpLedger(system);
  const pendingRoll=Boolean(pendingRollFor(this.actor));
  const locked=pendingRoll||Boolean(this.busy);
  const creationPending=Boolean(this.actor.getFlag(ns,"creationPending"));
  const missing=creationMissing(system);
  if(!this.draftAdvance){
   this.renderOrigin(root);
   root.querySelector("[data-dna-name]").textContent=this.actor.name;
   for(const field of ["formation","additional","grant","spent","left"]){
    root.querySelector('[data-dna-xp="'+field+'"]').textContent=ledger[field]+" XP";
   }
  }
  const progression=xpProgression(system),guidance=root.querySelector("[data-dna-xp-reference]");
  if(guidance){
   guidance.hidden=!progression;
   guidance.textContent=progression?"Nível "+system.level+" · referência "+progression.levelReference+" XP totais · teto "+progression.cap+" XP."+
    (ledger.additional>progression.maxAdditional?" XP legado preservado. Novas concessões bloqueadas.":""):"";
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
  root.querySelector('[data-action="complete"]').hidden=Boolean(this.draftAdvance)||!creationPending;
  root.querySelector('[data-action="complete"]').disabled=locked||missing.attr||missing.training||ledger.left<0||!racialChoicesComplete(system);
  root.querySelector("[data-dna-creation]").textContent=creationPending
   ? [missing.attr?"Falta um Atributo G1.":"",missing.training?"Falta um Conhecimento ou uma Prática G1.":"",
      !racialChoicesComplete(system)?"Complete os elementos da origem.":""].filter(Boolean).join(" ")
   : "";
  if(this.stageName!=="map"||this.host&&!this.element.getClientRects().length)return;
  const map=root.querySelector("[data-dna-map]");
  const active=map.ownerDocument.activeElement;
  const mapFocus=map.contains(active)?active.closest("[data-gene-id]")?.dataset:null;
  this.skillPlans=new Map(SKILLS.filter(row=>showSkill(row,system))
   .map(row=>[row.id,planSkillPackage(system,row.id,{creationPending})]));
  const nodes=graphicalNodes(system,creationPending,locked,this.skillPlans);
  const lists=root.querySelector("[data-dna-draft-lists]");
  if(lists){
   lists.hidden=!this.listMode;
   map.hidden=Boolean(this.listMode);
   for(const button of root.querySelectorAll('[data-action="draftMode"]')){
    button.setAttribute("aria-pressed",String((button.dataset.mode==="list")===Boolean(this.listMode)));
   }
   if(this.listMode)lists.innerHTML=groups.map(([,group])=>
    '<section><h4>'+esc(group.label)+'</h4>'+nodes.filter(node=>node.type===group.graph).map(node=>
    '<button type="button" data-action="draftSource" data-source="'+esc(node.id)+'" aria-pressed="'+
    (node.id===this.selected)+'">'+esc(node.name)+' · G'+node.grade+'</button>').join("")+'</section>').join("");
  }
  if(!this.listMode)window.CodexGeneGraph.render(map,{
   skills:nodes,selected:this.selected,showFuture:this.showFuture,edit:true,iconBase,
   responsiveCamera:Boolean(this.host),
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
  if(!this.listMode)markRequirements(map,this.selected,system);
  this.renderSkillResults(root);
  if(mapFocus){
   const card=map.querySelector('.fp-gene-node[data-gene-id="'+CSS.escape(mapFocus.geneId)+'"]');
   const control=mapFocus.geneGrade&&card?.querySelector('[data-gene-grade="'+mapFocus.geneGrade+'"][aria-disabled="false"]');
   (control||card)?.focus({preventScroll:true});
  }
  const detail=root.querySelector("[data-dna-detail]");
  const gradeFocus=detail.contains(active)?active.dataset.delta:null;
  detail.innerHTML=detailMarkup(system,this.selected,{locked,creationPending,requiresApproval:!game.user.isGM&&!creationPending,plan:this.skillPlans.get(this.selected),draftBuilder:Boolean(this.draftAdvance)});
  if(gradeFocus)detail.querySelector('[data-delta="'+gradeFocus+'"]:enabled')?.focus({preventScroll:true});
  if(!this.draftAdvance&&this.selected==="invocacao-elemental"&&system.skills.includes(this.selected)){
   detail.insertAdjacentHTML("beforeend",summoningMarkup(this.summonRules,system));
   const planner=detail.querySelector("[data-summon-plan]");
   if(planner)this.updateSummonPlan(planner);
  }
 }
 renderSkillResults(root){
  const results=root.querySelector("[data-dna-skill-results]");
  const query=root.querySelector("[data-dna-skill-query]").value.trim();
  results.hidden=!query&&!this.listMode;
  if(!query&&!this.listMode){results.replaceChildren();return;}
  const system=this.actor.system,map=root.querySelector("[data-dna-map]");
  const labels={owned:"Adquirida",available:"Disponível",potential:"Potencial",locked:"Bloqueada"};
  const families=new Map([...map.querySelectorAll(".fp-gene-constellation")].map(el=>
   [el.dataset.geneFamily,el.querySelector(".fp-gene-constellation-title")?.textContent]));
  const items=searchSkills(query,system).map(row=>{
   const node=map.querySelector('.fp-gene-skill[data-gene-id="'+CSS.escape(row.id)+'"]');
   const plan=this.skillPlans?.get(row.id);
   const state=this.listMode?plan?.status??"locked":Object.keys(labels).find(key=>node?.classList.contains("is-"+key))??"locked";
   const granted=racialGrants(system).includes(row.id)&&!system.skills.includes(row.id);
   const cost=granted?0:plan?.cost??row.legacyCost??row.cost;
   const family=families.get(node?.dataset.geneFamily)??(this.listMode?"Perícia":"Outras Perícias");
   return '<button type="button" data-action="chooseSkill" data-key="'+esc(row.id)+'" class="is-'+state+'"'+
    (this.selected===row.id?' aria-current="true"':"")+'><strong>'+esc(skillNameFor(system,row))+'</strong><small>'+
    esc(family)+' · '+(granted?"Origem":labels[state])+' · '+(cost==null?"XP pendente":cost+" XP")+'</small></button>';
  });
  results.innerHTML=items.length?items.join(""):'<p role="status">Nenhuma Perícia corresponde à busca.</p>';
 }
 static chooseSkill(_event,target){
  this.selected=target.dataset.key;
  const selected=this.skillPlans?.get(this.selected);
  if(selected?.status==="locked")this.showFuture=true;
  this.refresh();
  const map=this.element.querySelector("[data-dna-map]");
  if(this.listMode)return;
  window.CodexGeneGraph.reveal(map,this.selected);
  map.querySelector('.fp-gene-skill[data-gene-id="'+CSS.escape(this.selected)+'"]')?.focus({preventScroll:true});
 }
 static async declareTechnique(){
  const kind=this.selected;
  const name=skillDetails(this.actor.system,kind).name;
  const accepted=await foundry.applications.api.DialogV2.confirm({window:{title:name},
   content:"<p>Gastar 1 Coragem para declarar a técnica? A mesa resolve o efeito.</p>",rejectClose:false});
  if(accepted)await this.submit({action:"declareTechnique",kind});
 }
 static refundSkill(){
  const plan=skillRefundPlan(this.actor.system,this.selected);
  if(plan.blocker){ui.notifications.warn(plan.blocker);return;}
  const request={action:"advance",advance:{kind:"skill",key:this.selected,remove:true,expectedRefund:plan.refund}};
  const creation=this.actor.getFlag(ns,"creationPending");
  const confirmation=!game.user.isGM||creation?()=>foundry.applications.api.DialogV2.confirm({
   window:{title:"Devolver Perícia"},rejectClose:false,
   content:"<p>Devolver "+esc(plan.name)+" e recuperar "+plan.refund+" XP?</p>"+
    "<p>Os graus e as outras Perícias permanecem na ficha.</p>",
   yes:{label:"Confirmar devolução"},no:{label:"Cancelar"},
  }):undefined;
  return this.submit(request,confirmation);
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
   const lines=[plan.xpTotal+" XP próprios · "+plan.courage+" Coragem.",
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
 renderOrigin(root){
  const panel=root.querySelector("[data-dna-origin]");
  if(!panel)return;
  const system=this.actor.system;
  const stored={race:system.race,pureElement:system.pureElement,runeElements:[...system.runeElements]};
  const draft=this.originDraft??stored;
  const locked=Boolean(this.busy||pendingRollFor(this.actor));
  const canEdit=game.user.isGM||Boolean(this.actor.getFlag(ns,"creationPending"));
  const choices=(list,current)=>'<option value="">Escolha</option>'+list.map(([id,name])=>
   '<option value="'+esc(id)+'"'+(current===id?" selected":"")+'>'+esc(name)+'</option>').join("");
  const meta=Object.hasOwn(RACES,draft.race)?RACES[draft.race]:null;
  const field=(id,label,list,value)=>'<label>'+label+'<select data-origin-element="'+id+'">'+choices(list,value)+'</select></label>';
  const elements=draft.race==="lucker_puro"?field("pure","Elemento inicial",PURE_ELEMENTS,draft.pureElement):
   draft.race==="runa_espinhos"?field(0,"Elemento inicial",RUNE_ELEMENTS,draft.runeElements[0]):"";
  const favors=meta?.favored.map(key=>gradeDetails(system,"attribute",key).name)??[];
  const notice=favors.length?'<p>G1 gratuito · '+esc(favors.join(" e "))+'</p>':"";
  panel.innerHTML=(canEdit?'<fieldset'+(locked?" disabled":"")+'><legend>Origem / Raça</legend>'+
   '<label>Linhagem<select data-origin-race>'+choices(Object.entries(RACES).map(([id,row])=>[id,row.name]),draft.race)+'</select></label>'+
   elements+'<button type="button" data-action="saveOrigin">Salvar origem</button></fieldset>':
   '<p><strong>Origem / Raça · '+esc(meta?.name??"A definir com o Narrador")+'</strong></p>')+
   (meta?'<p>'+esc(meta.description)+'</p>'+notice:"")+
   (stored.race==="humano"?'<button type="button" data-action="perseverance"'+(locked||system.perseverancaUsed?" disabled":"")+
    '>'+ (system.perseverancaUsed?"Perseverança usada":"Marcar uso da Perseverança")+'</button>':"")+
   (isRuna(system)?'<p><strong>Escudo Rúnico</strong> · '+(system.runeShieldFreeUsed?"Uso diário gasto. Próxima ativação custa 1 Coragem.":"Uma ativação gratuita disponível.")+'</p>'+
    (game.user.isGM&&system.runeShieldFreeUsed?'<button type="button" data-action="resetRuneShield"'+(locked?" disabled":"")+'>Renovar uso diário</button>':""):"");
 }
 static async saveOrigin(){
  const root=this.element.querySelector(".codex-dna-root");
  const race=root.querySelector("[data-origin-race]")?.value;
  if(!Object.hasOwn(RACES,race))return ui.notifications.warn("Escolha uma origem.");
  const pureElement=root.querySelector('[data-origin-element="pure"]')?.value;
  const runeElements=[...root.querySelectorAll('[data-origin-element="0"]')].map(el=>el.value);
  if(await this.submit({action:"origin",race,pureElement,runeElements})){
   this.originDraft=null;
   this.refresh();
  }
 }
 static buy(){
  return this.submit({action:"advance",advance:{kind:"skill",key:this.selected}});
 }
 static buyPackage(){
  const plan=this.skillPlans?.get(this.selected);
  if(plan?.status!=="potential")return;
  return this.submit({action:"advance",advance:{kind:"skillPackage",key:this.selected,expectedPlan:plan.quote}},
   ()=>confirmPackage(plan));
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
 async submit(request,confirmation){
  if(this.busy||pendingRollFor(this.actor))return false;
  this.busy=true;
  const status=this.element?.querySelector("[data-dna-status]");
  const asksNarrator=(request.advance?.delta===-1||request.advance?.remove===true)&&
   !game.user.isGM&&!this.actor.getFlag(ns,"creationPending");
  try{
   if(confirmation&&!await confirmation())return false;
   if(status&&asksNarrator)status.hidden=false;
   if(this.draftAdvance){
    if(request.action!=="advance")return false;
    this.draftAdvance(request.advance);
   }else await requestRoll(this.actor,request);
   return true;
  }catch(error){ui.notifications.warn(error.message);return false;}
  finally{if(status)status.hidden=true;this.busy=false;this.refresh();}
 }
 static async complete(){
  try{
   await requestRoll(this.actor,{action:"completeCreation"});
   if(this.host){
    this.refresh();
    return;
   }
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
  if(applications.get(this.actor.uuid)===this)applications.delete(this.actor.uuid);
  return super.close(options);
 }
}

export async function embedDraftDNA(actor,host,advance){
 if(!window.CodexGeneGraph)await import("./codex-gene-graph.js");
 return new CodexDNA(actor,"map",host,advance).render({force:true});
}

export async function embedCodexDNA(actor,host){
 if(!window.CodexGeneGraph)await import("./codex-gene-graph.js");
 const app=new CodexDNA(actor, actor.getFlag(ns,"creationPending")?"identity":"map",host);
 app.summonRules=await import("./elemental-summoning.mjs");
 return app.render({force:true});
}

export async function openCodexDNA(actor,stage="map"){
 if(!actor.isOwner||actor.system.monsterRules||actor.system.animalRules)return;
 try{
  if(!window.CodexGeneGraph)await import("./codex-gene-graph.js");
  const app=applications.get(actor.uuid)??new CodexDNA(actor,stage);
  app.stageName=stage;
  app.summonRules??=await import("./elemental-summoning.mjs");
  applications.set(actor.uuid,app);
  return await app.render({force:true});
 }catch(error){ui.notifications.error("Codex Genético: "+error.message);}
}
