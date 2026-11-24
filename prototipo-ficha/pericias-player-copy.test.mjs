import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=new URL("./app.js",import.meta.url);
const page=new URL("../pericias/pericia-em-armas-leves.html",import.meta.url);
const player=readFileSync(source,"utf8");
const verbete=readFileSync(page,"utf8");

test("Armas Leves: verbete prioriza benefícios e não repete notas de SRD",()=>{
 assert.match(verbete,/<h1>Perícia em Armas Leves<\/h1>/);
 assert.match(verbete,/<h2>Benefícios<\/h2>/);
 assert.match(verbete,/Disciplina 1/);
 assert.match(verbete,/2 XP/);
 assert.match(verbete,/1 Coragem/);
 assert.match(verbete,/−1 Antecipar/);
 assert.doesNotMatch(verbete,/DEFINIDO — SRD|Automatizad[oa] nos roladores|Regra atualizada|Aplicação prática/);
 assert.equal((verbete.match(/<article class="skill-article">/g)||[]).length,1);
 assert.equal((verbete.match(/<h2>Benefícios<\/h2>/g)||[]).length,1);
});

test("Codex Genético e catálogo usam leitura do jogador em Armas Leves",()=>{
 assert.match(player,/const PLAYER_SKILL_COPY=\{/);
 assert.match(player,/"armas-leves":\{/);
 assert.match(player,/const playerGuide=PLAYER_SKILL_COPY\[sid\]/);
 assert.match(player,/fp-gene-player-benefits/);
 assert.match(player,/playerGuide\?"":'<dt>Ativação/);
 assert.match(player,/guide\?'<div class="fp-skill-quick-benefit"/);
});

test("Texto de apresentação não altera aquisição nem grau exigido",()=>{
 assert.match(player,/if\(id==="armas-leves"&&disc<1\)return"Requer Disciplina 1\."/);
 assert.match(player,/\["armas-leves",/);
});
