const supportedDice = new Set([4, 6, 10, 12, 20]);

export function dieSvg(sides) {
  const size = Number(sides);
  if (!supportedDice.has(size)) return "";
  const art = new URL(`../assets/dice/d${size}.svg`, import.meta.url).href;
  return `<span class="codex-die-svg" data-die="${size}" style="--codex-die-art:url(${art})" aria-hidden="true"></span>`;
}

/** Representação da face sem substituir o número persistido na rolagem. */
export function faceIcons(symbols,maximum=false) {
 const [e,a,p]=Array.isArray(symbols)?symbols:[0,0,0];
 const kinds=[
  {n:e,key:"e",rune:"ᛋ",name:"Êxito"},
  {n:a,key:"a",rune:"ᚨ",name:"Antecipar"},
  {n:p,key:"p",rune:"ᚦ",name:"Pavor"}
 ];
 const accent=maximum?" codex-face-maximum":"";
 return kinds.filter(x=>Number.isInteger(x.n)&&x.n>0&&x.n<=8).map(x=>(
  '<span class="codex-face-symbol codex-face-symbol-'+x.key+'" aria-label="'+x.name+'">'+
   '<span class="codex-face-rune'+accent+'" aria-hidden="true">'+x.rune+'</span></span>'
 ).repeat(x.n)).join("")||'<span class="codex-face-blank'+accent+'" aria-label="'+(maximum?"Face máxima vazia":"Face vazia")+'">○</span>';
}

export const runeTextureFile=([e,a,p],maximum=false)=>`e${e}-a${a}-p${p}${maximum?"-max":""}.png`;
