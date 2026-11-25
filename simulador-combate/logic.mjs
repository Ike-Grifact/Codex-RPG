/* Simulador tático — geometria e estados sem alterar as regras do Codex.
   Cada célula = 1 m é HIPÓTESE de visualização, não a escala homologada para diagonais. */
export const WIDTH=20,HEIGHT=12,MAX_TOKENS=36;
export const cellKey=(x,y)=>x+","+y;
export const inBounds=(x,y)=>Number.isInteger(x)&&Number.isInteger(y)&&x>=0&&x<WIDTH&&y>=0&&y<HEIGHT;
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function tileAt(terrain,x,y){return terrain[cellKey(x,y)]||"livre";}
export function lineOfSight(a,b,terrain){
 if(!a||!b)return {clear:false,reason:"Selecione origem e alvo.",cover:false};
 // Amostras sobre a reta entre centros; bloqueio por parede, cobertura indicada sem bônus automático.
 const length=distance(a,b),steps=Math.max(1,Math.ceil(length*16));
 let cover=false;
 for(let i=1;i<steps;i++){
  const t=i/steps,x=Math.round(a.x+(b.x-a.x)*t),y=Math.round(a.y+(b.y-a.y)*t);
  if((x===a.x&&y===a.y)||(x===b.x&&y===b.y))continue;
  const kind=tileAt(terrain,x,y);
  if(kind==="parede")return {clear:false,reason:"Parede interrompe a linha de visão.",cover};
  if(kind==="cobertura")cover=true;
 }
 return {clear:true,cover,reason:cover?"Cobertura entre os combatentes: modificador decidido pelo Narrador.":"Linha de visão desobstruída."};
}
export const movementAllowance=u=>Math.max(0,8+Number(u.attributes?.agilidade||0)+Math.floor(Number(u.practices?.atletismo||0)/3));
export function shortestPath(a,b,terrain,tokens=[]){
 if(!a||!b||!inBounds(a.x,a.y)||!inBounds(b.x,b.y))return null;
 const occupied=new Set(tokens.filter(t=>t.id!==a.id).map(t=>cellKey(t.x,t.y)));
 if(tileAt(terrain,b.x,b.y)==="parede"||occupied.has(cellKey(b.x,b.y)))return null;
 const start=cellKey(a.x,a.y),goal=cellKey(b.x,b.y),queue=[[a.x,a.y]],from=new Map([[start,null]]);
 let n=0;
 while(n<queue.length){
  const [x,y]=queue[n++],k=cellKey(x,y);if(k===goal)break;
  for(const [dx,dy] of [[0,-1],[1,0],[0,1],[-1,0]]){
   const nx=x+dx,ny=y+dy,nk=cellKey(nx,ny);
   if(!inBounds(nx,ny)||from.has(nk)||tileAt(terrain,nx,ny)==="parede"||occupied.has(nk))continue;
   from.set(nk,k);queue.push([nx,ny]);
  }
 }
 if(!from.has(goal))return null;
 const path=[];for(let cur=goal;cur!==null;cur=from.get(cur)){
  const [x,y]=cur.split(",").map(Number);path.unshift({x,y});
 }
 return path;
}
export function plannedMove(unit,to,terrain,tokens){
 const path=shortestPath(unit,to,terrain,tokens);
 if(!path)return {ok:false,reason:"Destino inacessível (parede, ocupado ou fora do mapa)."};
 const distanceM=path.length-1,remaining=Math.max(0,movementAllowance(unit)-Number(unit.moved||0));
 if(distanceM>remaining)return {ok:false,reason:"Deslocamento excede os "+remaining+" m restantes nesta rodada.",distanceM,remaining,path};
 return {ok:true,distanceM,remaining:remaining-distanceM,path};
}
export function dodgeBonus(armor){
 if(!armor||!armor.equipped)return 0;
 const typ=String(armor.weight||armor.category||"").toLowerCase().replace(/[- ]/g,"_");
 return 0;
}
export function armorPenalty(armor){
 if(!armor||!armor.equipped)return 0;
 const typ=String(armor.weight||armor.category||"").toLowerCase().replace(/[- ]/g,"_");
 return ({leve:1,medio:2,alto:3,pesado:3,extremo:4,muito_pesado:4})[typ]||0;
}
export function defenseWithStance(natural,armor,stance="normal"){
 // Armaduras afetam todas as defesas; esquiva não repete o bônus.
 return Math.min(12,Math.max(0,Math.min(11,Math.max(2,Number(natural||0)))-armorPenalty(armor)+dodgeBonus(armor)));
}
export function equippedArmor(source){
 const items=source?.items||[];
 const item=items.find(i=>(i.type==="armadura"||i.kind==="armor")&&i.equipped);
 if(!item)return null;
 return {...item,weight:item.weightCategory||item.weightClass||item.weight||item.category||
 "leve",equipped:true};
}
export function initialScenario(){
 const terrain={};
 for(let y=1;y<=4;y++)terrain[cellKey(9,y)]="parede";
 for(let y=7;y<=10;y++)terrain[cellKey(11,y)]="parede";
 for(const p of [[6,3],[7,3],[8,3],[11,6],[12,6],[13,6]])terrain[cellKey(...p)]="cobertura";
 return {version:1,width:WIDTH,height:HEIGHT,round:1,terrain,tokens:[],history:[],selected:null,target:null,tool:"mover"};
}
export function validateTerrain(raw){
 const result={};
 for(const [k,v] of Object.entries(raw||{})){
  const parts=k.split(",").map(Number);
  if(parts.length===2&&inBounds(...parts)&&["parede","cobertura"].includes(v))result[k]=v;
 }
 return result;
}
export function limitTokens(arr){return Array.isArray(arr)?arr.slice(0,MAX_TOKENS):[];}
