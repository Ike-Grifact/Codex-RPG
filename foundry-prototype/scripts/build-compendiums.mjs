import {createRequire} from 'node:module';
import {mkdirSync,existsSync} from 'node:fs';
import {resolve,join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseArgs} from 'node:util';
import {equipmentDefinitions,skillDefinitions} from '../module/compendium-data.mjs';
import {readJson} from './package.mjs';

const {version}=readJson(fileURLToPath(new URL('../system.json',import.meta.url)));

const {values}=parseArgs({options:{foundry:{type:'string'},out:{type:'string'}}});
const app=values.foundry??process.env.FOUNDRY_APP_PATH;
const require=createRequire(app?join(resolve(app),'package.json'):new URL('../package.json',import.meta.url));
const {ClassicLevel}=require('classic-level');
for(const [name,definitions] of [['equipamentos',equipmentDefinitions()],['pericias',skillDefinitions()]]){
 const directory=values.out?join(resolve(values.out),name):fileURLToPath(new URL('../packs/'+name,import.meta.url));
 // Recriar em destino novo evita carregar registros que saíram do catálogo.
 if(existsSync(directory))throw Error('O pacote já existe. Mova-o para um backup antes de recompilar: '+directory);
 mkdirSync(directory,{recursive:true});
 const database=new ClassicLevel(directory,{keyEncoding:'utf8',valueEncoding:'json'});
 try{
  await database.open();
  const items=database.sublevel('items',{valueEncoding:'json'});
  await items.batch(definitions.map(row=>({type:'put',key:row._id,value:{...row,effects:[],folder:null,sort:0,ownership:{default:2},_stats:{coreVersion:'14.367',systemId:'codex-rpg-foundry',systemVersion:version}}})));
  console.log(name+': '+(await items.keys().all()).length+' Items');
 }finally{await database.close();}
}
