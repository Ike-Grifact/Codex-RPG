import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,rmSync} from "node:fs";
import {tmpdir} from "node:os";
import {join} from "node:path";
import {runInNewContext} from "node:vm";
import {ATTRIBUTES,KNOWLEDGES,PRACTICES,SKILLS} from "../module/rules.mjs";
import {skillDetails} from "../module/advancement.mjs";
import {preparePackage,systemId} from "../scripts/package.mjs";

const web=name=>new URL("../../prototipo-ficha/"+name,import.meta.url);
const raw=readFileSync(web("gene-graph.js"),"utf8");
const app=readFileSync(web("app.js"),"utf8");
const rows=JSON.parse(readFileSync(new URL("../reference/site-catalog.json",import.meta.url),"utf8")).skills;
const system={xp:100,attributes:{},knowledges:{},practices:{},skills:[]};

test("catálogo espelha IDs, nomes, texto e custos atuais por ID e preserva legadas",()=>{
 const actual=new Map(SKILLS.map(x=>[x.id,x]));
 for(const [id,name,detail,cost] of rows){
  const row=actual.get(id);
  assert.ok(row,id);
  assert.equal(row.name,name,id);
  assert.equal(row.detail,detail,id);
  assert.equal(row.cost,cost,id);
  if(cost===null||["combate","armas"].includes(id))assert.equal(skillDetails(system,id).canBuy,false,id);
 }
 for(const id of ["marciais","combinacao"]){
  assert.equal(skillDetails(system,id).canBuy,false,id);
  assert.equal(skillDetails({...system,skills:[id]},id).owned,true,id);
 }
});

test("Foundry empacota o grafo e as regras de invocação do site, com estilos próprios",()=>{
 const tmp=mkdtempSync(join(tmpdir(),"codex-dna-layout-"));
 try{
  const target=join(tmp,systemId);
  const manifest=preparePackage(target);
  assert.equal(readFileSync(join(target,"module","codex-gene-graph.js"),"utf8"),raw);
  assert.equal(readFileSync(join(target,"module","elemental-summoning.mjs"),"utf8"),readFileSync(web("elemental-summoning.mjs"),"utf8"));
  assert.ok(manifest.styles.includes("styles/codex-dna.css"));
  assert.match(readFileSync(join(target,"styles","codex-dna.css"),"utf8"),/fp-gene-constellation-border/);
 }finally{rmSync(tmp,{recursive:true,force:true});}
});

test("constelações incluem todo o catálogo visível sem colisões no plano virtual",()=>{
 const window={};
 runInNewContext(raw.replace("{render,zoom,reveal}","{render,zoom,reveal,position,splitSkillLabel,W}"),{window});
 const {position,splitSkillLabel,W}=window.CodexGeneGraph;
 const sources=[["attr",ATTRIBUTES],["know",KNOWLEDGES],["practice",PRACTICES]].flatMap(([type,list])=>
  list.map(([key,name])=>({type,id:type+":"+key,key,name})));
 const skills=SKILLS.filter(row=>!row.legacy).map(({id,name})=>({id,name,type:"skill",state:"potential"}));
 const sizes=[3,12,27,skills.length];
 for(const count of sizes){
  const nodes=[...sources,...skills.slice(0,count)].map(n=>({...n}));
  const {height,groups}=position(nodes);
  assert.equal(groups.flatMap(group=>[...group.nodes]).length,count);
  if(count===skills.length){
   assert.equal(groups.filter(group=>group.id!=="outros").length,18);
   assert.ok(groups.some(group=>group.id==="outros"));
   const byId=new Map(nodes.map(n=>[n.id,n]));
   for(const [id,family] of [["invocacao-elemental","elementos"],["pericia-druidica","natureza"],["fogo","elementos"],["concentracao-refinada","conjuracao"],["olhos-de-aguia","disparos"]])
    assert.equal(byId.get(id)?.geneFamily,family);
  }
  const boxes=nodes.map(n=>{
   if(n.type!=="skill")return {id:n.id,x1:n.x-171,x2:n.x+171,y1:n.y-43,y2:n.y+43};
   const lines=splitSkillLabel(n.name,16);
   const width=Math.max(30,...lines.map(line=>line.length*9.5));
   return {id:n.id,x1:n.x-width/2,x2:n.x+width/2,y1:n.y-15,y2:n.y+62};
  });
  for(let i=0;i<boxes.length;i++){
   const a=boxes[i];
   assert(a.x1>=0&&a.x2<=W&&a.y1>=0&&a.y2<=height,"Nó fora do mapa: "+a.id);
   for(let j=i+1;j<boxes.length;j++){
    const b=boxes[j];
    const xx=Math.min(a.x2,b.x2)-Math.max(a.x1,b.x1),yy=Math.min(a.y2,b.y2)-Math.max(a.y1,b.y1);
    assert(xx<=2||yy<=2,"Sobreposição de nós: "+a.id+" × "+b.id);
   }
  }
 }
});
