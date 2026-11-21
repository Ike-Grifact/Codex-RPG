import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const app=readFileSync(join(root,"app.js"),"utf8");
const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
const playtest=readFileSync(join(root,"../docs/playtest-bardo-2026-11-21.md"),"utf8");
const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");

const experimental=[
 "pericia-em-instrumentos","maestria-em-apresentacao","voz-encantadora",
 "ritmo-de-batalha","inspiracao","ressonancia-arcana","acorde-de-protecao",
 "acorde-triunfal","compasso-adiantado","ritmo-acelerado","harmonia-musical",
 "piada-infame","elevacao-harmonica","acao-em-conjunto-musical",
 "presenca-de-palco","melodia-psiquica"
];
const optional=["dueto-improvisado","contratempo","solo-provocador","cancoes-sustentadas"];
const all=[...experimental,...optional];
const registry=app.slice(app.indexOf('const SKILLS=['),app.indexOf('const HIDDEN_CATALOG_SKILLS='));

test("Playtest Bardo: 20 Perícias catalogadas, links únicos e compra XP pendente",()=>{
 for(const id of all){
  const sig=' ["'+id+'",';
  assert.equal(registry.split(sig).length-1,1,"Uma entrada no criador: "+id);
  const start=app.indexOf(sig),end=app.indexOf("],",start);
  assert.ok(end>start&&app.slice(start,end+1).endsWith(",null]"),"Custo XP não foi inventado: "+id);
  assert.equal(catalog.split('href="'+id+'.html"').length-1,1,"Link único no catálogo: "+id);
  const page=readFileSync(join(root,"../pericias/"+id+".html"),"utf8");
  assert.ok(page.includes("XP")&&page.includes("PENDENTE"),"Verbete bloqueia compra: "+id);
  assert.ok(page.includes("../docs/playtest-bardo-2026-11-21.md"),"Link à referência: "+id);
 }
 assert.ok(app.includes("if(!Number.isInteger(cost)"),"Trava de compra por XP não definido preservada");
});

test("Bardo: requisitos autorais de Maestria e Voz preservados",()=>{
 for(const [id,text] of [
  ["maestria-em-apresentacao","Apresentação 4 + Influência 4 + Destreza 4 + Apresentação Avançada + Perícia em Instrumentos"],
  ["voz-encantadora","Influência 4 + Apresentação 4 + Vigor 3"],
  ["melodia-psiquica","Disciplina 4 + Criar Item de Foco e Magia"]
 ]){
  const page=readFileSync(join(root,"../pericias/"+id+".html"),"utf8");
  assert.ok(page.includes(text),"Requisitos no verbete: "+id);
 }
 assert.ok(app.includes('id==="maestria-em-apresentacao"'),"Requisito da Maestria validado na ficha");
 assert.ok(app.includes('id==="voz-encantadora"'),"Requisito da Voz validado na ficha");
 assert.ok(app.includes('id==="melodia-psiquica"'),"Requisito da Melodia validado na ficha");
});

test("Economia do Bardo: 3A totais, foco a 3A e Desarmonia sem apagar A naturais",()=>{
 for(const doc of [srd,playtest,book]){
  assert.ok(doc.includes("3A"),"Reserva musical documentada");
  assert.ok(doc.includes("Ressonância Arcana"),"Recarga de foco consta nas regras");
 }
 assert.ok(playtest.includes("**3A musicais → 1 carga de foco**"),"Recarga não custa menos que 3A");
 assert.ok(playtest.includes("não são armazenados")&&playtest.includes("3A por destinatário"),"Sem acumulação ou duplicação");
 assert.ok(playtest.includes("Antecipares naturais")&&playtest.includes("Desarmonia"),"Punição preserva dados naturais");
 assert.ok(!playtest.includes("recuperação de Integridade de armadura")||playtest.includes("não incluir recuperação de Integridade de armaduras"),"Não readmite reparo de armadura");
});

test("Melodia Psíquica: instrumento, até dois alvos e limites explícitos",()=>{
 const page=readFileSync(join(root,"../pericias/melodia-psiquica.html"),"utf8");
 assert.ok(page.includes("até dois alvos")&&page.includes("instrumento"),"Instrumento e dois alvos");
 assert.ok(page.includes("armas OU psíquicos"),"Alternativa de efeito, sem juntar tipos automaticamente");
 assert.ok(playtest.includes("**Disciplina 4**")&&playtest.includes("**Criar Item de Foco e Magia**"),"Requisitos de Melodia");
 assert.ok(srd.includes("**até dois alvos**"),"SRD não autoriza alvos ilimitados");
 assert.ok(playtest.includes("NÃO automatizar dano duplo"),"Não duplicar dano sem definição");
});

test("Precedência: notas do Bardo não reescrevem Apresentação Avançada nem autorizam duas Práticas",()=>{
 assert.ok(srd.includes("não introduzir classe fixa")||srd.includes("sem introduzir classe fixa"));
 assert.ok(playtest.includes("proibição de misturar duas Práticas"),"Misturas de duas Práticas exigem definição");
 assert.ok(playtest.includes("custos de aquisição de XP"),"XP ainda pendente");
 assert.ok(book.includes("[EXPERIMENTAL / XP PENDENTE]"),"Livro indica estado correto");
});
