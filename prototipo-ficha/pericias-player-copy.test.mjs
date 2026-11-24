import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const player=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const latest=[
 {id:"armas-leves",label:"Leves",req:/Disciplina 1/,aff:/armadura Pesada ou Muito Pesada/,guard:/id==="armas-leves"&&disc<1/},
 {id:"armas-medias",label:"Médias",req:/Disciplina 1 e Força 1/,aff:/armadura Média/,guard:/id==="armas-medias"&&\(disc<1\|\|strength<1\)/},
 {id:"armas-pesadas",label:"Pesadas",req:/Disciplina 2 e Força 2/,aff:/armadura Leve ou Muito Leve/,guard:/id==="armas-pesadas"&&\(disc<2\|\|strength<2\)/}
];

for(const skill of latest){
 test("Verbete de Armas "+skill.label+" apresenta benefícios sem repetir o SRD",()=>{
  const text=readFileSync(new URL("../pericias/pericia-em-"+skill.id+".html",import.meta.url),"utf8");
  assert.match(text,new RegExp("<h1>Perícia em Armas "+skill.label+"</h1>"));
  assert.match(text,/<h2>Benefícios<\/h2>/);
  assert.match(text,skill.req);
  assert.match(text,/2 XP/);
  assert.match(text,/1 Coragem/);
  assert.match(text,/Antes de rolar um ataque/);
  assert.match(text,/Coragem é consumida mesmo que o ataque falhe/);
  assert.match(text,/falha não devolve a Coragem/);
  assert.match(text,/Acerto crítico/);
  assert.match(text,/recupera 1 Coragem do custo já pago/);
  assert.match(text,/gratuita no saldo final/);
  assert.match(text,skill.aff);
  assert.match(text,/−1 Antecipar/);
  assert.doesNotMatch(text,/DEFINIDO — SRD|Automatizad[oa] nos roladores|Regra atualizada|Aplicação prática/);
  assert.equal((text.match(/<article class="skill-article">/g)||[]).length,1);
  assert.equal((text.match(/<h2>Benefícios<\/h2>/g)||[]).length,1);
 });
 test("Codex Genético apresenta texto do jogador sem alterar requisitos: "+skill.label,()=>{
  assert.match(player,new RegExp('"'+skill.id+'":\\{'));
  assert.match(player,skill.guard);
  assert.match(player,/O efeito só acontece se acertar, mas a Coragem é gasta mesmo na falha/);
  assert.match(player,/você recupera 1 Coragem que já pagou/);
 });
}

test("Benefícios são exibidos sem duplicar linha de ativação nas três Perícias",()=>{
 assert.match(player,/const PLAYER_SKILL_COPY=\{/);
 assert.match(player,/const playerGuide=playerSkillGuide\(sid\)/);
 assert.match(player,/fp-gene-player-benefits/);
 assert.match(player,/playerGuide\?"":'<dt>Ativação/);
 assert.match(player,/guide\?'<div class="fp-skill-quick-benefit"/);
});

const masteryFamilies=["adagas","espadas","machados","macas","martelos","hastes","cajados","arcos","bestas","arremessos","punhos","longo-alcance","armas-fogo"];
test("Todas as Especializações em Armas oferecem os benefícios em linguagem de jogador",()=>{
 assert.match(player,/function playerSkillGuide\(id\)/);
 assert.match(player,/const mastery=WEAPON_MASTERY_TYPES\.find/);
 assert.match(player,/const guide=playerSkillGuide\(id\)/);
 assert.match(player,/const playerGuide=playerSkillGuide\(sid\)/);
 for(const family of masteryFamilies){
  const html=readFileSync(new URL("../pericias/maestria-em-"+family+".html",import.meta.url),"utf8");
  assert.match(html,/<h2>Benefícios<\/h2>/,family);
  assert.match(html,/uma de suas características sem gastar Coragem/,family);
  assert.match(html,/declare e pague 1 Coragem antes da rolagem/,family);
  assert.match(html,/recuperação normal do crítico devolve essa Coragem/,family);
  assert.match(html,/A recuperação não é concedida uma segunda vez/,family);
  assert.match(html,/Terceira característica/,family);
  assert.doesNotMatch(html,/DEFINIDO — SRD|<span class="skill-badge">/,family);
 }
 for(const family of ["arcos","bestas","arremessos","longo-alcance"]){
  const html=readFileSync(new URL("../pericias/maestria-em-"+family+".html",import.meta.url),"utf8");
  assert.match(html,/compra permanece bloqueada/,family+" ainda depende dos requisitos autorais");
 }
 const fogo=readFileSync(new URL("../pericias/maestria-em-armas-fogo.html",import.meta.url),"utf8");
 assert.match(fogo,/0 XP para Humanos pela origem/);
 assert.match(fogo,/não concede a Perícia em Armas de Fogo/);
});
