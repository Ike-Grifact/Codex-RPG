/* Comparador de combate sem tabuleiro. Regras aprovadas e deliberações pendentes são separadas. */
import {naturalDE,maxCourage,monsterCap,healthByLife,sourceDice,faceSymbols} from "../criar-conflito/codex-rules.mjs?v=20261124-colossal-v0113";
import {blank,isHumanoidKind,humanoidRacialGrants,humanoidHasFocus,stats,ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS,KINDS,migrateArmorIntegrity} from "../criar-conflito/rules.mjs?v=20261124-colossal-v0113";

const int=(v,min=0,max=999)=>Math.max(min,Math.min(max,Math.floor(Number.isFinite(Number(v))?Number(v):min)));
export const ARMOR_DE=Object.freeze({"muito-leve":2,leve:1,medio:0,pesado:-1,"muito-pesado":-2});
const alias={muito_leve:"muito-leve",muito_pesado:"muito-pesado",alto:"pesado",extremo:"muito-pesado"};
const kinds={armadura:"armor",escudo:"shield",arma:"weapon"};
const weightNumbers={"muito-leve":0.125,leve:0.125,medio:0.5,pesado:1,"muito-pesado":2};
export function categoryOf(it={}){
 const raw=String(it.category||it.weightCategory||it.weightClass||(typeof it.weight==="string"?it.weight:"")||"").toLowerCase().replaceAll(" ","-");
 return alias[raw]||raw||({"Roupas Simples":"muito-leve","Armadura Leve":"leve","Armadura Média":"medio","Armadura Pesada":"pesado"})[it.name]||"";
}
export function weaponHands(it){
 if(it?.kind==="shield")return 1;
 if([1,2].includes(Number(it?.hands)))return Number(it.hands);
 if(/(?:duas|2) mãos|^arco longo/i.test(it?.name||""))return 2;
 if(/(?:uma|1) mão/i.test(it?.name||""))return 1;
 return 0;
}
export function isHandEquipment(it){return ["weapon","firearm","shield"].includes(it?.kind);}
export function equipmentPosition(it){return it?.equipped&&isHandEquipment(it)?"hands":it?.position==="quick"?"quick":"bag";}
export function hasQuickDraw(c){return !!c?.skills?.includes("saque-rapido")&&Number(c.attributes?.agilidade||0)>=2&&Number(c.attributes?.destreza||0)>=1&&Number(c.practices?.armas_conjuracao||0)>=2;}
export function carryingCapacity(c){return 1+Math.floor((Number(c.attributes?.forca||0)+Number(c.attributes?.vigor||0)+Number(c.practices?.atletismo||0))/3);}
export function heldHands(items=[]){const held=items.filter(it=>isHandEquipment(it)&&it.equipped);return held.some(it=>!weaponHands(it)||it.qty!==1)?null:held.reduce((n,it)=>n+weaponHands(it),0);}
export function drawModeFor(c,it){
 const position=equipmentPosition(it),trained=hasQuickDraw(c);
 if(position==="hands")return "none";
 if(position==="quick")return trained?"quick":"normal";
 return trained?"inventory-trained":"inventory-untrained";
}
export function planDraw(c,id,stow=[]){
 const it=c?.items?.find(x=>x.id===id&&["weapon","firearm"].includes(x.kind));
 if(!it)return {ok:false,error:"Arma não encontrada."};
 if(it.equipped)return {ok:true,mode:"none",items:c.items};
 const mode=drawModeFor(c,it);
 if(!weaponHands(it)||it.qty!==1)return {ok:false,error:"Defina a empunhadura e separe uma arma (quantidade 1)."};
 const selected=new Set(stow);
 if([...selected].some(k=>!c.items.some(x=>x.id===k&&x.equipped&&isHandEquipment(x))))return {ok:false,error:"Seleção de armas/escudos para guardar inválida."};
 const items=c.items.map(x=>x.id===id?{...x,equipped:true,position:"hands"}:selected.has(x.id)?{...x,equipped:false,position:x.kind==="shield"?"bag":"quick"}:x);
 const used=heldHands(items);
 if(used===null||used>2)return {ok:false,error:"Libere mãos suficientes ou confirme a empunhadura dos itens já em mãos."};
 return {ok:true,mode,items};
}
export function disarmTransfer(attacker,target,weaponId,destination,newId){
 const it=target?.items?.find(x=>x.id===weaponId&&x.equipped&&["weapon","firearm"].includes(x.kind));
 if(!it)return {ok:false,error:"Escolha uma arma empunhada pelo alvo."};
 if(!["bag","hands","ground"].includes(destination))return {ok:false,error:"Escolha o destino da arma."};
 if(destination==="bag"&&!hasQuickDraw(attacker))return {ok:false,error:"Guardar a arma desarmada exige Saque Rápido."};
 const captured={...it,id:newId||it.id,qty:1,equipped:destination==="hands",position:destination==="hands"?"hands":"bag"};
 if(destination!=="ground"&&weightUsed(attacker)+Number(it.weight||0)>carryingCapacity(attacker))return {ok:false,error:"Capacidade de carga insuficiente."};
 const items=destination==="ground"?attacker.items:[...attacker.items,captured];
 if(destination==="hands"&&(heldHands(items)===null||heldHands(items)>2))return {ok:false,error:"Não há mãos livres compatíveis."};
 return {ok:true,attacker:{...attacker,items},target:{...target,items:target.items.flatMap(x=>x.id!==weaponId?[x]:x.qty>1?[{...x,qty:x.qty-1,equipped:false,position:"bag"}]:[])},ground:destination==="ground"?captured:null,weapon:it.name};
}
export function normalizeEquipment(original={}){
 const raw=migrateArmorIntegrity(original);
 const kind=["armor","shield","weapon","firearm","focus"].includes(raw.kind)?raw.kind:(kinds[raw.type]||raw.kind||"other");
 const category=categoryOf(raw),sourceIntegrity=raw.integrity;
 const max=int(raw.integrityMax??raw.max??(typeof sourceIntegrity==="object"?sourceIntegrity.max:undefined)??0);
 const hp=int((typeof sourceIntegrity==="object"?sourceIntegrity.value:sourceIntegrity)??raw.hp??max,0,max);
 return {id:String(raw.id||raw.name||"item").slice(0,110),name:String(raw.name||"Item").slice(0,100),
  kind,category,grade:int(raw.grade||1,1,4),weight:typeof raw.weight==="number"?Math.max(0,raw.weight):(weightNumbers[category]||0),
  qty:int(raw.qty||1,1,99),integrityMax:max,integrity:hp,equipped:!!raw.equipped,hands:weaponHands({...raw,kind}),position:equipmentPosition({...raw,kind}),
  die:Number(raw.die)||0,range:Number(raw.range)||0,properties:Array.isArray(raw.properties)?raw.properties:[]};
}
export function normalizeCombatant(raw={},side="jogadores",source="navegador"){
 const kind=raw.kind==="criatura"?"monstro":(["humanoide","monstro","humanoide-monstro"].includes(raw.kind)?raw.kind:"humanoide");
 const base=blank(kind),out={...base,
  id:String(raw.id||"").slice(0,110),name:String(raw.name||raw.nome||"Sem nome").slice(0,110),
  side,source,sourceId:String(raw.sourceId||raw.id||"").slice(0,110),
  concept:String(raw.concept||raw.origin||"").slice(0,500),
  abilities:String(raw.abilities||"").slice(0,4000),notes:String(raw.notes||"").slice(0,4000),
  level:int(raw.level||1,1,20),threatGrade:int(raw.threatGrade||1,1,6),
  leader:!!raw.leader,race:String(raw.race||"").slice(0,70),
  attributes:{...base.attributes},knowledges:{...base.knowledges},practices:{...base.practices},
  // As Perícias compradas ficam no campo skills; concessões de origem são somadas
   // sem transformar a isenção de Foco do Lucker Puro em aquisição automática.
   skills:[...new Set([...(Array.isArray(raw.skills)?raw.skills.filter(x=>typeof x==="string").map(x=>x==="maestria-macas"?"maestria-martelos":x).slice(0,130):[]),
    ...humanoidRacialGrants({...raw,kind})])],
  items:Array.isArray(raw.items)?raw.items.slice(0,70).map(normalizeEquipment):[],
  smallCompanion:{present:!!raw.smallCompanion?.present,name:String(raw.smallCompanion?.name||"").slice(0,70),
   species:String(raw.smallCompanion?.species||"").slice(0,50)},
  statuses:{sangramento:!!raw.statuses?.sangramento,envenenado:!!raw.statuses?.envenenado,
   caido:!!raw.statuses?.caido,agarradoPor:String(raw.statuses?.agarradoPor||"").slice(0,110),
   cravadas:(Array.isArray(raw.statuses?.cravadas)?raw.statuses.cravadas:[]).slice(0,30)
    .filter(x=>x&&typeof x.name==="string").map(x=>({name:x.name.slice(0,90),weaponId:String(x.weaponId||"").slice(0,100),
     attackerId:String(x.attackerId||"").slice(0,100),shieldId:String(x.shieldId||"").slice(0,100),category:String(x.category||"").slice(0,24)}))},
  courageRoundSpent:int(raw.courageRoundSpent||0,0,5)};
 for(const [field,defs] of [["attributes",ATTRIBUTES],["knowledges",KNOWLEDGES],["practices",PRACTICES]])
  for(const [key] of defs)out[field][key]=int(raw[field]?.[key],0,6);
 out.life=int(raw.life??(stats(out).life+Number(hasSmallCompanion(out))),0,999);
 out.courage=side==="inimigos"?0:int(raw.courage??10,0,maxCourage(out.level));
 out.pavorLocal=int(raw.pavorLocal??(kind==="monstro"?monsterCap(out.threatGrade):4),0,monsterCap(out.threatGrade));
 out.keep=int(raw.keep??2,2,4);
 out.acted=!!raw.acted;
 return out;
}
/** Os efeitos Psíquicos precisam de Foco no registro e, para Lucker Puro, requisitos cumpridos. */
export function hasCombatFocus(c){return humanoidHasFocus(c);}
export function focusCombatStatus(c){
 if(c?.race!=="lucker_puro"||!isHumanoidKind(c?.kind))return "";
 if(!c.skills?.includes("criar-item-foco-magia"))
  return "Não adquirido: compre Criar Item de Foco e Magia por 0 XP na ficha, após Disciplina 1, Inteligência 1 e Artesão 1, e importe uma nova cópia.";
 if(!hasCombatFocus(c))
  return "Foco registrado, mas inválido: faltam Disciplina 1, Inteligência 1 ou Artesão 1; confirme os requisitos na ficha de origem.";
 return "Criar Item de Foco e Magia adquirido por 0 XP e habilitado para o rolador.";
}
/** Consulta somente a cópia do combatente: não abre nem modifica a ficha de origem. */
export function combatantSheetData(c={}){
 const human=isHumanoidKind(c.kind),owned=Array.isArray(c.skills)?c.skills:[];
 const levels=(defs,field)=>defs.map(([id,name])=>({id,name,grade:int(c[field]?.[id],0,6)}));
 const disciplineGrade=int(c.practices?.armas_conjuracao,0,6);
 return {
  kindName:KINDS[c.kind]||(c.kind==="monstro"?"Criatura/Monstro":"Tipo não identificado"),
  human,disciplineGrade,focusStatus:focusCombatStatus(c),
  advancedDiscipline:human&&owned.includes("disciplina-avancada"),
  advancedReady:human&&owned.includes("disciplina-avancada")&&disciplineGrade>=3,
  attributes:levels(ATTRIBUTES,"attributes"),
  knowledges:human?levels(KNOWLEDGES,"knowledges"):[],
  practices:human?levels(PRACTICES,"practices"):[],
  skills:human?owned.map(id=>{
   const ref=SKILLS.find(s=>s.id===id);
   return {id,name:ref?.name||id,detail:ref?.detail||"Descrição não encontrada no catálogo atual.",known:!!ref};
  }):[],
  items:Array.isArray(c.items)?c.items:[],
  abilities:String(c.abilities||""),notes:String(c.notes||""),concept:String(c.concept||""),
  source:String(c.source||"Importação"),name:String(c.name||"Sem nome"),
  level:int(c.level,1,20),threatGrade:int(c.threatGrade,1,6)
 };
}

/** Saúde segue os quatro estados do jogador (inclusive inimigos). */
export function hasSmallCompanion(c){return !!(c?.smallCompanion?.present&&c?.skills?.includes("domar-criatura-pequena"));}
export function combatHealth(c){
 const max=4+Number(c?.attributes?.vigor||0)+Math.floor(Number(c?.attributes?.forca||0)/2);
 return healthByLife(c,Math.max(0,Math.min(max,Math.floor(Number(c?.life??max)))));
}
/** Elevação: uma fonte inteira, até G6, nunca o dado de equipamento. */
export function boostCombatSource(unit,group,key){
 const field={attribute:"attributes",knowledge:"knowledges",practice:"practices"}[group];
 const grade=Number(unit?.[field]?.[key]);
 if(!field||!Number.isInteger(grade)||grade<0||grade>=6)return {ok:false,error:"Fonte sem Grau elegível (máximo G6)."};
 const human=isHumanoidKind(unit.kind);
 if(!human&&group!=="attribute")return {ok:false,error:"Monstro usa somente seus Atributos."};
 const boosted={...unit,[field]:{...unit[field],[key]:grade+1}};
 const monsterRules=!human;
 return {ok:true,unit:boosted,oldGrade:grade,newGrade:grade+1,
  before:sourceDice(group,key,{...unit,monsterRules}),
  after:sourceDice(group,key,{...boosted,monsterRules})};
}
export function rollProvenance(rolled,ids,options={}){
 const names={attribute:"Atributo",knowledge:"Conhecimento",practice:"Prática",equipment:"Equipamento",magic:"Grau mágico"};
 const kept=new Set(ids||[]);
 return (rolled||[]).map(d=>{
  const [e,a,p]=faceSymbols(d.sides,d.face);
  const idName=({attribute:ATTRIBUTES,knowledge:KNOWLEDGES,practice:PRACTICES})[d.group]?.find(x=>x[0]===d.key)?.[1];
  const source=d.group==="equipment"?String(options.weapon||"Equipamento"):
   d.group==="magic"?"Magia "+String(d.key||""):idName||String(d.key||"Fonte");
  return {id:d.id,source,group:names[d.group]||"Fonte",sides:d.sides,face:d.face,
   kept:kept.has(d.id),e,a,p,step:!!d.boosted,fulminante:!!d.fulminante};
 });
}
/** Custos de perícias não determinados globalmente são declarados pelo Narrador. */
export function selectedActiveSkill(c,id){
 if(!id)return null;
 if(!isHumanoidKind(c?.kind)||!c?.skills?.includes(id))return null;
 if(id==="espalhar-golpe"&&(Number(c.practices?.armas_conjuracao||0)<2||Number(c.attributes?.agilidade||0)<1||Number(c.attributes?.destreza||0)<1||!c.skills.includes("golpe-fulminante")))return null;
 if(id==="golpe-fulminante"&&(Number(c.practices?.armas_conjuracao||0)<2||Number(c.attributes?.forca||0)<2||!["armas-leves","armas-medias","armas-pesadas","pugilismo"].some(k=>c.skills.includes(k))))return null;
 // Uma compra antiga permanece na ficha, mas Artista Marcial não ativa sem Atletismo 1.
 if(id==="artista-marcial"&&
   (Number(c?.practices?.atletismo||0)<1||
    Number(c?.practices?.armas_conjuracao||0)<2||
    Number(c?.attributes?.destreza||0)<2||!c?.skills?.includes("pugilismo")))return null;
 const row=SKILLS.find(x=>x.id===id);
 return row?{id,name:row.name,detail:row.detail}:null;
}
/** Técnica Fulminante: melhora um ÚNICO dado de arma por ativação.
 * Não extrapola automaticamente para d20, Perícias de armas de fogo ou magia.
 */
export function fulminanteWeaponDice(die){
 if(![6,10,12].includes(Number(die)))return null;
 return Number(die)===6?[10]:Number(die)===10?[12]:[12,12];
}
export function validFulminanteForWeapon(weapon,skill,thrown=false){
 if(!weapon||weapon.kind==="firearm")return false;
 const ranged=/(?:^arco\b|^besta\b|zarabatana)/i.test(weapon.name||"")||
  (weapon.properties||[]).includes("À Distância");
 if(skill==="golpe-fulminante")return !ranged&&!thrown;
 if(skill==="disparo-fulminante")return ranged||thrown;
 return false;
}
export function applyFulminanteToPool(pool,weapon,skill,thrown=false){
 if(!validFulminanteForWeapon(weapon,skill,thrown))return {ok:false,error:"Fulminante incompatível com arma/modo de ataque."};
 const index=(pool||[]).findIndex(d=>d.group==="equipment"&&d.key===weapon.id);
 if(index<0)return {ok:false,error:"O dado da arma deve estar na pilha."};
 const base=pool[index],elevated=fulminanteWeaponDice(base.sides);
 if(!elevated)return {ok:false,error:"Só é possível elevar um dado de arma d6, d10 ou d12."};
 const output=pool.map(d=>({...d}));
 output[index].sides=elevated[0];output[index].fulminante=true;output[index].originalSides=base.sides;
 if(elevated.length===2){
  if(output.length>=9)return {ok:false,error:"O segundo d12 ultrapassaria o teto de 9 dados rolados."};
  output.push({...base,id:base.id+".fulminante",sides:12,fulminante:true,originalSides:12});
 }
 return {ok:true,pool:output,before:[base.sides],after:elevated};
}
/** Características reais da arma, com efeitos condicionados ao acerto e à Perícia. */
export const ACTIVE_WEAPON_PROPERTIES=Object.freeze(["Cortante","Perfurante","Cravar","Contundente","Enganchar","Longa","Empurrar","Agarrar","Derrubar","Desarmar"]);
export function activeWeaponProperties(weapon){
 return [...new Set((weapon?.properties||[]).filter(x=>ACTIVE_WEAPON_PROPERTIES.includes(x)))];
}
export function weaponActivationSkill(c,weapon,{thrown=false}={}){
 const skills=c?.skills||[];
 if(!weapon)return {ok:false,error:"Equipe uma arma para ativar sua característica."};
 const weightSkill=weapon.category==="medio"?"armas-medias":weapon.category==="pesado"?"armas-pesadas":"armas-leves";
 const name=String(weapon.name||"").toLowerCase();
 const ranged=(weapon.properties||[]).includes("À Distância")||/^(arco|besta|zarabatana)/.test(name);
 const required=weapon.kind==="firearm"?"armas-fogo":
  thrown?"maestria-arremesso-armas":
  /^(luva|punho|soco|soqueira|manopla)/.test(name)?"pugilismo":
  ranged?"armas-longo-alcance":weightSkill;
 if(!skills.includes(required))return {ok:false,error:"Efeito da arma exige "+required+" adquirido.",required};
 if(required==="pugilismo"&&
   (Number(c?.practices?.armas_conjuracao||0)<1||
    Number(c?.attributes?.forca||0)<2||Number(c?.attributes?.destreza||0)<1))
  return {ok:false,error:"Pugilismo exige Disciplina 1, Força 2 e Destreza 1 para ativar características.",required};
 const weightRequirements={
  "armas-leves":{disc:1,strength:0},
  "armas-medias":{disc:1,strength:1},
  "armas-pesadas":{disc:2,strength:2}
 };
 const req=weightRequirements[required];
 if(req&&(Number(c?.practices?.armas_conjuracao||0)<req.disc||
   Number(c?.attributes?.forca||0)<req.strength))
  return {ok:false,error:"A Perícia de armas "+required+" não cumpre Disciplina "+req.disc+
   (req.strength?" e Força "+req.strength:"")+" para habilitar efeitos.",required};
 if(thrown&&!skills.includes(weightSkill))
  return {ok:false,error:"Arremesso exige também a Perícia da categoria "+weightSkill+".",required:weightSkill};
 return {ok:true,required};
}
export function weaponMasteryFor(weapon,{thrown=false}={}){
 if(!weapon)return "";
 const name=String(weapon.name||"").toLowerCase();
 if(weapon.kind==="firearm")return "maestria-armas-fogo";
 if(thrown)return "maestria-arremessos";
 if(/^(faca|punhal|adaga|kunai|shuriken)/.test(name))return "maestria-adagas";
 if(/^(espada|montante|katana)/.test(name))return "maestria-espadas";
 if(/^machado/.test(name))return "maestria-machados";
 if(/^(maça|maca|clava)/.test(name))return "maestria-martelos";
 if(/^(lança|naginata)/.test(name))return "maestria-hastes";
 if(/^(cajado|bastão)/.test(name))return "maestria-cajados";
 if(/^martelo|^marreta/.test(name))return "maestria-martelos";
 if(/^arco/.test(name))return "maestria-arcos";
 if(/^besta/.test(name))return "maestria-bestas";
 if(/^(luva|punho|soco|soqueira|manopla)/.test(name))return "maestria-punhos";
 if((weapon.properties||[]).includes("À Distância"))return "maestria-longo-alcance";
 return "";
}
/** Valida requisitos atuais de compra para o efeito gratuito da Especialização, sem
 * confundi-los com a habilitação por peso verificada separadamente. */
export function canUseWeaponMastery(c,id){
 if(id==="maestria-macas")id="maestria-martelos";
 if(!id||(!(c?.skills||[]).includes(id)&&!(id==="maestria-martelos"&&(c?.skills||[]).includes("maestria-macas"))))return false;
 if(id==="maestria-armas-fogo")return c?.race==="humano";
 const requirements={
  "maestria-martelos":{forca:3,destreza:1,vigor:1},
  "maestria-adagas":{agilidade:2,destreza:2},
  "maestria-espadas":{forca:2,destreza:2},
  "maestria-machados":{forca:2,destreza:1},
  "maestria-hastes":{forca:2,agilidade:1,destreza:1},
  "maestria-cajados":{destreza:2},
  "maestria-punhos":{forca:1,agilidade:1,destreza:1,vigor:1}
 };
 const req=requirements[id];
 // Custo 1 XP não equivale a requisitos de compra aprovados.
 if(!req)return false;
 return Object.entries(req).every(([attr,grade])=>Number(c?.attributes?.[attr]||0)>=grade);
}
export function planWeaponEffects(c,weapon,chosen=[],{success=false,critical=0,thrown=false}={}){
 const selected=Array.isArray(chosen)?chosen:[];
 if(!selected.length)return {ok:true,active:[],cost:0,mastery:false,free:0};
 const eligible=activeWeaponProperties(weapon);
 if(new Set(selected).size!==selected.length||selected.some(x=>!eligible.includes(x)))
  return {ok:false,error:"Só é possível ativar características distintas existentes na arma equipada."};
 const access=weaponActivationSkill(c,weapon,{thrown});
 // Exceção preservada da v0.77: Cravar Médio/Pesado pode ativar UM efeito
 // gratuitamente por crítico, mesmo sem a Perícia de peso correspondente.
 const cravarOnCritical=!!critical&&selected.length===1&&selected[0]==="Cravar"&&
  weapon?.kind==="weapon"&&weapon.equipped!==false&&
  ["medio","pesado"].includes(weapon.category)&&!thrown;
 if(!access.ok&&!cravarOnCritical)return access;
 const masteryId=weaponMasteryFor(weapon,{thrown});
 const mastery=canUseWeaponMastery(c,masteryId);
 // SRD v0.101: o custo é pago ao DECLARAR a tentativa, antes do teste.
 // Mesmo no crítico, não zerar o débito: a Coragem volta pelo reembolso
 // crítico de resolveRoll, já contabilizado UMA vez no fechamento da ação.
 // A primeira propriedade da Especialização é gratuita desde a declaração;
 // a exceção de Cravar sem habilitação no crítico também não cobra Coragem.
 const cost=cravarOnCritical&&!access.ok?0:Math.max(0,selected.length-(mastery?1:0));
 if(!success)return {ok:true,active:[],cost,mastery,free:0};
 const free=mastery?(critical?2:1):(critical?1:0);
 const max=mastery?(critical?3:1):(critical?2:1);
 if(selected.length>max)
  return {ok:false,error:"Este resultado permite no máximo "+max+" característica(s) da arma (sem repetir)."};
 return {ok:true,active:[...selected],cost,mastery,free:Math.min(free,selected.length),activationSkill:access.required,masteryId};
}
/** Valida as características antes de conhecer as faces. */
export function declareWeaponEffects(c,weapon,chosen=[],thrown=false){
 return planWeaponEffects(c,weapon,chosen,{success:true,critical:2,thrown});
}
export function resolveDeclaredWeaponEffects(c,weapon,chosen,declared,{success=false,critical=0,thrown=false}={}){
 if(!declared?.ok)return {ok:false,error:"Características não foram declaradas."};
 if(!success)return {...declared,active:[],free:0};
 const access=weaponActivationSkill(c,weapon,{thrown});
 if(!access.ok&&!critical)return {...declared,active:[],free:0};
 const max=declared.mastery?(critical?3:1):(critical?2:1);
 const resolved=planWeaponEffects(c,weapon,chosen.slice(0,max),{success,critical,thrown});
 return resolved.ok?{...resolved,cost:declared.cost}:resolved;
}
/** Despesa bruta da declaração, não custo líquido pós-crítico. */
/** Golpe Colossal: seleção declarada dentro de 3 m, validada narrativamente. */
export function planColossalTargets(attacker,primary,roster,ids,cost){
 if(!Number.isInteger(cost)||cost<1||cost>5)return {ok:false,error:"Golpe Colossal exige de 1 a 5 recursos declarados."};
 if(!selectedActiveSkill(attacker,"espalhar-golpe"))return {ok:false,error:"Golpe Colossal não habilitado."};
 if(!Array.isArray(ids)||new Set(ids).size!==ids.length||ids.length>2*cost)return {ok:false,error:"Selecione até "+(2*cost)+" alvos adicionais distintos."};
 const targets=ids.map(id=>roster.find(x=>x.id===id));
 if(targets.some(t=>!t||t.id===attacker.id||t.id===primary.id||t.side===attacker.side||t.life===0))return {ok:false,error:"Selecione somente adversários válidos, distintos do alvo principal."};
 return {ok:true,cost,bonusE:1,targets:targets.map(t=>({id:t.id,name:t.name,de:defense(t)}))};
}
export function colossalOutcomes(result,targets=[],fulminante=false){
 const e=Math.max(0,Number(result.e)||0),p=Math.max(0,Number(result.p)||0),reached=e+p;
 const mult=result.critical===4?2:1;
 const damageE=Math.floor(e*mult/2),damageP=fulminante?p*mult:0;
 return targets.map(t=>{const success=reached>=t.de;return {...t,reached,success,damageE:success?damageE:0,damageP:success?damageP:0,integrityDamage:success?damageE+damageP:0,integrityApplied:false};});
}
export function planCourageDeclaration(c,{activations=[],weaponCost=0,martialCost=0,extraKeep=false,step=false,healthCost=0}={}){
 const costs=[...activations.map(x=>x.cost),weaponCost,martialCost,Number(extraKeep),Number(step),healthCost];
 if(costs.some(x=>!Number.isInteger(x)||x<0))return {ok:false,error:"Custos declarados inválidos."};
 const total=costs.reduce((a,b)=>a+b,0),spent=Number(c.courageRoundSpent||0);
 if(total+spent>5)return {ok:false,error:"Teto de 5 Coragens no turno: "+spent+" já gastas, "+total+" declaradas."};
 if(total>Number(c.courage||0))return {ok:false,error:"Coragem insuficiente: "+total+" declaradas."};
 return {ok:true,total,actor:{...c,courage:Number(c.courage||0)-total,courageRoundSpent:spent+total}};
}
export function weaponEffectOutcome(properties=[],target={},weapon=null){
 const effects=Array.isArray(properties)?properties:[];
 const notes=[];
 const applied={};
 if(effects.includes("Cortante"))applied.sangramento=true;
 if(effects.includes("Perfurante"))notes.push("Perfurante: cada Pavor não anulado vale 1 dano à Integridade, sem somar o piso(P/2). Conferir escudo levantado e proteção psíquica.");
 if(effects.includes("Cravar")){
  const shield=(target?.items||[]).find(i=>i.kind==="shield"&&i.equipped);
  if(!shield||!["medio","pesado"].includes(weapon?.category))
   return {ok:false,error:"Cravar exige arma Média/Pesada e escudo físico equipado no alvo."};
  if(shield.category==="pesado"&&weapon.category!=="pesado")
   return {ok:false,error:"Só arma Pesada pode Cravar em escudo Pesado."};
  notes.push("Cravar: arma fica presa ao escudo; registrar remoção, peso e −1E acumulativo somente em Levantar Escudo.");
  applied.cravar=true;
 }
 for(const property of effects.filter(x=>["Contundente","Enganchar","Longa"].includes(x)))
  notes.push(property+": característica ativada; desfecho numérico/manobra exige procedimento do Narrador.");
 if(effects.includes("Cortante"))notes.push("Cortante: estado Sangramento aplicado mesmo com armadura, sem dano direto de condição.");
 return {ok:true,applied,notes};
}
/** Efeitos comuns: o gatilho e a habilitação continuam sendo responsabilidade da fonte. */
export function combatManoeuvreOutcome(effects=[],attacker={},target={},success=true){
 const applied={},notes=[];
 if(!success)return {applied,notes};
 const selected=new Set(effects);
 if(selected.has("Empurrar")){applied.pushMeters=4;notes.push("Empurrar: deslocar o alvo 4 metros (posição resolvida na mesa).");}
 if(selected.has("Agarrar")){applied.agarradoPor=String(attacker.id||"");notes.push("Agarrar: Desvantagem de movimento; para escapar, superar a DE de quem agarra ("+defense(attacker)+").");}
 if(selected.has("Derrubar")){applied.caido=true;notes.push("Derrubar: alvo caído; levantar custa 4 movimentos; golpe enquanto caído tem Desvantagem (−1A).");}
 if(selected.has("Desarmar")){applied.disarm=true;notes.push("Desarmar: retirar arma empunhada do alvo; quem desarma pode guardar com Saque Rápido respeitando carga, segurar em mão livre compatível ou deixar cair. Escolha o destino da arma.");}
 return {applied,notes};
}
export function applyCombatManoeuvres(target,outcome){
 const applied=outcome?.applied||{},statuses={...target.statuses};
 if(applied.agarradoPor)statuses.agarradoPor=applied.agarradoPor;
 if(applied.caido)statuses.caido=true;
 return {...target,statuses};
}
export function standFromProne(c,available){
 if(!c?.statuses?.caido)return {ok:false,error:"Combatente não está caído."};
 if(!Number.isFinite(available)||available<4)return {ok:false,error:"São necessários 4 movimentos para se levantar."};
 return {ok:true,spent:4,actor:{...c,statuses:{...c.statuses,caido:false}}};
}
export function escapeGrapple(c,grappler,reached){
 if(!grappler||!c?.statuses?.agarradoPor||c.statuses.agarradoPor!==grappler.id)return {ok:false,error:"Quem agarra não está disponível nesta ficha."};
 if(!Number.isInteger(reached)||reached<0)return {ok:false,error:"Informe os pontos válidos do teste."};
 const de=defense(grappler),success=reached>=de;
 return {ok:true,success,de,actor:success?{...c,statuses:{...c.statuses,agarradoPor:""}}:c};
}
export function proneAttackPenalty(c,situation="neutral"){
 return c?.statuses?.caido&&situation!=="disadvantage"?-1:0;
}
export const MARTIAL_MANOEUVRES=Object.freeze(["Empurrar","Agarrar","Derrubar","Desarmar"]);
export function canChangePunchWeight(c){
 return !!selectedActiveSkill(c,"pugilismo")&&Number(c?.practices?.armas_conjuracao||0)>=1&&Number(c?.attributes?.forca||0)>=2&&Number(c?.attributes?.destreza||0)>=1;
}
export function planMartialAttack(c,{unarmed=false,pugilism=false,weight="medio",manoeuvre="",success=false}={}){
 if(!unarmed&&(pugilism||manoeuvre))return {ok:false,error:"Pugilismo e manobras marciais exigem ataque desarmado."};
 if(pugilism&&(!canChangePunchWeight(c)||!["leve","pesado"].includes(weight)))return {ok:false,error:"Pugilismo exige habilitação e escolha de peso Leve ou Pesado."};
 if(manoeuvre&&(!selectedActiveSkill(c,"artista-marcial")||!MARTIAL_MANOEUVRES.includes(manoeuvre)))return {ok:false,error:"Escolha uma manobra válida de Artista Marcial adquirido."};
 const category=pugilism?weight:"medio";
 return {ok:true,category,cost:Number(pugilism||!!manoeuvre),manoeuvre,active:success&&manoeuvre?[manoeuvre]:[],weapon:unarmed?{kind:"unarmed",name:"Soco",category,properties:[]}:null};
}
export function criticalFaces(rolled=[],ids=[]){
 const kept=new Set(ids);
 const selected=rolled.filter(x=>kept.has(x.id));
 const critical=selected.length>=2&&selected.every(x=>x.face===x.sides);
 return {critical:critical?selected.length:0,
  faces:selected.map(x=>({id:x.id,sides:x.sides,face:x.face,max:x.face===x.sides}))};
}
export function candidateScore(pre,mode="balanced"){
 const r=pre?.result;if(!pre?.ok||!r)return -Infinity;
 const success=Number(!!r.success),clean=Number(!!r.success&&r.p===0);
 const crit=Number(r.critical||0),reach=Number(r.reached||0);
 const dmg=Number(pre.integrityDamage??r.damage??0),life=Number(pre.life?.damage===2);
 const fear=Number(r.p||0),anticipation=Number(r.aRemaining||0);
 const effectiveCourage=Math.max(0,Number(pre.courageCost||0)-Number(r.criticalRefundCourage||0));
 const resource=effectiveCourage+Number(pre.pavorCost??pre.cost??0);
 if(mode==="damage")return success*1e7+crit*9000+dmg*2500+life*15000+reach*100+anticipation*4-fear*220-resource*140;
 if(mode==="safety")return success*1e7+clean*100000+crit*4000+reach*85+dmg*55+anticipation*18-fear*7000-resource*700;
 return success*1e7+clean*65000+crit*8000+life*11000+dmg*700+reach*120+anticipation*22-fear*1800-resource*450;
}
/** Busca exaustiva 1..4 mantidos e todos os gastos A pertinentes, sem criar dados. */
export function bestKeepSelection(rolled,maxKeep,evaluateCandidate,mode="balanced"){
 if(!Array.isArray(rolled)||!Number.isInteger(maxKeep)||maxKeep<1)return null;
 let best=null;
 const n=rolled.length,limit=Math.min(maxKeep,n,4);
 function test(ids){
  // A prévia sem gastos de Antecipar contém exatamente o número disponível de A e P
  // (inclui bônus de Saúde, circunstância e crítico), sem supor valores extras.
  const initial=evaluateCandidate(ids,{cancelP:0,convertPairs:0});
  if(!initial?.ok)return;
  const a=Math.max(0,Number(initial.result.aRemaining||0));
  const p=Math.max(0,Number(initial.result.p||0));
  const maxCancel=Math.min(9,a,p);
  for(let cancelP=0;cancelP<=maxCancel;cancelP++){
   const maxConvert=Math.min(9,Math.floor((a-cancelP)/2));
   for(let convertPairs=0;convertPairs<=maxConvert;convertPairs++){
    const pre=cancelP===0&&convertPairs===0?initial:evaluateCandidate(ids,{cancelP,convertPairs});
    if(!pre?.ok)continue;
    const score=candidateScore(pre,mode);
    if(!best||score>best.score+1e-7||
     (score===best.score&&ids.length>best.ids.length))
     best={ids:[...ids],cancelP,convertPairs,score,preview:pre};
   }
  }
 }
 function search(start,ids){
  if(ids.length)test(ids);
  if(ids.length>=limit)return;
  for(let i=start;i<n;i++){
   ids.push(rolled[i].id);search(i+1,ids);ids.pop();
  }
 }
 search(0,[]);
 return best;
}

export function markCondition(c,id,value){
 if(!["sangramento","envenenado"].includes(id))return {ok:false,error:"Condição não reconhecida."};
 return {ok:true,actor:{...c,statuses:{...c.statuses,[id]:!!value}}};
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
export function equippedWeapons(c,catalog=[],includeCarried=false){
 return (c?.items||[]).filter(it=>["weapon","firearm"].includes(it.kind)&&(it.equipped||includeCarried)).map(it=>{
  const cat=catalog.find(x=>x.name?.toLowerCase()===it.name.toLowerCase())||{};
  const kind=it.kind==="firearm"||cat.kind==="firearm"?"firearm":"weapon";
  const category=cat.category||it.category;
  const properties=[...new Set([...(Array.isArray(it.properties)?it.properties:[]),...(Array.isArray(cat.properties)?cat.properties:[])])];
  const long=properties.includes("À Distância");
  const skill=kind==="firearm"?"armas-fogo":category==="medio"?"armas-medias":category==="pesado"?"armas-pesadas":"armas-leves";
  const eligible=(c.skills||[]).includes(skill)||(long&&(c.skills||[]).includes("armas-longo-alcance"));
  const die=Number(it.die||cat.die||0),range=Number(it.range||cat.range||0);
  return {...it,kind,category,die,range,properties,skill,eligible:eligible&&[6,10,12].includes(die)};
 });
}
export function weightAffinity(weapon,target,attacker=null){
 if(!weapon)return {status:"manual",delta:0,description:"Sem peso de arma declarado."};
 const armor=armorOf(target);
 if(!armor)return {status:"manual",delta:0,description:"Alvo sem armadura: afinidade de peso sem critério automático aprovado."};
 const atk=weapon.category==="muito-leve"?"leve":weapon.category;
 const def=armor.category==="muito-leve"?"leve":armor.category==="muito-pesado"?"pesado":armor.category;
 const table={leve:{leve:0,medio:1,pesado:-1},medio:{leve:1,medio:-1,pesado:0},pesado:{leve:-1,medio:0,pesado:1}};
 const name=String(weapon.name||"").toLocaleLowerCase("pt-BR");
 // SRD: arcos, bestas e armas de fogo têm suas próprias tabelas, não a matriz genérica de peso.
 let natural=null,expertise=null;
 if(weapon.kind==="firearm"){
  expertise="armas-fogo";
  if(/sniper/.test(name))natural={leve:1,medio:1,pesado:1};
  else if(/shotgun|escopeta/.test(name))natural={leve:1,medio:0,pesado:0};
  else if(/revólver|revolver|pistola|metralhadora|lança.granadas|lanca.granadas/.test(name))
   natural={leve:-1,medio:0,pesado:0};
 }else if(/^arco curto/.test(name)){natural={leve:-1,medio:1,pesado:0};expertise="armas-longo-alcance";}
 else if(/^arco longo/.test(name)){natural={leve:-1,medio:0,pesado:1};expertise="armas-longo-alcance";}
 else if(/^besta de uma mão/.test(name)){natural={leve:0,medio:0,pesado:0};expertise="armas-longo-alcance";}
 else if(/^besta de duas mãos/.test(name)){natural={leve:-1,medio:0,pesado:1};expertise="armas-longo-alcance";}
 else if(/^besta|^zarabatana/.test(name))return {status:"manual",delta:0,description:"Modelo à distância sem correspondência exata na tabela de afinidade: aplicar manualmente."};
 if(weapon.kind==="firearm"&&!natural)return {status:"manual",delta:0,description:"Modelo de arma de fogo sem tabela própria validada: aplicar manualmente."};
 const value=(natural||table[atk])?.[def];
 const relevantSkill=expertise||({leve:"armas-leves",medio:"armas-medias",pesado:"armas-pesadas"})[atk];
 const validWeightRequirements={
  "armas-leves":{disc:1,strength:0},
  "armas-medias":{disc:1,strength:1},
  "armas-pesadas":{disc:2,strength:2}
 };
 const weightReq=validWeightRequirements[relevantSkill];
 const trained=!weightReq||
  (Number(attacker?.practices?.armas_conjuracao||0)>=weightReq.disc&&
   Number(attacker?.attributes?.forca||0)>=weightReq.strength);
 if(weapon.kind!=="unarmed"&&value===-1&&attacker?.skills?.includes(relevantSkill)&&trained)
  return {status:"known",delta:0,description:"A especialização do peso/arma ignora esta Desvantagem natural (−1A)."};
 if(value===undefined)return {status:"manual",delta:0,description:"Categoria não prevista: decisão do Narrador."};
 return {status:"known",delta:value,description:value===1?"Vantagem por peso (+1A)":value===-1?"Desvantagem por peso (−1A)":"Peso neutro."};
}
/** Manejo Perfeito substitui Vantagem de peso por +1E; Golpe Certo totaliza +2E na absoluta. */
export function manejoPerfeitoBonus(attacker,weapon,affinity,{situation="normal",mode="armas",baseKey="armas_conjuracao",thrown=false}={}){
 const p=attacker?.practices||{},a=attacker?.attributes||{},skills=attacker?.skills||[];
 const ready=weapon?.kind==="weapon"&&weapon.equipped&&
  !weapon.firearm&&!(weapon.properties||[]).includes("À Distância")&&
  !/^(arco|besta|zarabatana)/i.test(String(weapon.name||""))&&!thrown&&
  mode==="armas"&&baseKey==="armas_conjuracao"&&
  skills.includes("manejo-perfeito")&&skills.includes("disciplina-avancada")&&
  Number(p.armas_conjuracao||0)>=3&&Number(a.destreza||0)>=2&&
  affinity?.status==="known"&&affinity.delta===1;
 const golpeCerto=!!ready&&situation==="absoluta";
 return {active:!!ready,golpeCerto,bonusE:ready?1:0,suppressWeightA:!!ready,
  description:!ready?"":golpeCerto?"Golpe Certo: +2E no total (Vantagem Absoluta + Manejo Perfeito), sem +1A de peso.":
   "Manejo Perfeito: Vantagem Absoluta (+1E), substituindo o +1A natural do peso."};
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
 else if(field==="coragem"){
  if(copy.side==="inimigos")return {ok:false,error:"Inimigos não possuem Coragem; use Pavor local."};
  copy.courage=int(copy.courage+delta,0,maxCourage(copy.level||1));
 }
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
