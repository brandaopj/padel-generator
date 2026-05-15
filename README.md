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

### Generator

- Club name field per tournament
- Court count calculated automatically from the number of pairs; shown in real time as names are entered
- Round-robin scheduling — every pair plays every other pair exactly once, all matches per round are simultaneous
- Mode description shown below the mode selector to guide first-time users
- Stale-results warning when the form is edited after a tournament has been generated (only shown when the current mode has data entered)
- Player/pair names entered via textarea — paste directly from a WhatsApp list (one name per line; pairs as `Player1 / Player2`)
- Names preserved when switching between modes — no need to re-enter if the wrong mode was selected
- Clear button on every textarea with inline confirmation (no native browser dialog)
- Validation errors shown only after the user starts entering names

### Match cards

- Player avatar (neutral silhouette) shown next to each name
- Two-column symmetric layout — both pairs always aligned
- Player names wrap to multiple lines — no truncation regardless of name length
- Score writing area at the bottom of each card
- Court names editable inline after generation — click the pencil icon to rename any court (e.g. "Padel Lisboa"); names persist in history and print

### Navigation & history

- Read-only tournament history stored in `localStorage`
- Auto-scroll to results after generation on mobile

### Accessibility (WCAG 2.1 AA)

- All form labels associated with inputs via `htmlFor`/`id`
- Validation banner and success banner use `role="alert"` / `role="status"` with `aria-live` — announced by screen readers
- All decorative icons have `aria-hidden="true"`
- Input font size `text-base` on mobile — prevents iOS auto-zoom on focus
- Adequate touch targets on all interactive elements

### Appearance

- Dark mode with `localStorage` persistence
- Print view: form panel hidden, A4 page size (`@page { size: A4; margin: 2cm }`), match cards in single full-width column with score writing area per match

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
│   ├── validation.ts   # Form validation (errors + warnings)
│   └── modes.ts        # Centralised mode labels and descriptions
├── hooks/
│   ├── useHistory.ts   # localStorage CRUD for tournament history
│   └── useDarkMode.ts  # Dark mode toggle with persistence
├── context/
│   ├── AppContext.tsx   # Provider + AppContext
│   └── reducer.ts      # Reducer + initialState with auto-courts calculation
├── components/
│   ├── generator/      # ModeSelector, PlayerInput, PairInput, SeededInput, ValidationBanner
│   ├── rounds/         # RoundsPanel, RoundCard, MatchCard
│   ├── history/        # HistoryList, HistoryEntry
│   └── ui/             # ErrorBoundary, DarkModeToggle, PrintButton, ClearButton
└── routes/
    ├── GeneratorPage.tsx        # / — form + rounds panel
    ├── HistoryPage.tsx          # /history — saved tournament list
    └── TournamentDetailPage.tsx # /history/:id — tournament detail
tests/
├── unit/           # 35 tests (gameLogic, validation, history)
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

### Unit — 35 tests

```bash
npm run test:unit
```

Cover pure functions in `src/utils/` and the `useHistory` module:

- `gameLogic`: shuffle, makePairs, makeSeededPairs, roundRobin, distribute, generateTournament, generateId
- `validation`: all modes, error and warning cases
- `history`: getAll, save, getById, corrupted data handling

### Coverage

```bash
npm run test:coverage
```

Coverage is measured on `src/utils/` and `src/hooks/useHistory.ts` and enforced in CI with these thresholds:

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

Screenshots and traces are captured on failure and uploaded as CI artifacts for debugging.

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

When tests fail on `main`, the pipeline automatically opens a GitHub issue labelled [`ci-failure`](https://github.com/brandaopj/padel-generator/labels/ci-failure) with a link to the failing run. Subsequent failures add a comment to the existing issue. The issue is closed automatically once all tests pass again.

### Dependency updates

Dependabot opens weekly PRs for npm dependency updates. The CI pipeline validates them automatically before merge. The `publish-report` job is skipped on pull request runs to avoid conflicts with the GitHub Pages environment protection.

### Required secret

| Name | Description |
|------|-------------|
| `VITE_SENTRY_DSN` | Sentry project DSN (optional — build succeeds without it) |

Set it at: **GitHub → Settings → Secrets and variables → Actions**

---

## Contributing

Open a pull request against `main`. The PR template includes a checklist. CI must be green before merging.

---

## Links

| | URL |
|-|-----|
| App | https://padel-generator-three.vercel.app |
| Repository | https://github.com/brandaopj/padel-generator |
| Allure Report | https://brandaopj.github.io/padel-generator |
