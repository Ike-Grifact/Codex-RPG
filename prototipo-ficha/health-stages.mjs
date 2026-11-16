/**
 * Codex RPG — referência pura de Saúde em quatro estados (16/11/2026).
 *
 * A regra nova tem base 1/1/1/1 e cada ponto de Vigor vai alternadamente
 * para Saudável e Ferido, iniciando em Saudável.
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

export function distribuicaoVidaPorVigor(vigor) {
  if (!Number.isSafeInteger(vigor) || vigor < 0) {
    throw new RangeError("Vigor deve ser um inteiro não negativo.");
  }
  return [1 + Math.ceil(vigor / 2), 1 + Math.floor(vigor / 2), 1, 1];
}

export function vidaMaximaPorVigor(vigor) {
  return distribuicaoVidaPorVigor(vigor).reduce((a, b) => a + b, 0);
}

/** Faixa vigente com Vida atual: as faixas são ordenadas Saudável → Inconsciente. */
export function estadoSaudePorVida(vigor, vidaAtual) {
  const faixas = distribuicaoVidaPorVigor(vigor);
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
