// ─── MISSÕES DO CAMINHO INICIANTE ─────────────────────────────────────────────
// Missões  1–10: palavras e frases curtas (5 itens, 1 conversa cada)
// Missões 11–22: 4 conversas por missão × 4 linhas = blocos 11–58
// blockNumber sequencial 1–58  |  totalBlocks: 58
// Blocos 11+: campo missionGroup / conversationNumber / totalConversations

const TOTAL = 58;

export const BEGINNER_MISSIONS = [

  // ══════════════════════════════════════════════════════════════════════════
  // MISSÕES 1–10 — Palavras e Frases Curtas
  // ══════════════════════════════════════════════════════════════════════════

  {
    blockNumber: 1, totalBlocks: TOTAL,
    missionInfo: { name: 'Saudações', emoji: '👋', level: 'beginner' },
    phrases: [
      { id: 'b101', english: 'Hello',     portuguese: 'Olá',             level: 'beginner', category: 'words', phonetic: 'hê-lou',    sound: 'H aspirado',      hint: 'Expire ar antes do "H" — não é silencioso.' },
      { id: 'b102', english: 'Goodbye',   portuguese: 'Tchau / Até logo', level: 'beginner', category: 'words', phonetic: 'gud-bái',   sound: 'Ditongo /aɪ/',    hint: '"Bye" termina com ditongo — "bái", não "bai".' },
      { id: 'b103', english: 'Please',    portuguese: 'Por favor',        level: 'beginner', category: 'words', phonetic: 'plíiz',     sound: 'Vogal longa /iː/', hint: '"Please" = plíiiz — vogal bem longa.' },
      { id: 'b104', english: 'Thank you', portuguese: 'Obrigado',         level: 'beginner', category: 'words', phonetic: 'thênk-iu',  sound: 'TH surdo /θ/',    hint: 'Língua entre os dentes e sopre para o TH.' },
      { id: 'b105', english: 'Sorry',     portuguese: 'Desculpe',         level: 'beginner', category: 'words', phonetic: 'sóri',      sound: 'R americano',     hint: 'O R não vibra — língua curva para trás sem tocar o palato.' },
    ],
  },

  {
    blockNumber: 2, totalBlocks: TOTAL,
    missionInfo: { name: 'Respostas Básicas', emoji: '💬', level: 'beginner' },
    phrases: [
      { id: 'b201', english: 'Yes',   portuguese: 'Sim',       level: 'beginner', category: 'words', phonetic: 'iéss',   sound: '/j/ inicial',    hint: '"Yes" começa com Y, não com J — /jɛs/.' },
      { id: 'b202', english: 'No',    portuguese: 'Não',       level: 'beginner', category: 'words', phonetic: 'nôu',    sound: 'Ditongo /oʊ/',   hint: '"No" = /noʊ/ — termina com ditongo.' },
      { id: 'b203', english: 'Good',  portuguese: 'Bom',       level: 'beginner', category: 'words', phonetic: 'gud',    sound: '/ʊ/ curto',      hint: '"Good" = /gʊd/ — OO curto e fechado.' },
      { id: 'b204', english: 'Okay',  portuguese: 'Está bem',  level: 'beginner', category: 'words', phonetic: 'ô-kêi', sound: 'Ditongo /eɪ/',   hint: '"Okay" termina com ditongo "kêi".' },
      { id: 'b205', english: 'Great', portuguese: 'Ótimo',     level: 'beginner', category: 'words', phonetic: 'grêit', sound: 'Ditongo /eɪ/',   hint: '"Great" = /greɪt/ — ditongo no meio.' },
    ],
  },

  {
    blockNumber: 3, totalBlocks: TOTAL,
    missionInfo: { name: 'Palavras de Ação', emoji: '⚡', level: 'beginner' },
    phrases: [
      { id: 'b301', english: 'Help', portuguese: 'Ajuda',   level: 'beginner', category: 'words', phonetic: 'hélp',  sound: 'H + consoante final', hint: 'H aspirado no início; não adicione vogal depois.' },
      { id: 'b302', english: 'Wait', portuguese: 'Espere',  level: 'beginner', category: 'words', phonetic: 'uêit', sound: 'W + ditongo /eɪ/',     hint: 'W com lábios redondos + ditongo "uêit".' },
      { id: 'b303', english: 'Stop', portuguese: 'Pare',    level: 'beginner', category: 'words', phonetic: 'stóp', sound: 'Cluster /st/',          hint: '"Stop" = /stɒp/ — ST direto, sem vogal antes.' },
      { id: 'b304', english: 'Come', portuguese: 'Venha',   level: 'beginner', category: 'words', phonetic: 'câm',  sound: '/ʌ/ aberto',           hint: '"Come" = /kʌm/ — O pronunciado como /ʌ/.' },
      { id: 'b305', english: 'Go',   portuguese: 'Vá / Ir', level: 'beginner', category: 'words', phonetic: 'gôu', sound: 'Ditongo /oʊ/',          hint: '"Go" = /goʊ/ — termina com ditongo.' },
    ],
  },

  {
    blockNumber: 4, totalBlocks: TOTAL,
    missionInfo: { name: 'Coisas do Dia a Dia', emoji: '🏠', level: 'beginner' },
    phrases: [
      { id: 'b401', english: 'Water', portuguese: 'Água',          level: 'beginner', category: 'words', phonetic: 'uóter', sound: 'R americano medial', hint: 'T vira D suave e R final é americano.' },
      { id: 'b402', english: 'Food',  portuguese: 'Comida',        level: 'beginner', category: 'words', phonetic: 'fúud',  sound: 'Vogal longa /uː/',  hint: '"Food" = /fuːd/ — UU bem longo.' },
      { id: 'b403', english: 'Work',  portuguese: 'Trabalho',      level: 'beginner', category: 'words', phonetic: 'uórk', sound: 'W + R americano',    hint: '"Work" = /wɜːrk/ — W com lábios, R sem vibrar.' },
      { id: 'b404', english: 'Home',  portuguese: 'Casa',          level: 'beginner', category: 'words', phonetic: 'hôum', sound: 'H + ditongo /oʊ/',   hint: '"Home" = /hoʊm/ — H aspirado + ditongo.' },
      { id: 'b405', english: 'Time',  portuguese: 'Tempo / Hora',  level: 'beginner', category: 'words', phonetic: 'táim', sound: 'Ditongo /aɪ/',       hint: '"Time" = /taɪm/ — ditongo "táim".' },
    ],
  },

  {
    blockNumber: 5, totalBlocks: TOTAL,
    missionInfo: { name: 'Mini Frases 1', emoji: '✏️', level: 'beginner' },
    phrases: [
      { id: 'b501', english: 'I work.',    portuguese: 'Eu trabalho.',   level: 'beginner', category: 'daily', phonetic: 'ái uórk',    sound: 'W + R americano',  hint: '"Work" = /wɜːrk/ — W e R sem vibração.' },
      { id: 'b502', english: 'I eat.',     portuguese: 'Eu como.',       level: 'beginner', category: 'daily', phonetic: 'ái íit',     sound: 'Vogal longa /iː/', hint: '"Eat" = /iːt/ — vogal longa: íiit.' },
      { id: 'b503', english: 'I sleep.',   portuguese: 'Eu durmo.',      level: 'beginner', category: 'daily', phonetic: 'ái slíip',   sound: 'Cluster /sl/ + /iː/', hint: '"Sleep" — SL direto, sem vogal antes.' },
      { id: 'b504', english: "I'm here.",  portuguese: 'Estou aqui.',    level: 'beginner', category: 'daily', phonetic: 'áim hír',    sound: 'H aspirado',       hint: '"Here" começa com H — expire ar.' },
      { id: 'b505', english: "It's good.", portuguese: 'Está bom.',      level: 'beginner', category: 'daily', phonetic: 'íts gud',    sound: 'T+S final /ts/',    hint: '"It\'s" = /ɪts/ — T depois S no final.' },
    ],
  },

  {
    blockNumber: 6, totalBlocks: TOTAL,
    missionInfo: { name: 'Mini Frases 2', emoji: '📝', level: 'beginner' },
    phrases: [
      { id: 'b601', english: 'No, thanks.',       portuguese: 'Não, obrigado.',       level: 'beginner', category: 'daily', phonetic: 'nôu thênks',    sound: 'TH surdo /θ/ + cluster', hint: 'TH entre os dentes, depois NK+S.' },
      { id: 'b602', english: 'Come here.',         portuguese: 'Venha aqui.',          level: 'beginner', category: 'daily', phonetic: 'câm hír',        sound: 'H aspirado medial',      hint: '"Come" = /kʌm/. "Here" com H aspirado.' },
      { id: 'b603', english: "I'm busy.",          portuguese: 'Estou ocupado.',       level: 'beginner', category: 'daily', phonetic: 'áim bízi',       sound: '/ɪ/ curto',              hint: '"Busy" = /bɪzi/ — I curto.' },
      { id: 'b604', english: 'My name is...',      portuguese: 'Meu nome é...',        level: 'beginner', category: 'daily', phonetic: 'mái nêim iz',    sound: 'Ditongo /eɪ/',           hint: '"Name" = /neɪm/ — ditongo "nêim".' },
      { id: 'b605', english: 'Nice to meet you.',  portuguese: 'Prazer em conhecer.',  level: 'beginner', category: 'daily', phonetic: 'náis tu míit iu', sound: 'Vogal /iː/ + /j/',       hint: '"Meet" longa. "You" começa com Y.' },
    ],
  },

  {
    blockNumber: 7, totalBlocks: TOTAL,
    missionInfo: { name: 'Frases Úteis 1', emoji: '🌟', level: 'beginner' },
    phrases: [
      { id: 'b701', english: 'I think so.',       portuguese: 'Eu acho que sim.',  level: 'beginner', category: 'daily',     phonetic: 'ái thínk sôu',       sound: 'TH surdo /θ/',          hint: 'TH em "think": língua entre os dentes.' },
      { id: 'b702', english: 'I need help.',      portuguese: 'Eu preciso de ajuda.', level: 'beginner', category: 'daily',   phonetic: 'ái níid hélp',       sound: 'Vogal /iː/ + H',        hint: '"Need" longa. "Help" com H.' },
      { id: 'b703', english: "I don't know.",     portuguese: 'Eu não sei.',       level: 'beginner', category: 'daily',     phonetic: 'ái dôunt nôu',       sound: 'Ditongo /oʊ/ repetido', hint: '"Don\'t" e "know" têm o mesmo ditongo.' },
      { id: 'b704', english: 'I like it.',        portuguese: 'Eu gosto disso.',   level: 'beginner', category: 'daily',     phonetic: 'ái láik ít',         sound: 'Ditongo /aɪ/',          hint: '"Like" = /laɪk/ — ditongo "láik".' },
      { id: 'b705', english: 'How are you?',      portuguese: 'Como você está?',   level: 'beginner', category: 'questions', phonetic: 'ráu ár iu',          sound: 'H + ditongo /aʊ/',      hint: '"How" = /haʊ/ — H aspirado + ditongo.' },
    ],
  },

  {
    blockNumber: 8, totalBlocks: TOTAL,
    missionInfo: { name: 'Frases Úteis 2', emoji: '💪', level: 'beginner' },
    phrases: [
      { id: 'b801', english: "I'm fine, thanks.",      portuguese: 'Estou bem, obrigado.',    level: 'beginner', category: 'daily',     phonetic: 'áim fáin thênks',      sound: 'Ditongo /aɪ/ + TH', hint: '"Fine" = /faɪn/. "Thanks" com TH.' },
      { id: 'b802', english: "What's your name?",      portuguese: 'Qual é o seu nome?',      level: 'beginner', category: 'questions', phonetic: 'uáts iur nêim',        sound: 'W + /j/',           hint: '"What\'s" = W com lábios. "Your" começa com Y.' },
      { id: 'b803', english: "I don't understand.",    portuguese: 'Eu não entendo.',         level: 'beginner', category: 'daily',     phonetic: 'ái dôunt ândêrstænd',  sound: 'Cluster /nd/ final', hint: '"Understand" termina com /nd/.' },
      { id: 'b804', english: 'Can you help me?',       portuguese: 'Você pode me ajudar?',   level: 'beginner', category: 'questions', phonetic: 'kæn iu hélp mi',       sound: '/æ/ aberto',        hint: '"Can" = /kæn/ — A aberto, boca larga.' },
      { id: 'b805', english: 'See you later!',         portuguese: 'Até mais!',               level: 'beginner', category: 'daily',     phonetic: 'síi iu lêitêr',        sound: 'Vogal /iː/ + ditongo /eɪ/', hint: '"See" longa. "Later" = /leɪtər/.' },
    ],
  },

  {
    blockNumber: 9, totalBlocks: TOTAL,
    missionInfo: { name: 'No Cotidiano', emoji: '☀️', level: 'beginner' },
    phrases: [
      { id: 'b901', english: 'Can I help you?',      portuguese: 'Posso te ajudar?',             level: 'beginner', category: 'daily', phonetic: 'kæn ái hélp iu',    sound: '/æ/ + H',           hint: '"Can" = /kæn/. "Help" com H aspirado.' },
      { id: 'b902', english: 'Excuse me.',           portuguese: 'Com licença.',                  level: 'beginner', category: 'daily', phonetic: 'êkskiúz mi',        sound: '/j/ em "cuse"',     hint: '"Excuse" = /ɪkˈskjuːz/ — o U vira /juː/.' },
      { id: 'b903', english: "I'm not sure.",        portuguese: 'Não tenho certeza.',            level: 'beginner', category: 'daily', phonetic: 'áim nót xúr',       sound: 'SH + R americano',  hint: '"Sure" = /ʃʊr/ — SH + R americano.' },
      { id: 'b904', english: "That's right.",        portuguese: 'É isso mesmo.',                 level: 'beginner', category: 'daily', phonetic: 'ðæts ráit',         sound: 'TH sonoro /ð/',     hint: '"That\'s" — TH sonoro: língua + voz.' },
      { id: 'b905', english: 'One moment, please.',  portuguese: 'Um momento, por favor.',        level: 'beginner', category: 'daily', phonetic: 'uân mômênt plíiz',  sound: 'W + vogal longa',   hint: '"One" = /wʌn/. "Please" = plíiiz.' },
    ],
  },

  {
    blockNumber: 10, totalBlocks: TOTAL,
    missionInfo: { name: 'Aprendendo Inglês', emoji: '🎯', level: 'beginner' },
    phrases: [
      { id: 'ba01', english: 'I can do it.',         portuguese: 'Eu consigo fazer.',           level: 'beginner', category: 'daily', phonetic: 'ái kæn dú ít',      sound: '/æ/ + /uː/',              hint: '"Can" = /kæn/. "Do" = /duː/ — UU longo.' },
      { id: 'ba02', english: 'Let me try.',          portuguese: 'Deixa eu tentar.',            level: 'beginner', category: 'daily', phonetic: 'lét mi trái',        sound: 'Cluster /tr/ + ditongo',  hint: '"Try" = /traɪ/ — TR direto + ditongo.' },
      { id: 'ba03', english: "I'm learning.",        portuguese: 'Estou aprendendo.',           level: 'beginner', category: 'daily', phonetic: 'áim lérning',        sound: 'R + cluster /rn/',        hint: '"Learning" = /lɜːrnɪŋ/ — R americano.' },
      { id: 'ba04', english: 'Speak slowly, please.',portuguese: 'Fale devagar, por favor.',   level: 'beginner', category: 'daily', phonetic: 'spíik slôuli plíiz', sound: 'Vogal /iː/ + /l/',        hint: '"Speak" e "slowly" — pratique devagar.' },
      { id: 'ba05', english: "I'm a beginner.",      portuguese: 'Sou iniciante.',              level: 'beginner', category: 'daily', phonetic: 'áim ê biguínêr',     sound: '/ɪ/ + R final',           hint: '"Beginner" = /bɪˈɡɪnər/ — dois /ɪ/ + R.' },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // MISSÕES 11–22 — 4 Conversas × 4 Falas por Missão (blocos 11–58)
  // ══════════════════════════════════════════════════════════════════════════

  // ── Primeiro Contato (blocos 11–14) ──────────────────────────────────
  {
    blockNumber: 11, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Primeiro Contato', missionGroupEmoji: '🤝', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'Primeiro Contato · C1', emoji: '🤝', level: 'beginner' },
    phrases: [
      { id: 'c11_1', english: 'Hi! How are you?',            portuguese: 'Oi! Como você está?',          level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'hái ráu ár iu' },
      { id: 'c11_2', english: "I'm fine, thanks! And you?",  portuguese: 'Estou bem, obrigado! E você?', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'áim fáin thænks ænd iu' },
      { id: 'c11_3', english: "I'm great! Nice to see you.", portuguese: 'Estou ótimo! Bom te ver.',     level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'áim grêit náis tu síi iu' },
      { id: 'c11_4', english: 'Nice to see you too!',        portuguese: 'Bom te ver também!',           level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'náis tu síi iu túu' },
    ],
  },
  {
    blockNumber: 12, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Primeiro Contato', missionGroupEmoji: '🤝', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'Primeiro Contato · C2', emoji: '🤝', level: 'beginner' },
    phrases: [
      { id: 'c12_1', english: 'Hey! How was your day?',          portuguese: 'Ei! Como foi seu dia?',             level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'hêi ráu uóz iur dêi' },
      { id: 'c12_2', english: 'It was great! Very busy though.',  portuguese: 'Foi ótimo! Mas muito agitado.',     level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ít uóz grêit véri bízi ðôu' },
      { id: 'c12_3', english: 'I know! Mine was busy too.',       portuguese: 'Eu sei! O meu também foi corrido.', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái nôu máin uóz bízi túu' },
      { id: 'c12_4', english: "Well, let's relax now!",           portuguese: 'Bom, vamos relaxar agora!',         level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'uél léts rilæks náu' },
    ],
  },
  {
    blockNumber: 13, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Primeiro Contato', missionGroupEmoji: '🤝', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'Primeiro Contato · C3', emoji: '🤝', level: 'beginner' },
    phrases: [
      { id: 'c13_1', english: "Hi! I don't think we've met.",      portuguese: 'Oi! Acho que não nos conhecemos.',  level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'hái ái dôunt thínk uív mét' },
      { id: 'c13_2', english: "No, we haven't. I'm Laura.",        portuguese: 'Não mesmo. Eu sou Laura.',          level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'nôu uí hævnt áim lóra' },
      { id: 'c13_3', english: "Nice to meet you, Laura! I'm Tom.", portuguese: 'Prazer, Laura! Eu sou Tom.',        level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'náis tu míit iu lóra áim tóm' },
      { id: 'c13_4', english: 'Great to meet you, Tom!',           portuguese: 'Ótimo te conhecer, Tom!',           level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'grêit tu míit iu tóm' },
    ],
  },
  {
    blockNumber: 14, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Primeiro Contato', missionGroupEmoji: '🤝', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'Primeiro Contato · C4', emoji: '🤝', level: 'beginner' },
    phrases: [
      { id: 'c14_1', english: "Oh, hi! I haven't seen you in a while!", portuguese: 'Oh, oi! Faz tempo que não te vejo!', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ôu hái ái hævnt síin iu ín ê uáil' },
      { id: 'c14_2', english: 'I know! How have you been?',             portuguese: 'Eu sei! Como você está?',            level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ái nôu ráu hæv iu bín' },
      { id: 'c14_3', english: 'Really well, thanks! And you?',          portuguese: 'Muito bem, obrigado! E você?',       level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ríili uél thænks ænd iu' },
      { id: 'c14_4', english: 'Never better! Great to see you!',        portuguese: 'Nunca tão bem! Ótimo te ver!',       level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'néver bétêr grêit tu síi iu' },
    ],
  },

  // ── Apresentações (blocos 15–18) ─────────────────────────────────────
  {
    blockNumber: 15, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Apresentações', missionGroupEmoji: '🙋', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'Apresentações · C1', emoji: '🙋', level: 'beginner' },
    phrases: [
      { id: 'c15_1', english: "What's your name?",               portuguese: 'Qual é o seu nome?',       level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'uáts iur nêim' },
      { id: 'c15_2', english: 'My name is Ana. What about you?', portuguese: 'Meu nome é Ana. E o seu?', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'mái nêim iz æna uát êbáut iu' },
      { id: 'c15_3', english: "I'm Carlos. Nice to meet you!",   portuguese: 'Sou Carlos. Prazer!',      level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'áim kárlos náis tu míit iu' },
      { id: 'c15_4', english: 'Nice to meet you too, Carlos!',   portuguese: 'Prazer também, Carlos!',   level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'náis tu míit iu túu kárlos' },
    ],
  },
  {
    blockNumber: 16, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Apresentações', missionGroupEmoji: '🙋', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'Apresentações · C2', emoji: '🙋', level: 'beginner' },
    phrases: [
      { id: 'c16_1', english: "Hi! I don't know many people here. I'm Sara.", portuguese: "Oi! Não conheço muita gente aqui. Sou Sara.", level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'hái ái dôunt nôu méni pípêl hír áim særa' },
      { id: 'c16_2', english: "Hi Sara! Welcome! I'm the host, Mike.",        portuguese: 'Oi Sara! Bem-vinda! Sou o anfitrião, Mike.', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'hái særa uélkêm áim ðê hôust máik' },
      { id: 'c16_3', english: "It's a great party, Mike!",                    portuguese: 'É uma festa ótima, Mike!',                  level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'íts ê grêit párti máik' },
      { id: 'c16_4', english: "Thank you! I hope you enjoy it!",              portuguese: 'Obrigado! Espero que você curta!',           level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'thænk iu ái hôup iu êndjói ít' },
    ],
  },
  {
    blockNumber: 17, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Apresentações', missionGroupEmoji: '🙋', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'Apresentações · C3', emoji: '🙋', level: 'beginner' },
    phrases: [
      { id: 'c17_1', english: 'Allow me to introduce myself. I am Dr. Silva.', portuguese: 'Permita-me me apresentar. Sou o Dr. Silva.',  level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êláu mi tu íntrêdiús máisélf ái æm dóktêr sílva' },
      { id: 'c17_2', english: 'Nice to meet you, Dr. Silva. I am James White.', portuguese: 'Prazer, Dr. Silva. Sou James White.',        level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'náis tu míit iu dóktêr sílva ái æm djêimz uáit' },
      { id: 'c17_3', english: 'The pleasure is mine, Mr. White.',              portuguese: 'O prazer é meu, Sr. White.',                  level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ðê plézêr iz máin místêr uáit' },
      { id: 'c17_4', english: 'Please, call me James.',                        portuguese: 'Por favor, me chame de James.',               level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'plíiz kól mi djêimz' },
    ],
  },
  {
    blockNumber: 18, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Apresentações', missionGroupEmoji: '🙋', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'Apresentações · C4', emoji: '🙋', level: 'beginner' },
    phrases: [
      { id: 'c18_1', english: 'John, this is my friend Maria.',       portuguese: 'John, essa é minha amiga Maria.',     level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'djón ðís iz mái frend mêría' },
      { id: 'c18_2', english: 'Hi Maria! Nice to meet you!',          portuguese: 'Oi Maria! Prazer em te conhecer!',    level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'hái mêría náis tu míit iu' },
      { id: 'c18_3', english: 'Maria is from Brazil.',                portuguese: 'Maria é do Brasil.',                  level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'mêría iz from brêzíl' },
      { id: 'c18_4', english: 'Oh, wonderful! Welcome to the team!', portuguese: 'Oh, que incrível! Bem-vinda à equipe!', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôu uânderful uélkêm tu ðê tíim' },
    ],
  },

  // ── Pedindo Ajuda (blocos 19–22) ─────────────────────────────────────
  {
    blockNumber: 19, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Ajuda', missionGroupEmoji: '🙏', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'Pedindo Ajuda · C1', emoji: '🙏', level: 'beginner' },
    phrases: [
      { id: 'c19_1', english: 'Excuse me. Can you help me?',               portuguese: 'Com licença. Você pode me ajudar?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êkskiúz mi kæn iu hélp mi' },
      { id: 'c19_2', english: 'Of course! What do you need?',              portuguese: 'Claro! O que você precisa?',        level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs uát du iu níid' },
      { id: 'c19_3', english: "I don't understand this. Can you explain?", portuguese: 'Não entendo isso. Pode explicar?',  level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái dôunt ândêrstænd ðís kæn iu êksplêin' },
      { id: 'c19_4', english: 'No problem! I can explain it.',              portuguese: 'Sem problema! Posso explicar.',     level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'nô próblêm ái kæn êksplêin ít' },
    ],
  },
  {
    blockNumber: 20, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Ajuda', missionGroupEmoji: '🙏', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'Pedindo Ajuda · C2', emoji: '🙏', level: 'beginner' },
    phrases: [
      { id: 'c20_1', english: 'Excuse me, teacher. Can I ask a question?', portuguese: 'Com licença, professor. Posso perguntar?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êkskiúz mi títchêr kæn ái æsk ê kuéschên' },
      { id: 'c20_2', english: 'Of course! What would you like to know?',   portuguese: 'Claro! O que você gostaria de saber?',     level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs uát uud iu láik tu nôu' },
      { id: 'c20_3', english: "I don't understand question three.",         portuguese: 'Não entendo a questão três.',                level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái dôunt ândêrstænd kuéschên thrí' },
      { id: 'c20_4', english: 'No problem. Let me explain it again.',       portuguese: 'Sem problema. Deixa eu explicar de novo.',   level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'nô próblêm lét mi êksplêin ít êgén' },
    ],
  },
  {
    blockNumber: 21, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Ajuda', missionGroupEmoji: '🙏', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'Pedindo Ajuda · C3', emoji: '🙏', level: 'beginner' },
    phrases: [
      { id: 'c21_1', english: 'Hi! I need some help with my computer.',   portuguese: 'Oi! Preciso de ajuda com meu computador.',   level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'hái ái níid sâm hélp uíth mái kêmpiútêr' },
      { id: 'c21_2', english: "Sure! What's the problem?",                portuguese: 'Claro! Qual é o problema?',                   level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'xúr uáts ðê próblêm' },
      { id: 'c21_3', english: "I can't open this file. Can you help me?", portuguese: 'Não consigo abrir esse arquivo. Pode ajudar?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái kænt ôupên ðís fáil kæn iu hélp mi' },
      { id: 'c21_4', english: "Let me take a look. I'll fix it for you.", portuguese: 'Deixa eu olhar. Vou resolver para você.',      level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'lét mi têik ê luk áil fíks ít fôr iu' },
    ],
  },
  {
    blockNumber: 22, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Ajuda', missionGroupEmoji: '🙏', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'Pedindo Ajuda · C4', emoji: '🙏', level: 'beginner' },
    phrases: [
      { id: 'c22_1', english: 'Excuse me, can you do me a favor?',    portuguese: 'Com licença, pode me fazer um favor?',     level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êkskiúz mi kæn iu du mi ê fêivêr' },
      { id: 'c22_2', english: "Sure, what do you need?",              portuguese: 'Claro, o que você precisa?',               level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'xúr uát du iu níid' },
      { id: 'c22_3', english: 'Can you take a photo of us, please?',  portuguese: 'Pode tirar uma foto da gente, por favor?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'kæn iu têik ê fôutôu ôv âs plíiz' },
      { id: 'c22_4', english: 'Of course! Just say "cheese"!',        portuguese: 'Claro! É só falar "cheese"!',              level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs djâst sêi tchiiz' },
    ],
  },

  // ── No Café (blocos 23–26) ───────────────────────────────────────────
  {
    blockNumber: 23, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Café', missionGroupEmoji: '☕', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'No Café · C1', emoji: '☕', level: 'beginner' },
    phrases: [
      { id: 'c23_1', english: 'Good morning! Can I have a coffee, please?', portuguese: 'Bom dia! Pode me trazer um café, por favor?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'gud mórnin kæn ái hæv ê kófi plíiz' },
      { id: 'c23_2', english: 'Of course! Small or large?',                  portuguese: 'Claro! Pequeno ou grande?',                   level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs smól ôr lárj' },
      { id: 'c23_3', english: 'Large, please. How much is it?',              portuguese: 'Grande, por favor. Quanto custa?',            level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'lárj plíiz ráu mâtch iz ít' },
      { id: 'c23_4', english: "It's three dollars. Here you go!",            portuguese: 'São três dólares. Aqui está!',                level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'íts thrí dólêrz hír iu gôu' },
    ],
  },
  {
    blockNumber: 24, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Café', missionGroupEmoji: '☕', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'No Café · C2', emoji: '☕', level: 'beginner' },
    phrases: [
      { id: 'c24_1', english: 'What do you recommend today?',         portuguese: 'O que você recomenda hoje?',           level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'uát du iu rêkêménd tudêi' },
      { id: 'c24_2', english: 'Our chocolate cake is amazing!',       portuguese: 'Nosso bolo de chocolate está incrível!', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'áur tchókêlêt kêik iz êméizing' },
      { id: 'c24_3', english: "That sounds great! I'll have one.",    portuguese: 'Parece ótimo! Vou querer um.',          level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ðæt sáundz grêit áil hæv uân' },
      { id: 'c24_4', english: 'Excellent choice! Anything to drink?', portuguese: 'Excelente escolha! Algo para beber?',  level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'êksêlênt tchóis énithing tu drink' },
    ],
  },
  {
    blockNumber: 25, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Café', missionGroupEmoji: '☕', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'No Café · C3', emoji: '☕', level: 'beginner' },
    phrases: [
      { id: 'c25_1', english: 'Excuse me, can I have the bill, please?', portuguese: 'Com licença, pode trazer a conta, por favor?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êkskiúz mi kæn ái hæv ðê bíl plíiz' },
      { id: 'c25_2', english: "Of course! That's five dollars fifty.",   portuguese: 'Claro! São cinco dólares e cinquenta.',        level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs ðæts fáiv dólêrz fífti' },
      { id: 'c25_3', english: "Here's ten dollars. Keep the change.",    portuguese: 'Aqui estão dez dólares. Fique com o troco.',   level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'hírz tén dólêrz kíip ðê tchêindj' },
      { id: 'c25_4', english: 'Thank you so much! Have a great day!',   portuguese: 'Muito obrigado! Tenha um ótimo dia!',          level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'thænk iu sôu mâtch hæv ê grêit dêi' },
    ],
  },
  {
    blockNumber: 26, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Café', missionGroupEmoji: '☕', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'No Café · C4', emoji: '☕', level: 'beginner' },
    phrases: [
      { id: 'c26_1', english: 'Hi! Can I get a latte to go?',            portuguese: 'Oi! Pode me dar um latte para viagem?',        level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'hái kæn ái gét ê lætêi tu gôu' },
      { id: 'c26_2', english: 'Sure! What size would you like?',          portuguese: 'Claro! Qual tamanho você quer?',               level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'xúr uát sáiz uud iu láik' },
      { id: 'c26_3', english: 'Medium, please. Can I add an extra shot?', portuguese: 'Médio, por favor. Posso adicionar um shot?',   level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'mídiêm plíiz kæn ái æd ên éxtrê xót' },
      { id: 'c26_4', english: "Of course! It'll be ready in two minutes.", portuguese: 'Claro! Estará pronto em dois minutos.',       level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs ítêl bí rédi ín túu mínêts' },
    ],
  },

  // ── Pedindo Direções (blocos 27–30) ──────────────────────────────────
  {
    blockNumber: 27, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Direções', missionGroupEmoji: '🗺️', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'Pedindo Direções · C1', emoji: '🗺️', level: 'beginner' },
    phrases: [
      { id: 'c27_1', english: 'Excuse me. Where is the bathroom?',    portuguese: 'Com licença. Onde fica o banheiro?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êkskiúz mi uér iz ðê bæthrum' },
      { id: 'c27_2', english: "It's on the right, next to the door.", portuguese: 'É à direita, ao lado da porta.',     level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'íts ón ðê ráit nékst tu ðê dôr' },
      { id: 'c27_3', english: 'Thank you so much!',                   portuguese: 'Muito obrigado!',                    level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'thænk iu sôu mâtch' },
      { id: 'c27_4', english: "You're welcome! No problem.",          portuguese: 'De nada! Sem problema.',             level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'iur uélkêm nô próblêm' },
    ],
  },
  {
    blockNumber: 28, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Direções', missionGroupEmoji: '🗺️', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'Pedindo Direções · C2', emoji: '🗺️', level: 'beginner' },
    phrases: [
      { id: 'c28_1', english: 'Excuse me, is the subway station far?',       portuguese: 'Com licença, a estação de metrô é longe?',  level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êkskiúz mi iz ðê sâbuêi stêiShên fár' },
      { id: 'c28_2', english: "No, it's just two blocks from here.",          portuguese: 'Não, são só dois quarteirões daqui.',         level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'nôu íts djâst túu blóks frêm hír' },
      { id: 'c28_3', english: 'Should I turn left or right?',                 portuguese: 'Devo virar à esquerda ou à direita?',         level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'xud ái têrn léft ôr ráit' },
      { id: 'c28_4', english: "Turn left at the traffic light. You'll see it.", portuguese: 'Vire à esquerda no semáforo. Você vai ver.', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'têrn léft æt ðê træfik láit iúl síi ít' },
    ],
  },
  {
    blockNumber: 29, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Direções', missionGroupEmoji: '🗺️', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'Pedindo Direções · C3', emoji: '🗺️', level: 'beginner' },
    phrases: [
      { id: 'c29_1', english: "Excuse me, I'm looking for the Grand Hotel.",  portuguese: 'Com licença, estou procurando o Grand Hotel.', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êkskiúz mi áim lúking fôr ðê grænd hôutél' },
      { id: 'c29_2', english: "It's on Main Street, about ten minutes away.", portuguese: 'Fica na Rua Principal, a uns dez minutos.',     level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'íts ón mêin stríit êbáut tén mínêts êuêi' },
      { id: 'c29_3', english: 'Can I walk there or should I take a taxi?',    portuguese: 'Posso ir a pé ou devo pegar um táxi?',          level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'kæn ái uók ðér ôr xud ái têik ê tæksi' },
      { id: 'c29_4', english: "You can walk! It's a nice route.",             portuguese: 'Pode ir a pé! É um caminho agradável.',         level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'iu kæn uók íts ê náis rúut' },
    ],
  },
  {
    blockNumber: 30, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Direções', missionGroupEmoji: '🗺️', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'Pedindo Direções · C4', emoji: '🗺️', level: 'beginner' },
    phrases: [
      { id: 'c30_1', english: "I think I'm lost. Can you help me?",          portuguese: 'Acho que estou perdido. Pode me ajudar?',   level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái thínk áim lóst kæn iu hélp mi' },
      { id: 'c30_2', english: "Sure! Where are you trying to go?",           portuguese: 'Claro! Para onde você está tentando ir?',    level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'xúr uér ár iu tráiing tu gôu' },
      { id: 'c30_3', english: "I'm looking for the city center.",            portuguese: 'Estou procurando o centro da cidade.',       level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'áim lúking fôr ðê síti séntêr' },
      { id: 'c30_4', english: "Go straight ahead, then turn right. It's easy!", portuguese: 'Vá em frente, depois vire à direita. É fácil!', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'gôu strêit êhéd ðén têrn ráit íts íizi' },
    ],
  },

  // ── No Trabalho (blocos 31–34) ────────────────────────────────────────
  {
    blockNumber: 31, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Trabalho', missionGroupEmoji: '💼', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'No Trabalho · C1', emoji: '💼', level: 'beginner' },
    phrases: [
      { id: 'c31_1', english: 'Good morning. Are you ready for the meeting?', portuguese: 'Bom dia. Está pronto para a reunião?', level: 'beginner', category: 'work', speaker: 'A', phonetic: 'gud mórnin ár iu rédi fôr ðê míiting' },
      { id: 'c31_2', english: 'Yes! What time does it start?',                portuguese: 'Sim! Que horas começa?',               level: 'beginner', category: 'work', speaker: 'B', phonetic: 'iéss uát táim dâz ít stárt' },
      { id: 'c31_3', english: 'It starts at nine. See you there!',            portuguese: 'Começa às nove. Te vejo lá!',          level: 'beginner', category: 'work', speaker: 'A', phonetic: 'ít stárts æt náin síi iu ðér' },
      { id: 'c31_4', english: 'Great! See you in a few minutes.',             portuguese: 'Ótimo! Te vejo em alguns minutos.',    level: 'beginner', category: 'work', speaker: 'B', phonetic: 'grêit síi iu ín ê fiú mínêts' },
    ],
  },
  {
    blockNumber: 32, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Trabalho', missionGroupEmoji: '💼', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'No Trabalho · C2', emoji: '💼', level: 'beginner' },
    phrases: [
      { id: 'c32_1', english: 'When is the deadline for this project?',  portuguese: 'Quando é o prazo para este projeto?',     level: 'beginner', category: 'work', speaker: 'A', phonetic: 'uén iz ðê dédláin fôr ðís pródjêkt' },
      { id: 'c32_2', english: "It's on Friday. Can you finish by then?", portuguese: 'É na sexta. Você consegue terminar?',     level: 'beginner', category: 'work', speaker: 'B', phonetic: 'íts ón fráidêi kæn iu fíniSh bái ðén' },
      { id: 'c32_3', english: "I think so. I'll need two more days.",    portuguese: 'Acho que sim. Preciso de mais dois dias.', level: 'beginner', category: 'work', speaker: 'A', phonetic: 'ái thínk sôu áil níid túu môr dêiz' },
      { id: 'c32_4', english: "Okay! Let me know if you need help.",     portuguese: 'Ok! Me avise se precisar de ajuda.',      level: 'beginner', category: 'work', speaker: 'B', phonetic: 'ôkêi lét mi nôu íf iu níid hélp' },
    ],
  },
  {
    blockNumber: 33, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Trabalho', missionGroupEmoji: '💼', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'No Trabalho · C3', emoji: '💼', level: 'beginner' },
    phrases: [
      { id: 'c33_1', english: 'Can I show you my report?',                 portuguese: 'Posso te mostrar meu relatório?',        level: 'beginner', category: 'work', speaker: 'A', phonetic: 'kæn ái Shôu iu mái ripórt' },
      { id: 'c33_2', english: "Sure! Let me take a look.",                  portuguese: 'Claro! Deixa eu dar uma olhada.',        level: 'beginner', category: 'work', speaker: 'B', phonetic: 'xúr lét mi têik ê luk' },
      { id: 'c33_3', english: "I want to know if I'm on the right track.",  portuguese: 'Quero saber se estou no caminho certo.', level: 'beginner', category: 'work', speaker: 'A', phonetic: 'ái uónt tu nôu íf áim ón ðê ráit træk' },
      { id: 'c33_4', english: 'Looks great! Just fix the last section.',    portuguese: 'Está ótimo! Só corrija a última seção.', level: 'beginner', category: 'work', speaker: 'B', phonetic: 'luks grêit djâst fíks ðê læst sékShên' },
    ],
  },
  {
    blockNumber: 34, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Trabalho', missionGroupEmoji: '💼', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'No Trabalho · C4', emoji: '💼', level: 'beginner' },
    phrases: [
      { id: 'c34_1', english: "I'm heading home now. See you tomorrow!",     portuguese: 'Estou indo para casa agora. Te vejo amanhã!', level: 'beginner', category: 'work', speaker: 'A', phonetic: 'áim héding hôum náu síi iu têmórôu' },
      { id: 'c34_2', english: "Have a good evening! Don't forget the report.", portuguese: 'Boa noite! Não esqueça o relatório.',        level: 'beginner', category: 'work', speaker: 'B', phonetic: 'hæv ê gud ívning dôunt fêrgét ðê ripórt' },
      { id: 'c34_3', english: 'I already sent it to you by email.',           portuguese: 'Já te enviei por e-mail.',                    level: 'beginner', category: 'work', speaker: 'A', phonetic: 'ái ólrédi sémt ít tu iu bái íimêil' },
      { id: 'c34_4', english: 'Perfect! Have a great night then!',            portuguese: 'Perfeito! Boa noite então!',                  level: 'beginner', category: 'work', speaker: 'B', phonetic: 'pêrfêkt hæv ê grêit náit ðén' },
    ],
  },

  // ── Pedindo Repetição (blocos 35–38) ─────────────────────────────────
  {
    blockNumber: 35, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Repetição', missionGroupEmoji: '🔄', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'Pedindo Repetição · C1', emoji: '🔄', level: 'beginner' },
    phrases: [
      { id: 'c35_1', english: 'Can you say that again, please?',             portuguese: 'Pode repetir, por favor?',              level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'kæn iu sêi ðæt êgén plíiz' },
      { id: 'c35_2', english: 'Of course. I said: the class is at eight.',   portuguese: 'Claro. Eu disse: a aula é às oito.',    level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs ái séd ðê klæs iz æt êit' },
      { id: 'c35_3', english: 'Can you speak more slowly, please?',          portuguese: 'Pode falar mais devagar, por favor?',   level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'kæn iu spíik môr slôuli plíiz' },
      { id: 'c35_4', english: 'Sure! The class is at eight in the morning.', portuguese: 'Claro! A aula é às oito da manhã.',     level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'xúr ðê klæs iz æt êit ín ðê mórnin' },
    ],
  },
  {
    blockNumber: 36, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Repetição', missionGroupEmoji: '🔄', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'Pedindo Repetição · C2', emoji: '🔄', level: 'beginner' },
    phrases: [
      { id: 'c36_1', english: "Sorry, I didn't catch that. Can you repeat?",  portuguese: 'Desculpe, não entendi. Pode repetir?',        level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'sóri ái dídnt kætch ðæt kæn iu ripíit' },
      { id: 'c36_2', english: 'Of course! I said the meeting is cancelled.',   portuguese: 'Claro! Eu disse que a reunião foi cancelada.', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs ái séd ðê míiting iz kænsêld' },
      { id: 'c36_3', english: "Oh no! When will it be rescheduled?",           portuguese: 'Oh não! Quando será reagendada?',              level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ôu nôu uén uíl ít bí riSkédjuld' },
      { id: 'c36_4', english: "We don't know yet. I'll send you an email.",    portuguese: 'Ainda não sabemos. Vou te enviar um e-mail.', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'uí dôunt nôu iét áil sénd iu ên íimêil' },
    ],
  },
  {
    blockNumber: 37, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Repetição', missionGroupEmoji: '🔄', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'Pedindo Repetição · C3', emoji: '🔄', level: 'beginner' },
    phrases: [
      { id: 'c37_1', english: "Could you please speak up? I can't hear you.", portuguese: 'Pode falar mais alto? Não estou ouvindo.',    level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'kud iu plíiz spíik âp ái kænt hír iu' },
      { id: 'c37_2', english: "Sorry! Can everyone hear me now?",              portuguese: 'Desculpe! Todo mundo está me ouvindo agora?', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'sóri kæn évriwân hír mi náu' },
      { id: 'c37_3', english: "Yes, much better! Thank you.",                  portuguese: 'Sim, muito melhor! Obrigado.',                level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'iéss mâtch bétêr thænk iu' },
      { id: 'c37_4', english: "Great! Let me continue the lesson.",            portuguese: 'Ótimo! Vou continuar a aula.',                level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'grêit lét mi kêntíniú ðê lésên' },
    ],
  },
  {
    blockNumber: 38, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Pedindo Repetição', missionGroupEmoji: '🔄', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'Pedindo Repetição · C4', emoji: '🔄', level: 'beginner' },
    phrases: [
      { id: 'c38_1', english: "Sorry, I don't understand. Can you say it differently?", portuguese: 'Desculpe, não entendi. Pode dizer de outro jeito?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'sóri ái dôunt ândêrstænd kæn iu sêi ít dífêrêntli' },
      { id: 'c38_2', english: "Of course! Let me try again.",                            portuguese: 'Claro! Vou tentar de novo.',                       level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs lét mi trái êgén' },
      { id: 'c38_3', english: "Thank you. I think I understand now.",                    portuguese: 'Obrigado. Acho que entendi agora.',                level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'thænk iu ái thínk ái ândêrstænd náu' },
      { id: 'c38_4', english: "Perfect! Let me know if you have more questions.",        portuguese: 'Perfeito! Me avise se tiver mais dúvidas.',        level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'pêrfêkt lét mi nôu íf iu hæv môr kuéstiênz' },
    ],
  },

  // ── Compras (blocos 39–42) ────────────────────────────────────────────
  {
    blockNumber: 39, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Compras', missionGroupEmoji: '🛍️', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'Compras · C1', emoji: '🛍️', level: 'beginner' },
    phrases: [
      { id: 'c39_1', english: 'How much is this shirt?',               portuguese: 'Quanto custa essa camisa?',             level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ráu mâtch iz ðís Shêrt' },
      { id: 'c39_2', english: "It's twenty dollars. Do you like it?",  portuguese: 'São vinte dólares. Você gostou?',       level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'íts tuênti dólêrz du iu láik ít' },
      { id: 'c39_3', english: "Yes, I'll take it. Can I pay by card?", portuguese: 'Sim, vou levar. Posso pagar com cartão?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'iéss áil têik ít kæn ái pêi bái kard' },
      { id: 'c39_4', english: 'Yes, of course. Here is your receipt.', portuguese: 'Sim, claro. Aqui está seu recibo.',      level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'iéss ôv kórs hír iz iur risíit' },
    ],
  },
  {
    blockNumber: 40, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Compras', missionGroupEmoji: '🛍️', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'Compras · C2', emoji: '🛍️', level: 'beginner' },
    phrases: [
      { id: 'c40_1', english: 'Can I try this on, please?',                     portuguese: 'Posso experimentar isso, por favor?',       level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'kæn ái trái ðís ón plíiz' },
      { id: 'c40_2', english: 'Of course! The fitting room is over there.',      portuguese: 'Claro! O provador fica ali.',                level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs ðê fíting rúum iz ôuvêr ðér' },
      { id: 'c40_3', english: 'Thank you. Do you have this in a smaller size?',  portuguese: 'Obrigado. Tem isso em tamanho menor?',       level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'thænk iu du iu hæv ðís ín ê smólêr sáiz' },
      { id: 'c40_4', english: 'Let me check for you. One moment!',               portuguese: 'Deixa eu verificar para você. Um momento!',  level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'lét mi tchék fôr iu uân môumênt' },
    ],
  },
  {
    blockNumber: 41, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Compras', missionGroupEmoji: '🛍️', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'Compras · C3', emoji: '🛍️', level: 'beginner' },
    phrases: [
      { id: 'c41_1', english: 'Excuse me, do you have this in blue?',  portuguese: 'Com licença, tem isso em azul?',          level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êkskiúz mi du iu hæv ðís ín blúu' },
      { id: 'c41_2', english: 'Let me check. What size do you need?',  portuguese: 'Deixa eu verificar. Que tamanho precisa?', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'lét mi tchék uát sáiz du iu níid' },
      { id: 'c41_3', english: 'Size medium, please.',                  portuguese: 'Tamanho médio, por favor.',                level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'sáiz mídiêm plíiz' },
      { id: 'c41_4', english: 'Here you go! This just arrived today.', portuguese: 'Aqui está! Chegou hoje mesmo.',            level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'hír iu gôu ðís djâst êráivd tudêi' },
    ],
  },
  {
    blockNumber: 42, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Compras', missionGroupEmoji: '🛍️', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'Compras · C4', emoji: '🛍️', level: 'beginner' },
    phrases: [
      { id: 'c42_1', english: "I'd like to return this, please. It doesn't fit.", portuguese: "Gostaria de devolver isso. Não serve.",     level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'áid láik tu ritêrn ðís plíiz ít dâznt fít' },
      { id: 'c42_2', english: 'No problem! Do you have the receipt?',              portuguese: 'Sem problema! Tem o recibo?',               level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'nô próblêm du iu hæv ðê risíit' },
      { id: 'c42_3', english: 'Yes, here it is.',                                  portuguese: 'Sim, aqui está.',                          level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'iéss hír ít iz' },
      { id: 'c42_4', english: 'Thank you. Would you like a refund or an exchange?', portuguese: 'Obrigado. Prefere reembolso ou troca?',   level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'thænk iu uud iu láik ê ríifând ôr ên êkschêindj' },
    ],
  },

  // ── Saúde e Bem-Estar (blocos 43–46) ─────────────────────────────────
  {
    blockNumber: 43, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Saúde e Bem-Estar', missionGroupEmoji: '💊', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'Saúde e Bem-Estar · C1', emoji: '💊', level: 'beginner' },
    phrases: [
      { id: 'c43_1', english: "I don't feel well today.",              portuguese: 'Não estou me sentindo bem hoje.',           level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái dôunt fíil uél tudêi' },
      { id: 'c43_2', english: "I'm sorry. What's wrong?",             portuguese: 'Lamento. O que está errado?',               level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'áim sóri uáts rón' },
      { id: 'c43_3', english: 'I have a headache and I feel tired.',  portuguese: 'Estou com dor de cabeça e me sinto cansado.', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái hæv ê hédêik ænd ái fíil táiêrd' },
      { id: 'c43_4', english: 'You should rest and drink some water.', portuguese: 'Você deveria descansar e beber água.',      level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'iu xud rést ænd drink sâm uóter' },
    ],
  },
  {
    blockNumber: 44, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Saúde e Bem-Estar', missionGroupEmoji: '💊', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'Saúde e Bem-Estar · C2', emoji: '💊', level: 'beginner' },
    phrases: [
      { id: 'c44_1', english: "Hi! I have a bad cold. Can you help?",            portuguese: 'Oi! Estou com um resfriado forte. Pode ajudar?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'hái ái hæv ê bæd kôuld kæn iu hélp' },
      { id: 'c44_2', english: "Sure! How long have you had it?",                  portuguese: 'Claro! Há quanto tempo você está assim?',         level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'xúr ráu lón hæv iu hæd ít' },
      { id: 'c44_3', english: 'Since yesterday. I need something for the fever.', portuguese: 'Desde ontem. Preciso de algo para a febre.',      level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'síns iéstêrdêi ái níid sâmthíng fôr ðê fívêr' },
      { id: 'c44_4', english: 'Take this medicine twice a day.',                  portuguese: 'Tome este remédio duas vezes ao dia.',             level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'têik ðís médêsên tuáis ê dêi' },
    ],
  },
  {
    blockNumber: 45, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Saúde e Bem-Estar', missionGroupEmoji: '💊', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'Saúde e Bem-Estar · C3', emoji: '💊', level: 'beginner' },
    phrases: [
      { id: 'c45_1', english: 'I need to make an appointment with the doctor.', portuguese: 'Preciso marcar uma consulta com o médico.',    level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái níid tu mêik ên êpóintmênt uíth ðê dóktêr' },
      { id: 'c45_2', english: 'Of course. What day works for you?',             portuguese: 'Claro. Que dia funciona para você?',            level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs uát dêi uêrks fôr iu' },
      { id: 'c45_3', english: 'Is Wednesday afternoon available?',              portuguese: 'Tem vaga na tarde de quarta-feira?',            level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'iz uénzdêi æftêrnúun êvêilêbêl' },
      { id: 'c45_4', english: "Yes, three o'clock works. See you then!",        portuguese: 'Sim, às três horas funciona. Até lá!',          level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'iéss thrí êklók uêrks síi iu ðén' },
    ],
  },
  {
    blockNumber: 46, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Saúde e Bem-Estar', missionGroupEmoji: '💊', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'Saúde e Bem-Estar · C4', emoji: '💊', level: 'beginner' },
    phrases: [
      { id: 'c46_1', english: "I've been feeling very tired lately.",   portuguese: 'Tenho me sentido muito cansado ultimamente.', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'áiv bín fíiling véri táiêrd lêitli' },
      { id: 'c46_2', english: 'Are you sleeping enough?',               portuguese: 'Você está dormindo o suficiente?',             level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ár iu slíiping ênâf' },
      { id: 'c46_3', english: 'Not really. I sleep about five hours.',  portuguese: 'Não muito. Durmo umas cinco horas.',            level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'nót ríili ái slíip êbáut fáiv áuêrz' },
      { id: 'c46_4', english: 'Try to sleep eight hours. It will help a lot.', portuguese: 'Tente dormir oito horas. Vai ajudar muito.', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'trái tu slíip êit áuêrz ít uíl hélp ê lót' },
    ],
  },

  // ── No Restaurante (blocos 47–50) ────────────────────────────────────
  {
    blockNumber: 47, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Restaurante', missionGroupEmoji: '🍽️', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'No Restaurante · C1', emoji: '🍽️', level: 'beginner' },
    phrases: [
      { id: 'c47_1', english: 'Good evening. Table for two, please.',  portuguese: 'Boa noite. Mesa para dois, por favor.',  level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'gud ívning têibêl fôr túu plíiz' },
      { id: 'c47_2', english: 'Right this way! Here is the menu.',     portuguese: 'Por aqui! Aqui está o cardápio.',        level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ráit ðís uêi hír iz ðê méniu' },
      { id: 'c47_3', english: 'Thank you. What do you recommend?',     portuguese: 'Obrigado. O que você recomenda?',        level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'thænk iu uát du iu rêkêménd' },
      { id: 'c47_4', english: 'The pasta is very good today!',         portuguese: 'A massa está muito boa hoje!',           level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ðê pæstê iz véri gud tudêi' },
    ],
  },
  {
    blockNumber: 48, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Restaurante', missionGroupEmoji: '🍽️', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'No Restaurante · C2', emoji: '🍽️', level: 'beginner' },
    phrases: [
      { id: 'c48_1', english: "I'd like the grilled chicken, please.", portuguese: 'Gostaria do frango grelhado, por favor.',  level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'áid láik ðê grild tchíkên plíiz' },
      { id: 'c48_2', english: 'Excellent choice! And to drink?',       portuguese: 'Excelente escolha! E para beber?',        level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'êksêlênt tchóis ænd tu drink' },
      { id: 'c48_3', english: 'Just water, please.',                   portuguese: 'Só água, por favor.',                    level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'djâst uóter plíiz' },
      { id: 'c48_4', english: 'Still or sparkling?',                   portuguese: 'Com gás ou sem gás?',                    level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'stíl ôr spárkling' },
    ],
  },
  {
    blockNumber: 49, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Restaurante', missionGroupEmoji: '🍽️', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'No Restaurante · C3', emoji: '🍽️', level: 'beginner' },
    phrases: [
      { id: 'c49_1', english: 'Excuse me, my soup is cold.',                  portuguese: 'Com licença, minha sopa está fria.',          level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êkskiúz mi mái súup iz kôuld' },
      { id: 'c49_2', english: "I'm so sorry! I'll bring a new one right away.", portuguese: 'Muito desculpa! Vou trazer uma nova imediatamente.', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'áim sôu sóri áil bring ê niú uân ráit êuêi' },
      { id: 'c49_3', english: 'Thank you, I appreciate it.',                   portuguese: 'Obrigado, agradeço.',                        level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'thænk iu ái êpríiSiêit ít' },
      { id: 'c49_4', english: 'Of course! Can I get you anything else?',       portuguese: 'Claro! Posso trazer mais alguma coisa?',     level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs kæn ái gét iu énithing éls' },
    ],
  },
  {
    blockNumber: 50, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'No Restaurante', missionGroupEmoji: '🍽️', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'No Restaurante · C4', emoji: '🍽️', level: 'beginner' },
    phrases: [
      { id: 'c50_1', english: 'Excuse me, can we have the check, please?',  portuguese: 'Com licença, pode trazer a conta, por favor?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'êkskiúz mi kæn uí hæv ðê tchék plíiz' },
      { id: 'c50_2', english: 'Of course! Together or separate?',            portuguese: 'Claro! Juntas ou separadas?',                  level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôv kórs têgéðêr ôr sêpêrêt' },
      { id: 'c50_3', english: 'Together, please.',                           portuguese: 'Juntas, por favor.',                          level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'têgéðêr plíiz' },
      { id: 'c50_4', english: 'Here you go! Thank you for dining with us.',  portuguese: 'Aqui está! Obrigado por jantar conosco.',      level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'hír iu gôu thænk iu fôr dáining uíth âs' },
    ],
  },

  // ── Fazendo Planos (blocos 51–54) ────────────────────────────────────
  {
    blockNumber: 51, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Fazendo Planos', missionGroupEmoji: '📅', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'Fazendo Planos · C1', emoji: '📅', level: 'beginner' },
    phrases: [
      { id: 'c51_1', english: 'Are you free this weekend?',        portuguese: 'Você está livre este fim de semana?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ár iu frí ðís uíkend' },
      { id: 'c51_2', english: 'Yes! What are you planning?',       portuguese: 'Sim! O que você está planejando?',   level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'iéss uát ár iu plænin' },
      { id: 'c51_3', english: "Let's go to the park on Saturday.", portuguese: 'Vamos ao parque no sábado.',         level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'léts gôu tu ðê párk ón sætêrdêi' },
      { id: 'c51_4', english: "Sounds great! I'll be there.",      portuguese: 'Parece ótimo! Estarei lá.',          level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'sáundz grêit áil bí ðér' },
    ],
  },
  {
    blockNumber: 52, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Fazendo Planos', missionGroupEmoji: '📅', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'Fazendo Planos · C2', emoji: '📅', level: 'beginner' },
    phrases: [
      { id: 'c52_1', english: 'Have you thought about our summer vacation?', portuguese: 'Você pensou nas nossas férias de verão?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'hæv iu thót êbáut áur sâmêr vêkêiShên' },
      { id: 'c52_2', english: "Yes! I'd love to go to the beach.",           portuguese: 'Sim! Adoraria ir à praia.',               level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'iéss áid lâv tu gôu tu ðê bíitch' },
      { id: 'c52_3', english: "Perfect! Shall we go in July?",              portuguese: 'Perfeito! Vamos em julho?',               level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'pêrfêkt Shæl uí gôu ín djulái' },
      { id: 'c52_4', english: "July works great for me! Let's book it!",    portuguese: 'Julho é ótimo para mim! Vamos reservar!', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'djulái uêrks grêit fôr mi léts búk ít' },
    ],
  },
  {
    blockNumber: 53, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Fazendo Planos', missionGroupEmoji: '📅', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'Fazendo Planos · C3', emoji: '📅', level: 'beginner' },
    phrases: [
      { id: 'c53_1', english: 'When are you available for a meeting?',  portuguese: 'Quando você está disponível para uma reunião?', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'uén ár iu êvêilêbêl fôr ê míiting' },
      { id: 'c53_2', english: "I'm free on Tuesday afternoon.",          portuguese: 'Estou livre na terça-feira à tarde.',           level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'áim frí ón tiúzdêi æftêrnúun' },
      { id: 'c53_3', english: "How about two o'clock?",                 portuguese: 'Que tal às duas horas?',                        level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ráu êbáut túu êklók' },
      { id: 'c53_4', english: "Two o'clock works for me. See you then!", portuguese: 'Às duas está ótimo para mim. Até lá!',          level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'túu êklók uêrks fôr mi síi iu ðén' },
    ],
  },
  {
    blockNumber: 54, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Fazendo Planos', missionGroupEmoji: '📅', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'Fazendo Planos · C4', emoji: '📅', level: 'beginner' },
    phrases: [
      { id: 'c54_1', english: "I'm sorry, I have to cancel our plans.",      portuguese: 'Desculpe, tenho que cancelar nossos planos.', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'áim sóri ái hæv tu kænsêl áur plænz' },
      { id: 'c54_2', english: "Oh no! What happened?",                        portuguese: 'Oh não! O que aconteceu?',                    level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ôu nôu uát hæpênd' },
      { id: 'c54_3', english: "I have to work late on Friday.",               portuguese: 'Tenho que trabalhar até tarde na sexta.',     level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái hæv tu uêrk lêit ón fráidêi' },
      { id: 'c54_4', english: "No problem! Let's reschedule for next week.",  portuguese: 'Sem problema! Vamos remarcar para a próxima semana.', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'nô próblêm léts riSkédjul fôr nékst uíik' },
    ],
  },

  // ── Despedidas (blocos 55–58) ─────────────────────────────────────────
  {
    blockNumber: 55, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Despedidas', missionGroupEmoji: '🌈', conversationNumber: 1, totalConversations: 4,
    missionInfo: { name: 'Despedidas · C1', emoji: '🌈', level: 'beginner' },
    phrases: [
      { id: 'c55_1', english: "I have to go now. It was great talking to you!", portuguese: 'Preciso ir. Foi ótimo conversar!',          level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái hæv tu gôu náu ít uóz grêit tóking tu iu' },
      { id: 'c55_2', english: "Me too! Let's meet again soon.",                  portuguese: 'Eu também! Vamos nos encontrar em breve.', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'mi túu léts míit êgén súun' },
      { id: 'c55_3', english: 'Absolutely! Take care!',                          portuguese: 'Com certeza! Cuide-se!',                   level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'æbsêlútli têik kér' },
      { id: 'c55_4', english: 'You too! Goodbye!',                               portuguese: 'Você também! Tchau!',                     level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'iu túu gudbái' },
    ],
  },
  {
    blockNumber: 56, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Despedidas', missionGroupEmoji: '🌈', conversationNumber: 2, totalConversations: 4,
    missionInfo: { name: 'Despedidas · C2', emoji: '🌈', level: 'beginner' },
    phrases: [
      { id: 'c56_1', english: "Well, it's getting late. I should go.",  portuguese: 'Bem, está ficando tarde. Devo ir.',      level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'uél íts géting lêit ái Xud gôu' },
      { id: 'c56_2', english: "I know! It was so good to see you.",     portuguese: 'Eu sei! Foi tão bom te ver.',             level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ái nôu ít uóz sôu gud tu síi iu' },
      { id: 'c56_3', english: "Same here! We should do this more often.", portuguese: 'Também! Devemos fazer isso mais vezes.', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'sêim hír uí Xud du ðís môr óftên' },
      { id: 'c56_4', english: "Definitely! I'll call you next week.",   portuguese: 'Com certeza! Te ligo na próxima semana.', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'défênêtli áil kól iu nékst uíik' },
    ],
  },
  {
    blockNumber: 57, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Despedidas', missionGroupEmoji: '🌈', conversationNumber: 3, totalConversations: 4,
    missionInfo: { name: 'Despedidas · C3', emoji: '🌈', level: 'beginner' },
    phrases: [
      { id: 'c57_1', english: 'It was a pleasure working with you.',             portuguese: 'Foi um prazer trabalhar com você.',       level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ít uóz ê plézêr uêrking uíth iu' },
      { id: 'c57_2', english: 'The pleasure was mine. Thank you for everything.', portuguese: 'O prazer foi meu. Obrigado por tudo.',    level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'ðê plézêr uóz máin thænk iu fôr évrithíng' },
      { id: 'c57_3', english: 'I hope we can collaborate again in the future.',  portuguese: 'Espero que possamos colaborar de novo.',  level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ái hôup uí kæn kêlæbêrêit êgén ín ðê fiutchêr' },
      { id: 'c57_4', english: 'Me too! Best of luck with your next project.',    portuguese: 'Também! Boa sorte com seu próximo projeto.', level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'mi túu bést êv lâk uíth iur nékst pródjêkt' },
    ],
  },
  {
    blockNumber: 58, totalBlocks: TOTAL, dialogueMode: true,
    missionGroup: 'Despedidas', missionGroupEmoji: '🌈', conversationNumber: 4, totalConversations: 4,
    missionInfo: { name: 'Despedidas · C4', emoji: '🌈', level: 'beginner' },
    phrases: [
      { id: 'c58_1', english: "Okay, I really have to run! Talk later!",  portuguese: 'Ok, realmente tenho que ir! Falamos depois!', level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'ôkêi ái ríili hæv tu rân tók lêitêr' },
      { id: 'c58_2', english: "Sure! Have a safe trip!",                   portuguese: 'Claro! Boa viagem!',                          level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'Xúr hæv ê sêif trip' },
      { id: 'c58_3', english: "Thanks! I'll text you when I arrive.",      portuguese: 'Obrigado! Te mando mensagem quando chegar.',   level: 'beginner', category: 'daily', speaker: 'A', phonetic: 'thænks áil téxt iu uén ái êráiv' },
      { id: 'c58_4', english: "Sounds good! Take care!",                   portuguese: 'Ótimo! Se cuide!',                            level: 'beginner', category: 'daily', speaker: 'B', phonetic: 'sáundz gud têik kér' },
    ],
  },
];
