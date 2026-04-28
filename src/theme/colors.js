// ─── Speaking Academy – Paleta de cores oficial ───────────────────────────────
// Baseada no site speakingacademy-app.vercel.app

export const PURPLE      = '#7B2FFF';   // roxo primário (logo/botões)
export const PURPLE_DARK = '#5B1FBF';   // roxo escuro (gradiente logo)
export const PURPLE_GLOW = '#7B2FFF33'; // roxo transparente (glow)
export const PINK        = '#FF3DDD';   // rosa/magenta (destaque "treino diário")
export const YELLOW      = '#FFC629';   // amarelo (XP, conquistas)
export const GREEN       = '#00E5A0';   // verde (sucesso, iniciante)
export const RED         = '#FF4D4D';   // vermelho (erro, gravação)

export const BG          = '#0A0818';   // fundo principal (dark purple-navy)
export const CARD        = '#130E2A';   // superfície dos cards
export const CARD2       = '#1C1535';   // superfície secundária
export const BORDER      = '#2D1F5E';   // bordas/divisores
export const BORDER2     = '#3D2F7E';   // bordas de destaque

export const WHITE       = '#FFFFFF';
export const GRAY        = '#9999BB';   // texto secundário
export const GRAY2       = '#666688';   // texto terciário
export const DARK        = '#050410';   // preto-roxo profundo

// Gradientes (para uso com LinearGradient se disponível)
export const GRADIENT_LOGO   = ['#5B1FBF', '#8B3DFF'];
export const GRADIENT_BG     = ['#0A0818', '#150E30'];
export const GRADIENT_CARD   = ['#1C1535', '#130E2A'];
export const GRADIENT_PURPLE = ['#7B2FFF', '#5B1FBF'];

// Alias compatibilidade (screens antigas)
export default {
  PURPLE, PURPLE_DARK, PURPLE_GLOW,
  PINK, YELLOW, GREEN, RED,
  BG, CARD, CARD2, BORDER, BORDER2,
  WHITE, GRAY, GRAY2, DARK,
};
