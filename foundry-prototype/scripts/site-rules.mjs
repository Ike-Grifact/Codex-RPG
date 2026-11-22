import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

export const SOURCE_COMMIT='874de82d788228ca5fb3c01b1ac06733218585a2';
// O Bardo foi conferido na main da v0.87. Os demais verbetes mantêm a revisão do playtest Foundry.
const BARD_SOURCE_COMMIT='d48a886395b1fb50c0be40212ffbf0d2a01592a8';
const BARD_SOURCE_PATH='docs/playtest-bardo-2026-11-21.md';
const plain=text=>text.replaceAll('**','').trim();
const key=text=>text.normalize('NFD').replace(/\p{M}/gu,'').toLowerCase().replace(/[^a-z0-9]+/g,'-');

export function readSiteRules(){
 const cwd=fileURLToPath(new URL('../../',import.meta.url));
 const read=(path,commit=SOURCE_COMMIT)=>execFileSync('git',['show',commit+':'+path],{cwd,encoding:'utf8',maxBuffer:8*1024*1024});
 const app=read('prototipo-ficha/app.js'),graph=read('prototipo-ficha/gene-graph.js');
 const section=(text,start,end)=>text.slice(text.indexOf(start),text.indexOf(end,text.indexOf(start)));
 const context=vm.createContext({});
 const code=section(app,'const ADVANCED_SOURCE_DEFS=','// IDs de Perícias legadas')+
  section(app,'const GENE_AUTO_REQUIREMENTS=','function geneCandidateCopy')+
  section(graph,'const GENE_CONSTELLATIONS=','function position(')+
  section(app,'const XP_LEVEL_REFERENCE=','const MAX_EARNED_XP=')+
  '\nJSON.stringify({skills:SKILLS,requirements:GENE_AUTO_REQUIREMENTS,advanced:ADVANCED_SOURCE_DEFS,families:GENE_CONSTELLATIONS,levels:XP_LEVEL_REFERENCE,masteries:WEAPON_MASTERY_TYPES,approvedMasteries:APPROVED_WEAPON_MASTERY_PURCHASE})';
 const data=JSON.parse(vm.runInContext(code,context,{timeout:2000}));
 const bardApp=read('prototipo-ficha/app.js',BARD_SOURCE_COMMIT);
 const bardIds=JSON.parse(vm.runInNewContext(
  section(bardApp,'const BARD_INTERNAL_EFFECTS=','const HIDDEN_CATALOG_SKILLS=')+'JSON.stringify(BARD_INTERNAL_EFFECTS)',
  {},{timeout:2000}));
 const bardDoc=read(BARD_SOURCE_PATH,BARD_SOURCE_COMMIT).replaceAll('\r\n','\n');
 const bardTable=section(bardDoc,'**Repertório interno','## 3. Melodia Psíquica');
 const bardRows=new Map([...bardTable.matchAll(/^\| (\*\*[^|]+\*\*) \| ([^|]+) \| (EXPERIMENTAL|PROPOSTO)(?:; ([^|]+))? \|$/gm)]
  .map(([,name,description,state,conditions])=>[key(plain(name)),{description:plain(description),state,conditions:plain(conditions??'')}]));
 const melody=section(bardDoc,'## 3. Melodia Psíquica','## 4. Apoio').split('\n\n').slice(1).map(plain).filter(Boolean);
 if(bardRows.size!==16||melody.length!==3||bardIds.length!==17||new Set(bardIds).size!==17)throw Error('O repertório oficial do Bardo mudou.');
 const bardSummary=plain(section(bardDoc,'Ao realizar atuação válida','**Repertório interno'));
 const effects=bardIds.map(id=>{
  const name=data.skills.find(([rowId])=>rowId===id)?.[1];
  if(!name)throw Error('Efeito interno ausente no catálogo bruto: '+id);
  const detail=id==='melodia-psiquica'?{description:melody[1],state:'EXPERIMENTAL',conditions:[melody[0],melody[2]].join(' ')}:bardRows.get(key(name));
  if(!detail)throw Error('Efeito ausente no documento oficial: '+name);
  return {id,name,...detail,automation:'manual'};
 });
 const bard={sourceCommit:BARD_SOURCE_COMMIT,sourcePath:BARD_SOURCE_PATH,summary:bardSummary,effects};
 data.skills=data.skills.filter(([id])=>!bardIds.includes(id));
 data.requirements=Object.fromEntries(Object.entries(data.requirements).filter(([id])=>!bardIds.includes(id)));
 const cards=JSON.parse(vm.runInContext(section(app,'const CARD_REQUIREMENTS=','function skillCompactCard')+'\nJSON.stringify({activation:CARD_ACTIVATIONS,effects:CARD_EFFECTS,briefs:CARD_BRIEFS})',context,{timeout:2000}));
 cards.activation['invocar-esfera-espiritual']='1 Coragem por esfera · Até 5 criadas por rodada e 5 armazenadas';
 return {...data,bard,cards,requirementFunction:section(app,'function skillReq(','function dependentsValid('),commit:SOURCE_COMMIT,app};
}
