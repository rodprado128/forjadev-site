/**
 * ForjaDev · receptor de leads do site (projeto Apps Script "ForjaDev · Receptor de leads",
 * grava na planilha "ForjaDev · Leads do site", ID abaixo).
 *
 * O formulário de diagnóstico de forjadev.app.br envia um POST para este script, publicado como
 * "app da web" (executa como o dono da planilha, acesso: qualquer pessoa). Cada envio vira uma linha na aba "Leads"
 * e dispara um aviso por e-mail (para o dono do script) e pelo Telegram.
 *
 * Segredos ficam em Configurações do projeto > Propriedades do script, nunca neste arquivo:
 *   TELEGRAM_TOKEN    token do bot, dado pelo @BotFather
 *   TELEGRAM_CHAT_ID  preenchido por configurarTelegram()
 *   EMAIL_AVISO       outros destinos do e-mail, separados por vírgula (o dono do script sempre recebe)
 *
 * Esta é uma cópia de referência: o código que roda está no projeto Apps Script (script.google.com).
 * Se mudar algo aqui, cole lá e publique em Implantar > Gerenciar implantações > editar > Nova versão
 * (assim a URL do app continua a mesma).
 */

var ID_PLANILHA = '1-IGIpWlS9QluglCmr9Yaub1dSrLzpYOW8_ktCA4IxY0';
var ABA = 'Leads';
var CABECALHO = ['Recebido em', 'Nome', 'E-mail', 'Empresa', 'Sistemas que usam', 'O que é feito à mão', 'Página de origem', 'Navegador'];
var EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  var p = (e && e.parameter) || {};

  // campo-isca: só robôs preenchem; finge sucesso e descarta
  if (p.site_url) return responder({ ok: true });

  var lead = {
    nome: limpar(p.nome, 120),
    email: limpar(p.email, 160),
    empresa: limpar(p.empresa, 160),
    sistemas: limpar(p.sistemas, 300),
    processo: limpar(p.processo, 2000),
    origem: limpar(p.origem, 300),
    navegador: limpar(p.navegador, 300)
  };
  if (!lead.nome || !EMAIL_VALIDO.test(lead.email)) return responder({ ok: false, erro: 'dados-invalidos' });

  var trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    obterAba().appendRow([new Date(), lead.nome, lead.email, lead.empresa, lead.sistemas, lead.processo, lead.origem, lead.navegador]);
  } finally {
    trava.releaseLock();
  }

  // o lead já está salvo; uma falha nos avisos não pode virar erro para o visitante
  avisar(lead);
  return responder({ ok: true });
}

// Abrir a URL no navegador só confirma que o receptor está no ar.
function doGet() {
  return responder({ ok: true, servico: 'leads-forjadev' });
}

/* ── Avisos ── */

function avisar(lead) {
  try { avisarPorEmail(lead); } catch (erro) { console.error('Aviso por e-mail falhou: ' + erro); }
  try { avisarPorTelegram(lead); } catch (erro) { console.error('Aviso pelo Telegram falhou: ' + erro); }
}

function avisarPorEmail(lead) {
  // o dono do script sempre recebe; EMAIL_AVISO acrescenta outros destinos (separados por vírgula)
  var destinos = [Session.getEffectiveUser().getEmail()].concat(String(propriedade('EMAIL_AVISO') || '').split(','))
    .map(function (e) { return e.trim().toLowerCase(); })
    .filter(function (e, i, todos) { return EMAIL_VALIDO.test(e) && todos.indexOf(e) === i; });
  if (!destinos.length) return;
  var destino = destinos.join(',');
  var linhas = [
    'Chegou um novo pedido de diagnóstico pelo site.',
    '',
    'Nome: ' + lead.nome,
    'E-mail: ' + lead.email,
    'Empresa: ' + (lead.empresa || '-'),
    'Sistemas que usam: ' + (lead.sistemas || '-'),
    '',
    'O que é feito à mão:',
    lead.processo || '-',
    '',
    'Planilha de leads: ' + urlPlanilha(),
    '',
    'Responder este e-mail responde direto para o lead.'
  ];
  MailApp.sendEmail({
    to: destino,
    subject: 'Novo lead no site: ' + lead.nome + (lead.empresa ? ' (' + lead.empresa + ')' : ''),
    body: linhas.join('\n'),
    name: 'Site ForjaDev',
    replyTo: lead.email
  });
}

function avisarPorTelegram(lead) {
  var token = propriedade('TELEGRAM_TOKEN'), chat = propriedade('TELEGRAM_CHAT_ID');
  if (!token || !chat) return;
  var texto = [
    '<b>Novo lead no site</b>',
    '',
    '<b>' + html(lead.nome) + '</b>' + (lead.empresa ? ' · ' + html(lead.empresa) : ''),
    html(lead.email),
    lead.sistemas ? 'Sistemas: ' + html(lead.sistemas) : null,
    lead.processo ? '\n<i>' + html(lead.processo.slice(0, 600)) + '</i>' : null,
    '',
    '<a href="' + urlPlanilha() + '">Abrir a planilha</a>'
  ].filter(function (linha) { return linha !== null; }).join('\n');
  telegram(token, 'sendMessage', { chat_id: chat, text: texto, parse_mode: 'HTML', disable_web_page_preview: true });
}

/* ── Configuração (rodar pelo editor) ── */

// Rode uma vez para criar a aba e o cabeçalho.
function configurar() {
  obterAba();
}

// Depois de salvar TELEGRAM_TOKEN e mandar qualquer mensagem para o bot, rode esta função:
// ela descobre a conversa e guarda TELEGRAM_CHAT_ID.
function configurarTelegram() {
  var token = propriedade('TELEGRAM_TOKEN');
  if (!token) throw new Error('Falta a propriedade TELEGRAM_TOKEN em Configurações do projeto > Propriedades do script.');
  var resposta = telegram(token, 'getUpdates', {});
  var atualizacoes = (resposta && resposta.result) || [];
  for (var i = atualizacoes.length - 1; i >= 0; i--) {
    var msg = atualizacoes[i].message || atualizacoes[i].my_chat_member;
    if (msg && msg.chat) {
      PropertiesService.getScriptProperties().setProperty('TELEGRAM_CHAT_ID', String(msg.chat.id));
      console.log('Conversa encontrada: ' + (msg.chat.first_name || msg.chat.title || '') + ' (' + msg.chat.id + ')');
      return;
    }
  }
  throw new Error('Nenhuma mensagem encontrada. Mande /start para o bot no Telegram e rode de novo.');
}

// Manda um aviso de teste pelos dois canais, sem gravar nada na planilha.
function testarAvisos() {
  avisar({
    nome: 'Lead de teste',
    email: Session.getEffectiveUser().getEmail() || 'teste@exemplo.com.br',
    empresa: 'Teste dos avisos',
    sistemas: 'Omie, WhatsApp',
    processo: 'Mensagem de teste dos avisos do site. Pode ignorar.',
    origem: '',
    navegador: ''
  });
}

// Confere o formato do token sem mostrar o valor.
function conferirToken() {
  var t = String(propriedade('TELEGRAM_TOKEN') || '');
  var limpo = t.replace(/\s+/g, '').replace(/^bot/i, '');
  console.log('Tamanho: ' + t.length + ' · com espaços: ' + /\s/.test(t) + ' · começa com bot: ' + /^bot/i.test(t) + ' · formato válido: ' + /^\d{6,}:[\w-]{30,}$/.test(limpo));
  console.log(JSON.stringify(telegram(t, 'getMe', {}).result.username));
}

/* ── Apoio ── */

function obterAba() {
  var planilha = SpreadsheetApp.openById(ID_PLANILHA);
  var aba = planilha.getSheetByName(ABA);
  if (!aba) {
    aba = planilha.getSheets()[0];
    aba.setName(ABA);
  }
  if (aba.getLastRow() === 0) {
    aba.appendRow(CABECALHO);
    aba.setFrozenRows(1);
    aba.getRange(1, 1, 1, CABECALHO.length).setFontWeight('bold');
    aba.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
  }
  return aba;
}

function telegram(token, metodo, dados) {
  token = String(token).replace(/\s+/g, '').replace(/^bot/i, ''); // tolera espaço ou "bot" colados junto
  var r = UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/' + metodo, {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify(dados),
    muteHttpExceptions: true
  });
  var corpo = JSON.parse(r.getContentText() || '{}');
  if (!corpo.ok) throw new Error('Telegram ' + metodo + ': ' + (corpo.description || r.getResponseCode()));
  return corpo;
}

function propriedade(nome) {
  return PropertiesService.getScriptProperties().getProperty(nome);
}

function urlPlanilha() {
  return 'https://docs.google.com/spreadsheets/d/' + ID_PLANILHA + '/edit';
}

function html(texto) {
  return String(texto).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// Corta o tamanho e neutraliza texto que a planilha leria como fórmula (=, +, -, @).
function limpar(valor, maximo) {
  var v = String(valor || '').trim().slice(0, maximo);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}
