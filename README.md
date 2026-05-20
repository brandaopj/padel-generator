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
- Mode description shown below the mode selector; mode tabs have a 44 px minimum touch target
- Stale-results warning when the form is edited after generation
- Player/pair names entered via textarea — paste directly from a WhatsApp list (one name per line; pairs as `Player1 / Player2`)
- Names preserved when switching between modes
- Clear button on every textarea with confirmation modal (no native browser dialog)
- Validation errors shown inline; generate button disabled while errors exist
- Loading spinner on the generate button during generation
- Regenerate button shown after a tournament has already been generated
- On mobile/tablet, the generate button is sticky (`sticky bottom-16`) so it remains visible while scrolling the form

### Match cards

- Player avatars (initials + colour palette) next to each name
- Symmetric two-column layout — both pairs always aligned
- Player names wrap freely — no truncation regardless of name length
- Score writing area at the bottom of each card, separated from the players by a divider (visual-only print element — not an interactive input)
- Court names editable inline — pencil icon appears on hover; names persist in history and print
- Responsive sizing: compact padding and avatars on small screens (`p-3 sm:p-5`, `w-7 h-7 sm:w-8 sm:h-8`)

### Notifications & confirmations

- **Toast system** — slide-in notifications (bottom-right): tournament generated, court name updated, tournament deleted, schedule copied
- **Confirm modal** — `createPortal`-based overlay for all destructive actions (clear list, delete tournament); covers the full viewport regardless of page structure

### Navigation & history

- Tournament history stored in `localStorage`
- Each entry shows: name, mode badge, courts, pairs, date
- Delete tournament from history with confirmation and toast feedback
- Auto-scroll to results after generation (scrolls to the top of the results panel)

#### Mobile / responsive

- Below 1024 px (`lg`) the header nav collapses into a hamburger (☰) button; a slide-down drawer exposes the nav links (New Tournament, History, How It Works), Print and Share (when a tournament is generated), and Ko-fi
- Desktop nav (logo + full links + Print + Share + Ko-fi) is only visible at 1024 px and above
- A fixed bottom navigation bar (`lg:hidden`) on the generator page provides two scroll shortcuts: "Config" (scrolls to the form) and "Results" (scrolls to the rounds panel); the page has `pb-24 lg:pb-8` to keep content clear of the bar
- The results panel (EmptyState / RoundsPanel) is always rendered below the form on mobile — not hidden behind a separate column
- `overflow-x-hidden` on the root container prevents horizontal scroll artefacts from the slide-down drawer

### Share

- **Share button** in the rounds panel header, in the generator header, on each history entry, and on the tournament detail page
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
- Build date footer at the bottom of every page — date is injected at build time via Vite `define` and respects the active language (`pt-PT` / `en-GB`)

### PWA

- Installable as a Progressive Web App via `vite-plugin-pwa` (`registerType: 'autoUpdate'`)
- Workbox precaches all static assets; Dicebear avatar API uses `CacheFirst` (30-day expiry, max 100 entries)
- Standalone display, `#2563eb` theme colour, SVG icon

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
| PWA | `vite-plugin-pwa` + Workbox |
| Monitoring | Sentry v8 (`@sentry/react`) |
| Analytics | PostHog `posthog-js` + Vercel Analytics `@vercel/analytics` |
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
└── e2e/            # 19 Playwright tests (regular, fixed-pairs, seeded, history)
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
VITE_POSTHOG_KEY=phc_<your-posthog-project-key>
```

Without these variables the respective integrations are silently disabled — the app works normally.

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
| `history.spec.ts` | History list, empty state, delete with confirm, cancel delete, detail view, back navigation, not-found |

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

Vercel deployment is automatic via Git integration — every push to `main` triggers a new production deploy. `vercel.json` explicitly sets `buildCommand` and `outputDirectory` to prevent stale build-cache deployments.

### Branch protection

The `main` branch requires `unit-tests` and `e2e-tests` to pass before any merge. Direct pushes to `main` are blocked.

### Failure tracking

When tests fail on `main`, the pipeline automatically opens a GitHub issue labelled [`ci-failure`](https://github.com/brandaopj/padel-generator/labels/ci-failure) with a link to the failing run. The issue is closed automatically once all tests pass again.

### Dependency updates

Dependabot opens weekly PRs for npm dependency updates. The CI pipeline validates them automatically before merge.

### Required secrets

| Name | Description |
|------|-------------|
| `VITE_SENTRY_DSN` | Sentry project DSN (optional — build succeeds without it) |
| `VITE_POSTHOG_KEY` | PostHog project API key, starts with `phc_` (optional — analytics disabled without it) |

Set them at: **GitHub → Settings → Secrets and variables → Actions**

---

## SEO

- `index.html` includes a descriptive `<title>`, `<meta name="description">`, `<meta name="keywords">`, `<meta name="robots" content="index, follow">`, and a `<link rel="canonical">` pointing to the production URL.
- Open Graph tags (`og:type`, `og:url`, `og:title`, `og:description`, `og:locale`, `og:locale:alternate`, `og:site_name`, `og:image`) enable rich social previews when the link is shared. The OG image is `public/og-image.svg` (1200×630).
- Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`) enable preview cards on X / Twitter.
- `public/sitemap.xml` lists the homepage with `changefreq: weekly` and `priority: 1.0`.
- `public/robots.txt` allows all crawlers and points to the sitemap. Google Search Console ownership is verified via a meta tag in `index.html`.

---

## Analytics

Two analytics tools run in production. Both are no-ops when their configuration is absent, so the app works normally in local development without any setup.

### Vercel Analytics

Tracks page views and Web Vitals automatically. No environment variable is required — enable it once in the Vercel dashboard under **Project → Analytics**.

The `<Analytics />` component is mounted in `App.tsx` via `@vercel/analytics/react`.

### PostHog

Tracks custom usage events for product insights. Initialised in `src/main.tsx` via `initPostHog()` from `src/analytics.ts`.

- **EU host** (`https://eu.i.posthog.com`) for GDPR compliance.
- Silently disabled when `VITE_POSTHOG_KEY` is not set.

#### Enabling PostHog

1. Set `VITE_POSTHOG_KEY=phc_<key>` in Vercel environment variables (Production scope).
2. Add the app domain (`padel-generator-three.vercel.app`) in PostHog → **Project Settings → Toolbar & Authorized URLs**.

#### Custom events

| Event | Properties |
|-------|------------|
| `tournament_generated` | `mode`, `rounds`, `matches`, `courts` |
| `mode_selected` | `mode` |
| `share_clicked` | `source`: `rounds-panel` / `header` / `drawer` / `history` / `detail` |
| `example_loaded` | — |
| `tournament_deleted` | — |
| `language_changed` | `lang` |

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
