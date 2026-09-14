/* ============================================================
   ForjaDev — main.js
   Comportamento de interface: menu, navegacao ativa, brilho de
   brasa nos botoes e ano do rodape. Sem dependencia externa.
   O FAQ nao aparece aqui: virou <details>/<summary> nativo, que
   ja e acessivel por teclado sem uma linha de JavaScript.
   ============================================================ */
(function () {
  'use strict';

  var BREAK_MENU = 1000;

  /* ---------------------------------------------------------
     1. MENU MOBILE
     --------------------------------------------------------- */
  function menu() {
    var botao = document.querySelector('.nav__toggle');
    var nav = document.getElementById('navPrincipal');
    if (!botao || !nav) return;

    function fechar() {
      botao.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-aberto');
      document.body.style.removeProperty('overflow');
    }
    function abrir() {
      botao.setAttribute('aria-expanded', 'true');
      nav.classList.add('is-aberto');
      document.body.style.overflow = 'hidden';
    }

    botao.addEventListener('click', function () {
      if (botao.getAttribute('aria-expanded') === 'true') fechar(); else abrir();
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) fechar();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && botao.getAttribute('aria-expanded') === 'true') {
        fechar();
        botao.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > BREAK_MENU) fechar();
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     2. LINK ATIVO NA NAVEGACAO
     --------------------------------------------------------- */
  function navAtiva() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav__link[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var mapa = {};
    var secoes = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var sec = id && document.getElementById(id);
      if (sec) { mapa[id] = a; secoes.push(sec); }
    });
    if (!secoes.length) return;

    var visiveis = new Set();
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (ent) {
        if (ent.isIntersecting) visiveis.add(ent.target.id);
        else visiveis.delete(ent.target.id);
      });
      var atual = null;
      for (var i = 0; i < secoes.length; i++) {
        if (visiveis.has(secoes[i].id)) { atual = secoes[i].id; break; }
      }
      links.forEach(function (a) { a.classList.remove('is-ativo'); a.removeAttribute('aria-current'); });
      if (atual && mapa[atual]) {
        mapa[atual].classList.add('is-ativo');
        mapa[atual].setAttribute('aria-current', 'true');
      }
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    secoes.forEach(function (s) { obs.observe(s); });
  }

  /* ---------------------------------------------------------
     3. BRILHO DE BRASA — o gradiente segue o ponteiro no botao
     --------------------------------------------------------- */
  function brasa() {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    document.addEventListener('pointermove', function (e) {
      var btn = e.target.closest && e.target.closest('.btn');
      if (!btn) return;
      var r = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      btn.style.setProperty('--my', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     4. ANO CORRENTE NO RODAPE
     --------------------------------------------------------- */
  function ano() {
    var el = document.getElementById('ano');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------
     5. ANCORAS — respeita movimento reduzido
     --------------------------------------------------------- */
  function ancoras() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.style.scrollBehavior = 'auto';
  }

  function iniciar() { menu(); navAtiva(); brasa(); ano(); ancoras(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else { iniciar(); }
})();
