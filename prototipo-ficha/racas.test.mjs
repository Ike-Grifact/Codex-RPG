import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const start=source.indexOf("const AT_COST=");
const end=source.indexOf("const CREATE_BUDGET=");
assert.ok(start>=0&&end>start,"Constantes e funções raciais devem existir no criador");
const {RACES,racialGrants,ownsSkill,racialCostTable,racialXpBand,racialXpLabel,raceChoicesComplete,racialStartingAttributes,applyRacialStartingAttributes,AT_COST,TRAIN_COST,AT_DISCOUNT,AT_ELEVATED,TRAIN_DISCOUNT,TRAIN_ELEVATED}=new Function(
 source.slice(start,end)+";return {RACES,racialGrants,ownsSkill,racialCostTable,racialXpBand,racialXpLabel,raceChoicesComplete,racialStartingAttributes,applyRacialStartingAttributes,AT_COST,TRAIN_COST,AT_DISCOUNT,AT_ELEVATED,TRAIN_DISCOUNT,TRAIN_ELEVATED};"
)();

function character(race,more={}){
 return {race,skills:[],pureElement:"",runeElements:["",""],attributes:{},knowledges:{},practices:{},...more};
}

test("v0.61: Grau 1 automático dos Atributos favorecidos sem alterar custos",()=>{
 const cases=[
  ["lucker_sangue",["vigor","agilidade"]],
  ["lucker_puro",["inteligencia","destreza"]],
  ["runa_espinhos",["vigor","forca"]],
  ["humano",[]]
 ];
 for(const [race,expected] of cases){
  const c=character(race,{racialInitialAttributes:[]});
  applyRacialStartingAttributes(c);
  assert.deepEqual(racialStartingAttributes(race),expected);
  assert.deepEqual(c.racialInitialAttributes,expected);
  for(const key of expected){
   assert.equal(c.attributes[key],1);
   assert.equal(racialCostTable("attr",key,c)[1],0,"G1 não consome XP");
  }
  applyRacialStartingAttributes(c);
  assert.deepEqual(c.racialInitialAttributes,expected);
 }
 const changed=character("lucker_sangue",{racialInitialAttributes:[]});
 applyRacialStartingAttributes(changed);
 changed.attributes.agilidade=2; // avanço manual pago
 changed.race="lucker_puro";
 applyRacialStartingAttributes(changed);
 assert.equal(changed.attributes.agilidade,2,"graus superiores pagos nunca são apagados");
 assert.equal(changed.attributes.vigor,0,"G1 automático de raça anterior removido");
 assert.equal(changed.attributes.inteligencia,1);
 assert.equal(changed.attributes.destreza,1);
 assert.equal(changed.attributes.influencia||0,0,"Influência não é atributo racial do Puro");
 // Um grau comprado manualmente antes de escolher a raça não pode ser removido.
 const manual=character("humano",{racialInitialAttributes:[],attributes:{agilidade:1}});
 manual.race="lucker_sangue";applyRacialStartingAttributes(manual);
 assert.deepEqual(manual.racialInitialAttributes,["vigor"]);
 manual.race="lucker_puro";applyRacialStartingAttributes(manual);
 assert.equal(manual.attributes.agilidade,1,"compra manual de Agilidade foi preservada");
 assert.equal(manual.attributes.vigor,0,"grau automático anterior não foi preservado");
 assert.equal(manual.attributes.destreza,1,"Destreza concedida ao Lucker Puro");
  const human=character("humano",{racialInitialAttributes:[]});
 applyRacialStartingAttributes(human);
 assert.deepEqual(human.attributes,{},"Humano não recebe graus automáticos");
});

test("v0.64: custo racial exibido sem inventar descontos, alterações de custo ou graus",()=>{
 const cases=[
  ["humano",[],[]],
  ["lucker_sangue",["attr:vigor","attr:agilidade"],["attr:influencia","practice:apresentacao"]],
  ["lucker_puro",["attr:inteligencia","attr:destreza"],["attr:forca","practice:atletismo"]],
  ["runa_espinhos",["attr:vigor","attr:forca"],["attr:agilidade","attr:destreza"]]
 ];
 for(const [race,expectedDiscount,expectedElevated] of cases){
  const c=character(race);
  const actual={discount:[],elevated:[]};
  for(const [group,rows] of [["attr",["forca","agilidade","destreza","inteligencia","influencia","vigor"]],
   ["know",["protecao","astronomia","medicina","alquimia","engenharia","erudicao"]],
   ["practice",["armas_conjuracao","atletismo","furtividade","artesao","apresentacao","coleta"]]]){
   for(const key of rows){
    const before=[...racialCostTable(group,key,c)];
    const band=racialXpBand(group,key,c);
    if(actual[band])actual[band].push(group+":"+key);
    assert.deepEqual(racialCostTable(group,key,c),before,"Sinalização nunca altera preços");
   }
  }
  assert.deepEqual(actual.discount.sort(),expectedDiscount.sort(),race+": descontos apenas nas fontes oficiais");
  assert.deepEqual(actual.elevated.sort(),expectedElevated.sort(),race+": elevações apenas nas fontes oficiais");
 }
 assert.equal(racialXpLabel("discount"),"XP reduzido");
 assert.equal(racialXpLabel("elevated"),"XP aumentado");
 assert.equal(racialXpLabel("normal"),"XP normal");
});

test("quatro linhagens, sem criar classes obrigatórias",()=>{
 assert.deepEqual(Object.keys(RACES),["humano","lucker_sangue","lucker_puro","runa_espinhos"]);
 assert.deepEqual(racialGrants(character("humano")),["maestria-armas-fogo"]);
});

test("Lucker de Sangue inicia só com a Perícia de Sangue, sem Foco inventado",()=>{
 const c=character("lucker_sangue");
 assert.deepEqual(racialGrants(c),["sangue"]);
 assert.equal(ownsSkill("sangue",c),true);
 assert.equal(ownsSkill("criar-item-foco-magia",c),false);
});

test("Lucker Puro recebe Foco e somente Veneno como opção inicial da lista remanescente",()=>{
 const c=character("lucker_puro",{pureElement:"veneno"});
 assert.deepEqual(racialGrants(c),["criar-item-foco-magia","veneno"]);
 assert.equal(raceChoicesComplete(c),true);
 assert.equal(raceChoicesComplete(character("lucker_puro")),false);
 for(const invalid of ["sangue","trevas","fogo","agua","vento","terra","sagrado"]){
  const other=character("lucker_puro",{pureElement:invalid});
  assert.deepEqual(racialGrants(other),["criar-item-foco-magia"],invalid+" não é uma concessão de origem");
  assert.equal(raceChoicesComplete(other),false,invalid+" não completa a origem");
 }
 const bought=character("lucker_puro",{pureElement:"",skills:["sangue","trevas"]});
 assert.equal(ownsSkill("sangue",bought),true,"Compra de Sangue por XP permanece");
 assert.equal(ownsSkill("trevas",bought),true,"Compra de Trevas por XP permanece");
 assert.deepEqual(racialGrants(bought),["criar-item-foco-magia"]);
});

test("Livro e portal não apresentam opções raciais revogadas como gratuitas",()=>{
 const book=readFileSync(new URL("../docs/livro-do-jogador.md",import.meta.url),"utf8");
 const portal=readFileSync(new URL("../livro.html",import.meta.url),"utf8");
 assert.ok(!portal.includes("dois elementos diferentes entre Ar, Água, Terra e Fogo"));
 assert.ok(!portal.includes("Criar Item de Foco e Magia + Sangue, Trevas ou Veneno"));
 assert.match(portal,/Runa Espinhos<\\/strong>[\\s\\S]*?Escudo Rúnico/);
 assert.ok(book.includes("Sangue e Trevas **não podem ser selecionados como elementos gratuitos iniciais**"));
});

test("Migração da concessão Lucker Puro legada não vira XP nem apaga Perícia comprada",()=>{
 assert.ok(source.includes('s.race==="lucker_puro"&&["sangue","trevas"].includes(v.pureElement)'));
 assert.ok(source.includes('s.notes.includes("Elemento de origem Lucker Puro (legado):")'));
 assert.ok(source.includes('racialElementMigrated=raw.race==="lucker_puro"'));
 assert.ok(!source.includes('const PURE_ELEMENTS=[["sangue","Sangue"]'));
});

test("Runa Espinhos recebe Pugilismo, Foco, Escudo Rúnico e somente um elemento gratuito",()=>{
 const c=character("runa_espinhos",{runeElements:["vento","terra"]});
 assert.deepEqual(racialGrants(c),["pugilismo","criar-item-foco-magia","escudo-arcano","vento"]);
  assert.equal(ownsSkill("escudo-arcano",c),true);
  assert.equal(ownsSkill("terra",c),false,"O segundo elemento não é mais gratuito");
 assert.equal(raceChoicesComplete(c),true);
 assert.equal(raceChoicesComplete(character("runa_espinhos",{runeElements:["fogo","fogo"]})),true);
 assert.equal(raceChoicesComplete(character("runa_espinhos",{runeElements:["fogo",""]})),true);
 assert.deepEqual(racialGrants(character("runa_espinhos",{runeElements:["sangue","trevas"]})),["pugilismo","criar-item-foco-magia","escudo-arcano"]);
});

test("v0.56: seis Graus, três faixas acumuladas por tipo de fonte",()=>{
 assert.deepEqual(AT_COST,[0,1,3,6,9,18,32]);
 assert.deepEqual(AT_DISCOUNT,[0,0,2,4,7,12,24]);
 assert.deepEqual(AT_ELEVATED,[0,2,4,8,16,32,64]);
 assert.deepEqual(TRAIN_COST,[0,2,4,8,16,32,64]);
 assert.deepEqual(TRAIN_DISCOUNT,[0,1,3,6,9,18,32]);
 assert.deepEqual(TRAIN_ELEVATED,[0,3,6,12,24,48,96]);
 for(const tables of [[AT_DISCOUNT,AT_COST,AT_ELEVATED],[TRAIN_DISCOUNT,TRAIN_COST,TRAIN_ELEVATED]]){
  for(let g=0;g<=6;g++)assert.ok(tables[0][g]<=tables[1][g]&&tables[1][g]<=tables[2][g]);
  for(const table of tables)for(let g=1;g<=6;g++)assert.ok(table[g]>=table[g-1]);
 }
});
test("v0.56: fontes raciais favorecidas, normais e elevadas sem multiplicar 2x",()=>{
 const sangue=character("lucker_sangue"),puro=character("lucker_puro"),runa=character("runa_espinhos");
 for(const key of ["vigor","agilidade"])assert.deepEqual(racialCostTable("attr",key,sangue),AT_DISCOUNT);
 assert.deepEqual(racialCostTable("attr","influencia",sangue),AT_ELEVATED);
 assert.deepEqual(racialCostTable("practice","apresentacao",sangue),TRAIN_ELEVATED);
 for(const key of ["inteligencia","destreza"])assert.deepEqual(racialCostTable("attr",key,puro),AT_DISCOUNT);
 assert.deepEqual(racialCostTable("attr","influencia",puro),AT_COST,"Influência é de custo normal para o Puro");
 assert.deepEqual(racialCostTable("attr","forca",puro),AT_ELEVATED);
 assert.deepEqual(racialCostTable("practice","atletismo",puro),TRAIN_ELEVATED);
 for(const key of ["vigor","forca"])assert.deepEqual(racialCostTable("attr",key,runa),AT_DISCOUNT);
 for(const key of ["agilidade","destreza"])assert.deepEqual(racialCostTable("attr",key,runa),AT_ELEVATED);
 assert.deepEqual(racialCostTable("attr","destreza",sangue),AT_COST);
 assert.deepEqual(racialCostTable("practice","atletismo",sangue),TRAIN_COST);
 assert.deepEqual(racialCostTable("know","medicina",runa),TRAIN_COST);
 assert.deepEqual(racialCostTable("attr","forca",character("humano")),AT_COST);
});
test("v0.79: 15 XP no nível 1, 260 XP no nível 20; níveis 2-20 preservados",()=>{
 const reference=source.match(/const XP_LEVEL_REFERENCE=\[([^\]]+)\]/);
 assert.ok(reference);
 const xp=reference[1].split(",").map(Number);
 assert.equal(xp.length,21);
 assert.equal(xp[1],15);
 assert.equal(xp[2],28);
 assert.equal(xp[2]-xp[1],13); // nível 2 permanece em 28; a diferença acompanha o novo início de 15
 assert.equal(xp[20],260);
 assert.equal(xp[20]-xp[1],245);
 assert.match(source,/const CREATE_BUDGET=\{attr:15,training:15,skills:15,total:15\}/);
 assert.ok(xp.every((n,i)=>i===0||n>xp[i-1]));
 assert.match(source,/MAX_EARNED_XP=XP_LEVEL_REFERENCE\[20\]-CREATE_BUDGET\.total/);
 assert.match(source,/state\.xpEarned\+amount>MAX_EARNED_XP/);
 assert.match(source,/s\.xpEarned=clamp\(Math\.floor\(v\.xpEarned\?\?v\.xp\?\?0\),0,1000000\)/);
});
test("perícias raciais não são lançadas no ledger de XP como compras",()=>{
 const sourceLists=source.slice(source.indexOf("const A="),source.indexOf("const GROUPS="));
 const accounting=source.slice(source.indexOf("function rawCreationCosts("),source.indexOf("function unusedInitialXP("));
 assert.ok(sourceLists.includes("const P=")&&accounting.includes("racialCostTable"));
 const SKILLS=[
  ["sangue","Perícia em Elemento Sangue","",2],
  ["criar-item-foco-magia","Criar Item de Foco e Magia","",1],
  ["pugilismo","Pugilismo","",1],
  ["disciplina-avancada","Disciplina Avançada","",1],
  ["vento","Perícia em Elemento Ar","",1],
  ["trevas","Perícia em Elemento Trevas","",2]
 ];
 const calculate=new Function("racialCostTable","SKILLS",sourceLists+"\n"+accounting+"\nreturn rawCreationCosts;")(racialCostTable,SKILLS);
 const sangue=calculate(character("lucker_sangue",{
  attributes:{influencia:1,vigor:1},
  practices:{apresentacao:1}
 }));
 assert.equal(sangue.attr,2); // Influência elevada 2 + Vigor favorecido G1 grátis
 assert.equal(sangue.training,3); // Apresentação na faixa elevada (não 2x)
 assert.equal(sangue.skills,0); // Perícia de Sangue gratuita
 const rune=calculate(character("runa_espinhos",{runeElements:["fogo","agua"]}));
 assert.equal(rune.skills,0); // Foco, Pugilismo, Escudo Rúnico e primeiro elemento são grátis
 const bought=calculate(character("humano",{skills:["pugilismo"]}));
 assert.equal(bought.skills,1);
 const build=calculate(character("humano",{
  attributes:{inteligencia:2},practices:{armas_conjuracao:2,artesao:1},
  skills:["criar-item-foco-magia","disciplina-avancada","vento","trevas"]
 }));
 assert.deepEqual(build,{attr:3,training:6,skills:5});
 assert.equal(build.attr+build.training+build.skills,14);
 assert.equal(15-(build.attr+build.training+build.skills),1); // build de 14 XP: sobra 1 XP atual
});

test("origem é a raça na etapa de identidade e na ficha final, sem seletor duplicado",()=>{
 const html=readFileSync(new URL("./index.html",import.meta.url),"utf8");
 const form=source.slice(source.indexOf("function raceForm(){"),source.indexOf("function changeRace(id){"));
 const step=source.slice(source.indexOf("if(stage===0){"),source.indexOf("}else if(stage===1){"));
 assert.match(form,/Origem \/ Raça<select data-race-select/);
 assert.match(form,/function raceBenefitsForm\(\)/);
 assert.match(step,/\["race","Origem \/ Raça","",0\]/);
 assert.match(step,/field==="race"\?raceForm\(\)/);
 assert.match(step,/raceBenefitsForm\(\)/);
 assert.doesNotMatch(step,/\["origin","Origem narrativa"/);
 assert.equal((step.match(/raceForm\(\)/g)||[]).length,1);
 assert.match(html,/<label class="fp-field">Origem \/ Raça<select id="char-race"/);
 assert.doesNotMatch(html,/id="char-origin"|Origem narrativa|Linhagem \/ raça<select/);
 // Manter o dado antigo em JSON apenas para importar fichas históricas sem perda de informação.
 assert.match(source,/origin:"",race:"humano"/);
 assert.match(source,/\["name","concept","origin","virtue","personality","notes"\]/);
});

test("interface inclui seletor, persistência, salvaguardas e marcador manual de Perseverança",()=>{
 const html=readFileSync(new URL("./index.html",import.meta.url),"utf8");
 assert.ok(html.includes("race-benefit-panel")&&html.includes('id="char-race"'));
 assert.ok(source.includes("data-race-select")&&source.includes("data-race-element"));
 assert.ok(source.includes("case \"human-reroll-use\"")&&source.includes("case \"human-long-rest\""));
 assert.ok(source.includes("s.perseverancaUsed=!!v.perseverancaUsed"));
 assert.ok(source.includes("if(racialGrants(state).includes(id)){toast(\"Perícia racial não gera reembolso"));
 assert.ok(source.includes("if(!raceChoicesComplete())"));
});
