# Sistema de Assinatura Premium - Setup e Configuração

## Visão Geral
Sistema de assinatura FREE e PREMIUM integrado com Mercado Pago para pagamentos recorrentes.

## Backend - Configuração

### 1. Variáveis de Ambiente (.env)
Adicione as seguintes variáveis ao arquivo `backend/.env`:

```env
# Mercado Pago
MP_ACCESS_TOKEN=seu_access_token_aqui
MP_WEBHOOK_SECRET=sua_chave_secreta_webhook_aqui

# Configuração Premium
PREMIUM_PRICE_BRL=29.90
PREMIUM_NAME=Speaking Academy Premium

# URLs de callback
BACKEND_URL=https://seu-backend.com
MP_SUCCESS_URL=https://seu-backend.com/subscription/success
```

### 2. Instalação de Dependências
```bash
cd backend
npm install
```

A dependência `mercadopago` já foi adicionada ao `package.json`.

### 3. Migration do Banco de Dados
```bash
cd backend
npx prisma migrate dev --name add_subscription_fields
```

A migration adiciona os seguintes campos ao modelo User:
- `subscriptionStatus`: Enum (pending, active, cancelled, expired)
- `subscriptionExpiresAt`: DateTime
- `paymentCustomerId`: String
- `paymentSubscriptionId`: String

### 4. Mercado Pago - Configuração

#### Obter Access Token
1. Acesse [Mercado Pago Developers](https://developer.mercadopago.com/)
2. Crie uma aplicação ou use existente
3. Copie o `Access Token` (Production ou Test)

#### Configurar Webhook
1. No painel do Mercado Pago, configure o webhook URL:
   - URL: `https://seu-backend.com/subscription/webhook`
   - Events: `subscription_preapproval`, `payment`
2. Copie o `Webhook Secret` para validar as requisições

#### Criar Plano de Assinatura (PreApproval)
No painel do Mercado Pago, crie um plano de assinatura:
- Preço: R$ 29,90 (ou valor definido em `PREMIUM_PRICE_BRL`)
- Frequência: Mensal
- Moeda: BRL

## Frontend - Configuração

### 1. Instalação de Dependências
```bash
cd .
npm install
```

A dependência `expo-web-browser` já foi adicionada ao `package.json`.

### 2. Variáveis de Ambiente (opcional)
Se precisar configurar a URL do backend, pode usar uma variável de ambiente ou configurar diretamente em `src/services/api.js`.

## Funcionalidades Implementadas

### Backend
- **Mercado Pago SDK**: `backend/src/lib/mercadoPago.js`
- **Service Layer**: `backend/src/services/subscriptionService.js`
  - `createCheckout()`: Cria checkout de assinatura
  - `getStatus()`: Obtém status da assinatura
  - `handleWebhook()`: Processa notificações do Mercado Pago
  - `cancelSubscription()`: Cancela assinatura
- **Controller**: `backend/src/controllers/subscriptionController.js`
- **Routes**: `backend/src/routes/subscription.js`
  - `POST /subscription/webhook` (público) - Recebe notificações
  - `POST /subscription/checkout` (autenticado) - Cria checkout
  - `GET /subscription/status` (autenticado) - Status da assinatura
  - `POST /subscription/cancel` (autenticado) - Cancela assinatura
- **Middleware**: `backend/src/middleware/requirePremium.js` - Protege rotas premium

### Frontend
- **API Calls**: `src/services/api.js`
  - `createSubscriptionCheckout()`
  - `getSubscriptionStatus()`
  - `cancelSubscription()`
- **AuthContext**: Atualizado com `refreshSubscription()` e `isPremium` computed
- **Componentes**:
  - `PremiumBadge`: Badge visual para identificar conteúdo premium
  - `UpgradeModal`: Modal para iniciar checkout via WebBrowser
  - `LockedContent`: Wrapper para bloquear conteúdo não premium
  - `PremiumRoute`: HOC para proteger telas premium
- **Telas Integradas**:
  - `ProfileScreen`: Gerenciamento de assinatura
  - `LevelSelectionScreen`: Bloqueio de níveis intermediário/avançado
  - `SpeakingAIScreen`: Bloqueio completo (recurso premium)

## Fluxo de Upgrade

1. Usuário FREE tenta acessar recurso premium
2. `LockedContent` exibe prompt de upgrade
3. Usuário clica em "Assinar Premium"
4. `UpgradeModal` abre e chama `createSubscriptionCheckout()`
5. Backend cria PreApproval no Mercado Pago
6. Frontend abre URL de checkout com `WebBrowser.openBrowserAsync()`
7. Usuário completa pagamento no Mercado Pago
8. Mercado Pago envia webhook para backend
9. Backend valida assinatura e atualiza usuário para PREMIUM
10. Webhook retorna página de sucesso
11. Usuário volta ao app e `refreshSubscription()` atualiza estado local

## Fluxo de Expiração/Cancelamento

- **Cancelamento**: Usuário cancela via ProfileScreen → Backend cancela no Mercado Pago → Status muda para `cancelled`
- **Expiração**: Webhook detecta pagamento não realizado → Status muda para `expired` → Usuário volta para FREE

## Segurança

- Webhook validado com HMAC signature
- Endpoints protegidos com JWT
- Removido endpoint inseguro `/user/plan`
- Middleware `requirePremium` para proteger rotas sensíveis
- Verificação de expiração de assinatura em tempo real

## Testes

### Testar Webhook (Local)
Use ngrok para expor backend local:
```bash
ngrok http 3000
```
Configure webhook no Mercado Pago com a URL do ngrok.

### Testar Checkout
1. Use token de teste do Mercado Pago
2. Simula pagamento no ambiente de sandbox
3. Verifica webhook recebido
4. Confirma atualização no banco de dados

## Estrutura de Arquivos

### Backend
```
backend/
├── prisma/
│   └── schema.prisma (atualizado)
├── src/
│   ├── lib/
│   │   └── mercadoPago.js (novo)
│   ├── services/
│   │   └── subscriptionService.js (novo)
│   ├── controllers/
│   │   └── subscriptionController.js (novo)
│   ├── routes/
│   │   └── subscription.js (novo)
│   ├── middleware/
│   │   └── requirePremium.js (novo)
│   ├── repositories/
│   │   └── userRepository.js (atualizado)
│   └── app.js (atualizado)
└── package.json (atualizado)
```

### Frontend
```
src/
├── services/
│   └── api.js (atualizado)
├── context/
│   └── AuthContext.js (atualizado)
├── components/
│   ├── PremiumBadge.js (novo)
│   ├── UpgradeModal.js (novo)
│   ├── LockedContent.js (novo)
│   └── PremiumRoute.js (novo)
├── screens/
│   ├── ProfileScreen.js (atualizado)
│   ├── LevelSelectionScreen.js (atualizado)
│   └── SpeakingAIScreen.js (atualizado)
└── package.json (atualizado)
```

## Próximos Passos (Opcionais)

1. **Analytics**: Rastrear conversões de upgrade
2. **Trial Period**: Oferecer período gratuito
3. **Promotions**: Cupons de desconto
4. **Email Notifications**: Alertas de renovação/expiração
5. **Admin Dashboard**: Painel para gerenciar assinaturas
