# Script para gerar build do Speaking Academy
# Uso: .\build-app.ps1 [preview|production]

param(
    [Parameter()]
    [ValidateSet("preview", "production")]
    [string]$Profile = "preview"
)

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  BUILD DO SPEAKING ACADEMY" -ForegroundColor Cyan
Write-Host "  Perfil: $Profile" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Verificar login no Expo
Write-Host "Verificando login no Expo..." -ForegroundColor Yellow
try {
    $whoami = npx eas whoami 2>$null
    if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($whoami)) {
        Write-Host "Você não está logado no Expo." -ForegroundColor Red
        Write-Host "Execute: npx eas login" -ForegroundColor Yellow
        Write-Host ""
        $login = Read-Host "Deseja fazer login agora? (S/n)"
        if ($login -ne 'n' -and $login -ne 'N') {
            npx eas login
        } else {
            Write-Host "Login necessário para continuar." -ForegroundColor Red
            exit 1
        }
    } else {
        Write-Host "✓ Logado como: $whoami" -ForegroundColor Green
    }
} catch {
    Write-Host "Erro ao verificar login. Execute: npx eas login" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Iniciando build..." -ForegroundColor Cyan
Write-Host ""

# Executar build baseado no perfil
if ($Profile -eq "preview") {
    Write-Host "Gerando APK de preview (para teste no dispositivo)..." -ForegroundColor Yellow
    Write-Host ""
    npx eas build --platform android --profile preview --non-interactive
} else {
    Write-Host "Gerando AAB de produção (para Google Play Store)..." -ForegroundColor Yellow
    Write-Host ""
    npx eas build --platform android --profile production --non-interactive
}

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✓ Build iniciado com sucesso!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Você pode acompanhar o progresso em:" -ForegroundColor Cyan
    Write-Host "https://expo.dev/accounts/luciana-g81/projects/speaking-academy/builds" -ForegroundColor White
    Write-Host ""
    Write-Host "Após concluir, baixe o arquivo em:" -ForegroundColor Cyan
    if ($Profile -eq "preview") {
        Write-Host "  - APK para instalar diretamente no celular" -ForegroundColor White
    } else {
        Write-Host "  - AAB para fazer upload na Google Play Console" -ForegroundColor White
    }
} else {
    Write-Host ""
    Write-Host "✗ Erro ao iniciar build. Verifique:" -ForegroundColor Red
    Write-Host "  1. Se está logado: npx eas login" -ForegroundColor Yellow
    Write-Host "  2. Se o projeto está configurado: npx eas build:configure" -ForegroundColor Yellow
    Write-Host "  3. Configuração do eas.json" -ForegroundColor Yellow
}

Write-Host ""
