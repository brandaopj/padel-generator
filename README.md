# Padel Generator

Gerador de torneios de padel com suporte a três modos de jogo, histórico de torneios, dark mode e impressão de tabelas.

**App em produção:** https://padel-generator-three.vercel.app

---

## Funcionalidades

### Modos de jogo

| Modo | Descrição |
|------|-----------|
| **Regular** | Pares aleatórios formados a partir de uma lista de jogadores |
| **Duplas Fixas** | Pares pré-definidos pelo utilizador |
| **Cabeças de Série** | Tabela A vs Tabela B — pares emparelhados por posição após shuffle |

### Outras funcionalidades

- Nome do clube configurável por torneio
- Seletor de número de campos (distribui jogos ciclicamente)
- Algoritmo round-robin — cada par joga contra todos os outros exatamente uma vez
- Histórico de torneios guardado em `localStorage` (apenas leitura)
- Dark mode com persistência em `localStorage`
- Vista de impressão com espaço para anotar resultados

---

## Tecnologias

| Camada | Tecnologia |
|--------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | React Router v7 |
| Estado | Context + useReducer (sem biblioteca externa) |
| Estilos | Tailwind CSS v4 |
| Monitoring | Sentry v8 (`@sentry/react`) |
| Testes unitários | Vitest 4 + jsdom |
| Testes e2e | Playwright + Chromium |
| Relatórios de testes | Allure (unit + e2e) |
| CI/CD | GitHub Actions → Vercel (deploy) + GitHub Pages (Allure Report) |

---

## Estrutura do projeto

```
src/
├── types/          # Tipos partilhados (GameMode, Match, Round, Tournament, AppState)
├── utils/
│   ├── gameLogic.ts    # Lógica pura: shuffle, round-robin, distribuição de campos
│   └── validation.ts   # Validações de formulário (errors + warnings)
├── hooks/
│   ├── useHistory.ts   # CRUD de histórico em localStorage
│   └── useDarkMode.ts  # Toggle dark mode com persistência
├── context/
│   ├── AppContext.tsx   # Provider + AppContext
│   └── reducer.ts      # Reducer + initialState (13 action types)
├── components/
│   ├── generator/      # ModeSelector, CourtSelector, PlayerInput, PairInput, SeededInput, ValidationBanner
│   ├── rounds/         # RoundsPanel, RoundCard, MatchCard
│   ├── history/        # HistoryList, HistoryEntry
│   └── ui/             # ErrorBoundary, DarkModeToggle, PrintButton
└── routes/
    ├── GeneratorPage.tsx        # / — formulário + painel de rondas
    ├── HistoryPage.tsx          # /history — lista de torneios guardados
    └── TournamentDetailPage.tsx # /history/:id — detalhe de um torneio
tests/
├── unit/           # 30 testes (gameLogic, validation, history)
└── e2e/            # 12 testes Playwright (regular, fixed-pairs, seeded)
```

---

## Desenvolvimento local

### Pré-requisitos

- Node.js 24+
- npm

### Instalação

```bash
git clone git@github.com:brandaopj/padel-generator.git
cd padel-generator
npm install
```

### Variáveis de ambiente (opcionais)

```bash
# .env.local
VITE_SENTRY_DSN=https://<key>@sentry.io/<project>
```

Sem a variável definida, o Sentry fica desativado silenciosamente.

### Comandos

```bash
npm run dev           # Servidor de desenvolvimento (http://localhost:5173)
npm run build         # Build de produção
npm run preview       # Pré-visualização do build (http://localhost:4173)

npm run test:unit     # Testes unitários (Vitest)
npm run test:e2e      # Testes e2e (Playwright, requer build prévia ou dev server)
npm test              # Unitários + e2e
```

---

## Testes

### Unitários — 30 testes

```bash
npm run test:unit
```

Cobrem as funções puras em `src/utils/` e o módulo `useHistory`:

- `gameLogic`: shuffle, makePairs, makeSeededPairs, roundRobin, distribute, generateId
- `validation`: todos os modos e casos de erro/aviso
- `history`: getAll, save, getById, dados corrompidos

### E2E — 12 testes (Playwright + Chromium)

```bash
npm run build
npm run test:e2e
```

| Ficheiro | Cenários |
|----------|----------|
| `regular.spec.ts` | Geração com 8 jogadores, validações, histórico, detalhe |
| `fixed-pairs.spec.ts` | Geração com 4 pares, validações, adicionar/remover |
| `seeded.spec.ts` | Tabelas iguais, aviso para tabelas desiguais, validação mínima |

---

## CI/CD

O pipeline GitHub Actions corre em cada push para `main`:

```
push → unit-tests → e2e-tests → publish-report (GitHub Pages)
                              ↘ deploy automático (Vercel)
```

| Job | O que faz |
|-----|-----------|
| `unit-tests` | Vitest + upload de resultados Allure |
| `e2e-tests` | Build → preview server → Playwright → upload Allure |
| `publish-report` | Merge dos dois resultados Allure → GitHub Pages |

O deploy para Vercel acontece automaticamente via integração Git — cada push para `main` gera um novo deploy de produção.

### Secret necessário

| Nome | Descrição |
|------|-----------|
| `VITE_SENTRY_DSN` | DSN do projeto Sentry (opcional — o build funciona sem ele) |

Configurar em: **GitHub → Settings → Secrets and variables → Actions**

---

## Links

| | URL |
|-|-----|
| App | https://padel-generator-three.vercel.app |
| Repositório | https://github.com/brandaopj/padel-generator |
| Allure Report | https://brandaopj.github.io/padel-generator |
