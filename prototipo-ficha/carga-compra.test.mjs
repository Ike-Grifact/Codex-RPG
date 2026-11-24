import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const app=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const html=readFileSync(new URL("./index.html",import.meta.url),"utf8");
const start=app.indexOf("function capacity(){");
const end=app.indexOf("function loadBlocksMarkup(){",start);
assert.ok(start>0&&end>start,"Funções de capacidade e prévia não encontradas");
const fragment=app.slice(start,end);
const catalog=JSON.parse(readFileSync(new URL("./catalog.js",import.meta.url),"utf8").match(/=\s*(\[[\s\S]*\]);?\s*$/)[1]);
const ammoHelpers=app.slice(app.indexOf("function ammoTypesFor("),app.indexOf("function chooseAmmoMix("));
const purchaseHelpers=app.slice(app.indexOf("function catalogPurchaseRows("),app.indexOf("function refillAmmo("));
const WEIGHTS={muito_leve:["Muito leve",.0125],leve:["Leve",.125],medio:["Médio",.5],alto:["Pesado",1],extremo:["Extremo",2]};
const item=(weight="medio")=>({weight,qty:1,properties:[],type:"arma"});
const sumWallet=s=>Object.values(s.trade.resources).reduce((n,v)=>n+v,0);
function loadUI(s){
 const walletValue=()=>sumWallet(s),resourceWeight=()=>walletValue()/10*WEIGHTS.leve[1];
 const normalizedCatalogItem=entry=>({...item(({leve:"leve",medio:"medio",pesado:"alto","muito-leve":"muito_leve"})[entry.category]||"leve"),ammoRole:entry.ammoRole,ammoLotWeight:entry.ammoLotWeight,ammoMix:entry.ammoMix});
 const pad=n=>String(Number(n.toFixed(4)));
 return new Function("state","NPC_MODE","WEIGHTS","resourceWeight","walletValue","normalizedCatalogItem","pad","CATALOG",
  ammoHelpers+"\n"+purchaseHelpers+"\n"+fragment+"\nreturn {capacity,itemLoad,loadUsed,loadPercent,balance,balanceForPercent,purchaseLoadPreview,purchaseLoadMarkup};")(
  s,false,WEIGHTS,resourceWeight,walletValue,normalizedCatalogItem,pad,catalog);
}
const character=(forca,vigor,atletismo,disciplina=0,resources=20,items=[])=>({
 attributes:{forca,vigor},practices:{atletismo,armas_conjuracao:disciplina},items,trade:{resources:{ervas:resources}}
});

test("v0.92 soma FOR + VIG + ATL antes do piso e exclui Disciplina",()=>{
 for(const [forca,vigor,atletismo,disciplina,expected] of [
  [0,0,0,0,1],[1,1,0,6,1],[1,1,1,6,2],[2,1,1,6,2],[3,3,3,6,4],[6,6,6,6,7]
 ]){
  assert.equal(loadUI(character(forca,vigor,atletismo,disciplina)).capacity(),expected);
 }
});

test("prévia desconta exatamente os VT consumidos e não muda a ficha",()=>{
 const s=character(2,1,1,6);
 const old=JSON.stringify(s),ui=loadUI(s);
 const preview=ui.purchaseLoadPreview({category:"medio"},8);
 assert.equal(preview.current,0.25);
 assert.equal(preview.added,0.5);
 assert.equal(preview.released,0.1);
 assert.equal(preview.after,0.65);
 assert.equal(preview.percent,32.5);
 assert.equal(preview.balance,"Leve");
 assert.equal(preview.status,"normal");
 assert.equal(JSON.stringify(s),old,"Prévia não pode efetuar uma compra");
});

test("prévia avisa exatamente em 75% e 100%, mas não bloqueia compra",()=>{
 const heavy=loadUI(character(2,1,1,0,4,[item(),item()])).purchaseLoadPreview({category:"medio"},4);
 assert.ok(Math.abs(heavy.percent-75)<1e-8);
 assert.equal(heavy.status,"heavy");assert.equal(heavy.balance,"Pesado");
 assert.match(loadUI(character(2,1,1,0,4,[item(),item()])).purchaseLoadMarkup(heavy),/Atenção: ficará Pesado/);
 const full=loadUI(character(0,0,0,0,0,[item()])).purchaseLoadPreview({category:"medio"},0);
 assert.equal(full.percent,100);
 assert.equal(full.status,"over");
 assert.equal(full.balance,"Muito Pesado");
 const over=loadUI(character(0,0,0,0,20,[item()])).purchaseLoadPreview({category:"medio"},8);
 assert.ok(over.percent>100);
 assert.equal(over.status,"over");
 assert.match(loadUI(character(0,0,0,0,20,[item()])).purchaseLoadMarkup(over),/sobrepeso/);
});

test("criador e mercado exibem alerta antes de confirmar, inclusive na revisão",()=>{
 for(const str of ["purchaseLoadPreview(it,price)","purchaseLoadMarkup(preview)",
  "renderPurchaseLoadPreview()","case \"wizard-buy-item\"","case \"trade-buy\"",
  "Revisão de carga: ","Carga após compra: ","el.id===\"shop-items\""]){
  assert.ok(app.includes(str),"Prévia ausente: "+str);
 }
 assert.ok(html.includes('id="trade-purchase-load"'),"Prévia de compra não existe na ficha");
 assert.ok(app.includes("const preview=purchaseLoadPreview(item,price);"),"Confirmação sem recálculo");
 assert.ok(!app.includes("Math.floor((state.practices.armas_conjuracao||0)/3)"),"Disciplina ainda soma carga");
});


test("Kit de arco curto: prévia soma arma, recipiente e lote, desconta VT uma vez",()=>{
 const s=character(0,0,0),ui=loadUI(s),w=catalog.find(x=>x.name==="Arco Curto");
 const old=JSON.stringify(s),preview=ui.purchaseLoadPreview(w,w.kitPriceVT);
 assert.ok(Math.abs(preview.added-(.125+.125+.0125))<1e-9);
 assert.ok(Math.abs(preview.released-.175)<1e-9);
 assert.equal(JSON.stringify(s),old);
});
