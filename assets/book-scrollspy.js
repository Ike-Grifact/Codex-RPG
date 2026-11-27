/* Codex RPG — índice de leitura do Livro do Jogador. */
(function () {
  "use strict";
  const toc = document.querySelector(".toc");
  const content = document.querySelector(".book-content");
  if (!toc || !content) return;

  const entries = [];
  let group = null;
  for (const el of toc.children) {
    if (el.tagName === "P") { group = el; continue; }
    if (el.tagName !== "A") continue;
    const href = el.getAttribute("href");
    if (!href || !href.startsWith("#") || href.length < 2) continue;
    let id;
    try { id = decodeURIComponent(href.slice(1)); } catch (_) { continue; }
    const target = document.getElementById(id);
    if (target && content.contains(target)) entries.push({ id, link: el, target, group });
  }
  if (!entries.length) return;
  // A ordem dos títulos no documento, não a área visível das seções longas.
  entries.sort((a, b) => a.target === b.target ? 0 :
    (a.target.compareDocumentPosition(b.target) & 4) ? -1 : 1);
  const groups = [...new Set(entries.map(e => e.group).filter(Boolean))];
  let active = null;
  let queued = false;

  function keepVisible(link) {
    // Rola somente o próprio índice, nunca o documento.
    const box = toc.getBoundingClientRect();
    const item = link.getBoundingClientRect();
    if (toc.scrollHeight > toc.clientHeight + 1) {
      const top = box.top + toc.clientTop;
      const bottom = top + toc.clientHeight;
      if (item.top < top) toc.scrollTop += item.top - top;
      else if (item.bottom > bottom) toc.scrollTop += item.bottom - bottom;
    }
    if (toc.scrollWidth > toc.clientWidth + 1) {
      const left = box.left + toc.clientLeft;
      const right = left + toc.clientWidth;
      if (item.left < left) toc.scrollLeft += item.left - left;
      else if (item.right > right) toc.scrollLeft += item.right - right;
    }
  }

  function setActive(entry) {
    if (!entry || entry === active) return;
    active = entry;
    for (const e of entries) {
      const current = e === entry;
      e.link.classList.toggle("is-active-parent", !current && e.target.contains(entry.target));
      if (current) e.link.setAttribute("aria-current", "location");
      else e.link.removeAttribute("aria-current");
    }
    for (const g of groups) g.classList.toggle("is-active-group", g === entry.group);
    keepVisible(entry.link);
  }

  function update() {
    queued = false;
    const mobileBar = document.querySelector(".book-mobile-toggle");
    const barBox = mobileBar && mobileBar.getBoundingClientRect();
    const mobileLine = barBox && barBox.height > 0 && barBox.top <= 1 ? barBox.bottom + 40 : 0;
    const line = Math.max(mobileLine, Math.min(96, Math.max(48, window.innerHeight * 0.12)));
    let current = entries[0];
    for (const e of entries) {
      if (e.target.getBoundingClientRect().top <= line) current = e;
    }
    const root = document.documentElement;
    if (root.scrollHeight > window.innerHeight &&
        window.scrollY + window.innerHeight >= root.scrollHeight - 2) {
      current = entries[entries.length - 1];
    }
    setActive(current);
  }

  function schedule() {
    if (queued) return;
    queued = true;
    window.requestAnimationFrame(update);
  }

  function syncHash() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch (_) { return schedule(); }
    const match = entries.find(e => e.id === id);
    if (match) setActive(match);
    schedule();
  }

  // Não alterar a URL, o histórico ou a rolagem nativa de âncoras.
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  window.addEventListener("hashchange", syncHash);
  window.addEventListener("pageshow", syncHash);
  window.addEventListener("load", schedule, { once: true });
  if (typeof ResizeObserver === "function") {
    const observer = new ResizeObserver(schedule);
    observer.observe(content);
  }
  syncHash();
})();
