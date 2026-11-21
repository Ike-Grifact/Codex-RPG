import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const app=readFileSync(join(root,"app.js"),"utf8");
const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
const playtest=readFileSync(join(root,"../docs/playtest-bardo-2026-11-21.md"),"utf8");
const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");

const activeBard=["pericia-em-instrumentos","maestria-em-apresentacao","voz-encantadora"];
const expectedInternal=[
 "dueto-improvisado","contratempo","solo-provocador","cancoes-sustentadas",
 "ritmo-de-batalha","inspiracao","ressonancia-arcana","acorde-de-protecao",
 "acorde-triunfal","compasso-adiantado","ritmo-acelerado","harmonia-musical",
 "piada-infame","elevacao-harmonica","acao-em-conjunto-musical",
 "presenca-de-palco","melodia-psiquica"
];
const registry=app.slice(app.indexOf("const SKILLS=["),app.indexOf("const HIDDEN_CATALOG_SKILLS="));
const hiddenMatch=app.match(/const BARD_INTERNAL_EFFECTS=Object\.freeze\((\[[^\n]+\])\)/);
const hidden=hiddenMatch?JSON.parse(hiddenMatch[1]):[];
const cStart=graph.indexOf("const GENE_CONSTELLATIONS=");
const cEnd=graph.indexOf("function position(",cStart);
const constellations=new Function(graph.slice(cStart,cEnd)+"\nreturn GENE_CONSTELLATIONS;")();
const families=new Map(constellations.map(f=>[f.id,f]));
const membership=id=>constellations.filter(f=>f.skills.includes(id)).map(f=>f.id);
const page=id=>readFileSync(join(root,"../pericias/"+id+".html"),"utf8");

test("Bardo: UMA Maestria e somente Voz/Instrumentos como Perícias distintas",()=>{
 assert.ok(hiddenMatch,"Registro de efeitos internos existe");
 assert.deepEqual([...hidden].sort(),[...expectedInternal].sort());
 for(const id of activeBard){
  assert.equal(membership(id).join(","),"apresentacao","Bardo ativo no ramo Apresentação: "+id);
  assert.ok(catalog.includes('href="'+id+'.html"'),"Catálogo com compra única: "+id);
  assert.ok(page(id).includes("XP")&&page(id).includes("PENDENTE"));
 }
 for(const id of expectedInternal){
  assert.equal(membership(id).length,0,"Efeito interno NÃO é nó de perícia: "+id);
  assert.ok(!catalog.includes('href="'+id+'.html"'),"Efeito interno não deve ser uma compra no catálogo: "+id);
  assert.ok(page(id).includes("EFEITO INTERNO DA MAESTRIA"),"Verbete legado redireciona à Maestria: "+id);
 }
 assert.ok(playtest.includes("UMA única Perícia")&&playtest.includes("sem novo nó"),"Documento canônico consolida");
 assert.ok(srd.includes("multiplicação inicial dos nomes de técnicas musicais"),"Errata substitui entradas antigas");
 assert.ok(book.includes("ÚNICA Maestria"),"Livro atualizado");
});

test("Economia de 3A e Melodia Psíquica sem custo inventado ou dano duplicado",()=>{
 const mastery=page("maestria-em-apresentacao");
 for(const marker of ["3A musicais totais","Ressonância Arcana","Inspiração","Acorde de Proteção","Voz Encantadora","Melodia Psíquica"]){
  assert.ok(mastery.includes(marker),"Maestria documenta "+marker);
 }
 assert.ok(playtest.includes("**3A → 1 carga de foco**")&&playtest.includes("**3A → 1 Coragem**"),"Custo 3A preservado");
 assert.ok(playtest.includes("**Disciplina 4 + Criar Item de Foco e Magia**"),"Melodia condicional");
 assert.ok(playtest.includes("Não automatizar Melodia Psíquica"),"Não inventar dupla aplicação");
 assert.ok(playtest.includes("Antecipares naturais"),"Desarmonia não apaga símbolos naturais");
 assert.ok(registry.includes('["maestria-em-apresentacao"')&&app.includes("const HIDDEN_CATALOG_SKILLS="));
});

test("Ramos do mapa: nenhuma Perícia visível perdida ou repetida",()=>{
 const raw=app.slice(app.indexOf("const SKILLS=["),app.indexOf("// IDs de Perícias legadas"));
 const skillIds=[...raw.matchAll(/\[\s*"([\w-]+)"\s*,\s*"/g)].map(m=>m[1]);
 const visible=skillIds.filter(id=>!hidden.includes(id)&&id!=="armas"&&id!=="combate");
 const duplicated=visible.filter(id=>membership(id).length!==1);
 assert.deepEqual(duplicated,[],"Cada Perícia visível pertence a um único ramo");
 for(const [id,f] of families){
  assert.ok(f.column>=0&&f.column<=2,"Coluna válida: "+id);
  assert.equal(f.skills.length,new Set(f.skills).size,"Sem nós duplicados no ramo "+id);
 }
 assert.equal(families.get("apresentacao").skills.length,4);
 assert.ok(families.get("coleta").skills.includes("coleta-avancada"));
 assert.ok(families.get("artesao").skills.includes("ferreiro"));
 assert.ok(families.get("alquimia").skills.includes("bioetica"));
 assert.ok(families.get("alquimia").skills.includes("pesquisa-avancada-pocoes"));
});

test("Correção temática: Olhos de Águia, Elementos, Psíquico e Cavalaria",()=>{
 assert.deepEqual(membership("olhos-de-aguia"),["disparos"]);
 for(const id of ["improviso","mestre","invocacao-elemental","transformacao-elemental","mudanca-elemental","sentido-elemental"])
  assert.deepEqual(membership(id),["elementos"],"Perícia elemental no ramo Elementos: "+id);
 for(const id of ["invocar-esfera-espiritual","passo-etereo","absorver-esferas","disparo-esferas-espirituais"])
  assert.deepEqual(membership(id),["psiquico"],"Esfera no ramo Psíquico: "+id);
 for(const id of ["montar","pericia-montaria","montaria-epica"])
  assert.deepEqual(membership(id),["cavalaria"],"Montaria no ramo Cavalaria: "+id);
});

test("Montaria Épica não altera Montar Animal nem inventa XP ou voo",()=>{
 const item=registry.slice(registry.indexOf('  "montaria-epica",'));
 assert.ok(item.startsWith('  "montaria-epica",')&&item.includes("null"),"Compra sem preço permanece bloqueada");
 assert.ok(app.includes('if(id==="montaria-epica")return'),"Pendente explícito em skillReq()");
 assert.ok(page("montaria-epica").includes("gigantes, aladas ou exóticas"),"Tipos da proposta");
 assert.ok(catalog.includes('href="montaria-epica.html"'),"Cavalaria no catálogo");
 assert.ok(srd.includes("PROPOSTO / PENDENTE — Montaria Épica"));
 assert.ok(registry.includes('"montar",\n  "Montar Animal"')&&registry.includes("2 XP. Requer Influência 2"),"Montar Animal inalterada");
 assert.ok(registry.includes('"pericia-montaria"')&&registry.includes("Custo de XP PENDENTE"),"Perícia em Montaria inalterada");
});

test("Persistem limitações centrais das rolagens, ações e Antecipar",()=>{
 assert.ok(playtest.includes("sem somar dados de duas Práticas"),"Sem liberar combinações proibidas");
 assert.ok(playtest.includes("9 dados")||srd.includes("9 dados"),"Limite de 9 dados");
 assert.ok(!app.includes('const HIDDEN_CATALOG_SKILLS=new Set(["combate","armas"]);'),"Ocultação agora considera efeitos internos");
});
