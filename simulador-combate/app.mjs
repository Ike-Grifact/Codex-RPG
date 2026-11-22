/* Codex RPG — Comparador de combate sem tabuleiro, com dados das fichas e alterações locais. */
import {normalizeCombatant,listBrowserSheets,combatantSheetData,combatHealth,boostCombatSource,rollProvenance,selectedActiveSkill,defense,armorOf,equippedWeapons,weightAffinity,lifeAtFive,transferPavor,updateResource,weightUsed}
 from "./comparador-logic.mjs?v=20261122-playtest-v2";
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,isHumanoidKind,stats} from "../criar-conflito/rules.mjs";
import {composeActionPool,rollCreatureFaces,previewHumanoidRoll,previewCreatureRoll} from "../criar-conflito/roll-engine.mjs";
import {resolveRoll,keepLimit,MAGIC_GRADE_DICE,maxCourage,monsterCap,narratorCap,faceSymbols} from "../criar-conflito/codex-rules.mjs";

const SAVE="codex-rpg-comparador-v1",MAX=36,$=key=>document.getElementById(key);
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const unique=()=>globalThis.crypto?.randomUUID?.()||"c-"+Date.now()+"-"+Math.random().toString(36).slice(2);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):min));
const catalog=()=>Array.isArray(window.CODEX_G1_CATALOG)?window.CODEX_G1_CATALOG:[];
const sources={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES};
function empty(){return {version:1,round:1,combatants:[],actor:"",target:"",resourceActor:"",publicPavor:0,history:[]};}
function load(){
 try{
  const data=JSON.parse(localStorage.getItem(SAVE)||"null");
  if(data?.version!==1)return empty();
  return {...empty(),round:Math.floor(clamp(data.round,1,9999)),
   combatants:(Array.isArray(data.combatants)?data.combatants:[]).slice(0,MAX)
    .filter(x=>x&&x.name&&["jogadores","inimigos"].includes(x.side))
    .map(x=>normalizeCombatant(x,x.side,x.source||"comparador")),
   actor:String(data.actor||""),target:String(data.target||""),
   resourceActor:String(data.resourceActor||""),
   publicPavor:Math.floor(clamp(data.publicPavor,0,100)),
   history:(Array.isArray(data.history)?data.history:[]).slice(0,350),
   lastResult:data.lastResult&&typeof data.lastResult==="object"?data.lastResult:null};
 }catch{return empty();}
}
let state=load(),available=[],pending=null,last=state.lastResult||null,lastActor="",toastTimer,inspectingId="";
const byId=id=>state.combatants.find(x=>x.id===id)||null;
const actor=()=>byId(state.actor),target=()=>byId(state.target);
function notice(msg){const el=$("notice");el.textContent=msg;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,4500);}
function persist(){try{state.lastResult=last;localStorage.setItem(SAVE,JSON.stringify(state));}catch(e){notice("Não foi possível salvar o combate: "+e.message);}}
function log(kind,message,data={}){
 state.history.unshift({id:unique(),at:new Date().toISOString(),round:state.round,kind,message,...data});
 state.history=state.history.slice(0,350);
}
function add(raw,side,source){
 if(state.combatants.length>=MAX)return false;
 const item=normalizeCombatant(raw,side,source);
 item.id=unique();item.sourceId=String(raw.sourceId||raw.id||"");item.acted=false;
 state.combatants.push(item);
 if(!state.actor&&side==="jogadores")state.actor=item.id;
 if(!state.target&&side==="inimigos")state.target=item.id;
 if(!state.resourceActor)state.resourceActor=item.id;
 return true;
}
function scan(){
 available=listBrowserSheets(localStorage);
 $("available").innerHTML=available.length?available.map((x,i)=>
  '<option value="'+i+'">'+esc(x.name)+' · '+esc(x.source)+'</option>').join(""):
  '<option value="">Nenhuma ficha encontrada</option>';
 $("available-info").textContent=available.length?
  available.length+" fichas neste navegador. Adicione uma cópia ao confronto sem alterar a ficha original.":
  "Não há fichas neste navegador e endereço. Crie fichas no Criador ou importe JSON.";
}
function addSelected(side){
 const previousTarget=state.target;
 const profile=available[Number($("available").value)];
 if(!profile)return notice("Selecione uma ficha.");
 if(!add(profile.raw,side,profile.source))return notice("Limite de "+MAX+" fichas.");
 log("importação",profile.name+" entrou do "+profile.source+".");persist();render();
 if(!previousTarget&&target())$("difficulty").value=String(defense(target()));
}
function selectOptions(rows,value){
 return '<option value="">Selecione</option>'+rows.map(x=>'<option value="'+esc(x.id)+'"'+(x.id===value?" selected":"")+
  '>'+esc(x.name)+' ('+(x.side==="jogadores"?"J":"I")+')</option>').join("");
}
function rosterSide(side){
 const cards=state.combatants.filter(x=>x.side===side);
 return cards.length?cards.map(c=>{
  const armor=armorOf(c);
  return '<article class="cc-card'+(c.id===state.actor?" cc-attacker":"")+(c.id===state.target?" cc-target":"")+'">'+
   '<div class="cc-card-title"><strong>'+esc(c.name)+'</strong><small>'+esc(c.source||"Local")+'</small></div>'+
   '<div class="cc-card-stats"><span>DE '+defense(c)+'</span><span>Vida '+c.life+' · '+esc(combatHealth(c).id)+'</span>'+
   '<span>Coragem '+c.courage+'</span><span>Pavor '+c.pavorLocal+'/'+monsterCap(c.threatGrade)+' · G'+c.threatGrade+'</span><span>Integridade '+
   (armor?armor.integrity+"/"+armor.integrityMax:"—")+'</span></div>'+
   (c.acted?'<small class="cc-used">Já agiu nesta rodada</small>':'')+
   '<div class="cc-card-actions"><button type="button" data-inspect="'+esc(c.id)+'">Ver ficha</button>'+
   '<button type="button" data-actor="'+esc(c.id)+'">Atacar</button>'+
   '<button type="button" data-target="'+esc(c.id)+'">Alvo</button>'+
   '<button type="button" data-remove="'+esc(c.id)+'">Retirar</button></div></article>';
 }).join(""):'<p class="cc-help">Nenhum combatente.</p>';
}
function sheetGrades(title,rows){
 return '<section class="cc-sheet-block"><h3>'+esc(title)+'</h3><div class="cc-sheet-grades">'+rows.map(row=>
  '<div class="cc-sheet-grade'+(row.grade>0?' is-trained':'')+'"><span>'+esc(row.name)+
  '</span><strong>G'+row.grade+'</strong></div>').join("")+'</div></section>';
}
function renderCombatantSheet(c){
 const s=combatantSheetData(c);
 const advance=s.human?(s.advancedReady?'Adquirida · Disciplina G'+s.disciplineGrade:
  s.advancedDiscipline?'Registrada, mas requer Disciplina G2; atual G'+s.disciplineGrade:
  'Não adquirida'):'Não se aplica à ficha de criatura';
 const skills=s.human?(s.skills.length?s.skills.map(skill=>
  '<details class="cc-sheet-skill"><summary>'+esc(skill.name)+'</summary><p>'+
  esc(skill.detail)+'</p></details>').join(""):
  '<p class="cc-help">Nenhuma Perícia adquirida nesta cópia da ficha.</p>'):
  '<p class="cc-help">Criaturas/monstros deste tipo usam Atributos e não compram Perícias na ficha.</p>';
 const itemKinds={armor:"Armadura",shield:"Escudo",weapon:"Arma",firearm:"Arma de fogo",
  focus:"Foco",kit:"Kit",other:"Item"};
 const items=s.items.length?s.items.map(it=>
  '<div class="cc-sheet-item"><strong>'+esc(it.name)+'</strong><span>'+
  esc(itemKinds[it.kind]||"Item")+' · G'+Number(it.grade||1)+' · '+
  (it.equipped?'Equipado':'No inventário')+
  (it.integrityMax>0?' · Integridade '+it.integrity+'/'+it.integrityMax:'')+
  (it.die?' · d'+it.die:'')+'</span></div>').join(""):
  '<p class="cc-help">Nenhum equipamento registrado nesta cópia.</p>';
 $("combatant-sheet-title").textContent=s.name;
 $("combatant-sheet-content").innerHTML=
  '<p class="cc-sheet-origin">'+esc(s.kindName)+' · '+esc(s.source)+
  ' · '+(s.human?'Nível '+s.level+' · ':'')+'Grau da ameaça '+s.threatGrade+'</p>'+
  '<p class="cc-help">Cópia armazenada no confronto. A consulta não modifica a ficha original; alterações feitas no editor de origem não atualizam automaticamente esta cópia.</p>'+
  (s.concept?'<p class="cc-sheet-notes"><strong>Conceito / origem:</strong> '+esc(s.concept)+'</p>':'')+
  '<div class="cc-sheet-stats"><span>Vida: <strong>'+c.life+'</strong></span>'+
  '<span>DE: <strong>'+defense(c)+'</strong></span>'+
  '<span>Coragem: <strong>'+c.courage+'</strong></span>'+
  '<span>Pavor: <strong>'+c.pavorLocal+'</strong></span></div>'+
  '<section class="cc-sheet-block"><h3>Habilitação da terceira fonte</h3>'+
  '<p><strong>Disciplina Avançada:</strong> '+esc(advance)+'.</p>'+
  (s.human?'<p class="cc-help">A terceira fonte de uma ação com Disciplina exige a Perícia, Disciplina G2 e pertinência confirmada pelo Narrador.</p>':'')+
  '</section>'+
  sheetGrades("Atributos",s.attributes)+
  (s.human?sheetGrades("Conhecimentos",s.knowledges)+sheetGrades("Práticas",s.practices):'')+
  '<section class="cc-sheet-block"><h3>Perícias adquiridas ('+s.skills.length+')</h3>'+skills+'</section>'+
  '<section class="cc-sheet-block"><h3>Equipamentos ('+s.items.length+')</h3><div class="cc-sheet-items">'+items+'</div></section>'+
  (s.abilities?'<section class="cc-sheet-block"><h3>Capacidades especiais / imunidades</h3><p class="cc-sheet-notes">'+esc(s.abilities)+'</p></section>':'')+
  (s.notes?'<section class="cc-sheet-block"><h3>Anotações da ficha</h3><p class="cc-sheet-notes">'+esc(s.notes)+'</p></section>':'');
}
function openCombatantSheet(id){
 const c=byId(id);
 if(!c)return notice("Escolha um combatente para consultar.");
 inspectingId=id;renderCombatantSheet(c);
 const dialog=$("combatant-sheet");
 if(!dialog.open)dialog.showModal();
}

function renderRoster(){
 $("allies").innerHTML=rosterSide("jogadores");$("enemies").innerHTML=rosterSide("inimigos");
 $("round").textContent="Rodada "+state.round;
 $("counter").textContent=state.combatants.length+" combatentes";
 const playerCount=state.combatants.filter(x=>x.side==="jogadores").length;
 const remaining=state.combatants.filter(x=>x.side==="jogadores"&&!x.acted).length;
 $("opportunity").textContent=playerCount&&!remaining?
  "Todos os jogadores agiram: oportunidade dos inimigos.":"Jogadores ainda disponíveis: "+remaining;
 $("public-pavor-label").textContent="Pavor público: "+state.publicPavor+"/"+narratorCap(playerCount);
}
function renderChoices(){
 $("actor").innerHTML=selectOptions(state.combatants,state.actor);
 $("target").innerHTML=selectOptions(state.combatants,state.target);
 $("resource-actor").innerHTML=selectOptions(state.combatants,state.resourceActor);
 $("actor-name").textContent=actor()?.name||"—";
 $("target-name").textContent=target()?.name||"—";
}
function armorText(t){
 const a=armorOf(t);return a?esc(a.name)+" ("+a.integrity+"/"+a.integrityMax+")":"Nenhuma equipada";
}
function renderTarget(){
 const t=target();
 $("target-info").textContent=t?
  "DE "+defense(t)+" · armadura "+(armorOf(t)?.name||"nenhuma")+
  " · Vida "+t.life+". Alcance e linha de visão são decisões da mesa, sem mapa.":
  "Escolha um alvo.";
 renderAffinity();
}
function renderResources(){
 const c=byId(state.resourceActor);
 if(!c){$("resource-summary").textContent="Escolha uma ficha.";return;}
 $("resource-summary").innerHTML='<strong>'+esc(c.name)+'</strong><div class="cc-card-stats">'+
  '<span>Vida '+c.life+'</span><span>DE '+defense(c)+'</span>'+
  '<span>Coragem '+c.courage+'/'+maxCourage(c.level)+'</span>'+
  '<span>P local '+c.pavorLocal+'/'+monsterCap(c.threatGrade)+'</span></div><p>Armadura: '+armorText(c)+'</p>';
 const elig=c.items.filter(x=>["armor","shield"].includes(x.kind)),previous=$("resource-item").value;
 $("resource-item").innerHTML=elig.length?elig.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+
  ' · '+x.integrity+'/'+x.integrityMax+'</option>').join(""):'<option value="">Nenhum equipamento</option>';
 if(elig.some(x=>x.id===previous))$("resource-item").value=previous;
 $("resource-item").disabled=$("resource-kind").value!=="integridade";
}
function renderHistory(){
 $("history").innerHTML=state.history.length?state.history.slice(0,100).map(x=>
  '<article class="cc-event"><small>R'+x.round+' · '+esc((x.at||"").slice(11,16))+'</small>'+
  '<strong>'+esc(x.kind)+'</strong><span>'+esc(x.message)+'</span></article>').join(""):
  '<p class="cc-help">Nenhuma ação registrada.</p>';
}
function renderLast(){
 if(!last){
  $("last-action").textContent="Nenhuma rolagem confirmada.";
  $("apply-integrity").disabled=true;$("apply-life").disabled=true;return;
 }
 const t=byId(last.target),a=armorOf(t);
 $("apply-integrity").disabled=!(a&&last.integrityDamage>0&&!last.integrityApplied);
 $("apply-life").disabled=!!(a||last.lifeDamage!==2||last.lifeApplied);
 $("last-action").innerHTML='<strong>'+esc(last.name)+' contra '+esc(t?.name||last.targetName)+'</strong>'+
  '<p>'+last.e+'E + '+last.p+'P · DE '+last.de+' · '+esc(last.outcome)+'</p>'+
  '<p>Dano à Integridade: '+(a?last.integrityDamage:"sem armadura")+
  ' · Dano à Vida por 5 pontos: '+(!a&&last.lifeDamage===2?"2":"não automático")+'</p>'+
  '<small>'+(last.integrityApplied?"Integridade aplicada. ":"")+(last.lifeApplied?"Vida aplicada. ":"")+
  'Nenhum dano excedente ou efeito especial é aplicado automaticamente.</small>';
}
function render(refresh=true){
 renderRoster();renderChoices();
 if(refresh){lastActor="";renderSources();}
 renderTarget();renderResources();renderHistory();renderLast();renderDice();
 if(inspectingId&&$("combatant-sheet").open){
  const c=byId(inspectingId);
  if(c)renderCombatantSheet(c);else $("combatant-sheet").close();
 }
}

function renderSources(){
 const a=actor();
 if(lastActor===a?.id)return;
 lastActor=a?.id||"";
 const human=isHumanoidKind(a?.kind),base=[];
 if(a){
  if(human)for(const g of ["practice","knowledge"]){
   const field=g==="practice"?"practices":"knowledges";
   for(const [key,name] of sources[g])if(Number(a[field]?.[key])>0)
    base.push({value:g+":"+key,label:name+" G"+a[field][key]});
  }else for(const [key,name] of ATTRIBUTES)if(Number(a.attributes?.[key])>0)
    base.push({value:"attribute:"+key,label:name+" G"+a.attributes[key]});
 }
 $("base-source").innerHTML=base.length?base.map(x=>'<option value="'+esc(x.value)+'">'+esc(x.label)+'</option>').join(""):
  '<option value="">Nenhuma fonte adquirida</option>';
 const attrs=a?ATTRIBUTES.filter(([key])=>Number(a.attributes?.[key])>0):[];
 $("attribute-source").innerHTML=attrs.length?attrs.map(([key,name])=>'<option value="'+key+'">'+
  esc(name)+" G"+a.attributes[key]+'</option>').join(""):'<option value="">Sem Atributo</option>';
 const extras=[];
 if(a)for(const g of ["attribute","practice","knowledge"]){
  const field={attribute:"attributes",practice:"practices",knowledge:"knowledges"}[g];
  for(const [key,name] of sources[g])if(Number(a[field]?.[key])>0)
   extras.push({value:g+":"+key,label:name+" G"+a[field][key]});
 }
 $("extra-source").innerHTML='<option value="">Sem terceira fonte</option>'+extras.map(x=>
  '<option value="'+x.value+'">'+esc(x.label)+'</option>').join("");
 $("discipline-mode").value=human&&a?.skills.includes("criar-item-foco-magia")?"conjuracao":
  human&&a?.practices?.armas_conjuracao>0?"armas":"normal";
 $("spell-grade").value="1";$("extra-keep").checked=false;$("context-approved").checked=false;
 renderWeapons();
 renderStepChoices();renderCombatControls();
}
function renderStepChoices(){
 const a=actor(),prev=$("step-source").value;
 const keys=[String($("base-source").value||""),
  $("attribute-source").value?"attribute:"+$("attribute-source").value:"",
  String($("extra-source").value||"")].filter(Boolean);
 const distinct=[...new Set(keys)],opts=distinct.map(value=>{
  const [group,key]=value.split(":");
  const field={attribute:"attributes",practice:"practices",knowledge:"knowledges"}[group];
  const grade=Number(a?.[field]?.[key]??-1);
  const label=sources[group]?.find(x=>x[0]===key)?.[1];
  return grade>=0&&grade<6&&label?{value,label:label+" G"+grade+" → G"+(grade+1)}:null;
 }).filter(Boolean);
 $("step-source").innerHTML='<option value="">Não elevar</option>'+opts.map(x=>
  '<option value="'+esc(x.value)+'">'+esc(x.label)+'</option>').join("");
 if(opts.some(x=>x.value===prev))$("step-source").value=prev;
}
function renderCombatControls(){
 const a=actor();if(!a)return;
 const cap=a.kind==="monstro"?stats(a).keepMax:0;
 $("monster-keep").disabled=a.kind!=="monstro";
 $("monster-keep").innerHTML=a.kind==="monstro"?
  Array.from({length:Math.max(0,cap-1)},(_,i)=>i+2).map(n=>
   '<option value="'+n+'"'+(a.keep===n?' selected':'')+'>'+n+' dados</option>').join(""):
  '<option value="2">Apenas monstros</option>';
 const capP=monsterCap(a.threatGrade);
 const natural=a.kind==="monstro"?2:a.side==="inimigos"?(a.threatGrade>=2?3:2):
  (a.level>=6?3:2);
 const maximum=a.kind==="monstro"?cap:a.side==="inimigos"?Math.min(4,natural+1):
  Math.min(4,natural+1);
 $("marco-info").textContent="Retenção: "+natural+" dados sem gasto; máximo "+maximum+
  " com recursos disponíveis. "+(a.kind==="monstro"?"Monstro usa Pavor local: +1P por dado acima de 2. ":
  "Humanoides usam Coragem na retenção adicional. ")+
  "Reserva local G"+a.threatGrade+": "+a.pavorLocal+"/"+capP+" P (G1 4P, +1 por Grau até 8P).";
 const health=combatHealth(a);
 $("health-info").textContent="Saúde: "+health.id+" · Vida "+a.life+
  " · modificadores "+(health.e||0)+"E, "+(health.a||0)+"A, "+(health.p||0)+
  "P · custo para agir "+(health.coragem===null?"indisponível":health.coragem+" Coragem")+
  (a.kind==="monstro"&&health.coragem>0?
   ". Em monstros sem reserva de Coragem, o custo para agir exige decisão manual; penalidades de símbolos são aplicadas.":"");
 const previous=$("active-skill").value;
 const purchased=a.skills||[];
 const rows=purchased.map(id=>selectedActiveSkill(a,id)).filter(Boolean);
 $("active-skill").innerHTML='<option value="">Sem ativação adicional</option>'+
  rows.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.name)+'</option>').join("");
 if(rows.some(r=>r.id===previous))$("active-skill").value=previous;
 if(!rows.some(r=>r.id===previous)){$("skill-courage").value="0";$("skill-approved").checked=false;}
 updateSkillInfo();
}
function updateSkillInfo(){
 const skill=selectedActiveSkill(actor(),$("active-skill").value);
 const cost=$("skill-courage").value;
 $("skill-info").textContent=skill?
  skill.name+": "+skill.detail+" | Coragem declarada: "+cost+
  ". Confira a ativação; o efeito narrativo deve ser aplicado pelo Narrador.":
  "Selecione uma Perícia adquirida. O custo só é descontado ao confirmar a rolagem e seus efeitos não são automatizados.";
}

function renderWeapons(){
 const a=actor(),weapons=a?equippedWeapons(a,catalog()):[],old=$("weapon-source").value;
 $("weapon-source").innerHTML='<option value="">Sem dado de arma</option>'+weapons.map(w=>
  '<option value="'+esc(w.id)+'"'+(w.eligible?"":" disabled")+'>'+esc(w.name)+
  ' · '+(w.die?"d"+w.die:"dado não cadastrado")+
  (w.eligible?"":" · requer "+esc(w.skill))+'</option>').join("");
 if(weapons.some(w=>w.id===old&&w.eligible))$("weapon-source").value=old;
 else $("weapon-source").value=weapons.find(w=>w.eligible)?.id||"";
 renderAffinity();
}
function chosenWeapon(){
 return equippedWeapons(actor(),catalog()).find(w=>w.id===$("weapon-source").value)||null;
}
function renderAffinity(){
 const hint=weightAffinity(chosenWeapon(),target(),actor());
 $("weight-affinity").textContent="Comparação por peso: "+hint.description+" A afinidade será aplicada na rolagem quando definida. Carga física do atacante: "+
  (actor()?weightUsed(actor()).toFixed(3):"—")+
  ". A categoria da armadura equipada determina a afinidade defensiva.";
 return hint;
}
function options(){
 return {de:Number($("difficulty").value),situation:$("situation").value,extraKeep:$("extra-keep").checked,
  cancelP:Number($("cancel-p").value),convertPairs:Number($("convert-a").value)};
}
function evaluate(a,rolled,kept,opts){
 const health=combatHealth(a),t=byId(pending?.target);
 const weapon=pending?.weaponId?equippedWeapons(a,catalog()).find(w=>w.id===pending.weaponId):null;
 const affinity=weightAffinity(weapon,t,a),weight=affinity.status==="known"?affinity.delta:0;
 const stealth=!!(a.skills?.includes("furtividade")&&pending?.baseGroup==="practice"&&pending?.baseKey==="furtividade");
 const conf={...opts,weight,bonusA:health.a+Number(stealth),bonusP:health.p,
  skillBonusE:health.e,stepDieId:pending?.boosted||""};
 let pre;
 if(a.kind==="monstro")pre=previewCreatureRoll(a,rolled,kept,conf);
 else if(a.side==="inimigos"&&isHumanoidKind(a.kind))pre=previewHumanoidRoll(a,rolled,kept,conf);
 else {
  const r=resolveRoll(rolled,kept,{de:conf.de,situation:conf.situation,level:a.level,
   extraKeep:conf.extraKeep,courage:a.courage,cancelP:conf.cancelP,convertPairs:conf.convertPairs,
   weight:conf.weight,bonusA:conf.bonusA,bonusP:conf.bonusP,skillBonusE:conf.skillBonusE});
  if(!r.ok)return {ok:false,error:r.errors.join("; ")};
  const free=keepLimit(a.level,false,false);
  pre={ok:true,result:r,cost:0,courageCost:Number(opts.extraKeep&&kept.length>free)};
 }
 return {...pre,health,affinity,stealth};
}
function preview(){
 if(!pending)return {ok:false,error:"Não existem dados rolados."};
 const a=byId(pending.actor),t=byId(pending.target);
 if(!a||!t)return {ok:false,error:"Atacante ou alvo não encontrado."};
 const pre=evaluate(a,pending.rolled,pending.kept,options());
 if(!pre.ok)return pre;
 if(pre.health.id==="morto")return {ok:false,error:"Combatente morto não pode agir."};
 const skillId=$("active-skill").value,activation=selectedActiveSkill(a,skillId);
 if(skillId&&!activation)return {ok:false,error:"Perícia não adquirida por este combatente."};
 const skillAmount=Number($("skill-courage").value);
 if(skillId&&(!$("skill-approved").checked||!Number.isInteger(skillAmount)||skillAmount<0||skillAmount>5))
  return {ok:false,error:"Confira custo e gatilho da Perícia na ficha; confirme a ativação antes de concluir."};
 const human=isHumanoidKind(a.kind),healthCost=pre.health.coragem||0;
 const stepCost=human&&a.side==="jogadores"&&pending.boosted?1:0;
 const courageCost=(pre.courageCost||0)+(human?healthCost:0)+stepCost+(activation?skillAmount:0);
 if(human&&courageCost>5)return {ok:false,error:"O gasto conjunto ultrapassa 5 Coragens na rolagem."};
 if(courageCost>a.courage)return {ok:false,error:"Coragem insuficiente: requer "+courageCost+", possui "+a.courage+"."};
 if((pre.cost||0)>a.pavorLocal)return {ok:false,error:"Pavor local insuficiente para a retenção/elevação."};
 const g1=pending.spellGrade===1&&pending.mode==="conjuracao";
 const life=g1?{eligible:false,damage:0,reason:"G1 não causa dano ofensivo automático."}:lifeAtFive(pre.result,t);
 return {...pre,courageCost,activation,skillAmount:activation?skillAmount:0,
  integrityDamage:g1?0:pre.result.damage,life};
}
function renderDice(){
 const element=$("dice");
 $("confirm").disabled=!pending;$("suggest").disabled=!pending;
 if(!pending){
  element.innerHTML='<p>Selecione atacante e alvo antes de rolar.</p>';
  $("roll-result").textContent="Nenhuma rolagem pendente.";
  $("action-state").textContent="Aguardando declaração";return;
 }
 element.innerHTML=pending.rolled.map(d=>{
  const [e,a,p]=faceSymbols(d.sides,d.face),kept=pending.kept.includes(d.id);
  return '<button type="button" class="cc-die'+(kept?" kept":"")+'" data-die="'+esc(d.id)+
   '" aria-pressed="'+kept+'" title="Selecionar como mantido"><strong>'+d.face+
   '</strong><small>d'+d.sides+'</small><span>'+
   (e?'<b class="cc-e">ᛋ'+e+'</b>':"")+(a?'<b class="cc-a">ᚨ'+a+'</b>':"")+
   (p?'<b class="cc-p">ᚦ'+p+'</b>':"")+(!e&&!a&&!p?"—":"")+'</span></button>';
 }).join("");
 const pre=preview();
 if(!pre.ok){$("roll-result").textContent=pre.error;return;}
 const r=pre.result;
 $("roll-result").innerHTML='<strong>'+esc(r.outcome)+'</strong>'+
  '<p><span class="cc-e">'+r.e+' Êxitos</span> + <span class="cc-p">'+r.p+
  ' Pavor</span> · <span class="cc-a">'+r.aRemaining+' Antecipar livre</span></p>'+
  '<p>DE '+r.de+' · total válido '+r.reached+' · dano à Integridade (potencial) '+
  pre.integrityDamage+' · Vida no patamar 5: '+(pre.life.damage===null?"PENDENTE":pre.life.damage)+
  '</p><small>'+esc(pre.life.reason)+' Custo: '+(pre.courageCost||0)+
  ' Coragem / '+(pre.cost||0)+' Pavor local.</small>';
 $("action-state").textContent="Rolado, aguardando confirmação";
}
function roll(){
 const a=actor(),t=target();
 if(!a||!t||a.id===t.id)return notice("Escolha um atacante e um alvo distintos.");
 if(a.acted)return notice(a.name+" já agiu nesta rodada. Avance a rodada.");
 const human=isHumanoidKind(a.kind),[group,key]=String($("base-source").value||"").split(":");
 const attribute=$("attribute-source").value,[eg,ek]=String($("extra-source").value||"").split(":");
 const mode=$("discipline-mode").value;
 const choice=human?{baseGroup:group,baseKey:key,attribute,mode}:
  {first:key,second:attribute,mode:"normal"};
 if(eg){choice.extra={group:eg,key:ek};choice.contextOK=$("context-approved").checked;}
 const selected=String($("step-source").value||"");
 const valid=new Set([$("base-source").value,
  "attribute:"+$("attribute-source").value,$("extra-source").value]);
 if(selected&&!valid.has(selected))return notice("Só é possível elevar uma fonte presente na rolagem.");
 const [sg,sk]=selected.split(":");
 const boosted=selected?boostCombatSource(a,sg,sk):null;
 if(boosted&&!boosted.ok)return notice(boosted.error);
 const pool=composeActionPool(boosted?.unit||a,choice);
 if(!pool.ok)return notice(pool.error||"Combinação de dados inválida.");
 if(boosted)for(const die of pool.pool)if(die.group===sg&&die.key===sk)die.boosted=true;
 const w=chosenWeapon();
 if(w){
  if(!w.eligible||!human||mode!=="armas"||key!=="armas_conjuracao")
   return notice("Dado de arma exige Disciplina em modo Armas e especialização do peso.");
  if(pool.pool.length+1>9)return notice("Máximo de 9 dados rolados por participante.");
  pool.pool.push({id:"equipment.0",group:"equipment",key:w.id,sides:w.die});
 }
 let grade=null;
 if(human&&mode==="conjuracao"){
  if(key!=="armas_conjuracao"||!a.skills.includes("criar-item-foco-magia"))
   return notice("Conjuração exige Disciplina e Criar Item de Foco e Magia.");
  grade=Number($("spell-grade").value);
  const bonus=MAGIC_GRADE_DICE[grade]||[];
  if(pool.pool.length+bonus.length>9)return notice("Dado do Grau excede os 9 dados rolados.");
  if(grade>=2&&!confirm("Este Grau exige elementos, habilitação, focos e tempo adequados. O comparador só adiciona os dados do Grau e não resolve a preparação. Confirma a validação manual do Narrador?"))return;
  bonus.forEach((sides,i)=>pool.pool.push({id:"magic."+grade+"."+i,group:"magic",key:"G"+grade,sides}));
 }
 const rolled=rollCreatureFaces(pool.pool);
 pending={actor:a.id,target:t.id,rolled,kept:rolled.slice(0,Math.min(2,rolled.length)).map(x=>x.id),
  mode,baseGroup:group,baseKey:key,spellGrade:grade,weapon:w?.name||"",
  weaponId:w?.id||"",boosted:selected};
 $("cancel-p").value="0";$("convert-a").value="0";
 renderDice();
}
function suggest(){
 if(!pending)return;
 const a=byId(pending.actor),rolled=pending.rolled,opts=options();
 const maximum=a.kind==="monstro"?Math.min(stats(a).keepMax,a.keep||2):
  a.side==="inimigos"&&isHumanoidKind(a.kind)?Math.min(4,(a.threatGrade>=2?3:2)+Number(opts.extraKeep)):
  keepLimit(a.level,opts.extraKeep,false);
 let best=null;
 function explore(from,indices){
  if(indices.length){
   const ids=indices.map(x=>rolled[x].id);
   for(let cancel=0;cancel<=3;cancel++)for(let convert=0;convert<=2;convert++){
    const pre=evaluate(a,rolled,ids,{...opts,cancelP:cancel,convertPairs:convert});
    if(!pre.ok)continue;
    const r=pre.result,score=100*Number(r.success)+r.reached*10-r.p*6+
     (r.p===0?18:0)-(pre.courageCost||0)*8-(pre.cost||0)*8;
    if(!best||score>best.score)best={ids,cancel,convert,score};
   }
  }
  if(indices.length>=maximum)return;
  for(let i=from;i<rolled.length;i++){indices.push(i);explore(i+1,indices);indices.pop();}
 }
 explore(0,[]);
 if(!best)return notice("Sem combinação de dados mantidos válida.");
 pending.kept=[...best.ids];$("cancel-p").value=String(best.cancel);
 $("convert-a").value=String(best.convert);renderDice();
}

function confirmRoll(){
 if(!pending)return;
 const a=byId(pending.actor),t=byId(pending.target),pre=preview();
 if(!a||!t||!pre.ok)return notice(pre.error||"Rolagem inválida.");
 if(a.acted)return notice("Este combatente já agiu na rodada.");
 const r=pre.result;
 if((pre.courageCost||0)>a.courage||(pre.cost||0)>a.pavorLocal)
  return notice("Coragem ou Pavor local insuficiente.");
 a.courage=Math.max(0,a.courage-(pre.courageCost||0));
 a.pavorLocal=Math.max(0,a.pavorLocal-(pre.cost||0));
 if(pre.activation)log("Perícia",a.name+" ativou "+pre.activation.name+
  " (gasto declarado: "+pre.skillAmount+" Coragem; efeito condicionado à validação do Narrador).");
 $("skill-approved").checked=false;
 if(a.side==="jogadores")a.courage=Math.min(maxCourage(a.level),a.courage+Number(r.criticalRefundCourage||0));
 if(a.side==="inimigos"&&r.monsterCriticalPavor){
  const cap=monsterCap(a.threatGrade),free=Math.max(0,cap-a.pavorLocal);
  const own=Math.min(free,r.monsterCriticalPavor);
  a.pavorLocal+=own;
  const publicCap=narratorCap(state.combatants.filter(x=>x.side==="jogadores").length);
  state.publicPavor=Math.min(publicCap,state.publicPavor+Math.max(0,r.monsterCriticalPavor-own));
 }
 const moved=transferPavor(a,t,r.p,state.publicPavor);
 Object.assign(t,moved.target);
 a.acted=true;
 last={actor:a.id,name:a.name,target:t.id,targetName:t.name,outcome:r.outcome,e:r.e,p:r.p,
  de:r.de,integrityDamage:pre.integrityDamage,lifeDamage:pre.life.damage===2?2:0,
  integrityApplied:false,lifeApplied:false};
 log("rolagem",a.name+" → "+t.name+": "+r.outcome+" ("+r.e+"E, "+r.p+"P). "+
  "Dano convencional potencial "+pre.integrityDamage+" à Integridade. Vida pelo patamar 5: "+
  (pre.life.damage===2?"2 (se permanecer sem armadura)":"não automática")+". "+
  moved.notes.join(" "),{actor:a.id,target:t.id,rolled:pending.rolled,kept:pending.kept,
   damagePotential:pre.integrityDamage,lifeAtFive:pre.life.damage===2?2:null,
   courageCost:pre.courageCost||0,pavorCost:pre.cost||0,weapon:pending.weapon,
   elevation:pending.boosted||"",activeSkill:pre.activation?.id||"",
   skillCourage:pre.skillAmount||0,health:pre.health.id,weight:pre.affinity.description});
 state.resourceActor=t.id;pending=null;persist();render(false);
 $("action-state").textContent="Rolagem confirmada";
 notice("Rolagem confirmada. Pavor atualizado. Dano à Integridade e Vida ainda exigem aplicação.");
}
function change(field,delta,itemId=null){
 const c=byId(state.resourceActor);
 if(!c)return notice("Selecione o combatente a ajustar.");
 const result=updateResource(c,itemId,field,delta);
 if(!result.ok)return notice(result.error);
 Object.assign(c,result.actor);
 const equipment=field==="integridade"?c.items.find(x=>x.id===itemId):null;
 log("recurso",c.name+": "+(delta>0?"+":"")+delta+" "+field+
  (equipment?" em "+equipment.name:"")+". Limites e tetos respeitados.");
 persist();render(false);
}
function applyConfirmed(which){
 if(!last)return notice("Nenhuma rolagem confirmada.");
 const t=byId(last.target),armor=armorOf(t);
 if(!t)return notice("Alvo não está mais no confronto.");
 if(which==="integridade"){
  if(!armor||last.integrityApplied||last.integrityDamage<1)
   return notice("Sem Integridade aplicável nesta rolagem.");
  const before=armor.integrity;
  const changed=updateResource(t,armor.id,"integridade",-last.integrityDamage);
  if(!changed.ok)return notice(changed.error);
  Object.assign(t,changed.actor);last.integrityApplied=true;
  log("integridade",t.name+": −"+(before-Math.max(0,before-last.integrityDamage))+
   " de Integridade em "+armor.name+". Excedente de dano não é lançado automaticamente na Vida.");
 }else{
  if(armor||last.lifeApplied||last.lifeDamage!==2)
   return notice("Patamar de 2 Vida só vale para alvo sem armadura equipada.");
  const before=t.life;t.life=Math.max(0,t.life-2);last.lifeApplied=true;
  log("vida",t.name+": −"+(before-t.life)+" Vida direta pelo acerto com cinco pontos válidos (E + P), sem armadura.");
 }
 persist();render(false);
}
function nextRound(){
 state.round=Math.min(9999,state.round+1);
 for(const c of state.combatants)c.acted=false;
 pending=null;log("rodada","Rodada "+state.round+". Oportunidades restauradas; não há cura automática.");
 persist();render();
}
function demo(){
 if(state.combatants.length&&!confirm("Substituir o confronto atual? Fichas originais do Criador não serão alteradas."))return;
 state=empty();pending=null;last=null;lastActor="";
 function setup(name,side,kind,attributes,practices,skills,items=[]){
  add({name,kind,level:1,attributes,practices,skills,items},side,"Exemplo visual (XP não homologado)");
 }
 setup("Aprendiz armado","jogadores","humanoide",
  {forca:1,agilidade:1,vigor:1,destreza:1},{armas_conjuracao:1},["armas-leves"],
  [{id:"arma-1",name:"Adaga",kind:"weapon",category:"leve",die:6,grade:1,qty:1,equipped:true}]);
 setup("Apoio","jogadores","humanoide",{inteligencia:1,destreza:1,vigor:1},{atletismo:1},[]);
 setup("Saqueador","inimigos","humanoide",
  {agilidade:1,vigor:1,destreza:1},{armas_conjuracao:1},["armas-leves"],
  [{id:"armadura-1",name:"Roupas Simples",kind:"armor",category:"muito-leve",grade:1,
   integrityMax:2,integrity:2,equipped:true}]);
 setup("Lobo","inimigos","monstro",{agilidade:2,forca:1,destreza:1},{},[]);
 log("cenário","Exemplo 2 × 2 criado. As builds de demonstração não substituem fichas reais de 15 XP.");
 persist();render();if(target())$("difficulty").value=String(defense(target()));
}
function importJson(file){
 if(!file)return;
 if(file.size>3e6)return notice("JSON deve ter até 3 MB.");
 file.text().then(str=>{
  const raw=JSON.parse(str);
  if(raw?.version===1&&Array.isArray(raw.combatants)){
   if(state.combatants.length&&!confirm("Substituir o confronto por este arquivo?"))return;
   state=empty();for(const c of raw.combatants.slice(0,MAX))
    add(c,["jogadores","inimigos"].includes(c.side)?c.side:"inimigos","Comparador importado");
   state.round=Math.floor(clamp(raw.round,1,9999));
  }else if(Array.isArray(raw?.roster)||Array.isArray(raw?.tokens)){
   for(const c of raw.roster||raw.tokens)
    if(!add(c,["jogadores","inimigos"].includes(c.side)?c.side:"inimigos","Arquivo de conflito"))break;
  }else{
   const c=raw.character||raw;
   if(!c?.attributes||!add(c,"jogadores","Ficha JSON"))
    throw Error("Formato incompatível ou limite de fichas atingido.");
  }
  pending=null;last=null;log("importação","Fichas carregadas de arquivo JSON.");
  persist();render();if(target())$("difficulty").value=String(defense(target()));
 }).catch(e=>notice("Falha ao ler JSON: "+e.message));
}
function exportJson(){
 const blob=new Blob([JSON.stringify(state,null,2)],{type:"application/json"});
 const url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download="codex-comparador-de-combate.json";a.click();
 setTimeout(()=>URL.revokeObjectURL(url),1600);
}
function bind(){
 document.addEventListener("click",event=>{
  const button=event.target.closest("button");if(!button)return;
  if(button.dataset.inspect){openCombatantSheet(button.dataset.inspect);return;}
  if(button.dataset.inspectSelected){
   openCombatantSheet(button.dataset.inspectSelected==="actor"?state.actor:state.target);return;
  }
  if(button.dataset.actor){
   state.actor=button.dataset.actor;pending=null;lastActor="";
   persist();render();return;
  }
  if(button.dataset.target){
   state.target=button.dataset.target;pending=null;
   persist();render(false);$("difficulty").value=String(defense(target()));return;
  }
  if(button.dataset.remove){
   state.combatants=state.combatants.filter(x=>x.id!==button.dataset.remove);
   if(state.actor===button.dataset.remove)state.actor="";
   if(state.target===button.dataset.remove)state.target="";
   if(state.resourceActor===button.dataset.remove)state.resourceActor="";
   pending=null;last=null;persist();render();return;
  }
  if(button.dataset.die&&pending){
   pending.kept=pending.kept.includes(button.dataset.die)?
    pending.kept.filter(x=>x!==button.dataset.die):[...pending.kept,button.dataset.die];
   renderDice();
  }
 });
 $("combatant-sheet").addEventListener("close",()=>{inspectingId="";});
 $("close-combatant-sheet").addEventListener("click",()=>$("combatant-sheet").close());
 $("scan-sheets").addEventListener("click",scan);
 $("add-ally").addEventListener("click",()=>addSelected("jogadores"));
 $("add-enemy").addEventListener("click",()=>addSelected("inimigos"));
 $("json-import").addEventListener("change",event=>{importJson(event.target.files?.[0]);event.target.value="";});
 $("demo").addEventListener("click",demo);
 $("next-round").addEventListener("click",nextRound);
 $("export").addEventListener("click",exportJson);
 $("actor").addEventListener("change",event=>{
  state.actor=event.target.value;pending=null;lastActor="";persist();render();
 });
 $("target").addEventListener("change",event=>{
  state.target=event.target.value;pending=null;
  persist();render(false);$("difficulty").value=String(defense(target()));
 });
 $("weapon-source").addEventListener("change",renderAffinity);
 $("apply-affinity").addEventListener("click",()=>{
  const hint=renderAffinity();
  if(hint.status!=="known")return;
  $("situation").value=hint.delta===1?"advantage":hint.delta===-1?"disadvantage":"neutral";
  notice("Condição sugerida pelo peso selecionada, sem acumular outros modificadores.");
 });
 $("roll").addEventListener("click",roll);
 $("suggest").addEventListener("click",suggest);
 $("confirm").addEventListener("click",confirmRoll);
 for(const field of ["extra-keep","cancel-p","convert-a","situation","difficulty","spell-grade"])
  $(field).addEventListener("change",()=>{if(pending)renderDice();});
 $("resource-actor").addEventListener("change",event=>{
  state.resourceActor=event.target.value;persist();renderResources();
 });
 $("resource-kind").addEventListener("change",renderResources);
 for(const [button,sign] of [["resource-minus",-1],["resource-plus",1]])
  $(button).addEventListener("click",()=>{
   const n=Number($("resource-amount").value);
   if(!Number.isInteger(n)||n<=0||n>100)return notice("Quantidade inválida: use inteiro de 1 a 100.");
   change($("resource-kind").value,sign*n,$("resource-item").value);
  });
 $("apply-integrity").addEventListener("click",()=>applyConfirmed("integridade"));
 $("apply-life").addEventListener("click",()=>applyConfirmed("vida"));
 $("public-minus").addEventListener("click",()=>{
  state.publicPavor=Math.max(0,state.publicPavor-1);
  log("Pavor público","−1P público manual.");persist();render(false);
 });
 $("public-plus").addEventListener("click",()=>{
  const limit=narratorCap(state.combatants.filter(x=>x.side==="jogadores").length);
  if(state.publicPavor>=limit)return notice("Teto de Pavor público: "+limit+".");
  state.publicPavor++;log("Pavor público","+1P público manual.");persist();render(false);
 });
 $("clear-history").addEventListener("click",()=>{
  if(!confirm("Apagar o histórico deste confronto?"))return;
  state.history=[];persist();renderHistory();
 });
}
bind();scan();render();
