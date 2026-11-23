import {sourceDice} from './rules.mjs';

export function druidicOptions(system){
 return system.skills?.includes('pericia-druidica')?['pequena','media','grande']:[];
}
export function animalTransformationPlan(system,{size,attributes},available=system.courage){
 if(!druidicOptions(system).includes(size))throw Error('Forma Druídica não habilitada.');
 const amount={pequena:1,media:2,grande:3}[size];
 if(!Array.isArray(attributes)||attributes.length!==amount||new Set(attributes).size!==amount)throw Error('Escolha '+amount+' Atributos distintos.');
 if(size==='pequena'&&attributes.includes('vigor'))throw Error('Forma Pequena não eleva Vigor.');
 // A v1.0 aprova explicitamente esta composição. As outras são registradas para adjudicação.
 const enhancedAttributes=attributes.filter(key=>JSON.stringify(sourceDice('attribute',key,{...system,transformation:{}}))===JSON.stringify([6,6,10]));
 const pendingAttributes=attributes.filter(key=>!enhancedAttributes.includes(key));
 const courage=size==='pequena'?0:1;
 if(available<courage)throw Error('Coragem insuficiente para transformar.');
 return {courage,state:{kind:'animal',size,attributes,enhancedAttributes,pendingAttributes,lifePending:attributes.includes('vigor'),lifeAtStart:system.life?.value??0}};
}
export function elementalDuration(e,p){
 if(![e,p].every(n=>Number.isFinite(n)&&n>=0))throw Error('Informe símbolos válidos.');
 return {duration:e-p,sustained:e-p>0};
}
export function elementalDamage({element,attackElement,immune=false,resistant=false,e,p}){
 if(![e,p].every(n=>Number.isFinite(n)&&n>=0))throw Error('Informe símbolos válidos.');
 if(element!==attackElement)return e+Math.floor(p/2);
 return immune?0:resistant?e/2:e+Math.floor(p/2);
}
