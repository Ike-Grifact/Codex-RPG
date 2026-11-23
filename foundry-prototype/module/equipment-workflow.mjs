import {G1_CATALOG} from './catalog.mjs';
import {compatibleFoci,focusElement} from "./conjuration.mjs";
import {equippedDie} from './equipment-logic.mjs';

export const RESOURCE_NAMES={ervas:'Ervas',espolios:'Espólios',couro:'Couro',comida:'Comida',minerios:'Minérios'};
const ns='codex-rpg-foundry';
export const STARTING_VT=20;
export function startingResources(allocation){
 const resources=Object.entries(RESOURCE_NAMES);
 if(allocation){
  const values=resources.map(([key])=>allocation[key]);
  if(values.some(value=>!Number.isInteger(value)||value<0)||values.reduce((total,value)=>total+value,0)!==STARTING_VT)
   throw Error("Distribua exatamente "+STARTING_VT+" VT entre os cinco recursos.");
 }
 return resources.map(([key,name])=>({name,type:'equipment',system:{kind:'resource',quantity:allocation?.[key]??4,weight:.0125,priceVT:1},flags:{[ns]:{resourceKey:key}}}));
}
export function isTradeResource(item){
 return item.type==='equipment'&&item.system.kind==='resource'&&Object.entries(RESOURCE_NAMES).some(([key,name])=>
  item.flags?.[ns]?.resourceKey===key||item.name===name);
}
export function walletValue(actor){return [...actor.items].filter(isTradeResource).reduce((n,item)=>n+item.system.quantity,0);}

export function purchasePlan(actor,request){
 return purchaseItemsPlan([...actor.items].map(item=>item.toObject()),request);
}

export function purchasableEquipment(row){
 return Boolean(row&&row.kind!=='focus'&&row.category!=='pendente'&&Number.isFinite(row.priceVT)&&row.priceVT>0);
}

export function purchaseItemsPlan(inventory,request){
 if(typeof request.id!=='string'||!/^[a-zA-Z0-9-]{8,80}$/.test(request.id))throw Error('Identificador de compra inválido.');
 const quantity=request.quantity;
 if(!Number.isInteger(quantity)||quantity<1||quantity>99)throw Error('Informe quantidade de 1 a 99.');
 const row=G1_CATALOG.find(row=>row.name===request.name);
 if(!purchasableEquipment(row))throw Error('Preço ou fabricação pendente. Item indisponível para compra.');
 const total=row.priceVT*quantity;
 const balance=walletValue({items:inventory});
 if(total>balance)throw Error('Recursos insuficientes. A compra exige '+total+' VT e a ficha possui '+balance+' VT.');
 if(inventory.length>=150)throw Error('Inventário cheio.');
 const items=structuredClone(inventory);
 const resources=items.filter(isTradeResource);
 if(request.preferredResource&&Object.hasOwn(RESOURCE_NAMES,request.preferredResource)){
  const preferred=resources.findIndex(item=>item.flags?.[ns]?.resourceKey===request.preferredResource||
   item.name===RESOURCE_NAMES[request.preferredResource]);
  if(preferred>0)resources.unshift(...resources.splice(preferred,1));
 }
 let due=total;
 const spent=[];
 for(const item of resources){
  const used=Math.min(item.system.quantity,due);
  item.system.quantity-=used;due-=used;
  if(used)spent.push({itemId:item._id,name:item.name,quantity:used});
 }
 const {name,...system}=structuredClone(row);
 items.push({name,type:'equipment',system:{...system,quantity,equipped:false,catalogId:name,
  ammo:{value:row.packSize??0,max:row.packSize??0,reload:0,cartucho:''}}});
 return {items,entry:{id:request.id,name,quantity,unitPrice:row.priceVT,total,spent,balanceBefore:balance,balanceAfter:balance-total}};
}

export function preferredQuickAttribute(system,item,selection){
 const selected=[selection.second,selection.base,selection.complement].find(source=>source?.group==='attribute'&&system.attributes[source.key]>0);
 if(selected)return selected.key;
 if(item.system.kind==='focus'&&system.attributes.inteligencia>0)return 'inteligencia';
 const priority=['destreza','forca','agilidade','vigor','inteligencia','influencia'];
 return priority.filter(key=>system.attributes[key]>0).sort((a,b)=>system.attributes[b]-system.attributes[a])[0];
}
export function quickEquipmentPlan(actor,id,selection={},options={}){
 const item=actor.items.get(id);
 if(!item||(item.system.kind!=='focus'&&!item.system.equipped))throw Error('Equipe a arma antes de rolar.');
 const mode=item.system.kind==='focus'?'conjuracao':'armas';
 if(!['weapon','firearm','focus'].includes(item.system.kind))throw Error('Este equipamento não é fonte de ataque.');
 const enabled=mode==="conjuracao"?compatibleFoci(actor,focusElement(item)).some(focus=>focus.id===id):equippedDie(actor,item,mode);
 if(!enabled)throw Error('O equipamento exige a Perícia de manejo ou foco pertinente e Grau permitido.');
 if(!(actor.system.practices.armas_conjuracao>0))throw Error('A rolagem pelo equipamento exige Disciplina treinada.');
 const attribute=preferredQuickAttribute(actor.system,item,selection);
 if(!attribute)throw Error('Selecione um Atributo treinado para combinar com Disciplina.');
 return {selection:{base:{group:'practice',key:'armas_conjuracao'},second:{group:'attribute',key:attribute},complement:null},
  options:{...options,mode,equipmentId:id,step:false,stepDieId:'',extraKeep:false,contextApproved:false,combatBonus:false}};
}
