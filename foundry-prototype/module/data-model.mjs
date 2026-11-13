/* Modelos de dados do protótipo Codex RPG Foundry v14. */
const F=foundry.data.fields;
const grade=()=>new F.NumberField({required:true,integer:true,min:0,max:6,initial:0});
const t=()=>new F.StringField({required:true,initial:""});
const nn=(i=0)=>new F.NumberField({required:true,integer:true,min:0,initial:i});
function grades(keys){return new F.SchemaField(Object.fromEntries(keys.map(k=>[k,grade()])));}
const schema=(monster=false)=>({
 level:new F.NumberField({required:true,integer:true,min:1,max:20,initial:1}),
 concept:t(),origin:new F.StringField({required:true,initial:monster?"Criatura":"Humano"}),
 virtue:t(),personality:t(),notes:t(),
 attributes:grades(["forca","agilidade","destreza","inteligencia","influencia","vigor"]),
 knowledges:grades(["protecao","astronomia","medicina","alquimia","engenharia","erudicao"]),
 practices:grades(["armas_conjuracao","atletismo","furtividade","artesao","apresentacao","coleta"]),
 skills:new F.ArrayField(new F.StringField({required:true}),{required:true,initial:[]}),
 life:new F.SchemaField({value:nn(3),medical:new F.BooleanField({initial:false})}),
 courage:nn(10),pp:nn(0),xp:nn(0),
 threatGrade:new F.NumberField({required:true,integer:true,min:1,max:6,initial:1}),
 pavorLocal:nn(0),monsterRules:new F.BooleanField({initial:monster}),
 status:new F.SchemaField({hidden:new F.BooleanField({initial:false}),note:t()})
});
export class CodexCharacterData extends foundry.abstract.TypeDataModel {static defineSchema(){return schema(false);}}
export class CodexHumanoidData extends foundry.abstract.TypeDataModel {static defineSchema(){return schema(false);}}
export class CodexMonsterData extends foundry.abstract.TypeDataModel {static defineSchema(){return schema(true);}}
export class CodexEquipmentData extends foundry.abstract.TypeDataModel {
 static defineSchema(){return{
  kind:new F.StringField({required:true,initial:"weapon"}),
  grade:new F.NumberField({required:true,integer:true,min:1,max:7,initial:1}),
  weight:new F.NumberField({required:true,min:0,initial:0.125}),
  quantity:new F.NumberField({required:true,integer:true,min:1,initial:1}),
  equipped:new F.BooleanField({initial:false}),
  integrity:new F.SchemaField({value:nn(0),max:nn(0)}),
  durability:new F.SchemaField({value:nn(0),max:nn(0)}),
  description:t(),category:new F.StringField({required:true,initial:"leve"}),
  die:new F.NumberField({required:true,integer:true,initial:0}),
  range:nn(1),priceVT:nn(0),
  properties:new F.ArrayField(new F.StringField(),{required:true,initial:[]}),
  ammo:new F.SchemaField({value:nn(0),max:nn(0),reload:nn(0),cartucho:t()}),
  element:t()
 };}
}
