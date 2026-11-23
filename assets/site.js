(function(){
"use strict";
var THEME_KEY="codex-rpg-color-theme";
function initialTheme(){
 try {var saved=localStorage.getItem(THEME_KEY);if(saved==="light"||saved==="dark")return saved;}catch(e){}
 return window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";
}
function applyTheme(theme){
 document.documentElement.setAttribute("data-theme",theme);
 var b=document.querySelector("[data-theme-toggle]");
 if(b){b.textContent=theme==="light"?"☀ Claro":"☾ Escuro";
  b.setAttribute("aria-label",theme==="light"?"Ativar modo escuro":"Ativar modo claro");
  b.setAttribute("aria-pressed",String(theme==="light"));}
}
function standardNavigation(header){
 var brand=header.querySelector(".brand"),nav=header.querySelector(".site-nav");
 if(!brand||!nav)return;
 var brandUrl=brand.getAttribute("href")||"index.html";
 var prefix=brandUrl.endsWith("index.html")?brandUrl.slice(0,-"index.html".length):"";
 var routes=[
  ["index.html","Início"],["livro.html","Livro do Jogador"],["pericias/","Perícias"],
  ["narrador.html","Livro do Mestre"],["prototipo-ficha/","Meus personagens"],
  ["criar-conflito/","Meus inimigos"],["simulador-combate/","Simulador tático"]
 ];
 var path=window.location.pathname;
 var active=path.includes("/prototipo-ficha/")?4:path.includes("/criar-conflito/")?5:
  path.includes("/simulador-combate/")?6:path.includes("/pericias/")?2:
  path.endsWith("/narrador.html")?3:path.endsWith("/livro.html")||path.includes("/mecanicas/")?1:0;
 nav.setAttribute("aria-label","Menu principal");
 nav.innerHTML=routes.map(function(route,i){
  return '<a href="'+prefix+route[0]+'"'+(active===i?' class="active" aria-current="page"':'')+'>'+route[1]+'</a>';
 }).join("");
 var toggle=header.querySelector("[data-menu]");
 if(!toggle){
  toggle=document.createElement("button");toggle.type="button";toggle.className="mobile-toggle";
  toggle.setAttribute("data-menu","");toggle.textContent="☰";header.appendChild(toggle);
 }
 toggle.setAttribute("aria-label","Abrir menu");
 toggle.setAttribute("aria-expanded","false");
 toggle.addEventListener("click",function(){
  var open=nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded",String(open));
  toggle.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");
 });
}
applyTheme(initialTheme());
document.addEventListener("DOMContentLoaded",function(){
 var header=document.querySelector(".site-header");
 if(!header)return;
 standardNavigation(header);
 var nav=header.querySelector(".site-nav"),toggle=header.querySelector("[data-menu]");
 document.querySelectorAll("a[href^='#']").forEach(function(link){
  link.addEventListener("click",function(){
   if(nav)nav.classList.remove("open");
   if(toggle){toggle.setAttribute("aria-expanded","false");toggle.setAttribute("aria-label","Abrir menu");}
  });
 });
 var button=header.querySelector("[data-theme-toggle]");
 if(!button){
  button=document.createElement("button");button.className="theme-toggle";button.type="button";
  button.setAttribute("data-theme-toggle","");
  header.insertBefore(button,header.querySelector(".mobile-toggle"));
 }
 applyTheme(document.documentElement.getAttribute("data-theme")||"dark");
 button.addEventListener("click",function(){
  var next=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";
  try{localStorage.setItem(THEME_KEY,next);}catch(e){}applyTheme(next);
 });
});
})();
