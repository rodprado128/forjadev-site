/* ============================================================
   ForjaDev — animations.js
   Camada de movimento: revelacao em scroll, contadores, terminal
   que digita, divisor que se desenha, header e barra de leitura.
   Sem dependencia externa.

   Duas regras governam este arquivo:
   1) o estado inicial de opacidade zero so existe sob a classe
      .js-movimento, aplicada no <html> pelo script inline do <head>
      depois de confirmar IntersectionObserver e a ausencia de
      prefers-reduced-motion. Sem JS ou com movimento reduzido, o
      conteudo nasce no estado final;
   2) nenhuma animacao desloca layout: o espaco final ja esta
      reservado pelo fluxo antes de qualquer transicao comecar.
   ============================================================ */
(function () {
  'use strict';

  var ATIVO = document.documentElement.classList.contains('js-movimento');
  var TH = 0.15;   /* threshold do brand guide */

  /* Observador de disparo unico: marca .is-visible e para de observar. */
  function umaVez(alvos, aoEntrar, threshold) {
    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (ent) {
        if (!ent.isIntersecting) return;
        obs.unobserve(ent.target);
        aoEntrar(ent.target);
      });
    }, { threshold: threshold || TH });
    Array.prototype.forEach.call(alvos, function (el) { obs.observe(el); });
    return obs;
  }

  /* ---------------------------------------------------------
     1. REVELACAO EM SCROLL — fade + assentar, cadencia no CSS
     --------------------------------------------------------- */
  function revelar() {
    var todos = document.querySelectorAll('.reveal, [data-reveal-filhos] > *, .divisor--anima');
    if (!todos.length) return;
    umaVez(todos, function (el) {
      el.classList.add('is-visible');
      if (el.hasAttribute('data-contador-grupo')) contar(el);
    });
  }

  /* ---------------------------------------------------------
     2. CONTADORES — forja-contador
     O rotulo e o valor final ja ocupam o espaco definitivo no HTML,
     entao a contagem nao mexe em layout.
     --------------------------------------------------------- */
  function contar(escopo) {
    var els = (escopo || document).querySelectorAll('[data-contador]');
    Array.prototype.forEach.call(els, function (el) {
      if (el.dataset.feito === '1') return;
      el.dataset.feito = '1';
      var alvo = parseFloat(el.dataset.contador);
      if (isNaN(alvo)) return;
      var casas = el.dataset.casas ? parseInt(el.dataset.casas, 10) : 0;

      if (!ATIVO) { el.textContent = alvo.toFixed(casas); return; }

      var dur = 1100, ini = null;
      function passo(ts) {
        if (ini === null) ini = ts;
        var p = Math.min(1, (ts - ini) / dur);
        var e = 1 - Math.pow(1 - p, 3);              /* easeOutCubic */
        el.textContent = (alvo * e).toFixed(casas);
        if (p < 1) requestAnimationFrame(passo);
        else el.textContent = alvo.toFixed(casas);
      }
      requestAnimationFrame(passo);
    });
  }

  function contadores() {
    var grupos = document.querySelectorAll('[data-contador-grupo]');
    if (!grupos.length) return;
    if (!ATIVO) { contar(document); return; }
    umaVez(grupos, function (g) { contar(g); }, 0.3);
  }

  /* ---------------------------------------------------------
     3. TERMINAL — forja-digitar, disparo unico
     As linhas ja estao no HTML e ja ocupam a altura final; o que
     entra em sequencia e so o corte a esquerda, feito em CSS.
     --------------------------------------------------------- */
  function digitar() {
    var blocos = document.querySelectorAll('[data-digitar]');
    if (!blocos.length || !ATIVO) return;
    umaVez(blocos, function (el) { el.classList.add('is-digitando'); }, 0.3);
  }

  /* ---------------------------------------------------------
     4. SCROLL — header e barra de leitura
     Um unico listener, tudo dentro de um rAF. Nada aqui le
     geometria de elemento, entao nenhum quadro forca layout.
     --------------------------------------------------------- */
  function aoRolar() {
    var header = document.querySelector('.header');
    var barra = document.querySelector('.progresso');
    if (!header && !barra) return;
    var pedindo = false;

    function calcular() {
      pedindo = false;
      var y = window.pageYOffset || document.documentElement.scrollTop;

      if (header) header.classList.toggle('is-scrolled', y > 24);

      if (barra) {
        var total = document.documentElement.scrollHeight - window.innerHeight;
        var p = total > 0 ? Math.min(1, Math.max(0, y / total)) : 0;
        barra.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      }
    }

    function pedir() { if (!pedindo) { pedindo = true; requestAnimationFrame(calcular); } }

    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir, { passive: true });
    requestAnimationFrame(calcular);
  }

  function iniciar() {
    if (!('IntersectionObserver' in window)) { contar(document); aoRolar(); return; }
    revelar();
    contadores();
    digitar();
    aoRolar();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else { iniciar(); }
})();
