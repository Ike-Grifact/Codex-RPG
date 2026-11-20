/* PNGs gerados no pacote Foundry: runas coloridas, sem poliedros sobrepostos.
 * Os dados continuam rolando as faces numéricas definidas em rules.mjs. */
import {mkdirSync,writeFileSync} from "node:fs";
import {join} from "node:path";
import {deflateSync} from "node:zlib";
import {FACES} from "../module/rules.mjs";
import {runeTextureFile} from "../module/dice-icons.mjs";

const SIZE=256;
const COLORS=Buffer.from([
 0,0,0,       // transparência
 38,122,69,   // Êxito: #267A45
 35,105,187,  // Antecipar: #2369BB
 84,33,118,   // Pavor: #542176
 221,225,232, // círculo da face vazia
 215,188,136  // dourado das faces máximas
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
function raster(symbols,maximum){
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
 function path(points,x,y,w,h,weight,color){
  for(let j=1;j<points.length;j++){
   const u=points[j-1],v=points[j];
   stroke(x+(u[0]-.5)*w,y+(u[1]-.5)*h,x+(v[0]-.5)*w,y+(v[1]-.5)*h,weight,color);
  }
 }
 const forms={
  e:[[[.81,.08],[.22,.32],[.78,.57],[.18,.94]]],
  a:[[[.25,.08],[.25,.94]],[[.25,.2],[.81,.47]],[[.25,.49],[.81,.76]]],
  p:[[[.23,.08],[.23,.94]],[[.23,.22],[.82,.53],[.23,.78]]]
 };
 const runes=[..."e".repeat(e),..."a".repeat(a),..."p".repeat(p)];
 if(!runes.length){
  for(let y=0;y<SIZE;y++)for(let x=0;x<SIZE;x++){
   const r=Math.hypot(x-128,y-128);
   if(r>=37&&r<=44)put(x,y,maximum?5:4);
  }
 }else{
  const columns=runes.length===4?2:Math.min(3,runes.length),rows=Math.ceil(runes.length/columns);
  const width=[0,142,77,58][columns],height=[0,128,79,59][rows];
  const colors={e:1,a:2,p:3},weight=rows===1?17:12;
  runes.forEach((key,i)=>{
   const row=Math.floor(i/columns),column=i%columns;
   const inRow=Math.min(columns,runes.length-row*columns);
   const cx=128+(column-(inRow-1)/2)*(width+12);
   const cy=128+(row-(rows-1)/2)*(height+8);
   for(const segments of forms[key])path(segments,cx,cy,width,height,weight,maximum?5:colors[key]);
  });
 }
 const header=Buffer.from([137,80,78,71,13,10,26,10]);
 const ihdr=Buffer.alloc(13);
 ihdr.writeUInt32BE(SIZE,0);ihdr.writeUInt32BE(SIZE,4);ihdr[8]=8;ihdr[9]=3;
 return Buffer.concat([header,chunk("IHDR",ihdr),chunk("PLTE",COLORS),
  chunk("tRNS",Buffer.from([0,255,255,255,255,255])),
  chunk("IDAT",deflateSync(raw,{level:9})),chunk("IEND",Buffer.alloc(0))]);
}
/** Uma imagem transparente por combinação de E/A/P e uma variante por face máxima. */
export function generateRuneFaces(directory){
 mkdirSync(directory,{recursive:true});
 const files=new Map();
 for(const faces of Object.values(FACES)){
  for(const symbols of faces)files.set(runeTextureFile(symbols),{symbols,maximum:false});
  const maximum=faces.at(-1);
  files.set(runeTextureFile(maximum,true),{symbols:maximum,maximum:true});
 }
 for(const [name,{symbols,maximum}] of files)writeFileSync(join(directory,name),raster(symbols,maximum));
 return files.size;
}
export const faceImagePath=(sides,face)=>{
 const faces=FACES[sides];
 return `systems/codex-rpg-foundry/assets/dice/runes/${runeTextureFile(faces[face-1],face===faces.length)}`;
};
