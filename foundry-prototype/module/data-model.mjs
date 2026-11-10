/* Dados persistentes mínimos. Resultados de rolagem NÃO são estatísticas do Actor. */
const F=foundry.data.fields;
const grade=()=>new F.NumberField({required:true,integer:true,min:0,max:6,initial:0});
const text=()=>new F.StringField({required:true,initial:""});
const nonneg=(initial=0)=>new F.NumberField({required:true,integer:true,min:0,initial});
function gradeGroup(keys){return new F.SchemaField(Object.fromEntries(keys.map(k=>[k,grade()])));}
export class CodexCharacterData extends foundry.abstract.TypeDataModel {
 static defineSchema(){return {
   level:new F.NumberField({required:true,integer:true,min:1,max:20,initial:1}),
   concept:text(),origin:new F.StringField({required:true,initial:"Humano"}),
   virtue:text(),personality:text(),notes:text(),
   attributes:gradeGroup(["forca","agilidade","destreza","inteligencia","influencia","vigor"]),
   knowledges:gradeGroup(["protecao","astronomia","medicina","alquimia","engenharia","erudicao"]),
   practices:gradeGroup(["armas_conjuracao","atletismo","furtividade","artesao","apresentacao","coleta"]),
   skills:new F.ArrayField(new F.StringField({required:true}),{required:true,initial:[]}),
   life:new F.SchemaField({value:nonneg(3),medical:new F.BooleanField({initial:false})}),
   courage:nonneg(10),pp:nonneg(0),xp:nonneg(0),
   status:new F.SchemaField({hidden:new F.BooleanField({initial:false}),note:text()})
 };}
}
export class CodexEquipmentData extends foundry.abstract.TypeDataModel {
 static defineSchema(){return {
   kind:new F.StringField({required:true,initial:"weapon"}),
   grade:new F.NumberField({required:true,integer:true,min:0,max:7,initial:1}),
   weight:new F.NumberField({required:true,min:0,initial:0.5}),
   quantity:new F.NumberField({required:true,integer:true,min:1,initial:1}),
   equipped:new F.BooleanField({initial:false}),
   integrity:new F.SchemaField({value:nonneg(0),max:nonneg(0)}),
   description:text()
 };}
}
