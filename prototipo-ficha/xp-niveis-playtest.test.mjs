import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const app=readFileSync(join(root,"app.js"),"utf8");
const srd=readFileSync(join(root,"../docs/srd-continuidade-v0.83.md"),"utf8");
const playtest=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");

const getArray=name=>{
 const match=app.match(new RegExp("const "+name+"=\\[([^\\]]+)\\]"));
 assert.ok(match,name+" definido");
 return JSON.parse("["+match[1]+"]");
};
const lvl=getArray("XP_LEVEL_REFERENCE");
const creation=Number(app.match(/const CREATE_BUDGET=\{[^\n]+total:(\d+)\}/)?.[1]);

test("Orcamento 1–20: 15 XP no nivel 1, 260 acumulados, 245 de evolucao",()=>{
 assert.equal(lvl.length,21);
 assert.equal(lvl[0],0);
 assert.equal(lvl[1],15);
 assert.equal(lvl[20],260);
 assert.equal(creation,15);
 assert.equal(lvl[20]-creation,245);
 assert.ok(lvl.slice(1).every((n,i,arr)=>!i||n>arr[i-1]),"referencias crescentes");
 assert.ok(app.includes("const MAX_EARNED_XP=XP_LEVEL_REFERENCE[20]-CREATE_BUDGET.total"));
});

test("Teto e mensagens da ficha sem 242 XP legados",()=>{
 assert.ok(app.includes("state.xpEarned+amount>MAX_EARNED_XP"),"bloqueia novas concessoes");
 assert.ok(app.includes('"Teto do playtest: "+XP_LEVEL_REFERENCE[20]'),"feedback dinamico");
 assert.ok(!app.includes("até 242 XP"),"mensagem historica nao prevalece");
 assert.ok(app.includes("Fichas antigas preservadas"),"sem confisco de XP legado");
});

test("Custos normais de fontes preservados e build de referencia livre",()=>{
 assert.deepEqual(getArray("AT_COST"),[0,1,3,6,9,18,32]);
 assert.deepEqual(getArray("TRAIN_COST"),[0,2,4,8,16,32,64]);
 const left=lvl[20]-2*getArray("AT_COST")[6]-2*getArray("TRAIN_COST")[6];
 assert.equal(left,68,"saldo ilustrativo, nao reservado por categoria");
 assert.ok(srd.includes("**não é requisito nem teto de quantidade de fontes**"));
 assert.ok(srd.includes("Nenhuma reserva exclusiva de XP para Perícias"));
});

test("Estado autoral de XP consolidado em SRD e Livro sem aprovar custos pendentes",()=>{
 for(const c of [srd,playtest,book]){
  assert.ok(c.includes("15 XP"),"15 XP em todos os documentos");
  assert.ok(c.includes("260 XP"),"260 XP em todos os documentos");
 }
 assert.ok(srd.includes("**DEFINIDO PARA PLAYTEST**"));
 assert.ok(srd.includes("**PENDENTE:** análise prática"));
 assert.ok(srd.includes("Bardo")&&srd.includes("Montaria Épica"));
 assert.ok(playtest.includes("Decisão consolidada — orçamento de XP para o Playtest Níveis 1–20"));
 assert.ok(book.includes("**Decisão de XP do Playtest (21/11/2026)"));
});
