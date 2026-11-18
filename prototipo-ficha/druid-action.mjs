/** Regra isolada de protagonismo após Escudo na transformação Druídica.
 * Recebe Pavor MANTIDO e cancelamentos já decididos; não rola dados.
 * Não automatiza combate no site/Foundry.
 */
export function protagonismoAposEscudoDruidico({pavorMantido,pavorAnulado=0}){
  if(!Number.isSafeInteger(pavorMantido)||pavorMantido<0||
     !Number.isSafeInteger(pavorAnulado)||pavorAnulado<0||
     pavorAnulado>pavorMantido)throw new RangeError("Pavor mantido/anulado inválido");
  const pavorResidual=pavorMantido-pavorAnulado;
  return {pavorResidual,proximo:pavorResidual>0?"inimigo":"jogadores",
          podeContinuarProtagonismo:pavorResidual===0};
}
export const REGRAS_ACAO_DRUIDICA=Object.freeze({
  transformaEAgeNaMesmaOportunidade:true,
  transformacaoExigeTeste:false,
  custoCoragemPorPorte:Object.freeze({pequena:0,media:1,grande:1}),
  escudoArcanoAdicionalCoragem:1
});
