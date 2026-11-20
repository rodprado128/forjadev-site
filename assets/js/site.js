/* ForjaDev 2027.2 · comportamento do site. Sem dependências.
   O cérebro de fundo e os capítulos-neurônio ficam em cerebro.js. */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var escuroSistema = window.matchMedia('(prefers-color-scheme: dark)');
  var limitar = function (v, a, b) { return Math.min(Math.max(v, a), b); };

  /* ── Tema: claro, escuro ou automático ── */
  var botaoTema = document.querySelector('[data-tema-botao]');
  function temaAtual() {
    var t = raiz.getAttribute('data-tema');
    if (t) return t;
    return escuroSistema.matches ? 'escuro' : 'claro';
  }
  function rotularTema() {
    if (!botaoTema) return;
    botaoTema.setAttribute('aria-label', temaAtual() === 'escuro' ? 'Mudar para tema claro' : 'Mudar para tema escuro');
  }
  function aplicarTema(novo) {
    raiz.setAttribute('data-tema', novo);
    try { localStorage.setItem('fd-tema', novo); } catch (e) {}
    rotularTema();
  }
  if (botaoTema) {
    botaoTema.addEventListener('click', function () {
      var novo = temaAtual() === 'escuro' ? 'claro' : 'escuro';
      if (document.startViewTransition && !menosMovimento.matches) {
        document.startViewTransition(function () { aplicarTema(novo); });
      } else {
        aplicarTema(novo);
      }
    });
    rotularTema();
    escuroSistema.addEventListener('change', rotularTema);
  }

  /* ── Menu do celular ── */
  var botaoMenu = document.querySelector('[data-menu-botao]');
  var menu = document.querySelector('[data-menu]');
  function fecharMenu() {
    if (!menu || menu.hidden) return;
    menu.hidden = true;
    botaoMenu.setAttribute('aria-expanded', 'false');
    botaoMenu.setAttribute('aria-label', 'Abrir menu');
  }
  if (botaoMenu && menu) {
    botaoMenu.addEventListener('click', function () {
      var abrir = menu.hidden;
      menu.hidden = !abrir;
      botaoMenu.setAttribute('aria-expanded', String(abrir));
      botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu' : 'Abrir menu');
    });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) fecharMenu(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') fecharMenu(); });
    document.addEventListener('click', function (e) { if (!e.target.closest('[data-nav]')) fecharMenu(); });
  }

  /* ── Título cinético: separa as palavras para subirem em sequência ── */
  document.querySelectorAll('[data-cinetico]').forEach(function (el) {
    var palavras = el.textContent.trim().split(/\s+/);
    el.setAttribute('aria-label', el.textContent.trim());
    el.textContent = '';
    palavras.forEach(function (p, i) {
      var caixa = document.createElement('span');
      caixa.className = 'palavra';
      caixa.setAttribute('aria-hidden', 'true');
      var dentro = document.createElement('span');
      dentro.textContent = p;
      dentro.style.setProperty('--i', i);
      if (i === palavras.length - 1) dentro.classList.add('destaque');
      caixa.appendChild(dentro);
      el.appendChild(caixa);
      if (i < palavras.length - 1) el.appendChild(document.createTextNode(' '));
    });
  });

  /* ── Surgir ao entrar na tela (rodapé) ── */
  var alvos = document.querySelectorAll('[data-surgir]');
  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('visivel'); observador.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    alvos.forEach(function (el) { observador.observe(el); });
  } else {
    alvos.forEach(function (el) { el.classList.add('visivel'); });
  }

  /* ── Palavras que acendem conforme a leitura ── */
  var paragrafo = document.querySelector('[data-palavras]');
  var palavrasAcesas = [];
  if (paragrafo) {
    var texto = paragrafo.textContent.trim().split(/\s+/);
    paragrafo.setAttribute('aria-label', paragrafo.textContent.trim());
    paragrafo.textContent = '';
    texto.forEach(function (p, i) {
      var s = document.createElement('span');
      s.className = 'p';
      s.setAttribute('aria-hidden', 'true');
      s.textContent = p;
      paragrafo.appendChild(s);
      if (i < texto.length - 1) paragrafo.appendChild(document.createTextNode(' '));
      palavrasAcesas.push(s);
    });
    paragrafo.setAttribute('data-palavras-pronto', '');
  }

  /* ── Navegação: estado ao rolar e seção ativa ── */
  var nav = document.querySelector('[data-nav]');
  var linksNav = document.querySelectorAll('.nav-links a');
  var secoesNav = Array.prototype.map.call(linksNav, function (a) { return document.querySelector(a.getAttribute('href')); });

  var barra = document.querySelector('.progresso');
  var progressoNativo = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll()');

  function aoRolar() {
    var y = window.scrollY;
    var alturaJanela = window.innerHeight;

    if (nav) nav.toggleAttribute('data-rolado', y > 8);

    if (barra && !progressoNativo && !menosMovimento.matches) {
      var max = document.documentElement.scrollHeight - alturaJanela;
      barra.style.transform = 'scaleX(' + (max > 0 ? y / max : 0) + ')';
    }

    if (paragrafo && palavrasAcesas.length) {
      var r = paragrafo.getBoundingClientRect();
      var p = menosMovimento.matches ? 1 : limitar((alturaJanela * 0.85 - r.top) / (r.height + alturaJanela * 0.3), 0, 1);
      var acesas = Math.round(p * palavrasAcesas.length);
      for (var i = 0; i < palavrasAcesas.length; i++) palavrasAcesas[i].classList.toggle('acesa', i < acesas);
    }

    var ativa = -1;
    secoesNav.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top < alturaJanela * 0.5) ativa = i;
    });
    linksNav.forEach(function (a, i) {
      if (i === ativa) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
  }

  var agendado = false;
  function agendar() {
    if (agendado) return;
    agendado = true;
    requestAnimationFrame(function () { agendado = false; aoRolar(); });
  }
  window.addEventListener('scroll', agendar, { passive: true });
  window.addEventListener('resize', agendar);
  aoRolar();

  /* ── Formulário de diagnóstico ── */
  var form = document.querySelector('[data-formulario]');
  if (form) {
    var sucesso = document.querySelector('[data-sucesso]');
    var erro = form.querySelector('[data-erro]');
    var emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    function validarCampo(input) {
      var campo = input.closest('.fd-campo');
      var ajuda = campo.querySelector('[data-ajuda]');
      var valor = input.value.trim();
      var ok = true;
      if (input.required && !valor) ok = false;
      if (ok && input.type === 'email' && valor && !emailValido.test(valor)) ok = false;
      if (ok) {
        campo.removeAttribute('data-estado');
        input.removeAttribute('aria-invalid');
        if (ajuda) ajuda.hidden = true;
      } else {
        campo.setAttribute('data-estado', 'erro');
        input.setAttribute('aria-invalid', 'true');
        if (ajuda) { ajuda.hidden = false; ajuda.id = ajuda.id || input.id + '-ajuda'; input.setAttribute('aria-describedby', ajuda.id); }
      }
      return ok;
    }
    form.querySelectorAll('input[required]').forEach(function (inp) {
      inp.addEventListener('blur', function () { if (inp.value) validarCampo(inp); });
      inp.addEventListener('input', function () { if (inp.closest('.fd-campo').hasAttribute('data-estado')) validarCampo(inp); });
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var obrigatorios = form.querySelectorAll('input[required]');
      var primeiroErro = null;
      obrigatorios.forEach(function (inp) { if (!validarCampo(inp) && !primeiroErro) primeiroErro = inp; });
      if (primeiroErro) { primeiroErro.focus(); return; }

      var botao = form.querySelector('[type="submit"]');
      if (botao.getAttribute('aria-busy') === 'true') return; // evita envio duplo
      botao.setAttribute('data-estado', 'carregando');
      botao.setAttribute('aria-busy', 'true');
      erro.hidden = true;

      // O lead vai para a planilha "ForjaDev · Leads do site" pelo Apps Script em form.action
      // (código de referência em integracoes/leads-google-sheets.gs).
      var dados = new URLSearchParams(new FormData(form));
      dados.append('origem', location.href);
      dados.append('navegador', navigator.userAgent);

      fetch(form.action, { method: 'POST', body: dados })
        .then(function (r) { return r.json(); })
        .then(function (resposta) {
          if (!resposta || !resposta.ok) throw new Error('recusado');
          form.hidden = true;
          sucesso.hidden = false;
          sucesso.setAttribute('tabindex', '-1');
          sucesso.focus({ preventScroll: true });
          // o cérebro dispara o neurônio do diagnóstico para todos os sistemas
          document.dispatchEvent(new CustomEvent('fd:enviado'));
        })
        .catch(function () {
          erro.hidden = false;
        })
        .then(function () {
          botao.removeAttribute('data-estado');
          botao.removeAttribute('aria-busy');
        });
    });
  }
})();
