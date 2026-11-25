import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {blank,normalize,stats,equippedArmor,armorDeModifier,canEquipArmor,itemCategory} from "./rules.mjs";

const src=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const npcSrc=readFileSync(new URL("../prototipo-ficha/app.js",import.meta.url),"utf8");

function humanoid(){
 const t=blank("humanoide");
 t.attributes.agilidade=1;t.attributes.vigor=1;t.attributes.destreza=1;
 return t;
}

test("Armadura Muito Leve: migração de 3 para 2 de Integridade, sem redução de DE",()=>{
 const t=humanoid(),base=stats(t).de;
 t.items=[{id:"a",name:"Roupas Simples",kind:"armor",category:"muito-leve",
  weight:.125,qty:1,grade:1,integrityMax:3,integrity:2,equipped:false}];
 assert.equal(stats(t).de,base,"guardada não concede bônus");
 t.items[0].equipped=true;
 assert.equal(armorDeModifier(t),0);
 assert.equal(stats(t).de,base);
 assert.equal(equippedArmor(t)?.integrity,2,"dano já recebido é mantido");
 const saved=normalize(JSON.parse(JSON.stringify(t)));
 assert.equal(saved.items[0].integrity,1);
 assert.equal(saved.items[0].integrityMax,2);
 assert.equal(saved.items[0].equipped,true);
 assert.equal(stats(saved).de,base);
 assert.equal(saved.life,t.life,"a Integridade não modifica Vida automaticamente");
});

test("Somente a categoria da única armadura equipada modifica a DE",()=>{
 const t=humanoid(),base=stats(t).de;
 for(const [category,modifier] of [["muito-leve",0],["leve",-1],["medio",-2],["pesado",-3]]){
  t.items=[{id:"a",name:"Peça",kind:"armor",category,grade:1,
   weight:.125,qty:1,integrityMax:12,integrity:6,equipped:true}];
  assert.equal(stats(t).de,Math.max(0,base+modifier),category);
 }
});

test("Importação legada e item da ficha do jogador mantêm a armadura",()=>{
 const t=humanoid();
 t.items=[{id:"legacy",name:"Armadura Leve",type:"armadura",weight:"leve",
  grade:1,max:7,hp:4,qty:1,equipped:true}];
 const imported=normalize(t),armor=equippedArmor(imported);
 assert.ok(armor);
 assert.equal(armor.kind,"armor");
 assert.equal(armor.category,"leve");
 assert.equal(armor.integrity,2);
 assert.equal(armor.integrityMax,5);
 assert.equal(armor.equipped,true);
 assert.equal(itemCategory({name:"Roupas Simples"}),"muito-leve","armaduras antigas ainda são reconhecidas");
});

test("Restrições de armadura do humanoide são preservadas",()=>{
 const t=humanoid(),a={kind:"armor",category:"pesado",grade:2};
 assert.equal(canEquipArmor(t,a),false,"G2 exige nível 5");
 t.level=5;assert.equal(canEquipArmor(t,a),true);
 t.race="runa_espinhos";assert.equal(canEquipArmor(t,a),false,"Runa Espinhos não veste armadura física");
 t.race="humano";t.level=20;
 const extreme={kind:"armor",category:"muito-pesado",grade:4};
 assert.equal(canEquipArmor(t,extreme),false,"Muito Pesada exige Vigor 6 e Atletismo 6");
 t.attributes.vigor=6;t.practices.atletismo=6;
 assert.equal(canEquipArmor(t,extreme),true);
});

test("Envio do NPC transporta inventário, Integridade e equipamento",()=>{
 const begin=npcSrc.indexOf("function npcConflictItems(");
 const end=npcSrc.indexOf("\n}",begin);
 assert.ok(begin>=0&&end>begin);
 const mockState={items:[
  {id:"id1",name:"Armadura Média",type:"armadura",weight:"medio",grade:1,qty:1,max:12,hp:5,equipped:true},
  {id:"id2",name:"Escudo Leve",type:"escudo",weight:"leve",grade:1,qty:1,max:2,hp:1,equipped:true}
 ]};
 const WEIGHTS={medio:["Médio",.5],leve:["Leve",.125]};
 const helperStart=npcSrc.indexOf("function itemHands("),helperEnd=npcSrc.indexOf("function canHoldItem(",helperStart);
 assert.ok(helperStart>=0&&helperEnd>helperStart);
 const transfer=new Function("state","WEIGHTS",npcSrc.slice(helperStart,helperEnd)+npcSrc.slice(begin,end+2)+";return npcConflictItems;")(mockState,WEIGHTS);
 const exported=transfer();
 assert.equal(exported.length,2);
 assert.deepEqual(exported.map(x=>[x.kind,x.integrity,x.integrityMax,x.equipped]),
  [["armor",5,12,true],["shield",1,2,true]]);
 assert.equal(exported[1].hands,1);
 assert.equal(exported[1].position,"hands");
 mockState.items.push({id:"id3",name:"Arco longo",type:"arma",weight:"medio",grade:1,qty:1,max:0,hp:0,equipped:false,position:"quick",hands:2,die:10,range:12,properties:["À Distância"]});
 const weapon=transfer()[2];
 assert.equal(weapon.hands,2);assert.equal(weapon.position,"quick");assert.equal(weapon.die,10);
 const creature=humanoid();
 creature.items=transfer();
 const received=normalize(creature);
 assert.equal(equippedArmor(received).integrity,1);
 assert.equal(received.items[2].hands,2);assert.equal(received.items[2].position,"quick");
 assert.ok(npcSrc.includes("items:npcConflictItems()"),"envio real não usa lista vazia");
});

test("Modo Rolagem e Edição expõem controle de Integridade e equipar",()=>{
 assert.match(src,/function armorPanel\(t\)/);
 assert.match(src,/armorPanel\(t\)\+inventory\(t,x\)/);
 assert.match(src,/armorPanel\(t\)\+'<div class="cf-roll-layout"/);
 assert.match(src,/data-integrity-set/);
 assert.match(src,/data-equip-item/);
 assert.match(src,/function toggleEquipment\(id\)/);
 assert.match(src,/XP adicional \(15 iniciais\)/);
 assert.doesNotMatch(src,/Muito Leve 0, Leve 7/);
});
