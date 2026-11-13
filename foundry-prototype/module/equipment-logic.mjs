/* Controle de equipamento e orçamento para a ficha Foundry. */
import {CREATION_REFERENCE,SKILLS,naturalDE,xpLedger} from "./rules.mjs";
const keyOf=value=>String(value??"").normalize("NFD").replace(/\p{Diacritic}/gu,"").trim().toLowerCase();
export function equipmentEligibility(actor,item,mode){
 const blocked=reason=>({usable:false,die:0,specialist:false,reason});
 if(!item?.system.equipped)return blocked("Equipe o item antes de selecioná-lo.");
 const s=actor.system,k=item.system.kind,cat=item.system.category;
 const keys=s.skills||[];
 let specialist=false,reason="";
 if(mode==="conjuracao"){
  if(!["focus","spell","magic"].includes(k))return blocked("Selecione um foco ou uma magia.");
  if(!keys.includes("criar-item-foco-magia"))return blocked("Exige Criar Item de Foco e Magia.");
  const el=keyOf(item.system.element);
  const elementSkill={ar:"vento",vento:"vento",agua:"agua",fogo:"fogo",terra:"terra",
   sagrado:"sagrado",trevas:"trevas",veneno:"veneno",sangue:"sangue"}[el];
  if(el!=="psiquico"&&(!elementSkill||!keys.includes(elementSkill))) {
   return blocked(el?"Falta a Perícia do elemento do item.":"Informe o elemento na ficha do foco ou magia.");
  }
  specialist=true;
 }else if(mode==="armas"){
  if(!["weapon","firearm"].includes(k))return blocked("Selecione uma arma.");
  if(k==="firearm"){
   specialist=keys.includes("armas-fogo")&&(Number(item.system.grade||1)<2||s.level>=5);
   if(!specialist)reason="Sem dado extra nem características especiais. Verifique a Perícia em Armas de Fogo e o nível exigido.";
  }else {
   const long=item.system.properties?.some(x=>keyOf(x)==="a distancia");
   const categorySkill={leve:"armas-leves",medio:"armas-medias",pesado:"armas-pesadas"}[cat];
   specialist=keys.includes(long?"armas-longo-alcance":categorySkill);
  }
 }else return blocked("Selecione Armas ou Conjuração para usar o item.");
 const die=Number(item.system.die)||({leve:6,medio:10,pesado:12}[cat]||0);
 if(!specialist)return {usable:true,die:0,specialist,reason:reason||"Ataque básico disponível. A Perícia pertinente habilita o dado extra e as características especiais."};
 if(![6,10,12].includes(die))return blocked("Dado adicional inválido. Use d6, d10 ou d12.");
 return {usable:true,die,specialist,reason:""};
}
export const equippedDie=(actor,item,mode)=>equipmentEligibility(actor,item,mode).die;
export function weaponProperties(item,eligible){
 const properties=new Map((eligible?item?.system.properties??[]:[]).map(name=>[keyOf(name),name]));
 const passive=new Set(["longa","a distancia","silenciosa","barulhenta","defensiva","precisa","muito leve","municao","recarga","cartucho"]);
 const active=[...properties].filter(([key])=>!passive.has(key)||
  (key==="muito leve"&&["kunai","shuriken"].includes(keyOf(item?.name)))).map(([,name])=>name);
 return {active,bonusP:Number(item?.system.properties?.some(x=>keyOf(x)==="barulhenta")??false),
  criticalBonusE:Number(properties.has("precisa")),criticalBonusA:["longa","silenciosa","defensiva"].filter(key=>properties.has(key)).length};
}
export function skillRequirements(system,id){
 const a=system.attributes||{},p=system.practices||{},k=system.knowledges||{},s=system.skills||[];
 const disc=Number(p.armas_conjuracao||0),arts=Number(p.artesao||0),
  force=Number(a.forca||0),dex=Number(a.destreza||0),intel=Number(a.inteligencia||0),agil=Number(a.agilidade||0);
 const has=id=>s.includes(id), light=has("armas-leves")||has("armas-medias")||has("armas-pesadas");
 const melee=light||has("pugilismo")||has("maestria-manejo-duplo"), ranged=has("armas-longo-alcance")||has("maestria-arremesso-armas");
 const focus=has("criar-item-foco-magia"), basicElement=[disc>=1&&intel>=1&&focus,"Disciplina 1 · Inteligência 1 · Criar Item de Foco e Magia"];
 const advancedElement=[disc>=2&&intel>=2&&focus,"Disciplina 2 · Inteligência 2 · Criar Item de Foco e Magia"];
 const poison=intel>=2&&k.alquimia>=2&&k.medicina>=2;
 const req={
  "armas-leves":[disc>=1,"Disciplina 1"],
  "armas-medias":[disc>=1&&force>=1,"Disciplina 1 · Força 1"],
  "armas-pesadas":[disc>=2&&force>=2,"Disciplina 2 · Força 2"],
  "armas-longo-alcance":[disc>=1&&dex>=2,"Disciplina 1 · Destreza 2"],
  "armas-fogo":[disc>=2&&dex>=2,"Disciplina 2 · Destreza 2"],
  "criar-item-foco-magia":[disc>=1&&intel>=1&&arts>=1,"Disciplina 1 · Inteligência 1 · Artesão 1"],
  "escudo-arcano":[intel>=2&&a.vigor>=1&&focus,"Inteligência 2 · Vigor 1 · Criar Item de Foco e Magia"],
  "conjuracao-equilibrada":[disc>=2&&intel>=2&&dex>=2&&focus,"Disciplina 2 · Inteligência 2 · Destreza 2 · Criar Item de Foco e Magia"],
  improviso:[disc>=1&&intel>=1&&dex>=1&&focus,"Disciplina 1 · Inteligência 1 · Destreza 1 · Criar Item de Foco e Magia"],
  mestre:[disc>=3&&intel>=3&&dex>=3&&focus&&has("improviso")&&["vento","agua","terra","fogo","sagrado","trevas","veneno","sangue"].some(has),
   "Disciplina 3 · Inteligência 3 · Destreza 3 · Criar Item de Foco e Magia · Improviso Elemental · uma Perícia de elemento"],
  "provocacao-sofisticada":[a.influencia>=2,"Influência 2"],

  "disciplina-avancada":[disc>=2,"Disciplina 2"],
  "maestria-manejo-duplo":[has("disciplina-avancada")&&force>=2&&dex>=2&&agil>=1&&(light||ranged||has("armas-fogo")),
   "Disciplina Avançada · Força 2 · Destreza 2 · Agilidade 1 · uma Perícia de armas, arremesso ou longo alcance"],
  "maestria-arremesso-armas":[light&&force>=2&&dex>=2&&agil>=1,"Força 2 · Destreza 2 · Agilidade 1 · Armas Leves, Médias ou Pesadas"],
  pugilismo:[disc>=1&&force>=2&&dex>=1,"Disciplina 1 · Força 2 · Destreza 1"],
  "artista-marcial":[disc>=2&&has("pugilismo")&&dex>=2,"Disciplina 2 · Pugilismo · Destreza 2"],
  "golpe-fulminante":[melee&&disc>=2&&force>=2,"Disciplina 2 · Força 2 · especialização corpo a corpo"],
  "espalhar-golpe":[melee&&disc>=2&&dex>=1&&agil>=1&&has("golpe-fulminante"),"Disciplina 2 · Destreza 1 · Agilidade 1 · Golpe Fulminante · especialização corpo a corpo"],
  "disparo-fulminante":[ranged&&dex>=2&&force>=1&&disc>=2,"Destreza 2 · Força 1 · Disciplina 2 · Longo Alcance ou Arremesso"],
  "disparo-multiplo":[ranged&&dex>=2&&agil>=2&&disc>=2&&has("disparo-fulminante"),"Destreza 2 · Agilidade 2 · Disciplina 2 · Disparo Fulminante · Longo Alcance ou Arremesso"],
  "disparo-violento":[ranged&&disc>=2&&dex>=2&&(force>=2||(force>=1&&p.atletismo>=1)),"Disciplina 2 · Destreza 2 · Força 2 ou Força 1 com Atletismo 1 · Longo Alcance ou Arremesso"],
  "golpe-baixo":[dex>=2&&force>=1&&agil>=1,"Destreza 2 · Força 1 · Agilidade 1"],
  furtividade:[p.furtividade>=2&&dex>=2&&agil>=1,"Furtividade 2 · Destreza 2 · Agilidade 1"],
  "furtividade-avancada":[p.furtividade>=2&&has("furtividade"),"Furtividade 2 · Perícia em Furtividade"],
  "criar-veneno":[arts>=1&&poison,"Artesão 1 · Inteligência 2 · Alquimia 2 · Medicina 2"],
  "criar-antidoto":[arts>=1&&poison&&has("criar-veneno"),"Artesão 1 · Inteligência 2 · Alquimia 2 · Medicina 2 · Criar Veneno"],
  fogo:basicElement,agua:basicElement,vento:basicElement,terra:basicElement,
  sagrado:advancedElement,trevas:advancedElement,sangue:advancedElement,
  veneno:[disc>=2&&poison,"Disciplina 2 · Inteligência 2 · Alquimia 2 · Medicina 2"],
  "recobrar-coragem":[true,"Sem requisito de fonte registrado."],
  montar:[false,"PENDENTE · aquisição em revisão."]
 };
 const [met,label]=req[id]??[false,"PENDENTE · aquisição requer avaliação do Narrador."];
 return {met,label};
}
export const skillPrerequisite=(system,id)=>skillRequirements(system,id).met;
export function canSpendXP(system,delta,bucket){
 // As categorias são apenas contabilidade informativa. O orçamento é global.
 return Number.isFinite(delta)&&delta>=0&&xpLedger(system).left>=delta;
}
export function defenseDE(actor,defense="natural"){
 const s=actor.system;
 const natural=(actor.type==="creature"||(!actor.type&&s.monsterRules))?
  Math.min(9,Number(s.attributes?.agilidade||0)+Math.floor(Number(s.attributes?.destreza||0)/2)):naturalDE(s);
 if(defense==="natural")return natural;
 const armor=actor.items.find(i=>i.type==="equipment"&&i.system.kind==="armor"&&i.system.equipped);
 const category=armor?.system.category;
 const penalty=category==="pesado"?-1:category==="muito-pesado"?-2:0;
 const dodge=defense==="dodge"?(category==="muito-leve"?2:category==="leve"?1:0):0;
 return Math.max(0,natural+penalty+dodge);
}
