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
const WEIGHTS=new Function(app.match(/const WEIGHTS=\{[^\n]+\};/)[0]+"return WEIGHTS;")();
const ammoLotLoad=new Function(app.match(/const ammoLotLoad=[^\n]+;/)[0]+"return ammoLotLoad;")();
const item=(weight="medio")=>({weight,qty:1,properties:[],type:"arma"});
const sumWallet=s=>Object.values(s.trade.resources).reduce((n,v)=>n+v,0);
function loadUI(s){
 const walletValue=()=>sumWallet(s),resourceWeight=()=>walletValue()/10*WEIGHTS.leve[1];
 const normalizedCatalogItem=entry=>({...item(({leve:"leve",medio:"medio",pesado:"alto","muito-leve":"muito_leve"})[entry.category]||"leve"),ammoRole:entry.ammoRole,ammoLotWeight:entry.ammoLotWeight,ammoMix:entry.ammoMix});
 const pad=n=>String(Number(n.toFixed(4)));
 return new Function("state","NPC_MODE","WEIGHTS","resourceWeight","walletValue","normalizedCatalogItem","pad","CATALOG","ammoLotLoad",
  ammoHelpers+"\n"+purchaseHelpers+"\n"+fragment+"\nreturn {capacity,itemLoad,loadUsed,loadPercent,balance,loadStatus,purchaseLoadPreview,purchaseLoadMarkup};")(
  s,false,WEIGHTS,resourceWeight,walletValue,normalizedCatalogItem,pad,catalog,ammoLotLoad);
}
const character=(forca,vigor,atletismo,disciplina=0,resources=20,items=[])=>({
 attributes:{forca,vigor},practices:{atletismo,armas_conjuracao:disciplina},items,trade:{resources:{ervas:resources}}
});

test("v0.154: FOR integral + metade de VIG; exclui Práticas",()=>{
 for(const [forca,vigor,atletismo,disciplina,expected] of [
  [0,0,0,0,8],[1,1,0,6,9],[1,1,1,6,9],[2,1,1,6,10],[3,3,3,6,12],[6,6,6,6,17]
 ]){
  assert.equal(loadUI(character(forca,vigor,atletismo,disciplina)).capacity(),expected);
 }
});

test("prévia desconta exatamente os VT consumidos e não muda a ficha",()=>{
 const s=character(2,1,1,6);
 const old=JSON.stringify(s),ui=loadUI(s);
 const preview=ui.purchaseLoadPreview({category:"medio"},8);
 assert.equal(preview.current,2);
 assert.equal(preview.added,2);
 assert.equal(preview.released,0.8);
 assert.equal(preview.after,3.2);
 assert.ok(Math.abs(preview.percent-100*3.2/10)<1e-8);
 assert.equal(preview.balance,"Dentro da capacidade");
 assert.equal(preview.status,"normal");
 assert.equal(JSON.stringify(s),old,"Prévia não pode efetuar uma compra");
});

test("prévia não classifica peso pela ocupação e avisa sobrecarga em 100%",()=>{
 const heavy=loadUI(character(1,0,1,0,4,[item(),{...item("leve"),qty:2},{...item("muito_leve"),qty:1}])).purchaseLoadPreview({category:"medio"},4);
 assert.ok(Math.abs(heavy.percent-(100*6.5/9))<1e-8);
 assert.equal(heavy.status,"normal");assert.equal(heavy.balance,"Dentro da capacidade");
 assert.match(loadUI(character(1,0,1,0,4,[item(),{...item("leve"),qty:2},{...item("muito_leve"),qty:1}])).purchaseLoadMarkup(heavy),/dentro da capacidade total/);
 const full=loadUI(character(0,0,0,0,0,[item(),item(),item()])).purchaseLoadPreview({category:"medio"},0);
 assert.equal(full.percent,100);
 assert.equal(full.status,"over");
 assert.equal(full.balance,"Sobrecarga");
 const over=loadUI(character(0,0,0,0,20,[item(),item(),item()])).purchaseLoadPreview({category:"medio"},8);
 assert.ok(over.percent>100);
 assert.equal(over.status,"over");
 assert.match(loadUI(character(0,0,0,0,20,[item()])).purchaseLoadMarkup(over),/sobrecarga/);
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
 assert.ok(Math.abs(preview.added-(1+1+.5))<1e-9);
 assert.ok(Math.abs(preview.released-1.4)<1e-9);
 assert.equal(JSON.stringify(s),old);
});


test("Sobrecarga: metade do deslocamento em 100%, recupera abaixo de 100%",()=>{
 const code=app.slice(app.indexOf("function baseMovement("),app.indexOf("function renderXP("));
 const state=character(0,0,3,0,0,[]);state.attributes.agilidade=2;state.attributes.destreza=2;
 let percent=99.99;
 const ui=new Function("state","NPC_MODE","loadPercent",code+"return {movement,baseMovement};")(state,false,()=>percent);
 assert.equal(ui.baseMovement(),10);assert.equal(ui.movement(),10);percent=100;assert.equal(ui.movement(),5);percent=125;assert.equal(ui.movement(),5);percent=99;assert.equal(ui.movement(),10);
 const npc=new Function("state","NPC_MODE","loadPercent",code+"return movement;")(state,true,()=>100);assert.equal(npc(),10);
 state.attributes.agilidade=2;state.attributes.destreza=1;assert.equal(ui.baseMovement(),9);
 state.attributes.agilidade=1;state.attributes.destreza=2;assert.equal(ui.baseMovement(),9);
 state.attributes.agilidade=6;state.attributes.destreza=6;assert.equal(ui.baseMovement(),14);
});

 test("peso por armadura ou linhagem independe da ocupação",()=>{
 const src=app.slice(app.indexOf("function balance(){"),app.indexOf("// A prévia subtrai"));
 const get=(state,armor)=>new Function("state","NPC_MODE","equippedArmor",src+"return balance();")(state,false,()=>armor);
 assert.equal(get({race:"humano"},{weight:"leve"}),"Leve");
 assert.equal(get({race:"humano"},{weight:"medio"}),"Médio");
 assert.equal(get({race:"runa_espinhos"},null),"Pesado");
 assert.equal(get({race:"humano"},null),"Sem armadura");
 });

test("Rótulo de categoria Pesado não se confunde com a unidade Alto",()=>{
 const declaration=app.match(/const WEIGHTS=\{[^\n]+\};/)[0];
 const weights=new Function(declaration+"return WEIGHTS;")();
 assert.deepEqual(weights.alto,["Pesado",3]);
 assert.match(app,/inventorySelect\("weight",it\.weight,Object\.entries\(WEIGHTS\)/);
});

test("Muito Leve ocupa meia Carga e duas unidades ocupam uma",()=>{
 const ui=loadUI(character(0,0,0,0,0,[]));
 assert.equal(ui.itemLoad(item("muito_leve")),.5);
 assert.equal(ui.itemLoad({...item("muito_leve"),qty:2}),1);
 assert.equal(ui.itemLoad({...item("leve"),properties:["Muito Leve"]}),.5);
 assert.equal(ui.itemLoad(item("alto")),3);
 assert.equal(ui.itemLoad(item("extremo")),4);
});
