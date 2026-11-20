import test from 'node:test';
import assert from 'node:assert/strict';
import {ClassicLevel} from 'classic-level';
import {equipmentDefinitions,skillDefinitions} from '../module/compendium-data.mjs';
import {readFileSync,cpSync,mkdtempSync,rmSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';
import {join,resolve,sep} from 'node:path';

test('LevelDB distribuídos contêm exatamente as definições atuais, com IDs, preço, requisitos, efeitos e estados estáveis',async()=>{
 const manifest=JSON.parse(readFileSync(new URL('../system.json',import.meta.url),'utf8'));
 assert.deepEqual(manifest.packs.map(pack=>pack.label),['Codex RPG — Equipamentos','Codex RPG — Perícias']);
 assert(Object.hasOwn(manifest.documentTypes.Item,'skill'));
 const temporary=mkdtempSync(join(tmpdir(),'codex-compiled-packs-'));
 try{
 for(const [key,definitions] of [['equipamentos',equipmentDefinitions()],['pericias',skillDefinitions()]]){
  const target=join(temporary,key);
  cpSync(fileURLToPath(new URL('../packs/'+key,import.meta.url)),target,{recursive:true});
  const database=new ClassicLevel(target,{readOnly:true,createIfMissing:false,valueEncoding:'json'});
  try{
   await database.open();
   const items=database.sublevel('items',{valueEncoding:'json'});
   const entries=await items.iterator().all();
   assert.equal(entries.length,definitions.length,key);
   const expected=new Map(definitions.map(row=>[row._id,row]));
   for(const [id,row] of entries){
    const canonical=expected.get(id);assert(canonical,key+' '+id);
    assert.equal(row.name,canonical.name,id);assert.equal(row.type,canonical.type,id);assert.equal(row.img,canonical.img,id);
    assert.deepEqual(row.system,canonical.system,id);assert.deepEqual(row.flags,canonical.flags,id);
   }
  }finally{await database.close();}
 }
 }finally{
  if(!resolve(temporary).startsWith(resolve(tmpdir())+sep))throw Error('Pasta temporária inesperada.');
  rmSync(temporary,{recursive:true,force:true});
 }
});
