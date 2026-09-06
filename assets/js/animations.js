/* ============================================================
   ForjaDev — animations.js
   Movimento: malha de faiscas no hero, mockup de dispositivos,
   scroll reveal, contadores, parallax, header e barra de leitura.
   Sem dependencia externa. Tudo desliga em prefers-reduced-motion.
   ============================================================ */
(function () {
  'use strict';

  var mqReduz = window.matchMedia('(prefers-reduced-motion: reduce)');
  var reduz = mqReduz.matches;
  mqReduz.addEventListener('change', function (e) { reduz = e.matches; });

  var LARANJA = '255,106,0';
  var FAISCA = '255,176,32';

  /* ---------------------------------------------------------
     1. MALHA DE FAISCAS NO HERO
     Nos conectados por linhas laranja de baixissima opacidade.
     O ponteiro empurra os nos por perto. Pausa fora da viewport.
     --------------------------------------------------------- */
  function malha() {
    var cv = document.getElementById('heroCanvas');
    if (!cv || reduz) { if (cv) cv.style.display = 'none'; return; }

    var ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    var dpr = 1, w = 0, h = 0, nos = [], raf = null, visivel = true, rodando = false;
    var ponteiro = { x: -9999, y: -9999, tem: false };
    var LIGA = 132;          // distancia maxima de conexao
    var RAIO_MOUSE = 130;

    /* Aparelho modesto ou tela pequena: so as brasas a deriva.
       As linhas custam O(n^2) por quadro e o ponteiro nem existe no toque.
       'Leve, sem travar no celular' vale mais que a malha completa. */
    var modesto = window.matchMedia('(max-width:820px)').matches ||
                  window.matchMedia('(pointer:coarse)').matches ||
                  (navigator.hardwareConcurrency || 8) <= 4;
    var TETO_DPR = modesto ? 1 : 1.5;
    var FPS = modesto ? 24 : 30;

    function densidade() {
      var alvo = Math.round((w * h) / 26000);
      var teto = modesto ? 14 : (w < 1200 ? 46 : 72);
      return Math.max(10, Math.min(teto, alvo));
    }

    function medir() {
      dpr = Math.min(window.devicePixelRatio || 1, TETO_DPR);
      var r = cv.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      semear();
    }

    function semear() {
      var n = densidade();
      nos = [];
      for (var i = 0; i < n; i++) {
        nos.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.22,
          vy: -0.06 - Math.random() * 0.24,          // sobe, como brasa
          r: 0.7 + Math.random() * 1.5,
          f: Math.random() * Math.PI * 2,             // fase do brilho
          brasa: Math.random() < 0.22                 // poucos pontos quentes
        });
      }
    }

    var ultimo = 0;
    var INTERVALO = 1000 / FPS;

    function quadro(agora) {
      raf = null;
      if (!visivel) { rodando = false; return; }
      if (agora - ultimo < INTERVALO) { raf = requestAnimationFrame(quadro); rodando = true; return; }
      ultimo = agora;
      ctx.clearRect(0, 0, w, h);

      var i, j, a, b, dx, dy, d2, d;

      for (i = 0; i < nos.length; i++) {
        a = nos[i];
        a.x += a.vx; a.y += a.vy; a.f += 0.03;

        if (ponteiro.tem) {
          dx = a.x - ponteiro.x; dy = a.y - ponteiro.y;
          d2 = dx * dx + dy * dy;
          if (d2 < RAIO_MOUSE * RAIO_MOUSE && d2 > 0.01) {
            d = Math.sqrt(d2);
            var forca = (1 - d / RAIO_MOUSE) * 0.55;
            a.x += (dx / d) * forca;
            a.y += (dy / d) * forca;
          }
        }

        // reciclagem: some no topo, volta pela base
        if (a.y < -12) { a.y = h + 8; a.x = Math.random() * w; }
        if (a.x < -12) a.x = w + 8;
        if (a.x > w + 12) a.x = -8;
        if (a.y > h + 12) a.y = -8;
      }

      // linhas — baixissima opacidade, conforme a marca (so no desktop)
      if (!modesto) {
      ctx.lineWidth = 1;
      for (i = 0; i < nos.length; i++) {
        a = nos[i];
        for (j = i + 1; j < nos.length; j++) {
          b = nos[j];
          dx = a.x - b.x; dy = a.y - b.y;
          d2 = dx * dx + dy * dy;
          if (d2 < LIGA * LIGA) {
            var alpha = (1 - Math.sqrt(d2) / LIGA) * 0.13;
            ctx.strokeStyle = 'rgba(' + LARANJA + ',' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      }

      // pontos
      for (i = 0; i < nos.length; i++) {
        a = nos[i];
        var pulso = 0.55 + Math.sin(a.f) * 0.3;
        ctx.fillStyle = 'rgba(' + (a.brasa ? FAISCA : LARANJA) + ',' + (pulso * (a.brasa ? 0.85 : 0.55)).toFixed(3) + ')';
        ctx.beginPath();
        ctx.arc(a.x, a.y, a.r, 0, 6.2832);
        ctx.fill();
      }

      raf = requestAnimationFrame(quadro);
      rodando = true;
    }

    function ligar() { if (!raf && visivel && !reduz) { rodando = true; raf = requestAnimationFrame(quadro); } }
    function desligar() { if (raf) { cancelAnimationFrame(raf); raf = null; } rodando = false; }

    medir();
    ligar();

    var t;
    window.addEventListener('resize', function () {
      clearTimeout(t);
      t = setTimeout(function () { medir(); }, 180);
    }, { passive: true });

    var hero = cv.closest('.hero') || cv.parentElement;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        visivel = ents[0].isIntersecting;
        if (visivel) ligar(); else desligar();
      }, { threshold: 0 }).observe(hero);
    }
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) desligar(); else ligar();
    });

    if (!modesto) hero.addEventListener('pointermove', function (e) {
      if (e.pointerType === 'touch') return;
      var r = cv.getBoundingClientRect();
      ponteiro.x = e.clientX - r.left;
      ponteiro.y = e.clientY - r.top;
      ponteiro.tem = true;
    }, { passive: true });
    hero.addEventListener('pointerleave', function () { ponteiro.tem = false; }, { passive: true });
  }

  /* ---------------------------------------------------------
     2. MOCKUP DE DISPOSITIVOS NO HERO
     Entrou no lugar do terminal com digitacao: o comprador leigo
     reconhece a imagem de um site, nao a estetica de linha de comando.
     O HTML ja traz a peca montada — sem JS, ou com movimento reduzido,
     ela aparece pronta. Aqui so ligamos a montagem (uma vez a cada
     entrada em tela) e o movimento continuo, que fica pausado fora da
     viewport e com a aba escondida. Nada e medido nem escrito em estilo
     inline: a animacao inteira e CSS, entao nao ha layout forcado.
     --------------------------------------------------------- */
  function mockup() {
    var el = document.getElementById('heroMockup');
    if (!el || reduz) return;

    var recemMontado = false;

    function montar() {
      el.classList.remove('is-montando');
      void el.offsetWidth;                     // reinicia as animacoes
      el.classList.add('is-montando');
    }
    function ligar() { el.classList.add('is-ativo'); }
    function desligar() { el.classList.remove('is-ativo'); }

    /* O hero abre acima da dobra. Montar aqui, ainda dentro do script
       defer, evita o pisca de "pronto -> some -> monta" que sobraria se
       a montagem so comecasse no primeiro retorno do IntersectionObserver. */
    if (el.getBoundingClientRect().top < window.innerHeight) {
      recemMontado = true;
      ligar();
      montar();
    }

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting) {
          ligar();
          if (recemMontado) recemMontado = false; else montar();
        } else {
          desligar();
          recemMontado = false;
        }
      }, { threshold: 0.25 }).observe(el);
    } else if (!recemMontado) {
      ligar();
      montar();
    }

    document.addEventListener('visibilitychange', function () {
      if (document.hidden) desligar(); else ligar();
    });
  }

  /* ---------------------------------------------------------
     3. SCROLL REVEAL — fade + translateY, com stagger nos filhos
     --------------------------------------------------------- */
  function revelar() {
    // O CSS ja define o estado inicial e o stagger. Aqui nada e mutado
    // antes da hora: so observamos e marcamos quando entra na viewport.
    var todos = document.querySelectorAll('.reveal, [data-reveal-filhos] > *');
    if (!todos.length) return;
    if (reduz || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(todos, function (el) { el.classList.add('is-visible'); });
      document.querySelectorAll('.timeline').forEach(function (el) { el.classList.add('is-visible'); });
      return;
    }

    var obs = new IntersectionObserver(function (ents) {
      ents.forEach(function (ent) {
        if (!ent.isIntersecting) return;
        ent.target.classList.add('is-visible');
        obs.unobserve(ent.target);
        if (ent.target.hasAttribute('data-contador-grupo')) contar(ent.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    Array.prototype.forEach.call(todos, function (el) { obs.observe(el); });

    // a trilha da timeline se desenha ao entrar
    document.querySelectorAll('.timeline').forEach(function (tl) {
      var o = new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting) { tl.classList.add('is-visible'); o.disconnect(); }
      }, { threshold: 0.25 });
      o.observe(tl);
    });
  }

  /* ---------------------------------------------------------
     4. CONTADORES
     --------------------------------------------------------- */
  function contar(escopo) {
    var els = (escopo || document).querySelectorAll('[data-contador]');
    els.forEach(function (el) {
      if (el.dataset.feito === '1') return;
      el.dataset.feito = '1';
      var alvo = parseFloat(el.dataset.contador);
      if (isNaN(alvo)) return;
      var casas = (el.dataset.casas ? parseInt(el.dataset.casas, 10) : 0);

      if (reduz) { el.textContent = alvo.toFixed(casas).replace('.', ','); return; }

      var dur = 1250, ini = null;
      function passo(ts) {
        if (ini === null) ini = ts;
        var p = Math.min(1, (ts - ini) / dur);
        var e = 1 - Math.pow(1 - p, 3);                 // easeOutCubic
        el.textContent = (alvo * e).toFixed(casas).replace('.', ',');
        if (p < 1) requestAnimationFrame(passo);
        else el.textContent = alvo.toFixed(casas).replace('.', ',');
      }
      requestAnimationFrame(passo);
    });
  }

  function contadoresSoltos() {
    if (!('IntersectionObserver' in window) || reduz) { contar(document); return; }
    document.querySelectorAll('[data-contador-grupo]').forEach(function (g) {
      var o = new IntersectionObserver(function (ents) {
        if (ents[0].isIntersecting) { contar(g); o.disconnect(); }
      }, { threshold: 0.3 });
      o.observe(g);
    });
  }

  /* ---------------------------------------------------------
     5. SCROLL: header, barra de leitura e parallax
     Um unico listener, tudo dentro de um rAF.
     --------------------------------------------------------- */
  function aoRolar() {
    var header = document.querySelector('.header');
    var barra = document.querySelector('.progresso');
    var zap = document.querySelector('.zap');
    var pedindo = false;

    // O parallax saiu daqui: virou scroll-driven animation no CSS.
    // Sobra so o que precisa de estado — e nada aqui le geometria,
    // entao nenhum quadro de scroll forca layout.
    function calcular() {
      pedindo = false;
      var y = window.pageYOffset || document.documentElement.scrollTop;

      if (header) header.classList.toggle('is-scrolled', y > 24);

      if (barra) {
        var total = document.documentElement.scrollHeight - window.innerHeight;
        var p = total > 0 ? Math.min(1, Math.max(0, y / total)) : 0;
        barra.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      }

      if (zap) zap.classList.toggle('is-visivel', y > Math.min(480, window.innerHeight * 0.6));
    }

    function pedir() { if (!pedindo) { pedindo = true; requestAnimationFrame(calcular); } }

    window.addEventListener('scroll', pedir, { passive: true });
    window.addEventListener('resize', pedir, { passive: true });
    requestAnimationFrame(calcular);
  }

  /* ---------------------------------------------------------
     6. CURSOR SPARK — so em desktop com ponteiro fino
     Acompanha o cursor nativo, nao o substitui.
     --------------------------------------------------------- */
  function cursorSpark() {
    if (reduz) return;
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;

    var el = document.createElement('div');
    el.className = 'spark';
    el.setAttribute('aria-hidden', 'true');
    document.body.appendChild(el);

    var ax = window.innerWidth / 2, ay = window.innerHeight / 2;
    var bx = ax, by = ay, raf = null, ligado = false;

    function loop() {
      bx += (ax - bx) * 0.18;
      by += (ay - by) * 0.18;
      el.style.transform = 'translate3d(' + bx.toFixed(1) + 'px,' + by.toFixed(1) + 'px,0)';
      raf = requestAnimationFrame(loop);
    }

    document.addEventListener('pointermove', function (e) {
      if (e.pointerType && e.pointerType !== 'mouse') return;
      ax = e.clientX; ay = e.clientY;
      if (!ligado) { ligado = true; el.classList.add('is-ativo'); if (!raf) loop(); }
      var alvo = e.target.closest && e.target.closest('a,button,[role="button"],input,summary');
      el.classList.toggle('is-alvo', !!alvo);
    }, { passive: true });

    document.addEventListener('pointerleave', function () { el.classList.remove('is-ativo'); ligado = false; });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && raf) { cancelAnimationFrame(raf); raf = null; }
      else if (!document.hidden && ligado && !raf) loop();
    });
  }

  /* --------------------------------------------------------- */
  /* Enfeite nunca disputa a linha principal com o carregamento.
     Dois niveis de espera: o terminal (barato, e o efeito que se ve)
     entra logo depois do load; a malha de faiscas (pintura continua,
     a parte cara) so entra quando a pagina ja esta interativa. */
  function agendar(fn, atraso) {
    function pedir() {
      setTimeout(function () {
        if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 2000 });
        else fn();
      }, atraso);
    }
    if (document.readyState === 'complete') pedir();
    else window.addEventListener('load', pedir, { once: true });
  }

  function iniciar() {
    // essenciais: precisam responder desde o primeiro scroll
    mockup();
    revelar();
    contadoresSoltos();
    aoRolar();
    agendar(cursorSpark, 350);
    agendar(malha, 2200);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else { iniciar(); }
})();
