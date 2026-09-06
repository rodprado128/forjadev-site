# ForjaDev — site institucional

Site institucional e landing page de conversão da **ForjaDev** — estúdio de
desenvolvimento web em Maringá – PR.

Página única com âncoras, **100% estática**: HTML, CSS e JavaScript próprios.
Sem framework, sem construtor e sem dependência de plataforma — o mesmo
compromisso que a marca vende ao cliente.

**Produção:** <https://forjadev.app.br>

---

## Rodar local

Não há build. Qualquer servidor estático resolve — só não abra por `file://`,
porque os caminhos absolutos (`/assets/...`) e o `fetch` de fontes quebram.

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Depois abra <http://localhost:8080>.

---

## Publicar

O deploy é o próprio `git push`: GitHub Pages serve a branch `main` a partir da
raiz do repositório.

```bash
git add .
git commit -m "descrição da mudança"
git push
```

O arquivo `CNAME` fixa o domínio `forjadev.app.br` e o `.nojekyll` impede que o
GitHub processe o conteúdo com Jekyll.

### DNS (Registro.br)

Para o apex `forjadev.app.br`, quatro registros `A`:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

E um `CNAME` para `www` apontando para `rodprado128.github.io`.

---

## Estrutura

```
index.html            página única com todas as âncoras
404.html              erro 404 com a mesma identidade
site.webmanifest      ícones e cores do app
robots.txt            libera tudo e aponta o sitemap
sitemap.xml           uma URL
CNAME                 domínio customizado
assets/
  css/tokens.css      design tokens da marca (fonte da verdade)
  css/style.css       estilos do site
  js/main.js          menu, FAQ, navegação ativa, brilho dos botões
  js/animations.js    malha de faíscas, terminal, reveal, contadores, parallax
  img/                foto, og-image, favicons e logos SVG
  icons/              os 6 ícones do sistema da marca
```

---

## Regras de marca que o código respeita

Estas não são preferências de estilo — vêm do brand guide e do teste de
contraste WCAG. Ao editar, mantenha:

- **Chanfro sistêmico** (`clip-path`) no lugar de `border-radius` em card, bloco
  de preço, bloco de destaque e terminal. Badge e pill mantêm `border-radius:999px`.
- **Laranja `#FF6A00` nunca é texto sobre fundo claro** (2.87:1, reprovado). É cor
  de superfície. Sobre fundo escuro pode ser texto (6.10:1).
- **Botão com texto branco usa Brasa `#C94300`** (4.90:1). Nunca `#FF6A00`.
- **Preço em Aço `#141A20` dentro de bloco Laranja** — nunca laranja sobre branco.
- **Em seção escura, o texto secundário é `--fd-cinza-claro` (`#C6CBD1`)**.
  Cinza Lima `#5F6A76` reprova sobre Aço e só vale sobre superfície clara.
- **JetBrains Mono é exclusiva de bloco de código e terminal** — nunca em título,
  corpo, preço ou rótulo.
- **Barlow Condensed SemiBold sempre em caixa alta**, tracking +2%.
- **Um único elemento com elevação `--fd-elev-destaque` por seção.**
- Divisor tracejado laranja 6/6px no lugar de linha simples.
- O símbolo nunca é rotacionado, distorcido, sombreado ou gradiente. A faísca é
  sempre laranja.

## Acessibilidade e movimento

`prefers-reduced-motion: reduce` desliga a malha de faíscas, o efeito de
digitação, o scroll reveal, o parallax, o cursor spark e o pulso do botão de
WhatsApp. Todo conteúdo continua legível e o site permanece navegável por
teclado.

O conteúdo comercial (pacotes, prazos, preços e condições) vem da tabela de
preços pública, edição 2026.1.
