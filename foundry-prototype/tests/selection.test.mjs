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
  _draft:{base:null,attribute:null,complement:null},
  _opts:{mode:"normal"},
  element:{querySelector:()=>({scrollIntoView:()=>{scrolls++;}})},
  async render(){renders++;return this;},
 };
 return {s,rendered:()=>renders,scrolled:()=>scrolls};
}
const pick=(sheet,group,key)=>CodexCharacterSheet.chooseSource.call(sheet,null,{dataset:{group,key}});

test("Criatura: selecionar dois Atributos distintos sem comprar Grau",async()=>{
 const ctx=sheet({monsterRules:true,animalRules:false,attributes:{forca:0,vigor:0,agilidade:0},skills:[]});
 await pick(ctx.s,"attribute","forca");
 assert.deepEqual(ctx.s._draft.base,{group:"attribute",key:"forca"});
 assert.equal(ctx.s._draft.attribute,null);
 await pick(ctx.s,"attribute","vigor");
 assert.deepEqual(ctx.s._draft.attribute,{group:"attribute",key:"vigor"});
 assert.equal(ctx.scrolled(),1,"Após duas fontes deve localizar o botão Rolar");
 assert.equal(ctx.s.actor.system.attributes.forca,0,"Selecionar fonte não altera seu Grau");
 await pick(ctx.s,"attribute","agilidade");
 assert.equal(ctx.s._draft.attribute.key,"agilidade","Segunda fonte pode ser trocada sem rerrolar");
 assert.equal(ctx.rendered(),3);
});

test("Aprendiz: Conhecimento ou Prática como Base, Atributo como segunda fonte",async()=>{
 const ctx=sheet({monsterRules:false,animalRules:false,attributes:{inteligencia:1},
  knowledges:{medicina:1},practices:{atletismo:1},skills:[]});
 await pick(ctx.s,"attribute","inteligencia");
 assert.equal(ctx.s._draft.base,null,"Atributo isolado não cria base para Aprendiz");
 await pick(ctx.s,"knowledge","medicina");
 await pick(ctx.s,"attribute","inteligencia");
 assert.deepEqual(ctx.s._draft.base,{group:"knowledge",key:"medicina"});
 assert.deepEqual(ctx.s._draft.attribute,{group:"attribute",key:"inteligencia"});
 assert.equal(ctx.scrolled(),1);
});

test("Uma rolagem pendente impede alteração silenciosa das fontes",async()=>{
 notices.length=0;
 const ctx=sheet({monsterRules:true,attributes:{forca:1},skills:[]});
 ctx.s._pending={id:"abc123"};
 await pick(ctx.s,"attribute","forca");
 assert.equal(ctx.s._draft.base,null);
 assert.match(notices.at(-1),/Finalize ou descarte/);
 assert.equal(ctx.scrolled(),1,"Mostrar cartas pendentes");
});
