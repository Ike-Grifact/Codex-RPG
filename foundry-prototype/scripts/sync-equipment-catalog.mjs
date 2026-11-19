import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

// O catálogo do criador é a origem dos preços e das categorias do pacote Foundry.
export function syncEquipmentCatalog(){
 const text=readFileSync(new URL('../../prototipo-ficha/catalog.js',import.meta.url),'utf8');
 const rows=JSON.parse(text.match(/=\s*(\[[\s\S]*\]);?\s*$/)[1]);
 const target=new URL('../module/catalog.mjs',import.meta.url);
 const output='/* Catálogo do criador oficial, gerado por scripts/sync-equipment-catalog.mjs. */\nexport const G1_CATALOG='+JSON.stringify(rows)+';\n';
 if(readFileSync(target,'utf8')!==output)writeFileSync(target,output);
 return rows;
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href)syncEquipmentCatalog();
