import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const between=(a,b)=>{
 const start=source.indexOf(a),end=source.indexOf(b,start+a.length);
 assert.ok(start>=0&&end>start,"Trecho esperado não encontrado: "+a);
 return source.slice(start,end);
};
const {skillReq,dependentsValid}=Function("racialGrants","ownsSkill","ADVANCED_SOURCE_DEFS","SOURCE_PROPS",
 between("function skillReq(","function movement(")+"return {skillReq,dependentsValid};")(
 ()=>[],(id,s)=>(s.skills||[]).includes(id),[],{});
const start=source.indexOf("const GENE_AUTO_REQUIREMENTS="),end=source.indexOf("\n};",start);
assert.ok(start>=0&&end>start);
const auto=Function("return "+source.slice(start+"const GENE_AUTO_REQUIREMENTS=".length,end+3))();
const player=()=>({
 attributes:{influencia:2,inteligencia:1,vigor:0,destreza:0},
 practices:{armas_conjuracao:1,apresentacao:1,artesao:0},
 knowledges:{alquimia:0,medicina:0},
 skills:[]
});

test("Ar/Água/Terra/Fogo: apenas Disciplina 1 + Inteligência 1",()=>{
 for(const id of ["fogo","agua","vento","terra"]){
  const s=player();s.skills=[id];
  assert.equal(skillReq(id,s),null,id);
  assert.equal(dependentsValid(s),null,id);
  assert.deepEqual(auto[id][0],["p:armas_conjuracao:1","a:inteligencia:1"]);
  s.practices.armas_conjuracao=0;
  assert.match(skillReq(id,s),/Disciplina 1/);
 }
});
test("Sagrado/Sangue/Trevas: apenas Disciplina 2 + Inteligência 2",()=>{
 for(const id of ["sagrado","sangue","trevas"]){
  const s=player();s.practices.armas_conjuracao=2;s.attributes.inteligencia=2;s.skills=[id];
  assert.equal(skillReq(id,s),null,id);
  assert.equal(dependentsValid(s),null,id);
  assert.deepEqual(auto[id][0],["p:armas_conjuracao:2","a:inteligencia:2"]);
  s.attributes.inteligencia=1;
  assert.match(skillReq(id,s),/Inteligência 2/);
 }
});
test("Veneno continua exigindo Disciplina, Inteligência, Alquimia e Medicina 2",()=>{
 const s=player();s.practices.armas_conjuracao=2;s.attributes.inteligencia=2;
 s.knowledges.alquimia=2;s.knowledges.medicina=2;s.skills=["veneno"];
 assert.equal(skillReq("veneno",s),null);
 s.knowledges.medicina=1;
 assert.match(skillReq("veneno",s),/Medicina 2/);
 assert.deepEqual(auto.veneno[0],["p:armas_conjuracao:2","a:inteligencia:2","k:alquimia:2","k:medicina:2"]);
});
test("Druídica G1 não tem mais dependência indireta de Foco",()=>{
 const s=player();s.skills=["domar-criatura-pequena","terra","pericia-druidica"];
 assert.equal(dependentsValid(s),null);
 assert.deepEqual(auto["pericia-druidica"][0],["s:domar-criatura-pequena","s:terra"]);
});
test("Escudo Arcano e Improviso conservam exigência própria de Foco",()=>{
 const s=player();s.attributes.inteligencia=2;s.attributes.vigor=1;s.attributes.destreza=1;
 s.skills=["escudo-arcano","improviso"];
 assert.match(skillReq("escudo-arcano",s),/Criar Item de Foco e Magia/);
 assert.match(skillReq("improviso",s),/Criar Item de Foco e Magia/);
});
test("Rolador da ficha deixa usar elemento em Conjuração sem a Perícia de Foco",()=>{
 assert.match(source,/ELEMENTAL_SKILL_IDS\.some\(ownsSkill\)/);
 assert.match(source,/ownsSkill\("criar-item-foco-magia"\)\|\|ELEMENTAL_SKILL_IDS/);
});
