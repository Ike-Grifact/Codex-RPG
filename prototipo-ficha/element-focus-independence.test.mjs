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
test("Druídica exige Foco e Terra, mas nunca Domar ou Influência",()=>{
 const s=player();s.attributes.influencia=0;s.practices.apresentacao=0;
 s.skills=["pericia-druidica","terra","criar-item-foco-magia"];
 assert.equal(skillReq("pericia-druidica",s),null);
 assert.deepEqual(auto["pericia-druidica"][0],["s:criar-item-foco-magia","s:terra"]);
 s.skills=["pericia-druidica","terra"];
 assert.match(skillReq("pericia-druidica",s),/Criar Item de Foco e Magia/);
 s.skills=["pericia-druidica","criar-item-foco-magia"];
 assert.match(skillReq("pericia-druidica",s),/Terra/);
});
test("Transformação Elemental custa 1 XP e exige Foco + qualquer Perícia Elemental",()=>{
 const s=player();s.skills=["transformacao-elemental","criar-item-foco-magia","terra"];
 assert.equal(skillReq("transformacao-elemental",s),null);
 assert.deepEqual(auto["transformacao-elemental"][2],["s:criar-item-foco-magia","s:terra"]);
 s.skills=["transformacao-elemental","terra"];
 assert.match(skillReq("transformacao-elemental",s),/Criar Item de Foco e Magia/);
 s.skills=["transformacao-elemental","criar-item-foco-magia"];
 assert.match(skillReq("transformacao-elemental",s),/Perícia em Elemento/);
 s.skills=["transformacao-elemental","criar-item-foco-magia","fogo"];
 assert.equal(skillReq("transformacao-elemental",s),null);
 const definitions=between("const SKILLS=", "// IDs de Perícias legadas");
 assert.match(definitions,/\x22transformacao-elemental\x22,\s*\x22Transformação Elemental\x22,[\s\S]*?\b1\b/);
});
test("Improviso não exige Foco; Escudo Arcano ainda exige",()=>{
 const s=player();s.attributes.inteligencia=2;s.attributes.vigor=1;s.attributes.destreza=1;
 s.skills=["escudo-arcano","improviso"];
 assert.match(skillReq("escudo-arcano",s),/Criar Item de Foco e Magia/);
 assert.equal(skillReq("improviso",s),null);
});
test("Rolador da ficha deixa usar elemento em Conjuração sem a Perícia de Foco",()=>{
 assert.match(source,/ELEMENTAL_SKILL_IDS\.some\(ownsSkill\)/);
 assert.match(source,/ownsSkill\("criar-item-foco-magia"\)\|\|ELEMENTAL_SKILL_IDS/);
});

test("Improviso Elemental compra com Disciplina 1, Inteligência 1, Destreza 1 e 1 XP, sem Criar Foco",()=>{
 const s=player();s.attributes.destreza=1;s.skills=["improviso"];
 assert.equal(skillReq("improviso",s),null);
 assert.equal(dependentsValid(s),null);
 assert.deepEqual(auto.improviso[0],["p:armas_conjuracao:1","a:inteligencia:1","a:destreza:1"]);
 s.attributes.destreza=0;
 assert.match(skillReq("improviso",s),/Destreza 1/);
});
test("Remover Criar Foco não invalida Improviso; Maestria conserva requisito próprio de Foco",()=>{
 const s=player();s.attributes.destreza=3;s.attributes.inteligencia=3;s.practices.armas_conjuracao=3;
 s.skills=["improviso"];
 assert.equal(dependentsValid(s),null);
 s.skills=["improviso","mestre","fogo"];
 assert.match(skillReq("mestre",s),/Criar Item de Foco e Magia/);
});
