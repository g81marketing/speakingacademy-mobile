// ─── SPEAKING AI ──────────────────────────────────────────────────────────────
// Treino inteligente de speaking: usuário escreve uma frase em português,
// recebe a tradução em inglês via IA, ouve a pronúncia e pratica falando.
import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView,
  Animated, ActivityIndicator, Alert, Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';

import { translatePhrase } from '../services/api';
import { transcribeAudio } from '../services/speechService';
import { calculateScore } from '../utils/similarity';
import { useApp, SPEAK_AI_MAX_PER_DAY, SPEAK_AI_MAX_WORDS } from '../context/AppContext';
import LockedContent from '../components/LockedContent';
import { PURPLE, PINK, YELLOW, GREEN, RED, BG, CARD, CARD2, BORDER, GRAY, GRAY2 } from '../theme/colors';

const todayKey = () => new Date().toISOString().slice(0, 10);

const SUGGESTED = [
  { icon: '💼', label: 'Business',     phrase: 'Vou participar da reunião amanhã.' },
  { icon: '💻', label: 'Developer',    phrase: 'Consegui corrigir o bug.' },
  { icon: '✈️', label: 'Travel',       phrase: 'Onde fica o portão de embarque?' },
  { icon: '🗣️', label: 'Conversação',  phrase: 'Como foi seu fim de semana?' },
];

const RECORDING_OPTIONS = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat?.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder?.AAC,
    sampleRate: 44100, numberOfChannels: 1, bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat?.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality?.HIGH,
    sampleRate: 44100, numberOfChannels: 1, bitRate: 128000,
  },
  web: {},
};

export default function SpeakingAIScreen() {
  const { aiPhrases, addAiPhrase, removeAiPhrase } = useApp();

  const [input, setInput]               = useState('');
  const [translating, setTranslating]   = useState(false);
  const [result, setResult]             = useState(null); // { pt, en, phonetic, tip }
  const [isSpeaking, setIsSpeaking]     = useState(false);

  // Frases criadas hoje (mais recentes primeiro)
  const today = todayKey();
  const todayPhrases = (aiPhrases || []).filter((p) => p.date === today);
  const dailyCount   = todayPhrases.length;
  const reachedLimit = dailyCount >= SPEAK_AI_MAX_PER_DAY;

  const wordCount = input.trim() ? input.trim().split(/\s+/).filter(Boolean).length : 0;
  const tooManyWords = wordCount > SPEAK_AI_MAX_WORDS;

  const [isRecording, setIsRecording]   = useState(false);
  const [analyzing, setAnalyzing]       = useState(false);
  const [feedback, setFeedback]         = useState(null); // { pron, fluency, clarity, message, transcript }

  const recordingRef = useRef(null);
  const isMounted    = useRef(true);
  const scrollRef    = useRef(null);
  const pulseAnim    = useRef(new Animated.Value(1)).current;

  // ── Animated bar values for feedback (0–100) ────────────────────────────────
  const barPron    = useRef(new Animated.Value(0)).current;
  const barFluency = useRef(new Animated.Value(0)).current;
  const barClarity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    isMounted.current = true;
    Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
    return () => {
      isMounted.current = false;
      Speech.stop();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  // ── Tradução ───────────────────────────────────────────────────────────────
  const handleTranslate = async (text) => {
    const phrase = (text ?? input).trim();
    if (!phrase) {
      Alert.alert('Atenção', 'Digite uma frase em português primeiro.');
      return;
    }
    const wc = phrase.split(/\s+/).filter(Boolean).length;
    if (wc > SPEAK_AI_MAX_WORDS) {
      Alert.alert(
        'Frase muito longa',
        `As frases devem ter no máximo ${SPEAK_AI_MAX_WORDS} palavras. A sua tem ${wc}.`,
      );
      return;
    }
    if (reachedLimit) {
      Alert.alert(
        'Limite diário atingido',
        `Você já criou ${SPEAK_AI_MAX_PER_DAY} frases hoje. Apague alguma da lista para criar uma nova.`,
      );
      return;
    }

    setTranslating(true);
    setFeedback(null);
    setResult(null);
    try {
      const data = await translatePhrase(phrase);
      if (!isMounted.current) return;

      const newResult = {
        pt: phrase,
        en: data.translation || '',
        phonetic: data.phonetic || '',
        tip: data.tip || '',
      };

      // Persiste na conta do usuário (lista do dia)
      const saved = addAiPhrase(newResult);
      if (!saved.ok) {
        Alert.alert('Não foi possível salvar', saved.reason || 'Tente novamente.');
        return;
      }

      setResult({ ...newResult, id: saved.phrase.id });
      setInput('');
      // Auto-play da pronúncia
      setTimeout(() => speakEnglish(newResult.en), 350);
    } catch (e) {
      Alert.alert('Erro', e.message || 'Não foi possível traduzir.');
    } finally {
      if (isMounted.current) setTranslating(false);
    }
  };

  // Reabre uma frase salva (sem chamar API novamente) e leva o foco ao topo
  const handleOpenSaved = (p) => {
    setResult({ id: p.id, pt: p.pt, en: p.en, phonetic: p.phonetic, tip: p.tip });
    setFeedback(null);
    // Sobe para mostrar o card de resultado com o botão "Repetir frase"
    setTimeout(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      speakEnglish(p.en);
    }, 200);
  };

  const handleDeletePhrase = (id) => {
    Alert.alert(
      'Apagar frase',
      'Tem certeza que deseja apagar esta frase da sua lista de hoje?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Apagar', style: 'destructive',
          onPress: () => {
            removeAiPhrase(id);
            if (result?.id === id) setResult(null);
          },
        },
      ],
    );
  };

  // ── Text-to-speech ─────────────────────────────────────────────────────────
  const speakEnglish = (text) => {
    if (!text) return;
    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(text, {
      language: 'en-US',
      rate: 0.9,
      onDone:    () => isMounted.current && setIsSpeaking(false),
      onStopped: () => isMounted.current && setIsSpeaking(false),
      onError:   () => isMounted.current && setIsSpeaking(false),
    });
  };

  // ── Gravação ───────────────────────────────────────────────────────────────
  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.18, duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(pulseAnim, { toValue: 1,    duration: 600, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    ).start();
  };
  const stopPulse = () => {
    pulseAnim.stopAnimation();
    Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleStartRecording = async () => {
    if (!result?.en) return;
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== 'granted') {
        Alert.alert('Microfone', 'Precisamos da permissão do microfone para praticar.');
        return;
      }
      Speech.stop();
      const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
      recordingRef.current = recording;
      setIsRecording(true);
      setFeedback(null);
      startPulse();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
    }
  };

  const handleStopRecording = async () => {
    stopPulse();
    setIsRecording(false);
    setAnalyzing(true);

    const rec = recordingRef.current;
    recordingRef.current = null;
    let uri = null;
    try {
      if (rec) {
        uri = rec.getURI();
        await rec.stopAndUnloadAsync();
        await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      }
    } catch (e) {
      console.warn('[SpeakingAI] erro ao parar gravação:', e);
    }

    if (!uri) {
      setAnalyzing(false);
      Alert.alert('Sem áudio', 'Não foi possível obter a gravação.');
      return;
    }

    try {
      const transcript = await transcribeAudio(uri, result.en);
      const pron       = calculateScore(result.en, transcript);
      // Aproximações para Fluidez e Clareza com pequena variação determinística
      const fluency = Math.max(0, Math.min(100, Math.round(pron * 0.92 + (transcript.length > 0 ? 6 : 0))));
      const clarity = Math.max(0, Math.min(100, Math.round(pron * 1.02)));

      const message =
        pron >= 90 ? 'Excelente! Sua pronúncia ficou muito natural.' :
        pron >= 75 ? 'Ótima pronúncia. Tente falar um pouco mais devagar.' :
        pron >= 55 ? 'Bom! Atenção à entonação e pronuncie cada palavra com clareza.' :
                     'Continue praticando — ouça novamente e repita devagar, sílaba por sílaba.';

      if (!isMounted.current) return;
      setFeedback({ pron, fluency, clarity, message, transcript });
      animateBars(pron, fluency, clarity);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível analisar sua pronúncia.');
    } finally {
      if (isMounted.current) setAnalyzing(false);
    }
  };

  const animateBars = (p, f, c) => {
    barPron.setValue(0); barFluency.setValue(0); barClarity.setValue(0);
    Animated.stagger(120, [
      Animated.timing(barPron,    { toValue: p, duration: 800, useNativeDriver: false, easing: Easing.out(Easing.cubic) }),
      Animated.timing(barFluency, { toValue: f, duration: 800, useNativeDriver: false, easing: Easing.out(Easing.cubic) }),
      Animated.timing(barClarity, { toValue: c, duration: 800, useNativeDriver: false, easing: Easing.out(Easing.cubic) }),
    ]).start();
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <LockedContent feature="Speak AI" description="Tradutor inteligente e tutor de pronúncia com IA.">
      <SafeAreaView style={styles.container} edges={['top']}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.kicker}>SPEAKING AI</Text>
              <Text style={styles.title}>Treine inglês com IA</Text>
              <Text style={styles.subtitle}>
                Transforme frases da sua rotina em prática real de speaking.
              </Text>
            </View>
            <View style={styles.headerIconWrap}>
              <View style={styles.headerIconGlow} />
              <View style={styles.headerIcon}>
                <Ionicons name="mic" size={26} color="#FFF" />
              </View>
            </View>
          </View>

        {/* Card principal */}
        <View style={styles.mainCard}>
          <Text style={styles.cardLabel}>O que você quer dizer hoje?</Text>

          <View style={styles.inputWrap}>
            <TextInput
              style={styles.input}
              placeholder="Ex: Preciso terminar esse projeto hoje."
              placeholderTextColor={GRAY2}
              value={input}
              onChangeText={setInput}
              multiline
              textAlignVertical="top"
            />
          </View>

          {/* Contadores: palavras + frases do dia */}
          <View style={styles.metaRow}>
            <Text style={[styles.metaWord, tooManyWords && { color: RED }]}>
              {wordCount}/{SPEAK_AI_MAX_WORDS} palavras
            </Text>
            <Text style={[styles.metaCount, reachedLimit && { color: RED }]}>
              {dailyCount}/{SPEAK_AI_MAX_PER_DAY} frases hoje
            </Text>
          </View>

          <TouchableOpacity
            style={[
              styles.btnPrimary,
              (translating || !input.trim() || tooManyWords || reachedLimit) && { opacity: 0.5 },
            ]}
            onPress={() => handleTranslate()}
            activeOpacity={0.88}
            disabled={translating || !input.trim() || tooManyWords || reachedLimit}
          >
            {translating
              ? <ActivityIndicator color="#FFF" />
              : (<>
                  <Ionicons name="sparkles" size={18} color="#FFF" />
                  <Text style={styles.btnPrimaryText}>
                    {reachedLimit ? 'Limite diário atingido' : 'Traduzir e praticar'}
                  </Text>
                </>)
            }
          </TouchableOpacity>
        </View>

        {/* Resultado da IA */}
        {result && (
          <View style={styles.resultCard}>
            <View style={styles.langRow}>
              <Text style={styles.flag}>🇧🇷</Text>
              <Text style={styles.langLabel}>Português</Text>
            </View>
            <Text style={styles.ptText}>{result.pt}</Text>

            <View style={styles.divider} />

            <View style={styles.langRow}>
              <Text style={styles.flag}>🇺🇸</Text>
              <Text style={styles.langLabel}>Inglês</Text>
            </View>
            <Text style={styles.enText}>{result.en}</Text>
            {!!result.phonetic && (
              <Text style={styles.phonetic}>/{result.phonetic}/</Text>
            )}

            {/* Player */}
            <TouchableOpacity
              style={[styles.playerBtn, isSpeaking && styles.playerBtnActive]}
              onPress={() => speakEnglish(result.en)}
              activeOpacity={0.85}
            >
              <Ionicons
                name={isSpeaking ? 'volume-high' : 'volume-medium-outline'}
                size={20}
                color={isSpeaking ? '#FFF' : PURPLE}
              />
              <Text style={[styles.playerBtnText, isSpeaking && { color: '#FFF' }]}>
                {isSpeaking ? 'Reproduzindo...' : 'Ouvir pronúncia'}
              </Text>
            </TouchableOpacity>

            {/* Prática de speaking */}
            <View style={styles.practiceBlock}>
              <Text style={styles.practiceLabel}>SUA VEZ DE FALAR</Text>

              {!isRecording && !analyzing && (
                <TouchableOpacity
                  style={styles.recordBtn}
                  onPress={handleStartRecording}
                  activeOpacity={0.88}
                >
                  <Ionicons name="mic" size={22} color="#FFF" />
                  <Text style={styles.recordBtnText}>Repetir frase</Text>
                </TouchableOpacity>
              )}

              {isRecording && (
                <View style={styles.recordingArea}>
                  <Animated.View style={[styles.micPulse, { transform: [{ scale: pulseAnim }] }]}>
                    <View style={styles.micPulseGlow} />
                    <TouchableOpacity
                      style={styles.micCircle}
                      onPress={handleStopRecording}
                      activeOpacity={0.85}
                    >
                      <Ionicons name="stop" size={36} color="#FFF" />
                    </TouchableOpacity>
                  </Animated.View>
                  <View style={styles.waveRow}>
                    {[8, 14, 22, 16, 28, 18, 24, 12, 20, 10].map((h, i) => (
                      <WaveBar key={i} delay={i * 80} height={h} />
                    ))}
                  </View>
                  <Text style={styles.recordingHint}>Gravando... toque para parar</Text>
                </View>
              )}

              {analyzing && (
                <View style={styles.analyzingArea}>
                  <ActivityIndicator color={PURPLE} size="large" />
                  <Text style={styles.analyzingText}>Analisando sua pronúncia com IA...</Text>
                </View>
              )}
            </View>

            {/* Feedback */}
            {feedback && (
              <View style={styles.feedbackBox}>
                <Text style={styles.feedbackTitle}>Feedback da IA</Text>
                <FeedbackBar label="Pronúncia" value={feedback.pron}    anim={barPron} />
                <FeedbackBar label="Fluidez"   value={feedback.fluency} anim={barFluency} />
                <FeedbackBar label="Clareza"   value={feedback.clarity} anim={barClarity} />

                {!!feedback.transcript && (
                  <View style={styles.transcriptBox}>
                    <Text style={styles.transcriptLabel}>Você disse:</Text>
                    <Text style={styles.transcriptText}>"{feedback.transcript}"</Text>
                  </View>
                )}
                <Text style={styles.feedbackMessage}>{feedback.message}</Text>

                {!!result.tip && (
                  <View style={styles.tipBox}>
                    <Ionicons name="bulb-outline" size={16} color={YELLOW} />
                    <Text style={styles.tipText}>{result.tip}</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        )}

        {/* Frases do dia (criadas pelo usuário) */}
        {todayPhrases.length > 0 && (
          <>
            <View style={styles.sectionHead}>
              <Text style={styles.sectionLabel}>Suas frases de hoje</Text>
              <View style={styles.sectionBadge}>
                <Text style={styles.sectionBadgeText}>{dailyCount}/{SPEAK_AI_MAX_PER_DAY}</Text>
              </View>
            </View>

            <Text style={styles.phrasesHint}>
              Toque em uma frase para praticar novamente
            </Text>

            <View style={styles.phrasesList}>
              {todayPhrases.map((p) => (
                <View key={p.id} style={styles.phraseItem}>
                  <TouchableOpacity
                    style={styles.phraseItemMain}
                    onPress={() => handleOpenSaved(p)}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.phraseItemEn} numberOfLines={2}>{p.en}</Text>
                    <Text style={styles.phraseItemPt} numberOfLines={2}>{p.pt}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.phraseItemPlay}
                    onPress={() => speakEnglish(p.en)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="volume-medium" size={18} color={PURPLE} />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.phraseItemPractice}
                    onPress={() => handleOpenSaved(p)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="mic" size={18} color="#FFF" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.phraseItemDel}
                    onPress={() => handleDeletePhrase(p.id)}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="trash-outline" size={18} color={RED} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Sugestões */}
        <Text style={styles.sectionLabel}>Frases para praticar</Text>
        <View style={styles.suggestRow}>
          {SUGGESTED.map((s, i) => (
            <TouchableOpacity
              key={i}
              style={styles.suggestCard}
              onPress={() => { setInput(s.phrase); handleTranslate(s.phrase); }}
              activeOpacity={0.85}
            >
              <Text style={styles.suggestEmoji}>{s.icon}</Text>
              <Text style={styles.suggestLabel}>{s.label}</Text>
              <Text style={styles.suggestPhrase} numberOfLines={2}>{s.phrase}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
    </LockedContent>
  );
}

// ── Sub-componentes ──────────────────────────────────────────────────────────
function FeedbackBar({ label, value, anim }) {
  const widthInterp = anim.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });
  const color = value >= 80 ? GREEN : value >= 60 ? PURPLE : YELLOW;
  return (
    <View style={styles.fbRow}>
      <View style={styles.fbHead}>
        <Text style={styles.fbLabel}>{label}</Text>
        <Text style={[styles.fbValue, { color }]}>{value}%</Text>
      </View>
      <View style={styles.fbTrack}>
        <Animated.View style={[styles.fbFill, { width: widthInterp, backgroundColor: color }]} />
      </View>
    </View>
  );
}

function WaveBar({ delay, height }) {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, { toValue: 1,   duration: 380, delay, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
        Animated.timing(anim, { toValue: 0.4, duration: 380, useNativeDriver: true, easing: Easing.inOut(Easing.ease) }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, []);
  return (
    <Animated.View
      style={{
        width: 4, height, borderRadius: 2,
        marginHorizontal: 3, backgroundColor: PURPLE,
        transform: [{ scaleY: anim }],
      }}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG },
  scroll:    { paddingHorizontal: 20, paddingBottom: 48, paddingTop: 8 },

  // Header
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingTop: 4, paddingBottom: 18,
  },
  kicker: {
    fontSize: 11, fontWeight: '900', letterSpacing: 2,
    color: PURPLE, marginBottom: 6,
  },
  title:    { fontSize: 26, fontWeight: '900', color: '#FFFFFF', lineHeight: 32 },
  subtitle: { fontSize: 13, color: GRAY, marginTop: 6, lineHeight: 19 },

  headerIconWrap: { width: 60, height: 60, alignItems: 'center', justifyContent: 'center' },
  headerIconGlow: {
    position: 'absolute', width: 70, height: 70, borderRadius: 35,
    backgroundColor: PURPLE, opacity: 0.35,
  },
  headerIcon: {
    width: 54, height: 54, borderRadius: 18,
    backgroundColor: PURPLE, alignItems: 'center', justifyContent: 'center',
    shadowColor: PURPLE, shadowOpacity: 0.6,
    shadowOffset: { width: 0, height: 6 }, shadowRadius: 18, elevation: 10,
  },

  // Card principal
  mainCard: {
    backgroundColor: CARD, borderRadius: 22, padding: 18,
    borderWidth: 1, borderColor: BORDER, gap: 14, marginBottom: 16,
  },
  cardLabel: { fontSize: 14, fontWeight: '800', color: '#FFF' },
  inputWrap: {
    backgroundColor: BG, borderRadius: 16,
    borderWidth: 1.5, borderColor: BORDER, padding: 14, minHeight: 92,
  },
  input: { fontSize: 15, color: '#FFFFFF', minHeight: 64, lineHeight: 22 },

  metaRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginTop: -4,
  },
  metaWord:  { fontSize: 11, fontWeight: '700', color: GRAY, letterSpacing: 0.5 },
  metaCount: { fontSize: 11, fontWeight: '700', color: GRAY, letterSpacing: 0.5 },

  btnPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 10, backgroundColor: PURPLE, borderRadius: 16,
    paddingVertical: 16,
    shadowColor: PURPLE, shadowOpacity: 0.55,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 20, elevation: 10,
  },
  btnPrimaryText: { fontSize: 15, fontWeight: '800', color: '#FFF', letterSpacing: 0.3 },

  // Resultado
  resultCard: {
    backgroundColor: CARD, borderRadius: 22, padding: 18,
    borderWidth: 1, borderColor: BORDER, gap: 8, marginBottom: 16,
  },
  langRow:   { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 6 },
  flag:      { fontSize: 18 },
  langLabel: { fontSize: 11, fontWeight: '900', color: GRAY, letterSpacing: 1.5 },
  ptText:    { fontSize: 15, color: '#CCCCDD', fontWeight: '500' },
  enText:    { fontSize: 20, color: '#FFFFFF', fontWeight: '800', lineHeight: 26 },
  phonetic:  { fontSize: 13, color: PURPLE, fontStyle: 'italic', marginTop: 2 },
  divider:   { height: 1, backgroundColor: BORDER, marginVertical: 10 },

  // Player
  playerBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    marginTop: 14, backgroundColor: 'rgba(123,47,255,0.12)',
    borderWidth: 1.5, borderColor: PURPLE + '55',
    borderRadius: 14, paddingVertical: 13,
  },
  playerBtnActive: { backgroundColor: PURPLE, borderColor: PURPLE },
  playerBtnText:   { fontSize: 14, fontWeight: '800', color: PURPLE },

  // Prática
  practiceBlock: {
    marginTop: 16, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: BORDER, gap: 12,
  },
  practiceLabel: {
    fontSize: 11, fontWeight: '900', color: GRAY,
    letterSpacing: 1.5,
  },
  recordBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    backgroundColor: RED, borderRadius: 16, paddingVertical: 16,
    shadowColor: RED, shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 8,
  },
  recordBtnText: { fontSize: 15, fontWeight: '800', color: '#FFF' },

  recordingArea: { alignItems: 'center', gap: 14, paddingVertical: 14 },
  micPulse: { width: 96, height: 96, alignItems: 'center', justifyContent: 'center' },
  micPulseGlow: {
    position: 'absolute', width: 110, height: 110, borderRadius: 55,
    backgroundColor: RED, opacity: 0.35,
  },
  micCircle: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: RED,
    alignItems: 'center', justifyContent: 'center',
  },
  waveRow:       { flexDirection: 'row', alignItems: 'center', height: 30 },
  recordingHint: { fontSize: 12, color: GRAY, fontWeight: '600' },

  analyzingArea: { alignItems: 'center', gap: 12, paddingVertical: 16 },
  analyzingText: { fontSize: 13, color: GRAY, fontWeight: '600' },

  // Feedback
  feedbackBox: {
    marginTop: 16, paddingTop: 16,
    borderTopWidth: 1, borderTopColor: BORDER, gap: 12,
  },
  feedbackTitle: { fontSize: 14, fontWeight: '900', color: '#FFF', marginBottom: 4 },
  fbRow:  { gap: 6 },
  fbHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  fbLabel: { fontSize: 13, fontWeight: '700', color: '#CCCCDD' },
  fbValue: { fontSize: 13, fontWeight: '900' },
  fbTrack: { height: 8, backgroundColor: BORDER, borderRadius: 4, overflow: 'hidden' },
  fbFill:  { height: '100%', borderRadius: 4 },

  transcriptBox: {
    backgroundColor: BG, borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: BORDER, gap: 4, marginTop: 4,
  },
  transcriptLabel: { fontSize: 11, color: GRAY, fontWeight: '700', letterSpacing: 1 },
  transcriptText:  { fontSize: 14, color: '#FFF', fontWeight: '600' },

  feedbackMessage: {
    fontSize: 13, color: '#DDDDEE', fontWeight: '500',
    lineHeight: 20, marginTop: 4,
  },

  tipBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    backgroundColor: YELLOW + '14', borderWidth: 1, borderColor: YELLOW + '44',
    borderRadius: 12, padding: 12, marginTop: 4,
  },
  tipText: { flex: 1, fontSize: 12, color: YELLOW, fontWeight: '600', lineHeight: 18 },

  // Sugestões / lista do dia
  sectionHead: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 12, marginTop: 6,
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '900', color: GRAY,
    letterSpacing: 1.5, marginBottom: 12, marginTop: 6,
  },
  sectionBadge: {
    backgroundColor: PURPLE + '22',
    borderRadius: 10, paddingHorizontal: 10, paddingVertical: 3,
    borderWidth: 1, borderColor: PURPLE + '55',
  },
  sectionBadgeText: {
    fontSize: 11, fontWeight: '900', color: PURPLE, letterSpacing: 0.5,
  },

  phrasesList: { gap: 8, marginBottom: 18 },
  phraseItem: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: CARD, borderRadius: 14,
    borderWidth: 1, borderColor: BORDER,
    paddingVertical: 10, paddingHorizontal: 12, gap: 8,
  },
  phraseItemMain: { flex: 1, gap: 2 },
  phraseItemEn:   { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  phraseItemPt:   { fontSize: 12, color: GRAY },
  phraseItemPlay: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: PURPLE + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  phraseItemPractice: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: PURPLE,
    alignItems: 'center', justifyContent: 'center',
  },
  phraseItemDel: {
    width: 34, height: 34, borderRadius: 10,
    backgroundColor: RED + '18',
    alignItems: 'center', justifyContent: 'center',
  },
  phrasesHint: {
    fontSize: 12, color: GRAY, fontWeight: '500',
    marginBottom: 10, marginTop: -4, fontStyle: 'italic',
  },
  suggestRow: {
    flexDirection: 'row', flexWrap: 'wrap', gap: 10,
  },
  suggestCard: {
    width: '47.5%', backgroundColor: CARD, borderRadius: 16,
    padding: 14, borderWidth: 1, borderColor: BORDER, gap: 6,
  },
  suggestEmoji:  { fontSize: 22 },
  suggestLabel:  { fontSize: 12, fontWeight: '900', color: PURPLE, letterSpacing: 0.5 },
  suggestPhrase: { fontSize: 12, color: '#CCCCDD', fontWeight: '500', lineHeight: 17 },
});
