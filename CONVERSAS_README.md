# 💬 Mini Conversas - Speaking Academy

## 📚 20 Blocos de Diálogos Criados

Criei 20 blocos de mini conversas seguindo a progressão pedagógica solicitada.

---

## 🎯 Estrutura

Cada bloco contém um diálogo com 4-6 falas alternadas entre duas pessoas (A e B).

### Formato:
```json
{
  "id": 1,
  "level": "beginner",
  "title": "First Meeting",
  "dialogue": [
    { "speaker": "A", "en": "Hello!", "pt": "Olá!" },
    { "speaker": "B", "en": "Hi!", "pt": "Oi!" }
  ]
}
```

---

## 📊 Progressão Pedagógica

### **BEGINNER (Blocos 1-5)**
Perguntas simples com respostas curtas

| Bloco | Título | Foco |
|-------|--------|------|
| 1 | First Meeting | Hello, How are you? |
| 2 | Do You Work? | Do you...? Yes, I do |
| 3 | Do You Speak English? | Do you speak/study? |
| 4 | Do You Have? | Do you have? Yes/No |
| 5 | Do You Like? | Do you like? Yes, I love |

**Características:**
- Perguntas fechadas (Do you...?)
- Respostas curtas (Yes, I do / No, I don't)
- Vocabulário básico reutilizado

---

### **BASIC (Blocos 6-10)**
Perguntas abertas com detalhes

| Bloco | Título | Foco |
|-------|--------|------|
| 6 | Where Do You Work? | Where...? |
| 7 | What Do You Do? | What...? Profissões |
| 8 | When Do You Work? | When...? Horários |
| 9 | Daily Routine | What time...? Rotina |
| 10 | Weekend Plans | What do you do...? |

**Características:**
- Perguntas abertas (What, Where, When)
- Respostas com detalhes
- Introdução de contexto (trabalho, rotina)

---

### **INTERMEDIATE (Blocos 11-15)**
Situações reais de trabalho

| Bloco | Título | Foco |
|-------|--------|------|
| 11 | At the Office | Reuniões, relatórios |
| 12 | Making Plans | Planos futuros |
| 13 | Asking for Help | Can you help...? |
| 14 | Phone Call | Ligações telefônicas |
| 15 | Scheduling | Agendamento |

**Características:**
- Situações profissionais reais
- Pedidos e ofertas (Can you...?)
- Comunicação prática

---

### **ADVANCED (Blocos 16-20)**
Opiniões e fluência natural

| Bloco | Título | Foco |
|-------|--------|------|
| 16 | Project Discussion | What do you think...? |
| 17 | Giving Opinions | I think..., In my opinion |
| 18 | Problem Solving | Resolução de problemas |
| 19 | Team Meeting | Let's..., I agree |
| 20 | Negotiation | Negociação, sugestões |

**Características:**
- Opiniões (I think, I believe)
- Concordância (I agree)
- Sugestões (Let's, What if)
- Diálogos mais longos (5-6 falas)

---

## 🔄 Reutilização de Vocabulário

Palavras-chave que aparecem em múltiplos blocos:

- **work** → blocos 2, 6, 7, 8, 11, 12, 16, 19
- **like** → blocos 2, 5, 6
- **have** → blocos 4, 9, 11
- **can** → blocos 12, 13, 16, 18
- **think** → blocos 16, 17, 19
- **meeting** → blocos 11, 14, 19

---

## 📍 Arquivo

**Localização:** `src/data/conversationBlocks.json`

---

## 🎓 Como Usar

### Opção 1: Integrar no app existente
Criar uma nova tela "Conversas" que carrega esses blocos e permite praticar diálogos.

### Opção 2: Substituir blocos atuais
Usar esses diálogos como formato principal de treino.

### Opção 3: Modo híbrido
Manter blocos de frases individuais + adicionar seção de conversas.

---

## 🎯 Benefícios

✅ **Contexto real** - Diálogos que acontecem no dia a dia  
✅ **Progressão natural** - Do básico ao avançado  
✅ **Vocabulário repetido** - Reforço através da prática  
✅ **Fluência** - Treina pensar em inglês  
✅ **Situações práticas** - Trabalho, reuniões, conversas  

---

## 💡 Próximos Passos Sugeridos

1. **Criar tela de conversas** no app
2. **Implementar modo de diálogo** (alterna entre pessoa A e B)
3. **Adicionar mais blocos** conforme necessário
4. **Integrar com sistema de progresso** existente

---

## ⚠️ Importante sobre Reconhecimento de Voz

**Situação atual:**
- O app usa análise **simulada** (não analisa áudio real)
- Scores são gerados aleatoriamente para prática
- Funciona offline sem necessidade de API

**Para reconhecimento REAL:**
- Configure o backend conforme `SETUP_API.md`
- Use OpenAI Whisper API
- Requer internet e chave da API

**Recomendação:**
- Mantenha a versão simulada para prática rápida
- Adicione opção de usar API real como "modo avançado"
