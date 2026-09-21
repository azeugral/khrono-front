# -*- coding: utf-8 -*-
"""
Gera o site estático (versão enxuta) a partir de src/.

    python build.py

Português sai na raiz; inglês em en/. Troque a marca em um lugar só (MARCA e DOMINIO)
e rode de novo. 9 páginas por idioma: início, preço, 3 segmentos, criar conta, entrar, termos, privacidade.
"""
import io, os, re, shutil

MARCA   = "Khrono"
DOMINIO = "khrono.tech"

HERE = os.path.dirname(os.path.abspath(__file__))
SRC  = os.path.join(HERE, "src")

OK = '<svg viewBox="0 0 24 24"><path d="M20 6.5L9.4 17.1 4 11.7"/></svg>'

def read(p):  return io.open(p, encoding="utf-8").read()
def write(p, s):
    os.makedirs(os.path.dirname(p), exist_ok=True)
    io.open(p, "w", encoding="utf-8").write(s)

# ============================================================
# Idiomas: caminhos das páginas e strings dos blocos comuns
# ============================================================
LANGS = {
  "pt": dict(
    dir="", base="", other="en",
    pages={"index":"index.html", "pricing":"precos.html", "signup":"criar-conta.html", "signin":"entrar.html",
           "terms":"termos.html", "privacy":"privacidade.html",
           "seg-barbers":"segmento-barbearias.html", "seg-salons":"segmento-saloes.html", "seg-clinics":"segmento-clinicas.html"},
    s={
      "nav.home":"Início", "nav.segments":"Segmentos", "nav.pricing":"Preço", "nav.signin":"Entrar", "nav.start":"Começar grátis", "nav.menu":"Menu",
      "seg.barbers":"Barbearias", "seg.barbers.sub":"Fila, assinatura e cadeira fixa",
      "seg.salons":"Salões", "seg.salons.sub":"Agenda por profissional e comissão",
      "seg.clinics":"Clínicas de estética", "seg.clinics.sub":"Ficha da paciente, retorno e sinal",
      "lang.label":"EN", "lang.title":"Read in English", "theme.label":"Alternar tema claro e escuro",
      "foot.tagline":"Agenda online, lembrete por e-mail e caixa fechado para barbearias, salões e clínicas.",
      "plan.cmp.h":"O que vem em cada plano", "plan.cmp.p":"O Básico organiza a agenda de um negócio. O Pro soma financeiro, permissões por pessoa, fidelidade e até três empresas na mesma conta.",
      "plan.ess.name":"Básico", "plan.cycle":"Ciclo de cobrança",
      "plan.monthly":"Mensal",
      "plan.yearly":"Anual",
      "plan.yearly.badge":"2 meses grátis",
      "plan.per":"/mês",
      "plan.cta":"Começar grátis",
      "plan.pop":"Mais completo",
      "plan.ess.for":"O essencial para organizar a agenda do seu negócio.",
      "plan.ess.m":"Cobrado por mês, cancele quando quiser",
      "plan.ess.a":"<b>R$ 599</b> por ano, economia de <b>R$ 119,80</b>",
      "plan.pro.for":"Plano completo para equipes e operações em crescimento.",
      "plan.pro.m":"Cobrado por mês, cancele quando quiser",
      "plan.pro.a":"<b>R$ 799</b> por ano, economia de <b>R$ 159,80</b>",
      "plan.ess.h":"Incluso",
      "plan.pro.h":"Tudo do Básico, mais",
      "plan.emp.pro":"Até 3",
      "plan.emp.ess":"1",
      "plan.emp":"Empresas na conta",
      "plan.i1":"<b>Agendamento público</b> — link com a sua marca, na bio ou no QR code, sem cadastro para o cliente",
      "plan.i2":"Agenda e agendamentos, por profissional",
      "plan.i3":"Catálogo de serviços",
      "plan.i4":"Gestão de clientes, com histórico",
      "plan.i5":"Gestão da equipe e horários de atendimento",
      "plan.p1":"<b>Financeiro e pagamentos</b> — caixa, comissões e resultados",
      "plan.p2":"Equipe e permissões por pessoa",
      "plan.p3":"Programa de fidelidade na área do cliente",
      "plan.note":"Os dois planos: 7 dias grátis sem cartão, sem fidelidade, cancelamento pelo painel. Anual = 10 mensalidades, 12 meses de acesso. Preços em reais, com impostos.",
      "foot.terms":"Termos", "foot.privacy":"Privacidade", "foot.made":"Feito em São Paulo",
      "cur":"R$",
      "d.panel":"Painel", "d.role":"Profissional", "d.new":"Novo", "d.m1":"Principal", "d.m2":"Agenda", "d.m3":"Financeiro",
      "d.m4":"Assinaturas", "d.m5":"Clientes", "d.m6":"Relatórios", "d.m7":"Configurações", "d.title":"Todas as unidades",
      "d.filter":"Filtrar", "d.refresh":"Atualizar", "d.range":"20 abr, 2026 → 04 mai, 2026", "d.sales":"Vendas totais",
      "d.sales.v":"R$ 74.861,62", "d.today":"Vendas do dia", "d.today.v":"R$ 2.220,00", "d.vs":"versus período anterior",
      "d.bookings":"Agendamentos", "d.growth":"de crescimento", "d.tickets":"Comandas", "d.conv":"de conversão",
      "d.trend":"Tendência de visitas", "d.rank":"Ranking de agendamentos",
      "p.range":"03 mai, 2026 → 09 mai, 2026", "p.sales.v":"R$ 26.071,83", "p.today.v":"R$ 350,00",
      "p.t1":"Menu", "p.t2":"Agenda", "p.t3":"Atualizar", "p.t4":"Filtros",
    }),
  "en": dict(
    dir="en/", base="../", other="pt",
    pages={"index":"index.html", "pricing":"pricing.html", "signup":"sign-up.html", "signin":"sign-in.html",
           "terms":"terms.html", "privacy":"privacy.html",
           "seg-barbers":"segment-barbershops.html", "seg-salons":"segment-salons.html", "seg-clinics":"segment-clinics.html"},
    s={
      "nav.home":"Home", "nav.segments":"Segments", "nav.pricing":"Pricing", "nav.signin":"Sign in", "nav.start":"Start free", "nav.menu":"Menu",
      "seg.barbers":"Barbershops", "seg.barbers.sub":"Walk-ins, memberships and a fixed chair",
      "seg.salons":"Salons", "seg.salons.sub":"Calendar per professional and commissions",
      "seg.clinics":"Aesthetic clinics", "seg.clinics.sub":"Client record, follow-ups and deposits",
      "lang.label":"PT", "lang.title":"Ler em português", "theme.label":"Toggle light and dark theme",
      "foot.tagline":"Online booking, e-mail reminders and a closed till for barbershops, salons and clinics.",
      "plan.cmp.h":"What comes with each plan", "plan.cmp.p":"Basic organizes one business's calendar. Pro adds finances, per-person permissions, loyalty and up to three businesses in one account.",
      "plan.ess.name":"Basic", "plan.cycle":"Billing cycle",
      "plan.monthly":"Monthly",
      "plan.yearly":"Yearly",
      "plan.yearly.badge":"2 months free",
      "plan.per":"/month",
      "plan.cta":"Start free",
      "plan.pop":"Most complete",
      "plan.ess.for":"The essentials to organize your business's calendar.",
      "plan.ess.m":"Billed monthly, cancel any time",
      "plan.ess.a":"<b>R$ 599</b> a year, you save <b>R$ 119.80</b>",
      "plan.pro.for":"The complete plan for teams and growing operations.",
      "plan.pro.m":"Billed monthly, cancel any time",
      "plan.pro.a":"<b>R$ 799</b> a year, you save <b>R$ 159.80</b>",
      "plan.ess.h":"Included",
      "plan.pro.h":"Everything in Basic, plus",
      "plan.emp.pro":"Up to 3",
      "plan.emp.ess":"1",
      "plan.emp":"Businesses per account",
      "plan.i1":"<b>Public booking</b> — a link with your brand, in the bio or on a QR code, no sign-up for the client",
      "plan.i2":"Calendar and bookings, per professional",
      "plan.i3":"Service catalogue",
      "plan.i4":"Client management, with history",
      "plan.i5":"Team management and working hours",
      "plan.p1":"<b>Finances and payments</b> — till, commissions and results",
      "plan.p2":"Team and per-person permissions",
      "plan.p3":"Loyalty programme in the client area",
      "plan.note":"Both plans: 7 days free with no card, no lock-in, cancel from the dashboard. Yearly = 10 monthly payments, 12 months of access. Prices in BRL, taxes included.",
      "foot.terms":"Terms", "foot.privacy":"Privacy", "foot.made":"Made in São Paulo",
      "cur":"$",
      "d.panel":"Dashboard", "d.role":"Professional", "d.new":"New", "d.m1":"Home", "d.m2":"Calendar", "d.m3":"Finance",
      "d.m4":"Memberships", "d.m5":"Clients", "d.m6":"Reports", "d.m7":"Settings", "d.title":"All locations",
      "d.filter":"Filter", "d.refresh":"Refresh", "d.range":"Apr 20, 2026 → May 4, 2026", "d.sales":"Total sales",
      "d.sales.v":"$ 74,861.62", "d.today":"Sales today", "d.today.v":"$ 2,220.00", "d.vs":"vs. previous period",
      "d.bookings":"Bookings", "d.growth":"growth", "d.tickets":"Tickets", "d.conv":"conversion",
      "d.trend":"Visit trend", "d.rank":"Booking ranking",
      "p.range":"May 3, 2026 → May 9, 2026", "p.sales.v":"$ 26,071.83", "p.today.v":"$ 350.00",
      "p.t1":"Menu", "p.t2":"Calendar", "p.t3":"Refresh", "p.t4":"Filters",
    }),
}

layout = read(os.path.join(SRC, "layout.html"))
header = read(os.path.join(SRC, "partials", "header.html"))
footer = read(os.path.join(SRC, "partials", "footer.html"))
PRODUTO = { k: read(os.path.join(SRC, "partials", k + ".html")) for k in ("dash", "plans") }

def fill(s, L):
    """[[p:chave]] -> caminho da página; [[chave]] -> string do idioma; tokens gerais."""
    for k, v in PRODUTO.items(): s = s.replace("{{" + k + "}}", v)
    s = re.sub(r"\[\[p:([\w-]+)\]\]", lambda m: L["pages"][m.group(1)], s)
    s = re.sub(r"\[\[([\w.]+)\]\]", lambda m: L["s"][m.group(1)], s)
    s = s.replace("{{base}}", L["base"])  # partials de produto também usam {{base}}
    return s.replace("{{marca}}", MARCA).replace("{{dominio}}", DOMINIO).replace("{{ok}}", OK)

count = 0
def page(lang, name, title, desc, alt, main):
    global count
    L = LANGS[lang]
    html = (layout.replace("{{title}}", title).replace("{{desc}}", desc)
                  .replace("{{header}}", header).replace("{{footer}}", footer).replace("{{main}}", main)
                  .replace("{{lang}}", "pt-BR" if lang == "pt" else "en")
                  .replace("{{alt_lang}}", "en" if lang == "pt" else "pt-BR")
                  .replace("{{alt}}", alt).replace("{{base}}", L["base"]))
    write(os.path.join(HERE, L["dir"], name), fill(html, L))
    count += 1

# ---------- páginas escritas à mão ----------
for lang in LANGS:
    folder = os.path.join(SRC, "pages", lang)
    for fn in sorted(os.listdir(folder)):
        if not fn.endswith(".html"): continue
        raw = read(os.path.join(folder, fn))
        m = re.match(r"title:[ \t]*([^\n]*)\ndesc:[ \t]*([^\n]*)\nalt:[ \t]*([^\n]*)\n\n(.*)", raw, re.S)
        if not m: raise SystemExit("cabeçalho inválido em %s/%s" % (lang, fn))
        page(lang, fn, m.group(1).strip(), m.group(2).strip(), m.group(3).strip(), m.group(4))

# ---------- segmentos ----------
SEGMENTOS = {
 "seg-barbers": dict(img="seg-barbearias.jpg",
   pt=dict(nome="Barbearias", h1="A barbearia que não trava com a casa cheia",
     lead="Agenda rápida no balcão, assinatura com cadeira fixa, fila de encaixe e comissão do barbeiro sempre certa.",
     dores=[("Fila na calçada", "Agendamento pelo link com horário real. Quem chega sem marcar entra na fila e recebe aviso."),
            ("Cliente irregular", "Assinatura com cadeira fixa. Receita recorrente antes de abrir a porta."),
            ("Barbeiro sem saber quanto recebe", "Comissão por corte, visível no celular do próprio profissional.")],
     chips=["Agenda online 24h", "Fila de encaixe", "Assinatura com cadeira fixa", "Comissão por corte", "Lembrete por e-mail", "Sinal no agendamento", "Combo corte + barba", "Caixa do dia", "Ficha do cliente", "Avaliações", "Relatório de ocupação", "Página com a sua marca"]),
   en=dict(nome="Barbershops", h1="A barbershop that doesn't seize up when it's packed",
     lead="Fast booking at the counter, memberships with a fixed chair, a walk-in queue and the barber's commission always right.",
     dores=[("Queue on the pavement", "Booking through the link with real openings. Walk-ins join the queue and get a message."),
            ("Irregular clients", "A membership with a fixed chair. Recurring revenue before you open the door."),
            ("Barbers unsure of their pay", "Commission per cut, visible on each professional's own phone.")],
     chips=["24/7 online booking", "Walk-in queue", "Membership with a fixed chair", "Commission per cut", "E-mail reminders", "Deposit at booking", "Cut + beard combo", "Daily till", "Client record", "Reviews", "Occupancy report", "Page with your brand"])),
 "seg-salons": dict(img="seg-saloes.jpg",
   pt=dict(nome="Salões de beleza", h1="A agenda do salão cheia, e a comissão certa no fim do mês",
     lead="Agenda por profissional, comissão calculada sozinha, pacotes e fidelidade. O salão funciona mesmo quando a dona não está no balcão.",
     dores=[("Agenda de papel e mensagem", "Cliente marca pelo link, 24h. Cai na agenda do profissional certo, com o tempo certo."),
            ("Comissão na calculadora", "Percentual por serviço ou por profissional. Fecha o mês em um clique."),
            ("Cliente que some", "Lembrete de retorno no ciclo de cada serviço, enviado sozinho.")],
     chips=["Agenda por profissional", "Comissão por regra", "Pacotes de sessões", "Cartão fidelidade", "Lembrete por e-mail", "Retorno no ciclo do serviço", "Sinal no agendamento", "Caixa do dia", "Ficha da cliente", "Avaliações", "Relatório por profissional", "Página com a sua marca"]),
   en=dict(nome="Salons", h1="A full salon calendar, and the right commission at month end",
     lead="A calendar per professional, commissions worked out automatically, packages and loyalty. The salon runs even when the owner isn't at the counter.",
     dores=[("Paper diary and text messages", "Clients book through the link, 24/7. It lands on the right professional's calendar, with the right duration."),
            ("Commission on a calculator", "A percentage per service or per professional. Close the month in one click."),
            ("Clients who vanish", "A follow-up reminder on each service's cycle, sent by itself.")],
     chips=["Calendar per professional", "Rule-based commission", "Session packages", "Loyalty card", "E-mail reminders", "Follow-up on the service cycle", "Deposit at booking", "Daily till", "Client record", "Reviews", "Report per professional", "Page with your brand"])),
 "seg-clinics": dict(img="seg-clinicas.jpg",
   pt=dict(nome="Clínicas de estética", h1="Agenda, ficha da paciente e retorno no ciclo certo",
     lead="Ficha com histórico e fotos de antes e depois, retorno lembrado no prazo de cada procedimento, sinal no agendamento e agenda online 24h.",
     dores=[("Ficha em papel", "Ficha digital com histórico, observações e fotos de antes e depois."),
            ("Paciente que não volta", "Lembrete de retorno no ciclo de cada procedimento, antes de ela esquecer."),
            ("Faltas que custam caro", "Confirmação automática e sinal opcional no agendamento.")],
     chips=["Agenda online 24h", "Ficha com antes e depois", "Retorno por procedimento", "Sinal no agendamento", "Protocolo em sessões", "Lembrete por e-mail", "Avaliação antes do procedimento", "Assinatura mensal", "Caixa do dia", "Avaliações", "Relatório de retorno", "Página com a sua marca"]),
   en=dict(nome="Aesthetic clinics", h1="Calendar, client record and follow-ups on the right cycle",
     lead="A record with history and before-and-after photos, follow-ups reminded on each procedure's schedule, deposits at booking and a 24/7 online calendar.",
     dores=[("Paper records", "A digital record with history, notes and before-and-after photos."),
            ("Clients who don't come back", "A follow-up reminder on each procedure's cycle, before they forget."),
            ("Expensive no-shows", "Automatic confirmation and an optional deposit at booking.")],
     chips=["24/7 online booking", "Before-and-after record", "Follow-up per procedure", "Deposit at booking", "Protocols in sessions", "E-mail reminders", "Assessment before the procedure", "Monthly membership", "Daily till", "Reviews", "Return-rate report", "Page with your brand"])),
}

SEG_TPL = read(os.path.join(SRC, "templates", "segmento.html"))
SEG_STR = {
  "pt": dict(crumb_home="Início", crumb="Segmentos", b1="Começar grátis", b2="Ver o preço", how="Como funciona",
             how_h2="Do primeiro dia ao primeiro mês",
             steps=[("Dia 1 — configuração guiada", "Serviços, equipe, horários e página pública em quatro passos."),
                    ("Dia 1 — página no ar", "Seu link publicado, pronto para receber agendamento."),
                    ("Semana 1 — automações ligadas", "Confirmação, lembrete e sinal funcionando."),
                    ("Mês 1 — primeiro relatório", "Ocupação, ticket e retorno no seu e-mail.")],
             all_eyebrow="Tudo que você precisa", all_h2="Já vem no plano. Sem extra.",
             plan_eyebrow="Preço", plan_h2="Dois planos, sem letra miúda", plan_lead="Básico a R$ 59,90 e Pro a R$ 79,90 por mês. No anual, dois meses grátis. Sete dias para testar, sem cartão.",
             cta_h="Comece com a agenda de amanhã já no sistema.", cta_l="Configuração em vinte minutos, página no ar no mesmo dia e suporte de gente. Sem cartão para começar.", cta_b2="Ver o preço"),
  "en": dict(crumb_home="Home", crumb="Segments", b1="Start free", b2="See the price", how="How it works",
             how_h2="From day one to month one",
             steps=[("Day 1 — guided setup", "Services, team, opening hours and your public page in four steps."),
                    ("Day 1 — page live", "Your link published, ready to take bookings."),
                    ("Week 1 — automations on", "Confirmation, reminder and deposit working."),
                    ("Month 1 — first report", "Occupancy, ticket and return rate in your inbox.")],
             all_eyebrow="Everything you need", all_h2="Already in the plan. No extras.",
             plan_eyebrow="Pricing", plan_h2="Two plans, no fine print", plan_lead="Basic at R$ 59.90 and Pro at R$ 79.90 a month. Two months free on the yearly plan. Seven days to try it, no card.",
             cta_h="Start with tomorrow's calendar already in the system.", cta_l="Twenty-minute setup, your page live the same day and support by people. No card to start.", cta_b2="See the price"),
}
for key, seg in SEGMENTOS.items():
    for lang in LANGS:
        L, S, d = LANGS[lang], SEG_STR[lang], seg[lang]
        dores = "".join('<article class="card"><span class="eyebrow" style="margin-bottom:8px">%s</span><h3>%s.</h3><p>%s</p></article>'
                        % (a, b.split(".")[0], ".".join(b.split(".")[1:]).strip()) for a, b in d["dores"])
        steps = "".join('<li>%s<span><b>%s</b>%s</span></li>' % (OK, a, b) for a, b in S["steps"])
        chips = "".join('<span>%s</span>' % c for c in d["chips"])
        rep = dict(seg_nome=d["nome"], seg_h1=d["h1"], seg_lead=d["lead"], seg_dores=dores, seg_steps=steps, seg_chips=chips,
                   seg_img=L["base"] + "assets/img/" + seg["img"], seg_app=L["base"] + "assets/img/app-inicio.jpg",
                   p_signup=L["pages"]["signup"], p_pricing=L["pages"]["pricing"], p_index=L["pages"]["index"])
        rep.update({k: v for k, v in S.items() if isinstance(v, str)})
        main = SEG_TPL
        for k, v in rep.items(): main = main.replace("{{" + k + "}}", v)
        alt = ("en/" if lang == "pt" else "../") + LANGS[L["other"]]["pages"][key]
        title = ("Sistema para %s — {{marca}}" if lang == "pt" else "Software for %s — {{marca}}") % d["nome"].lower()
        page(lang, L["pages"][key], title, d["lead"], alt, main)

# ---------- assets ----------
for sub in ("css", "js", "img"):
    src_dir = os.path.join(SRC, "assets", sub)
    if not os.path.isdir(src_dir): continue
    dst_dir = os.path.join(HERE, "assets", sub)
    os.makedirs(dst_dir, exist_ok=True)
    for root, _, files in os.walk(src_dir):
        rel = os.path.relpath(root, src_dir)
        for fn in files:
            s, d = os.path.join(root, fn), os.path.join(dst_dir, rel, fn) if rel != "." else os.path.join(dst_dir, fn)
            os.makedirs(os.path.dirname(d), exist_ok=True)
            if fn.endswith((".css", ".js", ".svg")): write(d, read(s).replace("{{marca}}", MARCA))
            else: shutil.copy2(s, d)

print("ok — %d páginas geradas com a marca \"%s\" (pt na raiz, en em en/)" % (count, MARCA))
