import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
const read=path=>readFileSync(new URL(path,import.meta.url),"utf-8");
const sheet=()=>read("../templates/character-sheet.hbs");
const js=()=>read("../module/sheet.mjs");
const css=()=>read("../styles/codex-sheet.css");
const model=()=>read("../module/data-model.mjs");
test("jogo, evolução, Perícias e inventário têm páginas diferentes",()=>{
 assert.match(js(),/\["overview","Jogar"\]/);
 assert.match(js(),/\["training","Evolução"\]/);
 assert.match(js(),/\["skills","Perícias"\]/);
 assert.match(js(),/\["inventory","Inventário e Combate"\]/);
 assert.match(sheet(),/\{\{#if codex\.skillsPage\}\}/);
});
test("o jogo exibe apenas Perícias adquiridas e elementos da ficha",()=>{
 assert.match(sheet(),/codex-owned-showcase/);
 assert.match(sheet(),/codex\.ownedSkills/);
 assert.match(sheet(),/codex\.ownedElements/);
 assert.match(js(),/SKILLS\.filter\(skill=>s\.skills\.includes\(skill\.id\)\)/);
});
test("assistente de criação tem DNA, três etapas e fecha sem reiniciar ficha anterior",()=>{
 for(const step of ["Identidade","Codex Genético","Revisão"])assert.match(js(),new RegExp('"'+step+'"'));
 assert.match(sheet(),/codex-wizard-nav/);
 assert.match(sheet(),/data-codex-gene/);
 assert.match(sheet(),/data-action="finishCreation"/);
 assert.match(sheet(),/data-action="wizardStep"/);
 assert.match(js(),/system\.creationOpen":false/);
 assert.match(model(),/creationOpen:new F\.BooleanField\(\{initial:!monster\}\)/);
});
test("criador reaproveita regras de XP e compras da ficha, sem importar economia de Assimilação",()=>{
 assert.match(js(),/canSpendXP\(s,difference,bucket\)/);
 assert.match(js(),/skillRequirements\(s,skill\.id\)/);
 assert.match(js(),/const ledger=xpLedger\(s\)/);
 assert.doesNotMatch(js(),/CHARACTER_BUILD_XP_TOTAL|ASSIMILATION\.CharacterBuild/);
});
test("paleta web Codex mantém E, A e P e componentes legíveis",()=>{
 for(const color of ["#267A45","#2369BB","#542176","#0c101a","#dec48e"])assert.ok(css().includes(color),color);
 assert.match(css(),/codex-wizard-layout/);
 assert.match(css(),/codex-owned-columns/);
});
