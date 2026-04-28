// ─── CONFIGURAÇÃO DA API DE RECONHECIMENTO DE VOZ ────────────────────────────
//
// O app usa a API Whisper da OpenAI para transcrever sua pronúncia.
//
// COMO CONFIGURAR:
//  1. Acesse https://platform.openai.com/api-keys
//  2. Crie uma conta gratuita e gere uma API Key
//  3. Cole a key abaixo substituindo 'YOUR_OPENAI_API_KEY_HERE'
//
// ⚠️  Se a key não for configurada, o app roda em MODO DEMO:
//      - A gravação funciona normalmente
//      - O score é simulado automaticamente
//      - Útil para testar o layout e fluxo sem gastar créditos

export const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY_HERE';

// Endpoint da API Whisper
export const WHISPER_ENDPOINT = 'https://api.openai.com/v1/audio/transcriptions';

// Verifica se a key está configurada
export const isApiConfigured = () =>
  OPENAI_API_KEY &&
  OPENAI_API_KEY !== 'YOUR_OPENAI_API_KEY_HERE' &&
  OPENAI_API_KEY.startsWith('sk-');
