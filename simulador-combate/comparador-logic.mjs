/* Comparador de combate sem tabuleiro. Regras aprovadas e deliberações pendentes são separadas. */
import {naturalDE,maxCourage,monsterCap} from "../criar-conflito/codex-rules.mjs";
import {blank,isHumanoidKind,stats,ATTRIBUTES,KNOWLEDGES,PRACTICES} from "../criar-conflito/rules.mjs";

const int=(v,min=0,max=999)=>Math.max(min,Math.min(max,Math.floor(Number.isFinite(Number(v))?Number(v):min)));
export const ARMOR_DE=Object.freeze({"muito-leve":2,leve:1,medio:0,pesado:-1,"muito-pesado":-2});
const alias={muito_leve:"muito-leve",muito_pesado:"muito-pesado",alto:"pesado",extremo:"muito-pesado"};
const kinds={armadura:"armor",escudo:"shield",arma:"weapon"};
const weightNumbers={"muito-leve":0.125,leve:0.125,medio:0.5,pesado:1,"muito-pesado":2};
export function categoryOf(it={}){
 const raw=String(it.category||it.weightCategory||it.weightClass||(typeof it.weight==="string"?it.weight:"")||"").toLowerCase().replaceAll(" ","-");
 return alias[raw]||raw||({"Roupas Simples":"muito-leve","Armadura Leve":"leve","Armadura Média":"medio","Armadura Pesada":"pesado"})[it.name]||"";
}
export function normalizeEquipment(raw={}){
 const kind=["armor","shield","weapon","firearm","focus"].includes(raw.kind)?raw.kind:(kinds[raw.type]||raw.kind||"other");
 const category=categoryOf(raw),sourceIntegrity=raw.integrity;
 const max=int(raw.integrityMax??raw.max??(typeof sourceIntegrity==="object"?sourceIntegrity.max:undefined)??0);
 const hp=int((typeof sourceIntegrity==="object"?sourceIntegrity.value:sourceIntegrity)??raw.hp??max,0,max);
 return {id:String(raw.id||raw.name||"item").slice(0,110),name:String(raw.name||"Item").slice(0,100),
  kind,category,grade:int(raw.grade||1,1,4),weight:typeof raw.weight==="number"?Math.max(0,raw.weight):(weightNumbers[category]||0),
  qty:int(raw.qty||1,1,99),integrityMax:max,integrity:hp,equipped:!!raw.equipped,
  die:Number(raw.die)||0,range:Number(raw.range)||0,properties:Array.isArray(raw.properties)?raw.properties:[]};
}
export function normalizeCombatant(raw={},side="jogadores",source="navegador"){
 const kind=["humanoide","monstro","humanoide-monstro"].includes(raw.kind)?raw.kind:"humanoide";
 const base=blank(kind),out={...base,
  id:String(raw.id||"").slice(0,110),name:String(raw.name||raw.nome||"Sem nome").slice(0,110),
  side,source,level:int(raw.level||1,1,20),threatGrade:int(raw.threatGrade||1,1,6),
  leader:!!raw.leader,race:String(raw.race||"").slice(0,70),
  attributes:{...base.attributes},knowledges:{...base.knowledges},practices:{...base.practices},
  skills:Array.isArray(raw.skills)?raw.skills.filter(x=>typeof x==="string").slice(0,130):[],
  items:Array.isArray(raw.items)?raw.items.slice(0,70).map(normalizeEquipment):[]};
 for(const [field,defs] of [["attributes",ATTRIBUTES],["knowledges",KNOWLEDGES],["practices",PRACTICES]])
  for(const [key] of defs)out[field][key]=int(raw[field]?.[key],0,6);
 out.life=int(raw.life??stats(out).life,0,999);
 out.courage=int(raw.courage??10,0,maxCourage(out.level));
 out.pavorLocal=int(raw.pavorLocal??(kind==="monstro"?monsterCap(out.threatGrade):4),0,monsterCap(out.threatGrade));
 out.keep=int(raw.keep??2,2,4);
 out.acted=!!raw.acted;
 return out;
}
export function armorOf(c){
 return (c?.items||[]).find(it=>it.kind==="armor"&&it.equipped)||null;
}
export function armorDefense(c){
 const a=armorOf(c);
 return a?(ARMOR_DE[a.category]??0):0;
}
export function defense(c){
 if(!c)return 0;
 const attrs=c.attributes||{};
 const basic=c.kind==="monstro"?Math.min(9,Number(attrs.agilidade||0)+Math.floor(Number(attrs.destreza||0)/2)):naturalDE(c);
 const sh=(c.skills||[]).includes("maestria-escudos")&&(c.items||[]).some(it=>it.kind==="shield"&&it.equipped)?1:0;
 return Math.min(12,Math.max(0,basic+(c.kind==="monstro"?0:armorDefense(c))+(c.kind==="monstro"?0:sh)));
}
export function weightUsed(c){return (c.items||[]).reduce((v,it)=>v+Number(it.weight||0)*Number(it.qty||1),0);}
export function equippedWeapons(c,catalog=[]){
 return (c?.items||[]).filter(it=>it.equipped&&["weapon","firearm"].includes(it.kind)).map(it=>{
  const cat=catalog.find(x=>x.name?.toLowerCase()===it.name.toLowerCase())||{};
  const kind=it.kind==="firearm"||cat.kind==="firearm"?"firearm":"weapon";
  const category=cat.category||it.category;
  const long=Array.isArray(cat.properties)&&cat.properties.includes("À Distância");
  const skill=kind==="firearm"?"armas-fogo":category==="medio"?"armas-medias":category==="pesado"?"armas-pesadas":"armas-leves";
  const eligible=(c.skills||[]).includes(skill)||(long&&(c.skills||[]).includes("armas-longo-alcance"));
  const die=Number(it.die||cat.die||0),range=Number(it.range||cat.range||0);
  return {...it,kind,category,die,range,skill,eligible:eligible&&[6,10,12].includes(die)};
 });
}
export function weightAffinity(weapon,target){
 if(!weapon)return {status:"manual",delta:0,description:"Sem peso de arma declarado."};
 const armor=armorOf(target);
 if(!armor)return {status:"manual",delta:0,description:"Alvo sem armadura: afinidade de peso sem critério automático aprovado."};
 if(weapon.kind==="firearm")return {status:"manual",delta:0,description:"Arma de fogo: consultar tabela específica de cada modelo e suas habilitações."};
 const atk=weapon.category==="muito-leve"?"leve":weapon.category;
 const def=armor.category==="muito-leve"?"leve":armor.category==="muito-pesado"?"pesado":armor.category;
 const table={leve:{leve:0,medio:1,pesado:-1},medio:{leve:1,medio:-1,pesado:0},pesado:{leve:-1,medio:0,pesado:1}};
 const value=table[atk]?.[def];
 if(value===undefined)return {status:"manual",delta:0,description:"Categoria não prevista: decisão do Narrador."};
 return {status:"known",delta:value,description:value===1?"Vantagem por peso (+1A)":value===-1?"Desvantagem por peso (−1A)":"Peso neutro."};
}
/** Patamar novo: cinco símbolos válidos (E + P) em acerto contra alvo SEM armadura = 2 Vida.
 *  Abaixo de cinco: regra específica de Vida ainda não definida neste adendo.
 *  Com armadura: o patamar NÃO gera dano direto à Vida.
 */
export function lifeAtFive(result,target){
 if(!result?.success)return {eligible:false,damage:0,reason:"Não atingiu a DE."};
 const armor=armorOf(target);
 if(armor)return {eligible:false,damage:0,reason:"Existe armadura equipada: resolver Integridade primeiro, sem 2 Vida diretos pelo patamar."};
 const points=Number(result.e||0)+Number(result.p||0);
 if(points>=5)return {eligible:true,damage:2,reason:points+" pontos válidos (E + P), alvo sem armadura: 2 Vida."};
 return {eligible:false,damage:null,reason:points+" pontos válidos: dano à Vida abaixo de cinco permanece PENDENTE."};
}
export function transferPavor(actor,target,pavor,publicPavor=0){
 const points=int(pavor,0,999),targetCopy={...target},notes=[];
 let overflow=0;
 if(actor.side==="jogadores"&&target.side==="inimigos"){
  const cap=monsterCap(target.threatGrade||1),before=int(target.pavorLocal,0,cap);
  targetCopy.pavorLocal=Math.min(cap,before+points);
  const gained=targetCopy.pavorLocal-before;overflow=points-gained;
  notes.push("Pavor transferido ao alvo: "+gained+"P local"+(overflow?" ("+overflow+"P excedente, destino pendente).":"." ));
 }else if(actor.side==="inimigos"&&target.side==="jogadores"){
  const cap=maxCourage(target.level||1),before=int(target.courage,0,cap);
  targetCopy.courage=Math.min(cap,before+points);
  notes.push("Pavor inimigo não anulado: alvo recupera "+(targetCopy.courage-before)+" Coragem (até "+cap+").");
 }else if(points)notes.push("Transferência entre combatentes do mesmo lado ou sem categoria reconhecida: manual.");
 return {target:targetCopy,publicPavor,overflow,notes};
}
export function updateResource(actor,itemId,field,delta){
 const copy={...actor,items:(actor.items||[]).map(x=>({...x}))};
 if(field==="integridade"){
  const item=copy.items.find(x=>x.id===itemId&&["armor","shield"].includes(x.kind));
  if(!item)return {ok:false,error:"Selecione armadura ou escudo."};
  item.integrity=int(item.integrity+delta,0,item.integrityMax);
 }else if(field==="vida")copy.life=int(copy.life+delta,0,999);
 else if(field==="coragem")copy.courage=int(copy.courage+delta,0,maxCourage(copy.level||1));
 else if(field==="pavor")copy.pavorLocal=int(copy.pavorLocal+delta,0,monsterCap(copy.threatGrade||1));
 else return {ok:false,error:"Recurso desconhecido."};
 return {ok:true,actor:copy};
}
export function listBrowserSheets(storage){
 const found=[],seen=new Set();
 function add(key,source,side,raw){
  if(!raw||typeof raw!=="object"||!raw.attributes)return;
  if(seen.has(key))return;seen.add(key);
  found.push({id:key,name:String(raw.name||raw.nome||"Aprendiz"),source,side,raw});
 }
 try{
  const index=JSON.parse(storage.getItem("codex-rpg-jogadores-index-v1")||"null");
  if(Array.isArray(index?.sheets))for(const entry of index.sheets.slice(0,40)){
   if(!/^[A-Za-z0-9_-]{1,90}$/.test(entry?.id||""))continue;
   const box=JSON.parse(storage.getItem("codex-rpg-jogador-ficha-v1:"+entry.id)||"null");
   if(box?.character)add("player:"+entry.id,"Ficha de jogador","jogadores",box.character);
  }
  if(!found.some(x=>x.source==="Ficha de jogador")){
   const active=JSON.parse(storage.getItem("codex-html-ficha-prototipo-v1")||"null");
   add("active","Ficha ativa","jogadores",active?.character||active);
  }
  const npc=JSON.parse(storage.getItem("codex-html-ficha-npc-dna-v1")||"null");
  add("npc","Criador NPC","inimigos",npc?.character||npc);
  const conflict=JSON.parse(storage.getItem("codex-rpg-criar-conflito-v1")||"null");
  if(Array.isArray(conflict?.roster))for(const [index,raw] of conflict.roster.slice(0,40).entries())
   add("conflito:"+index,"Criar Conflito","inimigos",raw);
 }catch{/* A leitura de uma ficha inválida não deve sobrescrever fichas existentes. */}
 return found;
}
