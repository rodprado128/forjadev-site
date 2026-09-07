# Documentação técnica — site ForjaDev

Documento de referência do site publicado em <https://forjadev.app.br>.
Todo o conteúdo abaixo foi extraído da leitura do código em **2026-09-06**, após o
commit de copy que removeu a menção a vigência e a ClickUp e eliminou a primeira
pessoa na bio e no CTA.

Fonte da verdade de marca: `FORJADEV-BRAND-GUIDE_1.md` (versão 2026.1.2, arquivo
local, **não versionado** — ver `.gitignore`) e `assets/css/tokens.css`.

---

## 1. Identificação

| | |
|---|---|
| **Projeto** | ForjaDev — site institucional e landing page de conversão |
| **Domínio de produção** | `forjadev.app.br` (fixado pelo arquivo `CNAME`) |
| **Repositório** | <https://github.com/rodprado128/forjadev-site> — público |
| **Branch de publicação** | `main`, servida a partir da raiz `/` |
| **Mecanismo de deploy** | GitHub Pages, build clássico (`build_type: legacy`) — não há workflow do Actions |
| **Página 404 própria** | sim (`custom_404: true`) |
| **Certificado HTTPS** | emitido e aprovado para `forjadev.app.br` e `www.forjadev.app.br`, válido até **2026-12-05** |
| **Enforce HTTPS** | **desligado** (`https_enforced: false`) — ver Pendências |
| **Peso total do que é publicado** | ~597 KB (todos os arquivos versionados somados) |
| **Responsável técnico** | Rodrigo Prado — WhatsApp (44) 99119-2295 · rodrigodiaz128@gmail.com |

---

## 2. Stack e dependências

**Linguagens:** HTML5, CSS3 e JavaScript. O JS é escrito em estilo ES5 (`var`,
IIFE, `'use strict'`, concatenação de string) sobre APIs modernas de navegador —
`IntersectionObserver`, `matchMedia`, `requestAnimationFrame`,
`requestIdleCallback`, `classList`, `dataset`, atributo `inert`.

**Não há build step.** Não existe `package.json`, bundler, transpilador,
pré-processador de CSS nem framework no repositório. O que está no disco é
exatamente o que o navegador recebe. O deploy é o próprio `git push`.

**Bibliotecas de terceiros:** nenhuma. Zero CDN, zero script externo, zero tag
de analytics, pixel ou chat widget. O único `<script>` de dados é o bloco
`application/ld+json` inline.

```
<script defer src="/assets/js/main.js">
<script defer src="/assets/js/animations.js">
<script type="application/ld+json">   (inline)
```

**Fontes:** quatro famílias auto-hospedadas em `/assets/fonts`, subsets `latin` e
`latin-ext` em `woff2`, licença SIL OFL 1.1 (`assets/fonts/OFL.txt`).

| Família | Peso | Papel |
|---|---|---|
| Archivo Black | 400 | Display — `h1`, `h2`, preço, contador |
| Archivo | 400 / 700 | Texto corrido, `h3`, botão |
| Barlow Condensed | 600 | Rótulo técnico (`.rotulo`), sempre em caixa alta |
| JetBrains Mono | 400 | Exclusiva do bloco de terminal |

O `@import` do Google Fonts foi trocado por arquivos locais — o motivo está
comentado no topo de `assets/css/tokens.css`: o ida-e-volta até
`fonts.googleapis.com` atrasava a primeira pintura em ~1s no 4G simulado e a
troca tardia da fonte gerava CLS de 0,23.

**Domínios externos citados no HTML** — todos são links de saída ou identificador
de vocabulário, nenhum é requisição de carregamento:

| Domínio | Ocorrências | Papel |
|---|---|---|
| `forjadev.app.br` | 28 | URLs canônicas, OG, JSON-LD |
| `wa.me` | 14 | CTAs de WhatsApp |
| `schema.org` | 7 | `@context` e tipos do JSON-LD |
| `linkedin.com` | 5 | perfil |
| `github.com` | 5 | perfil |

**`.nojekyll`** impede que o GitHub processe o conteúdo com Jekyll.

---

## 3. Estrutura de arquivos

```
.
├── index.html                    página única, todas as âncoras; CSS crítico e JSON-LD inline
├── 404.html                      erro 404 com a mesma identidade; usa o terminal como peça
├── CNAME                         forjadev.app.br
├── .nojekyll                     desliga o Jekyll no GitHub Pages
├── robots.txt                    libera tudo e aponta o sitemap
├── sitemap.xml                   uma única URL (a home), lastmod 2026-09-05
├── site.webmanifest              nome, cores e ícones do app instalável
├── README.md                     como rodar local, publicar e as regras de marca que o código respeita
├── CHANGELOG.md                  decisões de conteúdo e premissas de cada mudança
├── DOCUMENTACAO-SITE.md          este arquivo
├── .gitignore                    exclui os PDFs de preço, o brand guide e a foto original
│
├── FORJADEV-BRAND-GUIDE_1.md     (ignorado) manual de marca — fonte da verdade
├── tokens.css                    (ignorado) arquivo de origem; a versão usada é assets/css/tokens.css
├── ForjaDev-Tabela-de-Precos-*.pdf   (ignorados) documentos comerciais de origem
├── 045_AVA.jpg                   (ignorado) original de 7,7 MB da foto do rodapé da bio
│
└── assets/
    ├── css/
    │   ├── tokens.css            @font-face, tokens da marca e componentes do brand guide
    │   └── style.css             todo o estilo do site, em 23 blocos numerados
    ├── js/
    │   ├── main.js               menu, FAQ, link ativo, brilho do botão, ano, âncoras
    │   └── animations.js         malha de faíscas, mockup do hero, reveal, contadores, scroll
    ├── fonts/                    10 woff2 (2 subsets × 5 faces) + OFL.txt + README.md
    ├── img/
    │   ├── forjadev-horizontal-negativo.svg   logo usado no header, rodapé e 404
    │   ├── forjadev-horizontal.svg            versão positiva — NÃO referenciada hoje
    │   ├── forjadev-icone.svg                 símbolo isolado — NÃO referenciado hoje
    │   ├── forjadev-favicon.svg               favicon vetorial (versão de 2 faíscas)
    │   ├── favicon-16x16.png · icon-32/48/96/192/512.png · apple-touch-icon.png
    │   ├── og-image.jpg          1200×630, card de compartilhamento
    │   ├── rodrigo-prado.webp    foto da bio, formato preferido
    │   └── rodrigo-prado.jpg     fallback da foto da bio
    └── icons/                    os 6 ícones do sistema da marca (bigorna, colchete-codigo,
                                  engrenagem-chave, faisca-cursor, relogio-forja, selo-garantia)
                                  — NÃO referenciados: a página desenha SVG inline
```

---

## 4. Mapa de seções da página

Todas as seções de conteúdo vivem dentro de `<main id="conteudo">`, exceto header,
rodapé e o botão flutuante de WhatsApp.

| Âncora / ID | Classe raiz | Função comercial | CSS | JS |
|---|---|---|---|---|
| — | `.header` | Marca fixa no topo, navegação e CTA de WhatsApp sempre visível | `style.css` §8 | `main.js` `menu()`, `navAtiva()`; `animations.js` `aoRolar()` (classe `is-scrolled`) |
| `#topo` | `.hero` | Promessa central: código próprio, sem mensalidade. Dois CTAs e o mockup de "site pronto" | `style.css` §9 e §9.1 + CSS crítico inline | `animations.js` `malha()`, `mockup()` |
| `#prova` | `.secao--clara` | Quatro pilares do que vem em todo pacote + quatro contadores de prova | `style.css` §10 | `animations.js` `revelar()`, `contar()` |
| `#pacotes` | `.secao--escura` | Os 6 produtos com escopo e preço fechado; cada card leva a um WhatsApp com mensagem pronta | `style.css` §11 | `animations.js` `revelar()` |
| `#adicionais` | `.secao--clara` | Tabela de 10 serviços avulsos com preço; vira lista de cartões abaixo de 720px | `style.css` §12 | `animations.js` `revelar()` |
| `#como-funciona` | `.secao--escura` | As 4 etapas da entrega + bloco de acompanhamento com terminal `status` | `style.css` §13 | `animations.js` `revelar()` (trilha da timeline) |
| `#quem-faz` | `.secao--clara` | Prova de quem executa: foto, bio em 3 parágrafos, terminal `stack` e links sociais | `style.css` §14 | `animations.js` `revelar()` |
| `#nao-incluso` | `.secao--escura` | Corta expectativa errada antes da venda: 6 itens fora do preço | `style.css` §15 | `animations.js` `revelar()` |
| `#faq` | `.secao--clara` | 8 objeções de fechamento em acordeão; espelha o `FAQPage` do JSON-LD | `style.css` §16 | `main.js` `faq()` |
| `#contato` | `.cta-final` | Fechamento: assinatura da marca, CTA de WhatsApp e contatos | `style.css` §17 | — |
| — | `.rodape` | Navegação secundária, contatos, endereço e ano corrente | `style.css` §18 | `main.js` `ano()` |
| — | `.zap` | WhatsApp flutuante, aparece depois de rolar | `style.css` §19 | `animations.js` `aoRolar()` |
| — | `.progresso` | Barra de leitura no topo | `style.css` §8 | `animations.js` `aoRolar()` |

Os IDs `a1`…`a8` e `q1`…`q8` são dos painéis e botões do FAQ, usados por
`aria-controls` / `aria-labelledby`.

---

## 5. Sistema de design aplicado

### 5.1 Tokens de `assets/css/tokens.css` e onde aparecem

**Cor**

| Token | Valor | Onde aparece |
|---|---|---|
| `--fd-aco` | `#141A20` | fundo do hero, de toda `.secao--escura`, do rodapé, do terminal, do botão `.btn--aco`, cor de `h1`/`h2` em seção clara |
| `--fd-aco-frio` | `#2C353F` | `color` do `body`, cabeçalho do terminal, moldura do celular do mockup, fundo da janela do navegador |
| `--fd-laranja` | `#FF6A00` | **só superfície e texto sobre escuro**: eyebrow do hero e das seções escuras, fundo do bloco de preço, número da etapa, divisor tracejado, faixa de 5px do pacote em destaque, barra de progresso, `outline` de foco, acento dos ícones, botão e CTA da miniatura do mockup |
| `--fd-brasa` | `#C94300` | fundo de `.btn--primario`, fundo da seção `.cta-final`, WhatsApp flutuante |
| `--fd-brasa-texto` | `#B03A00` | eyebrow e cargo em **seção clara** (o laranja puro reprova como texto sobre claro), hover de botão |
| `--fd-faisca` | `#FFB020` | ponto amarelo do cabeçalho do terminal e do mockup, `.badge--escuro` |
| `--fd-cinza` | `#5F6A76` | texto secundário **só sobre superfície clara**: `.pilar p`, `.contador__rotulo`, `.pacote__prazo`, `.pacote__escopo`, `.faq__painel p` |
| `--fd-cinza-claro` | `#C6CBD1` | texto secundário **em toda seção escura**: `--txt-2` de `.secao--escura` e do `.hero`, rodapé, título do terminal, URL do mockup, link "Role" |
| `--fd-bigorna` | `#F4F5F6` | fundo do `body` e das seções claras, texto do corpo do terminal |
| `--fd-branco` | `#FFFFFF` | cards de pacote, pilares, contadores, itens de FAQ, tela do mockup |
| `--fd-aco-elevado` | `#1C242D` | `--superficie` da seção escura, selo "No ar", hover da lista "não incluso" |
| `--fd-sucesso` / `--fd-erro` | `#15803D` / `#C81E1E` | os três pontos do cabeçalho do terminal e do mockup |

O verde `#4ADE80` do cadeado, do selo "No ar" e do `ok` do terminal é a exceção
documentada: `--fd-sucesso` some sobre Aço.

**Tipografia:** `--fd-font-display` em `h1`, `h2`, `.preco`, `.contador__valor` e
`.erro__codigo`; `--fd-font-texto` no `body`, `h3` e `.btn`; `--fd-font-label` em
`.rotulo`, `.badge`, `.pilar h3`, `.etapa__titulo`, `.tabela thead th` e nos `h2`
do rodapé; `--fd-font-code` **apenas** em `.terminal` e `.mono`. A barra de
endereço do mockup fica em Archivo — é interface de navegador, não bloco de código.

**Forma:** `--fd-chanfro-lg` (16px) em card de pacote, terminal, janela do mockup,
foto da bio e cartões da miniatura; `--fd-chanfro-sm` (8px) em botão, bloco de
preço e ícone social; `--fd-chanfro-hover` (22px) e `--fd-ch` animável (registrado
com `@property`) fazem o corte deslizar no hover. `--fd-r-pill` fica reservado a
badge, selo, WhatsApp flutuante e ponto do terminal.

**Elevação:** `--fd-elev-repouso` no card de pacote e no item de FAQ aberto;
`--fd-elev-hover` no hover de card, pilar e tabela; `--fd-elev-destaque`
**uma única vez por seção** — no `.pacote--destaque` (LP-02).

**Movimento:** `--fd-ease`, `--fd-ease-out` e as três durações
(`--fd-dur-rapida` 150ms, `--fd-dur-media` 220ms, `--fd-dur-lenta` 300ms) em toda
transição. Nada é `linear`.

**Ritmo:** `--fd-secao-y` (`clamp(4rem,8.5vw,7rem)`) no `padding-block` de toda
seção, `--fd-wrap` (1200px) e `--fd-gutter` no `.wrap`, `--fd-header-h` /
`--fd-header-h-scroll` no header e no `scroll-padding-top`.

### 5.2 Camada técnica do brand guide presente no site

| Componente | Onde |
|---|---|
| **Chanfro sistêmico** | cards de pacote, janela do mockup, terminal, foto da bio, item de FAQ (12px), botões, bloco de preço, número da etapa, ícone social, cartões da miniatura |
| **Bloco de terminal** | `#como-funciona` (`status`), `#quem-faz` (`stack`) e `404.html` (`forjadev — bash`). Saiu do hero na edição anterior — o comprador leigo não reconhece estética de linha de comando |
| **Texturas** | `.secao__textura--aco` em hero, `#pacotes`, `#como-funciona`, `#nao-incluso`, `#contato` e 404; `.secao__textura--grid` em `#prova`, `#adicionais`, `#quem-faz`. Ambas com parallax por `animation-timeline: view()` |
| **Divisor técnico** | `hr.divisor--curto` acima do `h2` do CTA final e na borda inferior do header rolado (`::after` tracejado 6/6) |
| **Escala de elevação** | ver 5.1 — um único `--fd-elev-destaque` por seção |
| **Ícones** | 6 SVG inline de 24px, traço 2px, `currentColor` no corpo e `#FF6A00` no acento, nos 4 pilares de `#prova`, na nota do hero e na lista `#nao-incluso`. Os arquivos de `assets/icons/` não são carregados |

O celular do mockup é a **única peça com canto arredondado** — é o desenho de um
objeto real, não um card.

### 5.3 Regra de proporção do laranja

O brand guide limita o laranja a **10% da área** e proíbe duas combinações:
laranja como texto sobre fundo claro (2,87:1) e branco sobre laranja (2,87:1).

Como o código garante isso:

- **Laranja nunca é fundo de botão com texto branco.** `.btn--primario` usa Brasa
  `#C94300` (4,90:1) e o hover escurece para `#B03A00`.
- **Laranja como texto só existe sobre Aço** (6,10:1): `.hero__eyebrow`,
  `.secao--escura .secao__eyebrow`, `.painel-nota__rotulo`, `.bio__cargo`,
  `.terminal__body .prompt`. Em seção clara a regra
  `.secao--clara .secao__eyebrow` e `.secao--clara .bio__cargo` trocam para
  `--fd-brasa-texto`.
- **Preço é `#141A20` dentro de bloco `#FF6A00`** (`.preco`, `.etapa__num`),
  nunca laranja sobre branco.
- Fora isso o laranja aparece só em **traço fino ou área pequena**: divisor
  tracejado 6/6px, faixa de 5px do pacote em destaque, barra de progresso de 3px,
  `outline` de foco, um acento por ícone, a borda esquerda de 3px do cartão da
  tabela no mobile, e as superfícies da miniatura do mockup.

**Ressalva honesta:** a proporção de 10% é respeitada por construção — nenhuma
superfície laranja grande existe na página —, mas **não foi medida em pixels**.
Se a página ganhar um bloco laranja de área relevante, a conta precisa ser refeita.

---

## 6. Componentes JavaScript

Os dois arquivos são IIFEs com `'use strict'`, carregados com `defer`. Nenhum
deles cria variável global. Ambos consultam
`matchMedia('(prefers-reduced-motion: reduce)')` antes de animar.

### 6.1 `assets/js/main.js` — interface

| Função | O que faz | O que dispara | Dependências | Efeitos colaterais |
|---|---|---|---|---|
| `menu()` | Abre e fecha o painel de navegação mobile | clique no `.nav__toggle`, clique em qualquer `<a>` dentro do `.nav`, tecla `Escape`, `resize` acima de 900px | `.nav__toggle`, `#navPrincipal` | alterna `aria-expanded`, classe `is-aberto` e **trava a rolagem do `body`** (`overflow:hidden`); devolve o foco ao botão no `Escape` |
| `faq()` | Acordeão: abrir um item fecha os outros | clique em `.faq__botao` | `.faq__item`, `.faq__botao`, `.faq__painel` | alterna `aria-expanded`, classe `is-aberto` e o atributo `inert` do painel (é o `inert` que tira o conteúdo fechado do foco e do leitor de tela) |
| `navAtiva()` | Marca o link da seção que está na tela | `IntersectionObserver` com `rootMargin: -45% 0px -50% 0px` | links `.nav__link[href^="#"]` e as seções correspondentes | adiciona `is-ativo` e `aria-current="true"` a um link por vez; sem `IntersectionObserver` a função só desiste |
| `brasa()` | Gradiente de brasa que segue o ponteiro dentro do botão | `pointermove` no `document` | só roda em `(hover:hover) and (pointer:fine)` e sem movimento reduzido | escreve `--mx` / `--my` inline no botão sob o cursor |
| `ano()` | Ano corrente no rodapé | uma vez, na inicialização | `#ano` | substitui o texto |
| `ancoras()` | Desliga o scroll suave quando o usuário pede movimento reduzido | uma vez | — | escreve `scrollBehavior:auto` no `<html>` |

### 6.2 `assets/js/animations.js` — movimento

| Função | O que faz | O que dispara | Efeitos colaterais |
|---|---|---|---|
| `malha()` | Malha de faíscas no `<canvas>` do hero: nós que sobem e se ligam por linhas laranja de baixa opacidade; o ponteiro empurra os nós próximos | agendada para ~2,2s depois do `load`, em `requestIdleCallback` | esconde o canvas se houver movimento reduzido. Em aparelho modesto (≤820px, ponteiro grosso ou ≤4 núcleos) cai para 24fps, DPR 1, no máximo 14 nós e **sem as linhas** (custo O(n²) por quadro). Pausa fora da viewport e com a aba escondida |
| `mockup()` | Liga a montagem e o movimento contínuo do mockup do hero — ver 6.3 | inicialização e `IntersectionObserver` (`threshold: 0.25`) | só alterna as classes `is-montando` e `is-ativo`; **não mede nem escreve estilo inline**, então não força layout |
| `revelar()` | Scroll reveal (fade + `translateY`) de `.reveal` e dos filhos de `[data-reveal-filhos]`; desenha a trilha da timeline | `IntersectionObserver` (`threshold: 0.12`, `rootMargin: 0 0 -8% 0`) | adiciona `is-visible` e para de observar o elemento. O *stagger* vem do CSS (`:nth-child` → `--i`), não do JS — marcar 48 elementos por script invalidava o estilo do documento inteiro |
| `contar()` / `contadoresSoltos()` | Anima os quatro números de `#prova` com `easeOutCubic` em 1250ms | entrada do grupo `[data-contador-grupo]` na tela | grava `data-feito="1"` para não repetir; com movimento reduzido escreve o valor final direto |
| `aoRolar()` | Um único listener de scroll dentro de um `rAF`: classe `is-scrolled` do header (>24px), escala da barra de progresso e visibilidade do WhatsApp flutuante | `scroll` e `resize`, ambos `passive` | escreve `transform` na `.progresso`. O parallax **saiu daqui** — virou `animation-timeline: view()` no CSS, para não ler geometria a cada quadro |
| `cursorSpark()` | Círculo laranja que segue o cursor com atraso e cresce sobre elementos clicáveis | agendado para ~350ms depois do `load` | cria um `<div class="spark" aria-hidden="true">` no `body`; só em ponteiro fino, desligado em movimento reduzido |
| `agendar(fn, atraso)` | Adia enfeite para depois do `load`, dentro de `requestIdleCallback` com `timeout: 2000` | — | é o que impede que o enfeite dispute a linha principal com o carregamento |

### 6.3 O mockup animado do hero (navegador + celular)

**Onde está:** HTML em `index.html` (`<div class="mockup" id="heroMockup" role="img">`),
CSS em `assets/css/style.css` §9.1, JS na função `mockup()` de `animations.js`.

**Estrutura**

```
.mockup                      #heroMockup — role="img" + aria-label descrevendo a cena
├── .mockup__janela          janela do navegador — aspect-ratio 16/10, chanfro 16px
│   ├── .mockup__barra
│   │   ├── .mockup__dots    três pontos (erro / alerta / sucesso)
│   │   ├── .mockup__url     cadeado + "seunegocio.com.br"  ← o texto visível
│   │   └── .mockup__carga   barra laranja de 2px que "carrega"
│   └── .mockup__tela
│       └── .mini            o site em miniatura (ver unidade --u abaixo)
│           ├── .mini__topo    marca + 3 itens de menu + botão de ação
│           ├── .mini__hero    2 títulos + 2 linhas de texto + 1 botão  (5 filhos)
│           └── .mini__cards   3 cartões
├── .mockup__fone           celular sobreposto — único canto arredondado do sistema
│   └── .mockup__tela--fone
│       └── .mini.mini--fone  mesma marcação, 4 filhos no hero e 2 cartões
└── .mockup__selo           pill "No ar" com ponto verde pulsante
```

**Nenhuma imagem.** A peça inteira é CSS — zero requisição extra. A altura sai de
`aspect-ratio`, então não há layout shift (o terminal antigo precisava de um
`min-height` medido em JS).

**A unidade `--u`.** Toda medida interna da miniatura é `calc(var(--u) * n)`.
`--u` vale `.9cqi` dentro da janela e `3.4cqi` dentro do celular
(`container-type: inline-size` nos dois), com fallback de `4.4px` para navegador
sem unidade de container. É isso que faz a mesma marcação servir aos dois
aparelhos — para mudar a escala da miniatura, mexa só em `--u`.

**Timings da montagem** (classe `.is-montando`, definidos no CSS):

| Elemento | Animação | Duração | Atraso |
|---|---|---|---|
| `.mockup__carga` | `mockupCarga` (escala 0→1, some no fim) | 1,2s | 0 |
| `.mini__topo` | `mockupEntra` | 0,5s | 0,34s |
| `.mini__hero > :nth-child(1..5)` | `mockupEntra` | 0,5s | 0,50 · 0,58 · 0,66 · 0,72 · 0,82s |
| `.mini__cards span:nth-child(1..3)` | `mockupEntra` | 0,5s | 0,98 · 1,06 · 1,14s |
| `.mockup__fone` | `mockupFone` | 0,6s | 1,50s |
| `.mockup__selo` | `mockupEntra` | 0,5s | 1,90s |

**Movimento contínuo** (classe `.is-ativo`): `mockupRola` desloca o conteúdo do
celular em `-32%` ao longo de 14s, `alternate`, começando 2,4s depois; `mockupPulso`
faz o ponto do selo piscar a cada 2,4s. Os dois nascem com
`animation-play-state: paused` e só rodam com `.is-ativo`.

**Estados**

| Estado | Significado | Quem controla |
|---|---|---|
| *(sem classe)* | peça montada e parada — é o estado de repouso do CSS | é o que se vê **sem JavaScript** ou com `prefers-reduced-motion: reduce` |
| `.is-montando` | roda a sequência de montagem | `montar()` — remove a classe, força `offsetWidth` para reiniciar as animações, e adiciona de novo |
| `.is-ativo` | libera rolagem do celular e pulso do selo | `ligar()` / `desligar()`, no `IntersectionObserver` (25% visível) e no `visibilitychange` |

A montagem roda **a cada entrada em tela**. Na inicialização, se o mockup já está
acima da dobra, `mockup()` monta na hora — a flag `recemMontado` evita que o
primeiro retorno do observer remonte e produza o pisca "pronto → some → monta".

**Como alterar o conteúdo exibido**

1. **Endereço na barra** — texto de `.mockup__url` (hoje `seunegocio.com.br`).
   Ele representa o site **do cliente**, não este site; trocar por
   `forjadev.app.br` contradiz o argumento "hospedagem sua, domínio seu".
2. **Selo** — texto de `.mockup__selo` (hoje `No ar`).
3. **Blocos da miniatura** — são formas abstratas, não texto. Para mudar
   proporção, ajuste os multiplicadores de `--u` em `.mini__titulo`,
   `.mini__linha`, `.mini__botao`, `.mini__cards` etc.
4. **Se acrescentar ou remover um filho** de `.mini__hero` ou de `.mini__cards`,
   acrescente ou remova a regra `:nth-child` de atraso correspondente — sem ela o
   elemento novo entra sem animação.
5. **O `aria-label` de `#heroMockup` é a descrição acessível da cena inteira** —
   toda mudança visual precisa ser refletida nele. O interior é `aria-hidden`.

---

## 7. Formulários e integrações

**O site não tem formulário.** Não existe `<form>`, `<input>`, `<textarea>` nem
`<select>` em `index.html` ou `404.html`. Consequentemente:

- **Endpoints:** nenhum. A página não faz `fetch`, `XHR` nem `sendBeacon`.
- **Método / campos / validação / tratamento de erro:** não se aplica.
- **Destino dos dados:** nenhum dado de visitante é coletado, armazenado ou
  transmitido pelo site. Não há cookie, `localStorage`, analytics, pixel ou tag
  de terceiro.

A conversão inteira acontece por **link de saída**, em três formatos:

| Canal | Destino | Onde aparece |
|---|---|---|
| WhatsApp | `https://wa.me/5544991192295?text=…` com mensagem pré-preenchida por contexto | header (desktop e mobile), 2 CTAs do hero, 1 botão por card de pacote (6), CTA dos adicionais, CTA final, rodapé, botão flutuante — 14 ocorrências |
| E-mail | `mailto:rodrigodiaz128@gmail.com` | CTA final e rodapé |
| Perfis | LinkedIn e GitHub de Rodrigo Prado | bio e rodapé |

Todos os links externos usam `target="_blank" rel="noopener"` e `aria-label`
descritivo terminando em "(abre em nova aba)".

As mensagens pré-preenchidas mudam por contexto — por exemplo
`Quero a LP-01 — Landing Page Essencial.` no card da LP-01 e
`Quero o ST-02 — Site Institucional Plus. Podemos marcar o briefing técnico?` no
ST-02. Ao editar um card, **atualize a mensagem junto com o nome do pacote**, ou o
lead chega identificando o produto errado.

> O adicional "Formulário que chega até você — cai direto na planilha do Google e
> no seu e-mail (R$ 290)" e a "Integração com CRM (R$ 490)" são **produtos
> vendidos ao cliente**, não recursos instalados neste site.

---

## 8. Acessibilidade

Lighthouse **Acessibilidade 100/100** (mobile, headless) antes e depois desta
mudança.

**Contrastes verificados** (WCAG 2.1, valores do brand guide e dos comentários do
CSS):

| Par | Razão | Onde |
|---|---|---|
| `#FFFFFF` sobre `#C94300` | 4,90:1 | `.btn--primario`, `.cta-final`, `.zap` |
| `#141A20` sobre `#FF6A00` | 6,10:1 | `.preco`, `.etapa__num` |
| `#FF6A00` sobre `#141A20` | 6,10:1 | eyebrow em seção escura, `.bio__cargo`, `prompt` do terminal |
| `#C6CBD1` sobre `#141A20` | 11,1:1 | todo texto secundário em seção escura |
| `#5F6A76` sobre `#FFFFFF` | 5,51:1 | texto secundário em card branco |
| `#B03A00` sobre `#F4F5F6` | 5,54:1 | eyebrow e cargo em seção clara |
| `#FFB020` sobre `#141A20` | 9,58:1 | `.badge--escuro` |
| `#8E99A4` sobre `#141A20` | 4,9:1 | comentário do terminal |

Os dois pares reprovados pelo guia (`#FFFFFF` sobre `#FF6A00` e `#FF6A00` como
texto sobre claro) **não existem no código**.

**Landmarks e estrutura:** `<header>`, `<main id="conteudo">`, `<footer>` e dois
`<nav>` (principal e do rodapé), cada um com `aria-label` ou `aria-labelledby`.
Cada `<section>` de conteúdo tem `aria-labelledby` apontando para o próprio `h2`.
Um único `h1` por página. O rodapé tem um `h2` em `.sr-only` nomeando a região.

**Alt texts:** os dois logos têm `alt="ForjaDev"`; a foto da bio descreve a cena
("Rodrigo Prado, desenvolvedor web responsável pela ForjaDev, em retrato de
estúdio em preto e branco."); todo SVG decorativo é `aria-hidden="true"`; o
mockup do hero é `role="img"` com `aria-label` completo.

**Foco visível:** `:focus-visible { outline: 3px solid var(--fd-laranja);
outline-offset: 3px }` — global, nunca removido. Link "Pular para o conteúdo"
fixo no topo, revelado por `:focus`.

**Navegação por teclado:** o FAQ é feito de `<button>` reais com `aria-expanded`
e `aria-controls`; o painel fechado recebe `inert`, então seu conteúdo sai da
ordem de tabulação e da árvore de acessibilidade. O menu mobile fecha com
`Escape` e devolve o foco ao botão. As etapas da timeline têm o número como
`aria-hidden` e um `<span class="sr-only">Etapa N: </span>` no título.

**Movimento:** `prefers-reduced-motion: reduce` zera durações, desliga a malha de
faíscas, o cursor spark, a montagem do mockup, o parallax, o pulso do WhatsApp e
o scroll suave, e força todo conteúdo revelado a ficar visível. O `<noscript>`
tem a mesma garantia para quem está sem JavaScript.

---

## 9. Performance e SEO

### 9.1 Últimas pontuações Lighthouse

Lighthouse 12.8.2, `formFactor: mobile`, Chrome headless, servidor estático local
(`http://localhost:8080`). Categorias determinísticas (acessibilidade, boas
práticas, SEO) são estáveis; **performance nesta máquina é ruidosa** — a mesma
build variou de 65 a 88 entre execuções.

| Categoria | Antes | Depois |
|---|---|---|
| Performance | 65 · 88 · 65 · 70 → **mediana 67** | 61 · 71 · 74 · 68 → **mediana 69** |
| Acessibilidade | **100** | **100** |
| Boas práticas | **100** | **100** |
| SEO | **100** | **100** |
| CLS | **0** | **0** |
| LCP | 3,5–3,9 s | 3,6–4,0 s |
| TBT | 70–980 ms | 600–1070 ms |

As quatro execuções de cada versão foram alternadas (antes, depois, antes,
depois…) contra a build anterior extraída de `git archive HEAD`, exatamente para
separar sinal de ruído. Como a mudança é só de texto e o payload ficou **menor**,
não há regressão atribuível a ela. Os números não são comparáveis a uma medição
em CI limpo.

### 9.2 Estratégia de carregamento

**Fontes:** 5 faces auto-hospedadas, subsets `latin` e `latin-ext` em woff2, com
`preload` das 5 faces `latin`. O subset `latin` usa `font-display: optional` e o
`latin-ext` usa `swap`. Existem faces de fallback com métrica casada
(`Archivo Fallback`, `Archivo Black Fallback`, `Barlow Condensed Fallback`,
`JetBrains Mono Fallback`) com `size-adjust` medido no Chrome — é isso que
mantém o CLS em 0 quando a fonte real chega.

**CSS:** todo o crítico (tokens, reset, header, hero e mockup) está **inline** no
`<head>`. `tokens.css` e `style.css` entram como
`<link rel="preload" as="style" onload="this.rel='stylesheet'">`, com
`<noscript>` servindo os mesmos dois arquivos como stylesheet comum.

**JS:** dois arquivos com `defer`, ~21 KB somados, sem dependência externa. O
enfeite caro é adiado para depois do `load` dentro de `requestIdleCallback`.

**Imagens:** a foto da bio usa `<picture>` com WebP (20 KB) e fallback JPEG
(35 KB), `width`/`height` explícitos, `loading="lazy"` e `decoding="async"`. Os
logos são SVG. O mockup do hero e todos os ícones são desenhados em CSS/SVG
inline — nenhuma requisição de imagem acima da dobra.

### 9.3 SEO

- `<title>`, `meta description`, `link rel=canonical` para `https://forjadev.app.br/`
- **Open Graph** completo: `type`, `locale`, `site_name`, `url`, `title`,
  `description`, `image` (1200×630, `image/jpeg`) e `image:alt`
- **Twitter**: `summary_large_image`, `title`, `description`, `image`, `image:alt`
- **SEO local**: `geo.region BR-PR`, `geo.placename Maringá`,
  `geo.position -23.425269;-51.938340`, `ICBM`
- **JSON-LD** com 5 nós em `@graph`: `ProfessionalService`, `Person`,
  `OfferCatalog` (6 ofertas com preço e `priceValidUntil 2026-12-31`), `WebSite` e
  `FAQPage` (8 perguntas). O `FAQPage` **espelha o texto visível** da seção `#faq`
  — os dois precisam ser editados juntos
- **Favicon**: SVG + PNG 16/32/48 + `apple-touch-icon` + `site.webmanifest` com
  ícones 96/192/512
- **`sitemap.xml`**: uma URL (a home), `lastmod 2026-09-05`, `priority 1.0`
- **`robots.txt`**: `Allow: /` e ponteiro para o sitemap
- **`404.html`** com `noindex, follow`

---

## 10. Inventário de copy

Todos os textos fixos de `index.html`. As linhas são as do arquivo **depois**
desta mudança. Textos do `<head>` e do JSON-LD estão separados no fim porque
duplicam conteúdo visível e precisam ser editados junto com ele.

### 10.1 Header e hero

| Seção | Texto | Linha |
|---|---|---|
| skip link | Pular para o conteúdo | 400 |
| header | Pacotes · Adicionais · Como funciona · Quem faz · Dúvidas | 417–421 |
| header | Chamar no WhatsApp *(2×: menu mobile e botão do topo)* | 425, 432 |
| hero | Maringá – PR · Código próprio, sem plataforma | 448 |
| hero | Site pronto **de verdade**. / Sem mensalidade, sem construtor. | 450–451 |
| hero | Landing page a partir de **R$ 890**, pronta em 3 dias úteis. **Código seu, hospedagem sua**, preço fechado. Você não paga plataforma nenhuma para o site continuar no ar. | 453–456 |
| hero | Chamar no WhatsApp · Ver pacotes | 464, 466 |
| hero | Briefing e layout aprovados até as 12h entram na fila do mesmo dia útil. | 471 |
| hero (mockup) | seunegocio.com.br · No ar | 484, 526 |
| hero | Role | 533 |

### 10.2 Prova rápida (`#prova`)

| Texto | Linha |
|---|---|
| O que vem em todo pacote | 541 |
| Quatro coisas que o seu site precisa fazer. | 542 |
| Não é lista de recurso. É o mínimo para o site dar retorno — e vem em todos os pacotes, sem cobrança extra. | 543 |
| Feito para o celular / Construído primeiro para a tela pequena, que é onde a maioria vai ver. | 549–550 |
| Código próprio / HTML, CSS e JS. Sem construtor e sem mensalidade de plataforma. | 554–555 |
| Abre rápido / Carrega em menos de 2 segundos. Nota 90+ no teste de performance do Google. | 559–560 |
| No ar sem dor / Publicação e configuração inclusas. Você não precisa mexer em nada. | 564–565 |
| Contadores: 3 · 90+ · <2s · 15 | 571, 575, 579, 583 |
| Rótulos: Dias úteis para a landing page · Nota Lighthouse na entrega · Para o site abrir · Dias de suporte após a entrega | 572, 576, 580, 584 |

### 10.3 Pacotes (`#pacotes`)

| Texto | Linha |
|---|---|
| Pacotes · Edição 2026.1 | 595 |
| Por projeto. Preço fechado. | 596 |
| Escolha pelo tamanho do que você precisa. O valor combinado no início é o valor final, desde que o escopo não mude. | 597 |
| **LP-01** · Prazo 3 dias úteis · Landing Page Essencial · R$ 890 | 604–612 |
| **LP-02** · Prazo 3 dias úteis · Landing Page Avançada · R$ 1.490 | 621–629 |
| **ST-01** · Prazo 5 dias úteis · Site Institucional · R$ 2.290 | 638–646 |
| **CT-01** · Prazo 8 dias úteis · Catálogo / Vitrine · R$ 3.990 | 655–663 |
| **ST-02** · Prazo sob consulta · Site Institucional Plus · Sob consulta | 672–680 |
| **Multi-idioma** · + 2 dias úteis por idioma · Até 3 idiomas · +30% | 689–697 |
| Rótulo de preço: Por projeto · a partir de *(4×)* / Escopo aberto · orçado por demanda / Sobre o valor do pacote, por idioma | 611, 628, 645, 662, 679, 696 |

### 10.4 Adicionais (`#adicionais`)

| Texto | Linha |
|---|---|
| Adicionais e serviços avulsos | 713 |
| Precisa de mais? O preço também é fechado. | 714 |
| Somados ao pacote, contratados quando você quiser. Nada aqui é obrigatório. | 715 |
| Cabeçalho da tabela: Serviço · Valor | 721 |
| Layout exclusivo, criado do zero — R$ 690 | 725–726 |
| Formulário que chega até você — R$ 290 | 729–730 |
| Preparação para o Google (SEO) — R$ 390 | 733–734 |
| Área que você mesmo edita — R$ 890 | 737–738 |
| Rodada de revisão extra — R$ 180 | 741–742 |
| Página avulsa adicional — R$ 290 | 745–746 |
| Integração com CRM — R$ 490 | 749–750 |
| Medição de resultado — R$ 290 | 753–754 |
| Entrega expressa em 48h — +40% | 757–758 |
| Hora avulsa — R$ 140 | 761–762 |
| Falar sobre adicionais | 771 |

> A `<caption>` "Valores somados ao pacote — edição 2026.1, vigência de 90 dias."
> foi **removida** nesta edição.

### 10.5 Como funciona (`#como-funciona`)

| Texto | Linha |
|---|---|
| Como funciona / Quatro etapas. Sem reunião que não precisa existir. | 781–782 |
| O prazo começa a contar depois que textos, imagens e acessos chegam completos. | 783 |
| 01 Briefing — Você envia textos, imagens e acessos. Simples assim. | 790–792 |
| 02 Desenvolvimento — Construímos começando pelo celular e revisamos internamente. | 795–797 |
| 03 Homologação — Você recebe um link, vê tudo pronto e pede até 2 rodadas de ajuste. | 800–802 |
| 04 Publicação — Colocamos no ar, configurado, e entregamos os arquivos. | 805–807 |
| Acompanhamento online / Você vê o andamento sem precisar perguntar. | 814–815 |
| Você abre a demanda, vê o status de cada etapa, anexa arquivo e consulta todo o histórico quando quiser. Acesso liberado no início, sem custo adicional. | 816 |
| Terminal `status`: forjadev --status · briefing/desenvolvimento ok · homologacao 2 rodadas inclusas · publicacao inclusa no pacote · `# painel no clickup, liberado no inicio` | 821–829 |

### 10.6 Quem faz (`#quem-faz`)

| Texto | Linha |
|---|---|
| Quem faz | 841 |
| Sem intermediário entre o que você pede e quem constrói. | 842 |
| Maringá – PR · Desenvolvimento web *(badges)* | 855–856 |
| Rodrigo Prado / Desenvolvedor web · ForjaDev | 861–862 |
| O código do seu site é escrito à mão. HTML, CSS e JavaScript, do zero, sem construtor visual e sem tema comprado — o que entra na página é linha que dá para abrir e explicar. | 864 |
| Antes de virar página, boa parte do trabalho é fluxo: … Integração com API, planilha e CRM, configurada para rodar sozinha. | 866 |
| E o site tem que abrir rápido e ser achado. Performance, SEO técnico e publicação fazem parte da entrega: a ForjaDev sobe o site, configura o domínio e deixa funcionando. | 868 |
| Terminal `stack`: linguagem · integracao · dados · entrega · medicao · `# sem framework, sem construtor, sem plugin pago` | 873–882 |
| LinkedIn · GitHub | 889, 893 |

### 10.7 Não incluso, FAQ e fechamento

| Texto | Linha |
|---|---|
| Não incluso / O que não está no preço. / Melhor saber agora do que descobrir na entrega… | 906–908 |
| 6 itens fora do preço | 912–917 |
| Dúvidas / O que perguntam antes de fechar. | 927–928 |
| P1 Em quanto tempo meu site fica pronto? | 936 / 941 |
| P2 Quantas rodadas de revisão estão inclusas? | 948 / 953 |
| P3 Como funciona o pagamento? | 960 / 965 |
| P4 Quem escreve os textos e fornece as imagens? | 972 / 977 |
| P5 Tem suporte depois que o site entra no ar? | 984 / 989 |
| P6 Hospedagem, domínio e SSL estão inclusos? | 996 / 1001 |
| P7 Como funciona um site em mais de um idioma? | 1008 / 1013 |
| P8 Como acompanho o andamento do projeto? | 1020 / 1025 |
| O ferro quente não espera. | 1039 |
| Envie o que você precisa e a ForjaDev volta com escopo, prazo e valor fechados. O código e a hospedagem ficam no seu nome, sem mensalidade de plataforma. Briefing e layout aprovados até as 12h entram na fila do mesmo dia útil. | 1040 |
| (44) 99119-2295 · rodrigodiaz128@gmail.com · Maringá – PR | 1052–1054 |
| Rodapé: Sites e landing pages com código próprio, preço fechado e sem mensalidade de plataforma. Maringá – PR, para o Brasil todo. | 1072 |
| Rodapé: Navegação · Contato · Voltar ao topo · © 2026 ForjaDev · Rodrigo Prado. | 1084–1111 |

### 10.8 Head e JSON-LD — espelham conteúdo visível

| O que | Linha |
|---|---|
| `<title>` | 6 |
| `meta description` | 7 |
| `og:title` / `og:description` / `og:image:alt` | 24, 25, 30 |
| `twitter:title` / `twitter:description` / `twitter:image:alt` | 34, 35, 37 |
| JSON-LD `ProfessionalService.description` | 159 |
| JSON-LD `Person.description` | 199 |
| JSON-LD `OfferCatalog` — descrição das 6 ofertas | 234, 249, 264, 279, 292, 305 |
| JSON-LD `WebSite.description` | 320 |
| JSON-LD `FAQPage` — 8 pares pergunta/resposta | 330–390 |
| `site.webmanifest` → `name`, `short_name`, `description` | arquivo próprio |

---

## 11. Publicação

O deploy **é o push**. O GitHub Pages serve a branch `main` a partir da raiz.

```bash
# 1. conferir que só os arquivos esperados mudaram
git status

# 2. adicionar e commitar
git add index.html assets/css/style.css DOCUMENTACAO-SITE.md CHANGELOG.md
git commit -m "copy: descrição da mudança"

# 3. publicar
git push origin main

# 4. acompanhar o build do Pages (build clássico, não aparece em `gh run list`)
gh api repos/rodprado128/forjadev-site/pages/builds/latest --jq '{status,created_at,duration}'

# 5. conferir o HTML realmente servido
curl -s https://forjadev.app.br/ | grep -c "trecho que deveria estar lá"
```

**Configuração de DNS (Registro.br).** Para o apex `forjadev.app.br`, quatro
registros `A` apontando para o GitHub Pages:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

E um `CNAME` de `www` para `rodprado128.github.io`.

**Status atual do domínio:** ativo e servindo. O certificado HTTPS está aprovado
para `forjadev.app.br` e `www.forjadev.app.br`, com validade até **2026-12-05**
(renovação automática do GitHub). O `custom_404` está reconhecido.

**Tempo de propagação esperado:** o build do Pages costuma concluir em menos de
um minuto depois do push, e o CDN atualiza em seguida — na prática, o HTML novo
aparece em até ~2 minutos. Mudança de DNS no Registro.br é outra história: até 24h,
normalmente bem menos. Cache de card social (Facebook, LinkedIn, X) é **por URL**
e não expira sozinho: ao trocar `og-image.jpg`, rode o link no Sharing Debugger /
Post Inspector.

---

## 12. Manutenção

### 12.1 Alterar preço

Um preço aparece em **três lugares** e os três precisam mudar juntos:

1. o card do pacote — `<p class="preco">R$ 890</p>` (linhas 612, 629, 646, 663, 680, 697);
2. o JSON-LD — campo `price` da oferta correspondente (linhas 230, 245, 260, 275);
3. o hero e as meta tags, se o valor citado for o "a partir de R$ 890"
   (linhas 7, 25, 35, 159, 320, 454 e `site.webmanifest`).

O bloco `.preco` é `display:inline-block` com chanfro — cresce com o texto e não
quebra layout. **Não troque a cor:** é `#141A20` sobre `#FF6A00` por regra de
contraste. Para adicionais, o valor está na coluna `.tabela__valor` (linhas 726 a
762) e alguns também aparecem no FAQ (R$ 180 na P2, R$ 690 na P4, R$ 140 na P5).

### 12.2 Alterar prazo

Prazo aparece no badge do card (`.pacote__prazo`, linhas 605, 622, 639, 656, 673,
690), no JSON-LD (`description` de cada oferta), no contador de `#prova` (linha
571, atributo `data-contador="3"` — o número de dentro do `<span>` é só o
fallback sem JS, o valor real é o `data-contador`), no hero (linha 454), na P1 do
FAQ (linhas 333 e 941) e nas meta tags.

Lembre do posicionamento: **prazo é característica da entrega, nunca a promessa
central da página.**

### 12.3 Alterar texto de pacote

Nome (`.pacote__nome`), resumo (`.pacote__resumo`) e escopo (`.pacote__escopo`)
são texto livre — o card é `flex-direction:column` com `.pacote__rodape` em
`margin-top:auto`, então cards de alturas diferentes continuam com o preço e o
botão alinhados na base. Ao mexer no nome, **atualize também**:

- o `aria-label` do botão do card;
- a mensagem pré-preenchida do `wa.me` (o texto vai codificado na URL);
- o `name` e a `description` da oferta no JSON-LD.

### 12.4 Alterar telefone

O número `5544991192295` aparece em **14 URLs de `wa.me`** e o formato humano
`(44) 99119-2295` em `aria-label`s, no CTA final e no rodapé. Também está no
JSON-LD (`telephone`, linha 161) e no `404.html`. Troque tudo de uma vez:

```bash
grep -rn "5544991192295\|99119-2295" index.html 404.html
```

### 12.5 O que NÃO editar sem consultar o manual de marca

- **A cor do botão.** `#FF6A00` com texto branco dá 2,87:1 e é reprovado. Botão
  com texto branco é sempre Brasa `#C94300`.
- **Preço laranja sobre fundo claro.** É o erro que o guia nomeia como o mais
  fácil de cometer. Preço é Aço dentro de bloco laranja.
- **`--fd-cinza` (`#5F6A76`) em seção escura.** Dá 2,06:1 sobre Aço. Em fundo
  escuro o secundário é `--fd-cinza-claro` (`#C6CBD1`).
- **Trocar chanfro por `border-radius`** em card, bloco de preço, bloco de
  destaque ou terminal. O raio fica reservado a badge, pill e ao celular do
  mockup.
- **JetBrains Mono fora do terminal.** Nem título, nem corpo, nem preço, nem
  rótulo — e nem a barra de endereço do mockup, que é interface de navegador.
- **Barlow Condensed fora de caixa alta**, ou sem o tracking de +2%.
- **Mais de um `--fd-elev-destaque` por seção.**
- **O símbolo:** nunca rotacionado, distorcido, sombreado ou com gradiente; a
  faísca é sempre laranja; abaixo de 32px só a versão de 2 faíscas.
- **A proporção do laranja** (máximo 10% da área) e o gradiente, que nunca toca
  o logo.
- **Trocar a promessa central de volta para prazo.** A decisão está registrada no
  `CHANGELOG.md` e no brand guide 2026.1.2: contra construtor com IA, disputa de
  velocidade é terreno perdido.

---

## 13. Pendências conhecidas

1. **Primeira pessoa ainda presente na P6 do FAQ.** "A publicação e a
   configuração estão inclusas no preço — **eu subo o site e deixo funcionando**"
   aparece no texto visível (linha 1001) e no JSON-LD (linha 373). É exatamente a
   construção que esta edição eliminou da bio e do CTA; ficou de fora porque
   estava fora do escopo da mudança. Corrigir os dois juntos, ou o FAQ estruturado
   deixa de espelhar a página.
2. **`404.html` fala na primeira pessoa:** "Volte para o início — ou **me chame**
   direto e resolvemos em um minuto." (linha 63).
3. **A tabela de adicionais ficou sem nome acessível.** A `<caption>` removida era
   o que nomeava a `<table>` para leitor de tela. O Lighthouse continua em 100 —
   ele não audita isso —, mas se a intenção for manter a nomeação, o caminho é uma
   `<caption>` nova (sem a informação de vigência) ou um `aria-label` na tabela.
4. **"Enforce HTTPS" está desligado** na configuração do Pages
   (`https_enforced: false`), embora o certificado esteja aprovado. Ligar em
   *Settings → Pages*.
5. **Assets versionados que ninguém carrega:** `assets/icons/` inteiro (6 SVG),
   `assets/img/forjadev-horizontal.svg` e `assets/img/forjadev-icone.svg`. A
   página desenha os ícones inline. São ~5 KB parados no repositório — manter como
   biblioteca da marca é uma decisão válida, só não é uso.
6. **`sitemap.xml` com `lastmod` de 2026-09-05**, anterior a esta mudança.
7. **A `<caption>` removida era o único lugar que datava a tabela de adicionais**
   como edição 2026.1. Os pacotes ainda trazem "Pacotes · Edição 2026.1" (linha
   595) e o JSON-LD ainda tem `priceValidUntil: 2026-12-31` — ou seja, a página
   deixou de anunciar vigência ao visitante, mas continua declarando validade de
   preço aos buscadores. Alinhar as duas coisas é decisão comercial.
8. **`FORJADEV-BRAND-GUIDE_1.md` e `tokens.css` da raiz não são versionados.** O
   guia é a fonte da verdade da marca e existe só na máquina local — não há cópia
   no repositório se a máquina se perder.
9. **Não há medição de audiência.** Nenhum GA4, Tag Manager ou pixel. A página
   vende "Medição de resultado" como adicional, mas não se mede.
10. **Performance medida localmente é ruidosa** (65 a 88 na mesma build). Para ter
    número confiável, rodar o Lighthouse contra a URL pública, em máquina ociosa,
    ou por PageSpeed Insights.
