import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const read=path=>readFileSync(join(root,path),"utf8");
const srd=read("../docs/srd-continuidade-v0.85.md");
const previous=read("../docs/srd-continuidade-v0.84.md");
const book=read("../docs/livro-do-jogador.md");
const app=read("app.js");
const entry=slug=>read("../pericias/"+slug+".html");

test("v0.85: resistência racial usa o coeficiente elemental padrão sem apagar Pavor",()=>{
 assert.match(srd,/0,5 de dano elemental/);
 assert.match(srd,/0 dano elemental/);
 assert.match(srd,/Pavor \*\*não desaparece\*\*/);
 assert.match(srd,/2P em 1E/);
 assert.match(book,/0,5 dano por E, 0 dano por P/);
 assert.match(app,/Resistência elemental padrão contra o elemento escolhido/);
 assert.match(app,/Arredondamento geral ainda pendente/);
 assert.match(previous,/PENDENTE — resistência do Escudo Rúnico/,"Histórico v0.84 preservado");
});

test("v0.85: Ácido compartilha o custo e as habilitações normais da mistura",()=>{
 for(const literal of ["1 Antecipar (1A)","Improviso Elemental","Maestria Elemental","+1 Coragem por elemento elevado","1A + 2 Coragens","queimadura, em lugar de Sangramento"]){
  assert.ok(srd.includes(literal),"Regra da mistura: "+literal);
 }
 assert.match(srd,/matriz geral dos dois elementos misturados/);
 for(const slug of ["pericia-em-elemento-fogo","pericia-em-elemento-veneno"]){
  const html=entry(slug);
  assert.match(html,/Maestria Elemental/);
  assert.match(html,/srd-continuidade-v0\.85\.md/);
  assert.match(html,/1A/);
 }
 assert.match(app,/ownsSkill\("mestre"\)/);
 assert.match(app,/Improviso Elemental só adapta o tipo de dano/);
 assert.match(book,/Maestria Elemental\*\* é necessária para usar Queimar/);
});

test("v0.85: curvas de Ar consomem a distância somada dos trechos do Grau",()=>{
 for(const [g,meters] of [[1,4],[2,8],[3,16]]){
  assert.ok(srd.includes(meters+" metros (G"+g+")"),"Grau e metros vigentes");
 }
 assert.match(srd,/3 m e 5 m, percorre \*\*8 m no total/);
 assert.match(srd,/não atravessa parede sólida/i);
 assert.match(book,/A distância não é calculada apenas entre início e fim/);
 const ar=entry("pericia-em-elemento-ar");
 assert.match(ar,/4 m G1, 8 m G2, 16 m G3/);
 assert.match(ar,/srd-continuidade-v0\.85\.md/);
 assert.match(app,/soma dos trechos dentro da metragem do Grau/);
 const allowed=(segments,max)=>segments.reduce((total,s)=>total+s,0)<=max;
 assert.equal(allowed([3,5],8),true);
 assert.equal(allowed([3,6],8),false);
});

test("v0.85: livro e verbetes mantêm contexto, versões e pendências gerais",()=>{
 assert.match(srd,/SUBSTITUÍDO/);
 assert.match(srd,/PENDENTE SOMENTE COMO REGRA GERAL/);
 assert.match(book,/Continuidade v0\.85/);
 assert.match(book,/Escudo Rúnico \(Escudo Arcano racial\) \+ um elemento/);
 assert.match(app,/registro manual/i);
 assert.match(entry("pericia-em-elemento-ar"),/recuperar Fôlego/);
 assert.ok(!srd.includes("dois elementos gratuitos"));
});
