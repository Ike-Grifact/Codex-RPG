/* Codex RPG — navegação móvel dos livros, usando o índice original. */
(function () {
  "use strict";
  const toc = document.querySelector(".book-shell > .toc");
  const content = document.querySelector(".book-content");
  if (!toc || !content || typeof HTMLDialogElement === "undefined" || typeof HTMLDialogElement.prototype.showModal !== "function") return;
  const media = matchMedia("(max-width: 720px)");
  const links = Array.from(toc.querySelectorAll('a[href^="#"]'));
  if (!links.length) return;
  const marker = document.createComment("Posição original do sumário");
  toc.before(marker);
  const button = document.createElement("button");
  button.type = "button";
  button.className = "book-mobile-toggle";
  button.setAttribute("aria-haspopup", "dialog");
  button.setAttribute("aria-controls", "book-mobile-dialog");
  button.setAttribute("aria-expanded", "false");
  button.innerHTML = '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 5h16v14H4zM9 5v14M12 9h5M12 12h5M12 15h5"/></svg><span><strong>Sumário</strong><small class="book-mobile-current"></small></span>';
  const dialog = document.createElement("dialog");
  dialog.id = "book-mobile-dialog";
  dialog.className = "book-mobile-dialog";
  dialog.setAttribute("aria-labelledby", "book-mobile-title");
  dialog.innerHTML = '<header class="book-mobile-heading"><h2 id="book-mobile-title">Sumário</h2><button type="button" class="book-mobile-close" aria-label="Fechar sumário" autofocus>×</button></header><label class="book-mobile-search">Buscar capítulo<input type="search" placeholder="Ex.: Conjuração" autocomplete="off"></label><p class="book-mobile-empty" hidden>Nenhum capítulo encontrado.</p>';
  const close = dialog.querySelector(".book-mobile-close");
  const search = dialog.querySelector("input");
  const empty = dialog.querySelector(".book-mobile-empty");
  const current = button.querySelector(".book-mobile-current");
  const normalize = s => s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  let oldOverflow = "", oldPriority = "", locked = false;
  function activeLink() { return toc.querySelector('a[aria-current="location"]'); }
  function updateCurrent() { const a = activeLink(); current.textContent = a ? a.textContent.trim().replace(/^↳\s*/, "") : "Escolher capítulo"; }
  function filter() {
    const q = normalize(search.value);
    let group = null, visible = 0;
    for (const el of toc.children) {
      if (el.tagName === "P") { group = el; el.hidden = !!q; }
      else if (el.tagName === "A") {
        const match = !q || normalize(el.textContent).includes(q);
        el.hidden = !match;
        if (match) { visible++; if (group) { group.hidden = false; } }
      }
    }
    empty.hidden = visible !== 0;
  }
  function reset() {
    search.value = ""; filter();
    marker.after(toc);
    if (locked) {
      if (oldOverflow) document.documentElement.style.setProperty("overflow", oldOverflow, oldPriority);
      else document.documentElement.style.removeProperty("overflow");
      locked = false;
    }
    button.setAttribute("aria-expanded", "false");
  }
  function hide() { if (dialog.open) dialog.close(); reset(); }
  function open() {
    if (!media.matches || dialog.open) return;
    dialog.append(toc); search.value = ""; filter();
    try { dialog.showModal(); } catch (_) { reset(); return; }
    oldOverflow = document.documentElement.style.getPropertyValue("overflow");
    oldPriority = document.documentElement.style.getPropertyPriority("overflow");
    document.documentElement.style.setProperty("overflow", "hidden"); locked = true;
    button.setAttribute("aria-expanded", "true");
    close.focus({preventScroll:true});
    const a = activeLink();
    if (a) toc.scrollTop = Math.max(0, a.getBoundingClientRect().top - toc.getBoundingClientRect().top + toc.scrollTop - 24);
  }
  button.addEventListener("click", open);
  close.addEventListener("click", hide);
  dialog.addEventListener("cancel", e => { e.preventDefault(); hide(); });
  dialog.addEventListener("close", () => { if (!dialog.open) reset(); });
  dialog.addEventListener("click", e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) hide();
  });
  search.addEventListener("input", filter);
  toc.addEventListener("click", e => {
    const a = e.target.closest("a[href]");
    if (!a || !dialog.open || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
    // Fechar antes da navegação nativa, preservando hash, histórico e posição.
    hide();
  });
  const sync = () => { if (!media.matches) hide(); updateCurrent(); };
  if (media.addEventListener) media.addEventListener("change", sync); else media.addListener(sync);
  window.addEventListener("beforeprint", hide);
  window.addEventListener("pageshow", sync);
  new MutationObserver(updateCurrent).observe(toc, {subtree:true, attributes:true, attributeFilter:["aria-current"]});
  const header = document.querySelector("body > .site-header");
  if (header) header.after(button);
  else document.body.prepend(button);
  document.body.append(dialog);
  document.documentElement.classList.add("book-mobile-ready");
  updateCurrent();
})();
