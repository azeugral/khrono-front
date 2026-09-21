# Contrato front ↔ back-end — área do cliente

O front é estático e igual para todos os negócios. Tudo que muda de um negócio para outro
entra por **um único objeto**: `window.BUSINESS` (`assets/business.js`). O back-end da Khrono pode
servir esse objeto de dois jeitos — o front não muda em nenhum dos dois:

1. **Injetar no HTML** (recomendado): trocar o `<script src="assets/business.js">` por
   `<script>window.BUSINESS = {...json...}</script>` na hora de servir `/b/<slug>/…`.
2. **Endpoint JSON**: `GET /api/b/<slug>` e o front faz `fetch` antes de renderizar.

## 1. Formato de `BUSINESS`

```js
{
  slug: "estudio",              // usado nas chaves de armazenamento local
  nome: "Estúdio",
  marca: "L",                       // 1–2 letras, usado quando logo = null
  logo: null | "https://…/logo.png",// quadrada, mín. 256px
  capa: "https://…/capa.jpg",       // 16:9, mín. 1400px de largura
  tagline: "…",                     // 1 linha
  sobre: "…",                       // aceita <b>
  endereco: "…",
  whatsapp: "5511988887777",        // só dígitos, com DDI
  instagram: "studioluma",          // sem @
  comodidades: ["…"], pagamentos: ["…"],

  horarios: [ {abre:null,fecha:null}, {abre:"09:00",fecha:"19:00"}, … ], // 7 itens, índice 0 = domingo; abre:null = fechado
  antecedenciaMin: 60,              // minutos mínimos entre agora e o horário
  janelaDias: 60,                   // até quantos dias à frente pode marcar
  sinal: 0.2,                       // fração do total cobrada como sinal (0 = não cobra)
  sinalRegra: "",                   // texto livre do proprietário: forma de pagamento, reembolso, prazo. O front só exibe; a regra é do negócio

  categorias: ["Facial", …],
  servicos: [ {id:"f1", cat:"Facial", nome:"…", sub:"…", preco:180, dur:70} ],   // preco em reais, dur em minutos
  profissionais: [ {id:"p1", nome:"…", cargo:"…", esp:"…", nota:5.0, n:214, atende:["f1","f2"]} ], // atende = ids de serviço
  planos: [ {id:"pl1", nome:"…", preco:299, desc:"…", hi:false, itens:["…"]} ],  // hi = destaque
  avaliacoes: { nota:4.9, total:287, dist:[252,26,6,2,1],                       // dist = 5★ … 1★
                itens:[ {n:"Nome", nota:5, d:2, sid:"f1", t:"texto", r:"resposta opcional"} ] }, // d = dias atrás
  fidelidade: { pontosPorReal:1, niveis:[ {pontos:500, nome:"…"} ] },

  estado: "ativo" | "expirado"      // opcional; "expirado" bloqueia agendamento em todas as páginas
}
```

Listas vazias (`planos: []`, `avaliacoes.itens: []`) fazem a seção sumir; não precisa tratar.
Hoje o estado expirado também pode ser forçado por URL (`?estado=expirado`) para demonstração.

## 2. Pontos de integração em `assets/app.js`

Tudo que é simulado no navegador está concentrado nestes trechos:

| Linha (aprox.) | Função / trecho | Hoje | Vira |
|---|---|---|---|
| 34 | `store` | `localStorage` com prefixo `b:<slug>:` | some (dados vêm da API) |
| 132 | `demoCode()` | código de 4 dígitos derivado de slug+telefone, exibido na tela | `POST /api/b/<slug>/otp {tel}` envia por WhatsApp; `POST …/otp/verificar {tel, codigo}` devolve token curto |
| 133 | `livres(data, proId, precisa)` | disponibilidade determinística por hash | `GET /api/b/<slug>/disponibilidade?data=AAAA-MM-DD&pro=p1&dur=70` → `[{hora:"09:00", ok:true}, …]` (slots de 30 min; `pro` vazio = qualquer) |
| 180 | `confirmar()` | grava em `localStorage` e gera `AG-nnnn` | `POST /api/b/<slug>/agendamentos {svc[], pro, data, hora, nome, tel, obs, token}` → `{codigo, data, hora, dur, total, sinal?}` |
| 196 | `[data-cancel]` | remove do `localStorage` | `DELETE /api/b/<slug>/agendamentos/<codigo>` |
| 193 | `#login` | cria usuário fixo | OAuth Google do back-end → `GET /api/me` → `{nome, email, tel, desde, pontos, hist:[{data, sid, pro, total}], resg:[pontos]}` |
| 195 | `[data-resg]` | marca resgate local | `POST /api/me/resgates {pontos}` |
| 192 | `[data-plano]` | só um toast | `POST /api/b/<slug>/assinaturas {planoId}` → URL de checkout |

Regras que o front já aplica e o back-end deve **repetir** (o front não é fonte de verdade):
horário fechado, antecedência mínima, janela de dias, conflito com agendamento existente,
profissional que não atende o serviço, sinal calculado como `round(total × sinal)`.

## 3. Rotas

| Rota | Arquivo |
|---|---|
| `/b/<slug>/` | `index.html` |
| `/b/<slug>/servicos` | `servicos.html` |
| `/b/<slug>/agendar` (aceita `?s=<svcId>` ou `?p=<proId>`) | `agendar.html` |
| `/b/<slug>/profissionais`, `/assinaturas`, `/avaliacoes`, `/perfil` | idem |

Links internos são relativos (`agendar.html`), então funciona em subpasta ou subdomínio.
Se as rotas forem servidas sem `.html`, basta um rewrite; o front não precisa mudar.

## 4. Site institucional (`base-site`)

Só uma integração: o formulário **Criar conta** → `POST /auth/signup` e redirecionar para o painel.
O botão "Abrir página de exemplo" pode apontar para um `/b/<slug-demo>/` real.


## Aceite dos Termos de agendamento (cliente final)
- Página `termos.html` (view `termos` em `app.js`) monta o documento a partir de `BUSINESS`: `nome`, `endereco`, `whatsapp`, `sinal`/`sinalRegra`, `politica.{cancelamento,atraso,falta}`, `juridico.{razao,cnpj,responsavel,emailPrivacidade}`, `termosVersao`, `termosData`.
- No passo 5 do agendamento há a caixa obrigatória `#fAceite`; sem ela o botão de confirmar fica desabilitado (`can()`).
- Cada agendamento salvo leva `aceite:{versao, em}` (ISO 8601). O back-end deve gravar também o IP e o user-agent e guardar o registro pelo prazo prescricional.
- Se `termosVersao` mudar, o front pede novo aceite automaticamente (o checkbox nasce desmarcado a cada agendamento).
