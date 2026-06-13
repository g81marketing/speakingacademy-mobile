# Configuração de Keystore para Google Play Store

## Visão Geral

Para publicar seu app na Google Play Store, você precisa de uma **keystore** (chave de assinatura) e fornecer a impressão digital **SHA-256** ao Google Play Console.

## O que é necessário?

1. **Android Studio** ou **JDK** (Java Development Kit) instalado
2. Executar o script de geração de keystore
3. Copiar o SHA-256 para configurar no Google Play Console

## Passo a Passo

### 1. Instalar Android Studio ou JDK

#### Opção A: Android Studio (Recomendado)
1. Baixe em: https://developer.android.com/studio
2. Instale com as configurações padrão
3. O `keytool` será instalado automaticamente em:
   - `C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe`

#### Opção B: JDK (Java Development Kit)
1. Baixe em: https://adoptium.net/ (Eclipse Temurin)
2. Escolha a versão **JDK 17 LTS**
3. Instale com as configurações padrão
4. O `keytool` será instalado em:
   - `C:\Program Files\Eclipse Adoptium\jdk-17...\bin\keytool.exe`

### 2. Gerar a Keystore

Após instalar o Android Studio ou JDK:

#### Opção 1: Script PowerShell (Recomendado)
```powershell
# Abra o PowerShell na pasta do projeto e execute:
.\generate-keystore.ps1
```

O script irá:
- Encontrar automaticamente o keytool
- Gerar a keystore (`speaking-academy-keystore.jks`)
- Exibir os fingerprints (SHA-256, SHA-1, MD5)
- Salvar informações em `keystore-info.txt`

#### Opção 2: Script Batch
```cmd
# Abra o CMD na pasta do projeto e execute:
generate-keystore.bat
```

#### Opção 3: Comando Manual
Se preferir, execute o comando keytool manualmente:

```bash
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore speaking-academy-keystore.jks \
  -alias speaking-academy \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000 \
  -dname "CN=Speaking Academy, OU=Development, O=Speaking Academy, L=Sao Paulo, ST=SP, C=BR"
```

### 3. Obter o SHA-256

Após gerar a keystore, execute:

```bash
keytool -list -v -keystore speaking-academy-keystore.jks -alias speaking-academy
```

Copie o valor do **SHA-256** (será algo como):
```
SHA256: A1:B2:C3:D4:E5:F6:... (64 caracteres hexadecimais)
```

### 4. Configurar no Google Play Console

1. Acesse: https://play.google.com/console
2. Selecione seu app
3. Vá em **"Configuração" > "Integridade do app"**
4. Na seção **"Chaves de assinatura do app"**, clique em **"Trocar"** ou **"Configurar"**
5. Escolha **"Exportar e fazer upload de uma chave de uma chave de assinatura existente"**
6. Faça upload do arquivo `.jks` ou `.keystore`
7. Informe o **SHA-256** quando solicitado

## Estrutura de Arquivos Gerados

```
APP-SPEAKING/
├── speaking-academy-keystore.jks    ← SUA KEYSTORE (GUARDE BEM!)
├── keystore-info.txt              ← Informações e senhas
├── generate-keystore.ps1          ← Script PowerShell
└── generate-keystore.bat          ← Script Batch
```

## ⚠️ IMPORTANTE - LEIA COM ATENÇÃO!

### Segurança da Keystore
- **A keystore é única e irreversível!**
- **Sem a keystore e a senha, você NÃO pode atualizar o app**
- Guarde o arquivo `.jks` e as senhas em local seguro (backup!)
- Não compartilhe a keystore ou senhas publicamente

### Senhas
- Anote as senhas exatamente como digitou (diferenciam maiúsculas/minúsculas)
- Use senhas fortes (mínimo 6 caracteres)
- Guarde as senhas junto com o arquivo da keystore

### Backup
- Faça backup da keystore em múltiplos locais (pendrive, nuvem criptografada, etc.)
- Teste o backup antes de precisar usá-lo

## Expo EAS Build (Opcional)

Se estiver usando EAS Build, você pode configurar a keystore automaticamente:

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login no Expo
npx eas login

# Configurar credenciais (gera ou usa keystore existente)
npx eas credentials
```

Para usar sua keystore personalizada no EAS:
```bash
npx eas credentials
# Selecione: Android > production > Update credentials
# Escolha: Select existing keystore
# Informe o caminho do arquivo .jks
```

## Troubleshooting

### "keytool não é reconhecido"
- Instale Android Studio ou JDK (veja Passo 1)
- Ou adicione ao PATH: `C:\Program Files\Android\Android Studio\jbr\bin`

### "Acesso negado" no PowerShell
Execute o PowerShell como Administrador ou use:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### "Senha incorreta"
- Verifique se não há espaços extras
- Verifique Caps Lock
- Recrie a keystore se necessário (mas não poderá atualizar apps antigos)

## Comandos Úteis

### Verificar informações da keystore:
```bash
keytool -list -v -keystore speaking-academy-keystore.jks
```

### Exportar certificado (PEM):
```bash
keytool -exportcert -alias speaking-academy -keystore speaking-academy-keystore.jks -file certificate.pem
```

### Converter keystore (JKS para PKCS12):
```bash
keytool -importkeystore \
  -srckeystore speaking-academy-keystore.jks \
  -destkeystore speaking-academy.p12 \
  -deststoretype PKCS12
```

## Links Úteis

- **Android Studio**: https://developer.android.com/studio
- **Eclipse Temurin JDK**: https://adoptium.net/
- **Google Play Console**: https://play.google.com/console
- **Documentação Expo**: https://docs.expo.dev/app-signing/app-credentials/

## Suporte

Se tiver problemas:
1. Verifique se Android Studio/JDK está instalado corretamente
2. Execute o script com privilégios de administrador
3. Consulte o arquivo `keystore-info.txt` gerado pelo script
