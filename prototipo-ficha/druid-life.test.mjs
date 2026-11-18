import test from "node:test";
import assert from "node:assert/strict";
import {distribuirVidaEmQuatroFaixas,vidaAnimalAoTransformar,
  prepararVidaDruidica,simularGolpeDruidico,regrasReversaoVoluntariaDruidica,
  custoAtributoFormaDruidica,conferirXPFormaDruidica} from "./druid-life.mjs";

test("Saúde preserva quatro faixas de Vida, com duas últimas fixas",()=>{
  const expected={4:[1,1,1,1],5:[2,1,1,1],6:[2,2,1,1],7:[3,2,1,1],8:[3,3,1,1]};
  for(const [n,parts] of Object.entries(expected))
    assert.deepEqual(distribuirVidaEmQuatroFaixas(+n),parts);
});

test("Forma pequena usa Vida reduzida por dano humano preexistente e não gera cura",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:7,vidaAtualHumana:5,vidaMaximaAnimal:6});
  assert.equal(s.caso,"menor");
  assert.equal(s.vidaAnimalAtual,4);
  assert.equal(s.vidaHumanaReal,5);
  assert.equal(s.pvTemporarios,0);
  assert.deepEqual(vidaAnimalAoTransformar({vidaMaximaHumana:7,vidaAtualHumana:5,vidaMaximaAnimal:6}),
    {vidaAnimalMaxima:6,vidaAnimalAtual:4,danoPrevio:2,formaSemVida:false});
});

test("Forma menor: golpe letal cancela transformação e transmite DANO INTEGRAL, não só excesso",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:7,vidaAtualHumana:5,vidaMaximaAnimal:6});
  const hit=simularGolpeDruidico({estado:s,dano:4});
  assert.equal(hit.formaCancelada,true);
  assert.equal(hit.danoNaVidaReal,4);
  assert.equal(hit.vidaHumanaReal,1);
  assert.equal(hit.morteHumana,false);
  const mortal=simularGolpeDruidico({estado:s,dano:6});
  assert.equal(mortal.formaCancelada,true);
  assert.equal(mortal.vidaHumanaReal,0);
  assert.equal(mortal.morteHumana,true);
});

test("Forma menor: dano não letal é contabilizado no animal sem inventar regra de retorno",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:7,vidaAtualHumana:5,vidaMaximaAnimal:6});
  const hit=simularGolpeDruidico({estado:s,dano:2});
  assert.equal(hit.formaCancelada,false);
  assert.equal(hit.vidaAnimalAtual,2);
  assert.equal(hit.vidaHumanaReal,5);
  assert.equal(hit.propagacaoNaoLetalPendente,true);
});

test("Máximos iguais: recebe Vida atual, não recebe PV temporários, pode morrer",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:4,vidaMaximaAnimal:6});
  assert.equal(s.caso,"igual");
  assert.equal(s.vidaAnimalAtual,4);
  assert.equal(s.pvTemporarios,0);
  const hit=simularGolpeDruidico({estado:s,dano:3});
  assert.equal(hit.vidaHumanaReal,1);
  assert.equal(hit.danoNaVidaReal,3);
  const mortal=simularGolpeDruidico({estado:hit,dano:1});
  assert.equal(mortal.morteHumana,true);
  assert.equal(mortal.vidaHumanaReal,0);
});

test("Máximo maior: somente diferença de máximos concede PVs temporários",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:4,vidaMaximaAnimal:8});
  assert.equal(s.caso,"maior");
  assert.deepEqual([s.vidaHumanaReal,s.pvTemporarios,s.vidaAnimalAtual],[4,2,6]);
  const hit=simularGolpeDruidico({estado:s,dano:3});
  assert.deepEqual([hit.vidaHumanaReal,hit.pvTemporarios,hit.vidaAnimalAtual],[3,0,3]);
  assert.equal(hit.danoNaVidaReal,1);
  const fatal=simularGolpeDruidico({estado:hit,dano:3});
  assert.equal(fatal.morteHumana,true);
  assert.equal(fatal.vidaHumanaReal,0);
});

test("Proteção temporária é consumida antes de atingir a Vida real",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:8,vidaAtualHumana:3,vidaMaximaAnimal:11});
  const hit=simularGolpeDruidico({estado:s,dano:2});
  assert.deepEqual([hit.vidaHumanaReal,hit.pvTemporarios],[3,1]);
  assert.equal(hit.danoNaVidaReal,0);
});

test("Validação de entradas não concede Vida incorreta",()=>{
  assert.throws(()=>prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:7,vidaMaximaAnimal:8}),RangeError);
  assert.throws(()=>prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:4,vidaMaximaAnimal:0}),RangeError);
  const s=prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:4,vidaMaximaAnimal:8});
  assert.throws(()=>simularGolpeDruidico({estado:s,dano:-1}),RangeError);
  assert.throws(()=>simularGolpeDruidico({estado:s,dano:1.2}),RangeError);
});

test("XP: fórmula inicial não inventa gasto nem concede recuperação automática de Vida",()=>{
  for(let h=4;h<=16;h++)for(let a=1;a<=18;a++)for(let current=0;current<=h;current++){
    const s=prepararVidaDruidica({vidaMaximaHumana:h,vidaAtualHumana:current,vidaMaximaAnimal:a});
    assert.ok(s.vidaAnimalAtual>=0&&s.vidaAnimalAtual<=a);
    assert.equal(s.vidaHumanaReal,current);
    assert.equal(s.pvTemporarios,a>h?a-h:0);
    assert.equal(s.automatizacaoBloqueada,true);
  }
});

test("XP animal da v0.56: Pequena usa Força/Vigor elevados, outros normais",()=>{
  const normal=[0,1,3,6,9,18,32],elevado=[0,2,4,8,16,32,64];
  for(let grau=0;grau<=6;grau++){
    assert.equal(custoAtributoFormaDruidica({porte:"pequena",atributo:"forca",grau}),elevado[grau]);
    assert.equal(custoAtributoFormaDruidica({porte:"pequena",atributo:"vigor",grau}),elevado[grau]);
    assert.equal(custoAtributoFormaDruidica({porte:"pequena",atributo:"agilidade",grau}),normal[grau]);
    assert.equal(custoAtributoFormaDruidica({porte:"pequena",atributo:"destreza",grau}),normal[grau]);
    assert.equal(custoAtributoFormaDruidica({porte:"pequena",atributo:"inteligencia",grau}),normal[grau]);
    assert.equal(custoAtributoFormaDruidica({porte:"pequena",atributo:"influencia",grau}),normal[grau]);
  }
});

test("XP animal da v0.56: Média e Grande usam todos os Atributos normais",()=>{
  const normal=[0,1,3,6,9,18,32];
  for(const porte of ["media","grande"])for(const atributo of ["forca","vigor","agilidade","destreza","inteligencia","influencia"])
    for(let grau=0;grau<=6;grau++)assert.equal(custoAtributoFormaDruidica({porte,atributo,grau}),normal[grau]);
});

test("XP da forma usa orçamento atual do druida e não altera seu XP",()=>{
  const graus={forca:2,vigor:2,agilidade:3};
  const pequena=conferirXPFormaDruidica({xpTotalDruida:15,porte:"pequena",graus});
  const media=conferirXPFormaDruidica({xpTotalDruida:15,porte:"media",graus});
  assert.deepEqual([pequena.gasto,pequena.saldo,pequena.dentroDoOrcamento],[14,1,true]);
  assert.deepEqual([media.gasto,media.saldo,media.dentroDoOrcamento],[12,3,true]);
  assert.equal(grasInalterados(graus),true);
  const excedido=conferirXPFormaDruidica({xpTotalDruida:5,porte:"grande",graus});
  assert.equal(excedido.dentroDoOrcamento,false);
  assert.equal(excedido.saldo,-7);
});
function grasInalterados(graus){return graus.forca===2&&graus.vigor===2&&graus.agilidade===3;}

test("XP animal não abre porte Gigante ainda não aprovado nem Graus além de 6",()=>{
  assert.throws(()=>custoAtributoFormaDruidica({porte:"gigante",atributo:"vigor",grau:1}),RangeError);
  assert.throws(()=>custoAtributoFormaDruidica({porte:"grande",atributo:"vigor",grau:7}),RangeError);
  assert.throws(()=>custoAtributoFormaDruidica({porte:"grande",atributo:"disciplina",grau:1}),RangeError);
  assert.throws(()=>conferirXPFormaDruidica({xpTotalDruida:15,porte:"gigante",graus:{}}),RangeError);
});

test("PVs temporários só surgem ao transformar; não regeneram enquanto a forma permanece ativa",()=>{
  const forma=prepararVidaDruidica({vidaMaximaHumana:6,vidaAtualHumana:5,vidaMaximaAnimal:8});
  assert.equal(forma.pvTemporarios,2);
  const g1=simularGolpeDruidico({estado:forma,dano:1});
  const g2=simularGolpeDruidico({estado:g1,dano:1});
  const pausa=simularGolpeDruidico({estado:g2,dano:0});
  assert.deepEqual([g1.pvTemporarios,g2.pvTemporarios,pausa.pvTemporarios],[1,0,0]);
  assert.equal(pausa.vidaHumanaReal,5);
  const g3=simularGolpeDruidico({estado:pausa,dano:1});
  assert.equal(g3.vidaHumanaReal,4);
  assert.equal(g3.pvTemporarios,0);
});

test("Forma menor transfere TODO o dano acumulado em golpes diferentes, não apenas golpe final",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:8,vidaAtualHumana:8,vidaMaximaAnimal:5});
  const parcial=simularGolpeDruidico({estado:s,dano:2});
  assert.equal(parcial.danoAcumuladoForma,2);
  assert.equal(parcial.vidaHumanaReal,8);
  assert.equal(parcial.formaCancelada,false);
  const mortalForma=simularGolpeDruidico({estado:parcial,dano:3});
  assert.equal(mortalForma.formaCancelada,true);
  assert.equal(mortalForma.danoAcumuladoForma,5);
  assert.equal(mortalForma.danoNaVidaReal,5);
  assert.equal(mortalForma.vidaHumanaReal,3);
  assert.equal(mortalForma.morteHumana,false);
});

test("Ferimento humano prévio não é cobrado novamente ao reverter por golpe letal",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:8,vidaAtualHumana:6,vidaMaximaAnimal:5});
  assert.equal(s.vidaAnimalAtual,3);
  const primeiro=simularGolpeDruidico({estado:s,dano:1});
  const segundo=simularGolpeDruidico({estado:primeiro,dano:2});
  assert.equal(segundo.danoAcumuladoForma,3);
  assert.equal(segundo.vidaHumanaReal,3);
  assert.equal(segundo.danoNaVidaReal,3);
});

test("Dano de excesso na forma menor entra integral no acúmulo e pode matar humano",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:8,vidaAtualHumana:8,vidaMaximaAnimal:5});
  const um=simularGolpeDruidico({estado:s,dano:2});
  const fatal=simularGolpeDruidico({estado:um,dano:7});
  assert.equal(fatal.danoAcumuladoForma,9);
  assert.equal(fatal.danoNaVidaReal,9);
  assert.equal(fatal.vidaHumanaReal,0);
  assert.equal(fatal.morteHumana,true);
});

test("Dano integral bloqueado pelo Escudo Arcano não entra na Vida nem no acúmulo",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:8,vidaAtualHumana:8,vidaMaximaAnimal:5});
  // Escudo resolve-se fora deste módulo; aqui só chega o dano efetivo à Vida.
  const escudoBloqueou=simularGolpeDruidico({estado:s,dano:0});
  assert.equal(escudoBloqueou.danoAcumuladoForma,0);
  assert.equal(escudoBloqueou.vidaAnimalAtual,5);
  const real=simularGolpeDruidico({estado:escudoBloqueou,dano:2});
  const fatal=simularGolpeDruidico({estado:real,dano:3});
  assert.equal(fatal.danoNaVidaReal,5);
  assert.equal(fatal.vidaHumanaReal,3);
});

test("Não é possível recontar golpes depois da forma já cancelada",()=>{
  const s=prepararVidaDruidica({vidaMaximaHumana:8,vidaAtualHumana:8,vidaMaximaAnimal:5});
  const cancelada=simularGolpeDruidico({estado:s,dano:5});
  assert.equal(cancelada.formaCancelada,true);
  assert.throws(()=>simularGolpeDruidico({estado:cancelada,dano:1}),RangeError);
});

test("Reversão voluntária G1/G2/G3 é gratuita, sem teste nem economia de ação",()=>{
  const regras=regrasReversaoVoluntariaDruidica();
  assert.deepEqual(regras,{
    custoCoragem:0,consomeAcao:false,consomeReacao:false,
    consomeTurno:false,requerTeste:false,concedeAcaoExtra:false,
    recuperaVida:false,reembolsaAtivacao:false
  });
});

test("Reversão voluntária não aplica conversão de Vida pendente no simulador",()=>{
  const forma=prepararVidaDruidica({
    vidaMaximaHumana:8,vidaAtualHumana:8,vidaMaximaAnimal:5
  });
  const golpe=simularGolpeDruidico({estado:forma,dano:2});
  const antes=structuredClone(golpe);
  const regras=regrasReversaoVoluntariaDruidica();
  assert.equal(regras.custoCoragem,0);
  assert.deepEqual(golpe,antes);
  assert.equal(golpe.danoAcumuladoForma,2);
  assert.equal(golpe.vidaHumanaReal,8);
  assert.equal(golpe.formaCancelada,false);
});
