/** Codex RPG — Playtest Nível 1 v1.0.
 * Regras PURAS de transformação animal e duração/proteção Elemental.
 * Não ativa automaticamente: Vida, fontes/DE e
 * persistência dependem de procedimento ainda PENDENTE no SRD. G1/G2/G3 são liberadas juntas.
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
/** Compra única libera todas as formas. Não aumenta XP, Grau ou recursos. */
export function formasDruidicasDisponiveis(temPericiaDruidica) {
  return temPericiaDruidica?["pequena","media","grande"]:[];
}
/** Forma ativa bloqueia conjuração em qualquer porte animal. */
export function podeConjurarEmFormaDruidica(formaAtiva=null) {
  return formaAtiva===null||formaAtiva==="";
}
/** Vida temporária animal não se transforma em cura ao reverter. */
export function vidaTemporariaAoReverterFormaDruidica(pvTemporarios) {
  if(!inteiro(pvTemporarios))throw new RangeError("PVs temporários inválidos");
  return 0;
}
/** Não há duração-base: uma transformação só se sustenta com E - P > 0.
 * A unidade de duração e a fonte/DE da rolagem são procedimentos separados.
 */
export function duracaoTransformacaoElemental({exitos,pavor}) {
  if(!inteiro(exitos)||!inteiro(pavor))throw new RangeError("Símbolos inválidos");
  const duracao=exitos-pavor;
  return {duracao:Math.max(0,duracao),sustentada:duracao>0};
}
/** Alias legado: representa duração líquida, não um bônus sobre base externa. */
export function deltaDuracaoElemental({exitos,pavor}) {
  if(!inteiro(exitos)||!inteiro(pavor))throw new RangeError("Símbolos inválidos");
  return exitos-pavor;
}
/** Imunidade prevalece; resistência afeta SOMENTE dano elemental correspondente.
 * Elemento diferente => dano normal fora desta função (null).
 * Pavor resistido NÃO gera dano, mas risco/DE se aplicável.
 * Não arredondar frações antes de decisão autoral.
 */
export function danoPorProtecaoElemental({elementoAtaque,elementoImune=null,elementoResistente=null,exitos,pavor}) {
  if(typeof elementoAtaque!=="string"||!elementoAtaque.trim()||
     (elementoImune!==null&&typeof elementoImune!=="string")||
     (elementoResistente!==null&&typeof elementoResistente!=="string")||
     !inteiro(exitos)||!inteiro(pavor))throw new RangeError("Elementos ou símbolos inválidos");
  if(elementoAtaque===elementoImune)return {tipo:"imune",dano:0};
  if(elementoAtaque===elementoResistente)return {tipo:"resistente",dano:exitos*0.5};
  return {tipo:"normal",dano:null};
}
