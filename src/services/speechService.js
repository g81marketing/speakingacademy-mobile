// ─── SERVIÇO DE RECONHECIMENTO DE VOZ ────────────────────────────────────────
// Usa a API Whisper da OpenAI quando configurada; caso contrário, simula.
import { OPENAI_API_KEY, WHISPER_ENDPOINT, isApiConfigured } from '../config/apiConfig';

// ── Whisper API ───────────────────────────────────────────────────────────────
async function transcribeWithWhisper(audioUri) {
  const formData = new FormData();
  formData.append('file', { uri: audioUri, type: 'audio/m4a', name: 'recording.m4a' });
  formData.append('model', 'whisper-1');
  formData.append('language', 'en');
  formData.append('response_format', 'text');

  const res = await fetch(WHISPER_ENDPOINT, {
    method: 'POST',
    headers: { Authorization: `Bearer ${OPENAI_API_KEY}` },
    body: formData,
  });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    console.error('[Whisper] erro HTTP', res.status, body);
    throw new Error(`Whisper error ${res.status}: ${body}`);
  }
  const text = await res.text();
  console.log('[Whisper] transcrição:', text.trim());
  return text.trim();
}

// ── Simulação (modo demo) ─────────────────────────────────────────────────────
function simulateTranscription(expectedPhrase) {
  const words = expectedPhrase.split(' ');
  const quality = Math.random();

  if (quality > 0.75) {
    if (Math.random() > 0.7 && words.length > 1) {
      const idx = Math.floor(Math.random() * words.length);
      words[idx] = words[idx].slice(0, -1);
    }
    return words.join(' ');
  }
  if (quality > 0.25) {
    const numErrors = Math.min(2, Math.floor(words.length * 0.3));
    for (let i = 0; i < numErrors; i++) {
      const idx = Math.floor(Math.random() * words.length);
      if (words[idx].length > 2) words[idx] = words[idx].slice(0, -2);
    }
    return words.join(' ');
  }
  const numErrors = Math.min(3, Math.floor(words.length * 0.5));
  for (let i = 0; i < numErrors; i++) {
    const idx = Math.floor(Math.random() * words.length);
    if (words[idx].length > 3)      words[idx] = words[idx].slice(0, -3);
    else if (words[idx].length > 1) words[idx] = words[idx].slice(0, 1);
  }
  return words.join(' ');
}

// ── Função principal ──────────────────────────────────────────────────────────
// audioUri   – URI do arquivo gravado (pode ser null em testes)
// expectedPhrase – frase esperada (usada apenas no modo demo)
export async function transcribeAudio(audioUri, expectedPhrase = '') {
  if (isApiConfigured() && audioUri) {
    try {
      return await transcribeWithWhisper(audioUri);
    } catch (err) {
      const msg = err?.message ?? '';
      if (msg.includes('429') || msg.includes('insufficient_quota')) {
        console.warn('[Whisper] Cota da API esgotada — usando simulação como fallback.');
      } else {
        console.warn('[Whisper] Falha na transcrição — usando simulação como fallback.', err);
      }
    }
  }
  await new Promise(resolve => setTimeout(resolve, 300));
  return simulateTranscription(expectedPhrase || 'demo phrase');
}

// Alias legacy (BlockScreen passa só expectedPhrase)
export const transcribeAudioFast = (expectedPhrase) =>
  transcribeAudio(null, expectedPhrase);

// ── Score (Levenshtein) ───────────────────────────────────────────────────────
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

export function calculateScore(expected, transcript) {
  const a = expected.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const b = transcript.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  if (!a || !b) return 0;
  const dist = levenshtein(a, b);
  const maxLen = Math.max(a.length, b.length);
  return Math.round(Math.max(0, (1 - dist / maxLen) * 100));
}
