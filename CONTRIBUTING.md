# Contributing to Padel Generator

## Prerequisites

- **Node.js 24** (matches CI; managed via `actions/setup-node`)
- Install dependencies: `npm ci`

## Dev workflow

```bash
npm run dev        # Vite dev server with HMR at http://localhost:5173
npm run build      # TypeScript check + production build → dist/
npm run lint       # ESLint
npm run test       # Unit tests + e2e tests (full suite)
npm run test:unit  # Vitest unit tests only
npm run test:e2e   # Playwright e2e tests only
```

`npm run build` must pass before merging — it runs `tsc -b` followed by `vite build`.

## Project structure

```
src/
  main.tsx              Entry point — initialises PostHog and Sentry, mounts React
  App.tsx               Router definition (createBrowserRouter + RouterProvider)
  analytics.ts          PostHog wrapper + web vitals reporting
  index.css             Tailwind base styles
  components/
    generator/          Form inputs (mode selector, player/pair/seeded inputs, etc.)
    history/            History list and individual history entry card
    rounds/             Tournament output (round cards, match cards, rounds panel)
    ui/                 Shared UI primitives (modals, toast, buttons, dark mode toggle)
    GeneratorPage.tsx   Full generator page component
    HistoryPage.tsx     History list page component
    TournamentDetailPage.tsx  Tournament detail view
  context/
    AppContext.tsx       React context + AppProvider
    reducer.ts          useReducer actions and state transitions
  hooks/
    useDarkMode.ts      Persists dark/light preference to localStorage
    useHistory.ts       Reads/writes tournament history to localStorage
  i18n/
    translations.ts     All UI strings in PT and EN; Lang type
  routes/               Route-level components consumed by App.tsx
  types/                Shared TypeScript types (Tournament, GameMode, Pair, etc.)
  utils/
    gameLogic.ts        Pure scheduling algorithms (see Game modes below)
```

## State management

All generator form state lives in a single `AppContext` backed by `useReducer`.

- **Context**: `src/context/AppContext.tsx` — creates the context and exports `AppProvider`.
- **Reducer**: `src/context/reducer.ts` — defines `Action`, `initialState`, and the pure `reducer` function.

To consume: `const { state, dispatch } = useContext(AppContext)`

To update state, dispatch one of the typed actions:

```typescript
dispatch({ type: 'SET_MODE', payload: 'fixed-pairs' })
dispatch({ type: 'SET_PLAYERS', payload: ['Alice', 'Bob', 'Carol', 'Dave'] })
dispatch({ type: 'SET_GENERATED', payload: tournament })
```

Setting `SET_PLAYERS` or `SET_PAIRS` or `SET_TABLE_A/B` also auto-calculates `courts` (one court per two pairs).

Tournament history is stored separately in `localStorage` via `useHistory.ts`. After any mutation (save, delete, undo), dispatch `window.dispatchEvent(new CustomEvent('padel-history-change'))` so all subscribers re-read localStorage.

## i18n

All UI text lives in `src/i18n/translations.ts`. Two locales are supported: `'pt'` (Portuguese, default) and `'en'` (English).

The `translations` object is keyed by locale and then by feature area. To add a new string:

1. Add the key and value under **both** `translations.pt` and `translations.en`.
2. For parameterised text, use a function: `label: (n: number) => \`Players (${n})\``.
3. Access strings in components via the `useLang` hook (or equivalent) which returns the correct locale subtree.

The `Lang` and `Translations` types are exported from `translations.ts`. TypeScript will surface a type error if a key is present in one locale but missing in the other.

## Game modes

Three modes are implemented in `src/utils/gameLogic.ts`:

| Mode | Input | Algorithm |
|------|-------|-----------|
| **Regular** | Individual player names | Pairs are drawn randomly each generation (`makePairs` shuffles the list and groups in twos). The resulting pairs run through a Round-Robin schedule (`roundRobin`). |
| **Fixed Pairs** | Pre-defined pairs (`Player1 / Player2`) | Pairs are fixed; `roundRobin` generates a schedule so every pair plays every other pair exactly once. |
| **Seeded** | Two independent tables (A and B) | Each table is shuffled independently (`makeSeededPairs`), then position _i_ of Table A is paired with position _i_ of Table B, creating skill-balanced pairs before the Round-Robin schedule runs. |

All three modes pass their final pairs into `distribute(roundRobin(pairs), courts)`, which assigns court numbers.

## Testing

**Unit tests** — `tests/unit/`  
Written with Vitest. Cover `gameLogic`, `validation`, `history` utilities, and `shareTournament`.

```bash
npm run test:unit          # run once
npm run test:unit:watch    # watch mode
npm run test:coverage      # with v8 coverage report → coverage/
```

**End-to-end tests** — `tests/e2e/`  
Written with Playwright (Chromium only). Tests run against the built app served by `vite preview`. Each spec file corresponds to a game mode or feature (`regular.spec.ts`, `fixed-pairs.spec.ts`, `seeded.spec.ts`, `history.spec.ts`).

```bash
npm run test:e2e
```

Note: use `page.click()` to navigate between in-app routes rather than `page.goto()`, to preserve localStorage state across navigations.

## CI/CD

On every push and pull request against `main`, GitHub Actions runs:

1. **unit-tests** — `npm run test:coverage`
2. **e2e-tests** — builds the app, checks the gzipped bundle size (limit 300 kB), then runs Playwright tests
3. **report-failure** / **resolve-failure** — opens or closes a GitHub issue labelled `ci-failure` automatically
4. **deploy** _(push to `main` only)_ — runs `npx vercel --prod` to deploy to production
5. **publish-report** — generates an Allure test report and publishes it to GitHub Pages

The workflow file is `.github/workflows/ci.yml`.
