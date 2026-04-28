import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useApp } from '../context/AppContext';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { transcribeAudioFast, calculateScore } from '../services/speechService';
import { getStarsForScore, getMotivationalMessage } from '../data/missions';
import SpeedSelector, { TTS_RATES } from '../components/SpeedSelector';

const BLUE   = '#2563EB';
const GREEN  = '#16A34A';
const AMBER  = '#D97706';
const RED    = '#EF4444';
const PURPLE = '#7B2FFF';

const LEVEL_COLOR = {
  beginner:     '#10B981',
  intermediate: '#2563EB',
  advanced:     '#7C3AED',
};

const MAX_RECORD_SECS = 12;

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
    numberOfChannels: 2,
    bitRate: 128000,
  },
  web: {},
};

// ── Fases ──────────────────────────────────────────────────────────────────────
const PHASE_READ     = 'read';
const PHASE_PRACTICE = 'practice';
const PHASE_RESULT   = 'result';

function scoreColor(s) {
  if (s >= 85) return GREEN;
  if (s >= 65) return AMBER;
  return RED;
}

function scoreFeedback(s) {
  if (s >= 85) return '✅ Excelente!';
  if (s >= 65) return '👍 Bom!';
  return '💪 Tente novamente';
}

// ── Componente principal ───────────────────────────────────────────────────────
export default function ConversationScreen() {
  const navigation  = useNavigation();
  const route       = useRoute();
  const { block }   = route.params;
  const { ttsSpeed, setTtsSpeed } = useApp();
  const dialogue = block.dialogue;
  const levelColor = LEVEL_COLOR[block.level] || BLUE;

  // fase geral
  const [phase, setPhase]       = useState(PHASE_READ);
  // índice da fala atual na fase de prática
  const [lineIdx, setLineIdx]   = useState(0);
  // resultados: { lineIdx, score, expected, transcript }
  const [results, setResults]   = useState([]);
  // estados de gravação
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [lineScore, setLineScore]     = useState(null); // score da linha atual
  const recordingRef = useRef(null);
  const timerRef     = useRef(null);
  const starAnim1    = useRef(new Animated.Value(0)).current;
  const starAnim2    = useRef(new Animated.Value(0)).current;
  const starAnim3    = useRef(new Animated.Value(0)).current;

  // Solicitar permissão de áudio ao montar
  useEffect(() => {
    Audio.requestPermissionsAsync();
    return () => {
      clearTimeout(timerRef.current);
      Speech.stop();
      if (recordingRef.current) {
        recordingRef.current.stopAndUnloadAsync().catch(() => {});
      }
    };
  }, []);

  // ── Helpers ─────────────────────────────────────────────────────────────────
  const currentLine = dialogue[lineIdx];
  const isUserTurn  = currentLine?.speaker === 'B';
  const bLines      = dialogue.filter(l => l.speaker === 'B');
  const totalBLines = bLines.length;
  const answeredB   = results.length;

  // Fala do speaker A com TTS
  function speakLine(text) {
    Speech.speak(text, { language: 'en-US', rate: TTS_RATES[ttsSpeed] ?? 1.0 });
  }

  // ── FASE READ ────────────────────────────────────────────────────────────────
  function startPractice() {
    Speech.stop();
    setPhase(PHASE_PRACTICE);
    setLineIdx(0);
    setResults([]);
    setLineScore(null);
    // Se a primeira linha é do A, fala ela
    if (dialogue[0]?.speaker === 'A') {
      setTimeout(() => speakLine(dialogue[0].en), 400);
    }
  }

  // ── FASE PRACTICE ────────────────────────────────────────────────────────────
  function advanceLine() {
    const next = lineIdx + 1;
    setLineScore(null);
    if (next >= dialogue.length) {
      setPhase(PHASE_RESULT);
      return;
    }
    setLineIdx(next);
    if (dialogue[next]?.speaker === 'A') {
      setTimeout(() => speakLine(dialogue[next].en), 300);
    }
  }

  async function startRecording() {
    try {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const { recording } = await Audio.Recording.createAsync(RECORDING_OPTIONS);
      recordingRef.current = recording;
      setIsRecording(true);
      timerRef.current = setTimeout(() => stopRecording(), MAX_RECORD_SECS * 1000);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
    }
  }

  async function stopRecording() {
    clearTimeout(timerRef.current);
    if (!recordingRef.current) return;
    try {
      setIsRecording(false);
      setIsAnalyzing(true);
      await recordingRef.current.stopAndUnloadAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });
      const expected   = currentLine.en;
      const transcript = await transcribeAudioFast(expected);
      const score      = calculateScore(expected, transcript);
      setLineScore(score);
      setResults(prev => [...prev, { lineIdx, score, expected, transcript }]);
    } catch (e) {
      Alert.alert('Erro', 'Problema ao analisar o áudio.');
    } finally {
      recordingRef.current = null;
      setIsAnalyzing(false);
    }
  }

  // ── Score final ──────────────────────────────────────────────────────────────
  const avgScore = results.length
    ? Math.round(results.reduce((s, r) => s + r.score, 0) / results.length)
    : 0;
  const convStars = getStarsForScore(avgScore);

  useEffect(() => {
    if (phase === PHASE_RESULT && results.length > 0) {
      const anims = [starAnim1, starAnim2, starAnim3];
      starAnim1.setValue(0); starAnim2.setValue(0); starAnim3.setValue(0);
      Animated.stagger(200, anims.slice(0, convStars).map((a) =>
        Animated.spring(a, { toValue: 1, useNativeDriver: true, friction: 4 })
      )).start();
    }
  }, [phase]);

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER – READ
  // ════════════════════════════════════════════════════════════════════════════
  if (phase === PHASE_READ) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{block.focus?.toUpperCase()}</Text>
            <Text style={[styles.headerBadge, { color: levelColor }]}>{block.level}</Text>
          </View>
          <View style={[styles.idBadge, { backgroundColor: levelColor + '20', borderColor: levelColor }]}>
            <Text style={[styles.idText, { color: levelColor }]}>#{block.id}</Text>
          </View>
        </View>

        {/* Instrução */}
        <View style={styles.instructionBox}>
          <Text style={styles.instructionTitle}>📖 Leia o diálogo</Text>
          <Text style={styles.instructionSub}>Estude antes de praticar. Você falará como <Text style={styles.boldB}>pessoa B</Text>.</Text>
        </View>

        {/* Velocidade de fala */}
        <View style={{ paddingHorizontal: 20, marginBottom: 8 }}>
          <SpeedSelector speed={ttsSpeed} onSelect={setTtsSpeed} color={levelColor} />
        </View>

        {/* Diálogo completo */}
        <ScrollView style={styles.scroll} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}>
          {dialogue.map((line, i) => {
            const isB = line.speaker === 'B';
            return (
              <View key={i} style={[styles.lineCard, isB && styles.lineCardB]}>
                <View style={[styles.speakerBadge, { backgroundColor: isB ? levelColor : '#64748B' }]}>
                  <Text style={styles.speakerText}>{line.speaker}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.lineEn, isB && styles.lineEnB]}>{line.en}</Text>
                  <Text style={styles.linePt}>{line.pt}</Text>
                </View>
                <TouchableOpacity onPress={() => speakLine(line.en)} style={styles.speakBtn}>
                  <Ionicons name="volume-medium-outline" size={18} color="#64748B" />
                </TouchableOpacity>
              </View>
            );
          })}
        </ScrollView>

        {/* Botão iniciar prática */}
        <View style={styles.footer}>
          <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: levelColor }]} onPress={startPractice}>
            <Ionicons name="mic" size={20} color="#fff" />
            <Text style={styles.primaryBtnText}>Praticar como B</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER – PRACTICE
  // ════════════════════════════════════════════════════════════════════════════
  if (phase === PHASE_PRACTICE) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => { Speech.stop(); setPhase(PHASE_READ); }} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color="#1E293B" />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>{block.focus?.toUpperCase()}</Text>
            <Text style={[styles.headerBadge, { color: levelColor }]}>Linha {lineIdx + 1} de {dialogue.length}</Text>
          </View>
        </View>

        {/* Progresso das linhas B */}
        <View style={styles.progressRow}>
          {bLines.map((_, i) => {
            const res = results[i];
            const active = answeredB === i;
            return (
              <View
                key={i}
                style={[
                  styles.progressDot,
                  res   ? { backgroundColor: scoreColor(res.score) } :
                  active ? { backgroundColor: levelColor } :
                           { backgroundColor: '#E2E8F0' },
                ]}
              />
            );
          })}
        </View>

        <ScrollView style={styles.scroll} contentContainerStyle={{ padding: 20, paddingBottom: 10 }}>
          {/* Histórico das linhas anteriores */}
          {dialogue.slice(0, lineIdx).map((line, i) => {
            const isB = line.speaker === 'B';
            const res = isB ? results.find(r => r.lineIdx === i) : null;
            return (
              <View key={i} style={[styles.historyLine, isB && styles.historyLineB]}>
                <Text style={styles.historyLabel}>{line.speaker}:</Text>
                <Text style={styles.historyText}>{line.en}</Text>
                {res && (
                  <Text style={[styles.historyScore, { color: scoreColor(res.score) }]}>{res.score}%</Text>
                )}
              </View>
            );
          })}

          {/* Linha atual */}
          {currentLine && (
            <View style={styles.currentCard}>
              {!isUserTurn ? (
                // Speaker A
                <View>
                  <Text style={styles.speakerLabel}>🗣 A fala:</Text>
                  <Text style={styles.currentEn}>{currentLine.en}</Text>
                  <Text style={styles.currentPt}>{currentLine.pt}</Text>
                  <TouchableOpacity
                    style={[styles.listenBtn, { borderColor: levelColor }]}
                    onPress={() => speakLine(currentLine.en)}
                  >
                    <Ionicons name="volume-medium" size={18} color={levelColor} />
                    <Text style={[styles.listenText, { color: levelColor }]}>Ouvir</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: levelColor, marginTop: 14 }]} onPress={advanceLine}>
                    <Text style={styles.primaryBtnText}>Próximo →</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                // Speaker B — turno do usuário
                <View>
                  <Text style={styles.speakerLabel}>🎤 Sua vez (B):</Text>
                  {lineScore === null ? (
                    // Antes de gravar
                    <View>
                      <Text style={styles.currentPt}>{currentLine.pt}</Text>
                      <View style={styles.hintBox}>
                        <Text style={styles.hintLabel}>Dica:</Text>
                        <Text style={styles.hintText}>{currentLine.en}</Text>
                      </View>
                      {isAnalyzing ? (
                        <View style={styles.analyzingBox}>
                          <ActivityIndicator size="small" color={levelColor} />
                          <Text style={styles.analyzingText}>Analisando...</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={[styles.recordBtn, isRecording && styles.recordBtnActive, { borderColor: isRecording ? RED : levelColor }]}
                          onPress={isRecording ? stopRecording : startRecording}
                        >
                          <Ionicons
                            name={isRecording ? 'stop-circle' : 'mic'}
                            size={32}
                            color={isRecording ? RED : levelColor}
                          />
                          <Text style={[styles.recordText, { color: isRecording ? RED : levelColor }]}>
                            {isRecording ? 'Parar' : 'Gravar resposta'}
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    // Após gravar — mostrar score
                    <View>
                      <Text style={[styles.scoreText, { color: scoreColor(lineScore) }]}>
                        {lineScore}% — {scoreFeedback(lineScore)}
                      </Text>
                      <Text style={styles.expectedLabel}>Esperado:</Text>
                      <Text style={styles.expectedText}>{currentLine.en}</Text>
                      <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: levelColor, marginTop: 16 }]} onPress={advanceLine}>
                        <Text style={styles.primaryBtnText}>
                          {lineIdx + 1 >= dialogue.length ? 'Ver resultado' : 'Próximo →'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ════════════════════════════════════════════════════════════════════════════
  // RENDER – RESULT
  // ════════════════════════════════════════════════════════════════════════════
  const starAnims = [starAnim1, starAnim2, starAnim3];
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.resultContainer}>

        {/* Estrelas animadas */}
        <View style={styles.resultStarsRow}>
          {[0, 1, 2].map((i) => (
            <Animated.Text
              key={i}
              style={[
                styles.resultStar,
                {
                  opacity: starAnims[i],
                  transform: [{ scale: starAnims[i].interpolate({ inputRange: [0, 1], outputRange: [0.2, 1] }) }],
                  color: i < convStars ? '#F59E0B' : '#E2E8F0',
                },
              ]}
            >
              ★
            </Animated.Text>
          ))}
        </View>

        {/* Score círculo */}
        <View style={[styles.scoreCircle, { borderColor: scoreColor(avgScore) }]}>
          <Text style={[styles.scoreCircleNum, { color: scoreColor(avgScore) }]}>{avgScore}%</Text>
          <Text style={styles.scoreCircleLbl}>Score</Text>
        </View>

        <Text style={styles.resultTitle}>{scoreFeedback(avgScore)}</Text>

        {/* Mensagem motivacional */}
        <View style={styles.resultMotivBox}>
          <Text style={styles.resultMotivText}>{getMotivationalMessage(convStars)}</Text>
        </View>

        <Text style={styles.resultSub}>Diálogo: <Text style={{ fontWeight: '700' }}>{block.focus}</Text></Text>

        {/* Detalhes por linha B */}
        <View style={styles.detailsBox}>
          {results.map((r, i) => (
            <View key={i} style={styles.detailRow}>
              <View style={[styles.detailDot, { backgroundColor: scoreColor(r.score) }]} />
              <View style={{ flex: 1 }}>
                <Text style={styles.detailExpected}>{r.expected}</Text>
              </View>
              <Text style={[styles.detailScore, { color: scoreColor(r.score) }]}>{r.score}%</Text>
            </View>
          ))}
        </View>

        {/* Botões */}
        <TouchableOpacity style={[styles.primaryBtn, { backgroundColor: levelColor }]} onPress={startPractice}>
          <Ionicons name="refresh" size={18} color="#fff" />
          <Text style={styles.primaryBtnText}>Praticar novamente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.secondaryBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.secondaryBtnText}>← Voltar</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

// ── Estilos ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container:  { flex: 1, backgroundColor: '#F8FAFC' },
  scroll:     { flex: 1 },

  // Header
  header:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  backBtn:    { padding: 6, marginRight: 10 },
  headerTitle:{ fontSize: 14, fontWeight: '800', color: '#1E293B', textTransform: 'uppercase', letterSpacing: 0.5 },
  headerBadge:{ fontSize: 12, fontWeight: '600', marginTop: 1 },
  idBadge:    { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20, borderWidth: 1 },
  idText:     { fontSize: 12, fontWeight: '700' },

  // Instruction
  instructionBox:  { marginHorizontal: 20, marginTop: 16, marginBottom: 10, backgroundColor: '#EFF6FF', borderRadius: 12, padding: 14 },
  instructionTitle:{ fontSize: 15, fontWeight: '700', color: '#1E3A8A', marginBottom: 4 },
  instructionSub:  { fontSize: 13, color: '#3B82F6', lineHeight: 18 },
  boldB:           { fontWeight: '800' },

  // Linha na fase de leitura
  lineCard:    { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0' },
  lineCardB:   { backgroundColor: '#F0FDF4', borderColor: '#86EFAC' },
  speakerBadge:{ width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginRight: 10, marginTop: 2 },
  speakerText: { color: '#fff', fontSize: 13, fontWeight: '800' },
  lineEn:      { fontSize: 14, fontWeight: '600', color: '#1E293B', lineHeight: 20, marginRight: 28 },
  lineEnB:     { color: '#166534' },
  linePt:      { fontSize: 12, color: '#64748B', marginTop: 3, lineHeight: 18 },
  speakBtn:    { position: 'absolute', top: 12, right: 12 },

  // Footer
  footer:       { padding: 20, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0' },
  primaryBtn:   { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderRadius: 14, paddingVertical: 14, gap: 8 },
  primaryBtnText:{ color: '#fff', fontSize: 15, fontWeight: '700' },
  secondaryBtn: { marginTop: 12, alignItems: 'center', padding: 10 },
  secondaryBtnText:{ fontSize: 14, fontWeight: '600', color: '#64748B' },

  // Progress dots
  progressRow:  { flexDirection: 'row', justifyContent: 'center', paddingVertical: 12, gap: 8 },
  progressDot:  { width: 10, height: 10, borderRadius: 5 },

  // Histórico
  historyLine:  { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 6 },
  historyLineB: { backgroundColor: '#F0FDF4', borderRadius: 8, marginBottom: 4, borderBottomWidth: 0 },
  historyLabel: { fontSize: 11, fontWeight: '700', color: '#94A3B8', width: 20 },
  historyText:  { flex: 1, fontSize: 13, color: '#475569' },
  historyScore: { fontSize: 12, fontWeight: '700' },

  // Linha atual
  currentCard:   { backgroundColor: '#fff', borderRadius: 16, padding: 20, marginTop: 12, borderWidth: 1, borderColor: '#E2E8F0', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  speakerLabel:  { fontSize: 13, fontWeight: '700', color: '#64748B', marginBottom: 10 },
  currentEn:     { fontSize: 18, fontWeight: '700', color: '#1E293B', lineHeight: 26, marginBottom: 6 },
  currentPt:     { fontSize: 14, color: '#64748B', marginBottom: 10 },
  listenBtn:     { flexDirection: 'row', alignItems: 'center', gap: 6, borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8, alignSelf: 'flex-start' },
  listenText:    { fontSize: 13, fontWeight: '600' },

  // Hint
  hintBox:      { backgroundColor: '#FFFBEB', borderRadius: 10, padding: 12, marginBottom: 14, borderLeftWidth: 3, borderLeftColor: '#FCD34D' },
  hintLabel:    { fontSize: 11, fontWeight: '700', color: '#92400E', marginBottom: 2 },
  hintText:     { fontSize: 14, color: '#92400E', fontWeight: '500' },

  // Record button
  recordBtn:        { alignItems: 'center', justifyContent: 'center', borderRadius: 16, borderWidth: 2, paddingVertical: 24, gap: 8 },
  recordBtnActive:  { backgroundColor: '#FEF2F2' },
  recordText:       { fontSize: 14, fontWeight: '700' },
  analyzingBox:     { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, paddingVertical: 20 },
  analyzingText:    { fontSize: 14, color: '#64748B' },

  // Score após gravação
  scoreText:     { fontSize: 22, fontWeight: '800', textAlign: 'center', marginBottom: 14 },
  expectedLabel: { fontSize: 12, fontWeight: '600', color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.5 },
  expectedText:  { fontSize: 16, fontWeight: '600', color: '#1E293B', marginTop: 4 },

  // Result
  resultContainer:{ padding: 24, alignItems: 'center' },
  scoreCircle:    { width: 110, height: 110, borderRadius: 55, borderWidth: 5, alignItems: 'center', justifyContent: 'center', marginBottom: 20, marginTop: 20 },
  scoreCircleNum: { fontSize: 30, fontWeight: '800' },
  scoreCircleLbl: { fontSize: 12, fontWeight: '600', color: '#64748B' },
  resultTitle:    { fontSize: 22, fontWeight: '800', color: '#1E293B', marginBottom: 6 },
  resultSub:      { fontSize: 14, color: '#64748B', marginBottom: 24 },
  resultStarsRow: { flexDirection: 'row', gap: 8, alignItems: 'center', marginTop: 10, marginBottom: 4 },
  resultStar:     { fontSize: 44, fontWeight: '900' },
  resultMotivBox: { backgroundColor: '#F0FDF4', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 16, borderLeftWidth: 3, borderLeftColor: '#16A34A', width: '100%' },
  resultMotivText:{ fontSize: 14, fontWeight: '700', color: '#166534', textAlign: 'center' },
  detailsBox:     { width: '100%', backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 24, borderWidth: 1, borderColor: '#E2E8F0' },
  detailRow:      { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', gap: 10 },
  detailDot:      { width: 8, height: 8, borderRadius: 4 },
  detailExpected: { fontSize: 13, color: '#334155', flex: 1 },
  detailScore:    { fontSize: 14, fontWeight: '700' },
});
