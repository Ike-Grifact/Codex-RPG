import {skillDetails} from './advancement.mjs';
import {bardEffectItem,bardMasteryId,bardRepertoire} from './bard.mjs';
import {SKILLS} from './skill-catalog.mjs';
export class CodexSkillSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2){
 get title(){return this.item&&bardEffectItem(this.item)?'Histórico do Bardo · '+this.item.name:this.item?.name??'Perícia';}
 static DEFAULT_OPTIONS={classes:['codex-rpg','codex-skill-sheet'],position:{width:620,height:680},window:{resizable:true}};
 static PARTS={body:{template:'systems/codex-rpg-foundry/templates/skill-sheet.hbs'}};
 async _prepareContext(options){
  const context=await super._prepareContext(options);
  const row=SKILLS.some(row=>row.id===this.item.system.canonicalId)?skillDetails({attributes:{},knowledges:{},practices:{},skills:[],xp:0},this.item.system.canonicalId):{alternatives:[]};
  const history=bardEffectItem(this.item);
  const repertoire=this.item.system.canonicalId===bardMasteryId?bardRepertoire:null;
  return {...context,history,repertoire,
   skill:{name:this.item.name,...this.item.system.toObject(),requirementLabels:row.alternatives.map(branch=>branch.map(req=>req.name).join(' + '))},
   purchaseNote:repertoire?'Aquisição pendente. Os efeitos são opções internas da Maestria.':'Aquisição pelo Codex Genético ou pela ficha do personagem.'};
 }
}
