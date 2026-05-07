import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
  Animated, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { useApp } from '../../context/AppContext';
import { calculateScore, getFeedback } from '../../utils/similarity';
import WaveformAnimation from '../../components/WaveformAnimation';
import { transcribeAudio } from '../../services/speechService';
import { isApiConfigured } from '../../config/apiConfig';

import { PURPLE, PINK, YELLOW, GREEN, RED, BG, CARD, BORDER, GRAY } from '../../theme/colors';
const BLUE = PURPLE;

const DEMO_PHRASE = {
  english:    'Hello!',
  portuguese: 'Olá!',
  phonetic:   'hê-lôu',
};

const RECORDING_OPTIONS = {
  android: {
    extension: '.m4a',
    outputFormat: Audio.AndroidOutputFormat?.MPEG_4,
    audioEncoder: Audio.AndroidAudioEncoder?.AAC,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  ios: {
    extension: '.m4a',
    outputFormat: Audio.IOSOutputFormat?.MPEG4AAC,
    audioQuality: Audio.IOSAudioQuality?.HIGH,
    sampleRate: 44100,
    numberOfChannels: 1,
    bitRate: 128000,
  },
  web: {},
};

// step: 'listen' | 'record' | 'analyzing' | 'result'
export default function DemoLessonScreen() {
  const navigation   = useNavigation();
  const { completeOnboarding, updateProfile } = useApp();

  const [step,       setStep]       = useState('listen');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isRecording,setIsRecording]= useState(false);
  const [score,      setScore]      = useState(null);
  const [transcribed,setTranscribed]= useState('');

  const recordingRef = useRef(null);
  const isMounted    = useRef(true);
  const pulseAnim    = useRef(new Animated.Value(1)).current;
  const resultAnim   = useRef(new Animated.Value(0)).current;

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

  // Auto-play ao montar
  useEffect(() => {
    setTimeout(() => playPhrase(), 600);
  }, []);

  const playPhrase = () => {
    Speech.stop();
    setIsSpeaking(true);
    Speech.speak(DEMO_PHRASE.english, {
      language: 'en-US', rate: 0.85,
      onDone:    () => isMounted.current && setIsSpeaking(false),
      onStopped: () => isMounted.current && setIsSpeaking(false),
      onError:   () => isMounted.current && setIsSpeaking(false),
    });
  };

  const startPulse = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.2, duration: 600, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1,   duration: 600, useNativeDriver: true }),
      ])
    ).start();
  };

  const stopPulse = () => {
    pulseAnim.stopAnimation();
    Animated.spring(pulseAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleRecord = async () => {
    try {
      const perm = await Audio.requestPermissionsAsync();
      if (perm.status !== 'granted') {
        simulateResult();
        return;
      }
      const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
      recordingRef.current = recording;
      setIsRecording(true);
      setStep('record');
      startPulse();
    } catch {
      simulateResult();
    }
  };

  const handleStop = async () => {
    stopPulse();
    setIsRecording(false);
    setStep('analyzing');

    // Guardar ref antes de parar (getURI deve ser chamado antes de stopAndUnloadAsync)
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
      console.warn('[DemoLesson] erro ao parar gravação:', e);
    }

    if (!isApiConfigured()) {
      Alert.alert('API não configurada', 'A key da OpenAI não foi reconhecida. Verifique o arquivo apiConfig.js.');
      setTimeout(() => simulateResult(), 1200);
      return;
    }
    if (!uri) {
      Alert.alert('Sem áudio', 'Não foi possível obter o arquivo de gravação. Tente novamente.');
      setTimeout(() => simulateResult(), 1200);
      return;
    }

    try {
      const transcript = await transcribeAudio(uri, DEMO_PHRASE.english);
      const s = calculateScore(DEMO_PHRASE.english, transcript);
      if (isMounted.current) {
        setScore(s);
        setTranscribed(transcript);
        setStep('result');
        Animated.spring(resultAnim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
        setTimeout(() => {
          const msg = s >= 80 ? 'Muito bem! Você está indo ótimo!' : 'Bom começo! Continue praticando!';
          Speech.speak(msg, { language: 'pt-BR', rate: 0.95 });
        }, 500);
      }
    } catch (e) {
      Alert.alert('Erro Whisper', e?.message ?? String(e));
      if (isMounted.current) simulateResult();
    }
  };

  const simulateResult = () => {
    const simScore = 72 + Math.floor(Math.random() * 22);
    if (isMounted.current) {
      setScore(simScore);
      setTranscribed(DEMO_PHRASE.english);
      setStep('result');
      Animated.spring(resultAnim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
      setTimeout(() => {
        const msg = simScore >= 80
          ? 'Muito bem! Você está indo ótimo!'
          : 'Bom começo! Continue praticando!';
        Speech.speak(msg, { language: 'pt-BR', rate: 0.95 });
      }, 500);
    }
  };

  const handleFinish = () => {
    completeOnboarding();
    navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
  };

  const feedback = score !== null ? getFeedback(score) : null;

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Progresso */}
      <View style={styles.progressRow}>
        {[1, 2, 3, 4].map((s) => (
          <View key={s} style={[styles.progressDot, styles.progressDotActive]} />
        ))}
      </View>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.step}>Passo 4 de 4 · Aula Demonstrativa</Text>
        <Text style={styles.title}>
          {step === 'listen'   ? 'Ouça a frase 👂' :
           step === 'record'   ? 'Agora é sua vez! 🎙️' :
           step === 'analyzing'? 'Analisando...' :
                                 `${feedback?.emoji ?? '⭐'} ${feedback?.label ?? 'Resultado'}`}
        </Text>
        <Text style={styles.subtitle}>
          {step === 'listen'    ? 'Ouça com atenção e prepare-se para repetir' :
           step === 'record'    ? 'Repita a frase em inglês' :
           step === 'analyzing' ? 'Avaliando sua pronúncia com IA...' :
                                  feedback?.message ?? ''}
        </Text>
      </View>

      {/* Cartão da frase */}
      <View style={styles.phraseCard}>
        <Text style={styles.phraseEn}>{DEMO_PHRASE.english}</Text>
        <Text style={styles.phonetic}>/{DEMO_PHRASE.phonetic}/</Text>
        <Text style={styles.phrasePt}>{DEMO_PHRASE.portuguese}</Text>
      </View>

      {/* Área central */}
      <View style={styles.center}>
        {step === 'listen' && (
          <>
            <TouchableOpacity
              style={[styles.speakerCircle, isSpeaking && styles.speakerActive]}
              onPress={playPhrase}
              activeOpacity={0.85}
            >
              <Ionicons
                name={isSpeaking ? 'volume-high' : 'volume-high-outline'}
                size={48}
                color={isSpeaking ? '#FFF' : BLUE}
              />
            </TouchableOpacity>
            <WaveformAnimation active={isSpeaking} color={BLUE} />
            <Text style={styles.hint}>
              {isSpeaking ? 'Reproduzindo...' : 'Toque para ouvir novamente'}
            </Text>
          </>
        )}

        {(step === 'record') && (
          <>
            <Animated.View style={[styles.micOuter, { transform: [{ scale: pulseAnim }] }]}>
              <TouchableOpacity style={styles.micCircle} onPress={handleStop} activeOpacity={0.85}>
                <Ionicons name="stop" size={48} color="#FFF" />
              </TouchableOpacity>
            </Animated.View>
            <WaveformAnimation active={true} color={RED} />
            <Text style={styles.hint}>Gravando... toque ■ para parar</Text>
          </>
        )}

        {step === 'analyzing' && (
          <>
            <ActivityIndicator size="large" color={BLUE} />
            <Text style={styles.hint}>Avaliando pronúncia...</Text>
          </>
        )}

        {step === 'result' && score !== null && (
          <Animated.View style={[styles.resultBox, {
            opacity: resultAnim,
            transform: [{ scale: resultAnim.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] }) }],
          }]}>
            {/* Ring de pontuação */}
            <View style={[styles.scoreRing, {
              borderColor: score >= 80 ? GREEN : score >= 60 ? BLUE : '#F59E0B',
            }]}>
              <Text style={[styles.scoreNum, {
                color: score >= 80 ? GREEN : score >= 60 ? BLUE : '#F59E0B',
              }]}>{score}</Text>
              <Text style={styles.scorePts}>pts</Text>
            </View>
            <Text style={styles.transcribedLabel}>Você disse:</Text>
            <Text style={styles.transcribedText}>"{transcribed}"</Text>
          </Animated.View>
        )}
      </View>

      {/* Botões de ação */}
      <View style={styles.btnArea}>
        {step === 'listen' && (
          <TouchableOpacity style={styles.btnPrimary} onPress={handleRecord} activeOpacity={0.88}>
            <Ionicons name="mic" size={20} color="#FFF" />
            <Text style={styles.btnPrimaryText}>Gravar minha voz</Text>
          </TouchableOpacity>
        )}

        {step === 'result' && (
          <>
            <TouchableOpacity
              style={[styles.btnPrimary, { backgroundColor: GREEN }]}
              onPress={handleFinish}
              activeOpacity={0.88}
            >
              <Ionicons name="rocket" size={20} color="#FFF" />
              <Text style={styles.btnPrimaryText}>Começar as missões!</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnGhost} onPress={() => { setStep('listen'); setScore(null); }}>
              <Text style={styles.btnGhostText}>Tentar novamente</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: BG, paddingHorizontal: 24, paddingVertical: 16 },

  progressRow: { flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 12 },
  progressDot: { width: 32, height: 5, borderRadius: 3, backgroundColor: BORDER },
  progressDotActive: { backgroundColor: PURPLE },

  header: { gap: 4, alignItems: 'center', marginBottom: 12 },
  step:     { fontSize: 11, fontWeight: '800', color: PURPLE, textTransform: 'uppercase', letterSpacing: 2 },
  title:    { fontSize: 22, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  subtitle: { fontSize: 13, color: GRAY, textAlign: 'center', lineHeight: 20, maxWidth: 280 },

  phraseCard: {
    backgroundColor: CARD, borderRadius: 18,
    padding: 20, alignItems: 'center', gap: 6,
    borderWidth: 1.5, borderColor: PURPLE + '55',
    shadowColor: PURPLE, shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 4,
  },
  phraseEn: { fontSize: 22, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  phonetic: { fontSize: 14, color: PURPLE, fontWeight: '600', fontStyle: 'italic' },
  phrasePt: { fontSize: 14, color: GRAY, fontWeight: '400' },

  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 14 },

  speakerCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: PURPLE + '22', borderWidth: 2, borderColor: PURPLE + '44',
    justifyContent: 'center', alignItems: 'center',
  },
  speakerActive: { backgroundColor: PURPLE },

  micOuter: {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: RED + '22',
    justifyContent: 'center', alignItems: 'center',
  },
  micCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: RED,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: RED, shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 16, elevation: 8,
  },
  hint: { fontSize: 13, color: GRAY, fontWeight: '500' },

  resultBox: { alignItems: 'center', gap: 12 },
  scoreRing: {
    width: 120, height: 120, borderRadius: 60,
    borderWidth: 6, justifyContent: 'center', alignItems: 'center',
    gap: 2, backgroundColor: CARD,
  },
  scoreNum: { fontSize: 38, fontWeight: '900' },
  scorePts: { fontSize: 12, fontWeight: '700', color: GRAY, marginTop: -6 },
  transcribedLabel: { fontSize: 12, color: GRAY, fontWeight: '600' },
  transcribedText:  { fontSize: 15, color: '#CCCCDD', fontWeight: '600', fontStyle: 'italic' },

  btnArea: { gap: 12, paddingBottom: 8 },
  btnPrimary: {
    backgroundColor: PURPLE, borderRadius: 18,
    paddingVertical: 18, flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', gap: 10,
    shadowColor: PURPLE, shadowOpacity: 0.45,
    shadowOffset: { width: 0, height: 8 }, shadowRadius: 18, elevation: 10,
  },
  btnPrimaryText: { fontSize: 16, fontWeight: '900', color: '#FFF' },
  btnGhost: { paddingVertical: 12, alignItems: 'center' },
  btnGhostText: { fontSize: 14, color: GRAY, fontWeight: '600' },
});
