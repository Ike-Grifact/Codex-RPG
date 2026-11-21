import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const app=readFileSync(join(root,"app.js"),"utf8");
const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
const playtest=readFileSync(join(root,"../docs/playtest-bardo-2026-11-21.md"),"utf8");
const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");

const activeBard=["pericia-em-instrumentos","maestria-em-apresentacao","voz-encantadora"];
const expectedInternal=[
 "dueto-improvisado","contratempo","solo-provocador","cancoes-sustentadas",
 "ritmo-de-batalha","inspiracao","ressonancia-arcana","acorde-de-protecao",
 "acorde-triunfal","compasso-adiantado","ritmo-acelerado","harmonia-musical",
 "piada-infame","elevacao-harmonica","acao-em-conjunto-musical",
 "presenca-de-palco","melodia-psiquica"
];
const registry=app.slice(app.indexOf("const SKILLS=["),app.indexOf("const HIDDEN_CATALOG_SKILLS="));
const hiddenMatch=app.match(/const BARD_INTERNAL_EFFECTS=Object\.freeze\((\[[^\n]+\])\)/);
const hidden=hiddenMatch?JSON.parse(hiddenMatch[1]):[];
const cStart=graph.indexOf("const GENE_CONSTELLATIONS=");
const cEnd=graph.indexOf("function position(",cStart);
const constellations=new Function(graph.slice(cStart,cEnd)+"\nreturn GENE_CONSTELLATIONS;")();
const families=new Map(constellations.map(f=>[f.id,f]));
const membership=id=>constellations.filter(f=>f.skills.includes(id)).map(f=>f.id);
const page=id=>readFileSync(join(root,"../pericias/"+id+".html"),"utf8");

test("Bardo: UMA Maestria e somente Voz/Instrumentos como Perícias distintas",()=>{
 assert.ok(hiddenMatch,"Registro de efeitos internos existe");
 assert.deepEqual([...hidden].sort(),[...expectedInternal].sort());
 for(const id of activeBard){
  assert.equal(membership(id).join(","),"apresentacao","Bardo ativo no ramo Apresentação: "+id);
  assert.ok(catalog.includes('href="'+id+'.html"'),"Catálogo com compra única: "+id);
  assert.ok(page(id).includes("XP")&&page(id).includes("PENDENTE"));
 }
 for(const id of expectedInternal){
  assert.equal(membership(id).length,0,"Efeito interno NÃO é nó de perícia: "+id);
  assert.ok(!catalog.includes('href="'+id+'.html"'),"Efeito interno não deve ser uma compra no catálogo: "+id);
  assert.ok(page(id).includes("EFEITO INTERNO DA MAESTRIA"),"Verbete legado redireciona à Maestria: "+id);
 }
 assert.ok(playtest.includes("UMA única Perícia")&&playtest.includes("sem novo nó"),"Documento canônico consolida");
 assert.ok(srd.includes("multiplicação inicial dos nomes de técnicas musicais"),"Errata substitui entradas antigas");
 assert.ok(book.includes("ÚNICA Maestria"),"Livro atualizado");
});

test("Economia de 3A e Melodia Psíquica sem custo inventado ou dano duplicado",()=>{
 const mastery=page("maestria-em-apresentacao");
 for(const marker of ["3A musicais totais","Ressonância Arcana","Inspiração","Acorde de Proteção","Voz Encantadora","Melodia Psíquica"]){
  assert.ok(mastery.includes(marker),"Maestria documenta "+marker);
 }
 assert.ok(playtest.includes("**3A → 1 carga de foco**")&&playtest.includes("**3A → 1 Coragem**"),"Custo 3A preservado");
 assert.ok(playtest.includes("**Disciplina 4 + Criar Item de Foco e Magia**"),"Melodia condicional");
 assert.ok(playtest.includes("Não automatizar Melodia Psíquica"),"Não inventar dupla aplicação");
 assert.ok(playtest.includes("Antecipares naturais"),"Desarmonia não apaga símbolos naturais");
 assert.ok(registry.includes('["maestria-em-apresentacao"')&&app.includes("const HIDDEN_CATALOG_SKILLS="));
});

test("Ramos do mapa: nenhuma Perícia visível perdida ou repetida",()=>{
 const raw=app.slice(app.indexOf("const SKILLS=["),app.indexOf("// IDs de Perícias legadas"));
 const skillIds=[...raw.matchAll(/\[\s*"([\w-]+)"\s*,\s*"/g)].map(m=>m[1]);
 const visible=skillIds.filter(id=>!hidden.includes(id)&&id!=="armas"&&id!=="combate");
 const duplicated=visible.filter(id=>membership(id).length!==1);
 assert.deepEqual(duplicated,[],"Cada Perícia visível pertence a um único ramo");
 for(const [id,f] of families){
  assert.ok(f.column>=0&&f.column<=2,"Coluna válida: "+id);
  assert.equal(f.skills.length,new Set(f.skills).size,"Sem nós duplicados no ramo "+id);
 }
 assert.equal(families.get("apresentacao").skills.length,4);
 assert.ok(families.get("coleta").skills.includes("coleta-avancada"));
 assert.ok(families.get("artesao").skills.includes("ferreiro"));
 assert.ok(families.get("alquimia").skills.includes("bioetica"));
 assert.ok(families.get("alquimia").skills.includes("pesquisa-avancada-pocoes"));
});

test("Correção temática: Olhos de Águia, Elementos, Psíquico e Cavalaria",()=>{
 assert.deepEqual(membership("olhos-de-aguia"),["disparos"]);
 for(const id of ["improviso","mestre","invocacao-elemental","transformacao-elemental","mudanca-elemental","sentido-elemental"])
  assert.deepEqual(membership(id),["elementos"],"Perícia elemental no ramo Elementos: "+id);
 for(const id of ["invocar-esfera-espiritual","passo-etereo","absorver-esferas","disparo-esferas-espirituais"])
  assert.deepEqual(membership(id),["psiquico"],"Esfera no ramo Psíquico: "+id);
 for(const id of ["montar","pericia-montaria","montaria-epica"])
  assert.deepEqual(membership(id),["cavalaria"],"Montaria no ramo Cavalaria: "+id);
});

test("Montaria Épica não altera Montar Animal nem inventa XP ou voo",()=>{
 const item=registry.slice(registry.indexOf('  "montaria-epica",'));
 assert.ok(item.startsWith('  "montaria-epica",')&&item.includes("null"),"Compra sem preço permanece bloqueada");
 assert.ok(app.includes('if(id==="montaria-epica")return'),"Pendente explícito em skillReq()");
 assert.ok(page("montaria-epica").includes("gigantes, aladas ou exóticas"),"Tipos da proposta");
 assert.ok(catalog.includes('href="montaria-epica.html"'),"Cavalaria no catálogo");
 assert.ok(srd.includes("PROPOSTO / PENDENTE — Montaria Épica"));
 assert.ok(registry.includes('"montar",\n  "Montar Animal"')&&registry.includes("2 XP. Requer Influência 2"),"Montar Animal inalterada");
 assert.ok(registry.includes('"pericia-montaria"')&&registry.includes("Custo de XP PENDENTE"),"Perícia em Montaria inalterada");
});

test("Persistem limitações centrais das rolagens, ações e Antecipar",()=>{
 assert.ok(playtest.includes("sem somar dados de duas Práticas"),"Sem liberar combinações proibidas");
 assert.ok(playtest.includes("9 dados")||srd.includes("9 dados"),"Limite de 9 dados");
 assert.ok(!app.includes('const HIDDEN_CATALOG_SKILLS=new Set(["combate","armas"]);'),"Ocultação agora considera efeitos internos");
});


test("Navegação móvel: mapa oferece salto direto às constelações sem nova mecânica",()=>{
 assert.ok(graph.includes("function jumpToFamily(root,id)"),"Função de salto entre ramos");
 assert.ok(graph.includes('data-gene-family-jump'),"Seletor de grupos no mapa");
 assert.ok(graph.includes("cam.zoom=clamp"),"Salto controla zoom sem alterar nós");
 assert.ok(graph.includes("root.__geneFamilies=groups"),"Ramos acompanham filtros e ficha atual");
 const styles=readFileSync(join(root,"styles.css"),"utf8");
 assert.ok(styles.includes(".fp-gene-family-jump"),"Navegação estilizada");
 assert.ok(styles.includes("@media(max-width:620px)"),"Compatibilidade móvel preservada");
});


test("Órbitas temáticas cercam fontes, sem sobreposição e sem alongar o mapa para baixo",()=>{
 const from=graph.indexOf("const GENE_CONSTELLATIONS="),to=graph.indexOf("function edge(",from);
 assert.ok(from>0&&to>from);
 const program=`const W=3400,BASE_Y=630,ROW=112,SOURCE_CENTER_X=1700;
const baseAttr=["forca","agilidade","destreza","inteligencia","influencia","vigor"];
const baseKnow=["protecao","medicina","astronomia","alquimia","engenharia","erudicao"];
const basePractice=["atletismo","armas_conjuracao","furtividade","artesao","apresentacao","coleta"];
`+graph.slice(from,to)+"\nreturn position(nodes);";
 const run=new Function("nodes",program);
 const source=group=>[...(group==="attr"?["forca","agilidade","destreza","inteligencia","influencia","vigor"]:group==="know"?["protecao","medicina","astronomia","alquimia","engenharia","erudicao"]:["atletismo","armas_conjuracao","furtividade","artesao","apresentacao","coleta"])].map(id=>({id:group+":"+id,type:group}));
 const raw=app.slice(app.indexOf("const SKILLS=["),app.indexOf("// IDs de Perícias legadas"));
 const ids=[...raw.matchAll(/\[\s*"([\w-]+)"\s*,\s*"/g)].map(m=>m[1]);
 const skills=ids.filter(id=>!hidden.includes(id)&&id!=="combate"&&id!=="armas").map(id=>({id,type:"skill",name:id}));
 const sources=[...source("attr"),...source("know"),...source("practice")];
 for(const subset of [skills,skills.filter((_,i)=>i%3===0)]){
  const {height,groups}=run([...sources.map(s=>({...s})),...subset.map(s=>({...s}))]);
  assert.ok(height<=2500,"Mapa compactado em altura; atual: "+height);
  assert.ok(groups.length>0,"Existem constelações visíveis");
  for(const a of groups){
   assert.ok(a.x>=0&&a.x+a.width<=3400&&a.y>=0&&a.y+a.height<=height,"Constelação dentro da área SVG: "+a.id);
   for(const node of a.nodes)assert.ok(node.x>a.x&&node.x<a.x+a.width&&node.y>a.y&&node.y<a.y+a.height,"Nó dentro de "+a.id);
   // As fontes centrais ocupam x=1149..2251, sem cruzar áreas temáticas.
   assert.ok(a.x+a.width<=1149||a.x>=2251,"Ramo não cobre o centro: "+a.id);
   for(const other of groups){
    if(a===other)continue;
    const overlap=a.x<other.x+other.width&&a.x+a.width>other.x&&a.y<other.y+other.height&&a.y+a.height>other.y;
    assert.equal(overlap,false,"Sem cruzamento de constelações: "+a.id+" x "+other.id);
   }
  }
 }
});

test("Montaria: nomes completos, efeitos distintos e especialização épica em consulta",()=>{
 const begin=graph.indexOf("function splitSkillLabel("),end=graph.indexOf("function skill(",begin);
 assert.ok(begin>0&&end>begin);
 const fn=new Function(graph.slice(begin,end)+"\nreturn splitSkillLabel;")();
 assert.deepEqual(fn("Perícia em Montaria",16),["Perícia em","Montaria"],"Não abreviar para apenas Montaria");
 assert.deepEqual(fn("Montar Animal",16),["Montar Animal"]);
 assert.ok(registry.includes('"montar",')&&registry.includes("Vantagem, não +1A"),"Montar Animal preserva Vantagem");
 assert.ok(registry.includes('"pericia-montaria",')&&registry.includes("Concede +1A"),"Perícia em Montaria mantém A");
 assert.ok(registry.includes('"montaria-epica",'),"Montaria Épica preservada como proposta");
});

test("Mostrar futuras no mapa preserva câmera, suporta toque e sincroniza assistente",()=>{
 assert.ok(graph.includes('class="fp-gene-future-float"'),"Botão na própria área do gráfico");
 assert.ok(graph.includes('data-action="gene-future"'),"Usa o mesmo comando da ficha");
 assert.ok(graph.includes('aria-pressed="'),"Estado acessível do botão");
 assert.ok(graph.includes('fp-gene-skill-hit'),"Área de clique dos nós ampliada");
 assert.ok(graph.includes('MAX_ZOOM=12'),"Ampliação suficiente para celular");
 assert.ok(graph.includes('value="fontes"'),"Atalho de volta às fontes");
 const action=app.slice(app.indexOf('case "gene-future":{'),app.indexOf('case "gene-close-detail"'));
 assert.ok(action.includes("renderGenetic()"),"Re-render apenas do mapa");
 assert.ok(!action.includes("renderWizard()"),"Não recriar o assistente e perder zoom ao alternar");
 const styles=readFileSync(join(root,"styles.css"),"utf8");
 assert.ok(styles.includes(".fp-gene-future-float")&&styles.includes(".fp-gene-skill-hit"),"CSS integrado");
});
