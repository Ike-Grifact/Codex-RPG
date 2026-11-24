/* Apresentação editorial; não altera as regras. */
(function(){
"use strict";
const metadata={
 "pericia-em-armas-leves": {
  "id": "armas-leves",
  "type": "Ativa + benefício passivo",
  "cost": "1 Coragem por tentativa de característica",
  "icon": "arma-adaga"
 },
 "pericia-em-armas-medias": {
  "id": "armas-medias",
  "type": "Ativa + benefício passivo",
  "cost": "1 Coragem por tentativa de característica",
  "icon": "arma-espada"
 },
 "pericia-em-armas-pesadas": {
  "id": "armas-pesadas",
  "type": "Ativa + benefício passivo",
  "cost": "1 Coragem por tentativa de característica",
  "icon": "arma-montante"
 },
 "disciplina-avancada": {
  "id": "disciplina-avancada",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-espada"
 },
 "concentracao-refinada": {
  "id": "concentracao-refinada",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-conjuracao"
 },
 "manejo-perfeito-armas-corpo-a-corpo": {
  "id": "manejo-perfeito",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-espada"
 },
 "golpe-fulminante": {
  "id": "golpe-fulminante",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "categoria-corporal"
 },
 "golpe-colossal": {
  "id": "espalhar-golpe",
  "type": "Ativa",
  "cost": "1 Coragem por até 2 alvos adicionais",
  "icon": "categoria-corporal"
 },
 "pugilismo": {
  "id": "pugilismo",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "arma-punhos"
 },
 "artista-marcial": {
  "id": "artista-marcial",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-corporal"
 },
 "pericia-em-arremesso-de-armas": {
  "id": "maestria-arremesso-armas",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "arma-arremesso"
 },
 "maestria-em-escudos": {
  "id": "maestria-escudos",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "armadura-escudo"
 },
 "sacrificio-heroico": {
  "id": "sacrificio-heroico",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "armadura-escudo"
 },
 "escudo-refletor": {
  "id": "escudo-refletor",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "armadura-escudo"
 },
 "sentido-elemental": {
  "id": "sentido-elemental",
  "type": "Ativa",
  "cost": "1 Coragem por análise",
  "icon": "magia-circulo"
 },
 "cancelar-magia": {
  "id": "cancelar-magia",
  "type": "Ativa",
  "cost": "1 Coragem por tentativa",
  "icon": "magia-circulo"
 },
 "mudanca-elemental": {
  "id": "mudanca-elemental",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "magia-transformacao"
 },
 "desencantar": {
  "id": "desencantar",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "magia-circulo"
 },
 "espelho-magico": {
  "id": "espelho-magico",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "armadura-escudo-arcano"
 },
 "maos-leves": {
  "id": "maos-leves",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-furtividade"
 },
 "pericia-armadilha": {
  "id": "pericia-armadilha",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-furtividade"
 },
 "golpe-furtivo": {
  "id": "golpe-furtivo",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "arma-adaga"
 },
 "bioetica": {
  "id": "bioetica",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-natureza"
 },
 "pesquisa-avancada-pocoes": {
  "id": "pesquisa-avancada-pocoes",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "magia-circulo"
 },
 "corpo-fechado": {
  "id": "corpo-fechado",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "arma-punhos"
 },
 "invocar-esfera-espiritual": {
  "id": "invocar-esfera-espiritual",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "magia-circulo"
 },
 "passo-etereo": {
  "id": "passo-etereo",
  "type": "Ativa",
  "cost": "1 Esfera Espiritual",
  "icon": "magia-circulo"
 },
 "absorver-esferas": {
  "id": "absorver-esferas",
  "type": "Ativa",
  "cost": "Todas as Esferas Espirituais",
  "icon": "magia-circulo"
 },
 "disparo-esferas-espirituais": {
  "id": "disparo-esferas-espirituais",
  "type": "Ativa",
  "cost": "1 Esfera Espiritual",
  "icon": "magia-circulo"
 },
 "dilema": {
  "id": "dilema",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "arma-punhos"
 },
 "impacto-psiquico": {
  "id": "impacto-psiquico",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "magia-circulo"
 },
 "escudo-bumerangue": {
  "id": "escudo-bumerangue",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "arma-arremesso"
 },
 "disparo-fulminante": {
  "id": "disparo-fulminante",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "categoria-disparos"
 },
 "disparo-multiplo": {
  "id": "disparo-multiplo",
  "type": "Ativa",
  "cost": "1 Coragem a cada até 2 alvos adicionais",
  "icon": "categoria-disparos"
 },
 "pericia-em-manejo-duplo": {
  "id": "maestria-manejo-duplo",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "arma-espada"
 },
 "pericia-em-armas-de-longo-alcance": {
  "id": "armas-longo-alcance",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "arma-arco"
 },
 "olhos-de-aguia": {
  "id": "olhos-de-aguia",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-disparos"
 },
 "disparo-violento": {
  "id": "disparo-violento",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "categoria-disparos"
 },
 "disparo-tatico": {
  "id": "disparo-tatico",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-disparos"
 },
 "pericia-em-armas-de-fogo": {
  "id": "armas-fogo",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "arma-pistola"
 },
 "provocacao-sofisticada": {
  "id": "provocacao-sofisticada",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-influencia"
 },
 "golpe-baixo": {
  "id": "golpe-baixo",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "categoria-corporal"
 },
 "pericia-em-furtividade": {
  "id": "furtividade",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-furtividade"
 },
 "furtividade-avancada": {
  "id": "furtividade-avancada",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-furtividade"
 },
 "protecao-avancada": {
  "id": "protecao-avancada",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-conhecimentos-avancados"
 },
 "astronomia-avancada": {
  "id": "astronomia-avancada",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-conhecimentos-avancados"
 },
 "alquimia-avancada": {
  "id": "alquimia-avancada",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-alquimia"
 },
 "engenharia-avancada": {
  "id": "engenharia-avancada",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-conhecimentos-avancados"
 },
 "erudicao-avancada": {
  "id": "erudicao-avancada",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-conhecimentos-avancados"
 },
 "atletismo-avancado": {
  "id": "atletismo-avancado",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-atletismo"
 },
 "artesao-avancado": {
  "id": "artesao-avancado",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-artesao"
 },
 "maestria-em-martelos": {
  "id": "maestria-martelos",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-montante"
 },
 "maestria-em-adagas": {
  "id": "maestria-adagas",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-adaga"
 },
 "maestria-em-espadas": {
  "id": "maestria-espadas",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-espada"
 },
 "maestria-em-machados": {
  "id": "maestria-machados",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-montante"
 },
 "maestria-em-hastes": {
  "id": "maestria-hastes",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-lanca"
 },
 "maestria-em-cajados": {
  "id": "maestria-cajados",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-lanca"
 },
 "maestria-em-arcos": {
  "id": "maestria-arcos",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-arco"
 },
 "maestria-em-bestas": {
  "id": "maestria-bestas",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-arco"
 },
 "maestria-em-arremessos": {
  "id": "maestria-arremessos",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-arremesso"
 },
 "maestria-em-punhos": {
  "id": "maestria-punhos",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-punhos"
 },
 "maestria-em-longo-alcance": {
  "id": "maestria-longo-alcance",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-arco"
 },
 "maestria-em-armas-fogo": {
  "id": "maestria-armas-fogo",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "arma-pistola"
 },
 "ferreiro": {
  "id": "ferreiro",
  "type": "Passiva",
  "cost": "Sem custo no benefício passivo",
  "icon": "categoria-artesao"
 },
 "ferreiro-elemental": {
  "id": "ferreiro-elemental",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-artesao"
 },
 "resistencia-a-fogo": {
  "id": "resistencia-a-fogo",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-artesao"
 },
 "encantar-com-elemento": {
  "id": "encantar-com-elemento",
  "type": "Ativa",
  "cost": "Armadura/escudo: 1 Coragem; arma: pendente",
  "icon": "categoria-conjuracao"
 },
 "coleta-avancada": {
  "id": "coleta-avancada",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-coleta"
 },
 "medicina-avancada": {
  "id": "medicina-avancada",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-recuperacao"
 },
 "criar-veneno": {
  "id": "criar-veneno",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-alquimia"
 },
 "criar-antidoto": {
  "id": "criar-antidoto",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-alquimia"
 },
 "criar-item-de-foco-e-magia": {
  "id": "criar-item-foco-magia",
  "type": "Ativa",
  "cost": "G1/G2: gratuito; graus superiores conforme a Perícia",
  "icon": "magia-foco"
 },
 "escudo-arcano": {
  "id": "escudo-arcano",
  "type": "Ativa",
  "cost": "1 Coragem (+ custos adicionais previstos)",
  "icon": "armadura-escudo-arcano"
 },
 "conjuracao-refinada": {
  "id": "conjuracao-equilibrada",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-conjuracao"
 },
 "improviso-elemental": {
  "id": "improviso",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "magia-circulo"
 },
 "maestria-elemental": {
  "id": "mestre",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-elementos"
 },
 "pericia-em-elemento-fogo": {
  "id": "fogo",
  "type": "Ativa",
  "cost": "G1/G2: gratuito; graus superiores conforme a Perícia",
  "icon": "elemento-fogo"
 },
 "pericia-em-elemento-agua": {
  "id": "agua",
  "type": "Ativa",
  "cost": "G1/G2: gratuito; graus superiores conforme a Perícia",
  "icon": "elemento-agua"
 },
 "pericia-em-elemento-ar": {
  "id": "vento",
  "type": "Ativa",
  "cost": "G1/G2: gratuito; graus superiores conforme a Perícia",
  "icon": "elemento-ar"
 },
 "pericia-em-elemento-terra": {
  "id": "terra",
  "type": "Ativa",
  "cost": "G1/G2: gratuito; graus superiores conforme a Perícia",
  "icon": "elemento-terra"
 },
 "pericia-em-elemento-sagrado": {
  "id": "sagrado",
  "type": "Ativa",
  "cost": "G1/G2: gratuito; graus superiores conforme a Perícia",
  "icon": "elemento-sagrado"
 },
 "pericia-em-elemento-veneno": {
  "id": "veneno",
  "type": "Ativa",
  "cost": "G1/G2: gratuito; graus superiores conforme a Perícia",
  "icon": "elemento-veneno"
 },
 "pericia-em-elemento-sangue": {
  "id": "sangue",
  "type": "Ativa",
  "cost": "1 Vida própria ou 3 Sangues de inimigos",
  "icon": "elemento-sangue"
 },
 "pericia-em-elemento-trevas": {
  "id": "trevas",
  "type": "Ativa",
  "cost": "G1/G2: gratuito; graus superiores conforme a Perícia",
  "icon": "elemento-trevas"
 },
 "transfusao": {
  "id": "transfusao",
  "type": "Ativa",
  "cost": "Pendente",
  "icon": "categoria-alquimia"
 },
 "transfusao-sanguinaria": {
  "id": "transfusao-sanguinaria",
  "type": "Ativa",
  "cost": "Pendente",
  "icon": "categoria-alquimia"
 },
 "recuperacao-vigorosa": {
  "id": "recuperacao-vigorosa",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-recuperacao"
 },
 "maestria-em-recuperacao-vigorosa-em-movimento": {
  "id": "recuperacao-movimento",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-recuperacao"
 },
 "recobrar-coragem": {
  "id": "recobrar-coragem",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-recuperacao"
 },
 "instinto-de-sobrevivencia": {
  "id": "instinto-sobrevivencia",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-recuperacao"
 },
 "invocacao-elemental": {
  "id": "invocacao-elemental",
  "type": "Ativa",
  "cost": "1 Coragem (+ custos adicionais previstos)",
  "icon": "magia-circulo"
 },
 "pericia-druidica": {
  "id": "pericia-druidica",
  "type": "Ativa",
  "cost": "Pequena: 0 Coragem; Média e Grande: 1 Coragem",
  "icon": "categoria-natureza"
 },
 "transformacao-elemental": {
  "id": "transformacao-elemental",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "magia-transformacao"
 },
 "domar-criatura-pequena": {
  "id": "domar-criatura-pequena",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "categoria-natureza"
 },
 "domar-criatura-media": {
  "id": "domar-criatura-media",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "categoria-natureza"
 },
 "domar-criatura-grande": {
  "id": "domar-criatura-grande",
  "type": "Ativa",
  "cost": "1 Coragem",
  "icon": "categoria-natureza"
 },
 "apresentacao-avancada": {
  "id": "apresentacao-avancada",
  "type": "Passiva",
  "cost": "Sem custo de ativação",
  "icon": "categoria-apresentacao"
 },
 "pericia-em-instrumentos": {
  "id": "pericia-em-instrumentos",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-apresentacao"
 },
 "maestria-em-apresentacao": {
  "id": "maestria-em-apresentacao",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-apresentacao"
 },
 "voz-encantadora": {
  "id": "voz-encantadora",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-apresentacao"
 },
 "montar-animal": {
  "id": "montar",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-cavalaria"
 },
 "pericia-em-montaria": {
  "id": "pericia-montaria",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-cavalaria"
 },
 "montaria-epica": {
  "id": "montaria-epica",
  "type": "Pendente",
  "cost": "Pendente",
  "icon": "categoria-cavalaria"
 }
};
const byId=Object.fromEntries(Object.values(metadata).map(m=>[m.id,m]));
const files={E:"exito",A:"codex/status-antecipar",P:"pavor",C:"codex/status-coragem"},names={E:"Êxito",A:"Antecipar",P:"Pavor",C:"Coragem"};
const pattern=/(^|[^\p{L}\p{N}])([+−-]?\d+\s*(Êxitos?|Antecipar|Pavor(?:es)?|[Cc]oragem|E|A|P))(?=$|[^\p{L}\p{N}])/gu;
const key=t=>/^Êxito/.test(t)?"E":t==="Antecipar"?"A":/^Pavor/.test(t)?"P":/^coragem$/i.test(t)?"C":t;
function decorateEscaped(text){return String(text).replace(pattern,(_,prefix,value,token)=>prefix+'<span class="codex-inline-rune">'+value+'<img src="../assets/icons/'+files[key(token)]+'.svg" alt="" aria-hidden="true" title="'+names[key(token)]+'"></span>');}
window.CODEX_SKILL_PRESENTATION=Object.freeze({metadata,byId,decorateEscaped});
if(typeof document==="undefined")return;
const page=location.pathname;if(!/\/(pericias|mecanicas)(\/|$)/.test(page))return;
function element(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text)e.textContent=text;return e;}
function icon(name,cls){const e=element("img",cls);e.src="../assets/icons/codex/"+name+".svg";e.alt="";e.setAttribute("aria-hidden","true");return e;}
function target(a){let u;try{u=new URL(a.getAttribute("href"),location.href);}catch{return null;}if(u.origin!==location.origin)return null;const m=u.pathname.match(/\/(pericias|mecanicas)\/([^/]+)\.html$/);return m?{section:m[1],slug:m[2]}:null;}
function stat(dl,label,value){let d=element("div","skill-stat");d.append(element("dt","",label),element("dd","",value));dl.append(d);}
function findStat(dl,re){return [...dl.querySelectorAll(".skill-stat")].find(d=>re.test(d.querySelector("dt")?.textContent.trim()||""));}
function cleanup(){
 for(const aside of document.querySelectorAll(".skill-related")){
  const moved=[];
  for(const group of [...aside.querySelectorAll(".skill-related-links")]){
   const head=group.previousElementSibling,mechanicGroup=head?.textContent.trim()==="Mecânicas relacionadas";
   for(const a of [...group.querySelectorAll("a[href]")]){
    const t=target(a);if(!t)continue;
    if(t.section==="mecanicas"||["golpe-certo","vantagens-e-desvantagens"].includes(t.slug)){
     if(t.section==="pericias")a.href="../mecanicas/"+t.slug+".html";
     if(!mechanicGroup){moved.push(a);a.remove();}continue;
    }
    if(t.section==="pericias"&&t.slug!=="index"&&!metadata[t.slug])a.remove();
   }
   if(!group.querySelector("a")){group.remove();if(head?.tagName==="H2")head.remove();}
  }
  if(moved.length){let head=[...aside.querySelectorAll("h2")].find(h=>h.textContent.trim()==="Mecânicas relacionadas"),group=head?.nextElementSibling;
   if(!group?.classList.contains("skill-related-links")){head=element("h2","","Mecânicas relacionadas");group=element("div","skill-related-links");aside.append(head,group);}
   for(const a of moved)if(![...group.querySelectorAll("a")].some(x=>x.href===a.href))group.append(a);
  }
  if(!aside.querySelector("a"))aside.remove();
 }
 for(const nav of document.querySelectorAll(".skill-navlinks")){for(const a of [...nav.querySelectorAll("a[href]")]){const t=target(a);if(t?.section==="pericias"&&t.slug!=="index"&&!metadata[t.slug]){const p=a.parentElement;a.remove();if(p.tagName==="SPAN"&&!p.textContent.trim())p.remove();}}if(!nav.querySelector("a"))nav.remove();}
}
function decorateText(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT),nodes=[];while(w.nextNode())nodes.push(w.currentNode);for(const n of nodes){if(n.parentElement.closest(".codex-inline-rune,script,style"))continue;const raw=n.nodeValue,matches=[...raw.matchAll(pattern)];if(!matches.length)continue;const frag=document.createDocumentFragment();let pos=0;for(const m of matches){let start=m.index+m[1].length;frag.append(document.createTextNode(raw.slice(pos,start)));const s=element("span","codex-inline-rune",m[2]),i=element("img");i.src="../assets/icons/"+files[key(m[3])]+".svg";i.alt="";i.title=names[key(m[3])];i.setAttribute("aria-hidden","true");s.append(i);frag.append(s);pos=start+m[2].length;}frag.append(document.createTextNode(raw.slice(pos)));n.replaceWith(frag);}}
function enhance(){if(document.documentElement.dataset.codexSkillPresentation)return;document.documentElement.dataset.codexSkillPresentation="1";const css=element("link");css.rel="stylesheet";css.href="../assets/skill-presentation.css?v=20261123-v0104";document.head.append(css);
 if(page.includes("/pericias/")){cleanup();const m=metadata[page.split("/").pop().replace(/\.html$/,"")];if(m){const h=document.querySelector(".skill-hero h1");if(h){h.classList.add("codex-skill-title");h.prepend(icon(m.icon,"codex-skill-title-icon"));}
 const dl=document.querySelector(".skill-stats");if(dl){const type=findStat(dl,/^Tipo$/i);if(!type)stat(dl,"Tipo",m.type);else if(m.type!=="Pendente"){const dd=type.querySelector("dd");if(dd)dd.textContent=m.type;}const cost=findStat(dl,/^(Custo de ativação|Ativação)$/i);if(!cost)stat(dl,"Custo de ativação",m.cost);else if(m.type==="Passiva"||m.type==="Ativa + benefício passivo"||/^(Não especificado|Sem custo adicional especificado|PENDENTE)$/i.test(cost.querySelector("dd")?.textContent.trim()||"")){const dd=cost.querySelector("dd");if(dd&&m.cost!=="Pendente")dd.textContent=m.cost;}}}
 for(const card of document.querySelectorAll(".skill-catalog-card")){const a=card.querySelector("h3 a[href]"),t=a&&target(a),m=t&&metadata[t.slug];if(!m)continue;a.classList.add("codex-skill-card-title");a.prepend(icon(m.icon,"codex-skill-card-icon"));const d=element("div","codex-skill-card-meta");d.append(element("span","codex-skill-kind",m.type==="Pendente"?"Tipo pendente":m.type),element("span","codex-skill-cost","Ativação: "+m.cost));card.insertBefore(d,card.querySelector("p")||null);}}
 for(const el of document.querySelectorAll(".skill-article,.skill-stat dd,.skill-description,.skill-catalog-card p,.codex-skill-cost"))decorateText(el);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enhance,{once:true});else enhance();
})();
