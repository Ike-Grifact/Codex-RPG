import test from "node:test";
import assert from "node:assert/strict";
import {blank,stats,quickHumanoid,normalize} from "./rules.mjs";
import {creaturePool,rollCreatureFaces,previewCreatureRoll,settleCreatureRoll,
 publicJointCost,canDeclareJoint,faceSymbols,humanoidPool,previewHumanoidRoll,composeActionPool} from "./roll-engine.mjs";

test("Monstro G1 utiliza d10 e d4, respeitando pool e fontes diferentes",()=>{
 const t=blank("monstro");t.attributes.forca=1;
 const r=creaturePool(t,"forca","vigor");assert.equal(r.ok,true);
 assert.deepEqual(r.pool.map(d=>d.sides),[10,4]);
 assert.equal(creaturePool(t,"forca","forca").ok,false);
 assert.equal(creaturePool(blank("humanoide"),"forca","vigor").ok,false);
});
test("Faces simbólicas corretas, descarte sem Pavor e máximo de dados",()=>{
 const t=blank("monstro");t.attributes.forca=2;t.keep=2;
 const rolled=creaturePool(t,"forca","vigor").pool.map((d,i)=>({...d,face:i===2?3:1}));
 assert.deepEqual(faceSymbols(4,3),[0,0,1]);
 const r=previewCreatureRoll(t,rolled,rolled.slice(0,2).map(d=>d.id),{de:1});
 assert.equal(r.ok,true);
 assert.equal(r.result.p,0,"Pavor do dado descartado não entra na leitura");
 const generated=rollCreatureFaces(rolled,()=>0.999);
 assert(generated.every(d=>d.face===d.sides));
});
test("Gasto local de retenção só acontece na confirmação",()=>{
 const t=blank("monstro");t.attributes.forca=2;t.keep=3;t.pavorLocal=1;
 const rolled=rollCreatureFaces(creaturePool(t,"forca","vigor").pool,()=>0);
 const ids=rolled.map(d=>d.id);
 const preview=previewCreatureRoll(t,rolled,ids,{de:2});
 assert.equal(preview.ok,true);assert.equal(preview.cost,1);
 assert.equal(t.pavorLocal,1,"prévia não debita Pavor");
 const saved=settleCreatureRoll(t,2,3,preview);
 assert.equal(saved.ok,true);assert.equal(saved.unit.pavorLocal,0);
 assert.equal(saved.publicPavor,2);
 assert.equal(preview.result.damage,0);
 assert.equal(preview.result.p,0);
 const insufficient={...t,pavorLocal:0};
 assert.equal(previewCreatureRoll(insufficient,rolled,ids,{de:2}).ok,false);
});
test("Crítico de monstro retém Pavor local, depois público, sem duplicar",()=>{
 const t=blank("monstro");t.attributes.forca=1;t.pavorLocal=0;
 const rolled=rollCreatureFaces(creaturePool(t,"forca","vigor").pool,()=>0.99999);
 const p=previewCreatureRoll(t,rolled,rolled.map(d=>d.id),{de:1});
 assert.equal(p.ok,true);assert.equal(p.result.critical,2);
 assert.equal(p.criticalPavor,2);
 const out=settleCreatureRoll(t,2,3,p);
 assert.equal(out.unit.pavorLocal,2);
 assert.equal(out.publicPavor,2);
 assert.equal(out.localGain+out.publicGain+out.overflow,2);
 assert.equal(t.pavorLocal,0);
});
test("Pavor público de golpe conjunto segue 1P por aliado de Líder",()=>{
 const leader=blank("monstro"),ally=blank("criatura"),third=blank("monstro");
 leader.leader=true;
 assert.equal(publicJointCost(2),1);
 assert.equal(publicJointCost(3),2);
 assert.equal(publicJointCost(4),null);
 assert.equal(canDeclareJoint([leader,ally,third],2,3).ok,true);
 assert.equal(canDeclareJoint([leader,ally,third],1,3).ok,false);
 assert.equal(canDeclareJoint([ally,third],2,2).ok,false);
 leader.life=0;
 assert.equal(canDeclareJoint([leader,ally,third],2,2).ok,false);
});
test("Conversões de Antecipar não gastam o mesmo símbolo duas vezes",()=>{
 const t=blank("monstro");t.attributes.forca=2;
 const pool=creaturePool(t,"forca","vigor").pool;
 const dice=pool.map((d,i)=>({...d,face:i===0?8:1}));
 const ids=dice.slice(0,2).map(d=>d.id);
 const bad=previewCreatureRoll(t,dice,ids,{de:2,convertPairs:1,passA:true});
 assert.equal(bad.ok,false);
});


test("NPC humanoide rola Prática ou Conhecimento + Atributo, sem receber Perícia de graça",()=>{
 const npc=quickHumanoid();
 const valid=humanoidPool(npc,"practice","atletismo","forca");
 assert.equal(valid.ok,true);
 assert.deepEqual(valid.pool.map(d=>d.sides),[6,6]); // Atletismo G0 e Força G1
 const failed=humanoidPool(npc,"practice","armas_conjuracao","forca","armas");
 assert.equal(failed.ok,false);
 assert.match(failed.error,/Perícia/);
 npc.skills.push("armas-leves");
 const trained=humanoidPool(npc,"practice","armas_conjuracao","forca","armas");
 assert.equal(trained.ok,true);
 assert.deepEqual(trained.pool.map(d=>d.sides),[10,6]);
 const rolled=rollCreatureFaces(trained.pool,()=>0.9999);
 const got=previewHumanoidRoll(npc,rolled,rolled.map(x=>x.id),{de:1});
 assert.equal(got.ok,true);
 assert.equal(got.cost,0);
 assert.equal(got.result.critical,2);
 const confirmed=settleCreatureRoll(npc,2,4,got);
 assert.equal(confirmed.ok,true);
 assert.equal(confirmed.unit.pavorLocal,4); // já no teto
 assert.equal(confirmed.publicPavor,4); // excedente de crítico vai ao Pavor público
});

test("Retenção humana respeita Marco sem conceder quarto ou dado pago",()=>{
 const npc=quickHumanoid();npc.practices.atletismo=2;
 const pool=humanoidPool(npc,"practice","atletismo","forca");
 assert.equal(pool.ok,true);
 const dice=rollCreatureFaces(pool.pool,()=>0.5);
 assert.equal(dice.length,3);
 assert.equal(previewHumanoidRoll(npc,dice,dice.map(d=>d.id),{de:1}).ok,false);
 npc.level=6;npc.keep=3;
 const allowed=previewHumanoidRoll(npc,dice,dice.map(d=>d.id),{de:1});
 assert.equal(allowed.ok,true);
 assert.equal(allowed.cost,0);
 npc.keep=4;
 assert.equal(previewHumanoidRoll(npc,dice,dice.map(d=>d.id),{de:1}).ok,true);
});

test("Monstro com retenção planejada maior que a pilha não paga Pavor fictício",()=>{
 const npc=blank("monstro");npc.keep=3;npc.pavorLocal=4;
 const pool=creaturePool(npc,"forca","vigor");
 const dice=rollCreatureFaces(pool.pool,()=>0.5);
 assert.equal(dice.length,2);
 const result=previewCreatureRoll(npc,dice,dice.map(d=>d.id),{de:1});
 assert.equal(result.ok,true);
 assert.equal(result.cost,0);
});


test("Composição por clique: Disciplina + Força, elevação escolhida e XP intacto",()=>{
 const npc=quickHumanoid();
 const selection={baseGroup:"practice",baseKey:"armas_conjuracao",attribute:"forca",mode:"armas"};
 const basic=composeActionPool(npc,selection);
 assert.equal(basic.ok,true);
 assert.deepEqual(basic.pool.map(d=>d.sides),[10,6]);
 const step=composeActionPool(npc,selection,"practice.armas_conjuracao.0");
 assert.equal(step.ok,true);
 assert.deepEqual(step.pool.map(d=>d.sides),[12,6]);
 assert.equal(composeActionPool(npc,selection,"practice.armas_conjuracao.99").ok,false);
 assert.equal(composeActionPool(npc,selection,"attribute.forca.0").pool[1].sides,10);
 assert.equal(composeActionPool(npc,{...selection,extra:{group:"attribute",key:"destreza"},contextOK:true}).ok,false,
  "Terceira fonte não pode ser grátis");
});
test("Coragem é debitada somente ao confirmar: retenção mais elevação custa 2",()=>{
 const npc=quickHumanoid();npc.attributes.forca=2;
 const selection={baseGroup:"practice",baseKey:"armas_conjuracao",attribute:"forca",mode:"armas"};
 const pool=composeActionPool(npc,selection,"attribute.forca.0");
 assert.equal(pool.ok,true);
 assert.deepEqual(pool.pool.map(x=>x.sides),[10,10,6]);
 const rolled=rollCreatureFaces(pool.pool,()=>0.999);
 const kept=rolled.map(x=>x.id);
 const preview=previewHumanoidRoll(npc,rolled,kept,{de:1,extraKeep:true,stepDieId:"attribute.forca.0"});
 assert.equal(preview.ok,true);
 assert.equal(preview.courageCost,2);
 assert.equal(npc.courage,10);
 const result=settleCreatureRoll(npc,2,4,preview);
 assert.equal(result.ok,true);
 assert.equal(result.unit.courage,8);
 assert.equal(npc.courage,10);
 npc.courage=1;
 assert.equal(previewHumanoidRoll(npc,rolled,kept,{de:1,extraKeep:true,stepDieId:"attribute.forca.0"}).ok,false);
});
test("Integridade G1 normalizada conserva o dano sem inventar Grau superior",()=>{
 const m=blank("monstro");
 m.items=[{id:"arm1",name:"Armadura Leve",kind:"armor",qty:1,weight:0.125,
  integrityMax:7,integrity:5,equipped:true}];
 const saved=normalize(m);
 assert.equal(saved.items[0].integrityMax,7);
 assert.equal(saved.items[0].integrity,5);
 const restored=normalize(saved);
 assert.equal(restored.items[0].integrity,5);
});


test("Humanoide Monstro rola com Formação + Atributo e permite Perícias, mantendo o limite humanoide",()=>{
 const h=blank("humanoide-monstro");
 h.attributes.forca=1;h.practices.atletismo=1;h.skills=["montar"];
 const pool=humanoidPool(h,"practice","atletismo","forca");
 assert.equal(pool.ok,true);
 assert.deepEqual(pool.pool.map(x=>x.sides),[6,6]);
 assert.equal(creaturePool(h,"forca","vigor").ok,false);
 const combined=composeActionPool(h,{baseGroup:"practice",baseKey:"atletismo",attribute:"forca"});
 assert.equal(combined.ok,true);
 const rolled=rollCreatureFaces(combined.pool,()=>0.999);
 const preview=previewHumanoidRoll(h,rolled,rolled.map(x=>x.id),{de:1});
 assert.equal(preview.ok,true);
 assert.equal(preview.courageCost,0);
 assert.equal(previewCreatureRoll(h,rolled,rolled.map(x=>x.id),{de:1}).ok,false);
});
test("Perito Conjurador não concede terceira fonte em humanos antigos",()=>{
 const h=blank("humanoide");h.skills=["peritoconj","criar-item-foco-magia"];
 h.practices.armas_conjuracao=2;h.attributes.inteligencia=1;h.attributes.destreza=1;
 const sources={baseGroup:"practice",baseKey:"armas_conjuracao",attribute:"inteligencia",
  mode:"conjuracao",extra:{group:"attribute",key:"destreza"},contextOK:true};
 assert.equal(composeActionPool(h,sources).ok,false);
 h.skills.push("disciplina-avancada");
 assert.equal(composeActionPool(h,sources).ok,true);
});
test("Inimigo não humanoide Grau 2 mantém quatro dados por 2P; Grau 1 não mantém quatro",()=>{
 const enemy=blank("monstro");
 enemy.attributes.forca=2;enemy.attributes.agilidade=2;enemy.keep=4;
 const pool=creaturePool(enemy,"forca","agilidade");
 assert.equal(pool.ok,true);
 assert.equal(pool.pool.length,4);
 const rolled=rollCreatureFaces(pool.pool,()=>0.12),ids=rolled.map(d=>d.id);
 assert.equal(previewCreatureRoll(enemy,rolled,ids,{de:0}).ok,false);
 enemy.threatGrade=2;
 const p=previewCreatureRoll(enemy,rolled,ids,{de:0});
 assert.equal(p.ok,true);
 assert.equal(p.cost,2);
 const after=settleCreatureRoll(enemy,0,4,p);
 assert.equal(after.ok,true);
 assert.equal(after.spent,2);
 assert.equal(after.unit.pavorLocal,enemy.pavorLocal-2);
 assert.equal(enemy.pavorLocal,4,"Prévia não gasta Pavor");
 enemy.pavorLocal=1;
 assert.equal(previewCreatureRoll(enemy,rolled,ids,{de:0}).ok,false);
});
test("Humanoides inimigos Grau 2 podem reter quatro, pagando Coragem; nível sozinho não libera",()=>{
 for(const kind of ["humanoide","humanoide-monstro"]){
  const enemy=blank(kind);
  enemy.level=20;enemy.threatGrade=1;
  enemy.attributes.forca=2;enemy.practices.atletismo=2;
  const pool=humanoidPool(enemy,"practice","atletismo","forca");
  assert.equal(pool.ok,true);
  const rolled=rollCreatureFaces(pool.pool,()=>0.13),ids=rolled.map(d=>d.id);
  assert.equal(rolled.length,4);
  assert.equal(previewHumanoidRoll(enemy,rolled,ids,{de:0,extraKeep:true}).ok,false);
  enemy.level=1;enemy.threatGrade=2;
  assert.equal(previewHumanoidRoll(enemy,rolled,ids,{de:0,extraKeep:false}).ok,false);
  const p=previewHumanoidRoll(enemy,rolled,ids,{de:0,extraKeep:true});
  assert.equal(p.ok,true);
  assert.equal(p.courageCost,1);
  const post=settleCreatureRoll(enemy,0,4,p);
  assert.equal(post.ok,true);
  assert.equal(post.courageSpent,1);
  assert.equal(post.unit.courage,enemy.courage-1);
  enemy.courage=0;
  assert.equal(previewHumanoidRoll(enemy,rolled,ids,{de:0,extraKeep:true}).ok,false);
 }
});
