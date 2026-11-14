import { cpSync, lstatSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export const systemId = "codex-rpg-foundry";
export const source = fileURLToPath(new URL("../", import.meta.url));
const github = "https://github.com/Ike-Grifact/Codex-RPG";
const playtestManifest = "https://raw.githubusercontent.com/Ike-Grifact/Codex-RPG/foundry-playtest-manifest/system.json";
const content = ["assets", "lang", "module", "styles", "templates"];
const versionPattern = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:\.([1-9]\d*))?$/;

export function readJson(file) {
  return JSON.parse(readFileSync(file, "utf8").replace(/^\uFEFF/, ""));
}

export function lstat(path) {
  return lstatSync(path, { throwIfNoEntry: false });
}

function validateTree(path) {
  const entry = lstatSync(path);
  if (entry.isDirectory()) {
    for (const name of readdirSync(path)) validateTree(join(path, name));
  } else if (!entry.isFile()) {
    throw new Error(`Arquivo especial ou link no pacote: ${path}`);
  }
}

export function copyDirectory(from, to) {
  if (!lstat(from)?.isDirectory()) throw new Error(`Pasta inválida: ${from}`);
  validateTree(from);
  cpSync(from, to, { recursive: true, errorOnExist: true, force: false });
}

export function releaseFields(version) {
  const match = versionPattern.exec(version);
  if (!match) throw new Error(`Versão inválida: ${version}`);
  const playtest = Boolean(match[4]);
  const tag = `foundry-${playtest ? "playtest-" : ""}v${version}`;
  return {
    tag,
    playtest,
    fields: {
      version,
      manifest: playtest ? playtestManifest : `${github}/releases/latest/download/system.json`,
      download: `${github}/releases/download/${tag}/${systemId}.zip`,
    },
  };
}

export function validatePackage(root) {
  const file = join(root, "system.json");
  if (!lstat(file)?.isFile()) throw new Error(`Manifesto inválido: ${file}`);
  const manifest = readJson(file);
  if (manifest.id !== systemId || manifest.compatibility?.minimum !== "14") {
    throw new Error(`Esperado ${systemId} para Foundry v14 em ${file}.`);
  }
  const { fields } = releaseFields(manifest.version);
  if (manifest.manifest !== fields.manifest || manifest.download !== fields.download) {
    throw new Error(`URLs incompatíveis com a versão ${manifest.version} em ${file}.`);
  }

  for (const name of content) {
    const path = join(root, name);
    if (!lstat(path)?.isDirectory()) throw new Error(`Pasta inválida: ${path}`);
    validateTree(path);
  }
  const entries = [...manifest.esmodules, ...manifest.styles, ...manifest.languages.map(({ path }) => path)];
  if (!entries.includes("module/main.mjs")) throw new Error("Módulo de entrada ausente.");
  for (const entry of entries) {
    const file = resolve(root, entry);
    const child = relative(root, file);
    if (isAbsolute(entry) || isAbsolute(child) || child.startsWith("..") || !lstat(file)?.isFile()) {
      throw new Error(`Arquivo do manifesto inválido: ${entry}`);
    }
  }
  return manifest;
}

export function preparePackage(destination, tag) {
  const manifest = validatePackage(source);
  if (tag) {
    const current = releaseFields(manifest.version);
    // A stable draft is packaged from the same three-part version under review.
    const stable = releaseFields(manifest.version.split(".").slice(0, 3).join("."));
    if (tag !== current.tag && tag !== stable.tag) {
      throw new Error(`A tag ${tag} não corresponde à versão ${manifest.version}.`);
    }
    const release = tag === stable.tag ? stable : current;
    Object.assign(manifest, release.fields);
    if (!release.playtest) manifest.title = "Codex RPG — Foundry";
  }

  if (lstat(destination)) throw new Error(`O destino do pacote já existe: ${destination}`);
  mkdirSync(dirname(destination), { recursive: true });
  mkdirSync(destination);
  for (const name of content) copyDirectory(join(source, name), join(destination, name));
  cpSync(join(source, "README.md"), join(destination, "README.md"), {
    errorOnExist: true, force: false,
  });
  writeFileSync(join(destination, "system.json"), `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
  return validatePackage(destination);
}
