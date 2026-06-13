@echo off
chcp 65001 >nul
echo ============================================
echo  GERADOR DE KEYSTORE - GOOGLE PLAY STORE
echo ============================================
echo.

:: Verificar se keytool existe no PATH
where keytool >nul 2>&1
if %errorlevel% == 0 (
    echo [OK] Keytool encontrado no PATH
    goto :generate
)

:: Tentar encontrar no Android Studio
if exist "%ProgramFiles%\Android\Android Studio\jbr\bin\keytool.exe" (
    set "KEYTOOL=%ProgramFiles%\Android\Android Studio\jbr\bin\keytool.exe"
    echo [OK] Keytool encontrado no Android Studio
    goto :generate
)

:: Tentar no Program Files (x86)
if exist "%ProgramFiles(x86)%\Android\Android Studio\jbr\bin\keytool.exe" (
    set "KEYTOOL=%ProgramFiles(x86)%\Android\Android Studio\jbr\bin\keytool.exe"
    echo [OK] Keytool encontrado no Android Studio (x86)
    goto :generate
)

:: JDK comum
for /d %%i in ("%ProgramFiles%\Java\*") do (
    if exist "%%i\bin\keytool.exe" (
        set "KEYTOOL=%%i\bin\keytool.exe"
        echo [OK] Keytool encontrado: %%i
        goto :generate
    )
)

echo [ERRO] Keytool nao encontrado!
echo.
echo Voce precisa instalar um dos seguintes:
echo 1. Android Studio: https://developer.android.com/studio
echo 2. JDK (Java Development Kit): https://adoptium.net/
echo.
echo Apos instalar, execute este script novamente.
pause
exit /b 1

:generate
echo.
echo ============================================
echo  CONFIGURACAO
set /p KS_NAME="Nome do arquivo keystore [speaking-academy.keystore]: "
if "%KS_NAME%"=="" set KS_NAME=speaking-academy.keystore

set /p KS_ALIAS="Alias da chave [speaking-academy]: "
if "%KS_ALIAS%"=="" set KS_ALIAS=speaking-academy

echo.
echo Senhas (minimo 6 caracteres):
set /p KS_PASS="Senha do keystore: "
if "%KS_PASS%"=="" (
    echo [ERRO] Senha nao pode ser vazia!
    pause
    exit /b 1
)

set /p KEY_PASS="Senha da chave (Enter = mesma do keystore): "
if "%KEY_PASS%"=="" set KEY_PASS=%KS_PASS%

echo.
echo ============================================
echo  GERANDO KEYSTORE...
echo.

if not defined KEYTOOL set KEYTOOL=keytool

"%KEYTOOL%" -genkeypair -v ^
    -storetype PKCS12 ^
    -keystore "%KS_NAME%" ^
    -alias "%KS_ALIAS%" ^
    -keyalg RSA ^
    -keysize 2048 ^
    -validity 10000 ^
    -dname "CN=Speaking Academy, OU=Development, O=Speaking Academy, L=Sao Paulo, ST=SP, C=BR" ^
    -storepass "%KS_PASS%" ^
    -keypass "%KEY_PASS%"

if %errorlevel% neq 0 (
    echo.
    echo [ERRO] Falha ao gerar keystore!
    pause
    exit /b 1
)

echo.
echo ============================================
echo  FINGERPRINTS (COPIE O SHA-256!)
echo ============================================
echo.

echo --- SHA-256 ---
"%KEYTOOL%" -list -v -keystore "%KS_NAME%" -alias "%KS_ALIAS%" -storepass "%KS_PASS%" | findstr "SHA256"

echo.
echo --- SHA-1 ---
"%KEYTOOL%" -list -v -keystore "%KS_NAME%" -alias "%KS_ALIAS%" -storepass "%KS_PASS%" | findstr "SHA1"

echo.
echo ============================================
echo  INFORMACOES SALVAS
set INFO_FILE=keystore-info.txt
echo Arquivo: %KS_NAME% > "%INFO_FILE%"
echo Alias: %KS_ALIAS% >> "%INFO_FILE%"
echo Data: %date% %time% >> "%INFO_FILE%"
echo. >> "%INFO_FILE%"
echo FINGERPRINTS: >> "%INFO_FILE%"
"%KEYTOOL%" -list -v -keystore "%KS_NAME%" -alias "%KS_ALIAS%" -storepass "%KS_PASS%" >> "%INFO_FILE%"

echo.
echo [OK] Keystore gerado: %KS_NAME%
echo [OK] Informacoes salvas em: %INFO_FILE%
echo.
echo IMPORTANTE:
echo - Guarde o arquivo %KS_NAME% em local seguro
echo - Anote as senhas - voce precisara delas para atualizar o app
echo - Configure o SHA-256 no Google Play Console
echo.
pause
