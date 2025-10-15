const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Iniciando build do WorkTrack...')

// Limpa diretórios de build anteriores
console.log('🧹 Limpando diretórios de build...')
if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true, force: true })
}
if (fs.existsSync('release')) {
  fs.rmSync('release', { recursive: true, force: true })
}

// Build do renderer (React)
console.log('⚛️  Buildando renderer (React)...')
try {
  execSync('npm run build:renderer', { stdio: 'inherit' })
  console.log('✅ Renderer buildado com sucesso!')
} catch (error) {
  console.error('❌ Erro ao buildar renderer:', error.message)
  process.exit(1)
}

// Build do main process (Electron)
console.log('🔧 Buildando main process (Electron)...')
try {
  execSync('npm run build:main', { stdio: 'inherit' })
  console.log('✅ Main process buildado com sucesso!')
} catch (error) {
  console.error('❌ Erro ao buildar main process:', error.message)
  process.exit(1)
}

// Copia arquivos necessários
console.log('📁 Copiando arquivos...')
const preloadSource = 'src/main/preload.ts'
const preloadDest = 'dist/main/preload.js'

if (fs.existsSync(preloadSource)) {
  fs.copyFileSync(preloadSource, preloadDest)
  console.log('✅ Preload copiado!')
}

// Cria diretório de assets se não existir
const assetsDir = 'assets'
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir)
  console.log('📁 Diretório assets criado!')
}

console.log('🎉 Build concluído com sucesso!')
console.log('📦 Para gerar o instalador, execute: npm run package')
