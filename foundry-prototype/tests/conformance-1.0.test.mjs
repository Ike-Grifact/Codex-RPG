import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import {SKILLS,requirements,ADVANCED_SOURCES,searchSkills} from '../module/skill-catalog.mjs';
import {bardMasteryId,bardRepertoire,historicalBardNames} from '../module/bard.mjs';
import {importSiteData} from '../module/creation.mjs';
import {racialGrants,hasSkill} from '../module/races.mjs';
import {skillDetails,planSkillPackage,advancementPlan} from '../module/advancement.mjs';
import {xpLedger,CREATION_REFERENCE,XP_ATTRIBUTE,XP_TRAINING,maxCourage,buildPool,resolveRoll,passiveAnticipar} from '../module/rules.mjs';
import {skillDefinitions,equipmentDefinitions,catalogId} from '../module/compendium-data.mjs';
import {animalTransformationPlan,druidicOptions,elementalDuration,elementalDamage} from '../module/transformations.mjs';
import {enqueueRoll} from '../module/roll-workflow.mjs';
import {carriedWeight} from '../module/equipment-logic.mjs';
const site=JSON.parse(readFileSync(new URL('../reference/site-catalog.json',import.meta.url),'utf8'));
const empty=()=>({level:1,creationBudget:15,xp:0,courage:10,attributes:{},knowledges:{},practices:{},skills:[]});
const byId=id=>SKILLS.find(row=>row.id===id);
const fields={a:'attributes',k:'knowledges',p:'practices'};
test('arma cravada conta na carga transportada sem duplicar o peso por filtros visuais',()=>{
 const actor={system:empty(),items:[{type:'equipment',system:{kind:'shield',weight:.5,quantity:1,embeddedWeapon:'pesado'}}]};
 assert.equal(carriedWeight(actor),1.5);
 actor.items[0].system.embeddedWeapon='';assert.equal(carriedWeight(actor),.5);
});

test('107 Perícias do site coincidem com catálogo e 109 definições nativas, incluindo nomes, custo, texto, requisitos, estados e efeitos',()=>{
 assert.equal(site.skills.length,107);assert.equal(SKILLS.length,109);
 const definitions=skillDefinitions();assert.equal(new Set(definitions.map(row=>row._id)).size,109);
 for(const [id,name,detail,cost] of site.skills){
  const row=byId(id),native=definitions.find(item=>item.system.canonicalId===id);
  assert.deepEqual([row.name,row.detail,row.cost],[name,detail,cost],id);
  assert.deepEqual(native.system.requirements,requirements[id],id);
  assert.equal(native.system.description,detail,id);assert.equal(native.system.costPending,cost==null,id);
  assert.deepEqual(native.system.grades,row.grades,id);assert.equal(native.system.automation,row.automation,id);
  assert.equal(native.system.state,row.legacy?'LEGADO':row.state,id);
  if(id!==bardMasteryId)assert.equal(row.effects[0].activation,site.cards.activation[id]??'Consultar descrição normativa',id);
  else assert.deepEqual(native.system.effects,site.bard.effects);
  if(site.requirements[id])assert.deepEqual(requirements[id],site.requirements[id],id);
 }
 assert.equal(equipmentDefinitions().length,90);
 assert.equal(catalogId('skill','improviso'),definitions.find(item=>item.system.canonicalId==='improviso')._id);
});
test('o Bardo tem quatro nós e os 17 efeitos consultáveis não são compras ou fontes',()=>{
 const mastery=byId(bardMasteryId);
 assert.deepEqual(site.families.find(row=>row.id==='apresentacao').skills,
  ['apresentacao-avancada','pericia-em-instrumentos',bardMasteryId,'voz-encantadora']);
 assert.deepEqual(SKILLS.filter(row=>row.family==='apresentacao').map(row=>row.id).sort(),
  ['apresentacao-avancada','pericia-em-instrumentos',bardMasteryId,'voz-encantadora'].sort());
 assert.deepEqual(mastery.requirements,[['p:apresentacao:4','a:influencia:4','a:destreza:4','s:apresentacao-avancada','s:pericia-em-instrumentos']]);
 assert.deepEqual(byId('voz-encantadora').requirements,[['a:influencia:4','p:apresentacao:4','a:vigor:3']]);
 assert.equal(byId('apresentacao-avancada').cost,1);
 for(const id of ['pericia-em-instrumentos',bardMasteryId,'voz-encantadora']){
  assert.equal(byId(id).cost,null);
  assert.equal(skillDetails({...empty(),xp:1000},id).canBuy,false);
 }
 assert.equal(mastery.effects.length,17);
 assert.match(bardRepertoire.summary,/3 Antecipares \(3A\) musicais no total/);
 assert.match(mastery.effects.find(row=>row.id==='inspiracao').description,/3A → 1 Coragem/);
 assert.match(mastery.effects.find(row=>row.id==='ressonancia-arcana').description,/3A → 1 carga de foco/);
 const melody=mastery.effects.find(row=>row.id==='melodia-psiquica');
 assert.match(melody.conditions,/Disciplina 4 \+ Criar Item de Foco e Magia.*instrumento.*PENDENTE/s);
 for(const effect of mastery.effects){
  assert.equal(effect.automation,'manual');
  const legacy={...empty(),skills:[effect.id]};
  assert.equal(hasSkill(legacy,effect.id),false,effect.id);
  assert.equal(xpLedger(legacy).spent,xpLedger(empty()).spent,effect.id);
  assert.equal(byId(effect.id),undefined,effect.id);
  assert.equal(searchSkills(effect.name,legacy).some(row=>row.name===effect.name),false,effect.id);
  assert.equal(planSkillPackage(legacy,effect.id).status,'locked',effect.id);
  assert.throws(()=>advancementPlan(legacy,{kind:'skill',key:effect.id}),/indisponível/,effect.id);
 }
});

test('importação arquiva técnicas internas sem promover a Maestria ou perder itens da ficha',()=>{
 const item={name:'Contratempo',type:'skill',system:{canonicalId:'contratempo',description:'Registro anterior'}};
 const effects=['inspiracao','Ação em Conjunto','melodia-psiquica'];
 const [imported]=importSiteData({schema:'codex-html-playtest-v1',skills:[...effects,'apresentacao-avancada'],items:[item,{name:'Espada antiga',type:'arma'}],xpEarned:12});
 assert.deepEqual(imported.system.skills,['apresentacao-avancada']);
 assert.equal(imported.system.xp,12);
 assert.deepEqual(imported.items.map(item=>item.name),['Espada antiga']);
 const flag=imported.flags['codex-rpg-foundry'].bardLegacy;
 assert.deepEqual(flag,{ids:effects,items:[item]});
 assert.deepEqual(historicalBardNames({...imported,getFlag:()=>flag}),['Ação em Conjunto','Contratempo','Inspiração','Melodia Psíquica']);
 const existing={...imported,items:[item],system:{...imported.system,skills:['inspiracao']},getFlag:()=>undefined};
 assert.deepEqual(historicalBardNames(existing),['Contratempo','Inspiração']);
 assert.deepEqual(existing.system.skills,['inspiracao']);
});

test('cada alternativa de compra satisfaz o validador e retirar cada requisito obrigatório bloqueia sua alternativa',()=>{
 for(const row of SKILLS.filter(row=>!row.legacy&&row.cost!=null&&row.id!=='maestria-armas-fogo')){
  for(const branch of requirements[row.id].length?requirements[row.id]:[[]]){
   const system={...empty(),xp:1000,race:row.origin??'humano'};
   for(const value of branch){const [kind,key,grade]=value.split(':');if(kind==='s')system.skills.push(key);else system[fields[kind]][key]=Number(grade);}
   assert.equal(skillDetails(system,row.id).met,true,row.id);
   assert.equal(planSkillPackage(system,row.id).status,'available',row.id);
   for(const missing of branch){
    const broken=structuredClone(system),[kind,key,grade]=missing.split(':');
    if(kind==='s')broken.skills=broken.skills.filter(id=>id!==key);else broken[fields[kind]][key]=Number(grade)-1;
    const expected=requirements[row.id].some(option=>option.every(ref=>{const [k,id,g]=ref.split(':');return k==='s'?hasSkill(broken,id):(broken[fields[k]][id]??0)>=Number(g);}));
    assert.equal(skillDetails(broken,row.id).met,expected,row.id+' sem '+missing);
   }
  }
 }
});
test('validação clássica inteira do site coincide com compra Foundry em 128 fichas humanas por Perícia comprável',()=>{
 const context=vm.createContext({ADVANCED_SOURCE_DEFS:site.advanced,SOURCE_PROPS:{attr:'attributes',know:'knowledges',practice:'practices'},racialGrants,ownsSkill:(id,s)=>hasSkill(s,id),WEAPON_MASTERY_TYPES:site.masteries,APPROVED_WEAPON_MASTERY_PURCHASE:site.approvedMasteries});
 const check=vm.runInContext(site.requirementFunction+';skillReq',context);
 let seed=109;const next=n=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed%n;};
 for(let i=0;i<128;i++){
  const system={...empty(),xp:10000,race:['humano','lucker_sangue','lucker_puro','runa_espinhos'][i%4]};
  for(const [field,keys] of Object.entries({attributes:['forca','destreza','agilidade','inteligencia','influencia','vigor'],knowledges:['protecao','medicina','alquimia','engenharia','astronomia','erudicao'],practices:['armas_conjuracao','furtividade','atletismo','artesao','apresentacao','coleta']}))for(const key of keys)system[field][key]=i===0?0:i===1?6:next(7);
  system.skills=SKILLS.filter(row=>i===1||next(2)===0).map(row=>row.id);
  for(const row of SKILLS.filter(row=>!row.legacy&&row.cost!=null))assert.equal(skillDetails(system,row.id).met,!check(row.id,system),row.id+' cenário '+i);
 }
});
test('SRD ativo fixa 15 XP e as duas progressões. Improviso e Fogo dispensam Foco, Maestria mantém seu requisito',()=>{
 assert.equal(CREATION_REFERENCE.total,15);assert.deepEqual(XP_ATTRIBUTE,[0,1,3,6,9,18,32]);assert.deepEqual(XP_TRAINING,[0,2,4,8,16,32,64]);
 const s={...empty(),attributes:{inteligencia:1,destreza:1},practices:{armas_conjuracao:1}};
 assert(skillDetails(s,'improviso').canBuy);assert(skillDetails(s,'fogo').canBuy);
 for(const [field,key] of [['attributes','inteligencia'],['attributes','destreza'],['practices','armas_conjuracao']]){
  const missing=structuredClone(s);missing[field][key]=0;assert(!skillDetails(missing,'improviso').met);
 }
 const master={...empty(),xp:100,attributes:{inteligencia:3,destreza:3},practices:{armas_conjuracao:3},skills:['improviso','fogo']};
 assert(!skillDetails(master,'mestre').met);master.skills.push('criar-item-foco-magia');assert(skillDetails(master,'mestre').met);
});
test('Druídica segue v1.0 posterior à v0.82: 1 XP, Foco + Terra e três formas sem Domar. Transformação não compra Graus',()=>{
 const s={...empty(),xp:100,skills:['criar-item-foco-magia','terra'],attributes:{forca:4,destreza:4,agilidade:4}};
 assert(skillDetails(s,'pericia-druidica').canBuy);assert.equal(byId('pericia-druidica').cost,1);
 const patch=advancementPlan(s,{kind:'skill',key:'pericia-druidica'},false);s.skills=patch['system.skills'];
 assert.deepEqual(druidicOptions(s),['pequena','media','grande']);
 const before=structuredClone(s),plan=animalTransformationPlan(s,{size:'grande',attributes:['forca','destreza','agilidade']});
 assert.equal(plan.courage,1);assert.deepEqual(s,before);
 const pool=buildPool({...s,transformation:plan.state},{base:{group:'attribute',key:'forca'},second:{group:'attribute',key:'destreza'},complement:{group:'attribute',key:'agilidade'}});
 assert(pool.ok);assert.equal(pool.pool.length,9);assert.deepEqual(pool.pool.slice(0,3).map(d=>d.sides),[10,10,12]);
 assert.throws(()=>animalTransformationPlan(s,{size:'pequena',attributes:['vigor']}),/Vigor/);
 const beginner={...s,attributes:{forca:1,destreza:1,agilidade:1}};
 const manual=animalTransformationPlan(beginner,{size:'pequena',attributes:['forca']});
 assert.deepEqual(manual.state.pendingAttributes,['forca']);assert.deepEqual(manual.state.enhancedAttributes,[]);
});
test('elevação comum v1.0 sobe um dado sem ampliar a pilha. Passivos e avanços não concedem graus ou símbolos extra',()=>{
 const s={...empty(),attributes:{influencia:4},practices:{apresentacao:1}};
 const selection={base:{group:'practice',key:'apresentacao'},second:{group:'attribute',key:'influencia'}};
 const pool=buildPool(s,selection,{step:true,stepDieId:'practice.apresentacao.0'});
 assert(pool.ok);assert.equal(pool.pool.length,4);assert.equal(pool.pool[0].sides,12);
 const other={...empty(),skills:['improviso','mestre','furtividade']};
 assert.equal(passiveAnticipar(other,{base:{group:'practice',key:'armas_conjuracao'},second:{group:'attribute',key:'forca'}}),2);
 assert.equal(passiveAnticipar(other,{base:{group:'practice',key:'furtividade'},second:{group:'attribute',key:'destreza'}}),1);
 for(const row of ADVANCED_SOURCES)assert.equal(byId(row.id).cost,1);
 assert.deepEqual([1,5,10,20].map(maxCourage),[10,11,12,13]);
 assert.equal(resolveRoll([{id:'a',sides:6,face:6},{id:'b',sides:10,face:10}],['a','b']).criticalRefundPP,0);
});
test('descanso exige confirmação e habilitação, e duração/proteção elementais seguem as fórmulas definidas sem arredondar',async()=>{
 const actor={uuid:'Actor.rest',system:{...empty(),courage:2,attributes:{vigor:2}},getFlag(){},testUserPermission(){return true;},async update(changes){if(changes['system.courage']!=null)this.system.courage=changes['system.courage'];}};
 const game={user:{isActiveGM:true}},user={isGM:true};
 await assert.rejects(enqueueRoll(actor,user,{action:'rest',kind:'short'},{game,confirm:async()=>true}),/Recobrar/);
 await enqueueRoll(actor,user,{action:'rest',kind:'long'},{game,confirm:async()=>true});assert.equal(actor.system.courage,5);
 actor.system.skills=['recobrar-coragem'];await enqueueRoll(actor,user,{action:'rest',kind:'short'},{game,confirm:async()=>true});assert.equal(actor.system.courage,7);
 assert.deepEqual(elementalDuration(3,1),{duration:2,sustained:true});assert.equal(elementalDuration(1,2).sustained,false);
 assert.equal(elementalDamage({element:'fogo',attackElement:'fogo',immune:true,e:5,p:2}),0);
 assert.equal(elementalDamage({element:'fogo',attackElement:'fogo',resistant:true,e:3,p:3}),1.5);
});
