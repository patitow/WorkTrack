const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🚀 Configurando WorkTrack...')

// Verifica se o Node.js está na versão correta
const nodeVersion = process.version
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0])

if (majorVersion < 18) {
  console.error('❌ Node.js 18+ é necessário. Versão atual:', nodeVersion)
  process.exit(1)
}

console.log('✅ Node.js versão:', nodeVersion)

// Instala dependências
console.log('📦 Instalando dependências...')
try {
  execSync('npm install', { stdio: 'inherit' })
  console.log('✅ Dependências instaladas!')
} catch (error) {
  console.error('❌ Erro ao instalar dependências:', error.message)
  process.exit(1)
}

// Cria diretórios necessários
console.log('📁 Criando diretórios...')
const directories = ['dist', 'release', 'assets']
directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
    console.log(`✅ Diretório ${dir} criado!`)
  }
})

// Verifica se o banco de dados será criado automaticamente
console.log('💾 Banco de dados SQLite será criado automaticamente na primeira execução')

// Instala Playwright para testes E2E
console.log('🎭 Instalando Playwright...')
try {
  execSync('npx playwright install', { stdio: 'inherit' })
  console.log('✅ Playwright instalado!')
} catch (error) {
  console.warn('⚠️  Erro ao instalar Playwright (opcional):', error.message)
}

console.log('🎉 Setup concluído com sucesso!')
console.log('')
console.log('📋 Próximos passos:')
console.log('  1. Execute "npm run dev" para iniciar o desenvolvimento')
console.log('  2. Execute "npm test" para rodar os testes')
console.log('  3. Execute "npm run build" para fazer o build')
console.log('  4. Execute "npm run package:win" para gerar o instalador')
console.log('')
console.log('📚 Documentação completa no README.md')
