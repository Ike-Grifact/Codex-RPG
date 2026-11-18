import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const app=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const ficha=readFileSync(new URL("./index.html",import.meta.url),"utf8");
const livro=readFileSync(new URL("../livro.html",import.meta.url),"utf8");
test("Criação usa orçamento de 15 XP compartilhados em todas as categorias",()=>{
 assert.match(app,/const CREATE_BUDGET=\{attr:15,training:15,skills:15,total:15\}/);
 assert.match(ficha,/15 XP iniciais compartilhados/);
 assert.match(livro,/SRD v0\.79 — 15 XP iniciais/);
});
test("Nível 1 passa a 15 XP sem mudar referências 2 a 20",()=>{
 assert.match(app,/const XP_LEVEL_REFERENCE=\[0,15,28,37,46,56,66,77,88,100,112,125,138,152,166,181,196,212,228,245,260\]/);
 assert.match(livro,/<tr><td>1<\/td><td>15<\/td><td>11<\/td><td>125<\/td><\/tr>/);
});
test("Criação exige mínimo 3 XP deixando 12 XP livres sem reserva",()=>{
 assert.match(ficha,/restam 12 XP de distribuição livre/);
 assert.match(app,/function hasStarterSources\(/);
 assert.match(app,/const free=s\.creationLocked\?CREATE_BUDGET\.total/);
});
test("Formas antigas não apagam compras e mostram saldo excedido",()=>{
 assert.match(app,/creationBudgetSnapshot=saved/);
 assert.match(app,/saved\.attr\+saved\.training\+saved\.skills/);
 assert.match(app,/Investimentos anteriores foram preservados/);
});
test("Assistente lê orçamento corrente da mesma constante do criador",()=>{
 assert.match(app,/xpCosts\(\)\.free\+'<\/strong> \/ '\+CREATE_BUDGET\.total/);
 assert.match(app,/x\.total\+' \/ '\+CREATE_BUDGET\.total/);
});
