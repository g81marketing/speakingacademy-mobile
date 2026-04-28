# 🚀 Deploy Speaking Academy - Guia Completo

## Visão geral
- **Backend** → Render.com (grátis, dorme após 15min sem uso)
- **PostgreSQL** → Neon.tech (grátis, 500MB)
- **App** → EAS Build (APK direto ou Play Store)

---

## PARTE 1 — Subir código para o GitHub

### 1.1 Criar conta no GitHub (se não tiver)
Acesse [github.com/signup](https://github.com/signup) — gratuito, 2 minutos.

### 1.2 Criar repositório vazio
1. Entre em [github.com/new](https://github.com/new)
2. Nome: `speaking-academy` (ou o que preferir)
3. **Private** (recomendado — não exponha o código)
4. **NÃO marque** "Initialize with README"
5. Clique "Create repository"
6. Copie a URL do repositório (ex: `https://github.com/SEU_USUARIO/speaking-academy.git`)

### 1.3 Fazer primeiro push (no terminal, na pasta do projeto)
```powershell
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/speaking-academy.git
git push -u origin main
```

Na hora do `git push`, vai pedir login do GitHub — use **token de acesso** (Personal Access Token) em [github.com/settings/tokens](https://github.com/settings/tokens) → Generate new token (classic) → marque `repo` → Generate → cole quando pedir senha.

---

## PARTE 2 — Criar banco PostgreSQL no Neon

1. Acesse [neon.tech](https://neon.tech) → Sign up (grátis, use GitHub)
2. Clique **Create Project**
   - Nome: `speaking-academy`
   - Região: `AWS US East (Ohio)` (mais rápido pro Brasil no tier grátis)
3. Copie a **Connection string** que aparece (começa com `postgresql://...`)
4. Guarde essa string — vai usar no Render

---

## PARTE 3 — Deploy do Backend no Render

1. Acesse [render.com](https://render.com) → Sign up (use GitHub)
2. Clique **New +** → **Web Service**
3. Conecte sua conta GitHub e selecione o repo `speaking-academy`
4. Configure:
   - **Name**: `speaking-academy-api`
   - **Region**: Oregon (USA West)
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Plan**: Free

5. Na seção **Environment Variables**, adicione:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | (cole a connection string do Neon) |
   | `JWT_SECRET` | (gere uma chave com o comando abaixo) |
   | `JWT_EXPIRES_IN` | `7d` |
   | `NODE_ENV` | `production` |

   Para gerar o `JWT_SECRET`, rode no terminal local:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

6. Clique **Create Web Service** → aguarde 3-5 minutos

7. Quando aparecer "Live", copie a URL pública (ex: `https://speaking-academy-api.onrender.com`)

---

## PARTE 4 — Atualizar o app para usar a API de produção

Edite `src/config/api.js` e troque:
```js
export const API_URL = 'http://192.168.1.7:3000';
```
por:
```js
export const API_URL = 'https://speaking-academy-api.onrender.com';
```

Commit e push:
```powershell
git add .
git commit -m "Use production API"
git push
```

---

## PARTE 5 — Testar

1. Abra o app no celular (Expo Go)
2. Cadastre um usuário novo — se funcionar, o backend está no ar 🎉
3. Acesse `https://SEU_BACKEND.onrender.com/` no navegador — deve retornar `{"status":"ok",...}`

---

## ⚠️ Atenção — Tier grátis do Render

O serviço **dorme após 15 min sem uso**. A primeira requisição demora ~30s para "acordar". Para produção real, suba pro plano **Starter ($7/mês)** que mantém sempre online.

---

## Próximos passos

- [ ] Gerar APK com `eas build`
- [ ] Criar conta Google Play Developer (US$25 one-time)
- [ ] Publicar na Play Store
