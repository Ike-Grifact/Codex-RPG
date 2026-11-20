import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import vm from 'node:vm';

export const SOURCE_COMMIT='6957ad45032bffef98c10c6160bc85fda1871fd1';
export function readSiteRules(){
 const cwd=fileURLToPath(new URL('../../',import.meta.url));
 const read=path=>execFileSync('git',['show',SOURCE_COMMIT+':'+path],{cwd,encoding:'utf8',maxBuffer:8*1024*1024});
 const app=read('prototipo-ficha/app.js'),graph=read('prototipo-ficha/gene-graph.js');
 const section=(text,start,end)=>text.slice(text.indexOf(start),text.indexOf(end,text.indexOf(start)));
 const context=vm.createContext({});
 const code=section(app,'const ADVANCED_SOURCE_DEFS=','// IDs de Perícias legadas')+
  section(app,'const GENE_AUTO_REQUIREMENTS=','function geneCandidateCopy')+
  section(graph,'const GENE_CONSTELLATIONS=','function position(')+
  '\nJSON.stringify({skills:SKILLS,requirements:GENE_AUTO_REQUIREMENTS,advanced:ADVANCED_SOURCE_DEFS,families:GENE_CONSTELLATIONS})';
 const data=JSON.parse(vm.runInContext(code,context,{timeout:2000}));
 const cards=JSON.parse(vm.runInContext(section(app,'const CARD_REQUIREMENTS=','function skillCompactCard')+'\nJSON.stringify({activation:CARD_ACTIVATIONS,effects:CARD_EFFECTS,briefs:CARD_BRIEFS})',context,{timeout:2000}));
 return {...data,cards,requirementFunction:section(app,'function skillReq(','function dependentsValid('),commit:SOURCE_COMMIT,app};
}
