import {actorData, actorKinds, equipmentData, importSiteData, itemKinds} from "./creation.mjs";
import {G1_CATALOG} from "./catalog.mjs";
import {escapeHTML} from "./roll-engine.mjs";
import {ATTRIBUTES, KNOWLEDGES, PRACTICES, lifeMax, starterPurchasePlan} from "./rules.mjs";

const portal = "https://codex-rpg-conflito-preview-ike.onrender.com";
const options = (choices) => Object.entries(choices).map(([value, label]) =>
  `<option value="${escapeHTML(value)}">${escapeHTML(label)}</option>`).join("");
const group = (label, input) => `<label class="codex-creation-field"><span>${label}</span>${input}</label>`;
const select = (name, content) => `<select name="${name}">${content}</select>`;
const input = (name, placeholder = "") => `<input name="${name}" type="text" maxlength="160" placeholder="${placeholder}">`;

function dialog(title, content, submit) {
  const window = new foundry.applications.api.DialogV2({
    window: {title},
    position: {width: 520},
    classes: ["codex-rpg", "codex-create-dialog"],
    content: `<div class="codex-foundry-root">${content}</div>`,
    form: {closeOnSubmit: false},
    buttons: [{action: "confirm", label: "Confirmar", default: true, async callback(_event, button) {
      try {
        await submit(button.form);
        await window.close();
      } catch (error) {
        ui.notifications.error(error.message);
      }
    }}],
  });
  return window.render({force: true});
}

export async function createCodexActor() {
  if (!Actor.implementation.canUserCreate(game.user)) return;
  const typeOptions = game.user.isGM ? actorKinds : {character: actorKinds.character};
  try {
    await dialog("Criar ficha Codex", [
      group("Ficha", select("kind", options(typeOptions))),
      group("Nome", input("name")),
      group("Conceito / profissão", input("concept")),
      group("Origem", input("origin")),
      group("XP adicional / orçamento", '<input name="xp" type="number" min="0" max="10000000" step="1" value="0">'),
      ...(game.user.isGM ? [group("Grau da ameaça", '<input name="threatGrade" type="number" min="1" max="6" step="1" value="1">')] : []),
      group("Formação inicial", select("build", options({
        guided: "Escolher Atributo e Formação",
        quick: "Força G1 + Disciplina G1",
        empty: "Começar com a ficha em branco",
      }))),
      group("Atributo inicial", select("attribute", options(Object.fromEntries(ATTRIBUTES)))),
      group("Conhecimento ou Prática inicial", select("training", options(Object.fromEntries([
        ...KNOWLEDGES.map(([id, name]) => ["knowledge:" + id, "Conhecimento · " + name]),
        ...PRACTICES.map(([id, name]) => ["practice:" + id, "Prática · " + name]),
      ])))),
      '<p class="codex-tip">A formação inicial se aplica às fichas humanas. Continue a criação na ficha para distribuir XP e escolher itens.</p>',
      `<p><a href="${portal}/prototipo-ficha/" target="_blank" rel="noopener">Abrir o Criador com Codex Genético</a></p>`,
    ].join(""), async form => {
      const data = Object.fromEntries(new FormData(form));
      if (!Object.hasOwn(typeOptions, data.kind)) throw new Error("Tipo de ficha indisponível.");
      const human = ["character", "humanoid"].includes(data.kind);
      const actor = actorData(data.kind, data, data.build === "quick");
      if (human && data.build !== "empty" && (data.kind !== "humanoid" || data.build !== "quick")) {
        const [trainingGroup, trainingId] = (data.build === "quick" ? "practice:armas_conjuracao" : data.training).split(":");
        const plan = starterPurchasePlan(actor.system, data.build === "quick" ? "forca" : data.attribute, trainingGroup, trainingId);
        if (!plan.ok) throw new Error(plan.error);
        for (const [path, value] of Object.entries(plan.changes)) foundry.utils.setProperty(actor, path, value);
        actor.system.life.value = lifeMax(actor.system);
      }
      const created = await Actor.implementation.create(actor);
      created?.sheet.render({force: true});
    });
  } catch (error) {
    ui.notifications.error(error.message);
  }
}

export async function importCodexActors() {
  if (!Actor.implementation.canUserCreate(game.user)) return;
  try {
    await dialog("Importar fichas do site", [
      group("Arquivo JSON", '<input name="file" type="file" accept=".json,application/json" required>'),
      ...(game.user.isGM ? [group("Ficha do Criador", select("type", options({
        character: actorKinds.character, humanoid: actorKinds.humanoid,
      })))] : []),
      '<p class="codex-tip">Arquivos do Criar Conflito trazem todas as criaturas e NPCs como novas fichas. O JSON do Criador traz a ficha individual e seu inventário.</p>',
      `<p><a href="${portal}/criar-conflito/" target="_blank" rel="noopener">Abrir o Criar Conflito</a></p>`,
    ].join(""), async form => {
      const file = form.elements.file.files[0];
      if (!file || file.size > 2500000) throw new Error("Selecione um JSON de até 2,5 MB.");
      const payload = JSON.parse((await file.text()).replace(/^\uFEFF/, ""));
      if (!game.user.isGM && payload?.schema === "codex-conflito-v1") throw new Error("Somente o Narrador pode importar um conflito.");
      const drafts = importSiteData(payload, form.elements.type?.value ?? "character");
      const actors = await Actor.implementation.createDocuments(drafts);
      ui.notifications.info(`${actors.length} ficha(s) importada(s) para o diretório de Actors.`);
      if (actors.length === 1) actors[0].sheet.render({force: true});
    });
  } catch (error) {
    ui.notifications.error(error.message);
  }
}

export async function createCodexItem(actor) {
  if (actor ? !actor.isOwner : !Item.implementation.canUserCreate(game.user)) return;
  try {
    await dialog("Criar item Codex", [
      group("Catálogo de playtest", select("catalog", '<option value="">Item personalizado</option>'
        + options(G1_CATALOG.map(item => item.name)))),
      group("Tipo do item personalizado", select("kind", options(itemKinds))),
      group("Nome", input("name", "Usar nome do catálogo ou da categoria")),
      ...(actor ? ['<p class="codex-tip">A inclusão é direta no inventário. Consulte o preço em VT na ficha do item.</p>'] : []),
    ].join(""), async form => {
      const data = Object.fromEntries(new FormData(form));
      const source = equipmentData(data.kind, data.name, data.catalog);
      const item = actor
        ? (await actor.createEmbeddedDocuments("Item", [source]))[0]
        : await Item.implementation.create(source);
      item?.sheet.render({force: true});
    });
  } catch (error) {
    ui.notifications.error(error.message);
  }
}

function addDirectoryButton(root, id, label, callback) {
  const header = root?.querySelector(".directory-header");
  if (!header || header.querySelector(`[data-codex-create="${id}"]`)) return;
  const button = root.ownerDocument.createElement("button");
  button.type = "button";
  button.dataset.codexCreate = id;
  button.textContent = label;
  button.addEventListener("click", callback);
  header.querySelector("search")?.before(button);
}

export function registerCodexCreation() {
  Hooks.on("renderActorDirectory", (_application, root) => {
    if (!Actor.implementation.canUserCreate(game.user)) return;
    addDirectoryButton(root, "actor", "Criar ficha Codex", createCodexActor);
    addDirectoryButton(root, "import", "Importar do site", importCodexActors);
  });
  Hooks.on("renderItemDirectory", (_application, root) => {
    if (Item.implementation.canUserCreate(game.user)) {
      addDirectoryButton(root, "item", "Criar item Codex", () => createCodexItem());
    }
  });
}
