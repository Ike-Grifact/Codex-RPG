/* Rolagem usa a infraestrutura de dados do Foundry; símbolos são exclusivamente do Codex. */
import {faceSymbols} from "./rules.mjs";
export async function rollPool(pool){
 if(!pool?.length||pool.length>9)throw Error("Pilha inválida: máximo de nove dados.");
 const formula=pool.map(d=>"1d"+d.sides).join(" + ");
 const roll=await new Roll(formula).evaluate();
 const numeric=roll.dice.flatMap(term=>term.results.filter(x=>x.active!==false).map(x=>Number(x.result)));
 if(numeric.length!==pool.length)throw Error("Quantidade de dados divergente da pilha.");
 const dice=pool.map((source,index)=>{
   const face=numeric[index];
   return {...source,face,symbols:faceSymbols(source.sides,face)};
 });
 return {formula,roll,dice};
}
export function escapeHTML(text){return String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
