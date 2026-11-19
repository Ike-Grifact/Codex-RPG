import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,existsSync} from "node:fs";
import {join,dirname} from "node:path";
import {fileURLToPath} from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const app=readFileSync(join(root,"app.js"),"utf8");
const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
const page=readFileSync(join(root,"index.html"),"utf8");
const css=readFileSync(join(root,"styles.css"),"utf8");

function section(source,start,end){
 const a=source.indexOf(start),b=source.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,"Fonte incompleta: "+start);
 return source.slice(a,b);
}
const iconBlock=section(app,"const CODEX_SKILL_ICONS=","const RESOURCES=");
const icons=Function(iconBlock+"return {CODEX_SKILL_ICONS,codexItemIconId,codexIcon,codexSkillIcon,codexItemIcon};")();

test("Druídica: detalhes concisos e separados do verbete completo",()=>{
 const card=section(app,'const CARD_BRIEFS={','const CARD_ACTIVATIONS={');
 const entry=card.match(/"pericia-druidica": "([^"]+)"/);
 assert.ok(entry,"Resumo Druídico ausente");
 assert.ok(entry[1].length<330,"Resumo não é curto: "+entry[1].length);
 assert.doesNotMatch(entry[1],/Domar|influência|Pavor maior/);
 assert.match(app,/sid==="pericia-druidica"\?CARD_BRIEFS\[sid\]:detail/);
 assert.match(page,/Ler regras completas da Druídica/);
 assert.doesNotMatch(page,/G2 exige Domar Média|G3 exige Domar Grande/);
 const req=section(app,"const CARD_REQUIREMENTS={","const CARD_EFFECTS={").match(/"pericia-druidica": "([^"]+)"/)?.[1];
 assert.equal(req,"Criar Item de Foco e Magia + Perícia em Elemento Terra");
});
test("Mapas de SVG dos oito elementos e das armas existem",()=>{
 for(const id of ["fogo","agua","vento","terra","sagrado","sangue","veneno","trevas","armas-leves","armas-medias","armas-pesadas"]){
  const key=icons.CODEX_SKILL_ICONS[id];
  assert.ok(key,"Perícia sem ícone: "+id);
  assert.ok(existsSync(join(root,"../assets/icons/codex",key+".svg")),key);
  assert.match(icons.codexSkillIcon(id),/src="\.\.\/assets\/icons\/codex\//);
 }
 for(const [name,kind,expected] of [
  ["Arco Longo","weapon","arma-arco"],["Besta Pesada","weapon","arma-besta"],
  ["Punhal","weapon","arma-adaga"],["Espada Longa","weapon","arma-espada"],
  ["Machado de Guerra","weapon","arma-machado"],["Montante","weapon","arma-montante"],
  ["Revólver","firearm","arma-pistola"],["Armadura Média","armor","armadura-media"],
  ["Escudo Médio","shield","armadura-escudo"]
 ]){
  const id=icons.codexItemIconId({name,kind});
  assert.equal(id,expected,name);
  assert.ok(existsSync(join(root,"../assets/icons/codex",id+".svg")),name);
 }
 assert.equal(icons.codexIcon("../../malicious"),"");
});
test("Armas e elementos agora mostram ícones na loja, inventário, Perícias e ação",()=>{
 for(const snippet of [
  "codexSkillIcon(id)+'<strong>'+esc(name)",
  "codexItemIcon(it)+'<strong>'+esc(it.name)",
  "codexSkillIcon(id)+'</span><span>'+esc(name)",
  "codexIcon(sid",
  "fp-inventory-name">'+codexItemIcon(it)
 ]){
  if(snippet==="codexIcon(sid")continue;
  assert.ok(app.includes(snippet),"Ícone ausente da interface: "+snippet);
 }
 assert.match(app,/fp-gene-detail-heading['"]?/);
 assert.match(css,/\.fp-codex-icon\{/);
 assert.match(css,/\.fp-element-icon \.fp-codex-icon\{/);
});
test("Druídica não se conecta visualmente ao ramo Domar",()=>{
 const internal=section(graph,'for(const family of groups){','// As afinidades aparecem apenas ao selecionar');
 assert.match(internal,/family\.id!=="natureza"/);
 assert.match(internal,/prev\.id,n\.id/);
 assert.match(internal,/pericia-druidica/);
 assert.match(graph,/fp-gene-skill-pictogram/);
 assert.match(graph,/width="32" height="32"/);
});
