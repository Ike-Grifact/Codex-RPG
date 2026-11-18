/** Codex RPG — Playtest Nível 1 v1.0.
 * Regras PURAS da transformação animal e delta da Elemental.
 * Não ativa automaticamente: desbloqueio de G2/G3, Vida, DE/duração-base e
 * persistência dependem de procedimento ainda PENDENTE no SRD.
 * NÃO usa fichas animais nem XP animal, Domar ou Influência.
 */
const GRAUS_FORMAS={pequena:1,media:2,grande:3};
const PASSOS_DADOS=Object.freeze({4:6,6:10,10:12,12:12});
const ATRIBUTOS=new Set(["forca","agilidade","destreza","inteligencia","influencia","vigor"]);
const inteiro=n=>Number.isSafeInteger(n)&&n>=0;

export function aprimorarAtributosDruidicos({forma,atributos,selecionados}) {
  if(!(forma in GRAUS_FORMAS)||!atributos||typeof atributos!=="object"||
      !Array.isArray(selecionados)||selecionados.length!==GRAUS_FORMAS[forma]||
      new Set(selecionados).size!==selecionados.length||
      selecionados.some(x=>!ATRIBUTOS.has(x)|| (forma==="pequena"&&x==="vigor") ||
        !Array.isArray(atributos[x]) || !atributos[x].length ||
        atributos[x].some(d=>![4,6,10,12].includes(d))))
    throw new RangeError("Forma, Atributos e dados escolhidos não habilitados");
  const result=Object.fromEntries(Object.entries(atributos).map(([key,dados])=>[key,Array.isArray(dados)?[...dados]:dados]));
  for(const key of selecionados)result[key]=result[key].map(d=>PASSOS_DADOS[d]);
  return result;
}
export function combinarAtributosDaForma({forma,fontes}) {
  if(!(forma in GRAUS_FORMAS)||!Array.isArray(fontes))return false;
  const limite=forma==="grande"?3:2;
  return fontes.length>=1&&fontes.length<=limite&&
    new Set(fontes.map(x=>x?.key)).size===fontes.length&&
    fontes.every(x=>x?.group==="attr"&&ATRIBUTOS.has(x.key));
}
export function encerraFormaDruidica({forma,danoRecebido=0,exitos=0,pavorMantidoNaoAnulado=0}) {
  if(!(forma in GRAUS_FORMAS)||![danoRecebido,exitos,pavorMantidoNaoAnulado].every(inteiro))
    throw new RangeError("Resultado da forma inválido");
  if(forma==="pequena")return danoRecebido>0;
  if(forma==="media")return pavorMantidoNaoAnulado>exitos;
  return pavorMantidoNaoAnulado>0;
}
export function deltaDuracaoElemental({exitos,pavor}) {
  if(!inteiro(exitos)||!inteiro(pavor))throw new RangeError("Símbolos inválidos");
  // Não calcula tempo final: duração-base, unidade e filtragem de símbolos PENDENTES.
  return exitos-pavor;
}
