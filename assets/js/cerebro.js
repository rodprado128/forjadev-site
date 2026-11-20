/* ForjaDev 2027.2 · cérebro em tela cheia (canvas 2D, sem dependências).
   O site inteiro vive dentro da rede: cada capítulo ([data-neuronio]) é um neurônio.
   A rolagem leva a câmera de um neurônio ao próximo enquanto um sinal percorre o caminho entre eles.
   A luz segue o cursor. Clique ou toque fora dos painéis dispara sinais para os cinco sistemas. */
(function () {
  'use strict';

  var tela = document.querySelector('[data-cerebro]');
  if (!tela || !tela.getContext) return;
  var ctx = tela.getContext('2d');
  var camadaRotulos = document.querySelector('[data-cerebro-rotulos]');
  var raiz = document.documentElement;
  var menosMovimento = window.matchMedia('(prefers-reduced-motion: reduce)');
  var celular = window.matchMedia('(max-width: 767px)');
  var escuroSistema = window.matchMedia('(prefers-color-scheme: dark)');

  /* ── Sistemas: posição alvo na superfície e cor da paleta de dados ── */
  var SISTEMAS = [
    { nome: 'WhatsApp',   alvo: [-0.55, -0.10, 0.60],  cor: '--fd-g-dados-1' },
    { nome: 'Omie',       alvo: [0.45, 0.45, 0.25],    cor: '--fd-g-dados-4' },
    { nome: 'Salesforce', alvo: [-0.40, 0.45, -0.35],  cor: '--fd-g-dados-2' },
    { nome: 'Sankhya',    alvo: [0.50, -0.20, -0.65],  cor: '--fd-g-dados-3' },
    { nome: 'ClickUp',    alvo: [0.25, 0.15, 0.88],    cor: '--fd-g-dados-5' }
  ];
  function indiceSistema(nome) {
    for (var i = 0; i < SISTEMAS.length; i++) if (SISTEMAS[i].nome === nome) return i;
    return -1;
  }

  /* ── Câmera de cada capítulo ──
     alvo: ponto do cérebro que vira o neurônio do capítulo (ou hub: índice do sistema)
     giro e inclina: rotação da rede · zoom: aproximação · foco: onde o neurônio fica na tela (fração da largura e da altura)
     fio: liga o neurônio ao painel do capítulo */
  var CAMERAS = {
    'inicio':        { alvo: [0, 0.05, 0.05],     giro: 1.1, inclina: -0.12, zoom: 0.9,  foco: [0.72, 0.55], fio: false },
    'problema':      { hub: 0,                    giro: 0.35, inclina: -0.05, zoom: 1.8, foco: [0.78, 0.52], fio: true },
    'rede':          { alvo: [0, 0.05, 0],        giro: 1.9, inclina: -0.25, zoom: 0.85, foco: [0.7, 0.55],  fio: false },
    'o-que-fazemos': { alvo: [0.4, 0.3, 0.35],    giro: 2.7, inclina: -0.1,  zoom: 1.8,  foco: [0.28, 0.55], fio: true },
    'como-funciona': { alvo: [-0.4, 0.15, -0.25], giro: 3.6, inclina: 0.12,  zoom: 2.1,  foco: [0.72, 0.55], fio: true },
    'exemplos':      { alvo: [0, 0.05, 0],        giro: 4.5, inclina: -0.2,  zoom: 0.9,  foco: [0.3, 0.55],  fio: false },
    'socios':        { alvo: [0.45, -0.25, -0.45], giro: 5.3, inclina: -0.05, zoom: 2.4, foco: [0.2, 0.55],  fio: true },
    'contato':       { alvo: [0, 0.25, 0.1],      giro: 6.2, inclina: -0.15, zoom: 1.3,  foco: [0.8, 0.55],  fio: true }
  };
  var CAMERA_PADRAO = { alvo: [0, 0, 0], giro: 0, inclina: -0.12, zoom: 1, foco: [0.5, 0.55], fio: false };

  /* ── Cores lidas do tema, resolvidas para rgb() por um elemento de prova ── */
  var prova = document.createElement('span');
  prova.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden';
  document.body.appendChild(prova);
  function resolver(variavel) {
    prova.style.color = 'var(' + variavel + ')';
    return getComputedStyle(prova).color;
  }
  function comAlfa(rgb, a) {
    var m = rgb.match(/[\d.]+/g);
    if (!m || m.length < 3) return 'rgba(76,75,255,' + a + ')';
    return 'rgba(' + m[0] + ',' + m[1] + ',' + m[2] + ',' + a + ')';
  }
  var cor = {};
  function temaEscuro() {
    var t = raiz.getAttribute('data-tema');
    return t ? t === 'escuro' : escuroSistema.matches;
  }
  function lerCores() {
    cor.no = resolver('--fd-texto-suave');
    cor.ligacao = resolver('--fd-borda-forte');
    cor.acao = resolver('--fd-acao');
    cor.superficie = resolver('--fd-superficie');
    cor.hubs = SISTEMAS.map(function (s) { return resolver(s.cor); });
    cor.escuro = temaEscuro();
    cor.luzCentro = comAlfa(cor.acao, cor.escuro ? 0.16 : 0.09);
    cor.luzFim = comAlfa(cor.acao, 0);
  }

  /* ── Gerador pseudoaleatório com semente: a rede é sempre a mesma ── */
  var semente = 20272;
  function aleatorio() {
    semente = (semente * 1664525 + 1013904223) % 4294967296;
    return semente / 4294967296;
  }

  /* ── Forma: dois hemisférios com fenda central, base achatada e pequena massa posterior ── */
  var HX = 0.30, RX2 = 0.16, RY2 = 0.27, RZ2 = 0.86;
  function dentroDaForma(x, y, z) {
    if (Math.abs(x) < 0.035) return false;
    var hx = Math.abs(x) - HX;
    var yy = y < 0 ? y * 1.25 : y;
    var dentroHemisferio = (hx * hx) / RX2 + (yy * yy) / RY2 + (z * z) / RZ2 <= 1;
    var cx = x / 0.5, cy = (y + 0.42) / 0.2, cz = (z + 0.62) / 0.28;
    return dentroHemisferio || cx * cx + cy * cy + cz * cz <= 1;
  }
  function distanciaDaBorda(x, y, z) {
    var hx = Math.abs(x) - HX;
    var yy = y < 0 ? y * 1.25 : y;
    return 1 - Math.sqrt((hx * hx) / RX2 + (yy * yy) / RY2 + (z * z) / RZ2);
  }

  var nos = [], ligacoes = [], vizinhos = [], hubs = [], sinais = [];
  function dist2(n, x, y, z) { var dx = n.x - x, dy = n.y - y, dz = n.z - z; return dx * dx + dy * dy + dz * dz; }

  function construir(total) {
    semente = 20272;
    nos = []; ligacoes = []; vizinhos = []; hubs = []; sinais = [];
    var tentativas = 0;
    while (nos.length < total && tentativas < total * 80) {
      tentativas++;
      var x = aleatorio() * 1.6 - 0.8, y = aleatorio() * 1.3 - 0.7, z = aleatorio() * 2 - 1;
      if (!dentroDaForma(x, y, z)) continue;
      if (distanciaDaBorda(x, y, z) > 0.28 && aleatorio() < 0.72) continue; // mais densidade perto da superfície, como córtex
      var ondula = 1 + 0.035 * Math.sin(x * 11) * Math.sin(z * 9 + y * 6);
      nos.push({ x: x * ondula, y: y * ondula, z: z * ondula, px: 0, py: 0, s: 1, prof: 0, hub: -1, luz: 0, f: 0, g: 0, fase: nos.length * 2.39996 });
    }

    SISTEMAS.forEach(function (sis, i) {
      var j = maisPerto3d(sis.alvo, true);
      nos[j].hub = i;
      hubs.push(j);
    });

    // ligações: cada neurônio com os vizinhos mais próximos
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
      var limite = nos[a].hub >= 0 ? 7 : 3;
      var perto = [];
      for (var b = 0; b < nos.length; b++) {
        if (a === b) continue;
        var d = dist2(nos[a], nos[b].x, nos[b].y, nos[b].z);
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
          var d2 = dist2(nos[i], nos[fora[j]].x, nos[fora[j]].y, nos[fora[j]].z);
          if (d2 < menorD) { menorD = d2; par = [i, fora[j]]; }
        }
      }
      ligar(par[0], par[1]);
    }
  }

  function maisPerto3d(p, pularHubs) {
    var melhor = 0, menor = Infinity;
    for (var i = 0; i < nos.length; i++) {
      if (pularHubs && nos[i].hub >= 0) continue;
      var d = dist2(nos[i], p[0], p[1], p[2]);
      if (d < menor) { menor = d; melhor = i; }
    }
    return melhor;
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

  /* ── Capítulos lidos do próprio HTML ── */
  var capitulos = Array.prototype.map.call(document.querySelectorAll('[data-neuronio]'), function (el) {
    var id = el.getAttribute('data-neuronio');
    return {
      id: id,
      el: el,
      painel: el.querySelector('.painel'),
      cam: CAMERAS[id] || CAMERA_PADRAO,
      subs: Array.prototype.slice.call(el.querySelectorAll('[data-sub]')),
      exemplos: Array.prototype.slice.call(el.querySelectorAll('[data-de]')),
      ancora: 0, subNos: [], rotaProximo: null, peso: 0, subAtivo: -1, subFoco: -1
    };
  });
  if (!capitulos.length) return;

  function prepararCapitulos() {
    capitulos.forEach(function (cap) {
      cap.ancora = cap.cam.hub != null ? hubs[cap.cam.hub] : maisPerto3d(cap.cam.alvo, true);
      cap.subNos = [];
      if (!cap.subs.length) return;
      // sub-neurônios espalhados em volta da âncora (amostragem pelo ponto mais distante)
      var an = nos[cap.ancora];
      var candidatos = nos.map(function (n, j) { return [dist2(n, an.x, an.y, an.z), j]; })
        .sort(function (p, q) { return p[0] - q[0]; })
        .slice(1, celular.matches ? 45 : 75)
        .map(function (p) { return p[1]; })
        .filter(function (j) { return nos[j].hub < 0; });
      var escolhidos = [cap.ancora];
      cap.subs.forEach(function () {
        var melhor = candidatos[0], maior = -1;
        candidatos.forEach(function (j) {
          if (escolhidos.indexOf(j) >= 0) return;
          var menor = Infinity;
          escolhidos.forEach(function (q) { menor = Math.min(menor, dist2(nos[j], nos[q].x, nos[q].y, nos[q].z)); });
          if (menor > maior) { maior = menor; melhor = j; }
        });
        escolhidos.push(melhor);
        cap.subNos.push(melhor);
      });
    });
    capitulos.forEach(function (cap, i) {
      var prox = capitulos[i + 1];
      cap.rotaProximo = prox ? caminho(cap.ancora, prox.ancora) : null;
    });
  }

  /* ── Rótulos (HTML, para texto nítido) ── */
  var rotulosHub = [];
  function criarRotulos() {
    camadaRotulos.textContent = '';
    rotulosHub = SISTEMAS.map(function (sis) {
      var el = document.createElement('span');
      el.className = 'cerebro-rotulo';
      el.style.setProperty('--cor', 'var(' + sis.cor + ')');
      el.textContent = sis.nome;
      camadaRotulos.appendChild(el);
      return el;
    });
    capitulos.forEach(function (cap) {
      cap.rotulos = cap.subs.map(function (s) {
        var el = document.createElement('span');
        el.className = 'cerebro-rotulo cerebro-rotulo--sub';
        el.textContent = s.getAttribute('data-sub');
        camadaRotulos.appendChild(el);
        return el;
      });
    });
  }
  function medirRotulos() {
    rotulosHub.forEach(function (el) { el._largura = el.offsetWidth; });
    capitulos.forEach(function (cap) { cap.rotulos.forEach(function (el) { el._largura = el.offsetWidth; }); });
  }

  /* ── Tamanho ── */
  var largura = 0, altura = 0, dpr = 1, raio = 1;
  function medir() {
    largura = window.innerWidth; altura = window.innerHeight;
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    tela.width = Math.round(largura * dpr);
    tela.height = Math.round(altura * dpr);
    raio = celular.matches ? Math.min(largura / 2, altura / 2.4) : Math.min(largura / 2.6, altura / 1.9);
    medirRotulos();
  }

  /* ── Rolagem → progresso contínuo entre capítulos (0 a n-1) ── */
  var progresso = 0, progressoSuave = 0;
  // Cada capítulo tem um trecho de rolagem em que fica 100% em foco: o centro dele no centro da tela
  // ou, se for mais alto que a tela, todo o tempo em que ele cobre a tela. Entre dois trechos, a câmera viaja.
  function lerProgresso() {
    var y = window.scrollY, inicio = [], fim = [];
    for (var i = 0; i < capitulos.length; i++) {
      var r = capitulos[i].el.getBoundingClientRect();
      var topo = r.top + y;
      if (r.height > altura) { inicio.push(topo); fim.push(topo + r.height - altura); }
      else { var c = topo + r.height / 2 - altura / 2; inicio.push(c); fim.push(c); }
    }
    if (y <= fim[0]) return 0;
    for (i = 0; i < capitulos.length - 1; i++) {
      if (y < inicio[i + 1]) return y <= fim[i] ? i : i + (y - fim[i]) / Math.max(1, inicio[i + 1] - fim[i]);
    }
    return capitulos.length - 1;
  }

  /* ── Sinais que percorrem a rede ── */
  function dispararSinal(de, ate, atraso, velocidade) {
    if (de === ate) return;
    var rota = caminho(de, ate);
    if (!rota || rota.length < 2) return;
    sinais.push({ rota: rota, t: -(atraso || 0), velocidade: velocidade || 7 + Math.random() * 3 });
  }

  /* ── Cursor e luz ── */
  var cursor = { x: 0, y: 0, ativo: false };
  var luz = { x: 0, y: 0, forca: 0.4, iniciada: false };
  var paralaxe = { x: 0, y: 0 };
  var deriva = 0;
  var vivo = 0; // relógio do movimento contínuo (segundos), parado com movimento reduzido

  /* ── Projeção: o ponto entre as duas âncoras cai no foco da tela ── */
  var cam = { giro: 0, inclina: 0, zoom: 1, fx: 0.5, fy: 0.5 };
  function projetar() {
    var cy = Math.cos(cam.giro), sy = Math.sin(cam.giro);
    var cx = Math.cos(cam.inclina), sx = Math.sin(cam.inclina);
    var D = 3.2, R = raio * cam.zoom;
    function p3(x, y, z, saida) {
      var x1 = x * cy + z * sy;
      var z1 = -x * sy + z * cy;
      var y1 = y * cx - z1 * sx;
      var z2 = y * sx + z1 * cx;
      var e = D / (D - z2);
      saida[0] = x1 * R * e; saida[1] = -y1 * R * e; saida[2] = z2; saida[3] = e;
    }
    var q = [0, 0, 0, 0];
    p3(cam.alvo[0], cam.alvo[1], cam.alvo[2], q);
    var ox = cam.fx * largura - q[0], oy = cam.fy * altura - q[1];
    var alcance = 120, alcanceLuz = Math.min(170, raio * 0.5);
    var onda = menosMovimento.matches ? 0 : 0.014; // cada neurônio flutua no próprio ritmo
    for (var i = 0; i < nos.length; i++) {
      var n = nos[i];
      if (onda) {
        var fa = n.fase;
        p3(n.x + onda * Math.sin(vivo * 0.7 + fa), n.y + onda * Math.cos(vivo * 0.55 + fa * 1.3), n.z + onda * Math.sin(vivo * 0.5 + fa * 0.7), q);
      } else p3(n.x, n.y, n.z, q);
      var px = ox + q[0], py = oy + q[1];
      n.prof = Math.min(1, Math.max(0, (q[2] + 1) / 2));
      n.s = q[3];
      // o cursor afasta de leve os neurônios por perto
      if (cursor.ativo && !menosMovimento.matches) {
        var dx = px - cursor.x, dy = py - cursor.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < alcance && d > 0.01) {
          var f = 1 - d / alcance;
          var empurra = f * f * 14;
          px += (dx / d) * empurra; py += (dy / d) * empurra;
        }
      }
      n.px = px; n.py = py;
      // f: luz forte e curta (acende na cor de ação) · g: luz larga e suave (só clareia)
      var lx = px - luz.x, ly = py - luz.y, dl = Math.sqrt(lx * lx + ly * ly);
      var forte = Math.max(0, 1 - dl / alcanceLuz);
      n.f = forte * forte * luz.forca;
      n.g = Math.max(0, 1 - dl / (alcanceLuz * 1.8));
    }
  }

  /* ── Desenho ── */
  var baldes = [[], [], [], []];
  function desenharTrilha(rota, t, larguraLinha, comprimento) {
    var passo = Math.floor(t), k = t - passo;
    ctx.strokeStyle = cor.acao;
    ctx.lineWidth = larguraLinha;
    for (var q = Math.max(0, passo - comprimento); q <= passo && q < rota.length - 1; q++) {
      var n1 = nos[rota[q]], n2 = nos[rota[q + 1]];
      ctx.globalAlpha = 0.9 * (1 - (passo - q) / (comprimento + 1));
      ctx.beginPath(); ctx.moveTo(n1.px, n1.py);
      if (q === passo) ctx.lineTo(n1.px + (n2.px - n1.px) * k, n1.py + (n2.py - n1.py) * k);
      else ctx.lineTo(n2.px, n2.py);
      ctx.stroke();
    }
    if (passo >= 0 && passo < rota.length - 1) {
      var na = nos[rota[passo]], nb = nos[rota[passo + 1]];
      var x = na.px + (nb.px - na.px) * k, y = na.py + (nb.py - na.py) * k;
      ctx.fillStyle = cor.acao;
      ctx.globalAlpha = 0.22; ctx.beginPath(); ctx.arc(x, y, larguraLinha * 5.5, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1; ctx.beginPath(); ctx.arc(x, y, larguraLinha * 2, 0, 6.2832); ctx.fill();
    }
  }

  function posicionarRotulo(el, x, y, folga, alfa, acesa) {
    var lw = el._largura || 90;
    var lx = x + folga;
    if (lx + lw > largura - 12) lx = x - folga - lw;
    var visivel = alfa > 0.02 && y > 70 && y < altura - 20 && x > -40 && x < largura + 40;
    el.style.transform = 'translate(' + lx.toFixed(1) + 'px,' + (y - 13).toFixed(1) + 'px)';
    el.style.opacity = visivel ? alfa.toFixed(2) : '0';
    el.classList.toggle('acesa', !!acesa);
  }

  function desenhar(tempo, retangulos) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, largura, altura);
    ctx.lineCap = 'round';

    // auroras: três manchas de cor da marca flutuando devagar atrás da rede
    if (!menosMovimento.matches) {
      var maior = Math.max(largura, altura);
      var auroras = [
        [cor.hubs[0], 0.5 + 0.32 * Math.sin(vivo * 0.071), 0.45 + 0.3 * Math.sin(vivo * 0.053 + 1), 0.55],
        [cor.hubs[2], 0.5 + 0.36 * Math.sin(vivo * 0.047 + 2), 0.5 + 0.32 * Math.cos(vivo * 0.061), 0.45],
        [cor.hubs[4], 0.5 + 0.3 * Math.cos(vivo * 0.058 + 4), 0.55 + 0.28 * Math.sin(vivo * 0.039 + 3), 0.5]
      ];
      for (var au = 0; au < auroras.length; au++) {
        var A0 = auroras[au], ax = A0[1] * largura, ay = A0[2] * altura, ar = A0[3] * maior;
        var g = ctx.createRadialGradient(ax, ay, 0, ax, ay, ar);
        g.addColorStop(0, comAlfa(A0[0], cor.escuro ? 0.13 : 0.075));
        g.addColorStop(1, comAlfa(A0[0], 0));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, largura, altura);
      }
    }

    // halo de luz no cursor
    var halo = ctx.createRadialGradient(luz.x, luz.y, 0, luz.x, luz.y, 320);
    halo.addColorStop(0, cor.luzCentro);
    halo.addColorStop(1, cor.luzFim);
    ctx.globalAlpha = 1;
    ctx.fillStyle = halo;
    ctx.fillRect(0, 0, largura, altura);

    // ligações em quatro faixas de profundidade; as iluminadas saem na cor de ação
    baldes[0].length = baldes[1].length = baldes[2].length = baldes[3].length = 0;
    var acesas = [];
    for (var i = 0; i < ligacoes.length; i++) {
      var a = nos[ligacoes[i][0]], b = nos[ligacoes[i][1]];
      var v = Math.max((a.f + b.f) / 2, Math.min(a.luz, b.luz));
      if (v > 0.18) { acesas.push(a, b, v); continue; }
      var p = (a.prof + b.prof) / 2;
      baldes[p < 0.35 ? 0 : p < 0.55 ? 1 : p < 0.75 ? 2 : 3].push(a, b);
    }
    ctx.strokeStyle = cor.ligacao;
    ctx.lineWidth = 0.6;
    var alfas = [0.12, 0.26, 0.48, 0.75];
    for (var bk = 0; bk < 4; bk++) {
      var lista = baldes[bk];
      if (!lista.length) continue;
      ctx.globalAlpha = alfas[bk];
      ctx.beginPath();
      for (var j = 0; j < lista.length; j += 2) { ctx.moveTo(lista[j].px, lista[j].py); ctx.lineTo(lista[j + 1].px, lista[j + 1].py); }
      ctx.stroke();
    }
    ctx.strokeStyle = cor.acao;
    ctx.lineWidth = 1.1;
    for (i = 0; i < acesas.length; i += 3) {
      ctx.globalAlpha = 0.15 + acesas[i + 2] * 0.75;
      ctx.beginPath(); ctx.moveTo(acesas[i].px, acesas[i].py); ctx.lineTo(acesas[i + 1].px, acesas[i + 1].py); ctx.stroke();
    }

    // neurônios: mais claros perto da luz
    var escalaZoom = 0.7 + cam.zoom * 0.3;
    for (i = 0; i < nos.length; i++) {
      var n = nos[i];
      if (n.hub >= 0) continue;
      if (n.px < -20 || n.px > largura + 20 || n.py < -20 || n.py > altura + 20) continue;
      var r = (0.6 + n.prof * 1.3) * n.s * escalaZoom;
      var brilho = Math.max(n.f, n.luz);
      if (brilho > 0.3) {
        ctx.globalAlpha = 0.4 + brilho * 0.6;
        ctx.fillStyle = cor.acao;
        r += brilho * 2;
      } else {
        ctx.globalAlpha = Math.min(1, (0.18 + n.prof * 0.62) * (0.5 + n.g * 0.8));
        ctx.fillStyle = cor.no;
      }
      ctx.beginPath(); ctx.arc(n.px, n.py, r, 0, 6.2832); ctx.fill();
    }

    // sinal da rolagem: anda da âncora atual até a próxima junto com a página
    var i0 = Math.min(capitulos.length - 1, Math.floor(progressoSuave)), fr = progressoSuave - i0;
    var rotaRolagem = capitulos[i0].rotaProximo;
    if (rotaRolagem && fr > 0.02 && fr < 0.98) {
      var tR = fr * (rotaRolagem.length - 1);
      desenharTrilha(rotaRolagem, tR, 2, 8);
      for (var q = Math.max(0, Math.floor(tR) - 8); q <= Math.floor(tR); q++) nos[rotaRolagem[q]].luz = Math.max(nos[rotaRolagem[q]].luz, 0.8);
    }

    // sinais livres
    for (i = 0; i < sinais.length; i++) if (sinais[i].t >= 0) desenharTrilha(sinais[i].rota, sinais[i].t, 1.6, 4);

    // sub-neurônios do capítulo (frentes, etapas, sócios)
    capitulos.forEach(function (cap) {
      if (!cap.subNos.length) return;
      cap.subNos.forEach(function (j, m) {
        var n = nos[j];
        var acesa = m === cap.subFoco || m === cap.subAtivo;
        if (cap.peso > 0.02) {
          ctx.globalAlpha = cap.peso;
          ctx.strokeStyle = cor.acao; ctx.fillStyle = cor.acao; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.arc(n.px, n.py, acesa ? 9 : 6, 0, 6.2832); ctx.stroke();
          ctx.beginPath(); ctx.arc(n.px, n.py, 2.6, 0, 6.2832); ctx.fill();
        }
        posicionarRotulo(cap.rotulos[m], n.px, n.py, 14, cap.peso, acesa);
      });
    });

    // nós de sistema
    var pesoRede = 0;
    capitulos.forEach(function (cap) { if (cap.id === 'rede' || cap.id === 'exemplos') pesoRede = Math.max(pesoRede, cap.peso); });
    for (i = 0; i < hubs.length; i++) {
      var h = nos[hubs[i]];
      var base = (5 + h.prof * 3) * h.s * (0.8 + cam.zoom * 0.2);
      var brilhoH = Math.max(h.f, h.luz);
      ctx.fillStyle = cor.hubs[i];
      ctx.globalAlpha = 0.18 + brilhoH * 0.3 + pesoRede * 0.1;
      ctx.beginPath(); ctx.arc(h.px, h.py, base * (2.4 + pesoRede * 0.8 + (menosMovimento.matches ? 0 : pesoRede * 0.4 * Math.sin(tempo / 400 + i))), 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 0.55 + h.prof * 0.45;
      ctx.beginPath(); ctx.arc(h.px, h.py, base, 0, 6.2832); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = cor.superficie;
      ctx.beginPath(); ctx.arc(h.px, h.py, base * 0.42, 0, 6.2832); ctx.fill();
      posicionarRotulo(rotulosHub[i], h.px, h.py, base + 8, 0.35 + h.prof * 0.65, brilhoH > 0.3);
      rotulosHub[i].style.zIndex = Math.round(h.prof * 10);
    }

    // fio do neurônio ativo até o painel do capítulo
    capitulos.forEach(function (cap, k) {
      var rp = retangulos[k];
      if (!cap.cam.fio || cap.peso < 0.05 || !rp) return;
      var n = nos[cap.ancora], ex, ey;
      if (celular.matches) {
        ex = rp.left + rp.width / 2; ey = rp.top;
        if (ey < 80 || ey > altura) return;
      } else {
        ex = cap.painel.getAttribute('data-lado') === 'd' ? rp.left : rp.right;
        ey = Math.min(Math.max(rp.top + 64, 96), altura - 64);
      }
      ctx.globalAlpha = cap.peso * 0.8;
      ctx.strokeStyle = cor.acao; ctx.fillStyle = cor.acao; ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 5]);
      ctx.beginPath(); ctx.moveTo(n.px, n.py); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath(); ctx.arc(ex, ey, 3, 0, 6.2832); ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(n.px, n.py, 11 + (menosMovimento.matches ? 0 : 3 * Math.sin(tempo / 300)), 0, 6.2832); ctx.stroke();
    });
    ctx.globalAlpha = 1;
  }

  /* ── Eventos de cada capítulo ── */
  var relogio = { ambiente: 0, passos: 0, exemplos: 0, contato: 0 };
  function capituloPor(id) { for (var i = 0; i < capitulos.length; i++) if (capitulos[i].id === id) return capitulos[i]; return null; }
  var capComo = capituloPor('como-funciona'), capExemplos = capituloPor('exemplos'), capContato = capituloPor('contato');
  var exemploAtivo = -1;

  function marcarAtivo(lista, indice) {
    lista.forEach(function (el, i) { el.classList.toggle('ativo', i === indice); });
  }

  function eventos(dt) {
    if (menosMovimento.matches) return;
    // sinais ambientes entre sistemas
    relogio.ambiente -= dt;
    if (relogio.ambiente <= 0 && sinais.length < 9) {
      var a = hubs[Math.floor(Math.random() * hubs.length)], b = hubs[Math.floor(Math.random() * hubs.length)];
      // às vezes o sinal sai de um neurônio qualquer, não só dos sistemas
      if (Math.random() < 0.4) a = Math.floor(Math.random() * nos.length);
      dispararSinal(a, b);
      relogio.ambiente = 0.6 + Math.random() * 0.6;
    }
    // faíscas: neurônios soltos acendem e apagam sozinhos
    relogio.faisca = (relogio.faisca || 0) + dt * 14;
    while (relogio.faisca >= 1) {
      relogio.faisca -= 1;
      var nf = nos[Math.floor(Math.random() * nos.length)];
      nf.luz = Math.max(nf.luz, 0.45 + Math.random() * 0.35);
    }
    // etapas: o sinal anda de uma etapa para a próxima
    if (capComo && capComo.subNos.length && capComo.peso > 0.5 && capComo.subFoco < 0) {
      relogio.passos -= dt;
      if (relogio.passos <= 0) {
        var total = capComo.subNos.length;
        var atual = (capComo.subAtivo + 1) % total;
        if (capComo.subAtivo >= 0) dispararSinal(capComo.subNos[capComo.subAtivo], capComo.subNos[atual], 0, 10);
        capComo.subAtivo = atual;
        marcarAtivo(capComo.subs, atual);
        relogio.passos = 1.5;
      }
    }
    // exemplos: cada um é um sinal real entre dois sistemas
    if (capExemplos && capExemplos.exemplos.length && capExemplos.peso > 0.5 && capExemplos.subFoco < 0) {
      relogio.exemplos -= dt;
      if (relogio.exemplos <= 0) {
        exemploAtivo = (exemploAtivo + 1) % capExemplos.exemplos.length;
        dispararExemplo(exemploAtivo);
        relogio.exemplos = 3;
      }
    }
    // contato: os sistemas convergem para o neurônio do diagnóstico
    if (capContato && capContato.peso > 0.5) {
      relogio.contato -= dt;
      if (relogio.contato <= 0) {
        dispararSinal(hubs[Math.floor(Math.random() * hubs.length)], capContato.ancora, 0, 10);
        relogio.contato = 0.9;
      }
    }
  }
  function dispararExemplo(i) {
    var el = capExemplos.exemplos[i];
    var de = indiceSistema(el.getAttribute('data-de')), para = indiceSistema(el.getAttribute('data-para'));
    marcarAtivo(capExemplos.exemplos, i);
    if (de >= 0 && para >= 0) dispararSinal(hubs[de], hubs[para], 0, 12);
  }

  /* ── Laço ── */
  var anterior = 0, quadroId = 0;
  function lerp(a, b, t) { return a + (b - a) * t; }
  function quadro(t) {
    quadroId = 0;
    var dt = anterior ? Math.min((t - anterior) / 1000, 0.05) : 0.016;
    anterior = t;
    var parado = menosMovimento.matches;

    // leituras de layout primeiro
    progresso = lerProgresso();
    var retangulos = capitulos.map(function (cap) { return cap.painel ? cap.painel.getBoundingClientRect() : null; });

    progressoSuave = parado ? progresso : progressoSuave + (progresso - progressoSuave) * Math.min(1, dt * 8);
    if (Math.abs(progressoSuave - progresso) < 0.0005) progressoSuave = progresso;

    // câmera interpolada entre os dois capítulos
    var i0 = Math.min(capitulos.length - 1, Math.floor(progressoSuave));
    var i1 = Math.min(capitulos.length - 1, i0 + 1);
    var fr = progressoSuave - i0;
    var e = parado ? Math.round(fr) : fr * fr * (3 - 2 * fr);
    var A = capitulos[i0].cam, B = capitulos[i1].cam;
    var na = nos[capitulos[i0].ancora], nb = nos[capitulos[i1].ancora];
    if (!parado) {
      vivo += dt;
      deriva += dt * 0.045;
      var alvoPx = cursor.ativo ? cursor.x / largura - 0.5 : 0, alvoPy = cursor.ativo ? cursor.y / altura - 0.5 : 0;
      paralaxe.x += (alvoPx - paralaxe.x) * Math.min(1, dt * 3);
      paralaxe.y += (alvoPy - paralaxe.y) * Math.min(1, dt * 3);
    }
    var recuo = parado ? 0 : 0.3 * Math.sin(Math.PI * e); // a câmera recua no meio da viagem
    var mov = celular.matches;
    // respiração: zoom, inclinação e posição oscilam devagar para a rede nunca ficar parada
    var respira = parado ? 0 : 1;
    cam.zoom = lerp(A.zoom, B.zoom, e) * (1 - recuo) * (mov ? 1.05 : 1) * (1 + respira * 0.03 * Math.sin(vivo * 0.35));
    cam.giro = lerp(A.giro, B.giro, e) + deriva + paralaxe.x * 0.4 + respira * 0.09 * Math.sin(vivo * 0.13);
    cam.inclina = lerp(A.inclina, B.inclina, e) + paralaxe.y * 0.25 + respira * 0.07 * Math.sin(vivo * 0.21);
    cam.fx = (mov ? 0.5 : lerp(A.foco[0], B.foco[0], e)) + respira * 0.008 * Math.sin(vivo * 0.29);
    cam.fy = (mov ? 0.3 : lerp(A.foco[1], B.foco[1], e)) + respira * 0.012 * Math.sin(vivo * 0.24 + 1);
    cam.alvo = [lerp(na.x, nb.x, e), lerp(na.y, nb.y, e), lerp(na.z, nb.z, e)];

    // a luz segue o cursor; sem cursor, passeia devagar em volta do neurônio ativo
    var lx = cursor.ativo ? cursor.x : cam.fx * largura + respira * Math.sin(vivo * 0.31) * Math.min(largura * 0.14, 200);
    var ly = cursor.ativo ? cursor.y : cam.fy * altura + respira * Math.sin(vivo * 0.23 + 1) * Math.min(altura * 0.12, 120);
    luz.forca += ((cursor.ativo ? 1 : 0.4) - luz.forca) * Math.min(1, dt * 4);
    if (!luz.iniciada || parado) { luz.x = lx; luz.y = ly; luz.iniciada = true; }
    else { luz.x += (lx - luz.x) * Math.min(1, dt * 6); luz.y += (ly - luz.y) * Math.min(1, dt * 6); }

    for (var i = 0; i < nos.length; i++) nos[i].luz *= Math.pow(0.05, dt);

    // peso de cada capítulo: 1 quando centralizado, 0 a um capítulo de distância
    capitulos.forEach(function (cap, k) {
      cap.peso = Math.max(0, 1 - Math.abs(progressoSuave - k));
      if (!cap.subNos.length) return;
      if (cap.subFoco >= 0) nos[cap.subNos[cap.subFoco]].luz = 1;
      else if (cap.subAtivo >= 0) nos[cap.subNos[cap.subAtivo]].luz = Math.max(nos[cap.subNos[cap.subAtivo]].luz, 0.9);
    });

    eventos(dt);
    for (i = sinais.length - 1; i >= 0; i--) {
      var s = sinais[i];
      s.t += dt * s.velocidade;
      if (s.t >= 0) {
        var passo = Math.min(Math.floor(s.t), s.rota.length - 1);
        nos[s.rota[passo]].luz = Math.max(nos[s.rota[passo]].luz, 0.75);
      }
      if (s.t >= s.rota.length + 4) sinais.splice(i, 1);
    }

    projetar();
    desenhar(t, retangulos);

    // escritas no DOM por último
    capitulos.forEach(function (cap) {
      if (cap.painel) cap.painel.style.setProperty('--peso', cap.peso.toFixed(3));
    });
    if (!document.hidden) quadroId = requestAnimationFrame(quadro);
  }
  function iniciar() {
    if (quadroId) return;
    anterior = 0;
    quadroId = requestAnimationFrame(quadro);
  }
  function parar() { if (quadroId) cancelAnimationFrame(quadroId); quadroId = 0; }

  /* ── Interação ── */
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType !== 'mouse') return;
    cursor.x = e.clientX; cursor.y = e.clientY; cursor.ativo = true;
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { cursor.ativo = false; });
  window.addEventListener('blur', function () { cursor.ativo = false; });

  document.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.painel, a, button, input, textarea, select, label, nav, footer')) return;
    if (e.pointerType !== 'mouse') {
      cursor.x = e.clientX; cursor.y = e.clientY; cursor.ativo = true;
      setTimeout(function () { cursor.ativo = false; }, 900);
    }
    if (menosMovimento.matches) return;
    var maisPerto = 0, menor = Infinity;
    nos.forEach(function (n, i) {
      var d = (n.px - e.clientX) * (n.px - e.clientX) + (n.py - e.clientY) * (n.py - e.clientY);
      if (d < menor) { menor = d; maisPerto = i; }
    });
    hubs.forEach(function (h, i) { dispararSinal(maisPerto, h, i * 0.5, 9); });
  });

  // passar o mouse (ou o foco) por um item acende o neurônio dele
  capitulos.forEach(function (cap) {
    cap.subs.forEach(function (el, m) {
      function ligar() { cap.subFoco = m; }
      function desligar() { if (cap.subFoco === m) cap.subFoco = -1; }
      el.addEventListener('pointerenter', ligar);
      el.addEventListener('pointerleave', desligar);
      el.addEventListener('focusin', ligar);
      el.addEventListener('focusout', desligar);
    });
    cap.exemplos.forEach(function (el, i) {
      el.addEventListener('pointerenter', function () {
        cap.subFoco = i;
        if (i !== exemploAtivo) { exemploAtivo = i; dispararExemplo(i); }
      });
      el.addEventListener('pointerleave', function () { cap.subFoco = -1; relogio.exemplos = 1.5; });
    });
  });

  // formulário enviado: o neurônio do diagnóstico dispara para todos os sistemas
  document.addEventListener('fd:enviado', function () {
    if (!capContato || menosMovimento.matches) return;
    hubs.forEach(function (h, i) { dispararSinal(capContato.ancora, h, i * 0.25, 11); });
  });

  /* ── Preparação ── */
  function preparar() {
    construir(celular.matches ? 420 : 900);
    prepararCapitulos();
    lerCores();
    criarRotulos();
    medir();
    if (menosMovimento.matches) {
      // sem movimento: etapas e exemplos ficam todos acesos
      capitulos.forEach(function (cap) {
        cap.subs.forEach(function (el) { el.classList.add('ativo'); });
        cap.exemplos.forEach(function (el) { el.classList.add('ativo'); });
      });
    }
  }
  preparar();
  raiz.classList.add('cerebro-pronto');
  iniciar();

  document.addEventListener('visibilitychange', function () { if (document.hidden) parar(); else iniciar(); });
  var tempoRedimensionar = 0;
  window.addEventListener('resize', function () {
    clearTimeout(tempoRedimensionar);
    tempoRedimensionar = setTimeout(medir, 120);
  });
  celular.addEventListener('change', function () { preparar(); });
  menosMovimento.addEventListener('change', function () { preparar(); });
  // troca de tema: relê as cores
  new MutationObserver(lerCores).observe(raiz, { attributes: true, attributeFilter: ['data-tema'] });
  escuroSistema.addEventListener('change', lerCores);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(medirRotulos);
})();
