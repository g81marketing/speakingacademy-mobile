// ─── TELA DE TREINO ──────────────────────────────────────────────────────────
// Fluxo: Etapa 1 (Ouça EN) → Etapa 2 (Repita) → Etapa 3 (PT→EN Produção) → Resultado
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { useApp } from '../context/AppContext';
import WaveformAnimation from '../components/WaveformAnimation';
import ProgressBar from '../components/ProgressBar';
import { transcribeAudio } from '../services/speechService';
import { calculateScore } from '../utils/similarity';
import { isApiConfigured } from '../config/apiConfig';
import SpeedSelector, { TTS_RATES } from '../components/SpeedSelector';

import { PURPLE, YELLOW, GREEN, BG, CARD, BORDER, GRAY } from '../theme/colors';
const BLUE = PURPLE;
const RED = '#FF4D4D';
const MAX_RECORD_SECS = 15;

// Preset de gravação compatível com Whisper API (.m4a em todas as plataformas)
const RECORDING_OPTIONS = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
  web: { mimeType: 'audio/webm', bitsPerSecond: 128000 },
};

export default function TrainingScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { phrase } = route.params;
  const { completePhrase, challengeMode, userSelectedLevel, ttsSpeed, setTtsSpeed } = useApp();
  const CHALLENGE_SECS = 8; // segundos para responder no modo desafio

  // ── Estado da tela ──────────────────────────────────────────────────────────
  // 1=ouça | 2=repita | 3=analisando-rep | 4=PT→EN | 5=analisando-prod
  const [step, setStep] = useState(1);
  const isBeginnerMode = phrase.level === 'beginner';
  const showTextInStep2 = phrase.level === 'beginner' || phrase.level === 'basic';
  const isChallengeActive = challengeMode && phrase.level === 'advanced';
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [recordSecs, setRecordSecs] = useState(0);
  const [challengeSecs, setChallengeSecs] = useState(CHALLENGE_SECS);

  const recordingRef = useRef(null);   // referência estável para o objeto Recording
  const timerRef = useRef(null);
  const challengeTimerRef = useRef(null);
  const isMounted = useRef(true);

  // ── Estado PT→EN (Etapa 3 de produção) ──────────────────────────────────────
  const [repetitionScore, setRepetitionScore] = useState(0);
  const [repetitionTranscribed, setRepetitionTranscribed] = useState('');
  const [isPtSpeaking, setIsPtSpeaking] = useState(false);
  const [productionIsRecording, setProductionIsRecording] = useState(false);
  const [productionAudioUri, setProductionAudioUri] = useState(null);
  const [productionRecordSecs, setProductionRecordSecs] = useState(0);
  const prodRecordingRef = useRef(null);
  const prodTimerRef = useRef(null);

  // ── Inicialização ────────────────────────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true;
    setupAudio();
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, []);

  // Auto-para gravação quando atinge o limite de tempo
  useEffect(() => {
    if (recordSecs >= MAX_RECORD_SECS && isRecording) stopRecording();
  }, [recordSecs, isRecording]);

  useEffect(() => {
    if (productionRecordSecs >= MAX_RECORD_SECS && productionIsRecording) stopProdRecording();
  }, [productionRecordSecs, productionIsRecording]);

  const setupAudio = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (!isMounted.current) return;
    setHasPermission(status === 'granted');
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });
    // Etapa 1: reproduz a frase automaticamente ao abrir
    playPhrase();
  };

  // Contador regressivo para o Modo Desafio
  useEffect(() => {
    const step2Active = isChallengeActive && step === 2 && isRecording;
    const step4Active = isChallengeActive && step === 4 && productionIsRecording;
    if (step2Active || step4Active) {
      setChallengeSecs(CHALLENGE_SECS);
      challengeTimerRef.current = setInterval(() => {
        setChallengeSecs((s) => {
          if (s <= 1) {
            clearInterval(challengeTimerRef.current);
            if (step === 2) stopRecording();
            else stopProdRecording();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      clearInterval(challengeTimerRef.current);
    }
    return () => clearInterval(challengeTimerRef.current);
  }, [isChallengeActive, step, isRecording, productionIsRecording]);

  const cleanup = () => {
    Speech.stop();
    clearInterval(timerRef.current);
    clearInterval(prodTimerRef.current);
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync().catch(() => {});
      recordingRef.current = null;
    }
    if (prodRecordingRef.current) {
      prodRecordingRef.current.stopAndUnloadAsync().catch(() => {});
      prodRecordingRef.current = null;
    }
  };

  // ── Áudio TTS ────────────────────────────────────────────────────────────────
  const playPhrase = () => {
    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(phrase.english, {
      language: 'en-US',
      rate: TTS_RATES[ttsSpeed] ?? 1.0,
      onDone: () => isMounted.current && setIsSpeaking(false),
      onStopped: () => isMounted.current && setIsSpeaking(false),
      onError: () => isMounted.current && setIsSpeaking(false),
    });
  };

  // ── Áudio TTS Português ──────────────────────────────────────────────────────
  const playPortuguese = () => {
    Speech.stop();
    setIsPtSpeaking(true);
    Speech.speak(phrase.portuguese, {
      language: 'pt-BR',
      rate: TTS_RATES[ttsSpeed] ?? 1.0,
      onDone: () => isMounted.current && setIsPtSpeaking(false),
      onStopped: () => isMounted.current && setIsPtSpeaking(false),
      onError: () => isMounted.current && setIsPtSpeaking(false),
    });
  };

  // ── Gravação ─────────────────────────────────────────────────────────────────
  const startRecording = async () => {
    if (!hasPermission) {
      Alert.alert(
        'Permissão necessária',
        'Permita o acesso ao microfone nas configurações do celular.'
      );
      return;
    }
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const { recording } = await Audio.Recording.createAsync(
        RECORDING_OPTIONS
      );
      recordingRef.current = recording;
      setIsRecording(true);
      setRecordSecs(0);
      setAudioUri(null);
      // Incrementa o timer a cada segundo
      timerRef.current = setInterval(() => {
        setRecordSecs((s) => s + 1);
      }, 1000);
    } catch (e) {
      Alert.alert('Erro ao gravar', e.message);
    }
  };

  const stopRecording = async () => {
    clearInterval(timerRef.current);
    const rec = recordingRef.current;
    if (!rec) return;
    setIsRecording(false);
    try {
      await rec.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = rec.getURI();
      recordingRef.current = null;
      if (isMounted.current) setAudioUri(uri);
    } catch (e) {
      console.error('Erro ao parar gravação:', e);
    }
  };

  // ── Gravação de Produção (Etapa PT→EN) ───────────────────────────────────────
  const startProdRecording = async () => {
    if (!hasPermission) {
      Alert.alert('Permissão necessária', 'Permita o acesso ao microfone nas configurações.');
      return;
    }
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
      prodRecordingRef.current = recording;
      setProductionIsRecording(true);
      setProductionRecordSecs(0);
      setProductionAudioUri(null);
      prodTimerRef.current = setInterval(() => {
        setProductionRecordSecs((s) => s + 1);
      }, 1000);
    } catch (e) {
      Alert.alert('Erro ao gravar', e.message);
    }
  };

  const stopProdRecording = async () => {
    clearInterval(prodTimerRef.current);
    const rec = prodRecordingRef.current;
    if (!rec) return;
    setProductionIsRecording(false);
    try {
      await rec.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const uri = rec.getURI();
      prodRecordingRef.current = null;
      if (isMounted.current) setProductionAudioUri(uri);
    } catch (e) {
      console.error('Erro ao parar gravação de produção:', e);
    }
  };

  // ── Análise ──────────────────────────────────────────────────────────────────
  const analyzeRecording = async () => {
    if (!audioUri) return;
    setStep(3); // carregando análise da repetição
    try {
      const transcribed = await transcribeAudio(audioUri, phrase.english);
      const score = calculateScore(phrase.english, transcribed);
      if (isMounted.current) {
        setRepetitionScore(score);
        setRepetitionTranscribed(transcribed);
        setStep(4); // avança para PT→EN
        playPortuguese();
      }
    } catch (e) {
      if (isMounted.current) {
        setRepetitionScore(0);
        setRepetitionTranscribed('');
        setStep(4);
        playPortuguese();
      }
    }
  };

  const analyzePtEnRecording = async () => {
    if (!productionAudioUri) return;
    setStep(5); // carregando análise da produção
    try {
      const transcribed = await transcribeAudio(productionAudioUri, phrase.english);
      const prodScore = calculateScore(phrase.english, transcribed);
      completePhrase(phrase.level, phrase.day ?? null, repetitionScore, false);
      if (isMounted.current) {
        navigation.replace('Result', {
          phrase,
          score: repetitionScore,
          transcribed: repetitionTranscribed,
          productionScore: prodScore,
          productionTranscribed: transcribed,
        });
      }
    } catch (e) {
      if (isMounted.current) {
        completePhrase(phrase.level, phrase.day ?? null, repetitionScore, false);
        navigation.replace('Result', {
          phrase,
          score: repetitionScore,
          transcribed: repetitionTranscribed,
          productionScore: 0,
          productionTranscribed: '',
        });
      }
    }
  };

  const skipPtEn = () => {
    Speech.stop();
    completePhrase(phrase.level, phrase.day ?? null, repetitionScore, false);
    navigation.replace('Result', {
      phrase,
      score: repetitionScore,
      transcribed: repetitionTranscribed,
      productionScore: null,
      productionTranscribed: null,
    });
  };

  // ── Formatação ───────────────────────────────────────────────────────────────
  const formatTime = (s) =>
    `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => { cleanup(); navigation.goBack(); }}
          style={styles.backBtn}
        >
          <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.stepPills}>
          {[
            { label: 'Ouça',     active: step === 1 },
            { label: 'Repita',   active: step === 2 },
            { label: 'Produza',  active: step === 3 || step === 4 },
            { label: 'Resultado',active: step === 5 },
          ].map(({ label, active }) => (
            <View key={label} style={[styles.pill, active && styles.pillActive]}>
              <Text style={[styles.pillText, active && styles.pillTextActive]}>{label}</Text>
            </View>
          ))}
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Badge modo demo */}
      {!isApiConfigured() && (
        <View style={styles.demoBadge}>
          <Ionicons name="flask-outline" size={13} color={PURPLE} />
          <Text style={styles.demoText}>Modo demonstração — configure a API key para avaliação real</Text>
        </View>
      )}

      <View style={styles.content}>
        {/* ── ETAPA 1: Ouça a frase ── */}
        {step === 1 && (
          <View style={styles.stepContainer}>
            <View>
              <Text style={styles.stepLabel}>ETAPA 1 DE 4</Text>
              <Text style={styles.stepTitle}>Ouça com atenção</Text>
              <Text style={styles.stepSub}>
                {isBeginnerMode ? 'Ouça e repita o que ouvir!' : 'Sem texto — foque apenas no som!'}
              </Text>
              {phrase.sound && (
                <View style={styles.soundBadge}>
                  <Text style={styles.soundBadgeText}>🎯 Foco: {phrase.sound}</Text>
                </View>
              )}
            </View>

            {/* Seletor de velocidade */}
            <SpeedSelector speed={ttsSpeed} onSelect={setTtsSpeed} color={BLUE} />

            {/* Ícone + animação de onda */}
            <View style={styles.audioCenter}>
              <View style={[styles.speakerCircle, isSpeaking && styles.speakerCircleActive]}>
                <Ionicons
                  name="volume-high"
                  size={52}
                  color={isSpeaking ? '#FFFFFF' : GRAY}
                />
              </View>
              <WaveformAnimation active={isSpeaking} color={BLUE} />
              <Text style={styles.audioStatus}>
                {isSpeaking ? 'Reproduzindo...' : 'Toque para ouvir novamente'}
              </Text>
              {/* Modo INICIANTE: mostrar texto + fonética após o áudio */}
              {isBeginnerMode && !isSpeaking && (
                <View style={styles.beginnerReveal}>
                  <Text style={styles.beginnerEnglish}>{phrase.english}</Text>
                  {phrase.phonetic && (
                    <Text style={styles.beginnerPhonetic}>/{phrase.phonetic}/</Text>
                  )}
                  <Text style={styles.beginnerTranslation}>{phrase.portuguese}</Text>
                </View>
              )}
            </View>

            <View style={styles.btnStack}>
              <TouchableOpacity
                style={[styles.btnOutline, isSpeaking && styles.btnDisabled]}
                onPress={playPhrase}
                disabled={isSpeaking}
              >
                <Ionicons
                  name="refresh"
                  size={20}
                  color={isSpeaking ? GRAY : BLUE}
                />
                <Text style={[styles.btnTextBlue, isSpeaking && { color: GRAY }]}>
                  Ouvir novamente
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnPrimary}
                onPress={() => { Speech.stop(); setIsSpeaking(false); setStep(2); }}
              >
                <Ionicons name="mic" size={22} color="#FFF" />
                <Text style={styles.btnTextWhite}>Gravar minha voz</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── ETAPA 2: Grave ── */}
        {step === 2 && (
          <View style={styles.stepContainer}>
            <View>
              <Text style={styles.stepLabel}>ETAPA 2 DE 4</Text>
              {phrase.sound && (
                <View style={styles.soundBadge}>
                  <Text style={styles.soundBadgeText}>🎯 {phrase.sound}</Text>
                </View>
              )}
              <Text style={styles.stepTitle}>
                {isRecording
                  ? 'Fale a frase agora!'
                  : audioUri
                  ? 'Gravação concluída'
                  : 'Grave sua pronúncia'}
              </Text>
              <Text style={styles.stepSub}>
                {isRecording
                  ? `Gravando... ${formatTime(recordSecs)} / ${formatTime(MAX_RECORD_SECS)}`
                  : audioUri
                  ? `${formatTime(recordSecs)} gravados`
                  : 'Toque no microfone para começar'}
              </Text>
              {/* Modo Desafio: contador regressivo */}
              {isChallengeActive && isRecording && (
                <View style={[styles.challengeBadge, challengeSecs <= 3 && styles.challengeBadgeUrgent]}>
                  <Ionicons name="timer-outline" size={16} color="#FFF" />
                  <Text style={styles.challengeTime}>{challengeSecs}s</Text>
                </View>
              )}
              {/* Modo BÁSICO/INICIANTE: mostrar texto como suporte */}
              {showTextInStep2 && (
                <View style={styles.textSupport}>
                  <Text style={styles.textSupportEnglish}>{phrase.english}</Text>
                  {phrase.phonetic && (
                    <Text style={styles.textSupportPhonetic}>/{phrase.phonetic}/</Text>
                  )}
                </View>
              )}
            </View>

            {/* Área do microfone */}
            <View style={styles.micArea}>
              {!audioUri ? (
                <>
                  <TouchableOpacity
                    style={[styles.micBtn, isRecording && styles.micBtnRecording]}
                    onPress={isRecording ? stopRecording : startRecording}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={isRecording ? 'stop' : 'mic'}
                      size={56}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                  {isRecording && (
                    <>
                      <WaveformAnimation active color={RED} />
                      <View style={styles.timerBar}>
                        <ProgressBar
                          progress={recordSecs / MAX_RECORD_SECS}
                          color={RED}
                          height={4}
                        />
                      </View>
                    </>
                  )}
                  {!isRecording && (
                    <Text style={styles.micHint}>Toque para gravar</Text>
                  )}
                </>
              ) : (
                /* Gravação concluída */
                <View style={styles.doneBox}>
                  <Ionicons name="checkmark-circle" size={72} color="#22C55E" />
                  <Text style={styles.doneText}>Pronto para analisar!</Text>
                </View>
              )}
            </View>

            <View style={styles.btnStack}>
              {audioUri && (
                <TouchableOpacity style={styles.btnPrimary} onPress={analyzeRecording}>
                  <Ionicons name="analytics-outline" size={22} color="#FFF" />
                  <Text style={styles.btnTextWhite}>Analisar pronúncia</Text>
                </TouchableOpacity>
              )}
              {audioUri && (
                <TouchableOpacity
                  style={styles.btnGhost}
                  onPress={() => { setAudioUri(null); setRecordSecs(0); }}
                >
                  <Ionicons name="refresh" size={18} color={GRAY} />
                  <Text style={styles.btnTextGray}>Gravar novamente</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.btnGhost}
                onPress={() => { setStep(1); playPhrase(); }}
              >
                <Ionicons name="volume-high" size={18} color={GRAY} />
                <Text style={styles.btnTextGray}>Ouvir frase novamente</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── ETAPA 3: Analisando repetição ── */}
        {step === 3 && (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="large" color={BLUE} />
            <Text style={styles.analyzingTitle}>Analisando sua pronúncia...</Text>
            <Text style={styles.analyzingSubtitle}>Preparando a próxima etapa</Text>
          </View>
        )}

        {/* ── ETAPA 4: Português → Inglês (Produção ativa) ── */}
        {step === 4 && (
          <View style={styles.stepContainer}>
            <View>
              <Text style={[styles.stepLabel, { color: PURPLE }]}>ETAPA 3 DE 4 — PRODUÇÃO</Text>
              <Text style={styles.stepTitle}>Fale em inglês</Text>
              <Text style={styles.stepSub}>
                {userSelectedLevel === 'beginner'
                  ? 'Leia a frase abaixo e fale em inglês'
                  : 'Ouça em português e traduza falando em inglês'}
              </Text>
            </View>

            {/* Área central — botão PT + animação + texto opcional */}
            <View style={styles.audioCenter}>
              <TouchableOpacity
                onPress={playPortuguese}
                disabled={isPtSpeaking}
                style={[styles.ptSpeakerCircle, isPtSpeaking && styles.ptSpeakerActive]}
                activeOpacity={0.8}
              >
                <Text style={styles.ptFlag}>🇧🇷</Text>
              </TouchableOpacity>
              <WaveformAnimation active={isPtSpeaking} color={PURPLE} />
              <Text style={styles.audioStatus}>
                {isPtSpeaking ? 'Reproduzindo em português...' : 'Toque para ouvir em português'}
              </Text>
              {/* INICIANTE: mostrar texto PT */}
              {userSelectedLevel === 'beginner' && (
                <View style={styles.ptTextBox}>
                  <Text style={styles.ptTextLabel}>🇧🇷 Português</Text>
                  <Text style={styles.ptText}>{phrase.portuguese}</Text>
                </View>
              )}
              {/* AVANÇADO: contador regressivo durante gravação */}
              {isChallengeActive && productionIsRecording && (
                <View style={[styles.challengeBadge, challengeSecs <= 3 && styles.challengeBadgeUrgent]}>
                  <Ionicons name="timer-outline" size={16} color="#FFF" />
                  <Text style={styles.challengeTime}>{challengeSecs}s</Text>
                </View>
              )}
            </View>

            {/* Microfone */}
            <View style={styles.micArea}>
              {!productionAudioUri ? (
                <>
                  <TouchableOpacity
                    style={[
                      styles.micBtn,
                      { backgroundColor: PURPLE, shadowColor: PURPLE },
                      productionIsRecording && styles.micBtnRecording,
                    ]}
                    onPress={productionIsRecording ? stopProdRecording : startProdRecording}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={productionIsRecording ? 'stop' : 'mic'}
                      size={56}
                      color="#FFFFFF"
                    />
                  </TouchableOpacity>
                  {productionIsRecording && (
                    <>
                      <WaveformAnimation active color={RED} />
                      <View style={styles.timerBar}>
                        <ProgressBar
                          progress={productionRecordSecs / MAX_RECORD_SECS}
                          color={RED}
                          height={4}
                        />
                      </View>
                    </>
                  )}
                  {!productionIsRecording && (
                    <Text style={styles.micHint}>Toque para falar em inglês 🎙️</Text>
                  )}
                </>
              ) : (
                <View style={styles.doneBox}>
                  <Ionicons name="checkmark-circle" size={72} color="#22C55E" />
                  <Text style={styles.doneText}>Pronto para avaliar!</Text>
                </View>
              )}
            </View>

            <View style={styles.btnStack}>
              {productionAudioUri && (
                <TouchableOpacity
                  style={styles.btnPrimary}
                  onPress={analyzePtEnRecording}
                >
                  <Ionicons name="analytics-outline" size={22} color="#FFF" />
                  <Text style={styles.btnTextWhite}>Ver meu resultado</Text>
                </TouchableOpacity>
              )}
              {productionAudioUri && (
                <TouchableOpacity
                  style={styles.btnGhost}
                  onPress={() => { setProductionAudioUri(null); setProductionRecordSecs(0); }}
                >
                  <Ionicons name="refresh" size={18} color={GRAY} />
                  <Text style={styles.btnTextGray}>Gravar novamente</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.btnGhost}
                onPress={playPortuguese}
                disabled={isPtSpeaking}
              >
                <Ionicons name="volume-high" size={18} color={GRAY} />
                <Text style={styles.btnTextGray}>Ouvir em português</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGhost} onPress={skipPtEn}>
                <Ionicons name="arrow-forward" size={18} color="#94A3B8" />
                <Text style={[styles.btnTextGray, { color: '#94A3B8' }]}>Não sei — Pular esta etapa</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── ETAPA 5: Analisando produção ── */}
        {step === 5 && (
          <View style={styles.analyzingContainer}>
            <ActivityIndicator size="large" color={PURPLE} />
            <Text style={styles.analyzingTitle}>Avaliando sua produção...</Text>
            <Text style={styles.analyzingSubtitle}>Comparando com a frase correta em inglês</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },

  // Cabeçalho
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  stepPills: { flexDirection: 'row', gap: 6 },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: CARD,
  },
  pillActive: { backgroundColor: BLUE },
  pillText: { fontSize: 12, fontWeight: '700', color: GRAY },
  pillTextActive: { color: '#FFFFFF' },

  // Badge demo
  demoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: PURPLE + '18',
    paddingHorizontal: 16,
    paddingVertical: 7,
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: PURPLE + '44',
  },
  demoText: { fontSize: 11, color: PURPLE, fontWeight: '600', flex: 1 },

  content: { flex: 1, paddingHorizontal: 20 },

  // Etapas
  stepContainer: {
    flex: 1,
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 24,
  },
  stepLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: BLUE,
    letterSpacing: 1.8,
    marginBottom: 8,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 32,
  },
  stepSub: {
    fontSize: 14,
    color: GRAY,
    marginTop: 6,
    fontWeight: '500',
  },
  soundBadge: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: PURPLE + '22',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 10,
    borderWidth: 1,
    borderColor: PURPLE + '44',
  },
  soundBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: PURPLE,
  },

  // Etapa 1 — área central de áudio
  audioCenter: {
    alignItems: 'center',
    gap: 16,
  },
  speakerCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: CARD,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2, borderColor: BORDER,
  },
  speakerCircleActive: {
    backgroundColor: BLUE,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  audioStatus: { fontSize: 14, color: GRAY, fontWeight: '500' },

  // Modo INICIANTE — revelação após o áudio
  beginnerReveal: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: PURPLE + '18',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    gap: 4,
    borderWidth: 1.5,
    borderColor: PURPLE + '44',
  },
  beginnerEnglish: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  beginnerPhonetic: {
    fontSize: 15,
    color: PURPLE,
    fontWeight: '700',
    textAlign: 'center',
  },
  beginnerTranslation: {
    fontSize: 14,
    color: GRAY,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Modo Desafio — contador regressivo
  challengeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: PURPLE,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    marginTop: 8,
  },
  challengeBadgeUrgent: { backgroundColor: '#FF4D4D' },
  challengeTime: { fontSize: 16, fontWeight: '900', color: '#FFF' },

  // Suporte textual no step 2 (básico/iniciante)
  textSupport: {
    marginTop: 12,
    backgroundColor: CARD,
    borderRadius: 12,
    padding: 12,
    borderLeftWidth: 3,
    borderLeftColor: BLUE,
    gap: 2,
  },
  textSupportEnglish: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  textSupportPhonetic: {
    fontSize: 13,
    color: PURPLE,
    fontWeight: '600',
  },

  // Etapa 2 — área do microfone
  micArea: {
    alignItems: 'center',
    gap: 20,
    paddingVertical: 10,
  },
  micBtn: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: BLUE,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  micBtnRecording: {
    backgroundColor: RED,
    shadowColor: RED,
  },
  timerBar: { width: '100%' },
  micHint: { fontSize: 14, color: GRAY, fontWeight: '500' },
  doneBox: { alignItems: 'center', gap: 12 },
  doneText: { fontSize: 18, fontWeight: '700', color: GREEN },

  // Etapa 3 — analisando
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  analyzingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  analyzingSubtitle: {
    fontSize: 14,
    color: GRAY,
    textAlign: 'center',
  },

  // Botões
  btnStack: { gap: 10 },
  btnPrimary: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: BLUE,
    borderRadius: 16,
    paddingVertical: 18,
    gap: 10,
    elevation: 4,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnOutline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: PURPLE + '18',
    borderRadius: 16,
    paddingVertical: 16,
    gap: 8,
    borderWidth: 1.5,
    borderColor: PURPLE + '44',
  },
  btnGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: CARD,
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: BORDER,
  },
  btnDisabled: { opacity: 0.4 },
  btnTextWhite: { fontSize: 16, fontWeight: '700', color: '#FFFFFF' },
  btnTextBlue: { fontSize: 15, fontWeight: '700', color: BLUE },
  btnTextGray: { fontSize: 14, fontWeight: '600', color: GRAY },

  // Etapa 4 — PT→EN
  btnOrange: {
    backgroundColor: PURPLE,
    shadowColor: PURPLE,
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  ptSpeakerCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: PURPLE + '22',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PURPLE + '44',
  },
  ptSpeakerActive: {
    backgroundColor: PURPLE,
    borderColor: PURPLE,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  ptFlag: { fontSize: 44 },
  ptTextBox: {
    width: '100%',
    backgroundColor: PURPLE + '18',
    borderRadius: 14,
    padding: 14,
    borderLeftWidth: 3,
    borderLeftColor: PURPLE,
    gap: 4,
  },
  ptTextLabel: { fontSize: 11, fontWeight: '800', color: PURPLE, textTransform: 'uppercase', letterSpacing: 0.8 },
  ptText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', lineHeight: 26 },
});
