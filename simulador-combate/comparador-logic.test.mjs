import test from "node:test";
import assert from "node:assert/strict";
import {normalizeCombatant,normalizeEquipment,listBrowserSheets,combatantSheetData,combatHealth,boostCombatSource,rollProvenance,selectedActiveSkill,armorOf,defense,equippedWeapons,
 weightAffinity,lifeAtFive,transferPavor,updateResource} from "./comparador-logic.mjs";

const bare=()=>normalizeCombatant({
 id:"p",name:"Aprendiz",kind:"humanoide",level:1,
 attributes:{agilidade:1,destreza:1,vigor:1},
 practices:{armas_conjuracao:1},skills:["armas-leves"],
 courage:8,pavorLocal:0,items:[]},"jogadores");

const armor=()=>normalizeCombatant({
 id:"e",name:"Saqueador",kind:"humanoide",
 attributes:{agilidade:1,destreza:1,vigor:1},
 items:[{id:"a",name:"Roupas Simples",kind:"armor",category:"muito-leve",
  grade:1,integrityMax:3,integrity:2,equipped:true}],
 pavorLocal:1,courage:10},"inimigos");

test("Cinco Êxitos contra alvo sem armadura: exatamente 2 Vida (não +2 Integridade)",()=>{
 const result=lifeAtFive({success:true,e:5,p:0},bare());
 assert.equal(result.eligible,true);
 assert.equal(result.damage,2);
 const mixed=lifeAtFive({success:true,e:3,p:2},bare());
 assert.equal(mixed.damage,2);
 assert.equal(lifeAtFive({success:true,e:0,p:5},bare()).damage,2,
  "Pavor válido é equivalente na contagem de cinco pontos");
 assert.equal(lifeAtFive({success:false,e:5,p:0},bare()).damage,0,
  "Falha contra DE maior não causa Vida");
});

test("Armadura equipada impede os 2 Vida diretos por patamar de cinco",()=>{
 const target=armor(),def=defense(target),source=bare();
 assert.equal(armorOf(target).integrity,1);
 assert.equal(def,4,"DE base 2 e armadura Muito Leve +2");
 const actual=lifeAtFive({success:true,e:5,p:0},target);
 assert.equal(actual.eligible,false);assert.equal(actual.damage,0);
 const hit=updateResource(target,"a","integridade",-2);
 assert.equal(hit.ok,true);
 assert.equal(hit.actor.items[0].integrity,0);
 assert.equal(hit.actor.life,target.life,"a redução de Integridade não retira Vida");
 assert.equal(lifeAtFive({success:true,e:5,p:0},hit.actor).damage,0,
  "Integridade zerada não equivale a retirar armadura automaticamente");
 assert.equal(source.life,bare().life);
});

test("Dano abaixo de cinco E+P sem armadura permanece explicitamente pendente",()=>{
 const low=lifeAtFive({success:true,e:3,p:1},bare());
 assert.equal(low.eligible,false);
 assert.equal(low.damage,null);
});

test("Peso tático usa armadura equipada, não peso total do inventário",()=>{
 const e=armor(),light={kind:"weapon",category:"leve"};
 assert.equal(weightAffinity(light,e).delta,0);
 const medium={kind:"weapon",category:"medio"};
 assert.equal(weightAffinity(medium,e).delta,1);
 const heavy={kind:"weapon",category:"pesado"};
 assert.equal(weightAffinity(heavy,e).delta,-1);
 assert.equal(weightAffinity(heavy,e,{skills:["armas-pesadas"]}).delta,0,
  "Especialista ignora Desvantagem por peso correspondente");
 const againstMedium={...e,items:[{...e.items[0],category:"medio"}]};
 assert.equal(weightAffinity(light,againstMedium).delta,1);
 assert.equal(weightAffinity(medium,againstMedium).delta,-1);
 assert.equal(weightAffinity({kind:"firearm",category:"leve"},e).status,"manual",
  "armas de fogo usam tabela específica");
});

test("Arma equipada exige especialização e recupera dados e alcance do catálogo",()=>{
 const p=bare();p.items=[{id:"w",name:"Adaga",kind:"weapon",category:"leve",die:6,equipped:true}];
 let weapons=equippedWeapons(p,[]);
 assert.equal(weapons.length,1);assert.equal(weapons[0].eligible,true);
 p.skills=[];
 weapons=equippedWeapons(p,[]);
 assert.equal(weapons[0].eligible,false);
});

test("Pavor mantido não anulado é transferido uma vez ao alvo inimigo",()=>{
 const p=bare(),e=armor();
 const moved=transferPavor(p,e,2);
 assert.equal(e.pavorLocal,1,"o estado de origem não é mutado");
 assert.equal(moved.target.pavorLocal,3);
 assert.equal(moved.publicPavor,0);
 assert.equal(moved.overflow,0);
 const capped=transferPavor(p,{...e,pavorLocal:3},4);
 assert.equal(capped.target.pavorLocal,4);
 assert.equal(capped.overflow,3,"excedente não ganha custo público inventado");
});

test("Pavor de ataque inimigo restaura Coragem do alvo jogador até o teto",()=>{
 const p=bare(),e=armor();
 const moved=transferPavor(e,p,3);
 assert.equal(moved.target.courage,10);
 assert.equal(p.courage,8);
});

test("Integridade de armadura da ficha e JSON é preservada",()=>{
 const item=normalizeEquipment({id:"a",name:"Armadura Leve",type:"armadura",weight:"leve",
  grade:1,max:7,hp:4,equipped:true});
 assert.equal(item.kind,"armor");assert.equal(item.integrity,2);
 assert.equal(item.integrityMax,5);assert.equal(item.category,"leve");
 const asCatalog=normalizeEquipment({name:"Roupas Simples",kind:"armor",
  category:"muito-leve",integrity:{value:3,max:3},equipped:true});
 assert.equal(asCatalog.integrity,2);assert.equal(asCatalog.integrityMax,2);
});

test("Busca as várias fichas de jogador, NPC e Criar Conflito do navegador sem escrever",()=>{
 const storage=new Map();
 const set=(key,value)=>storage.set(key,JSON.stringify(value));
 const raw={name:"Teste",attributes:{forca:1},practices:{armas_conjuracao:1}};
 set("codex-rpg-jogadores-index-v1",{sheets:[{id:"s1",name:"Primeiro"},{id:"s2",name:"Segundo"}]});
 set("codex-rpg-jogador-ficha-v1:s1",{schema:"codex-jogador-ficha-v1",character:{...raw,name:"Primeiro"}});
 set("codex-rpg-jogador-ficha-v1:s2",{schema:"codex-jogador-ficha-v1",character:{...raw,name:"Segundo"}});
 set("codex-html-ficha-npc-dna-v1",{...raw,name:"NPC de teste"});
 set("codex-rpg-criar-conflito-v1",{roster:[{...raw,name:"Ameaça"}]});
 const contentsBefore=[...storage.entries()];
 const profiles=listBrowserSheets({getItem:key=>storage.get(key)??null});
 assert.equal(profiles.length,4);
 assert.deepEqual(profiles.map(x=>x.name),["Primeiro","Segundo","NPC de teste","Ameaça"]);
 assert.deepEqual([...storage.entries()],contentsBefore);
});

test("Arco e revólver usam a tabela própria, sem copiar a matriz genérica",()=>{
 const t=armor();
 assert.equal(weightAffinity({kind:"weapon",name:"Arco Curto",category:"leve"},t).delta,-1);
 assert.equal(weightAffinity({kind:"weapon",name:"Arco Curto",category:"leve"},t,{skills:["armas-longo-alcance"]}).delta,0);
 assert.equal(weightAffinity({kind:"weapon",name:"Arco Longo",category:"medio"},t).delta,-1);
 assert.equal(weightAffinity({kind:"weapon",name:"Besta de uma mão",category:"leve"},t).delta,0);
 assert.equal(weightAffinity({kind:"firearm",name:"Revólver",category:"leve"},t).delta,-1);
 assert.equal(weightAffinity({kind:"firearm",name:"Revólver",category:"leve"},t,{skills:["armas-fogo"]}).delta,0);
 assert.equal(weightAffinity({kind:"firearm",name:"Sniper",category:"pesado"},t).delta,1);
 assert.equal(weightAffinity({kind:"firearm",name:"Escopeta",category:"pesado"},t).delta,1);
 assert.equal(weightAffinity({kind:"weapon",name:"Besta Pesada",category:"pesado"},t).status,"manual");
});


test("Ficha de humanoide exportado preserva Perícias, Disciplina Avançada e observações após recarregar",()=>{
 const raw={
  id:"npc-original",kind:"humanoide",name:"Feiticeiro do Conflito",
  concept:"Guarda arcano",abilities:"Imune a medo ritual",notes:"Vigiar a ponte",
  attributes:{inteligencia:2,destreza:1},
  knowledges:{erudicao:1},
  practices:{armas_conjuracao:2},
  skills:["disciplina-avancada","armas-leves"],
  items:[{id:"escudo",type:"escudo",name:"Escudo Rúnico",weight:"leve",max:8,hp:6,equipped:true}]
 };
 const first=normalizeCombatant(raw,"inimigos","Criar Conflito");
 const copied=normalizeCombatant(JSON.parse(JSON.stringify(first)),first.side,first.source);
 const sheet=combatantSheetData(copied);
 assert.equal(sheet.name,"Feiticeiro do Conflito");
 assert.equal(sheet.source,"Criar Conflito");
 assert.equal(copied.sourceId,"npc-original");
 assert.equal(sheet.advancedDiscipline,true);
 assert.equal(sheet.advancedReady,true);
 assert.equal(sheet.disciplineGrade,2);
 assert(sheet.skills.some(x=>x.name==="Disciplina Avançada"));
 assert(sheet.skills.some(x=>x.name==="Perícia em Armas Leves"));
 assert.equal(sheet.practices.find(x=>x.id==="armas_conjuracao").grade,2);
 assert.equal(sheet.knowledges.find(x=>x.id==="erudicao").grade,1);
 assert.equal(sheet.items[0].integrity,6);
 assert.equal(sheet.concept,"Guarda arcano");
 assert.equal(sheet.abilities,"Imune a medo ritual");
 assert.equal(sheet.notes,"Vigiar a ponte");
 assert.deepEqual(raw.skills,["disciplina-avancada","armas-leves"],"Consulta não altera origem");
});

test("Ficha explicita quando Disciplina Avançada não existe ou não cumpre Grau",()=>{
 const absent=combatantSheetData(bare());
 assert.equal(absent.advancedDiscipline,false);
 assert.equal(absent.advancedReady,false);
 const onlyBought=normalizeCombatant({name:"Aprendiz",practices:{armas_conjuracao:1},
  skills:["disciplina-avancada"]});
 const needsGrade=combatantSheetData(onlyBought);
 assert.equal(needsGrade.advancedDiscipline,true);
 assert.equal(needsGrade.advancedReady,false);
 const creature=normalizeCombatant({kind:"criatura",name:"Lobo",attributes:{forca:2},
  abilities:"Fareja rastros"}, "inimigos");
 const sheet=combatantSheetData(creature);
 assert.equal(creature.kind,"monstro","Fichas legadas de criatura continuam com regras de monstro");
 assert.equal(sheet.human,false);
 assert.equal(sheet.advancedReady,false);
 assert.equal(sheet.skills.length,0);
 assert.equal(sheet.attributes.find(x=>x.id==="forca").grade,2);
 assert.equal(sheet.abilities,"Fareja rastros");
});


test("Nerf G1: Integridade 2/5/8/12 com conservação de dano, idempotência e escudos preservados",()=>{
 const expected=[["Roupas Simples",3,2],["Armadura Leve",7,5],
  ["Armadura Média",12,8],["Armadura Pesada",17,12]];
 for(const [name,oldMax,nextMax] of expected){
  const old=normalizeEquipment({name,kind:"armor",grade:1,
   integrityMax:oldMax,integrity:oldMax-1,equipped:true});
  assert.equal(old.integrityMax,nextMax,name);
  assert.equal(old.integrity,nextMax-1,"Dano sofrido permanece 1");
  const again=normalizeEquipment(old);
  assert.deepEqual([again.integrityMax,again.integrity],[nextMax,nextMax-1]);
 }
 const shield=normalizeEquipment({name:"Escudo Leve",kind:"shield",integrityMax:9,integrity:6});
 assert.equal(shield.integrityMax,9);
 assert.equal(shield.integrity,6);
 const higher=normalizeEquipment({name:"Armadura Leve",kind:"armor",grade:2,
  integrityMax:12,integrity:7});
 assert.equal(higher.integrityMax,12,"G2 não foi modificado");
});

test("Saúde prejudica inimigos e jogadores pelos mesmos estados de Vida",()=>{
 const a=bare(),b=armor();
 for(const life of [0,1,2,3,4,5]){
  a.life=life;b.life=life;
  const one=combatHealth(a),two=combatHealth(b);
  assert.equal(one.id,two.id);
  assert.deepEqual([one.e,one.a,one.p,one.coragem],[two.e,two.a,two.p,two.coragem]);
 }
 assert.deepEqual([combatHealth({...a,life:2}).e,combatHealth({...a,life:2}).p],[-1,1]);
 assert.equal(combatHealth({...a,life:1}).coragem,2);
 assert.equal(combatHealth({...a,life:0}).id,"morto");
});

test("Elevar uma fonte inteira altera sua tabela de dados sem comprar Grau",()=>{
 const npc=normalizeCombatant({kind:"humanoide",practices:{armas_conjuracao:2},attributes:{vigor:1}});
 let boost=boostCombatSource(npc,"practice","armas_conjuracao");
 assert.equal(boost.ok,true);
 assert.deepEqual(boost.before,[10,10]);
 assert.deepEqual(boost.after,[10,10,10]);
 assert.equal(npc.practices.armas_conjuracao,2,"Grau comprado nunca muda");
 npc.practices.armas_conjuracao=3;
 boost=boostCombatSource(npc,"practice","armas_conjuracao");
 assert.deepEqual(boost.after,[10,10,12]);
 assert.equal(boostCombatSource({...npc,practices:{armas_conjuracao:6}},
  "practice","armas_conjuracao").ok,false);
 const beast=normalizeCombatant({kind:"monstro",attributes:{forca:1}});
 assert.deepEqual(boostCombatSource(beast,"attribute","forca").after,[10,10]);
 assert.equal(boostCombatSource(beast,"practice","armas_conjuracao").ok,false);
});

test("Rastreio de símbolos identifica origem das faces, equipamento e descartes",()=>{
 const rolls=[{id:"p.0",group:"practice",key:"armas_conjuracao",sides:10,face:10},
  {id:"a.0",group:"attribute",key:"forca",sides:6,face:5,boosted:true},
  {id:"w",group:"equipment",key:"adaga",sides:6,face:3}];
 const rows=rollProvenance(rolls,["p.0","a.0"],{weapon:"Adaga"});
 assert.deepEqual(rows.map(x=>[x.source,x.e,x.a,x.p,x.kept]),[
  ["Disciplina",2,1,0,true],["Força",0,1,1,true],["Adaga",0,0,1,false]]);
 assert.equal(rows[1].step,true);
});

test("Perícia ativa só pode ser registrada se adquirida na ficha",()=>{
 const a=bare();
 assert.equal(selectedActiveSkill(a,"disciplina-avancada"),null);
 const owned=selectedActiveSkill(a,"armas-leves");
 assert.equal(owned.id,"armas-leves");
 assert.match(owned.name,/Armas Leves/);
});
