import {G1_CATALOG} from './catalog.mjs';
import {equipmentFamily,equipmentWeight,equipmentGroupName,equipmentWeightName,equipmentMatches,EQUIPMENT_FAMILIES,EQUIPMENT_WEIGHT_OPTIONS} from './equipment-catalog.mjs';
import {equippedDie,effectiveWeaponRange} from './equipment-logic.mjs';
import {walletValue} from './equipment-workflow.mjs';
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
 const options=(rows,value)=>rows.map(([id,label])=>({id,label,selected:id===value}));
 const shop=G1_CATALOG.filter(row=>equipmentMatches(row,filters.shopFamily,filters.shopWeight)).map(row=>({
  ...rowView(row.name,row,row.name),canBuy:row.kind!=='focus'&&row.category!=='pendente'&&Number.isFinite(row.priceVT)&&row.priceVT>0,
  price:row.priceVT??'Pendente',canAfford:Number.isFinite(row.priceVT)&&row.priceVT<=walletValue(actor)}));
 const inventory=[...actor.items].filter(i=>i.type==='equipment'&&equipmentMatches({name:i.name,...i.system},filters.family,filters.weight));
 inventory.sort((a,b)=>{
  const family=i=>EQUIPMENT_FAMILIES.findIndex(([id])=>id===equipmentFamily({name:i.name,...i.system}));
  const weight=i=>EQUIPMENT_WEIGHT_OPTIONS.findIndex(([id])=>id===equipmentWeight(i.system));
  return family(a)-family(b)||weight(a)-weight(b)||a.name.localeCompare(b.name,'pt-BR');
 });
 let previous='';
 const gear=inventory.map(item=>{
  const s=item.system,row=rowView(item.name,s,item.id),group=row.family+' · '+row.weightName;
  const result={...row,embeddedMedium:s.embeddedWeapon==='medio',embeddedHeavy:s.embeddedWeapon==='pesado',groupTitle:group!==previous?group:null,range:effectiveWeaponRange(actor.system,s)||s.range,
   enabledDie:equippedDie(actor,item,s.kind==='focus'?'conjuracao':'armas')};
  previous=group;
  return result;
 });
 const repertoire=[...actor.items].filter(i=>i.type==='equipment'&&['weapon','firearm','focus','armor','shield'].includes(i.system.kind)).map(item=>({
  ...rowView(item.name,item.system,item.id),range:effectiveWeaponRange(actor.system,item.system)||item.system.range,
  enabledDie:equippedDie(actor,item,item.system.kind==='focus'?'conjuracao':'armas')}));
 return {balance:walletValue(actor),shop,gear,repertoire,
  families:options(EQUIPMENT_FAMILIES,filters.family),weights:options(EQUIPMENT_WEIGHT_OPTIONS,filters.weight),
  shopFamilies:options(EQUIPMENT_FAMILIES,filters.shopFamily),shopWeights:options(EQUIPMENT_WEIGHT_OPTIONS,filters.shopWeight)};
}
