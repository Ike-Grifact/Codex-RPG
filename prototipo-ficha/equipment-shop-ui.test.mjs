import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const dir=dirname(fileURLToPath(import.meta.url));
const app=readFileSync(join(dir,"app.js"),"utf8");
const html=readFileSync(join(dir,"index.html"),"utf8");
const css=readFileSync(join(dir,"styles.css"),"utf8");
const catalog=JSON.parse(readFileSync(join(dir,"catalog.js"),"utf8").match(/=\s*(\[[\s\S]*\]);?\s*$/)[1]);
const start=app.indexOf("const EQUIPMENT_FAMILIES=[");
const end=app.indexOf("const RESOURCES=",start);
assert.ok(start>0&&end>start,"Funções puras de equipamento não encontradas");
const fragment=app.slice(start,end);
function makeUI(state,initialDraft={},extras={}){
 let rollCount=0,renderCount=0;
 const messages=[];
 const source="let draft=initialDraft,sheetPage='inventory',editMode=false;\n"+fragment+
  "\nreturn {equipmentFamily,equipmentWeight,equipmentGroupName,equipmentWeightName,equipmentMatches,equipmentDetails,preferredQuickAttribute,quickRollItem,getDraft:()=>draft,getPage:()=>sheetPage};";
 const injected=new Function("CATALOG","state","initialDraft","roll","combatItem","toast","freshDraft","label","render","$",source);
 const roll=()=>{rollCount++;};
 const combatItem=extras.combatItem||((item,mode)=>item.equipped&&item.type==="arma"&&mode==="armas"?[item.die]:[]);
 const ui=injected(catalog,state,initialDraft,roll,combatItem,x=>messages.push(x),
  ()=>({base:null,attribute:null,third:null,mode:"normal",de:1,extraKeep:false,step:false,equipmentId:""}),
  (_,name)=>({destreza:"Destreza",forca:"Força",inteligencia:"Inteligência"}[name]||name),
  ()=>{renderCount++;},()=>({scrollIntoView(){}}));
 return {...ui,messages,getRollCount:()=>rollCount,getRenderCount:()=>renderCount};
}
const melee=catalog.find(x=>x.name==="Espada Curta");
const firearm=catalog.find(x=>x.name==="Revólver");
const hammer=catalog.find(x=>x.name==="Martelo de Guerra");
const shield=catalog.find(x=>x.name==="Escudo Médio");
const bow=catalog.find(x=>x.name==="Arco Longo");

test("Classificação legível por tipo e categoria física (sem alterar dados)",()=>{
 const ui=makeUI({items:[],attributes:{},pending:null});
 assert.equal(ui.equipmentFamily(melee),"espadas");
 assert.equal(ui.equipmentFamily(hammer),"martelos");
 assert.equal(ui.equipmentFamily(bow),"distancia");
 assert.equal(ui.equipmentFamily(firearm),"fogo");
 assert.equal(ui.equipmentFamily(shield),"escudo");
 assert.equal(ui.equipmentWeight(melee),"leve");
 assert.equal(ui.equipmentWeight(hammer),"medio");
 assert.equal(ui.equipmentDetails(melee).includes("d6 com Perícia"),true);
 assert.equal(ui.equipmentDetails(shield).includes("Integridade 3"),true);
 assert.equal(ui.equipmentMatches(melee,"espadas","leve"),true);
 assert.equal(ui.equipmentMatches(melee,"martelos","leve"),false);
 assert.equal(ui.equipmentMatches(hammer,"martelos","pesado"),false);
 assert.equal(ui.equipmentFamily({name:"Lança de Arremesso",type:"arma",category:"medio"}),"hastes");
 assert.equal(ui.equipmentFamily({name:"Cajado Pesado",type:"arma",category:"pesado"}),"cajados");
});
test("Atalho prepara Disciplina + Atributo escolhido sem executar uma rolagem",()=>{
 const item={...melee,id:"weapon-1",type:"arma",equipped:true};
 const state={items:[item],attributes:{forca:1,destreza:2,inteligencia:1},pending:null};
 const ui=makeUI(state,{attribute:{group:"attr",key:"forca"},de:4});
 ui.quickRollItem("weapon-1");
 assert.equal(ui.getRollCount(),0);
 assert.equal(ui.getRenderCount(),1);
 assert.equal(ui.getPage(),"play");
 assert.deepEqual(ui.getDraft().base,{group:"practice",key:"armas_conjuracao"});
 assert.deepEqual(ui.getDraft().attribute,{group:"attr",key:"forca"});
 assert.equal(ui.getDraft().equipmentId,"weapon-1");
 assert.equal(ui.getDraft().de,4);
 assert.equal(ui.getDraft().extraKeep,false);
});
test("Atalho prefere atributo treinado mais alto se não existe seleção do jogador",()=>{
 const item={...melee,id:"weapon-2",type:"arma",equipped:true};
 const ui=makeUI({items:[item],attributes:{forca:1,destreza:3,agilidade:2},pending:null});
 ui.quickRollItem("weapon-2");
 assert.equal(ui.getRollCount(),0);
 assert.equal(ui.getRenderCount(),1);
 assert.equal(ui.getDraft().attribute.key,"destreza");
});
test("Atalho não rola quando o item não é apto, não está equipado, ou há pendência",()=>{
 const item={...melee,id:"w",type:"arma",equipped:false};
 const blocked=makeUI({items:[item],attributes:{destreza:2},pending:null});
 blocked.quickRollItem("w");assert.equal(blocked.getRollCount(),0);
 const owned={...item,equipped:true};
 const unqualified=makeUI({items:[owned],attributes:{destreza:2},pending:null},{},{combatItem:()=>[]});
 unqualified.quickRollItem("w");assert.equal(unqualified.getRollCount(),0);
 const pending=makeUI({items:[owned],attributes:{destreza:2},pending:{dice:[]}});
 pending.quickRollItem("w");assert.equal(pending.getRollCount(),0);
});
test("Foco prepara modo Conjuração e Inteligência já treinada sem rolar",()=>{
 const focus={name:"Varinha G1",id:"focus-1",type:"foco",equipped:true,die:6};
 const ui=makeUI({items:[focus],attributes:{destreza:3,inteligencia:1},pending:null},{},
  {combatItem:(item,mode)=>mode==="conjuracao"?[6]:[]});
 ui.quickRollItem("focus-1");
 assert.equal(ui.getRollCount(),0);
 assert.equal(ui.getRenderCount(),1);
 assert.equal(ui.getDraft().mode,"conjuracao");
 assert.equal(ui.getDraft().attribute.key,"inteligencia");
});
test("Loja, VT e inventário possuem filtros sem esconder preços ou edição",()=>{
 for(const txt of [
  'data-wizard-shop-','dataset.tradeShopType','data-inventory-type','data-inventory-weight',
  'EQUIPMENT_FAMILIES','EQUIPMENT_WEIGHT_OPTIONS','wizardShopWeight','tradeShopWeight','fp-shop-summary','fp-item-summary','fp-item-editor',
  'fp-owned-roll','fp-owned-gear-action','case "repertoire-roll":quickRollItem(id)'
 ])assert.ok(app.includes(txt),"Não encontrado: "+txt);
 for(const txt of ['id="trade-shop-type"','id="trade-shop-weight"','id="inventory-filterbar"'])
  assert.ok(html.includes(txt),"Faltando no HTML: "+txt);
 for(const txt of [".fp-shop-compact",".fp-item-compact",".fp-equip-filters",".fp-owned-roll"])
  assert.ok(css.includes(txt),"Estilo ausente: "+txt);
 assert.ok(app.includes('data-action="wizard-buy-item"'));
 assert.ok(app.includes('case "trade-buy":buyCatalogItem()'));
 assert.ok(app.includes('data-action="integrity"'));
 assert.ok(app.includes('data-item-field="ammoRemaining"'));
 assert.ok(app.includes('data-action="cravar-impact"'));
});

test("Preparação exige decisão de gastar recursos no compositor e não confirmação do Narrador",()=>{
 assert.ok(!app.includes('data-option="contextOK"'));
 assert.ok(!app.includes('data-option="step"'));
 assert.ok(app.includes('select("stepSourceId"'));
 assert.ok(app.includes('data-option="extraKeep"'));
 assert.ok(app.includes('if(k==="stepSourceId")draft.step=!!draft.stepSourceId'));
 assert.ok(app.includes('if(courageCost>5)errs.push('));
 assert.ok(app.includes('if(precoPrevisto>5)'));
 assert.ok(app.includes('toast("Ação preparada com "+item.name'));
});
