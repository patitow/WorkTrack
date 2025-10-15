# Script para criar instalador simples do WorkTrack
param(
    [string]$SourcePath = "release\win-unpacked",
    [string]$OutputPath = "release\WorkTrack-Installer.zip"
)

Write-Host "Criando instalador do WorkTrack..." -ForegroundColor Green

# Verifica se o diretorio fonte existe
if (-not (Test-Path $SourcePath)) {
    Write-Host "Diretorio fonte nao encontrado: $SourcePath" -ForegroundColor Red
    exit 1
}

# Cria o diretorio de destino se nao existir
$destDir = "release\WorkTrack"
if (Test-Path $destDir) {
    Remove-Item $destDir -Recurse -Force
}
New-Item -ItemType Directory -Path $destDir -Force | Out-Null

# Copia os arquivos
Write-Host "Copiando arquivos..." -ForegroundColor Yellow
Copy-Item "$SourcePath\*" -Destination $destDir -Recurse -Force

# Cria um arquivo de instrucoes
$instructions = @"
WorkTrack - Instrucoes de Instalacao

Como instalar:
1. Extraia todos os arquivos desta pasta para uma pasta de sua escolha
2. Execute o arquivo WorkTrack.exe para iniciar o aplicativo
3. (Opcional) Crie um atalho na area de trabalho

Funcionalidades:
- Controle de tempo com Start/Pause/Stop
- Relatorios mensais e semanais
- Calendario interativo
- Dados armazenados localmente
- Interface moderna com design glassmorphism

Requisitos:
- Windows 10 ou superior
- 200MB de espaco livre

WorkTrack v1.0.0
"@

$instructions | Out-File -FilePath "$destDir\INSTRUCOES.txt" -Encoding UTF8

# Cria o arquivo ZIP
Write-Host "Criando arquivo ZIP..." -ForegroundColor Yellow
if (Test-Path $OutputPath) {
    Remove-Item $OutputPath -Force
}

# Usa o PowerShell para criar o ZIP
Add-Type -AssemblyName System.IO.Compression.FileSystem
[System.IO.Compression.ZipFile]::CreateFromDirectory($destDir, $OutputPath)

# Calcula o tamanho do arquivo
$fileSize = (Get-Item $OutputPath).Length / 1MB
$fileSizeFormatted = "{0:N2}" -f $fileSize

Write-Host "Instalador criado com sucesso!" -ForegroundColor Green
Write-Host "Localizacao: $OutputPath" -ForegroundColor Cyan
Write-Host "Tamanho: $fileSizeFormatted MB" -ForegroundColor Cyan
Write-Host "O WorkTrack esta pronto para distribuicao!" -ForegroundColor Green