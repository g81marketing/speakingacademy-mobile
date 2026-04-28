import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import HomeScreen from '../screens/HomeScreen';
import LibraryScreen from '../screens/LibraryScreen';
import ProgressScreen from '../screens/ProgressScreen';
import ProfileScreen from '../screens/ProfileScreen';
import TrainingScreen from '../screens/TrainingScreen';
import ResultScreen from '../screens/ResultScreen';
import LevelSelectionScreen from '../screens/LevelSelectionScreen';
import BlockScreen from '../screens/BlockScreen';
import ConversationScreen from '../screens/ConversationScreen';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import AuthScreen from '../screens/onboarding/AuthScreen';
import GoalScreen from '../screens/onboarding/GoalScreen';
import MicPermissionScreen from '../screens/onboarding/MicPermissionScreen';
import DemoLessonScreen from '../screens/onboarding/DemoLessonScreen';
import PaywallScreen from '../screens/PaywallScreen';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const PURPLE = '#7B2FFF';
const GRAY   = '#555577';
const BG_TAB = '#07050F';

// Navegador de abas inferiores: Home | Biblioteca | Progresso | Perfil
function MainTabs() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = 62 + insets.bottom;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          const icons = {
            Home: focused ? 'home' : 'home-outline',
            Biblioteca: focused ? 'library' : 'library-outline',
            Progresso: focused ? 'bar-chart' : 'bar-chart-outline',
            Perfil: focused ? 'person' : 'person-outline',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
        tabBarActiveTintColor: PURPLE,
        tabBarInactiveTintColor: GRAY,
        tabBarStyle: {
          backgroundColor: BG_TAB,
          borderTopColor: '#1E1E2E',
          borderTopWidth: 1,
          paddingBottom: insets.bottom > 0 ? insets.bottom : 8,
          paddingTop: 6,
          height: tabBarHeight,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Biblioteca" component={LibraryScreen} />
      <Tab.Screen name="Progresso" component={ProgressScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Navegador raiz — todas as telas sempre registradas
// initialRouteName controlado pelo nível escolhido pelo aluno
export default function AppNavigator() {
  const { userSelectedLevel, onboardingComplete, isLoaded } = useApp();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  // Aguarda o AsyncStorage carregar antes de montar o navigator
  if (!isLoaded || authLoading) return null;

  const initialRoute = !onboardingComplete
    ? 'Welcome'
    : !isAuthenticated
    ? 'Auth'
    : userSelectedLevel == null
    ? 'LevelSelection'
    : 'Main';

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName={initialRoute}
      >
        {/* ── Onboarding ─────────────────────────────────────── */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen
          name="Auth"
          component={AuthScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Goal"
          component={GoalScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="OnboardingLevel"
          component={LevelSelectionScreen}
          options={{ animation: 'slide_from_right' }}
          initialParams={{ fromOnboarding: true }}
        />
        <Stack.Screen
          name="MicPermission"
          component={MicPermissionScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="DemoLesson"
          component={DemoLessonScreen}
          options={{ animation: 'slide_from_right' }}
        />

        {/* ── App principal ──────────────────────────────────── */}
        <Stack.Screen
          name="LevelSelection"
          component={LevelSelectionScreen}
          options={{ animation: 'fade', gestureEnabled: false }}
        />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen
          name="Training"
          component={TrainingScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Result"
          component={ResultScreen}
          options={{ animation: 'slide_from_right' }}
        />
        <Stack.Screen
          name="Block"
          component={BlockScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Conversation"
          component={ConversationScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
        <Stack.Screen
          name="Paywall"
          component={PaywallScreen}
          options={{ presentation: 'modal', animation: 'slide_from_bottom' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
