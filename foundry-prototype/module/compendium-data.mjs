import {SKILLS} from './skill-catalog.mjs';
import {G1_CATALOG} from './catalog.mjs';
import {equipmentIconId,iconPath,skillIconId} from './iconography.mjs';

export const skillPack='codex-rpg-foundry.pericias';
export const equipmentPack='codex-rpg-foundry.equipamentos';
// FNV-1a de 64 bits, alfabeto hexadecimal permitido pelo Foundry. Independente da ordem do catálogo.
export function catalogId(type,key){
 let value=14695981039346656037n;
 for(const byte of new TextEncoder().encode(type+':'+key))value=BigInt.asUintN(64,(value^BigInt(byte))*1099511628211n);
 return value.toString(16).padStart(16,'0');
}
export function equipmentDefinitions(){
 return G1_CATALOG.map(row=>{
  const {name,...system}=structuredClone(row);
  const icon=equipmentIconId(row);
  return {_id:catalogId('equipment',name),name,type:'equipment',img:icon?iconPath(icon):'icons/svg/item-bag.svg',
   system:{...system,priceVT:row.priceVT??0,die:row.die??0,weight:row.weight??0,range:row.range??0,quantity:1,equipped:false,catalogId:name,
    ammo:{value:row.packSize??0,max:row.packSize??0,reload:0,cartucho:''}},
   flags:{'codex-rpg-foundry':{catalogDefinition:true,catalogState:row.category==='pendente'||row.priceVT==null?'PENDENTE':'DEFINIDO',pricePending:row.priceVT==null}}};
 });
}
export function skillDefinitions(){
 return SKILLS.map(row=>({_id:catalogId('skill',row.id),name:row.name,type:'skill',img:iconPath(skillIconId(row.id,row.family)),system:{
  canonicalId:row.id,description:row.detail,xpCost:row.cost??0,costPending:row.cost==null,requirements:row.requirements,
  grades:row.grades,family:row.family,state:row.legacy?'LEGADO':row.state,source:row.source,sourceCommit:row.sourceCommit??'',automation:row.automation,effects:row.effects??[]
 },flags:{'codex-rpg-foundry':{catalogDefinition:true}}}));
}
export async function openSkillDefinition(id){
 const pack=game.packs.get(skillPack);
 if(!pack)throw Error('Compendium de Perícias indisponível.');
 const item=await pack.getDocument(catalogId('skill',id));
 return item?.sheet.render({force:true});
}
