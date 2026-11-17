import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const start=source.indexOf("const AT_COST=");
const end=source.indexOf("const CREATE_BUDGET=");
assert.ok(start>=0&&end>start,"Constantes e funções raciais devem existir no criador");
const {RACES,racialGrants,ownsSkill,racialCostTable,raceChoicesComplete,AT_COST,TRAIN_COST}=new Function(
 source.slice(start,end)+";return {RACES,racialGrants,ownsSkill,racialCostTable,raceChoicesComplete,AT_COST,TRAIN_COST};"
)();

function character(race,more={}){
 return {race,skills:[],pureElement:"",runeElements:["",""],attributes:{},knowledges:{},practices:{},...more};
}

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

test("somente Lucker de Sangue tem penalidade numérica expressa, em Influência e Apresentação",()=>{
 const s=character("lucker_sangue");
 assert.deepEqual(racialCostTable("attr","influencia",s),AT_COST.map(x=>2*x));
 assert.deepEqual(racialCostTable("practice","apresentacao",s),TRAIN_COST.map(x=>2*x));
 assert.deepEqual(racialCostTable("attr","vigor",s),AT_COST);
 assert.deepEqual(racialCostTable("attr","agilidade",s),AT_COST);
 assert.deepEqual(racialCostTable("attr","forca",character("lucker_puro")),AT_COST);
 assert.deepEqual(racialCostTable("attr","destreza",character("runa_espinhos")),AT_COST);
});

test("perícias raciais não são lançadas no ledger de XP como compras",()=>{
 const sourceLists=source.slice(source.indexOf("const A="),source.indexOf("const GROUPS="));
 const accounting=source.slice(source.indexOf("function rawCreationCosts("),source.indexOf("function unusedInitialXP("));
 assert.ok(sourceLists.includes("const P=")&&accounting.includes("racialCostTable"));
 const SKILLS=[
  ["sangue","Perícia em Elemento Sangue","",2],
  ["criar-item-foco-magia","Criar Item de Foco e Magia","",1],
  ["pugilismo","Pugilismo","",1]
 ];
 const calculate=new Function("racialCostTable","SKILLS",sourceLists+"\n"+accounting+"\nreturn rawCreationCosts;")(racialCostTable,SKILLS);
 const sangue=calculate(character("lucker_sangue",{
  attributes:{influencia:1,vigor:1},
  practices:{apresentacao:1}
 }));
 assert.equal(sangue.attr,3); // Influência 2 + Vigor normal 1
 assert.equal(sangue.training,4); // Apresentação 2 x 2
 assert.equal(sangue.skills,0); // Perícia de Sangue gratuita
 const rune=calculate(character("runa_espinhos",{runeElements:["fogo","agua"]}));
 assert.equal(rune.skills,0); // Foco, Pugilismo e os elementos não são compras
 const bought=calculate(character("humano",{skills:["pugilismo"]}));
 assert.equal(bought.skills,1);
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
