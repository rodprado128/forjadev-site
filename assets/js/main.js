/* ForjaDev · app mínimo: tema, menu, abas de fluxo, fallbacks de animação.
   Sem backend: nenhum envio de formulário é simulado. */
(function () {
  "use strict";
  var doc = document, root = doc.documentElement;

  /* Tema: claro padrão; escuro opcional persistente, à prova de storage bloqueado */
  function temaSalvo() { try { return localStorage.getItem("fd-theme"); } catch (e) { return null; } }
  function aplicarTema(t) {
    if (t === "dark") { root.setAttribute("data-theme", "dark"); }
    else { root.removeAttribute("data-theme"); t = "light"; }
    var meta = doc.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", t === "dark" ? "#10131A" : "#FFFFFF");
  }
  var tema = temaSalvo();
  if (!tema) tema = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  aplicarTema(tema);

  /* Fallback de reveals quando não há animation-timeline */
  var temTimeline = window.CSS && CSS.supports && CSS.supports("animation-timeline", "view()");
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!temTimeline) root.classList.add("no-viewtl");
  var temIO = "IntersectionObserver" in window;
  if (!temTimeline && !reduced && temIO) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("fd-in"); io.unobserve(en.target); }
      });
    }, { threshold: 0.15 });
    doc.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else if (!temTimeline && (reduced || !temIO)) {
    doc.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("fd-in"); });
  }

  /* Ponto do fluxo: 1200ms, uma vez, quando o diagrama entra em cena */
  if (temIO && !reduced) {
    var dio = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("fd-roda"); dio.unobserve(en.target); }
      });
    }, { threshold: 0.4 });
    doc.querySelectorAll(".fluxo-diagrama").forEach(function (el) { dio.observe(el); });
  } else {
    doc.querySelectorAll(".fluxo-diagrama").forEach(function (el) { el.classList.add("fd-roda"); });
  }

  /* Menu mobile: clique, teclado e Escape */
  var btn = doc.querySelector(".menu-btn"), menu = doc.getElementById("menu-principal");
  function menuAberto() { return menu.classList.contains("fd-aberto"); }
  function abrirMenu(a) {
    menu.classList.toggle("fd-aberto", a);
    btn.setAttribute("aria-expanded", a ? "true" : "false");
    btn.querySelector(".sr-only").textContent = a ? "Fechar menu" : "Abrir menu";
  }
  if (btn && menu) {
    btn.addEventListener("click", function () { abrirMenu(!menuAberto()); });
    menu.addEventListener("click", function (e) { if (e.target.closest("a")) abrirMenu(false); });
    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && menuAberto()) { abrirMenu(false); btn.focus(); }
    });
    doc.addEventListener("click", function (e) {
      if (menuAberto() && !e.target.closest(".topo")) abrirMenu(false);
    });
  }

  /* Tema: alternância com persistência tolerante a falhas */
  var temaBtn = doc.querySelector(".tema-btn");
  if (temaBtn) {
    temaBtn.addEventListener("click", function () {
      var novo = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      aplicarTema(novo);
      try { localStorage.setItem("fd-theme", novo); } catch (e) { /* segue sem persistir */ }
    });
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
        di.classList.remove("fd-roda");
        void di.getBoundingClientRect();
        di.classList.add("fd-roda");
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

  /* Ano do rodapé */
  var ano = doc.getElementById("ano");
  if (ano) ano.textContent = String(new Date().getFullYear());
})();
