import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const app=readFileSync(join(root,"app.js"),"utf8");
const srd=readFileSync(join(root,"../docs/srd-continuidade-v0.84.md"),"utf8");
const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
const playtest=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
const page=slug=>readFileSync(join(root,"../pericias/"+slug+".html"),"utf8");
const codeBetween=(start,end)=>{
 const a=app.indexOf(start),b=app.indexOf(end,a+start.length);
 assert.ok(a>=0&&b>a,"O segmento da regra deve existir: "+start);
 return app.slice(a,b);
};
const RUNE_ELEMENTS=[["vento","Ar"],["agua","Água"],["terra","Terra"],["fogo","Fogo"]];
const PURE_ELEMENTS=[["sangue","Sangue"],["trevas","Trevas"],["veneno","Veneno"]];
const getGrants=new Function("state","RUNE_ELEMENTS","PURE_ELEMENTS",
 codeBetween("function racialGrants(","function ownsSkill(")+"\nreturn racialGrants;")(
 {},RUNE_ELEMENTS,PURE_ELEMENTS);
const shieldBarrier=new Function(
 codeBetween("function runeShieldBarrier(","function racialGrants(")+"\nreturn runeShieldBarrier;")();
const canEquipArmor=new Function("state",
 codeBetween("function canEquipArmor(","// Bônus de Maestria em Escudos:")+"\nreturn canEquipArmor;")({});

test("Runa: uma Pericia Elemental gratuita, substituindo a segunda por Escudo Runico",()=>{
 const state={race:"runa_espinhos",runeElements:["fogo","vento"]};
 assert.deepEqual(getGrants(state),["pugilismo","criar-item-foco-magia","escudo-arcano","fogo"]);
 for(const id of ["fogo","agua","terra","vento"]){
  const s={race:"runa_espinhos",runeElements:[id,"terra"]};
  const benefits=getGrants(s);
  assert.equal(benefits.length,4,"Tres Pericias preexistentes + 1 elemento");
  assert.equal(benefits.includes(id),true);
  assert.equal(benefits.includes("escudo-arcano"),true);
  assert.equal(benefits.includes("terra"),id==="terra","A segunda escolha nunca gera outra gratuidade");
 }
 assert.equal(getGrants({race:"runa_espinhos",runeElements:["","veneno"]}).length,3,"Sem escolha valida nao recebe segundo elemento");
 assert.ok(app.includes('Elemento inicial (1 gratuito)'),"O assistente oferece um unico elemento");
 assert.ok(!app.includes('[0,1].map(i=>\'<label class="fp-wiz-field">Elemento \''));
});

test("Runa: nao pode equipar qualquer armadura fisica, mas pode portar outros itens",()=>{
 const rune={race:"runa_espinhos",level:20,attributes:{vigor:6},practices:{atletismo:6}};
 const human={...rune,race:"humano"};
 for(const grade of [1,2,3,4]){
  for(const weight of ["muito_leve","leve","medio","alto","extremo"]){
   assert.equal(canEquipArmor(rune,{type:"armadura",grade,weight}),false);
  }
 }
 assert.equal(canEquipArmor(rune,{type:"escudo",grade:1,weight:"leve"}),true);
 assert.equal(canEquipArmor(human,{type:"armadura",grade:1,weight:"leve"}),true);
 assert.ok(app.includes('for(const item of state.items)if(item.type==="armadura"&&item.equipped&&!canEquipArmor(state,item))item.equipped=false'),"Troca racial retira armadura sem apagar item");
});

test("Escudo Runico: cada par de Pavores validos vira um Exito apenas na barreira",()=>{
 assert.deepEqual(shieldBarrier(2,3),{E:3,P:1,de:4,integrity:4,convertedPairs:1});
 assert.deepEqual(shieldBarrier(0,2),{E:1,P:0,de:1,integrity:1,convertedPairs:1});
 assert.deepEqual(shieldBarrier(4,1),{E:4,P:1,de:5,integrity:5,convertedPairs:0});
 assert.deepEqual(shieldBarrier(0,0),{E:0,P:0,de:0,integrity:0,convertedPairs:0});
 assert.ok(srd.includes("nem altera por si só Pressão"),"Não apagar consequências de Pavor");
 assert.ok(srd.includes("resistência a exatamente um elemento"),"Resistência não é imunidade geral");
 assert.ok(srd.includes("PENDENTE — resistência do Escudo Rúnico"),"Sem coeficiente inventado");
});

test("Uso gratuito diario: um registro persistido e renovacao explicitamente manual",()=>{
 assert.ok(app.includes("runeShieldFreeUsed:false"));
 assert.ok(app.includes("s.runeShieldFreeUsed=!!v.runeShieldFreeUsed"));
 assert.ok(app.includes('case "rune-shield-use"'),"Acao de gastar o uso");
 assert.ok(app.includes('case "rune-shield-reset"'),"Acao de restaurar o uso");
 assert.ok(app.includes('data-action="rune-shield-use"'));
 assert.ok(app.includes('data-action="rune-shield-reset"'));
 assert.ok(srd.includes("uma ativação de Escudo Rúnico por dia"));
 assert.ok(srd.includes("1 Coragem"),"Demais ativacoes normais permanecem pagas");
 assert.ok(!app.includes('runeShieldFreeUsed=false;renderRacePanel();save();toast("Perseverança Humana'),"Recursos de outras racas independentes");
});

test("Codex Genetico e fichas exibem Escudo Runico so para sua origem",()=>{
 assert.ok(app.includes('name:row[0]==="escudo-arcano"&&preview.race==="runa_espinhos"?"Escudo Rúnico":row[1]'));
 assert.ok(app.includes('const name=sid==="escudo-arcano"&&s.race==="runa_espinhos"?"Escudo Rúnico":baseName;'));
 assert.ok(app.includes('const name=id==="escudo-arcano"&&state.race==="runa_espinhos"?"Escudo Rúnico":baseName;'));
 assert.ok(page("escudo-arcano").includes("Escudo Rúnico"));
});

test("Acido mistura Fogo + Veneno sem compra ou dano extra arbitrario",()=>{
 for(const slug of ["pericia-em-elemento-fogo","pericia-em-elemento-veneno"]){
  const c=page(slug);
  assert.ok(c.includes("Ácido")&&c.includes("queimadura"));
  assert.ok(c.includes("PENDENTE"));
 }
 assert.ok(srd.includes("Fogo + Veneno = Ácido"));
 assert.ok(srd.includes("Não empilhar duas vezes o dano de Queimar"));
 assert.ok(srd.includes("Queimar substitui Sangramento"),"Queimar é gatilho do Ácido");
 assert.ok(srd.includes("um acúmulo de Veneno"),"Ácido transmite só um acúmulo");
 assert.ok(srd.includes("2 rodadas"),"Duração de Veneno vigente");
 assert.ok(app.includes("Ácido: Fogo + Veneno, em acerto com Queimar"));
});

test("Ar: corrente em L e X por passagem livre, sem atravessar paredes",()=>{
 const c=page("pericia-em-elemento-ar");
 assert.ok(c.includes("trajetória em L"));
 assert.ok(c.includes("parede sólida"));
 assert.ok(c.includes("PENDENTE"));
 assert.ok(srd.includes("linha, círculo, cone e X")&&srd.includes("percurso em L"));
 assert.ok(app.includes("Ar: corrente em L, X, linha, cone ou círculo"));
});

test("Revisao publicada com estados e precedencia no Livro e SRD",()=>{
 assert.ok(srd.includes("**DEFINIDO (21/11/2026):**"));
 assert.ok(srd.includes("**PENDENTE:**"));
 assert.ok(book.includes("Continuidade v0.84"));
 assert.ok(playtest.includes("Continuidade v0.84"));
 assert.ok(!srd.includes("18 XP iniciais"));
 assert.ok(srd.includes("15 XP iniciais e 260 XP no nível 20"));
});
