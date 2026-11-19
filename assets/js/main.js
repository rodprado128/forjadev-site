/* ForjaDev · app mínimo: tema, menu, abas de fluxo, fallbacks de animação.
   Sem backend: nenhum envio de formulário é simulado. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;

  /* Tema: claro padrão; escuro opcional persistente, à prova de storage bloqueado */
  /* Tema conforme tokens oficiais: data-tema "claro"/"escuro"; sem atributo, o sistema decide */
  function temaSalvo() { try { return localStorage.getItem("fd-tema"); } catch (e) { return null; } }
  function aplicarTema(t) {
    if (t === "escuro" || t === "claro") root.setAttribute("data-tema", t);
    else root.removeAttribute("data-tema");
    var meta = doc.querySelector('meta[name="theme-color"]');
    var escuroAtual = t === "escuro" || (!t && window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches);
    if (meta) meta.setAttribute("content", escuroAtual ? "#0D0F14" : "#F6F7F9");
    var controle = doc.querySelector(".tema-btn");
    if (controle) { controle.setAttribute("aria-pressed", escuroAtual ? "true" : "false"); controle.setAttribute("aria-label", escuroAtual ? "Ativar tema claro" : "Ativar tema escuro"); }
  }
  var tema = temaSalvo();
  aplicarTema(tema);

  /* Só ativar movimento depois da funcionalidade, nunca no <head>.
     Se o script falhar, a apresentação base continua totalmente legível. */
  var temTimeline = window.CSS && CSS.supports && CSS.supports("animation-timeline", "view()");
  var mediaReduced = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : null;
  var reduced = mediaReduced && mediaReduced.matches;
  var temIO = typeof window.IntersectionObserver === "function";
  if (!temTimeline) root.classList.add("no-viewtl");
  try {
    if (!temTimeline && !reduced && temIO) {
      var io = new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
          if (en.isIntersecting) { en.target.classList.add("fd-in"); io.unobserve(en.target); }
        });
      }, { threshold: 0.15 });
      doc.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
    } else {
      doc.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("fd-in"); });
    }
    if (temTimeline || temIO) root.classList.add("motion-ready");
  } catch (e) {
    root.classList.remove("motion-ready");
    doc.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("fd-in"); });
  }
  if (mediaReduced && mediaReduced.addEventListener) mediaReduced.addEventListener("change", function (e) {
    if (e.matches) {
      doc.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("fd-in"); });
      root.classList.remove("motion-ready");
    }
  });

  /* Ponto do fluxo: 1200ms, uma vez, quando o diagrama entra em cena */
  if (temIO && !reduced) {
    try {
    var dio = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("fd-roda"); dio.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    doc.querySelectorAll(".fluxo-diagrama").forEach(function (el) { dio.observe(el); });
    } catch (e) { /* O diagrama estático continua legível; controles não dependem do observer. */ }
  } else {
    doc.querySelectorAll(".fluxo-diagrama").forEach(function (el) { el.classList.add("fd-roda"); });
  }

  /* Menu é um disclosure nativo: continua operável sem JavaScript. */
  var btn = doc.querySelector(".menu-btn"), menu = doc.getElementById("menu-principal");
  var disclosure = doc.getElementById("nav-disclosure");
  var mobile = window.matchMedia("(max-width: 760px)");
  function syncMenu() {
    if (!btn || !disclosure) return;
    btn.setAttribute("aria-expanded", disclosure.open ? "true" : "false");
    btn.querySelector(".sr-only").textContent = disclosure.open ? "Fechar menu" : "Abrir menu";
  }
  if (btn && menu && disclosure) {
    disclosure.open = !mobile.matches;
    disclosure.addEventListener("toggle", syncMenu);
    syncMenu();
    if (mobile.addEventListener) mobile.addEventListener("change", function (e) { disclosure.open = !e.matches; syncMenu(); });
    menu.addEventListener("click", function (e) {
      var link = e.target.closest("a");
      if (!link) return;
      if (mobile.matches) disclosure.open = false;
      var hash = link.getAttribute("href");
      if (hash && hash.charAt(0) === "#") {
        var destino = doc.getElementById(hash.slice(1));
        if (destino) { destino.setAttribute("tabindex", "-1"); destino.focus({ preventScroll: true }); }
      }
    });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && mobile.matches && disclosure.open) { disclosure.open = false; btn.focus(); }
    });
    doc.addEventListener("click", function (e) {
      if (mobile.matches && disclosure.open && !e.target.closest(".topo")) disclosure.open = false;
    });
    root.classList.add("menu-ready");
  }

  /* Tema: alternância com persistência tolerante a falhas */
  var temaBtn = doc.querySelector(".tema-btn");
  if (temaBtn) {
    temaBtn.addEventListener("click", function () {
      var escuro = getComputedStyle(root).getPropertyValue("--fd-fundo").trim().toLowerCase() === "#0d0f14";
      var novo = escuro ? "claro" : "escuro";
      aplicarTema(novo);
      try { localStorage.setItem("fd-tema", novo); } catch (e) { /* segue sem persistir */ }
    });
    root.classList.add("controls-ready");
  }

  /* Abas de fluxo: estado acessível + teclado, rótulos no diagrama */
  var abas = [].slice.call(doc.querySelectorAll(".fluxo-aba"));
  var noRotulos = { "aba-pedidos": ["Entrada", "Conferência", "Registro", "Resposta"], "aba-tarefas": ["Entrada", "Organização", "Aviso", "Registro"], "aba-vendas": ["Captação", "Follow-up", "Faturamento", "Gestão"] };
  function selecionar(aba) {
    abas.forEach(function (b) {
      var on = b === aba;
      b.setAttribute("aria-selected", on ? "true" : "false");
      b.tabIndex = on ? 0 : -1;
      var painel = doc.getElementById(b.getAttribute("aria-controls"));
      if (painel) painel.hidden = !on;
      if (on) {
        var di = painel.querySelector(".fluxo-diagrama");
        var nos = di.querySelectorAll(".no-txt");
        (noRotulos[b.id] || []).forEach(function (txt, i) { if (nos[i]) nos[i].textContent = txt; });
        if (!reduced) { di.classList.remove("fd-roda"); requestAnimationFrame(function () { di.classList.add("fd-roda"); }); }
      }
    });
  }
  abas.forEach(function (b, i) {
    b.addEventListener("click", function () { selecionar(b); });
    b.addEventListener("keydown", function (e) {
      var d = { ArrowRight: 1, ArrowLeft: -1, Home: "h", End: "e" }[e.key];
      if (d === undefined) return;
      e.preventDefault();
      var n = d === "h" ? 0 : d === "e" ? abas.length - 1 : (i + d + abas.length) % abas.length;
      selecionar(abas[n]); abas[n].focus();
    });
  });

  if (abas.length) { selecionar(abas[0]); root.classList.add("tabs-ready"); }
  root.classList.add("js");

  /* Ano do rodapé */
  var ano = doc.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
