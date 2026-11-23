import {escapeHTML} from "./roll-engine.mjs";

export const formatLoad=value=>new Intl.NumberFormat("pt-BR",{maximumFractionDigits:4}).format(value);
const formatPercent=new Intl.NumberFormat("pt-BR",{maximumFractionDigits:2});

export function loadCaption(load){
 return formatLoad(load.used)+" / "+formatLoad(load.capacity)+" Alto · "+formatPercent.format(load.percent)+"% · "+load.balance;
}

function purchaseCaption(load){
 return "Carga atual "+formatLoad(load.before)+" / "+formatLoad(load.capacity)+" Alto. Itens +"+
  formatLoad(load.added)+" Alto · recursos gastos −"+formatLoad(load.spent)+" Alto. Após a compra: "+loadCaption(load)+".";
}

const warning=load=>load.overloaded?"A compra excede a capacidade de carga.":
 "A carga ficará "+load.balance.toLowerCase()+".";

export function renderPurchasePreview(output,load,error=""){
 output.hidden=!load&&!error;
 output.classList.toggle("codex-warning",Boolean(load?.warning));
 output.textContent=load?purchaseCaption(load)+(load.warning?" "+warning(load):""):error;
}

export function confirmPurchase({entry,load}){
 return foundry.applications.api.DialogV2.confirm({
  window:{title:"Comprar equipamento"},
  content:"<p>"+entry.quantity+" × "+escapeHTML(entry.name)+" · "+entry.total+" VT</p>"+
   "<p>"+purchaseCaption(load)+"</p>"+(load.warning?'<p class="codex-warning"><strong>'+warning(load)+"</strong></p>":""),
  yes:{label:"Confirmar compra"},no:{label:"Cancelar"},rejectClose:false
 });
}
