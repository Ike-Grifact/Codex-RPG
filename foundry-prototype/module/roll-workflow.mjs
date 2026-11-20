import { rollNamespace as NS, preparePendingRoll, resolvePendingRoll, keepForActor, alternativesFor, rollResult, publicRollResult } from "./roll-resolution.mjs";

import {lookupTarget, readDefense, sealDefense} from "./roll-targets.mjs";

import {xpLedger} from "./rules.mjs";
import {escapeHTML} from "./roll-engine.mjs";
import {purchasePlan} from "./equipment-workflow.mjs";
import {animalTransformationPlan} from './transformations.mjs';
import {maxCourage,lifeMax} from './rules.mjs';
import {advancementPlan, creationMissing, gradeDetails, originChangePlan, skillRefundPlan, xpAdjustmentPlan} from "./advancement.mjs";
import {racialChoicesComplete,usesRacialRules,hasSkill} from "./races.mjs";
import {applyAttackImpact,impactSummary} from "./attack-impact.mjs";

const query = `${NS}.roll`;
const xpHistory = "xpHistory";
const refundHistory = "skillRefundHistory";
const approvalTimeout = 45000;
const flag = `flags.${NS}.pendingRoll`;
const queues = new Map();
let publishing = Promise.resolve();
const options = ["cancelP", "convertPairs", "characteristic", "secondCharacteristic", "activationPayment", "passAllyId"];

export function enqueueRoll(actor, user, request, dependencies = {}) {
  const previous = queues.get(actor.uuid) ?? Promise.resolve();
  const next = previous.catch(() => {}).then(() => mutateRoll(actor, user, request, dependencies));
  queues.set(actor.uuid, next);
  return next.finally(() => {
    if (queues.get(actor.uuid) === next) queues.delete(actor.uuid);
  });
}

async function confirmAdvancement({title,content}){
  let timer;
  try{
    return await foundry.applications.api.DialogV2.confirm({
      window:{title}, content, rejectClose:false,
      yes:{label:"Confirmar"}, no:{label:"Cancelar"},
      render:(_event,dialog)=>{timer??=setTimeout(()=>void dialog.close(),approvalTimeout);},
    });
  }finally{clearTimeout(timer);}
}

const buildOf = actor => actor.system.toObject?.() ?? actor.system;

async function mutateRoll(actor, user, request, {game = globalThis.game, chat = globalThis.ChatMessage, resolveUuid = globalThis.fromUuid, confirm = confirmAdvancement} = {}) {
  verifyAuthority(game);
  if (!actor.testUserPermission(user, "OWNER")) throw Error("Sem permissão para rolar por esta ficha.");
  const pending = actor.getFlag(NS, "pendingRoll");
  if(request.action==="attackShortcut"){
    if(pending)throw Error("Finalize a rolagem antes de editar atalhos.");
    const item=actor.items.get(request.itemId);
    if(item?.type!=="equipment"||!["weapon","firearm"].includes(item.system.kind))throw Error("Escolha uma arma no inventário.");
    const ids=(actor.getFlag(NS,"attackShortcuts")??[]).filter(id=>actor.items.has(id)&&id!==item.id);
    if(request.enabled===true)ids.push(item.id);
    await actor.setFlag(NS,"attackShortcuts",ids);
    return;
  }
  if(request.action==="origin"){
    if(pending)throw Error("Finalize a rolagem antes de mudar a origem.");
    const creating=Boolean(actor.getFlag(NS,"creationPending"));
    if(!creating&&!user.isGM)throw Error("O Narrador ajusta a origem de fichas concluídas.");
    await actor.update(originChangePlan(buildOf(actor),request,creating));
    return;
  }
  if(request.action==="perseverance"){
    if(pending)throw Error("Finalize a rolagem antes de marcar Perseverança.");
    if(!usesRacialRules(actor.system)||actor.system.race!=="humano"||actor.system.perseverancaUsed){
      throw Error("Perseverança Humana indisponível.");
    }
    await actor.update({"system.perseverancaUsed":true});
    return;
  }
  if(request.action==='resource'){
    if(!['system.life.value','system.courage'].includes(request.field)||![-1,1].includes(request.delta))throw Error('Recurso inválido.');
    const current=request.field==='system.courage'?actor.system.courage:actor.system.life.value;
    const limit=request.field==='system.courage'?Math.max(current,maxCourage(actor.system.level)):lifeMax(actor.system);
    await actor.update({[request.field]:Math.max(0,Math.min(limit,current+request.delta))});return;
  }
  if(request.action==='transform'){
    if(pending)throw Error('Finalize a rolagem antes de transformar.');
    if(request.revert){await actor.update({'system.transformation':{}});return;}
    if(actor.system.transformation?.kind)throw Error('Reverta a forma atual antes de transformar novamente.');
    const plan=animalTransformationPlan(actor.system,request);
    await actor.update({'system.transformation':plan.state,'system.courage':actor.system.courage-plan.courage});return;
  }
  if(request.action==='rest'){
    if(pending)throw Error('Finalize a rolagem antes de descansar.');
    if(!['short','long'].includes(request.kind))throw Error('Descanso inválido.');
    if(request.kind==='short'&&!hasSkill(actor.system,'recobrar-coragem'))throw Error('Descanso curto exige Recobrar Coragem.');
    const approved=await confirm({title:'Confirmar descanso',content:'<p>Confirmar descanso '+(request.kind==='short'?'curto e cena narrativa':'longo')+' de '+escapeHTML(actor.name)+'?</p>'});
    if(!approved)throw Error('Descanso cancelado.');
    verifyAuthority(game);
    if(actor.getFlag(NS,'pendingRoll'))throw Error('A ficha tem uma rolagem pendente.');
    const amount=request.kind==='short'?2:Number(actor.system.attributes.vigor)+1;
    const changes={'system.courage':Math.min(Math.max(actor.system.courage,maxCourage(actor.system.level)),actor.system.courage+amount)};
    if(request.kind==='long'&&actor.system.race==='humano')changes['system.perseverancaUsed']=false;
    await actor.update(changes);return;
  }
  if(request.action==='purchase'){
    const history=actor.getFlag(NS,'purchases')??[];
    if(history.some(entry=>entry.id===request.id))return {purchased:false};
    if(pending)throw Error('Finalize a rolagem antes de comprar.');
    const {items,entry}=purchasePlan(actor,request);
    await actor.update({items,['flags.'+NS+'.purchases']:[...history,{...entry,userId:user.id,at:Date.now()}]});
    return {purchased:true};
  }
  if(request.action==='equipment'){
    if(pending)throw Error('Finalize a rolagem antes de modificar o equipamento.');
    const item=actor.items.get(request.itemId);
    if(item?.type!=='equipment')throw Error('Equipamento indisponível.');
    if(item.system.kind==='resource'&&!user.isGM)throw Error('O Narrador ajusta os recursos de troca.');
    const path=request.path;
    const fields=['quantity','integrity.value','integrity.max','ammo.value','ammo.max','equipped','properties','associatedEquipment','embeddedWeapon','description'];
    if(!fields.includes(path))throw Error('Campo de equipamento inválido.');
    let value=request.value;
    if(path==='equipped')value=value===true;
    else if(path==='properties'){
      if(!Array.isArray(value)||value.length>24||value.some(x=>typeof x!=='string'||x.length>100))throw Error('Propriedades inválidas.');
    }else if(['description','associatedEquipment','embeddedWeapon'].includes(path)){
      if(typeof value!=='string'||value.length>5000)throw Error('Texto inválido.');
      if(path==='embeddedWeapon'&&(item.system.kind!=='shield'||!['','medio','pesado'].includes(value)))throw Error('Arma cravada inválida.');
    }else if(!Number.isInteger(value)||value<0||value>100000||(path==='quantity'&&value<1))throw Error('Quantidade inválida.');
    const changes={['system.'+path]:value};
    if(path==='integrity.value'&&value>item.system.integrity.max)throw Error('Integridade acima do máximo.');
    if(path==='integrity.max')changes['system.integrity.value']=Math.min(value,item.system.integrity.value);
    if(path==='ammo.value'&&value>item.system.ammo.max)throw Error('Munição acima do máximo.');
    if(path==='ammo.max')changes['system.ammo.value']=Math.min(value,item.system.ammo.value);
    await item.update(changes);
    return;
  }
  if (request.action === "adjustXP") {
    if (!user.isGM) throw Error("Somente o Narrador pode ajustar XP adicional.");
    if (pending) throw Error("Finalize ou descarte a rolagem antes de editar.");
    let plan=xpAdjustmentPlan(buildOf(actor),request);
    if(plan.delta<0){
      const accepted=await confirm({title:"Retirar XP adicional",
        content:"<p>Retirar "+(-plan.delta)+" XP de "+escapeHTML(actor.name)+"? O XP adicional passará de "+plan.previous+" para "+plan.next+".</p>"});
      if(!accepted)throw Error("A retirada de XP foi cancelada.");
      verifyAuthority(game);
      if(actor.getFlag(NS,"pendingRoll"))throw Error("Finalize ou descarte a rolagem antes de editar.");
      plan=xpAdjustmentPlan(buildOf(actor),request);
    }
    const entry={userId:user.id,userName:user.name,at:Date.now(),...plan};
    await actor.update({"system.xp":plan.next,["flags."+NS+"."+xpHistory]:[...(actor.getFlag(NS,xpHistory)??[]),entry]});
    return;
  }
  if (request.action === "advance" || request.action === "completeCreation") {
    if (pending) throw Error("Finalize ou descarte a rolagem antes de editar.");
    const creationPending = Boolean(actor.getFlag(NS, "creationPending"));
    if (request.action === "completeCreation") {
      if (!creationPending) return;
      if (!racialChoicesComplete(actor.system)) throw Error("Complete as escolhas de elementos da origem.");
      const missing = creationMissing(actor.system);
      if (missing.attr || missing.training) throw Error("Adquira um Atributo G1 e um Conhecimento ou uma Prática G1.");
      if(xpLedger(actor.system).left<0)throw Error("O XP investido excede o total da ficha.");
      await actor.unsetFlag(NS, "creationPending");
      return;
    }
    const advance=request.advance??{};
    if(advance.kind==="grade"&&!Number.isInteger(advance.expectedGrade))throw Error("Confira o Grau atual antes de alterar.");
    const refund=advance.kind==="skill"&&advance.remove===true;
    if(refund&&!Number.isInteger(advance.expectedRefund))throw Error("Confira o reembolso antes de devolver.");
    // A fila valida a compra e o orçamento no estado atual do Actor.
    let changes=advancementPlan(buildOf(actor),advance,creationPending);
    if(refund&&!creationPending){
      const preview=skillRefundPlan(buildOf(actor),advance.key);
      const accepted=await confirm({title:"Autorizar devolução de Perícia",
        content:"<p>"+escapeHTML(user.name)+" solicita devolver "+escapeHTML(preview.name)+" de "+
          escapeHTML(actor.name)+". A devolução libera "+preview.refund+" XP.</p>"});
      if(!accepted)throw Error("A devolução de Perícia não foi autorizada pelo Narrador.");
      verifyAuthority(game);
      if(!actor.testUserPermission(user,"OWNER")||actor.getFlag(NS,"pendingRoll"))throw Error("A ficha não está disponível para edição.");
      const system=buildOf(actor),plan=skillRefundPlan(system,advance.key);
      changes=advancementPlan(system,advance,false);
      const entry={skillId:advance.key,xpRefund:plan.refund,spentBefore:plan.spentBefore,spentAfter:plan.spentAfter,
        requestedBy:user.id,authorizedBy:game.user.id,at:Date.now()};
      changes["flags."+NS+"."+refundHistory]=[...(actor.getFlag(NS,refundHistory)??[]),entry];
    }
    if(advance.kind==="grade"&&advance.delta===-1&&!creationPending&&!user.isGM){
      const row=gradeDetails(buildOf(actor),advance.group,advance.key);
      const accepted=await confirm({title:"Autorizar redução de Grau",
        content:"<p>"+escapeHTML(user.name)+" pede para reduzir "+escapeHTML(row.name)+" de "+escapeHTML(actor.name)+
          " de G"+row.grade+" para G"+(row.grade-1)+", liberando "+row.refund+" XP.</p>"});
      if(!accepted)throw Error("A redução de Grau não foi autorizada pelo Narrador.");
      verifyAuthority(game);
      if(!actor.testUserPermission(user,"OWNER")||actor.getFlag(NS,"pendingRoll"))throw Error("A ficha não está disponível para edição.");
      changes=advancementPlan(buildOf(actor),advance,Boolean(actor.getFlag(NS,"creationPending")));
    }
    await actor.update(changes);
    return;
  }
  if (request.action === "target") {
    const target = lookupTarget(game, user, request.sceneId, request.targetIds, request.dodges === true);
    return target && {name: target.name, de: target.canInspect ? target.de : null};
  }
  if (request.action === "grade") {
    if (!Number.isInteger(request.value) || request.value < 1 || request.value > 6) throw Error("Grau inválido.");
    if (request.value === actor.system.threatGrade) return;
    if (pending?.publication) throw Error("Retome a publicação antes de alterar o Grau.");
    const changes = {"system.threatGrade": request.value};
    if (pending) changes[`flags.${NS}.-=pendingRoll`] = null;
    await actor.update(changes);
    return;
  }
  if (request.action === "start") {
    if (pending) return {started: false};
    if(actor.system.transformation?.kind==='animal'&&request.options?.mode==='conjuracao')throw Error('A forma animal não pode conjurar.');
    if (actor.getFlag(NS, "creationPending")) throw Error("Conclua a criação do Aprendiz antes de rolar.");
    const { pending: draft, roll, changes, privateDE } = await preparePendingRoll(actor, request, user, game);
    verifyAuthority(game);
    if(draft.options.privateDefense)draft.options.sealedDE=await sealDefense(game,draft,privateDE);
    await actor.update({...changes, [flag]: draft});
    return {started: true, roll: roll.toJSON()};
  }
  if (!pending || pending.id !== request.id) return;
  if (request.action === "finish") {
    // Acertos simultâneos podem atingir o mesmo alvo ou o outro atacante.
    const next=publishing.then(()=>publish(actor,user,pending,game,chat,resolveUuid));
    publishing=next.catch(()=>{});
    return next;
  }
  if (request.action === "preview" && pending.options.privateDefense && !pending.publication) {
    const de = await readDefense(game, pending);
    return {
      summary: pending.selected.length ? publicRollResult(rollResult(actor, pending, de), true) : null,
      comparisons: alternativesFor(actor, pending, de).map(result => publicRollResult(result, true)),
    };
  }
  if (pending.publication) throw Error("A ação foi confirmada. Retome a publicação no chat.");
  if (request.action === "discard") {
    await actor.unsetFlag(NS, "pendingRoll");
    return;
  }
  const config = {...pending.options};
  let selected = pending.selected;
  if (request.action === "keep") {
    const ids = request.ids;
    if (!Array.isArray(ids) || ids.length > keepForActor(actor, config.extraKeep)
      || new Set(ids).size !== ids.length || ids.some(id => !pending.dice.some(die => die.id === id))) {
      throw Error("Seleção de dados inválida ou acima do limite.");
    }
    selected = [...ids];
    Object.assign(config, {cancelP: 0, convertPairs: 0, passAllyId: ""});
  } else if (request.action === "option" && options.includes(request.key)) {
    const {key, value} = request;
    if (["cancelP", "convertPairs"].includes(key)) {
      if (!Number.isSafeInteger(value) || value < 0 || value > 100) throw Error("Quantidade de Antecipar inválida.");
    } else if (typeof value !== "string" || value.length > 200) throw Error("Opção inválida.");
    if (key === "activationPayment" && value!=="courage") throw Error("A ativação usa Coragem. PP foi revogado.");
    config[key] = value;
    if (key === "characteristic") config.secondCharacteristic = "";
  } else return;
  await actor.update({[flag]: {...pending, selected, options: config}});
}

function verifyAuthority(game) {
  if (game.user && !game.user.isActiveGM) throw Error("O Narrador ativo mudou. Tente novamente.");
}

async function publish(actor, user, pending, game, chat, resolveUuid) {
  verifyAuthority(game);
  if (!pending.publication) {
    if (pending.version < 3 && game.messages.some(message => message.getFlag(NS, "rollId") === pending.id)) {
      await actor.unsetFlag(NS, "pendingRoll");
      return;
    }
    const {changes, content, result, adjudication, impact} = resolvePendingRoll(actor, pending, game, await readDefense(game, pending));
    const id = pending.id.replaceAll("-", "").slice(0, 16);
    const publication = {id, author: user.id, content, result, adjudication, impact};
    pending = {...pending, publication};
    // Persist costs and the recoverable publication in a single Actor update.
    await actor.update({...changes, [flag]: pending});
  }

  const publication = pending.publication;
  const existing = () => game.messages.get(publication.id);
  const matches = () => existing()?.getFlag(NS, "rollId") === pending.id;
  if(existing()&&!matches())throw Error("O identificador de publicação já está em uso.");
  const receipt=publication.impact?await applyAttackImpact(publication.impact,pending.id,game,resolveUuid):null;
  const impactText=receipt?impactSummary(receipt,pending.options.privateDefense):"";
  verifyAuthority(game);
  if (!matches()) {
    try {
      await chat.create({
        _id: publication.id, author: publication.author, speaker: chat.getSpeaker({actor}),
        content: impactText?publication.content.replace(/<\/div>\s*$/,`<p class="codex-chat-impact">${escapeHTML(impactText)}</p></div>`):publication.content,
        flags: {[NS]: {
          rollId: pending.id, result: publication.result, dice: pending.dice, kept: pending.selected,
          adjudication: publication.adjudication,
        }},
      }, {keepId: true});
    } catch (error) {
      if (!matches()) throw error;
    }
  }
  if (!matches()) throw Error("Publicação ainda não confirmada. Use Retomar publicação.");
  if (actor.getFlag(NS, "pendingRoll")?.id === pending.id) await actor.unsetFlag(NS, "pendingRoll");
}

export function registerRollQueries() {
  CONFIG.queries[query] = async ({actorUuid, ...request}, {user}) => {
    if (!game.user.isActiveGM) throw Error("O Narrador ativo mudou. Tente novamente.");
    const actor = await fromUuid(actorUuid);
    if (actor?.documentName !== "Actor") throw Error("Ficha indisponível.");
    return enqueueRoll(actor, user, request);
  };
}

export async function requestRoll(actor, request) {
  if (!actor.isOwner) throw Error("Sem permissão para rolar por esta ficha.");
  const gm = game.users.activeGM;
  if (!gm) throw Error("Conecte um Narrador para sincronizar a rolagem.");
  if (gm.id === game.user.id) return enqueueRoll(actor, game.user, request);
  if (!game.user.hasPermission("QUERY_USER")) {
    throw Error("O Narrador precisa habilitar Consultar Usuário nas permissões do Foundry para sincronizar rolagens.");
  }
  const needsApproval=request.action==='rest'||request.action==="adjustXP"&&request.delta<0||
    request.action==="advance"&&(request.advance?.delta===-1||request.advance?.remove===true);
  return gm.query(query,{...request,actorUuid:actor.uuid},needsApproval?{timeout:approvalTimeout+15000}:undefined);
}
