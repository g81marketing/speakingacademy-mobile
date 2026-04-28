# Speaking Academy – Inglês Automático

MVP de aplicativo mobile para **prática de fala em inglês** com foco no ambiente profissional.

---

## 🚀 Como rodar

### 1. Instale as dependências

```bash
npm install
```

### 2. Inicie o Expo

```bash
npx expo start
```

### 3. Abra no celular

- Instale o app **Expo Go** (iOS ou Android)
- Escaneie o QR Code exibido no terminal

---

## 📁 Estrutura do projeto

```
APP-SPEAKING/
├── App.js                        # Ponto de entrada
├── app.json                      # Configuração Expo
├── babel.config.js
├── package.json
└── src/
    ├── context/
    │   └── AppContext.js         # Estado global (streak, progresso, etc.)
    ├── data/
    │   └── phrases.js            # Base de frases (17 frases, 3 níveis, 3 categorias)
    ├── navigation/
    │   └── AppNavigator.js       # React Navigation (stack + bottom tabs)
    ├── screens/
    │   ├── HomeScreen.js         # Tela inicial com streak e início de treino
    │   ├── TrainingScreen.js     # Fluxo de treino em 3 etapas
    │   ├── LibraryScreen.js      # Biblioteca com filtros de nível/categoria
    │   ├── ProgressScreen.js     # Estatísticas e metas
    │   └── ProfileScreen.js      # Perfil do usuário e configurações
    └── components/
        ├── StepIndicator.js      # Indicador visual das etapas (1 → 2 → 3)
        ├── ProgressBar.js        # Barra de progresso reutilizável
        └── PhraseCard.js         # Card de frase usado na Biblioteca
```

---

## 🎯 Funcionalidades

### Treino em 3 Etapas
| Etapa | Descrição |
|-------|-----------|
| **1** | Veja a frase em inglês, ouça o áudio (TTS), repita 3 vezes |
| **2** | Veja a tradução em português e tente falar em inglês |
| **3** | Revisão final com inglês + português, ouça e repita |

### Áudio
Usa **expo-speech** (Text-to-Speech nativo) para reproduzir frases em inglês com voz americana.

### Persistência
Progresso salvo localmente com **AsyncStorage** — streak e estatísticas sobrevivem ao fechamento do app.

---

## 📊 Dados

**17 frases** distribuídas em:
- **Níveis**: Básico · Intermediário · Avançado
- **Categorias**: Trabalho · Reuniões · E-mails

---

## 🎨 Design

- Fundo branco e cinza claro (`#F8FAFC`)
- Cor primária azul (`#2563EB`)
- Tipografia grande e centralizada
- Botões arredondados com sombra suave
- Componentes minimalistas

---

## 📦 Dependências principais

| Pacote | Uso |
|--------|-----|
| `expo` ~51 | Base Expo SDK |
| `expo-speech` | Text-to-Speech |
| `@react-navigation/native` | Navegação |
| `@react-navigation/bottom-tabs` | Menu inferior |
| `@react-navigation/native-stack` | Stack de telas |
| `@react-native-async-storage/async-storage` | Persistência local |
| `@expo/vector-icons` | Ícones (Ionicons) |
