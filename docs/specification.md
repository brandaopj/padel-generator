# Software Specification — Padel Generator

**Version:** 1.0
**Date:** 2026-05-15
**Status:** Production
**App:** https://padel-generator-three.vercel.app
**Repository:** https://github.com/brandaopj/padel-generator

---

## Table of Contents

1. [Overview](#1-overview)
2. [Actors and Usage Context](#2-actors-and-usage-context)
3. [Functional Requirements](#3-functional-requirements)
4. [Business Rules](#4-business-rules)
5. [Non-Functional Requirements](#5-non-functional-requirements)
6. [Data Model](#6-data-model)
7. [Algorithms](#7-algorithms)
8. [UI Specification](#8-ui-specification)
9. [Test Specification](#9-test-specification)
10. [Architecture and Technical Decisions](#10-architecture-and-technical-decisions)
11. [Out of Scope](#11-out-of-scope)

---

## 1. Overview

### 1.1 Purpose

**Padel Generator** is a web application for generating padel tournament schedules. The organiser enters the participants, selects the game mode, and the application automatically generates a round-robin schedule with court assignments, ready to be printed or viewed on screen.

### 1.2 Scope

The application is entirely client-side. There is no backend, authentication, or remote database. Persistence is limited to the tournament history saved in `localStorage` on the user's device.

### 1.3 Usage Context

The primary use case is a tournament organiser using a smartphone at the padel court immediately before or during a session. The typical flow takes less than 60 seconds: enter names (paste from a WhatsApp list), generate, print or show on screen.

---

## 2. Actors and Usage Context

### 2.1 Actors

| Actor | Description |
|-------|-------------|
| **Organiser** | Single user. Creates tournaments, views history, prints schedules. Primarily uses a smartphone. |

### 2.2 Main Use Cases

| ID | Use Case | Actor |
|----|----------|-------|
| CU-01 | Generate tournament in Regular mode | Organiser |
| CU-02 | Generate tournament in Fixed Pairs mode | Organiser |
| CU-03 | Generate tournament in Seeded mode | Organiser |
| CU-04 | View tournament history | Organiser |
| CU-05 | View detail of a past tournament | Organiser |
| CU-06 | Print tournament schedule | Organiser |

### 2.3 Typical Flow (CU-01)

```
1. User opens the app
2. Selects "Regular" mode (pre-selected by default)
3. Enters tournament name (optional)
4. Pastes player list into the textarea (one name per line)
5. App validates in real time and shows the calculated number of courts
6. User clicks "Generate Tournament"
7. App generates rounds and shows results in the right panel
8. Tournament is automatically saved to history
9. User clicks "Print" and hands out the sheet at the court
```

---

## 3. Functional Requirements

### 3.1 Game Modes

#### RF-01 — Three tournament generation modes

The system must support exactly three modes:

| Mode | Label | Description |
|------|-------|-------------|
| `regular` | Regular | Pairs drawn randomly from a list of individual players |
| `fixed-pairs` | Fixed Pairs | Pairs pre-defined by the user, used as-is |
| `seeded` | Seeded | Table A vs Table B — each table shuffled independently, matched by position |

#### RF-02 — Mode selection

- The active mode must have a clear visual indicator (blue background on the tab)
- Each mode must have a brief summary description visible below the selector to guide new users
- The default mode is `regular`

#### RF-03 — Data preservation when switching modes

- When switching modes, data entered in other modes must be preserved in memory
- The user must not need to re-enter data if they selected the wrong mode

---

### 3.2 Input Form

#### RF-04 — Tournament name

- Optional text field
- If empty, the tournament is identified as "Tournament" in the results view and in the history

#### RF-05 — Player entry (Regular mode)

- Textarea with one player per line
- Must accept direct paste from WhatsApp lists
- The label must show the number of recognised players in real time: `Players (N)`

#### RF-06 — Pair entry (Fixed Pairs mode)

- Textarea with one pair per line, format: `Player1 / Player2`
- The separator is `/` with or without spaces
- The label must show the number of recognised pairs: `Pairs (N)`

#### RF-07 — Table entry (Seeded mode)

- Two textareas side by side: Table A and Table B
- One player per line in each textarea
- Each label must show the number of recognised players: `Table A (N)` / `Table B (N)`

#### RF-08 — Clear textarea

- Each textarea must have a "Clear all" (or "Clear") button visible only when there is data
- On click, it must show an inline confirmation with two buttons: "Cancel" and "Clear"
- Must not use the browser's `window.confirm` (incompatible with mobile UX standards)

#### RF-09 — Automatic court calculation

- The number of courts is calculated automatically: `max(1, floor(numPairs / 2))`
- The value must be shown in real time below the inputs: `Courts calculated automatically: N`
- Only visible when the active mode has data entered (`hasInputs = true`)
- There is no manual field for the user to change this value

---

### 3.3 Validation

#### RF-10 — Validation rules

| Mode | Condition | Type | Message |
|------|-----------|------|---------|
| Regular | `players.length < 4` | Error | "Regular mode requires at least 4 players" |
| Regular | `players.length % 4 !== 0` | Error | "The number of players must be a multiple of 4 (4, 8, 12…)" |
| Fixed Pairs | `pairs.length < 2` | Error | "Fixed Pairs mode requires at least 2 pairs" |
| Seeded | `tableA.length < 2` | Error | "Table A requires at least 2 players" |
| Seeded | `tableB.length < 2` | Error | "Table B requires at least 2 players" |
| Seeded | `tableA.length !== tableB.length` (and both ≥ 2) | Warning | "The tables have different sizes (A: X, B: Y). Z pairs will be used." |
| All | `courts < 1` | Error | "At least 1 court is required" |

#### RF-11 — Validation message behaviour

- Errors disable the "Generate Tournament" button (it becomes inactive)
- Warnings do not block generation
- Messages only appear after the user has started entering data in the active mode (`hasInputs = true`)
- When switching to a mode with no data entered, no messages should appear

---

### 3.4 Tournament Generation

#### RF-12 — Generate button

- Label: "Generate Tournament"
- Disabled while validation errors exist (`errors.length > 0`)
- On click with valid inputs: generates tournament, saves to history, shows success message

#### RF-13 — Success message

- After successful generation, show the message "Tournament generated successfully!" for 3 seconds
- Must use `role="status"` and `aria-live="polite"` to be announced by screen readers

#### RF-14 — Stale results warning

- After generating a tournament, if the user changes any input (players, pairs, tables, mode, tournament name), a warning must appear: "The results may not reflect the current changes."
- The warning only appears when `hasInputs = true` in the active mode (it does not appear when switching to a mode with no data)
- It disappears when the tournament is generated again

#### RF-15 — Automatic scroll after generation (mobile)

- On mobile devices, after generating, the page must smoothly scroll to the results panel
- Must use `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` to avoid affecting desktop layouts where the panel is already visible

---

### 3.5 Results View

#### RF-16 — Results panel

- Shows the tournament name and the date of the generated tournament
- Lists all rounds in sequence
- On screen, rounds also show the number of courts and the number of pairs
- When printing, only the tournament name and date are visible in the header

#### RF-17 — Match card (MatchCard)

Each match must be presented in a card with:
- Court name (e.g. "Court 1", editable after generation — see RF-17a)
- Both players of each pair with an avatar (neutral silhouette icon) next to each name
- Two-column symmetric layout (`1fr auto 1fr`) with "vs" centred
- Names must wrap if they are long (no truncation)
- A writing area for the organiser to manually record the result

#### RF-17a — Court name editing

- After generating a tournament, the name of each court must be editable inline
- Each card shows a pencil icon (hidden when printing) next to the court name
- On click, the name becomes an inline text field; on blur or pressing Enter, the name is saved
- Pressing Escape cancels editing without saving
- The edited name applies to all cards for the same court across all rounds
- Edited names are automatically persisted in the history (`localStorage`)
- When printing and in the history detail view, the edited name is shown instead of "Court N"
- By default (no edit), the court name is "Court N" where N is the sequential number

#### RF-18 — Empty panel state

While no tournament has been generated, the panel must show the message: "Fill in the form and click Generate Tournament"

---

### 3.6 History

#### RF-19 — Automatic saving

Each generated tournament must be automatically saved to `localStorage` without any action by the user.

#### RF-20 — History list (`/history`)

- Lists all tournaments ordered from most recent to oldest
- Each entry shows: tournament name (or "No name"), game mode, number of courts, number of pairs, date
- Each entry is a link to `/history/:id`
- If the history is empty, show: "No tournaments generated yet."

#### RF-21 — Tournament detail (`/history/:id`)

- Shows the tournament in read-only mode (view only, no editing)
- Includes a back link "← History"
- Includes a "Print" button
- If the ID does not exist in the history, show: "Tournament not found."

---

### 3.7 Printing

#### RF-22 — Printed content

When printing, only the following must be visible:
- Tournament name and date
- All rounds with their match cards

The following must be hidden: form, app header, print button, validation warnings, stale results warning, success message, court/pair metadata.

#### RF-23 — Page format

- Size: A4
- Margins: 2 cm
- Implemented via `@page { size: A4; margin: 2cm }`

#### RF-24 — Print layout

- Match cards in a single column (full page width)
- Increased padding on cards for better legibility
- Card borders more visible when printing

#### RF-25 — Result area

- Each card must have a writing line for manual result annotation: `Result: ___________`

---

### 3.8 Navigation and Appearance

#### RF-26 — Navigation

Sticky header with:
- Logo/link "Padel Generator" → `/`
- Link "New Tournament" → `/`
- Link "History" → `/history`
- Dark mode toggle
- Hidden when printing

#### RF-27 — Dark mode

- Toggle visible in the header with ☀️ / 🌙 icons
- Preference persisted in `localStorage` under the key `padel-theme`
- Applied automatically on subsequent visits

---

## 4. Business Rules

| ID | Rule |
|----|------|
| RN-01 | A match involves exactly 4 players: 2 pairs of 2 |
| RN-02 | All matches in a round occur simultaneously — there is no waiting list |
| RN-03 | In Regular mode, the number of players must be a multiple of 4 |
| RN-04 | The number of courts is always `max(1, floor(numPairs / 2))` |
| RN-05 | In Seeded mode with tables of different sizes, `min(|A|, |B|)` pairs are used |
| RN-06 | History is read-only — tournaments cannot be edited or deleted; exception: court names can be edited and are automatically persisted |
| RN-07 | Each tournament has a unique UUID generated at the time of creation |
| RN-08 | A tournament with N pairs has exactly N−1 rounds (complete round-robin) |
| RN-09 | Each pair plays against every other pair exactly once |
| RN-10 | No pair appears in more than one match per round |

---

## 5. Non-Functional Requirements

### 5.1 Availability and Deployment

| ID | Requirement |
|----|-------------|
| RNF-01 | The application must run entirely in the browser, without a backend |
| RNF-02 | The production deployment must be automatic on each push to `main` (Vercel) |
| RNF-03 | The CI pipeline must run unit and E2E tests on each push and pull request |

### 5.2 Performance

| ID | Requirement |
|----|-------------|
| RNF-04 | Tournament generation must be instantaneous (< 100ms) — pure logic with no I/O |
| RNF-05 | The gzipped JS bundle must not exceed 300 kB |

### 5.3 Usability

| ID | Requirement |
|----|-------------|
| RNF-06 | The application must be fully usable on a smartphone (primary use case) |
| RNF-07 | The complete flow (enter players → generate → view results) must be completable in less than 60 seconds |
| RNF-08 | Text inputs must have `font-size` ≥ 16px on mobile to prevent automatic zoom on iOS |

### 5.4 Accessibility (WCAG 2.1 AA)

| ID | Requirement |
|----|-------------|
| RNF-09 | All form labels must be associated with inputs via `htmlFor`/`id` |
| RNF-10 | Dynamic messages must use `role="alert"` or `role="status"` with `aria-live` |
| RNF-11 | Decorative icons must have `aria-hidden="true"` |
| RNF-12 | All interactive elements must have an adequate minimum touch target area |
| RNF-13 | Text contrast: minimum 4.5:1 for normal text (WCAG AA) |
| RNF-14 | Keyboard navigation must be possible throughout the entire application |

### 5.5 Code Quality

| ID | Requirement |
|----|-------------|
| RNF-15 | Unit test coverage ≥ 90% of lines and functions in the `src/utils/` and `src/hooks/useHistory.ts` layers |
| RNF-16 | Branch coverage ≥ 80% in the same layers |
| RNF-17 | TypeScript build with no compilation errors |

---

## 6. Data Model

### 6.1 Main Types

```typescript
type GameMode = 'regular' | 'fixed-pairs' | 'seeded'

type Pair = [string, string]           // exactly 2 players

type Match = {
  pair1: Pair
  pair2: Pair
  court: number                        // >= 1
}

type Round = {
  number: number                       // >= 1, sequential
  matches: Match[]
}

type Tournament = {
  id: string                           // UUID (nanoid)
  date: string                         // ISO 8601, generated at creation time
  clubName: string                     // can be empty
  mode: GameMode
  courts: number                       // >= 1
  players: string[]                    // Regular: entered players; empty in other modes
  pairs: Pair[]                        // all modes: final generated pairs
  tableA?: string[]                    // Seeded: original Table A
  tableB?: string[]                    // Seeded: original Table B
  rounds: Round[]
  seededWarning?: boolean              // true if |tableA| ≠ |tableB|
  courtNames?: Record<number, string>  // custom names by court number
}
```

### 6.2 Application State

```typescript
type AppState = {
  mode: GameMode
  courts: number                       // calculated automatically
  clubName: string
  players: string[]                    // Regular mode
  pairs: Pair[]                        // Fixed Pairs mode
  tableA: string[]                     // Seeded mode
  tableB: string[]                     // Seeded mode
  generated: Tournament | null         // last generated tournament
}
```

### 6.3 Persistence

| localStorage key | Type | Description |
|------------------|------|-------------|
| `padel-history` | `Tournament[]` (JSON) | Tournament history, descending order |
| `padel-theme` | `'dark' \| 'light'` | Dark mode preference |

### 6.4 Court Calculation (derived)

The `courts` field in `AppState` is always calculated automatically by the reducer from the inputs:

| Mode | Formula |
|------|---------|
| Regular | `max(1, floor(players.length / 2))` → converts players to pairs first |
| Fixed Pairs | `max(1, floor(pairs.length / 2))` |
| Seeded | `max(1, floor(min(tableA.length, tableB.length) / 2))` |

---

## 7. Algorithms

### 7.1 Pair Generation — Regular mode

```
1. shuffle(players)           → Fisher-Yates on a copy
2. Group into pairs: [[p0,p1], [p2,p3], ...]
```

### 7.2 Pair Generation — Seeded mode

```
1. shuffledA = shuffle(tableA)
2. shuffledB = shuffle(tableB)
3. n = min(|shuffledA|, |shuffledB|)
4. pairs = [[shuffledA[0], shuffledB[0]], ..., [shuffledA[n-1], shuffledB[n-1]]]
5. If |tableA| ≠ |tableB|: seededWarning = true
```

### 7.3 Round-Robin

Implementation of the circular rotation algorithm for N pairs:

```
For i = 0 to N-2:
  Fix pair[0], rotate the remaining N-1 one position
  Generate matches: [pair[0] vs pair[N-1]], [pair[1] vs pair[N-2]], ...
Result: N-1 rounds, each pair plays against every other exactly once
```

### 7.4 Court Assignment

```
For each round, for each match (index i):
  court = (i % courts) + 1
```

---

## 8. UI Specification

### 8.1 Routes

| Route | Component | Description |
|-------|-----------|-------------|
| `/` | `GeneratorPage` | Form + results panel |
| `/history` | `HistoryPage` | List of saved tournaments |
| `/history/:id` | `TournamentDetailPage` | Tournament detail in read-only mode |

### 8.2 Layout — GeneratorPage

**Desktop (≥ 1024px):** two panels side by side
- Left panel (fixed, 384px): form
- Right panel (flex-1): results

**Mobile (< 1024px):** single column
- Form at the top
- Results below (automatic scroll after generation)

**Print:** results panel only

### 8.3 Component Hierarchy

```
App
└── Shell
    ├── Header (sticky, print:hidden)
    │   ├── Logo/link "Padel Generator"
    │   ├── NavLink "New Tournament" (/)
    │   ├── NavLink "History" (/history)
    │   └── DarkModeToggle
    └── main
        ├── GeneratorPage (/)
        │   ├── [form panel — print:hidden]
        │   │   ├── tournament-name input
        │   │   ├── ModeSelector (tablist)
        │   │   ├── PlayerInput | PairInput | SeededInput
        │   │   ├── courts preview
        │   │   ├── ValidationBanner
        │   │   ├── stale warning
        │   │   ├── success banner
        │   │   └── "Generate Tournament" button
        │   └── [rounds panel]
        │       ├── PrintButton (print:hidden)
        │       └── RoundsPanel
        │           └── RoundCard[]
        │               └── MatchCard[]
        ├── HistoryPage (/history)
        │   └── HistoryList
        │       └── HistoryEntry[]
        └── TournamentDetailPage (/history/:id)
            ├── "← History" link (print:hidden)
            ├── PrintButton (print:hidden)
            └── RoundsPanel
```

### 8.4 UI States

| Component | States |
|-----------|--------|
| "Generate Tournament" button | enabled / disabled (errors present) |
| ValidationBanner | hidden / errors / warnings |
| Success banner | visible for 3s after generation / hidden |
| Stale warning | visible (generated + inputs changed + hasInputs) / hidden |
| Results panel | empty (message) / with tournament |
| ClearButton | normal / inline confirmation |
| HistoryList | empty / with entries |

### 8.5 data-testid Conventions

All interactive elements and output containers use `data-testid`. CSS classes are not used as selectors in tests.

| data-testid | Element |
|-------------|---------|
| `club-name-input` | Tournament name input |
| `mode-regular` / `mode-fixed-pairs` / `mode-seeded` | ModeSelector tabs |
| `player-input` | Players textarea |
| `pair-input` | Pairs textarea |
| `table-a-input` / `table-b-input` | Seeded mode textareas |
| `validation-error` / `validation-warning` | Validation messages |
| `generate-button` | Generate button |
| `success-banner` | Success message |
| `rounds-panel` / `rounds-empty` | Results panel |
| `round-{N}` | Round N card |
| `match-card` | Match card |
| `print-button` | Print button |
| `history-list` / `history-empty` | History list |
| `history-entry-{id}` | History entry |
| `tournament-not-found` | Tournament not found message |
| `seeded-warning` | Different-size tables warning |
| `dark-mode-toggle` | Dark mode toggle |

---

## 9. Test Specification

### 9.1 Unit Tests (Vitest + jsdom)

**Location:** `tests/unit/`

| File | Coverage |
|------|----------|
| `gameLogic.test.ts` | `shuffle`, `makePairs`, `makeSeededPairs`, `roundRobin`, `distribute`, `generateTournament`, `generateId` |
| `validation.test.ts` | All modes, all error and warning cases |
| `history.test.ts` | `getAll`, `save`, `getById`, `update`, corrupted data |

**Coverage thresholds** (applied to `src/utils/` and `src/hooks/useHistory.ts`):

| Metric | Minimum |
|--------|---------|
| Lines | 90% |
| Functions | 90% |
| Branches | 80% |

### 9.2 E2E Tests (Playwright + Chromium)

**Location:** `tests/e2e/`

| File | Scenarios |
|------|-----------|
| `regular.spec.ts` | Generate with 8 players, validation < 4, non-multiple-of-4 validation, save to history, link to detail |
| `fixed-pairs.spec.ts` | Generate with 4 pairs, validation < 2 pairs, add/remove pairs |
| `seeded.spec.ts` | Equal tables, different-size tables warning, minimum validation |

**Configuration:**
- `context.addInitScript(() => localStorage.clear())` in each `beforeEach` for isolation
- Tests navigate between routes via SPA navigation (not `page.goto()`) to preserve `localStorage` state; a `navigateToHistory()` helper opens the hamburger drawer on mobile viewports before clicking history links
- Screenshots on failure, traces on first retry
- Artifacts published as GitHub Actions artifacts

### 9.3 Test Report

- Allure Report published to GitHub Pages after each push to `main`
- URL: https://brandaopj.github.io/padel-generator

---

## 10. Architecture and Technical Decisions

### 10.1 Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | React | 19 |
| Language | TypeScript | — |
| Build | Vite | 8 |
| Routing | React Router | v7 |
| State | Context + useReducer | (no external library) |
| Styles | Tailwind CSS + semantic token system | v4 |
| Icons | Lucide React | — |
| Monitoring | Sentry (`@sentry/react`) | v8 |
| Unit tests | Vitest + jsdom | 4 |
| E2E tests | Playwright (Desktop Chrome, Mobile Chrome, Mobile Safari) | — |
| Reports | Allure | — |
| CI/CD | GitHub Actions + Vercel | — |

### 10.2 State Management

`AppContext` with `useReducer` manages the global application state. The reducer calculates `courts` automatically on every input action, maintaining consistency without logic in the components.

Reducer actions:

| Action | Effect |
|--------|--------|
| `SET_MODE` | Changes mode; clears `generated`; preserves all inputs |
| `SET_CLUB_NAME` | Updates tournament name |
| `SET_PLAYERS` | Updates players; recalculates `courts` |
| `SET_PAIRS` | Updates pairs; recalculates `courts` |
| `SET_TABLE_A` | Updates Table A; recalculates `courts` |
| `SET_TABLE_B` | Updates Table B; recalculates `courts` |
| `SET_GENERATED` | Saves generated tournament to state |
| `SET_COURT_NAME` | Updates a court's custom name in the generated tournament |
| `RESET` | Returns to initial state |

### 10.3 Persistence

`useHistory` is a hook that encapsulates operations on `localStorage`. Reading uses `useState(() => getAll())` (lazy init) to avoid extra renders. Writing is synchronous at generation time. The `update()` function patches an existing entry by id (used when court names are edited).

### 10.4 Monitoring

Sentry is initialised conditionally in `main.tsx` — only when `VITE_SENTRY_DSN` is defined. A global `ErrorBoundary` captures React rendering errors and reports them to Sentry. In development or without a DSN, the app runs normally.

### 10.5 CI/CD Pipeline

```
push/PR → main
│
├── unit-tests
│   └── vitest run --coverage → artifacts (allure-results, coverage)
│
├── e2e-tests
│   └── build → preview server → playwright test → artifacts
│
├── publish-report [push only, not PRs]
│   └── allure generate → deploy GitHub Pages
│
├── report-failure [push only, only if failed]
│   └── opens/comments issue with label ci-failure
│
└── resolve-failure [push only, only if passed]
    └── closes ci-failure issue if it exists
```

**`main` branch protection:** merge requires `unit-tests` and `e2e-tests` to be green. Direct push is blocked.

**Dependencies:** Dependabot opens weekly PRs for npm updates. `publish-report` is skipped on PRs to avoid conflict with GitHub Pages environment protection.

---

## 11. Out of Scope

The following requirements are explicitly out of the current scope:

- Authentication or user accounts
- Backend or remote database
- Editing tournaments in history (court names are the only editable field post-generation)
- Export to PDF, CSV, or other formats
- Sharing tournaments between devices (share copies text to clipboard / Web Share API; no server sync)
- Recording match results within the application
- Player management (persistent database)
- Real-time or collaborative features
- Additional languages beyond Portuguese and English
