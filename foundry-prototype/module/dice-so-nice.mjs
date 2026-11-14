import {FACES} from "./rules.mjs";

const system = "codex-rpg-foundry";

export function faceLabels(sides) {
  const faces = FACES[sides];
  return faces.map((symbols, index) => {
    const name = symbols.join("") + (index === faces.length - 1 ? "-max" : "");
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
  // The evaluated pool is private until the player confirms the kept dice.
  try {
    for (const die of roll.dice) {
      die.options ??= {};
      die.options.appearance = {...die.options.appearance, system};
    }
    await dice3d.showForRoll(roll, game.user, false);
  } catch (error) {
    console.warn("Codex RPG | Animação do Dice So Nice indisponível.", error);
  }
}
