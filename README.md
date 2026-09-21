# Khrono — front-end

Código do front-end do Khrono, pronto para o back-end ligar por cima. Tudo é HTML, CSS e JS estático — sem framework, sem build obrigatório, sem dependências.

**No ar (GitHub Pages):** https://azeugral.github.io/khrono-front/ · área do cliente: https://azeugral.github.io/khrono-front/cliente/

## O que tem aqui

| Pasta | O que é | Como integrar |
|---|---|---|
| `/` (raiz) | **Site institucional** — PT na raiz, EN em `en/`: home, segmentos, preço, criar conta, entrar, termos, privacidade | Páginas geradas por `build.py` a partir de `src/`. Os formulários só validam no navegador (`data-demo`) — trocar pela chamada real. Detalhes em [SITE.md](SITE.md). |
| `cliente/` | **Área do cliente** — a página que o dono divulga: agendar, serviços, equipe, planos, avaliações, perfil, sobre | Configuração do negócio em `cliente/assets/business.js`; estado em `localStorage`. Contrato de dados e cada ponto de integração (com linha do arquivo) em [`cliente/CONTRATO.md`](cliente/CONTRATO.md). |

## Site institucional (raiz)

- `src/pages/pt/*.html` e `src/pages/en/*.html` — conteúdo de cada página (cabeçalho `title:` / `desc:` / `alt:` + HTML).
- `src/partials/` — `header.html`, `footer.html`, `dash.html` (mockup do painel) e `plans.html` (bloco de planos usado na home, no preço e nos segmentos).
- `src/templates/segmento.html` + dicionário `SEGMENTOS` em `build.py` — páginas de segmento.
- `src/assets/` — CSS (`site.css`, `polish.css`, `product.css`, `lean.css`), JS (`site.js`, `polish.js`), imagens e marca (`img/brand/`).
- Textos comuns (nav, rodapé, planos) ficam no dicionário `LANGS` em `build.py` (`[[chave]]`); marca e domínio em `MARCA` / `DOMINIO`.

Depois de editar qualquer coisa em `src/`, gerar as páginas:

```bash
python build.py
```

Os arquivos gerados (raiz e `en/`) ficam versionados para o GitHub Pages servir direto.

### Pontos de integração do site

| Onde | Arquivo | O que fazer |
|---|---|---|
| Criar conta | `criar-conta.html` / `en/sign-up.html` — `<form data-demo="conta">` com `nome`, `tel`, `email`, `negocio`, `seg` | O bloco "formulários" em `src/assets/js/site.js` (≈ linha 138) intercepta o `submit`, valida e mostra a confirmação. Substituir pelo POST real (ou apontar o `action`). |
| Entrar | `entrar.html` / `en/sign-in.html` — `<form data-demo="login">` com `email`, `senha` | Mesmo bloco. Se o login for externo (OAuth), basta trocar o `href` de "Entrar" no header (`src/partials/header.html`) e nos CTAs. |
| Botões "Começar grátis" | header, hero, planos, CTAs | Apontam para `criar-conta.html`; trocar o destino se o onboarding for pelo sistema. |
| Planos e preços | `src/partials/plans.html` + chaves `plan.*` em `build.py`; `src/pages/*/precos.html` | Valores hoje: Básico R$ 59,90 (1 empresa) · Pro R$ 79,90 (até 3); anual R$ 599 / R$ 799. |

## Área do cliente (`cliente/`)

Multi-página, mobile-first, funciona abrindo o `index.html` direto. Leia [`cliente/CONTRATO.md`](cliente/CONTRATO.md): formato do objeto `BUSINESS` (serviços, profissionais, horários, planos, avaliações, fidelidade, regra de sinal), deep links (`?s=`, `?p=`, `?por=pro`, `?ir=N`), chaves de `localStorage` e onde cada chamada de API entra.

## Marca

`src/assets/img/brand/` — assinatura horizontal e símbolo em SVG (versões para tema claro e escuro), favicons, ícones 192/512, apple-touch-icon e og-image. Kit completo no repositório `khrono-marca`.

## Domínio

`khrono.tech`. Todos os links são relativos, então o site funciona na raiz do domínio ou em subpasta (como aqui no GitHub Pages).
