import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {fileURLToPath} from "node:url";
import {preparePackage,systemId} from "../scripts/package.mjs";

const src=fileURLToPath(new URL("../../prototipo-ficha/gene-graph.js",import.meta.url));

test("Foundry empacota o mesmo Codex Genético usado no site",()=>{
 const raw=readFileSync(src,"utf8"),tmp=mkdtempSync(join(tmpdir(),"codex-dna-layout-"));
 try{
  const target=join(tmp,systemId);
  preparePackage(target);
  const copied=readFileSync(join(target,"module","codex-gene-graph.js"),"utf8");
  assert.equal(copied,raw,"Mapa do Foundry deve reproduzir o do site sem versões divergentes");
  assert.match(copied,/position\(visible,branches\)/,"Não reservar espaço para Perícias ocultas");
  assert.match(copied,/groupIndices\("magic"\)/,"Distribuir a trilha mágica por categoria");
 }finally{rmSync(tmp,{recursive:true,force:true});}
});

test("layout orbital não sobrepõe fontes nem Perícias visíveis",()=>{
 const raw=readFileSync(src,"utf8");
 const positionCode=raw.slice(raw.indexOf("function position("),raw.indexOf("function edge("));
 const labelCode=raw.slice(raw.indexOf("function splitSkillLabel("),raw.indexOf("function skill("));
 assert(positionCode.startsWith("function position("));
 const {position,splitSkillLabel}=Function(
  "const BASE_Y=145,ROW=111,baseAttr=['forca','agilidade','destreza','inteligencia','influencia','vigor'],"+
  "baseKnow=['protecao','medicina','astronomia','alquimia','engenharia','erudicao'],"+
  "basePractice=['atletismo','armas_conjuracao','furtividade','artesao','apresentacao','coleta'];"+
  positionCode+labelCode+"return {position,splitSkillLabel};")();
 const attr=["forca","agilidade","destreza","inteligencia","influencia","vigor"].map(k=>({type:"attr",id:"attr:"+k}));
 const know=["protecao","medicina","astronomia","alquimia","engenharia","erudicao"].map(k=>({type:"know",id:"know:"+k}));
 const pract=["atletismo","armas_conjuracao","furtividade","artesao","apresentacao","coleta"].map(k=>({type:"practice",id:"practice:"+k}));
 const skills=Array.from({length:52},(_,i)=>({id:"s"+i,type:"skill",name:i%2?"Perícia em Elemento Terra":"Perícia em Armas de Longo Alcance",state:"potential"}));
 skills[0].id="criar-item-foco-magia";skills[1].id="armas-leves";
 skills[2].id="furtividade";skills[3].id="recuperacao-vigorosa";
 const branches=[
  ["criar-item-foco-magia","s10","s11"],["armas-leves","s12","s13"],
  ["furtividade","s14"],["recuperacao-vigorosa","s15"],["armas-leves","s16"]
 ];
 for(const count of [3,12,27,52]){
  const nodes=[...attr,...know,...pract,...skills.slice(0,count)].map(n=>({...n}));
  const height=position(nodes,branches);
  const boxes=nodes.map(n=>{
   if(n.type!=="skill")return {id:n.id,skill:false,x1:n.x-171,x2:n.x+171,y1:n.y-43,y2:n.y+43};
   const lines=splitSkillLabel(n.name,n.geneSide?16:20);
   const width=Math.max(30,...lines.map(line=>line.length*10));
   return {id:n.id,skill:true,x1:n.x-width/2,x2:n.x+width/2,y1:n.y-15,y2:n.y+39+18*(lines.length-1)+20};
  });
  for(let i=0;i<boxes.length;i++){
   const a=boxes[i];
   assert(a.x1>=0&&a.x2<=1600&&a.y1>=0&&a.y2<=height,"Nó fora do mapa: "+a.id);
   for(let j=i+1;j<boxes.length;j++){
    const b=boxes[j];
    if(!a.skill&&!b.skill)continue;
    const xx=Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1),yy=Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1);
    assert(xx<=2||yy<=2,"Sobreposição de nós: "+a.id+" × "+b.id);
   }
  }
 }
});
