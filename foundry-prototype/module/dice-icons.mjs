const supportedDice = new Set([4, 6, 10, 12, 20]);

export function dieSvg(sides) {
  const size = Number(sides);
  if (!supportedDice.has(size)) return "";
  return `<img class="codex-die-svg" src="systems/codex-rpg-foundry/assets/dice/d${size}.svg" alt="" aria-hidden="true">`;
}
