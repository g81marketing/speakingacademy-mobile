// ─── TELA DE TREINO EM BLOCOS ─────────────────────────────────────────────────
// Fases: intro → treino (por frase) → desafio intro → teste (por frase) → resultado
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../context/AppContext';
import { getBlockForDay } from '../data/phrases';
import { BEGINNER_MISSIONS } from '../data/beginnerMissions';
import { transcribeAudio, calculateScore } from '../services/speechService';
import { getMissionInfo, getMotivationalMessage, getStarsForScore, getReviewTip } from '../data/missions';
import WaveformAnimation from '../components/WaveformAnimation';
import ProgressBar from '../components/ProgressBar';
import ScoreRing from '../components/ScoreRing';
import SpeedSelector, { TTS_RATES } from '../components/SpeedSelector';

// ─── Constantes ───────────────────────────────────────────────────────────────
const BLUE   = '#7B2FFF';
const RED    = '#FF4D4D';
const GREEN  = '#00E5A0';
const AMBER  = '#7B2FFF';  // unified to PURPLE
const PURPLE = '#7B2FFF';

const MAX_RECORD_SECS        = 15;
const CHALLENGE_SECS         = 10;   // timer do modo desafio
const MAX_TRAIN_ATTEMPTS     = 3;

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getScoreColor(score) {
  if (score >= 90) return '#00E5A0';
  if (score >= 70) return '#7B2FFF';
  if (score >= 50) return '#9999BB';
  return '#FF4D4D';
}

function getBlockClassification(avg) {
  if (avg >= 90) return { label: '🏆 Dominado!',  color: '#00E5A0', desc: 'Excelente! Você dominou este bloco.' };
  if (avg >= 70) return { label: '⭐ Bom trabalho!', color: '#7B2FFF',  desc: 'Ótimo! Continue praticando para dominar.' };
  return             { label: '🔄 Revisar',       color: '#9999BB', desc: 'Pratique mais — este bloco precisa de reforço.' };
}

// ─── Tela principal ───────────────────────────────────────────────────────────
export default function BlockScreen() {
  const navigation  = useNavigation();
  const route       = useRoute();
  const { block }   = route.params; // { blockNumber, totalBlocks, phrases:[...], dialogueMode? }
  const { userSelectedLevel, completePhrase, completeMission, challengeMode, ttsSpeed, setTtsSpeed } = useApp();

  const phrases      = block.phrases;
  const BLOCK_SIZE    = phrases.length;          // 5 frases normais ou 4 no modo diálogo
  const isDialogue    = !!block.dialogueMode;    // exibe contexto do diálogo

  // ── Máquina de estados ────────────────────────────────────────────────────
  // 'intro' | 'train_listen' | 'train_practice' |
  // 'challenge_intro' | 'test_listen' | 'test_record' | 'test_analyzing' | 'result'
  const [phase,         setPhase]         = useState('intro');
  const [phraseIdx,     setPhraseIdx]     = useState(0);
  const [trainAttempts, setTrainAttempts] = useState(0);

  // ── Áudio / gravação ──────────────────────────────────────────────────────
  const [isSpeaking,   setIsSpeaking]   = useState(false);
  const [hasPermission,setHasPermission] = useState(null);
  const [isRecording,  setIsRecording]  = useState(false);
  const [audioUri,     setAudioUri]     = useState(null);
  const [recordSecs,   setRecordSecs]   = useState(0);

  const recordingRef = useRef(null);
  const timerRef     = useRef(null);
  const isMounted    = useRef(true);

  // ── Resultados do treino (análise por frase) ──────────────────────────────
  const [trainAnalysisResult, setTrainAnalysisResult] = useState(null); // {score, transcribed}

  // ── Resultados do teste (análise por frase) ──────────────────────────
  const [testResults,     setTestResults]     = useState([]); // [{score, transcribed, phrase}]
  const [challengeTimer,  setChallengeTimer]  = useState(CHALLENGE_SECS);
  const [missionStars,    setMissionStars]    = useState(0);
  const challengeTimerRef = useRef(null);
  const starAnim1 = useRef(new Animated.Value(0)).current;
  const starAnim2 = useRef(new Animated.Value(0)).current;
  const starAnim3 = useRef(new Animated.Value(0)).current;

  // ── Inicialização ─────────────────────────────────────────────────────────
  useEffect(() => {
    isMounted.current = true;
    setupAudio();
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, []);

  // Auto-play ao entrar em fases de escuta
  useEffect(() => {
    if (phase === 'train_listen') playEnglish();
    if (phase === 'test_listen')  isDialogue ? playEnglish() : playPortuguese();
  }, [phase, phraseIdx]);

  // Auto-stop gravação quando atinge o limite
  useEffect(() => {
    if (recordSecs >= MAX_RECORD_SECS && isRecording) stopRecording();
  }, [recordSecs, isRecording]);

  // Disparar análise de treino assim que audioUri estiver pronto
  useEffect(() => {
    if (phase === 'train_analyzing' && audioUri) analyzeTrainRecording();
  }, [phase, audioUri]);

  // Disparar análise assim que audioUri estiver pronto na fase de teste
  useEffect(() => {
    if (phase === 'test_analyzing' && audioUri) analyzeTestRecording();
  }, [phase, audioUri]);

  // Challenge mode: countdown durante test_record
  useEffect(() => {
    if (phase === 'test_record' && challengeMode) {
      setChallengeTimer(CHALLENGE_SECS);
      challengeTimerRef.current = setInterval(() => {
        setChallengeTimer((t) => {
          if (t <= 1) {
            clearInterval(challengeTimerRef.current);
            handleTestStopAndAnalyze();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(challengeTimerRef.current);
  }, [phase]);

  // Animação das estrelas ao entrar na fase de resultado
  useEffect(() => {
    if (phase === 'result' && missionStars > 0) {
      const anims = [starAnim1, starAnim2, starAnim3];
      Animated.stagger(180, anims.slice(0, missionStars).map((a) =>
        Animated.spring(a, { toValue: 1, useNativeDriver: true, friction: 4 })
      )).start();
    }
  }, [phase, missionStars]);

  // ── Áudio ─────────────────────────────────────────────────────────────────
  const setupAudio = async () => {
    const { status } = await Audio.requestPermissionsAsync();
    if (isMounted.current) setHasPermission(status === 'granted');
    await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
  };

  const cleanup = () => {
    Speech.stop();
    clearInterval(timerRef.current);
    clearInterval(challengeTimerRef.current);
    if (recordingRef.current) {
      recordingRef.current.stopAndUnloadAsync().catch(() => {});
      recordingRef.current = null;
    }
  };

  const playEnglish = () => {
    Speech.stop();
    const p = phrases[phraseIdx];
    if (!p) return;
    setIsSpeaking(true);
    Speech.speak(p.english, {
      language: 'en-US', rate: TTS_RATES[ttsSpeed] ?? 1.0,
      onDone:    () => isMounted.current && setIsSpeaking(false),
      onStopped: () => isMounted.current && setIsSpeaking(false),
      onError:   () => isMounted.current && setIsSpeaking(false),
    });
  };

  const playPortuguese = () => {
    Speech.stop();
    const p = phrases[phraseIdx];
    if (!p) return;
    setIsSpeaking(true);
    Speech.speak(p.portuguese, {
      language: 'pt-BR', rate: TTS_RATES[ttsSpeed] ?? 1.0,
      onDone:    () => isMounted.current && setIsSpeaking(false),
      onStopped: () => isMounted.current && setIsSpeaking(false),
      onError:   () => isMounted.current && setIsSpeaking(false),
    });
  };

  // ── Gravação ──────────────────────────────────────────────────────────────
  const startRecording = async () => {
    if (!hasPermission) {
      Alert.alert('Permissão necessária', 'Permita o acesso ao microfone nas configurações.');
      return;
    }
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true });
      const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
      recordingRef.current = recording;
      setIsRecording(true);
      setAudioUri(null);
      setRecordSecs(0);
      timerRef.current = setInterval(() => setRecordSecs((s) => s + 1), 1000);
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

  // ── Navegação entre fases ─────────────────────────────────────────────────
  const startTraining = () => {
    setPhraseIdx(0);
    setTrainAttempts(0);
    setAudioUri(null);
    setPhase('train_listen');
  };

  const handleTrainRecord = async () => {
    setAudioUri(null);
    setTrainAttempts(0);
    setPhase('train_practice');
    await startRecording();
  };

  const handleTrainStopRecord = async () => {
    await stopRecording();
    setTrainAttempts((a) => a + 1);
    setPhase('train_analyzing');
  };

  const analyzeTrainRecording = async () => {
    const phrase = phrases[phraseIdx];
    let score = 0;
    let transcribed = '';
    try {
      // Envia o áudio para o backend (Whisper) — fallback para simulação se falhar
      transcribed = await transcribeAudio(audioUri, phrase.english);
      score = calculateScore(phrase.english, transcribed);
    } catch (err) {
      console.error('Erro na análise de fala:', err);
    }
    if (!isMounted.current) return;
    setTrainAnalysisResult({ score, transcribed });
    setAudioUri(null);
    setPhase('train_result');
  };

  const handleTrainRetry = async () => {
    setTrainAnalysisResult(null);
    setAudioUri(null);
    setPhase('train_practice');
    await startRecording();
  };

  const handleTrainNext = () => {
    Speech.stop();
    setAudioUri(null);
    setTrainAttempts(0);
    setTrainAnalysisResult(null);
    const nextIdx = phraseIdx + 1;
    if (nextIdx < BLOCK_SIZE) {
      setPhraseIdx(nextIdx);
      setPhase('train_listen');
    } else {
      setPhase('challenge_intro');
    }
  };

  const handleTestStart = () => {
    setPhraseIdx(0);
    setTestResults([]);
    setAudioUri(null);
    setPhase('test_listen');
  };

  const handleTestRecord = async () => {
    setAudioUri(null);
    setPhase('test_record');
    await startRecording();
  };

  const handleTestStopAndAnalyze = async () => {
    await stopRecording();
    setPhase('test_analyzing');
  };

  const analyzeTestRecording = async () => {
    const phrase = phrases[phraseIdx];
    let score = 0;
    let transcribed = '';
    try {
      // Envia o áudio para o backend (Whisper) — fallback para simulação se falhar
      transcribed = await transcribeAudio(audioUri, phrase.english);
      score = calculateScore(phrase.english, transcribed);
    } catch (err) {
      console.error('Erro na análise de fala:', err);
    }

    const updated = [...testResults, { score, transcribed, phrase }];

    if (!isMounted.current) return;
    setTestResults(updated);
    setAudioUri(null);

    const nextIdx = phraseIdx + 1;
    if (nextIdx < BLOCK_SIZE) {
      setPhraseIdx(nextIdx);
      setPhase('test_listen');
    } else {
      updated.forEach((r) => completePhrase(r.phrase.level, r.phrase.day ?? null, r.score, false));
      const avg = Math.round(updated.reduce((s, r) => s + r.score, 0) / updated.length);
      const stars = completeMission(block.blockNumber, avg);
      if (isMounted.current) {
        setMissionStars(stars);
        starAnim1.setValue(0); starAnim2.setValue(0); starAnim3.setValue(0);
        // Feedback sonoro baseado nas estrelas conquistadas
        const speechMsg =
          stars === 3 ? 'Excelente! Missão dominada com três estrelas!' :
          stars === 2 ? 'Muito bem! Você ganhou duas estrelas!' :
                       'Missão concluída! Pratique mais para conquistar mais estrelas.';
        setTimeout(() => Speech.speak(speechMsg, { language: 'pt-BR', rate: TTS_RATES[ttsSpeed] ?? 1.0 }), 600);
      }
      setPhase('result');
    }
  };

  const goHome = () => { cleanup(); navigation.navigate('Main'); };

  // ── Derivados ─────────────────────────────────────────────────────
  const missionInfo   = block.missionInfo ?? getMissionInfo(block.blockNumber);
  const currentPhrase = phrases[phraseIdx] ?? phrases[0];
  const avgScore      = testResults.length
    ? Math.round(testResults.reduce((s, r) => s + r.score, 0) / testResults.length)
    : 0;
  const classification  = getBlockClassification(avgScore);
  const showText        = userSelectedLevel === 'beginner';
  const showPartial     = userSelectedLevel === 'intermediate';
  const isTrainPhase    = phase === 'train_listen' || phase === 'train_practice' || phase === 'train_analyzing' || phase === 'train_result';
  const isTestPhase     = phase === 'test_listen' || phase === 'test_record' || phase === 'test_analyzing';
  const trainProgress   = phraseIdx / BLOCK_SIZE + (['train_practice','train_analyzing','train_result'].includes(phase) ? 0.5 / BLOCK_SIZE : 0);
  const testProgress    = phraseIdx / BLOCK_SIZE + (phase === 'test_analyzing' ? 0.5 / BLOCK_SIZE : 0);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>

      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goHome} style={styles.backBtn}>
          <Ionicons name="chevron-down" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{missionInfo.emoji} {missionInfo.name}</Text>
          {(isTrainPhase || isTestPhase) && (
            <Text style={styles.headerSub}>
              {isTrainPhase ? '📖 TREINO' : '🧪 DESAFIO'} — {phraseIdx + 1}/{BLOCK_SIZE}
            </Text>
          )}
          {!isTrainPhase && !isTestPhase && (
            <Text style={styles.headerSub}>Missão {block.blockNumber} de {block.totalBlocks}</Text>
          )}
        </View>
        <View style={{ width: 44 }} />
      </View>

      {/* Barra de progresso */}
      {(isTrainPhase || isTestPhase) && (
        <View style={styles.progressWrap}>
          <ProgressBar
            progress={isTrainPhase ? trainProgress : testProgress}
            color={PURPLE}
            height={4}
          />
        </View>
      )}

      {/* Badge modo demo removido - agora sempre usa API real */}

      {/* Conteúdo das fases */}
      {phase === 'intro'           && <IntroPhase />}
      {phase === 'train_listen'    && <TrainListenPhase />}
      {phase === 'train_practice'  && <TrainPracticePhase />}
      {phase === 'train_analyzing' && <TrainAnalyzingPhase />}
      {phase === 'train_result'    && <TrainResultPhase />}
      {phase === 'challenge_intro' && <ChallengeIntroPhase />}
      {phase === 'test_listen'     && <TestListenPhase />}
      {phase === 'test_record'     && <TestRecordPhase />}
      {phase === 'test_analyzing'  && <TestAnalyzingPhase />}
      {phase === 'result'          && <ResultPhase />}

    </SafeAreaView>
  );

  // ════════════════════════════════════════════════════════════════════════════
  // FASES — componentes internos (closures para acessar estado do pai)
  // ════════════════════════════════════════════════════════════════════════════

  function IntroPhase() {
    return (
      <ScrollView contentContainerStyle={styles.introWrap} showsVerticalScrollIndicator={false}>
        <View style={styles.introIconWrap}>
          <Text style={styles.introEmoji}>{missionInfo.emoji}</Text>
        </View>
        <Text style={styles.introTitle}>{missionInfo.name}</Text>
        <Text style={styles.introSub}>Missão {block.blockNumber} de {block.totalBlocks} · {BLOCK_SIZE} frases</Text>

        <View style={styles.phraseList}>
          {phrases.map((p, i) => (
            <View key={p.id ?? i} style={styles.phraseListItem}>
              <View style={styles.phraseListNum}>
                <Text style={styles.phraseListNumText}>{i + 1}</Text>
              </View>
              <View style={styles.phraseListTexts}>
                <Text style={styles.phraseListEn}>{p.english}</Text>
                <Text style={styles.phraseListPt}>{p.portuguese}</Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle-outline" size={18} color={BLUE} />
          <Text style={styles.infoText}>
            Primeiro você ouvirá cada frase em inglês e poderá repetir. Depois será testado: ouvirá em português e deverá falar em inglês.
          </Text>
        </View>

        <TouchableOpacity style={styles.btnPrimary} onPress={startTraining} activeOpacity={0.85}>
          <Ionicons name="play" size={22} color="#FFF" />
          <Text style={styles.btnTextWhite}>Iniciar Missão</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGhost} onPress={goHome}>
          <Text style={styles.btnTextGray}>Voltar ao início</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  function DialogueContext({ activeIdx }) {
    return (
      <View style={styles.dialogueCtx}>
        <Text style={styles.dialogueCtxLabel}>💬 Diálogo da missão</Text>
        {phrases.map((p, i) => {
          const isActive = i === activeIdx;
          return (
            <View
              key={p.id}
              style={[styles.dialogueLine, isActive && styles.dialogueLineActive]}
            >
              <View style={[styles.dialogueSpeaker,
                { backgroundColor: p.speaker === 'A' ? '#3D2F7E' : PURPLE }]}>
                <Text style={styles.dialogueSpeakerText}>{p.speaker}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.dialogueEn, isActive && { color: BLUE, fontWeight: '800' }]}>
                  {p.english}
                </Text>
                {isActive && (
                  <Text style={styles.dialoguePt}>{p.portuguese}</Text>
                )}
              </View>
              {isActive && (
                <Ionicons name="mic" size={14} color={BLUE} />
              )}
            </View>
          );
        })}
      </View>
    );
  }

  function TrainListenPhase() {
    return (
      <View style={styles.phaseContainer}>
        <View>
          <Text style={styles.phaseLabel}>📖 TREINO — FRASE {phraseIdx + 1} DE {BLOCK_SIZE}</Text>
          <Text style={styles.phaseTitle}>Ouça com atenção</Text>
          <Text style={styles.phaseSub}>
            {userSelectedLevel === 'advanced' ? 'Apenas áudio — foque no som!' : 'Ouça e prepare-se para repetir'}
          </Text>
        </View>

        <SpeedSelector speed={ttsSpeed} onSelect={setTtsSpeed} color={BLUE} />

        <View style={[styles.audioCenter, { marginTop: 12 }]}>
          <TouchableOpacity
            onPress={playEnglish}
            style={[styles.speakerCircle, isSpeaking && styles.speakerActive]}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isSpeaking ? 'volume-high' : 'volume-high-outline'}
              size={44}
              color={isSpeaking ? '#FFF' : BLUE}
            />
          </TouchableOpacity>
          <WaveformAnimation active={isSpeaking} color={BLUE} />
          <Text style={styles.audioStatus}>
            {isSpeaking ? 'Reproduzindo...' : 'Toque para ouvir novamente'}
          </Text>

          {/* INICIANTE: texto completo + fonética */}
          {showText && (
            <View style={styles.phraseBox}>
              <Text style={styles.phraseBoxEn}>{currentPhrase.english}</Text>
              {currentPhrase.phonetic && (
                <Text style={styles.phraseBoxPhonetic}>/{currentPhrase.phonetic}/</Text>
              )}
              <Text style={styles.phraseBoxPt}>{currentPhrase.portuguese}</Text>
            </View>
          )}

          {/* INTERMEDIÁRIO: só PT como dica */}
          {showPartial && (
            <View style={[styles.phraseBox, { borderLeftColor: AMBER }]}>
              <Text style={[styles.phraseBoxPt, { fontSize: 15 }]}>
                🇧🇷 {currentPhrase.portuguese}
              </Text>
            </View>
          )}
        </View>

        <View style={[styles.btnStack, { marginTop: 'auto' }]}>
          <TouchableOpacity
            style={[styles.btnPrimary, { backgroundColor: GREEN }]}
            onPress={handleTrainRecord}
            activeOpacity={0.85}
          >
            <Ionicons name="mic" size={22} color="#FFF" />
            <Text style={styles.btnTextWhite}>Repetir agora</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnGhost} onPress={handleTrainNext}>
            <Ionicons name="arrow-forward" size={18} color="#64748B" />
            <Text style={styles.btnTextGray}>
              {phraseIdx < BLOCK_SIZE - 1 ? 'Próxima frase' : 'Ir para o desafio →'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  function TrainPracticePhase() {
    return (
      <View style={styles.phaseContainer}>
        <View>
          <Text style={styles.phaseLabel}>
            🎙️ REPETIÇÃO {trainAttempts + 1}/{MAX_TRAIN_ATTEMPTS}
          </Text>
          <Text style={styles.phaseTitle}>
            {isRecording ? 'Fale agora!' : 'Preparando microfone...'}
          </Text>
          {showText && (
            <View style={[styles.phraseBox, { marginTop: 8 }]}>
              <Text style={styles.phraseBoxEn}>{currentPhrase.english}</Text>
              {currentPhrase.phonetic && (
                <Text style={styles.phraseBoxPhonetic}>/{currentPhrase.phonetic}/</Text>
              )}
            </View>
          )}
        </View>

        <View style={styles.micArea}>
          <TouchableOpacity
            style={[styles.micBtn, isRecording && styles.micBtnRecording]}
            onPress={isRecording ? handleTrainStopRecord : startRecording}
            activeOpacity={0.8}
          >
            <Ionicons name={isRecording ? 'stop' : 'mic'} size={56} color="#FFF" />
          </TouchableOpacity>
          {isRecording ? (
            <>
              <WaveformAnimation active color={RED} />
              <View style={styles.timerBar}>
                <ProgressBar progress={recordSecs / MAX_RECORD_SECS} color={RED} height={4} />
              </View>
              <Text style={styles.micHint}>Toque para parar ⏹</Text>
            </>
          ) : (
            <Text style={styles.micHint}>Toque para gravar 🎙️</Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.btnGhost, { marginTop: 'auto' }]}
          onPress={() => setPhase('train_listen')}
        >
          <Ionicons name="volume-high" size={18} color={PURPLE} />
          <Text style={styles.btnTextGray}>Ouvir a frase novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function TrainAnalyzingPhase() {
    return (
      <View style={[styles.phaseContainer, { alignItems: 'center', justifyContent: 'center', gap: 20 }]}>
        <ActivityIndicator size="large" color={BLUE} />
        <Text style={styles.phaseTitle}>Analisando pronúncia...</Text>
        <Text style={styles.phaseSub}>Comparando com o áudio de referência 🔍</Text>
      </View>
    );
  }

  function TrainResultPhase() {
    const result    = trainAnalysisResult ?? { score: 0, transcribed: '' };
    const scoreColor = getScoreColor(result.score);
    const canRetry  = trainAttempts < MAX_TRAIN_ATTEMPTS;

    const feedbackMsg =
      result.score >= 90 ? 'Pronúncia excelente! 🎉' :
      result.score >= 70 ? 'Muito boa pronúncia! 👍' :
      result.score >= 50 ? 'Quase lá! Tente mais uma vez 🎯' :
                           'Vamos tentar de novo? 💪';

    return (
      <ScrollView contentContainerStyle={[styles.phaseContainer, { flex: undefined, flexGrow: 1, paddingBottom: 40 }]} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.phaseLabel}>📊 ANÁLISE DE PRONÚNCIA — FRASE {phraseIdx + 1}/{BLOCK_SIZE}</Text>
          <Text style={styles.phaseTitle}>{feedbackMsg}</Text>
        </View>

        {/* Score Ring */}
        <View style={styles.trainResultScoreWrap}>
          <ScoreRing score={result.score} size={150} />
        </View>

        {/* Frase de referência */}
        <View style={styles.phraseBox}>
          <Text style={[styles.phraseBoxLabel, { color: BLUE }]}>🎯 Frase correta</Text>
          <Text style={styles.phraseBoxEn}>{currentPhrase.english}</Text>
          {currentPhrase.phonetic && (
            <Text style={styles.phraseBoxPhonetic}>/{currentPhrase.phonetic}/</Text>
          )}
          <Text style={styles.phraseBoxPt}>{currentPhrase.portuguese}</Text>
        </View>

        {/* O que o app entendeu */}
        {!!result.transcribed && (
          <View style={[styles.infoBox, { borderColor: scoreColor + '55', backgroundColor: scoreColor + '12' }]}>
            <Ionicons name="mic-outline" size={16} color={scoreColor} />
            <Text style={[styles.infoText, { color: '#CCCCDD' }]}>
              {'O app entendeu: '}
              <Text style={{ fontWeight: '800', color: scoreColor }}>"{result.transcribed}"</Text>
            </Text>
          </View>
        )}

        {/* Dica de pronúncia */}
        {currentPhrase.hint && result.score < 80 && (
          <View style={[styles.infoBox, { borderColor: PURPLE + '55', backgroundColor: PURPLE + '12', marginTop: 4 }]}>
            <Ionicons name="bulb-outline" size={16} color={PURPLE} />
            <Text style={[styles.infoText, { color: '#CCCCDD' }]}>
              <Text style={{ fontWeight: '800' }}>Dica: </Text>{currentPhrase.hint}
            </Text>
          </View>
        )}

        {/* Ações */}
        <View style={[styles.btnStack, { marginTop: 20 }]}>
          {canRetry && (
            <TouchableOpacity style={styles.btnGhost} onPress={handleTrainRetry} activeOpacity={0.8}>
              <Ionicons name="refresh" size={18} color={PURPLE} />
              <Text style={styles.btnTextGray}>
                Tentar novamente ({trainAttempts}/{MAX_TRAIN_ATTEMPTS})
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.btnPrimary}
            onPress={handleTrainNext}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-forward" size={22} color="#FFF" />
            <Text style={styles.btnTextWhite}>
              {phraseIdx < BLOCK_SIZE - 1 ? 'Próxima frase' : 'Ir para o desafio'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnGhost} onPress={() => setPhase('train_listen')}>
            <Ionicons name="volume-high" size={18} color={PURPLE} />
            <Text style={styles.btnTextGray}>Ouvir frase novamente</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  function ChallengeIntroPhase() {
    return (
      <View style={styles.challengeIntroWrap}>
        <Text style={styles.challengeIntroEmoji}>🧪</Text>
        <Text style={styles.challengeIntroTitle}>Hora do Desafio!</Text>
        <Text style={styles.challengeIntroSub}>
          Agora você ouvirá cada frase em português e deverá falar a tradução em inglês.
        </Text>

        <View style={styles.challengeRulesBox}>
          {[
            { icon: 'volume-high',  color: PURPLE, text: 'Ouça a frase em português' },
            { icon: 'close-circle', color: RED,    text: 'NÃO aparece a tradução' },
            { icon: 'mic',          color: RED,    text: 'Fale a tradução em inglês' },
            { icon: 'analytics',    color: BLUE,   text: 'Receba sua pontuação' },
          ].map((r) => (
            <View key={r.text} style={styles.challengeRule}>
              <Ionicons name={r.icon} size={20} color={r.color} />
              <Text style={styles.challengeRuleText}>{r.text}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[styles.btnPrimary, { backgroundColor: PURPLE }]}
          onPress={handleTestStart}
          activeOpacity={0.85}
        >
          <Ionicons name="flash" size={22} color="#FFF" />
          <Text style={styles.btnTextWhite}>Iniciar desafio</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function TestListenPhase() {
    return (
      <View style={styles.phaseContainer}>
        <View>
          <Text style={[styles.phaseLabel, { color: PURPLE }]}>
            🧪 TESTE — FRASE {phraseIdx + 1} DE {BLOCK_SIZE}
          </Text>
          <Text style={styles.phaseTitle}>
            {isDialogue ? 'Ouça e repita' : 'Ouça em português'}
          </Text>
          <Text style={styles.phaseSub}>
            {isDialogue ? 'Depois, repita a frase em inglês' : 'Depois, fale a tradução em inglês'}
          </Text>
        </View>

        <View style={[styles.audioCenter, { marginTop: 28 }]}>
          {isDialogue ? (
            /* ── MODO DIÁLOGO: ouve inglês e repete ── */
            <>
              <TouchableOpacity
                onPress={playEnglish}
                style={[styles.speakerCircle, isSpeaking && styles.speakerActive]}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={isSpeaking ? 'volume-high' : 'volume-high-outline'}
                  size={44}
                  color={isSpeaking ? '#FFF' : BLUE}
                />
              </TouchableOpacity>
              <WaveformAnimation active={isSpeaking} color={BLUE} />
              <Text style={styles.audioStatus}>
                {isSpeaking ? 'Reproduzindo...' : 'Toque para ouvir a linha'}
              </Text>
              <View style={styles.phraseBox}>
                <Text style={styles.phraseBoxEn}>{currentPhrase.english}</Text>
                {currentPhrase.phonetic && (
                  <Text style={styles.phraseBoxPhonetic}>/{currentPhrase.phonetic}/</Text>
                )}
                <Text style={styles.phraseBoxPt}>{currentPhrase.portuguese}</Text>
              </View>
            </>
          ) : (
            /* ── MODO FRASE: ouve PT e traduz para EN ── */
            <>
              <TouchableOpacity
                onPress={playPortuguese}
                style={[
                  styles.speakerCircle,
                  { backgroundColor: isSpeaking ? PURPLE : '#2D1F5E', borderColor: '#3D2F7E' },
                ]}
                activeOpacity={0.8}
              >
                <Text style={styles.flagEmoji}>🇧🇷</Text>
              </TouchableOpacity>
              <WaveformAnimation active={isSpeaking} color={PURPLE} />
              <Text style={styles.audioStatus}>
                {isSpeaking ? 'Reproduzindo em português...' : 'Toque para ouvir novamente'}
              </Text>
              {showText && (
                <View style={[styles.phraseBox, { borderLeftColor: PURPLE }]}>
                  <Text style={styles.ptTextLabel}>🇧🇷 Português</Text>
                  <Text style={[styles.phraseBoxPt, { fontSize: 18, color: '#CCCCDD' }]}>
                    {currentPhrase.portuguese}
                  </Text>
                </View>
              )}
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.btnPrimary, { backgroundColor: RED, marginTop: 'auto' }]}
          onPress={handleTestRecord}
          activeOpacity={0.85}
        >
          <Ionicons name="mic" size={22} color="#FFF" />
          <Text style={styles.btnTextWhite}>{isDialogue ? 'Repetir linha 🎙️' : 'Falar em inglês 🎙️'}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  function TestRecordPhase() {
    const isUrgent = challengeMode && challengeTimer <= 3;
    const timerColor = isUrgent ? RED : PURPLE;
    return (
      <View style={styles.phaseContainer}>
        <View>
          <Text style={[styles.phaseLabel, { color: RED }]}>🔴 GRAVANDO</Text>
          <Text style={styles.phaseTitle}>Fale em inglês agora!</Text>
          <Text style={styles.phaseSub}>Diga a tradução da frase que ouviu</Text>
        </View>

        {/* Timer do Modo Desafio */}
        {challengeMode && (
          <View style={[styles.challengeTimerBox, { borderColor: timerColor + '44', backgroundColor: timerColor + '12' }]}>
            <Ionicons name="flash" size={20} color={timerColor} />
            <Text style={[styles.challengeTimerNum, { color: timerColor }]}>{challengeTimer}s</Text>
            <Text style={[styles.challengeTimerLabel, { color: timerColor }]}>MODO DESAFIO</Text>
            <View style={styles.challengeTimerTrack}>
              <View style={[styles.challengeTimerFill, { width: `${(challengeTimer / CHALLENGE_SECS) * 100}%`, backgroundColor: timerColor }]} />
            </View>
          </View>
        )}

        <View style={styles.micArea}>
          <TouchableOpacity
            style={[styles.micBtn, styles.micBtnRecording]}
            onPress={handleTestStopAndAnalyze}
            activeOpacity={0.8}
          >
            <Ionicons name="stop" size={56} color="#FFF" />
          </TouchableOpacity>
          <WaveformAnimation active={isRecording} color={RED} />
          {isRecording && (
            <View style={styles.timerBar}>
              <ProgressBar progress={recordSecs / MAX_RECORD_SECS} color={RED} height={4} />
            </View>
          )}
          <Text style={styles.micHint}>Toque em ■ quando terminar</Text>
        </View>
      </View>
    );
  }

  function TestAnalyzingPhase() {
    return (
      <View style={styles.analyzingContainer}>
        <ActivityIndicator size="large" color={PURPLE} />
        <Text style={styles.analyzingTitle}>Avaliando...</Text>
        <Text style={styles.analyzingSubtitle}>
          Frase {phraseIdx + 1} de {BLOCK_SIZE}
        </Text>
      </View>
    );
  }

  function ResultPhase() {
    const dominadas = testResults.filter((r) => r.score >= 90).length;
    const boas      = testResults.filter((r) => r.score >= 70 && r.score < 90).length;
    const revisar   = testResults.filter((r) => r.score < 70).length;
    const motivMsg  = getMotivationalMessage(missionStars || getStarsForScore(avgScore));
    const starAnims = [starAnim1, starAnim2, starAnim3];

    return (
      <ScrollView contentContainerStyle={styles.resultWrap} showsVerticalScrollIndicator={false}>
        {/* Nome da missão */}
        <Text style={styles.resultMissionName}>{missionInfo.emoji} {missionInfo.name}</Text>

        {/* Estrelas animadas */}
        <View style={styles.starsRow}>
          {[0, 1, 2].map((i) => (
            <Animated.Text
              key={i}
              style={[
                styles.starEmoji,
                {
                  opacity:   starAnims[i],
                  transform: [{ scale: starAnims[i].interpolate({ inputRange: [0,1], outputRange: [0.3, 1] }) }],
                  color: i < (missionStars || getStarsForScore(avgScore)) ? '#FFC629' : '#2D1F5E',
                },
              ]}
            >
              ★
            </Animated.Text>
          ))}
        </View>

        {/* Mensagem motivacional */}
        <View style={styles.motivBox}>
          <Text style={styles.motivText}>{motivMsg}</Text>
        </View>

        {/* Score médio */}
        <View style={styles.resultScoreWrap}>
          <ScoreRing score={avgScore} size={140} />
          <Text style={[styles.resultDesc, { color: classification.color }]}>
            {classification.desc}
          </Text>
        </View>

        {/* Dica de revisão se baixo score */}
        {avgScore < 70 && (
          <View style={styles.reviewTipBox}>
            <Ionicons name="bulb-outline" size={18} color={AMBER} />
            <Text style={styles.reviewTipText}>{getReviewTip()}</Text>
          </View>
        )}

        {/* Resumo rápido */}
        <View style={styles.resultSummaryRow}>
          <View style={[styles.resultSummaryChip, { backgroundColor: GREEN + '18' }]}>
            <Text style={[styles.resultSummaryNum, { color: GREEN }]}>{dominadas}</Text>
            <Text style={[styles.resultSummaryLbl, { color: GREEN }]}>Dominadas</Text>
          </View>
          <View style={[styles.resultSummaryChip, { backgroundColor: BLUE + '18' }]}>
            <Text style={[styles.resultSummaryNum, { color: BLUE }]}>{boas}</Text>
            <Text style={[styles.resultSummaryLbl, { color: BLUE }]}>Boas</Text>
          </View>
          <View style={[styles.resultSummaryChip, { backgroundColor: RED + '18' }]}>
            <Text style={[styles.resultSummaryNum, { color: RED }]}>{revisar}</Text>
            <Text style={[styles.resultSummaryLbl, { color: RED }]}>Revisar</Text>
          </View>
        </View>

        {/* Lista de frases com pontuação */}
        <Text style={styles.resultListTitle}>Detalhes por frase</Text>
        {testResults.map((r, i) => {
          const c = getScoreColor(r.score);
          return (
            <View key={i} style={[styles.resultItem, { borderLeftColor: c }]}>
              <View style={styles.resultItemTop}>
                <View style={[styles.resultScoreBadge, { backgroundColor: c + '18' }]}>
                  <Text style={[styles.resultScoreText, { color: c }]}>{r.score}</Text>
                  <Text style={[styles.resultScorePts, { color: c }]}>pts</Text>
                </View>
                <View style={styles.resultItemTexts}>
                  <Text style={styles.resultItemEn}>{r.phrase.english}</Text>
                  <Text style={styles.resultItemPt}>{r.phrase.portuguese}</Text>
                </View>
                <Ionicons
                  name={r.score >= 70 ? 'checkmark-circle' : 'close-circle'}
                  size={24}
                  color={r.score >= 70 ? GREEN : RED}
                />
              </View>
              {!!r.transcribed && (
                <Text style={styles.resultItemTranscribed}>
                  O app entendeu: "{r.transcribed}"
                </Text>
              )}
            </View>
          );
        })}

        {/* Ações */}
        {block.blockNumber < block.totalBlocks ? (
          <TouchableOpacity
            style={[styles.btnPrimary, { marginTop: 24, backgroundColor: GREEN }]}
            onPress={() => {
              const isBeginnerBlock = !!block.missionInfo;
              const next = isBeginnerBlock
                ? BEGINNER_MISSIONS.find(b => b.blockNumber === block.blockNumber + 1)
                : getBlockForDay((block.blockNumber) * 5 + 1);
              if (!next) return;
              cleanup();
              navigation.replace('Block', { block: next });
            }}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-forward-circle" size={22} color="#FFF" />
            <Text style={styles.btnTextWhite}>Próximo Bloco ({block.blockNumber + 1}/{block.totalBlocks})</Text>
          </TouchableOpacity>
        ) : (
          <View style={[styles.btnPrimary, { marginTop: 24, backgroundColor: PURPLE }]}>
            <Ionicons name="trophy" size={22} color="#FFF" />
            <Text style={styles.btnTextWhite}>🎉 Todos os blocos concluídos!</Text>
          </View>
        )}
        <TouchableOpacity
          style={[styles.btnGhost, { marginTop: 4 }]}
          onPress={() => { setPhase('intro'); setPhraseIdx(0); setTestResults([]); }}
          activeOpacity={0.85}
        >
          <Ionicons name="refresh" size={18} color="#64748B" />
          <Text style={styles.btnTextGray}>Repetir este bloco</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnGhost} onPress={goHome}>
              <Ionicons name="home-outline" size={18} color={PURPLE} />
          <Text style={styles.btnTextGray}>Voltar ao início</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }
}

// ─── Estilos ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A0818' },

  // Cabeçalho
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#2D1F5E',
  },
  backBtn:     { width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  headerCenter:{ alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '800', color: '#FFFFFF' },
  headerSub:   { fontSize: 11, fontWeight: '700', color: '#9999BB', marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },

  // Progress
  progressWrap: { paddingHorizontal: 20, paddingTop: 10 },

  // Demo badge
  demoBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: PURPLE + '18', paddingHorizontal: 16, paddingVertical: 6,
    borderBottomWidth: 1, borderBottomColor: PURPLE + '44',
  },
  demoBadgeText: { fontSize: 12, color: PURPLE, fontWeight: '600' },

  // ── Intro ──────────────────────────────────────────────────────────────────
  introWrap: { padding: 24, alignItems: 'center', gap: 20 },
  introIconWrap: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: '#130E2A', justifyContent: 'center', alignItems: 'center',
  },
  introEmoji:  { fontSize: 48 },
  introTitle:  { fontSize: 24, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  introSub:    { fontSize: 14, color: '#9999BB', textAlign: 'center', marginTop: -12 },

  phraseList: { width: '100%', gap: 10 },
  phraseListItem: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#130E2A', borderRadius: 14, padding: 14,
    borderWidth: 1, borderColor: '#2D1F5E',
  },
  phraseListNum: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center',
  },
  phraseListNumText: { fontSize: 13, fontWeight: '800', color: '#FFF' },
  phraseListTexts:   { flex: 1, gap: 2 },
  phraseListEn:      { fontSize: 15, fontWeight: '700', color: '#FFFFFF' },
  phraseListPt:      { fontSize: 13, color: '#9999BB' },

  infoBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#130E2A', borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: '#2D1F5E',
  },
  infoText: { fontSize: 13, color: '#CCCCDD', lineHeight: 20, flex: 1 },

  // ── Fases de treino/teste (layout em coluna com header + centro + botões) ──
  phaseContainer: {
    flex: 1, paddingHorizontal: 24, paddingTop: 20, paddingBottom: 24,
    justifyContent: 'flex-start',
  },
  phaseLabel: { fontSize: 11, fontWeight: '800', color: BLUE, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4 },
  phaseTitle: { fontSize: 26, fontWeight: '900', color: '#FFFFFF', lineHeight: 32 },
  phaseSub:   { fontSize: 14, color: '#9999BB', marginTop: 4 },

  // Centro com speaker / waveform / texto
  audioCenter: { alignItems: 'center', gap: 14 },
  speakerCircle: {
    width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#130E2A', borderWidth: 2, borderColor: '#2D1F5E',
    justifyContent: 'center', alignItems: 'center',
  },
  speakerActive: {
    backgroundColor: BLUE, borderColor: BLUE,
    shadowColor: BLUE, shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 12, elevation: 8,
  },
  flagEmoji:   { fontSize: 44 },
  audioStatus: { fontSize: 13, color: '#9999BB', fontWeight: '500' },

  phraseBox: {
    width: '100%', backgroundColor: '#130E2A',
    borderRadius: 14, padding: 14,
    borderLeftWidth: 3, borderLeftColor: BLUE, gap: 4,
  },
  phraseBoxLabel:    { fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 2 },
  phraseBoxEn:       { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  phraseBoxPhonetic: { fontSize: 14, fontWeight: '600', color: '#9B7FFF', fontStyle: 'italic' },
  phraseBoxPt:       { fontSize: 14, color: '#9999BB', fontWeight: '500' },
  ptTextLabel:       { fontSize: 11, fontWeight: '800', color: PURPLE, textTransform: 'uppercase', letterSpacing: 0.6 },

  // ── Resultado de treino (análise por frase) ──────────────────────────────
  trainResultScoreWrap: { alignItems: 'center', marginVertical: 20 },

  // Botões
  btnStack: { gap: 10 },
  btnPrimary: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: BLUE, borderRadius: 16, paddingVertical: 16, gap: 10,
    shadowColor: BLUE, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  btnGhost: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    borderRadius: 16, paddingVertical: 14, gap: 8,
    borderWidth: 1, borderColor: '#2D1F5E', backgroundColor: '#130E2A',
  },
  btnDisabled:   { opacity: 0.4 },
  btnTextWhite:  { fontSize: 16, fontWeight: '700', color: '#FFF' },
  btnTextGray:   { fontSize: 14, fontWeight: '600', color: '#9999BB' },

  // Microfone
  micArea: { alignItems: 'center', gap: 14, paddingVertical: 28 },
  micBtn: {
    width: 130, height: 130, borderRadius: 65,
    backgroundColor: BLUE, justifyContent: 'center', alignItems: 'center',
    shadowColor: BLUE, shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35, shadowRadius: 16, elevation: 8,
  },
  micBtnRecording: { backgroundColor: RED, shadowColor: RED },
  micHint:         { fontSize: 14, color: '#9999BB', fontWeight: '500' },
  timerBar:        { width: '100%', paddingHorizontal: 24 },

  // ── Challenge intro ────────────────────────────────────────────────────────
  challengeIntroWrap: {
    flex: 1, alignItems: 'center', justifyContent: 'center',
    paddingHorizontal: 24, gap: 20,
  },
  challengeIntroEmoji: { fontSize: 72 },
  challengeIntroTitle: { fontSize: 30, fontWeight: '900', color: '#FFFFFF', textAlign: 'center' },
  challengeIntroSub: {
    fontSize: 15, color: '#9999BB', textAlign: 'center', lineHeight: 22,
  },
  challengeRulesBox: {
    width: '100%', backgroundColor: '#130E2A',
    borderRadius: 16, padding: 16, gap: 12,
    borderWidth: 1, borderColor: '#2D1F5E',
  },
  challengeRule:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  challengeRuleText: { fontSize: 14, fontWeight: '600', color: '#CCCCDD', flex: 1 },

  // ── Analisando ─────────────────────────────────────────────────────────────
  analyzingContainer: {
    flex: 1, alignItems: 'center', justifyContent: 'center', gap: 16,
  },
  analyzingTitle:    { fontSize: 20, fontWeight: '800', color: '#FFFFFF' },
  analyzingSubtitle: { fontSize: 14, color: '#9999BB' },

  // ── Resultado ──────────────────────────────────────────────────────────────
  resultWrap: { padding: 24, alignItems: 'center', gap: 16 },
  resultTitle: { fontSize: 22, fontWeight: '900', color: '#FFFFFF' },
  resultClassLabel: { fontSize: 18, fontWeight: '800', marginTop: -8 },
  resultScoreWrap: { alignItems: 'center', gap: 12 },
  resultDesc: { fontSize: 14, fontWeight: '600', textAlign: 'center' },

  resultSummaryRow: { flexDirection: 'row', gap: 10, width: '100%' },
  resultSummaryChip: {
    flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', gap: 2,
  },
  resultSummaryNum: { fontSize: 24, fontWeight: '900' },
  resultSummaryLbl: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5 },

  resultListTitle: {
    fontSize: 14, fontWeight: '800', color: '#9999BB',
    textTransform: 'uppercase', letterSpacing: 0.6,
    alignSelf: 'flex-start', marginTop: 8,
  },
  resultItem: {
    width: '100%', backgroundColor: '#130E2A',
    borderRadius: 14, padding: 14,
    borderLeftWidth: 3, gap: 8,
  },
  resultItemTop:        { flexDirection: 'row', alignItems: 'center', gap: 10 },
  resultScoreBadge: {
    width: 52, height: 52, borderRadius: 26,
    justifyContent: 'center', alignItems: 'center',
  },
  resultScoreText:      { fontSize: 18, fontWeight: '900' },
  resultScorePts:       { fontSize: 10, fontWeight: '700' },
  resultItemTexts:      { flex: 1, gap: 2 },
  resultItemEn:         { fontSize: 14, fontWeight: '700', color: '#FFFFFF' },
  resultItemPt:         { fontSize: 12, color: '#9999BB' },
  resultItemTranscribed:{ fontSize: 12, color: '#94A3B8', fontStyle: 'italic', paddingLeft: 62 },

  // ── Gamificação ────────────────────────────────────────────────────────────
  resultMissionName: { fontSize: 16, fontWeight: '700', color: '#9999BB', marginBottom: -8 },

  starsRow:  { flexDirection: 'row', gap: 8, alignItems: 'center', marginVertical: 4 },
  starEmoji: { fontSize: 44, fontWeight: '900' },

  motivBox: {
    backgroundColor: '#130E2A', borderRadius: 14, paddingHorizontal: 18, paddingVertical: 12,
    borderLeftWidth: 3, borderLeftColor: PURPLE, width: '100%',
  },
  motivText: { fontSize: 15, fontWeight: '700', color: '#CCCCDD', textAlign: 'center' },

  reviewTipBox: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 10,
    backgroundColor: '#130E2A', borderRadius: 12, padding: 12,
    borderWidth: 1, borderColor: '#2D1F5E', width: '100%',
  },
  reviewTipText: { flex: 1, fontSize: 13, color: '#CCCCDD', lineHeight: 20, fontWeight: '500' },

  // ── Diálogo ───────────────────────────────────────────────────────────────
  dialogueCtx: {
    backgroundColor: '#130E2A', borderRadius: 14,
    padding: 12, gap: 6, width: '100%',
    borderWidth: 1, borderColor: '#2D1F5E',
  },
  dialogueCtxLabel: {
    fontSize: 11, fontWeight: '700', color: '#9999BB',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4,
  },
  dialogueLine: {
    flexDirection: 'row', alignItems: 'flex-start', gap: 8,
    paddingVertical: 5, paddingHorizontal: 6, borderRadius: 8,
  },
  dialogueLineActive: { backgroundColor: PURPLE + '18', borderWidth: 1, borderColor: PURPLE + '44' },
  dialogueSpeaker: {
    width: 22, height: 22, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center', marginTop: 1,
  },
  dialogueSpeakerText: { fontSize: 10, fontWeight: '900', color: '#FFF' },
  dialogueEn: { fontSize: 13, fontWeight: '600', color: '#CCCCDD', flex: 1 },
  dialoguePt: { fontSize: 11, color: '#9999BB', marginTop: 2 },

  challengeTimerBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    borderRadius: 14, borderWidth: 1.5, paddingHorizontal: 14, paddingVertical: 10,
    marginBottom: 8, flexWrap: 'wrap',
  },
  challengeTimerNum:   { fontSize: 22, fontWeight: '900', minWidth: 36 },
  challengeTimerLabel: { flex: 1, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5 },
  challengeTimerTrack: { width: '100%', height: 4, backgroundColor: '#2D1F5E', borderRadius: 2, overflow: 'hidden' },
  challengeTimerFill:  { height: 4, borderRadius: 2 },
});
