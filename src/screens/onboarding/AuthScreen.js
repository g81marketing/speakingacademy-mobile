import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, KeyboardAvoidingView, Platform, ScrollView,
  ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import LogoSpeaking from '../../components/LogoSpeaking';
import { GymBgDecor } from '../../components/GymDecor';
import { PURPLE, PINK, BG, CARD, BORDER, GRAY } from '../../theme/colors';

const YELLOW = '#FFC629';
const RED    = '#FF4D4D';

export default function AuthScreen() {
  const navigation = useNavigation();
  const route      = useRoute();
  const returning  = route.params?.returning ?? false;

  const { updateProfile } = useApp();
  const { login, register } = useAuth();

  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [tab,      setTab]      = useState('signup');
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleContinue = async () => {
    setError('');
    if (!email.trim() || !password.trim()) {
      setError('Preencha e-mail e senha.');
      return;
    }
    if (tab === 'signup' && !returning && name.trim().length < 2) {
      setError('Digite seu nome (mínimo 2 caracteres).');
      return;
    }

    setLoading(true);
    try {
      if (tab === 'signup' && !returning) {
        const { user } = await register(name.trim(), email.trim(), password);
        updateProfile(user.name);
        navigation.navigate('Goal');
      } else {
        const { user } = await login(email.trim(), password);
        updateProfile(user.name);
        // Lê o storage do usuário logado para decidir para onde ir
        const STORAGE_PREFIX = '@speaking_academy_v4';
        const userKey  = `${STORAGE_PREFIX}_${user.id}`;
        const guestKey = `${STORAGE_PREFIX}_guest`;
        let stored = await AsyncStorage.getItem(userKey);
        if (!stored) stored = await AsyncStorage.getItem(guestKey);
        let alreadyOnboarded = false;
        if (stored) {
          const parsed = JSON.parse(stored);
          alreadyOnboarded = !!(parsed.onboardingComplete && parsed.userSelectedLevel);
        }
        if (alreadyOnboarded) {
          navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
        } else {
          navigation.navigate('Goal');
        }
      }
    } catch (err) {
      setError(err.message || 'Erro ao autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    updateProfile('Usuário Google');
    navigation.navigate('Goal');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <GymBgDecor />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Voltar */}
          <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
            <Ionicons name="chevron-back" size={22} color={GRAY} />
            <Text style={styles.backText}>Voltar</Text>
          </TouchableOpacity>

          {/* Logo */}
          <LogoSpeaking size="sm" showTagline style={styles.logoRow} />

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              {returning ? 'Bem-vindo de volta! 👋' : 'Criar sua conta 🎙️'}
            </Text>
            <Text style={styles.subtitle}>
              {returning
                ? 'Entre para continuar seu progresso'
                : 'Comece a falar inglês hoje mesmo'}
            </Text>
          </View>

          {/* Tabs */}
          {!returning && (
            <View style={styles.tabs}>
              {['signup', 'login'].map((t) => (
                <TouchableOpacity
                  key={t}
                  style={[styles.tab, tab === t && styles.tabActive]}
                  onPress={() => setTab(t)}
                >
                  <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                    {t === 'signup' ? 'Cadastro' : 'Entrar'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Google */}
          <TouchableOpacity style={styles.googleBtn} onPress={handleGoogle} activeOpacity={0.85}>
            <Text style={styles.googleIcon}>G</Text>
            <Text style={styles.googleText}>Continuar com Google</Text>
          </TouchableOpacity>

          {/* Separador */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>ou</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Campos */}
          {(tab === 'signup' && !returning) && (
            <View style={styles.field}>
              <Text style={styles.fieldLabel}>Seu nome</Text>
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Como quer ser chamado?"
                  placeholderTextColor="#94A3B8"
                  value={name}
                  onChangeText={setName}
                  autoCapitalize="words"
                  returnKeyType="next"
                />
              </View>
            </View>
          )}

          <View style={styles.field}>
            <Text style={styles.fieldLabel}>E-mail</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="seu@email.com"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />
            </View>
          </View>

          {/* Senha */}
          <View style={styles.field}>
            <Text style={styles.fieldLabel}>Senha</Text>
            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={18} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Mínimo 6 caracteres"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPass}
                autoCapitalize="none"
                returnKeyType="done"
                onSubmitEditing={handleContinue}
              />
              <TouchableOpacity onPress={() => setShowPass(v => !v)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Ionicons name={showPass ? 'eye-off-outline' : 'eye-outline'} size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Erro */}
          {!!error && (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle-outline" size={16} color={RED} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Botão principal */}
          <TouchableOpacity
            style={[styles.btnPrimary, loading && { opacity: 0.7 }]}
            onPress={handleContinue}
            activeOpacity={0.88}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#FFF" />
              : (<>
                  <Text style={styles.btnPrimaryText}>
                    {tab === 'signup' && !returning ? 'Criar conta' : 'Entrar'}
                  </Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </>)
            }
          </TouchableOpacity>

          <Text style={styles.terms}>
            Ao continuar, você aceita nossos{' '}
            <Text style={styles.link}>Termos de Uso</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll:    { padding: 24, gap: 20, paddingBottom: 48 },

  back: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  backText: { fontSize: 15, color: GRAY, fontWeight: '500' },
  logoRow: { marginBottom: 4 },

  header: { gap: 8 },
  title:    { fontSize: 26, fontWeight: '900', color: '#FFFFFF' },
  subtitle: { fontSize: 14, color: GRAY, fontWeight: '400', lineHeight: 22 },

  tabs: { flexDirection: 'row', backgroundColor: CARD, borderRadius: 14, padding: 4, borderWidth: 1, borderColor: BORDER },
  tab: { flex: 1, paddingVertical: 11, alignItems: 'center', borderRadius: 11 },
  tabActive: { backgroundColor: PURPLE },
  tabText: { fontSize: 14, fontWeight: '700', color: GRAY },
  tabTextActive: { color: '#FFFFFF' },

  googleBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12,
    backgroundColor: CARD, borderRadius: 16, paddingVertical: 16,
    borderWidth: 1.5, borderColor: BORDER,
  },
  googleIcon: { fontSize: 18, fontWeight: '900', color: '#4285F4' },
  googleText: { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },

  divider: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: BORDER },
  dividerText: { fontSize: 13, color: GRAY, fontWeight: '600' },

  field: { gap: 8 },
  fieldLabel: { fontSize: 13, fontWeight: '700', color: '#CCCCDD', letterSpacing: 0.5 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CARD, borderRadius: 14,
    borderWidth: 1.5, borderColor: BORDER, paddingHorizontal: 14,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: '#FFFFFF', paddingVertical: 15 },

  btnPrimary: {
    backgroundColor: PURPLE, borderRadius: 18,
    paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: PURPLE, shadowOpacity: 0.55,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 12,
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '900', color: '#FFF' },

  terms: { fontSize: 12, color: '#333355', textAlign: 'center' },
  link:  { color: PINK, fontWeight: '600' },

  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: RED + '18', borderRadius: 10,
    borderWidth: 1, borderColor: RED + '44',
    padding: 12,
  },
  errorText: { flex: 1, color: RED, fontSize: 13, fontWeight: '500' },
});
