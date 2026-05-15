# Padel Generator — Design Spec

**Date:** 2026-05-15
**Stack:** Vite + React 19 + TypeScript + Tailwind CSS + React Router + Sentry

---

## 1. Overview

A client-side web app to generate padel tournament schedules. Users fill in a form (game mode, club name, number of courts, players or pairs), the app generates round-robin rounds with court assignments, and the result can be printed and saved to history.

No backend. No persistent player database — players exist only in the generation form. History is stored in `localStorage`.

---

## 2. Game Modes

| Mode | Input | Pair generation |
|------|-------|-----------------|
| **Regular** | List of individual players | Random shuffle → group into pairs of 2 |
| **Duplas Fixas** | Pre-defined pairs | Used as-is |
| **Cabeças de Série** | Table A + Table B | Shuffle each table independently → pair by index |

---

## 3. Routing

```
/                     → GeneratorPage        (two-panel layout)
/history              → HistoryPage          (list of saved tournaments)
/history/:id          → TournamentDetailPage (read-only rounds view)
```

Navigation is handled by React Router v6. The history list entry links to `/history/:id` using the tournament's short UUID.

---

## 4. Architecture

### State Management

React Context + useReducer. A single `AppContext` holds the full `AppState`. No external state library.

### Persistence

A `useHistory` hook reads and writes `Tournament[]` to `localStorage` under the key `padel-history`. The hook is called from `GeneratorPage` on tournament generation and from `HistoryPage` on load.

### Error Monitoring

Sentry is initialised in `main.tsx` using `VITE_SENTRY_DSN` (env var). A React `ErrorBoundary` component wraps the router. In CI, the DSN is injected as a GitHub Actions secret.

---

## 5. Layout

**GeneratorPage (desktop):** two-column layout — form panel on the left, rounds panel on the right. The rounds panel shows the last generated result. A "Gerar Torneio" button at the bottom of the form triggers generation (random shuffle + round-robin). The button is disabled when validation errors exist.

**GeneratorPage (mobile):** single column — form on top, rounds below.

**Print view:** the form panel is hidden (`print:hidden`), the rounds panel is full width with space for score annotation.

---

## 6. Component Structure

```
src/
├── routes/
│   ├── GeneratorPage.tsx
│   ├── HistoryPage.tsx
│   └── TournamentDetailPage.tsx
├── components/
│   ├── generator/
│   │   ├── ModeSelector.tsx       ← tabs: Regular / Duplas Fixas / Cabeças de Série
│   │   ├── CourtSelector.tsx      ← number stepper
│   │   ├── PlayerInput.tsx        ← add/remove players (Regular)
│   │   ├── PairInput.tsx          ← add/remove pairs (Duplas Fixas)
│   │   ├── SeededInput.tsx        ← Table A + Table B (Cabeças de Série)
│   │   └── ValidationBanner.tsx   ← inline validation errors and warnings
│   ├── rounds/
│   │   ├── RoundsPanel.tsx        ← right panel, list of rounds
│   │   ├── RoundCard.tsx          ← single round with its matches
│   │   └── MatchCard.tsx          ← "Pair A vs Pair B — Court 1"
│   ├── history/
│   │   ├── HistoryList.tsx        ← list of history entries
│   │   └── HistoryEntry.tsx       ← date, mode, club name, player count
│   └── ui/
│       ├── DarkModeToggle.tsx
│       ├── PrintButton.tsx        ← hidden on print
│       └── ErrorBoundary.tsx      ← Sentry error boundary
├── context/
│   ├── AppContext.tsx
│   └── reducer.ts
├── utils/
│   ├── gameLogic.ts
│   └── validation.ts
├── types/
│   └── index.ts
└── hooks/
    └── useHistory.ts
```

---

## 7. Data Model

```typescript
type GameMode = 'regular' | 'fixed-pairs' | 'seeded'

type Pair = [string, string]

type Match = {
  pair1: Pair
  pair2: Pair
  court: number
}

type Round = {
  number: number
  matches: Match[]
}

type Tournament = {
  id: string
  date: string            // ISO 8601
  clubName: string
  mode: GameMode
  courts: number
  players: string[]       // Regular: input players; empty for other modes
  pairs: Pair[]           // all modes: final generated pairs
  tableA?: string[]       // Seeded: original Table A
  tableB?: string[]       // Seeded: original Table B
  rounds: Round[]
  seededWarning?: boolean // true if |tableA| ≠ |tableB|
}

type AppState = {
  mode: GameMode
  courts: number
  clubName: string
  players: string[]
  pairs: Pair[]
  tableA: string[]
  tableB: string[]
  generated: Tournament | null
}
```

---

## 8. Game Logic (`utils/gameLogic.ts`)

All pure functions, no side effects.

| Function | Description |
|----------|-------------|
| `shuffle(array)` | Fisher-Yates, returns shuffled copy |
| `makePairs(players)` | Shuffle → group into pairs of 2 (Regular mode) |
| `makeSeededPairs(tableA, tableB)` | Shuffle each table → pair by index; trims to shorter table |
| `roundRobin(pairs)` | Round-robin "rotate" algorithm; returns all rounds |
| `distribute(matches, courts)` | Assigns matches to courts; ensures no player appears twice per round |
| `generateTournament(inputs)` | Orchestrates: validate → pairs → roundRobin → distribute → build Tournament |

---

## 9. Validation Rules (`utils/validation.ts`)

| Mode | Rule | Type |
|------|------|------|
| Regular | Minimum 4 players | Error (blocks generation) |
| Regular | Player count must be even | Error (blocks generation) |
| Duplas Fixas | Minimum 2 pairs | Error (blocks generation) |
| Cabeças de Série | Minimum 2 players per table | Error (blocks generation) |
| Cabeças de Série | `\|tableA\| ≠ \|tableB\|` | Warning (non-blocking) |
| All modes | Minimum 1 court | Error (blocks generation) |

---

## 10. Testing

### Unit Tests (Vitest + allure-vitest)

```
tests/unit/
├── gameLogic.test.ts    ← shuffle, makePairs, makeSeededPairs, roundRobin, distribute
├── validation.test.ts   ← all validation rules
└── history.test.ts      ← localStorage read/write/retrieve
```

### E2E Tests (Playwright + allure-playwright)

```
tests/e2e/
├── regular.spec.ts       ← full Regular flow
├── fixed-pairs.spec.ts   ← full Duplas Fixas flow
└── seeded.spec.ts        ← full Cabeças de Série flow
```

Each e2e spec: fill form → generate → assert rounds displayed → assert entry appears in history.

### data-testid conventions

All interactive elements and key output containers use `data-testid` attributes. CSS classes are not used as selectors.

---

## 11. CI/CD (`.github/workflows/ci.yml`)

```
Trigger: push or PR to main

Jobs:
  unit-tests
    └── vitest run → allure-results → upload artifact

  e2e-tests
    └── playwright test → allure-results → upload artifact

  publish-report (needs: unit-tests, e2e-tests)
    └── download artifacts → allure generate → deploy to GitHub Pages
```

`VITE_SENTRY_DSN` is passed as a GitHub Actions secret and injected at build time.

---

## 12. Dark Mode

Implemented via Tailwind's `class` strategy — toggling a `dark` class on `<html>`. `DarkModeToggle` persists the preference to `localStorage` under `padel-theme`.
