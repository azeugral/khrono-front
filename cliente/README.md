# Área do cliente — Estúdio (demo)

Página pública que cada negócio recebe na Khrono (ex.: `/b/estudio`).
Projeto estático: HTML + CSS + JS, sem build, sem dependências. Abra `index.html`
em qualquer servidor estático (ou `python -m http.server`).

## Páginas

| Arquivo | O que faz |
|---|---|
| `index.html` | Capa, status aberto/fechado em tempo real, atalhos para as outras seções, horários (dia atual em destaque), endereço, contato |
| `servicos.html` | Serviços por categoria com preço e duração; toque leva a `agendar.html?s=<id>` |
| `agendar.html` | Agendamento em 6 passos: serviço(s) → profissional → data → horário → dados → código de 4 dígitos → comprovante |
| `profissionais.html` | Equipe; toque leva a `agendar.html?p=<id>` |
| `assinaturas.html` | Planos mensais |
| `avaliacoes.html` | Nota, distribuição por estrelas e comentários com resposta do negócio |
| `perfil.html` | Login opcional (Google, simulado), pontos, recompensas, próximos horários, histórico |

Estados via query string: `?estado=expirado` (teste do proprietário vencido — bloqueia agendamento em todas as páginas).
Pré-seleção: `agendar.html?s=f1` (serviço) ou `agendar.html?p=p2` (profissional).

## Estrutura

```
index.html · servicos.html · agendar.html · profissionais.html · assinaturas.html · avaliacoes.html · perfil.html
assets/
  business.js   ← única fonte de dados do negócio (é o que o back-end vai servir)
  app.js        ← casca compartilhada (header, navegação, tema) + render de cada página por data-page
  app.css       ← mobile-first; barra inferior no celular, abas no topo a partir de 720px
  img/          ← capa.jpg, favicon.svg
```

## Contrato com o back-end

Detalhado em [CONTRATO.md](CONTRATO.md) — formato do JSON, endpoints e linhas do `app.js` a trocar.

Tudo que muda de negócio para negócio está em `window.BUSINESS` (`assets/business.js`):
identidade (`nome`, `marca`, `logo`, `capa`), contato, horários por dia da semana,
regras (`antecedenciaMin`, `janelaDias`, `sinal`), serviços, profissionais (com `atende[]`),
planos, avaliações e fidelidade. O front não conhece nada além disso.

O que hoje é simulado no navegador e vira chamada de API:
- disponibilidade de horários (`livres()` em `app.js` — hoje determinística por hash);
- envio/validação do código de 4 dígitos (o código demo aparece na tela);
- criação/cancelamento de agendamento (hoje `localStorage`);
- login com Google e saldo de pontos.

## Tema

Claro/escuro seguem o sistema; o botão no header força e grava em `localStorage.theme`.
Transições entre páginas usam View Transitions (com fallback silencioso).
