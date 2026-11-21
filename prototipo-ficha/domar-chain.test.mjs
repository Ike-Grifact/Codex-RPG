import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const source=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const between=(a,b)=>{const begin=source.indexOf(a),end=source.indexOf(b,begin+a.length);
 assert(begin>=0&&end>begin,"Trecho não encontrado: "+a);
 return source.slice(begin,end);};
const weaponMasteryDefs=between("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
const check=Function("racialGrants","ownsSkill","ADVANCED_SOURCE_DEFS","SOURCE_PROPS",weaponMasteryDefs+between("function skillReq(","function movement(")+"return {skillReq,dependentsValid};")(
 () => [],
 (id,s) => (s.skills||[]).includes(id),
 [],{}
);
const {skillReq,dependentsValid}=check;
const start=source.indexOf("const GENE_AUTO_REQUIREMENTS=");
const end=source.indexOf("\n};",start);
assert(start>=0&&end>start,"Tabela de compra assistida indisponível");
const auto=Function("return "+source.slice(start+"const GENE_AUTO_REQUIREMENTS=".length,end+3))();
const listStart=source.indexOf("const SKILLS="),listEnd=source.indexOf("];",listStart);
const prices=new Map(Function(weaponMasteryDefs+"return "+source.slice(listStart+"const SKILLS=".length,listEnd+2))()
 .map(([id,, ,xp])=>[id,xp]));
const base=()=>({
 attributes:{influencia:4,inteligencia:1},
 practices:{apresentacao:1,armas_conjuracao:0},
 knowledges:{alquimia:0,medicina:0},
 skills:[]
});
const pequena="domar-criatura-pequena",media="domar-criatura-media",grande="domar-criatura-grande";

test("Domar Média só é comprável com Pequena, mesmo com graus suficientes",()=>{
 const s=base();
 assert.match(skillReq(media,s),/Domar Criatura Pequena/);
 s.skills.push(pequena);
 assert.equal(skillReq(media,s),null);
 s.attributes.influencia=2;
 assert.match(skillReq(media,s),/Influência 3/);
});
test("Domar Grande exige Pequena E Média expressamente",()=>{
 const s=base();
 assert.match(skillReq(grande,s),/Domar Criatura Pequena/);
 assert.match(skillReq(grande,s),/Domar Criatura Média/);
 s.skills=[media];
 assert.match(skillReq(grande,s),/Domar Criatura Pequena/);
 s.skills=[pequena];
 assert.match(skillReq(grande,s),/Domar Criatura Média/);
 s.skills=[pequena,media];
 assert.equal(skillReq(grande,s),null);
 s.attributes.influencia=3;
 assert.match(skillReq(grande,s),/Influência 4/);
});
test("Reembolso não pode deixar Média sem Pequena nem Grande sem Média",()=>{
 const s=base();s.skills=[pequena,media,grande];
 assert.equal(dependentsValid(s),null);
 assert.match(dependentsValid({...s,skills:[media,grande]}),/Domar Criatura Pequena/);
 assert.match(dependentsValid({...s,skills:[pequena,grande]}),/Domar Criatura Média/);
 assert.equal(dependentsValid({...s,skills:[pequena]}),null);
});
test("Compra assistida inclui as duas Perícias anteriores e cobra três vezes 1 XP",()=>{
 assert.deepEqual(auto[media][0].filter(x=>x.startsWith("s:")),["s:"+pequena]);
 assert.deepEqual(auto[grande][0].filter(x=>x.startsWith("s:")),["s:"+pequena,"s:"+media]);
 const ordered=[],seen=new Set();
 const add=id=>{
  for(const req of auto[id]?.[0]||[])if(req.startsWith("s:"))add(req.slice(2));
  if(!seen.has(id)){seen.add(id);ordered.push(id);}
 };
 add(grande);
 assert.deepEqual(ordered,[pequena,media,grande]);
 assert.deepEqual(ordered.map(x=>prices.get(x)),[1,1,1]);
 assert.equal(ordered.reduce((total,x)=>total+prices.get(x),0),3);
});

test("Druídica custa 1 XP e exige Foco + Terra, não Domar",()=>{
 const d=base();d.practices.armas_conjuracao=1;d.practices.artesao=1;
 assert.match(skillReq("pericia-druidica",d),/Criar Item de Foco e Magia/);
 d.skills=["terra"];
 assert.match(skillReq("pericia-druidica",d),/Criar Item de Foco e Magia/);
 d.skills=["criar-item-foco-magia"];
 assert.match(skillReq("pericia-druidica",d),/Terra/);
 d.skills=["criar-item-foco-magia","terra"];
 assert.equal(skillReq("pericia-druidica",d),null);
 assert.equal(prices.get("pericia-druidica"),1);
});
test("Retirar Domar Média não remove a Druídica, mas bloqueia Domar Grande",()=>{
 const d=base();d.practices.armas_conjuracao=1;d.practices.artesao=1;
 d.skills=[pequena,media,"criar-item-foco-magia","terra","pericia-druidica"];
 assert.equal(dependentsValid(d),null);
 assert.equal(dependentsValid({...d,skills:d.skills.filter(x=>x!==media)}),null);
 d.skills.push(grande);
 assert.match(dependentsValid({...d,skills:d.skills.filter(x=>x!==media)}),/Domar Criatura Média/);
});
test("Druídica depende de Foco e Terra, independentemente de Domar",()=>{
 const d=base();d.practices.armas_conjuracao=1;d.practices.artesao=1;
 d.skills=["criar-item-foco-magia","terra","pericia-druidica"];
 assert.equal(dependentsValid(d),null);
 assert.equal(dependentsValid({...d,skills:[...d.skills,pequena]}),null);
 assert.match(dependentsValid({...d,skills:d.skills.filter(x=>x!=="terra")}),/Perícia Terra|Elemento Terra/);
 assert.match(dependentsValid({...d,skills:d.skills.filter(x=>x!=="criar-item-foco-magia")}),/Criar Item de Foco e Magia/);
});
test("Compra assistida da Druídica inclui somente Foco e Terra como Perícias diretas",()=>{
 assert.deepEqual(auto["pericia-druidica"][0],["s:criar-item-foco-magia","s:terra"]);
 assert.equal(auto["terra"][0].includes("s:criar-item-foco-magia"),false);
 assert.equal(auto["pericia-druidica"][0].some(x=>x.includes("domar")),false);
 assert.equal(prices.get("pericia-druidica"),1);
 assert.equal(prices.get("domar-criatura-grande"),1);
});
