# Khrono — site institucional

Versão oficial do site. **9 páginas por idioma** (PT na raiz, EN em `en/`), home com 7 blocos de canto a canto, um plano só.
Marca: Khrono (`_marca/` na pasta pai tem o logo em todas as variações).

## Páginas

| PT | EN | O que tem |
|---|---|---|
| `index.html` | `en/index.html` | hero com mosaico de 5 peças (3 fotos + 2 cartões animados), segmentos, faixa dos essenciais com ícones que se desenham, "veja o sistema" (abas painel / página do cliente com telas reais), depoimentos, fatos + plano único, CTA |
| `precos.html` | `en/pricing.html` | plano único, simulação por tamanho de equipe, 4 perguntas, CTA |
| `segmento-barbearias.html` · `segmento-saloes.html` · `segmento-clinicas.html` | `en/segment-*.html` | 3 dores, como funciona (mockup celular), recursos em chips, plano, CTA |
| `criar-conta.html` | `en/sign-up.html` | formulário de conta (demo, valida e confirma) — gancho do back-end |
| `entrar.html` | `en/sign-in.html` | login (demo) — gancho do back-end |
| `termos.html` · `privacidade.html` | `en/terms.html` · `en/privacy.html` | legal |

Menu: Início · Segmentos ▾ (3) · Preço · [idioma] [tema] · Entrar · **Começar grátis**.
Rodapé de três linhas. Sem blog, sobre, recursos, status, atualizações, LGPD separada, esmalterias e redes.

## Gerar

```
python build.py
```

Troque `MARCA` e `DOMINIO` no topo do `build.py`. Textos das páginas em `src/pages/<idioma>/`,
segmentos em `SEGMENTOS` dentro do `build.py`, strings do menu/rodapé em `LANGS`.

## O que é premissa (ajustar com o back-end)

- **Preço**: **Básico R$ 59,90** (1 empresa) e **Pro R$ 79,90** (até 3 empresas; + financeiro e pagamentos, equipe e permissões, fidelidade) por mês; anual = 10 mensalidades (R$ 599 / R$ 799). 7 dias grátis sem cartão, sem fidelidade. Sem cobrança por profissional.
  Está em `index`, `precos`, template de segmento e `SEG_STR` — um `grep 89` acha tudo.
- **Criar conta** → `POST /auth/signup`. **Entrar** → painel do parceiro.

## Assets

`src/assets/css/` — `site.css`, `polish.css`, `product.css` (iguais ao base-site) + `lean.css` (mosaico do hero, cards de segmento, plano único, FAQ, rodapé curto).
`src/assets/img/` — fotos de segmento e do hero (geradas), `app-inicio.jpg` / `app-agendar.jpg` (capturas reais da área do cliente — recapturar quando ela mudar), `brand/` com logo e ícones, favicon.

## Larguras

Conteúdo em 1440px (`.wrap`); grades visuais, header, rodapé e CTA em 1760px (`.wrap.wide`). Mobile-first, testado de 320 a 430px.

## Pendências antes de publicar

- Depoimentos da home são placeholders — trocar por relatos reais.
- Lembretes e confirmações são por e-mail (sem WhatsApp). Suporte descrito como "por e-mail" — confirmar canal.
- Formulários de conta/login são simulados até o back-end.
