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
| `assets/js/site.js` | Tema, menu, animações de rolagem, formulário |
| `assets/js/rede.js` | Rede de neurônios interativa (canvas) |
| `assets/marca/` | Logos, favicons e imagem de compartilhamento |
| `assets/img/socios/` | Fotos dos sócios fundadores |
| `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml` | Configuração do domínio e do Pages |

## Rodar localmente

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File serve.ps1
```

Depois abra http://localhost:5173.

## Pendências

- O formulário de diagnóstico ainda não envia os dados. O ponto de ligação está marcado em `assets/js/site.js`.
