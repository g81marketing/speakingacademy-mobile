// ⚠️ DEPRECATED — Transcrição Whisper é feita diretamente no app mobile.
// O app envia apenas { phrase, userAnswer, score } para POST /practice.
// Este arquivo não é mais importado pelo app.js.
module.exports = {};

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
  let filePath = null;
  try {
    if (!req.file)
      return res.status(400).json({ error: 'Arquivo de áudio não enviado.' });

    const { expected } = req.body;
    if (!expected)
      return res.status(400).json({ error: 'Frase de referência (expected) não fornecida.' });

    filePath = req.file.path;

    // ── Transcrição via OpenAI Whisper ────────────────────────────────────────
    const form = new FormData();
    form.append('file', fs.createReadStream(filePath), {
      filename:    req.file.originalname || 'audio.m4a',
      contentType: req.file.mimetype     || 'audio/m4a',
    });
    form.append('model',    'whisper-1');
    form.append('language', 'en');

    const whisperRes = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method:  'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        ...form.getHeaders(),
      },
      body: form,
    });

    if (!whisperRes.ok) {
      const err = await whisperRes.json().catch(() => ({}));
      return res.status(502).json({ error: 'Erro na transcrição.', detail: err });
    }

    const { text: transcript } = await whisperRes.json();
    const score = calculateScore(expected, transcript);

    res.json({ transcript, score });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    // Remover arquivo temporário após processamento
    if (filePath && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
};
