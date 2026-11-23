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
 return grade===4?6-charges:grade-charges;
}

export function spellPlan(actor,input){
 const {system}=actor;
 const focusId=input.focusId??input.equipmentId??"";
 const focus=actor.items.get(focusId);
 const element=input.element||(!Object.hasOwn(input,"focusId")&&focus?focusElement(focus):"");
 const grade=input.magicGrade??1,charges=input.magicCharges??0,amplify=input.magicAmplify===true;
 const shield=input.runeShield===true;
 if(![1,2,3,4].includes(grade))throw Error("Escolha um Grau de G1 a G4.");
 if(!availableElements(system).some(([id])=>id===element))throw Error("Escolha um elemento ou um foco habilitado.");
 if(focusId&&!compatibleFoci(actor,element).some(item=>item.id===focusId))throw Error("O foco deve corresponder ao elemento.");
 const secondElement=grade===4?input.magicSecondElement:"";
 const secondFocusId=grade===4?(input.magicSecondFocusId??""):"";
 const secondFocus=actor.items.get(secondFocusId);
 if(grade===4&&(!secondElement||element===secondElement||!availableElements(system).some(([id])=>id===secondElement)))
  throw Error("G4 exige duas magias G3 habilitadas de elementos distintos.");
 if(secondFocusId&&!compatibleFoci(actor,secondElement).some(item=>item.id===secondFocusId))
  throw Error("O segundo foco deve corresponder ao segundo elemento.");
 const maxCharges={1:0,2:1,3:2,4:3}[grade];
 if(!Number.isInteger(charges)||charges<0||charges>maxCharges||
    charges>0&&(!focus||charges>focusCharges(focus)||grade===4&&(!secondFocus||charges>focusCharges(secondFocus))))
  throw Error("Confira as cargas dos focos compatíveis para acelerar a magia.");
 if(amplify&&!focus)throw Error("A amplificação exige um foco compatível.");
 if(shield&&(!isRuna(system)||element==="psiquico"||grade!==1))throw Error("O Escudo Rúnico usa um elemento habilitado no teste básico.");
 const turns=magicTiming(grade,charges);
 if(grade>1&&input.magicGradeConfirmed!==true)throw Error("Confirme o acesso ao efeito e ao Grau da magia.");
 const pathMeters=input.magicPathMeters??0;
 if(!Number.isFinite(pathMeters)||pathMeters<0||pathMeters>0&&(element!=="vento"||pathMeters>[4,8,16,16][grade-1]))
  throw Error("Confira a distância total da trajetória de Ar para este Grau.");
 const courage=(grade===4?2:Number(grade===3))+Number(amplify)+Number(shield&&system.runeShieldFreeUsed===true);
 return {element,secondElement,focusId,secondFocusId,grade,charges,amplify,turns,courage,shield,pathMeters};
}

export function runeBarrier(e,p){
 const pairs=Math.floor(p/2);
 return {e:e+pairs,p:p%2,de:e+pairs+p%2,integrity:e+pairs+p%2};
}
