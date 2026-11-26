import test from "node:test";
import assert from "node:assert/strict";
import {blank,normalize,ledger,stats,humanoidRacialGrants,humanoidSkillCost,humanoidHasFocus,humanoidSourceCost} from "./rules.mjs";

test("Humanoide comum mantém a tabela aprovada do jogador; monstros não mudam",()=>{
 const t=blank("humanoide");
 t.attributes.forca=3;
 t.practices.armas_conjuracao=2;
 assert.equal(ledger(t).attrs,6);
 assert.equal(ledger(t).training,4);
 assert.equal(ledger(t).spent,10);
 assert.equal(humanoidSourceCost(t,"attr","forca")[6],32);
 assert.equal(humanoidSourceCost(t,"practice","atletismo")[6],64);
 const monster=blank("monstro");monster.attributes.forca=2;
 const hybrid=blank("humanoide-monstro");hybrid.attributes.forca=2;
 assert.equal(ledger(monster).attrs,8);
 assert.equal(ledger(hybrid).attrs,8);
});

test("Lucker Puro preserva escolha Sagrado, origem gratuita e XP de fontes",()=>{
 const t=blank("humanoide");t.race="lucker_puro";t.pureElement="sagrado";
 t.attributes.inteligencia=1;t.attributes.destreza=1;t.attributes.forca=1;
 t.practices.atletismo=1;
 t.skills=["criar-item-foco-magia","sagrado","montar"];
 const x=normalize(t);
 assert.equal(x.pureElement,"sagrado");
 assert.deepEqual(humanoidRacialGrants(x),["sagrado"]);
 assert.equal(humanoidSkillCost(x,"criar-item-foco-magia"),0,"Foco fica gratuito para Lucker Puro mesmo adquirido");
 assert.equal(ledger(x).attrs,2,"Inteligência e Destreza G1 são gratuitas; Força elevada custa 2");
 assert.equal(ledger(x).training,3,"Atletismo G1 elevado custa 3");
 assert.equal(ledger(x).skills,2,"Sagrado concedido e Foco explicitamente comprado custam zero; Montar consome 2");
 assert.equal(humanoidHasFocus(x),false,"Foco legado presente sem Disciplina e Artesão não habilita conjuração");
 assert.equal(ledger(x).spent,7);
 assert.equal(ledger(x).remaining,8);
 for(const invalid of ["sangue","trevas","veneno"]){
  const legacy=normalize({...t,pureElement:invalid,skills:[]});
  assert.equal(legacy.pureElement,"");
  assert.ok(!humanoidRacialGrants(legacy).includes(invalid));
 }
});

test("Lucker Puro não recebe Foco no cadastro nem no rolador antes de compra e requisitos",()=>{
 const fresh=blank("humanoide");fresh.race="lucker_puro";fresh.pureElement="fogo";
 fresh.attributes.inteligencia=1;fresh.attributes.destreza=1;
 const starting=normalize(fresh);
 assert.deepEqual(starting.skills,["fogo"],"Foco não aparece como aquisição espontânea");
 assert.equal(humanoidHasFocus(starting),false);
 starting.practices.armas_conjuracao=1;starting.practices.artesao=1;
 assert.equal(humanoidHasFocus(starting),false,"Cumprir os requisitos ainda não compra a Perícia");
 const before=ledger(starting).spent;
 starting.skills.push("criar-item-foco-magia");
 assert.equal(humanoidHasFocus(starting),true);
 assert.equal(ledger(starting).spent,before,"Compra explícita custa 0 XP");
 assert.equal(humanoidSkillCost(normalize({...fresh,race:"lucker_sangue"}),"criar-item-foco-magia"),1);
});
test("Runa Espinhos: exatamente um elemento e Escudo Rúnico sem segunda Perícia",()=>{
 const raw=blank("humanoide");
 raw.race="runa_espinhos";raw.runeElements=["terra","vento"];
 raw.attributes.forca=1;raw.attributes.vigor=1;
 const t=normalize(raw);
 assert.deepEqual(humanoidRacialGrants(t),["pugilismo","criar-item-foco-magia","escudo-arcano","terra"]);
 for(const perk of ["pugilismo","criar-item-foco-magia","escudo-arcano","terra"])assert.ok(t.skills.includes(perk));
 assert.ok(!t.skills.includes("vento"),"Segundo elemento não é gratuito");
 assert.equal(ledger(t).attrs,0);
 assert.equal(ledger(t).skills,0);
 assert.equal(ledger(t).remaining,15);
});

test("Lucker de Sangue e Humano mantêm seus benefícios sem custo adicional",()=>{
 const blood=normalize({...blank("humanoide"),race:"lucker_sangue",attributes:{vigor:1,agilidade:1}});
 assert.ok(blood.skills.includes("sangue"));
 assert.equal(ledger(blood).attrs,0);
 assert.equal(ledger(blood).skills,0);
 const human=normalize({...blank("humanoide"),race:"humano"});
 assert.ok(human.skills.includes("maestria-armas-fogo"));
 assert.equal(ledger(human).skills,0);
});

test("Capacidade de carga humanoide segue 1,5 + FOR + piso(VIG/2), sem Atletismo",()=>{
 const h=blank("humanoide");h.attributes.forca=2;h.attributes.vigor=1;h.practices.atletismo=1;
 h.practices.armas_conjuracao=6;
 assert.equal(stats(h).capacity,10,"Disciplina não aumenta a carga");
 h.practices.armas_conjuracao=0;
 assert.equal(stats(h).capacity,10);
 h.attributes.forca=0;h.attributes.vigor=0;h.practices.atletismo=0;
 assert.equal(stats(h).capacity,8);
});
