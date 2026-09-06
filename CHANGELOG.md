# Mudanças

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
