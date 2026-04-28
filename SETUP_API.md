# 🎙️ Configuração da API de Reconhecimento de Voz

O app agora está integrado com o backend para usar **reconhecimento de voz real** via OpenAI Whisper.

---

## 📋 Pré-requisitos

1. **Node.js** instalado (v16 ou superior)
2. **MongoDB** rodando (local ou MongoDB Atlas)
3. **Chave da API OpenAI** (para Whisper)
4. **Computador e celular na mesma rede Wi-Fi**

---

## 🚀 Passo a Passo

### 1. Instalar dependências do backend

```bash
cd backend
npm install
```

### 2. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o arquivo `.env`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/speaking_academy
JWT_SECRET=sua_chave_secreta_super_longa_aqui
JWT_EXPIRES_IN=30d
OPENAI_API_KEY=sk-proj-...
```

**Como obter a chave OpenAI:**
1. Acesse https://platform.openai.com/api-keys
2. Faça login ou crie uma conta
3. Clique em "Create new secret key"
4. Copie a chave (começa com `sk-proj-...`)
5. Cole no `.env`

### 3. Importar os 100 blocos de treino

```bash
npm run seed
```

Você verá: `📦 Seed concluído: 100 inseridos, 0 atualizados.`

### 4. Iniciar o backend

```bash
npm start
```

Você verá:
```
✅ MongoDB conectado
🚀 Servidor rodando na porta 3000
```

### 5. Descobrir o IP do seu computador

**Windows:**
```bash
ipconfig
```
Procure por `IPv4 Address` (ex: `192.168.1.7`)

**Mac/Linux:**
```bash
ifconfig
```
Procure por `inet` (ex: `192.168.1.7`)

### 6. Configurar o IP no app

Edite o arquivo `src/config/api.js`:

```js
export const API_URL = 'http://192.168.1.7:3000'; // Seu IP aqui
```

### 7. Reiniciar o app

No terminal do Expo, pressione **`r`** para recarregar o app.

---

## 🧪 Testar a integração

### Opção 1: Criar uma conta de teste

No app, vá para a tela de login/registro e crie uma conta:
- Nome: Teste
- Email: teste@email.com
- Senha: 123456

### Opção 2: Usar o Postman/Insomnia

**Registrar usuário:**
```http
POST http://192.168.1.7:3000/auth/register
Content-Type: application/json

{
  "name": "Teste",
  "email": "teste@email.com",
  "password": "123456",
  "level": "beginner"
}
```

**Resposta:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": { ... }
}
```

Copie o `token` e use nas próximas requisições:
```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔧 Troubleshooting

### Erro: "Network request failed"

**Causa:** App não consegue conectar ao backend.

**Soluções:**
1. Verifique se o backend está rodando (`npm start`)
2. Verifique se o IP em `src/config/api.js` está correto
3. Verifique se celular e computador estão na mesma rede Wi-Fi
4. Desative o firewall do Windows temporariamente

### Erro: "Token inválido ou expirado"

**Causa:** Token JWT expirou ou não foi enviado.

**Solução:** Faça login novamente no app.

### Erro: "Erro na transcrição"

**Causa:** Chave da API OpenAI inválida ou sem créditos.

**Soluções:**
1. Verifique se `OPENAI_API_KEY` está correto no `.env`
2. Verifique se tem créditos na conta OpenAI
3. Reinicie o backend após alterar o `.env`

### Erro: "MongoDB connection failed"

**Causa:** MongoDB não está rodando.

**Soluções:**
1. Instale MongoDB: https://www.mongodb.com/try/download/community
2. Inicie o serviço MongoDB
3. Ou use MongoDB Atlas (nuvem grátis): https://www.mongodb.com/cloud/atlas

---

## 📱 Como funciona agora

### Antes (Mock):
```
Gravar áudio → Transcrição simulada → Score calculado localmente
```

### Agora (Real):
```
Gravar áudio → Enviar para backend → OpenAI Whisper transcreve → Score calculado → Retorna para app
```

### Fluxo completo:

1. **Usuário grava áudio** no app
2. **App envia** para `POST /speech/evaluate` com:
   - `audio`: arquivo .m4a
   - `expected`: frase correta em inglês
3. **Backend processa**:
   - Envia áudio para OpenAI Whisper API
   - Recebe transcrição
   - Calcula score usando Levenshtein distance
4. **Backend retorna** `{ transcript, score }`
5. **App exibe** resultado para o usuário

---

## 💰 Custos da API OpenAI

**Whisper API:**
- $0.006 por minuto de áudio
- Cada gravação tem ~5 segundos = $0.0005
- 100 gravações = $0.05
- 1000 gravações = $0.50

**Créditos grátis:**
- Novas contas ganham $5 de crédito grátis
- Suficiente para ~10.000 transcrições

---

## 🎯 Próximos passos

- [ ] Implementar tela de login/registro no app
- [ ] Salvar progresso no backend ao completar blocos
- [ ] Sincronizar XP e streak com o backend
- [ ] Adicionar tela de conquistas
- [ ] Implementar sistema de ranking

---

## 📞 Suporte

Se tiver problemas, verifique:
1. Backend rodando? ✅
2. MongoDB conectado? ✅
3. IP correto no app? ✅
4. Mesma rede Wi-Fi? ✅
5. OpenAI API Key válida? ✅

Todos os logs aparecem no terminal do backend.
