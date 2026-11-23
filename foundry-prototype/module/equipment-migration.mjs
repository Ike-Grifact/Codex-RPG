import {G1_CATALOG} from "./catalog.mjs";

const previousMaxima = {"muito-leve": [3], leve: [7, 10], medio: [12, 15], pesado: [17, 20]};
const previousClothingDescription = "Armadura Muito Leve G1 com Integridade 3 (corrigido); mantém +2 DE.";

export function catalogArmorMigration(item) {
  const s = item.system;
  if (item.type !== "equipment" || s.kind !== "armor" || s.grade !== 1) return;
  const catalog = G1_CATALOG.find(row => row.kind === "armor" && row.name === (s.catalogId || item.name) && row.category === s.category);
  const description = s.description?.trim();
  if (!catalog || !previousMaxima[s.category]?.includes(s.integrity.max) || s.weight !== catalog.weight ||
    s.priceVT !== catalog.priceVT || (s.properties ?? []).length ||
    (description && description !== catalog.description &&
      (catalog.name !== "Roupas Simples" || description !== previousClothingDescription))) return;
  const max = catalog.integrity.max;
  const damage = Math.max(0, s.integrity.max - s.integrity.value);
  return {value: Math.max(0, max - damage), max};
}

export async function applyCatalogArmorMigration(item) {
  if (!game.user.isGM || !item.isOwner) return;
  const next = catalogArmorMigration(item);
  if (!next) return;
  const approved = await foundry.applications.api.DialogV2.confirm({
    window: {title: "Atualizar armadura padrão G1"},
    content: `<p>Confirme em uma cópia de teste ou após backup do mundo. A Integridade passará de ${item.system.integrity.value}/${item.system.integrity.max} para ${next.value}/${next.max}, preservando o dano até o novo máximo.</p>`,
    rejectClose: false,
  });
  if (!approved) return;
  const current = catalogArmorMigration(item);
  if (current) await item.update({"system.integrity": current});
}
