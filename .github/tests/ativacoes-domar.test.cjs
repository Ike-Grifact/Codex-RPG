const {test}=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const read=p=>fs.readFileSync(p,"utf8");
const oldCost=/1\s*PP\s*(?:ou|\/)\s*2\s*Coragens\b/i;
const paidPerks=[
 "artista-marcial","disparo-fulminante","disparo-multiplo","disparo-violento",
 "golpe-baixo","golpe-colossal","golpe-fulminante","pericia-em-armas-de-fogo",
 "pericia-em-armas-de-longo-alcance","pericia-em-armas-leves",
 "pericia-em-armas-medias","pericia-em-armas-pesadas",
 "pericia-em-arremesso-de-armas","pericia-em-manejo-duplo","pugilismo"
];
test("15 verbetes ativos e catalogo usam 1 PP ou 1 Coragem",()=>{
 for(const name of paidPerks){
  const page=read("pericias/"+name+".html");
  assert.equal(oldCost.test(page),false,name+" apresenta custo antigo");
  assert.match(page,/1\s*PP\s*(?:ou|\/)\s*1\s*Coragem/i,name+" deve indicar custo revisado");
 }
 assert.equal(oldCost.test(read("pericias/index.html")),false);
});
test("Domar Media inclui Domar Pequena sem mudar XP e Domar Grande",()=>{
 const html=read("pericias/domar-criatura-media.html");
 assert.match(html,/Domar Criatura Pequena/);
 assert.match(html,/1 XP/);
 assert.match(read("docs/srd-continuidade-v0.52.md"),/Domar Criatura Pequena já adquirida/);
 const js=read("prototipo-ficha/app.js");
 assert.match(js,/id==="domar-criatura-media"&&!has\("domar-criatura-pequena"\)/);
 assert.match(js,/s:domar-criatura-pequena/);
});
test("Livro do Jogador da web preserva apenas custo histórico de preparação",()=>{
 const book=read("livro.html");
 const pairs=book.match(/1\s*PP\s*(?:ou|\/)\s*2\s*Coragens\b/gi)||[];
 assert.equal(pairs.length,1,"Somente preparação de magia fora de combate pode manter 2 Coragens");
 assert.match(book,/2 Coragens por criação/);
});
test("Olhos de Águia permanece passiva sem gasto de Coragem",()=>{
 const html=read("pericias/olhos-de-aguia.html");
 assert.match(html,/Nenhuma/);
 assert.match(html,/8 metros/);
 assert.match(read("criar-conflito/rules.mjs"),/olhos-de-aguia/);
});
