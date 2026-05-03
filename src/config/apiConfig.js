// ─── CONFIGURAÇÃO DA API DE RECONHECIMENTO DE VOZ ────────────────────────────
// O Whisper agora é chamado pelo backend (rota POST /speech/evaluate).
// A chave OpenAI fica segura no servidor — o app nunca a vê.
// Mantemos a função abaixo apenas por compatibilidade com telas antigas.

export const isApiConfigured = () => true;
