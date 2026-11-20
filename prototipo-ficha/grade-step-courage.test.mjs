import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {dirname,join} from "node:path";
import {fileURLToPath} from "node:url";

const root=dirname(fileURLToPath(import.meta.url));
const app=readFileSync(join(root,"app.js"),"utf8");
const html=readFileSync(join(root,"index.html"),"utf8");
function extract(a,b){
 const i=app.indexOf(a),j=app.indexOf(b,i+a.length);
 assert.ok(i>=0&&j>i,"Seção não encontrada: "+a);
 return app.slice(i,j);
}
const diceTable=extract("const DICE_ATTR=","const FACES=");
const helpers=extract("function dataDice(","function label(");
const poolCode=extract("function buildPool(){","function renderComposer(){");
const unitFactory=new Function("state","draft",diceTable+helpers+
 "\nconst SOURCE_PROPS={attr:'attributes',know:'knowledges',practice:'practices'};"+
 "\nconst key=s=>s?s.group+'.'+s.key:'';"+
 "\nconst same=(a,b)=>!!a&&!!b&&key(a)===key(b);"+
 "\nconst canSecondAttribute=()=>true,mayThird=()=>true,canUseShared=()=>true;"+
 "\nconst usingDiscipline=()=>draft.base?.group==='practice'&&draft.base?.key==='armas_conjuracao';"+
 "\nconst combatItem=(item,mode)=>item?.equipped&&mode==='armas'?[item.die]:[];"+
 poolCode+"\nreturn {buildPool,temporaryGradeDice,describeDicePool};");
function scenario({attrGrade=2,disciplineGrade=2,thirdGrade=null,stepSourceId="",
 equipment=false,extraKeep=false,courage=10}={}){
 const state={attributes:{agilidade:attrGrade},knowledges:{medicina:thirdGrade||0},
  practices:{armas_conjuracao:disciplineGrade},items:equipment?[{id:"w",equipped:true,die:6}]:[],courage};
 const draft={base:{group:"practice",key:"armas_conjuracao"},
  attribute:{group:"attr",key:"agilidade"},
  third:thirdGrade===null?null:{group:"know",key:"medicina"},contextOK:true,
  mode:"armas",equipmentId:equipment?"w":"",de:1,
  step:!!stepSourceId,stepSourceId,extraKeep,
  cravarRemovalShieldId:"",weightEnabled:false,shieldRaise:false,trevas:false};
 return {state,draft,...unitFactory(state,draft)};
}
function diceOf(pool,group){return pool.filter(d=>d.group===group).map(d=>d.sides);}
function sameSummary({buildPool,describeDicePool},group){
 return describeDicePool(diceOf(buildPool().pool,group));
}

test("2d6 de Agilidade evoluem para 3d6 com uma Coragem, sem editar o Grau real",()=>{
 const s=scenario({stepSourceId:"attr.agilidade"});
 const result=s.buildPool();
 assert.deepEqual(result.errors,[]);
 assert.equal(sameSummary(s,"attr"),"3d6");
 assert.equal(sameSummary(s,"practice"),"2d10");
 assert.equal(s.state.attributes.agilidade,2);
 assert.equal(s.draft.step,true);
 assert.equal(result.pool.length,5);
});
test("2d10 de Disciplina evoluem para 3d10",()=>{
 const s=scenario({stepSourceId:"practice.armas_conjuracao"});
 assert.deepEqual(s.buildPool().errors,[]);
 assert.equal(sameSummary(s,"practice"),"3d10");
 assert.equal(sameSummary(s,"attr"),"2d6");
 assert.equal(s.state.practices.armas_conjuracao,2);
});
test("3d10 de Disciplina seguem exatamente a tabela G3→G4: 2d10+1d12",()=>{
 const s=scenario({disciplineGrade:3,stepSourceId:"practice.armas_conjuracao"});
 assert.deepEqual(s.buildPool().errors,[]);
 assert.equal(sameSummary(s,"practice"),"2d10 + 1d12");
});
test("Atributo G3 passa de 3d6 para 2d6+1d10",()=>{
 const s=scenario({attrGrade:3,stepSourceId:"attr.agilidade"});
 assert.deepEqual(s.buildPool().errors,[]);
 assert.equal(sameSummary(s,"attr"),"2d6 + 1d10");
});
test("Não permite aumentar fonte G6 nem dado de equipamento por esta regra",()=>{
 const max=scenario({attrGrade:6,stepSourceId:"attr.agilidade"});
 assert.match(max.buildPool().errors.join("|"),/Grau 6/);
 const equip=scenario({equipment:true,stepSourceId:"equipment.w"});
 assert.match(equip.buildPool().errors.join("|"),/Selecione uma fonte/);
});
test("Aplicação considera o limite de 9 dados rolados, inclusive equipamento",()=>{
 const ok=scenario({disciplineGrade:3,thirdGrade:3,attrGrade:2,stepSourceId:"attr.agilidade"});
 assert.equal(ok.buildPool().pool.length,9);
 assert.deepEqual(ok.buildPool().errors,[]);
 const exceeded=scenario({disciplineGrade:3,thirdGrade:3,attrGrade:2,stepSourceId:"attr.agilidade",equipment:true});
 assert.equal(exceeded.buildPool().pool.length,10);
 assert.match(exceeded.buildPool().errors.join("|"),/9 dados/);
});
test("Não ignora o consumo de Coragem nem concede manutenção adicional",()=>{
 const s=scenario({stepSourceId:"attr.agilidade",extraKeep:true,courage:1});
 assert.match(s.buildPool().errors.join("|"),/Coragem insuficiente/);
});
test("UI seleciona fonte e mostra composições completas, não um dado isolado",()=>{
 assert.ok(app.includes('select("stepSourceId"'));
 assert.ok(app.includes("Elevar fonte em 1 Grau nesta rolagem (1 Coragem)"));
 assert.ok(app.includes("describeDicePool(temporaryGradeDice(source.group,grade,true))"));
 assert.ok(!app.includes("stepDieId"));
 assert.ok(app.includes("const band=editMode?racialXpBand(group,id):\"normal\""));
 assert.ok(app.includes('(editMode?racialXpMarker(group,id):"")'));
 assert.match(html,/app\.js\?v=20261120-magic-icons-v3/);
});

test("Ações acessíveis, inventário como posses e indicadores prioritários",()=>{
 const resources=["life","integrity","defense","movement","courage","balance"];
 for(const resource of resources){
  assert.match(html,new RegExp('data-vital-open="'+resource+'"'),"Sem cartão "+resource);
 }
 assert.match(html,/id="fp-vital-tooltip"/);
 assert.match(html,/class="fp-vitals-primary"/,"Primeiro grupo com quatro indicadores vitais");
 assert.match(html,/class="fp-vitals-secondary"/,"Segundo grupo com três utilitários");
 assert.match(html,/class="fp-vital fp-vital-small fp-vital-inventory" data-sheet-page="inventory"/,"Inventário é atalho direto");
 assert.ok(!html.includes('data-vital-open="load"'),"Capacidade numérica deve sair dos indicadores do topo");
 assert.ok(html.includes('id="load-text"'),"Dados auxiliares continuam disponíveis");
 const order=["life","integrity","defense","movement","courage","balance"].map(id=>html.indexOf('data-vital-open="'+id+'"'));
 assert.deepEqual([...order].sort((a,b)=>a-b),order,"Ordem dos indicadores vitais e secundários");
 assert.ok(html.indexOf('id="play-talents"')<html.indexOf('id="source-grid"'),
  "Ações devem ficar no topo, antes das aptidões");
 assert.ok(html.indexOf('id="source-grid"')<html.indexOf('id="composer-panel"'),
  "No celular, selecionar aptidões antes de abrir o rolador");
 const beginning=html.indexOf('<div class="fp-workspace">');
 const ending=html.indexOf('<section class="fp-panel fp-genetic-panel"',beginning);
 const layout=html.slice(beginning,ending);
 assert.ok(layout.includes('id="play-talents"'),"Ações compartilham a coluna esquerda com aptidões");
 assert.match(layout,/<h3>Ações<\/h3>/,"Repertório foi renomeado como Ações");
 assert.ok(!layout.includes("Seu repertório"),"Sem cabeçalho antigo");
 assert.match(layout,/<h4>Armas equipadas<\/h4>/,"Atalhos de armas ficam junto da conjuração");
 assert.ok(app.includes('data-action="repertoire-roll"'),"Atalho de arma/foco precisa preparar a ação");
 assert.ok(app.includes('data-action="magic-element"'),"Elementos adquiridos ficam selecionáveis na conjuração");
 assert.match(html,/id="magic-actions"/,"Conjuração deve aparecer junto das Ações");
 assert.match(layout,/<h4>Magias<\/h4>/,"Os atalhos de magia ocupam a faixa de Ações");
 assert.ok(!layout.includes('id="owned-skills"'),"Ações não devem listar todas as Perícias");
 assert.ok(html.includes('id="evolution-skills"')&&html.includes('id="owned-skills"'),"Consulta rápida precisa estar em Evolução");
 assert.ok(html.indexOf('id="owned-skills"')>html.indexOf('id="progressao"'),"Lista de Perícias fica abaixo da área de XP");
 assert.ok(app.includes('function magicComposerFields()'),"Grau e foco devem ser renderizados no compositor");
 assert.ok(!app.includes('data-magic-field="magicEnvironmentConfirmed"'),"Sem checkbox para disponibilidade ambiental");
 for(const field of ["magicGrade","magicFocusId","magicCharges","magicAmplify","magicTimeConfirmed"]){
  assert.ok(app.includes('data-magic-field="'+field+'"'),"Campo de conjuração ausente: "+field);
 }
 assert.ok(app.includes('const spellCost=draft.mode==="conjuracao"'),"Gastos de magia devem entrar no limite de Coragem");
 assert.ok(app.includes('focusCharges:type==="foco"'),"Cargas precisam ser persistidas no inventário");
 assert.ok(app.includes('if(usedFocus&&p.opts.magicCharges)'),"Gasto de foco deve ocorrer ao finalizar");
 assert.match(html,/id="inventory-shop-details"/,"Loja separada dos pertences");
 const panes=["bag","wallet","shop"];
 for(const pane of panes){
  assert.ok(html.includes('data-inventory-view="'+pane+'"'),"Subaba "+pane+" disponível");
  assert.ok(html.includes('data-inventory-pane="'+pane+'"'),"Conteúdo da subaba "+pane+" disponível");
 }
 assert.ok(app.includes("function chooseInventoryPane(next)"),"Subabas do Inventário precisam funcionar");
 assert.ok(app.includes('if(page==="inventory")inventoryPane="bag"'),"Abrir Inventário deve mostrar a Mochila");
 assert.ok(html.includes("VT é uma unidade de valor"),"VT tem explicação de poder de troca");
 assert.match(html,/id="inventory-quick-items"/,"Resumo do que o personagem possui");
 assert.ok(html.indexOf('id="inventory-list"')<html.indexOf('id="trade-panel"'),"Itens antes da bolsa de VT");
 assert.ok(html.indexOf('id="trade-panel"')<html.indexOf('id="inventory-shop-details"'),"VT separado da loja");
 assert.ok(!html.includes('<details class="fp-inventory-store" id="inventory-shop-details" open'),"Loja fechada inicialmente");
 assert.ok(app.includes("inventory-quick-equipped"),"Contador de equipamentos deve atualizar");
 assert.ok(app.includes("function vitalHelpDetails(kind)"));
 assert.ok(app.includes("function toggleVitalTooltip(button)"));
 assert.ok(app.includes('document.addEventListener("pointerover"'),"Abrir detalhes ao passar o mouse");
 assert.ok(app.includes("function scheduleVitalTooltipClose()"),"Fechar detalhe flutuante ao sair");
 assert.ok(app.includes("fp-vital-tooltip-actions"),"Controles de Vida e Coragem continuam disponíveis");
 const css=readFileSync(join(root,"styles.css"),"utf8");
 assert.match(css,/\.fp-vitals\{display:flex;flex-wrap:wrap/,"Indicadores devem usar somente a largura necessária");
 assert.match(css,/\.fp-vitals-primary \.fp-vital \.fp-vital-label\{width:32px/,"Ícones principais maiores");
 for(const icon of ["coragem","movimento","peso","inventario"]){
  assert.ok(css.includes("status-"+icon+".svg"),"CSS sem ícone "+icon);
  assert.match(readFileSync(join(root,"../assets/icons/codex/status-"+icon+".svg"),"utf8"),/<svg /);
 }
});


test("Ferreiro: requisitos completos, aquisição por 1 XP e bônus restrito a Forja",()=>{
 const sourceReq=extract("function skillReq(id,s=state){","function dependentsValid(");
 const ADVANCED_SOURCE_DEFS=[{id:"artesao-avancado",group:"practice",key:"artesao",label:"Artesão"}];
 const getReq=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS="+JSON.stringify(ADVANCED_SOURCE_DEFS)+";const SOURCE_PROPS={practice:'practices'};"+sourceReq+"\nreturn skillReq;")(
   {},()=>[],(id,s)=>s.skills.includes(id)
  );
 const ficha=({art=2,forca=1,destreza=1,inteligencia=1,skills=["artesao-avancado"]}={})=>({
  attributes:{forca,destreza,inteligencia},practices:{artesao:art},knowledges:{},skills
 });
 assert.ok(getReq("ferreiro",ficha({skills:[]})),"Exige Artesão Avançado adquirido");
 assert.ok(getReq("ferreiro",ficha({forca:0})),"Exige Força 1");
 assert.ok(getReq("ferreiro",ficha({destreza:0})),"Exige Destreza 1");
 assert.ok(getReq("ferreiro",ficha({inteligencia:0})),"Exige Inteligência 1");
 assert.ok(getReq("ferreiro",ficha({art:0})),"Exige Artesão 1 explícito");
 assert.equal(getReq("ferreiro",ficha()),null,"Compra autorizada com Artesão Avançado e os três Atributos");
 assert.ok(getReq("artesao-avancado",ficha({art:1,skills:[]})),"Artesão Avançado exige grau 2");
 assert.match(app,/"ferreiro",\s*"Ferreiro",[\s\S]*?\n  1\n \]/,"Ferreiro custa 1 XP");
 assert.ok(app.includes('"ferreiro":[["p:artesao:1","a:forca:1","a:destreza:1","a:inteligencia:1","s:artesao-avancado"]]'),"Compra assistida exige todas as fontes e a Perícia");
 assert.ok(app.includes('"ferreiro": "ferreiro"'),"Verbete cadastrado");
 assert.ok(app.includes("+1E somente em teste de Forja"),"Êxito adicional fica limitado à Forja");
 assert.ok(!app.includes("Ferreiro garante +1E em Artesão"),"Sem bonus genérico por usar Artesão");
 const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
 assert.ok(graph.includes('"artesao-avancado","ferreiro"'),"Ferreiro visível no ramo de Artesão");
 const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");
 assert.ok(catalog.includes('<a href="ferreiro.html">Ferreiro</a>'),"Catálogo tem link");
 const entry=readFileSync(join(root,"../pericias/ferreiro.html"),"utf8");
 assert.ok(entry.includes("+1 Êxito (1E)")&&entry.includes("testes de Forja"),"Verbete não amplia o bônus indevidamente");
});


test("Ferreiro Elemental: custo, requisitos e compra após adquirir Encantar com Elemento",()=>{
 const code=extract("function skillReq(id,s=state){","function dependentsValid(");
 const fn=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+code+"\nreturn skillReq;")({},()=>[],(id,s)=>s.skills.includes(id));
 const base=["ferreiro","improviso","criar-item-foco-magia"];
 const make=({inteligencia=2,destreza=2,skills=base}={})=>({
  attributes:{forca:1,destreza,inteligencia},practices:{artesao:2,armas_conjuracao:1},knowledges:{},skills
 });
 assert.ok(fn("ferreiro-elemental",make()),"Sem Encantar com Elemento não é comprável");
 assert.match(fn("ferreiro-elemental",make()),/Encantar com Elemento/,"Bloqueio explica a Perícia ainda não comprada");
 assert.ok(fn("ferreiro-elemental",make({inteligencia:1,skills:[...base,"encantar-com-elemento"]})),"Inteligência 2 é requisito");
 assert.ok(fn("ferreiro-elemental",make({destreza:1,skills:[...base,"encantar-com-elemento"]})),"Destreza 2 é requisito");
 for(const pre of base){assert.ok(fn("ferreiro-elemental",make({skills:[...base.filter(x=>x!==pre),"encantar-com-elemento"]})),"Exige "+pre);}
 assert.equal(fn("ferreiro-elemental",make({skills:[...base,"encantar-com-elemento"]})),null,"Requisitos aprovados completos desbloqueiam a aquisição futura");
 assert.match(app,/"ferreiro-elemental",\s*"Ferreiro Elemental",[\s\S]*?\n  1\n \]/,"Custo é 1 XP");
 assert.ok(app.includes('"ferreiro-elemental":[["a:inteligencia:2","a:destreza:2","s:ferreiro","s:improviso","s:criar-item-foco-magia","s:encantar-com-elemento"]]'),"Plano automático não ignora Encantar");
 const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
 assert.ok(graph.includes('"ferreiro","ferreiro-elemental"'),"Ramo visível em Artesão");
 const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");
 assert.ok(catalog.includes('<a href="ferreiro-elemental.html">Ferreiro Elemental</a>'),"Verbetes vinculados");
 assert.match(readFileSync(join(root,"../pericias/ferreiro-elemental.html"),"utf8"),/pode ser comprada quando todos os seus requisitos forem adquiridos/i,"Consulta informa a aquisição liberada por requisitos");
});

test("Encantar com Elemento: custo, alternativas de requisito, duração idêntica e desbloqueio do Ferreiro Elemental",()=>{
 const code=extract("function skillReq(id,s=state){","function dependentsValid(");
 const fn=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+code+"\nreturn skillReq;")({},()=>[],(id,s)=>s.skills.includes(id));
 const make=(skills)=>({attributes:{forca:1,inteligencia:2,destreza:2},practices:{artesao:2,armas_conjuracao:2},knowledges:{},skills});
 assert.ok(fn("encantar-com-elemento",make([])),"Falta Foco e elemento");
 assert.ok(fn("encantar-com-elemento",make(["fogo"])),"Falta Criar Item de Foco e Magia");
 assert.ok(fn("encantar-com-elemento",make(["criar-item-foco-magia"])),"Falta Perícia Elemental");
 for(const element of ["vento","agua","terra","fogo","sagrado","sangue","trevas","veneno"]){
  assert.equal(fn("encantar-com-elemento",make(["criar-item-foco-magia",element])),null,"Perícia Elemental "+element+" habilita a compra");
 }
 assert.equal(fn("ferreiro-elemental",make(["ferreiro","improviso","criar-item-foco-magia","encantar-com-elemento"])),null,"Ferreiro Elemental desbloqueia depois dos requisitos");
 assert.match(app,/"encantar-com-elemento",\s*"Encantar com Elemento",[\s\S]*?\n  1\n \]/,"Custo 1 XP");
 assert.ok(app.includes('"encantar-com-elemento":[["s:criar-item-foco-magia","s:vento"]'),"Compra assistida tem requisitos alternativos, com Foco");
 assert.ok(app.includes('"encantar-com-elemento": "encantar-com-elemento"'),"Verbete vinculado");
 assert.ok(app.includes("Duração igual para arma, armadura e escudo: E-P"),"Todas as modalidades usam a mesma duração");
 const page=readFileSync(join(root,"../pericias/encantar-com-elemento.html"),"utf8");
 assert.match(page,/1 Coragem/,"Custo de proteção");
 assert.match(page,/E − P/,"Duração idêntica");
 assert.match(page,/armaduras, escudos e armas/,"Confere três modalidades");
 const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");
 assert.ok(catalog.includes('<a href="encantar-com-elemento.html">Encantar com Elemento</a>'));
 const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
 assert.ok(graph.includes('"criar-item-foco-magia","encantar-com-elemento"'));
});



test("Resistência a Fogo: custo 1 XP, pré-requisitos e resistência pessoal no portador",()=>{
 const code=extract("function skillReq(id,s=state){","function dependentsValid(");
 const fn=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+code+"\nreturn skillReq;")({},()=>[],(id,s)=>s.skills.includes(id));
 const make=({vigor=2,skills=["ferreiro-elemental","fogo"]}={})=>({
  attributes:{forca:1,vigor,destreza:2,inteligencia:2},
  practices:{artesao:2,armas_conjuracao:2},knowledges:{},skills
 });
 assert.match(fn("resistencia-a-fogo",make({skills:["fogo"]})),/Ferreiro Elemental/,"Exige Ferreiro Elemental");
 assert.match(fn("resistencia-a-fogo",make({skills:["ferreiro-elemental"]})),/Perícia em Elemento Fogo/,"Exige Fogo");
 assert.match(fn("resistencia-a-fogo",make({vigor:1})),/Vigor 2/,"Exige Vigor 2");
 assert.equal(fn("resistencia-a-fogo",make()),null,"Permite comprar após todos os requisitos");
 assert.match(app,/"resistencia-a-fogo",\s*"Resistência a Fogo",[\s\S]*?\n  1\n \]/,"Custo exatamente 1 XP");
 assert.ok(app.includes('"resistencia-a-fogo":[["a:vigor:2","s:ferreiro-elemental","s:fogo"]]'),"Compra assistida mantém requisitos");
 assert.ok(app.includes('"resistencia-a-fogo": "resistencia-a-fogo"'),"Verbete da ficha");
 assert.ok(app.includes('"resistencia-a-fogo": "Passiva pessoal enquanto adquirida'),"Efeito pessoal reconhecido");
 assert.ok(app.includes('const fireResistanceNote=ownsSkill("resistencia-a-fogo")'),"Exibe resistência somente se o personagem possuir a Perícia");
 assert.ok(app.includes("0,5 de dano por Êxito válido; Pavor não causa dano desse elemento"),"Resistência pessoal usa a regra vigente");
 const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
 assert.ok(graph.includes('"ferreiro-elemental","resistencia-a-fogo"'),"Ramo genético da Forja Elemental");
 const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");
 assert.ok(catalog.includes('<a href="resistencia-a-fogo.html">Resistência a Fogo</a>'),"Catálogo do portal");
 const page=readFileSync(join(root,"../pericias/resistencia-a-fogo.html"),"utf8");
 assert.ok(page.includes("Ferreiro Elemental")&&page.includes("Perícia em Elemento Fogo")&&page.includes("Vigor 2"),"Verbetes preservam requisitos");
 assert.ok(page.includes("próprio personagem que adquiriu a Perícia"),"Portador, não equipamento");
 assert.ok(page.includes("0,5 de dano"),"Redução por Êxito de Fogo, sem imunidade");
 assert.ok(!page.includes("PENDENTE — efeito"),"Efeito pessoal definido e documentado");
});
