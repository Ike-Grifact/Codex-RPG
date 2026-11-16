const supportedDice = new Set([4, 6, 10, 12, 20]);

export function dieSvg(sides) {
  const size = Number(sides);
  if (!supportedDice.has(size)) return "";
  const art = new URL(`../assets/dice/d${size}.svg`, import.meta.url).href;
  return `<span class="codex-die-svg" data-die="${size}" style="--codex-die-art:url(${art})" aria-hidden="true"></span>`;
}

/** Representação da face sem substituir o número persistido na rolagem. */
export function faceIcons(symbols) {
 const [e,a,p]=Array.isArray(symbols)?symbols:[0,0,0];
 const kinds=[
  {n:e,key:"e",rune:"ᛋ",name:"Êxito"},
  {n:a,key:"a",rune:"ᚨ",name:"Antecipar"},
  {n:p,key:"p",rune:"ᚦ",name:"Pavor"}
 ];
 return kinds.filter(x=>Number.isInteger(x.n)&&x.n>0).map(x=>
  '<span class="codex-face-symbol codex-face-symbol-'+x.key+'" aria-label="'+x.n+' '+x.name+'">'+
   '<span class="codex-face-rune" aria-hidden="true">'+x.rune+'</span>'+
   (x.n>1?'<span class="codex-face-count" aria-hidden="true">×'+x.n+'</span>':'')+'</span>'
 ).join("")||'<span class="codex-face-blank" aria-label="Face vazia">○</span>';
}
