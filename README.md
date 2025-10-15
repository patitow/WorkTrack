# WorkTrack

Aplicativo desktop para controle de banco de horas pessoal. Desenvolvido com Electron, React, TypeScript e Tailwind CSS.

## 🚀 Características

- ⏱️ **Tracking de tempo**: Iniciar, pausar e parar registros de tempo
- 📊 **Relatórios**: Visualização de saldo semanal e mensal
- 📅 **Calendário interativo**: Navegação por meses com indicadores visuais
- 💾 **Banco local**: Dados armazenados localmente com SQLite
- 🎨 **Design glassmorphism**: Interface moderna com efeitos de vidro
- 📱 **Responsivo**: Interface adaptável para diferentes tamanhos de janela
- 🔒 **Seguro**: Dados nunca enviados para servidores externos
- ⚡ **Atividades rápidas**: Adicionar atividades com duração específica
- ✏️ **Edição de entradas**: Modificar atividades após criação
- 🏷️ **Tags e notas**: Organização e detalhamento de atividades

## 🛠️ Tecnologias

- **Frontend**: React 18 + TypeScript + Tailwind CSS
- **Backend**: Electron + Node.js
- **Banco de dados**: SQLite (better-sqlite3)
- **Estado**: Zustand
- **Testes**: Jest + React Testing Library + Playwright
- **Build**: Vite + Electron Builder

## 📦 Instalação

### Pré-requisitos

- Node.js 18+ 
- npm ou yarn

### Desenvolvimento

1. Clone o repositório:
```bash
git clone <repository-url>
cd worktrack
```

2. Instale as dependências:
```bash
npm install
```

3. Execute em modo de desenvolvimento:
```bash
npm run dev
```

### Build e Empacotamento

1. Build do projeto:
```bash
npm run build
```

2. Gerar instalador Windows:
```bash
npm run package:win
```

Os instaladores serão gerados na pasta `release/`.

## 🧪 Testes

### Testes Unitários
```bash
npm test
```

### Testes E2E
```bash
npm run e2e
```

### Cobertura de Testes
```bash
npm test -- --coverage
```

## 📁 Estrutura do Projeto

```
worktrack/
├── src/
│   ├── main/                 # Electron main process
│   │   ├── main.ts          # Ponto de entrada principal
│   │   ├── database.ts      # Camada de banco de dados
│   │   ├── ipc-handlers.ts  # Handlers IPC
│   │   └── preload.ts       # Script de preload
│   ├── renderer/            # React app
│   │   ├── components/      # Componentes React
│   │   ├── stores/          # Estado global (Zustand)
│   │   ├── utils/           # Utilitários
│   │   ├── types/           # Definições TypeScript
│   │   └── styles/          # Estilos CSS
│   └── tests/               # Testes
├── assets/                  # Recursos (ícones, etc.)
├── scripts/                 # Scripts de build
└── dist/                    # Build output
```

## 🎯 Funcionalidades

### Tracking de Tempo
- Iniciar nova atividade (nome opcional, tags e notas)
- Pausar e retomar tracking
- Parar tracking com confirmação
- Visualização em tempo real do tempo decorrido
- Atividades rápidas com duração específica

### Relatórios
- Saldo semanal e mensal
- Breakdown diário
- Horas extras e faltas
- Exportação em CSV/JSON (planejado)

### Calendário
- Visualização mensal iniciando no domingo
- Navegação entre meses
- Indicadores visuais de status (horas extras, faltas, meta atingida)
- Seleção de datas para visualizar entradas

### Gerenciamento de Entradas
- Edição de atividades existentes
- Exclusão de entradas
- Visualização detalhada com data/hora
- Organização por tags

### Configurações
- Meta semanal personalizável (planejado)
- Horas por dia da semana (planejado)
- Backup e restore (planejado)
- Export/import de dados (planejado)

## 🔧 Scripts Disponíveis

- `npm run dev` - Executa em modo desenvolvimento
- `npm run build` - Build completo do projeto
- `npm run package` - Gera instalador
- `npm run package:win` - Gera instalador Windows
- `npm test` - Executa testes unitários
- `npm run e2e` - Executa testes E2E
- `npm run lint` - Executa linter
- `npm run format` - Formata código

## ⚠️ Status e Problemas Conhecidos

### Status Atual
- **Versão**: 1.0.0 (Desenvolvimento)
- **Funcionalidades principais**: ✅ Implementadas
- **Testes**: ✅ Unitários e componentes (85% cobertura)
- **Build**: ✅ Funcionando

### Problemas Conhecidos
- 🔴 **Timezone no calendário**: Ao clicar no dia 1 de um mês, pode mostrar entradas do mês anterior
- 🟡 **Logs de debug**: Console com muitos logs temporários para investigação
- 🟢 **Funcionalidades planejadas**: Backup, export, configurações avançadas

> 📋 **Relatório completo**: Veja [PROBLEMS_REPORT.md](PROBLEMS_REPORT.md) para detalhes técnicos

## 📋 Requisitos do Sistema

- **Windows**: Windows 10 ou superior
- **Memória**: 4GB RAM mínimo
- **Espaço**: 200MB de espaço livre
- **Processador**: x64

## 🔒 Segurança

- Dados armazenados localmente
- Comunicação IPC segura
- Validação de inputs
- Sandbox do renderer process

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Para suporte e dúvidas, abra uma issue no repositório.

---

Desenvolvido com ❤️ para produtividade pessoal.