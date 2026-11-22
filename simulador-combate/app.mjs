/* Codex RPG — Comparador de combate sem tabuleiro, com dados das fichas e alterações locais. */
import {normalizeCombatant,listBrowserSheets,defense,armorOf,equippedWeapons,weightAffinity,lifeAtFive,transferPavor,updateResource,weightUsed}
 from "./comparador-logic.mjs";
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
   history:(Array.isArray(data.history)?data.history:[]).slice(0,350)};
 }catch{return empty();}
}
let state=load(),available=[],pending=null,last=null,lastActor="",toastTimer;
const byId=id=>state.combatants.find(x=>x.id===id)||null;
const actor=()=>byId(state.actor),target=()=>byId(state.target);
function notice(msg){const el=$("notice");el.textContent=msg;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,4500);}
function persist(){try{localStorage.setItem(SAVE,JSON.stringify(state));}catch(e){notice("Não foi possível salvar o combate: "+e.message);}}
function log(kind,message,data={}){
 state.history.unshift({id:unique(),at:new Date().toISOString(),round:state.round,kind,message,...data});
 state.history=state.history.slice(0,350);
}
function add(raw,side,source){
 if(state.combatants.length>=MAX)return false;
 const item=normalizeCombatant(raw,side,source);
 item.id=unique();item.sourceId=String(raw.id||"");item.acted=false;
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
 const profile=available[Number($("available").value)];
 if(!profile)return notice("Selecione uma ficha.");
 if(!add(profile.raw,side,profile.source))return notice("Limite de "+MAX+" fichas.");
 log("importação",profile.name+" entrou do "+profile.source+".");persist();render();
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
   '<div class="cc-card-stats"><span>DE '+defense(c)+'</span><span>Vida '+c.life+'</span>'+
   '<span>Coragem '+c.courage+'</span><span>Pavor '+c.pavorLocal+'</span><span>Integridade '+
   (armor?armor.integrity+"/"+armor.integrityMax:"—")+'</span></div>'+
   (c.acted?'<small class="cc-used">Já agiu nesta rodada</small>':'')+
   '<div class="cc-card-actions"><button type="button" data-actor="'+esc(c.id)+'">Atacar</button>'+
   '<button type="button" data-target="'+esc(c.id)+'">Alvo</button>'+
   '<button type="button" data-remove="'+esc(c.id)+'">Retirar</button></div></article>';
 }).join(""):'<p class="cc-help">Nenhum combatente.</p>';
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
}
