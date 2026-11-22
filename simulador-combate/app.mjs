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
}
function renderWeapons(){
 const a=actor(),weapons=a?equippedWeapons(a,catalog()):[],old=$("weapon-source").value;
 $("weapon-source").innerHTML='<option value="">Sem dado de arma</option>'+weapons.map(w=>
  '<option value="'+esc(w.id)+'"'+(w.eligible?"":" disabled")+'>'+esc(w.name)+
  ' · '+(w.die?"d"+w.die:"dado não cadastrado")+
  (w.eligible?"":" · requer "+esc(w.skill))+'</option>').join("");
 if(weapons.some(w=>w.id===old&&w.eligible))$("weapon-source").value=old;
 renderAffinity();
}
function chosenWeapon(){
 return equippedWeapons(actor(),catalog()).find(w=>w.id===$("weapon-source").value)||null;
}
function renderAffinity(){
 const hint=weightAffinity(chosenWeapon(),target());
 $("weight-affinity").textContent=hint.description+" Carga do atacante: "+
  (actor()?weightUsed(actor()).toFixed(3):"—")+
  ". A categoria da armadura equipada determina a afinidade defensiva.";
 $("apply-affinity").disabled=hint.status!=="known"||hint.delta===0;
 return hint;
}
function options(){
 return {de:Number($("difficulty").value),situation:$("situation").value,extraKeep:$("extra-keep").checked,
  cancelP:Number($("cancel-p").value),convertPairs:Number($("convert-a").value)};
}
function evaluate(a,rolled,kept,opts){
 if(a.side==="inimigos"&&a.kind==="monstro")return previewCreatureRoll(a,rolled,kept,opts);
 if(a.side==="inimigos"&&isHumanoidKind(a.kind))return previewHumanoidRoll(a,rolled,kept,opts);
 if(a.kind==="monstro")return previewCreatureRoll(a,rolled,kept,opts);
 const r=resolveRoll(rolled,kept,{de:opts.de,situation:opts.situation,level:a.level,
  extraKeep:opts.extraKeep,courage:a.courage,cancelP:opts.cancelP,convertPairs:opts.convertPairs});
 if(!r.ok)return {ok:false,error:r.errors.join("; ")};
 const free=keepLimit(a.level,false,false);
 return {ok:true,result:r,cost:0,courageCost:Number(opts.extraKeep&&kept.length>free)};
}
function preview(){
 if(!pending)return {ok:false,error:"Não existem dados rolados."};
 const a=byId(pending.actor),t=byId(pending.target);
 if(!a||!t)return {ok:false,error:"Atacante ou alvo não encontrado."};
 const pre=evaluate(a,pending.rolled,pending.kept,options());
 if(!pre.ok)return pre;
 const g1=pending.spellGrade===1&&pending.mode==="conjuracao";
 const life=g1?{eligible:false,damage:0,reason:"G1 não causa dano ofensivo automático."}:
  lifeAtFive(pre.result,t);
 return {...pre,integrityDamage:g1?0:pre.result.damage,life};
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
 const pool=composeActionPool(a,choice);
 if(!pool.ok)return notice(pool.error||"Combinação de dados inválida.");
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
  if(grade>=3&&!confirm("Graus 3 e 4 exigem habilitações, elementos, focos e tempo válidos. Confirme que o Narrador autorizou esta conjuração antes de rolar."))return;
  bonus.forEach((sides,i)=>pool.pool.push({id:"magic."+grade+"."+i,group:"magic",key:"G"+grade,sides}));
 }
 const rolled=rollCreatureFaces(pool.pool);
 pending={actor:a.id,target:t.id,rolled,kept:rolled.slice(0,Math.min(2,rolled.length)).map(x=>x.id),
  mode,spellGrade:grade,weapon:w?.name||""};
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
