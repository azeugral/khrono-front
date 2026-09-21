/* Configuração do negócio — é o que o painel do proprietário gera para /b/<slug>/ */
window.BUSINESS = {
  slug:"estudio", nome:"Estúdio", marca:"E", logo:null,
  capa:"assets/img/capa.jpg",
  tagline:"Estética e beleza — Pinheiros, São Paulo",
  sobre:"Estúdio de estética com foco em resultado que dura. <b>Avaliação antes de qualquer procedimento</b>, protocolo por escrito e retorno agendado no prazo certo. A agenda desta página é a agenda real do estúdio.",
  endereco:"R. dos Pinheiros, 1240 — Pinheiros, São Paulo",
  whatsapp:"5511988887777", instagram:"studioluma",
  comodidades:["Estacionamento conveniado","Wi-Fi","Ar-condicionado","Acessível"],
  pagamentos:["Pix","Crédito","Débito","Dinheiro"],
  /* 0 = domingo · abre null = fechado */
  horarios:[ {abre:null,fecha:null}, {abre:"09:00",fecha:"19:00"}, {abre:"09:00",fecha:"19:00"}, {abre:"09:00",fecha:"19:00"}, {abre:"09:00",fecha:"19:00"}, {abre:"09:00",fecha:"19:00"}, {abre:"09:00",fecha:"14:00"} ],
  antecedenciaMin:60, janelaDias:60,
  /* sinal: fração do total (0 = não cobra). sinalRegra: texto livre do proprietário sobre como funciona (reembolso, prazo, forma). Vazio = não mostra regra. */
  sinal:0, sinalRegra:"",
  /* políticas do estabelecimento, exibidas nos Termos de agendamento (texto livre do proprietário) */
  politica:{
    cancelamento:"Cancele ou remarque com pelo menos 12 horas de antecedência, pelo comprovante do agendamento ou pelo WhatsApp do estabelecimento.",
    atraso:"Tolerância de 10 minutos. Depois disso o atendimento pode ser reduzido para não atrasar o próximo cliente, ou remarcado.",
    falta:"Faltas sem aviso podem ser consideradas na aceitação de novos agendamentos."
  },
  /* identificação do responsável pelo estabelecimento (controlador dos dados dos clientes). Vazio = mostra só o nome fantasia. */
  juridico:{ razao:"", cnpj:"", responsavel:"", emailPrivacidade:"" },
  termosVersao:"1.0", termosData:"21 de setembro de 2026",
  categorias:["Facial","Corporal","Sobrancelhas & cílios","Pacotes"],
  servicos:[
    {id:"f1",cat:"Facial",nome:"Limpeza de pele profunda",sub:"Vapor, extração, alta frequência e máscara",preco:180,dur:70},
    {id:"f2",cat:"Facial",nome:"Peeling de diamante",sub:"Renovação celular com ponteira diamantada",preco:220,dur:60},
    {id:"f3",cat:"Facial",nome:"Microagulhamento",sub:"Estímulo de colágeno com ativos específicos",preco:380,dur:90},
    {id:"f4",cat:"Facial",nome:"Hidratação facial",sub:"Máscara de ácido hialurônico e massagem",preco:150,dur:50},
    {id:"c1",cat:"Corporal",nome:"Drenagem linfática",sub:"Manobras lentas para retenção e inchaço",preco:190,dur:60},
    {id:"c2",cat:"Corporal",nome:"Massagem modeladora",sub:"Pressão firme em região localizada",preco:210,dur:60},
    {id:"c3",cat:"Corporal",nome:"Radiofrequência",sub:"Firmeza da pele por aquecimento controlado",preco:260,dur:45},
    {id:"s1",cat:"Sobrancelhas & cílios",nome:"Design de sobrancelha",sub:"Mapeamento, correção e finalização",preco:90,dur:40},
    {id:"s2",cat:"Sobrancelhas & cílios",nome:"Brow lamination",sub:"Fios alinhados com efeito preenchido",preco:180,dur:75},
    {id:"s3",cat:"Sobrancelhas & cílios",nome:"Lash lifting",sub:"Curvatura natural, sem extensão",preco:170,dur:70},
    {id:"p1",cat:"Pacotes",nome:"Protocolo facial — 4 sessões",sub:"Limpeza + peeling + 2 hidratações, em 8 semanas",preco:640,dur:70},
    {id:"p2",cat:"Pacotes",nome:"Corporal — 8 sessões",sub:"Drenagem e modeladora alternadas",preco:1440,dur:60}
  ],
  profissionais:[
    {id:"p1",nome:"Gabriela Lemos",cargo:"Esteticista responsável",esp:"Facial · microagulhamento",nota:5.0,n:214,atende:["f1","f2","f3","f4","p1"]},
    {id:"p2",nome:"Helena Kuroda",cargo:"Terapeuta corporal",esp:"Drenagem · modeladora",nota:4.9,n:168,atende:["c1","c2","c3","p2"]},
    {id:"p3",nome:"Kelly Tavares",cargo:"Designer de sobrancelhas",esp:"Design · lamination · lash",nota:4.9,n:132,atende:["s1","s2","s3"]}
  ],
  planos:[
    {id:"pl1",nome:"Rotina",preco:299,desc:"Um facial por mês, sempre com a mesma profissional.",hi:false,itens:["<b>1 facial</b> por mês","10% nos demais serviços","Remarcação livre até 12h antes"]},
    {id:"pl2",nome:"Cuidado",preco:539,desc:"Facial e corporal no mesmo ciclo, todo mês.",hi:true,itens:["<b>1 facial + 2 corporais</b> por mês","Design de sobrancelha incluso","<b>Horário fixo</b> reservado","15% nos demais serviços"]},
    {id:"pl3",nome:"Protocolo",preco:899,desc:"Para quem está em tratamento contínuo.",hi:false,itens:["<b>Sessões ilimitadas</b> de facial e corporal","Microagulhamento mensal incluso","Prioridade em encaixes"]}
  ],
  avaliacoes:{ nota:4.9, total:287, dist:[252,26,6,2,1], itens:[
    {n:"Mariana Costa",nota:5,d:2,sid:"f1",t:"Avaliação antes, protocolo explicado, e o retorno já saiu agendado no dia certo.",r:"Obrigada, Mariana. Te esperamos dia 12."},
    {n:"Renata Alves",nota:5,d:6,sid:"c1",t:"Marquei pelo link às 23h e de manhã já estava confirmado no meu WhatsApp."},
    {n:"Juliana Prado",nota:4,d:9,sid:"s2",t:"Resultado ótimo. Tirei uma estrela porque a sala estava fria — já foi ajustado.",r:"Verdade, Juliana. O ar da sala 2 foi regulado no mesmo dia."},
    {n:"Carla Menezes",nota:5,d:14,sid:"f3",t:"Terceira sessão. A Gabriela fotografa a evolução e mostra lado a lado."},
    {n:"Bianca Rocha",nota:5,d:20,sid:"s1",t:"Design certeiro, sem exagero. A Kelly entende o formato do rosto antes de tocar na pinça."},
    {n:"Fernanda Lima",nota:5,d:27,sid:"p1",t:"Assinei o plano Cuidado e nunca mais fiquei sem horário."}
  ]},
  fidelidade:{ pontosPorReal:1, niveis:[ {pontos:500,nome:"Design de sobrancelha"}, {pontos:1500,nome:"Hidratação facial"}, {pontos:3000,nome:"Limpeza de pele profunda"} ] }
};
