/* Modelos de dados do protótipo Codex RPG Foundry v14. */
const F=foundry.data.fields;
const grade=()=>new F.NumberField({required:true,integer:true,min:0,max:6,initial:0});
const t=()=>new F.StringField({required:true,initial:""});
const nn=(i=0)=>new F.NumberField({required:true,integer:true,min:0,initial:i});
function grades(keys){return new F.SchemaField(Object.fromEntries(keys.map(k=>[k,grade()])));}
const schema=(monster=false,animal=false,monsterHumanoid=false,hostile=false)=>({
 level:new F.NumberField({required:true,integer:true,min:1,max:20,initial:1}),
 concept:t(),origin:new F.StringField({required:true,initial:monster||animal?"Criatura":"Humano"}),
 race:t(),pureElement:t(),runeElements:new F.ArrayField(t(),{initial:[]}),
 racialInitialAttributes:new F.ArrayField(t(),{initial:[]}),perseverancaUsed:new F.BooleanField({initial:false}),
 runeShieldFreeUsed:new F.BooleanField({initial:false}),
 spiritualSpheres:new F.SchemaField({count:new F.NumberField({integer:true,min:0,max:5,initial:0}),
  createdThisRound:new F.NumberField({integer:true,min:0,max:5,initial:0}),round:t()}),
 virtue:t(),personality:t(),notes:t(),abilities:t(),leader:new F.BooleanField({initial:false}),bodySize:new F.StringField({initial:'medio'}),
 attributes:grades(["forca","agilidade","destreza","inteligencia","influencia","vigor"]),
 knowledges:grades(["protecao","astronomia","medicina","alquimia","engenharia","erudicao"]),
 practices:grades(["armas_conjuracao","atletismo","furtividade","artesao","apresentacao","coleta"]),
 skills:new F.ArrayField(new F.StringField({required:true}),{required:true,initial:[]}),
 life:new F.SchemaField({value:nn(4),medical:new F.BooleanField({initial:false})}),
 companion:new F.SchemaField({name:t(),species:t(),present:new F.BooleanField({initial:false})}),
 courage:nn(hostile?0:10),pp:nn(0),xp:nn(0),creationBudget:nn(15),transformation:new F.ObjectField({initial:{}}),
 threatGrade:new F.NumberField({required:true,integer:true,min:1,max:6,initial:1}),
 pavorLocal:nn(0),animalRules:new F.BooleanField({initial:animal}),monsterHumanoidRules:new F.BooleanField({initial:monsterHumanoid}),monsterRules:new F.BooleanField({initial:monster}),
 status:new F.SchemaField({sangramento:new F.BooleanField({initial:false}),envenenado:new F.BooleanField({initial:false}),hidden:new F.BooleanField({initial:false}),note:t()})
});
class HistoricalFormationData extends foundry.abstract.TypeDataModel {
 static migrateData(source){
  const complete=['level','attributes','knowledges','practices','life','xp'].every(key=>Object.hasOwn(source,key));
  if(complete&&!Object.hasOwn(source,'creationBudget'))source.creationBudget=20;
  return super.migrateData(source);
 }
}
export class CodexCharacterData extends HistoricalFormationData {static defineSchema(){return schema(false);}}
export class CodexHumanoidData extends HistoricalFormationData {static defineSchema(){return schema(false,false,false,true);}}
export class CodexAnimalData extends foundry.abstract.TypeDataModel {static defineSchema(){return schema(false,true,false,true);}}
export class CodexMonsterHumanoidData extends foundry.abstract.TypeDataModel {static defineSchema(){return schema(false,false,true,true);}}
export class CodexMonsterData extends foundry.abstract.TypeDataModel {static defineSchema(){return schema(true,false,false,true);}}
export class CodexEquipmentData extends foundry.abstract.TypeDataModel {
 static defineSchema(){return{
  kind:new F.StringField({required:true,initial:"weapon"}),
  grade:new F.NumberField({required:true,integer:true,min:1,max:7,initial:1}),
  weight:new F.NumberField({required:true,min:0,initial:0.125}),
  quantity:new F.NumberField({required:true,integer:true,min:0,initial:1}),
  equipped:new F.BooleanField({initial:false}),
  integrity:new F.SchemaField({value:nn(0),max:nn(0)}),
  durability:new F.SchemaField({value:nn(0),max:nn(0)}),
  description:t(),category:new F.StringField({required:true,initial:"leve"}),
  die:new F.NumberField({required:true,integer:true,initial:0}),
  range:nn(1),priceVT:nn(0),
  properties:new F.ArrayField(new F.StringField(),{required:true,initial:[]}),
  ammo:new F.SchemaField({value:nn(0),max:nn(0),reload:nn(0),cartucho:t()}),
  focusCharges:new F.NumberField({integer:true,min:0,nullable:true,initial:null}),
  element:t(),catalogId:t(),associatedEquipment:t(),embeddedWeapon:t(),packSize:nn(0),storageCapacity:nn(0)
 };}
}
export class CodexSkillData extends foundry.abstract.TypeDataModel {
 static defineSchema(){return {
  canonicalId:t(),description:t(),xpCost:nn(0),costPending:new F.BooleanField({initial:false}),
  requirements:new F.ArrayField(new F.ArrayField(new F.StringField()),{initial:[]}),
  grades:new F.ArrayField(new F.NumberField({integer:true,min:1,max:6}),{initial:[]}),
  family:t(),state:t(),source:t(),sourceCommit:t(),automation:t(),effects:new F.ArrayField(new F.ObjectField(),{initial:[]})
 };}
}
