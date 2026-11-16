import test from "node:test";
import assert from "node:assert/strict";

// Testa a ação real do template com substitutos mínimos do Foundry v14.
class ActorSheetV2 {}
globalThis.foundry={applications:{api:{HandlebarsApplicationMixin:Base=>Base},sheets:{ActorSheetV2}}};
const {CodexCharacterSheet}=await import("../module/sheet.mjs");
const notices=[];
globalThis.ui={notifications:{info:message=>notices.push(message),warn:message=>notices.push(message)}};

function sheet(system){
 let renders=0,scrolls=0;
 const s={
  actor:{system},_busy:false,_pending:null,
  _draft:{base:null,second:null,complement:null},
  _opts:{mode:"normal"},
  element:{querySelector:()=>({scrollIntoView:()=>{scrolls++;}})},
  async render(){renders++;return this;},
 };
 return {s,rendered:()=>renders,scrolled:()=>scrolls};
}
const pick=(sheet,group,key)=>CodexCharacterSheet.chooseSource.call(sheet,null,{dataset:{group,key}});

test("Criatura usa dois Atributos distintos e mantém a seleção ao clicar em um terceiro",async()=>{
 const ctx=sheet({monsterRules:true,threatGrade:6,attributes:{forca:0,vigor:0,agilidade:0},skills:[]});
 await pick(ctx.s,"attribute","forca");
 await pick(ctx.s,"attribute","vigor");
 await pick(ctx.s,"attribute","agilidade");
 assert.equal(ctx.s._draft.base.key,"forca");
 assert.equal(ctx.s._draft.second.key,"vigor");
 assert.equal(ctx.s._draft.complement,null);
 assert.equal(ctx.scrolled(),0,"Selecionar não desloca a ficha");
 assert.equal(ctx.s.actor.system.attributes.forca,0);
 await pick(ctx.s,"attribute","vigor");
 assert.equal(ctx.s._draft.second,null);
});

test("As duas primeiras fontes usam categorias diferentes em qualquer ordem",async()=>{
 const ctx=sheet({attributes:{inteligencia:1},knowledges:{medicina:1},practices:{atletismo:1},skills:[]});
 await pick(ctx.s,"attribute","inteligencia");
 await pick(ctx.s,"attribute","vigor");
 assert.equal(ctx.s._draft.base.key,"inteligencia");
 assert.equal(ctx.s._draft.second,null);
 await pick(ctx.s,"knowledge","medicina");
 assert.equal(ctx.s._draft.second.key,"medicina");
 await pick(ctx.s,"attribute","inteligencia");
 await pick(ctx.s,"practice","atletismo");
 assert.equal(ctx.s._draft.base.key,"medicina");
 assert.equal(ctx.s._draft.second.key,"atletismo");
 assert.equal(ctx.scrolled(),0);
});

test("Uma rolagem pendente preserva fontes e posição ao clicar nos cartões",async()=>{
 notices.length=0;
 const ctx=sheet({monsterRules:true,attributes:{forca:1},skills:[]});
 ctx.s._pending={id:"abc123"};
 await pick(ctx.s,"attribute","forca");
 assert.equal(ctx.s._draft.base,null);
 assert.match(notices.at(-1),/Finalize ou descarte/);
 assert.equal(ctx.scrolled(),0);
});

test("A ficha conserva o scroll da raiz ao renderizar seus cartões",()=>{
 assert.deepEqual(CodexCharacterSheet.PARTS.body.scrollable,[""]);
});
