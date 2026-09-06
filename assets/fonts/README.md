# Fontes auto-hospedadas

Arquivos `.woff2` (subset `latin` e `latin-ext`) das quatro famílias do brand
guide da ForjaDev, servidos do próprio domínio em vez do Google Fonts.

| Família | Pesos | Uso |
|---|---|---|
| Archivo | 400, 700 | texto corrido, H3, botão |
| Archivo Black | 400 | display, H1, H2, preço |
| Barlow Condensed | 600 | rótulo técnico, caixa alta |
| JetBrains Mono | 400, 500 | bloco de código e terminal |

**Por que local e não Google Fonts:** o ida-e-volta até `fonts.googleapis.com`
e `fonts.gstatic.com` custava cerca de 1s na primeira pintura em 4G simulado, e
a troca tardia da fonte reflowava o H1 (86px → 130px), gerando CLS de 0,23.
Local, com `preload` das duas faces que definem o layout acima da dobra, o
problema desaparece — e o site deixa de depender de um terceiro, o que é
exatamente o que a marca vende.

Pesos não usados no site (ex.: Archivo 500) foram removidos para não ocupar
espaço à toa.

**Licença:** SIL Open Font License 1.1 — texto completo em `OFL.txt`.
As quatro famílias são OFL e podem ser redistribuídas junto com o site.
Archivo e Archivo Black © The Archivo Project Authors · Barlow Condensed ©
The Barlow Project Authors · JetBrains Mono © The JetBrains Mono Project Authors.
