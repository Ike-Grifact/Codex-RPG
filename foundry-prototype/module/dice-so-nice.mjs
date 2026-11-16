import {FACES} from "./rules.mjs";

const system="codex-rpg-foundry";
const colorset="codex-runas";
// No d4, o Dice So Nice repete as marcas junto a cada vértice.
const fontScale={4:0.82,6:1.35,10:1.02,12:1.1,20:1};

/* PNGs transparentes coloridos são gerados ao empacotar. Cada arquivo contém
   apenas runas e multiplicadores, sem polígonos; o resultado numérico não muda. */
export function faceLabels(sides){
 const faces=FACES[sides];
 if(!faces)return [];
 return faces.map(([e,a,p])=>
  ["ᛋ".repeat(e),"ᚨ".repeat(a),"ᚦ".repeat(p)].filter(Boolean).join(" ") || " "
 );
}

export function faceImageLabels(sides){
 const faces=FACES[sides];
 if(!faces)return [];
 return faces.map(([e,a,p])=>`systems/codex-rpg-foundry/assets/dice/runes/e${e}-a${a}-p${p}.png`);
}

export function registerCodexDice(dice3d){
 if(!dice3d?.addSystem||!dice3d?.addDicePreset)return;
 dice3d.addSystem({id:system,name:"Codex RPG"});
 dice3d.addColorset?.({
  name:colorset,description:"Codex RPG · runas sem bordas",category:"Codex RPG",
  foreground:"#e8d6aa",background:"#181a1d",outline:"none",edge:"#181a1d",
  texture:"none",material:"plastic",font:"Segoe UI Symbol"
 });
 for(const sides of Object.keys(FACES)){
  dice3d.addDicePreset({type:`d${sides}`,system,labels:faceImageLabels(sides),
    colorset,font:"Segoe UI Symbol",fontScale:fontScale[sides],labelScale:sides==="4"?1.22:1.06});
 }
}

export async function showCodexDice(roll){
 const dice3d=game.dice3d;
 if(!dice3d?.showForRoll)return;
 try{
  // O Dice So Nice 6 pode expor showForRoll antes de concluir a inicialização da mesa.
  await dice3d._boxReady;
  for(const die of roll.dice){
   die.options??={};
   die.options.appearance={
    ...die.options.appearance,system,colorset,
    foreground:"#e8d6aa",background:"#181a1d",outline:"none",
    edge:"#181a1d",material:"plastic",font:"Segoe UI Symbol"
   };
  }
  // A mesma pilha já avaliada é animada para toda a mesa; nenhum cliente rerrola.
  await dice3d.showForRoll(roll,game.user,true);
 }catch(error){
  console.warn("Codex RPG | Animação do Dice So Nice indisponível.",error);
 }
}
