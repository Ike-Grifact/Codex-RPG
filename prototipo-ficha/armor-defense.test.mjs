import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";

const src=readFileSync(new URL("./app.js",import.meta.url),"utf8");
const start=src.indexOf("function deNatural(s=state)");
const end=src.indexOf("function balance(){",start);
assert.ok(start>=0&&end>start,"Lógica defensiva do criador disponível");
const {deNatural,canEquipArmor,equippedArmor,armorDePenalty,armorDodgeBonus,deDefense,deDodge,defensePresentation}=new Function("ownsSkill",
 src.slice(start,end)+";return {deNatural,canEquipArmor,equippedArmor,armorDePenalty,armorDodgeBonus,deDefense,deDodge,defensePresentation};"
)((id,s)=>!!s?.skills?.includes(id));
const character=(weight="leve",equipped=true,more={})=>({
 level:1,attributes:{agilidade:2,destreza:0,vigor:0},practices:{atletismo:0},
 items:[{name:"Armadura de teste",type:"armadura",weight,grade:1,equipped,max:7,hp:7}],...more
});

test("v0.147: armadura Leve reduz DE geral de 3 para 2, independente da esquiva",()=>{
 const s=character();
 assert.equal(deNatural(s),3);
 assert.equal(armorDodgeBonus(s),0);
 assert.equal(deDefense(s),2);
 assert.equal(deDodge(s),2,"não duplicar bônus ao esquivar");
 const p=defensePresentation(s);
 assert.equal(p.value,2);
 assert.equal(p.label,"DE DEFENSIVA");
 assert.match(p.caption,/todas as defesas/i);
 assert.match(p.caption,/Teto base 11 \/ final 12/);
});

test("v0.66: retirar armadura remove penalidade e preserva Integridade",()=>{
 const s=character("leve",false);
 assert.equal(equippedArmor(s),null);
 assert.equal(armorDodgeBonus(s),0);
 assert.equal(defensePresentation(s).value,3);
 assert.equal(s.items[0].hp,7);
 s.items[0].equipped=true;
 assert.equal(defensePresentation(s).value,2);
});

test("v0.66: Muito Leve 0, Média -2, Pesada -3, Muito Pesada -4",()=>{
 assert.equal(deDefense(character("muito_leve")),3);
 assert.equal(deDodge(character("muito_leve")),3);
 assert.equal(deDefense(character("medio")),1);
 assert.equal(deDefense(character("alto")),0);
 const denied=character("extremo");
 assert.equal(canEquipArmor(denied,denied.items[0]),false,"Muito Pesada requer Vigor 6 e Atletismo 6");
 assert.equal(deDefense(denied),3,"armadura não permitida não concede modificador");
 const allowed=character("extremo",true,{attributes:{agilidade:1,destreza:0,vigor:6},practices:{atletismo:6}});
 assert.equal(canEquipArmor(allowed,allowed.items[0]),true);
 assert.equal(deNatural(allowed),5);
 assert.equal(deDefense(allowed),1);
});

test("v0.66: teto natural 11 e teto defensivo total 12 no código",()=>{
 const s=character("muito_leve",true,{attributes:{agilidade:6,destreza:6,vigor:6},practices:{atletismo:6}});
 assert.equal(deNatural(s),11);
 assert.equal(deDefense(s),11);
 assert.ok(deDefense(s)<=12);
 assert.match(src.slice(start,end),/Math\.min\(12,Math\.max\(0,deNatural/);
});

test("v0.66: a UI, inventário e resumo usam DE geral já modificada",()=>{
 const html=readFileSync(new URL("./index.html",import.meta.url),"utf8");
 assert.match(html,/id="de-label"/);
 assert.match(src,/\$\("de-text"\)\.textContent=defense\.value/);
 assert.match(src,/\$\("de-caption"\)\.textContent="Base "\+deNatural\(\)/);
 assert.match(src,/function vitalHelpDetails\(kind\)/);
 assert.match(src,/function wizardReview\(\)\{[\s\S]*?defense=defensePresentation\(\)/);
 assert.match(src,/<small>'\+esc\(defense\.label\)\+'<\/small><b>'\+defense\.value/);
 assert.match(src,/<span>DE<\/span><b>'\+deDefense\(\)/);
 assert.doesNotMatch(src,/\+1 DE na esquiva/);
});


test("v0.149: 2 + piso((AGI+VIG+DES)/2), sem Atletismo",()=>{
 const zero=character("medio",true,{attributes:{agilidade:0,destreza:0,vigor:0},practices:{atletismo:0}});
 assert.equal(deNatural(zero),2);
 const s=character("medio",true,{attributes:{agilidade:1,destreza:2,vigor:3},practices:{atletismo:3}});
 assert.equal(deNatural(s),5,"base 2 + piso((AGI1+VIG3+DES2)/2)=5");
 assert.equal(deDefense(s),3);
 assert.equal(deDefense(character("leve",true,{attributes:s.attributes,practices:s.practices})),4);
});

test("v0.147: Atletismo não altera DE e Maestria permite teto 12",()=>{const s=character("muito_leve",true,{attributes:{agilidade:6,destreza:6,vigor:6},practices:{atletismo:0},skills:["maestria-escudos"]});s.items.push({type:"escudo",equipped:true});assert.equal(deDefense(s),12);s.practices.atletismo=6;assert.equal(deDefense(s),12);});

test("v0.149: simetria dos três Atributos e teto",()=>{for(let a=0;a<=6;a++)for(let d=0;d<=6;d++)for(let v=0;v<=6;v++){const s=character("muito_leve",true,{attributes:{agilidade:a,destreza:d,vigor:v}});assert.equal(deNatural(s),Math.min(11,2+Math.floor((a+d+v)/2)));}});
