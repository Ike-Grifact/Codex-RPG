import {FACES} from "./rules.mjs";

const system = "codex-rpg-foundry";

export function faceLabels(sides) {
  const faces = FACES[sides];
  return faces.map((symbols, index) => {
    // A face 10 do d10 passou de 201 para 210 no SRD v0.44.
    // Não há ainda textura 210-max; usar a textura existente 210, nunca a antiga 201-max.
    const name = symbols.join("") + (index === faces.length - 1 && !(sides === "10" && index === 9) ? "-max" : "");
    return `systems/${system}/assets/dice/faces/${name}.png`;
  });
}

export function registerCodexDice(dice3d) {
  if (!dice3d?.addSystem || !dice3d?.addDicePreset) return;
  // The object signature is supported by Dice So Nice 6.2.6 and the newer API.
  dice3d.addSystem({id: system, name: "Codex RPG"});
  for (const sides of Object.keys(FACES)) {
    dice3d.addDicePreset({type: `d${sides}`, system, labels: faceLabels(sides)});
  }
}

export async function showCodexDice(roll) {
  const dice3d = game.dice3d;
  if (!dice3d?.showForRoll) return;
  // Os dados físicos são públicos; apenas a escolha dos mantidos e a confirmação seguem sob controle de quem rolou.
  try {
    for (const die of roll.dice) {
      die.options ??= {};
      die.options.appearance = {...die.options.appearance, system};
    }
    // Decisão autoral: a animação física é compartilhada com toda a mesa
    // antes da seleção e confirmação da rolagem. Não rerrolar no cliente receptor.
    await dice3d.showForRoll(roll, game.user, true);
  } catch (error) {
    console.warn("Codex RPG | Animação do Dice So Nice indisponível.", error);
  }
}
