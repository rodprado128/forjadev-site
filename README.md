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
- Reveals usam CSS scroll-driven (`animation-timeline: view()`) com detecção via `@supports` + `CSS.supports`; sem suporte, cai para `IntersectionObserver`. A camada de movimento só é ativada depois da inicialização; o menu mobile é um disclosure nativo que também funciona sem scripts. Sem JS ou com o script bloqueado, navegação mobile e todos os exemplos permanecem acessíveis.
- `prefers-reduced-motion` cancela deslocamentos, scrub e reveals (conteúdo sempre visível, não apenas mais rápido).
- Fluxos exibidos são **ilustrativos**: explicam o tipo de problema resolvido; o desenho real nasce no diagnóstico.
- Ícones: Lucide (stroke 1.75 no uso), servidos localmente.

## Limitações conhecidas

- O logo na página foi inlinado a partir dos vetores exatos extraídos do brand book (página 6), com recoloração por tema via variáveis — geometria preservada; modo escuro usa a variante autorizada (#EBEDF0 / #7689FE).
- Fluxos exibidos continuam ilustrativos; nenhum número, case ou SLA do brand book (ex.: "1.248 pedidos", "−18h") foi usado em peça real.

## Verificar e publicar são etapas diferentes

O trabalho de redesign está na branch `redesign-2026`, em PR para `main`.
GitHub Pages serve **`main` a partir da raiz**. Não fazer merge sem aprovação
específica: o merge publica o site. Não alterar `CNAME`, `.nojekyll`, DNS,
origem do Pages ou HTTPS.

As demonstrações de automação são ilustrativas, sem backend conectado ou
resultados de clientes. O CTA abre WhatsApp; não existe formulário que simule envio.

A implementação foi verificada localmente com Chromium em 1440, 390 e 320 px:
console/recursos, overflow, menu/Escape, temas, abas e FAQ, navegação sem JS,
script bloqueado e redução de movimento. Isso não é medição de produção.
Os artefatos completos de testes e screenshots são entregues pelo coordenador;
Lighthouse 12.8.2 foi executado contra servidor local, com perfil desktop e mobile. As métricas desse laboratório (sem cache/compressão de produção e em sandbox de CPU compartilhada) não representam o domínio publicado. Publicação e aceite do cliente só serão declarados com suas evidências.
