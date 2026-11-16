import {defenseDE, dodgeDE} from "./equipment-logic.mjs";

const namespace = "codex-rpg-foundry";
const setting = "defenseKey";
let creatingKey;

export function registerDefenseSettings(){
  game.settings.register(namespace, setting, {scope:"client", config:false, type:String, default:""});
}

export function lookupTarget(game, user, sceneId, targetIds = [], dodges = false) {
  if (!Array.isArray(targetIds) || targetIds.length > 1) throw Error("Selecione apenas um alvo para esta ação.");
  if (!targetIds.length) return null;
  const scene = game.scenes.get(sceneId);
  const token = scene?.tokens.get(targetIds[0]);
  const actor = token?.actor;
  if (!actor?.system.attributes || (!user.isGM && (token.hidden || user.viewedScene !== sceneId))) {
    throw Error("Alvo indisponível. Selecione outro Token no mapa.");
  }
  return {
    name: token.hidden ? "Alvo oculto" : token.name,
    tokenUuid: token.hidden ? null : token.uuid,
    actorUuid: token.hidden ? null : actor.uuid,
    de: dodges ? dodgeDE(actor) : defenseDE(actor),
    publicDefense: !token.hidden && Number(actor.ownership?.default ?? 0) >= 2,
    canInspect: user.isGM || actor.testUserPermission(user, "OBSERVER"),
  };
}

const encode = bytes => btoa(String.fromCharCode(...bytes));
const decode = text => Uint8Array.from(atob(text), ch => ch.charCodeAt(0));
const context = pending => new TextEncoder().encode(pending.id);

async function defenseKey(game, create) {
  if (!globalThis.crypto?.subtle) throw Error("A DE reservada exige localhost ou HTTPS no navegador do Narrador.");
  let encoded = game.settings.get(namespace, setting);
  if (!encoded && create) {
    creatingKey ??= (async () => {
      const value = encode(crypto.getRandomValues(new Uint8Array(32)));
      await game.settings.set(namespace, setting, value);
      return value;
    })().finally(() => { creatingKey = null; });
    encoded = await creatingKey;
  }
  if (!encoded) throw Error("Retome a rolagem no navegador do Narrador que a iniciou.");
  return crypto.subtle.importKey("raw", decode(encoded), "AES-GCM", false, ["encrypt", "decrypt"]);
}

export async function sealDefense(game, pending, de) {
  const key = await defenseKey(game, true);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt({name:"AES-GCM", iv, additionalData:context(pending)}, key, Uint8Array.of(de));
  return {iv:encode(iv), data:encode(new Uint8Array(encrypted))};
}

export async function readDefense(game, pending) {
  if (!pending.options.privateDefense) return pending.options.de;
  const key = await defenseKey(game, false);
  try {
    const {iv, data} = pending.options.sealedDE;
    const clear = await crypto.subtle.decrypt({name:"AES-GCM", iv:decode(iv), additionalData:context(pending)}, key, decode(data));
    return new Uint8Array(clear)[0];
  } catch {
    throw Error("Retome a rolagem no navegador do Narrador que a iniciou.");
  }
}
