import { resolve } from "node:path";
import { parseArgs } from "node:util";
import { preparePackage } from "./package.mjs";

try {
  const { values } = parseArgs({
    options: { out: { type: "string" }, tag: { type: "string" } },
  });
  if (!values.out) throw new Error("Uso: node foundry-prototype/scripts/build.mjs --out <pasta> [--tag <tag>]");
  const target = resolve(values.out);
  const manifest = preparePackage(target, values.tag);
  console.log(`${manifest.id} ${manifest.version} → ${target}`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
