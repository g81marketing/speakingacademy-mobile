// ─── BASE DE DADOS — SPEAKING ACADEMY ────────────────────────────────────────
// Níveis:     beginner | basic | intermediate | advanced
// Categorias: words | daily | negation | questions | work | meetings | conversations
// Frases com `day` (1–110) fazem parte do Plano de 110 dias
// Campo `phonetic`: pronúncia adaptada para falantes de português (apenas beginner)
// Campo `sound`:    fonema alvo (treino de pronúncia)
// Campo `hint`:     dica em português sobre o som
//
// Mapeamento de dias → nível:
//   Dias   1–30  → beginner   (Fase 1: 1–10 palavras | Fase 2: 11–20 mini frases | Fase 3: 21–30 frases simples)
//   Dias  31–70  → basic      (Fase 1: 31–40 consolidação | Fase 2: 41–50 negação/perguntas | Fase 3: 51–60 situações | Fase 4: 61–70 respostas)
//   Dias  71–110 → advanced   (Fase 1: 71–80 argumentação | Fase 2: 81–90 profissional | Fase 3: 91–100 fluência | Fase 4: 101–110 naturalidade)
// ─────────────────────────────────────────────────────────────────────────────

// ═══════════════════════════════════════════════════════════════════════════════
// PLANO DE 110 DIAS + BIBLIOTECA PROFISSIONAL
// ═══════════════════════════════════════════════════════════════════════════════

export const phrases = [

  // ══════════════════════════════════════════════════════════════════════════════
  // INICIANTE ABSOLUTO — dias 1–30
  // ══════════════════════════════════════════════════════════════════════════════

  // ── Fase 1 (dias 1–10): Palavras isoladas ─────────────────────────────────────
  { id: 101, day: 1,  phase: 1, level: 'beginner', category: 'words',
    english: 'Hello', portuguese: 'Olá', phonetic: 'hê-lou',
    sound: 'H aspirado', hint: 'Expire ar antes do "H" — não é silencioso como no português.' },
  { id: 102, day: 2,  phase: 1, level: 'beginner', category: 'words',
    english: 'Goodbye', portuguese: 'Tchau / Até logo', phonetic: 'gud-bái',
    sound: 'Ditongo /aɪ/', hint: '"Bye" termina com ditongo — "bái", não "bai".' },
  { id: 103, day: 3,  phase: 1, level: 'beginner', category: 'words',
    english: 'Please', portuguese: 'Por favor', phonetic: 'plíiz',
    sound: 'Vogal longa /iː/', hint: '"Please" = plíiiz — vogal bem longa no final.' },
  { id: 104, day: 4,  phase: 1, level: 'beginner', category: 'words',
    english: 'Thank you', portuguese: 'Obrigado', phonetic: 'thênk-iu',
    sound: 'TH surdo /θ/', hint: 'Língua entre os dentes e sopre para o TH — não é "T" nem "F".' },
  { id: 105, day: 5,  phase: 1, level: 'beginner', category: 'words',
    english: 'Sorry', portuguese: 'Desculpe', phonetic: 'sóri',
    sound: 'R americano', hint: '"Sorry" — o R não vibra. Língua curva para trás sem tocar o palato.' },
  { id: 106, day: 6,  phase: 1, level: 'beginner', category: 'words',
    english: 'Yes', portuguese: 'Sim', phonetic: 'iéss',
    sound: '/j/ inicial', hint: '"Yes" começa com Y, não com J — /jɛs/.' },
  { id: 107, day: 7,  phase: 1, level: 'beginner', category: 'words',
    english: 'No', portuguese: 'Não', phonetic: 'nôu',
    sound: 'Ditongo /oʊ/', hint: '"No" = /noʊ/ — termina com ditongo, não com "ó" fechado.' },
  { id: 108, day: 8,  phase: 1, level: 'beginner', category: 'words',
    english: 'Good', portuguese: 'Bom / Ótimo', phonetic: 'gud',
    sound: '/ʊ/ curto', hint: '"Good" = /gʊd/ — o OO é curto e fechado, como "u" em "puta".' },
  { id: 109, day: 9,  phase: 1, level: 'beginner', category: 'words',
    english: 'Help', portuguese: 'Ajuda / Ajudar', phonetic: 'hélp',
    sound: 'H + consoante final', hint: 'H aspirado no início, L+P no final — não adicione vogal depois de "help".' },
  { id: 110, day: 10, phase: 1, level: 'beginner', category: 'words',
    english: 'Water', portuguese: 'Água', phonetic: 'uóter',
    sound: 'R americano medial', hint: '"Water" = /wɔːtər/ — o T vira um D suave e o R final é americano.' },

  // ── Fase 2 (dias 11–20): Mini frases ─────────────────────────────────────────
  { id: 111, day: 11, phase: 2, level: 'beginner', category: 'daily',
    english: 'I work.', portuguese: 'Eu trabalho.', phonetic: 'ái uórk',
    sound: 'W + R americano', hint: '"Work" = /wɜːrk/ — W (lábios redondos) e R sem vibração.' },
  { id: 112, day: 12, phase: 2, level: 'beginner', category: 'daily',
    english: 'I eat.', portuguese: 'Eu como.', phonetic: 'ái íit',
    sound: 'Vogal longa /iː/', hint: '"Eat" = /iːt/ — vogal bem longa: íiit.' },
  { id: 113, day: 13, phase: 2, level: 'beginner', category: 'daily',
    english: 'I sleep.', portuguese: 'Eu durmo.', phonetic: 'ái slíip',
    sound: 'Cluster /sl/ + /iː/', hint: '"Sleep" começa com SL — não diga "isilíip". Cluster direto: sl-.' },
  { id: 114, day: 14, phase: 2, level: 'beginner', category: 'daily',
    english: "I'm here.", portuguese: 'Estou aqui.', phonetic: 'áim hír',
    sound: 'H aspirado', hint: '"Here" começa com H — expire ar. Não diga "iere".' },
  { id: 115, day: 15, phase: 2, level: 'beginner', category: 'daily',
    english: "It's good.", portuguese: 'Está bom.', phonetic: 'íts gud',
    sound: 'T+S final /ts/', hint: '"It\'s" = /ɪts/ — dois sons no final: T depois S. Não diga "ítchi".' },
  { id: 116, day: 16, phase: 2, level: 'beginner', category: 'daily',
    english: 'No, thanks.', portuguese: 'Não, obrigado.', phonetic: 'nôu thênks',
    sound: 'TH surdo /θ/ + cluster', hint: '"Thanks" = /θæŋks/ — TH entre os dentes, depois NK+S no final.' },
  { id: 117, day: 17, phase: 2, level: 'beginner', category: 'daily',
    english: 'Come here.', portuguese: 'Venha aqui.', phonetic: 'câm hír',
    sound: 'H aspirado medial', hint: '"Here" com H aspirado — não deixe mudo. "Come" = /kʌm/, não "cômi".' },
  { id: 118, day: 18, phase: 2, level: 'beginner', category: 'daily',
    english: "I'm busy.", portuguese: 'Estou ocupado.', phonetic: 'áim bízi',
    sound: '/ɪ/ curto', hint: '"Busy" = /bɪzi/ — o I é curto, como "i" em "filho".' },
  { id: 119, day: 19, phase: 2, level: 'beginner', category: 'daily',
    english: 'My name is...', portuguese: 'Meu nome é...', phonetic: 'mái nêim iz',
    sound: 'Ditongo /eɪ/', hint: '"Name" = /neɪm/ — ditongo no meio: "nêim", não "nem".' },
  { id: 120, day: 20, phase: 2, level: 'beginner', category: 'daily',
    english: 'Nice to meet you.', portuguese: 'Prazer em conhecer.', phonetic: 'náis tu míit iu',
    sound: 'Vogal /iː/ + /j/', hint: '"Meet" = /miːt/ — vogal longa. "You" = /juː/, começa com Y.' },

  // ── Fase 3 (dias 21–30): Frases simples ──────────────────────────────────────
  { id: 121, day: 21, phase: 3, level: 'beginner', category: 'daily',
    english: 'I think so.', portuguese: 'Eu acho que sim.', phonetic: 'ái thínk sôu',
    sound: 'TH surdo /θ/', hint: 'TH em "think": língua entre os dentes, sopre sem voz.' },
  { id: 122, day: 22, phase: 3, level: 'beginner', category: 'daily',
    english: 'I need help.', portuguese: 'Eu preciso de ajuda.', phonetic: 'ái níid hélp',
    sound: 'Vogal /iː/ + H', hint: '"Need" = /niːd/ — vogal longa. "Help" com H aspirado.' },
  { id: 123, day: 23, phase: 3, level: 'beginner', category: 'daily',
    english: "I don't know.", portuguese: 'Eu não sei.', phonetic: 'ái dôunt nôu',
    sound: 'Ditongo /oʊ/ repetido', hint: '"Don\'t" e "know" têm o mesmo ditongo /oʊ/: "dôunt nôu".' },
  { id: 124, day: 24, phase: 3, level: 'beginner', category: 'daily',
    english: 'I like it.', portuguese: 'Eu gosto disso.', phonetic: 'ái láik ít',
    sound: 'Ditongo /aɪ/', hint: '"Like" = /laɪk/ — ditongo "láik", não "laik".' },
  { id: 125, day: 25, phase: 3, level: 'beginner', category: 'questions',
    english: 'How are you?', portuguese: 'Como você está?', phonetic: 'ráu ár iu',
    sound: 'H + ditongo /aʊ/', hint: '"How" = /haʊ/ — H aspirado + ditongo. Não diga "rau".' },
  { id: 126, day: 26, phase: 3, level: 'beginner', category: 'daily',
    english: "I'm fine, thanks.", portuguese: 'Estou bem, obrigado.', phonetic: 'áim fáin thênks',
    sound: 'Ditongo /aɪ/ + TH /θ/', hint: '"Fine" = /faɪn/ — ditongo. "Thanks" com TH entre os dentes.' },
  { id: 127, day: 27, phase: 3, level: 'beginner', category: 'questions',
    english: "What's your name?", portuguese: 'Qual é o seu nome?', phonetic: 'uáts iur nêim',
    sound: 'W + /j/', hint: '"What\'s" = /wʌts/ — W com lábios redondos. "Your" começa com Y.' },
  { id: 128, day: 28, phase: 3, level: 'beginner', category: 'daily',
    english: "I don't understand.", portuguese: 'Eu não entendo.', phonetic: 'ái dôunt ândêrstænd',
    sound: 'Cluster /nd/ final', hint: '"Understand" termina com /nd/ — não diga "ânderstand-i".' },
  { id: 129, day: 29, phase: 3, level: 'beginner', category: 'questions',
    english: 'Can you help me?', portuguese: 'Você pode me ajudar?', phonetic: 'kæn iu hélp mi',
    sound: '/æ/ aberto', hint: '"Can" = /kæn/ — A aberto, boca larga. H aspirado em "help".' },
  { id: 130, day: 30, phase: 3, level: 'beginner', category: 'daily',
    english: 'See you later!', portuguese: 'Até mais!', phonetic: 'síi iu lêitêr',
    sound: 'Vogal /iː/ + ditongo /eɪ/', hint: '"See" = /siː/ — vogal longa. "Later" = /leɪtər/ — ditongo + R americano.' },

  // ══════════════════════════════════════════════════════════════════════════════
  // BÁSICO — dias 31–70
  // ══════════════════════════════════════════════════════════════════════════════

  // ── Fase 1 (dias 31–40): Consolidação ────────────────────────────────────────
  { id: 201, day: 31, phase: 1, level: 'basic', category: 'daily',
    english: 'I feel fine today.', portuguese: 'Estou me sentindo bem hoje.',
    sound: 'Vogal /iː/', hint: '"Feel" = /fiːl/ — vogal longa. Não diga "fil".' },
  { id: 202, day: 32, phase: 1, level: 'basic', category: 'work',
    english: 'I need to finish this today.', portuguese: 'Preciso terminar isso hoje.' },
  { id: 203, day: 33, phase: 1, level: 'basic', category: 'work',
    english: 'Can you help me with this?', portuguese: 'Você pode me ajudar com isso?' },
  { id: 204, day: 34, phase: 1, level: 'basic', category: 'daily',
    english: "I work from home.", portuguese: 'Eu trabalho de casa.',
    sound: 'W + R americano', hint: '"Work" = /wɜːrk/ — W com lábios e R sem vibrar.' },
  { id: 205, day: 35, phase: 1, level: 'basic', category: 'work',
    english: "I'll send you the files.", portuguese: 'Vou te enviar os arquivos.' },
  { id: 206, day: 36, phase: 1, level: 'basic', category: 'meetings',
    english: 'I have a meeting at three.', portuguese: 'Tenho uma reunião às três.',
    sound: 'Cluster /θr/', hint: '"Three" = /θriː/ — TH+R inicial, o mais difícil do inglês.' },
  { id: 207, day: 37, phase: 1, level: 'basic', category: 'daily',
    english: 'Thank you for your help.', portuguese: 'Obrigado pela sua ajuda.',
    sound: 'TH surdo /θ/', hint: '"Thank" — TH entre os dentes, sopre. Não diga "tank".' },
  { id: 208, day: 38, phase: 1, level: 'basic', category: 'work',
    english: "I'll get back to you.", portuguese: 'Vou te retornar.' },
  { id: 209, day: 39, phase: 1, level: 'basic', category: 'work',
    english: "I'm working on it now.", portuguese: 'Estou trabalhando nisso agora.' },
  { id: 210, day: 40, phase: 1, level: 'basic', category: 'work',
    english: 'Let me check that for you.', portuguese: 'Deixa eu verificar isso para você.',
    sound: '/tʃ/ "ch"', hint: '"Check" = /tʃɛk/ — CH como "church". Não é "xek".' },

  // ── Fase 2 (dias 41–50): Negação e perguntas ──────────────────────────────────
  { id: 211, day: 41, phase: 2, level: 'basic', category: 'negation',
    english: "I don't think that's right.", portuguese: 'Não acho que está certo.',
    sound: 'TH /θ/ x2', hint: '"Think" e "that\'s" — dois TH. Pratique um de cada vez.' },
  { id: 212, day: 42, phase: 2, level: 'basic', category: 'negation',
    english: "I can't do this right now.", portuguese: 'Não consigo fazer isso agora.',
    sound: '/æ/ + TH /ð/', hint: '"Can\'t" = /kænt/ — A aberto. "This" com TH sonoro.' },
  { id: 213, day: 43, phase: 2, level: 'basic', category: 'negation',
    english: "I don't have time today.", portuguese: 'Não tenho tempo hoje.' },
  { id: 214, day: 44, phase: 2, level: 'basic', category: 'negation',
    english: "I'm not ready yet.", portuguese: 'Ainda não estou pronto.',
    sound: '/j/ em "yet"', hint: '"Yet" = /jɛt/ — começa com Y, não com J. /j/ suave.' },
  { id: 215, day: 45, phase: 2, level: 'basic', category: 'questions',
    english: 'What do you think?', portuguese: 'O que você acha?',
    sound: 'W + TH /θ/', hint: 'W (lábios redondos) e TH (língua entre dentes). Dois sons difíceis.' },
  { id: 216, day: 46, phase: 2, level: 'basic', category: 'questions',
    english: 'Do you have a minute?', portuguese: 'Você tem um minuto?' },
  { id: 217, day: 47, phase: 2, level: 'basic', category: 'questions',
    english: 'Can we reschedule?', portuguese: 'Podemos remarcar?' },
  { id: 218, day: 48, phase: 2, level: 'basic', category: 'questions',
    english: 'Where are you from?', portuguese: 'De onde você é?',
    sound: 'W + R americano', hint: '"Where" = /wɛr/ — W com lábios, R americano sem vibração.' },
  { id: 219, day: 49, phase: 2, level: 'basic', category: 'questions',
    english: 'How does this work?', portuguese: 'Como isso funciona?',
    sound: 'H + TH /ð/', hint: '"How" com H aspirado. "This" com TH sonoro.' },
  { id: 220, day: 50, phase: 2, level: 'basic', category: 'questions',
    english: 'What time is the meeting?', portuguese: 'Que horas é a reunião?' },

  // ── Fase 3 (dias 51–60): Situações reais ─────────────────────────────────────
  { id: 221, day: 51, phase: 3, level: 'basic', category: 'work',
    english: 'I need to check with my manager.', portuguese: 'Preciso verificar com meu gerente.' },
  { id: 222, day: 52, phase: 3, level: 'basic', category: 'daily',
    english: 'Let me know if you need anything.', portuguese: 'Me avisa se precisar de qualquer coisa.',
    sound: 'TH /ð/ em "anything"', hint: '"Anything" = /ˈɛniθɪŋ/ — TH surdo. Não diga "enisin".' },
  { id: 223, day: 53, phase: 3, level: 'basic', category: 'meetings',
    english: 'Can everyone join the call?', portuguese: 'Todos podem entrar na chamada?' },
  { id: 224, day: 54, phase: 3, level: 'basic', category: 'work',
    english: "I'll take care of it.", portuguese: 'Eu vou cuidar disso.' },
  { id: 225, day: 55, phase: 3, level: 'basic', category: 'work',
    english: 'We should talk about this.', portuguese: 'Devemos conversar sobre isso.',
    sound: '/ʃ/ + TH /ð/', hint: '"Should" = /ʃʊd/ — SH suave, L mudo. "This" com TH sonoro.' },
  { id: 226, day: 56, phase: 3, level: 'basic', category: 'daily',
    english: "I'm running a bit late.", portuguese: 'Estou um pouco atrasado.' },
  { id: 227, day: 57, phase: 3, level: 'basic', category: 'work',
    english: 'Can you send me the details?', portuguese: 'Você pode me enviar os detalhes?' },
  { id: 228, day: 58, phase: 3, level: 'basic', category: 'daily',
    english: "I'll be there in five minutes.", portuguese: 'Estarei lá em cinco minutos.' },
  { id: 229, day: 59, phase: 3, level: 'basic', category: 'meetings',
    english: "Let's discuss this in the meeting.", portuguese: 'Vamos discutir isso na reunião.' },
  { id: 230, day: 60, phase: 3, level: 'basic', category: 'work',
    english: "I'll keep you posted.", portuguese: 'Vou te manter informado.' },

  // ── Fase 4 (dias 61–70): Respostas naturais ──────────────────────────────────
  { id: 231, day: 61, phase: 4, level: 'basic', category: 'daily',
    english: 'Just a moment, please.', portuguese: 'Só um momento, por favor.' },
  { id: 232, day: 62, phase: 4, level: 'basic', category: 'daily',
    english: 'Let me think about that.', portuguese: 'Deixa eu pensar sobre isso.',
    sound: 'TH /θ/ em "think" e "that"', hint: 'Dois TH: "think" (surdo) e "that" (sonoro). Note a diferença.' },
  { id: 233, day: 63, phase: 4, level: 'basic', category: 'daily',
    english: 'That sounds great!', portuguese: 'Isso parece ótimo!',
    sound: 'TH /ð/ + cluster /nd/', hint: '"That" com TH sonoro. "Sounds" = /saʊndz/ — ditongo + cluster.' },
  { id: 234, day: 64, phase: 4, level: 'basic', category: 'daily',
    english: 'I totally agree with you.', portuguese: 'Concordo totalmente com você.',
    sound: 'W + /j/', hint: '"With" = /wɪð/ — W e TH sonoro no final. "You" = /juː/ — Y.' },
  { id: 235, day: 65, phase: 4, level: 'basic', category: 'daily',
    english: "Actually, I'm not sure about that.", portuguese: 'Na verdade, não tenho certeza sobre isso.' },
  { id: 236, day: 66, phase: 4, level: 'basic', category: 'daily',
    english: "Good point! I hadn't thought of that.", portuguese: 'Boa observação! Eu não tinha pensado nisso.',
    sound: 'TH /θ/ + cluster', hint: '"Thought" = /θɔːt/ — TH surdo + vogal longa.' },
  { id: 237, day: 67, phase: 4, level: 'basic', category: 'work',
    english: "Let me get back to you on this.", portuguese: 'Deixa eu te retornar sobre isso.' },
  { id: 238, day: 68, phase: 4, level: 'basic', category: 'work',
    english: "I'll have it ready by end of day.", portuguese: 'Terei pronto até o final do dia.' },
  { id: 239, day: 69, phase: 4, level: 'basic', category: 'meetings',
    english: 'Could we schedule a quick call?', portuguese: 'Poderíamos agendar uma ligação rápida?' },
  { id: 240, day: 70, phase: 4, level: 'basic', category: 'meetings',
    english: 'Just to make sure I understand...', portuguese: 'Só para ter certeza que entendi...' },

  // ══════════════════════════════════════════════════════════════════════════════
  // AVANÇADO — dias 71–110
  // ══════════════════════════════════════════════════════════════════════════════

  // ── Fase 1 (dias 71–80): Argumentação e opinião ───────────────────────────────
  { id: 301, day: 71, phase: 1, level: 'advanced', category: 'conversations',
    english: 'I appreciate you bringing that up.', portuguese: 'Agradeço por levantar isso.' },
  { id: 302, day: 72, phase: 1, level: 'advanced', category: 'conversations',
    english: "That's an interesting perspective.", portuguese: 'Essa é uma perspectiva interessante.' },
  { id: 303, day: 73, phase: 1, level: 'advanced', category: 'conversations',
    english: "I see what you mean, but I think...", portuguese: 'Entendo o que você quer dizer, mas acho...' },
  { id: 304, day: 74, phase: 1, level: 'advanced', category: 'meetings',
    english: 'We need to align on this before moving forward.', portuguese: 'Precisamos nos alinhar sobre isso antes de avançar.' },
  { id: 305, day: 75, phase: 1, level: 'advanced', category: 'conversations',
    english: 'Could you elaborate on that?', portuguese: 'Você poderia elaborar sobre isso?' },
  { id: 306, day: 76, phase: 1, level: 'advanced', category: 'meetings',
    english: "I'd like to propose a different approach.", portuguese: 'Gostaria de propor uma abordagem diferente.' },
  { id: 307, day: 77, phase: 1, level: 'advanced', category: 'meetings',
    english: "Let's take a step back and look at the bigger picture.", portuguese: 'Vamos recuar e olhar o quadro geral.' },
  { id: 308, day: 78, phase: 1, level: 'advanced', category: 'work',
    english: "I'll loop in the rest of the team.", portuguese: 'Vou incluir o restante da equipe.' },
  { id: 309, day: 79, phase: 1, level: 'advanced', category: 'work',
    english: 'We should escalate this to the stakeholders.', portuguese: 'Devemos escalar isso para as partes interessadas.' },
  { id: 310, day: 80, phase: 1, level: 'advanced', category: 'conversations',
    english: "That's a valid concern. Let me address it.", portuguese: 'Essa é uma preocupação válida. Deixa eu abordar.' },

  // ── Fase 2 (dias 81–90): Ambiente profissional ────────────────────────────────
  { id: 311, day: 81, phase: 2, level: 'advanced', category: 'meetings',
    english: "I'd like to discuss the project timeline.", portuguese: 'Gostaria de discutir o cronograma do projeto.' },
  { id: 312, day: 82, phase: 2, level: 'advanced', category: 'meetings',
    english: 'Could you provide an update on the budget?', portuguese: 'Você pode dar uma atualização sobre o orçamento?' },
  { id: 313, day: 83, phase: 2, level: 'advanced', category: 'work',
    english: "I'm following up on my previous email.", portuguese: 'Estou dando continuidade ao meu e-mail anterior.' },
  { id: 314, day: 84, phase: 2, level: 'advanced', category: 'work',
    english: 'The deliverables need to align with expectations.', portuguese: 'As entregas precisam se alinhar às expectativas.' },
  { id: 315, day: 85, phase: 2, level: 'advanced', category: 'meetings',
    english: "We need to leverage our strengths here.", portuguese: 'Precisamos aproveitar nossos pontos fortes aqui.' },
  { id: 316, day: 86, phase: 2, level: 'advanced', category: 'meetings',
    english: "Let's identify the key performance indicators.", portuguese: 'Vamos identificar os indicadores-chave de desempenho.' },
  { id: 317, day: 87, phase: 2, level: 'advanced', category: 'work',
    english: 'I recommend we prioritize these action items.', portuguese: 'Recomendo que priorizemos esses itens de ação.' },
  { id: 318, day: 88, phase: 2, level: 'advanced', category: 'meetings',
    english: "We should schedule a follow-up for next week.", portuguese: 'Devemos agendar um acompanhamento para a próxima semana.' },
  { id: 319, day: 89, phase: 2, level: 'advanced', category: 'work',
    english: "I'll circulate the meeting notes afterward.", portuguese: 'Vou circular as notas da reunião depois.' },
  { id: 320, day: 90, phase: 2, level: 'advanced', category: 'meetings',
    english: 'Could you be more specific about the deliverables?', portuguese: 'Você poderia ser mais específico sobre as entregas?' },

  // ── Fase 3 (dias 91–100): Fluência e naturalidade ────────────────────────────
  { id: 321, day: 91,  phase: 3, level: 'advanced', category: 'conversations',
    english: 'I really appreciate your patience on this.', portuguese: 'Agradeço muito a sua paciência com isso.' },
  { id: 322, day: 92,  phase: 3, level: 'advanced', category: 'conversations',
    english: "Let's think it through before we decide.", portuguese: 'Vamos pensar bem antes de decidirmos.',
    sound: 'TH /θ/ duas vezes', hint: '"Think" e "through" — TH surdo em ambos.' },
  { id: 323, day: 93,  phase: 3, level: 'advanced', category: 'meetings',
    english: "I'd like to flag a potential issue.", portuguese: 'Gostaria de sinalizar um problema potencial.' },
  { id: 324, day: 94,  phase: 3, level: 'advanced', category: 'conversations',
    english: "That's not quite what I had in mind.", portuguese: 'Não é exatamente o que eu tinha em mente.' },
  { id: 325, day: 95,  phase: 3, level: 'advanced', category: 'work',
    english: "I'll have my team look into it right away.", portuguese: 'Vou pedir para minha equipe investigar imediatamente.' },
  { id: 326, day: 96,  phase: 3, level: 'advanced', category: 'conversations',
    english: 'Can we find a middle ground here?', portuguese: 'Podemos encontrar um meio-termo aqui?' },
  { id: 327, day: 97,  phase: 3, level: 'advanced', category: 'conversations',
    english: "I want to make sure we're on the same page.", portuguese: 'Quero ter certeza de que estamos alinhados.' },
  { id: 328, day: 98,  phase: 3, level: 'advanced', category: 'meetings',
    english: 'Let me walk you through the key points.', portuguese: 'Deixa eu te guiar pelos pontos principais.' },
  { id: 329, day: 99,  phase: 3, level: 'advanced', category: 'conversations',
    english: "This is something I'm really passionate about.", portuguese: 'Isso é algo pelo qual sou muito apaixonado.' },
  { id: 330, day: 100, phase: 3, level: 'advanced', category: 'conversations',
    english: "I'm confident we can find a solution.", portuguese: 'Estou confiante de que podemos encontrar uma solução.' },

  // ── Fase 4 (dias 101–110): Naturalidade absoluta ──────────────────────────────
  { id: 331, day: 101, phase: 4, level: 'advanced', category: 'conversations',
    english: 'I appreciate your candid feedback.', portuguese: 'Agradeço o seu feedback honesto.' },
  { id: 332, day: 102, phase: 4, level: 'advanced', category: 'work',
    english: 'We should streamline this process going forward.', portuguese: 'Devemos simplificar esse processo daqui para frente.' },
  { id: 333, day: 103, phase: 4, level: 'advanced', category: 'work',
    english: "I'll make sure we're aligned on the priorities.", portuguese: 'Vou garantir que estamos alinhados nas prioridades.' },
  { id: 334, day: 104, phase: 4, level: 'advanced', category: 'conversations',
    english: 'Could you share your thoughts on this approach?', portuguese: 'Você poderia compartilhar sua opinião sobre essa abordagem?' },
  { id: 335, day: 105, phase: 4, level: 'advanced', category: 'meetings',
    english: "I'd like to revisit this in our next meeting.", portuguese: 'Gostaria de revisar isso na nossa próxima reunião.' },
  { id: 336, day: 106, phase: 4, level: 'advanced', category: 'meetings',
    english: "Let's put together an action plan for this.", portuguese: 'Vamos elaborar um plano de ação para isso.' },
  { id: 337, day: 107, phase: 4, level: 'advanced', category: 'conversations',
    english: 'I think we need to rethink our strategy here.', portuguese: 'Acho que precisamos repensar nossa estratégia aqui.' },
  { id: 338, day: 108, phase: 4, level: 'advanced', category: 'meetings',
    english: 'This aligns perfectly with our goals.', portuguese: 'Isso se alinha perfeitamente com nossos objetivos.' },
  { id: 339, day: 109, phase: 4, level: 'advanced', category: 'work',
    english: "I'll reach out to the stakeholders directly.", portuguese: 'Vou entrar em contato com as partes interessadas diretamente.' },
  { id: 340, day: 110, phase: 4, level: 'advanced', category: 'conversations',
    english: "Three months from now, I'll be speaking fluently.", portuguese: 'Daqui a três meses, estarei falando fluentemente.',
    sound: 'Cluster /θr/ + fluent', hint: '"Three" = /θriː/ — o cluster TH+R mais difícil do inglês. Você chegou até aqui!' },

  // ══════════════════════════════════════════════════════════════════════════════
  // BIBLIOTECA PROFISSIONAL (sem dia — apenas para prática livre)
  // ══════════════════════════════════════════════════════════════════════════════
  { id: 1, level: 'basic',        category: 'work',
    english: 'Can you help me with this report?', portuguese: 'Você pode me ajudar com esse relatório?' },
  { id: 2, level: 'basic',        category: 'work',
    english: 'I will send the files later today.', portuguese: 'Vou enviar os arquivos ainda hoje.' },
  { id: 3, level: 'basic',        category: 'meetings',
    english: "Let's schedule a meeting for tomorrow.", portuguese: 'Vamos agendar uma reunião para amanhã.' },
  { id: 4, level: 'basic',        category: 'meetings',
    english: 'Can everyone join the call at 2 PM?', portuguese: 'Todos podem entrar na chamada às 14h?' },
  { id: 5, level: 'basic',        category: 'work',
    english: 'Please find the attached document.', portuguese: 'Segue o documento em anexo.' },
  { id: 6, level: 'basic',        category: 'work',
    english: 'Thank you for your quick response.', portuguese: 'Obrigado pela sua resposta rápida.' },
  { id: 7, level: 'intermediate', category: 'work',
    english: "I'd like to discuss the project timeline with the team.", portuguese: 'Gostaria de discutir o cronograma do projeto com a equipe.' },
  { id: 8, level: 'intermediate', category: 'work',
    english: 'We need to align our priorities before moving forward.', portuguese: 'Precisamos alinhar nossas prioridades antes de avançar.' },
  { id: 9, level: 'intermediate', category: 'meetings',
    english: "I'd like to bring up a concern regarding the deadline.", portuguese: 'Gostaria de levantar uma preocupação sobre o prazo.' },
  { id: 10, level: 'intermediate', category: 'meetings',
    english: "Let's take a five-minute break and reconvene shortly.", portuguese: 'Vamos fazer uma pausa de cinco minutos e retomar em seguida.' },
  { id: 11, level: 'advanced',    category: 'work',
    english: 'We should leverage our core competencies to gain a competitive advantage.', portuguese: 'Devemos aproveitar nossas competências essenciais para obter vantagem competitiva.' },
  { id: 12, level: 'advanced',    category: 'meetings',
    english: 'Could you elaborate on the key performance indicators for this quarter?', portuguese: 'Poderia elaborar sobre os indicadores-chave de desempenho deste trimestre?' },
  { id: 13, level: 'advanced',    category: 'work',
    english: 'I am writing to follow up on our previous conversation regarding the partnership.', portuguese: 'Escrevo para dar continuidade à nossa conversa anterior sobre a parceria.' },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

export function getLevelForDay(day) {
  if (day <= 30)  return 'beginner';
  if (day <= 70)  return 'basic';
  return 'advanced';
}

export function getPhaseForDay(day) {
  if (day <= 10)  return 1;
  if (day <= 20)  return 2;
  if (day <= 30)  return 3;
  if (day <= 40)  return 1;
  if (day <= 50)  return 2;
  if (day <= 60)  return 3;
  if (day <= 70)  return 4;
  if (day <= 80)  return 1;
  if (day <= 90)  return 2;
  if (day <= 100) return 3;
  return 4;
}

export const PHASE_LABELS = {
  beginner: ['Palavras', 'Mini frases', 'Frases simples'],
  basic:    ['Consolidação', 'Negação & Perguntas', 'Situações reais', 'Respostas naturais'],
  advanced: ['Argumentação', 'Ambiente profissional', 'Fluência', 'Naturalidade'],
};

export const LEVEL_LABELS = {
  beginner:     'Iniciante',
  basic:        'Básico',
  intermediate: 'Intermediário',
  advanced:     'Avançado',
};

// Plano de 110 dias em ordem
export const trainingPlan = phrases
  .filter((p) => p.day != null)
  .sort((a, b) => a.day - b.day);

// Retorna o bloco (grupo de 5 frases) correspondente ao dia atual
// blockNumber = 1, 2, 3 ... 22  (110 dias / 5)
export function getBlockForDay(day, blockSize = 5) {
  const blockNumber = Math.ceil(day / blockSize);
  const startIdx = (blockNumber - 1) * blockSize;
  return {
    blockNumber,
    totalBlocks: Math.ceil(trainingPlan.length / blockSize),
    phrases: trainingPlan.slice(startIdx, startIdx + blockSize),
  };
}

// Retorna blocos agrupados por categoria/assunto (para níveis não iniciante)
// level: 'basic' | 'intermediate' | 'advanced' — define o pool de frases
export function getBlocksByCategory(category, level, blockSize = 5) {
  const pool = phrases.filter((p) => {
    const levelMatch = level === 'advanced'
      ? p.level === 'advanced'
      : p.level !== 'beginner';
    const catMatch = category === 'all' || p.category === category;
    return levelMatch && catMatch && !!p.english;
  });

  const totalBlocks = Math.ceil(pool.length / blockSize);
  const blocks = [];
  for (let i = 0; i < pool.length; i += blockSize) {
    const chunk = pool.slice(i, i + blockSize);
    if (chunk.length > 0) {
      blocks.push({
        blockNumber: blocks.length + 1,
        totalBlocks,
        category,
        phrases: chunk,
      });
    }
  }
  return blocks;
}

// Retorna todos os blocos
export function getAllBlocks(blockSize = 5) {
  const blocks = [];
  for (let i = 0; i < trainingPlan.length; i += blockSize) {
    blocks.push({
      blockNumber: Math.floor(i / blockSize) + 1,
      totalBlocks: Math.ceil(trainingPlan.length / blockSize),
      phrases: trainingPlan.slice(i, i + blockSize),
    });
  }
  return blocks;
}
