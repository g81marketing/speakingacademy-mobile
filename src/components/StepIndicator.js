import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const BLUE = '#2563EB';
const GREEN = '#22C55E';

// Exibe os passos do treino (1 → 2 → 3) com estado visual:
// cinza = pendente | azul = ativo | verde com ✓ = concluído
export default function StepIndicator({ currentStep, totalSteps }) {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <React.Fragment key={step}>
          {/* Círculo do passo */}
          <View
            style={[
              styles.step,
              step < currentStep && styles.stepDone,
              step === currentStep && styles.stepActive,
            ]}
          >
            {step < currentStep ? (
              <Text style={styles.checkmark}>✓</Text>
            ) : (
              <Text
                style={[
                  styles.stepText,
                  step === currentStep && styles.stepTextActive,
                ]}
              >
                {step}
              </Text>
            )}
          </View>

          {/* Linha conectora entre os passos */}
          {step < totalSteps && (
            <View style={[styles.line, step < currentStep && styles.lineDone]} />
          )}
        </React.Fragment>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  step: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    backgroundColor: BLUE,
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  stepDone: {
    backgroundColor: GREEN,
  },
  stepText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#94A3B8',
  },
  stepTextActive: {
    color: '#FFFFFF',
  },
  checkmark: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '800',
  },
  line: {
    width: 28,
    height: 2,
    backgroundColor: '#E2E8F0',
    borderRadius: 1,
  },
  lineDone: {
    backgroundColor: GREEN,
  },
});
