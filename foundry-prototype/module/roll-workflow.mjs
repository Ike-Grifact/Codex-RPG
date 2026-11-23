import { rollNamespace as NS, pendingRollEntry, pendingRollFor, preparePendingRoll, resolvePendingRoll, keepForActor, alternativesFor, rollResult, publicRollResult, castingFor } from "./roll-resolution.mjs";

import {lookupTarget, readDefense, sealDefense} from "./roll-targets.mjs";

import {xpLedger} from "./rules.mjs";
import {escapeHTML} from "./roll-engine.mjs";
import {purchasePlan,grantVTPlan} from "./equipment-workflow.mjs";
import {armorFits} from "./equipment-logic.mjs";
import {animalTransformationPlan} from './transformations.mjs';
import {maxCourage,lifeMax,hasSmallCompanion} from './rules.mjs';
import {advancementPlan, creationMissing, gradeDetails, originChangePlan, skillRefundPlan, xpAdjustmentPlan} from "./advancement.mjs";
import {racialChoicesComplete,usesRacialRules,hasSkill,isRuna,regularizePureElement} from "./races.mjs";
import {spherePlan,sphereRound,canUseTechnique} from "./techniques.mjs";
import {applyAttackImpact,impactSummary} from "./attack-impact.mjs";

import {actionResource,spendActionResource,usesLocal} from "./combat-resources.mjs";

const query = `${NS}.roll`;
const xpHistory = "xpHistory";
const refundHistory = "skillRefundHistory";
const approvalTimeout = 45000;
const queues = new Map();
let publishing = Promise.resolve();
const options = ["cancelP", "convertPairs", "characteristic", "secondCharacteristic", "thirdCharacteristic", "piercingBlocked", "activationPayment", "passAllyId"];

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

function pendingChanges(actor, roll) {
  const key = actor.isToken ? "tokenPendingRoll" : "pendingRoll";
  const changes = {[`flags.${NS}.${key}`]: roll};
  if (pendingRollEntry(actor).key !== key) changes[`flags.${NS}.-=pendingRoll`] = null;
  return changes;
}

async function mutateRoll(actor, user, request, {game = globalThis.game, chat = globalThis.ChatMessage, resolveUuid = globalThis.fromUuid, confirm = confirmAdvancement} = {}) {
  verifyAuthority(game);
  if (!actor.testUserPermission(user, "OWNER")) throw Error("Sem permissão para rolar por esta ficha.");
  const {key: pendingKey, roll: pending} = pendingRollEntry(actor);
  if(request.action==="attackShortcut"){
    if(pending)throw Error("Finalize a rolagem antes de editar atalhos.");
    const item=actor.items.get(request.itemId);
    if(item?.type!=="equipment"||!["weapon","firearm"].includes(item.system.kind))throw Error("Escolha uma arma no inventário.");
    const ids=(actor.getFlag(NS,"attackShortcuts")??[]).filter(id=>actor.items.has(id)&&id!==item.id);
    if(request.enabled===true)ids.push(item.id);
    await actor.setFlag(NS,"attackShortcuts",ids);
    return;
  }
  if(request.action==="regularizePureElement"){
    if(pending||actor.getFlag(NS,"creationPending"))throw Error("Conclua a rolagem ou a criação antes de regularizar a origem.");
    await actor.update(regularizePureElement(actor.system,request.element));
    return;
  }
  if(request.action==="origin"){
    if(pending)throw Error("Finalize a rolagem antes de mudar a origem.");
    const creating=Boolean(actor.getFlag(NS,"creationPending"));
    if(!creating&&!user.isGM)throw Error("O Narrador ajusta a origem de fichas concluídas.");
    const changes=originChangePlan(buildOf(actor),request,creating);
    if(request.race==="runa_espinhos"&&[...actor.items.values()].some(i=>i.system.kind==="armor"&&i.system.equipped)){
      changes.items=[...actor.items.values()].map(item=>{
        const data=item.toObject();
        if(data.system.kind==="armor")data.system.equipped=false;
        return data;
      });
    }
    await actor.update(changes);
    return;
  }
  if(request.action==="resolveCast"){
    if(!user.isGM)throw Error("A conclusão da conjuração exige o Narrador.");
    if(pending)throw Error("Publique a rolagem antes de resolver a conjuração.");
    const cast=castingFor(actor);
    if(!cast||cast.id!==request.id)return;
    const combat=game.combats.get(cast.combatId);
    if(!request.cancel&&combat?.started&&combat.round<cast.round+cast.turns-1)
      throw Error("A conjuração ainda está em preparação.");
    if(!request.cancel&&cast.impact)await applyAttackImpact(cast.impact,cast.id+"-efeito",game,resolveUuid);
    await actor.unsetFlag(NS,"casting");
    return;
  }
  if(request.action==="companion"){
    if(pending||!hasSkill(actor.system,"domar-criatura-pequena"))throw Error("Finalize a rolagem e verifique Domar Criatura Pequena.");
    const name=String(request.name??"").trim().slice(0,70);
    const species=request.species==="serpente"?"serpente":"outro";
    const companion={name,species,present:request.present===true};
    if(companion.present&&!name)throw Error("Informe o nome da criatura domesticada.");
    const next={...buildOf(actor),companion};
    const life=actor.system.life.value;
    const difference=lifeMax(next)-lifeMax(actor.system);
    await actor.update({"system.companion":companion,"system.life.value":life?Math.max(0,Math.min(lifeMax(next),life+difference)):0});
    return;
  }
  if(request.action==="sphere"){
    if(pending)throw Error("Finalize a rolagem antes de mudar as Esferas Espirituais.");
    if(usesLocal(actor)&&request.kind==="absorb")throw Error("Absorver Esferas recupera Coragem e exige adjudicação para inimigos.");
    const spend=request.kind==="create"?spendActionResource(actor,1,game.combat):{};
    const changes=spherePlan({...buildOf(actor),courage:actor.system[actionResource(actor)]},request.kind,sphereRound(game.combat),user.isGM);
    if(usesLocal(actor)&&request.kind==="create")delete changes["system.courage"];
    await actor.update({...changes,...spend});
    return;
  }
  if(request.action==="declareTechnique"){
    const names={"sentido-elemental":"Sentido Elemental","corpo-fechado":"Corpo Fechado","impacto-psiquico":"Impacto Psíquico"};
    const id=request.kind;
    if(!Object.hasOwn(names,id)||pending||!canUseTechnique(actor.system,id))
      throw Error("A Perícia não está disponível ou falta Coragem.");
    await actor.update(spendActionResource(actor,1,game.combat));
    return {declared:names[id]};
  }
  if(request.action==="resetRuneShield"){
    if(!user.isGM||!isRuna(actor.system)||pending)throw Error("A renovação diária exige Narrador e ficha livre.");
    await actor.update({"system.runeShieldFreeUsed":false});
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
    if(usesLocal(actor)&&request.field==='system.courage')throw Error('Inimigos operam com Pavor local.');
    if(!['system.life.value','system.courage'].includes(request.field)||![-1,1].includes(request.delta))throw Error('Recurso inválido.');
    const current=request.field==='system.courage'?actor.system.courage:actor.system.life.value;
    const limit=request.field==='system.courage'?Math.max(current,maxCourage(actor.system.level)):lifeMax(actor.system);
    await actor.update({[request.field]:Math.max(0,Math.min(limit,current+request.delta))});return;
  }
  if(request.action==='transform'){
    if(pending)throw Error('Finalize a rolagem antes de transformar.');
    if(request.revert){await actor.update({'system.transformation':{}});return;}
    if(actor.system.transformation?.kind)throw Error('Reverta a forma atual antes de transformar novamente.');
    const plan=animalTransformationPlan(actor.system,request,actor.system[actionResource(actor)]);
    await actor.update({'system.transformation':plan.state,...spendActionResource(actor,plan.courage,game.combat)});return;
  }
  if(request.action==='rest'){
    if(usesLocal(actor))throw Error('O descanso de Coragem é exclusivo de personagens jogadores.');
    if(pending)throw Error('Finalize a rolagem antes de descansar.');
    if(!['short','long'].includes(request.kind))throw Error('Descanso inválido.');
    if(request.kind==='short'&&!hasSkill(actor.system,'recobrar-coragem'))throw Error('Descanso curto exige Recobrar Coragem.');
    const approved=await confirm({title:'Confirmar descanso',content:'<p>Confirmar descanso '+(request.kind==='short'?'curto e cena narrativa':'longo')+' de '+escapeHTML(actor.name)+'?</p>'});
    if(!approved)throw Error('Descanso cancelado.');
    verifyAuthority(game);
    if(pendingRollFor(actor))throw Error('A ficha tem uma rolagem pendente.');
    const amount=request.kind==='short'?2:Number(actor.system.attributes.vigor)+1;
    const changes={'system.courage':Math.min(Math.max(actor.system.courage,maxCourage(actor.system.level)),actor.system.courage+amount)};
    if(request.kind==='long'&&actor.system.race==='humano')changes['system.perseverancaUsed']=false;
    await actor.update(changes);return;
  }
  if(request.action==='grantVT'){
    if(!user.isGM)throw Error("O Narrador ajusta os recursos de troca.");
    if(pending)throw Error("Finalize a rolagem antes de adicionar VT.");
    const receipts=actor.getFlag(NS,"vtGrants")??[];
    if(receipts.includes(request.id))return;
    const items=grantVTPlan(actor,request);
    await actor.update({items,["flags."+NS+".vtGrants"]:[...receipts,request.id].slice(-50)});
    return;
  }
  if(request.action==='purchase'){
    const history=actor.getFlag(NS,'purchases')??[];
    if(history.some(entry=>entry.id===request.id))return {purchased:false};
    if(pending)throw Error('Finalize a rolagem antes de comprar.');
    const {items,entry,load}=purchasePlan(actor,request);
    if(request.expectedLoad!==undefined&&request.expectedLoad!==JSON.stringify(load))
      throw Error("A carga ou o pagamento mudou. Confira a nova prévia antes de comprar.");
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
    if(path==='equipped'){
      value=value===true;
      if(value&&item.system.kind==="armor"){
        if(isRuna(actor.system))throw Error("Runa Espinhos não pode equipar armaduras físicas.");
        if(!armorFits(actor.system,item))throw Error("A ficha não atende aos requisitos para equipar esta armadura.");
        const otherArmors=actor.items.filter(other=>other.id!==item.id&&other.system.kind==="armor"&&other.system.equipped);
        await actor.updateEmbeddedDocuments("Item",[{_id:item.id,"system.equipped":true},
          ...otherArmors.map(other=>({_id:other.id,"system.equipped":false}))]);
        return;
      }
    }
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
      if(pendingRollFor(actor))throw Error("Finalize ou descarte a rolagem antes de editar.");
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
      if(!actor.testUserPermission(user,"OWNER")||pendingRollFor(actor))throw Error("A ficha não está disponível para edição.");
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
      if(!actor.testUserPermission(user,"OWNER")||pendingRollFor(actor))throw Error("A ficha não está disponível para edição.");
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
    if (pending) changes[`flags.${NS}.-=${pendingKey}`] = null;
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
    await actor.update({...changes, ...pendingChanges(actor, draft)});
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
    await actor.unsetFlag(NS, pendingKey);
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
    } else if(key==="piercingBlocked"){
      if(!user.isGM||typeof value!=="boolean")throw Error("O Narrador confirma o bloqueio da propriedade.");
    } else if (typeof value !== "string" || value.length > 200) throw Error("Opção inválida.");
    if (key === "activationPayment" && value!=="courage") throw Error("A ativação usa Coragem. PP foi revogado.");
    config[key] = value;
    if (key === "characteristic") config.secondCharacteristic = "";
    if (key === "characteristic"||key==="secondCharacteristic") config.thirdCharacteristic="";
  } else return;
  await actor.update(pendingChanges(actor, {...pending, selected, options: config}));
}

function verifyAuthority(game) {
  if (game.user && !game.user.isActiveGM) throw Error("O Narrador ativo mudou. Tente novamente.");
}

async function publish(actor, user, pending, game, chat, resolveUuid) {
  verifyAuthority(game);
  if (!pending.publication) {
    if (pending.version < 3 && game.messages.some(message => message.getFlag(NS, "rollId") === pending.id)) {
      await actor.unsetFlag(NS, pendingRollEntry(actor).key);
      return;
    }
    const {changes, content, result, adjudication, impact} = resolvePendingRoll(actor, pending, game, await readDefense(game, pending));
    const id = pending.id.replaceAll("-", "").slice(0, 16);
    const publication = {id, author: user.id, content, result, adjudication, impact};
    pending = {...pending, publication};
    // Persist costs and the recoverable publication in a single Actor update.
    await actor.update({...changes, ...pendingChanges(actor, pending)});
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
  const current = pendingRollEntry(actor);
  if (current.roll?.id === pending.id) await actor.unsetFlag(NS, current.key);
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
