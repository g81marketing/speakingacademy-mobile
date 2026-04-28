// ─── CÁLCULO DE SIMILARIDADE DE PRONÚNCIA ────────────────────────────────────
// Usa o algoritmo de Levenshtein para medir a distância entre
// o texto original e o texto transcrito pela API.

// Expande contrações comuns do inglês para reduzir falsos negativos
const CONTRACTIONS = {
  "i'm": 'i am', "you're": 'you are', "he's": 'he is', "she's": 'she is',
  "it's": 'it is', "we're": 'we are', "they're": 'they are',
  "i've": 'i have', "you've": 'you have', "we've": 'we have', "they've": 'they have',
  "i'd": 'i would', "you'd": 'you would', "he'd": 'he would',
  "i'll": 'i will', "you'll": 'you will', "he'll": 'he will', "she'll": 'she will',
  "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not',
  "don't": 'do not', "doesn't": 'does not', "didn't": 'did not',
  "can't": 'cannot', "won't": 'will not', "wouldn't": 'would not',
  "shouldn't": 'should not', "couldn't": 'could not', "there's": 'there is',
  "that's": 'that is', "what's": 'what is', "let's": 'let us',
};

// Normaliza o texto: lowercase, expande contrações, remove pontuação
function normalize(text) {
  let t = text.toLowerCase().trim();
  Object.entries(CONTRACTIONS).forEach(([k, v]) => {
    t = t.replace(new RegExp(`\\b${k}\\b`, 'g'), v);
  });
  return t.replace(/[^a-z0-9 ]/g, '').replace(/\s+/g, ' ').trim();
}

// Calcula a distância de edição (algoritmo de Wagner-Fischer)
function levenshteinDistance(a, b) {
  const m = a.length;
  const n = b.length;

  // Cria matriz (m+1) × (n+1)
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1];
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
  }

  return dp[m][n];
}

// Retorna score de 0 a 100
// 100 = idêntico | 0 = completamente diferente
export function calculateScore(original, transcribed) {
  const a = normalize(original);
  const b = normalize(transcribed);

  if (!b || b.length === 0) return 0;
  if (a === b) return 100;

  const distance = levenshteinDistance(a, b);
  const maxLen = Math.max(a.length, b.length);

  // Normaliza e aplica uma curva suave para não ser muito punitivo
  const raw = (1 - distance / maxLen) * 100;
  return Math.max(0, Math.min(100, Math.round(raw)));
}

// Retorna configuração de feedback baseada no score
export function getFeedback(score) {
  if (score >= 92)
    return {
      emoji: '🏆',
      label: 'Perfeito!',
      message: 'Pronúncia excelente! Você soou como um nativo.',
      color: '#16A34A',
      bgColor: '#F0FDF4',
    };
  if (score >= 78)
    return {
      emoji: '⭐',
      label: 'Muito bom!',
      message: 'Quase perfeito. Pequenos ajustes e você chega lá!',
      color: '#2563EB',
      bgColor: '#EFF6FF',
    };
  if (score >= 62)
    return {
      emoji: '👍',
      label: 'Bom trabalho!',
      message: 'Boa pronúncia! Continue praticando a entonação.',
      color: '#D97706',
      bgColor: '#FFFBEB',
    };
  if (score >= 40)
    return {
      emoji: '💪',
      label: 'Praticando...',
      message: 'Você está progredindo! Ouça novamente e repita devagar.',
      color: '#EA580C',
      bgColor: '#FFF7ED',
    };
  return {
    emoji: '🎯',
    label: 'Tente novamente',
    message: 'Ouça com atenção e fale devagar, sílaba por sílaba.',
    color: '#EF4444',
    bgColor: '#FEF2F2',
  };
}
