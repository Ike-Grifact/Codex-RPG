import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const read=(path)=>readFileSync(new URL(path,import.meta.url),"utf8");
const app=read("./app.js");
const page=read("../pericias/domar-criatura-pequena.html");
const catalog=read("../pericias/index.html");
const book=read("../docs/livro-do-jogador.md");
const srd=read("../docs/srd-playtest-nivel-1-v1.0.md");

const purchaseRule=app.match(/if\(id==="domar-criatura-pequena"&&[^\n]*return"Requer Influência 2 e Inteligência 1\.";/);
assert.ok(purchaseRule,"Validação efetiva de Domar Pequena existe e dispensa Apresentação");
const checkSmall=new Function("s",`const id="domar-criatura-pequena";${purchaseRule[0]}\nreturn null;`);
const char=(influencia,inteligencia,apresentacao)=>({
 attributes:{influencia,inteligencia},
 practices:{apresentacao}
});

test("Domar Pequena: Influência 2 + Inteligência 1 bastam sem Apresentação",()=>{
 assert.equal(checkSmall(char(2,1,0)),null);
 assert.equal(checkSmall(char(2,1,1)),null);
 assert.equal(checkSmall(char(3,3,0)),null);
});

test("Domar Pequena continua exigindo ambos os Atributos",()=>{
 assert.match(checkSmall(char(1,1,1)),/Influência 2 e Inteligência 1/);
 assert.match(checkSmall(char(2,0,1)),/Influência 2 e Inteligência 1/);
});

test("Codex Genético remove Apresentação apenas de Domar Pequena",()=>{
 assert.ok(app.includes('"domar-criatura-pequena":[["a:influencia:2","a:inteligencia:1"]]'));
 assert.ok(app.includes('"domar-criatura-pequena": ["attr:influencia","attr:inteligencia"]'));
 assert.ok(app.includes('"domar-criatura-media":[["a:influencia:3","a:inteligencia:1","p:apresentacao:1","s:domar-criatura-pequena"]]'));
 assert.ok(app.includes('"domar-criatura-grande":[["a:influencia:4","a:inteligencia:1","p:apresentacao:2","s:domar-criatura-pequena","s:domar-criatura-media"]]'));
 assert.match(app,/id==="domar-criatura-media"\|\|id==="domar-criatura-grande"/);
});

test("Documentação e catálogo refletem compra sem alterar teste de domesticação",()=>{
 assert.match(page,/<dt>Requisitos<\/dt><dd>Influência 2 \+ Inteligência 1<\/dd>/);
 assert.match(page,/Influência \+ Apresentação contra a DE defensiva do domador/);
 assert.match(catalog,/1 XP; Influência 2 \+ Inteligência 1 \(sem Apresentação como requisito\)/);
 assert.match(book,/Domar Criatura Pequena\*\* requer \*\*Influência 2 \+ Inteligência 1/);
 assert.match(srd,/Apresentação Grau 1 deixa de ser requisito de compra para Domar Pequena/);
});


test("Domar Média e Grande preservam os limites distintos de Apresentação",()=>{
 const combined=app.match(/if\(\(id==="domar-criatura-media"\|\|id==="domar-criatura-grande"\)[^\n]*return"Requer Influência "[^\n]*;/);
 assert.ok(combined,"validação conjunta encontrada");
 const check=new Function("id","s",combined[0]+"return null;");
 const base=(apresentacao)=>({
  attributes:{influencia:4,inteligencia:1},
  practices:{apresentacao}
 });
 assert.equal(check("domar-criatura-media",base(1)),null);
 assert.match(check("domar-criatura-grande",base(1)),/Apresentação 2/);
 assert.equal(check("domar-criatura-grande",base(2)),null);
 assert.match(check("domar-criatura-grande",{attributes:{influencia:3,inteligencia:1},practices:{apresentacao:2}}),/Influência 4/);
 assert.match(page,/Influência 2 \+ Inteligência 1/,"Pequena não foi modificada");
});
