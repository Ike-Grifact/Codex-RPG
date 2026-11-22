import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const src=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const readFunction=(name)=>{
 const pattern=new RegExp("function "+name+"\\([^\\n]*\\)\\{[\\s\\S]*?\\n\\}");
 const match=src.match(pattern);
 assert.ok(match,"Função "+name+" encontrada na ficha");
 return new Function(match[0]+";return "+name+";")();
};

test("v0.89: DE da ficha soma Vigor com Destreza antes de dividir",()=>{
 const de=readFunction("deNatural");
 const fixture=(agilidade,vigor,destreza,atletismo=0)=>({
  attributes:{agilidade,vigor,destreza},practices:{atletismo}
 });
 assert.equal(de(fixture(0,0,0)),0,"sem +1 automático");
 assert.equal(de(fixture(1,1,1)),2,"ambos ímpares agregados");
 assert.equal(de(fixture(1,3,1)),3);
 assert.equal(de(fixture(1,2,2,3)),4,"Atletismo 3 vale +1");
 assert.equal(de(fixture(6,6,6,6)),9,"teto 9");
});

test("v0.89: foco encurta G2, sem aumentar dado",()=>{
 const tempo=readFunction("magicPreparationTurns");
 assert.equal(tempo(1,0,false),1);
 assert.equal(tempo(2,0,false),2);
 assert.equal(tempo(2,0,true),2,"foco sem carga não acelera G2");
 assert.equal(tempo(2,1,true),1,"G2 com foco consome 1 carga");
 assert.equal(tempo(2,1,false),2,"sem foco, carga não acelera");
 assert.equal(tempo(3,0,true),3);
 assert.equal(tempo(3,1,true),2);
 assert.equal(tempo(3,2,true),1);
 assert.equal(tempo(4,0,true,true),6);
 assert.equal(tempo(4,1,true,true),5);
 assert.equal(tempo(4,3,true,true),3);
 assert.equal(tempo(4,3,true,false),6,"G4 não usa foco único");
 assert.match(src,/if\(mode==="conjuracao"\)\{\s*\/\/ SRD v0\.89: apenas o Grau da magia adiciona seu dado, nunca o foco\.\s*return \[\];/);
 assert.ok(src.includes("const magicDice={1:[6],2:[10],3:[12],4:[12,12]}"));
 assert.ok(src.includes("magicDice.forEach((sides,i)"));
 assert.ok(src.includes("magicSecondElement"));
 assert.ok(src.includes("magicSecondFocusId"));
 assert.ok(src.includes("magicMixA"));
 assert.ok(src.includes("magicG4MixASpent"));
 assert.match(src,/group:"magic",key:"Magia G"/);
});

test("v0.89: revelação inicial, preparação pendente e defesa Muito Leve",()=>{
 assert.ok(src.includes("magicTimeConfirmed:draft.mode!==\"conjuracao\""));
 assert.ok(src.includes('case "magic-preparation-complete"'));
 assert.ok(src.includes("const magicWait=p.opts.magicElement"));
 assert.ok(src.includes('const CREATE_BUDGET={attr:15,training:15,skills:15,total:15}'));
 assert.ok(src.includes('it?.weight==="muito_leve"?2'));
 assert.ok(src.includes('function deDodge(s=state){return deDefense(s);}'));
});
