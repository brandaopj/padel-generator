# Padel Generator

Tournament scheduler for padel, supporting three game modes, tournament history, PT/EN localisation, dark mode, and print-ready scoresheets.

**Live app:** https://padel-generator-three.vercel.app

---

## Features

### Game modes

| Mode | Description |
|------|-------------|
| **Regular** | Random pairs drawn from a list of players each round |
| **Fixed Pairs** | User-defined pairs — partners stay the same across all rounds |
| **Seeded** | Table A vs Table B — paired by position after independent shuffles |

### Generator

- Tournament name field (optional)
- Court count calculated automatically from the number of pairs; shown in real time
- Round-robin scheduling — every pair plays every other pair exactly once
- Mode description shown below the mode selector
- Stale-results warning when the form is edited after generation
- Player/pair names entered via textarea — paste directly from a WhatsApp list (one name per line; pairs as `Player1 / Player2`)
- Names preserved when switching between modes
- Clear button on every textarea with confirmation modal (no native browser dialog)
- Validation errors shown inline; generate button disabled while errors exist
- Loading spinner on the generate button during generation
- Regenerate button shown after a tournament has already been generated

### Match cards

- Player avatars (initials + colour palette) next to each name
- Symmetric two-column layout — both pairs always aligned
- Player names wrap freely — no truncation regardless of name length
- Score writing area at the bottom of each card, separated from the players by a divider
- Court names editable inline — pencil icon appears on hover; names persist in history and print

### Notifications & confirmations

- **Toast system** — slide-in notifications (bottom-right): tournament generated, court name updated, tournament deleted, schedule copied
- **Confirm modal** — `createPortal`-based overlay for all destructive actions (clear list, delete tournament); covers the full viewport regardless of page structure

### Navigation & history

- Tournament history stored in `localStorage`
- Each entry shows: name, mode badge, courts, pairs, date
- Delete tournament from history with confirmation and toast feedback
- Auto-scroll to results after generation on mobile

### Share

- **Share button** in the generator header, on each history entry, and on the tournament detail page
- Uses the native Web Share API on mobile; falls back to clipboard copy on desktop
- Formats the full schedule as emoji-rich text ready to paste into WhatsApp

### Localisation

- Full **PT / EN** bilingual support
- Browser language detected on first visit (`navigator.language`)
- Preference persisted in `localStorage` under key `padel-lang`
- PT/EN toggle in the header

### Appearance

- Dark mode with `localStorage` persistence; pill toggle with sun/moon icons
- Print view: form and header hidden, A4 layout (`@page { size: A4; margin: 2cm }`), single-column match cards with score area

### Support

- 🍺 [Ko-fi](https://ko-fi.com/brandaopj) button in the header

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
├── i18n/
│   └── translations.ts     # PT and EN translation objects
├── utils/
│   ├── gameLogic.ts        # Pure logic: shuffle, round-robin, court distribution
│   ├── validation.ts       # Form validation (errors + warnings)
│   ├── modes.ts            # Mode icon data
│   └── shareTournament.ts  # Format + share/copy tournament text
├── hooks/
│   ├── useHistory.ts       # localStorage CRUD for tournament history
│   └── useDarkMode.ts      # Dark mode toggle with persistence
├── context/
│   ├── AppContext.tsx       # Global app state provider
│   ├── reducer.ts          # Reducer + initialState
│   ├── LanguageContext.tsx  # PT/EN language provider + useLanguage()
│   └── ToastContext.tsx     # Toast notification provider + useToast()
├── components/
│   ├── generator/          # ModeSelector, PlayerInput, PairInput, SeededInput,
│   │                       # ValidationBanner, EmptyState
│   ├── rounds/             # RoundsPanel, RoundCard, MatchCard
│   ├── history/            # HistoryList, HistoryEntry
│   └── ui/                 # ErrorBoundary, DarkModeToggle, PrintButton,
│                           # ShareButton, ClearButton, ConfirmModal,
│                           # HowItWorksModal, KofiButton
└── routes/
    ├── GeneratorPage.tsx        # / — form + rounds panel
    ├── HistoryPage.tsx          # /history — saved tournament list
    └── TournamentDetailPage.tsx # /history/:id — tournament detail
tests/
├── unit/           # 51 tests (gameLogic, validation, history, shareTournament)
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
npm run dev             # Development server (http://localhost:5173)
npm run build           # Production build
npm run preview         # Preview production build (http://localhost:4173)

npm run test:unit       # Unit tests (Vitest)
npm run test:coverage   # Unit tests + coverage report with threshold enforcement
npm run test:e2e        # E2E tests (Playwright — requires a prior build or dev server)
npm test                # Unit + E2E
```

---

## Tests

### Unit — 51 tests

```bash
npm run test:unit
```

Cover pure functions in `src/utils/` and the `useHistory` module:

- `gameLogic`: shuffle, makePairs, makeSeededPairs, roundRobin, distribute, generateTournament, generateId
- `validation`: all modes, error and warning cases
- `history`: getAll, save, getById, corrupted data handling
- `shareTournament`: formatTournamentText, Web Share API path, clipboard fallback, abort and error branches

### Coverage

```bash
npm run test:coverage
```

Coverage is measured on `src/utils/` and `src/hooks/useHistory.ts` and enforced in CI:

| Metric | Threshold |
|--------|-----------|
| Lines | 90% |
| Functions | 90% |
| Branches | 80% |

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

Screenshots and traces are captured on failure and uploaded as CI artifacts.

---

## CI/CD

The GitHub Actions pipeline runs on every push to `main`:

```
push → unit-tests ──┬──→ report-failure (if any failed)
       e2e-tests ───┘──→ resolve-failure (if all passed)
                    └──→ publish-report (GitHub Pages)
                    └──→ auto-deploy (Vercel)
```

| Job | What it does |
|-----|--------------|
| `unit-tests` | Vitest with coverage thresholds + Allure and coverage artifacts |
| `e2e-tests` | Build → preview server → Playwright → Allure and playwright-report artifacts |
| `publish-report` | Merges both Allure result sets → deploys to GitHub Pages (push to `main` only) |
| `report-failure` | Opens a GitHub issue if any test job fails; comments on the existing issue if already open |
| `resolve-failure` | Closes the open CI issue automatically when all tests pass again |

Vercel deployment is automatic via Git integration — every push to `main` triggers a new production deploy.

### Branch protection

The `main` branch requires `unit-tests` and `e2e-tests` to pass before any merge. Direct pushes to `main` are blocked.

### Failure tracking

When tests fail on `main`, the pipeline automatically opens a GitHub issue labelled [`ci-failure`](https://github.com/brandaopj/padel-generator/labels/ci-failure) with a link to the failing run. The issue is closed automatically once all tests pass again.

### Dependency updates

Dependabot opens weekly PRs for npm dependency updates. The CI pipeline validates them automatically before merge.

### Required secret

| Name | Description |
|------|-------------|
| `VITE_SENTRY_DSN` | Sentry project DSN (optional — build succeeds without it) |

Set it at: **GitHub → Settings → Secrets and variables → Actions**

---

## Contributing

Open a pull request against `main`. CI must be green before merging.

---

## Documentation

| Document | Description |
|----------|-------------|
| [Requirements](docs/requirements.md) | Functional and non-functional requirements (RF, RN, RNF) |
| [Specification](docs/specification.md) | Full SRS — data model, algorithms, UI spec, test spec, architecture |

---

## Links

| | URL |
|-|-----|
| App | https://padel-generator-three.vercel.app |
| Repository | https://github.com/brandaopj/padel-generator |
| Allure Report | https://brandaopj.github.io/padel-generator |
| Support | https://ko-fi.com/brandaopj |
