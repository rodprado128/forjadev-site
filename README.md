# forjadev-site

Site estático da ForjaDev — automação de processos e integração de sistemas.
HTML + CSS + JS vanilla, sem build step, hospedado no GitHub Pages (domínio `forjadev.app.br`).

## Executar localmente

```bash
python3 -m http.server 8000
# abra http://localhost:8000
```

Qualquer servidor estático serve (não há build). Sem dependências.

## Estrutura

```
index.html          página única (hero, frentes, fluxos ilustrativos, antes/depois, processo, sócios, FAQ, contato)
404.html            página de erro
CNAME               domínio custom do Pages (preservado)
.nojekyll           preservado
assets/css/         tokens.css (tokens do brand book) + style.css
assets/js/main.js   tema, menu, abas de fluxo, fallbacks de animação
assets/fonts/       Archivo (variável) e Archivo Black em woff2 — licença OFL (assets/fonts/OFL.txt)
assets/icons/       ícones Lucide (licença ISC, assets/icons/LICENSE-lucide.txt)
assets/img/         favicon, ícones PWA, og-image, fotos dos sócios
robots.txt / sitemap.xml / site.webmanifest
```

## Notas de implementação

- Tema claro padrão; escuro opcional no botão do cabeçalho, persistido em `localStorage` (tolerante a storage bloqueado; sem `prefers-color-scheme` guardado, inicia claro com respeito ao `prefers-color-scheme`).
- Reveals usam CSS scroll-driven (`animation-timeline: view()`) com detecção via `@supports` + `CSS.supports`; sem suporte, cai para `IntersectionObserver`. Sem JS, todo o conteúdo é visível.
- `prefers-reduced-motion` cancela deslocamentos, scrub e reveals (conteúdo sempre visível, não apenas mais rápido).
- Fluxos exibidos são **ilustrativos**: explicam o tipo de problema resolvido; o desenho real nasce no diagnóstico.
- Ícones: Lucide (stroke 1.75 no uso), servidos localmente.

## Limitações conhecidas

- Fotos dos sócios: versões novas (recorte do Rodrigo sem marca de evento e original do Bruno em resolução nativa) estavam indisponíveis no momento da implementação; usadas as fotos reais já autorizadas do acervo, a trocar em commit posterior quando os arquivos forem reenviados.
- `assets/css/tokens.css` foi recriado a partir da especificação escrita do brand book 2027.2 (o arquivo oficial de tokens não estava acessível); substituir pelo original quando disponível, mantendo o uso dos `--fd-*`.
