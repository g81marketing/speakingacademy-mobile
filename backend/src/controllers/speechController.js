// ─── SPEECH CONTROLLER ────────────────────────────────────────────────────────
// Recebe áudio do app mobile e chama Whisper (OpenAI) via OPENAI_API_KEY do .env.
// Mantém a chave segura no servidor — o app nunca a vê.

// ── Levenshtein distance para calcular similaridade ───────────────────────────
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
  return dp[m][n];
}

function calculateScore(expected, transcript) {
  const a = expected.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const b = transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  if (!a || !b) return 0;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.round(Math.max(0, (1 - dist / maxLen) * 100));
}

// ── POST /speech/evaluate ──────────────────────────────────────────────────────
// Recebe um arquivo de áudio e a frase correta, transcreve com Whisper
// e retorna o score de pronúncia.
//
// Body: multipart/form-data
//   - audio   : arquivo de áudio (m4a, mp3, wav, webm)
//   - expected: frase correta em inglês (string)
exports.evaluate = async (req, res) => {
  try {
    if (!req.file)
      return res.status(400).json({ error: 'Arquivo de áudio não enviado.' });

    const { expected } = req.body;
    if (!expected)
      return res.status(400).json({ error: 'Frase de referência (expected) não fornecida.' });

    if (!process.env.OPENAI_API_KEY)
      return res.status(500).json({ error: 'OPENAI_API_KEY não configurada no servidor.' });

    // ── Transcrição via OpenAI Whisper (FormData/Blob/fetch nativos do Node 18+)
    const form = new FormData();
    const blob = new Blob([req.file.buffer], { type: req.file.mimetype || 'audio/m4a' });
    form.append('file', blob, req.file.originalname || 'recording.m4a');
    form.append('model',    'whisper-1');
    form.append('language', 'en');
    form.append('response_format', 'text');

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method:  'POST',
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: form,
    });

    if (!whisperRes.ok) {
      const detail = await whisperRes.text().catch(() => '');
      console.error('[Whisper] HTTP', whisperRes.status, detail);
      return res.status(502).json({ error: 'Erro na transcrição.', detail });
    }

    const transcript = (await whisperRes.text()).trim();
    const score = calculateScore(expected, transcript);

    res.json({ transcript, score });
  } catch (err) {
    console.error('[Speech] erro:', err);
    res.status(500).json({ error: err.message });
  }
};
