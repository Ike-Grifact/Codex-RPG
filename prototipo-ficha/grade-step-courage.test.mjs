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
 assert.match(html,/app\.js\?v=20261119-vitals-v1/);
});

test("Ficha mantém sete recursos com explicação contextual e rolador acima do repertório",()=>{
 const resources=["life","courage","defense","integrity","balance","load","movement"];
 for(const resource of resources){
  assert.match(html,new RegExp('data-vital-open="'+resource+'"'),"Sem cartão "+resource);
 }
 assert.match(html,/id="fp-vital-tooltip"/);
 assert.ok(html.indexOf('id="composer-panel"')<html.indexOf('id="play-talents"'),
  "A preparação precisa aparecer antes do repertório");
 assert.ok(app.includes("function vitalHelpDetails(kind)"));
 assert.ok(app.includes("function toggleVitalTooltip(button)"));
 const css=readFileSync(join(root,"styles.css"),"utf8");
 for(const icon of ["coragem","movimento","peso"]){
  assert.ok(css.includes("status-"+icon+".svg"),"CSS sem ícone "+icon);
  assert.match(readFileSync(join(root,"../assets/icons/codex/status-"+icon+".svg"),"utf8"),/<svg /);
 }
});
