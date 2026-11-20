import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,readdirSync,existsSync} from "node:fs";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const icons=join(root,"../assets/icons/codex");
const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
const html=readFileSync(join(root,"index.html"),"utf8");
const css=readFileSync(join(root,"styles.css"),"utf8");
const names=readdirSync(icons).filter(x=>x.endsWith(".svg")).sort();

test("Atlas contém armas, armaduras, elementos, constelações e indicadores",()=>{
 assert.equal(names.length,49);
 for(const status of ["coragem","movimento","peso","balanco","inventario"]){
  assert.ok(names.includes("status-"+status+".svg"),"Falta ícone de "+status);
 }
 for(const prefix of ["arma-","armadura-","elemento-","categoria-","magia-","status-"]){
  assert.ok(names.some(x=>x.startsWith(prefix)),prefix);
 }
 for(const filename of names){
  const source=readFileSync(join(icons,filename),"utf8");
  assert.match(source,/<svg\s/);
  assert.match(source,filename==="status-de.svg"?/viewBox="0 0 22\.02 39\.15"/:/viewBox="0 0 64 64"/);
  assert.match(source,/<title\s/);
  assert.match(source,/<g[^>]+stroke="/);
  assert.doesNotMatch(source,/<script\b|<foreignObject\b|\bonload\s*=/i);
 }
});

test("DE mescla três runas e tem exclusivamente o azul de Ansuz",()=>{
 const de=readFileSync(join(icons,"status-de.svg"),"utf8");
 const antecipar=readFileSync(join(icons,"status-antecipar.svg"),"utf8");
 assert.match(de,/Sowilo, Ansuz e Thurisaz fundidas/);
 // Modelo autoral: mantém os glifos A, t e S nas posições originais do SVG enviado.
 assert.match(de,/font-family: Zillaroonies/);
 for(const rune of [">A</tspan>",">t</tspan>",">S</tspan>"])
  assert.ok(de.includes(rune),"Glifo original ausente: "+rune);
 assert.deepEqual([...de.matchAll(/#[0-9A-Fa-f]{6}/g)].map(x=>x[0]),["#2369BB","#2369BB"]);
 assert.match(antecipar,/Antecipar — Ansuz ᚨ/);
 assert.match(antecipar,/stroke="#2369BB"/);
});

test("Cada categoria do mapa tem seu SVG de constelação",()=>{
 const section=graph.slice(graph.indexOf("const GENE_CONSTELLATIONS=["),graph.indexOf("function position("));
 const ids=[...section.matchAll(/\{id:"([^"]+)",label:/g)].map(x=>x[1]);
 assert.equal(ids.length,12);
 for(const id of [...ids,"outros"])assert.ok(existsSync(join(icons,"categoria-"+id+".svg")),id);
 assert.match(graph,/class="fp-gene-constellation-icon"/);
});

test("Os ícones de Perícias usados no mapa correspondem a arquivos reais",()=>{
 const section=graph.slice(graph.indexOf("const GENE_SKILL_PICTOGRAMS="),graph.indexOf("const GENE_CONSTELLATIONS="));
 const assets=[...section.matchAll(/"[^"]+":"([^"]+)"/g)].map(x=>x[1]);
 assert.ok(assets.length>=20);
 for(const id of assets)assert.ok(existsSync(join(icons,id+".svg")),id);
 assert.match(graph,/class="fp-gene-skill-pictogram"/);
 assert.match(graph,/pointer-events="none"/);
});

test("Vida, Integridade e DE estão integradas sem substituir IDs da ficha",()=>{
 for(const [id,cl,asset] of [
  ["life-text","fp-icon-life","status-vida.svg"],
  ["de-label","fp-icon-de","status-de.svg"],
  ["armor-integrity-text","fp-icon-integrity","status-integridade.svg"]
 ]){
  assert.ok(html.includes('id="'+id+'"'),id);
  assert.ok(html.includes(cl),cl);
  assert.ok(css.includes(asset),asset);
 }
});
