import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config/api';

// Helper para pegar o token JWT
async function getToken() {
  return await AsyncStorage.getItem('@speaking_academy_token');
}

// Helper para headers com autenticação
async function authHeaders() {
  const token = await getToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
}

// ── AUTH ───────────────────────────────────────────────────────────────────────
export async function register(name, email, password, level = 'beginner') {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password, level }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro no registro');
  
  // Salvar token
  await AsyncStorage.setItem('@speaking_academy_token', data.token);
  return data;
}

export async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro no login');
  
  // Salvar token
  await AsyncStorage.setItem('@speaking_academy_token', data.token);
  return data;
}

export async function logout() {
  await AsyncStorage.removeItem('@speaking_academy_token');
}

// ── USER ───────────────────────────────────────────────────────────────────────
export async function getUser() {
  const res = await fetch(`${API_URL}/user`, {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar usuário');
  return data;
}

export async function updateLevel(level) {
  const res = await fetch(`${API_URL}/user/level`, {
    method: 'PUT',
    headers: await authHeaders(),
    body: JSON.stringify({ level }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar nível');
  return data;
}

export async function getUserProgress() {
  const res = await fetch(`${API_URL}/user/progress`, {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar progresso');
  return data;
}

// ── BLOCKS ─────────────────────────────────────────────────────────────────────
export async function getBlocks(filters = {}) {
  const params = new URLSearchParams(filters);
  const res = await fetch(`${API_URL}/blocks?${params}`, {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar blocos');
  return data;
}

export async function getBlockById(blockId) {
  const res = await fetch(`${API_URL}/blocks/${blockId}`, {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar bloco');
  return data;
}

export async function getNextBlock() {
  const res = await fetch(`${API_URL}/blocks/next`, {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar próximo bloco');
  return data;
}

// ── PROGRESS ───────────────────────────────────────────────────────────────────
export async function saveProgress(blockId, score, sentences = []) {
  const res = await fetch(`${API_URL}/progress`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ blockId, score, sentences }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao salvar progresso');
  return data;
}

export async function getProgressHistory(page = 1, limit = 20) {
  const res = await fetch(`${API_URL}/progress/history?page=${page}&limit=${limit}`, {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar histórico');
  return data;
}

// ── SPEECH RECOGNITION ─────────────────────────────────────────────────────────
export async function evaluateSpeech(audioUri, expectedText) {
  const token = await getToken();
  
  // Criar FormData para enviar o arquivo de áudio
  const formData = new FormData();
  formData.append('audio', {
    uri: audioUri,
    type: 'audio/m4a',
    name: 'recording.m4a',
  });
  formData.append('expected', expectedText);

  const res = await fetch(`${API_URL}/speech/evaluate`, {
    method: 'POST',
    // NÃO definir Content-Type manualmente — fetch precisa criar o boundary
    headers: { 'Authorization': `Bearer ${token}` },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro na avaliação de fala');
  return data; // { transcript, score }
}

// ── GAMIFICATION ───────────────────────────────────────────────────────────────
export async function addXp(amount) {
  const res = await fetch(`${API_URL}/gamification/xp`, {
    method: 'POST',
    headers: await authHeaders(),
    body: JSON.stringify({ amount }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao adicionar XP');
  return data;
}

export async function getStreak() {
  const res = await fetch(`${API_URL}/gamification/streak`, {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar streak');
  return data;
}

export async function updateStreak() {
  const res = await fetch(`${API_URL}/gamification/streak/update`, {
    method: 'POST',
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao atualizar streak');
  return data;
}

export async function getAchievements() {
  const res = await fetch(`${API_URL}/gamification/achievements`, {
    headers: await authHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Erro ao buscar conquistas');
  return data;
}
