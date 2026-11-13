/* Rolagem usa a infraestrutura de dados do Foundry; símbolos são exclusivamente do Codex. */
import {faceSymbols} from "./rules.mjs";
export async function rollPool(pool){
 if(!pool?.length||pool.length>9)throw Error("Pilha inválida: máximo de nove dados.");
 const formula=pool.map(d=>"1d"+d.sides).join(" + ");
 const roll=await new foundry.dice.Roll(formula).evaluate();
 const numeric=roll.dice.flatMap(term=>term.results.filter(x=>x.active!==false).map(x=>Number(x.result)));
 if(numeric.length!==pool.length)throw Error("Quantidade de dados divergente da pilha.");
 const dice=pool.map((source,index)=>{
   const face=numeric[index];
   return {...source,face,symbols:faceSymbols(source.sides,face)};
 });
 return {formula,roll,dice};
}
const RUNES=[["e","ᛋ","Êxito"],["a","ᚨ","Antecipar"],["p","ᚦ","Pavor"]];
export function runeText(symbols){
 return RUNES.map(([, ,name],index)=>symbols[index]?symbols[index]+" "+name:"").filter(Boolean).join(", ")||"Vazio";
}
export function runeHTML(symbols){
 return RUNES.map(([key,rune],index)=>symbols[index]?
  `<b class="codex-rune codex-rune-${key}" aria-hidden="true">${rune.repeat(symbols[index])}</b>`:"").join(" ")||"Vazio";
}
export function dieSvg(sides){
 const shapes={
 4:'<polygon points="21,3 39,37 3,37"/><path d="M21 3 L21 29 L3 37 M21 29 L39 37"/>',
 6:'<rect x="4" y="4" width="34" height="34" rx="3"/><path d="M4 4 L13 13 L38 4 M13 13 V38"/>',
 10:'<polygon points="21,2 39,13 36,32 21,40 6,32 3,13"/><path d="M3 13 L21 19 L39 13 M21 19 V40 M21 2 V19"/>',
 12:'<polygon points="21,2 33,5 40,17 37,32 21,40 5,32 2,17 9,5"/><path d="M9 5 L21 12 L33 5 M2 17 L21 12 L40 17 M5 32 L21 12 L37 32 M21 12 V40"/>',
 20:'<polygon points="21,2 35,7 41,20 35,33 21,40 7,33 1,20 7,7"/><path d="M21 2 V40 M7 7 L35 33 M35 7 L7 33 M1 20 H41 M7 7 L21 20 L35 7 M7 33 L21 20 L35 33"/>'
 };
 return '<svg class="codex-die-svg" viewBox="0 0 42 42" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.75">'+(shapes[sides]||shapes[6])+'</svg>';
}
export function escapeHTML(text){return String(text).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
