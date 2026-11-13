import { spawnSync } from "node:child_process";
import {
  mkdirSync, mkdtempSync, realpathSync, readdirSync, renameSync, rmdirSync, rmSync, statSync,
} from "node:fs";
import { connect } from "node:net";
import { homedir, networkInterfaces } from "node:os";
import { basename, dirname, isAbsolute, join, relative, sep } from "node:path";
import { parseArgs } from "node:util";
import { copyDirectory, lstat, preparePackage, readJson, source, systemId, validatePackage } from "./package.mjs";

function looksLikeUserData(root) {
  return lstat(join(root, "Config", "options.json"))?.isFile()
    && lstat(join(root, "Data"))?.isDirectory()
    && lstat(join(root, "Data", "systems"))?.isDirectory();
}

function defaultUserData() {
  const home = homedir();
  switch (process.platform) {
    case "win32":
      return [join(process.env.LOCALAPPDATA || join(home, "AppData", "Local"), "FoundryVTT")];
    case "darwin":
      return [join(home, "Library", "Application Support", "FoundryVTT")];
    default:
      return [
        join(process.env.XDG_DATA_HOME || join(home, ".local", "share"), "FoundryVTT"),
        join(home, "FoundryVTT"),
        "/local/FoundryVTT",
      ];
  }
}

function resolveUserData(override) {
  const configured = override ?? process.env.FOUNDRY_VTT_DATA_PATH;
  if (configured !== undefined) {
    if (!configured || !looksLikeUserData(configured)) {
      throw new Error(`User Data inválida: ${configured}. Informe a raiz que contém Config e Data/systems.`);
    }
    return realpathSync(configured);
  }

  const candidates = new Set();
  for (const root of defaultUserData()) {
    const options = join(root, "Config", "options.json");
    const custom = lstat(options)?.isFile() && readJson(options).dataPath;
    for (const candidate of [custom, root]) {
      if (candidate && looksLikeUserData(candidate)) candidates.add(realpathSync(candidate));
    }
  }

  // Find portable installs when run from their directory tree.
  for (let root = process.cwd(); ; root = dirname(root)) {
    const portable = lstat(join(root, "App", "portable.json"))?.isFile();
    if (portable && looksLikeUserData(root)) {
      const custom = readJson(join(root, "Config", "options.json")).dataPath;
      const candidate = custom || root;
      if (looksLikeUserData(candidate)) candidates.add(realpathSync(candidate));
      break;
    }
    if (root === dirname(root)) break;
  }

  if (candidates.size !== 1) {
    throw new Error(candidates.size
      ? `Mais de uma User Data encontrada. Use --user-data com o caminho correto:\n${[...candidates].join("\n")}`
      : "User Data não localizada. Informe --user-data com o caminho mostrado na configuração do Foundry.");
  }
  return [...candidates][0];
}

function processList(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8", windowsHide: true, timeout: 15000, maxBuffer: 16 * 1024 * 1024,
  });
  if (result.error || result.status !== 0) {
    throw new Error(`Não foi possível verificar os processos do Foundry (${command}).`);
  }
  return result.stdout;
}

function foundryProcess() {
  const desktop = /^(?:foundryvtt|foundry virtual tabletop)(?:\.exe)?$/i;
  const server = /(?:^|[\s/\\])(?:foundryvtt[^\s/\\]*|Foundry Virtual Tabletop|resources[/\\]app)[/\\](?:[^\r\n]*[/\\])?main\.(?:mjs|js)(?=["'\s]|$)|(?:^|\s)--dataPath(?:=|\s)/i;
  if (process.platform === "win32") {
    const script = [
      "$ErrorActionPreference = 'Stop'",
      "Get-CimInstance Win32_Process -Filter \"Name LIKE '%Foundry%' OR Name = 'node.exe' OR Name = 'electron.exe'\"",
    ].join("; ") + " | Select-Object Name,ProcessId,CommandLine | ConvertTo-Json -Compress";
    const output = processList("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", script]).trim();
    const processes = output ? [JSON.parse(output)].flat() : [];
    const running = processes.find(({ Name, CommandLine }) => desktop.test(Name) || server.test(CommandLine ?? ""));
    return running?.ProcessId;
  }

  for (const line of processList("ps", ["-ax", "-ww", "-o", "pid=,comm=,args="]).split("\n")) {
    const match = /^\s*(\d+)\s+(.+)$/.exec(line);
    if (!match) continue;
    const [, pid, command] = match;
    if (/(?:^|\/)Foundry Virtual Tabletop(?:\s|$)/i.test(command)
      || desktop.test(basename(command.split(/\s+/, 1)[0]))
      || (/(?:^|\/)(?:node|electron)(?:\s|$)/.test(command) && server.test(command))) {
      return pid;
    }
  }
  return undefined;
}

function isListening(host, port) {
  return new Promise((resolve) => {
    const socket = connect({ host, port, timeout: 800 });
    socket.once("connect", () => { socket.destroy(); resolve(true); });
    socket.once("timeout", () => { socket.destroy(); resolve(false); });
    socket.once("error", () => resolve(false));
  });
}

async function assertFoundryClosed(port) {
  const pid = foundryProcess();
  if (pid) throw new Error(`Foundry aberto (PID ${pid}). Encerre o aplicativo ou servidor antes de atualizar.`);
  const hosts = new Set(["127.0.0.1", "::1"]);
  for (const addresses of Object.values(networkInterfaces())) {
    for (const { address, scopeid } of addresses ?? []) {
      hosts.add(scopeid ? `${address}%${scopeid}` : address);
    }
  }
  const listeners = await Promise.all([...hosts].map((host) => isListening(host, port)));
  if (listeners.some(Boolean)) {
    throw new Error(`A porta ${port} está em uso. Encerre o servidor do Foundry antes de atualizar.`);
  }
}

function requireDirectory(path) {
  if (!lstat(path)?.isDirectory()) throw new Error(`Pasta inválida ou redirecionada: ${path}`);
}

function inside(parent, child) {
  const part = relative(parent, child);
  return !part || (!isAbsolute(part) && part !== ".." && !part.startsWith(`..${sep}`));
}

function installedVersion(target) {
  if (!lstat(target)) return undefined;
  requireDirectory(target);
  const file = join(target, "system.json");
  if (!lstat(file)?.isFile()) throw new Error(`Manifesto instalado inválido: ${file}`);
  const manifest = readJson(file);
  if (manifest.id !== systemId) throw new Error(`ID instalado inesperado em ${file}: ${manifest.id}`);
  return manifest.version ?? "(versão desconhecida)";
}

async function replaceContents(target, stage, backup, port) {
  // An open working directory on Windows may prevent renaming the package root.
  // Back up everything before touching any entry, and keep storage in place.
  copyDirectory(target, backup);
  await assertFoundryClosed(port);
  const holding = join(dirname(stage), "anterior");
  mkdirSync(holding);
  const removed = [];
  const promoted = [];
  try {
    for (const name of readdirSync(target)) {
      if (name === "storage") continue;
      renameSync(join(target, name), join(holding, name));
      removed.push(name);
    }
    for (const name of readdirSync(stage)) {
      if (name === "storage") continue;
      renameSync(join(stage, name), join(target, name));
      promoted.push(name);
    }
    validatePackage(target);
  } catch (error) {
    try {
      for (const name of promoted.reverse()) renameSync(join(target, name), join(stage, name));
      for (const name of removed.reverse()) renameSync(join(holding, name), join(target, name));
    } catch (restoreError) {
      throw new Error(`Falha ao restaurar. Verifique ${backup}: ${restoreError.message}`, { cause: error });
    }
    throw error;
  }
  rmSync(holding, { recursive: true });
  rmSync(stage, { recursive: true });
}

async function install(userData, dryRun) {
  const data = join(userData, "Data");
  const systems = join(data, "systems");
  const target = join(systems, systemId);
  requireDirectory(data);
  requireDirectory(systems);
  if (inside(target, realpathSync(source)) || inside(realpathSync(source), target)) {
    throw new Error("Execute o instalador a partir de um clone separado da pasta instalada.");
  }
  const manifest = validatePackage(source);
  const previous = installedVersion(target);
  const port = Number(readJson(join(userData, "Config", "options.json")).port ?? 30000);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error(`Porta de Foundry inválida: ${port}`);
  console.log(`User Data: ${userData}\nSistema: ${systemId}\nDestino: ${target}`);
  console.log(`Versão: ${previous ?? "(primeira instalação)"} → ${manifest.version}`);
  await assertFoundryClosed(port);
  if (dryRun) return console.log("Simulação concluída sem gravar arquivos.");

  const backups = join(userData, "Backups");
  const backupRoot = join(backups, "codex-rpg-system-installer");
  for (const directory of [backups, backupRoot]) {
    if (!lstat(directory)) mkdirSync(directory, { recursive: true });
    requireDirectory(directory);
  }
  if (statSync(backupRoot).dev !== statSync(systems).dev) {
    throw new Error("A pasta do sistema e a de backups precisam estar no mesmo volume.");
  }
  const lock = join(backupRoot, ".install-lock");
  try {
    mkdirSync(lock);
  } catch (error) {
    if (error.code !== "EEXIST") throw error;
    throw new Error(`Instalação em andamento ou interrompida. Verifique ${lock}.`);
  }

  let transaction;
  let backup;
  try {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    transaction = mkdtempSync(join(backupRoot, `${stamp}-`));
    const stage = join(transaction, "novo");
    backup = join(transaction, systemId);
    preparePackage(stage);
    const existing = installedVersion(target);
    const storage = join(target, "storage");
    if (existing && lstat(storage)) copyDirectory(storage, join(stage, "storage"));
    await assertFoundryClosed(port);

    if (existing) {
      try {
        renameSync(target, backup);
      } catch (error) {
        if (process.platform !== "win32" || !["EBUSY", "EPERM", "EACCES"].includes(error.code)) throw error;
        await replaceContents(target, stage, backup, port);
        console.log(`Backup: ${backup}`);
        console.log(`Instalado e validado: ${manifest.id} ${manifest.version}`);
        return;
      }
    }
    let promoted = false;
    try {
      renameSync(stage, target);
      promoted = true;
      validatePackage(target);
    } catch (error) {
      try {
        if (promoted) renameSync(target, stage);
        if (existing) renameSync(backup, target);
      } catch (restoreError) {
        throw new Error(`Falha ao restaurar. Verifique ${transaction}: ${restoreError.message}`, { cause: error });
      }
      throw error;
    }

    if (existing) console.log(`Backup: ${backup}`);
    console.log(`Instalado e validado: ${manifest.id} ${manifest.version}`);
  } finally {
    try {
      // Keep the original installation intact even if a rollback fails.
      if (transaction && !lstat(backup)) rmSync(transaction, { recursive: true, force: true });
    } finally {
      rmdirSync(lock);
    }
  }
}

try {
  const { values } = parseArgs({
    options: { "user-data": { type: "string" }, "dry-run": { type: "boolean" } },
  });
  await install(resolveUserData(values["user-data"]), values["dry-run"]);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
