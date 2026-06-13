# Script para gerar Keystore e obter SHA-256 para Google Play Store
# Requisitos: Android Studio ou JDK instalado

param(
    [string]$AppName = "speaking-academy",
    [string]$KeyAlias = "speaking-academy-key",
    [string]$KeystoreName = "speaking-academy-keystore.jks",
    [int]$ValidityDays = 10000
)

Write-Host "=== GERADOR DE KEYSTORE PARA GOOGLE PLAY STORE ===" -ForegroundColor Cyan
Write-Host ""

# Tentar encontrar keytool automaticamente
$keytoolPaths = @(
    # Android Studio
    "${env:ProgramFiles}\Android\Android Studio\jbr\bin\keytool.exe",
    "${env:ProgramFiles(x86)}\Android\Android Studio\jbr\bin\keytool.exe",
    # JDK/JRE comuns
    "${env:ProgramFiles}\Java\*\bin\keytool.exe",
    "${env:ProgramFiles(x86)}\Java\*\bin\keytool.exe",
    "${env:ProgramFiles}\Eclipse Adoptium\*\bin\keytool.exe",
    "${env:ProgramFiles}\Microsoft\*\bin\keytool.exe",
    # OpenJDK
    "${env:LOCALAPPDATA}\Programs\Eclipse Adoptium\*\bin\keytool.exe",
    # EAS
    "${env:LOCALAPPDATA}\Android\Sdk\*\bin\keytool.exe"
)

$keytool = $null
foreach ($path in $keytoolPaths) {
    $found = Get-ChildItem -Path $path -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($found) {
        $keytool = $found.FullName
        Write-Host "✓ Keytool encontrado: $keytool" -ForegroundColor Green
        break
    }
}

if (-not $keytool) {
    Write-Host "✗ Keytool não encontrado automaticamente." -ForegroundColor Red
    Write-Host ""
    Write-Host "Opções:" -ForegroundColor Yellow
    Write-Host "1. Instale o Android Studio: https://developer.android.com/studio" -ForegroundColor White
    Write-Host "2. Ou instale o JDK: https://adoptium.net/" -ForegroundColor White
    Write-Host ""
    Write-Host "Após instalar, execute este script novamente." -ForegroundColor Yellow
    exit 1
}

# Verificar se keystore já existe
if (Test-Path $KeystoreName) {
    Write-Host "✗ Keystore '$KeystoreName' já existe!" -ForegroundColor Red
    $overwrite = Read-Host "Deseja sobrescrever? (s/N)"
    if ($overwrite -ne 's' -and $overwrite -ne 'S') {
        Write-Host "Operação cancelada." -ForegroundColor Yellow
        exit 0
    }
    Remove-Item $KeystoreName -Force
}

# Solicitar senhas
Write-Host ""
Write-Host "=== CONFIGURAÇÃO DA SENHA ===" -ForegroundColor Cyan
Write-Host "IMPORTANTE: Guarde estas senhas! Você precisará delas para publicar atualizações." -ForegroundColor Yellow
$storepass = Read-Host "Digite a senha do keystore (mínimo 6 caracteres)" -AsSecureString
$storepassPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($storepass))

if ($storepassPlain.Length -lt 6) {
    Write-Host "✗ Senha deve ter no mínimo 6 caracteres!" -ForegroundColor Red
    exit 1
}

$keypass = Read-Host "Digite a senha da chave (ou Enter para usar a mesma do keystore)" -AsSecureString
$keypassPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto([System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($keypass))
if ([string]::IsNullOrWhiteSpace($keypassPlain)) {
    $keypassPlain = $storepassPlain
}

# Informações do certificado
Write-Host ""
Write-Host "=== INFORMAÇÕES DO CERTIFICADO ===" -ForegroundColor Cyan
$CN = Read-Host "Nome (CN) [Speaking Academy]"
if ([string]::IsNullOrWhiteSpace($CN)) { $CN = "Speaking Academy" }

$OU = Read-Host "Unidade Organizacional (OU) [Development]"
if ([string]::IsNullOrWhiteSpace($OU)) { $OU = "Development" }

$O = Read-Host "Organização (O) [Speaking Academy]"
if ([string]::IsNullOrWhiteSpace($O)) { $O = "Speaking Academy" }

$L = Read-Host "Cidade (L) [São Paulo]"
if ([string]::IsNullOrWhiteSpace($L)) { $L = "São Paulo" }

$ST = Read-Host "Estado (ST) [SP]"
if ([string]::IsNullOrWhiteSpace($ST)) { $ST = "SP" }

$C = Read-Host "País (C) [BR]"
if ([string]::IsNullOrWhiteSpace($C)) { $C = "BR" }

$dname = "CN=$CN, OU=$OU, O=$O, L=$L, ST=$ST, C=$C"

Write-Host ""
Write-Host "=== GERANDO KEYSTORE ===" -ForegroundColor Cyan

# Gerar keystore
& $keytool -genkeypair `
    -v `
    -storetype PKCS12 `
    -keystore $KeystoreName `
    -alias $KeyAlias `
    -keyalg RSA `
    -keysize 2048 `
    -validity $ValidityDays `
    -dname "$dname" `
    -storepass $storepassPlain `
    -keypass $keypassPlain

if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Erro ao gerar keystore!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✓ Keystore gerado com sucesso: $KeystoreName" -ForegroundColor Green

# Obter fingerprints
Write-Host ""
Write-Host "=== FINGERPRINTS (IMPRESSÕES DIGITAIS) ===" -ForegroundColor Cyan
Write-Host "Copie o SHA-256 para configurar no Google Play Console:" -ForegroundColor Yellow
Write-Host ""

# SHA-256
Write-Host "--- SHA-256 ---" -ForegroundColor Green
& $keytool -list -v -keystore $KeystoreName -alias $KeyAlias -storepass $storepassPlain | Select-String "SHA256"

Write-Host ""

# SHA-1 (também útil)
Write-Host "--- SHA-1 ---" -ForegroundColor Green
& $keytool -list -v -keystore $KeystoreName -alias $KeyAlias -storepass $storepassPlain | Select-String "SHA1"

Write-Host ""

# MD5
Write-Host "--- MD5 ---" -ForegroundColor Green
& $keytool -list -v -keystore $KeystoreName -alias $KeyAlias -storepass $storepassPlain | Select-String "MD5"

Write-Host ""
Write-Host "=== INFORMAÇÕES SALVAS ===" -ForegroundColor Cyan

# Salvar informações em arquivo
$infoFile = "keystore-info.txt"
@"
KEYSTORE INFORMATION
====================
Arquivo: $KeystoreName
Alias: $KeyAlias
Data de criação: $(Get-Date)
Validade: $ValidityDays dias

LOCALIZAÇÃO:
$(Resolve-Path $KeystoreName)

SENHAS (GUARDE EM LOCAL SEGURO!):
- Keystore password: $storepassPlain
- Key password: $keypassPlain

CERTIFICATE INFO:
$dname

IMPORTANTE:
- Guarde este arquivo e as senhas em local seguro
- Sem este keystore você NÃO poderá publicar atualizações do app
- O Google Play Console requer o SHA-256 para configuração
"@ | Out-File -FilePath $infoFile -Encoding UTF8

Write-Host "✓ Informações salvas em: $infoFile" -ForegroundColor Green

# Limpar senhas da memória
$storepassPlain = $null
$keypassPlain = $null
[System.GC]::Collect()

Write-Host ""
Write-Host "=== PRÓXIMOS PASSOS ===" -ForegroundColor Cyan
Write-Host "1. Guarde o arquivo '$KeystoreName' em local seguro" -ForegroundColor White
Write-Host "2. Anote as senhas - você precisará delas para publicar atualizações" -ForegroundColor White  
Write-Host "3. Configure o SHA-256 no Google Play Console" -ForegroundColor White
Write-Host "4. Para builds Expo/EAS, execute: eas credentials" -ForegroundColor White
Write-Host ""
