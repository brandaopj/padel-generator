# Padel Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete Padel Generator SPA — three game modes, round-robin scheduling, localStorage history, dark mode, print view, Sentry monitoring, unit tests (Vitest + allure-vitest), e2e tests (Playwright + allure-playwright), and GitHub Actions CI/CD.

**Architecture:** Client-side SPA with React Router v6 (three routes). State managed by Context + useReducer. Pure utility functions for game logic, fully unit-tested with TDD. Tournament history persisted to localStorage. Components consume context directly; no prop drilling beyond one level.

**Tech Stack:** React 19, TypeScript, Vite 8, Tailwind v4 (@tailwindcss/vite), React Router v6, Sentry v8 (@sentry/react), Vitest, allure-vitest, Playwright, allure-playwright, GitHub Actions.

---

## File Map

| File | Responsibility |
|------|---------------|
| `src/types/index.ts` | All shared types: GameMode, Pair, Match, Round, Tournament, AppState, Action |
| `src/utils/gameLogic.ts` | Pure functions: shuffle, makePairs, makeSeededPairs, roundRobin, distribute, generateTournament, generateId |
| `src/utils/validation.ts` | Pure function: validate(state) → { errors, warnings } |
| `src/hooks/useHistory.ts` | localStorage read/write for Tournament[] |
| `src/hooks/useDarkMode.ts` | Toggle dark class on <html>, persist to localStorage |
| `src/context/reducer.ts` | AppState + Action types + reducer function + initialState |
| `src/context/AppContext.tsx` | Context provider wrapping useReducer |
| `src/components/ui/ErrorBoundary.tsx` | Sentry-integrated React error boundary |
| `src/components/ui/DarkModeToggle.tsx` | Button toggling dark mode |
| `src/components/ui/PrintButton.tsx` | Button calling window.print() |
| `src/components/generator/ModeSelector.tsx` | Tab selector for three game modes |
| `src/components/generator/CourtSelector.tsx` | Number stepper for courts |
| `src/components/generator/PlayerInput.tsx` | Add/remove player names (Regular mode) |
| `src/components/generator/PairInput.tsx` | Add/remove pre-defined pairs (Duplas Fixas) |
| `src/components/generator/SeededInput.tsx` | Table A + Table B inputs (Cabeças de Série) |
| `src/components/generator/ValidationBanner.tsx` | Renders errors (red) and warnings (yellow) |
| `src/components/rounds/MatchCard.tsx` | Single match: pair1 vs pair2 + court + score line |
| `src/components/rounds/RoundCard.tsx` | Single round with its MatchCards |
| `src/components/rounds/RoundsPanel.tsx` | Full rounds view or empty state |
| `src/components/history/HistoryEntry.tsx` | Single history item linking to /history/:id |
| `src/components/history/HistoryList.tsx` | List of HistoryEntry or empty state |
| `src/routes/GeneratorPage.tsx` | Two-panel layout: form left, rounds right |
| `src/routes/HistoryPage.tsx` | Reads history from localStorage and renders list |
| `src/routes/TournamentDetailPage.tsx` | Read-only rounds view for a saved tournament |
| `src/App.tsx` | BrowserRouter + Routes + shell header |
| `src/main.tsx` | Sentry.init + createRoot |
| `src/index.css` | @import "tailwindcss" + dark mode variant |
| `vite.config.ts` | Vite + React + Tailwind v4 plugins |
| `vitest.config.ts` | Vitest + jsdom + allure-vitest reporter |
| `playwright.config.ts` | Playwright + allure-playwright reporter |
| `tests/unit/gameLogic.test.ts` | Unit tests for all game logic functions |
| `tests/unit/validation.test.ts` | Unit tests for all validation rules |
| `tests/unit/history.test.ts` | Unit tests for useHistory hook |
| `tests/e2e/regular.spec.ts` | E2E: Regular mode full flow |
| `tests/e2e/fixed-pairs.spec.ts` | E2E: Duplas Fixas full flow |
| `tests/e2e/seeded.spec.ts` | E2E: Cabeças de Série full flow |
| `.github/workflows/ci.yml` | unit-tests + e2e-tests + publish-report jobs |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json` (via npm install)

- [ ] **Step 1: Install Tailwind v4 + React Router + Sentry**

```bash
cd /Users/pedro/BrandaoLab/padel-generator
npm install tailwindcss @tailwindcss/vite react-router-dom @sentry/react
```

Expected: no errors, packages added to `dependencies`.

- [ ] **Step 2: Install Vitest + allure-vitest**

```bash
npm install -D vitest @vitest/coverage-v8 jsdom allure-vitest
```

Expected: no errors, packages added to `devDependencies`.

- [ ] **Step 3: Install Playwright + allure-playwright**

```bash
npm install -D @playwright/test allure-playwright
npx playwright install chromium
```

Expected: Chromium browser downloaded.

- [ ] **Step 4: Add test scripts to package.json**

Open `package.json` and replace the `scripts` section with:

```json
"scripts": {
  "dev": "vite",
  "build": "tsc -b && vite build",
  "lint": "eslint .",
  "preview": "vite preview",
  "test:unit": "vitest run",
  "test:unit:watch": "vitest",
  "test:e2e": "playwright test",
  "test": "npm run test:unit && npm run test:e2e"
}
```

- [ ] **Step 5: Commit**

```bash
git init
git add package.json package-lock.json
git commit -m "chore: install tailwind, react-router, sentry, vitest, playwright"
```

---

## Task 2: Configure Vite + Tailwind v4 + dark mode CSS

**Files:**
- Modify: `vite.config.ts`
- Modify: `src/index.css`
- Modify: `src/App.css` (empty it)

- [ ] **Step 1: Update vite.config.ts**

Replace the full contents of `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
})
```

- [ ] **Step 2: Update src/index.css**

Replace the full contents of `src/index.css`:

```css
@import "tailwindcss";

/* Class-based dark mode for Tailwind v4 */
@custom-variant dark (&:where(.dark, .dark *));

/* Print: hide non-essential UI */
@media print {
  .print\:hidden { display: none !important; }
}
```

- [ ] **Step 3: Empty src/App.css**

Replace the full contents of `src/App.css` with an empty file (single newline):

```

```

- [ ] **Step 4: Verify dev server starts**

```bash
npm run dev
```

Expected: server starts at `http://localhost:5173` with no errors. Stop with Ctrl+C.

- [ ] **Step 5: Commit**

```bash
git add vite.config.ts src/index.css src/App.css
git commit -m "chore: configure tailwind v4 with class-based dark mode"
```

---

## Task 3: Configure Vitest

**Files:**
- Create: `vitest.config.ts`
- Create: `tests/unit/.gitkeep`

- [ ] **Step 1: Create vitest.config.ts**

```ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    reporters: process.env.CI
      ? [['allure-vitest/reporter', { resultsDir: 'allure-results' }]]
      : ['verbose'],
  },
})
```

- [ ] **Step 2: Create tests/unit directory**

```bash
mkdir -p tests/unit
touch tests/unit/.gitkeep
```

- [ ] **Step 3: Verify Vitest runs (no tests yet)**

```bash
npm run test:unit
```

Expected: `No test files found` or exits with 0. If it errors on the reporter import, that is expected until allure-vitest is used.

- [ ] **Step 4: Commit**

```bash
git add vitest.config.ts tests/
git commit -m "chore: configure vitest with allure-vitest reporter"
```

---

## Task 4: Configure Playwright

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/e2e/.gitkeep`

- [ ] **Step 1: Create playwright.config.ts**

```ts
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  reporter: process.env.CI
    ? [['list'], ['allure-playwright', { resultsDir: 'allure-results-e2e' }]]
    : [['html', { open: 'never' }]],
  use: {
    baseURL: 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

- [ ] **Step 2: Create tests/e2e directory**

```bash
mkdir -p tests/e2e
touch tests/e2e/.gitkeep
```

- [ ] **Step 3: Commit**

```bash
git add playwright.config.ts tests/e2e/
git commit -m "chore: configure playwright with allure-playwright reporter"
```

---

## Task 5: Define types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create src/types/index.ts**

```bash
mkdir -p src/types
```

```ts
// src/types/index.ts
export type GameMode = 'regular' | 'fixed-pairs' | 'seeded'

export type Pair = [string, string]

export type Match = {
  pair1: Pair
  pair2: Pair
  court: number
}

export type Round = {
  number: number
  matches: Match[]
}

export type Tournament = {
  id: string
  date: string           // ISO 8601
  clubName: string
  mode: GameMode
  courts: number
  players: string[]      // Regular: input players; empty for other modes
  pairs: Pair[]          // All modes: final generated pairs
  tableA?: string[]      // Seeded: original Table A
  tableB?: string[]      // Seeded: original Table B
  rounds: Round[]
  seededWarning?: boolean
}

export type AppState = {
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

- [ ] **Step 2: Commit**

```bash
git add src/types/
git commit -m "feat: add shared TypeScript types"
```

---

## Task 6: Implement gameLogic.ts (TDD)

**Files:**
- Create: `src/utils/gameLogic.ts`
- Create: `tests/unit/gameLogic.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/gameLogic.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import {
  shuffle,
  makePairs,
  makeSeededPairs,
  roundRobin,
  distribute,
  generateId,
} from '../../src/utils/gameLogic'
import type { Pair } from '../../src/types'

describe('shuffle', () => {
  it('returns a copy with the same elements', () => {
    const arr = ['A', 'B', 'C', 'D']
    const result = shuffle(arr)
    expect(result).toHaveLength(arr.length)
    expect([...result].sort()).toEqual([...arr].sort())
  })

  it('does not mutate the original array', () => {
    const arr = ['A', 'B', 'C']
    const copy = [...arr]
    shuffle(arr)
    expect(arr).toEqual(copy)
  })
})

describe('makePairs', () => {
  it('groups even list of players into pairs', () => {
    const players = ['A', 'B', 'C', 'D']
    const pairs = makePairs(players)
    expect(pairs).toHaveLength(2)
    pairs.forEach(p => expect(p).toHaveLength(2))
  })

  it('contains every player exactly once', () => {
    const players = ['A', 'B', 'C', 'D', 'E', 'F']
    const flat = makePairs(players).flat()
    expect(flat.sort()).toEqual([...players].sort())
  })
})

describe('makeSeededPairs', () => {
  it('pairs tableA and tableB by index after shuffling', () => {
    const tableA = ['A1', 'A2', 'A3']
    const tableB = ['B1', 'B2', 'B3']
    const pairs = makeSeededPairs(tableA, tableB)
    expect(pairs).toHaveLength(3)
    pairs.forEach(p => {
      expect(tableA).toContain(p[0])
      expect(tableB).toContain(p[1])
    })
  })

  it('trims to the shorter table when sizes differ', () => {
    const pairs = makeSeededPairs(['A1', 'A2', 'A3'], ['B1', 'B2'])
    expect(pairs).toHaveLength(2)
  })
})

describe('roundRobin', () => {
  it('returns empty array for fewer than 2 pairs', () => {
    expect(roundRobin([])).toEqual([])
    expect(roundRobin([['A', 'B']])).toEqual([])
  })

  it('generates N-1 rounds for even N pairs', () => {
    const pairs: Pair[] = [['A','B'],['C','D'],['E','F'],['G','H']]
    expect(roundRobin(pairs)).toHaveLength(3)
  })

  it('every pair plays every other pair exactly once', () => {
    const pairs: Pair[] = [['A','B'],['C','D'],['E','F'],['G','H']]
    const rounds = roundRobin(pairs)
    const matchups = rounds.flatMap(r =>
      r.matches.map(m => [m.pair1, m.pair2].map(p => pairs.indexOf(p)).sort().join('-'))
    )
    const n = pairs.length
    const expected = (n * (n - 1)) / 2
    expect(new Set(matchups).size).toBe(expected)
  })

  it('no pair plays twice in the same round', () => {
    const pairs: Pair[] = [['A','B'],['C','D'],['E','F'],['G','H']]
    const rounds = roundRobin(pairs)
    rounds.forEach(round => {
      const seen = new Set<Pair>()
      round.matches.forEach(m => {
        expect(seen.has(m.pair1)).toBe(false)
        expect(seen.has(m.pair2)).toBe(false)
        seen.add(m.pair1)
        seen.add(m.pair2)
      })
    })
  })
})

describe('distribute', () => {
  it('assigns court numbers between 1 and courts', () => {
    const pairs: Pair[] = [['A','B'],['C','D'],['E','F'],['G','H']]
    const rounds = roundRobin(pairs)
    const result = distribute(rounds, 2)
    result.forEach(round =>
      round.matches.forEach(m => {
        expect(m.court).toBeGreaterThanOrEqual(1)
        expect(m.court).toBeLessThanOrEqual(2)
      })
    )
  })

  it('cycles courts for matches within a round', () => {
    const pairs: Pair[] = [['A','B'],['C','D'],['E','F'],['G','H']]
    const rounds = roundRobin(pairs)
    const result = distribute(rounds, 2)
    // First round: match 0 → court 1, match 1 → court 2
    expect(result[0].matches[0].court).toBe(1)
    expect(result[0].matches[1].court).toBe(2)
  })
})

describe('generateId', () => {
  it('returns a non-empty string', () => {
    expect(typeof generateId()).toBe('string')
    expect(generateId().length).toBeGreaterThan(0)
  })

  it('returns unique values', () => {
    const ids = new Set(Array.from({ length: 100 }, generateId))
    expect(ids.size).toBe(100)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:unit
```

Expected: FAIL — `Cannot find module '../../src/utils/gameLogic'`

- [ ] **Step 3: Implement src/utils/gameLogic.ts**

```bash
mkdir -p src/utils
```

Create `src/utils/gameLogic.ts`:

```ts
import type { GameMode, Pair, Round, Match, Tournament } from '../types'

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

export function makePairs(players: string[]): Pair[] {
  const shuffled = shuffle(players)
  const pairs: Pair[] = []
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    pairs.push([shuffled[i], shuffled[i + 1]])
  }
  return pairs
}

export function makeSeededPairs(tableA: string[], tableB: string[]): Pair[] {
  const sA = shuffle(tableA)
  const sB = shuffle(tableB)
  const len = Math.min(sA.length, sB.length)
  return Array.from({ length: len }, (_, i) => [sA[i], sB[i]] as Pair)
}

export function roundRobin(pairs: Pair[]): Round[] {
  if (pairs.length < 2) return []

  const list: (Pair | null)[] = [...pairs]
  if (list.length % 2 !== 0) list.push(null)

  const n = list.length
  const rounds: Round[] = []

  for (let r = 0; r < n - 1; r++) {
    const matches: Match[] = []
    for (let i = 0; i < n / 2; i++) {
      const home = list[i]
      const away = list[n - 1 - i]
      if (home !== null && away !== null) {
        matches.push({ pair1: home, pair2: away, court: 0 })
      }
    }
    rounds.push({ number: r + 1, matches })
    // Rotate: fix index 0, move last element to position 1
    list.splice(1, 0, list.pop()!)
  }

  return rounds
}

export function distribute(rounds: Round[], courts: number): Round[] {
  return rounds.map(round => ({
    ...round,
    matches: round.matches.map((match, i) => ({
      ...match,
      court: (i % courts) + 1,
    })),
  }))
}

export function generateId(): string {
  return Math.random().toString(36).slice(2, 9)
}

export function generateTournament(inputs: {
  mode: GameMode
  clubName: string
  courts: number
  players: string[]
  pairs: Pair[]
  tableA: string[]
  tableB: string[]
}): Tournament {
  const { mode, clubName, courts, players, pairs: inputPairs, tableA, tableB } = inputs

  let finalPairs: Pair[]
  if (mode === 'regular') {
    finalPairs = makePairs(players)
  } else if (mode === 'fixed-pairs') {
    finalPairs = [...inputPairs]
  } else {
    finalPairs = makeSeededPairs(tableA, tableB)
  }

  const rounds = distribute(roundRobin(finalPairs), courts)
  const seededWarning = mode === 'seeded' && tableA.length !== tableB.length

  return {
    id: generateId(),
    date: new Date().toISOString(),
    clubName,
    mode,
    courts,
    players: mode === 'regular' ? [...players] : [],
    pairs: finalPairs,
    ...(mode === 'seeded' && { tableA: [...tableA], tableB: [...tableB] }),
    rounds,
    ...(seededWarning && { seededWarning: true }),
  }
}
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
npm run test:unit
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/gameLogic.ts tests/unit/gameLogic.test.ts
git commit -m "feat: implement game logic with full unit test coverage (TDD)"
```

---

## Task 7: Implement validation.ts (TDD)

**Files:**
- Create: `src/utils/validation.ts`
- Create: `tests/unit/validation.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/validation.test.ts`:

```ts
import { describe, it, expect } from 'vitest'
import { validate } from '../../src/utils/validation'
import type { AppState } from '../../src/types'

const base: AppState = {
  mode: 'regular',
  courts: 2,
  clubName: '',
  players: [],
  pairs: [],
  tableA: [],
  tableB: [],
  generated: null,
}

describe('validate — Regular mode', () => {
  it('errors when fewer than 4 players', () => {
    const { errors } = validate({ ...base, players: ['A', 'B'] })
    expect(errors.some(e => e.includes('4'))).toBe(true)
  })

  it('errors when player count is odd', () => {
    const { errors } = validate({ ...base, players: ['A', 'B', 'C', 'D', 'E'] })
    expect(errors.some(e => e.toLowerCase().includes('par'))).toBe(true)
  })

  it('no errors for 4 players with 1 court', () => {
    const { errors } = validate({ ...base, players: ['A', 'B', 'C', 'D'], courts: 1 })
    expect(errors).toHaveLength(0)
  })
})

describe('validate — Duplas Fixas mode', () => {
  it('errors when fewer than 2 pairs', () => {
    const { errors } = validate({ ...base, mode: 'fixed-pairs', pairs: [['A', 'B']] })
    expect(errors.some(e => e.includes('2'))).toBe(true)
  })

  it('no errors for 2 pairs', () => {
    const { errors } = validate({
      ...base,
      mode: 'fixed-pairs',
      pairs: [['A', 'B'], ['C', 'D']],
    })
    expect(errors).toHaveLength(0)
  })
})

describe('validate — Cabeças de Série mode', () => {
  it('errors when table A has fewer than 2 players', () => {
    const { errors } = validate({
      ...base,
      mode: 'seeded',
      tableA: ['A1'],
      tableB: ['B1', 'B2'],
    })
    expect(errors.some(e => e.includes('A'))).toBe(true)
  })

  it('errors when table B has fewer than 2 players', () => {
    const { errors } = validate({
      ...base,
      mode: 'seeded',
      tableA: ['A1', 'A2'],
      tableB: ['B1'],
    })
    expect(errors.some(e => e.includes('B'))).toBe(true)
  })

  it('warns (non-blocking) when tables have different sizes', () => {
    const result = validate({
      ...base,
      mode: 'seeded',
      tableA: ['A1', 'A2', 'A3'],
      tableB: ['B1', 'B2'],
    })
    expect(result.errors).toHaveLength(0)
    expect(result.warnings.length).toBeGreaterThan(0)
  })

  it('no errors or warnings for equal-sized tables', () => {
    const result = validate({
      ...base,
      mode: 'seeded',
      tableA: ['A1', 'A2'],
      tableB: ['B1', 'B2'],
    })
    expect(result.errors).toHaveLength(0)
    expect(result.warnings).toHaveLength(0)
  })
})

describe('validate — courts', () => {
  it('errors when courts is 0', () => {
    const { errors } = validate({ ...base, players: ['A','B','C','D'], courts: 0 })
    expect(errors.some(e => e.includes('campo'))).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:unit
```

Expected: FAIL — `Cannot find module '../../src/utils/validation'`

- [ ] **Step 3: Implement src/utils/validation.ts**

```ts
import type { AppState } from '../types'

export type ValidationResult = {
  errors: string[]
  warnings: string[]
}

export function validate(state: AppState): ValidationResult {
  const errors: string[] = []
  const warnings: string[] = []

  if (state.courts < 1) {
    errors.push('É necessário pelo menos 1 campo')
  }

  if (state.mode === 'regular') {
    if (state.players.length < 4) {
      errors.push('Modo Regular requer pelo menos 4 jogadores')
    } else if (state.players.length % 2 !== 0) {
      errors.push('O número de jogadores deve ser par')
    }
  }

  if (state.mode === 'fixed-pairs') {
    if (state.pairs.length < 2) {
      errors.push('Modo Duplas Fixas requer pelo menos 2 duplas')
    }
  }

  if (state.mode === 'seeded') {
    if (state.tableA.length < 2) {
      errors.push('A Tabela A requer pelo menos 2 jogadores')
    }
    if (state.tableB.length < 2) {
      errors.push('A Tabela B requer pelo menos 2 jogadores')
    }
    if (
      state.tableA.length >= 2 &&
      state.tableB.length >= 2 &&
      state.tableA.length !== state.tableB.length
    ) {
      warnings.push(
        `As tabelas têm tamanhos diferentes (A: ${state.tableA.length}, B: ${state.tableB.length}). Serão usados ${Math.min(state.tableA.length, state.tableB.length)} pares.`
      )
    }
  }

  return { errors, warnings }
}
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
npm run test:unit
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/utils/validation.ts tests/unit/validation.test.ts
git commit -m "feat: implement validation rules with full unit test coverage (TDD)"
```

---

## Task 8: Implement useHistory hook (TDD)

**Files:**
- Create: `src/hooks/useHistory.ts`
- Create: `tests/unit/history.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `tests/unit/history.test.ts`:

```ts
import { describe, it, expect, beforeEach } from 'vitest'
import { useHistory } from '../../src/hooks/useHistory'
import type { Tournament } from '../../src/types'

function makeTournament(id: string, clubName = 'Club'): Tournament {
  return {
    id,
    date: new Date().toISOString(),
    clubName,
    mode: 'regular',
    courts: 2,
    players: ['A', 'B', 'C', 'D'],
    pairs: [['A', 'B'], ['C', 'D']],
    rounds: [],
  }
}

describe('useHistory', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getAll returns empty array when localStorage is empty', () => {
    const { getAll } = useHistory()
    expect(getAll()).toEqual([])
  })

  it('save adds tournament to history', () => {
    const { save, getAll } = useHistory()
    save(makeTournament('t1'))
    expect(getAll()).toHaveLength(1)
  })

  it('save prepends newest tournament first', () => {
    const { save, getAll } = useHistory()
    save(makeTournament('t1'))
    save(makeTournament('t2'))
    const all = getAll()
    expect(all[0].id).toBe('t2')
    expect(all[1].id).toBe('t1')
  })

  it('getById returns the correct tournament', () => {
    const { save, getById } = useHistory()
    save(makeTournament('abc', 'My Club'))
    const t = getById('abc')
    expect(t?.clubName).toBe('My Club')
  })

  it('getById returns undefined when id not found', () => {
    const { getById } = useHistory()
    expect(getById('nonexistent')).toBeUndefined()
  })

  it('getAll returns empty array when localStorage contains invalid JSON', () => {
    localStorage.setItem('padel-history', 'not-json')
    const { getAll } = useHistory()
    expect(getAll()).toEqual([])
  })
})
```

- [ ] **Step 2: Run tests to verify they fail**

```bash
npm run test:unit
```

Expected: FAIL — `Cannot find module '../../src/hooks/useHistory'`

- [ ] **Step 3: Create src/hooks directory and implement useHistory.ts**

```bash
mkdir -p src/hooks
```

Create `src/hooks/useHistory.ts`:

```ts
import type { Tournament } from '../types'

const KEY = 'padel-history'

export function useHistory() {
  function getAll(): Tournament[] {
    try {
      return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Tournament[]
    } catch {
      return []
    }
  }

  function save(tournament: Tournament): void {
    const all = getAll()
    localStorage.setItem(KEY, JSON.stringify([tournament, ...all]))
  }

  function getById(id: string): Tournament | undefined {
    return getAll().find(t => t.id === id)
  }

  return { getAll, save, getById }
}
```

- [ ] **Step 4: Run tests and verify they pass**

```bash
npm run test:unit
```

Expected: all tests PASS.

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useHistory.ts tests/unit/history.test.ts
git commit -m "feat: implement useHistory hook with localStorage persistence (TDD)"
```

---

## Task 9: Implement useDarkMode hook

**Files:**
- Create: `src/hooks/useDarkMode.ts`

- [ ] **Step 1: Create src/hooks/useDarkMode.ts**

```ts
import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [dark, setDark] = useState<boolean>(() => {
    return localStorage.getItem('padel-theme') === 'dark'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
    localStorage.setItem('padel-theme', dark ? 'dark' : 'light')
  }, [dark])

  return { dark, toggle: () => setDark(d => !d) }
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useDarkMode.ts
git commit -m "feat: implement useDarkMode hook with localStorage persistence"
```

---

## Task 10: Implement Context + Reducer

**Files:**
- Create: `src/context/reducer.ts`
- Create: `src/context/AppContext.tsx`

- [ ] **Step 1: Create src/context/reducer.ts**

```bash
mkdir -p src/context
```

```ts
import type { AppState, GameMode, Pair, Tournament } from '../types'

export type Action =
  | { type: 'SET_MODE'; payload: GameMode }
  | { type: 'SET_COURTS'; payload: number }
  | { type: 'SET_CLUB_NAME'; payload: string }
  | { type: 'ADD_PLAYER'; payload: string }
  | { type: 'REMOVE_PLAYER'; payload: number }
  | { type: 'ADD_PAIR'; payload: Pair }
  | { type: 'REMOVE_PAIR'; payload: number }
  | { type: 'ADD_TABLE_A'; payload: string }
  | { type: 'REMOVE_TABLE_A'; payload: number }
  | { type: 'ADD_TABLE_B'; payload: string }
  | { type: 'REMOVE_TABLE_B'; payload: number }
  | { type: 'SET_GENERATED'; payload: Tournament | null }
  | { type: 'RESET' }

export const initialState: AppState = {
  mode: 'regular',
  courts: 2,
  clubName: '',
  players: [],
  pairs: [],
  tableA: [],
  tableB: [],
  generated: null,
}

export function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'SET_MODE':
      // Switching mode resets inputs but preserves courts and clubName
      return { ...initialState, mode: action.payload, courts: state.courts, clubName: state.clubName }
    case 'SET_COURTS':
      return { ...state, courts: action.payload }
    case 'SET_CLUB_NAME':
      return { ...state, clubName: action.payload }
    case 'ADD_PLAYER':
      return { ...state, players: [...state.players, action.payload] }
    case 'REMOVE_PLAYER':
      return { ...state, players: state.players.filter((_, i) => i !== action.payload) }
    case 'ADD_PAIR':
      return { ...state, pairs: [...state.pairs, action.payload] }
    case 'REMOVE_PAIR':
      return { ...state, pairs: state.pairs.filter((_, i) => i !== action.payload) }
    case 'ADD_TABLE_A':
      return { ...state, tableA: [...state.tableA, action.payload] }
    case 'REMOVE_TABLE_A':
      return { ...state, tableA: state.tableA.filter((_, i) => i !== action.payload) }
    case 'ADD_TABLE_B':
      return { ...state, tableB: [...state.tableB, action.payload] }
    case 'REMOVE_TABLE_B':
      return { ...state, tableB: state.tableB.filter((_, i) => i !== action.payload) }
    case 'SET_GENERATED':
      return { ...state, generated: action.payload }
    case 'RESET':
      return initialState
    default:
      return state
  }
}
```

- [ ] **Step 2: Create src/context/AppContext.tsx**

```tsx
import { createContext, useReducer, type ReactNode } from 'react'
import type { AppState } from '../types'
import { reducer, initialState, type Action } from './reducer'

type AppContextType = {
  state: AppState
  dispatch: React.Dispatch<Action>
}

export const AppContext = createContext<AppContextType>({
  state: initialState,
  dispatch: () => {},
})

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/context/
git commit -m "feat: implement Context + useReducer state management"
```

---

## Task 11: Sentry setup + main.tsx

**Files:**
- Modify: `src/main.tsx`
- Create: `.env.example`

- [ ] **Step 1: Update src/main.tsx**

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import './index.css'
import App from './App.tsx'

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN as string | undefined,
  integrations: [Sentry.browserTracingIntegration()],
  tracesSampleRate: 1.0,
  // Sentry is a no-op when dsn is undefined (local dev without secret)
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- [ ] **Step 2: Create .env.example**

```bash
# Copy to .env.local and fill in your Sentry DSN
VITE_SENTRY_DSN=
```

- [ ] **Step 3: Add .env.local to .gitignore**

Add to `.gitignore` (create if it doesn't exist):

```
node_modules/
dist/
.env.local
allure-results/
allure-results-e2e/
allure-report/
playwright-report/
```

- [ ] **Step 4: Commit**

```bash
git add src/main.tsx .env.example .gitignore
git commit -m "feat: initialise Sentry with optional DSN via env var"
```

---

## Task 12: UI primitives

**Files:**
- Create: `src/components/ui/ErrorBoundary.tsx`
- Create: `src/components/ui/DarkModeToggle.tsx`
- Create: `src/components/ui/PrintButton.tsx`

- [ ] **Step 1: Create src/components/ui/ErrorBoundary.tsx**

```bash
mkdir -p src/components/ui
```

```tsx
import { Component, type ReactNode, type ErrorInfo } from 'react'
import * as Sentry from '@sentry/react'

type Props = { children: ReactNode }
type State = { hasError: boolean }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gray-50 dark:bg-gray-900">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Algo correu mal</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Ocorreu um erro inesperado. Tenta recarregar a página.
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

- [ ] **Step 2: Create src/components/ui/DarkModeToggle.tsx**

```tsx
type Props = { dark: boolean; onToggle: () => void }

export function DarkModeToggle({ dark, onToggle }: Props) {
  return (
    <button
      data-testid="dark-mode-toggle"
      onClick={onToggle}
      aria-label={dark ? 'Activar modo claro' : 'Activar modo escuro'}
      className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
    >
      {dark ? '☀️' : '🌙'}
    </button>
  )
}
```

- [ ] **Step 3: Create src/components/ui/PrintButton.tsx**

```tsx
export function PrintButton() {
  return (
    <button
      data-testid="print-button"
      onClick={() => window.print()}
      className="px-4 py-2 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 rounded-md text-sm hover:bg-gray-700 dark:hover:bg-gray-300 print:hidden transition-colors"
    >
      Imprimir
    </button>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add ErrorBoundary, DarkModeToggle, PrintButton UI primitives"
```

---

## Task 13: Generator form components — ModeSelector + CourtSelector

**Files:**
- Create: `src/components/generator/ModeSelector.tsx`
- Create: `src/components/generator/CourtSelector.tsx`

- [ ] **Step 1: Create src/components/generator/ModeSelector.tsx**

```bash
mkdir -p src/components/generator
```

```tsx
import type { GameMode } from '../../types'

const MODES: { value: GameMode; label: string }[] = [
  { value: 'regular', label: 'Regular' },
  { value: 'fixed-pairs', label: 'Duplas Fixas' },
  { value: 'seeded', label: 'Cabeças de Série' },
]

type Props = { value: GameMode; onChange: (mode: GameMode) => void }

export function ModeSelector({ value, onChange }: Props) {
  return (
    <div
      className="flex rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      role="tablist"
    >
      {MODES.map(mode => (
        <button
          key={mode.value}
          role="tab"
          aria-selected={value === mode.value}
          data-testid={`mode-${mode.value}`}
          onClick={() => onChange(mode.value)}
          className={`flex-1 py-2 px-2 text-sm font-medium transition-colors ${
            value === mode.value
              ? 'bg-blue-600 text-white'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/generator/CourtSelector.tsx**

```tsx
type Props = { value: number; onChange: (courts: number) => void }

export function CourtSelector({ value, onChange }: Props) {
  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Campos</label>
      <div className="flex items-center gap-2">
        <button
          data-testid="courts-decrement"
          onClick={() => onChange(Math.max(1, value - 1))}
          disabled={value <= 1}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg disabled:opacity-40 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          −
        </button>
        <span data-testid="courts-value" className="w-8 text-center font-semibold text-gray-800 dark:text-gray-100">
          {value}
        </span>
        <button
          data-testid="courts-increment"
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          +
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/ModeSelector.tsx src/components/generator/CourtSelector.tsx
git commit -m "feat: add ModeSelector and CourtSelector generator components"
```

---

## Task 14: Generator form components — PlayerInput + PairInput

**Files:**
- Create: `src/components/generator/PlayerInput.tsx`
- Create: `src/components/generator/PairInput.tsx`

- [ ] **Step 1: Create src/components/generator/PlayerInput.tsx**

```tsx
import { useState } from 'react'

type Props = {
  players: string[]
  onAdd: (name: string) => void
  onRemove: (index: number) => void
}

export function PlayerInput({ players, onAdd, onRemove }: Props) {
  const [name, setName] = useState('')

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Jogadores ({players.length})
      </label>
      <div className="flex gap-2">
        <input
          data-testid="player-input"
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Nome do jogador"
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          data-testid="player-add"
          onClick={handleAdd}
          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          Adicionar
        </button>
      </div>
      <ul className="space-y-1">
        {players.map((player, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-1.5 text-sm"
          >
            <span data-testid={`player-${i}`} className="text-gray-800 dark:text-gray-100">
              {player}
            </span>
            <button
              data-testid={`player-remove-${i}`}
              onClick={() => onRemove(i)}
              aria-label={`Remover ${player}`}
              className="text-red-500 hover:text-red-700 ml-2 leading-none"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/generator/PairInput.tsx**

```tsx
import { useState } from 'react'
import type { Pair } from '../../types'

type Props = {
  pairs: Pair[]
  onAdd: (pair: Pair) => void
  onRemove: (index: number) => void
}

export function PairInput({ pairs, onAdd, onRemove }: Props) {
  const [p1, setP1] = useState('')
  const [p2, setP2] = useState('')

  function handleAdd() {
    const t1 = p1.trim()
    const t2 = p2.trim()
    if (!t1 || !t2) return
    onAdd([t1, t2])
    setP1('')
    setP2('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        Duplas ({pairs.length})
      </label>
      <div className="flex gap-2">
        <input
          data-testid="pair-input-1"
          type="text"
          value={p1}
          onChange={e => setP1(e.target.value)}
          placeholder="Jogador 1"
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          data-testid="pair-input-2"
          type="text"
          value={p2}
          onChange={e => setP2(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Jogador 2"
          className="flex-1 rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          data-testid="pair-add"
          onClick={handleAdd}
          className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          +
        </button>
      </div>
      <ul className="space-y-1">
        {pairs.map((pair, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-3 py-1.5 text-sm"
          >
            <span data-testid={`pair-${i}`} className="text-gray-800 dark:text-gray-100">
              {pair[0]} / {pair[1]}
            </span>
            <button
              data-testid={`pair-remove-${i}`}
              onClick={() => onRemove(i)}
              aria-label={`Remover dupla ${pair[0]} / ${pair[1]}`}
              className="text-red-500 hover:text-red-700 ml-2 leading-none"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/PlayerInput.tsx src/components/generator/PairInput.tsx
git commit -m "feat: add PlayerInput and PairInput generator components"
```

---

## Task 15: Generator form components — SeededInput + ValidationBanner

**Files:**
- Create: `src/components/generator/SeededInput.tsx`
- Create: `src/components/generator/ValidationBanner.tsx`

- [ ] **Step 1: Create src/components/generator/SeededInput.tsx**

```tsx
import { useState } from 'react'

type TableProps = {
  label: string
  players: string[]
  testPrefix: string
  onAdd: (name: string) => void
  onRemove: (index: number) => void
}

function TableInput({ label, players, testPrefix, onAdd, onRemove }: TableProps) {
  const [name, setName] = useState('')

  function handleAdd() {
    const trimmed = name.trim()
    if (!trimmed) return
    onAdd(trimmed)
    setName('')
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label} ({players.length})
      </label>
      <div className="flex gap-1">
        <input
          data-testid={`${testPrefix}-input`}
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Nome"
          className="flex-1 min-w-0 rounded-md border border-gray-300 dark:border-gray-600 px-2 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          data-testid={`${testPrefix}-add`}
          onClick={handleAdd}
          className="px-2 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 transition-colors"
        >
          +
        </button>
      </div>
      <ul className="space-y-1">
        {players.map((player, i) => (
          <li
            key={i}
            className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 rounded px-2 py-1 text-sm"
          >
            <span data-testid={`${testPrefix}-${i}`} className="text-gray-800 dark:text-gray-100 truncate">
              {player}
            </span>
            <button
              data-testid={`${testPrefix}-remove-${i}`}
              onClick={() => onRemove(i)}
              className="text-red-500 hover:text-red-700 ml-1 shrink-0 leading-none"
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

type Props = {
  tableA: string[]
  tableB: string[]
  onAddA: (name: string) => void
  onRemoveA: (index: number) => void
  onAddB: (name: string) => void
  onRemoveB: (index: number) => void
}

export function SeededInput({ tableA, tableB, onAddA, onRemoveA, onAddB, onRemoveB }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <TableInput label="Tabela A" players={tableA} testPrefix="table-a" onAdd={onAddA} onRemove={onRemoveA} />
      <TableInput label="Tabela B" players={tableB} testPrefix="table-b" onAdd={onAddB} onRemove={onRemoveB} />
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/generator/ValidationBanner.tsx**

```tsx
type Props = {
  errors: string[]
  warnings: string[]
}

export function ValidationBanner({ errors, warnings }: Props) {
  if (!errors.length && !warnings.length) return null

  return (
    <div className="space-y-2">
      {errors.map((err, i) => (
        <div
          key={i}
          data-testid="validation-error"
          className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md px-3 py-2 text-sm text-red-700 dark:text-red-400"
        >
          <span className="shrink-0">⚠</span>
          <span>{err}</span>
        </div>
      ))}
      {warnings.map((warn, i) => (
        <div
          key={i}
          data-testid="validation-warning"
          className="flex items-start gap-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md px-3 py-2 text-sm text-yellow-700 dark:text-yellow-400"
        >
          <span className="shrink-0">ℹ</span>
          <span>{warn}</span>
        </div>
      ))}
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/generator/SeededInput.tsx src/components/generator/ValidationBanner.tsx
git commit -m "feat: add SeededInput and ValidationBanner generator components"
```

---

## Task 16: Rounds display components

**Files:**
- Create: `src/components/rounds/MatchCard.tsx`
- Create: `src/components/rounds/RoundCard.tsx`
- Create: `src/components/rounds/RoundsPanel.tsx`

- [ ] **Step 1: Create src/components/rounds/MatchCard.tsx**

```bash
mkdir -p src/components/rounds
```

```tsx
import type { Match } from '../../types'

type Props = { match: Match }

export function MatchCard({ match }: Props) {
  return (
    <div
      data-testid="match-card"
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3"
    >
      <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        Campo {match.court}
      </div>
      <div className="flex items-center gap-2 text-sm flex-wrap">
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {match.pair1[0]} / {match.pair1[1]}
        </span>
        <span className="text-gray-400 dark:text-gray-500">vs</span>
        <span className="font-medium text-gray-800 dark:text-gray-100">
          {match.pair2[0]} / {match.pair2[1]}
        </span>
      </div>
      {/* Score line for printing */}
      <div className="mt-3 border-b border-dashed border-gray-300 dark:border-gray-600 print:border-gray-400" />
    </div>
  )
}
```

- [ ] **Step 2: Create src/components/rounds/RoundCard.tsx**

```tsx
import type { Round } from '../../types'
import { MatchCard } from './MatchCard'

type Props = { round: Round }

export function RoundCard({ round }: Props) {
  return (
    <div data-testid={`round-${round.number}`} className="space-y-2">
      <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm uppercase tracking-wide">
        Ronda {round.number}
      </h3>
      <div className="grid gap-2 sm:grid-cols-2">
        {round.matches.map((match, i) => (
          <MatchCard key={i} match={match} />
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create src/components/rounds/RoundsPanel.tsx**

```tsx
import type { Tournament } from '../../types'
import { RoundCard } from './RoundCard'

type Props = { tournament: Tournament | null }

export function RoundsPanel({ tournament }: Props) {
  if (!tournament) {
    return (
      <div
        data-testid="rounds-empty"
        className="flex flex-col items-center justify-center h-64 text-gray-400 dark:text-gray-600"
      >
        <p className="text-base text-center">
          Preenche o formulário e clica em Gerar Torneio
        </p>
      </div>
    )
  }

  return (
    <div data-testid="rounds-panel" className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
          {tournament.clubName || 'Torneio'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
          {new Date(tournament.date).toLocaleDateString('pt-PT')} · {tournament.courts} campo(s) · {tournament.pairs.length} duplas
        </p>
        {tournament.seededWarning && (
          <p
            data-testid="seeded-warning"
            className="text-sm text-yellow-600 dark:text-yellow-400 mt-1"
          >
            Tabelas de tamanhos diferentes — usados {tournament.pairs.length} pares.
          </p>
        )}
      </div>
      {tournament.rounds.map(round => (
        <RoundCard key={round.number} round={round} />
      ))}
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/rounds/
git commit -m "feat: add MatchCard, RoundCard, RoundsPanel display components"
```

---

## Task 17: History components

**Files:**
- Create: `src/components/history/HistoryEntry.tsx`
- Create: `src/components/history/HistoryList.tsx`

- [ ] **Step 1: Create src/components/history/HistoryEntry.tsx**

```bash
mkdir -p src/components/history
```

```tsx
import { Link } from 'react-router-dom'
import type { Tournament } from '../../types'

const MODE_LABELS: Record<string, string> = {
  regular: 'Regular',
  'fixed-pairs': 'Duplas Fixas',
  seeded: 'Cabeças de Série',
}

type Props = { tournament: Tournament }

export function HistoryEntry({ tournament: t }: Props) {
  return (
    <Link
      to={`/history/${t.id}`}
      data-testid={`history-entry-${t.id}`}
      className="block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="font-semibold text-gray-800 dark:text-gray-100 truncate">
            {t.clubName || 'Sem nome'}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            {MODE_LABELS[t.mode]} · {t.courts} campo(s) · {t.pairs.length} duplas
          </p>
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 shrink-0 mt-0.5">
          {new Date(t.date).toLocaleDateString('pt-PT')}
        </p>
      </div>
    </Link>
  )
}
```

- [ ] **Step 2: Create src/components/history/HistoryList.tsx**

```tsx
import type { Tournament } from '../../types'
import { HistoryEntry } from './HistoryEntry'

type Props = { tournaments: Tournament[] }

export function HistoryList({ tournaments }: Props) {
  if (!tournaments.length) {
    return (
      <p
        data-testid="history-empty"
        className="text-center text-gray-400 dark:text-gray-600 py-16"
      >
        Nenhum torneio gerado ainda.
      </p>
    )
  }

  return (
    <ul data-testid="history-list" className="space-y-3">
      {tournaments.map(t => (
        <li key={t.id}>
          <HistoryEntry tournament={t} />
        </li>
      ))}
    </ul>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/history/
git commit -m "feat: add HistoryEntry and HistoryList components"
```

---

## Task 18: GeneratorPage route

**Files:**
- Create: `src/routes/GeneratorPage.tsx`

- [ ] **Step 1: Create src/routes/GeneratorPage.tsx**

```bash
mkdir -p src/routes
```

```tsx
import { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { ModeSelector } from '../components/generator/ModeSelector'
import { CourtSelector } from '../components/generator/CourtSelector'
import { PlayerInput } from '../components/generator/PlayerInput'
import { PairInput } from '../components/generator/PairInput'
import { SeededInput } from '../components/generator/SeededInput'
import { ValidationBanner } from '../components/generator/ValidationBanner'
import { RoundsPanel } from '../components/rounds/RoundsPanel'
import { PrintButton } from '../components/ui/PrintButton'
import { validate } from '../utils/validation'
import { generateTournament } from '../utils/gameLogic'
import { useHistory } from '../hooks/useHistory'

export function GeneratorPage() {
  const { state, dispatch } = useContext(AppContext)
  const { save } = useHistory()
  const { errors, warnings } = validate(state)

  function handleGenerate() {
    const tournament = generateTournament({
      mode: state.mode,
      clubName: state.clubName,
      courts: state.courts,
      players: state.players,
      pairs: state.pairs,
      tableA: state.tableA,
      tableB: state.tableB,
    })
    dispatch({ type: 'SET_GENERATED', payload: tournament })
    save(tournament)
  }

  return (
    <div className="max-w-7xl mx-auto p-4 lg:p-8">
      <div className="flex flex-col lg:flex-row gap-8">

        {/* Form panel */}
        <div className="lg:w-96 shrink-0 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nome do clube
            </label>
            <input
              data-testid="club-name-input"
              type="text"
              value={state.clubName}
              onChange={e => dispatch({ type: 'SET_CLUB_NAME', payload: e.target.value })}
              placeholder="Ex: Clube de Padel Lisboa"
              className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <ModeSelector
            value={state.mode}
            onChange={mode => dispatch({ type: 'SET_MODE', payload: mode })}
          />

          <CourtSelector
            value={state.courts}
            onChange={courts => dispatch({ type: 'SET_COURTS', payload: courts })}
          />

          {state.mode === 'regular' && (
            <PlayerInput
              players={state.players}
              onAdd={name => dispatch({ type: 'ADD_PLAYER', payload: name })}
              onRemove={i => dispatch({ type: 'REMOVE_PLAYER', payload: i })}
            />
          )}

          {state.mode === 'fixed-pairs' && (
            <PairInput
              pairs={state.pairs}
              onAdd={pair => dispatch({ type: 'ADD_PAIR', payload: pair })}
              onRemove={i => dispatch({ type: 'REMOVE_PAIR', payload: i })}
            />
          )}

          {state.mode === 'seeded' && (
            <SeededInput
              tableA={state.tableA}
              tableB={state.tableB}
              onAddA={name => dispatch({ type: 'ADD_TABLE_A', payload: name })}
              onRemoveA={i => dispatch({ type: 'REMOVE_TABLE_A', payload: i })}
              onAddB={name => dispatch({ type: 'ADD_TABLE_B', payload: name })}
              onRemoveB={i => dispatch({ type: 'REMOVE_TABLE_B', payload: i })}
            />
          )}

          <ValidationBanner errors={errors} warnings={warnings} />

          <button
            data-testid="generate-button"
            onClick={handleGenerate}
            disabled={errors.length > 0}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Gerar Torneio
          </button>
        </div>

        {/* Rounds panel */}
        <div className="flex-1 min-w-0">
          {state.generated && (
            <div className="flex justify-end mb-4 print:hidden">
              <PrintButton />
            </div>
          )}
          <RoundsPanel tournament={state.generated} />
        </div>

      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add src/routes/GeneratorPage.tsx
git commit -m "feat: add GeneratorPage two-panel layout"
```

---

## Task 19: HistoryPage + TournamentDetailPage routes

**Files:**
- Create: `src/routes/HistoryPage.tsx`
- Create: `src/routes/TournamentDetailPage.tsx`

- [ ] **Step 1: Create src/routes/HistoryPage.tsx**

```tsx
import { useEffect, useState } from 'react'
import type { Tournament } from '../types'
import { useHistory } from '../hooks/useHistory'
import { HistoryList } from '../components/history/HistoryList'

export function HistoryPage() {
  const { getAll } = useHistory()
  const [tournaments, setTournaments] = useState<Tournament[]>([])

  useEffect(() => {
    setTournaments(getAll())
  }, [])

  return (
    <div className="max-w-2xl mx-auto p-4 lg:p-8">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6">Histórico</h1>
      <HistoryList tournaments={tournaments} />
    </div>
  )
}
```

- [ ] **Step 2: Create src/routes/TournamentDetailPage.tsx**

```tsx
import { useParams, Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { Tournament } from '../types'
import { useHistory } from '../hooks/useHistory'
import { RoundsPanel } from '../components/rounds/RoundsPanel'
import { PrintButton } from '../components/ui/PrintButton'

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getById } = useHistory()
  const [tournament, setTournament] = useState<Tournament | null>(null)

  useEffect(() => {
    if (id) setTournament(getById(id) ?? null)
  }, [id])

  if (!tournament) {
    return (
      <div className="flex items-center justify-center h-64">
        <p data-testid="tournament-not-found" className="text-gray-400">
          Torneio não encontrado.
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto p-4 lg:p-8">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          to="/history"
          className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
        >
          ← Histórico
        </Link>
        <PrintButton />
      </div>
      <RoundsPanel tournament={tournament} />
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/routes/HistoryPage.tsx src/routes/TournamentDetailPage.tsx
git commit -m "feat: add HistoryPage and TournamentDetailPage routes"
```

---

## Task 20: App shell — App.tsx + wiring

**Files:**
- Modify: `src/App.tsx`

- [ ] **Step 1: Replace src/App.tsx**

```tsx
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { ErrorBoundary } from './components/ui/ErrorBoundary'
import { DarkModeToggle } from './components/ui/DarkModeToggle'
import { useDarkMode } from './hooks/useDarkMode'
import { GeneratorPage } from './routes/GeneratorPage'
import { HistoryPage } from './routes/HistoryPage'
import { TournamentDetailPage } from './routes/TournamentDetailPage'

function Shell() {
  const { dark, toggle } = useDarkMode()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 print:hidden sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-lg text-blue-600 hover:text-blue-700">
              Padel Generator
            </Link>
            <nav className="flex gap-4">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `text-sm transition-colors ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`
                }
              >
                Gerar
              </NavLink>
              <NavLink
                to="/history"
                className={({ isActive }) =>
                  `text-sm transition-colors ${isActive ? 'text-blue-600 font-medium' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100'}`
                }
              >
                Histórico
              </NavLink>
            </nav>
          </div>
          <DarkModeToggle dark={dark} onToggle={toggle} />
        </div>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<GeneratorPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/history/:id" element={<TournamentDetailPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  )
}
```

- [ ] **Step 2: Verify app compiles and runs**

```bash
npm run dev
```

Open `http://localhost:5173` in a browser. Verify:
- Header renders with "Padel Generator", "Gerar", "Histórico" nav, and dark mode toggle
- Generator page shows form on the left, empty rounds panel on the right
- Adding 4 players (e.g. A, B, C, D) enables the Generate button
- Clicking Generate shows rounds
- Navigating to /history shows empty history, then shows the generated tournament entry
- Dark mode toggle toggles the theme

Stop dev server with Ctrl+C.

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx src/App.css
git commit -m "feat: wire up App shell with router, header, and dark mode"
```

---

## Task 21: E2E tests — Regular mode

**Files:**
- Create: `tests/e2e/regular.spec.ts`

- [ ] **Step 1: Create tests/e2e/regular.spec.ts**

```ts
import { test, expect } from '@playwright/test'

test.describe('Regular mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Clear localStorage before each test
    await page.evaluate(() => localStorage.clear())
    await page.reload()
  })

  test('generates rounds for 8 players on 2 courts', async ({ page }) => {
    await page.getByTestId('club-name-input').fill('Clube Teste')
    await expect(page.getByTestId('mode-regular')).toHaveAttribute('aria-selected', 'true')

    const players = ['Ana', 'Bruno', 'Carlos', 'Diana', 'Eva', 'Filipe', 'Gina', 'Hugo']
    for (const player of players) {
      await page.getByTestId('player-input').fill(player)
      await page.getByTestId('player-add').click()
    }

    // 8 players added: no errors
    await expect(page.getByTestId('validation-error')).toHaveCount(0)
    await expect(page.getByTestId('generate-button')).toBeEnabled()

    await page.getByTestId('generate-button').click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    // 4 pairs → N-1 = 3 rounds
    await expect(page.getByTestId('round-1')).toBeVisible()
    await expect(page.getByTestId('round-2')).toBeVisible()
    await expect(page.getByTestId('round-3')).toBeVisible()
    // Each round: 2 matches on 2 courts
    const round1 = page.getByTestId('round-1')
    await expect(round1.getByTestId('match-card')).toHaveCount(2)
  })

  test('generate button is disabled for fewer than 4 players', async ({ page }) => {
    await page.getByTestId('player-input').fill('Ana')
    await page.getByTestId('player-add').click()
    await page.getByTestId('player-input').fill('Bruno')
    await page.getByTestId('player-add').click()

    await expect(page.getByTestId('validation-error').first()).toBeVisible()
    await expect(page.getByTestId('generate-button')).toBeDisabled()
  })

  test('generate button is disabled for odd number of players', async ({ page }) => {
    for (const player of ['Ana', 'Bruno', 'Carlos', 'Diana', 'Eva']) {
      await page.getByTestId('player-input').fill(player)
      await page.getByTestId('player-add').click()
    }

    await expect(page.getByTestId('validation-error').first()).toContainText('par')
    await expect(page.getByTestId('generate-button')).toBeDisabled()
  })

  test('generated tournament appears in history', async ({ page }) => {
    await page.getByTestId('club-name-input').fill('Clube Histórico')
    for (const player of ['Ana', 'Bruno', 'Carlos', 'Diana']) {
      await page.getByTestId('player-input').fill(player)
      await page.getByTestId('player-add').click()
    }
    await page.getByTestId('generate-button').click()
    await expect(page.getByTestId('rounds-panel')).toBeVisible()

    await page.click('text=Histórico')
    await expect(page.getByTestId('history-list')).toBeVisible()
    await expect(page.locator('[data-testid^="history-entry-"]').first()).toContainText('Clube Histórico')
  })

  test('history entry links to tournament detail page', async ({ page }) => {
    await page.getByTestId('club-name-input').fill('Clube Link')
    for (const player of ['Ana', 'Bruno', 'Carlos', 'Diana']) {
      await page.getByTestId('player-input').fill(player)
      await page.getByTestId('player-add').click()
    }
    await page.getByTestId('generate-button').click()

    await page.click('text=Histórico')
    await page.locator('[data-testid^="history-entry-"]').first().click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    await expect(page.locator('text=Clube Link')).toBeVisible()
    await expect(page.locator('text=← Histórico')).toBeVisible()
  })
})
```

- [ ] **Step 2: Run e2e tests**

```bash
npm run test:e2e -- tests/e2e/regular.spec.ts
```

Expected: all tests PASS (dev server starts automatically).

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/regular.spec.ts
git commit -m "test(e2e): add Regular mode full flow tests"
```

---

## Task 22: E2E tests — Duplas Fixas + Cabeças de Série

**Files:**
- Create: `tests/e2e/fixed-pairs.spec.ts`
- Create: `tests/e2e/seeded.spec.ts`

- [ ] **Step 1: Create tests/e2e/fixed-pairs.spec.ts**

```ts
import { test, expect } from '@playwright/test'

test.describe('Duplas Fixas mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.getByTestId('mode-fixed-pairs').click()
  })

  test('generates rounds for 4 fixed pairs', async ({ page }) => {
    await page.getByTestId('club-name-input').fill('Club Fixas')

    const pairs = [['Ana', 'Bruno'], ['Carlos', 'Diana'], ['Eva', 'Filipe'], ['Gina', 'Hugo']]
    for (const [p1, p2] of pairs) {
      await page.getByTestId('pair-input-1').fill(p1)
      await page.getByTestId('pair-input-2').fill(p2)
      await page.getByTestId('pair-add').click()
    }

    await expect(page.getByTestId('validation-error')).toHaveCount(0)
    await expect(page.getByTestId('generate-button')).toBeEnabled()

    await page.getByTestId('generate-button').click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    // 4 pairs → 3 rounds
    await expect(page.getByTestId('round-1')).toBeVisible()
    await expect(page.getByTestId('round-2')).toBeVisible()
    await expect(page.getByTestId('round-3')).toBeVisible()
  })

  test('generate button is disabled for fewer than 2 pairs', async ({ page }) => {
    await page.getByTestId('pair-input-1').fill('Ana')
    await page.getByTestId('pair-input-2').fill('Bruno')
    await page.getByTestId('pair-add').click()

    await expect(page.getByTestId('validation-error').first()).toBeVisible()
    await expect(page.getByTestId('generate-button')).toBeDisabled()
  })

  test('pairs appear in list after adding', async ({ page }) => {
    await page.getByTestId('pair-input-1').fill('Ana')
    await page.getByTestId('pair-input-2').fill('Bruno')
    await page.getByTestId('pair-add').click()

    await expect(page.getByTestId('pair-0')).toContainText('Ana / Bruno')
  })

  test('can remove a pair', async ({ page }) => {
    await page.getByTestId('pair-input-1').fill('Ana')
    await page.getByTestId('pair-input-2').fill('Bruno')
    await page.getByTestId('pair-add').click()
    await page.getByTestId('pair-remove-0').click()

    await expect(page.getByTestId('pair-0')).toHaveCount(0)
  })
})
```

- [ ] **Step 2: Create tests/e2e/seeded.spec.ts**

```ts
import { test, expect } from '@playwright/test'

test.describe('Cabeças de Série mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => localStorage.clear())
    await page.reload()
    await page.getByTestId('mode-seeded').click()
  })

  test('generates rounds for equal-sized tables', async ({ page }) => {
    await page.getByTestId('club-name-input').fill('Club Seeded')

    for (const name of ['A1', 'A2', 'A3', 'A4']) {
      await page.getByTestId('table-a-input').fill(name)
      await page.getByTestId('table-a-add').click()
    }
    for (const name of ['B1', 'B2', 'B3', 'B4']) {
      await page.getByTestId('table-b-input').fill(name)
      await page.getByTestId('table-b-add').click()
    }

    await expect(page.getByTestId('validation-error')).toHaveCount(0)
    await expect(page.getByTestId('generate-button')).toBeEnabled()

    await page.getByTestId('generate-button').click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    // 4 pairs → 3 rounds
    await expect(page.getByTestId('round-1')).toBeVisible()
    await expect(page.getByTestId('round-3')).toBeVisible()
    // No seeded warning when tables are equal
    await expect(page.getByTestId('seeded-warning')).toHaveCount(0)
  })

  test('shows non-blocking warning for unequal table sizes', async ({ page }) => {
    for (const name of ['A1', 'A2', 'A3']) {
      await page.getByTestId('table-a-input').fill(name)
      await page.getByTestId('table-a-add').click()
    }
    for (const name of ['B1', 'B2']) {
      await page.getByTestId('table-b-input').fill(name)
      await page.getByTestId('table-b-add').click()
    }

    // Warning appears, but generate button is still enabled
    await expect(page.getByTestId('validation-warning').first()).toBeVisible()
    await expect(page.getByTestId('generate-button')).toBeEnabled()

    await page.getByTestId('generate-button').click()

    await expect(page.getByTestId('rounds-panel')).toBeVisible()
    await expect(page.getByTestId('seeded-warning')).toBeVisible()
  })

  test('generate button is disabled when a table has fewer than 2 players', async ({ page }) => {
    await page.getByTestId('table-a-input').fill('A1')
    await page.getByTestId('table-a-add').click()
    await page.getByTestId('table-b-input').fill('B1')
    await page.getByTestId('table-b-add').click()

    await expect(page.getByTestId('validation-error').first()).toBeVisible()
    await expect(page.getByTestId('generate-button')).toBeDisabled()
  })
})
```

- [ ] **Step 3: Run all e2e tests**

```bash
npm run test:e2e
```

Expected: all tests PASS.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/fixed-pairs.spec.ts tests/e2e/seeded.spec.ts
git commit -m "test(e2e): add Duplas Fixas and Cabeças de Série flow tests"
```

---

## Task 23: GitHub Actions CI/CD

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create .github/workflows/ci.yml**

```bash
mkdir -p .github/workflows
```

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Run unit tests
        run: npm run test:unit
        env:
          CI: true

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-results-unit
          path: allure-results/
          if-no-files-found: warn

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium

      - name: Build app
        run: npm run build
        env:
          VITE_SENTRY_DSN: ${{ secrets.VITE_SENTRY_DSN }}

      - name: Run e2e tests against preview server
        run: npm run test:e2e
        env:
          CI: true

      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: allure-results-e2e
          path: allure-results-e2e/
          if-no-files-found: warn

  publish-report:
    needs: [unit-tests, e2e-tests]
    if: always()
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - uses: actions/download-artifact@v4
        with:
          name: allure-results-unit
          path: allure-input/
        continue-on-error: true

      - uses: actions/download-artifact@v4
        with:
          name: allure-results-e2e
          path: allure-input/
        continue-on-error: true

      - name: Generate Allure report
        run: |
          npm install -g allure-commandline
          allure generate allure-input --clean -o allure-report

      - uses: actions/upload-pages-artifact@v3
        with:
          path: allure-report/

      - id: deployment
        uses: actions/deploy-pages@v4
```

> **Note:** After pushing, enable GitHub Pages in repository Settings → Pages → Source: "GitHub Actions". Add `VITE_SENTRY_DSN` in Settings → Secrets → Actions (leave empty if no Sentry project yet).

- [ ] **Step 2: Update playwright.config.ts to use preview server in CI**

The e2e job builds the app then runs tests. Update `playwright.config.ts` to point to the preview server when `CI=true`:

```ts
import { defineConfig, devices } from '@playwright/test'

const isCI = !!process.env.CI

export default defineConfig({
  testDir: './tests/e2e',
  reporter: isCI
    ? [['list'], ['allure-playwright', { resultsDir: 'allure-results-e2e' }]]
    : [['html', { open: 'never' }]],
  use: {
    baseURL: isCI ? 'http://localhost:4173' : 'http://localhost:5173',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: isCI ? 'npm run preview' : 'npm run dev',
    url: isCI ? 'http://localhost:4173' : 'http://localhost:5173',
    reuseExistingServer: !isCI,
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
})
```

- [ ] **Step 3: Run unit tests one final time to confirm everything passes**

```bash
npm run test:unit
```

Expected: all unit tests PASS.

- [ ] **Step 4: Commit**

```bash
git add .github/ playwright.config.ts
git commit -m "ci: add GitHub Actions pipeline with Allure Report on GitHub Pages"
```

---

## Task 24: Final cleanup — remove scaffold files

**Files:**
- Delete: `src/assets/react.svg`
- Delete: `src/assets/vite.svg`
- Delete: `src/assets/hero.png` (if exists and unused)

- [ ] **Step 1: Remove unused scaffold assets**

```bash
rm src/assets/react.svg src/assets/vite.svg 2>/dev/null || true
rm src/assets/hero.png 2>/dev/null || true
```

- [ ] **Step 2: Run full test suite**

```bash
npm run test:unit
```

Expected: all unit tests PASS.

- [ ] **Step 3: Build to verify TypeScript compiles cleanly**

```bash
npm run build
```

Expected: no TypeScript errors, `dist/` folder created.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "chore: remove unused Vite scaffold assets, verify build passes"
```

---

## Self-Review Checklist

Run this after completing all tasks:

- [ ] All 3 game modes tested e2e (regular, fixed-pairs, seeded)
- [ ] Validation errors block generation; warnings do not
- [ ] History is persisted across page reloads (check in DevTools → Application → localStorage)
- [ ] Dark mode toggle persists across page reloads
- [ ] Print view hides header and generate button (test with Ctrl+P in browser)
- [ ] `npm run build` succeeds with no TypeScript errors
- [ ] `npm run test:unit` — all tests pass
- [ ] `npm run test:e2e` — all tests pass
