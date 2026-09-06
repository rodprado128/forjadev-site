/* ============================================================
   ForjaDev — main.js
   Comportamento de interface: menu, FAQ, navegacao ativa,
   brilho de brasa nos botoes e ano do rodape.
   ============================================================ */
(function () {
  'use strict';

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
      if (window.innerWidth > 900) fechar();
    }, { passive: true });
  }

  /* ---------------------------------------------------------
     2. FAQ — acordeao com animacao de altura real
     O painel nunca some com display:none: a linha do grid vai
     de 0fr a 1fr, entao a altura anima de verdade.
     --------------------------------------------------------- */
  function faq() {
    var itens = document.querySelectorAll('.faq__item');
    if (!itens.length) return;

    itens.forEach(function (item) {
      var botao = item.querySelector('.faq__botao');
      var painel = item.querySelector('.faq__painel');
      if (!botao || !painel) return;

      botao.addEventListener('click', function () {
        var aberto = botao.getAttribute('aria-expanded') === 'true';

        // acordeao: fecha os outros
        itens.forEach(function (outro) {
          if (outro === item) return;
          var b = outro.querySelector('.faq__botao');
          if (b && b.getAttribute('aria-expanded') === 'true') {
            b.setAttribute('aria-expanded', 'false');
            outro.classList.remove('is-aberto');
            outro.querySelector('.faq__painel').setAttribute('inert', '');
          }
        });

        botao.setAttribute('aria-expanded', aberto ? 'false' : 'true');
        item.classList.toggle('is-aberto', !aberto);
        if (aberto) painel.setAttribute('inert', '');
        else painel.removeAttribute('inert');
      });
    });
  }

  /* ---------------------------------------------------------
     3. LINK ATIVO NA NAVEGACAO
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
     4. BRILHO DE BRASA — o gradiente segue o ponteiro no botao
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
     5. ANO CORRENTE NO RODAPE
     --------------------------------------------------------- */
  function ano() {
    var el = document.getElementById('ano');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  /* ---------------------------------------------------------
     6. ANCORAS — respeita movimento reduzido
     --------------------------------------------------------- */
  function ancoras() {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.documentElement.style.scrollBehavior = 'auto';
  }

  function iniciar() { menu(); faq(); navAtiva(); brasa(); ano(); ancoras(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else { iniciar(); }
})();
