import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { readJson, releaseFields, source, systemId, validatePackage } from "../scripts/package.mjs";

const install = fileURLToPath(new URL("../scripts/install.mjs", import.meta.url));
const build = fileURLToPath(new URL("../scripts/build.mjs", import.meta.url));
const current = validatePackage(source);

function run(script, args, options) {
  const result = spawnSync(process.execPath, [script, ...args], {
    encoding: "utf8", timeout: 25000, ...options,
  });
  assert.ifError(result.error);
  assert.equal(result.signal, null);
  return result;
}

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), "codex-foundry-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  const json = (path, data) => {
    const file = join(root, path);
    mkdirSync(join(file, ".."), { recursive: true });
    writeFileSync(file, JSON.stringify(data));
    return file;
  };
  const options = json("Config/options.json", { dataPath: root, port: 49328 });
  const world = json("Data/worlds/test/world.json", { users: ["Narrador"] });
  const actor = json("Data/worlds/test/actors.db", { actor: "Joana", items: ["Escudo"] });
  const packageRoot = join(root, "Data", "systems", systemId);
  mkdirSync(join(packageRoot, ".."), { recursive: true });
  return { root, json, options, world, actor, packageRoot };
}

test("gera a estrutura de playtest e prepara um manifesto estável com a tag correspondente", (t) => {
  const { root } = fixture(t);
  const playtest = releaseFields(current.version);
  const stable = releaseFields(current.version.split(".").slice(0, 3).join("."));
  for (const release of [playtest, stable]) {
    const target = join(root, release.tag);
    const result = run(build, ["--out", target, "--tag", release.tag]);
    assert.equal(result.status, 0, result.stderr);
    const manifest = validatePackage(target);
    for (const [key, expected] of Object.entries(release.fields)) assert.equal(manifest[key], expected);
    assert.ok(!existsSync(join(target, "tests")));
    assert.ok(!existsSync(join(target, "scripts")));
  }
  assert.notEqual(playtest.fields.manifest, stable.fields.manifest);
  const invalid = join(root, "invalid");
  assert.equal(run(build, ["--out", invalid, "--tag", "foundry-v9.9.9"]).status, 1);
  assert.ok(!existsSync(invalid));
});

test("valida, instala e atualiza com backup integral e sem alterar dados de usuário", (t) => {
  const { root, json, options, world, actor, packageRoot } = fixture(t);
  const args = ["--user-data", root];
  const unchanged = [options, world, actor].map((file) => [file, readFileSync(file)]);
  const rehearsal = run(install, ["--dry-run"], {
    env: { ...process.env, FOUNDRY_VTT_DATA_PATH: root },
  });
  assert.equal(rehearsal.status, 0, rehearsal.stderr);
  assert.match(rehearsal.stdout, /Simulação concluída/);
  assert.ok(!existsSync(join(root, "Backups")));
  assert.ok(!existsSync(packageRoot));

  const fresh = run(install, args);
  assert.equal(fresh.status, 0, fresh.stderr);
  assert.equal(validatePackage(packageRoot).version, current.version);
  assert.deepEqual(readdirSync(join(packageRoot, "storage")), []);
  const optionsOld = { id: systemId, version: "0.2.0" };
  json(`Data/systems/${systemId}/system.json`, optionsOld);
  json(`Data/systems/${systemId}/storage/preferencias.json`, { value: 42 });
  json(`Data/systems/${systemId}/modificacao-local.json`, { previous: true });
  const updated = run(install, args);
  assert.equal(updated.status, 0, updated.stderr);
  assert.equal(validatePackage(packageRoot).version, current.version);
  assert.equal(readJson(join(packageRoot, "storage", "preferencias.json")).value, 42);
  assert.ok(!existsSync(join(packageRoot, "modificacao-local.json")));
  const backupRoot = join(root, "Backups", "codex-rpg-system-installer");
  const [transaction] = readdirSync(backupRoot);
  const backup = join(backupRoot, transaction, systemId);
  assert.deepEqual(readJson(join(backup, "system.json")), optionsOld);
  assert.equal(readJson(join(backup, "modificacao-local.json")).previous, true);
  assert.deepEqual(readdirSync(backupRoot), [transaction]);
  for (const [file, contents] of unchanged) assert.deepEqual(readFileSync(file), contents);
});

test("recusa um sistema instalado com ID diferente", (t) => {
  const { root, json, packageRoot } = fixture(t);
  json(`Data/systems/${systemId}/system.json`, { id: "outro-sistema" });
  const result = run(install, ["--user-data", root]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /ID instalado inesperado/);
  assert.equal(readJson(join(packageRoot, "system.json")).id, "outro-sistema");
  assert.ok(!existsSync(join(root, "Backups")));
});

test("recusa acessar systems por um link que redireciona para worlds", (t) => {
  const { root, packageRoot } = fixture(t);
  const systems = join(packageRoot, "..");
  rmSync(systems, { recursive: true });
  // NTFS directory junctions work without the Windows privilege required for symlinks.
  symlinkSync(join(root, "Data", "worlds"), systems, "junction");
  const result = run(install, ["--user-data", root]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /User Data inválida/);
  assert.ok(!existsSync(join(root, "Data", "worlds", systemId)));
});

test("bloqueia a instalação enquanto um servidor escuta na porta do Foundry", async (t) => {
  const { root, json, packageRoot } = fixture(t);
  const server = createServer((socket) => socket.end()).listen(0, "127.0.0.1");
  t.after(() => server.close());
  await once(server, "listening");
  json("Config/options.json", { port: server.address().port });
  const result = run(install, ["--user-data", root]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /está em uso/);
  assert.ok(!existsSync(packageRoot));
  assert.ok(!existsSync(join(root, "Backups")));
});

test("bloqueia um processo Foundry headless mesmo antes de abrir a porta", async (t) => {
  const { root, packageRoot } = fixture(t);
  const mockServer = join(root, "main.mjs");
  writeFileSync(mockServer, "setInterval(() => {}, 1000); console.log('running');");
  const server = spawn(process.execPath, [mockServer, `--dataPath=${root}`]);
  const exited = once(server, "exit");
  t.after(async () => {
    server.kill();
    await exited;
  });
  await once(server.stdout, "data");
  const result = run(install, ["--user-data", root]);
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Foundry aberto/);
  assert.ok(!existsSync(packageRoot));
  assert.ok(!existsSync(join(root, "Backups")));
});


test("atualiza se o Windows travar a renomeação da pasta por causa do diretório de trabalho", {
  skip: process.platform !== "win32",
}, async (t) => {
  const { root, json, packageRoot } = fixture(t);
  json(`Data/systems/${systemId}/system.json`, { id: systemId, version: "0.2.0" });
  json(`Data/systems/${systemId}/marcador.json`, { preserve: true });
  const holder = spawn(process.execPath, ["-e", "setInterval(() => {}, 1000); console.log('ready')"], {
    cwd: packageRoot,
  });
  const exited = once(holder, "exit");
  let result;
  try {
    await once(holder.stdout, "data");
    result = run(install, ["--user-data", root]);
  } finally {
    holder.kill();
    await exited;
  }
  assert.equal(result.status, 0, result.stderr);
  assert.equal(validatePackage(packageRoot).version, current.version);
  assert.deepEqual(readdirSync(join(packageRoot, "storage")), []);
  const backupRoot = join(root, "Backups", "codex-rpg-system-installer");
  const [transaction] = readdirSync(backupRoot);
  assert.deepEqual(readJson(join(backupRoot, transaction, systemId, "marcador.json")), { preserve: true });
});
