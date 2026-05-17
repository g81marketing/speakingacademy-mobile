// ─── AUTH CONTEXT ─────────────────────────────────────────────────────────────
// Gerencia autenticação JWT: token, usuário logado, login/register/logout
import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as apiService from '../services/api';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const TOKEN_KEY = '@speaking_academy_token';
const USER_KEY  = '@speaking_academy_user';

export function AuthProvider({ children }) {
  const [token, setToken]     = useState(null);
  const [user, setUser]       = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carrega token e usuário salvos ao iniciar o app
  useEffect(() => {
    const restore = async () => {
      try {
        const [savedToken, savedUser] = await Promise.all([
          AsyncStorage.getItem(TOKEN_KEY),
          AsyncStorage.getItem(USER_KEY),
        ]);
        if (savedToken && savedUser) {
          setToken(savedToken);
          setUser(JSON.parse(savedUser));
        }
      } catch (e) {
        console.warn('[Auth] Erro ao restaurar sessão:', e.message);
      } finally {
        setIsLoading(false);
      }
    };
    restore();
  }, []);

  // Salva token + usuário no AsyncStorage
  const persistSession = async (newToken, newUser) => {
    await Promise.all([
      AsyncStorage.setItem(TOKEN_KEY, newToken),
      AsyncStorage.setItem(USER_KEY, JSON.stringify(newUser)),
    ]);
    setToken(newToken);
    setUser(newUser);
  };

  // Cadastro
  const register = async (name, email, password, level = 'beginner') => {
    const data = await apiService.register(name, email, password, level);
    await persistSession(data.token, data.user);
    return data;
  };

  // Login
  const login = async (email, password) => {
    const data = await apiService.login(email, password);
    await persistSession(data.token, data.user);
    return data;
  };

  // Logout — limpa token e usuário
  const logout = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(TOKEN_KEY),
        AsyncStorage.removeItem(USER_KEY),
      ]);
    } catch (_) {}
    setToken(null);
    setUser(null);
  };

  // Atualiza dados locais do usuário (ex: após mudar nome/nível)
  const refreshUser = async () => {
    try {
      const data = await apiService.getUser();
      const updatedUser = data.user ?? data;
      setUser(updatedUser);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    } catch (e) {
      console.warn('[Auth] Erro ao atualizar usuário:', e.message);
    }
  };

  // Atualiza o plano do usuário (free | premium) e persiste localmente
  const updatePlan = async (plan) => {
    const updatedUser = await apiService.updatePlan(plan);
    setUser(updatedUser);
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    return updatedUser;
  };

  const isPremium = user?.plan === 'premium';

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token,
        isPremium,
        isLoading,
        register,
        login,
        logout,
        refreshUser,
        updatePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
