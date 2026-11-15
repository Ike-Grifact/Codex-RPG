import {G1_CATALOG} from "./catalog.mjs";

const categories = {leve: 10, medio: 15, pesado: 20};

export function catalogArmorMigration(item) {
  const s = item.system;
  if (item.type !== "equipment" || s.kind !== "armor" || s.grade !== 1) return;
  const previous = categories[s.category];
  const catalog = G1_CATALOG.find(row => row.kind === "armor" && row.name === item.name && row.category === s.category);
  if (!catalog || !previous || s.integrity.max !== previous || s.weight !== catalog.weight ||
    s.priceVT !== catalog.priceVT || (s.properties ?? []).length || s.description?.trim()) return;
  return {value: Math.max(0, s.integrity.value - 3), max: catalog.integrity.max};
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
