import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {G1_CATALOG} from '../module/catalog.mjs';
import {equipmentFamily,equipmentWeight,equipmentMatches} from '../module/equipment-catalog.mjs';
import {purchasePlan,startingResources,walletValue,quickEquipmentPlan} from '../module/equipment-workflow.mjs';
import {armorWeightLabel,carriedWeight,loadStatus} from '../module/equipment-logic.mjs';
import {enqueueRoll} from '../module/roll-workflow.mjs';

function fixture(){
 const items=new Map();
 const doc=(row,index)=>({...row,id:row._id??String(index),_id:row._id??String(index),toObject(){const {toObject,update,...data}=this;return structuredClone(data);},async update(changes){for(const [key,value] of Object.entries(changes)){const parts=key.split('.');let obj=this;for(const part of parts.slice(0,-1))obj=obj[part];obj[parts.at(-1)]=value;}}});
 items[Symbol.iterator]=function*(){yield* this.values();};
 items.find=predicate=>[...items].find(predicate);
 for(const [index,row] of startingResources().entries())items.set(String(index),doc(row,index));
 const flags={};
 const actor={uuid:'Actor.shop',type:'character',items,system:{level:1,attributes:{forca:1,destreza:2,inteligencia:1,agilidade:0,vigor:0},practices:{armas_conjuracao:1},skills:['armas-leves']},
  getFlag(ns,key){return flags[key];},testUserPermission(){return true;},async update(changes){
   for(const [index,row] of (changes.items??[]).entries())items.set(row._id??'new-'+index,doc(row,index));
   for(const [key,value] of Object.entries(changes))if(key.startsWith('flags.'))flags[key.split('.').at(-1)]=value;
  }};
 return actor;
}
test('catálogo Foundry é idêntico à origem oficial e filtros não alteram carga ou preço',()=>{
 const rows=JSON.parse(readFileSync(new URL('../../prototipo-ficha/catalog.js',import.meta.url),'utf8').match(/=\s*(\[[\s\S]*\]);?\s*$/)[1]);
 assert.deepEqual(G1_CATALOG,rows);
 const sword=rows.find(r=>r.name==='Espada Curta'),saved=structuredClone(sword);
 assert.equal(equipmentFamily(sword),'espadas');assert.equal(equipmentWeight(sword),'leve');
 assert(equipmentMatches(sword,'espadas','leve'));assert(!equipmentMatches(sword,'martelos','leve'));
 assert.deepEqual(sword,saved);
 assert.equal(equipmentWeight({category:'muito-pesado'}),'extremo');
 assert(!equipmentMatches({category:'pendente'},'all','leve'));
 assert.equal(rows.find(r=>r.name==='Escudo Médio').integrity.max,3);
});
test('compra debita VT exato, respeita quantidades e rejeita saldo insuficiente e preços pendentes',()=>{
 const actor=fixture();assert.equal(walletValue(actor),20);
 const plan=purchasePlan(actor,{id:'compra-001',name:'Espada Curta',quantity:2});
 assert.deepEqual([plan.entry.total,plan.entry.balanceAfter,plan.items.at(-1).system.quantity],[4,16,2]);
 assert.equal(walletValue(actor),20);
 assert.throws(()=>purchasePlan(actor,{id:'compra-002',name:'Espada Curta',quantity:99}),/insuficientes/);
 for(const name of ['Katana','Foco de Magia Leve G1'])assert.throws(()=>purchasePlan(actor,{id:'compra-003',name,quantity:1}),/pendente/);
});
test('fila do Narrador impede compra duplicada, preserva saldo e valida dono e pendência',async()=>{
 const actor=fixture(),user={id:'player'},game={user:{id:'gm',isActiveGM:true}};
 const request={action:'purchase',id:'compra-004',name:'Espada Curta',quantity:1};
 await Promise.all([enqueueRoll(actor,user,request,{game}),enqueueRoll(actor,user,request,{game})]);
 assert.equal(walletValue(actor),18);assert.equal(actor.getFlag('', 'purchases').length,1);
 assert.equal([...actor.items].filter(i=>i.name==='Espada Curta').length,1);
 actor.getFlag=(ns,key)=>key==='pendingRoll'?{id:'pending'}:[];
 await assert.rejects(enqueueRoll(actor,user,{...request,id:'compra-005'},{game}),/Finalize/);
 actor.testUserPermission=()=>false;
 await assert.rejects(enqueueRoll(actor,user,{...request,id:'compra-006'},{game}),/permissão/);
});
test('atalho mantém Atributo e DE, habilita um dado e separa armas, foco e proteção',()=>{
 const actor=fixture();
 const item={id:'sword',system:{...G1_CATALOG.find(r=>r.name==='Espada Curta'),equipped:true}};actor.items.set('sword',item);
 const plan=quickEquipmentPlan(actor,'sword',{base:{group:'attribute',key:'forca'}},{de:7,situation:'advantage'});
 assert.equal(plan.selection.second.key,'forca');assert.equal(plan.options.de,7);assert.equal(plan.options.equipmentId,'sword');
 assert.equal(quickEquipmentPlan(actor,'sword').selection.second.key,'destreza');
 actor.system.skills=[];assert.throws(()=>quickEquipmentPlan(actor,'sword'),/Perícia/);
 actor.system.skills=['criar-item-foco-magia'];item.system={kind:'focus',equipped:true,die:6,grade:1,category:'leve'};
 assert.equal(quickEquipmentPlan(actor,'sword').selection.second.key,'inteligencia');
 actor.system.practices.armas_conjuracao=0;assert.throws(()=>quickEquipmentPlan(actor,'sword'),/Disciplina/);
 item.system.kind='armor';assert.throws(()=>quickEquipmentPlan(actor,'sword'),/fonte de ataque/);
 item.system.equipped=false;assert.throws(()=>quickEquipmentPlan(actor,'sword'),/Equipe/);
});
test('alterações de integridade, munição e equipado usam updates parciais e validam limites',async()=>{
 const actor=fixture(),row=startingResources()[0];
 const item={id:'custom',type:'equipment',system:{...row.system,kind:'shield',integrity:{value:3,max:3},ammo:{value:4,max:10},description:'Personalizado'},
  async update(changes){this.changes=changes;}};
 actor.items.set('custom',item);
 const user={id:'player'},game={user:{isActiveGM:true}};
 for(const [path,value] of [['integrity.value',2],['ammo.value',3],['equipped',true]]){
  await enqueueRoll(actor,user,{action:'equipment',itemId:'custom',path,value},{game});
  assert.deepEqual(item.changes,{['system.'+path]:value});
  assert.equal(item.system.description,'Personalizado');
 }
 await assert.rejects(enqueueRoll(actor,user,{action:'equipment',itemId:'custom',path:'ammo.value',value:11},{game}),/máximo/);
});

test("a prévia debita o peso real dos recursos selecionados e sinaliza o limite sem bloquear a compra",async()=>{
 const actor=fixture(),gm={id:'gm',isGM:true},game={user:{...gm,isActiveGM:true}};
 actor.items.get('0').system.weight=.05;
 const request={action:'purchase',id:'compra-007',name:'Espada Curta',quantity:5,preferredResource:'ervas'};
 const {load,entry}=purchasePlan(actor,request);
 assert.deepEqual(entry.spent.map(row=>row.quantity),[4,4,2]);
 assert.ok(Math.abs(load.before-.4)<1e-12);
 assert.equal(load.added,.625);
 assert.ok(Math.abs(load.spent-.275)<1e-12);
 assert.ok(Math.abs(load.used-.75)<1e-12);
 assert.equal(load.percent,75);
 assert.equal(load.balance,'Pesado');
 assert.equal(load.warning,true);
 assert.equal(load.overloaded,false);
 assert.equal(loadStatus(actor.system,1).balance,'Muito Pesado');
 assert.equal(loadStatus(actor.system,1).overloaded,false);
 assert.equal(loadStatus(actor.system,1.0125).overloaded,true);
 actor.items.get('0').system.weight=.06;
 await assert.rejects(enqueueRoll(actor,gm,{...request,expectedLoad:JSON.stringify(load)},{game}),/mudou/);
 assert.equal(walletValue(actor),20);
 await enqueueRoll(actor,gm,{...request,expectedLoad:JSON.stringify(purchasePlan(actor,request).load)},{game});
 assert.equal(walletValue(actor),10);
});

test("o Narrador adiciona VT a um recurso existente ou novo sem duplicar operações",async()=>{
 const actor=fixture(),gm={id:'gm',isGM:true},game={user:{...gm,isActiveGM:true}};
 const grant={action:'grantVT',id:'grant-001',resource:'ervas',quantity:3};
 await Promise.all([enqueueRoll(actor,gm,grant,{game}),enqueueRoll(actor,gm,grant,{game})]);
 assert.equal(actor.items.get('0').system.quantity,7);
 actor.items.delete('4');
 await enqueueRoll(actor,gm,{...grant,id:'grant-002',resource:'minerios',quantity:2},{game});
 assert.equal(walletValue(actor),21);
 assert.equal([...actor.items].find(item=>item.name==='Minérios').system.weight,.0125);
 await assert.rejects(enqueueRoll(actor,{id:'player'},{...grant,id:'grant-003'},{game}),/Narrador/);
 await assert.rejects(enqueueRoll(actor,gm,{...grant,id:'grant-004',quantity:0},{game}),/inteira positiva/);
});

test("a armadura equipada define o peso tático, independentemente do peso na mochila",()=>{
 const actor=fixture();
 const armor={id:'armor',type:'equipment',system:{kind:'armor',category:'pesado',weight:1,equipped:true}};
 actor.items.set(armor.id,armor);
 assert.equal(armorWeightLabel(actor),'Pesada');
 assert.equal(carriedWeight(actor),1.25);
 armor.system.equipped=false;
 assert.equal(armorWeightLabel(actor),'Sem armadura');
 assert.equal(carriedWeight(actor),1.25);
});
