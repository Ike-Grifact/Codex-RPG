/* Codex RPG — Comparador de combate sem tabuleiro, com dados das fichas e alterações locais. */
import {normalizeCombatant,listBrowserSheets,combatantSheetData,combatHealth,boostCombatSource,rollProvenance,selectedActiveSkill,canChangePunchWeight,planMartialAttack,MARTIAL_MANOEUVRES,combatManoeuvreOutcome,applyCombatManoeuvres,standFromProne,escapeGrapple,proneAttackPenalty,hasCombatFocus,focusCombatStatus,hasSmallCompanion,applyFulminanteToPool,validFulminanteForWeapon,markCondition,activeWeaponProperties,weaponActivationSkill,weaponMasteryFor,canUseWeaponMastery,planWeaponEffects,declareWeaponEffects,resolveDeclaredWeaponEffects,planCourageDeclaration,planColossalTargets,colossalOutcomes,weaponEffectOutcome,criticalFaces,bestKeepSelection,defense,armorOf,equippedWeapons,equipmentPosition,weaponHands,isHandEquipment,heldHands,hasQuickDraw,drawModeFor,planDraw,disarmTransfer,normalizeEquipment,weightAffinity,manejoPerfeitoBonus,isPoisonOnlyWeapon,projectileFamily,shotChoices,planShot,carryingCapacity,bodyUsage,quickUsage,lifeAtFive,transferPavor,updateResource,weightUsed}
 from "./comparador-logic.mjs?v=20261125-v0147";
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,isHumanoidKind,stats,SKILLS} from "../criar-conflito/rules.mjs?v=20261125-v0147";
import {composeActionPool,rollCreatureFaces,previewHumanoidRoll,previewCreatureRoll} from "../criar-conflito/roll-engine.mjs?v=20261125-v0147";
import {resolveRoll,keepLimit,MAGIC_GRADE_DICE,maxCourage,monsterCap,narratorCap,faceSymbols,isCriticalFace} from "../criar-conflito/codex-rules.mjs?v=20261125-v0147";

const SAVE="codex-rpg-comparador-v1",MAX=36,$=key=>document.getElementById(key);
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const unique=()=>globalThis.crypto?.randomUUID?.()||"c-"+Date.now()+"-"+Math.random().toString(36).slice(2);
const clamp=(v,min,max)=>Math.max(min,Math.min(max,Number.isFinite(Number(v))?Number(v):min));
const catalog=()=>Array.isArray(window.CODEX_G1_CATALOG)?window.CODEX_G1_CATALOG:[];
const sources={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES};
function empty(){return {version:1,round:1,combatants:[],actor:"",target:"",resourceActor:"",publicPavor:0,groundItems:[],history:[]};}
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
   history:(Array.isArray(data.history)?data.history:[]).slice(0,350),groundItems:(Array.isArray(data.groundItems)?data.groundItems:[]).slice(0,200).map(normalizeEquipment),
   pendingRoll:data.pendingRoll&&data.pendingRoll.declarationOptions&&Array.isArray(data.pendingRoll.rolled)?data.pendingRoll:null,lastResult:data.lastResult&&typeof data.lastResult==="object"?data.lastResult:null};
 }catch{return empty();}
}
let state=load(),available=[],pending=state.pendingRoll&&state.combatants.some(c=>c.id===state.pendingRoll.actor)&&state.combatants.some(c=>c.id===state.pendingRoll.target)?state.pendingRoll:null,last=state.lastResult||null,lastActor="",toastTimer,inspectingId="";
let activeExtraSelections=new Map();
const byId=id=>state.combatants.find(x=>x.id===id)||null;
const actor=()=>byId(state.actor),target=()=>byId(state.target);
function notice(msg){const el=$("notice");el.textContent=msg;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,4500);}
function persist(){try{state.pendingRoll=pending;state.lastResult=last;localStorage.setItem(SAVE,JSON.stringify(state));}catch(e){notice("Não foi possível salvar o combate: "+e.message);}}
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
 if(pending)return notice("Confirme ou encerre a rolagem antes de adicionar fichas.");
 const previousTarget=state.target;
 const profile=available[Number($("available").value)];
 if(!profile)return notice("Selecione uma ficha.");
 if(!add(profile.raw,side,profile.source))return notice("Limite de "+MAX+" fichas.");
 log("importação",profile.name+" entrou do "+profile.source+".");persist();render();
  const imported=state.combatants.at(-1);
  if(imported?.race==="lucker_puro"&&!hasCombatFocus(imported))notice(focusCombatStatus(imported));
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
   (c.side==="inimigos"?'<span>Coragem — (somente PCs)</span>':'<span>Coragem '+c.courage+'</span>')+'<span>Pavor '+c.pavorLocal+'/'+monsterCap(c.threatGrade)+' · G'+c.threatGrade+'</span><span>Integridade '+
   (armor?armor.integrity+"/"+armor.integrityMax:"—")+'</span></div>'+
   (c.statuses?.caido?'<small class="cc-used">Caído · golpe −1A</small>':'')+
   (c.statuses?.agarradoPor?'<small class="cc-used">Agarrado · Desvantagem de movimento</small>':'')+
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
  s.advancedDiscipline?'Registrada, mas requer Disciplina G3; atual G'+s.disciplineGrade:
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
  (c.side==="inimigos"?'<span>Sem Coragem (usa Pavor)</span>':'<span>Coragem: <strong>'+c.courage+'</strong></span>')+
  '<span>Pavor: <strong>'+c.pavorLocal+'</strong></span></div>'+
  '<section class="cc-sheet-block"><h3>Habilitação da terceira fonte</h3>'+
  '<p><strong>Disciplina Avançada:</strong> '+esc(advance)+'.</p>'+
  (s.human?'<p class="cc-help">A terceira fonte de uma ação com Disciplina exige a Perícia, Disciplina G3 e pertinência confirmada pelo Narrador.</p>':'')+
  '</section>'+
  sheetGrades("Atributos",s.attributes)+
  (s.human?sheetGrades("Conhecimentos",s.knowledges)+sheetGrades("Práticas",s.practices):'')+
  '<section class="cc-sheet-block"><h3>Perícias adquiridas ('+s.skills.length+')</h3>'+skills+
   (s.focusStatus?'<p class="cc-help"><strong>Foco (Lucker Puro):</strong> '+esc(s.focusStatus)+'</p>':'')+'</section>'+
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
  " · Vida "+t.life+(t.statuses?.caido?" · Caído":"")+(t.statuses?.agarradoPor?" · Agarrado por "+(byId(t.statuses.agarradoPor)?.name||"combatente removido"):"")+((t.statuses?.cravadas||[]).length?" · "+t.statuses.cravadas.length+" arma(s) cravada(s) no escudo (−1E cada ao Levantar Escudo)":"")+
  ". Alcance e linha de visão são decisões da mesa, sem mapa.":
  "Escolha um alvo.";
 $("target-bleeding").disabled=!t;
 $("target-bleeding").checked=!!t?.statuses?.sangramento;
 $("target-poison-state").textContent=t?(t.statuses?.envenenado?"Condição ativa: Envenenado (sem dano automático).":"Envenenamento: não registrado."):"Envenenamento: sem alvo.";
 renderAffinity();
}
function renderResources(){
 const c=byId(state.resourceActor);
 $("ground-weapons").textContent=state.groundItems.length?state.groundItems.map(x=>x.name).join(" · "):"Nenhuma arma no chão.";
 if(!c){$("resource-summary").textContent="Escolha uma ficha.";$("manoeuvre-controls").hidden=true;return;}
 const grabber=byId(c.statuses?.agarradoPor);
 $("manoeuvre-controls").hidden=!c.statuses?.caido&&!c.statuses?.agarradoPor;
 $("stand-up").hidden=!c.statuses?.caido;
 $("escape-wrap").hidden=!c.statuses?.agarradoPor;
 $("escape-grapple").disabled=!grabber;
 $("grapple-info").textContent=grabber?"Agarrado por "+grabber.name+" · DE "+defense(grabber)+" · Desvantagem de movimento. Informe o total válido de um teste de libertação.":"Quem está agarrando não está na lista de combatentes; resolva na mesa.";
 $("resource-summary").innerHTML='<strong>'+esc(c.name)+'</strong><div class="cc-card-stats">'+
  '<span>Vida '+c.life+'</span><span>DE '+defense(c)+'</span>'+
  (c.side==='inimigos'?'<span>Coragem: não se aplica</span>':'<span>Coragem '+c.courage+'/'+maxCourage(c.level)+'</span>')+
  '<span>P local '+c.pavorLocal+'/'+monsterCap(c.threatGrade)+'</span></div><p>Armadura: '+armorText(c)+'</p>';
 $("resource-summary").innerHTML+='<p>Mãos ocupadas: '+(heldHands(c.items)??"empunhadura pendente")+'.</p>'+["hands","quick","bag"].map(pos=>'<p><strong>'+({hands:"Mãos",quick:"Acesso rápido",bag:"Inventário"}[pos])+'</strong>: '+esc(c.items.filter(x=>isHandEquipment(x)&&equipmentPosition(x)===pos).map(x=>x.name+(weaponHands(x)?" ("+weaponHands(x)+" mão(s))":" (empunhadura a definir)")).join(", ")||"—")+'</p>').join("");
 const elig=c.items.filter(x=>["armor","shield"].includes(x.kind)),previous=$("resource-item").value;
 $("resource-item").innerHTML=elig.length?elig.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+
  ' · '+x.integrity+'/'+x.integrityMax+'</option>').join(""):'<option value="">Nenhum equipamento</option>';
 if(elig.some(x=>x.id===previous))$("resource-item").value=previous;
 $("resource-item").disabled=$("resource-kind").value!=="integridade";
 if(c.side==="inimigos"&&$("resource-kind").value==="coragem")$("resource-kind").value="pavor";
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
  (last.critical?'<div class="cc-critical-result"><strong>CRÍTICO · '+last.critical+' FACES CRÍTICAS</strong><small>'+esc(last.keptFaces||"")+
   ' · '+(last.criticalRefund?'+'+last.criticalRefund+' Coragem':last.criticalPavor?'+'+last.criticalPavor+' Pavor (teto local/público)':'benefício já contabilizado')+'</small></div>':
   (last.keptFaces?'<small>Faces mantidas: '+esc(last.keptFaces)+'</small>':''))+
  '<p>'+last.e+'E + '+last.p+'P · DE '+last.de+' · '+esc(last.outcome)+'</p>'+
  '<p>Dano à Integridade: '+(a?last.integrityDamage:"sem armadura")+
  ' · Dano à Vida por 5 pontos: '+(!a&&last.lifeDamage===2?"2":"não automático")+'</p>'+
  '<small>'+(last.integrityApplied?"Integridade aplicada. ":"")+(last.lifeApplied?"Vida aplicada. ":"")+
  'Dano excedente ainda requer resolução do Narrador.</small>'+
  ((last.manoeuvreNotes||[]).length?'<p>'+last.manoeuvreNotes.map(esc).join("<br>")+'</p>':"")+
  ((last.activeMartialEffects||[]).length?'<p>Manobra marcial: '+esc(last.activeMartialEffects.join(", "))+'</p>':"")+
  ((last.activeWeaponEffects||[]).length?'<p>Características ativadas: '+esc(last.activeWeaponEffects.join(', '))+'</p>':'')+colossalRows(last.colossal,true);
}
function render(refresh=true){
 renderRoster();renderChoices();
 if(refresh){lastActor="";renderSources();}
 renderTarget();renderCombatControls();renderResources();renderHistory();renderLast();renderDice();
 if(inspectingId&&$("combatant-sheet").open){
  const c=byId(inspectingId);
  if(c)renderCombatantSheet(c);else $("combatant-sheet").close();
 }
}

function renderSources(){
 const a=actor();
 if(lastActor===a?.id)return;
 lastActor=a?.id||"";
 $("draw-stow").innerHTML="";$("colossal-targets").innerHTML="";$("colossal-area-de").value="";activeExtraSelections.clear();$("attack-thrown").checked=false;resetMartial();
 $("weapon-effects").innerHTML="";$("perfurante-blocked").checked=false;
 // A ativação pertence ao atacante: nunca herdar o gasto de outra ficha.
 $("active-skill").value="";$("skill-courage").value="0";$("skill-approved").checked=false;
 // Elevação temporária da fonte também não atravessa combatentes ou rodadas.
 $("step-source").value="";
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
 $("discipline-mode").value=human&&hasCombatFocus(a)?"conjuracao":
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
  (a.side==="inimigos"?"Humanoides hostis gastam Pavor local na retenção adicional. ":"Jogadores usam Coragem na retenção adicional. "))+
  "Reserva local G"+a.threatGrade+": "+a.pavorLocal+"/"+capP+" P (G1 4P, +1 por Grau até 8P).";
 const health=combatHealth(a);
 $("health-info").textContent="Saúde: "+health.id+" · Vida "+a.life+
  " · modificadores "+(health.e||0)+"E, "+(health.a||0)+"A, "+(health.p||0)+
  "P · custo para agir "+(health.coragem===null?"indisponível":health.coragem+(a.side==="inimigos"?" Pavor":" Coragem"))+
  (a.kind==="monstro"&&health.coragem>0?
   ". Monstro incapacitado/inconsciente: conversão de custo de ação PENDENTE; penalidades de símbolos aplicadas.":"");
 const previous=$("active-skill").value;
 const purchased=a.skills||[];
 const rows=purchased.filter(id=>!["pugilismo","artista-marcial","saque-rapido"].includes(id)).map(id=>selectedActiveSkill(a,id)).filter(Boolean);
 $("active-skill").innerHTML='<option value="">Sem ativação adicional</option>'+
  rows.map(r=>'<option value="'+esc(r.id)+'">'+esc(r.name)+'</option>').join("");
 if(rows.some(r=>r.id===previous))$("active-skill").value=previous;
 if(!rows.some(r=>r.id===previous)){$("skill-courage").value="0";$("skill-approved").checked=false;}
 $("round-budget").textContent=a.side==="inimigos"?
  "Sem Coragem: gastos deste inimigo usam Pavor local, até "+capP+"P.":
  "Rodada "+state.round+" · Coragem gasta "+Number(a.courageRoundSpent||0)+"/5 · restante "+Math.max(0,5-Number(a.courageRoundSpent||0));
 renderAdditionalSkills(rows);
 updateSkillInfo();renderMartial();
}
function updateSkillInfo(){
 const skill=selectedActiveSkill(actor(),$("active-skill").value);
 const cost=$("skill-courage").value;
 $("skill-info").textContent=skill?
  skill.name+": "+skill.detail+" | Custo em "+(actor()?.side==="inimigos"?"Pavor":"Coragem")+": "+(["golpe-fulminante","disparo-fulminante","domar-criatura-pequena"].includes(skill.id)?1:cost)+
  ". Declare e pague a Coragem antes da rolagem; na falha, o gasto permanece. É possível combinar várias Perícias diferentes, até o limite de 5 por rodada.":
  "Declare os gastos antes de rolar. A Coragem é debitada ao rolar e permanece gasta mesmo na falha.";
}

function renderAdditionalSkills(rows){
 const selected=$("active-skill").value;
 $("active-extra-skills").innerHTML="<strong>Perícias adicionais nesta ação</strong>"+
  rows.filter(skill=>skill.id!==selected).map(skill=>{
   const count=activeExtraSelections.get(skill.id);
   const fixed=["golpe-fulminante","disparo-fulminante","domar-criatura-pequena"].includes(skill.id);
   return '<div class="cc-extra-skill"><label><input type="checkbox" data-extra-skill="'+esc(skill.id)+
    '"'+(count!==undefined?' checked':'')+'> '+esc(skill.name)+'</label>'+
    '<label>Custo <input type="number" data-extra-skill-cost="'+esc(skill.id)+
    '" min="0" max="5" step="1" value="'+(fixed?1:(count??1))+
    '"'+(fixed?' readonly':'')+'></label></div>';
  }).join("");
}
function selectedActivations(a,requireConfirmation=true){
 const list=[];
 const primaryId=$("active-skill").value;
 if(primaryId){
  const row=selectedActiveSkill(a,primaryId);
  if(!row)return {ok:false,error:"Perícia selecionada não adquirida."};
  let cost=Number($("skill-courage").value);
  if(["golpe-fulminante","disparo-fulminante","domar-criatura-pequena"].includes(primaryId))cost=1;
  list.push({...row,cost});
 }
 for(const [id,rawCost] of activeExtraSelections){
  if(id===primaryId)continue;
  const row=selectedActiveSkill(a,id);
  if(!row)return {ok:false,error:"Perícia adicional não adquirida."};
  const cost=["golpe-fulminante","disparo-fulminante","domar-criatura-pequena"].includes(id)?1:Number(rawCost);
  list.push({...row,cost});
 }
 if(list.some(x=>!Number.isInteger(x.cost)||x.cost<0||x.cost>5||x.id==="espalhar-golpe"&&x.cost<1))
  return {ok:false,error:"Custo de Perícia deve ser inteiro de 0 a 5."};
 if(requireConfirmation&&list.length&&!$("skill-approved").checked)
  return {ok:false,error:"Confirme o custo e o gatilho das Perícias antes de rolar."};
 if(list.some(x=>x.id==="domar-criatura-pequena")&&!hasSmallCompanion(a))
  return {ok:false,error:"Domar Pequena só auxilia com criatura domesticada presente."};
 return {ok:true,skills:list};
}
function selectedWeaponEffects(){
 return [...$("weapon-effects").querySelectorAll("[data-weapon-property]:checked")].map(el=>el.dataset.weaponProperty);
}
function renderWeaponEffects(){
 const weapon=chosenWeapon(),attacker=actor(),chosen=new Set(selectedWeaponEffects());
 const props=activeWeaponProperties(weapon);
 const access=weaponActivationSkill(attacker,weapon,{thrown:$("attack-thrown").checked});
 const mastery=weaponMasteryFor(weapon,{thrown:$("attack-thrown").checked});
 const cravarAccess=weapon?.kind==="weapon"&&["medio","pesado"].includes(weapon.category)&&
  weaponActivationSkill(attacker,{...weapon,name:"",properties:[]}).ok;
 $("weapon-effects").innerHTML=props.length?
  props.map(prop=>'<label class="cc-weapon-effect"><input type="checkbox" data-weapon-property="'+esc(prop)+
   '"'+(chosen.has(prop)?' checked':'')+(!access.ok||(prop==="Cravar"&&!cravarAccess)?' disabled':'')+'><strong>'+esc(prop)+'</strong></label>').join(""):
  '<p class="cc-help">Sem característica especial ativável cadastrada nesta arma.</p>';
 const passive=weapon?.properties?.includes("Barulhenta")?" Barulhenta é passiva: +1P sempre, inclusive no crítico.":"";
 $("weapon-effect-info").textContent=isPoisonOnlyWeapon(weapon)?(access.ok?"Envenenar: marque somente com dardo preparado; declare 1 Coragem. Acerto aplica 1 acúmulo por 2 rodadas sem Sangramento. Sem dano direto.":"Habilitação ausente: "+access.error):weapon?
  (access.ok?"Perícia habilitada: "+access.required+".":"Habilitação ausente: "+access.error)+
  (canUseWeaponMastery(attacker,mastery)?" "+(SKILLS.find(x=>x.id===mastery)?.name||"Especialização em Armas")+": no acerto 1 efeito gratuito; no crítico 2 gratuitos e um terceiro por 1 Coragem.":
   " Sem Especialização: declare e gaste 1 Coragem antes de rolar para tentar ativar um efeito; falhar não devolve a Coragem. No crítico com acerto, a recuperação normal devolve 1 Coragem gasta, zerando o custo líquido da primeira característica; o segundo efeito pago exige declaração antecipada.")+
  " Cortante aplica Sangramento; Perfurante altera apenas dano à Integridade. Cravar exige Perícia em Armas Médias ou Pesadas correspondente, arma com Cravar e escudo físico; crítico não substitui a Perícia. Manobras sem efeito numérico definido são registradas para o Narrador."+passive:
  "Escolha uma arma equipada para visualizar as características.";
}

function renderWeapons(){
 const a=actor(),weapons=a?equippedWeapons(a,catalog(),true):[],old=$("weapon-source").value;
 $("weapon-source").innerHTML='<option value="">Sem arma / ataque desarmado</option>'+weapons.map(w=>
  '<option value="'+esc(w.id)+'"'+(w.eligible||projectileFamily(w)?"":" disabled")+'>'+esc(w.name)+
  ' · '+(w.eligible&&w.die?"d"+w.die:"sem dado adicional")+(w.range?" · "+w.range+" m":"")+' · '+({hands:"Mãos",quick:"Acesso rápido",bag:"Inventário"}[equipmentPosition(w)])+' · '+(weaponHands(w)?weaponHands(w)+" mão(s)":"empunhadura a definir")+
  (w.eligible?"":" · requer "+esc(w.skill))+'</option>').join("");
 if(weapons.some(w=>w.id===old&&(w.eligible||projectileFamily(w))))$("weapon-source").value=old;
 else $("weapon-source").value=weapons.find(w=>w.eligible&&w.equipped)?.id||"";
 renderDrawControls();renderAffinity();renderWeaponEffects();
}
function chosenWeapon(){
 const w=equippedWeapons(actor(),catalog(),true).find(w=>w.id===$("weapon-source").value);
 return w?{...w,wasHeld:!!w.equipped,drawMode:drawModeFor(actor(),w),equipped:true}:null;
}
function renderDrawControls(){
 const w=chosenWeapon(),a=actor(),old=new Set([...$("draw-stow").selectedOptions].map(o=>o.value));
 $("draw-controls").hidden=!w||w.wasHeld;
 $("draw-stow").innerHTML=(a?.items||[]).filter(x=>x.equipped&&isHandEquipment(x)).map(x=>'<option value="'+esc(x.id)+'"'+(old.has(x.id)?' selected':'')+'>'+esc(x.name)+'</option>').join("");
 $("draw-info").textContent=({none:"Arma empunhada: sem penalidade de saque.",quick:"Acesso rápido com Saque Rápido: reserva 1A; sem A, −1E.",normal:"Acesso rápido sem Saque Rápido: Desvantagem Absoluta (−1E).","inventory-trained":"Inventário com Saque Rápido: Desvantagem Absoluta (−1E).","inventory-untrained":"Inventário sem Saque Rápido: Golpe de Sorte (−2E)."})[w?.drawMode||"none"];
}

function isUnarmedAttack(){
 return isHumanoidKind(actor()?.kind)&&$("base-source").value==="practice:armas_conjuracao"&&$("discipline-mode").value==="armas"&&!chosenWeapon()&&!$("attack-thrown").checked;
}
function resetMartial(){
 $("pugilism-on").checked=false;$("punch-weight").value="leve";$("martial-manoeuvre").value="";
}
function martialDeclaration(){
 return planMartialAttack(actor(),{unarmed:isUnarmedAttack(),pugilism:$("pugilism-on").checked,weight:$("punch-weight").value,manoeuvre:$("martial-manoeuvre").value});
}
function renderMartial(){
 const a=actor(),unarmed=isUnarmedAttack(),pug=unarmed&&canChangePunchWeight(a),art=unarmed&&!!selectedActiveSkill(a,"artista-marcial");
 $("martial-panel").hidden=!unarmed;
 if(!pug)$("pugilism-on").checked=false;
 $("pugilism-toggle").hidden=!pug;
 $("punch-weight-wrap").hidden=!pug||!$("pugilism-on").checked;
 $("martial-manoeuvre-wrap").hidden=!art;
 if(!art)$("martial-manoeuvre").value="";
 const plan=martialDeclaration();
 $("martial-info").textContent=plan.ok?"Peso: "+({leve:"Leve",medio:"Médio",pesado:"Pesado"}[plan.category])+
  ". "+(plan.cost?"Custo antes da rolagem: 1 "+(a?.side==="inimigos"?"Pavor local":"Coragem")+". ":"")+
  (art?($("pugilism-on").checked?"Uma manobra no acerto, sem custo adicional.":"Uma manobra no acerto por 1 Coragem."):""):plan.error;
 renderAffinity();
}
function renderAffinity(){
 const hint=weightAffinity(chosenWeapon()||martialDeclaration().weapon,target(),actor());
 $("weight-affinity").textContent="Comparação por peso: "+hint.description+" A afinidade será aplicada na rolagem quando definida. Carga física do atacante: "+
  (actor()?weightUsed(actor()).toFixed(3)+" / "+carryingCapacity(actor())+" Alto · Corpo "+bodyUsage(actor().items).toFixed(3)+"/"+(carryingCapacity(actor())-.5)+" · Saque "+quickUsage(actor().items)+"/3 · Mochila "+(weightUsed(actor())-bodyUsage(actor().items)).toFixed(3)+"/0,5":"—")+
  ". A categoria da armadura equipada determina a afinidade defensiva.";
 return hint;
}
function options(){
 return {...(pending?.declarationOptions||{de:Number($("difficulty").value),situation:$("situation").value,extraKeep:$("extra-keep").checked}),
  cancelP:Number($("cancel-p").value),convertPairs:Number($("convert-a").value)};
}
function evaluate(a,rolled,kept,opts){
 const health=combatHealth(a),t=byId(pending?.target);
 const weapon=pending?.weaponId?pending.weaponSnapshot:null;
 const affinity=weightAffinity(weapon||pending?.martial?.weapon,t,a);
 const manejo=manejoPerfeitoBonus(a,weapon,affinity,{
  situation:opts.situation,mode:pending?.mode,baseKey:pending?.baseKey,thrown:!!pending?.thrown
 });
 const weight=affinity.status==="known"&&!manejo.suppressWeightA?affinity.delta:0;
 const stealth=!!(a.skills?.includes("furtividade")&&pending?.baseGroup==="practice"&&pending?.baseKey==="furtividade");
 const companion=!!(hasSmallCompanion(a)&&pending?.activations?.some(x=>x.id==="domar-criatura-pequena"));
 const noisy=!!(weapon?.properties||[]).includes("Barulhenta");
 const pronePenalty=proneAttackPenalty(a,opts.situation);
 const conf={...opts,drawMode:pending?.draw?.mode||"none",weight,bonusA:health.a+Number(stealth)+Number(companion)+pronePenalty,bonusP:health.p+Number(noisy),
  skillBonusE:health.e+manejo.bonusE+Number(pending?.colossal?.cost||0),stepDieId:pending?.boosted||""};
 let pre;
 if(a.kind==="monstro")pre=previewCreatureRoll(a,rolled,kept,conf);
 else if(a.side==="inimigos"&&isHumanoidKind(a.kind))pre=previewHumanoidRoll(a,rolled,kept,conf);
 else {
  const r=resolveRoll(rolled,kept,{de:conf.de,situation:conf.situation,level:a.level,
   extraKeep:conf.extraKeep,courage:a.courage+Number(pending?.prepaidCourage||0),cancelP:conf.cancelP,convertPairs:conf.convertPairs,
   drawMode:conf.drawMode,weight:conf.weight,bonusA:conf.bonusA,bonusP:conf.bonusP,skillBonusE:conf.skillBonusE});
  if(!r.ok)return {ok:false,error:r.errors.join("; ")};
  const free=keepLimit(a.level,false,false);
  pre={ok:true,result:r,cost:0,courageCost:Number(opts.extraKeep&&kept.length>free)};
 }
 return {...pre,health,affinity,manejo,stealth,companion,noisy,pronePenalty};
}
function preview(opts=options(),selectedIds=pending?.kept){
 if(!pending)return {ok:false,error:"Não existem dados rolados."};
 const a=byId(pending.actor),t=byId(pending.target);
 if(!a||!t)return {ok:false,error:"Atacante ou alvo não encontrado."};
 const pre=evaluate(a,pending.rolled,selectedIds,{...opts,...pending.declarationOptions});
 if(!pre.ok)return pre;
 if(pre.health.id==="morto")return {ok:false,error:"Combatente morto não pode agir."};
 const activations=pending.activations||[];
 if(activations.some(x=>!selectedActiveSkill(a,x.id)))return {ok:false,error:"Ativação de Perícia não adquirida."};
 const weapon=pending.weaponId?pending.weaponSnapshot:null;
 const weaponPlan=pending.weaponDeclaration?resolveDeclaredWeaponEffects(a,weapon,pending.weaponEffects||[],pending.weaponDeclaration,{success:pre.result.success,critical:pre.result.critical,thrown:!!pending.thrown}):planWeaponEffects(a,weapon,pending.weaponEffects||[],{success:pre.result.success,critical:pre.result.critical,thrown:!!pending.thrown});
 if(!weaponPlan.ok)return weaponPlan;
 const status=weaponEffectOutcome(weaponPlan.active,t,weapon);
 if(!status.ok)return status;
 const martialActive=pre.result.success&&pending.martial?.manoeuvre?[pending.martial.manoeuvre]:[];
 const manoeuvres=combatManoeuvreOutcome([...weaponPlan.active,...martialActive],a,t,pre.result.success);
 status.notes.push(...manoeuvres.notes);
 const propertySkills=(pending.weaponEffects||[]).length?
  [weaponActivationSkill(a,weapon,{thrown:!!pending.thrown}).required,
   weaponMasteryFor(weapon,{thrown:!!pending.thrown})]:[];
 // Uma mesma Perícia de arma não é cobrada duas vezes se também estiver no seletor genérico.
 const paidActivations=activations.filter(x=>!propertySkills.includes(x.id));
 const totalSkillCost=paidActivations.reduce((sum,x)=>sum+x.cost,0);
 const hostile=a.side==="inimigos",human=isHumanoidKind(a.kind);
 const healthCost=pre.health.coragem||0;
 // previewHumanoidRoll já debita Pavor por retenção e elevação; não cobrar de novo.
 const stepCost=!hostile&&!!pending.boosted?1:0;
 const courageCost=hostile?0:pending.prepaidCourage??((pre.courageCost||0)+healthCost+stepCost+totalSkillCost+weaponPlan.cost);
 const pavorCost=(pre.cost||0)+(hostile?(human?healthCost:0)+totalSkillCost+weaponPlan.cost:0);
 if(!hostile&&pending.prepaidCourage===undefined&&(courageCost+Number(a.courageRoundSpent||0)>5||courageCost>a.courage))return {ok:false,error:"Coragem insuficiente ou teto de 5 excedido."};
 if(pavorCost>a.pavorLocal)return {ok:false,error:"Pavor local insuficiente: requer "+pavorCost+"P, possui "+a.pavorLocal+"P."};
 const g1=pending.spellGrade===1&&pending.mode==="conjuracao";
 const poisonOnly=isPoisonOnlyWeapon(weapon);
 const life=g1?{eligible:false,damage:0,reason:"G1 não causa dano ofensivo automático."}:lifeAtFive(pre.result,t,weapon);
 if(poisonOnly)status.notes.push("Zarabatana: sem dano direto; controle de dose e duração do veneno manual.");
 const fulminanteActive=!!pending.fulminanteId;
 const criticalMultiplier=pre.result.critical===4?2:1;
 const extraP=fulminanteActive&&pre.result.success?
  (pre.result.p-Math.floor(pre.result.p/2))*criticalMultiplier:0;
 const blocked=!!$("perfurante-blocked").checked;
 // Perfurante e Fulminante substituem, cada um, piso(P/2) por P; nunca acumulam duas vezes.
 const piercing=pre.result.success&&status.applied!==null&&weaponPlan.active.includes("Perfurante")&&!blocked;
 const extraPierce=piercing&&!fulminanteActive?(pre.result.p-Math.floor(pre.result.p/2))*criticalMultiplier:0;
 const colossal=colossalOutcomes(pre.result,pending.colossal?.targets||[],pending.declarationOptions.de,pending.colossal?.areaDE);
 return {...pre,courageCost,pavorCost,activations:paidActivations,totalSkillCost,weaponPlan,status,martialActive,manoeuvres,colossal,
  integrityDamage:g1||poisonOnly?0:pre.result.damage+extraP+extraPierce,extraP,extraPierce,perfuranteBlocked:blocked,life};
}
function renderColossalControls(){
 const a=actor(),t=target(),el=$("colossal-targets");
 const active=pending?.colossal||(!pending&&a?selectedActivations(a,false).skills?.find(x=>x.id==="espalhar-golpe"):null);
 $("colossal-controls").hidden=!active;
 if(!active){el.innerHTML="";$("colossal-area-de").value="";return;}
 if(pending)$("colossal-area-de").value=pending.colossal.areaDE??"";
 const selected=new Set(pending?pending.colossal.targets.map(x=>x.id):[...el.selectedOptions].map(x=>x.value));
 const candidates=pending?pending.colossal.targets:state.combatants.filter(x=>x.id!==a?.id&&x.id!==t?.id&&x.side!==a?.side&&x.life!==0).map(x=>({id:x.id,name:x.name,de:defense(x)}));
 el.innerHTML=candidates.map(x=>'<option value="'+esc(x.id)+'"'+(selected.has(x.id)?' selected':'')+'>'+esc(x.name)+' · DE '+x.de+'</option>').join("");
 $("colossal-info").textContent="+"+active.cost+"E · até "+2*active.cost+" alvos adicionais · raio de 3 m centrado no atacante. Some as DE do principal e dos adicionais; se não alcançar a soma, só o principal pode ser atingido. Selecione somente quem está dentro da área, conforme a mesa. Em formações coordenadas, informe a DE total sem duplicar a defesa compartilhada.";
}
function colossalRows(rows,confirmed=false){
 if(!rows?.length)return "";
 return '<div class="cc-origins"><strong>Golpe Colossal · alvos adicionais</strong><ul>'+rows.map(x=>{
  const t=byId(x.id),armor=armorOf(t),apply=confirmed&&t&&armor&&x.integrityDamage>0&&!x.integrityApplied;
  return '<li>'+esc(x.name)+' · DE '+x.de+' · '+(x.success?"Acerto":"Falha")+' · '+(x.e??last?.e??0)+'E + '+(x.p??last?.p??0)+'P contra DE total '+(x.totalDE??x.de)+' · dano '+x.integrityDamage+' (somente Êxitos; Pavor não causa dano)'+
   (confirmed?(x.integrityApplied?" · Integridade aplicada":apply?' <button type="button" data-colossal-integrity="'+esc(x.id)+'">Aplicar à Integridade</button>':x.success&&!armor?" · Vida: resolver na mesa":""):"")+'</li>';
 }).join("")+'</ul></div>';
}
function renderDeclarationBudget(){
 renderColossalControls();
 const el=$("declaration-budget"),a=actor();
 if(!a){el.textContent="Escolha o atacante.";return;}
 if(a.side!=="jogadores"){el.textContent="Inimigos utilizam a reserva local de Pavor.";return;}
 if(pending){el.textContent="Coragem já paga: "+Number(pending.prepaidCourage||0)+" · declaração fixa.";return;}
 const declared=selectedActivations(a,false),w=chosenWeapon(),effects=selectedWeaponEffects(),thrown=$("attack-thrown").checked;
 const wp=declareWeaponEffects(a,w,effects,thrown),martial=martialDeclaration(),health=combatHealth(a);
 if(!declared.ok||!wp.ok||!martial.ok){el.textContent=declared.error||wp.error||martial.error;return;}
 const duplicated=effects.length?[weaponActivationSkill(a,w,{thrown}).required,weaponMasteryFor(w,{thrown})]:[];
 const skills=declared.skills.filter(x=>!duplicated.includes(x.id));
 const entries=[...skills.map(x=>[x.name,x.cost]),["Características da arma",wp.cost],["Técnica marcial",martial.cost],["Dado adicional",Number($("extra-keep").checked)],["Elevação de fonte",Number(!!$("step-source").value)],["Condição de Saúde",health.coragem||0]].filter(x=>x[1]>0);
 const total=entries.reduce((n,x)=>n+x[1],0),spent=Number(a.courageRoundSpent||0),plan=planCourageDeclaration(a,{activations:entries.map(x=>({cost:x[1]}))});
 el.textContent=(entries.length?entries.map(x=>x[0]+": "+x[1]).join(" · ")+" — ":"")+"Total a pagar: "+total+" · turno "+(spent+total)+"/5 · saldo "+a.courage+(plan.ok?"":" · "+plan.error);
}
function lockDeclaration(){
 const ids=["actor","target","base-source","attribute-source","extra-source","step-source","monster-keep","discipline-mode","weapon-source","draw-stow","attack-thrown","spell-grade","situation","difficulty","context-approved","extra-keep","colossal-targets","colossal-area-de","pugilism-on","punch-weight","martial-manoeuvre","active-skill","skill-courage","skill-approved","target-bleeding","roll","add-ally","add-enemy","next-round","demo","json-import"];
 const els=[...ids.map(id=>$(id)).filter(Boolean),...document.querySelectorAll("#weapon-effects input,#active-extra-skills input")];
 for(const el of els){if(pending&&!el.disabled){el.dataset.declarationLocked="1";el.disabled=true;}else if(!pending&&el.dataset.declarationLocked){delete el.dataset.declarationLocked;el.disabled=false;}}
 $("end-pending").hidden=!pending;
}
function renderDice(){
 lockDeclaration();renderDeclarationBudget();
 const element=$("dice");
 $("confirm").disabled=true;$("suggest").disabled=!pending;$("disarm-controls").hidden=true;
 if(!pending){
  element.innerHTML='<p>Selecione atacante e alvo antes de rolar.</p>';
  $("roll-result").textContent="Nenhuma rolagem pendente.";
  $("roll-origins").textContent="Os símbolos aparecerão separados por fonte, dado e modificador após a rolagem.";
  $("action-state").textContent="Aguardando declaração";return;
 }
 const pre=preview(),critInfo=criticalFaces(pending.rolled,pending.kept);
 const origins=rollProvenance(pending.rolled,pending.kept,{weapon:pending.weapon});
 element.innerHTML=origins.map(d=>{
  const {e,a,p}=d;
  return '<button type="button" class="cc-die'+(d.kept?" kept":"")+(isCriticalFace(d.sides,d.face)?" is-max":"")+(critInfo.critical&&d.kept?" is-critical":"")+'" data-die="'+esc(d.id)+
   '" aria-pressed="'+d.kept+'" title="Selecionar como mantido"><strong>'+d.face+
   '</strong><small>d'+d.sides+'</small>'+(isCriticalFace(d.sides,d.face)?'<small class="cc-face-max">FACE CRÍTICA</small>':'')+'<small class="cc-die-origin">'+esc(d.source)+
   (d.step?" (Elevado)":"")+(d.fulminante?" (Fulminante)":"")+'</small><span>'+
   (e?'<b class="cc-e">ᛋ'+e+'</b>':"")+(a?'<b class="cc-a">ᚨ'+a+'</b>':"")+
   (p?'<b class="cc-p">ᚦ'+p+'</b>':"")+(!e&&!a&&!p?"—":"")+'</span></button>';
 }).join("");
 const raw=origins.filter(x=>x.kept).map(x=>
  '<li><strong>'+esc(x.source)+'</strong> (d'+x.sides+', face '+x.face+'): '+
  '<span class="cc-e">'+x.e+'E</span>, <span class="cc-a">'+x.a+'A</span>, '+
  '<span class="cc-p">'+x.p+'P</span></li>').join("");
 const bonuses=pre.ok?[
  "Peso: "+pre.affinity.description,
   pre.result.drawSpent?"Saque Rápido: 1A reservado":pre.result.drawPenalty?"Saque: "+(pre.result.drawPenalty===-2?"Golpe de Sorte (−2E)":"Desvantagem Absoluta (−1E)"):null,
   byId(pending?.actor)?.statuses?.caido?"Caído: golpe em Desvantagem (−1A, sem duplicar a condição situacional).":null,
   pre.manejo?.active?pre.manejo.description:null,
  "Situação: "+$("situation").selectedOptions[0]?.textContent,
  "Saúde "+pre.health.id+": "+pre.health.e+"E, "+pre.health.a+"A, +"+pre.health.p+"P",
  pre.stealth?"Perícia em Furtividade: +1A":null,
  pre.companion?"Companheiro Pequeno presente e ativado: +1A":null,
  pending.colossal?"Golpe Colossal: +"+pending.colossal.cost+"E · DE total da área "+(pending.colossal.areaDE??(pending.declarationOptions.de+pending.colossal.targets.reduce((sum,t)=>sum+t.de,0)))+"; se não alcançar, apenas o principal pode ser atingido.":null,
  pending.fulminanteId?"Dado de arma elevado por "+pending.fulminanteId+": d6→d10, d10→d12 ou d12→2d12":null,
  pending.boosted?"Elevação temporária de fonte "+pending.boosted+": +1 Grau (dados já mostrados)":null,
  pre.result.critical?"CRÍTICO "+pre.result.critical+": "+critInfo.faces.map(x=>"d"+x.sides+" face "+x.face).join(", ")+
   (actor()?.side==="jogadores"?" · recupera "+pre.result.criticalRefundCourage+" Coragem":" · gera "+pre.result.monsterCriticalPavor+" Pavor (teto aplicado ao confirmar)"):null,
  pre.noisy?"Barulhenta (passiva): +1P, inclusive no crítico":null,
  ...pre.weaponPlan.active.map(x=>"Característica da arma: "+x+" (ativada no acerto)"),
  pending.martial?.weapon?"Soco de peso "+({leve:"Leve",medio:"Médio",pesado:"Pesado"}[pending.martial.category])+" · "+pending.martial.cost+" recurso já pago":null,
   ...pre.status.notes,
  pre.weaponPlan.active.length?"Coragem declarada para características: "+pre.weaponPlan.cost+(actor()?.side==="inimigos"?"P local":" Coragem")+
   " · "+pre.weaponPlan.free+" gratuitas":null,
  pre.perfuranteBlocked?"Perfurante: anulado pela defesa confirmada; dano básico mantido":null,
  Number($("cancel-p").value)?"Anulação: "+$("cancel-p").value+" P com Antecipar":null,
  Number($("convert-a").value)?"Conversão: "+$("convert-a").value+" Êxito(s) por pares de Antecipar":null,
  ...pre.activations.map(x=>"Perícia ativada: "+x.name+" ("+x.cost+(actor()?.side==="inimigos"?" Pavor":" Coragem")+")")
 ].filter(Boolean).map(x=>'<li>'+esc(x)+'</li>').join(""):"";
 $("roll-origins").innerHTML='<strong>Origem das runas mantidas</strong>'+
  (raw?'<ul>'+raw+'</ul>':'<p>Escolha dados para manter.</p>')+
  (bonuses?'<strong>Modificadores e conversões</strong><ul>'+bonuses+'</ul>':"")+
  '<small>Dados descartados não geram E, A ou P. Cada símbolo de Antecipar é gasto uma única vez.</small>';
 if(!pre.ok){$("roll-result").textContent=pre.error;return;}
 $("confirm").disabled=false;
 if(pre.manoeuvres.applied.disarm){const weapons=(byId(pending.target)?.items||[]).filter(x=>x.equipped&&["weapon","firearm"].includes(x.kind));const old=$("disarm-weapon").value;$("disarm-controls").hidden=!weapons.length;$("disarm-weapon").innerHTML=weapons.map(x=>'<option value="'+esc(x.id)+'">'+esc(x.name)+'</option>').join("");if(weapons.some(x=>x.id===old))$("disarm-weapon").value=old; $("disarm-destination").querySelector('option[value="bag"]').disabled=!hasQuickDraw(byId(pending.actor));if($("disarm-destination").selectedOptions[0]?.disabled)$("disarm-destination").value="ground";}else $("disarm-weapon").innerHTML="";
 const r=pre.result;
 $("roll-result").innerHTML=(r.critical?
  '<div class="cc-critical-result"><strong>CRÍTICO · '+r.critical+' DADOS NAS FACES CRÍTICAS</strong><small>'+
   critInfo.faces.map(x=>'d'+x.sides+' face '+x.face).join(' · ')+'</small></div>':'')+
  '<strong>'+esc(r.outcome)+'</strong>'+
  '<p><span class="cc-e">'+r.e+' Êxitos</span> + <span class="cc-p">'+r.p+
  ' Pavor</span> · <span class="cc-a">'+r.aRemaining+' Antecipar livre</span></p>'+
  '<p>DE '+r.de+' · total válido '+r.reached+' · dano à Integridade (potencial) '+
  pre.integrityDamage+' · Vida no patamar 5: '+(pre.life.damage===null?"PENDENTE":pre.life.damage)+
  '</p><small>'+esc(pre.life.reason)+' Gasto na ação: '+(pre.courageCost+(actor()?.side==="jogadores"&&pending.prepaidCourage===undefined?(pending.martial?.cost||0):0))+
  ' Coragem / '+(pre.pavorCost+(actor()?.side==="inimigos"?(pending.martial?.cost||0):0))+' Pavor local. '+(pre.health.id!=="saudavel"?"Estado: "+pre.health.id+". ":"")+
  (actor()?.kind==="monstro"&&pre.health.coragem>0?
   "Gasto para agir da criatura incapacitada/inconsciente: PENDENTE de procedimento.":"")+'</small>';
 $("roll-result").innerHTML+=colossalRows(pre.colossal);
 $("action-state").textContent="Rolado, aguardando confirmação";
}
function roll(){
 const a=actor(),t=target();
 if(!a||!t||a.id===t.id)return notice("Escolha um atacante e um alvo distintos.");
 if(a.acted)return notice(a.name+" já agiu nesta rodada. Avance a rodada.");
 if(pending)return notice("Confirme a rolagem pendente antes de rolar novamente.");
 const declared=selectedActivations(a);
 if(!declared.ok)return notice(declared.error);
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
 const draw=w?planDraw(a,w.id,[...$("draw-stow").selectedOptions].map(o=>o.value)):{ok:true,mode:"none",items:a.items};
 if(!draw.ok)return notice(draw.error);
 if(w){
  if((!w.eligible&&!projectileFamily(w))||!human||mode!=="armas"||key!=="armas_conjuracao")
   return notice("Dado de arma exige Disciplina em modo Armas e especialização do peso.");
  if(w.eligible){if(pool.pool.length+1>9)return notice("Máximo de 9 dados rolados por participante.");
  pool.pool.push({id:"equipment.0",group:"equipment",key:w.id,sides:w.die});}
 }
 const fulminants=declared.skills.filter(x=>["golpe-fulminante","disparo-fulminante"].includes(x.id));
 if(fulminants.length>1)return notice("Escolha apenas uma técnica Fulminante por dado de arma.");
 const thrown=$("attack-thrown").checked;
 if(thrown&&(!w||!a.skills.includes("maestria-arremesso-armas")))
  return notice("Arremesso exige arma equipada e Perícia em Arremesso de Armas.");
 let fulminanteId="";
 if(fulminants.length){
  if(!w)return notice("Fulminante exige dado de arma habilitada e equipada.");
  const changed=applyFulminanteToPool(pool.pool,w,fulminants[0].id,thrown);
  if(!changed.ok)return notice(changed.error);
  pool.pool=changed.pool;fulminanteId=fulminants[0].id;
 }
 let grade=null;
 if(human&&mode==="conjuracao"){
  if(key!=="armas_conjuracao")return notice("Conjuração exige Disciplina como fonte base.");
  if(!hasCombatFocus(a))
   return notice(a.race==="lucker_puro"?focusCombatStatus(a):
    "Conjuração exige Criar Item de Foco e Magia adquirido.");
  grade=Number($("spell-grade").value);
  const bonus=MAGIC_GRADE_DICE[grade]||[];
  if(pool.pool.length+bonus.length>9)return notice("Dado do Grau excede os 9 dados rolados.");
  if(grade>=2&&!confirm("Este Grau exige elementos, habilitação, focos e tempo adequados. O comparador só adiciona os dados do Grau e não resolve a preparação. Confirma a validação manual do Narrador?"))return;
  bonus.forEach((sides,i)=>pool.pool.push({id:"magic."+grade+"."+i,group:"magic",key:"G"+grade,sides}));
 }
 const martial=martialDeclaration();
 if(!martial.ok)return notice(martial.error);
 const colossalActivation=declared.skills.find(x=>x.id==="espalhar-golpe");
 let colossal=null;
 if(colossalActivation){
  if(!human||group!=="practice"||key!=="armas_conjuracao"||mode!=="armas"||thrown||(w&&!validFulminanteForWeapon(w,"golpe-fulminante",false)))return notice("Golpe Colossal exige ataque corpo a corpo com Disciplina.");
  colossal=planColossalTargets(a,t,state.combatants,[...$("colossal-targets").selectedOptions].map(x=>x.value),colossalActivation.cost);
  if(!colossal.ok)return notice(colossal.error);
  const areaRaw=$("colossal-area-de").value.trim(),primaryDE=Number($("difficulty").value);
  if(areaRaw!==""){const areaDE=Number(areaRaw);if(!Number.isInteger(areaDE)||areaDE<primaryDE)return notice("DE total da área deve ser inteira e não inferior à DE do principal.");colossal.areaDE=areaDE;}
 }
 const martialCost=martial.cost,hostile=a.side==="inimigos",health=combatHealth(a);
 if(health.id==="morto")return notice("Combatente morto não pode agir.");
 let shot={ok:true,items:draw.items,shot:null},shotEffect="",shotCost=0;
 if(projectileFamily(w)){
  const choices=shotChoices(draw.items,w);if(!choices.length)return notice("Sem munição compatível no acesso rápido.");
  const answer=prompt("Declare o projétil antes de rolar:\n"+choices.map((x,i)=>(i+1)+". "+x.label).join("\n"),"1");
  if(answer===null)return;const choice=choices[Number(answer)-1];if(!choice)return notice("Projétil inválido.");
  shot=planShot(draw.items,w,choice.id,choice.type);if(!shot.ok)return notice(shot.error);
  if(!isPoisonOnlyWeapon(w)&&a.skills.includes("armas-longo-alcance")&&Number(a.practices?.armas_conjuracao||0)>=1&&Number(a.attributes?.destreza||0)>=2&&confirm("Ativar "+choice.type+" por 1 Coragem? Efeito específico ainda sujeito ao Narrador.")){shotEffect=choice.type;shotCost=1;}
 }
 const weaponEffects=selectedWeaponEffects(),weaponDeclaration=declareWeaponEffects(a,w,weaponEffects,thrown);
 if(!weaponDeclaration.ok)return notice(weaponDeclaration.error);
 if(shotCost){weaponDeclaration.cost+=shotCost;}
 if(shot.shot&&isPoisonOnlyWeapon(w)&&weaponEffects.includes("Envenenar"))shotEffect="Envenenar";
 const propertySkills=weaponEffects.length||shotCost?[weaponActivationSkill(a,w,{thrown}).required,weaponMasteryFor(w,{thrown})]:[];
 const paidActivations=declared.skills.filter(x=>!propertySkills.includes(x.id));
 if(weaponEffects.includes("Cravar")){const outcome=weaponEffectOutcome(["Cravar"],t,w);if(!outcome.ok)return notice(outcome.error);}
 const declarationOptions={de:Number($("difficulty").value),situation:$("situation").value,extraKeep:$("extra-keep").checked};
 if(!Number.isInteger(declarationOptions.de)||declarationOptions.de<0||declarationOptions.de>30)return notice("Informe DE entre 0 e 30.");
 if(!hostile&&declarationOptions.extraKeep&&keepLimit(a.level,false,false)>=keepLimit(a.level,true,false))return notice("O Marco já alcançou o teto de dados mantidos.");
 let prepaidCourage;
 if(!hostile){
  const payment=planCourageDeclaration(a,{activations:paidActivations,weaponCost:weaponDeclaration.cost,martialCost,extraKeep:declarationOptions.extraKeep,step:!!selected,healthCost:health.coragem||0});
  if(!payment.ok)return notice(payment.error);
  prepaidCourage=payment.total;Object.assign(a,payment.actor);
  log("declaração",a.name+" pagou "+prepaidCourage+" Coragem antes de rolar. "+paidActivations.map(x=>x.name+" "+x.cost).join("; ")+". Características: "+weaponDeclaration.cost+"; retenção: "+Number(declarationOptions.extraKeep)+"; elevação: "+Number(!!selected)+"; marcial: "+martialCost+".",{actor:a.id,prepaidCourage,weaponEffects,activations:paidActivations.map(x=>({id:x.id,cost:x.cost}))});
 }else if(martialCost){
  if(a.pavorLocal<martialCost+paidActivations.reduce((sum,x)=>sum+x.cost,0)+weaponDeclaration.cost)return notice("Pavor local insuficiente.");
  a.pavorLocal-=martialCost;log("Perícia",a.name+" pagou "+martialCost+" Pavor local marcial antes de rolar.");
 }
 if(shot.shot){a.items=shot.items;draw.items=shot.items;log("munição",a.name+" disparou "+shot.shot.type+"; restante no recipiente: "+shot.shot.remaining+".",{actor:a.id,shot:shot.shot,shotEffect});}
 persist();renderResources();renderRoster();
 $("round-budget").textContent=hostile?"Pavor local restante: "+a.pavorLocal:"Turno · Coragem gasta "+a.courageRoundSpent+"/5 · restante "+Math.max(0,5-a.courageRoundSpent);
 const rolled=rollCreatureFaces(pool.pool);
 pending={actor:a.id,target:t.id,rolled,kept:rolled.slice(0,Math.min(2,rolled.length)).map(x=>x.id),
  mode,baseGroup:group,baseKey:key,spellGrade:grade,weapon:w?.name||"",
  weaponId:w?.id||"",boosted:selected,fulminanteId,activations:declared.skills,thrown,
  weaponEffects,weaponDeclaration,martial,draw,weaponSnapshot:w,prepaidCourage,declarationOptions,colossal,shot:shot.shot,shotEffect};
 persist();
 $("cancel-p").value="0";$("convert-a").value="0";
 renderDice();
}
function suggest(){
 if(!pending)return;
 const a=byId(pending.actor),rolled=pending.rolled,opts=options();
 const maximum=a.kind==="monstro"?Math.min(stats(a).keepMax,a.keep||2):
  a.side==="inimigos"&&isHumanoidKind(a.kind)?Math.min(4,(a.threatGrade>=2?3:2)+Number(opts.extraKeep)):
  keepLimit(a.level,opts.extraKeep,false);
 const mode=$("auto-goal").value;
 const best=bestKeepSelection(rolled,maximum,(ids,uses)=>
  preview({...opts,...uses},ids),mode);
 if(!best)return notice("Nenhuma combinação válida com os recursos, limite de retenção e efeitos declarados.");
 pending.kept=best.ids;persist();
 $("cancel-p").value=String(best.cancelP);$("convert-a").value=String(best.convertPairs);
 const r=best.preview.result;
 $("suggest-info").textContent="Sugestão "+(mode==="damage"?"ofensiva":mode==="safety"?"segura":"equilibrada")+
  ": "+best.ids.length+" mantidos, "+best.cancelP+"P anulados e "+best.convertPairs+
  " conversão(ões). "+r.outcome+(r.critical?" · CRÍTICO "+r.critical:"")+
  ". E "+r.e+" / A livre "+r.aRemaining+" / P "+r.p+
  ". Custos: "+(best.preview.courageCost+(a.side==="jogadores"&&pending.prepaidCourage===undefined?(pending.martial?.cost||0):0))+" Coragem, "+(best.preview.pavorCost+(a.side==="inimigos"?(pending.martial?.cost||0):0))+"P local. Todas as opções válidas foram comparadas.";
 renderDice();
}

function confirmRoll(){
 if(!pending)return;
 const a=byId(pending.actor),t=byId(pending.target),pre=preview();
 if(!a||!t||!pre.ok)return notice(pre.error||"Rolagem inválida.");
 if(a.acted)return notice("Este combatente já agiu na rodada.");
 const r=pre.result;
 const disarm=pre.manoeuvres.applied.disarm&&$("disarm-weapon").value?disarmTransfer({...a,items:pending.draw?.mode!=="none"?pending.draw.items:a.items},t,$("disarm-weapon").value,$("disarm-destination").value,unique()):null;
 if(disarm&&!disarm.ok)return notice(disarm.error);
 if(pre.manoeuvres.applied.disarm&&!disarm&&t.items.some(x=>x.equipped&&["weapon","firearm"].includes(x.kind)))return notice("Escolha a arma a desarmar.");
 if((pending.prepaidCourage===undefined&&pre.courageCost>a.courage)||pre.pavorCost>a.pavorLocal)
  return notice("Coragem ou Pavor local insuficiente.");
 if(pending.draw?.mode&&pending.draw.mode!=="none"){a.items=pending.draw.items;log("saque",a.name+" sacou "+pending.weapon+" — "+(r.drawSpent?"1A gasto":r.drawPenalty+"E")+".");}
 if(pending.prepaidCourage===undefined)a.courage=Math.max(0,a.courage-pre.courageCost);
 a.pavorLocal=Math.max(0,a.pavorLocal-pre.pavorCost);
 if(a.side==="jogadores"&&pending.prepaidCourage===undefined)a.courageRoundSpent=Math.min(5,(a.courageRoundSpent||0)+pre.courageCost);
 for(const skill of pre.activations)log("Perícia",a.name+" ativou "+skill.name+
  " (−"+skill.cost+(a.side==="inimigos"?" Pavor local":" Coragem")+").");
 $("skill-approved").checked=false;
 activeExtraSelections.clear();
 if(a.side==="jogadores")a.courage=Math.min(maxCourage(a.level),a.courage+Number(r.criticalRefundCourage||0));
 if(a.side==="inimigos"&&r.monsterCriticalPavor){
  const cap=monsterCap(a.threatGrade),free=Math.max(0,cap-a.pavorLocal);
  const own=Math.min(free,r.monsterCriticalPavor);
  a.pavorLocal+=own;
  const publicCap=narratorCap(state.combatants.filter(x=>x.side==="jogadores").length);
  state.publicPavor=Math.min(publicCap,state.publicPavor+Math.max(0,r.monsterCriticalPavor-own));
 }
 const alreadyBleeding=!!t.statuses?.sangramento;
 const moved=transferPavor(a,t,r.p,state.publicPavor);
 Object.assign(t,moved.target);
 Object.assign(t,applyCombatManoeuvres(t,pre.manoeuvres));
 if(disarm?.ok){a.items=disarm.attacker.items;t.items=disarm.target.items;if(disarm.ground)state.groundItems.push(disarm.ground);log("Desarmar",a.name+" retirou "+disarm.weapon+" de "+t.name+" → "+$("disarm-destination").selectedOptions[0].textContent);}

 if(pre.status.applied?.envenenado){
  const changed=markCondition(t,"envenenado",true);
  if(changed.ok){Object.assign(t,changed.actor);log("status",t.name+" recebeu 1 acúmulo de Envenenamento por 2 rodadas pela Zarabatana de "+a.name+"; controle individual manual.");}
 }
 if(pre.status.applied?.sangramento){
  const changed=markCondition(t,"sangramento",true);
  if(changed.ok){Object.assign(t,changed.actor);log("status",t.name+" recebeu Sangramento por Cortante de "+a.name+
   " (sem dano direto; armadura não impede a condição).");}
 }
 if(pre.status.applied?.cravar){
  const shield=t.items.find(x=>x.kind==="shield"&&x.equipped);
  const stuckWeapon=a.items.find(x=>x.id===pending.weaponId);
  if(shield&&stuckWeapon){
   t.statuses={...t.statuses,cravadas:[...(t.statuses?.cravadas||[]),{
    name:stuckWeapon.name,weaponId:stuckWeapon.id,attackerId:a.id,shieldId:shield.id,category:stuckWeapon.category}]};
   stuckWeapon.equipped=false;
   log("status",a.name+" cravou "+stuckWeapon.name+" no escudo de "+t.name+
    " (−1E cumulativo somente em Levantar Escudo; retirar conforme DE da arma).");
  }
 }
 for(const note of pre.status.notes)log("arma",a.name+": "+note);
 if(pending.shotEffect&&pending.shotEffect!=="Envenenar"&&r.success)log("munição",a.name+": "+pending.shotEffect+" declarado; efeito específico ainda pendente, resolver manualmente.");
 if(pre.companion&&r.success&&a.smallCompanion?.species==="serpente"&&alreadyBleeding){
  const changed=markCondition(t,"envenenado",true);
  if(changed.ok){Object.assign(t,changed.actor);log("companheiro",a.name+
   ": serpente "+(a.smallCompanion.name||"domesticada")+" aplicou Envenenado ao alvo em Sangramento (sem dano direto automático).");}
 }
 a.acted=true;
 const crit=criticalFaces(pending.rolled,pending.kept);
 const keptFaces=crit.faces.map(x=>"d"+x.sides+" face "+x.face).join(", ");
 last={actor:a.id,name:a.name,target:t.id,targetName:t.name,outcome:r.outcome,e:r.e,p:r.p,
  critical:r.critical,keptFaces,activeWeaponEffects:pre.weaponPlan.active,activeMartialEffects:pre.martialActive,manoeuvreNotes:pre.manoeuvres.notes,
  criticalRefund:r.criticalRefundCourage||0,criticalPavor:r.monsterCriticalPavor||0,
  de:r.de,integrityDamage:pre.integrityDamage,lifeDamage:pre.life.damage===2?2:0,
  integrityApplied:false,lifeApplied:false,colossal:pre.colossal};
 log("rolagem",a.name+" → "+t.name+": "+r.outcome+" ("+r.e+"E, "+r.p+"P). "+
  (r.critical?"CRÍTICO "+r.critical+": "+keptFaces+". ":"Faces mantidas: "+keptFaces+". ")+
  "Dano convencional potencial "+pre.integrityDamage+" à Integridade. Vida pelo patamar 5: "+
  (pre.life.damage===2?"2 (se permanecer sem armadura)":"não automática")+". "+
  moved.notes.join(" "),{actor:a.id,target:t.id,rolled:pending.rolled,kept:pending.kept,
   damagePotential:pre.integrityDamage,lifeAtFive:pre.life.damage===2?2:null,
   courageCost:pre.courageCost+(a.side==="jogadores"&&pending.prepaidCourage===undefined?(pending.martial?.cost||0):0),pavorCost:pre.pavorCost+(a.side==="inimigos"?(pending.martial?.cost||0):0),weapon:pending.weapon||pending.martial?.weapon?.name,martial:pending.martial,martialEffects:pre.martialActive,
   elevation:pending.boosted||"",activeSkills:pre.activations.map(x=>({id:x.id,cost:x.cost})),
   colossal:pre.colossal,fulminante:pending.fulminanteId||"",companion:pre.companion,health:pre.health.id,weight:pre.affinity.description,
   critical:r.critical,keptFaces,weaponEffects:pre.weaponPlan.active,weaponEffectCost:pre.weaponPlan.cost,
   manoeuvres:pre.manoeuvres,weaponNotes:pre.status.notes,criticalRefund:r.criticalRefundCourage||0,criticalPavor:r.monsterCriticalPavor||0});
 state.resourceActor=t.id;pending=null;resetMartial();
 $("weapon-effects").querySelectorAll("[data-weapon-property]:checked").forEach(el=>el.checked=false);
 persist();render(false);renderWeapons();
 $("action-state").textContent="Rolagem confirmada";
 notice("Rolagem confirmada. Pavor atualizado. Dano à Integridade e Vida ainda exigem aplicação.");
}
function change(field,delta,itemId=null){
 if(pending)return notice("Confirme ou encerre a rolagem antes de ajustar recursos.");
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
function applyColossalIntegrity(id){
 if(pending)return notice("Confirme a rolagem atual primeiro.");
 const row=last?.colossal?.find(x=>x.id===id),t=byId(id),armor=armorOf(t);
 if(!row?.success||row.integrityApplied||!armor||row.integrityDamage<1)return notice("Sem Integridade adicional aplicável.");
 const changed=updateResource(t,armor.id,"integridade",-row.integrityDamage);
 if(!changed.ok)return notice(changed.error);
 Object.assign(t,changed.actor);row.integrityApplied=true;
 log("integridade",t.name+": Golpe Colossal — "+row.integrityDamage+" dano potencial à Integridade; excedente manual.");
 persist();render(false);
}
function applyConfirmed(which){
 if(pending)return notice("Confirme ou encerre a rolagem antes de aplicar dano.");
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
 if(pending)return notice("Confirme ou encerre a rolagem antes de avançar.");
 state.round=Math.min(9999,state.round+1);
 for(const c of state.combatants){c.acted=false;c.courageRoundSpent=0;}
 pending=null;log("rodada","Rodada "+state.round+". Oportunidades restauradas; não há cura automática.");
 persist();render();
}
function demo(){
 if(pending)return notice("Confirme ou encerre a rolagem antes de substituir o combate.");
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
 if(pending)return notice("Confirme ou encerre a rolagem antes de importar.");
 if(!file)return;
 if(file.size>3e6)return notice("JSON deve ter até 3 MB.");
 file.text().then(str=>{
  const raw=JSON.parse(str);
  if(raw?.version===1&&Array.isArray(raw.combatants)){
   if(state.combatants.length&&!confirm("Substituir o confronto por este arquivo?"))return;
   state=empty();for(const c of raw.combatants.slice(0,MAX))
    add(c,["jogadores","inimigos"].includes(c.side)?c.side:"inimigos","Comparador importado");
   state.round=Math.floor(clamp(raw.round,1,9999));state.groundItems=(Array.isArray(raw.groundItems)?raw.groundItems:[]).slice(0,200).map(normalizeEquipment);
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
 document.addEventListener("change",()=>renderDeclarationBudget());
 document.addEventListener("click",event=>{
  const button=event.target.closest("button");if(!button)return;
  if(button.dataset.colossalIntegrity){applyColossalIntegrity(button.dataset.colossalIntegrity);return;}
  if(button.dataset.inspect){openCombatantSheet(button.dataset.inspect);return;}
  if(button.dataset.inspectSelected){
   openCombatantSheet(button.dataset.inspectSelected==="actor"?state.actor:state.target);return;
  }
  if(pending&&(button.dataset.actor||button.dataset.target||button.dataset.remove))return notice("Confirme ou encerre a rolagem antes de alterar participantes.");
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
   persist();renderDice();
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
 $("weapon-source").addEventListener("change",()=>{
  pending=null;$("weapon-effects").innerHTML="";$("perfurante-blocked").checked=false;
  renderDrawControls();renderMartial();renderWeaponEffects();renderDice();
 });
 $("weapon-effects").addEventListener("change",event=>{
  if(!event.target.matches("[data-weapon-property]"))return;
  if(pending){event.target.checked=pending.weaponEffects.includes(event.target.dataset.weaponProperty);return notice("Características já declaradas; não se alteram após rolar.");}
  renderDice();
 });
 $("perfurante-blocked").addEventListener("change",()=>{if(pending)renderDice();});
 for(const id of ["base-source","attribute-source","extra-source"]){
  $(id).addEventListener("change",()=>{pending=null;renderStepChoices();renderMartial();renderDice();});
 }
 $("step-source").addEventListener("change",()=>{pending=null;renderDice();});
 $("discipline-mode").addEventListener("change",()=>{pending=null;renderMartial();renderDice();});
 for(const id of ["pugilism-on","punch-weight","martial-manoeuvre"])$(id).addEventListener("change",()=>{if(pending){$("pugilism-on").checked=!!(pending.martial?.cost&&pending.martial?.category!=="medio");$("punch-weight").value=pending.martial?.category==="pesado"?"pesado":"leve";$("martial-manoeuvre").value=pending.martial?.manoeuvre||"";return notice("A declaração marcial fica fixa depois de rolar.");}renderMartial();});
 $("active-skill").addEventListener("change",()=>{
  $("skill-approved").checked=false;pending=null;
  if(["golpe-fulminante","disparo-fulminante","domar-criatura-pequena","espalhar-golpe"].includes($("active-skill").value))$("skill-courage").value="1";
  // Selecionar a Perícia da arma habilita sua única propriedade automaticamente;
  // com várias propriedades o jogador decide qual ativar, sem adivinhar.
  const weapon=chosenWeapon(),access=weaponActivationSkill(actor(),weapon,{thrown:$("attack-thrown").checked});
  const props=activeWeaponProperties(weapon);
  if(props.length===1&&access.ok&&$("active-skill").value===access.required){
   const single=$("weapon-effects").querySelector("[data-weapon-property]");
   if(single&&!single.disabled)single.checked=true;
  }
  renderAdditionalSkills((actor()?.skills||[]).filter(id=>!["pugilismo","artista-marcial","saque-rapido"].includes(id)).map(id=>selectedActiveSkill(actor(),id)).filter(Boolean));
  updateSkillInfo();renderDice();
 });
 for(const id of ["skill-courage","skill-approved"]){
  $(id).addEventListener("change",()=>{pending=null;updateSkillInfo();renderDice();});
 }
 $("active-extra-skills").addEventListener("change",event=>{
  const el=event.target;
  const key=el.dataset.extraSkill||el.dataset.extraSkillCost;
  if(!key)return;
  if(el.dataset.extraSkill){
   if(el.checked){
    const value=$("active-extra-skills").querySelector('[data-extra-skill-cost="'+key+'"]')?.value||"1";
    activeExtraSelections.set(key,Number(value));
   }else activeExtraSelections.delete(key);
  }else if(activeExtraSelections.has(key))activeExtraSelections.set(key,Number(el.value));
  pending=null;renderDice();
 });
 $("attack-thrown").addEventListener("change",()=>{pending=null;renderMartial();renderWeaponEffects();renderDice();});
 $("target-bleeding").addEventListener("change",event=>{
  const t=target();if(!t)return;
  const changed=markCondition(t,"sangramento",event.target.checked);
  if(changed.ok){Object.assign(t,changed.actor);pending=null;
   log("condição",t.name+(event.target.checked?" entrou em Sangramento.":" deixou Sangramento."));
   persist();render(false);}
 });
 $("monster-keep").addEventListener("change",event=>{
  const a=actor(),n=Number(event.target.value);
  if(!a||a.kind!=="monstro"||!Number.isInteger(n)||n<2||n>stats(a).keepMax)return;
  a.keep=n;pending=null;persist();render(false);
 });
 $("roll").addEventListener("click",roll);
 $("end-pending").addEventListener("click",()=>{if(!pending||!confirm("Encerrar a rolagem sem resolver o ataque? Os recursos já pagos não são devolvidos."))return;log("declaração","Rolagem encerrada sem resolução; gastos anteriores mantidos.");pending=null;persist();render();});
 $("suggest").addEventListener("click",suggest);
 $("confirm").addEventListener("click",confirmRoll);
 for(const field of ["extra-keep","cancel-p","convert-a","situation","difficulty","spell-grade"])
  $(field).addEventListener("change",()=>{if(pending)renderDice();});
 $("resource-actor").addEventListener("change",event=>{
  state.resourceActor=event.target.value;persist();renderResources();
 });
 $("resource-kind").addEventListener("change",renderResources);
 $("stand-up").addEventListener("click",()=>{const c=byId(state.resourceActor);if(pending)return notice("Confirme a rolagem antes de alterar condições.");if(!c||!confirm("Confirma que o combatente tem 4 movimentos disponíveis e irá gastá-los na mesa?"))return;const result=standFromProne(c,4);if(!result.ok)return notice(result.error);Object.assign(c,result.actor);log("condição",c.name+" gastou 4 movimentos para se levantar.");persist();render(false);});
 $("escape-grapple").addEventListener("click",()=>{const c=byId(state.resourceActor);if(pending)return notice("Confirme a rolagem antes de alterar condições.");if(!c||$("escape-total").value==="")return notice("Informe o resultado do teste de libertação.");const result=escapeGrapple(c,byId(c.statuses?.agarradoPor),Number($("escape-total").value));if(!result.ok)return notice(result.error);Object.assign(c,result.actor);log("condição",c.name+": teste de libertação "+$("escape-total").value+" contra DE "+result.de+" — "+(result.success?"libertou-se":"permanece agarrado")+".");$("escape-total").value="";persist();render(false);});
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
bind();scan();render();if(pending){$("difficulty").value=String(pending.declarationOptions.de);$("situation").value=pending.declarationOptions.situation;$("extra-keep").checked=pending.declarationOptions.extraKeep;renderDice();}
