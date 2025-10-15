const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('📦 Iniciando empacotamento do WorkTrack...')

// Verifica se o build foi feito
if (!fs.existsSync('dist')) {
  console.log('🔨 Build não encontrado. Executando build...')
  execSync('node scripts/build.js', { stdio: 'inherit' })
}

// Gera o pacote usando electron-packager
console.log('📦 Gerando pacote Windows com electron-packager...')
try {
  execSync('npx electron-packager . WorkTrack --platform=win32 --arch=x64 --out=release --overwrite', { stdio: 'inherit' })
  
  console.log('📦 Criando instalador ZIP...')
  const zipCommand = 'Compress-Archive -Path "release\\WorkTrack-win32-x64\\*" -DestinationPath "release\\WorkTrack-Installer.zip" -Force'
  execSync(`powershell -Command "${zipCommand}"`, { stdio: 'inherit' })
  
  console.log('✅ Instalador gerado com sucesso!')
} catch (error) {
  console.error('❌ Erro ao gerar instalador:', error.message)
  process.exit(1)
}

// Lista arquivos gerados
console.log('📋 Arquivos gerados:')
const releaseDir = 'release'
if (fs.existsSync(releaseDir)) {
  const files = fs.readdirSync(releaseDir)
  files.forEach(file => {
    const filePath = path.join(releaseDir, file)
    const stats = fs.statSync(filePath)
    const size = (stats.size / 1024 / 1024).toFixed(2)
    console.log(`  📄 ${file} (${size} MB)`)
  })
}

console.log('🎉 Empacotamento concluído!')
console.log('📁 Instaladores disponíveis na pasta "release"')
