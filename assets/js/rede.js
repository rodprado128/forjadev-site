/* ForjaDev 2027.2 · rede de neurônios interativa (canvas 2D, sem dependências).
   Pontos formam dois hemisférios; os cinco sistemas são nós principais.
   Sinais percorrem a rede entre eles. O cursor afasta e acende os neurônios por perto; clique ou toque dispara sinais. */
(function () {
  'use strict';

  var secao = document.querySelector('[data-rede]');
  if (!secao) return;
  var tela = secao.querySelector('canvas');
  var ctx = tela.getContext('2d');
  var camadaRotulos = secao.querySelector('[data-rede-rotulos]');
  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var celular = window.matchMedia('(max-width: 767px)');

  /* ── Cores lidas do tema (variáveis semânticas) ── */
  var cor = {};
  function lerCores() {
    var cs = getComputedStyle(secao);
    cor.no = cs.getPropertyValue('--fd-texto-suave').trim();
    cor.ligacao = cs.getPropertyValue('--fd-borda-forte').trim();
    cor.acao = cs.getPropertyValue('--fd-acao').trim();
    cor.texto = cs.getPropertyValue('--fd-texto').trim();
    cor.superficie = cs.getPropertyValue('--fd-superficie').trim();
    cor.hubs = SISTEMAS.map(function (s) { return cs.getPropertyValue(s.cor).trim(); });
  }

  /* ── Sistemas: posição alvo na superfície e cor da paleta de dados ── */
  var SISTEMAS = [
    { nome: 'WhatsApp',   alvo: [-0.55, -0.10, 0.60],  cor: '--fd-g-dados-1' },
    { nome: 'Omie',       alvo: [0.45, 0.45, 0.25],    cor: '--fd-g-dados-4' },
    { nome: 'Salesforce', alvo: [-0.40, 0.45, -0.35],  cor: '--fd-g-dados-2' },
    { nome: 'Sankhya',    alvo: [0.50, -0.20, -0.65],  cor: '--fd-g-dados-3' },
    { nome: 'ClickUp',    alvo: [0.25, 0.15, 0.88],    cor: '--fd-g-dados-5' }
  ];

  /* ── Gerador pseudoaleatório com semente: a rede é sempre a mesma ── */
  var semente = 20272;
  function aleatorio() {
    semente = (semente * 1664525 + 1013904223) % 4294967296;
    return semente / 4294967296;
  }

  /* ── Forma: dois hemisférios com fenda central, base achatada e pequena massa posterior ── */
  // proporção aproximada de largura, comprimento e altura de um cérebro (1 : 1,25 : 0,8)
  var HX = 0.30, RX2 = 0.16, RY2 = 0.27, RZ2 = 0.86;
  function dentroDaForma(x, y, z) {
    if (Math.abs(x) < 0.035) return false;
    var hx = Math.abs(x) - HX;
    var yy = y < 0 ? y * 1.25 : y; // base mais achatada que o topo
    var dentroHemisferio = (hx * hx) / RX2 + (yy * yy) / RY2 + (z * z) / RZ2 <= 1;
    var cx = x / 0.5, cy = (y + 0.42) / 0.2, cz = (z + 0.62) / 0.28;
    var dentroPosterior = cx * cx + cy * cy + cz * cz <= 1;
    return dentroHemisferio || dentroPosterior;
  }
  function distanciaDaBorda(x, y, z) {
    var hx = Math.abs(x) - HX;
    var yy = y < 0 ? y * 1.25 : y;
    return 1 - Math.sqrt((hx * hx) / RX2 + (yy * yy) / RY2 + (z * z) / RZ2);
  }

  var nos = [];        // {x,y,z, px,py, s, prof, hub, luz}
  var ligacoes = [];   // [a,b]
  var vizinhos = [];   // lista de adjacência
  var hubs = [];       // índices dos nós de sistema

  function construir(total) {
    semente = 20272;
    nos = []; ligacoes = []; vizinhos = []; hubs = []; sinais = [];
    var tentativas = 0;
    while (nos.length < total && tentativas < total * 80) {
      tentativas++;
      var x = aleatorio() * 1.6 - 0.8, y = aleatorio() * 1.3 - 0.7, z = aleatorio() * 2 - 1;
      if (!dentroDaForma(x, y, z)) continue;
      // mais densidade perto da superfície, como córtex
      var borda = distanciaDaBorda(x, y, z);
      if (borda > 0.28 && aleatorio() < 0.72) continue;
      // relevo leve na superfície
      var ondula = 1 + 0.035 * Math.sin(x * 11) * Math.sin(z * 9 + y * 6);
      nos.push({ x: x * ondula, y: y * ondula, z: z * ondula, px: 0, py: 0, s: 1, prof: 0, hub: -1, luz: 0 });
    }

    // nós de sistema: o ponto mais próximo de cada alvo
    SISTEMAS.forEach(function (sis, i) {
      var melhor = -1, menor = Infinity;
      nos.forEach(function (n, j) {
        if (n.hub >= 0) return;
        var dx = n.x - sis.alvo[0], dy = n.y - sis.alvo[1], dz = n.z - sis.alvo[2];
        var d = dx * dx + dy * dy + dz * dz;
        if (d < menor) { menor = d; melhor = j; }
      });
      nos[melhor].hub = i;
      hubs.push(melhor);
    });

    // ligações: cada neurônio com os vizinhos mais próximos
    var k = 3;
    var vistos = {};
    for (var a = 0; a < nos.length; a++) vizinhos.push([]);
    function ligar(a, b) {
      var chave = a < b ? a + '-' + b : b + '-' + a;
      if (vistos[chave]) return;
      vistos[chave] = true;
      ligacoes.push([a, b]);
      vizinhos[a].push(b); vizinhos[b].push(a);
    }
    for (a = 0; a < nos.length; a++) {
      var limite = nos[a].hub >= 0 ? 7 : k;
      var perto = []; // mantém só os "limite" mais próximos, em ordem
      for (var b = 0; b < nos.length; b++) {
        if (a === b) continue;
        var dx = nos[a].x - nos[b].x, dy = nos[a].y - nos[b].y, dz = nos[a].z - nos[b].z;
        var d = dx * dx + dy * dy + dz * dz;
        if (perto.length === limite && d >= perto[limite - 1][0]) continue;
        var pos = perto.length;
        while (pos > 0 && perto[pos - 1][0] > d) pos--;
        perto.splice(pos, 0, [d, b]);
        if (perto.length > limite) perto.pop();
      }
      for (var m = 0; m < perto.length; m++) ligar(a, perto[m][1]);
    }

    // garante uma rede só: une componentes soltos pelo par mais próximo
    for (var volta = 0; volta < 40; volta++) {
      var comp = new Array(nos.length).fill(-1), fila = [0];
      comp[0] = 0;
      while (fila.length) {
        var atual = fila.shift();
        vizinhos[atual].forEach(function (v) { if (comp[v] < 0) { comp[v] = 0; fila.push(v); } });
      }
      var fora = [];
      comp.forEach(function (c, i) { if (c < 0) fora.push(i); });
      if (!fora.length) break;
      var par = null, menorD = Infinity;
      for (var i = 0; i < nos.length; i++) {
        if (comp[i] < 0) continue;
        for (var j = 0; j < fora.length; j++) {
          var n1 = nos[i], n2 = nos[fora[j]];
          var d2 = (n1.x - n2.x) * (n1.x - n2.x) + (n1.y - n2.y) * (n1.y - n2.y) + (n1.z - n2.z) * (n1.z - n2.z);
          if (d2 < menorD) { menorD = d2; par = [i, fora[j]]; }
        }
      }
      ligar(par[0], par[1]);
    }
  }

  function caminho(de, ate) {
    var anterior = new Array(nos.length).fill(-1), fila = [de];
    anterior[de] = de;
    while (fila.length) {
      var atual = fila.shift();
      if (atual === ate) break;
      for (var i = 0; i < vizinhos[atual].length; i++) {
        var v = vizinhos[atual][i];
        if (anterior[v] < 0) { anterior[v] = atual; fila.push(v); }
      }
    }
    if (anterior[ate] < 0) return null;
    var rota = [ate];
    while (rota[0] !== de) rota.unshift(anterior[rota[0]]);
    return rota;
  }

  /* ── Rótulos dos sistemas (HTML, para texto nítido e legível) ── */
  var rotulos = [];
  function criarRotulos() {
    camadaRotulos.textContent = '';
    rotulos = SISTEMAS.map(function (sis) {
      var el = document.createElement('span');
      el.className = 'rede-rotulo';
      el.style.setProperty('--cor', 'var(' + sis.cor + ')');
      el.textContent = sis.nome;
      camadaRotulos.appendChild(el);
      return el;
    });
  }

  /* ── Tamanho e projeção ── */
  var largura = 0, altura = 0, dpr = 1, raio = 1;
  function medir() {
    var r = tela.getBoundingClientRect();
    largura = r.width; altura = r.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    tela.width = Math.round(largura * dpr);
    tela.height = Math.round(altura * dpr);
    raio = Math.min(largura / (largura < 600 ? 1.75 : 2.3), altura / 1.55);
    rotulos.forEach(function (el) { el._largura = el.offsetWidth; });
  }

  var INCLINACAO = -0.12;
  var giro = 1.1, inclinaX = INCLINACAO, inclinaY = 0;
  var alvoInclinaX = INCLINACAO, alvoInclinaY = 0;
  var cursor = { x: -9999, y: -9999, ativo: false };

  function projetar() {
    var cy = Math.cos(giro + inclinaY), sy = Math.sin(giro + inclinaY);
    var cx = Math.cos(inclinaX), sx = Math.sin(inclinaX);
    var centroX = largura / 2, centroY = altura / 2 + raio * 0.04;
    var distancia = 3.2;
    for (var i = 0; i < nos.length; i++) {
      var n = nos[i];
      var x1 = n.x * cy + n.z * sy;
      var z1 = -n.x * sy + n.z * cy;
      var y1 = n.y * cx - z1 * sx;
      var z2 = n.y * sx + z1 * cx;
      var escala = distancia / (distancia - z2);
      var px = centroX + x1 * raio * escala;
      var py = centroY - y1 * raio * escala;
      n.prof = (z2 + 1) / 2; // 0 fundo, 1 frente
      n.s = escala;
      // o cursor afasta e acende os neurônios por perto
      if (cursor.ativo) {
        var dx = px - cursor.x, dy = py - cursor.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        var alcance = 120;
        if (d < alcance && d > 0.01) {
          var f = 1 - d / alcance;
          var empurra = f * f * 18;
          px += (dx / d) * empurra; py += (dy / d) * empurra;
          n.luz = Math.max(n.luz, f);
        }
      }
      n.px = px; n.py = py;
    }
  }

  /* ── Sinais que percorrem a rede ── */
  var sinais = [];
  function dispararSinal(de, ate, atraso) {
    if (de === ate) return;
    var rota = caminho(de, ate);
    if (!rota || rota.length < 2) return;
    sinais.push({ rota: rota, t: -(atraso || 0), velocidade: 7 + aleatorioReal() * 3 });
  }
  function aleatorioReal() { return Math.random(); }
  function sinalEntreSistemas() {
    var a = hubs[Math.floor(Math.random() * hubs.length)];
    var b = hubs[Math.floor(Math.random() * hubs.length)];
    if (a !== b) dispararSinal(a, b);
  }

  /* ── Desenho ── */
  var baldes = [[], [], [], []];
  function desenhar() {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, largura, altura);
    ctx.lineCap = 'round';

    // ligações em quatro faixas de profundidade (menos trocas de estilo)
    baldes[0].length = baldes[1].length = baldes[2].length = baldes[3].length = 0;
    var acesas = [];
    for (var i = 0; i < ligacoes.length; i++) {
      var a = nos[ligacoes[i][0]], b = nos[ligacoes[i][1]];
      var luz = Math.min(a.luz, b.luz);
      if (luz > 0.05) { acesas.push([a, b, luz]); continue; }
      var p = (a.prof + b.prof) / 2;
      baldes[p < 0.35 ? 0 : p < 0.55 ? 1 : p < 0.75 ? 2 : 3].push(a, b);
    }
    ctx.strokeStyle = cor.ligacao;
    ctx.lineWidth = 0.6;
    var alfas = [0.14, 0.3, 0.55, 0.85];
    for (var bk = 0; bk < 4; bk++) {
      var lista = baldes[bk];
      if (!lista.length) continue;
      ctx.globalAlpha = alfas[bk];
      ctx.beginPath();
      for (var j = 0; j < lista.length; j += 2) { ctx.moveTo(lista[j].px, lista[j].py); ctx.lineTo(lista[j + 1].px, lista[j + 1].py); }
      ctx.stroke();
    }
    ctx.strokeStyle = cor.acao;
    ctx.lineWidth = 1.2;
    for (i = 0; i < acesas.length; i++) {
      ctx.globalAlpha = 0.25 + acesas[i][2] * 0.75;
      ctx.beginPath(); ctx.moveTo(acesas[i][0].px, acesas[i][0].py); ctx.lineTo(acesas[i][1].px, acesas[i][1].py); ctx.stroke();
    }

    // neurônios
    for (i = 0; i < nos.length; i++) {
      var n = nos[i];
      if (n.hub >= 0) continue;
      var r = (0.6 + n.prof * 1.2) * n.s;
      if (n.luz > 0.05) {
        ctx.globalAlpha = 0.5 + n.luz * 0.5;
        ctx.fillStyle = cor.acao;
        r += n.luz * 2;
      } else {
        ctx.globalAlpha = 0.25 + n.prof * 0.75;
        ctx.fillStyle = cor.no;
      }
      ctx.beginPath(); ctx.arc(n.px, n.py, r, 0, 6.2832); ctx.fill();
    }

    // sinais
    ctx.fillStyle = cor.acao;
    for (i = 0; i < sinais.length; i++) {
      var s = sinais[i];
      if (s.t < 0) continue;
      var passo = Math.floor(s.t), k = s.t - passo;
      // rastro aceso nas ligações já percorridas
      ctx.strokeStyle = cor.acao;
      ctx.lineWidth = 1.6;
      for (var q = Math.max(0, passo - 4); q <= passo && q < s.rota.length - 1; q++) {
        var n1 = nos[s.rota[q]], n2 = nos[s.rota[q + 1]];
        ctx.globalAlpha = 0.85 * (1 - (passo - q) / 5);
        ctx.beginPath(); ctx.moveTo(n1.px, n1.py);
        if (q === passo) ctx.lineTo(n1.px + (n2.px - n1.px) * k, n1.py + (n2.py - n1.py) * k);
        else ctx.lineTo(n2.px, n2.py);
        ctx.stroke();
      }
      if (passo < s.rota.length - 1) {
        var na = nos[s.rota[passo]], nb = nos[s.rota[passo + 1]];
        var x = na.px + (nb.px - na.px) * k, y = na.py + (nb.py - na.py) * k;
        ctx.globalAlpha = 0.22; ctx.beginPath(); ctx.arc(x, y, 9, 0, 6.2832); ctx.fill();
        ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(x, y, 3.2, 0, 6.2832); ctx.fill();
      }
    }

    // nós de sistema
    for (i = 0; i < hubs.length; i++) {
      var h = nos[hubs[i]];
      var corHub = cor.hubs[i];
      var base = (5 + h.prof * 3) * h.s;
      ctx.globalAlpha = 0.18 + h.luz * 0.3; ctx.fillStyle = corHub;
      ctx.beginPath(); ctx.arc(h.px, h.py, base * 2.4, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 0.5 + h.prof * 0.5;
      ctx.beginPath(); ctx.arc(h.px, h.py, base, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = cor.superficie;
      ctx.beginPath(); ctx.arc(h.px, h.py, base * 0.42, 0, 6.2832); ctx.fill();

      var el = rotulos[i];
      var lx = h.px + base + 8;
      if (lx + (el._largura || 90) > largura - 8) lx = h.px - base - 8 - (el._largura || 90); // perto da borda, o rótulo vai para o outro lado
      el.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + (h.py - 13).toFixed(1) + 'px)';
      el.style.opacity = (0.35 + h.prof * 0.65).toFixed(2);
      el.style.zIndex = Math.round(h.prof * 10);
      el.classList.toggle('acesa', h.luz > 0.2);
    }
    ctx.globalAlpha = 1;
  }

  /* ── Laço ── */
  var anterior = 0, visivel = false, quadroId = 0, proximoSinal = 0;
  function quadro(t) {
    quadroId = 0;
    var dt = anterior ? Math.min((t - anterior) / 1000, 0.05) : 0.016;
    anterior = t;

    giro += dt * 0.12;
    inclinaX += (alvoInclinaX - inclinaX) * Math.min(dt * 3, 1);
    inclinaY += (alvoInclinaY - inclinaY) * Math.min(dt * 3, 1);

    for (var i = 0; i < nos.length; i++) nos[i].luz *= Math.pow(0.04, dt); // a luz apaga aos poucos
    projetar();

    proximoSinal -= dt;
    if (proximoSinal <= 0 && sinais.length < 6) { sinalEntreSistemas(); proximoSinal = 0.9 + Math.random() * 0.6; }
    for (i = sinais.length - 1; i >= 0; i--) {
      var s = sinais[i];
      s.t += dt * s.velocidade;
      if (s.t >= 0) {
        var passo = Math.min(Math.floor(s.t), s.rota.length - 1);
        nos[s.rota[passo]].luz = Math.max(nos[s.rota[passo]].luz, 0.7);
      }
      if (s.t >= s.rota.length + 4) sinais.splice(i, 1);
    }

    desenhar();
    if (visivel && !document.hidden) quadroId = requestAnimationFrame(quadro);
  }
  function iniciar() {
    if (quadroId || menosMovimento.matches) return;
    anterior = 0;
    quadroId = requestAnimationFrame(quadro);
  }
  function parar() { if (quadroId) cancelAnimationFrame(quadroId); quadroId = 0; }
  function quadroParado() { projetar(); desenhar(); }

  /* ── Interação ── */
  function posicao(e) {
    var r = tela.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  tela.addEventListener('pointermove', function (e) {
    var p = posicao(e);
    cursor.x = p.x; cursor.y = p.y; cursor.ativo = true;
    if (!menosMovimento.matches) {
      alvoInclinaY = (p.x / largura - 0.5) * 0.7;
      alvoInclinaX = INCLINACAO + (p.y / altura - 0.5) * 0.5;
    }
    if (menosMovimento.matches) {
      nos.forEach(function (n) { n.luz = 0; });
      quadroParado();
    }
  });
  tela.addEventListener('pointerleave', function () {
    cursor.ativo = false; alvoInclinaX = INCLINACAO; alvoInclinaY = 0;
    if (menosMovimento.matches) { nos.forEach(function (n) { n.luz = 0; }); quadroParado(); }
  });
  tela.addEventListener('pointerdown', function (e) {
    var p = posicao(e);
    cursor.x = p.x; cursor.y = p.y; cursor.ativo = true;
    if (menosMovimento.matches) return;
    // dispara um sinal do neurônio tocado para cada sistema
    var maisPerto = 0, menor = Infinity;
    nos.forEach(function (n, i) {
      var d = (n.px - p.x) * (n.px - p.x) + (n.py - p.y) * (n.py - p.y);
      if (d < menor) { menor = d; maisPerto = i; }
    });
    hubs.forEach(function (h, i) { dispararSinal(maisPerto, h, i * 0.6); });
    if (e.pointerType !== 'mouse') setTimeout(function () { cursor.ativo = false; }, 600);
  });

  /* ── Preparação ── */
  function preparar() {
    construir(celular.matches ? 380 : 720);
    lerCores();
    criarRotulos();
    medir();
    quadroParado();
  }
  preparar();

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entradas) {
      visivel = entradas[0].isIntersecting;
      if (visivel) iniciar(); else parar();
    }, { threshold: 0.05 }).observe(tela);
  } else { visivel = true; iniciar(); }

  document.addEventListener('visibilitychange', function () { if (!document.hidden && visivel) iniciar(); });
  var tempoRedimensionar = 0;
  window.addEventListener('resize', function () {
    clearTimeout(tempoRedimensionar);
    tempoRedimensionar = setTimeout(function () { medir(); quadroParado(); }, 120);
  });
  celular.addEventListener('change', function () { parar(); preparar(); if (visivel) iniciar(); });
  menosMovimento.addEventListener('change', function () { parar(); quadroParado(); if (visivel) iniciar(); });
  // troca de tema: relê as cores
  new MutationObserver(function () { lerCores(); quadroParado(); }).observe(document.documentElement, { attributes: true, attributeFilter: ['data-tema'] });
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function () { lerCores(); quadroParado(); });
})();
