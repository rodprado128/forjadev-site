/* ForjaDev 2027.2 · comportamento do site. Sem dependências. */
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

  /* ── Surgir e encadear ao entrar na tela ── */
  document.querySelectorAll('[data-encadear]').forEach(function (grupo) {
    Array.prototype.forEach.call(grupo.children, function (filho, i) { filho.style.setProperty('--atraso', Math.min(i, 5)); });
  });
  var alvos = document.querySelectorAll('[data-surgir], [data-encadear]');
  function revelar(el) {
    el.classList.add('visivel');
    // depois de surgir, o atraso sai para o hover responder na hora
    setTimeout(function () {
      el.style.setProperty('--atraso', 0);
      Array.prototype.forEach.call(el.children, function (f) { f.style.setProperty('--atraso', 0); });
    }, 1400);
  }
  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (en) {
        if (en.isIntersecting) { revelar(en.target); observador.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    alvos.forEach(function (el) { observador.observe(el); });
  } else {
    alvos.forEach(revelar);
  }

  /* ── Fluxo da abertura: um ponto percorre o caminho uma vez ── */
  var fluxo = document.querySelector('[data-fluxo]');
  var rodandoFluxo = false;
  function horaAgora() {
    var d = new Date();
    return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
  }
  function rodarFluxo() {
    if (!fluxo || rodandoFluxo) return;
    var trilha = fluxo.querySelector('.fluxo-trilha');
    var ponto = fluxo.querySelector('.fluxo-ponto');
    var hora = fluxo.querySelector('[data-fluxo-hora]');
    var comprimento = trilha.getTotalLength();
    var fim = trilha.getPointAtLength(comprimento);

    if (menosMovimento.matches) {
      ponto.setAttribute('transform', 'translate(' + fim.x + ' ' + fim.y + ')');
      hora.textContent = horaAgora();
      fluxo.setAttribute('data-estado', 'feito');
      return;
    }

    rodandoFluxo = true;
    fluxo.removeAttribute('data-estado');
    ponto.setAttribute('transform', 'translate(72 0)');
    setTimeout(function () {
      fluxo.setAttribute('data-estado', 'andando');
      var inicio = null;
      var duracao = 1200; // --fd-g-dur-fluxo, linear
      function quadro(t) {
        if (inicio === null) inicio = t;
        var k = limitar((t - inicio) / duracao, 0, 1);
        var pt = trilha.getPointAtLength(k * comprimento);
        ponto.setAttribute('transform', 'translate(' + pt.x.toFixed(2) + ' ' + pt.y.toFixed(2) + ')');
        if (k < 1) { requestAnimationFrame(quadro); return; }
        hora.textContent = horaAgora();
        fluxo.setAttribute('data-estado', 'feito');
        rodandoFluxo = false;
      }
      requestAnimationFrame(quadro);
    }, 450);
  }
  if (fluxo) {
    // o conteúdo principal aparece primeiro; o fluxo começa depois
    setTimeout(rodarFluxo, 1100);
    var repetir = fluxo.querySelector('[data-fluxo-repetir]');
    if (repetir) repetir.addEventListener('click', rodarFluxo);
  }

  /* ── Palavras que acendem conforme a leitura ── */
  var paragrafo = document.querySelector('[data-palavras]');
  var palavrasAcesas = [];
  if (paragrafo) {
    var texto = paragrafo.textContent.trim().split(/\s+/);
    paragrafo.textContent = '';
    texto.forEach(function (p, i) {
      var s = document.createElement('span');
      s.className = 'p';
      s.textContent = p;
      paragrafo.appendChild(s);
      if (i < texto.length - 1) paragrafo.appendChild(document.createTextNode(' '));
      palavrasAcesas.push(s);
    });
    paragrafo.setAttribute('data-palavras-pronto', '');
  }

  /* ── Holofote nos cartões do bento ── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.bento-cartao').forEach(function (c) {
      c.addEventListener('pointermove', function (e) {
        var r = c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
  }

  /* ── Exemplos: rolagem horizontal fixada no desktop ── */
  var secaoHorizontal = document.querySelector('[data-horizontal]');
  var trilho = document.querySelector('[data-trilho]');
  var desktopLargo = window.matchMedia('(min-width: 1200px)');
  var excesso = 0;
  function configurarHorizontal() {
    if (!secaoHorizontal || !trilho) return;
    var ativo = desktopLargo.matches && !menosMovimento.matches;
    secaoHorizontal.classList.toggle('horizontal-ativo', ativo);
    if (!ativo) {
      secaoHorizontal.style.height = '';
      trilho.style.transform = '';
      excesso = 0;
      return;
    }
    trilho.style.transform = '';
    excesso = Math.max(0, trilho.scrollWidth - window.innerWidth);
    secaoHorizontal.style.height = (window.innerHeight + excesso) + 'px';
  }

  /* ── Etapas: trilho enche e etapas acendem ── */
  var passos = document.querySelector('[data-passos]');
  var itensPasso = passos ? passos.querySelectorAll('.passo') : [];
  var trilhoCheio = passos ? passos.querySelector('.passos-trilho-cheio') : null;

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
      var p = menosMovimento.matches ? 1 : limitar((alturaJanela * 0.82 - r.top) / (r.height + alturaJanela * 0.3), 0, 1);
      var acesas = Math.round(p * palavrasAcesas.length);
      for (var i = 0; i < palavrasAcesas.length; i++) palavrasAcesas[i].classList.toggle('acesa', i < acesas);
    }

    if (passos && trilhoCheio) {
      var rp = passos.getBoundingClientRect();
      var marca = alturaJanela * 0.6;
      var pp = limitar((marca - rp.top) / rp.height, 0, 1);
      trilhoCheio.style.setProperty('--progresso', pp.toFixed(4));
      itensPasso.forEach(function (li) {
        var rl = li.getBoundingClientRect();
        li.classList.toggle('ativo', menosMovimento.matches || rl.top + 24 < marca);
      });
    }

    if (excesso > 0) {
      var rs = secaoHorizontal.getBoundingClientRect();
      var percurso = secaoHorizontal.offsetHeight - alturaJanela;
      var ph = percurso > 0 ? limitar(-rs.top / percurso, 0, 1) : 0;
      trilho.style.transform = 'translate3d(' + (-ph * excesso).toFixed(1) + 'px, 0, 0)';
    }

    var ativa = -1;
    secoesNav.forEach(function (s, i) {
      if (s && s.getBoundingClientRect().top < alturaJanela * 0.4) ativa = i;
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
  window.addEventListener('resize', function () { configurarHorizontal(); agendar(); });
  desktopLargo.addEventListener('change', function () { configurarHorizontal(); agendar(); });
  menosMovimento.addEventListener('change', function () { configurarHorizontal(); agendar(); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { configurarHorizontal(); agendar(); });
  configurarHorizontal();
  aoRolar();

  /* ── Formulário de diagnóstico ── */
  var form = document.querySelector('[data-formulario]');
  if (form) {
    var sucesso = document.querySelector('[data-sucesso]');
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
      botao.setAttribute('data-estado', 'carregando');
      botao.setAttribute('aria-busy', 'true');
      // Versão local: ainda não há envio real. Ligar aqui ao serviço de e-mail ou CRM antes de publicar.
      setTimeout(function () {
        form.hidden = true;
        sucesso.hidden = false;
        sucesso.setAttribute('tabindex', '-1');
        sucesso.focus({ preventScroll: true });
      }, 1100);
    });
  }
})();
