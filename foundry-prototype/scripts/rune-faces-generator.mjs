/* PNGs gerados no pacote Foundry: runas coloridas, sem poliedros sobrepostos.
 * Os dados continuam rolando as faces numéricas definidas em rules.mjs. */
import {mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
import {deflateSync} from "node:zlib";
import {FACES} from "../module/rules.mjs";

const SIZE=256;
const COLORS=Buffer.from([
 0,0,0,       // transparência
 38,122,69,   // Êxito: #267A45
 35,105,187,  // Antecipar: #2369BB
 84,33,118,   // Pavor: #542176
 244,225,190  // contorno para leitura sobre o dado escuro
]);
function crc32(bytes){
 let value=0xffffffff;
 for(const b of bytes){
  value^=b;
  for(let n=0;n<8;n++)value=(value&1)?((value>>>1)^0xedb88320):(value>>>1);
 }
 return (value^0xffffffff)>>>0;
}
function chunk(name,body){
 const title=Buffer.from(name,"ascii"),length=Buffer.alloc(4),crc=Buffer.alloc(4);
 length.writeUInt32BE(body.length);
 crc.writeUInt32BE(crc32(Buffer.concat([title,body])));
 return Buffer.concat([length,title,body,crc]);
}
function raster(symbols){
 const [e,a,p]=symbols,raw=Buffer.alloc((SIZE+1)*SIZE);
 const put=(x,y,c)=>{if(x>=0&&y>=0&&x<SIZE&&y<SIZE)raw[y*(SIZE+1)+x+1]=c;};
 function stroke(x1,y1,x2,y2,weight,color){
  const r=weight/2,dx=x2-x1,dy=y2-y1,dist=Math.max(1,dx*dx+dy*dy);
  const xmin=Math.max(0,Math.floor(Math.min(x1,x2)-r));
  const xmax=Math.min(SIZE-1,Math.ceil(Math.max(x1,x2)+r));
  const ymin=Math.max(0,Math.floor(Math.min(y1,y2)-r));
  const ymax=Math.min(SIZE-1,Math.ceil(Math.max(y1,y2)+r));
  for(let y=ymin;y<=ymax;y++)for(let x=xmin;x<=xmax;x++){
   const t=Math.max(0,Math.min(1,((x+.5-x1)*dx+(y+.5-y1)*dy)/dist));
   const xx=x+.5-(x1+t*dx),yy=y+.5-(y1+t*dy);
   if(xx*xx+yy*yy<=r*r)put(x,y,color);
  }
 }
 function path(points,x,y,w,h,color){
  for(const weight of [21,12])for(let j=1;j<points.length;j++){
   const u=points[j-1],v=points[j];
   stroke(x+(u[0]-.5)*w,y+(u[1]-.5)*h,x+(v[0]-.5)*w,y+(v[1]-.5)*h,weight,weight===21?4:color);
  }
 }
 const forms={
  e:[[[.81,.08],[.22,.32],[.78,.57],[.18,.94]]],
  a:[[[.25,.08],[.25,.94]],[[.25,.2],[.81,.47]],[[.25,.49],[.81,.76]]],
  p:[[[.23,.08],[.23,.94]],[[.23,.22],[.82,.53],[.23,.78]]]
 };
 function digit(n,x,y,color){
  const glyphs={0:[0,1,2,3,4,5],1:[1,2],2:[0,1,6,4,3],3:[0,1,6,2,3],
   4:[5,6,1,2],5:[0,5,6,2,3],6:[0,5,6,2,3,4],7:[0,1,2],8:[0,1,2,3,4,5,6],9:[0,1,2,3,5,6]};
  const segments=[[-9,-12,9,-12],[9,-12,9,0],[9,0,9,12],[-9,12,9,12],
   [-9,0,-9,12],[-9,-12,-9,0],[-9,0,9,0]];
  for(const weight of [9,5])for(const i of glyphs[n]||[]){
   const [x1,y1,x2,y2]=segments[i];
   stroke(x+x1,y+y1,x+x2,y+y2,weight,weight===9?4:color);
  }
 }
 const active=[{key:"e",n:e,color:1},{key:"a",n:a,color:2},{key:"p",n:p,color:3}].filter(x=>x.n>0);
 if(!active.length){
  for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
   const r=Math.hypot(x-128,y-128);
   if(r>=37&&r<=44)put(x,y,4);
  }
 }else{
  const positions=active.length===1?[128]:active.length===2?[76,180]:[48,128,208];
  const width=active.length===1?142:active.length===2?94:69;
  const height=active.length===1?152:118;
  active.forEach((item,i)=>{
   const cy=item.n>1?105:127,cx=positions[i];
   for(const segments of forms[item.key])path(segments,cx,cy,width,height,item.color);
   if(item.n>1){
    for(const weight of [9,5]){
     stroke(cx-27,215,cx-14,230,weight,weight===9?4:item.color);
     stroke(cx-27,230,cx-14,215,weight,weight===9?4:item.color);
    }
    digit(item.n,cx+13,221,item.color);
   }
  });
 }
 const header=Buffer.from([137,80,78,71,13,10,26,10]);
 const ihdr=Buffer.alloc(13);
 ihdr.writeUInt32BE(SIZE,0);ihdr.writeUInt32BE(SIZE,4);ihdr[8]=8;ihdr[9]=3;
 return Buffer.concat([header,chunk("IHDR",ihdr),chunk("PLTE",COLORS),
  chunk("tRNS",Buffer.from([0,255,255,255,255])),
  chunk("IDAT",deflateSync(raw,{level:9})),chunk("IEND",Buffer.alloc(0))]);
}
/** Uma imagem transparente por combinação distinta de E/A/P. */
export function generateRuneFaces(directory){
 mkdirSync(directory,{recursive:true});
 const unique=new Map(Object.values(FACES).flat().map(v=>[v.join("-"),v]));
 for(const [key,values] of unique){
  const [e,a,p]=values;
  writeFileSync(join(directory,`e${e}-a${a}-p${p}.png`),raster(values));
 }
 return unique.size;
}
export const faceImagePath=(sides,face)=>{
 const [e,a,p]=FACES[sides][face-1];
 return `systems/codex-rpg-foundry/assets/dice/runes/e${e}-a${a}-p${p}.png`;
};
