import test from "node:test";
import assert from "node:assert/strict";
import {normalizeCombatant,normalizeEquipment,listBrowserSheets,combatantSheetData,combatHealth,boostCombatSource,rollProvenance,selectedActiveSkill,armorOf,defense,equippedWeapons,
 weightAffinity,manejoPerfeitoBonus,hasCombatFocus,focusCombatStatus,lifeAtFive,transferPavor,updateResource,fulminanteWeaponDice,applyFulminanteToPool,validFulminanteForWeapon,hasSmallCompanion,markCondition,activeWeaponProperties,weaponActivationSkill,weaponMasteryFor,planWeaponEffects,weaponEffectOutcome,criticalFaces,bestKeepSelection} from "./comparador-logic.mjs";
import {resolveRoll} from "../criar-conflito/codex-rules.mjs";

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
  practices:{armas_conjuracao:3},
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
 assert.equal(sheet.disciplineGrade,3);
 assert(sheet.skills.some(x=>x.name==="Disciplina Avançada"));
 assert(sheet.skills.some(x=>x.name==="Perícia em Armas Leves"));
 assert.equal(sheet.practices.find(x=>x.id==="armas_conjuracao").grade,3);
 assert.equal(sheet.knowledges.find(x=>x.id==="erudicao").grade,1);
 assert.equal(sheet.items[0].integrity,6);
 assert.equal(sheet.concept,"Guarda arcano");
 assert.equal(sheet.abilities,"Imune a medo ritual");
 assert.equal(sheet.notes,"Vigiar a ponte");
 assert.deepEqual(raw.skills,["disciplina-avancada","armas-leves"],"Consulta não altera origem");
});

test("Foco do Lucker Puro vem da compra explícita; cópias não ganham Foco só por raça",()=>{
 const base={kind:"humanoide",race:"lucker_puro",pureElement:"fogo",
  name:"Conjurador Puro",attributes:{inteligencia:1,destreza:1},
  practices:{armas_conjuracao:1,artesao:1},skills:[]};
 const before=structuredClone(base);
 const noFocus=normalizeCombatant(base,"jogadores","Ficha de jogador");
 assert.deepEqual(noFocus.skills,["fogo"],"Só o elemento é concedido pela origem");
 assert.equal(hasCombatFocus(noFocus),false,"Requisitos sem compra não bastam");
 assert.match(focusCombatStatus(noFocus),/compre Criar Item de Foco e Magia por 0 XP/);
 assert.deepEqual(base,before,"Importação não altera a ficha de origem");
 const purchased=normalizeCombatant({...base,skills:["criar-item-foco-magia"]},"jogadores","Ficha de jogador");
 assert.equal(hasCombatFocus(purchased),true);
 assert.equal(combatantSheetData(purchased).focusStatus.includes("adquirido por 0 XP"),true);
 assert.deepEqual(normalizeCombatant(purchased,"jogadores","Cópia salva").skills,
  ["criar-item-foco-magia","fogo"],"Recarga não perde habilidade nem duplica elemento");
 const invalid=normalizeCombatant({...base,practices:{armas_conjuracao:1,artesao:0},
  skills:["criar-item-foco-magia"]},"inimigos","Ficha antiga");
 assert.equal(hasCombatFocus(invalid),false,"Foco legado com requisitos faltantes não habilita");
 assert.match(focusCombatStatus(invalid),/Foco registrado, mas inválido/);
 const rune=normalizeCombatant({kind:"humanoide",race:"runa_espinhos",runeElements:["terra"],
  skills:[]});
 assert.equal(hasCombatFocus(rune),true,"Runa Espinhos mantém Foco concedido pela origem");
 assert.equal(rune.skills.filter(x=>x==="criar-item-foco-magia").length,1);
 const blood=normalizeCombatant({kind:"humanoide",race:"lucker_sangue",skills:[]});
 assert.equal(hasCombatFocus(blood),false);
});

test("Busca no navegador conserva a Perícia comprada para importar ao comparador",()=>{
 const key="codex-rpg-jogador-ficha-v1:personagemA";
 const original={kind:"humanoide",race:"lucker_puro",name:"Pure de Teste",
  attributes:{inteligencia:1,destreza:1},practices:{armas_conjuracao:1,artesao:1},
  skills:["criar-item-foco-magia"],pureElement:"terra"};
 const data=new Map([["codex-rpg-jogadores-index-v1",JSON.stringify({sheets:[{id:"personagemA"}]})],
  [key,JSON.stringify({schema:"codex-jogador-ficha-v1",character:original})]]);
 const stored={getItem:id=>data.get(id)||null};
 const found=listBrowserSheets(stored);
 assert.equal(found.length,1);
 const combat=normalizeCombatant(found[0].raw,found[0].side,found[0].source);
 assert.equal(combat.race,"lucker_puro");
 assert.equal(hasCombatFocus(combat),true);
 assert.equal(combat.skills.filter(x=>x==="criar-item-foco-magia").length,1);
});

test("Ficha explicita quando Disciplina Avançada não existe ou não cumpre Grau",()=>{
 const absent=combatantSheetData(bare());
 assert.equal(absent.advancedDiscipline,false);
 assert.equal(absent.advancedReady,false);
 const onlyBought=normalizeCombatant({name:"Aprendiz",practices:{armas_conjuracao:2},
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


test("Buff Fulminante: UM dado de arma d6→d10, d10→d12, d12→2d12; sem d20",()=>{
 assert.deepEqual(fulminanteWeaponDice(6),[10]);
 assert.deepEqual(fulminanteWeaponDice(10),[12]);
 assert.deepEqual(fulminanteWeaponDice(12),[12,12]);
 assert.equal(fulminanteWeaponDice(20),null);
 for(const [before,after] of [[6,[10]],[10,[12]],[12,[12,12]]]){
  const weapon={id:"adaga",name:"Adaga",kind:"weapon",die:before,category:"leve"};
  const pool=[{id:"p",group:"practice",key:"armas_conjuracao",sides:10},
   {id:"a",group:"attribute",key:"forca",sides:6},
   {id:"w",group:"equipment",key:"adaga",sides:before}];
  const result=applyFulminanteToPool(pool,weapon,"golpe-fulminante");
  assert.equal(result.ok,true);
  assert.deepEqual(result.pool.filter(d=>d.group==="equipment").map(d=>d.sides),after);
  assert.equal(pool[2].sides,before,"Nunca alterar a pilha original");
 }
 const busy=Array.from({length:9},(_,i)=>({id:String(i),group:i===0?"equipment":"attribute",
   key:i===0?"adaga":"forca",sides:12}));
 assert.equal(applyFulminanteToPool(busy,{id:"adaga",name:"Adaga",kind:"weapon"},"golpe-fulminante").ok,false);
});
test("Disparo Fulminante só para arco/besta/arremesso habilitado, não arma de fogo",()=>{
 const bow={id:"b",name:"Arco Curto",kind:"weapon",category:"leve",die:6};
 const sword={id:"a",name:"Espada Longa",kind:"weapon",category:"medio",die:10};
 const pistol={id:"p",name:"Pistola",kind:"firearm",category:"leve",die:10};
 assert.equal(validFulminanteForWeapon(bow,"disparo-fulminante"),true);
 assert.equal(validFulminanteForWeapon(bow,"golpe-fulminante"),false);
 assert.equal(validFulminanteForWeapon(sword,"golpe-fulminante"),true);
 assert.equal(validFulminanteForWeapon(sword,"disparo-fulminante",true),true);
 assert.equal(validFulminanteForWeapon(pistol,"disparo-fulminante"),false);
});
test("Humanoide hostil não guarda Coragem, mas usa Pavor local",()=>{
 const enemy=normalizeCombatant({kind:"humanoide",courage:10,pavorLocal:3},"inimigos");
 assert.equal(enemy.courage,0);
 assert.equal(enemy.pavorLocal,3);
 const denied=updateResource(enemy,null,"coragem",1);
 assert.equal(denied.ok,false);
 assert.match(denied.error,/não possuem Coragem/);
 assert.equal(updateResource(enemy,null,"pavor",-1).actor.pavorLocal,2);
 assert.equal(normalizeCombatant({kind:"humanoide",courage:8},"jogadores").courage,8);
});
test("Domar Pequena requer animal domesticado presente para +1 Vida e serpente aplica condição sem dano fictício",()=>{
 const barePc=normalizeCombatant({kind:"humanoide",skills:["domar-criatura-pequena"],
  attributes:{vigor:1}},"jogadores");
 assert.equal(hasSmallCompanion(barePc),false);
 const pet=normalizeCombatant({kind:"humanoide",skills:["domar-criatura-pequena"],
  attributes:{vigor:1},smallCompanion:{present:true,name:"Naja",species:"serpente"}},"jogadores");
 assert.equal(hasSmallCompanion(pet),true);
 assert.equal(pet.life,barePc.life+1);
 const bleed=markCondition(pet,"sangramento",true);
 assert.equal(bleed.actor.statuses.sangramento,true);
 const poison=markCondition(bleed.actor,"envenenado",true);
 assert.equal(poison.actor.statuses.envenenado,true);
 assert.equal(poison.actor.life,pet.life,"Envenenamento não causa Vida direta inventada");
 assert.equal(markCondition(pet,"purificar",true).ok,false);
});


test("Características reais da arma só são ativadas com a Perícia e acerto, gratuito no crítico",()=>{
 const pc={skills:["armas-leves"],practices:{armas_conjuracao:1}},weapon={id:"k",kind:"weapon",name:"Faca",category:"leve",
  properties:["Cortante","Muito Leve"]};
 assert.deepEqual(activeWeaponProperties(weapon),["Cortante"]);
 assert.equal(weaponActivationSkill(pc,weapon).ok,true);
 assert.equal(weaponActivationSkill({skills:[]},weapon).ok,false);
 const common=planWeaponEffects(pc,weapon,["Cortante"],{success:true});
 assert.equal(common.ok,true);assert.equal(common.cost,1);
 assert.deepEqual(common.active,["Cortante"]);
 const crit=planWeaponEffects(pc,weapon,["Cortante"],{success:true,critical:2});
 assert.equal(crit.ok,true);assert.equal(crit.cost,0);
 const fail=planWeaponEffects(pc,weapon,["Cortante"],{success:false});
 assert.equal(fail.cost,0);assert.deepEqual(fail.active,[]);
 const effect=weaponEffectOutcome(common.active,armor(),weapon);
 assert.equal(effect.ok,true);assert.equal(effect.applied.sangramento,true);
 assert.equal(effect.applied.damage,undefined,"Sangramento não cria dano à Vida");
 const repeat=planWeaponEffects(pc,weapon,["Cortante","Cortante"],{success:true,critical:4});
 assert.equal(repeat.ok,false);
});
test("Perícia em Armas Leves ignora somente peso pesado e exige Disciplina 1",()=>{
 const weapon={id:"f",kind:"weapon",name:"Faca",category:"leve",equipped:true,properties:["Cortante"]};
 const heavy=normalizeCombatant({kind:"humanoide",items:[
  {id:"h",kind:"armor",name:"Armadura Pesada",category:"pesado",equipped:true}]}, "inimigos");
 const special=normalizeCombatant({kind:"humanoide",practices:{armas_conjuracao:1},skills:["armas-leves"]});
 const untrained=normalizeCombatant({kind:"humanoide",skills:["armas-leves"],practices:{armas_conjuracao:0}});
 assert.equal(weightAffinity(weapon,heavy).delta,-1,"−1A sem habilitação");
 assert.equal(weightAffinity(weapon,heavy,untrained).delta,-1,"Sem Disciplina 1 não ignora penalidade");
 assert.equal(weightAffinity(weapon,heavy,special).delta,0,"Perícia anula −1A e não cria +1A");
 assert.equal(weaponActivationSkill(special,weapon).ok,true);
 assert.equal(weaponActivationSkill(untrained,weapon).ok,false);
 assert.equal(planWeaponEffects(special,weapon,["Cortante"],{success:true}).cost,1);
 assert.equal(planWeaponEffects(special,weapon,["Cortante"],{success:true,critical:2}).cost,0);
 assert.equal(planWeaponEffects(special,weapon,["Cortante"],{success:false}).cost,0);
 assert.equal(planWeaponEffects(special,weapon,["Inexistente"],{success:true,critical:2}).ok,false);
 assert.equal(planWeaponEffects(untrained,weapon,["Cortante"],{success:true,critical:2}).ok,false);
});
test("Manejo Perfeito substitui +1A e Golpe Certo totaliza +2E sem duplicação",()=>{
 const weapon={id:"f",kind:"weapon",name:"Faca",category:"leve",equipped:true,properties:["Cortante"]};
 const medium=normalizeCombatant({kind:"humanoide",items:[
  {id:"m",kind:"armor",name:"Armadura Média",category:"medio",equipped:true}]},"inimigos");
 const attacker=normalizeCombatant({kind:"humanoide",attributes:{destreza:2},
  practices:{armas_conjuracao:3},skills:["manejo-perfeito","disciplina-avancada","armas-leves"]});
 const affinity=weightAffinity(weapon,medium,attacker);
 assert.equal(affinity.delta,1,"Afinidade concede +1A antes do Manejo");
 const defaults={mode:"armas",baseKey:"armas_conjuracao"};
 const normal=manejoPerfeitoBonus(attacker,weapon,affinity,{...defaults,situation:"normal"});
 assert.equal(normal.active,true);
 assert.equal(normal.bonusE,1);
 assert.equal(normal.golpeCerto,false);
 assert.equal(normal.suppressWeightA,true,"A afinidade +1A é substituída, não somada");
 const absolute=manejoPerfeitoBonus(attacker,weapon,affinity,{...defaults,situation:"absoluta"});
 assert.equal(absolute.active,true);
 assert.equal(absolute.golpeCerto,true);
 assert.equal(absolute.bonusE,1,"+1E sobre +1E da condição = +2E, nunca +3E");
 assert.match(absolute.description,/\+2E no total/);
 assert.equal(manejoPerfeitoBonus(attacker,weapon,affinity,{...defaults,situation:"absoluta",thrown:true}).active,false);
 assert.equal(manejoPerfeitoBonus({...attacker,practices:{armas_conjuracao:2}},weapon,affinity,defaults).active,false);
 assert.equal(manejoPerfeitoBonus({...attacker,skills:["manejo-perfeito"]},weapon,affinity,defaults).active,false);
 assert.equal(manejoPerfeitoBonus(attacker,weapon,{status:"known",delta:0},defaults).active,false);
 assert.equal(manejoPerfeitoBonus(attacker,{...weapon,equipped:false},affinity,defaults).active,false);
});
test("Maestria de espada: dois efeitos gratuitos no crítico, terceiro pago; normal apenas um",()=>{
 const weapon={id:"e",name:"Espada Longa",category:"medio",kind:"weapon",
  properties:["Cortante","Perfurante","Cravar"]};
 const pc={skills:["armas-medias","maestria-espadas"]};
 assert.equal(weaponMasteryFor(weapon),"maestria-espadas");
 assert.equal(planWeaponEffects(pc,weapon,["Cortante"],{success:true}).cost,0);
 assert.equal(planWeaponEffects(pc,weapon,["Cortante","Perfurante"],{success:true,critical:3}).cost,0);
 assert.equal(planWeaponEffects(pc,weapon,["Cortante","Perfurante","Cravar"],{success:true,critical:3}).cost,1);
 assert.equal(planWeaponEffects(pc,weapon,["Cortante","Perfurante"],{success:true}).ok,false);
 assert.equal(planWeaponEffects({skills:["maestria-espadas"]},weapon,["Cortante"],{success:true}).ok,false,
  "Maestria sozinha não substitui a Perícia do peso");
});
test("Cravar valida escudo físico e categoria; demais efeitos não inventam condição",()=>{
 const medium={name:"Lança de Arremesso",kind:"weapon",category:"medio",properties:["Cravar"]};
 const shieldTarget=normalizeCombatant({kind:"humanoide",items:[
  {name:"Escudo Pesado",kind:"shield",category:"pesado",equipped:true}]},"inimigos");
 assert.equal(weaponEffectOutcome(["Cravar"],shieldTarget,medium).ok,false);
 assert.equal(weaponEffectOutcome(["Cravar"],armor(),medium).ok,false);
 const heavy={...medium,category:"pesado"};
 const ok=weaponEffectOutcome(["Cravar"],shieldTarget,heavy);
 assert.equal(ok.ok,true);assert.equal(ok.applied.cravar,true);
 const pending=weaponEffectOutcome(["Contundente","Enganchar","Longa"],armor(),{});
 assert.deepEqual(pending.applied,{});
 assert.equal(pending.notes.length,3);
});
test("Face máxima dourada: d4 face 4 vazia conta, d10 face 10 e d6 face 6 formam crítico",()=>{
 const dice=[{id:"d4",sides:4,face:4},{id:"d10",sides:10,face:10},
  {id:"d6",sides:6,face:6},{id:"d12",sides:12,face:11}];
 const crit=criticalFaces(dice,["d4","d10","d6"]);
 assert.equal(crit.critical,3);
 assert.deepEqual(crit.faces.map(x=>x.face),[4,10,6]);
 assert.equal(crit.faces[0].max,true);
 assert.equal(criticalFaces(dice,["d10","d12"]).critical,0);
 assert.equal(criticalFaces(dice,["d10"]).critical,0);
});
test("Sugestão exaustiva prefere crítico limpo e valida custos e conversões",()=>{
 const pool=[{id:"a",group:"attribute",key:"forca",sides:10,face:10},
  {id:"b",group:"practice",key:"armas_conjuracao",sides:6,face:6},
  {id:"c",group:"equipment",key:"faca",sides:4,face:3}];
 function evaluate(ids,opts){
  const r=resolveRoll(pool,ids,{de:2,level:1,courage:10,...opts});
  return {ok:r.ok,result:r,integrityDamage:r.damage,courageCost:0,pavorCost:0,life:{damage:0}};
 }
 const result=bestKeepSelection(pool,2,evaluate);
 assert.deepEqual(result.ids,["a","b"]);
 assert.equal(result.preview.result.critical,2);
 assert.equal(result.preview.result.p,0);
 const budget=bestKeepSelection(pool,2,(ids,opts)=>
  ids.includes("b")?{ok:false,error:"Recurso insuficiente"}:evaluate(ids,opts));
 assert.equal(budget?.ids.includes("b"),false,"Jamais sugere combinação inválida por recursos");
 assert.equal(bestKeepSelection([],4,evaluate),null);
});
test("Propriedades do catálogo sobrevivem à importação de arma sem lista no item",()=>{
 const pc=normalizeCombatant({kind:"humanoide",skills:["armas-leves"],
  items:[{id:"f",name:"Faca",kind:"weapon",equipped:true,die:6}]},"jogadores");
 const list=equippedWeapons(pc,[{name:"Faca",kind:"weapon",category:"leve",die:6,properties:["Cortante"]}]);
 assert.deepEqual(activeWeaponProperties(list[0]),["Cortante"]);
});
