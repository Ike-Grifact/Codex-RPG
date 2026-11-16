import {FACES} from "./rules.mjs";

const system="codex-rpg-foundry";
const colorset="codex-runas";

/* Dados 3D exibem SOMENTE as runas da face. O PNG antigo desenhava
   grafismos de poliedros dentro do rótulo e ficava minúsculo no d4/d10.
   A geometria 3D pertence ao Dice So Nice; não duplicar no label. */
export function faceLabels(sides){
 const faces=FACES[sides];
 if(!faces)return [];
 return faces.map(([e,a,p])=>
  ["ᛋ".repeat(e),"ᚨ".repeat(a),"ᚦ".repeat(p)].filter(Boolean).join(" ") || " "
 );
}

export function registerCodexDice(dice3d){
 if(!dice3d?.addSystem||!dice3d?.addDicePreset)return;
 dice3d.addSystem({id:system,name:"Codex RPG"});
 dice3d.addColorset?.({
  name:colorset,description:"Codex RPG · runas sem bordas",category:"Codex RPG",
  foreground:"#e8d6aa",background:"#181a1d",outline:"none",edge:"#181a1d",
  texture:"none",material:"plastic",font:"Segoe UI Symbol",
  fontScale:{d4:1.2,d6:1.35,d10:1.15,d12:1.1,d20:1}
 });
 for(const sides of Object.keys(FACES)){
  dice3d.addDicePreset({type:`d${sides}`,system,labels:faceLabels(sides),
    colorset,font:"Segoe UI Symbol"});
 }
}

export async function showCodexDice(roll){
 const dice3d=game.dice3d;
 if(!dice3d?.showForRoll)return;
 try{
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
