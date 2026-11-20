import {mkdirSync,writeFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {readSiteRules} from './site-rules.mjs';
import vm from 'node:vm';

const site=readSiteRules();
const cwd=fileURLToPath(new URL('../../',import.meta.url));
const prior=execFileSync('git',['show','79dc1e1:foundry-prototype/module/skill-catalog.mjs'],{cwd,encoding:'utf8'});
const old=JSON.parse(prior.match(/export const SKILLS=(\[[\s\S]*?\]);/)[1]);
const oldRequirements=JSON.parse(vm.runInNewContext(prior.replaceAll('export ','')+';JSON.stringify(requirements)',{},{timeout:2000}));
const requirements={...site.requirements,
 'concentracao-refinada':[['p:armas_conjuracao:2']],
 'recuperacao-vigorosa':[['a:vigor:3']],
 'recuperacao-movimento':[['a:vigor:6','s:recuperacao-vigorosa']],
 'instinto-sobrevivencia':[['a:vigor:3']],
 'manejo-perfeito':[['a:destreza:2','s:disciplina-avancada']],
 'transfusao-sanguinaria':[['s:transfusao','s:sangue']],
 'maestria-arremesso-armas':['armas-leves','armas-medias','armas-pesadas'].map(id=>['a:forca:2','a:destreza:2','a:agilidade:1','s:'+id])};
const hidden=new Set(['combate','armas']);
const automated=new Set(['furtividade','improviso','mestre','olhos-de-aguia',...site.advanced.map(row=>row.id)]);
const skills=site.skills.map(([id,name,detail,cost])=>({id,name,detail,cost,legacy:hidden.has(id),
 ...(old.find(row=>row.id===id)?.legacyCost!=null?{legacyCost:old.find(row=>row.id===id).legacyCost}:{}),
 family:site.families.find(row=>row.skills.includes(id))?.id??({'concentracao-refinada':'armas','olhos-de-aguia':'disparos','transfusao-sanguinaria':'alquimia','transformacao-elemental':'natureza'}[id]??'outros'),
 requirements:requirements[id]??[[]],state:cost==null?'PENDENTE':'DEFINIDO',
 source:'SRD Playtest Nível 1 v1.0; Continuidade v0.82 subsidiária',sourceCommit:site.commit,
 grades:['pericia-druidica','transformacao-elemental'].includes(id)?[1,2,3]:['vento','agua','terra','fogo','sagrado','sangue','trevas','veneno'].includes(id)?[1,2,3]:[],
 automation:automated.has(id)?'parcial':'manual',
 effects:[{description:detail,kind:automated.has(id)?'passivo ou condicionado':'ativo ou narrativo',
  activation:site.cards.activation[id]??'Consultar descrição normativa',conditions:detail,source:site.commit,automation:automated.has(id)?'parcial':'manual'}]}));
for(const row of old)if(!skills.some(item=>item.id===row.id))skills.push({...row,legacy:true,state:'LEGADO',requirements:oldRequirements[row.id]??[],family:'outros',grades:[],effects:[{description:row.detail,automation:'manual'}],automation:'manual',source:'Registro histórico 0.2.1.15'});
let module='// Catálogo único revisado contra o SRD ativo. Gerado por scripts/sync-skill-catalog.mjs.\n';
module+='export const SKILLS='+JSON.stringify(skills,null,2)+';\n';
module+='export const requirements=Object.fromEntries(SKILLS.map(row=>[row.id,row.requirements]));\n';
module+='export const ADVANCED_SOURCES='+JSON.stringify(site.advanced)+';\n';
module+='export const showSkill=(row,system)=>!row.legacy||Boolean(system.skills?.includes(row.id));\n';
module+='const normalizeName=value=>value.normalize("NFD").replace(/\\p{M}/gu,"").toLocaleLowerCase("pt-BR");\n';
module+='export const searchSkills=(query,system)=>SKILLS.filter(row=>showSkill(row,system)&&normalizeName(row.name).includes(normalizeName(query.trim())));\n';
writeFileSync(new URL('../module/skill-catalog.mjs',import.meta.url),module);
mkdirSync(new URL('../reference/',import.meta.url),{recursive:true});
const {app,...reference}=site;
writeFileSync(new URL('../reference/site-catalog.json',import.meta.url),JSON.stringify(reference,null,2));
const diffs=skills.map(row=>{
 const before=old.find(item=>item.id===row.id);
 const normalized=branches=>JSON.stringify((branches?.length?branches:[[]]).map(branch=>[...branch].sort()).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b))));
 return {id:row.id,name:row.name,state:row.state,legacy:row.legacy,previousCost:before?.cost??null,currentCost:row.cost,added:!before,
  nameChanged:before?.name!==row.name,costChanged:before?.cost!==row.cost,
  requirementsChanged:normalized(oldRequirements[row.id])!==normalized(row.requirements),
  descriptionChanged:before?.detail!==row.detail,previousRequirements:oldRequirements[row.id]??[],currentRequirements:row.requirements,
  previousDescription:before?.detail??'',currentDescription:row.detail,automation:row.automation};
});
writeFileSync(new URL('../skill-audit.json',import.meta.url),JSON.stringify({source:site.commit,active:'SRD Playtest Nível 1 v1.0',skills:diffs},null,2));
console.log(JSON.stringify({total:skills.length,current:site.skills.length,added:diffs.filter(row=>row.added).length,descriptionChanged:diffs.filter(row=>row.descriptionChanged).length,pending:skills.filter(row=>row.cost==null&&!row.legacy).length}));
