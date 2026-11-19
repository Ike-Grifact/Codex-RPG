import {G1_CATALOG as CATALOG} from "./catalog.mjs";
export const EQUIPMENT_FAMILIES=[
 ["all","Todos os tipos"],["espadas","Espadas"],["adagas","Adagas e facas"],
 ["martelos","Martelos e maças"],["machados","Machados"],["hastes","Lanças e hastes"],
 ["cajados","Cajados e bastões"],["distancia","Longo alcance"],
 ["fogo","Armas de fogo"],["arremesso","Arremesso"],["punhos","Luvas e punhos"],
 ["armas-outros","Outras armas"],["armadura","Armaduras"],["escudo","Escudos"],
 ["foco","Focos"],["ammunition","Munições"],["container","Aljavas e estojos"],
 ["instrument","Instrumentos"],["kit","Kits"],["adventurer","Aventureiro"],["outro","Outros"]
];
export const EQUIPMENT_WEIGHT_OPTIONS=[
 ["all","Todos os pesos"],["muito_leve","Muito leve"],["leve","Leve"],
 ["medio","Médio"],["pesado","Pesado"],["extremo","Muito pesado"],["pendente","Pendente"]
];
export function equipmentFamily(item){
 const catalogRow=item.catalogId?CATALOG.find(x=>x.name===item.catalogId):null;
 const kind=item.kind||catalogRow?.kind||item.type||"";
 const n=String(item.name||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
 if(kind==="firearm"||item.firearm)return "fogo";
 if(kind==="armor"||kind==="armadura")return "armadura";
 if(kind==="shield"||kind==="escudo")return "escudo";
 if(kind==="focus"||kind==="foco")return "foco";
 if(["ammunition","container","instrument","kit","adventurer"].includes(kind))return kind;
 if(kind!=="weapon"&&kind!=="arma")return "outro";
 if(/arco|besta|zarabatana/.test(n)||(item.properties||[]).includes("À Distância"))return "distancia";
 if(/espada|katana|montante/.test(n))return "espadas";
 if(/martelo|marreta|maca|clava/.test(n))return "martelos";
 if(/machado|machadinha/.test(n))return "machados";
 if(/lanca|azagaia|naginata|alabarda/.test(n))return "hastes";
 if(/cajado|bastao/.test(n))return "cajados";
 if(/faca|adaga|punhal|kunai|shuriken/.test(n))return "adagas";
 if(/luva|manopla|soqueira|punho/.test(n))return "punhos";
 if(/arremesso|dardo/.test(n))return "arremesso";
 return "armas-outros";
}
export function equipmentWeight(item){
 const c=String(item.category||"").replace(/-/g,"_");
 if(c==='muito_pesado')return 'extremo';
 if(c==='pendente')return 'pendente';
 if(["muito_leve","leve","medio","pesado","extremo"].includes(c))return c;
 if(item.weight==="muito_leve")return "muito_leve";
 if(item.weight==="leve")return "leve";
 if(item.weight==="medio")return "medio";
 if(item.weight==="alto")return "pesado";
 if(item.weight==="extremo")return "extremo";
 return "leve";
}
export function equipmentGroupName(id){return EQUIPMENT_FAMILIES.find(x=>x[0]===id)?.[1]||"Outros";}
export function equipmentWeightName(id){return EQUIPMENT_WEIGHT_OPTIONS.find(x=>x[0]===id)?.[1]||"Leve";}
export function equipmentMatches(item,family,weight){
 return (family==="all"||equipmentFamily(item)===family)&&
  (weight==="all"||equipmentWeight(item)===weight);
}
export function equipmentDetails(item){
 const kind=item.kind||item.type;
 const weight=equipmentWeightName(equipmentWeight(item));
 const p=item.properties||[];
 const info=[weight];
 if(item.die>0)info.push("d"+item.die+" com Perícia");
 if(kind==="armor"||kind==="armadura"){
  info.push("Integridade "+(item.integrity?.max??item.max??0));
  info.push(({muito_leve:"+2 DE",leve:"+1 DE",medio:"0 DE",pesado:"−1 DE",extremo:"−2 DE"})[equipmentWeight(item)]||"DE a conferir");
 }else if(kind==="shield"||kind==="escudo")info.push("Integridade "+(item.integrity?.max??item.max??0));
 if(item.range>0)info.push("Alcance "+item.range+" m");
 if(p.length)info.push(p.join(" · "));
 return info.join(" · ");
}
