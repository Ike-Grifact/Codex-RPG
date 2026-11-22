import test from "node:test";
import assert from "node:assert/strict";
import {copyPlayer,savedPlayerCopies,defensiveDE,weaponAffinity,targetWeightClass,
 armorDamagePreview,applyCommonDamage,transferTo} from "./combat-summary.mjs";

function player(armor=3){
 return copyPlayer({name:"Aprendiz",level:1,life:6,attributes:{agilidade:1,vigor:1,destreza:1},
  practices:{atletismo:3},items:[{id:"roupas",type:"armadura",name:"Roupas Simples",
   weight:"muito_leve",max:armor,hp:armor,equipped:true}]},"hero");
}
test("importa fichas múltiplas por cópia sem alterar o armazenamento original",()=>{
 const entries={"codex-rpg-jogadores-index-v1":JSON.stringify({sheets:[{id:"a"},{id:"b"},{id:"c"}]}),
  "codex-rpg-jogador-ficha-v1:a":JSON.stringify({schema:"codex-jogador-ficha-v1",character:{name:"A",life:4}}),
  "codex-rpg-jogador-ficha-v1:b":JSON.stringify({schema:"codex-jogador-ficha-v1",character:{name:"B",life:4}})};
 const storage={getItem:key=>entries[key]??null,setItem:()=>{throw Error("Nunca escrever ficha de jogador");}};
 const {units,errors}=savedPlayerCopies(storage);
 assert.equal(units.length,2);assert.equal(errors.length,1);
 units[0].life=0;
 assert.equal(JSON.parse(entries["codex-rpg-jogador-ficha-v1:a"]).character.life,4);
});
test("DE defensiva atual v0.89 soma VIG+DES antes da divisão e armadura em TODAS defesas",()=>{
 assert.equal(defensiveDE(player()),5);
 const unit=player();unit.items[0].equipped=false;
 assert.equal(defensiveDE(unit),3);
});
test("afinidade de peso das armas reconhece confronto favorável e desfavorável",()=>{
 assert.equal(weaponAffinity("leve","medio"),1);
 assert.equal(weaponAffinity("leve","pesado"),-1);
 assert.equal(weaponAffinity("pesado","pesado"),1);
 assert.equal(targetWeightClass(player()),"leve");
});
test("acerto de 5E não atinge Vida se a Integridade absorveu tudo",()=>{
 assert.deepEqual(armorDamagePreview(player(8),{success:true,damage:5,e:5}).lifeLoss,0);
});
test("acerto com 5E após romper Integridade atinge 2 Vida (sem multiplicar dano básico)",()=>{
 const p=player(3);
 const hit=applyCommonDamage(p,{success:true,damage:5,e:5});
 assert.equal(hit.removed,3);assert.equal(hit.lifeRemoved,2);
 assert.equal(p.life,4);assert.equal(p.items[0].integrity,0);
});
test("menos de 5E atinge 1 Vida e falha não desgasta proteção",()=>{
 const p=player(0);
 assert.equal(applyCommonDamage(p,{success:true,damage:4,e:4}).lifeRemoved,1);
 assert.equal(applyCommonDamage(p,{success:false,damage:7,e:7}).applied,false);
});
test("armadura G4 não recebe dano físico comum",()=>{
 const p=player(3);p.items[0].grade=4;
 const hit=applyCommonDamage(p,{success:true,damage:6,e:6});
 assert.equal(hit.applied,false);assert.equal(p.life,6);assert.equal(p.items[0].integrity,3);
});
test("transferência respeita teto e preserva excedente até destinação",()=>{
 assert.deepEqual(transferTo(4,3,5),{moved:2,remaining:2,after:5});
 assert.equal(transferTo(3,5,5).moved,0);
});
