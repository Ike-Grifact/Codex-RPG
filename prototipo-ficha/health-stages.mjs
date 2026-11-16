/**
 * Codex RPG — referência pura de Saúde em quatro estados (16/11/2026).
 *
 * A regra nova tem base 1/1/1/1. Vigor soma 1 Vida por Grau e
 * Força conserva +piso(Grau/2) Vida. Pontos extras são distribuídos
 * alternadamente entre Saudável e Ferido, começando por Saudável.
 *
 * Conflitos de cura, efeitos de Veneno, dano anterior e aplicação automática
 * de penalidades ainda devem ser validados separadamente.
 */
export const HEALTH_STATES = Object.freeze([
  Object.freeze({ id: "saudavel", name: "Saudável", e: 0, a: 0, p: 0, coragem: 0 }),
  Object.freeze({ id: "ferido", name: "Ferido", e: 0, a: -1, p: 0, coragem: 0 }),
  Object.freeze({ id: "incapacitado", name: "Incapacitado", e: -1, a: 0, p: 1, coragem: 1 }),
  Object.freeze({ id: "inconsciente", name: "Inconsciente", e: -2, a: 0, p: 2, coragem: 2 }),
  Object.freeze({ id: "morto", name: "Morto", e: 0, a: 0, p: 0, coragem: null })
]);

export function distribuicaoVidaPorVigor(vigor, forca = 0) {
  if (!Number.isSafeInteger(vigor) || vigor < 0 ||
      !Number.isSafeInteger(forca) || forca < 0) {
    throw new RangeError("Vigor e Força devem ser inteiros não negativos.");
  }
  const extras = vigor + Math.floor(forca / 2);
  return [1 + Math.ceil(extras / 2), 1 + Math.floor(extras / 2), 1, 1];
}

export function vidaMaximaPorVigor(vigor, forca = 0) {
  return distribuicaoVidaPorVigor(vigor, forca).reduce((a, b) => a + b, 0);
}

/** Faixa vigente com Vida atual: as faixas são ordenadas Saudável → Inconsciente. */
export function estadoSaudePorVida(vigor, vidaAtual, forca = 0) {
  const faixas = distribuicaoVidaPorVigor(vigor, forca);
  const max = faixas.reduce((a, b) => a + b, 0);
  if (!Number.isSafeInteger(vidaAtual) || vidaAtual < 0 || vidaAtual > max) {
    throw new RangeError("Vida atual fora da faixa 0..Vida máxima.");
  }
  // Os dois últimos estados ocupam exatamente 1 Vida cada.
  const estado = vidaAtual === 0 ? 4 :
    vidaAtual === 1 ? 3 :
    vidaAtual === 2 ? 2 :
    vidaAtual <= 2 + faixas[1] ? 1 : 0;
  return { ...HEALTH_STATES[estado], vidaAtual, vidaMaxima: max, faixas };
}
