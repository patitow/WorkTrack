# 🚀 Guia de Início Rápido - WorkTrack

Este guia te ajudará a configurar e executar o WorkTrack em poucos minutos.

## ⚡ Início Rápido

### 1. Configuração Inicial
```bash
# Clone o repositório
git clone <repository-url>
cd worktrack

# Execute o script de setup automático
npm run setup
```

### 2. Desenvolvimento
```bash
# Inicie o modo de desenvolvimento
npm run dev
```

O aplicativo será aberto automaticamente e você verá:
- Interface principal com design glassmorphism
- Relógio em tempo real
- Botão para iniciar tracking
- Calendário interativo
- Área para listar entradas

### 3. Testando o Aplicativo

#### Teste Básico de Tracking:
1. Digite o nome de uma atividade (ex: "Desenvolvimento")
2. Clique em "Iniciar"
3. Observe o cronômetro funcionando
4. Teste "Pausar" e "Retomar"
5. Clique em "Parar" para finalizar

#### Teste do Calendário:
1. Clique em diferentes datas no calendário
2. Observe as entradas sendo filtradas por data
3. Veja os indicadores de status (horas extras, faltas, etc.)

## 🛠️ Comandos Úteis

```bash
# Desenvolvimento
npm run dev              # Inicia em modo desenvolvimento
npm run dev:renderer     # Apenas o frontend React
npm run dev:main         # Apenas o processo principal Electron

# Testes
npm test                 # Testes unitários
npm run test:watch       # Testes em modo watch
npm run e2e              # Testes end-to-end

# Build e Empacotamento
npm run build            # Build completo
npm run package          # Gera instalador
npm run package:win      # Gera instalador Windows

# Qualidade de Código
npm run lint             # Verifica problemas de código
npm run lint:fix         # Corrige problemas automaticamente
npm run format           # Formata o código
npm run type-check       # Verifica tipos TypeScript
```

## 📁 Estrutura de Arquivos Importantes

```
src/
├── main/                    # Processo principal Electron
│   ├── main.ts             # Ponto de entrada
│   ├── database.ts         # Camada de banco SQLite
│   ├── ipc-handlers.ts     # Comunicação IPC
│   └── preload.ts          # Script de preload seguro
├── renderer/               # Interface React
│   ├── components/         # Componentes reutilizáveis
│   │   ├── Tracker.tsx     # Componente principal de tracking
│   │   ├── Calendar.tsx    # Calendário interativo
│   │   ├── Clock.tsx       # Relógio em tempo real
│   │   └── EntriesList.tsx # Lista de entradas
│   ├── stores/             # Estado global (Zustand)
│   ├── utils/              # Utilitários (formatação de tempo, etc.)
│   └── types/              # Definições TypeScript
```

## 🎯 Funcionalidades Principais

### ⏱️ Tracking de Tempo
- **Iniciar**: Digite o nome da atividade e clique em "Iniciar"
- **Pausar**: Clique em "Pausar" para pausar temporariamente
- **Retomar**: Clique em "Retomar" para continuar
- **Parar**: Clique em "Parar" para finalizar (com confirmação)

### 📊 Relatórios
- **Saldo Mensal**: Visualização automática no card de estatísticas
- **Breakdown Diário**: Detalhamento por dia no calendário
- **Indicadores Visuais**: Cores indicam horas extras (verde), faltas (vermelho), meta atingida (azul)

### 📅 Calendário
- **Navegação**: Use as setas para navegar entre meses
- **Seleção de Data**: Clique em qualquer data para ver entradas específicas
- **Status Visual**: Cores indicam o status de cada dia

### 💾 Dados
- **Armazenamento Local**: Todos os dados ficam no seu computador
- **Backup Automático**: Banco SQLite é criado automaticamente
- **Exportação**: Funcionalidade de export em CSV/JSON (implementar se necessário)

## 🔧 Configurações

### Metas Padrão
- **Meta Semanal**: 40 horas (configurável)
- **Horas por Dia**: 8h (segunda a sexta), 0h (sábado e domingo)
- **Semana**: Segunda a domingo

### Personalização
As configurações podem ser alteradas através da interface (funcionalidade a implementar) ou diretamente no banco de dados.

## 🐛 Solução de Problemas

### Problema: Aplicativo não inicia
```bash
# Verifique se todas as dependências estão instaladas
npm install

# Limpe o cache e reinstale
npm run clean
npm install
```

### Problema: Erro de build
```bash
# Verifique se o TypeScript está correto
npm run type-check

# Verifique problemas de linting
npm run lint
```

### Problema: Testes falhando
```bash
# Execute testes com mais detalhes
npm test -- --verbose

# Limpe e reinstale dependências de teste
npm run clean
npm install
```

### Problema: Banco de dados
- O banco SQLite é criado automaticamente na primeira execução
- Localização: `%APPDATA%/WorkTrack/worktrack.db` (Windows)
- Para resetar: delete o arquivo e reinicie o app

## 📱 Atalhos de Teclado

- **Enter**: Iniciar tracking (quando o campo de atividade está focado)
- **Escape**: Cancelar operação atual
- **Ctrl+R**: Recarregar aplicação (desenvolvimento)

## 🎨 Personalização Visual

### Cores Principais
- **Primário**: Azul (#0B69FF)
- **Acento**: Roxo (#8A6CFF)
- **Fundo**: Gradiente azul-claro para roxo-claro
- **Cards**: Glassmorphism com transparência

### Componentes
- **Botões**: Bordas arredondadas, sombras suaves
- **Inputs**: Estilo glassmorphism com foco destacado
- **Cards**: Transparência com blur de fundo

## 📈 Próximos Passos

1. **Teste todas as funcionalidades** básicas
2. **Explore o código** para entender a arquitetura
3. **Execute os testes** para verificar qualidade
4. **Faça o build** e teste o instalador
5. **Contribua** com melhorias e correções

## 🆘 Suporte

- **Issues**: Abra uma issue no GitHub para bugs ou sugestões
- **Documentação**: Consulte o README.md para informações completas
- **Código**: Explore os comentários no código para entender implementações

---

**Bem-vindo ao WorkTrack! 🎉**

Comece agora mesmo a controlar seu tempo de forma eficiente e elegante.
