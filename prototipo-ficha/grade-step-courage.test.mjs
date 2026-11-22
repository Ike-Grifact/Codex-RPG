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
const weaponMasteryDefs=extract("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
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
  "const ADVANCED_SOURCE_DEFS="+JSON.stringify(ADVANCED_SOURCE_DEFS)+";const SOURCE_PROPS={practice:'practices'};"+weaponMasteryDefs+sourceReq+"\nreturn skillReq;")(
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
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+weaponMasteryDefs+code+"\nreturn skillReq;")({},()=>[],(id,s)=>s.skills.includes(id));
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
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+weaponMasteryDefs+code+"\nreturn skillReq;")({},()=>[],(id,s)=>s.skills.includes(id));
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
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+weaponMasteryDefs+code+"\nreturn skillReq;")({},()=>[],(id,s)=>s.skills.includes(id));
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
 assert.ok(app.includes('const fireResistanceNote=ownsSkill("resistencia-a-fogo")'),"Efeito pessoal reconhecido na ficha");
 assert.ok(app.includes('const fireResistanceNote=ownsSkill("resistencia-a-fogo")'),"Exibe resistência somente se o personagem possuir a Perícia");
 assert.ok(app.includes("0 dano direto à Vida por Derreter G3"),"Derreter não causa dano direto à Vida do portador");
 assert.ok(app.includes("Não reduz dano à Integridade da armadura"),"Resistência protege somente a Vida");
 const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
 assert.ok(graph.includes('"ferreiro-elemental","resistencia-a-fogo"'),"Ramo genético da Forja Elemental");
 const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");
 assert.ok(catalog.includes('<a href="resistencia-a-fogo.html">Resistência a Fogo</a>'),"Catálogo do portal");
 const page=readFileSync(join(root,"../pericias/resistencia-a-fogo.html"),"utf8");
 assert.ok(page.includes("Ferreiro Elemental")&&page.includes("Perícia em Elemento Fogo")&&page.includes("Vigor 2"),"Verbetes preservam requisitos");
 assert.ok(page.includes("próprio personagem que adquiriu a Perícia"),"Portador, não equipamento");
 assert.ok(page.includes("todo dano que efetivamente alcançaria a Vida do portador é dividido por 2"),"Metade do dano que chega à Vida");
 assert.ok(page.includes("Derreter causa 0 de dano direto à Vida"),"Derreter anula apenas parcela direta à Vida");
 assert.ok(page.includes("E + P de dano à Integridade"),"Integridade da armadura permanece normal");
 assert.ok(!page.includes("PENDENTE — efeito"),"Efeito pessoal definido e documentado");
});


test("Maestria em Martelos: comprar com Atributos, ativar somente com Perícia do peso do martelo",()=>{
 const code=extract("function skillReq(id,s=state){","function dependentsValid(");
 const fn=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+weaponMasteryDefs+code+"\nreturn skillReq;")({},()=>[],(id,s)=>s.skills.includes(id));
 const make=({forca=3,destreza=1,vigor=1,skills=[]}={})=>({
  attributes:{forca,destreza,vigor},practices:{armas_conjuracao:0,artesao:0},knowledges:{},skills
 });
 assert.ok(fn("maestria-martelos",make({forca:2})),"Força 3 requerida");
 assert.ok(fn("maestria-martelos",make({destreza:0})),"Destreza 1 requerida");
 assert.ok(fn("maestria-martelos",make({vigor:0})),"Vigor 1 requerido");
 assert.equal(fn("maestria-martelos",make()),null,"Não exige Perícia de Armas para comprar");
 assert.match(app,/"maestria-martelos",\s*"Maestria em Martelos",[\s\S]*?\n  1\n \]/,"Custo 1 XP");
 assert.ok(app.includes('"maestria-martelos":[["a:forca:3","a:destreza:1","a:vigor:1"]]'),"Compra assistida não obriga especializações");
 const start=app.indexOf("function hammerMasteryRequiredSkill(item){");
 const end=app.indexOf("function equipmentGroupName(id)",start);
 assert.ok(start>=0&&end>start,"Verificador de Martelos existe");
 const eligibility=new Function("state", "ownsSkill", "equipmentWeight",
  app.slice(start,end)+"\nreturn {required:hammerMasteryRequiredSkill,can:hammerMasteryCanActivate,onHit:hammerMasteryOnHit};")(
  {},(id,s)=>s.skills.includes(id),(it)=>it.weight==="alto"?"pesado":it.weight
 );
 for(const [weight,skill] of [["leve","armas-leves"],["medio","armas-medias"],["alto","armas-pesadas"]]){
  const weapon={type:"weapon",name:"Martelo de Guerra",weight};
  assert.equal(eligibility.required(weapon),skill,"Peso "+weight+" exige "+skill);
  assert.equal(eligibility.can(weapon,make({skills:["maestria-martelos"]})),false,"Sem Perícia de peso não ativa");
  assert.equal(eligibility.can(weapon,make({skills:[skill]})),false,"Sem Maestria não ativa");
  assert.equal(eligibility.can(weapon,make({skills:[skill,"maestria-martelos"]})),true,"Com ambas habilita efeito grátis");
  const owned=make({skills:[skill,"maestria-martelos"]});
  assert.deepEqual(eligibility.onHit(weapon,false,false,owned),{free:1,paid:0,courageCost:0,maxEffects:1},"Acerto comum: um efeito sem custo");
  assert.deepEqual(eligibility.onHit(weapon,true,false,owned),{free:2,paid:0,courageCost:0,maxEffects:2},"Crítico: dois efeitos sem custo");
  assert.deepEqual(eligibility.onHit(weapon,true,true,owned),{free:2,paid:1,courageCost:1,maxEffects:3},"Crítico + Coragem: terceiro efeito");
  assert.deepEqual(eligibility.onHit(weapon,false,true,owned),{free:1,paid:0,courageCost:0,maxEffects:1},"Terceira característica especial só no crítico");
  assert.deepEqual(eligibility.onHit(weapon,true,true,make({skills:["maestria-martelos"]})),{free:0,paid:0,courageCost:0,maxEffects:0},"Sem Perícia de Armas do peso não recebe benefícios");
 }
 assert.equal(eligibility.required({type:"weapon",name:"Espada",weight:"leve"}),null,"Não aplica a armas sem martelo");
 assert.ok(app.includes("crítico = até 2 diferentes grátis, podendo gastar 1 Coragem para uma terceira"),"Inventário informa dois gratuitos e terceiro pago");
 const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
 assert.ok(graph.includes('"armas-pesadas","maestria-martelos"'),"Mapa no ramo de Armas");
 const page=readFileSync(join(root,"../pericias/maestria-em-martelos.html"),"utf8");
 assert.ok(page.includes("Força 3")&&page.includes("Destreza 1")&&page.includes("Vigor 1"));
 assert.ok(page.includes("Perícia em Armas")&&page.includes("1 Coragem")&&page.includes("duas características diferentes do martelo gratuitamente"),"Verbete registra crítico com dois gratuitos");
 const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");
 assert.ok(catalog.includes('<a href="maestria-em-martelos.html">Maestria em Martelos</a>'));
});


test("Exclusividades: Maestria em Armas de Fogo inicial só para Humano; Transfusão Sanguinária só para Lucker de Sangue",()=>{
 const racial=extract("function racialGrants(s=state){","function racialCostTable(");
 const race=new Function("state",
  "const PURE_ELEMENTS=[['sangue','Sangue'],['trevas','Trevas'],['veneno','Veneno']];"+
  "const RUNE_ELEMENTS=[['agua','Água'],['fogo','Fogo'],['vento','Ar'],['terra','Terra']];"+
  racial+"\nreturn {racialGrants,ownsSkill};")({});
 const humano={race:"humano",skills:[],attributes:{},practices:{},knowledges:{},runeElements:[]};
 const sangue={race:"lucker_sangue",skills:[],attributes:{},practices:{},knowledges:{},runeElements:[]};
 const puro={race:"lucker_puro",skills:[],attributes:{},practices:{},knowledges:{},pureElement:"sangue",runeElements:[]};
 assert.ok(race.racialGrants(humano).includes("maestria-armas-fogo"),"Humano recebe Maestria gratuita");
 assert.ok(!race.racialGrants(humano).includes("armas-fogo"),"Não recebe Perícia em Armas de Fogo");
 assert.ok(!race.racialGrants(sangue).includes("maestria-armas-fogo"),"Lucker de Sangue não recebe");
 assert.ok(!race.racialGrants(puro).includes("maestria-armas-fogo"),"Lucker Puro não recebe");
 assert.equal(race.ownsSkill("maestria-armas-fogo",humano),true);
 assert.equal(race.ownsSkill("maestria-armas-fogo",{...puro,skills:["maestria-armas-fogo"]}),false,"Importação não permite Maestria racial para Lucker");
 assert.equal(race.ownsSkill("transfusao-sanguinaria",{...humano,skills:["transfusao-sanguinaria"]}),false,"Não utiliza em Humano");
 assert.equal(race.ownsSkill("transfusao-sanguinaria",{...puro,skills:["transfusao-sanguinaria"]}),false,"Não utiliza em Lucker Puro com Sangue");
 assert.equal(race.ownsSkill("transfusao-sanguinaria",{...sangue,skills:["transfusao-sanguinaria"]}),true,"Somente Lucker de Sangue pode utilizar");
 const defs=extract("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
 const requirements=extract("function skillReq(id,s=state){","function dependentsValid(");
 const fn=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+
  defs+requirements+"\nreturn skillReq;")({},race.racialGrants,race.ownsSkill);
 const eligible={...sangue,skills:["transfusao","sangue"],attributes:{forca:3,destreza:2,vigor:2,inteligencia:2},practices:{armas_conjuracao:2,artesao:2},knowledges:{}};
 assert.equal(fn("transfusao-sanguinaria",eligible),null,"Lucker de Sangue atende as exigências existentes");
 assert.match(fn("transfusao-sanguinaria",{...eligible,race:"lucker_puro"}),/exclusiva de Lucker de Sangue/i);
 assert.match(fn("transfusao-sanguinaria",{...eligible,race:"humano"}),/exclusiva de Lucker de Sangue/i);
 assert.equal(fn("maestria-armas-fogo",{...humano,attributes:{forca:0,destreza:0,vigor:0}}),null,"Maestria Humana não exige Força 3");
 assert.match(fn("maestria-armas-fogo",{...eligible,race:"lucker_sangue"}),/exclusiva dos Humanos/i);
 assert.ok(app.includes('&&!(x==="transfusao-sanguinaria"&&s.race!=="lucker_sangue")'),"Importação remove aquisição incompatível com raça");
 assert.ok(app.includes('rawSkills.filter'),"Preserva importação geral de fichas");
 assert.ok(app.includes("Restrição racial de Transfusão Sanguinária: compra histórica inválida"),"Registra histórico da remoção racial em nota, sem ocultar o reembolso");
 assert.ok(app.includes('transfusion.title=state.race!=="lucker_sangue"'),"Bloqueio da ação também explica exclusividade ao jogador");
 const verbete=readFileSync(join(root,"../pericias/transfusao-sanguinaria.html"),"utf8");
 assert.match(verbete,/somente Luckers de Sangue podem comprar e utilizar/);
 const fogo=readFileSync(join(root,"../pericias/maestria-em-armas-fogo.html"),"utf8");
 assert.match(fogo,/Todo Humano começa com Maestria em Armas de Fogo/);
});

test("Maestrias por família: regra compartilhada, compra não inventada e habilitação apropriada",()=>{
 const defs=extract("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
 const specs=new Function(defs+"\nreturn WEAPON_MASTERY_TYPES;")();
 assert.equal(specs.length,12,"Doze especializações novas, além de Martelos");
 assert.ok(specs.some(x=>x.id==="maestria-armas-fogo"),"Inclui Armas de Fogo");
 const snippet=extract("function hammerMasteryRequiredSkill(item){","function equipmentGroupName(id)");
 const own=(id,s)=>id==="maestria-armas-fogo"?(s.race==="humano"):(s.skills||[]).includes(id);
 const mastery=new Function("state","ownsSkill","equipmentWeight",snippet+
  "\nreturn {id:weaponMasteryId,required:weaponMasteryRequiredSkill,can:weaponMasteryCanActivate,onHit:weaponMasteryOnHit};")(
    {},own,it=>it.weight==="alto"?"pesado":it.weight
  );
 const table=[
  ["Adaga","leve","maestria-adagas","armas-leves"],
  ["Espada Longa","medio","maestria-espadas","armas-medias"],
  ["Machado de Guerra","alto","maestria-machados","armas-pesadas"],
  ["Maça","leve","maestria-macas","armas-leves"],
  ["Lança","medio","maestria-hastes","armas-medias"],
  ["Cajado","leve","maestria-cajados","armas-leves"],
  ["Arco Longo","leve","maestria-arcos","armas-longo-alcance"],
  ["Besta pequena","leve","maestria-bestas","armas-longo-alcance"],
  ["Dardo de arremesso","leve","maestria-arremessos","maestria-arremesso-armas"],
  ["Manopla","leve","maestria-punhos","pugilismo"],
  ["Zarabatana","leve","maestria-longo-alcance","armas-longo-alcance"],
  ["Martelo de Guerra","alto","maestria-martelos","armas-pesadas"],
  ["Pistola","leve","maestria-armas-fogo","armas-fogo"]
 ];
 for(const [name,weight,id,required] of table){
  const item={type:"arma",name,weight,firearm:id==="maestria-armas-fogo",properties:["A","B","C"]};
  assert.equal(mastery.id(item),id,name+" classificado corretamente");
  assert.equal(mastery.required(item),required,"Requisito de manejo de "+name);
  const extra=id==="maestria-arremessos"?["armas-leves"]:[];
  const hero={race:"humano",skills:[id,required,...extra]};
  assert.equal(mastery.can(item,hero),true,name+" habilitado");
  assert.deepEqual(mastery.onHit(item,false,false,hero),{free:1,paid:0,courageCost:0,maxEffects:1});
  assert.deepEqual(mastery.onHit(item,true,false,hero),{free:2,paid:0,courageCost:0,maxEffects:2});
  assert.deepEqual(mastery.onHit(item,true,true,hero),{free:2,paid:1,courageCost:1,maxEffects:3});
  assert.equal(mastery.can(item,{race:"humano",skills:[id]}),false,name+" requer Perícia de manejo");
 }
 const pistol={type:"arma",name:"Pistola",weight:"leve",firearm:true};
 assert.equal(mastery.can(pistol,{race:"lucker_sangue",skills:["armas-fogo","maestria-armas-fogo"]}),false,"Não habilita a um Lucker com dados importados");
 assert.equal(mastery.can(pistol,{race:"humano",skills:["armas-fogo"]}),true,"Humano recebe Maestria sem compra");
 assert.equal(mastery.can(pistol,{race:"humano",skills:[]}),false,"Humano sem Perícia em Armas de Fogo não ativa");
 const thrown={type:"arma",name:"Dardo de Arremesso",weight:"leve"};
 assert.equal(mastery.can(thrown,{race:"humano",skills:["maestria-arremessos","maestria-arremesso-armas"]}),false,"Arremesso também exige Perícia de peso");
 assert.equal(mastery.id({type:"arma",name:"Arma improvisada não catalogada",weight:"leve"}),null,"Sem grupo confirmado não concede Maestria arbitrária");
 const schema=app.slice(app.indexOf("const SKILLS=["),app.indexOf("// IDs de Perícias legadas"));
 assert.ok(schema.includes("...WEAPON_MASTERY_TYPES.map"),"Novos nomes no catálogo");
 assert.ok(schema.includes("  null"),"Novos custos sem homologação ficam pendentes");
 for(const spec of specs){
  const slug=spec.id.replace("maestria-","maestria-em-");
  const page=readFileSync(join(root,"../pericias/"+slug+".html"),"utf8");
  assert.ok(page.includes(spec.name),"Verbete presente "+spec.name);
 }
 const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
 assert.ok(graph.includes('"maestria-adagas"')&&graph.includes('"maestria-armas-fogo"'));
 const portal=readFileSync(join(root,"../pericias/index.html"),"utf8");
 for(const x of specs)assert.ok(portal.includes(x.id.replace("maestria-","maestria-em-")+".html"),"Catalogada "+x.name);
});


test("Montaria: Montar Animal dá Vantagem; nova Perícia em Montaria dá +1A sem custo XP inventado",()=>{
 const definitions=extract("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
 const rules=extract("function skillReq(id,s=state){","function dependentsValid(");
 const req=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+definitions+rules+
  "\nreturn skillReq;")({},()=>[],(id,s)=>(s.skills||[]).includes(id));
 const make=({influencia=1,destreza=2,skills=[]}={})=>({
  race:"humano",attributes:{influencia,destreza,forca:0,agilidade:0,inteligencia:0,vigor:0},
  practices:{armas_conjuracao:0,artesao:0,apresentacao:0,atletismo:0,furtividade:0,coleta:0},
  knowledges:{},skills
 });
 assert.match(req("pericia-montaria",make({influencia:0})),/Influência 1 e Destreza 2/,"Influência 1 obrigatória");
 assert.match(req("pericia-montaria",make({destreza:1})),/Influência 1 e Destreza 2/,"Destreza 2 obrigatória");
 assert.match(req("pericia-montaria",make()),/Custo XP.*PENDENTE/,"Não pode comprar sem custo definido");
 assert.match(req("pericia-montaria",make({skills:["montar"]})),/Custo XP.*PENDENTE/,"Montar Animal não substitui custo não definido");
 assert.equal(req("montar",make({influencia:2})),null,"Montar Animal continua com requisito Influência 2");
 assert.match(req("montar",make({influencia:1})),/Influência grau 2/,"Montar Animal não adota novos requisitos");
 assert.match(app,/"montar",\s*"Montar Animal",[\s\S]*?\n  2\n \]/,"Montar Animal permanece custando 2 XP");
 assert.match(app,/"pericia-montaria",\s*"Perícia em Montaria",[\s\S]*?\n  null\n \]/,"Nova compra fica sem custo atribuído");
 assert.ok(app.includes('"pericia-montaria":[["a:influencia:1","a:destreza:2"]]'),"Atributos na compra assistida");
 assert.ok(app.includes('"montar": "Vantagem em testes com montaria; NÃO concede +1A automaticamente."'),"Montar Animal oferece Vantagem, não +1A");
 assert.ok(app.includes('"pericia-montaria": "+1 Antecipar (A) aos testes com montaria, sem Vantagem e sem dado extra.'),"Perícia em Montaria oferece +1A, não Vantagem");
 const graph=readFileSync(join(root,"gene-graph.js"),"utf8");
 assert.ok(graph.includes('"montar","pericia-montaria"'),"Ambas representadas no Codex Genético");
 const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");
 assert.ok(catalog.includes('<a href="pericia-em-montaria.html">Perícia em Montaria</a>'));
 assert.ok(catalog.includes('<a href="montar-animal.html">Montar Animal</a>'));
 const newPage=readFileSync(join(root,"../pericias/pericia-em-montaria.html"),"utf8");
 const oldPage=readFileSync(join(root,"../pericias/montar-animal.html"),"utf8");
 assert.ok(newPage.includes("Influência 1 + Destreza 2")&&newPage.includes("+1A"));
 assert.ok(newPage.includes("compra está <strong>PENDENTE</strong>"));
 assert.ok(oldPage.includes("Vantagem em testes com montaria")&&oldPage.includes("Vantagem não é +1 Antecipar"));
});


test("Maestria em Escudos: 1 XP, Destreza/Vigor 2, +1 DE com escudo único e Integridade temporária",()=>{
 const defs=extract("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
 const reqs=extract("function skillReq(id,s=state){","function dependentsValid(");
 const owns=(id,s)=>(s.skills||[]).includes(id);
 const skillReq=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+defs+reqs+
  "\nreturn skillReq;")({},()=>[],owns);
 const prep=(dex,vig,skills=[])=>({
  attributes:{destreza:dex,vigor:vig,forca:0,agilidade:0},practices:{armas_conjuracao:0,artesao:0,atletismo:0},knowledges:{},skills
 });
 assert.match(skillReq("maestria-escudos",prep(1,2)),/Destreza 2 e Vigor 2/);
 assert.match(skillReq("maestria-escudos",prep(2,1)),/Destreza 2 e Vigor 2/);
 assert.equal(skillReq("maestria-escudos",prep(2,2)),null);
 assert.match(app,/"maestria-escudos",\s*"Maestria em Escudos",[\s\S]*?\n  1\n \]/,"Custo 1 XP");
 assert.ok(app.includes('"maestria-escudos":[["a:destreza:2","a:vigor:2"]]'));
 const code=extract("function deNatural(s=state){","function capacity(){");
 const sheet={level:1,skills:["maestria-escudos"],attributes:{destreza:2,vigor:2,agilidade:5,forca:3},
  practices:{atletismo:0},items:[
   {id:"first",type:"escudo",equipped:true,hp:6,max:6,shieldMasteryBonusSpent:false},
   {id:"second",type:"escudo",equipped:true,hp:9,max:9,shieldMasteryBonusSpent:false}
  ]};
 const f=new Function("state","ownsSkill",code+
  "\nreturn {deNatural,deDefense,shieldMasteryActive,shieldIntegrityDisplay,changeShieldIntegrity,loseShieldIntegrity};")(sheet,owns);
 assert.equal(f.deDefense(sheet),f.deNatural(sheet)+1,"+1 DE enquanto há escudo");
 assert.equal(f.shieldMasteryActive(sheet.items[0]),true);
 assert.equal(f.shieldMasteryActive(sheet.items[1]),false,"Não se multiplicam bônus por vários escudos");
 assert.deepEqual(f.shieldIntegrityDisplay(sheet.items[0]),{hp:7,max:7,bonus:1,active:true});
 assert.deepEqual(f.shieldIntegrityDisplay(sheet.items[1]),{hp:9,max:9,bonus:0,active:false});
 f.changeShieldIntegrity(sheet.items[0],-1);
 assert.equal(sheet.items[0].hp,6,"Primeiro perde ponto extra, não material base");
 assert.equal(sheet.items[0].shieldMasteryBonusSpent,true);
 assert.equal(f.shieldIntegrityDisplay(sheet.items[0]).hp,6);
 sheet.items[0].equipped=false;
 assert.equal(f.shieldIntegrityDisplay(sheet.items[0]).max,6,"Sem equipamento, sem +1");
 sheet.items[0].equipped=true;
 assert.equal(f.shieldIntegrityDisplay(sheet.items[0]).hp,6,"Reequipar não restaura ponto gasto");
 assert.equal(f.loseShieldIntegrity(sheet.items[0],2),2);
 assert.equal(sheet.items[0].hp,4,"Cravar e desgaste material respeitam ponto consumido");
 const noSkill={...sheet,skills:[]};
 assert.equal(f.deDefense(noSkill),f.deNatural(noSkill),"Sem Maestria DE normal");
 const cap={...sheet,attributes:{...sheet.attributes,agilidade:6,destreza:6,vigor:6},items:[sheet.items[0],
  {id:"armor",type:"armadura",weight:"muito_leve",equipped:true,grade:1}]};
 assert.equal(f.deDefense(cap),12,"Maestria + armadura não ultrapassam teto 12");
 const file=readFileSync(join(root,"../pericias/maestria-em-escudos.html"),"utf8");
 assert.ok(file.includes("Destreza 2 + Vigor 2")&&file.includes("+1 DE defensiva"));
 assert.ok(app.includes("shieldMasteryBonusSpent:type===\"escudo\"&&!!it.shieldMasteryBonusSpent"),"Persistência do desgaste do bônus");
});

test("Escudo Bumerangue: 1 XP, dependências, alcance de 8m, retorno sem dano inventado",()=>{
 const defs=extract("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
 const reqs=extract("function skillReq(id,s=state){","function dependentsValid(");
 const owns=(id,s)=>(s.skills||[]).includes(id);
 const req=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+defs+reqs+
  "\nreturn skillReq;")({},()=>[],owns);
 const state=(dex,forca,skills)=>({attributes:{destreza:dex,forca,vigor:2,agilidade:1},
  practices:{armas_conjuracao:0,artesao:0,atletismo:0},knowledges:{},skills});
 const owned=["maestria-escudos","maestria-arremesso-armas"];
 assert.match(req("escudo-bumerangue",state(1,3,owned)),/Requer Destreza 2, Força 3/);
 assert.match(req("escudo-bumerangue",state(2,2,owned)),/Requer Destreza 2, Força 3/);
 assert.match(req("escudo-bumerangue",state(2,3,["maestria-escudos"])),/Arremesso de Armas/);
 assert.match(req("escudo-bumerangue",state(2,3,["maestria-arremesso-armas"])),/Maestria em Escudos/);
 assert.equal(req("escudo-bumerangue",state(2,3,owned)),null);
 assert.match(app,/"escudo-bumerangue",\s*"Escudo Bumerangue",[\s\S]*?\n  1\n \]/,"Custo 1 XP");
 assert.ok(app.includes('"escudo-bumerangue":[["a:destreza:2","a:forca:3","s:maestria-arremesso-armas","s:maestria-escudos"]]'));
 const code=extract("function deNatural(s=state){","function capacity(){");
 const s={...state(2,3,[...owned,"escudo-bumerangue"]),items:[{id:"sh",type:"escudo",equipped:true,hp:6,max:6}]};
 const ready=new Function("state","ownsSkill",code+"\nreturn shieldBoomerangReady;")(s,owns);
 assert.equal(ready(s.items[0],s),true,"Escudo equipado e requisitos cumpridos");
 assert.equal(ready({...s.items[0],equipped:false},s),false,"Só escudo usado pode ser arremessado");
 assert.equal(ready({type:"arma",equipped:true},s),false,"Arma comum não substitui escudo");
 assert.equal(ready(s.items[0],{...s,skills:owned}),false,"Sem Bumerangue não habilita");
 const page=readFileSync(join(root,"../pericias/escudo-bumerangue.html"),"utf8");
 assert.ok(page.includes("8 metros")&&page.includes("retorna ao portador"));
 assert.ok(page.includes("dano físico básico normal")&&page.includes("1 Coragem"),"Dano físico normal e custo do lançamento definidos");
 const map=readFileSync(join(root,"gene-graph.js"),"utf8");
 assert.ok(map.includes('skills:["maestria-escudos","escudo-refletor","escudo-bumerangue"'),"Ambas as perícias continuam agrupadas na constelação Escudos");
 const portal=readFileSync(join(root,"../pericias/index.html"),"utf8");
 assert.ok(portal.includes('href="escudo-bumerangue.html"')&&portal.includes('href="maestria-em-escudos.html"'));
});


test("Escudo Bumerangue: Disciplina + Atributos, retorno somente no acerto e queda de Arremesso na falha",()=>{
 const code=extract("function shieldBoomerangResult(","function prepareShieldBoomerang(");
 const outcome=new Function(code+"\nreturn shieldBoomerangResult;")();
 assert.deepEqual(outcome(true,0,2,0,0),{returned:true,grounded:false,where:"portador",distance:null},"Acerto limpo retorna");
 assert.deepEqual(outcome(true,2,2,2,1),{returned:true,grounded:false,where:"portador",distance:null},"Acerto com Pavor retorna no mesmo turno");
 assert.deepEqual(outcome(false,0,1,0,1),{returned:false,grounded:true,where:"caminho",distance:2},"Falha limpa cai no caminho; converte 2A em 1E na distância");
 assert.deepEqual(outcome(false,2,1,2,1),{returned:false,grounded:true,where:"perto-alvo",distance:4},"Falha com Pavor cai perto do alvo; distância E+P+conversão");
 assert.equal(outcome(false,0,0,0,0).distance,0,"Distância não inventa metros");
 assert.ok(app.includes('draft.base={group:"practice",key:"armas_conjuracao"}'),"Lançamento usa Disciplina como Base");
 assert.ok(app.includes('draft.attribute={group:"attr",key:attribute}'),"Lançamento usa Atributo realmente comprado");
 assert.ok(app.includes('draft.mode="armas";draft.shieldThrowId=id;draft.shieldThrowMeters=8'),"Distância específica 8 m");
 assert.ok(app.includes('if(draft.shieldThrowId){'),"Pilha valida contexto de Escudo Bumerangue");
 assert.ok(app.includes('draft.third&&draft.third.group!=="attr"'),"Complemento, quando válido, é outro Atributo");
 assert.ok(app.includes('draft.shieldThrowMeters>8'),"Não aceita alvo além de 8 metros");
 assert.ok(app.includes('if(usingDiscipline()&&!draft.maosLeves&&!draft.shieldThrowId&&!draft.equipmentId'),"Não insere dado de arma automaticamente");
 assert.ok(app.includes('shieldThrowId:draft.shieldThrowId||""'),"Origem da rolagem acompanha os dados");
 assert.ok(app.includes('shieldThrowOutcome=p.shieldThrowId?shieldBoomerangResult(success,P,raw[0]'),"Resultado decidido após contar E, P e gastar A");
 assert.ok(app.includes('const damage=p.opts.maosLeves||p.cravarRemovalShieldId?0:damageBasic*(critTier===4?2:1)'),"Dano normal do ataque físico, incluindo crítico de quatro dados");
 assert.ok(app.includes('thrownShield.equipped=false;thrownShield.shieldGrounded=true'),"Finalização registra falha com escudo no chão");
 assert.ok(app.includes('shieldThrowReturned:!!s.shieldThrowOutcome?.returned'),"Histórico registra retorno");
 assert.ok(app.includes('shieldThrowFallMeters:s.shieldThrowOutcome?.distance??null'),"Histórico registra distância de queda");
 assert.ok(app.includes('shieldGrounded:type==="escudo"&&!!it.shieldGrounded'),"Posição no chão persiste na ficha");
 assert.ok(app.includes('if(it.type==="escudo"&&it.shieldGrounded)return 0'),"Escudo no chão não conta na carga");
 assert.ok(app.includes('if(it.type==="escudo"&&it.shieldGrounded){toast("Escudo no chão:'),"Não se reequipa escudo caído como se fosse guardado");
 assert.ok(app.includes('case "shield-ground-recover"'),"Recuperação manual requer confirmação");
 assert.ok(app.includes('case "shield-throw-prepare":prepareShieldBoomerang(id)'),"Inventário oferece preparação do lançamento");
 const page=readFileSync(join(root,"../pericias/escudo-bumerangue.html"),"utf8");
 assert.ok(page.includes("Disciplina (Armas) + Atributo(s)"),"Verbetes descrevem fontes");
 assert.ok(page.includes("mesmo turno em que foi lançado"),"Verbetes descrevem retorno no mesmo turno");
 assert.ok(page.includes("Falha limpa:")&&page.includes("Falha com Pavor:"),"Verbetes descrevem falhas distintas");
 assert.ok(page.includes("1E por 2A convertidos"),"Verbetes descrevem queda com Antecipar convertido");
});

test("Escudo Bumerangue: 1 Coragem ao lançar, dano físico e características próprias da peça",()=>{
 const page=readFileSync(join(root,"../pericias/escudo-bumerangue.html"),"utf8");
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const index=readFileSync(join(root,"../pericias/index.html"),"utf8");
 assert.ok(page.includes("1 Coragem para lançar")&&page.includes("dano físico básico normal"));
 assert.ok(book.includes("arremessar o escudo consome **1 Coragem**")&&srd.includes("cada lançamento de Escudo Bumerangue consome **1 Coragem**"));
 assert.ok(index.includes("dano físico normal e características próprias do escudo"));
 assert.ok(app.includes("const damageBasic=success?E+Math.floor(P/2):0"),"Usa a fórmula universal E + piso(P/2)");
 assert.ok(app.includes("const damage=p.opts.maosLeves||p.cravarRemovalShieldId?0:damageBasic*(critTier===4?2:1)"),"Sem ramo null e com crítico normal");
 assert.ok(app.includes("Number(!!draft.shieldThrowId)"),"Preparação inclui 1 Coragem por arremesso");
 assert.ok(app.includes("Number(!!p.shieldThrowId)"),"Pontuação/finalização inclui custo em Coragem mesmo em falha");
 assert.ok(app.includes('const item=state.items.find(x=>x.id===(p.shieldThrowId||p.opts.equipmentId));'),"Consulta características do escudo sem usar seus dados como arma");
 assert.ok(app.includes('!(p.shieldThrowId&&x==="Cravar")'),"Cravar incompatível com retorno não está no seletor");
 assert.ok(!app.includes('||p.opts.weightEnabled||p.characteristic||p.secondCharacteristic)'),"Características do escudo são permitidas");
 assert.ok(app.includes('if(courageCost>5)errs.push'),"Teto de Coragem preservado");
 assert.ok(page.includes("uma característica ativável custa mais 1 Coragem no acerto comum"));
 assert.ok(app.includes('shieldThrowReturned:!!s.shieldThrowOutcome?.returned'),"Retorno e queda existentes permanecem");
});

test("Escudo Bumerangue: resolução real de dano, propriedades, custo e erro de Coragem",()=>{
 const resultCode=extract("function shieldBoomerangResult(","function prepareShieldBoomerang(");
 const scoreCode=extract("function score(){","function renderPending(){");
 const makeScore=new Function("state","face","SITUATIONS","LIFE_STATES","lifeStage","ownsSkill",
  "magicKnownElements","magicPreparationTurns","magicElementId","affinity","keepLimit","clamp",
  "shieldBoomerangReady","ACTIVE_PROPERTIES",resultCode+scoreCode+"\nreturn score;");
 function compute(faces,trait="",courage=10,de=2){
  const p={shieldThrowId:"sh",base:{group:"practice",key:"armas_conjuracao"},
   attribute:{group:"attr",key:"forca"},third:null,mode:"armas",
   dice:faces.map(([sides,value],i)=>({id:"x"+i,sides,face:value,group:i?"practice":"attr"})),
   selected:faces.map((_,i)=>"x"+i),
   opts:{de,situation:"normal",extraKeep:false,step:false,healthId:"ok",equipmentId:"",
    shieldThrowMeters:8,shieldRaise:false,weightEnabled:false,trevas:false,magicElement:"",
    magicGrade:0,magicFocusId:"",magicCharges:0,magicAmplify:false},
   cancelP:0,pairs:0,pass:0,characteristic:trait,secondCharacteristic:"",
   fireMode:"",cravarTargetShield:""};
  const state={pending:p,items:[{id:"sh",type:"escudo",equipped:true,properties:["Perfurante","Contundente"]}],
   courage,skills:[],hemomancy:{}};
  const face=(n,value)=>({6:{6:[1,0,0]},10:{6:[1,0,0],7:[2,0,0],9:[1,1,1],10:[2,0,1]},12:{12:[0,0,2]}}[n]||{})[value]||[0,0,0];
  const health={e:0,p:0,a:0,coragem:0};
  const score=makeScore(state,face,{normal:["Normal",0,0]},{ok:health},()=>health,
   ()=>false,()=>[],()=>1,()=>"",()=>0,()=>4,(v,min,max)=>Math.max(min,Math.min(max,v)),
   ()=>true,new Set(["Contundente","Cortante","Perfurante","Cravar","Enganchar","Elemental","Explosivo","Muito Leve"]));
  return score();
 }
 const basic=compute([[6,6],[10,7]]);
 assert.deepEqual({damage:basic.damage,cost:basic.courageCost,returned:basic.shieldThrowOutcome.returned,errors:basic.errors},
  {damage:3,cost:1,returned:true,errors:[]},"Dano só da rolagem, não do equipamento");
 const piercing=compute([[6,6],[10,9],[12,12]],"Perfurante");
 assert.equal(piercing.damage,3,"Dano básico com Pavor usa piso(P/2)");
 assert.equal(piercing.armorDamage,5,"Perfurante habilitado substitui contribuição de P à Integridade");
 assert.equal(piercing.courageCost,2,"Lançar custa 1 e ativar característica em acerto não crítico custa mais 1");
 assert.deepEqual(piercing.active,["Perfurante"]);
 assert.equal(piercing.errors.length,0);
 assert.match(compute([[6,6],[10,7]],"Contundente",1).errors.join(" "),/Coragem insuficiente/);
 const missed=compute([[6,6]],"",10,5);
 assert.equal(missed.damage,0);
 assert.equal(missed.courageCost,1,"Falha ainda consome Coragem do lançamento quando finalizada");
 assert.equal(missed.shieldThrowOutcome.grounded,true);
});

test("Novas Perícias — Sacrifício Heroico, Escudo Refletor e Sentido Elemental: requisitos e compra de 1 XP",()=>{
 const defs=extract("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
 const reqs=extract("function skillReq(id,s=state){","function dependentsValid(");
 const owns=(id,s)=>(s.skills||[]).includes(id);
 const req=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+defs+reqs+"\nreturn skillReq;")({},()=>[],owns);
 const prepare=(vigor,inteligencia,skills=[])=>({
  attributes:{vigor,inteligencia,forca:0,destreza:0,agilidade:0,influencia:0},
  practices:{armas_conjuracao:1,atletismo:0,artesao:0},knowledges:{alquimia:0,medicina:0},skills
 });
 assert.match(req("sacrificio-heroico",prepare(3,3)),/Vigor 4/);
 assert.equal(req("sacrificio-heroico",prepare(4,0)),null);
 assert.match(req("escudo-refletor",prepare(4,3)),/Maestria em Escudos/);
 assert.equal(req("escudo-refletor",prepare(4,0,["maestria-escudos"])),null);
 assert.match(req("sentido-elemental",prepare(4,2,["improviso"])),/Inteligência 3/);
 assert.match(req("sentido-elemental",prepare(4,3)),/Improviso Elemental/);
 assert.equal(req("sentido-elemental",prepare(4,3,["improviso"])),null);
 for(const id of ["sacrificio-heroico","escudo-refletor","sentido-elemental"]){
  assert.match(app,new RegExp('"'+id+'",\\s*"[^"]+",[\\s\\S]*?\\n  1\\n \\]'),"Compra "+id+" = 1 XP");
  const page=readFileSync(join(root,"../pericias/"+id+".html"),"utf8");
  assert.ok(page.includes("1 XP")&&page.includes("DEFINIDO"),"Verbete da Perícia "+id);
 }
 assert.ok(app.includes('"sacrificio-heroico":[["a:vigor:4"]]'));
 assert.ok(app.includes('"escudo-refletor":[["s:maestria-escudos"]]'));
 assert.ok(app.includes('"sentido-elemental":[["a:inteligencia:3","s:improviso"]]'));
 const gene=readFileSync(join(root,"gene-graph.js"),"utf8");
 const catalog=readFileSync(join(root,"../pericias/index.html"),"utf8");
 for(const id of ["sacrificio-heroico","escudo-refletor","sentido-elemental"]){
  assert.ok(gene.includes('"'+id+'"'),"Codex Genético: "+id);
  assert.ok(catalog.includes('href="'+id+'.html"'),"Catálogo: "+id);
 }
});

test("Aura Sagrada é efeito da Transformação Elemental, não compra separada",()=>{
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 const page=readFileSync(join(root,"../pericias/transformacao-elemental.html"),"utf8");
 assert.ok(srd.includes("Aura Sagrada")&&srd.includes("3 metros")&&srd.includes("1 Coragem"));
 assert.ok(book.includes("Aura Sagrada")&&page.includes("Aura Sagrada"));
 assert.ok(app.includes("Aura Sagrada: quando a Transformação Elemental em Sagrado se concretiza"));
 assert.ok(!app.includes('"aura-sagrada",\n'),"Não criar nova compra de Aura Sagrada");
 assert.ok(app.includes('ownsSkill("transformacao-elemental")&&ownsSkill("sagrado")'),"Aviso só aparece para combinação habilitada");
});

test("Sentido Elemental debita Coragem apenas após confirmação e não inventa afinidade",()=>{
 assert.ok(app.includes('case "sentido-elemental-use"'));
 assert.ok(app.includes('if(state.pending){toast("Finalize a rolagem pendente antes de analisar um alvo.")'));
 assert.ok(app.includes('if(state.courage<1){toast("Coragem insuficiente para usar Sentido Elemental.")'));
 assert.ok(app.includes('if(!confirm("Gastar 1 Coragem para analisar "+target+"?'));
 assert.ok(app.includes('state.courage-=1;'));
 assert.ok(app.includes('state.history.unshift({date:new Date().toISOString(),name:"Sentido Elemental · "+target'));
 assert.ok(app.includes('Solicite ao Narrador a afinidade elemental de '));
 const page=readFileSync(join(root,"../pericias/sentido-elemental.html"),"utf8");
 assert.ok(page.includes("Inteligência 3")&&page.includes("Improviso Elemental"));
});

test("Sacrifício Heroico e Escudo Refletor não criam resolução falsa de dano recebido",()=>{
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 assert.ok(srd.includes("mesmo quando seu turno não foi antecipado")&&book.includes("raio de 8 metros"));
 assert.ok(srd.includes("parcela de dano causada pelo Pavor")&&srd.includes("Pavor sem dano não gera reflexão"));
 assert.ok(book.includes("⌊Pavor mantido não anulado ÷ 2⌋"));
 assert.ok(app.includes('ownsSkill("escudo-refletor")')&&app.includes('ownsSkill("sacrificio-heroico")'));
});

test("Antimagia: quatro compras de 1 XP, requisitos completos e dependências",()=>{
 const defs=extract("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
 const reqs=extract("function skillReq(id,s=state){","function dependentsValid(");
 const owns=(id,s)=>(s.skills||[]).includes(id);
 const req=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+defs+reqs+"\nreturn skillReq;")({},()=>[],owns);
 const s=(int=4,agi=4,dex=4,skills=[])=>({
  race:"humano",attributes:{inteligencia:int,agilidade:agi,destreza:dex,forca:0,vigor:0,influencia:0},
  practices:{armas_conjuracao:1,artesao:0,atletismo:0,apresentacao:0,furtividade:0},
  knowledges:{alquimia:0,medicina:0},skills
 });
 const focus=["criar-item-foco-magia","improviso"];
 assert.match(req("cancelar-magia",s(3,4,4,focus)),/Inteligência 4/);
 assert.match(req("cancelar-magia",s(4,3,4,focus)),/Agilidade 4/);
 assert.match(req("cancelar-magia",s(4,4,3,focus)),/Destreza 4/);
 assert.match(req("cancelar-magia",s(4,4,4,["improviso"])),/Criar Item de Foco/);
 assert.match(req("cancelar-magia",s(4,4,4,["criar-item-foco-magia"])),/Improviso/);
 assert.equal(req("cancelar-magia",s(4,4,4,focus)),null);
 assert.match(req("mudanca-elemental",s(4,4,4)),/Transformação Elemental/);
 assert.match(req("mudanca-elemental",s(3,4,4,["transformacao-elemental"])),/Inteligência 4/);
 assert.match(req("mudanca-elemental",s(4,4,3,["transformacao-elemental"])),/Destreza 4/);
 assert.equal(req("mudanca-elemental",s(4,4,4,["transformacao-elemental"])),null);
 assert.match(req("desencantar",s()),/Cancelar Magia/);
 assert.match(req("espelho-magico",s()),/Cancelar Magia/);
 assert.equal(req("desencantar",s(4,4,4,["cancelar-magia"])),null);
 assert.equal(req("espelho-magico",s(4,4,4,["cancelar-magia"])),null);
 for(const id of ["cancelar-magia","mudanca-elemental","desencantar","espelho-magico"]){
  assert.match(app,new RegExp('"'+id+'",\\s*"[^"]+",[\\s\\S]*?\\n  1\\n \\]'),"Custo de "+id+" = 1 XP");
  const page=readFileSync(join(root,"../pericias/"+id+".html"),"utf8");
  assert.ok(page.includes("1 XP")&&page.includes("DEFINIDO"),"Verbete "+id);
 }
});

test("Antimagia: Codex Genético, cards e links do catálogo completos",()=>{
 const gene=readFileSync(join(root,"gene-graph.js"),"utf8");
 const index=readFileSync(join(root,"../pericias/index.html"),"utf8");
 for(const id of ["cancelar-magia","mudanca-elemental","desencantar","espelho-magico"]){
  assert.ok(gene.includes('"'+id+'"'),"Nó genético "+id);
  assert.ok(index.includes('href="'+id+'.html"'),"Link "+id);
  assert.ok(app.includes('"'+id+'":"'+id+'"'),"Permalink ficha "+id);
 }
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 for(const skill of ["Cancelar Magia","Mudança Elemental","Desencantar","Espelho Mágico"]){
  assert.ok(srd.includes(skill)&&book.includes(skill),"SRD e Livro contêm "+skill);
 }
});

test("Cancelar Magia: gatilhos Pavor, elemento conhecido, alcance e custo de 1 Coragem",()=>{
 assert.ok(app.includes('case "cancelar-magia-use"'));
 assert.ok(app.includes('if(!ownsSkill("cancelar-magia")||skillReq("cancelar-magia"))'));
 assert.ok(app.includes('.filter(([id])=>ownsSkill(id));'),"Só permite escolher elemento comprado");
 assert.ok(app.includes('if(state.pending||editMode)'),"Não permite agir durante rolagem pendente");
 assert.ok(app.includes('if(state.courage<1)'),"Valida Coragem");
 assert.ok(app.includes('const enemyDe=Number(deInput);'),"DE adversária informada");
 assert.ok(app.includes('!Number.isSafeInteger(enemyDe)||enemyDe<0'),"Valida DE");
 assert.ok(app.includes('MANTEVE ao menos um símbolo de Pavor'),"Pavor adversário mantido");
 assert.ok(app.includes('a até 8 m'),"Distância exata");
 assert.ok(app.includes('resultado ≥ "+enemyDe+"'),"Empate cancela: comparação inclusiva");
 assert.ok(app.includes('if(!confirm("Gastar 1 Coragem para TENTAR cancelar'),"Cobrança confirmada");
 assert.ok(app.includes('state.courage-=1;'),"Debita 1 Coragem");
 assert.ok(app.includes('name:"Cancelar Magia · "+elementName'),"Registra sem cancelar automaticamente");
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 assert.ok(srd.includes("todos os valores mantidos")&&srd.includes("IGUAL OU MAIOR (≥)"));
 assert.ok(srd.includes("Empate cancela"));
 assert.ok(!app.slice(app.indexOf('case "cancelar-magia-use"'),app.indexOf('case "sentido-elemental-use"')).includes("estritamente maior"));
});

test("Mudança Elemental, Desencantar e Espelho Mágico não inventam dados e pagamentos",()=>{
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const page=readFileSync(join(root,"../pericias/espelho-magico.html"),"utf8");
 assert.ok(srd.includes("criatura, armadura ou ambiente")&&srd.includes("um elemento cuja Perícia"));
 assert.ok(srd.includes("custo de ativação (não informado)"),"Custo não inventado");
 assert.ok(srd.includes("Não destruir, apagar nem remover automaticamente"),"Não destrói fichas nem itens");
 assert.ok(page.includes("passivo")||page.includes("Passivo"));
 assert.ok(page.includes("Pavor que não causaria dano"),"Não inventa dano mágico sem contribuição de Pavor");
 assert.ok(srd.includes("cumulação com **Escudo Refletor**"));
});

test("Decisões autorais: Cancelar Magia aceita empate e nunca exige vencer estritamente",()=>{
 const action=app.slice(app.indexOf('case "cancelar-magia-use"'),app.indexOf('case "sentido-elemental-use"'));
 assert.ok(action.includes("resultado ≥"),"A ação declara resultado maior OU IGUAL");
 assert.ok(action.includes("empate cancela"),"Empate anula na reação");
 assert.ok(action.includes('state.courage-=1;'),"Cobra 1 Coragem quando confirmado");
 assert.ok(!action.includes("estritamente maior")&&!action.includes("exige resultado > "));
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const page=readFileSync(join(root,"../pericias/cancelar-magia.html"),"utf8");
 const index=readFileSync(join(root,"../pericias/index.html"),"utf8");
 for(const text of [book,srd,page,index]){
  assert.ok(text.includes("Empate cancela")||text.includes("empate cancela")||text.includes("igual ou maior"),"Empate permitido em todos os canais");
 }
});

test("Decisões autorais: Mudança Elemental tem duração E − P estritamente positiva",()=>{
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 const page=readFileSync(join(root,"../pericias/mudanca-elemental.html"),"utf8");
 const index=readFileSync(join(root,"../pericias/index.html"),"utf8");
 for(const text of [app,srd,book,page,index]){
  assert.ok(text.includes("E − P"),"Fórmula E−P presente");
  assert.ok(text.includes("E − P > 0")||text.includes("E − P (>0)")||text.includes("E − P, exigindo resultado positivo"),"Fórmula requer duração positiva");
 }
 assert.ok(srd.includes("unidade de duração")||srd.includes("unidade temporal"),"Não inventa turnos/rodadas");
});

test("Decisões autorais: Desencantar remove imunidades, preserva criaturas elementais naturais",()=>{
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 const page=readFileSync(join(root,"../pericias/desencantar.html"),"utf8");
 const index=readFileSync(join(root,"../pericias/index.html"),"utf8");
 for(const text of [app,srd,book,page,index]){
  assert.ok(text.includes("elementos ou imunidades"),"Remove ambos");
  assert.ok(text.includes("natural")||text.includes("constitut"),"Exceção para criatura naturalmente feita do elemento");
 }
 assert.ok(srd.includes("não está limitado ao próprio item de foco"),"Não limita arbitrariamente o desencantamento a itens de foco");
});

test("Decisões autorais: Espelho Mágico reflete Pavor mágico antes da absorção da armadura",()=>{
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 const page=readFileSync(join(root,"../pericias/espelho-magico.html"),"utf8");
 const index=readFileSync(join(root,"../pericias/index.html"),"utf8");
 for(const text of [app,srd,book,page,index]){
  assert.ok(text.includes("mágic"),"Somente magia");
  assert.ok(text.includes("armadura"),"Regra de armadura incluída");
  assert.ok(text.includes("Pavor"),"O reflexo depende de Pavor");
 }
 assert.ok(srd.includes("Mesmo que a armadura")&&srd.includes("0 Vida"),"Reflete quando armadura bloqueia 100%");
 assert.ok(book.includes("a armadura absorve 5")&&book.includes("reflexão de 2 de dano"),"Exemplo confirma conta antes da absorção");
 assert.ok(page.includes("ataque físico")&&page.includes("antes da absorção"),"Não funciona contra ataque físico");
});

test("Maestria em Lanças e Espadas: custos de 1 XP e requisitos de atributos aprovados",()=>{
 const defs=extract("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
 const reqs=extract("function skillReq(id,s=state){","function dependentsValid(");
 const catalog=new Function(defs+"\nreturn APPROVED_WEAPON_MASTERY_PURCHASE;")();
 assert.equal(catalog["maestria-hastes"],"Força 2 + Agilidade 1 + Destreza 1");
 assert.equal(catalog["maestria-espadas"],"Força 2 + Destreza 2");
 assert.ok(app.includes("APPROVED_WEAPON_MASTERY_PURCHASE[id]?1:null"),"Compra custa 1 XP; outras não aprovadas continuam sem custo");
 assert.ok(app.includes('WEAPON_MASTERY_TYPES.some(x=>x.id===id)&&!APPROVED_WEAPON_MASTERY_PURCHASE[id]'),"Apenas Maestrias aprovadas passam bloqueio");
 const req=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[]; const SOURCE_PROPS={practice:'practices'};"+defs+reqs+"\nreturn skillReq;")({},()=>[],(id,s)=>(s.skills||[]).includes(id));
 const make=(forca,destreza,agilidade,skills=[])=>({
  race:"humano",attributes:{forca,destreza,agilidade,vigor:0,inteligencia:0,influencia:0},
  knowledges:{},practices:{armas_conjuracao:0,artesao:0,atletismo:0},skills
 });
 assert.match(req("maestria-hastes",make(1,1,1)),/Força 2/);
 assert.match(req("maestria-hastes",make(2,1,0)),/Agilidade 1/);
 assert.match(req("maestria-hastes",make(2,0,1)),/Destreza 1/);
 assert.equal(req("maestria-hastes",make(2,1,1)),null,"Compra de lanças requer só atributos; manejo é para ativação");
 assert.match(req("maestria-espadas",make(1,2,1)),/Força 2/);
 assert.match(req("maestria-espadas",make(2,1,1)),/Destreza 2/);
 assert.equal(req("maestria-espadas",make(2,2,0)),null,"Agilidade não foi exigida em espadas");
 assert.match(req("maestria-adagas",make(6,6,6)),/PENDENTES/,"Demais Maestrias seguem bloqueadas");
});

test("Maestrias Lanças e Espadas: site e SRD refletem somente as duas compras aprovadas",()=>{
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 const index=readFileSync(join(root,"../pericias/index.html"),"utf8");
 const espadas=readFileSync(join(root,"../pericias/maestria-em-espadas.html"),"utf8");
 const hastes=readFileSync(join(root,"../pericias/maestria-em-hastes.html"),"utf8");
 for(const x of [srd,book,index,espadas,hastes])assert.ok(x.includes("1 XP"),"Valor de 1 XP documentado");
 for(const x of [srd,book,hastes])assert.ok(x.includes("Força 2")&&x.includes("Agilidade 1")&&x.includes("Destreza 1"),"Lanças possui requisitos");
 for(const x of [srd,book,espadas])assert.ok(x.includes("Força 2")&&x.includes("Destreza 2"),"Espadas possui requisitos");
 assert.ok(index.includes("maestria-em-hastes.html")&&index.includes("maestria-em-espadas.html"));
 assert.ok(app.includes('maestria-hastes'),"Identificador antigo preservado");
 const hasWeightTraining=app.includes('return {leve:"armas-leves",medio:"armas-medias",pesado:"armas-pesadas"}');
 assert.ok(hasWeightTraining,"Perícia conforme peso é requisito de ativação");
 assert.ok(srd.includes("PENDENTE — custos/requisitos de compra de outras Maestrias não raciais"),"Outras continuam pendentes");
});

test("Novas doze perícias de 21/11/2026: custos 1 XP, requisitos e Bioética com segundo elemento",()=>{
 const ids=["maos-leves","pericia-armadilha","golpe-furtivo","bioetica","pesquisa-avancada-pocoes",
  "corpo-fechado","invocar-esfera-espiritual","passo-etereo","absorver-esferas",
  "disparo-esferas-espirituais","dilema","impacto-psiquico"];
 const skillsSection=extract("const SKILLS=[","const SKILL_AFFINITY=");
 for(const id of ids){
  assert.match(skillsSection,new RegExp('"'+id+'"\\s*,\\s*"[^"]+"\\s*,[\\s\\S]{1,1300}?,\\s*1\\s*\\]'),"1 XP: "+id);
 }
 const defs=extract("const WEAPON_MASTERY_TYPES=","const SKILLS=[");
 const reqs=extract("function skillReq(id,s=state){","function dependentsValid(");
 const owns=(id,s)=>(s.skills||[]).includes(id);
 const fn=new Function("state","racialGrants","ownsSkill",
  "const ADVANCED_SOURCE_DEFS=[];const SOURCE_PROPS={practice:'practices',know:'knowledges',attr:'attributes'};"+
  defs+reqs+"\nreturn skillReq;")({},()=>[],owns);
 const full={race:"humano",attributes:{forca:6,agilidade:6,destreza:6,inteligencia:6,influencia:6,vigor:6},
  knowledges:{protecao:6,alquimia:6,engenharia:6,medicina:6},practices:{armas_conjuracao:6,furtividade:6,artesao:6,atletismo:6,apresentacao:6},
  skills:["criar-item-foco-magia","sangue","vento","domar-criatura-media","improviso","artista-marcial","invocar-esfera-espiritual"]};
 for(const id of ids)assert.equal(fn(id,full),null,"Habilita compra "+id+" com requisitos satisfeitos");
 assert.match(fn("maos-leves",{...full,practices:{...full.practices,furtividade:2}}),/Furtividade 3/);
 assert.match(fn("pericia-armadilha",{...full,knowledges:{...full.knowledges,protecao:1}}),/Proteção 2/);
 assert.match(fn("golpe-furtivo",{...full,practices:{...full.practices,armas_conjuracao:1}}),/Disciplina 2/);
 assert.match(fn("pesquisa-avancada-pocoes",{...full,practices:{...full.practices,artesao:2}}),/Artesão 3/);
 assert.match(fn("corpo-fechado",{...full,skills:full.skills.filter(x=>x!=="artista-marcial")}),/Artista Marcial/);
 assert.match(fn("dilema",{...full,attributes:{...full.attributes,vigor:3}}),/Vigor 4/);
 assert.match(fn("invocar-esfera-espiritual",{...full,attributes:{...full.attributes,destreza:3}}),/Destreza 4/);
 assert.match(fn("passo-etereo",{...full,skills:full.skills.filter(x=>x!=="invocar-esfera-espiritual")}),/Invocar Esfera/);
 assert.match(fn("absorver-esferas",{...full,skills:full.skills.filter(x=>x!=="invocar-esfera-espiritual")}),/Invocar Esfera/);
 assert.match(fn("disparo-esferas-espirituais",{...full,skills:full.skills.filter(x=>x!=="invocar-esfera-espiritual")}),/Invocar Esfera/);
 assert.match(fn("impacto-psiquico",{...full,skills:full.skills.filter(x=>x!=="criar-item-foco-magia")}),/Criar Item/);
 assert.match(fn("bioetica",{...full,skills:full.skills.filter(x=>x!=="vento")}),/outra Perícia elemental/);
 assert.equal(fn("bioetica",{...full,skills:[...full.skills.filter(x=>x!=="vento"),"agua"]}),null,"Outro elemento pode ser Água, mas não apenas Sangue");
});

test("Mãos Leves e Golpe Furtivo: validação real da pilha, exceção restrita e dado da arma",()=>{
 const poolCode=extract("function buildPool(){","function renderComposer(){");
 const helper="const SOURCE_PROPS={attr:'attributes',know:'knowledges',practice:'practices'};"+
  "const key=s=>s?s.group+'.'+s.key:'';const same=(a,b)=>!!a&&!!b&&key(a)===key(b);"+
  "const ownsSkill=id=>state.skills.includes(id);const skillReq=()=>null;"+
  "const usingDiscipline=()=>draft.base?.group==='practice'&&draft.base?.key==='armas_conjuracao';"+
  "const canSecondAttribute=()=>false,mayThird=()=>false,canUseShared=()=>true;"+
  "const temporaryGradeDice=(g,n)=>Array.from({length:n},()=>g==='practice'?10:g==='attr'?6:10);"+
  "const combatItem=(item,mode)=>item?.equipped&&item.type==='arma'&&mode==='armas'?[item.die]:[];";
 const build=new Function("state","draft","NPC_MODE",helper+poolCode+"\nreturn buildPool;");
 const state={skills:["maos-leves","golpe-furtivo"],attributes:{destreza:2},knowledges:{protecao:2},
  practices:{armas_conjuracao:3,furtividade:3},items:[{id:"w",type:"arma",equipped:true,die:6}],courage:10};
 const hands={de:5,base:{group:"practice",key:"armas_conjuracao"},attribute:{group:"practice",key:"furtividade"},
  mode:"armas",third:null,maosLeves:true,stealthAttack:false,equipmentId:"",step:false,extraKeep:false};
 const ok=build(state,hands,false)();
 assert.deepEqual(ok.errors,[],"Mãos Leves pode usar duas Práticas e não exige Atributo");
 assert.equal(ok.pool.length,6,"Disciplina 3 e Furtividade 3 compõem os dados respectivos");
 assert.ok(build(state,{...hands,maosLeves:false},false)().errors.length>0,"Duas Práticas são proibidas sem Mãos Leves");
 assert.ok(build(state,{...hands,maosLeves:false},true)().errors.length>0,"Humanoides NPC não podem combinar duas Práticas");
 const monster={...hands,maosLeves:false,base:{group:"attr",key:"destreza"},attribute:{group:"attr",key:"forca"}};
 const monsterState={...state,attributes:{...state.attributes,forca:2}};
 assert.deepEqual(build(monsterState,monster,true)().errors,[],"Criaturas só de Atributos podem combinar dois Atributos");
 const melee={...hands,maosLeves:false,attribute:{group:"attr",key:"destreza"},equipmentId:"w",stealthAttack:true};
 const sneak=build(state,melee,false)(),normal=build(state,{...melee,stealthAttack:false},false)();
 assert.deepEqual(sneak.errors,[]);
 assert.equal(sneak.pool.length,normal.pool.length+1,"Um dado extra, não um Êxito fixo");
 assert.equal(sneak.pool.find(x=>x.stealthBonus)?.sides,6,"Repete dado da arma");
 const invalid=build({...state,items:[{id:"w",type:"arma",equipped:false,die:6}]},melee,false)();
 assert.ok(invalid.errors.length>0,"Não concede dado de arma desequipada");
 assert.ok(app.includes('if(pool.length>9)errors.push("A pilha ultrapassa o limite de 9 dados rolados.");'));
 assert.ok(app.includes('if(p.opts.maosLeves)'),"Valida Mãos Leves na resolução");
 assert.ok(app.includes('const damage=p.opts.maosLeves||p.cravarRemovalShieldId?0:'),"Mãos Leves não causa dano");
});

test("Poções, Corpo Fechado e Esferas: bônus, custo e persistência contextual sem invenção",()=>{
 assert.ok(app.includes('p.opts.potionResearch?1:0'),"Poções recebe +1E contextual");
 assert.ok(app.includes('data-option="potionResearch"'),"Requer confirmar contexto de criação de poções");
 assert.ok(app.includes('case "corpo-fechado-use"'),"Corpo Fechado usa 1 Coragem");
 assert.ok(app.includes('case "impacto-psiquico-use"'),"Impacto Psíquico usa 1 Coragem");
 assert.ok(app.includes('spiritualSpheres:{count:0,createdThisRound:0}'),"Contador está na ficha");
 assert.ok(app.includes('v.spiritualSpheres?.count'),"Contador persiste importação/exportação");
 assert.ok(app.includes('case "sphere-create"')&&app.includes('state.spiritualSpheres.createdThisRound=Number(state.spiritualSpheres.createdThisRound||0)+1'),"Até 5 esferas criadas por rodada");
 assert.ok(app.includes('case "sphere-next-round"'),"Liberação manual na rodada seguinte");
 assert.ok(app.includes('case "sphere-spend"')&&app.includes('state.spiritualSpheres.count=sphereCount()-1'),"Passo e Disparo gastam 1 esfera");
 assert.ok(app.includes('case "sphere-absorb"')&&app.includes('state.spiritualSpheres.count=0;'),"Absorver consome todas as esferas");
 assert.ok(app.includes('state.courage-=1;state.spiritualSpheres.count=sphereCount()+1;'),"Taxa definida: 1 Coragem = 1 Esfera");
});

test("Doze novas perícias: páginas, catálogo, requisitos genéticos e SRD",()=>{
 const ids=["maos-leves","pericia-armadilha","golpe-furtivo","bioetica","pesquisa-avancada-pocoes",
  "corpo-fechado","invocar-esfera-espiritual","passo-etereo","absorver-esferas",
  "disparo-esferas-espirituais","dilema","impacto-psiquico"];
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 const index=readFileSync(join(root,"../pericias/index.html"),"utf8");
 const gene=readFileSync(join(root,"gene-graph.js"),"utf8");
 const req=extract("const GENE_AUTO_REQUIREMENTS={","function geneAutoPlan(");
 for(const id of ids){
  const page=readFileSync(join(root,"../pericias/"+id+".html"),"utf8");
  assert.ok(page.includes("1 XP")&&page.includes("DEFINIDO")&&page.includes("PENDENTES"),"Verbeta corretamente "+id);
  assert.ok(index.includes('href="'+id+'.html"'),"Catálogo "+id);
  assert.ok(app.includes('"'+id+'":"'+id+'"'),"Permalink "+id);
  assert.ok(gene.includes('"'+id+'"'),"Constelação ou ícone "+id);
  assert.ok(req.includes('"'+id+'"'),"Nó de requisitos "+id);
 }
 assert.ok(srd.includes("Doze Perícias: Furtividade")&&book.includes("Doze Perícias"));
 assert.ok(srd.includes("3+1+1 = DE 5")&&srd.includes("3+1+2 = DE 6"));
 assert.ok(srd.includes("Punho Supremo de Asura")&&srd.includes("Disciplina em um golpe corpo a corpo")&&srd.includes("um dado já existente da pilha"));
 assert.ok(srd.includes("**DEFINIDO — Bioética (1 XP):** exige **Alquimia 3 + Inteligência 3 + Destreza 3"),"Destreza 3 confirmada pelo autor");
});

test("Esferas DEFINIDAS: 5 por rodada, teto de 5, 1 Coragem por esfera e absorção total",()=>{
 const caseCode=extract('case "sphere-create":{','case "sphere-next-round":{');
 const handler=new Function("action","state","ownsSkill","skillReq","sphereCount","maxCourage","clamp","logSkillAction","render","save","toast","confirm","editMode",
   "switch(action){"+caseCode+"default:break;}");
 const records=[];
 const state={courage:10,spiritualSpheres:{count:0,createdThisRound:0},pending:null};
 const invoke=(action)=>handler(action,state,()=>true,()=>null,()=>state.spiritualSpheres.count,
   ()=>10,(n,min,max)=>Math.max(min,Math.min(max,n)),(name,result)=>records.push([name,result]),()=>{},()=>{},()=>{},()=>true,false);
 for(let i=1;i<=5;i++){
  invoke("sphere-create");
  assert.equal(state.courage,10-i,"Cada esfera consome 1 Coragem");
  assert.equal(state.spiritualSpheres.count,i,"Armazena até 5 esferas");
  assert.equal(state.spiritualSpheres.createdThisRound,i,"Contador de criação por rodada");
 }
 invoke("sphere-create");
 assert.equal(state.spiritualSpheres.count,5,"Sexta criação da mesma rodada é bloqueada");
 assert.equal(state.courage,5,"Bloqueio não consome Coragem");
 state.spiritualSpheres.createdThisRound=0;
 invoke("sphere-create");
 assert.equal(state.spiritualSpheres.count,5,"Não ultrapassa estoque de 5 mesmo numa nova rodada");
 state.spiritualSpheres.count=4;
 invoke("sphere-create");
 assert.equal(state.spiritualSpheres.count,5,"Pode criar uma esfera após gastar outra em nova rodada");
 assert.equal(state.spiritualSpheres.createdThisRound,1);
 state.spiritualSpheres.count=5;state.courage=6;
 invoke("sphere-absorb");
 assert.equal(state.courage,10,"Recuperação respeita teto");
 assert.equal(state.spiritualSpheres.count,0,"Todas as cinco esferas são consumidas");
 assert.ok(records.some(x=>x[0]==="Absorver Esferas"));
 state.courage=10;state.spiritualSpheres.count=2;
 invoke("sphere-absorb");
 assert.equal(state.courage,10,"Não ultrapassa teto");
 assert.equal(state.spiritualSpheres.count,0,"Mesmo no teto de Coragem, absorção consome todas");
 assert.ok(app.includes('count:clamp(Math.floor(v.spiritualSpheres?.count||0),0,5)'),"Importação limita armazenamento a 5");
 assert.ok(app.includes('typeof v.spiritualSpheres?.createdThisRound==="boolean"'),"Migração das fichas antigas");
});

test("Punho Supremo de Asura transforma exatamente um dado em d20 e exige cinco esferas",()=>{
 const poolCode=extract("function buildPool(){","function renderComposer(){");
 const helper="const SOURCE_PROPS={attr:'attributes',know:'knowledges',practice:'practices'};"+
   "const key=s=>s?s.group+'.'+s.key:'';const same=(a,b)=>!!a&&!!b&&key(a)===key(b);"+
   "const ownsSkill=id=>state.skills.includes(id);const skillReq=()=>null;"+
   "const sphereCount=()=>state.spiritualSpheres.count;"+
   "const usingDiscipline=()=>draft.base?.group==='practice'&&draft.base?.key==='armas_conjuracao';"+
   "const canSecondAttribute=()=>false,mayThird=()=>false,canUseShared=()=>true;"+
   "const temporaryGradeDice=(g,n)=>Array.from({length:n},()=>g==='practice'?10:g==='attr'?6:10);"+
   "const combatItem=(item,mode)=>item?.equipped&&item.type==='arma'&&mode==='armas'?[item.die]:[];";
 const factory=new Function("state","draft","NPC_MODE",helper+poolCode+"\nreturn buildPool;");
 const state={skills:["invocar-esfera-espiritual"],spiritualSpheres:{count:5},attributes:{destreza:2},
   knowledges:{},practices:{armas_conjuracao:2},items:[],courage:10};
 const draft={base:{group:"practice",key:"armas_conjuracao"},attribute:{group:"attr",key:"destreza"},
   mode:"armas",third:null,de:3,asura:true,asuraDieId:"practice.armas_conjuracao:0",
   equipmentId:"",extraKeep:false,step:false,shieldThrowId:"",cravarRemovalShieldId:"",maosLeves:false,
   shieldRaise:false,potionResearch:false,magicElement:""};
 const normal=factory(state,{...draft,asura:false},false)();
 const converted=factory(state,draft,false)();
 assert.deepEqual(converted.errors,[],"Disciplina corpo a corpo com 5 esferas permite Asura");
 assert.equal(converted.pool.length,normal.pool.length,"Não acrescenta décimo dado");
 assert.equal(converted.pool.filter(x=>x.sides===20&&x.asuraSpecial).length,1,"Um dado convertido em d20");
 assert.equal(converted.pool.find(x=>x.asuraSpecial).baseSides,10,"Dado original preservado para identificação");
 assert.ok(factory({...state,spiritualSpheres:{count:4}},draft,false)().errors.length>0,"Quatro esferas não bastam");
 assert.ok(factory({...state,courage:0},draft,false)().errors.length>0,"Asura exige 1 Coragem além das cinco esferas");
 assert.ok(factory({...state,spiritualSpheres:{count:5,createdThisRound:5}},draft,false)().errors.length>0,"Asura não pode ser executado na rodada em que criou as esferas");
 assert.deepEqual(factory({...state,spiritualSpheres:{count:5,createdThisRound:0}},draft,false)().errors,[],"Asura pode ser executado na rodada seguinte");
 assert.ok(factory(state,{...draft,mode:"conjuracao"},false)().errors.length>0,"Asura não funciona como magia à distância");
 const rangeState={...state,items:[{id:"r",type:"arma",equipped:true,range:12,die:6,properties:["À Distância"]}]};
 assert.ok(factory(rangeState,{...draft,equipmentId:"r"},false)().errors.length>0,"Arma à distância não habilita Asura");
 const start=app.indexOf("function finalize(){");const source=app.slice(start,app.indexOf("\nfunction ",start+1));
 assert.ok(source.includes("state.spiritualSpheres.count=sphereCount()-5"),"Finalização consome 5 esferas");
 assert.ok(app.includes("health.coragem+Number(!!p.shieldThrowId)+Number(!!p.opts.asura)"),"Asura adiciona 1 Coragem ao custo de resolução");
 assert.ok(source.includes("state.courage=clamp(state.courage-s.courageCost"),"Finalização desconta Coragem após validar custo");
 assert.ok(source.includes("asuraCourageSpent:p.opts.asura?1:0"),"Histórico registra 1 Coragem de Asura");
 assert.ok(source.includes("asuraD20Face:p.opts.asura?"),"Histórico registra a face do d20");
 assert.ok(!source.includes("asuraDamageProportional:"),"Não registra pacote de dano adicional de Asura");
 assert.ok(app.includes('damageNature:p.opts.asura?"neutro"'),"Natureza do dano de Asura é sempre neutra");
 assert.ok(app.includes('p.characteristic==="Elemental"||p.secondCharacteristic==="Elemental"'),"Asura bloqueia característica Elemental");
 assert.ok(app.includes("const damageBasic=success?E+Math.floor(P/2):0"),"D20 contribui ao dano básico normal");
 assert.ok(app.includes("for(const d of dice){const f=face(d.sides,d.face);"),"D20 mantido conta para E, A, P da mesma rolagem");
 const faces=app.match(/20:\[([^\n]+)\]/);
 assert.ok(faces&&faces[1].endsWith("[8,0,0]"),"Face 20 contém 8 Êxitos");
 assert.ok(source.includes("state.spiritualSpheres.createdThisRound>0"),"Finalização impede ataque no turno de invocação");
 assert.ok(source.includes("if(!p||s.errors.length)"),"Não consome se a rolagem é inválida");
 assert.ok(app.includes("d20")&&app.includes("asuraDieId"),"Permite escolher o dado a substituir");
});

test("Bioética: Destreza 3 e ficha separada, sem atribuir Atributos não definidos",()=>{
 const srd=readFileSync(join(root,"../docs/srd-playtest-nivel-1-v1.0.md"),"utf8");
 const book=readFileSync(join(root,"../docs/livro-do-jogador.md"),"utf8");
 const page=readFileSync(join(root,"../pericias/bioetica.html"),"utf8");
 const index=readFileSync(join(root,"../pericias/index.html"),"utf8");
 for(const text of [srd,book,page,index]){
  assert.ok(text.includes("Destreza 3"),"Destreza 3 confirmado");
  assert.ok(text.toLowerCase().includes("ficha própria"),"Cada homúnculo possui ficha própria");
 }
 assert.ok(app.includes('href="../criar-conflito/"'),"Criador oferece caminho para ficha separada de criatura");
 assert.ok(srd.includes("não gera uma criatura automaticamente"),"Não inventa estatísticas do homúnculo");
 assert.ok(srd.includes("a mesma já definida para criaturas companheiras de Domar Criaturas"),"Progressão é a de Domar Criaturas");
 assert.ok(srd.includes("sangue e tecidos vivos")&&srd.includes("XP total atual do personagem criador"),"Materiais e proporcionalidade definidos");
 assert.ok(srd.includes("O mesmo d20, se mantido")&&srd.includes("sempre causa dano neutro"),"Um d20 para atingir DE e calcular dano neutro, sem segundo dano");
});
