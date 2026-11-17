import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const start=source.indexOf("const AT_COST=");
const end=source.indexOf("const CREATE_BUDGET=");
assert.ok(start>=0&&end>start,"Constantes e funções raciais devem existir no criador");
const {RACES,racialGrants,ownsSkill,racialCostTable,raceChoicesComplete,racialStartingAttributes,applyRacialStartingAttributes,AT_COST,TRAIN_COST,AT_DISCOUNT,AT_ELEVATED,TRAIN_DISCOUNT,TRAIN_ELEVATED}=new Function(
 source.slice(start,end)+";return {RACES,racialGrants,ownsSkill,racialCostTable,raceChoicesComplete,racialStartingAttributes,applyRacialStartingAttributes,AT_COST,TRAIN_COST,AT_DISCOUNT,AT_ELEVATED,TRAIN_DISCOUNT,TRAIN_ELEVATED};"
)();

function character(race,more={}){
 return {race,skills:[],pureElement:"",runeElements:["",""],attributes:{},knowledges:{},practices:{},...more};
}

test("v0.61: Grau 1 automático dos Atributos favorecidos sem alterar custos",()=>{
 const cases=[
  ["lucker_sangue",["vigor","agilidade"]],
  ["lucker_puro",["inteligencia","influencia"]],
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
 assert.equal(changed.attributes.influencia,1);
 const human=character("humano",{racialInitialAttributes:[]});
 applyRacialStartingAttributes(human);
 assert.deepEqual(human.attributes,{},"Humano não recebe graus automáticos");
});

test("quatro linhagens, sem criar classes obrigatórias",()=>{
 assert.deepEqual(Object.keys(RACES),["humano","lucker_sangue","lucker_puro","runa_espinhos"]);
 assert.deepEqual(racialGrants(character("humano")),[]);
});

test("Lucker de Sangue inicia só com a Perícia de Sangue, sem Foco inventado",()=>{
 const c=character("lucker_sangue");
 assert.deepEqual(racialGrants(c),["sangue"]);
 assert.equal(ownsSkill("sangue",c),true);
 assert.equal(ownsSkill("criar-item-foco-magia",c),false);
});

test("Lucker Puro recebe Foco e exatamente uma Perícia elemental escolhida",()=>{
 const c=character("lucker_puro",{pureElement:"veneno"});
 assert.deepEqual(racialGrants(c),["criar-item-foco-magia","veneno"]);
 assert.equal(raceChoicesComplete(c),true);
 assert.equal(raceChoicesComplete(character("lucker_puro")),false);
 assert.deepEqual(racialGrants(character("lucker_puro",{pureElement:"fogo"})),["criar-item-foco-magia"]);
});

test("Runa Espinhos recebe Pugilismo, Foco e duas escolas distintas permitidas",()=>{
 const c=character("runa_espinhos",{runeElements:["vento","terra"]});
 assert.deepEqual(racialGrants(c),["pugilismo","criar-item-foco-magia","vento","terra"]);
 assert.equal(raceChoicesComplete(c),true);
 assert.equal(raceChoicesComplete(character("runa_espinhos",{runeElements:["fogo","fogo"]})),false);
 assert.equal(raceChoicesComplete(character("runa_espinhos",{runeElements:["fogo",""]})),false);
 assert.deepEqual(racialGrants(character("runa_espinhos",{runeElements:["sangue","trevas"]})),["pugilismo","criar-item-foco-magia"]);
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
 for(const key of ["inteligencia","influencia"])assert.deepEqual(racialCostTable("attr",key,puro),AT_DISCOUNT);
 assert.deepEqual(racialCostTable("attr","forca",puro),AT_ELEVATED);
 assert.deepEqual(racialCostTable("practice","atletismo",puro),TRAIN_ELEVATED);
 for(const key of ["vigor","forca"])assert.deepEqual(racialCostTable("attr",key,runa),AT_DISCOUNT);
 for(const key of ["agilidade","destreza"])assert.deepEqual(racialCostTable("attr",key,runa),AT_ELEVATED);
 assert.deepEqual(racialCostTable("attr","destreza",sangue),AT_COST);
 assert.deepEqual(racialCostTable("practice","atletismo",sangue),TRAIN_COST);
 assert.deepEqual(racialCostTable("know","medicina",runa),TRAIN_COST);
 assert.deepEqual(racialCostTable("attr","forca",character("humano")),AT_COST);
});
test("v0.58: 18 XP no nível 1, 260 XP no nível 20 e até 242 XP de evolução",()=>{
 const reference=source.match(/const XP_LEVEL_REFERENCE=\[([^\]]+)\]/);
 assert.ok(reference);
 const xp=reference[1].split(",").map(Number);
 assert.equal(xp.length,21);
 assert.equal(xp[1],18);
 assert.equal(xp[2],28);
 assert.equal(xp[2]-xp[1],10); // o nível 2 mantém o referencial anterior; não reduzir a curva sem aprovação
 assert.equal(xp[20],260);
 assert.equal(xp[20]-xp[1],242);
 assert.match(source,/const CREATE_BUDGET=\{attr:18,training:18,skills:18,total:18\}/);
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
 assert.equal(rune.skills,0); // Foco, Pugilismo e os elementos não são compras
 const bought=calculate(character("humano",{skills:["pugilismo"]}));
 assert.equal(bought.skills,1);
 const build=calculate(character("humano",{
  attributes:{inteligencia:2},practices:{armas_conjuracao:2,artesao:1},
  skills:["criar-item-foco-magia","disciplina-avancada","vento","trevas"]
 }));
 assert.deepEqual(build,{attr:3,training:6,skills:5});
 assert.equal(build.attr+build.training+build.skills,14);
 assert.equal(18-(build.attr+build.training+build.skills),4); // build de 14 XP: sobram 4 XP
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
