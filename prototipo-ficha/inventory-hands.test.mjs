import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const app=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const html=readFileSync(new URL("./index.html",import.meta.url),"utf8");
const catalog=JSON.parse(readFileSync(new URL("./catalog.js",import.meta.url),"utf8").match(/=\s*(\[[\s\S]*\]);?\s*$/)[1]);
const rules=app.slice(app.indexOf("function itemHands("),app.indexOf("function normalizeItem("));
const panel=app.slice(app.indexOf("function handLayout("),app.indexOf("function renderInventory("));
function setup(items=[]){
 const state={items},messages=[];
 const ui=new Function("state","toast","validBodyChange","esc",rules+panel+";return {itemHands,canHoldItem,setItemPosition,handLayout,handPanelMarkup};")(state,x=>messages.push(x),()=>true,String);
 return {...ui,state,messages};
}
test("Catálogo e fichas legadas inferem mãos sem escolha manual",()=>{
 const u=setup();
 for(const it of catalog.filter(x=>["weapon","firearm","shield"].includes(x.kind))){
  const n=it.kind==="shield"?1:/arco (curto|longo)|besta pesada|duas mãos/i.test(it.name)?2:it.category==="pesado"?2:1;
  assert.equal(it.hands,n,it.name);
  assert.equal(u.itemHands({...it,type:it.kind==="shield"?"escudo":"arma",hands:0}),n,it.name);
 }
});
test("Duas mãos, escudos, armas pesadas e acesso rápido",()=>{
 const light={id:"a",name:"Espada Curta",type:"arma",weight:"leve",qty:1};
 const shield={id:"b",name:"Escudo Pesado",type:"escudo",weight:"alto",qty:1};
 const heavy={id:"c",name:"Montante",type:"arma",weight:"alto",qty:1};
 const u=setup([light,shield,heavy]);
 assert.equal(u.handLayout(u.state.items).free,2);
 assert.ok(u.setItemPosition(light,"hands"));
 assert.equal(u.handLayout(u.state.items).free,1);
 assert.ok(u.setItemPosition(shield,"hands"));
 assert.equal(u.setItemPosition(heavy,"hands"),false);
 assert.ok(u.setItemPosition(light,"quick"));
 assert.ok(u.handPanelMarkup().includes("Puxar para as mãos"));
 assert.ok(u.setItemPosition(shield,"bag"));
 assert.ok(u.setItemPosition(heavy,"hands"));
 assert.equal(u.handLayout(u.state.items).slots.length,2);
 assert.equal(u.handLayout(u.state.items).slots[1].continuation,true);
 assert.equal(u.setItemPosition(light,"hands"),false);
 assert.ok(u.setItemPosition(heavy,"quick"));
 assert.ok(u.setItemPosition(light,"hands"));
 assert.ok(u.setItemPosition(shield,"hands"));
 assert.equal(u.handLayout(u.state.items).free,0);
});
test("Painel e compra com empunhadura disponíveis no criador e mercado",()=>{
 assert.match(html,/id="inventory-hands"/);
 assert.match(html,/data-action="trade-buy-equip"/);
 assert.match(app,/data-action="wizard-buy-equip"/);
 assert.match(app,/case "inventory-position"/);
});
