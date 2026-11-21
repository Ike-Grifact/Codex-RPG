import {hasSkill,isRuna} from "./races.mjs";

export const ELEMENTS = [
 ["psiquico","Psíquico"],["vento","Ar"],["agua","Água"],["terra","Terra"],["fogo","Fogo"],
 ["sagrado","Sagrado"],["sangue","Sangue"],["trevas","Trevas"],["veneno","Veneno"],
];

export function availableElements(system){
 return ELEMENTS.filter(([id])=>hasSkill(system,id==="psiquico"?"criar-item-foco-magia":id));
}

export function focusElement(item){
 const raw=String(item?.system.element||"psiquico").normalize("NFD").replace(/\p{M}/gu,"").trim().toLowerCase();
 return {ar:"vento",psique:"psiquico"}[raw]??raw;
}

export function focusCharges(item){
 const grade=item?.system.grade??1;
 return Math.max(0,Math.min(grade,item?.system.focusCharges??grade));
}

export function compatibleFoci(actor,element){
 if(!hasSkill(actor.system,"criar-item-foco-magia"))return [];
 return [...actor.items.values()].filter(item=>item.system.kind==="focus"&&focusElement(item)===element);
}

export function magicTiming(grade,charges){
 return grade<=2?grade:3-charges;
}

export function spellPlan(actor,input){
 const {system}=actor;
 const focusId=input.focusId??input.equipmentId??"";
 const focus=actor.items.get(focusId);
 const element=input.element||(!Object.hasOwn(input,"focusId")&&focus?focusElement(focus):"");
 const grade=input.magicGrade??1,charges=input.magicCharges??0,amplify=input.magicAmplify===true;
 const shield=input.runeShield===true;
 if(![1,2,3].includes(grade))throw Error("Escolha um Grau de G1 a G3.");
 if(!availableElements(system).some(([id])=>id===element))throw Error("Escolha um elemento ou um foco habilitado.");
 if(focusId&&!compatibleFoci(actor,element).some(item=>item.id===focusId))throw Error("O foco deve corresponder ao elemento.");
 if(!Number.isInteger(charges)||charges<0||charges>2||charges>0&&(grade!==3||!focus||charges>focusCharges(focus)))
  throw Error("Somente G3 pode gastar até duas cargas de um foco compatível.");
 if(amplify&&!focus)throw Error("A amplificação exige um foco compatível.");
 if(shield&&(!isRuna(system)||element==="psiquico"||grade!==1))throw Error("O Escudo Rúnico usa um elemento habilitado no teste básico.");
 const turns=magicTiming(grade,charges);
 if(grade>1&&input.magicGradeConfirmed!==true)throw Error("Confirme o acesso ao efeito e ao Grau da magia.");
 if(turns>1&&input.magicTimeConfirmed!==true)throw Error("Confirme que os turnos de preparação foram cumpridos.");
 const pathMeters=input.magicPathMeters??0;
 if(!Number.isFinite(pathMeters)||pathMeters<0||pathMeters>0&&(element!=="vento"||pathMeters>[4,8,16][grade-1]))
  throw Error("Confira a distância total da trajetória de Ar para este Grau.");
 const courage=Number(grade===3)+Number(amplify)+Number(shield&&system.runeShieldFreeUsed===true);
 return {element,focusId,grade,charges,amplify,turns,courage,shield,pathMeters};
}

export function runeBarrier(e,p){
 const pairs=Math.floor(p/2);
 return {e:e+pairs,p:p%2,de:e+pairs+p%2,integrity:e+pairs+p%2};
}
