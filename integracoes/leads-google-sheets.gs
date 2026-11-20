/**
 * ForjaDev · receptor de leads do site (projeto Apps Script "ForjaDev · Receptor de leads",
 * grava na planilha "ForjaDev · Leads do site", ID abaixo).
 *
 * O formulário de diagnóstico de forjadev.app.br envia um POST para este script, publicado como
 * "app da web" (executa como o dono da planilha, acesso: qualquer pessoa). Cada envio vira uma linha na aba "Leads".
 *
 * Esta é uma cópia de referência: o código que roda está no projeto Apps Script (script.google.com).
 * Se mudar algo aqui, cole lá e publique uma nova versão em Implantar > Gerenciar implantações.
 */

var ID_PLANILHA = '1-IGIpWlS9QluglCmr9Yaub1dSrLzpYOW8_ktCA4IxY0';
var ABA = 'Leads';
var CABECALHO = ['Recebido em', 'Nome', 'E-mail', 'Empresa', 'Sistemas que usam', 'O que é feito à mão', 'Página de origem', 'Navegador'];
var EMAIL_VALIDO = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  var p = (e && e.parameter) || {};

  // campo-isca: só robôs preenchem; finge sucesso e descarta
  if (p.site_url) return responder({ ok: true });

  var nome = limpar(p.nome, 120);
  var email = limpar(p.email, 160);
  if (!nome || !EMAIL_VALIDO.test(email)) return responder({ ok: false, erro: 'dados-invalidos' });

  var trava = LockService.getScriptLock();
  trava.waitLock(10000);
  try {
    obterAba().appendRow([
      new Date(),
      nome,
      email,
      limpar(p.empresa, 160),
      limpar(p.sistemas, 300),
      limpar(p.processo, 2000),
      limpar(p.origem, 300),
      limpar(p.navegador, 300)
    ]);
  } finally {
    trava.releaseLock();
  }
  return responder({ ok: true });
}

// Abrir a URL no navegador só confirma que o receptor está no ar.
function doGet() {
  return responder({ ok: true, servico: 'leads-forjadev' });
}

// Rode uma vez pelo editor para criar a aba e o cabeçalho (e autorizar o script).
function configurar() {
  obterAba();
}

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

// Corta o tamanho e neutraliza texto que a planilha leria como fórmula (=, +, -, @).
function limpar(valor, maximo) {
  var v = String(valor || '').trim().slice(0, maximo);
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function responder(objeto) {
  return ContentService.createTextOutput(JSON.stringify(objeto)).setMimeType(ContentService.MimeType.JSON);
}
