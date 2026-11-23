import {G1_CATALOG} from './catalog.mjs';
import {equipmentFamily,equipmentWeight,equipmentGroupName,equipmentWeightName,equipmentMatches,EQUIPMENT_FAMILIES,EQUIPMENT_WEIGHT_OPTIONS} from './equipment-catalog.mjs';
import {equippedDie,effectiveWeaponRange} from './equipment-logic.mjs';
import {walletValue,isTradeResource,RESOURCE_NAMES} from './equipment-workflow.mjs';
import {dieSvg} from './dice-icons.mjs';
import {equipmentIconId,iconMarkup} from './iconography.mjs';

function rowView(name,s,id){
 const family=equipmentFamily({name,...s}),weight=equipmentWeight(s);
 const attack=['weapon','firearm','focus'].includes(s.kind);
 const requiredSkill=s.kind==='focus'?'Criar Item de Foco e Magia'+(s.element?' · '+s.element:''):
  s.kind==='firearm'?'Armas de Fogo':s.properties?.includes('À Distância')?'Armas de Longo Alcance':
  ({leve:'Armas Leves',medio:'Armas Médias',pesado:'Armas Pesadas'})[s.category];
 return {id,name,...s,family:equipmentGroupName(family),weightName:equipmentWeightName(weight),
  icon:iconMarkup(equipmentIconId({name,...s}))||'<i class="fa-solid '+({ammunition:'fa-bullseye',instrument:'fa-music',container:'fa-box',kit:'fa-toolbox'}[s.kind]??'fa-suitcase')+'" aria-hidden="true"></i>',
  dieIcon:dieSvg(s.die),propertiesText:(s.properties??[]).join(', '),
  armor:s.kind==='armor',shield:s.kind==='shield',
  defense:({'muito-leve':'+2',leve:'+1',medio:'0',pesado:'−1','muito-pesado':'−2'})[s.category],
  attack,requiredSkill,hasDie:attack&&s.die>0};
}
export function equipmentView(actor,filters){
 const items=[...actor.items].filter(item=>item.type==='equipment');
 const balance=walletValue(actor);
 const quantities=new Map(Object.values(RESOURCE_NAMES).map(name=>[name,0]));
 for(const item of items.filter(isTradeResource)){
  const key=item.flags?.['codex-rpg-foundry']?.resourceKey;
  const name=Object.hasOwn(RESOURCE_NAMES,key)?RESOURCE_NAMES[key]:item.name;
  quantities.set(name,quantities.get(name)+item.system.quantity);
 }
 const resources=Object.entries(RESOURCE_NAMES).map(([id,name])=>({id,name,quantity:quantities.get(name)}));
 const shortcutIds=new Set(actor.getFlag?.('codex-rpg-foundry','attackShortcuts')??[]);
 const options=(rows,value)=>rows.map(([id,label])=>({id,label,selected:id===value}));
 const shop=G1_CATALOG.filter(row=>equipmentMatches(row,filters.shopFamily,filters.shopWeight)).map(row=>({
  ...rowView(row.name,row,row.name),canBuy:row.kind!=='focus'&&row.category!=='pendente'&&Number.isFinite(row.priceVT)&&row.priceVT>0,
  price:row.priceVT??'Pendente',canAfford:Number.isFinite(row.priceVT)&&row.priceVT<=balance}));
 const inventory=items.filter(i=>equipmentMatches({name:i.name,...i.system},filters.family,filters.weight));
 inventory.sort((a,b)=>{
  const family=i=>EQUIPMENT_FAMILIES.findIndex(([id])=>id===equipmentFamily({name:i.name,...i.system}));
  const weight=i=>EQUIPMENT_WEIGHT_OPTIONS.findIndex(([id])=>id===equipmentWeight(i.system));
  return family(a)-family(b)||weight(a)-weight(b)||a.name.localeCompare(b.name,'pt-BR');
 });
 let previous='';
 const gear=inventory.map(item=>{
  const s=item.system,row=rowView(item.name,s,item.id),group=row.family+' · '+row.weightName;
  const result={...row,embeddedMedium:s.embeddedWeapon==='medio',embeddedHeavy:s.embeddedWeapon==='pesado',groupTitle:group!==previous?group:null,range:effectiveWeaponRange(actor.system,s)||s.range,
   canShortcut:['weapon','firearm'].includes(s.kind),hasShortcut:shortcutIds.has(item.id),
   enabledDie:equippedDie(actor,item,s.kind==='focus'?'conjuracao':'armas')};
  previous=group;
  return result;
 });
 const repertoire=items.filter(i=>['weapon','firearm','focus','armor','shield'].includes(i.system.kind)).map(item=>({
  ...rowView(item.name,item.system,item.id),range:effectiveWeaponRange(actor.system,item.system)||item.system.range,
  enabledDie:equippedDie(actor,item,item.system.kind==='focus'?'conjuracao':'armas')}));
 const shortcuts=repertoire.filter(row=>row.equipped&&(row.kind==='focus'||row.attack&&shortcutIds.has(row.id)));
 return {balance,resources,itemCount:items.length,equippedCount:items.filter(item=>item.system.equipped).length,shop,gear,repertoire,shortcuts,
  families:options(EQUIPMENT_FAMILIES,filters.family),weights:options(EQUIPMENT_WEIGHT_OPTIONS,filters.weight),
  shopFamilies:options(EQUIPMENT_FAMILIES,filters.shopFamily),shopWeights:options(EQUIPMENT_WEIGHT_OPTIONS,filters.shopWeight)};
}
