/* Simulador de combate Codex RPG — experimento de VTT para análise, sem novas regras.
   Reutiliza os dados e validações simbólicas do Criar Conflito; decisões pendentes são manuais. */
import {WIDTH,HEIGHT,MAX_TOKENS,cellKey,inBounds,distance,tileAt,lineOfSight,movementAllowance,plannedMove,
 dodgeBonus,armorPenalty,defenseWithStance,initialScenario,validateTerrain,limitTokens} from "./logic.mjs";
import {blank,normalize,stats,isHumanoidKind,ATTRIBUTES,KNOWLEDGES,PRACTICES} from "../criar-conflito/rules.mjs?v=20261115-kinds1";
import {composeActionPool,rollCreatureFaces,previewHumanoidRoll,previewCreatureRoll,settleCreatureRoll,faceSymbols}
 from "../criar-conflito/roll-engine.mjs";
import {naturalDE,lifeMax,resolveRoll,keepLimit,SITUATIONS} from "../criar-conflito/codex-rules.mjs";

const SAVE="codex-rpg-simulador-tatico-v1",PLAYER_SAVE="codex-html-ficha-prototipo-v1",
 CONFLICT_SAVE="codex-rpg-criar-conflito-v1";
const $=id=>document.getElementById(id),freshId=()=>globalThis.crypto?.randomUUID?.()||"t-"+Date.now()+"-"+Math.random().toString(36).slice(2);
const esc=v=>String(v??"").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;");
const clamp=(v,a,b)=>Math.min(b,Math.max(a,Number.isFinite(Number(v))?Number(v):a));
const defs={attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES};
let state=load(),pending=null,lastActor="",lastTarget="",noticeHandle=null;
function notice(message){
 const el=$("notice");el.textContent=message;el.hidden=false;clearTimeout(noticeHandle);
 noticeHandle=setTimeout(()=>el.hidden=true,5000);
}
function record(kind,message,extra={}){
 state.history.unshift({id:freshId(),date:new Date().toISOString(),round:state.round,kind,message,...extra});
 state.history=state.history.slice(0,350);
}
function persist(){
 try{localStorage.setItem(SAVE,JSON.stringify(state));}catch(err){notice("Não foi possível salvar no navegador: "+err.message);}
}
function load(){
 try{
  const raw=JSON.parse(localStorage.getItem(SAVE)||"null");if(!raw||raw.version!==1)return initialScenario();
  return {...initialScenario(),round:Math.floor(clamp(raw.round,1,9999)),
   terrain:validateTerrain(raw.terrain),tokens:limitTokens(raw.tokens).filter(t=>inBounds(t.x,t.y)&&t.name),
   history:Array.isArray(raw.history)?raw.history.slice(0,350):[],
   selected:String(raw.selected||""),target:String(raw.target||""),tool:"mover"};
 }catch{return initialScenario();}
}
function tokenById(id){return state.tokens.find(t=>t.id===id)||null;}
const selected=()=>tokenById(state.selected),target=()=>tokenById(state.target);
function standardArmor(raw){
 const arr=Array.isArray(raw.items)?raw.items:[];
 const it=arr.find(x=>(x.type==="armadura"||x.kind==="armor")&&x.equipped);
 if(!it)return {equipped:false,weight:"",integrity:0,max:0,name:"Nenhuma"};
 let w=typeof it.weight==="string"?it.weight:(it.category||it.weightClass||"");
 w=String(w).toLowerCase().replace(/[- ]/g,"_");
 if(w==="muito_pesado")w="extremo";
 if(w==="pesado")w="alto";
 return {equipped:true,weight:w,integrity:Math.floor(clamp(it.integrity??it.hp??it.integrityMax??it.max,0,999)),
  max:Math.floor(clamp(it.integrityMax??it.max,0,999)),name:String(it.name||"Armadura")};
}
function equippedWeapons(actor){
 const catalog=Array.isArray(window.CODEX_G1_CATALOG)?window.CODEX_G1_CATALOG:[];
 const skills=actor?.skills||[];
 return (actor?.items||[]).filter(it=>it.equipped&&(it.type==="arma"||it.kind==="weapon"||it.kind==="firearm"))
  .map(it=>{
   const entry=catalog.find(row=>row.name?.toLowerCase()===String(it.name||"").toLowerCase());
   const category=String(entry?.category||it.category||"leve");
   const firearm=!!it.firearm||it.kind==="firearm"||entry?.kind==="firearm";
   const expected=firearm?"armas-fogo":category==="medio"?"armas-medias":
    category==="pesado"?"armas-pesadas":"armas-leves";
   const die=Number(it.die||entry?.die||0);
   return {id:String(it.id||it.name),name:String(it.name||"Arma"),die,expected,
    allowed:skills.includes(expected)&&[6,10,12].includes(die)};
  });
}
function formatPlayer(raw){
 const t=blank("humanoide");t.kind="humanoide";
 t.name=String(raw.name||raw.nome||"Jogador").slice(0,100);
 t.level=Math.floor(clamp(raw.level||1,1,20));
 for(const [field,entries] of [["attributes",ATTRIBUTES],["knowledges",KNOWLEDGES],["practices",PRACTICES]]){
  for(const [key] of entries)t[field][key]=Math.floor(clamp(raw[field]?.[key],0,6));
 }
 t.skills=Array.isArray(raw.skills)?raw.skills.filter(x=>typeof x==="string").slice(0,100):[];
 t.life=Math.floor(clamp(raw.life??lifeMax(t),0,999));
 t.courage=Math.floor(clamp(raw.courage??10,0,10));
 t.items=Array.isArray(raw.items)?raw.items.slice(0,70):[];
 return t;
}
function placeFor(side){
 const placements=side==="jogadores"?[[2,2],[3,5],[3,8],[1,10],[5,2],[5,10]]:
  [[17,2],[17,6],[16,10],[14,4],[18,9],[13,10]];
 const occupied=new Set(state.tokens.map(t=>cellKey(t.x,t.y)));
 for(const [x,y] of placements){
  if(!occupied.has(cellKey(x,y))&&tileAt(state.terrain,x,y)!=="parede")return {x,y};
 }
 for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++)
  if(!occupied.has(cellKey(x,y))&&tileAt(state.terrain,x,y)!=="parede")return {x,y};
 return null;
}
function insert(source,side="inimigos",player=false){
 if(state.tokens.length>=MAX_TOKENS)return false;
 const at=placeFor(side);if(!at)return false;
 const unit=player?formatPlayer(source):normalize(source);
 const armor=standardArmor(source);
 const t={...unit,id:freshId(),side,x:at.x,y:at.y,moved:0,armor,shieldRound:0,shieldDe:null,
  sourceId:String(source?.id||"").slice(0,100)};
 if(!Number.isFinite(t.life))t.life=lifeMax(t);
 if(t.kind==="monstro")t.keep=stats(t).keepMax; // Limite disponível, não retenção já paga.
 state.tokens.push(t);
 if(!state.selected)state.selected=t.id;
 return true;
}
function preset(){
 if(state.tokens.length&&!confirm("Substituir o mapa e as fichas atuais pelo confronto 3×3?"))return;
 state=initialScenario();pending=null;lastActor="";lastTarget="";
 function unit(name,kind,side,attrs={},practices={},skills=[],xp=0,grade=1,armor={}){
  const u=blank(kind);u.name=name;Object.assign(u.attributes,attrs);Object.assign(u.practices,practices);
  u.skills=skills;u.xp=xp;u.threatGrade=grade;u.life=lifeMax(u);u.pavorLocal=stats(u).limitLocal;
  u.items=armor.equipped?[{id:freshId(),name:armor.name,kind:"armor",equipped:true,
   weight:0,category:armor.weight,integrityMax:armor.max,integrity:armor.integrity}]:[];
  insert(u,side,false);
 }
 unit("Mago","humanoide","jogadores",{inteligencia:2,vigor:1},{armas_conjuracao:2,artesao:1},
  ["disciplina-avancada","criar-item-foco-magia","vento","trevas","escudo-arcano"],0,1,
  {equipped:true,name:"Armadura Muito Leve G1",weight:"muito_leve",max:0,integrity:0});
 unit("Guerreiro","humanoide","jogadores",{forca:2,agilidade:2,destreza:1,vigor:2},{armas_conjuracao:2},["armas-medias"],0,1,
  {equipped:true,name:"Armadura Média G1",weight:"medio",max:12,integrity:12});
 unit("Tank","humanoide","jogadores",{forca:2,agilidade:2,vigor:3},{armas_conjuracao:1},["armas-medias","recobrar-coragem"],0,1,
  {equipped:true,name:"Armadura Pesada G1",weight:"alto",max:17,integrity:17});
 unit("Lobo ágil","monstro","inimigos",{agilidade:2,destreza:2,forca:1,vigor:1},{},[],20,1);
 unit("Atirador","humanoide","inimigos",{destreza:2,agilidade:2,vigor:1},{armas_conjuracao:2},
  ["armas-fogo","disciplina-avancada"],0,1,{equipped:true,name:"Armadura Leve G1",weight:"leve",max:7,integrity:7});
 unit("Lobo pesado","monstro","inimigos",{agilidade:3,vigor:3},{},[],40,2);
 for(const [name,weapon,die] of [["Guerreiro","Espada Longa",10],["Tank","Espada Longa",10],["Atirador","Revólver",6]]){
  const actor=state.tokens.find(t=>t.name===name);
  actor.items.push({id:freshId(),name:weapon,kind:"weapon",die,equipped:true,qty:1,weight:0});
 }
 state.target=state.tokens.find(t=>t.name==="Atirador").id;
 record("cenário","Confronto 3×3 preparado. Magia G2 causa dano; G1 só efeitos. Mago começa ativo, com Muito Leve.");
 persist();renderAll();notice("Confronto carregado. Mago começa; distância, paredes e cobertura importam.");
}
function renderRoster(){
 $("counter").textContent=state.tokens.length+" fichas";
 $("roster").innerHTML=state.tokens.map(t=>{
  const ally=t.side==="jogadores",letter=esc(t.name.slice(0,2).toUpperCase());
  return '<div class="tc-roster-row"><button type="button" class="tc-roster-item'+(t.id===state.selected?' is-selected':'')+
   (t.id===state.target?' is-target':'')+'" data-select="'+esc(t.id)+'">'+
   '<span class="tc-token-icon '+(ally?"ally":"enemy")+'">'+letter+'</span><span><strong>'+esc(t.name)+'</strong>'+
   '<small>'+(ally?"Aliado":"Inimigo")+' · Vida '+t.life+' · '+(t.side==="jogadores"||isHumanoidKind(t.kind)?"Coragem "+t.courage:"Pavor "+t.pavorLocal)+
   ' · ('+t.x+','+t.y+')</small></span></button><button type="button" class="tc-target-button" data-target="'+esc(t.id)+'" title="Escolher como alvo">Alvo</button></div>';
 }).join("");
}
function renderBoard(){
 const occupied=new Map(state.tokens.map(t=>[cellKey(t.x,t.y),t]));
 let html="";
 for(let y=0;y<HEIGHT;y++)for(let x=0;x<WIDTH;x++){
  const spot=cellKey(x,y),unit=occupied.get(spot),kind=tileAt(state.terrain,x,y);
  const cls="tc-cell "+(kind!=="livre"?(kind==="parede"?"wall":"cover"):"")+
    (unit?" has-actor":"")+(unit?.id===state.selected?" is-selected":"")+(unit?.id===state.target?" is-target":"");
  const label="Linha "+(y+1)+", coluna "+(x+1)+(unit?", "+unit.name:"")+(kind!=="livre"?", "+kind:"");
  html+='<button class="'+cls+'" type="button" role="gridcell" aria-label="'+esc(label)+'" data-x="'+x+'" data-y="'+y+'">'+
   (unit?'<span class="tc-cell-token '+(unit.side==="jogadores"?"ally":"enemy")+'">'+esc(unit.name.slice(0,2).toUpperCase())+'</span>'+
    (unit.shieldRound>=state.round?'<span class="tc-shield-mark" title="Escudo Arcano declarado"></span>':""):"")+'</button>';
 }
 $("board").innerHTML=html;
 document.querySelectorAll(".tc-tools button[data-tool]").forEach(button=>
  button.setAttribute("aria-pressed",String(state.tool===button.dataset.tool)));
 $("round").textContent="Rodada "+state.round;
}
function armorOf(t){return t?.armor||{equipped:false};}
function defense(t,dodging=false){
 if(!t)return 0;
 const d=t.side==="jogadores"?naturalDE(t):stats(t).de;
 return defenseWithStance(d,armorOf(t),dodging?"esquiva":"normal");
}
function renderSourceOptions(force=false){
 const t=selected();if(!force&&lastActor===t?.id)return;
 lastActor=t?.id||"";
 const base=$("base-source"),attr=$("attribute-source");
 const sourceOpts=[];
 if(t){
  if(isHumanoidKind(t.kind)){
   for(const group of ["practice","knowledge"])for(const [k,name] of defs[group])
    if(Number(t[group==="practice"?"practices":"knowledges"]?.[k])>0)
     sourceOpts.push({value:group+":"+k,label:name+" G"+t[group==="practice"?"practices":"knowledges"][k]});
  }else for(const [k,name] of ATTRIBUTES)
    if(Number(t.attributes?.[k])>0)sourceOpts.push({value:"attribute:"+k,label:name+" G"+t.attributes[k]});
 }
 base.innerHTML=sourceOpts.length?sourceOpts.map(o=>'<option value="'+esc(o.value)+'">'+esc(o.label)+'</option>').join(""):
  '<option value="">Nenhuma fonte disponível</option>';
 let attrs=[];
 if(t)attrs=ATTRIBUTES.filter(([k])=>Number(t.attributes?.[k])>0).map(([k,name])=>({value:k,label:name+" G"+t.attributes[k]}));
 attr.innerHTML=attrs.length?attrs.map(o=>'<option value="'+esc(o.value)+'">'+esc(o.label)+'</option>').join(""):
  '<option value="">Nenhum Atributo comprado</option>';
 if(t&&isHumanoidKind(t.kind)&&t.practices?.armas_conjuracao>0){
  base.value="practice:armas_conjuracao";
  $("discipline-mode").value=t.skills?.includes("criar-item-foco-magia")?"conjuracao":"armas";
 }else $("discipline-mode").value="normal";
 $("spell-grade").value="2";
 const extras=[];
 if(t)for(const [g,rows,field] of [["attribute",ATTRIBUTES,"attributes"],["practice",PRACTICES,"practices"],["knowledge",KNOWLEDGES,"knowledges"]])
  for(const [k,name] of rows)if(Number(t[field]?.[k])>0)extras.push({value:g+":"+k,label:name+" G"+t[field][k]});
 $("extra-source").innerHTML='<option value="">Sem terceira fonte</option>'+extras.map(o=>
  '<option value="'+esc(o.value)+'">'+esc(o.label)+'</option>').join("");
 $("context-approved").checked=false;
 const weapons=t?equippedWeapons(t):[];
 $("equipment-source").innerHTML='<option value="">Sem dado de equipamento</option>'+
  weapons.map(w=>'<option value="'+esc(w.id)+'"'+(!w.allowed?' disabled':'')+'>'+esc(w.name)+
   ' · '+(w.die?'d'+w.die:'dado pendente')+(w.allowed?'':' · requer '+w.expected)+'</option>').join("");
 $("extra-keep").checked=false;
}
function targetInfo(resetDE=false){
 const a=selected(),t=target();
 $("actor-name").textContent=a?.name||"—";$("target-name").textContent=t?.name||"—";
 if(!a||!t){$("distance").textContent="Selecione origem e alvo";$("target-info").textContent="Escolha dois combatentes.";return;}
 const m=distance(a,t),los=lineOfSight(a,t,state.terrain),dodging=$("dodge").checked;
 const def=defense(t,dodging);
 $("distance").textContent=m.toFixed(1)+" m · "+(los.clear?"visada livre":"sem visada")+(los.cover?" · cobertura":"");
 $("target-info").textContent="DE "+def+(dodging?" (esquiva)":"")+" · "+m.toFixed(1)+
  " m · "+los.reason+(t.shieldRound>=state.round?" Escudo Arcano declarado (resolver ruptura manualmente).":"");
 if(resetDE)$("difficulty").value=String(def);
}
function actorInfo(){
 const t=selected();
 if(!t){$("actor-summary").textContent="Selecione um combatente para conferir fontes, Vida e deslocamento.";return;}
 const nat=t.side==="jogadores"?naturalDE(t):stats(t).de;
 const arm=armorOf(t),move=movementAllowance(t);
 $("actor-summary").textContent=t.name+"\nVida "+t.life+" · Integridade "+arm.integrity+"/"+arm.max+
  " · DE natural "+nat+"\nArmadura: "+arm.name+(arm.equipped?" (esquiva +"+dodgeBonus(arm)+", penalidade "+armorPenalty(arm)+")":"")+
  "\nDeslocamento por rodada: "+move+" m; gasto "+(t.moved||0)+" m"+
  "\n"+(isHumanoidKind(t.kind)?"Coragem "+t.courage:"Pavor local "+t.pavorLocal)+
  (t.shieldRound>=state.round?"\nEscudo Arcano declarado: DE de ruptura "+(t.shieldDe??"pendente"):"");
}
function renderAll(refreshSources=true){
 renderBoard();renderRoster();
 if(refreshSources)renderSourceOptions();
 actorInfo();targetInfo(refreshSources);
 renderHistory();renderPending();
 $("action-state").textContent=pending?"Em rolagem":"Pronto";
}
function renderHistory(){
 const list=$("history");
 if(!state.history.length){list.innerHTML="<p>Nenhum registro ainda.</p>";return;}
 list.innerHTML=state.history.slice(0,100).map(x=>
  '<article class="tc-history-entry"><time>'+esc(x.date?.slice(11,16)||"")+" · R"+x.round+'</time>'+
  '<div><strong>'+esc(x.kind)+"</strong> · "+esc(x.message)+'</div></article>').join("");
}
function renderPending(){
 const el=$("dice");$("suggest").disabled=!pending;$("preview").disabled=!pending;$("confirm").disabled=!pending;
 if(!pending){el.innerHTML="<p>Prepare uma pilha antes de rolar.</p>";$("roll-result").textContent="Nenhum resultado pendente.";return;}
 el.innerHTML=pending.rolled.map(d=>{
  const [e,a,p]=faceSymbols(d.sides,d.face);
  const selectedDie=pending.kept.includes(d.id);
  return '<button type="button" class="tc-die'+(selectedDie?" picked":"")+'" data-die="'+esc(d.id)+'" aria-pressed="'+selectedDie+'" title="Clique para manter ou descartar">'+
  '<strong class="tc-face">'+d.face+'</strong><span class="tc-die-label">d'+d.sides+'</span>'+
  '<span class="tc-runes">'+(e?'<span class="tc-e">ᛋ'+e+'</span>':"")+
   (a?'<span class="tc-a">ᚨ'+a+'</span>':"")+(p?'<span class="tc-p">ᚦ'+p+'</span>':"")+
   (!e&&!a&&!p?"—":"")+'</span></button>';
 }).join("");
 previewAction();
}
function currentOptions(){return {de:Number($("difficulty").value),situation:$("situation").value,
 extraKeep:$("extra-keep").checked,cancelP:Number($("cancel-p").value),convertPairs:Number($("convert-a").value)};}
function previewFor(unit,rolled,kept,options){
 if(unit.side==="jogadores"){
  const result=resolveRoll(rolled,kept,{de:options.de,situation:options.situation,level:unit.level||1,
   extraKeep:options.extraKeep,courage:unit.courage,cancelP:options.cancelP,convertPairs:options.convertPairs});
  const free=keepLimit(unit.level||1,false,false),courageCost=Number(options.extraKeep&&kept.length>free);
  return result.ok?{ok:true,result,courageCost,cost:0}:{ok:false,error:result.errors.join("; ")};
 }
 if(isHumanoidKind(unit.kind))return previewHumanoidRoll(unit,rolled,kept,options);
 return previewCreatureRoll(unit,rolled,kept,options);
}
function previewAction(){
 if(!pending)return;
 const actor=tokenById(pending.actor),t=tokenById(pending.target);
 if(!actor||!t){$("roll-result").textContent="Origem ou alvo retirado do tabuleiro.";return;}
 const options=currentOptions(),preview=previewFor(actor,pending.rolled,pending.kept,options);
 pending.preview=preview;
 if(!preview.ok){$("roll-result").textContent=preview.error||"Escolha uma retenção válida.";return;}
 const result=preview.result,spell=pending.mode==="conjuracao";
 const damage=pending.shield||spell&&$("spell-grade").value==="1"?0:result.damage;
 pending.damage=damage;
 $("roll-result").innerHTML='<strong>'+esc(result.outcome)+'</strong> · <span class="tc-e">'+result.e+'E</span> + '+
  '<span class="tc-p">'+result.p+'P</span> · <span class="tc-a">'+result.aRemaining+'A livre</span>'+
  '<div>DE '+result.de+' · '+result.reached+' pontos · dano ofensivo potencial '+damage+
  (pending.shield?" (Escudo: DE de ruptura igual "+result.reached+"; sem dano)":spell&&$("spell-grade").value==="1"?" (G1: somente efeitos)":"")+
  ' · '+(preview.courageCost||0)+' Coragem / '+(preview.cost||0)+' Pavor para retenção</div>'+
  '<small>Não aplica dano, efeitos de área nem Escudo Arcano automaticamente.</small>';
}
function startRoll({shield=false}={}){
 const a=selected(),t=shield?a:target();
 if(!a||!t)return notice("Selecione origem e alvo.");
 if(a.id===t.id&&!shield)return notice("Escolha um alvo distinto.");
 const los=shield?{clear:true,cover:false}:lineOfSight(a,t,state.terrain);
 const d=shield?0:distance(a,t),maxRange=Number($("range").value);
 if(!los.clear)return notice("Parede bloqueia o ataque. Mova-se para obter linha de visão.");
 if(!shield&&(!Number.isFinite(maxRange)||maxRange<0||d>maxRange+0.001))
  return notice("Alvo além do alcance declarado ("+d.toFixed(1)+" m).");
 const [group,key]=($("base-source").value||"").split(":");
 const human=isHumanoidKind(a.kind),attr=$("attribute-source").value;
 const extra=$("extra-source").value;const [extraGroup,extraKey]=(extra||"").split(":");
 const selection=human?{baseGroup:group,baseKey:key,attribute:attr,mode:$("discipline-mode").value}:
  {first:key,second:attr,mode:"normal"};
 if(extra){selection.extra={group:extraGroup,key:extraKey};selection.contextOK=$("context-approved").checked;}
 const pool=composeActionPool(a,selection);
 if(!pool.ok)return notice(pool.error);
 const chosenWeapon=$("equipment-source").value;
 let equipmentName="";
 if(chosenWeapon){
  const weapon=equippedWeapons(a).find(w=>w.id===chosenWeapon&&w.allowed);
  if(!weapon||selection.mode!=="armas"||!human||selection.baseKey!=="armas_conjuracao")
   return notice("Dado de arma exige Disciplina em modo Armas e Perícia correspondente.");
  if(pool.pool.length>=9)return notice("O dado de equipamento ultrapassaria os 9 rolados.");
  pool.pool.push({id:"equipment.0",group:"equipment",key:weapon.id,sides:weapon.die,baseSides:weapon.die});
  equipmentName=weapon.name;
 }
 const rolled=rollCreatureFaces(pool.pool),kept=rolled.slice(0,Math.min(2,rolled.length)).map(x=>x.id);
 pending={actor:a.id,target:t.id,rolled,kept,mode:selection.mode,shield,sources:pool.sources,
  distance:d,cover:los.cover,situation:$("situation").value,equipmentName,preview:null};
 $("cancel-p").value="0";$("convert-a").value="0";
 renderPending();$("action-state").textContent="Em rolagem";
}
function suggestKept(){
 if(!pending)return;
 const a=tokenById(pending.actor),rolled=pending.rolled,options=currentOptions();
 const free=a.side==="jogadores"?keepLimit(a.level||1,false,false):stats(a).keepBase;
 const cap=a.side==="jogadores"?keepLimit(a.level||1,options.extraKeep,false):
  isHumanoidKind(a.kind)?stats(a).keepBase+Number(options.extraKeep):Math.min(stats(a).keepMax,a.keep||2);
 let best=null;const n=rolled.length;
 function evaluate(ids){
  for(let cancel=0;cancel<=5;cancel++)for(let pairs=0;pairs<=2;pairs++){
   const p=previewFor(a,rolled,ids,{...options,cancelP:cancel,convertPairs:pairs});
   if(!p.ok)continue;
   const res=p.result,score=(res.success?1000:0)+(res.success&&res.p===0?250:0)+
    (res.aRemaining>0?25:0)-res.p*38-(p.courageCost||0)*55-(p.cost||0)*55+
    res.damage*2+res.aRemaining*.5;
   if(!best||score>best.score)best={ids:[...ids],cancel,pairs,score};
  }
 }
 function scan(i,keep){
  if(keep.length&&keep.length<=cap)evaluate(keep.map(index=>rolled[index].id));
  if(keep.length>=cap)return;
  for(let j=i;j<n;j++){keep.push(j);scan(j+1,keep);keep.pop();}
 }
 scan(0,[]);
 if(!best)return notice("Nenhuma combinação válida com os recursos atuais.");
 pending.kept=best.ids;$("cancel-p").value=best.cancel;$("convert-a").value=best.pairs;
 renderPending();
}
function confirmRoll(){
 if(!pending)return;
 const p=pending,a=tokenById(p.actor),t=tokenById(p.target);if(!a||!t)return;
 const pre=previewFor(a,p.rolled,p.kept,currentOptions());
 if(!pre.ok)return notice(pre.error);
 const r=pre.result,spell=p.mode==="conjuracao",grade=spell?Number($("spell-grade").value):null;
 const possibleDamage=p.shield||spell&&grade===1?0:r.damage;
 if(a.side==="jogadores"){
  a.courage=Math.max(0,a.courage-(pre.courageCost||0));
  a.courage=Math.min(10,a.courage+Number(r.criticalRefundCourage||0));
 }else{
  const done=settleCreatureRoll(a,0,state.tokens.filter(x=>x.side==="jogadores").length,pre);
  if(!done.ok)return notice(done.error);
  a.courage=done.unit.courage;a.pavorLocal=done.unit.pavorLocal;
 }
 if(p.shield){
  a.shieldRound=state.round;a.shieldDe=r.reached;
  record("escudo",a.name+" rolou Escudo Arcano (DE de ruptura "+r.reached+") para a rodada "+state.round+
   ". Custo de ativação e proteção corporal permanecem sob controle do Narrador.",{
   actor:a.id,rolled:p.rolled,kept:p.kept,raw:r,damagePotential:0,barrierDe:r.reached});
 }else record("rolagem",a.name+" contra "+t.name+": "+r.outcome+" ("+r.e+"E, "+r.aRemaining+"A, "+r.p+
  "P). Dano potencial "+possibleDamage+". "+(spell?"Magia G"+grade+". ":"")+"Aplicação manual.",{
   actor:a.id,target:t.id,rolled:p.rolled,kept:p.kept,raw:r,damagePotential:possibleDamage,
   distance:p.distance,cover:p.cover,spellGrade:grade,equipment:p.equipmentName||"",
   courageCost:pre.courageCost||0,pavorCost:pre.cost||0});
 pending=null;persist();renderAll(false);notice("Rolagem registrada. Aplique dano e efeitos manualmente após confirmar alcance e proteção.");
}
function onBoardCell(x,y){
 if(!inBounds(x,y))return;
 const found=state.tokens.find(t=>t.x===x&&t.y===y);
 if(["parede","cobertura","apagar"].includes(state.tool)){
  if(found)return notice("Remova ou mova o combatente antes de editar o terreno ocupado.");
  const k=cellKey(x,y);
  if(state.tool==="apagar")delete state.terrain[k];else state.terrain[k]=state.tool;
  persist();renderBoard();targetInfo();return;
 }
 if(found){
  if(state.tool==="alvo"||(state.selected&&state.selected!==found.id&&state.tool==="mover")){
   state.target=found.id;lastTarget=found.id;targetInfo(true);
  }else{state.selected=found.id;pending=null;renderSourceOptions(true);targetInfo(true);}
  persist();renderAll(false);return;
 }
 if(state.tool==="alvo")return notice("Clique no combatente que será o alvo.");
 const u=selected();if(!u)return notice("Selecione primeiro um combatente.");
 const move=plannedMove(u,{x,y},state.terrain,state.tokens);
 if(!move.ok)return notice(move.reason);
 u.x=x;u.y=y;u.moved=(u.moved||0)+move.distanceM;pending=null;
 record("movimento",u.name+" moveu "+move.distanceM+" m para ("+x+","+y+"). Total nesta rodada: "+u.moved+" m.");
 persist();renderAll();$("map-status").textContent="Deslocamento validado por percurso ortogonal de "+move.distanceM+" m. Enquadramento da ação depende do Narrador.";
}
function setSelected(id){if(!tokenById(id))return;state.selected=id;pending=null;renderAll(true);persist();}
function setTarget(id){
 if(!tokenById(id))return;
 state.target=id;pending=null;lastTarget=id;renderAll(false);targetInfo(true);persist();
}
function applyResource(){
 const t=target();if(!t)return notice("Selecione quem recebe a alteração.");
 const field=$("resource").value,num=Math.floor(Number($("resource-amount").value));
 if(!Number.isInteger(num)||num<1||num>100)return notice("Informe quantidade positiva até 100.");
 if(field==="integridade")t.armor.integrity=Math.max(0,t.armor.integrity-num);
 else if(["vida","coragem","pavorLocal"].includes(field)){
  const prop=field==="vida"?"life":field;t[prop]=Math.max(0,Number(t[prop]||0)-num);
 }else return;
 record("recurso",t.name+": -"+num+" "+field+" aplicado manualmente pelo Narrador.");
 persist();renderAll(false);
}
function rollShield(){
 const a=selected();
 if(!a||!Array.isArray(a.skills)||!a.skills.includes("escudo-arcano")||
  !a.skills.includes("criar-item-foco-magia")||Number(a.attributes?.inteligencia)<2)
  return notice("O conjurador precisa de Escudo Arcano, Foco/Magia e Inteligência 2.");
 if(!confirm("Escudo Arcano usa uma rolagem de Conjuração para a DE de ruptura. Confirme que pagará o custo de ativação conforme o SRD (recurso contabilizado manualmente)."))return;
 $("base-source").value="practice:armas_conjuracao";
 $("attribute-source").value="inteligencia";
 $("discipline-mode").value="conjuracao";
 $("equipment-source").value="";
 $("extra-source").value="";
 $("difficulty").value="0";
 $("cancel-p").value="0";$("convert-a").value="0";
 startRoll({shield:true});
}
function declareShield(){
 const a=selected();if(!a)return notice("Selecione quem conjura Escudo Arcano.");
 if(!Array.isArray(a.skills)||!a.skills.includes("escudo-arcano")||
  !a.skills.includes("criar-item-foco-magia")||Number(a.attributes?.inteligencia)<2)
  return notice("A ficha não possui Escudo Arcano e seus requisitos de conjuração.");
 const n=prompt("Escudo Arcano: informe a DE para romper calculada na rolagem de Conjuração (ou deixe vazio para pendente). O custo de PP/Coragem e a resolução da barreira são manuais.","");
 if(n===null)return;
 if(n!==""&&(!Number.isInteger(Number(n))||Number(n)<0||Number(n)>30))return notice("DE deve ser inteira entre 0 e 30.");
 if(!confirm("Confirma que o custo de ativação e o teste de Conjuração foram resolvidos pelo Narrador? O Escudo dura 1 rodada e NÃO gera Integridade ou imunidade física automática."))return;
 a.shieldRound=state.round;a.shieldDe=n===""?null:Number(n);
 record("escudo",a.name+" declarou Escudo Arcano para a rodada "+state.round+
  " (DE de ruptura "+(a.shieldDe??"pendente")+"). Custo e efeitos resolvidos manualmente.");
 persist();renderAll(false);
}
function advanceRound(){
 state.round=Math.min(9999,state.round+1);for(const t of state.tokens){t.moved=0;if(t.shieldRound<state.round){t.shieldRound=0;t.shieldDe=null;}}
 pending=null;record("rodada","Início da rodada "+state.round+". Movimento reiniciado; escudos de uma rodada expirados.");
 persist();renderAll();
}
function takeFromSaves(){
 let count=0;
 try{
  const own=JSON.parse(localStorage.getItem(PLAYER_SAVE)||"null");
  if(own?.attributes&&state.tokens.length<MAX_TOKENS){if(insert(own,"jogadores",true))count++;}
  const encounter=JSON.parse(localStorage.getItem(CONFLICT_SAVE)||"null");
  if(Array.isArray(encounter?.roster))for(const threat of encounter.roster){
   if(!insert(threat,"inimigos",false))break;count++;
  }
 }catch(e){return notice("Erro ao ler fichas salvas: "+e.message);}
 if(!count)return notice("Não foram encontradas Fichas ou ameaças salvas para importar.");
 record("importação",count+" ficha(s) importada(s) do armazenamento do navegador.");
 persist();renderAll(true);notice(count+" ficha(s) importada(s).");
}
function importedFile(file){
 if(!file||file.size>2e6)return notice("Arquivo inválido ou maior que 2 MB.");
 file.text().then(text=>{
  const parsed=JSON.parse(text);let count=0;
  if(parsed?.version===1&&Array.isArray(parsed.tokens)){
   if(state.tokens.length&&!confirm("Substituir o mapa pelo playtest importado?"))return;
   state={...initialScenario(),...parsed,terrain:validateTerrain(parsed.terrain),
    tokens:limitTokens(parsed.tokens).filter(t=>inBounds(t.x,t.y)&&t.name),
    history:Array.isArray(parsed.history)?parsed.history.slice(0,350):[],tool:"mover"};
   count=state.tokens.length;
  }else if(Array.isArray(parsed?.roster)){
   for(const threat of parsed.roster){if(!insert(threat,"inimigos"))break;count++;}
  }else if(parsed?.attributes&&parsed?.practices){
   if(insert(parsed,"jogadores",true))count++;
  }else throw Error("JSON não corresponde à Ficha, ao Conflito ou a um playtest.");
  record("importação",count+" ficha(s) carregada(s) via JSON.");
  persist();renderAll();notice(count+" ficha(s) carregada(s).");
 }).catch(e=>notice("Não foi possível importar: "+e.message));
}
function download(text,name,mime){
 const blob=new Blob([text],{type:mime}),url=URL.createObjectURL(blob),a=document.createElement("a");
 a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function exportHistory(){
 const cols=["Data","Rodada","Tipo","Descrição","Dano potencial","Distância (m)","Cobertura"];
 const csv=[cols,...state.history.slice().reverse().map(e=>[e.date,e.round,e.kind,e.message,e.damagePotential??"",e.distance??"",e.cover??""])]
 .map(row=>row.map(x=>'"'+String(x??"").replaceAll('"','""')+'"').join(";")).join("\r\n");
 download("\uFEFF"+csv,"codex-playtest-historico.csv","text/csv;charset=utf-8");
}
function bind(){
 document.addEventListener("click",event=>{
  const b=event.target.closest("button");if(!b)return;
  if(b.dataset.x!==undefined&&b.dataset.y!==undefined)return onBoardCell(Number(b.dataset.x),Number(b.dataset.y));
  if(b.dataset.select)return setSelected(b.dataset.select);
  if(b.dataset.target)return setTarget(b.dataset.target);
  if(b.dataset.tool){state.tool=b.dataset.tool;renderBoard();return;}
  if(b.dataset.die&&pending){
   if(pending.kept.includes(b.dataset.die))pending.kept=pending.kept.filter(x=>x!==b.dataset.die);
   else pending.kept.push(b.dataset.die);
   renderPending();return;
  }
 });
 $("preset").addEventListener("click",preset);
 $("load-saves").addEventListener("click",takeFromSaves);
 $("json-import").addEventListener("change",e=>{importedFile(e.target.files?.[0]);e.target.value="";});
 $("export").addEventListener("click",()=>download(JSON.stringify({...state,selected:state.selected,target:state.target},null,2),
   "codex-playtest-tatico.json","application/json"));
 $("export-csv").addEventListener("click",exportHistory);
 $("clear-history").addEventListener("click",()=>{if(!confirm("Apagar o histórico do playtest?"))return;state.history=[];persist();renderHistory();});
 $("clear-map").addEventListener("click",()=>{if(!confirm("Apagar todas as paredes e coberturas?"))return;state.terrain={};persist();renderBoard();targetInfo();});
 $("next-round").addEventListener("click",advanceRound);
 $("add-token").addEventListener("click",()=>{
  const t=blank($("new-side").value==="jogadores"?"humanoide":"monstro");
  t.name="Ficha de teste "+(state.tokens.length+1);t.attributes.agilidade=1;t.attributes.vigor=1;
  t.life=lifeMax(t);if(!insert(t,$("new-side").value))return notice("Limite de fichas ou mapa cheio.");
  record("ficha",t.name+" adicionada; ajuste os graus na Ficha ou importe um JSON.");
  persist();renderAll();
 });
 $("roll").addEventListener("click",()=>startRoll());
 $("roll-shield").addEventListener("click",rollShield);
 $("suggest").addEventListener("click",suggestKept);
 $("preview").addEventListener("click",previewAction);
 $("confirm").addEventListener("click",confirmRoll);
 $("apply-resource").addEventListener("click",applyResource);
 $("arcane-shield").addEventListener("click",declareShield);
 for(const id of ["difficulty","situation","extra-keep","cancel-p","convert-a","spell-grade","extra-source","context-approved","equipment-source"])
  $(id).addEventListener("change",()=>{if(pending)previewAction();});
 $("dodge").addEventListener("change",()=>{targetInfo(true);if(pending)previewAction();});
 $("narrator-cover").addEventListener("change",()=>{if(pending)previewAction();});
}
bind();renderAll();
