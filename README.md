# ForjaDev · site

Site institucional da ForjaDev, publicado em https://forjadev.app.br pelo GitHub Pages (branch `main`, pasta raiz).

Segue o sistema de marca ForjaDev 2027.2. As cores, tipos, espaços e movimentos vêm de `assets/css/tokens.css`, gerado pelo `system.py` do brand book. Não edite esse arquivo à mão.

## Estrutura

| Arquivo | Para quê |
|---|---|
| `index.html` | Página única do site |
| `404.html` | Página de erro |
| `assets/css/tokens.css` | Variáveis da marca (gerado, não editar) |
| `assets/css/components.css` | Componentes base da marca |
| `assets/css/site.css` | Estilos do site |
| `assets/js/site.js` | Tema, menu, palavras que acendem, formulário |
| `assets/js/cerebro.js` | Cérebro em tela cheia (canvas): capítulos-neurônio, câmera guiada pela rolagem, luz no cursor |
| `assets/marca/` | Logos, favicons e imagem de compartilhamento |
| `assets/img/socios/` | Fotos dos sócios fundadores |
| `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml` | Configuração do domínio e do Pages |

## Como o site é montado

O cérebro (`<canvas data-cerebro>`) fica fixo atrás de tudo. Cada `<section data-neuronio="...">` do `index.html` é um capítulo e vira um neurônio da rede:

- A câmera de cada capítulo (giro, zoom, onde o neurônio fica na tela) está na tabela `CAMERAS` de `cerebro.js`. O `id` do `data-neuronio` liga os dois.
- Itens com `data-sub="Rótulo"` viram sub-neurônios em volta do neurônio do capítulo, com o rótulo vindo do próprio atributo.
- Itens com `data-de` e `data-para` (nomes dos sistemas) disparam um sinal entre os dois hubs.
- O painel de cada capítulo (`.painel`, lado em `data-lado="e|d"`) recebe `--peso` (0 a 1) para esmaecer quando sai de foco.
- O formulário dispara o evento `fd:enviado`, e o cérebro manda sinais do contato para todos os sistemas.

Para criar um capítulo novo: adicione a `<section class="capitulo" data-neuronio="novo-id">` e uma entrada `'novo-id'` em `CAMERAS`.

A versão anterior (antes do cérebro) está no histórico do git, no commit `8bc9736`.

## Rodar localmente

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```

Depois abra http://localhost:5173.

## Formulário de diagnóstico

- Os leads do formulário de diagnóstico vão para a planilha "ForjaDev · Leads do site" (Google Sheets, na conta Google de quem administra o site) por um Apps Script publicado como app da web. O código de referência está em `integracoes/leads-google-sheets.gs`; a URL do app fica no `action` do formulário em `index.html`.
- A cada lead, o script avisa por e-mail (o dono do script e os destinos em `EMAIL_AVISO`) e pelo Telegram (bot próprio). O token do bot, a conversa do Telegram e os e-mails ficam em Configurações do projeto > Propriedades do script no Apps Script, nunca no código. Para testar sem gravar lead, rode `testarAvisos` no editor.
