/* Resumo comparativo sem VTT: cópias locais, dano comum e transferências adjudicadas.
   Sem escrita nas chaves originais da Ficha do Jogador. */
export const PLAYER_INDEX="codex-rpg-jogadores-index-v1";
export const PLAYER_PREFIX="codex-rpg-jogador-ficha-v1:";
export const PLAYER_LEGACY="codex-html-ficha-prototipo-v1";
const names=["forca","agilidade","destreza","inteligencia","influencia","vigor"];
const practices=["armas_conjuracao","atletismo","furtividade","artesao","apresentacao","coleta"];
const knowledges=["protecao","astronomia","medicina","alquimia","engenharia","erudicao"];
const weightValues={muito_leve:.0125,leve:.125,medio:.5,alto:1,extremo:2};
export const combatClamp=(n,lo,hi)=>Math.max(lo,Math.min(hi,Number.isFinite(Number(n))?Number(n):lo));
const grades=(v,keys)=>Object.fromEntries(keys.map(key=>[key,Math.floor(combatClamp(v?.[key],0,6))]));
const safeId=id=>/^[a-zA-Z0-9_-]{1,90}$/.test(String(id||""));
export function copyPlayer(raw,id){
 if(!raw||typeof raw!=="object"||!safeId(id))return null;
 const attributes=grades(raw.attributes,names),items=Array.isArray(raw.items)?raw.items.slice(0,90):[];
 return {id:"player:"+id,sourceId:id,role:"jogador",kind:"humanoide",
  name:String(raw.name||"Aprendiz sem nome").slice(0,100),level:Math.floor(combatClamp(raw.level||1,1,20)),
  threatGrade:1,attributes,practices:grades(raw.practices,practices),
  knowledges:grades(raw.knowledges,knowledges),
  skills:Array.isArray(raw.skills)?raw.skills.filter(x=>typeof x==="string").slice(0,100):[],
  life:Math.floor(combatClamp(raw.life??(3+attributes.vigor),0,999)),
  courage:Math.floor(combatClamp(raw.courage??10,0,99)),pavorLocal:0,
  items:items.map((item,i)=>{
   const weightClass=Object.hasOwn(weightValues,item.weight)?item.weight:"leve";
   const kind={arma:"weapon",armadura:"armor",escudo:"shield",foco:"focus"}[item.type]||item.kind||"other";
   const max=Math.floor(combatClamp(item.max??item.integrityMax??0,0,999));
   return {...item,id:String(item.id||"item"+i).slice(0,100),kind,weightClass,
    weight:weightValues[weightClass]||0,qty:Math.floor(combatClamp(item.qty??1,1,99)),
    integrityMax:max,integrity:Math.floor(combatClamp(item.hp??item.integrity??max,0,max)),
    equipped:!!item.equipped&&!item.shieldGrounded};
  })};
}
export function savedPlayerCopies(storage){
 let index;try{index=JSON.parse(storage.getItem(PLAYER_INDEX)||"null");}catch{index=null;}
 const result=[],seen=new Set(),errors=[];
 if(Array.isArray(index?.sheets)){
  for(const entry of index.sheets.slice(0,40)){
   if(!safeId(entry?.id)||seen.has(entry.id))continue;
   seen.add(entry.id);
   try{
    const payload=JSON.parse(storage.getItem(PLAYER_PREFIX+entry.id)||"null");
    if(payload?.schema!=="codex-jogador-ficha-v1")throw Error("Ficha indisponível");
    const copy=copyPlayer(payload.character,entry.id);
    if(copy)result.push(copy);else errors.push(String(entry.name||entry.id));
   }catch{errors.push(String(entry.name||entry.id));}
  }
 }
 // Migração legada apenas quando não há uma coleção de fichas válida.
 if(!result.length&&!Array.isArray(index?.sheets)){
  try{
   const old=JSON.parse(storage.getItem(PLAYER_LEGACY)||"null");
   const copy=copyPlayer(old?.character||old,"legado");
   if(copy)result.push(copy);
  }catch{errors.push("Ficha legada");}
 }
 return {units:result,errors};
}
export function itemArmor(unit){
 return (unit?.items||[]).find(it=>it.equipped&&(it.kind==="armor"||it.type==="armadura"))||null;
}
export function armorWeightClass(item){
 if(!item)return null;
 if(["muito_leve","leve","medio","alto","extremo"].includes(item.weightClass))return item.weightClass;
 const category=String(item.category||"").replaceAll("_","-");
 const byCategory={"muito-leve":"muito_leve",leve:"leve",medio:"medio",pesado:"alto",alto:"alto","muito-pesado":"extremo",extremo:"extremo"}[category];
 if(byCategory)return byCategory;
 const label=String(item.name||"").toLowerCase();
 if(/muito leve|roupas simples/.test(label))return "muito_leve";
 if(/muito pesada/.test(label))return "extremo";
 if(/pesada/.test(label))return "alto";
 if(/média|media/.test(label))return "medio";
 if(/leve/.test(label))return "leve";
 // Itens antigos de conflito armazenam peso numérico.
 const n=Number(item.weight);
 return n<=.02&&n>0?"muito_leve":n<=.13&&n>0?"leve":n<=.51&&n>0?"medio":n>=1.9?"extremo":n>=.9?"alto":null;
}
export function defensiveDE(unit){
 if(!unit)return 0;
 const v=unit.attributes||{};
 const base=unit.kind==="monstro"||unit.kind==="criatura"?
  Math.min(9,(v.agilidade||0)+Math.floor((v.destreza||0)/2)):
  Math.min(9,(v.agilidade||0)+Math.floor(((v.vigor||0)+(v.destreza||0))/2)+Math.floor((unit.practices?.atletismo||0)/3));
 const armor=itemArmor(unit),w=armorWeightClass(armor);
 const modifier={muito_leve:2,leve:1,medio:0,alto:-1,extremo:-2}[w]||0;
 const shield=(unit.skills||[]).includes("maestria-escudos")&&
  (unit.items||[]).some(it=>it.equipped&&(it.kind==="shield"||it.type==="escudo"))?1:0;
 return Math.floor(combatClamp(base+modifier+shield,0,12));
}
export function targetWeightClass(unit,override=""){
 if(["leve","medio","pesado"].includes(override))return override;
 const armor=armorWeightClass(itemArmor(unit));
 return {muito_leve:"leve",leve:"leve",medio:"medio",alto:"pesado",extremo:"pesado"}[armor]||null;
}
export function weaponWeightClass(item){
 if(!item)return null;
 const w=item.weightClass||item.category;
 return {muito_leve:"leve",leve:"leve",medio:"medio",alto:"pesado",pesado:"pesado",extremo:"pesado"}[w]||
  (Number(item.weight)===.125?"leve":Number(item.weight)===.5?"medio":Number(item.weight)>=1?"pesado":null);
}
export function weaponAffinity(weaponWeight,targetWeight){
 return ({leve:{leve:0,medio:1,pesado:-1},medio:{leve:1,medio:-1,pesado:0},pesado:{leve:-1,medio:0,pesado:1}})[weaponWeight]?.[targetWeight]??null;
}
export function equippedWeapons(unit){
 return (unit?.items||[]).filter(it=>it.equipped&&(it.kind==="weapon"||it.type==="arma"||it.kind==="firearm"));
}
export function armorDamagePreview(target,roll){
 const armor=itemArmor(target),valid=roll?.success&&Number(roll.damage)>0;
 const physicalImmune=!!armor&&Number(armor.grade)>=4;
 const amount=valid&&!physicalImmune?Math.max(0,Math.floor(roll.damage)):0;
 const armorBefore=Math.max(0,Math.floor(armor?.integrity||0));
 const removed=Math.min(armorBefore,amount);
 const penetrating=Math.max(0,amount-removed);
 // 22/11/2026: 5 Êxitos válidos em ataque com dano corporal = 2 de Vida, não 1.
 // Não concede dano à Vida enquanto a armadura absorve todo o dano.
 const lifeLoss=penetrating>0?Math.min(3,Number(roll.e)>=5?2:1):0;
 return {armorId:armor?.id||null,armorBefore,removed,penetrating,lifeLoss,
  physicalImmune,valid:!!valid};
}
export function applyCommonDamage(target,roll){
 const result=armorDamagePreview(target,roll);
 if(result.physicalImmune)return {...result,applied:false,reason:"Armadura G4 imune a dano físico comum."};
 if(!result.valid)return {...result,applied:false,reason:"Não houve acerto com dano válido."};
 const item=(target.items||[]).find(it=>it.id===result.armorId);
 if(item)item.integrity=Math.max(0,item.integrity-result.removed);
 const before=Math.max(0,Math.floor(target.life||0));
 target.life=Math.max(0,before-result.lifeLoss);
 return {...result,applied:true,lifeRemoved:before-target.life};
}
export function transferTo(value,recipient,cap){
 const available=Math.max(0,Math.floor(Number(cap)||0)-Math.floor(Number(recipient)||0));
 const moved=Math.min(Math.max(0,Math.floor(Number(value)||0)),available);
 return {moved,remaining:Math.max(0,Math.floor(Number(value)||0)-moved),after:Math.floor(Number(recipient)||0)+moved};
}
