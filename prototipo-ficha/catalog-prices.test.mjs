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
 assert.ok(siteCatalog.length>foundryCatalog.length,"Itens exclusivos do site devem permanecer intactos");
});

test("v0.65: armas G1 com uma característica têm VT de playtest ajustado",()=>{
 const expected={
  "Faca":2,"Punhal":2,"Espada Curta":2,"Maça Curta":2,"Chicote":2,
  "Espada Larga":4,"Lança de Arremesso":4,
  "Martelo de Guerra":7,"Marreta":7,
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
 for(const name of ["Bastão Leve","Bastão Médio","Bastão Pesado","Cajado Leve","Cajado Médio","Cajado Pesado","Luvas","Cetro Médio G1"]){
  assert.equal(byName(name).priceVT,null,name+" continua pendente");
 }
 assert.deepEqual(byName("Espada Longa").properties,["Perfurante","Cortante"]);
 assert.equal(byName("Lança de Arremesso").range,8);
 assert.equal(byName("Espada Larga").die,10);
});
