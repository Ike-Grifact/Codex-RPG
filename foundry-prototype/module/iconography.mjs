// Identidade visual do Criador web, revisão 3948f58.
export const iconBase = "systems/codex-rpg-foundry/assets/icons/codex/";
const skillIcons = {
  "armas-leves":"arma-adaga","armas-medias":"arma-espada","armas-pesadas":"arma-montante",
  "armas-longo-alcance":"arma-arco","maestria-arremesso-armas":"arma-arremesso",
  "armas-fogo":"arma-pistola","pugilismo":"arma-punhos","manejo-perfeito":"arma-espada",
  "maestria-manejo-duplo":"arma-espada","disciplina-avancada":"arma-espada",
  "criar-item-foco-magia":"magia-foco","escudo-arcano":"armadura-escudo-arcano",
  "improviso":"magia-circulo","invocacao-elemental":"magia-circulo",
  "pericia-druidica":"categoria-natureza","transformacao-elemental":"magia-transformacao",
  "fogo":"elemento-fogo","agua":"elemento-agua","vento":"elemento-ar","terra":"elemento-terra",
  "sagrado":"elemento-sagrado","sangue":"elemento-sangue","trevas":"elemento-trevas","veneno":"elemento-veneno",
};
export const skillIconId = (id, family) => skillIcons[id] ?? "categoria-"+(family || "outros");

export function equipmentIconId(item) {
  const name = String(item.name ?? "").normalize("NFD").replace(/\p{M}/gu,"").toLowerCase();
  if (item.kind === "shield") return "armadura-escudo";
  if (item.kind === "armor") {
    if (/muito leve|roupas simples/.test(name) || item.category === "muito-leve") return "armadura-muito-leve";
    if (/pesada|pesado/.test(name) || ["pesado","muito-pesado"].includes(item.category)) return "armadura-pesada";
    if (/media|medio/.test(name) || item.category === "medio") return "armadura-media";
    return "armadura-leve";
  }
  if (item.kind === "focus") return "magia-foco";
  if (item.kind === "firearm") return "arma-pistola";
  if (item.kind !== "weapon") return null;
  const patterns = [
    [/punho|luva|soqueira|manopla/,"punhos"], [/arco/,"arco"], [/besta/,"besta"],
    [/lanca|azagaia|naginata|cajado|bastao/,"lanca"], [/machado|machadinha/,"machado"],
    [/montante/,"montante"], [/adaga|faca|punhal|kunai|shuriken/,"adaga"],
    [/espada|katana/,"espada"], [/arremesso|dardo|chicote/,"arremesso"],
  ];
  const style = patterns.find(([pattern])=>pattern.test(name))?.[1] ?? (item.die>=12?"montante":item.die>=10?"espada":"adaga");
  return "arma-"+style;
}

export const iconPath = id => iconBase+id+".svg";
export const iconMarkup = id => id ? '<img class="codex-atlas-icon" src="'+iconPath(id)+'" alt="" aria-hidden="true">' : "";
