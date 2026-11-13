/* Ficha mínima de equipamento nativa para Foundry 14. */
export class CodexEquipmentSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2){
 static DEFAULT_OPTIONS={classes:["codex-rpg","codex-item-sheet"],window:{resizable:true},position:{width:550,height:590}};
 static PARTS={body:{template:"systems/codex-rpg-foundry/templates/equipment-sheet.hbs"}};
 async _prepareContext(options){
  const ctx=await super._prepareContext(options);
  const s=this.item.system;
  ctx.equipment={
   name:this.item.name,img:this.item.img,kind:s.kind,grade:s.grade,weight:s.weight,
   quantity:s.quantity,equipped:s.equipped,category:s.category,die:s.die,range:s.range,priceVT:s.priceVT,element:s.element,properties:s.properties.join(", "),ammo:s.ammo, durability:s.durability.value,durabilityMax:s.durability.max,
   categoryLeve:s.category==="leve",categoryMedio:s.category==="medio",categoryPesado:s.category==="pesado",categoryMuitoLeve:s.category==="muito-leve",
   integrity:s.integrity.value,integrityMax:s.integrity.max,description:s.description,
   types:[
    {key:"weapon",label:"Arma",selected:s.kind==="weapon"},
    {key:"firearm",label:"Arma de Fogo",selected:s.kind==="firearm"},
    {key:"armor",label:"Armadura",selected:s.kind==="armor"},
    {key:"shield",label:"Escudo",selected:s.kind==="shield"},
    {key:"focus",label:"Foco",selected:s.kind==="focus"},
    {key:"tool",label:"Ferramenta",selected:s.kind==="tool"},
    {key:"misc",label:"Diversos",selected:s.kind==="misc"}
   ]
  };
  return ctx;
 }
 async _onRender(context,options){
  await super._onRender(context,options);
  const part=this.element?.querySelector(".codex-equipment-root");
  part?.addEventListener("change",async event=>{
   if(!this.item.isOwner)return;
   const input=event.target,path=input.dataset.field;
   const fields=["name","system.kind","system.grade","system.weight","system.quantity",
    "system.equipped","system.integrity.value","system.integrity.max","system.description",
    "system.category","system.die","system.range","system.priceVT","system.element","system.properties",
    "system.ammo.value","system.ammo.max","system.ammo.reload","system.ammo.cartucho","system.durability.value","system.durability.max"];
   if(!fields.includes(path))return;
   let val=input.type==="checkbox"?input.checked:input.value;
   if(["system.grade","system.quantity","system.integrity.value","system.integrity.max","system.weight","system.die","system.range","system.priceVT","system.ammo.value","system.ammo.max","system.ammo.reload","system.durability.value","system.durability.max"].includes(path)){
     val=Math.max(0,Number(val)||0);
     if(path==="system.grade")val=Math.min(7,Math.floor(val));
     if(path==="system.quantity")val=Math.max(1,Math.floor(val));
     if(path.includes("integrity"))val=Math.floor(val);
   }
   if(path==="system.properties")val=String(val).split(",").map(x=>x.trim()).filter(Boolean);
   await this.item.update({[path]:val});
  });
 }
}
