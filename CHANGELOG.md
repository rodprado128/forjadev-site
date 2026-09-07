# Mudanças

## 2026-09-06 — Copy: fora a vigência e o ClickUp, fora a primeira pessoa

Quatro alterações de texto e a criação da documentação técnica do site. Nenhuma
mudança de layout, de token, de cor, de fonte ou de comportamento — só copy, mais
a limpeza de uma regra de CSS que ficou sem elemento.

### 1. Removida a legenda de vigência da tabela de adicionais

| | |
|---|---|
| **Antes** | `<caption>Valores somados ao pacote — edição 2026.1, vigência de 90 dias.</caption>` |
| **Depois** | *(elemento removido)* |

**Racional:** anunciar prazo de validade de tabela cria urgência artificial e
convida o visitante a perguntar "e depois dos 90 dias?" numa página cujo
argumento é previsibilidade de preço. A informação de edição continua no
cabeçalho dos pacotes ("Pacotes · Edição 2026.1") e a validade continua declarada
aos buscadores pelo `priceValidUntil` do JSON-LD.

A frase era o conteúdo inteiro do `<caption>`, então o elemento saiu junto — sem
tag vazia. A regra `.tabela caption` de `assets/css/style.css` foi removida
porque ficou sem elemento para estilizar. O `padding-bottom:1rem` que ela
aplicava era o único espaço que ela ocupava: com a legenda fora, a folga entre o
cabeçalho da seção e a tabela passou a ser exatamente a mesma das outras seções
(32px em 360/768px, 48px em 1440px, medida no navegador). Não sobrou respiro
órfão — o ritmo, na verdade, ficou mais regular.

### 2. Removida a menção a ClickUp

| | |
|---|---|
| **Antes** | "**Cada projeto tem um painel próprio no ClickUp.** Você abre a demanda, vê o status de cada etapa, anexa arquivo e consulta todo o histórico quando quiser. Acesso liberado no início, sem custo adicional." |
| **Depois** | "Você abre a demanda, vê o status de cada etapa, anexa arquivo e consulta todo o histórico quando quiser. Acesso liberado no início, sem custo adicional." |

**Racional:** nomear a ferramenta amarra a entrega a um fornecedor específico e
não diz nada ao comprador principal, que é leigo em tecnologia — o que ele compra
é "vejo o andamento sem precisar perguntar", não a marca do painel.

A frase aparecia em **três lugares** e saiu dos três, para o FAQ estruturado
continuar espelhando o texto visível:

- `index.html:816` — bloco "Acompanhamento online" de `#como-funciona`
- `index.html:1025` — resposta da P8 do FAQ
- `index.html:373` *(antes da edição: 389)* — `FAQPage` do JSON-LD

Em cada caso a frase era a primeira de um parágrafo maior, então só a frase saiu.
A outra menção a ClickUp — o comentário `# painel no clickup, liberado no inicio`
no terminal `status` — **foi preservada de propósito**, conforme instrução.

### 3. Título de "Quem faz" reescrito

| | |
|---|---|
| **Antes** | Quem escreve o código é quem atende você. |
| **Depois** | Sem intermediário entre o que você pede e quem constrói. |

**Racional:** "quem escreve o código é quem atende" descreve uma operação de uma
pessoa só, que o comprador lê como risco de amadorismo; "sem intermediário"
descreve o mesmo fato como benefício — o pedido chega em quem executa, sem
telefone sem fio.

Mesma tag, mesma classe, mesmo `id`, mesmo tamanho e peso de fonte. A regra
`h1,h2,h3,h4 { text-wrap:balance }` já existia: em 360px a frase quebra em 4
linhas equilibradas e a última tem 2 palavras ("quem constrói."), sem viúva. Não
foi preciso `<br>` nem CSS novo.

### 4. Bio reescrita em terceira pessoa (3 parágrafos)

| | Antes | Depois |
|---|---|---|
| **P1** | **Eu escrevo o código do seu site.** HTML, CSS e JavaScript, do zero, sem construtor visual e sem tema comprado — o que entra na página é linha que **eu consigo** abrir e explicar. | **O código do seu site é escrito à mão.** HTML, CSS e JavaScript, do zero, sem construtor visual e sem tema comprado — o que entra na página é linha que **dá para** abrir e explicar. |
| **P2** | Antes de virar página, boa parte do trabalho é fluxo: … webhook que dispara o aviso na hora. **Integro com API, planilha e CRM e faço isso rodar sozinho.** | Antes de virar página, boa parte do trabalho é fluxo: … webhook que dispara o aviso na hora. **Integração com API, planilha e CRM, configurada para rodar sozinha.** |
| **P3** | E o site tem que abrir rápido e ser achado. Performance, SEO técnico e publicação **são** parte da entrega: **eu subo, configuro** o domínio e **deixo** funcionando. | E o site tem que abrir rápido e ser achado. Performance, SEO técnico e publicação **fazem** parte da entrega: **a ForjaDev sobe o site, configura** o domínio e **deixa** funcionando. |

**Racional:** a bio em primeira pessoa faz a ForjaDev soar como freelancer, não
como estúdio — e é justamente na seção que existe para dar confiança. Descrever o
trabalho pelo que ele é, e o executor como a marca, sustenta o mesmo fato sem o
tom de perfil pessoal.

Estrutura preservada: continuam três `<p>` separados dentro de `.bio__texto`,
sem `<strong>` nem `<span>` (os originais também não tinham). Varredura final no
bloco: zero verbo em primeira pessoa, singular ou plural.

### 5. Parágrafo do CTA final reescrito

| | |
|---|---|
| **Antes** | **Me manda** o que você precisa e **eu volto** com escopo, prazo e valor fechados. O código e a hospedagem ficam no seu nome, sem mensalidade de plataforma. Briefing e layout aprovados até as 12h entram na fila do mesmo dia útil. |
| **Depois** | **Envie** o que você precisa e **a ForjaDev volta** com escopo, prazo e valor fechados. O código e a hospedagem ficam no seu nome, sem mensalidade de plataforma. Briefing e layout aprovados até as 12h entram na fila do mesmo dia útil. |

**Racional:** o fechamento é o pior lugar para soar informal — "me manda" pede
intimidade que o visitante ainda não tem. O imperativo formal mantém a ordem
direta que o brand guide pede e devolve a entrega à marca.

Continua **um único `<p>`**, como no original. Botão, `href` do WhatsApp,
`aria-label`, `target` e `rel` intocados.

### Varredura global de primeira pessoa (nada alterado fora do escopo)

Padrões `\bEu\b`, `\bmeu\b`, `\bminha\b`, `\bcomigo\b` e ` eu ` em todos os
`.html`. Encontrado e **deixado como está**, por estar fora do escopo desta
mudança:

| Arquivo:linha | Trecho | Observação |
|---|---|---|
| `index.html:1001` | "A publicação e a configuração estão inclusas no preço — **eu subo** o site e deixo funcionando." | P6 do FAQ. Mesma construção que saiu do P3 da bio — **precisa do mesmo tratamento** |
| `index.html:373` | idem, no `FAQPage` do JSON-LD | tem de mudar junto com a linha 1001 |
| `index.html:330` e `936` | "Em quanto tempo **meu** site fica pronto?" | primeira pessoa **do visitante**, não da marca — correto como está |
| `404.html:63` | "Volte para o início — ou **me chame** direto e resolvemos em um minuto." | fora do padrão buscado, mas é primeira pessoa da marca |

### Arquivos tocados

| Arquivo | O que |
|---|---|
| `index.html` | 4 alterações de copy (7 trechos: 1 remoção de elemento, 3 remoções de frase, 5 substituições de texto) |
| `assets/css/style.css` | removida a regra `.tabela caption`, sem elemento depois da remoção 1 |
| `DOCUMENTACAO-SITE.md` | **novo** — documentação técnica completa do site |
| `CHANGELOG.md` | esta entrada |

Intocados: `tokens.css`, os dois `.js`, `404.html`, `site.webmanifest`,
`robots.txt`, `sitemap.xml`, `CNAME` e todos os assets.

### Validação

- **Parser HTML** (`node-html-parser`) em `index.html` e `404.html`: nenhuma tag
  aberta sem fechar, nenhum elemento vazio deixado pelas remoções, JSON-LD
  válido com 5 nós no `@graph`, um único `h1`, tabela ainda com `thead` e `tbody`.
- **Nenhum estilo inline novo**, nenhuma cor hex, `border-radius` ou
  `font-family` introduzido. Todas as cores continuam vindo de `tokens.css`.
  Texto secundário em fundo escuro continua `--fd-cinza-claro` (`#C6CBD1`);
  `#5F6A76` só aparece sobre superfície clara.
- **Renderização em 360, 768 e 1440px** (Chrome headless, CDP): nenhuma rolagem
  horizontal; folga cabeçalho→conteúdo idêntica entre `#prova`, `#pacotes`,
  `#adicionais` e `#nao-incluso`; parágrafo do "Acompanhamento online" com
  99/50/50px de altura e 9,6px de folga do `h3` — sem espaço órfão nas duas
  seções que sofreram remoção.

### Lighthouse

Lighthouse 12.8.2, mobile, Chrome headless, servidor estático local. Quatro
execuções por versão, **alternadas** entre a build anterior (extraída com
`git archive HEAD`, servida na porta 8081) e a nova (porta 8080).

| Categoria | Antes | Depois |
|---|---|---|
| Performance | 65 · 88 · 65 · 70 → mediana **67** | 61 · 71 · 74 · 68 → mediana **69** |
| Acessibilidade | **100** | **100** |
| Boas práticas | **100** | **100** |
| SEO | **100** | **100** |
| CLS | **0** | **0** |

**Sobre a performance:** a mesma build anterior pontuou de 65 a 88 e teve TBT de
70ms a 980ms entre execuções — a variação é da máquina, não do código. Foi por
isso que as execuções foram alternadas. A mudança é só de texto, o payload ficou
menor e nenhum recurso, script ou regra de layout mudou: não há regressão
atribuível a ela. Acessibilidade, boas práticas e SEO, que são determinísticos,
ficaram em 100 antes e depois. Para número confiável de performance, medir contra
a URL pública em máquina ociosa.

### Documentação nova

Criado o `DOCUMENTACAO-SITE.md` na raiz, em PT-BR, com 13 seções extraídas da
leitura do código: identificação e configuração real do Pages, stack e ausência
de build step, árvore de arquivos comentada, mapa das 13 seções da página,
tokens de `tokens.css` com onde cada um aparece, camada técnica da marca em uso,
regra de proporção do laranja, cada função de `main.js` e `animations.js`
(inclusive estrutura, timings, estados e como editar o mockup animado do hero),
a ausência de formulário e como a conversão acontece por link, contrastes e
recursos de acessibilidade, estratégia de fontes/CSS/imagens e SEO, inventário
completo de copy com arquivo e linha, passo a passo do deploy e do DNS, guia de
manutenção de preço/prazo/pacote/telefone, e 10 pendências conhecidas.

---

## 2026-09-06 — Reposicionamento do hero

Duas mudanças ligadas: a promessa central da página deixou de ser prazo e
passou a ser propriedade do código; e o bloco de terminal do hero deu lugar a
um mockup de dispositivos.

### 1. Headline e varredura de consistência

**Por quê:** "Seu site no ar em dias, não em meses." colocava a ForjaDev numa
disputa de velocidade contra Wix, Squarespace e construtores com IA, que
entregam "site em minutos". É o terreno do adversário. O diferencial real é
código próprio, preço fechado, nenhuma mensalidade de plataforma e um humano
responsável pela entrega.

**Novo hero:**

| | Antes | Depois |
|---|---|---|
| Eyebrow | Maringá – PR · Desenvolvimento web | Maringá – PR · Código próprio, sem plataforma |
| H1 | Seu site no ar em *dias*, não em meses. | Site pronto *de verdade*. Sem mensalidade, sem construtor. |
| Sub | Landing page a partir de R$ 890, pronta em 3 dias úteis. Site institucional em 5… | Landing page a partir de R$ 890, pronta em 3 dias úteis. Código seu, hospedagem sua, preço fechado. Você não paga plataforma nenhuma para o site continuar no ar. |

O prazo continua na página — como característica da entrega, não como
promessa central.

**Onde mais o texto foi ajustado:**

- `index.html` — `<title>`, `meta description`, `og:title`, `og:description`,
  `og:image:alt`, `twitter:description`, `twitter:image:alt`
- `index.html` — JSON-LD: `description` do `ProfessionalService` e do `WebSite`
- `index.html` — parágrafo do CTA final e frase do rodapé
- `site.webmanifest` — `description`
- `assets/img/og-image.jpg` — regerado com a headline nova, mesmo layout,
  mesma paleta

**Intocado, de propósito:** os dois CTAs do hero, a faixa "Briefing e layout
aprovados até as 12h entram na fila do mesmo dia útil.", a assinatura "O ferro
quente não espera." (fala de agilidade de atendimento, não de competir em
minutos com construtor), preços, prazos e condições comerciais.

### 2. Mockup de dispositivos no lugar do terminal do hero

**Por quê:** o bloco de terminal exigia que o visitante reconhecesse estética
de linha de comando para entender o que estava vendo. O comprador principal é
leigo em tecnologia. A imagem de um site aberto no navegador e no celular é
reconhecida em meio segundo.

**O que entrou:** janela de navegador com barra de endereço (`seunegocio.com.br`
e cadeado), miniatura de um site genérico dentro dela, celular sobreposto com o
mesmo site em layout de coluna única e selo "No ar".

- Desenhado só em CSS — nenhuma imagem, nenhum request a mais.
- Altura vem de `aspect-ratio`, então não há layout shift (o terminal antigo
  precisava de um `min-height` medido em JS para não deslocar a página).
- A miniatura escala por unidade de container (`cqi`), com fallback em px.
- Montagem animada (barra de carregamento, blocos entrando em sequência,
  celular subindo) roda a cada entrada em tela; a rolagem lenta do celular e o
  pulso do selo ficam pausados fora da viewport e com a aba escondida.
- Sem JavaScript, ou com `prefers-reduced-motion: reduce`, a peça aparece
  pronta e estática.
- Saiu junto o código morto do efeito antigo: `terminal()` em
  `assets/js/animations.js` e o `.caret` em `assets/css/style.css`.

**O terminal continua** onde é reforço técnico: "Como funciona", "Quem faz" e a
página 404.

### Premissas assumidas

1. **A instrução da alteração 2 chegou truncada** ("…a coisa que qualquer
   pessoa reconhece em meio segundo é a imagem de um site"). Foi interpretada
   como: janela de navegador + celular, desenhados em CSS, com animação de
   montagem. Se a intenção era outra (screenshot real de projeto, vídeo,
   carrossel de trabalhos), este commit é o ponto de partida a ajustar.
2. **A URL do mockup é `seunegocio.com.br`, não `forjadev.app.br`.** A peça
   representa o site do cliente, não este site — e reforça "hospedagem sua,
   domínio seu".
3. **O celular é a única peça do sistema com canto arredondado.** É o desenho
   de um objeto real, não um card; o chanfro sistêmico fica na janela do
   navegador, nos cards da miniatura e nos botões.
4. **A barra de endereço usa Archivo, não JetBrains Mono.** O brand guide
   reserva a mono ao bloco de código/terminal, e barra de endereço é interface
   de navegador.
5. **O H1 caiu de 68px para 56px no teto** (`clamp(2.1rem,5.2vw,3.5rem)`). A
   headline nova tem duas frases; no tamanho antigo ocupava cinco linhas.
   56px é o teto que o brand guide dá para título de landing page.
6. **O verde `#4ADE80`** do cadeado e do selo "No ar" é o mesmo já usado no
   terminal (`.ok`): `--fd-sucesso` (#15803D) some sobre Aço.
7. **O `og-image.jpg` foi regerado** com a headline nova, mantendo nome e
   caminho. Facebook, LinkedIn e X guardam cache por URL: para o novo card
   aparecer imediatamente, rode o link no Sharing Debugger / Post Inspector.
8. **O brand guide não foi editado nesta etapa.** A linha "Posicionamento" do
   `FORJADEV-BRAND-GUIDE_1.md` ainda dizia *"Sites e landing pages entregues em
   dias, não em meses"* — exatamente a promessa que esta mudança aposentou no
   site. O guia é a fonte única da verdade da marca e atualizá-lo é decisão do
   dono da marca, não efeito colateral de uma mudança de página.
   **Pendência resolvida em seguida — ver abaixo.**

---

## 2026-09-06 — Brand guide alinhado ao novo posicionamento

Fecha a pendência 8 acima, por decisão do dono da marca. O
`FORJADEV-BRAND-GUIDE_1.md` é gitignored (referência local, não versionada),
então a mudança não aparece no diff deste commit — fica registrada aqui.

**Versão do guia:** 2026.1.1 → **2026.1.2**

| Onde | Antes | Depois |
|---|---|---|
| `Posicionamento` | Sites e landing pages entregues em dias, não em meses. Preço fechado, prazo curto, execução técnica própria. | Sites e landing pages em código próprio. O cliente é dono do que recebe, hospeda onde quiser e não paga mensalidade de plataforma para o site continuar no ar. Preço fechado, execução técnica própria, prazo curto. |
| Tom de voz | — | Bullet novo: **"Prazo é característica, não promessa central"**, com o motivo (construtor com IA entrega "site em minutos"; disputa de velocidade é terreno perdido) |
| Exemplos `Faça` | Abriam com *"Seu site no ar em 3 dias."* | Abrem com *"Código seu. Hospedagem sua. Sem mensalidade."*; o prazo continua na lista, em terceiro |
| Exemplos `Não faça` | — | `+ "Seu site no ar em tempo recorde."` |
| Prompt base de imagem | *"…a Brazilian web development studio that ships websites in days."* | *"…that hand-codes websites the client owns outright — no page builder, no platform subscription."* |
| Prompt base — `Mood` | `fast, capable, hands-on…` | `solid, capable, hands-on…` |
| Contexto de negócio | Produtos: sites institucionais (entrega rápida, custo baixo)… | Produtos: … sempre em código próprio entregue ao cliente, custo baixo, sem mensalidade de plataforma |

**Por que os seis pontos derivados foram junto:** o prompt base de geração de
imagem e o bloco de tom de voz são o que uma IA lê para produzir peça nova.
Corrigir só a linha `Posicionamento` e deixar o prompt dizendo *ships websites
in days* reintroduziria a promessa aposentada em todo material gerado a partir
do guia.

**Intocado, de propósito:**

- *"O ferro quente não espera."* — assinatura, fala de agilidade de
  atendimento, não de competir em minutos com construtor.
- **Comprador principal / secundário** — a descrição diz que eles compram por
  "preço, prazo e confiança". É pesquisa sobre o comprador, não promessa da
  marca; o prazo continua sendo um critério real de compra.
- **Bullet "Concreto — número, prazo e preço aparecem cedo"** — é regra de
  redação (seja específico), não de posicionamento.
- Ícone `relogio-forja` com uso "prazo", garantia de 15 dias, e todo o sistema
  visual, tipográfico e de cor.
