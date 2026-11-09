(function(){
"use strict";
var THEME_KEY="codex-rpg-color-theme";
function initialTheme(){
 try {var saved=localStorage.getItem(THEME_KEY);if(saved==="light"||saved==="dark")return saved;}catch(e){}
 return window.matchMedia&&window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";
}
function applyTheme(theme){document.documentElement.setAttribute("data-theme",theme);var b=document.querySelector("[data-theme-toggle]");if(b){b.textContent=theme==="light"?"☀ Claro":"☾ Escuro";b.setAttribute("aria-label",theme==="light"?"Ativar modo escuro":"Ativar modo claro");b.setAttribute("aria-pressed",String(theme==="light"));}}
applyTheme(initialTheme());
document.addEventListener("DOMContentLoaded",function(){
 var toggle=document.querySelector("[data-menu]"),nav=document.querySelector(".site-nav");
 if(toggle&&nav){toggle.addEventListener("click",function(){var open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));toggle.setAttribute("aria-label",open?"Fechar menu":"Abrir menu");});}
 document.querySelectorAll("a[href^='#']").forEach(function(link){link.addEventListener("click",function(){if(nav)nav.classList.remove("open");if(toggle)toggle.setAttribute("aria-expanded","false");});});
 var header=document.querySelector(".site-header");if(!header)return;
 var button=document.createElement("button");button.className="theme-toggle";button.type="button";button.setAttribute("data-theme-toggle","");header.insertBefore(button,header.querySelector(".mobile-toggle"));
 applyTheme(document.documentElement.getAttribute("data-theme")||"dark");
 button.addEventListener("click",function(){var next=document.documentElement.getAttribute("data-theme")==="light"?"dark":"light";try{localStorage.setItem(THEME_KEY,next);}catch(e){}applyTheme(next);});
});
})();
