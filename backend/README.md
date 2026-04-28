# Speaking Academy – Backend API v2
> Node.js · Express · PostgreSQL · Prisma ORM · JWT · Zod 🎙️

API REST para o aplicativo **Speaking Academy – Inglês Automático**.

## Stack

| Camada       | Tecnologia                        |
|--------------|-----------------------------------|
| Runtime      | Node.js 18+                       |
| Framework    | Express 4                         |
| Banco        | PostgreSQL 15+                    |
| ORM          | Prisma 5                          |
| Auth         | JWT (jsonwebtoken)                 |
| Validação    | Zod                               |
| Rate Limit   | express-rate-limit                |

---

## Estrutura de Pastas

```
backend/
├── prisma/
│   ├── schema.prisma             # Modelos do banco (7 entidades)
│   └── seed.js                   # Seed de missões e conquistas
├── src/
│   ├── app.js                    # Bootstrap da aplicação
│   ├── lib/
│   │   └── prisma.js             # Cliente Prisma singleton
│   ├── utils/
│   │   ├── jwt.js                # signToken / verifyToken
│   │   └── xp.js                 # calcStars, calcXpGained, calcStreak…
│   ├── repositories/             # Acesso direto ao banco (Prisma)
│   │   ├── userRepository.js
│   │   ├── missionRepository.js
│   │   ├── progressRepository.js
│   │   ├── practiceRepository.js
│   │   ├── streakRepository.js
│   │   └── achievementRepository.js
│   ├── services/                 # Regras de negócio
│   │   ├── authService.js
│   │   ├── missionService.js
│   │   ├── progressService.js
│   │   ├── practiceService.js
│   │   └── userService.js
│   ├── controllers/              # HTTP handlers (finos)
│   │   ├── authController.js
│   │   ├── missionController.js
│   │   ├── progressController.js
│   │   ├── practiceController.js
│   │   └── userController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── missions.js
│   │   ├── progress.js
│   │   ├── practice.js
│   │   └── user.js
│   └── middleware/
│       ├── auth.js               # Verificação JWT → req.userId
│       ├── validate.js           # Validação Zod → 422 estruturado
│       └── errorHandler.js       # Handler global de erros
├── .env.example
└── package.json
```

---

## Como Rodar

### 1. Pré-requisitos

- Node.js 18+
- PostgreSQL 15+ rodando localmente ou em nuvem (Supabase / Railway / Render)

### 2. Instalar dependências

```bash
cd backend
npm install
```

### 3. Configurar variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env`:

```env
PORT=3000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/speaking_academy?schema=public"
JWT_SECRET=chave_secreta_64_chars_aqui
JWT_EXPIRES_IN=7d
```

> Para gerar um JWT_SECRET seguro:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### 4. Gerar o Prisma Client e rodar as migrations

```bash
npm run db:generate   # gera o client Prisma
npm run db:migrate    # cria as tabelas no banco
```

### 5. Popular o banco com missões e conquistas

```bash
npm run db:seed
```

### 6. Iniciar o servidor

```bash
npm run dev    # desenvolvimento (hot reload)
npm start      # produção
```

O servidor estará disponível em `http://localhost:3000`.

### Scripts disponíveis

| Script            | O que faz                              |
|-------------------|----------------------------------------|
| `npm run dev`     | Nodemon com hot reload                 |
| `npm start`       | Inicia em produção                     |
| `npm run db:generate` | Gera o Prisma Client               |
| `npm run db:migrate`  | Aplica migrations no banco         |
| `npm run db:studio`   | Abre o Prisma Studio (GUI)         |
| `npm run db:seed`     | Popula missões e conquistas        |

---

## Rotas da API

Todas as rotas protegidas requerem o header:
```
Authorization: Bearer <jwt_token>
```

---

### AUTH

| Método | Rota            | Descrição           | Auth |
|--------|-----------------|---------------------|------|
| POST   | /auth/register  | Cadastro            | ❌   |
| POST   | /auth/login     | Login + JWT         | ❌   |

**POST /auth/register**
```json
{
  "name": "Ana Lima",
  "email": "ana@email.com",
  "password": "minimo6chars",
  "level": "beginner"
}
```
**Resposta 201:**
```json
{ "user": { "id": "uuid", "name": "Ana Lima", ... }, "token": "eyJ..." }
```

---

### MISSIONS

| Método | Rota            | Descrição                          | Auth |
|--------|-----------------|------------------------------------|------|
| GET    | /missions       | Lista todas as missões             | ✅   |
| GET    | /missions?level=beginner | Filtra por nível          | ✅   |
| GET    | /missions/:id   | Detalhe de uma missão              | ✅   |

**Resposta GET /missions:**
```json
{
  "missions": [
    {
      "id": "uuid",
      "title": "Apresentação Básica",
      "level": "beginner",
      "order": 1,
      "isLocked": false,
      "xpReward": 10,
      "progress": { "completed": false, "score": 0, "stars": 0 }
    }
  ]
}
```

---

### PROGRESS

| Método | Rota                 | Descrição                      | Auth |
|--------|----------------------|--------------------------------|------|
| POST   | /progress            | Submete resultado de missão    | ✅   |
| GET    | /progress/me         | Progresso do usuário logado    | ✅   |
| GET    | /progress/:userId    | Progresso por userId           | ✅   |

**POST /progress**
```json
{ "missionId": "uuid-da-missao", "score": 85 }
```
**Resposta 201:**
```json
{
  "progress": { "completed": true, "score": 85, "stars": 2, "attempts": 1 },
  "xpGained": 25,
  "newAchievements": [{ "key": "first_mission", "title": "Primeira Missão!" }]
}
```

---

### PRACTICE

| Método | Rota              | Descrição                    | Auth |
|--------|-------------------|------------------------------|------|
| POST   | /practice         | Registra resultado           | ✅   |
| GET    | /practice/history | Histórico + estatísticas     | ✅   |

**POST /practice**
```json
{
  "missionId": "uuid-opcional",
  "phrase": "Hello! How are you?",
  "userAnswer": "Hello! How are you?",
  "score": 92
}
```

**GET /practice/history?limit=20&offset=0**
```json
{
  "results": [...],
  "stats": { "avgScore": 78, "total": 42 }
}
```

---

### USER

| Método | Rota           | Descrição                         | Auth |
|--------|----------------|-----------------------------------|------|
| GET    | /user/profile  | Perfil completo + conquistas      | ✅   |
| PATCH  | /user/profile  | Atualiza name e/ou level          | ✅   |

**GET /user/profile — Resposta:**
```json
{
  "profile": {
    "id": "uuid",
    "name": "Ana Lima",
    "level": "beginner",
    "xp": 120,
    "xpLevel": 2,
    "xpProgress": 45,
    "streak": 5,
    "achievements": [...],
    "streakHistory": [...]
  }
}
```

---

## Regras de Negócio

### Progresso (POST /progress)
1. Missão bloqueada → **403 Forbidden**
2. Score calculado pelo app mobile (Whisper local ou API)
3. Missão concluída se `score >= 70`
4. **Estrelas**: 0 pts < 50 → 0⭐ | ≥50 → 1⭐ | ≥70 → 2⭐ | ≥90 → 3⭐
5. **XP**: `xpReward da missão + bônus por estrelas` (2⭐ → +5, 3⭐ → +15)
6. Conclusão desbloqueia a próxima missão do mesmo nível
7. Streak incrementa se praticar em dia consecutivo, reseta se pular dia

### Níveis de XP (xpLevel)
| Nível | XP necessário |
|-------|---------------|
| 1     | 0             |
| 2     | 100           |
| 3     | 250           |
| 4     | 500           |
| 5     | 900           |
| 6     | 1400          |
| 7     | 2000          |
| 8     | 2800          |
| 9     | 3800          |
| 10    | 5000          |

### Conquistas automáticas (verificadas a cada POST /progress)
| Key             | Condição                                  |
|-----------------|-------------------------------------------|
| first_mission   | Primeira missão concluída                 |
| perfect_score   | Score = 100                               |
| streak_3        | Streak ≥ 3 dias                           |
| streak_7        | Streak ≥ 7 dias                           |
| streak_30       | Streak ≥ 30 dias                          |
| level_up        | Subiu de nível de XP                      |
| beginner_done   | Todas as missões beginner concluídas      |
| inter_done      | Todas as missões intermediate concluídas  |
| advanced_done   | Todas as missões advanced concluídas      |
