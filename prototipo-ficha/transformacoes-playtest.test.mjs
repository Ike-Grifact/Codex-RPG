import test from "node:test";
import assert from "node:assert/strict";
import {aprimorarAtributosDruidicos,combinarAtributosDaForma,
  encerraFormaDruidica,deltaDuracaoElemental,
  formasDruidicasDisponiveis,podeConjurarEmFormaDruidica,
  vidaTemporariaAoReverterFormaDruidica,duracaoTransformacaoElemental,
  danoPorProtecaoElemental} from "./transformacoes-playtest.mjs";
test("Pequena: eleva todos os dados de um Atributo, sem Vigor",()=>{
 const a={forca:[6,6,10],vigor:[6]};
 const b=aprimorarAtributosDruidicos({forma:"pequena",atributos:a,selecionados:["forca"]});
 assert.deepEqual(b.forca,[10,10,12]);assert.deepEqual(b.vigor,[6]);
 assert.deepEqual(a.forca,[6,6,10]);
 assert.throws(()=>aprimorarAtributosDruidicos({forma:"pequena",atributos:a,selecionados:["vigor"]}),RangeError);
});
test("Média e Grande elevam 2 ou 3 Atributos próprios",()=>{
 const a={forca:[6],vigor:[10],destreza:[4],inteligencia:[12]};
 const b=aprimorarAtributosDruidicos({forma:"media",atributos:a,selecionados:["forca","vigor"]});
 assert.deepEqual([b.forca,b.vigor,b.destreza],[[10],[12],[4]]);
 const c=aprimorarAtributosDruidicos({forma:"grande",atributos:a,selecionados:["forca","vigor","destreza"]});
 assert.deepEqual([c.forca,c.vigor,c.destreza],[[10],[12],[6]]);
 assert.throws(()=>aprimorarAtributosDruidicos({forma:"media",atributos:a,selecionados:["forca","forca"]}),RangeError);
});
test("Forma animal combina somente Atributos distintos, até 2/2/3",()=>{
 const f=(...k)=>k.map(key=>({group:"attr",key}));
 assert.equal(combinarAtributosDaForma({forma:"pequena",fontes:f("forca","agilidade")}),true);
 assert.equal(combinarAtributosDaForma({forma:"media",fontes:f("forca","agilidade","vigor")}),false);
 assert.equal(combinarAtributosDaForma({forma:"grande",fontes:f("forca","agilidade","vigor")}),true);
 assert.equal(combinarAtributosDaForma({forma:"grande",fontes:f("forca","forca")}),false);
 assert.equal(combinarAtributosDaForma({forma:"grande",fontes:[{group:"practice",key:"atletismo"},...f("forca")]}),false);
});
test("Pequena cancela com dano; Média somente P>E; Grande qualquer P mantido",()=>{
 assert.equal(encerraFormaDruidica({forma:"pequena",danoRecebido:1}),true);
 assert.equal(encerraFormaDruidica({forma:"pequena",danoRecebido:0,pavorMantidoNaoAnulado:2}),false);
 assert.equal(encerraFormaDruidica({forma:"media",exitos:2,pavorMantidoNaoAnulado:3}),true);
 assert.equal(encerraFormaDruidica({forma:"media",exitos:2,pavorMantidoNaoAnulado:2}),false);
 assert.equal(encerraFormaDruidica({forma:"grande",pavorMantidoNaoAnulado:1}),true);
 assert.equal(encerraFormaDruidica({forma:"grande",pavorMantidoNaoAnulado:0}),false);
});
test("Elemental: delta E-P, sem inventar duração inicial",()=>{
 assert.equal(deltaDuracaoElemental({exitos:3,pavor:1}),2);
 assert.equal(deltaDuracaoElemental({exitos:0,pavor:2}),-2);
 assert.throws(()=>deltaDuracaoElemental({exitos:1,pavor:-1}),RangeError);
});

test("Compra única de Druídica libera Pequena, Média e Grande",()=>{
 assert.deepEqual(formasDruidicasDisponiveis(false),[]);
 assert.deepEqual(formasDruidicasDisponiveis(true),["pequena","media","grande"]);
});
test("Nenhuma forma animal permite conjuração e a reversão remove PV temporário",()=>{
 assert.equal(podeConjurarEmFormaDruidica(null),true);
 for(const forma of ["pequena","media","grande"])assert.equal(podeConjurarEmFormaDruidica(forma),false);
 assert.equal(vidaTemporariaAoReverterFormaDruidica(6),0);
 assert.equal(vidaTemporariaAoReverterFormaDruidica(0),0);
 assert.throws(()=>vidaTemporariaAoReverterFormaDruidica(-1),RangeError);
});
test("Duração elemental é E-P, exige positiva e não soma duração-base",()=>{
 assert.deepEqual(duracaoTransformacaoElemental({exitos:3,pavor:1}),{duracao:2,sustentada:true});
 assert.deepEqual(duracaoTransformacaoElemental({exitos:2,pavor:2}),{duracao:0,sustentada:false});
 assert.deepEqual(duracaoTransformacaoElemental({exitos:1,pavor:3}),{duracao:0,sustentada:false});
 assert.equal(deltaDuracaoElemental({exitos:1,pavor:3}),-2);
 assert.throws(()=>duracaoTransformacaoElemental({exitos:1,pavor:-1}),RangeError);
});
test("Imunidade zera dano; resistência E/2 e P 0 só para o elemento correspondente",()=>{
 const damage=danoPorProtecaoElemental;
 assert.deepEqual(damage({elementoAtaque:"fogo",elementoImune:"fogo",elementoResistente:"fogo",exitos:10,pavor:8}),{tipo:"imune",dano:0});
 assert.deepEqual(damage({elementoAtaque:"fogo",elementoResistente:"fogo",exitos:3,pavor:4}),{tipo:"resistente",dano:1.5});
 assert.deepEqual(damage({elementoAtaque:"fogo",elementoResistente:"fogo",exitos:4,pavor:0}),{tipo:"resistente",dano:2});
 assert.deepEqual(damage({elementoAtaque:"agua",elementoResistente:"fogo",exitos:4,pavor:2}),{tipo:"normal",dano:null});
 assert.throws(()=>damage({elementoAtaque:"fogo",elementoResistente:"fogo",exitos:1,pavor:-1}),RangeError);
});
