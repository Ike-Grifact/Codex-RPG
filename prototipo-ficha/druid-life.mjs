/**
 * Modelo isolado de playtest da Vida Druídica — decisão autoral 17/11/2026.
 * NÃO altera fichas automaticamente; não cria cura, ganho de XP ou regras de
 * reversão ainda PENDENTES. Substitui a antiga hipótese de conversão de faixas.
 *
 * XP de Atributos animais: tabela DEFINIDA na v0.56, seção 0-AS.2.
 * PVs temporários somente na transformação; a simulação de golpes não
 * reabastece a reserva. Temporários deixam de existir ao destransformar.
 * PENDENTE: reversão voluntária, dano não letal em forma menor,
 * transferência da Vida real entre formas sucessivas, Vida zero e
 * representação dos temporários nas quatro faixas.
 */
// Tabelas de custo ACUMULADO da v0.56, G0..G6. Não usar a antiga
// escala de companheiros v0.48 ou de Formação v0.47 em seu lugar.
const XP_ATRIBUTO_NORMAL=[0,1,3,6,9,18,32];
const XP_ATRIBUTO_ELEVADO=[0,2,4,8,16,32,64];
const ATRIBUTOS_ANIMAIS=new Set(["forca","agilidade","destreza","inteligencia","influencia","vigor"]);
const PORTES_DRUIDICOS=new Set(["pequena","media","grande"]);

/** XP da forma = XP total atual do druida. Apenas custos por porte são diferentes. */
export function custoAtributoFormaDruidica({porte,atributo,grau}){
  if(!PORTES_DRUIDICOS.has(porte) || !ATRIBUTOS_ANIMAIS.has(atributo) ||
     !Number.isInteger(grau) || grau<0 || grau>6)
    throw new RangeError("Porte, Atributo ou Grau inválido (Gigante ainda PENDENTE)");
  const elevado=porte==="pequena"&&(atributo==="forca"||atributo==="vigor");
  return (elevado?XP_ATRIBUTO_ELEVADO:XP_ATRIBUTO_NORMAL)[grau];
}

/** Valida o orçamento de uma ficha animal, sem gastar XP na ficha do druida. */
export function conferirXPFormaDruidica({xpTotalDruida,porte,graus}){
  if(!Number.isSafeInteger(xpTotalDruida)||xpTotalDruida<0||
     !graus||typeof graus!=="object"||Array.isArray(graus))
    throw new RangeError("Orçamento de XP ou distribuição animal inválida");
  const compras=Object.entries(graus);
  const gasto=compras.reduce((s,[atributo,grau])=>
    s+custoAtributoFormaDruidica({porte,atributo,grau}),0);
  if(!PORTES_DRUIDICOS.has(porte))throw new RangeError("Porte não habilitado");
  return {porte,xpTotalDruida,gasto,saldo:xpTotalDruida-gasto,
    dentroDoOrcamento:gasto<=xpTotalDruida};
}

export function distribuirVidaEmQuatroFaixas(vidaMaxima) {
  if (!Number.isSafeInteger(vidaMaxima) || vidaMaxima < 4) {
    throw new RangeError("Vida máxima deste modelo deve ser inteiro >= 4.");
  }
  const extra = vidaMaxima - 4;
  return [1 + Math.ceil(extra/2), 1 + Math.floor(extra/2), 1, 1];
}

function valido(vidaMaximaHumana, vidaAtualHumana, vidaMaximaAnimal) {
  return Number.isSafeInteger(vidaMaximaHumana) && vidaMaximaHumana>=4 &&
    Number.isSafeInteger(vidaAtualHumana) && vidaAtualHumana>=0 &&
    vidaAtualHumana<=vidaMaximaHumana &&
    Number.isSafeInteger(vidaMaximaAnimal) && vidaMaximaAnimal>=1;
}

/** Mantido para compatibilidade; dano humano anterior não é curado ao transformar. */
export function vidaAnimalAoTransformar({vidaMaximaHumana,vidaAtualHumana,vidaMaximaAnimal}) {
  if (!valido(vidaMaximaHumana,vidaAtualHumana,vidaMaximaAnimal))
    throw new RangeError("Valores de Vida inválidos para transformação");
  const danoPrevio=vidaMaximaHumana-vidaAtualHumana;
  const vidaAnimalAtual=Math.max(0,vidaMaximaAnimal-danoPrevio);
  return {vidaAnimalMaxima:vidaMaximaAnimal,vidaAnimalAtual,danoPrevio,formaSemVida:vidaAnimalAtual===0};
}

/**
 * Compara Vida MÁXIMA, mas preserva a Vida humana ATUAL. Em forma maior,
 * o excedente A-H é temporário e não soma Vida à reserva humana.
 * PV temporário é concedido SOMENTE NESTE ATO DE TRANSFORMAR; 
 * simular golpes nunca o regenera. Na reversão ele deixa de existir.
 * A passagem de Vida real entre transformações sucessivas requer regra própria.
 */
export function prepararVidaDruidica({vidaMaximaHumana,vidaAtualHumana,vidaMaximaAnimal}) {
  if (!valido(vidaMaximaHumana,vidaAtualHumana,vidaMaximaAnimal))
    throw new RangeError("Valores de Vida inválidos para transformação");
  const caso=vidaMaximaAnimal<vidaMaximaHumana?"menor":
    vidaMaximaAnimal===vidaMaximaHumana?"igual":"maior";
  const pvTemporarios=caso==="maior"?vidaMaximaAnimal-vidaMaximaHumana:0;
  const vidaAnimalAtual=caso==="menor"?
    Math.max(0,vidaMaximaAnimal-(vidaMaximaHumana-vidaAtualHumana)):
    vidaAtualHumana+pvTemporarios;
  return {
    caso,vidaMaximaHumana,vidaMaximaAnimal,vidaHumanaReal:vidaAtualHumana,
    vidaAnimalAtual,pvTemporarios,formaSemVida:vidaAnimalAtual===0,
    automatizacaoBloqueada:true
  };
}

/**
 * Simula UM golpe sem resolver outros gatilhos de Pavor/cura/ferimentos.
 * Na forma menor, somente o golpe LETAL está definido integralmente:
 * cancela a forma e aplica o dano inteiro à Vida humana, não só excesso.
 * Dano não letal da forma menor permanece com integração PENDENTE.
 */
export function simularGolpeDruidico({estado,dano}) {
  if(!estado || !["menor","igual","maior"].includes(estado.caso) ||
      !Number.isSafeInteger(estado.vidaAnimalAtual) || estado.vidaAnimalAtual<0 ||
      !Number.isSafeInteger(estado.vidaHumanaReal) || estado.vidaHumanaReal<0 ||
      !Number.isSafeInteger(estado.pvTemporarios) || estado.pvTemporarios<0 ||
      !Number.isSafeInteger(dano) || dano<0)
    throw new RangeError("Estado de Vida ou dano inválido");
  if(estado.caso==="menor"){
    const golpeLetal=dano>=estado.vidaAnimalAtual && dano>0;
    return {
      ...estado,vidaAnimalAtual:Math.max(0,estado.vidaAnimalAtual-dano),
      vidaHumanaReal:golpeLetal?Math.max(0,estado.vidaHumanaReal-dano):estado.vidaHumanaReal,
      danoNaVidaReal:golpeLetal?dano:0,formaCancelada:golpeLetal,
      morteHumana:golpeLetal&&dano>=estado.vidaHumanaReal,
      propagacaoNaoLetalPendente:!golpeLetal
    };
  }
  const absorvido=Math.min(dano,estado.pvTemporarios);
  const danoReal=dano-absorvido;
  const vidaHumanaReal=Math.max(0,estado.vidaHumanaReal-danoReal);
  return {
    ...estado,pvTemporarios:estado.pvTemporarios-absorvido,
    vidaHumanaReal,vidaAnimalAtual:vidaHumanaReal+estado.pvTemporarios-absorvido,
    danoNaVidaReal:danoReal,formaCancelada:false,
    morteHumana:danoReal>0&&danoReal>=estado.vidaHumanaReal,
    propagacaoNaoLetalPendente:false
  };
}
