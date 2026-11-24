import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import {G1_CATALOG as foundryCatalog} from "../foundry-prototype/module/catalog.mjs";

const browserContext={window:{}};
runInNewContext(readFileSync(new URL("./catalog.js",import.meta.url),"utf8"),browserContext);
const siteCatalog=JSON.parse(JSON.stringify(browserContext.window.CODEX_G1_CATALOG));

const byName=name=>{
 const item=siteCatalog.find(entry=>entry.name===name);
 assert.ok(item,"Item ausente do catálogo: "+name);
 return item;
};

test("v0.65: preços e propriedades dos itens compartilhados são iguais no site e Foundry",()=>{
 for(const item of foundryCatalog){
  assert.deepEqual(byName(item.name),item,"Divergência no catálogo: "+item.name);
 }
 assert.equal(siteCatalog.length,foundryCatalog.length,"Site e Foundry devem possuir exatamente o mesmo catálogo");
});

test("v0.65: armas G1 com uma característica têm VT de playtest ajustado",()=>{
 const expected={
  "Faca":2,"Punhal":2,"Espada Curta":2,"Maça Curta":2,"Chicote":2,
  "Espada Larga":4,"Lança de Arremesso":6,
  "Martelo de Guerra":6,"Marreta":7,
  "Espada Longa":5,"Lança":5,"Machado Barbado":6,
  "Machado de Guerra":8,"Montante":9
 };
 for(const [name,price] of Object.entries(expected)){
  assert.equal(byName(name).priceVT,price,name);
 }
 for(const item of siteCatalog.filter(entry=>entry.kind==="weapon"&&entry.range===1&&entry.properties.length===1&&entry.priceVT!=null)){
  assert.ok(item.priceVT<=({leve:2,medio:4,pesado:7})[item.category],"Preço sem diferencial para "+item.name);
 }
});

test("v0.65: armas de disparo, itens defensivos e preços pendentes não são alterados",()=>{
 for(const [name,price] of [["Arco Curto",4],["Arco Longo",6],["Besta de uma mão",5],["Besta de duas mãos",6],["Besta Pesada",9],["Zarabatana",3],["Escudo Médio",5],["Armadura Média",8]]){
  assert.equal(byName(name).priceVT,price,name);
 }
 for(const name of ["Cetro Médio G1"]){
  assert.equal(byName(name).priceVT,null,name+" continua pendente");
 }
 assert.deepEqual(byName("Espada Longa").properties,["Perfurante","Cortante"]);
 assert.equal(byName("Lança de Arremesso").range,8);
 assert.equal(byName("Espada Larga").die,10);
});

test("Playtest: Martelo de Guerra Médio d10, Azagaia, cajados e bastões revisados",()=>{
 assert.deepEqual([byName("Martelo de Guerra").category,byName("Martelo de Guerra").die,byName("Martelo de Guerra").weight],["medio",10,0.5]);
 assert.deepEqual(byName("Martelo de Guerra").properties,["Perfurante","Contundente"]);
 assert.deepEqual(byName("Lança de Arremesso").properties,["Cravar","Perfurante"]);
 assert.ok(byName("Lança de Arremesso").aliases.includes("Azagaia"));
 for(const [name,vt] of [["Cajado Médio",6],["Bastão Médio",4],["Cajado Pesado",6],["Bastão Pesado",7]])assert.equal(byName(name).priceVT,vt,name);
});
test("Integridade corrigida: armaduras e escudos físicos",()=>{
 for(const [name,max] of [["Roupas Simples",2],["Armadura Leve",5],["Armadura Média",8],["Armadura Pesada",12],
  ["Escudo Leve",2],["Escudo Médio",3],["Escudo Pesado",4]]){
  assert.equal(byName(name).integrity.max,max,name);
  assert.equal(byName(name).integrity.value,max,name);
 }
});
test("Munições, porta-munições e instrumentos com os preços aprovados",()=>{
 for(const [name,vt,packSize] of [
  ["Flechas (20 unidades)",5,20],["Virotes (20 unidades)",5,20],
  ["Munição de Revólver Leve (1 unidade)",1,1],["Munição de Revólver Média (1 unidade)",1,1],["Munição de Revólver Pesada (1 unidade)",2,1]
 ]){
  const item=byName(name);assert.equal(item.kind,"ammunition");assert.equal(item.priceVT,vt);assert.equal(item.packSize,packSize);
  assert.equal(item.category,"leve");assert.equal(item.weight,0.125);
 }
 for(const name of ["Aljava","Estojo de Virotes"]){
  const item=byName(name);assert.equal(item.priceVT,5);assert.equal(item.storageCapacity,20);
 }
 assert.equal(byName("Bandoleira").priceVT,5);
 assert.equal(byName("Instrumento Musical Médio (à escolha)").priceVT,10);
 assert.equal(byName("Instrumento Musical Médio (à escolha)").category,"medio");
});
test("Focos com preço em função de B, sem conversão numérica arbitrária",()=>{
 assert.equal(byName("Varinha G1").priceFormula,"B");
 assert.equal(byName("Foco de Magia Leve G1").priceFormula,"B");
 for(const name of ["Cetro Leve G1","Cetro Médio G1","Cetro Pesado G1"]){
  const x=byName(name);
  assert.equal(x.priceVT,null);
  assert.equal(x.priceFormula,"B + VT da arma contundente equivalente");
  assert.deepEqual(x.properties,["Contundente","Elemental"]);
 }
});
test("Katana e Naginata: preço e categoria definidos, dado e mãos pendentes",()=>{
 for(const [name,reference] of [["Katana","Espada Longa"],["Naginata","Lança"]]){
  const x=byName(name);
  assert.equal(x.priceVT,byName(reference).priceVT);assert.equal(x.category,"medio");assert.equal(x.weight,0.5);
  assert.equal(x.status,"PENDENTE");assert.equal(x.die,0);assert.equal(x.hands,undefined);
 }
 assert.deepEqual(byName("Katana").properties,["Cortante","Perfurante"]);
 assert.deepEqual(byName("Naginata").properties,["Longa","Cortante"]);
 assert.equal(byName("Naginata").range,2);
 const app=readFileSync(new URL("./app.js",import.meta.url),"utf8");
 assert.ok(app.includes('item.status==="PENDENTE"'));
 const foundry=readFileSync(new URL("../foundry-prototype/module/sheet.mjs",import.meta.url),"utf8");
 assert.ok(foundry.includes('row.status==="PENDENTE"'));
});

test("Novos preços leves e instrumentos por porte aprovados",()=>{
 for(const [name,vt] of [["Cajado Leve",4],["Bastão Leve",2],["Luvas",2]])assert.equal(byName(name).priceVT,vt,name);
 for(const [name,vt,category,weight] of [["Instrumento Musical Leve (à escolha)",5,"leve",0.125],["Instrumento Musical Médio (à escolha)",10,"medio",0.5],["Instrumento Musical Grande (à escolha)",15,"pesado",1]]){
  const v=byName(name);assert.equal(v.priceVT,vt);assert.equal(v.category,category);assert.equal(v.weight,weight);
 }
});
test("Ferramentas e kits básicos são leves; kits não dão armas",()=>{
 const kits=siteCatalog.filter(x=>x.kind==="kit");assert.equal(kits.length,16);
 for(const kit of kits.filter(x=>x.name!=="Kit de Explorador")){
  assert.equal(kit.category,"leve",kit.name);assert.equal(kit.weight,0.125,kit.name);
  assert.equal(kit.priceVT,["Kit de Alquimia","Kit de Medicina","Kit de Engenharia"].includes(kit.name)?7:5,kit.name);
  assert.equal(kit.die,0,kit.name);assert.equal(kit.properties.length,0,kit.name);
 }
 const explorer=byName("Kit de Explorador");assert.equal(explorer.priceVT,9);assert.equal(explorer.category,"medio");
 assert.equal(explorer.includedItems.length,6);
 assert.equal(siteCatalog.length,99);
});
test("Aventureiro: preços proporcionais, a maioria leve",()=>{
 for(const name of ["Mochila","Bolsa de Cintura","Corda","Gancho de Escalada","Tocha","Lampião","Óleo para Lampião","Pederneira","Cantil","Ração de Viagem","Cobertor","Frasco Vazio","Bolsa de Componentes","Papel ou Pergaminho","Tinta e Pena"]){
  const item=byName(name);assert.equal(item.category,"leve",name);assert.equal(item.weight,0.125,name);assert.ok(item.priceVT>0,name);
 }
 for(const name of ["Saco de Dormir","Tenda"]){const x=byName(name);assert.equal(x.category,"medio");assert.equal(x.weight,0.5)}
 assert.equal(byName("Corda").priceVT,2);assert.equal(byName("Pederneira").priceVT,1);assert.equal(byName("Lampião").priceVT,3);
});


test("Zarabatana e dardos: somente veneno, preços e dado preservados",()=>{
 const w=byName("Zarabatana"),d=byName("Dardos de Zarabatana (20 unidades)");
 assert.deepEqual(w.properties,["À Distância","Envenenar"]);assert.deepEqual(d.properties,[]);
 assert.equal(w.die,6);assert.equal(w.priceVT,3);assert.equal(d.priceVT,2);assert.equal(d.packSize,20);assert.equal(d.category,"muito-leve");assert.equal(d.weight,.0125);
 assert.match(w.description,/sem Cortante, Perfurante, dano à Integridade/i);
 const app=readFileSync(new URL("./app.js",import.meta.url),"utf8");
 assert.ok(app.includes("const fulminanteDamageBasic=poisonOnly?0:success&&p.opts.fulminante?E+P:damageBasic;"));
 const comparator=readFileSync(new URL("../simulador-combate/app.mjs",import.meta.url),"utf8");
 assert.ok(comparator.includes("integrityDamage:g1||poisonOnly?0:"));
});


test("Kits por modelo: capacidade 20, mistura, preços e pesos de lote",()=>{
 for(const [weapon,price,weight] of [["Arco Curto",14,.0125],["Arco Longo",16,.125],["Besta de uma mão",15,.0125],["Besta de duas mãos",16,.125],["Besta Pesada",19,.125],["Zarabatana",10,.0125]]){
  const w=byName(weapon),a=byName(w.kitAmmo),q=byName(w.kitContainer);
  assert.equal(w.kitPriceVT,price);assert.equal(w.priceVT+a.priceVT+q.priceVT,price);assert.equal(a.weight,weight);assert.equal(a.packSize,20);assert.equal(q.storageCapacity,20);assert.equal(q.ammoFamily,a.ammoFamily);
 }
 const app=readFileSync(new URL("./app.js",import.meta.url),"utf8");
 const fragment=app.slice(app.indexOf("function ammoTypesFor("),app.indexOf("function chooseAmmoMix("));
 const h=new Function(fragment+"return {ammoCount,normalizeAmmoMix,moveAmmoMix};")();
 assert.equal(h.ammoCount(h.normalizeAmmoMix({Cortante:15,Perfurante:15},"arco-curto")),20);
 const r=h.moveAmmoMix({Cortante:10,Perfurante:10},{Cortante:5,Perfurante:10},["Cortante","Perfurante"]);
 assert.equal(r.moved,5);assert.equal(h.ammoCount(r.to),20);assert.equal(h.ammoCount(r.from),15);
 assert.equal(h.ammoCount(r.to)+h.ammoCount(r.from),35);
});
