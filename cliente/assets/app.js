/* Área do cliente — uma página por arquivo, chrome compartilhado.
   Cada HTML tem <body data-page="..."> e carrega business.js + este arquivo.
   Sem back-end: agendamentos, login e o passo do agendamento ficam no armazenamento do navegador. */
(function(){
  'use strict';
  const B = window.BUSINESS, PAGE = document.body.dataset.page;
  const $ = (s,c)=>(c||document).querySelector(s), $$ = (s,c)=>[...(c||document).querySelectorAll(s)];
  const brl = v => 'R$ ' + v.toLocaleString('pt-BR'), pad = n => String(n).padStart(2,'0');
  const toM = h => (+h.slice(0,2))*60 + (+h.slice(3)), toH = m => pad(Math.floor(m/60)) + ':' + pad(m%60);
  const dur = m => m >= 60 ? (m%60 ? Math.floor(m/60)+'h'+pad(m%60) : Math.floor(m/60)+'h') : m+'min';
  const iso = d => d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
  const addD = (d,n)=>{ const x = new Date(d); x.setDate(x.getDate()+n); return x; };
  const ini = n => n.split(' ').map(w=>w[0]).slice(0,2).join('');
  const DIAS = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'], DS = ['dom','seg','ter','qua','qui','sex','sáb'];
  const MESES = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const I = {
    star:'<svg viewBox="0 0 24 24"><path d="M12 2.6l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5-5.8-3-5.8 3 1.1-6.5L2.6 9.4l6.5-.9z"/></svg>',
    check:'<svg viewBox="0 0 24 24"><path d="M20 6.5L9.4 17.1 4 11.7"/></svg>', right:'<svg viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>', left:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
    chev:'<svg class="chev" viewBox="0 0 24 24"><path d="M9 5l7 7-7 7"/></svg>',
    user:'<svg viewBox="0 0 24 24"><path d="M20 21v-1.6a4.4 4.4 0 0 0-4.4-4.4H8.4A4.4 4.4 0 0 0 4 19.4V21"/><circle cx="12" cy="7.4" r="4"/></svg>',
    sun:'<svg class="sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4.2"/><path d="M12 1.8v2.4M12 19.8v2.4M1.8 12h2.4M19.8 12h2.4M4.9 4.9l1.7 1.7M17.4 17.4l1.7 1.7M19.1 4.9l-1.7 1.7M6.6 17.4l-1.7 1.7"/></svg>',
    moon:'<svg class="moon" viewBox="0 0 24 24"><path d="M20.5 14.6A8.6 8.6 0 0 1 9.4 3.5a8.6 8.6 0 1 0 11.1 11.1z"/></svg>',
    home:'<svg viewBox="0 0 24 24"><path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/></svg>',
    cal:'<svg viewBox="0 0 24 24"><rect x="3.5" y="5" width="17" height="16" rx="2.5"/><path d="M16 3v4M8 3v4M3.5 10h17"/></svg>',
    team:'<svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/></svg>',
    crown:'<svg viewBox="0 0 24 24"><path d="M3 18h18M4 6l4 5 4-7 4 7 4-5-2 12H6L4 6z"/></svg>',
    list:'<svg viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/></svg>',
    info:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/></svg>',
    msg:'<svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.2A8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z"/></svg>',
    google:'<svg viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9 3.5l6.7-6.7C35.6 2.6 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.8 6C12.3 13.2 17.7 9.5 24 9.5z"/><path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4 7.1-10 7.1-17.5z"/><path fill="#FBBC05" d="M10.4 28.8A14.5 14.5 0 0 1 9.5 24c0-1.7.3-3.3.8-4.8l-7.8-6A24 24 0 0 0 0 24c0 3.9.9 7.5 2.6 10.8l7.8-6z"/><path fill="#34A853" d="M24 48c6.2 0 11.4-2 15.2-5.6l-7.5-5.8c-2 1.4-4.7 2.3-7.7 2.3-6.3 0-11.7-3.7-13.6-9l-7.8 6C6.5 42.6 14.6 48 24 48z"/></svg>'
  };
  const stars = n => Array.from({length:5},(_,i)=> i < n ? I.star : I.star.replace('<svg','<svg class="off"')).join('');
  const seed = str => { let h = 2166136261; for(let i=0;i<str.length;i++){ h ^= str.charCodeAt(i); h = Math.imul(h,16777619); } return (h>>>0)/4294967295; };
  const say = msg => { const el = document.createElement('div'); el.className = 'toast'; el.textContent = msg; $('#toast').appendChild(el); setTimeout(()=>el.remove(), 2400); };
  const store = { get:(k,d)=>{ try{ const v = localStorage.getItem('b:'+B.slug+':'+k); return v ? JSON.parse(v) : d; }catch(e){ return d; } }, set:(k,v)=>{ try{ localStorage.setItem('b:'+B.slug+':'+k, JSON.stringify(v)); }catch(e){} } };
  const svc = id => B.servicos.find(s=>s.id===id), pro = id => B.profissionais.find(p=>p.id===id);
  const Q = new URLSearchParams(location.search), EXP = Q.get('estado') === 'expirado' || B.estado === 'expirado', qs = EXP ? '?estado=expirado' : '';

  function agora(){
    const n = new Date(), d = n.getDay(), h = B.horarios[d], m = n.getHours()*60 + n.getMinutes();
    if(h.abre && m < toM(h.fecha)) return m >= toM(h.abre) ? {ok:true, txt:'Aberto até '+h.fecha} : {ok:false, txt:'Abre hoje às '+h.abre};
    for(let i=1;i<=7;i++){ const nd = (d+i)%7; if(B.horarios[nd].abre) return {ok:false, txt:'Abre '+(i===1?'amanhã':DS[nd])+' às '+B.horarios[nd].abre}; }
    return {ok:false, txt:'Fechado'};
  }

  /* primeiro horário livre nos próximos dias, para mostrar no início */
  function proximo(){
    const hoje = new Date(); hoje.setHours(0,0,0,0);
    for(let i=0;i<7;i++){ const d = addD(hoje,i); const l = livres(d,null,45).find(x=>x.ok); if(l) return (i===0?'hoje':i===1?'amanhã':DS[d.getDay()])+' '+toH(l.t); }
    return null;
  }
  const S = { cat:'Todos', revs:4, user:store.get('user',null), ags:store.get('agendamentos',[]) };
  const A = Object.assign({ passo:1, svc:[], pro:null, data:null, hora:null, nome:'', tel:'', obs:'', codigo:'' }, store.get('ag', {}));
  if(A.data){ const [y,m,d] = String(A.data).slice(0,10).split('-').map(Number); A.data = new Date(y, m-1, d); } /* local, não UTC */
  const saveA = ()=> store.set('ag', Object.assign({}, A, { data: A.data ? iso(A.data) : null, codigo:'' }));
  let mes = new Date();

  /* ---------- casca ---------- */
  /* 5 itens no celular; Planos e Avaliações entram só na barra do desktop (classe dk) */
  const NAV = [['index.html','Início',I.home,'inicio'],['servicos.html','Serviços',I.list,'servicos'],['agendar.html','Agendar',I.cal,'agendar'],['profissionais.html','Equipe',I.team,'profissionais'],['assinaturas.html','Planos',I.crown,'assinaturas',1],['avaliacoes.html','Avaliações',I.msg,'avaliacoes',1],['sobre.html','Sobre',I.info,'sobre',1],].filter(n=>n&&!(n[3]==='assinaturas'&&!B.planos.length)&&!(n[3]==='avaliacoes'&&!B.avaliacoes.itens.length)).concat([['perfil.html','Perfil',I.user,'perfil']]);
  function shell(){
    $('#app').innerHTML = `
      ${EXP ? `<div class="banner"><div class="wrap"><i></i>Esta agenda não está aceitando agendamentos no momento. Fale com ${B.nome} pelo WhatsApp.</div></div>` : ''}
      <header class="top"><div class="wrap">
        <a class="brand" href="index.html${qs}"><span class="mk" style="${B.logo?`background-image:url(${B.logo})`:''}">${B.logo?'':B.marca}</span><b>${B.nome}</b></a>
        <button class="ib" id="theme" aria-label="Tema claro ou escuro">${I.sun}${I.moon}</button>
        <a class="ib user" id="userBtn" href="perfil.html${qs}" aria-label="Perfil">${S.user ? ini(S.user.nome) : I.user}</a>
        ${EXP ? '' : `<a class="btn acc xs cta" href="agendar.html">Agendar</a>`}
      </div></header>
      <nav class="nav" aria-label="Seções"><ul>${NAV.map(([h,l,ic,k,dk])=>`<li class="${dk?'dk':''}"><a href="${h}${qs}" ${k===PAGE?'aria-current="page"':''}>${ic}<span>${l}</span></a></li>`).join('')}</ul></nav>
      <main><div class="wrap" id="view"></div></main>
      <div id="toast"></div>`;
    $('#theme').addEventListener('click', ()=>{
      const r = document.documentElement, sys = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      const next = (r.dataset.theme || sys) === 'dark' ? 'light' : 'dark';
      const apply = ()=>{ r.dataset.theme = next; try{ localStorage.setItem('theme', next); }catch(e){} };
      document.startViewTransition ? document.startViewTransition(apply) : apply();
    });
  }
  const paint = ()=>{ $('#view').innerHTML = V[PAGE](); $('#userBtn').innerHTML = S.user ? ini(S.user.nome) : I.user; };

  /* ---------- páginas ---------- */
  const rowSvc = s => `<a class="row hit" href="agendar.html?s=${s.id}${EXP?'&estado=expirado':''}"><span style="min-width:0"><span class="nm">${s.nome}</span><span class="sub">${s.sub}</span></span><span class="end"><span class="price">${brl(s.preco)}</span><span class="durn">${dur(s.dur)}</span></span>${I.chev}</a>`;
  const V = {
    inicio(){
      const st = agora(), nxt = proximo();
      const proTxt = A.pro ? pro(A.pro).nome : null, svcTxt = A.svc.length ? A.svc.map(id=>svc(id).nome).join(' + ') : null;
      const dtTxt = (A.data && A.hora!==null) ? `${DS[A.data.getDay()]}, ${A.data.getDate()}/${pad(A.data.getMonth()+1)} às ${toH(A.hora)}` : null;
      const pronto = svcTxt && dtTxt;
      const row = (href, ic, label, short, val, off) => `<a class="pick ${val?'done':''} ${off?'off':''}" href="${off?'#':href}" ${off?'aria-disabled="true"':''}><span class="pi">${ic}</span><span class="pt"><small>${val?short:''}</small><b>${val||label}</b></span>${I.chev}</a>`;
      return `
      <div class="cover" style="background-image:url(${B.capa||''})"></div>
      <div class="ident"><div class="mark" style="${B.logo?`background-image:url(${B.logo})`:''}">${B.logo?'':B.marca}</div><h1 class="h1">${B.nome}</h1></div>
      <div class="meta"><span class="rate">${I.star}<b>${B.avaliacoes.nota.toFixed(1).replace('.',',')}</b> <span class="dimc">(${B.avaliacoes.total})</span></span><span class="dot"></span><span class="status ${st.ok?'':'shut'}"><i></i>${st.txt}</span></div>
      <p class="mut sm" style="margin-top:6px">${B.tagline}</p>
      ${EXP ? `<div class="loginBox" style="margin-top:22px"><p>Esta agenda não está aceitando agendamentos. Fale com ${B.nome} pelo WhatsApp.</p><a class="btn" href="https://wa.me/${B.whatsapp}" target="_blank" rel="noopener">Chamar no WhatsApp</a></div>` : `
      <div class="picks">
        ${row('agendar.html?ir=2', I.user, 'Selecionar profissional', 'Profissional', proTxt, false)}
        ${row('agendar.html?ir=1', I.list, 'Selecionar serviço', 'Serviço', svcTxt, false)}
        ${row('agendar.html?ir=3', I.cal, 'Selecionar data e hora', 'Data e hora', dtTxt, !svcTxt)}
      </div>
      <a class="btn wide go ${pronto?'acc':'dis'}" href="${pronto?'agendar.html?ir=5':'#'}" ${pronto?'':'aria-disabled="true"'}>Agendar ${pronto?I.right:''}</a>
      <p class="fine">${nxt ? 'Próximo horário livre: <b>'+nxt+'</b> · ' : ''}sem cadastro${B.sinal?' · sinal de '+Math.round(B.sinal*100)+'%':''}</p>`}
      <div class="rows" style="margin-top:22px">
        <a class="row hit" href="sobre.html${qs}"><span class="ico">${I.info}</span><span style="min-width:0"><span class="nm">Sobre, horários e endereço</span><span class="sub">${B.endereco.split('—')[0].trim()}</span></span>${I.chev}</a>
        <a class="row hit" href="https://wa.me/${B.whatsapp}" target="_blank" rel="noopener"><span class="ico">${I.msg}</span><span style="min-width:0"><span class="nm">WhatsApp</span><span class="sub">dúvidas e encaixes</span></span>${I.chev}</a>
      </div>
      <a class="powered" href="https://khrono.tech" target="_blank" rel="noopener"><span>Agenda por</span><img class="l" src="assets/img/khrono-wordmark-light.png" alt="KHRONO"><img class="d" src="assets/img/khrono-wordmark-dark.png" alt="KHRONO"></a>`;
    },
    sobre(){
      const hoje = new Date().getDay();
      return `<div class="pageHead"><span class="eyebrow">Sobre</span><h1 class="h2">${B.nome}</h1><p>${B.tagline}</p></div>
      <div class="sec" style="margin-top:0"><span class="lbl">Sobre</span><p class="about" style="margin-top:8px">${B.sobre}</p></div>
      <div class="sec"><span class="lbl">Horários</span><div class="rows" style="margin-top:10px">${[1,2,3,4,5,6,0].map(d=>{ const h = B.horarios[d]; return `<div class="row ${h.abre?'':'shut'} ${d===hoje?'today':''}"><span class="${d===hoje?'':'mut'}">${DIAS[d]}${d===hoje?' <span class="hoje">hoje</span>':''}</span><span class="end"><span class="price">${h.abre?h.abre+' — '+h.fecha:'Fechado'}</span></span></div>`; }).join('')}</div></div>
      <div class="sec"><div class="secTop"><span class="lbl">Endereço</span><a class="link" href="https://maps.google.com/?q=${encodeURIComponent(B.endereco)}" target="_blank" rel="noopener">Traçar rota</a></div><p class="sm">${B.endereco}</p></div>
      <div class="sec"><span class="lbl">Contato</span><div class="btns" style="margin-top:10px"><a class="btn line xs" href="https://wa.me/${B.whatsapp}" target="_blank" rel="noopener">WhatsApp</a><a class="btn line xs" href="https://instagram.com/${B.instagram}" target="_blank" rel="noopener">@${B.instagram}</a></div></div>
      <div class="sec"><span class="lbl">Comodidades</span><div class="tags" style="margin-top:10px">${B.comodidades.map(c=>`<span class="tag">${c}</span>`).join('')}</div></div>
      <div class="sec"><div class="secTop"><span class="lbl">Pagamento</span><span class="lbl">no local${B.sinal?' · sinal de '+Math.round(B.sinal*100)+'%':''}</span></div><div class="tags">${B.pagamentos.map(c=>`<span class="tag">${c}</span>`).join('')}</div></div>
      <a class="powered" href="https://khrono.tech" target="_blank" rel="noopener"><span>Agenda por</span><img class="l" src="assets/img/khrono-wordmark-light.png" alt="KHRONO"><img class="d" src="assets/img/khrono-wordmark-dark.png" alt="KHRONO"></a>`;
    },
    servicos(){ return `<div class="pageHead"><span class="eyebrow">Serviços</span><h1 class="h2">Tudo que fazemos aqui</h1><p>Toque em um serviço para agendar. Dá para somar mais de um no mesmo horário.</p></div>
      <div class="chips">${['Todos'].concat(B.categorias).map(c=>`<button class="chip" data-cat="${c}" aria-pressed="${c===S.cat}">${c}</button>`).join('')}</div>
      <div class="rows" id="svcList">${B.servicos.filter(s=> S.cat==='Todos'||s.cat===S.cat).map(rowSvc).join('')}</div>`; },
    agendar(){ return `<div class="pageHead"><span class="eyebrow">Agendar</span><h1 class="h2">Marque seu horário</h1></div>` + (EXP
      ? `<div class="loginBox"><h2 class="h3">Esta agenda não está aceitando agendamentos</h2><p>Fale direto com ${B.nome} pelo WhatsApp.</p><a class="btn" href="https://wa.me/${B.whatsapp}" target="_blank" rel="noopener">Chamar no WhatsApp</a></div>`
      : `<div class="book">${A.passo === 7 ? receipt() : step()}</div>`); },
    profissionais(){ return `<div class="pageHead"><span class="eyebrow">Equipe</span><h1 class="h2">Quem vai te atender</h1><p>Toque em um nome para agendar direto com a pessoa.</p></div><div class="grid2">${B.profissionais.map(p=>`
      <a class="card hit" href="agendar.html?p=${p.id}${EXP?'&estado=expirado':''}" style="display:flex;align-items:center;gap:12px"><span class="av lg">${ini(p.nome)}</span><span style="min-width:0;flex:1"><span class="nm" style="font-weight:500;display:block">${p.nome}</span><span class="sub mut sm">${p.cargo}</span><span class="sub dimc sm" style="display:block">${p.esp}</span></span><span class="end" style="text-align:right"><span class="mono sm">★ ${p.nota.toFixed(1).replace('.',',')}</span><span class="lbl" style="display:block">${p.n} aval.</span></span></a>`).join('')}</div>`; },
    assinaturas(){ return `<div class="pageHead"><span class="eyebrow">Assinaturas</span><h1 class="h2">Planos mensais, sem fidelidade</h1><p>Assinante não disputa horário: trava o mesmo dia e a mesma profissional todo mês, e paga menos que o avulso.</p></div>
      ${B.planos.map(p=>`<div class="card plan ${p.hi?'acc':''}">${p.hi?'<span class="lbl" style="color:var(--acc)">Mais escolhido</span>':''}<h2 class="h3" style="margin-top:4px">${p.nome}</h2><p class="mut sm">${p.desc}</p><div class="pp"><b>${brl(p.preco)}</b><span>por mês</span></div><ul>${p.itens.map(i=>`<li>${I.check}<span>${i}</span></li>`).join('')}</ul><button class="btn ${p.hi?'acc':'line'} wide" data-plano="${p.nome}" ${EXP?'disabled':''}>Assinar ${p.nome}</button></div>`).join('')}
      <p class="lbl" style="margin-top:14px;line-height:1.9">Cobrança no cartão todo dia 5 · pausa de até 30 dias sem perder o plano</p>`; },
    avaliacoes(){ const R = B.avaliacoes; return `<div class="pageHead"><span class="eyebrow">Avaliações</span><h1 class="h2">O que dizem depois do atendimento</h1></div>
      <div class="score"><div><div class="big">${R.nota.toFixed(1).replace('.',',')}</div><div class="stars" style="margin-top:8px">${stars(5)}</div><div class="lbl" style="margin-top:6px">${R.total} avaliações</div></div><div class="bars">${R.dist.map((v,i)=>`<div class="bar"><span>${5-i}</span><span class="t"><i style="width:${(v/R.total*100).toFixed(1)}%;animation-delay:${i*60}ms"></i></span><span>${v}</span></div>`).join('')}</div></div>
      <p class="lbl" style="margin-bottom:4px">Só quem foi atendido avalia</p>
      ${R.itens.slice(0,S.revs).map(r=>`<div class="rev"><div class="top2"><span class="av" style="width:32px;height:32px;font-size:11px">${ini(r.n)}</span><span><span class="who">${r.n}</span><span class="when">há ${r.d} dias</span></span><span class="stars">${stars(r.nota)}</span></div><p>${r.t}</p><span class="svc">${svc(r.sid).nome}</span>${r.r?`<div class="reply"><div class="rh">Resposta de ${B.nome}</div><p class="sm">${r.r}</p></div>`:''}</div>`).join('')}
      ${S.revs < R.itens.length ? `<button class="btn line wide" id="maisRev" style="margin-top:16px">Ver mais avaliações</button>` : ''}`; },
    perfil(){
      if(!S.user) return `<div class="pageHead"><span class="eyebrow">Seu perfil</span><h1 class="h2">Pontos, horários e recompensas</h1></div><div class="loginBox"><p>Entrar é opcional: você agenda sem conta. Com o perfil, cada real gasto vira ponto e você acompanha tudo aqui.</p><button class="btn google" id="login">${I.google}Entrar com Google</button></div>`;
      const F = B.fidelidade, u = S.user, now = new Date();
      const fut = S.ags.filter(a=> new Date(a.data+'T'+a.hora) >= now).sort((a,b)=>(a.data+a.hora).localeCompare(b.data+b.hora));
      const pas = S.ags.filter(a=> new Date(a.data+'T'+a.hora) < now).concat(u.hist);
      const pts = u.pontos + S.ags.filter(a=> new Date(a.data+'T'+a.hora) < now).reduce((t,a)=>t+a.total*F.pontosPorReal,0);
      const next = F.niveis.find(n=>n.pontos>pts) || F.niveis[F.niveis.length-1];
      return `<div class="secTop" style="margin-bottom:22px"><div style="display:flex;align-items:center;gap:12px"><span class="av lg">${ini(u.nome)}</span><div><b style="font-weight:500;display:block">${u.nome}</b><span class="mut sm">${u.email}</span></div></div><button class="link" id="logout">Sair</button></div>
      ${F.niveis.length?`<div class="sec"><span class="lbl">Fidelidade</span><div class="pts" style="margin-top:10px"><div class="n"><b>${pts.toLocaleString('pt-BR')}</b><small>pontos</small></div><div class="n"><b>${Math.max(0,next.pontos-pts).toLocaleString('pt-BR')}</b><small>para ${next.nome.toLowerCase()}</small></div><div class="n"><b>${pas.length}</b><small>visitas</small></div></div>
        <div class="card" style="margin-top:10px"><div class="prog"><i style="width:${Math.min(100,Math.round(pts/next.pontos*100))}%"></i></div><p class="mut sm">Cada R$ 1 em serviços vale ${F.pontosPorReal} ponto, creditado depois do atendimento.</p></div>
        ${F.niveis.map(n=>{ const ok = pts>=n.pontos, used = (u.resg||[]).includes(n.pontos); return `<div class="rew ${ok?'':'locked'}"><i>${n.pontos>=1000?n.pontos/1000+'k':n.pontos}</i><span><b>${n.nome}</b><small>${used?'resgatado':ok?'disponível':n.pontos.toLocaleString('pt-BR')+' pontos'}</small></span>${ok&&!used?`<button class="btn xs acc" data-resg="${n.pontos}">Resgatar</button>`:''}</div>`; }).join('')}</div>`:''}
      <div class="sec"><div class="secTop"><span class="lbl">Próximos horários</span><a class="link" href="agendar.html">Novo</a></div>
        ${fut.length ? fut.map(a=>`<div class="card acc"><span class="lbl" style="color:var(--acc)">Confirmado · ${a.codigo}</span><h3 class="h3" style="margin:6px 0 2px">${a.svc.map(id=>svc(id).nome).join(' + ')}</h3><p class="mut sm">com ${a.pro?pro(a.pro).nome:'a primeira profissional livre'} · ${dur(a.dur)}</p><p class="mono sm" style="margin:10px 0 12px">${DS[new Date(a.data+'T12:00').getDay()]}, ${a.data.slice(8)}/${a.data.slice(5,7)} às ${a.hora}</p><div class="btns"><a class="btn line xs" href="agendar.html">Reagendar</a><button class="btn line xs" data-cancel="${a.codigo}">Cancelar</button></div></div>`).join('') : `<p class="mut sm">Nenhum horário marcado. <a class="link" href="agendar.html">Agendar agora</a></p>`}</div>
      <div class="sec"><span class="lbl">Histórico</span><div class="rows" style="margin-top:10px">${pas.length ? pas.map(a=>`<div class="row"><span class="mono dimc" style="font-size:12px;width:44px;flex:none">${a.data.slice(8)}/${a.data.slice(5,7)}</span><span style="min-width:0"><span class="nm">${(a.svc||[a.sid]).map(id=>svc(id).nome).join(' + ')}</span><span class="sub">${a.pro?pro(a.pro).nome:'—'}</span></span><span class="end"><span class="price">${brl(a.total)}</span></span></div>`).join('') : '<p class="mut sm" style="padding:12px 0">Sua primeira visita ainda vai acontecer.</p>'}</div></div>
      <div class="sec"><span class="lbl">Dados</span><div class="kv" style="margin-top:6px"><span class="k">WhatsApp</span><span class="mono">${u.tel}</span></div><div class="kv"><span class="k">Lembretes</span><span>WhatsApp, 2h antes</span></div><div class="kv"><span class="k">Cliente desde</span><span>${u.desde}</span></div></div>`;
    }
  };

  /* ---------- agendamento ---------- */
  const total = ()=> A.svc.reduce((t,id)=>t+svc(id).preco,0), bloco = ()=> A.svc.reduce((t,id)=>t+svc(id).dur,0), quem = ()=> A.pro ? pro(A.pro).nome : 'Primeira profissional livre';
  const P = [['Serviço','Escolha o que vai fazer','Pode somar mais de um no mesmo horário.'],['Profissional','Com quem você prefere?','Só aparece quem atende o que você escolheu.'],['Data','Que dia fica melhor?','Dias sem horário livre aparecem desativados.'],['Horário','Escolha o horário','Só aparece o que está livre de verdade.'],['Seus dados','Quase lá','Nome e WhatsApp para a confirmação. Sem senha, sem conta.'],['Confirmação','Confirme com o código','Enviamos um código de 4 dígitos para o seu WhatsApp.']];
  const demoCode = ()=> String(1000 + Math.floor(seed(B.slug + A.tel) * 9000));
  function livres(data, proId, precisa){
    const h = B.horarios[data.getDay()]; if(!h.abre) return [];
    const now = new Date(), hoje = iso(data) === iso(now), m = now.getHours()*60 + now.getMinutes(), out = [];
    for(let t = toM(h.abre); t + precisa <= toM(h.fecha); t += 30){
      let ok = seed(B.slug + iso(data) + (proId||'x') + t) > 0.4;
      if(hoje && t < m + B.antecedenciaMin) ok = false;
      if(S.ags.some(a=> a.data===iso(data) && a.hora===toH(t) && (!proId || a.pro===proId))) ok = false;
      out.push({t, ok});
    }
    return out;
  }
  const can = ()=> [null, A.svc.length>0, A.svc.length>0 || !!A.pro, !!A.data, A.hora!==null, A.nome.trim().length>1 && A.tel.replace(/\D/g,'').length>=10, A.codigo.length===4][A.passo];
  function step(){
    const p = P[A.passo-1].slice(); if(A.passo===1 && A.pro) p[1] = 'O que vai fazer com ' + pro(A.pro).nome.split(' ')[0] + '?';
    return `<div class="steps">${P.map((_,i)=>`<i class="${i<A.passo?'on':''}"></i>`).join('')}</div>
      <span class="lbl">Passo ${A.passo} de 6 · ${p[0]}</span><h2 class="h2">${p[1]}</h2><p class="hint">${p[2]}</p>
      <div id="stepBody">${BODY[A.passo]()}</div>
      <div class="foot">${A.svc.length ? `<div class="tot"><span>${A.svc.length} ${A.svc.length===1?'item':'itens'} · ${dur(bloco())}${B.sinal?' · sinal '+brl(Math.round(total()*B.sinal)):''}</span><b>${brl(total())}</b></div>` : ''}
        <div class="btns">${A.passo>1?`<button class="btn line back" data-nav="-1" aria-label="Voltar">${I.left}</button>`:''}<button class="btn acc" data-nav="1" id="next" ${can()?'':'disabled'}>${A.passo===6?'Confirmar agendamento':'Continuar'}</button></div></div>`;
  }
  const BODY = {
    1: ()=> (A.pro ? `<p class="lbl" style="margin-bottom:4px;color:var(--acc)">com ${pro(A.pro).nome}</p>` : '') + B.categorias.map(c=>{ const L = B.servicos.filter(s=>s.cat===c && (!A.pro || pro(A.pro).atende.includes(s.id))); return L.length ? `<div class="grp">${c}</div>${L.map(s=>`<button class="opt" data-psvc="${s.id}" aria-pressed="${A.svc.includes(s.id)}"><span><span class="nm">${s.nome}</span><span class="sub">${brl(s.preco)} · ${dur(s.dur)}</span></span><span class="tick">${I.check}</span></button>`).join('')}` : ''; }).join(''),
    2: ()=>{ const ok = B.profissionais.filter(p=> A.svc.every(id=>p.atende.includes(id)));
      if(!A.svc.length) return ok.map(p=>`<button class="opt" data-ppro="${p.id}" aria-pressed="${A.pro===p.id}"><span class="av">${ini(p.nome)}</span><span><span class="nm">${p.nome}</span><span class="sub">${p.esp}</span></span><span class="tick">${I.check}</span></button>`).join('');
      return `<button class="opt" data-ppro="" aria-pressed="${!A.pro}"><span class="av">?</span><span><span class="nm">Primeira profissional livre</span><span class="sub">costuma abrir horário mais cedo</span></span><span class="tick">${I.check}</span></button>${ok.map(p=>`<button class="opt" data-ppro="${p.id}" aria-pressed="${A.pro===p.id}"><span class="av">${ini(p.nome)}</span><span><span class="nm">${p.nome}</span><span class="sub">${p.esp}</span></span><span class="tick">${I.check}</span></button>`).join('')}`; },
    3: ()=>{ const y = mes.getFullYear(), m = mes.getMonth(), first = new Date(y,m,1).getDay(), n = new Date(y,m+1,0).getDate(), hoje = new Date(); hoje.setHours(0,0,0,0); const lim = addD(hoje,B.janelaDias), precisa = bloco()||45;
      let c = ''; for(let i=0;i<first;i++) c += '<span></span>';
      for(let d=1; d<=n; d++){ const dt = new Date(y,m,d); const off = !B.horarios[dt.getDay()].abre || dt<hoje || dt>lim || !livres(dt,A.pro,precisa).some(s=>s.ok); c += `<button class="day" data-dia="${iso(dt)}" aria-pressed="${!!A.data && iso(A.data)===iso(dt)}" ${off?'disabled':''}>${d}</button>`; }
      return `<div class="mo"><button class="ib" data-mes="-1" aria-label="Mês anterior">${I.left}</button><b>${MESES[m]} ${y}</b><button class="ib" data-mes="1" aria-label="Próximo mês">${I.right}</button></div><div class="wk">${DS.map(d=>`<span>${d}</span>`).join('')}</div><div class="cal">${c}</div>`; },
    4: ()=>{ const precisa = bloco()||45, L = livres(A.data,A.pro,precisa), n = L.filter(s=>s.ok).length;
      const g = [['Manhã',s=>s.t<720],['Tarde',s=>s.t>=720&&s.t<1080],['Noite',s=>s.t>=1080]];
      return `<p class="lbl" style="line-height:1.9;margin-bottom:4px">${DIAS[A.data.getDay()]}, ${A.data.getDate()} de ${MESES[A.data.getMonth()]}<br><span style="color:var(--acc)">${n} ${n===1?'horário livre':'horários livres'}</span> · ${dur(precisa)}</p>${g.map(([l,f])=>{ const x = L.filter(f); return x.length?`<div class="grp">${l}</div><div class="slots">${x.map(s=>`<button class="slot" data-hora="${s.t}" aria-pressed="${A.hora===s.t}" ${s.ok?'':'disabled'}>${toH(s.t)}</button>`).join('')}</div>`:''; }).join('')}`; },
    5: ()=> `<div class="sum"><span class="k">Serviço</span><span class="v">${A.svc.map(id=>svc(id).nome).join(' + ')}</span><button class="ed" data-ir="1">trocar</button></div>
      <div class="sum"><span class="k">Profissional</span><span class="v">${quem()}</span><button class="ed" data-ir="2">trocar</button></div>
      <div class="sum" style="margin-bottom:16px"><span class="k">Quando</span><span class="v">${DS[A.data.getDay()]}, ${A.data.getDate()}/${pad(A.data.getMonth()+1)} às ${toH(A.hora)}</span><button class="ed" data-ir="3">trocar</button></div>
      <div class="fld"><label>Seu nome</label><input class="inp" id="fNome" value="${A.nome}" placeholder="Como quer ser chamado" autocomplete="name"></div>
      <div class="fld"><label>WhatsApp</label><input class="inp" id="fTel" value="${A.tel}" placeholder="(11) 99999-9999" inputmode="tel" autocomplete="tel"></div>
      <div class="fld"><label>Observação (opcional)</label><input class="inp" id="fObs" value="${A.obs}" placeholder="Alergia, preferência, primeira vez…"></div>
      ${B.sinal?`<p class="mut sm">Sinal de <b class="mono" style="color:var(--ink)">${brl(Math.round(total()*B.sinal))}</b> para garantir o horário.${B.sinalRegra?' '+B.sinalRegra:''}</p>`:''}`,
    6: ()=> `<p class="chint">Código enviado para <b>${A.tel}</b>.</p><div class="code">${[0,1,2,3].map(i=>`<input inputmode="numeric" maxlength="1" data-c="${i}" value="${A.codigo[i]||''}" aria-label="dígito ${i+1}">`).join('')}</div><p class="chint dimc">Nesta demonstração o código é <b>${demoCode()}</b>.</p>`
  };
  function receipt(){
    const a = S.ags[S.ags.length-1];
    return `<div class="done"><div class="ring">${I.check}</div><h2 class="h2">Horário confirmado</h2><p>Mandamos a confirmação no seu WhatsApp e um lembrete duas horas antes.${S.user?'':' Quer acompanhar seus pontos? <a class="link" href="perfil.html">Entre com Google</a>.'}</p>
      <div class="card stub"><span class="cod">Comprovante ${a.codigo}</span><h3 class="h3" style="margin:6px 0 10px">${a.svc.map(id=>svc(id).nome).join(' + ')}</h3>
        <div class="kv"><span class="k">Profissional</span><span>${a.pro?pro(a.pro).nome:'Primeira livre'}</span></div><div class="kv"><span class="k">Data</span><span class="mono">${DS[new Date(a.data+'T12:00').getDay()]} ${a.data.slice(8)}/${a.data.slice(5,7)}</span></div><div class="kv"><span class="k">Horário</span><span class="mono">${a.hora} — ${toH(toM(a.hora)+a.dur)}</span></div><div class="kv"><span class="k">Total</span><span class="mono">${brl(a.total)}</span></div></div>
      <div class="btns" style="margin-top:16px;justify-content:center"><button class="btn line" id="novo">Marcar outro</button><a class="btn acc" href="perfil.html">Ver no perfil</a></div></div>`;
  }
  function confirmar(){
    S.ags.push({ codigo:'AG-'+String(1000+Math.floor(seed(iso(A.data)+A.hora+A.tel)*9000)), svc:[...A.svc], pro:A.pro, data:iso(A.data), hora:toH(A.hora), dur:bloco(), total:total(), nome:A.nome, tel:A.tel, obs:A.obs });
    store.set('agendamentos', S.ags); A.passo = 7; saveA(); paint(); scrollTo({top:0, behavior:'smooth'}); say('Agendamento confirmado');
  }
  const reset = (s,p)=>{ Object.assign(A, {passo: s?2:1, svc: s?[s]:[], pro: p||null, data:null, hora:null, codigo:''}); mes = new Date(); saveA(); };
  const go = ()=>{ saveA(); paint(); scrollTo({top:0, behavior:'smooth'}); if(A.passo===6) setTimeout(()=>{ const c = $('[data-c="0"]'); if(c) c.focus({preventScroll:true}); }, 350); };

  /* ---------- eventos ---------- */
  document.addEventListener('click', e=>{
    const t = e.target, q = s => t.closest(s); let x;
    if(q('.brand') && PAGE === 'inicio'){ e.preventDefault(); scrollTo({top:0, behavior:'smooth'}); return; } /* brand-home */
    if(q('[aria-disabled="true"]')){ e.preventDefault(); if(q('.pick')) say('Escolha o serviço primeiro'); return; }
    if(x = q('[data-cat]')){ S.cat = x.dataset.cat; $$('[data-cat]').forEach(c=>c.setAttribute('aria-pressed', String(c.dataset.cat===S.cat))); $('#svcList').innerHTML = B.servicos.filter(s=>S.cat==='Todos'||s.cat===S.cat).map(rowSvc).join(''); return; }
    if(q('#maisRev')){ S.revs = 99; paint(); return; }
    if(x = q('[data-plano]')){ say('Assinatura '+x.dataset.plano+' — checkout entra com o pagamento'); return; }
    if(q('#login')){ S.user = { nome:'Diego Salvador', email:'diego@gmail.com', tel:A.tel||'(11) 99999-4471', desde:'março de 2025', pontos:1180, hist:[{data:'2026-08-28',sid:'f1',pro:'p1',total:180},{data:'2026-08-07',sid:'s1',pro:'p3',total:90},{data:'2026-07-17',sid:'c1',pro:'p2',total:190}] }; store.set('user',S.user); paint(); say('Conectado com Google'); return; }
    if(q('#logout')){ S.user = null; store.set('user',null); paint(); return; }
    if(x = q('[data-resg]')){ S.user.resg = (S.user.resg||[]).concat(+x.dataset.resg); store.set('user',S.user); paint(); say('Recompensa resgatada'); return; }
    if(x = q('[data-cancel]')){ S.ags = S.ags.filter(a=>a.codigo!==x.dataset.cancel); store.set('agendamentos',S.ags); paint(); say('Agendamento cancelado'); return; }
    if(q('#novo')){ reset(); paint(); return; }
    if(x = q('[data-psvc]')){ const id = x.dataset.psvc, i = A.svc.indexOf(id); i>-1 ? A.svc.splice(i,1) : A.svc.push(id); if(A.pro && !A.svc.every(sid=>pro(A.pro).atende.includes(sid))) A.pro = null; A.hora = null; x.setAttribute('aria-pressed', String(A.svc.includes(id))); saveA(); foot(); return; }
    if(x = q('[data-ppro]')){ A.pro = x.dataset.ppro || null; A.hora = null; A.passo = A.svc.length ? 3 : 1; go(); return; }
    if(x = q('[data-mes]')){ mes = new Date(mes.getFullYear(), mes.getMonth()+(+x.dataset.mes), 1); $('#stepBody').innerHTML = BODY[3](); return; }
    if((x = q('[data-dia]')) && !x.disabled){ const [y,m,d] = x.dataset.dia.split('-').map(Number); A.data = new Date(y,m-1,d); A.hora = null; A.passo = 4; go(); return; }
    if((x = q('[data-hora]')) && !x.disabled){ A.hora = +x.dataset.hora; $$('.slot').forEach(s=>s.setAttribute('aria-pressed','false')); x.setAttribute('aria-pressed','true'); saveA(); foot(); return; }
    if(x = q('[data-ir]')){ A.passo = +x.dataset.ir; go(); return; }
    if(x = q('[data-nav]')){ const d = +x.dataset.nav;
      if(d>0 && A.passo===6){ if(A.codigo===demoCode()) confirmar(); else erro(); return; }
      if(d>0 && A.passo===5 && S.user){ confirmar(); return; }
      A.passo = Math.min(6, Math.max(1, A.passo+d)); if(d>0 && A.passo===2 && A.pro) A.passo = 3; if(A.passo===4 && !A.data) A.passo = 3; go();
    }
  });
  const erro = ()=>{ say('Código não confere'); $$('.code input').forEach(i=>{ i.classList.remove('err'); void i.offsetWidth; i.classList.add('err'); }); };
  function foot(){ const f = $('.foot'); if(!f) return; const tmp = document.createElement('div'); tmp.innerHTML = step(); f.replaceWith(tmp.querySelector('.foot')); }
  document.addEventListener('input', e=>{
    const t = e.target;
    if(t.id==='fNome'){ A.nome = t.value; saveA(); $('#next').disabled = !can(); }
    if(t.id==='fTel'){ let v = t.value.replace(/\D/g,'').slice(0,11); if(v.length>6) v = `(${v.slice(0,2)}) ${v.slice(2,7)}-${v.slice(7)}`; else if(v.length>2) v = `(${v.slice(0,2)}) ${v.slice(2)}`; t.value = v; A.tel = v; saveA(); $('#next').disabled = !can(); }
    if(t.id==='fObs'){ A.obs = t.value; saveA(); }
    if(t.dataset.c !== undefined){ t.value = t.value.replace(/\D/g,'').slice(-1); t.classList.remove('err'); const ins = $$('.code input'); A.codigo = ins.map(i=>i.value).join(''); if(t.value && +t.dataset.c<3) ins[+t.dataset.c+1].focus(); $('#next').disabled = !can(); if(A.codigo.length===4){ if(A.codigo===demoCode()) setTimeout(confirmar,200); else erro(); } }
  });
  document.addEventListener('keydown', e=>{ const t = e.target; if(t.dataset && t.dataset.c!==undefined && e.key==='Backspace' && !t.value && +t.dataset.c>0) $$('.code input')[+t.dataset.c-1].focus(); });

  /* pré-seleção vinda de outra página: agendar.html?s=f1 ou ?p=p2 */
  if(PAGE === 'agendar'){
    if(Q.get('s') && svc(Q.get('s'))) reset(Q.get('s'));
    else if(Q.get('p') && pro(Q.get('p'))) reset(null, Q.get('p'));
    if(Q.get('por') === 'pro'){ reset(); A.passo = 2; saveA(); }
    if(Q.get('ir')){ const n = +Q.get('ir'); if(A.passo === 7) reset(); A.passo = (n===3 && !A.svc.length) ? 1 : (n===4 && !A.data) ? 3 : (n===5 && (!A.data || A.hora===null)) ? 3 : Math.min(6, Math.max(1, n)); saveA(); }
    if(Q.has('s') || Q.has('p') || Q.has('por') || Q.has('ir')) history.replaceState(null, '', 'agendar.html' + qs); /* recarregar não zera o passo */
    if(A.passo === 7 && !S.ags.length) reset();
  }
  shell(); paint();
})();
