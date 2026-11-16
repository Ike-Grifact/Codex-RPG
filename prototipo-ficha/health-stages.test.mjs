import test from "node:test";
import assert from "node:assert/strict";
import { distribuicaoVidaPorVigor, vidaMaximaPorVigor, estadoSaudePorVida } from "./health-stages.mjs";

test("quatro estados: 1/1/1/1 e pontos de Vigor alternados", () => {
  const expected=[
    [1,1,1,1],[2,1,1,1],[2,2,1,1],[3,2,1,1],
    [3,3,1,1],[4,3,1,1],[4,4,1,1]
  ];
  expected.forEach((e,v)=>{
    assert.deepEqual(distribuicaoVidaPorVigor(v),e);
    assert.equal(vidaMaximaPorVigor(v),4+v);
  });
});

test("Força preserva +1 Vida a cada dois graus e distribui nas duas primeiras faixas", () => {
  const cases = [
    [0,0,[1,1,1,1]],[0,1,[1,1,1,1]],[0,2,[2,1,1,1]],
    [0,4,[2,2,1,1]],[1,2,[2,2,1,1]],[2,2,[3,2,1,1]],
    [3,4,[4,3,1,1]],[6,6,[6,5,1,1]]
  ];
  for (const [vigor,forca,expected] of cases) {
    assert.deepEqual(distribuicaoVidaPorVigor(vigor,forca), expected);
    assert.equal(vidaMaximaPorVigor(vigor,forca), 4 + vigor + Math.floor(forca/2));
  }
  assert.equal(estadoSaudePorVida(2,3,2).id,"ferido");
  assert.equal(estadoSaudePorVida(2,2,2).id,"incapacitado");
  assert.equal(estadoSaudePorVida(2,1,2).id,"inconsciente");
});

test("penalidades e custos correspondem aos quatro estados",()=>{
  const max=7; // Vigor 3: saudável 3, ferido 2, incapacitado 1, inconsciente 1
  assert.deepEqual(distribuicaoVidaPorVigor(3),[3,2,1,1]);
  const cases=[
    [max,"saudavel",0,0,0,0],[5,"saudavel",0,0,0,0],
    [4,"ferido",0,-1,0,0],[3,"ferido",0,-1,0,0],
    [2,"incapacitado",-1,0,1,1],
    [1,"inconsciente",-2,0,2,2],
    [0,"morto",0,0,0,null]
  ];
  for(const [vida,id,e,a,p,coragem] of cases){
    const status=estadoSaudePorVida(3,vida);
    assert.deepEqual([status.id,status.e,status.a,status.p,status.coragem],[id,e,a,p,coragem]);
  }
});

test("propriedade geral para Vigor 0 a 60 e todas as Vidas",()=>{
  for(let vig=0;vig<=60;vig++){
    const bands=distribuicaoVidaPorVigor(vig);
    assert.equal(bands.reduce((a,b)=>a+b,0),4+vig);
    assert.ok(bands[0]-bands[1]>=0&&bands[0]-bands[1]<=1);
    assert.equal(bands[2],1);assert.equal(bands[3],1);
    const max=vidaMaximaPorVigor(vig);
    for(let vida=0;vida<=max;vida++){
      const status=estadoSaudePorVida(vig,vida);
      const expected=vida===0?"morto":vida===1?"inconsciente":vida===2?"incapacitado":
        vida<=2+bands[1]?"ferido":"saudavel";
      assert.equal(status.id,expected);
    }
  }
});

test("validação das entradas",()=>{
  for(const value of [-1,0.5,NaN,Infinity]){
    assert.throws(()=>distribuicaoVidaPorVigor(value),RangeError);
  }
  for(const value of [-1,1.5]) {
    assert.throws(()=>distribuicaoVidaPorVigor(2,value),RangeError);
  }
  for(const value of [-1,8,1.5]){
    assert.throws(()=>estadoSaudePorVida(3,value),RangeError);
  }
});
