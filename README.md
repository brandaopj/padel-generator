# Padel Generator

Tournament scheduler for padel, supporting three game modes, tournament history, dark mode, and print-ready scoresheets.

**Live app:** https://padel-generator-three.vercel.app

---

## Features

### Game modes

| Mode | Description |
|------|-------------|
| **Regular** | Random pairs drawn from a list of players |
| **Fixed Pairs** | User-defined pairs |
| **Seeded** | Table A vs Table B — pairs matched by position after independent shuffles |

### Other features

- Club name field per tournament
- Court count selector (matches distributed cyclically across courts)
- Round-robin scheduling — every pair plays every other pair exactly once
- Read-only tournament history stored in `localStorage`
- Dark mode with `localStorage` persistence
- Print view with blank score lines for on-court annotation

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 8 |
| Routing | React Router v7 |
| State | Context + useReducer (no external library) |
| Styles | Tailwind CSS v4 |
| Monitoring | Sentry v8 (`@sentry/react`) |
| Unit tests | Vitest 4 + jsdom |
| E2E tests | Playwright + Chromium |
| Test reports | Allure (unit + e2e) |
| CI/CD | GitHub Actions → Vercel (deploy) + GitHub Pages (Allure Report) |

---

## Project structure

```
src/
├── types/          # Shared types (GameMode, Match, Round, Tournament, AppState)
├── utils/
│   ├── gameLogic.ts    # Pure logic: shuffle, round-robin, court distribution
│   └── validation.ts   # Form validation (errors + warnings)
├── hooks/
│   ├── useHistory.ts   # localStorage CRUD for tournament history
│   └── useDarkMode.ts  # Dark mode toggle with persistence
├── context/
│   ├── AppContext.tsx   # Provider + AppContext
│   └── reducer.ts      # Reducer + initialState (13 action types)
├── components/
│   ├── generator/      # ModeSelector, CourtSelector, PlayerInput, PairInput, SeededInput, ValidationBanner
│   ├── rounds/         # RoundsPanel, RoundCard, MatchCard
│   ├── history/        # HistoryList, HistoryEntry
│   └── ui/             # ErrorBoundary, DarkModeToggle, PrintButton
└── routes/
    ├── GeneratorPage.tsx        # / — form + rounds panel
    ├── HistoryPage.tsx          # /history — saved tournament list
    └── TournamentDetailPage.tsx # /history/:id — tournament detail
tests/
├── unit/           # 30 tests (gameLogic, validation, history)
└── e2e/            # 12 Playwright tests (regular, fixed-pairs, seeded)
```

---

## Local development

### Prerequisites

- Node.js 24+
- npm

### Setup

```bash
git clone git@github.com:brandaopj/padel-generator.git
cd padel-generator
npm install
```

### Environment variables (optional)

```bash
# .env.local
VITE_SENTRY_DSN=https://<key>@sentry.io/<project>
```

Without this variable, Sentry is silently disabled — the app works normally.

### Commands

```bash
npm run dev           # Development server (http://localhost:5173)
npm run build         # Production build
npm run preview       # Preview production build (http://localhost:4173)

npm run test:unit     # Unit tests (Vitest)
npm run test:e2e      # E2E tests (Playwright — requires a prior build or dev server)
npm test              # Unit + E2E
```

---

## Tests

### Unit — 30 tests

```bash
npm run test:unit
```

Cover pure functions in `src/utils/` and the `useHistory` module:

- `gameLogic`: shuffle, makePairs, makeSeededPairs, roundRobin, distribute, generateId
- `validation`: all modes, error and warning cases
- `history`: getAll, save, getById, corrupted data handling

### E2E — 12 tests (Playwright + Chromium)

```bash
npm run build
npm run test:e2e
```

| File | Scenarios |
|------|-----------|
| `regular.spec.ts` | Generate with 8 players, validation, history save, detail page |
| `fixed-pairs.spec.ts` | Generate with 4 pairs, validation, add/remove pairs |
| `seeded.spec.ts` | Equal tables, unequal-size warning, minimum validation |

---

## CI/CD

The GitHub Actions pipeline runs on every push to `main`:

```
push → unit-tests → e2e-tests → publish-report (GitHub Pages)
                              ↘ auto-deploy (Vercel)
```

| Job | What it does |
|-----|--------------|
| `unit-tests` | Vitest + Allure results upload |
| `e2e-tests` | Build → preview server → Playwright → Allure results upload |
| `publish-report` | Merges both Allure result sets → deploys to GitHub Pages |

Vercel deployment is automatic via Git integration — every push to `main` triggers a new production deploy.

### Required secret

| Name | Description |
|------|-------------|
| `VITE_SENTRY_DSN` | Sentry project DSN (optional — build succeeds without it) |

Set it at: **GitHub → Settings → Secrets and variables → Actions**

---

## Links

| | URL |
|-|-----|
| App | https://padel-generator-three.vercel.app |
| Repository | https://github.com/brandaopj/padel-generator |
| Allure Report | https://brandaopj.github.io/padel-generator |
