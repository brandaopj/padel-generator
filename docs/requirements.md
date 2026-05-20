# Functional Requirements — Padel Generator

**Version:** 1.1
**Date:** 2026-05-20
**App:** https://padel-generator-three.vercel.app

---

## 1. Scope

A client-side web application for generating padel tournament schedules. It allows the organiser to enter players or pairs, generate rounds with automatic court assignment, consult the history of past tournaments, and print the schedule for use on court.

There is no backend or authentication. All persistence is handled via `localStorage` on the user's device.

---

## 2. Actors

| Actor | Description |
|-------|-------------|
| **Organiser** | User who creates and manages the tournament. Primary use on a smartphone at the padel court. |

---

## 3. Modules

| ID | Module |
|----|--------|
| M1 | Tournament generator |
| M2 | History |
| M3 | Tournament detail |
| M4 | Printing |
| M5 | Localisation |
| M6 | Notifications |
| M7 | Share |

---

## 4. Functional Requirements

### M1 — Tournament Generator

#### RF-01 Game modes
The system must support three tournament generation modes:

| Mode | Identifier | Description |
|------|------------|-------------|
| Regular | `regular` | Pairs drawn randomly from a list of individual players |
| Fixed Pairs | `fixed-pairs` | Pairs pre-defined by the user; partners do not change between rounds |
| Seeded | `seeded` | Table A vs Table B — each table is shuffled independently and players are paired by position |

#### RF-02 Mode selection
The user must be able to select the game mode via a tab selector. The active mode must have a clear visual indicator. Each tab must show a brief description of the mode to guide new users. Each tab must have a minimum touch target height of 44 px (`min-h-[44px]`) to meet mobile usability standards.

#### RF-03 Data preservation when switching modes
When switching modes, data entered in other modes must be preserved in memory. The user must not need to re-enter data if they selected the wrong mode.

#### RF-04 Tournament name
The user must be able to enter the tournament name. This field is optional. If left blank, the tournament is identified as "Tournament" in the view.

#### RF-05 Player entry (Regular mode)
The user must be able to enter the list of players via a textarea, one name per line. The textarea must accept direct paste from WhatsApp lists.

#### RF-06 Pair entry (Fixed Pairs mode)
The user must be able to enter pairs via a textarea, one pair per line, in the format `Player1 / Player2`.

#### RF-07 Table entry (Seeded mode)
The user must be able to enter two groups of players (Table A and Table B) in separate textareas, one name per line.

#### RF-08 Clear textarea
Each textarea must have a "Clear all" button that clears all content. Before clearing, the system must ask for user confirmation via a modal dialog rendered over the full viewport (using `createPortal`), without using the browser's `window.confirm`.

#### RF-09 Automatic court calculation
The number of courts must be calculated automatically from the number of pairs, using the formula `max(1, floor(numPairs / 2))`. The calculated value must be shown in real time as the user enters names. The user must not be able to change this value manually.

#### RF-10 Input validation

| Mode | Rule | Type | Message |
|------|------|------|---------|
| Regular | Minimum 4 players | Error (blocks generation) | "Regular mode requires at least 4 players" |
| Regular | Number of players must be a multiple of 4 | Error (blocks generation) | "The number of players must be a multiple of 4 (4, 8, 12…)" |
| Fixed Pairs | Minimum 2 pairs | Error (blocks generation) | "Fixed Pairs mode requires at least 2 pairs" |
| Seeded | Minimum 2 players in Table A | Error (blocks generation) | "Table A requires at least 2 players" |
| Seeded | Minimum 2 players in Table B | Error (blocks generation) | "Table B requires at least 2 players" |
| Seeded | Tables of different sizes | Warning (does not block) | Informs how many pairs will be used |
| All | Minimum 1 court | Error (blocks generation) | "At least 1 court is required" |

Validation messages must only appear after the user has started entering data in the active mode. They must not appear immediately on page load or when switching modes with no data.

#### RF-11 Generate button
The "Generate Tournament" button must be disabled while validation errors exist. When clicked with valid inputs, it must generate the tournament and display a success confirmation message for 3 seconds.

#### RF-12 Stale results warning
After generating a tournament, if the user changes any input (players, mode, tournament name), a warning must appear indicating that the displayed results may not reflect the changes. This warning must only appear if the active mode has data entered. It disappears upon generating again.

#### RF-13 Generation algorithm — Regular mode
1. Shuffle the list of players (Fisher-Yates)
2. Group into consecutive pairs: `[p0,p1]`, `[p2,p3]`, etc.
3. Apply the round-robin algorithm to the pairs
4. Distribute the matches across the available courts

#### RF-14 Generation algorithm — Fixed Pairs mode
1. Use the pairs as defined by the user
2. Apply the round-robin algorithm
3. Distribute across courts

#### RF-15 Generation algorithm — Seeded mode
1. Shuffle Table A independently
2. Shuffle Table B independently
3. Pair by position: `[A[0],B[0]]`, `[A[1],B[1]]`, etc.
4. If the tables are of different sizes, use the first `min(|A|,|B|)` pairs
5. Apply the round-robin algorithm
6. Distribute across courts

#### RF-16 Round-robin algorithm
Each pair must play against every other pair exactly once. All matches in a round must occur simultaneously (no waiting list). The number of rounds is `N-1` for `N` pairs.

#### RF-17 Court distribution
The matches in each round must be distributed across the available courts in a cyclic manner (court 1, court 2, …, court N, court 1, …).

#### RF-18 Automatic scroll after generation (mobile)
After generating a tournament on a mobile device, the page must smoothly scroll to the results panel using `scrollIntoView({ behavior: 'smooth', block: 'start' })`.

#### RF-19 Tournament persistence in history
Each generated tournament must be saved automatically to the history (`localStorage`) without any action required from the user.

---

### M2 — History

#### RF-20 Tournament list
The `/history` page must list all generated tournaments, ordered from most recent to oldest. Each entry must show: tournament name, game mode, number of courts, number of pairs, and date.

#### RF-37 Delete tournament from history
Each history entry must have a delete button. Clicking it must open a confirmation modal. On confirmation, the tournament must be removed from `localStorage` and a toast notification must be shown.

#### RF-21 Empty state
If no tournaments exist in the history, a message must be displayed informing the user.

#### RF-22 Navigation to detail
Each history entry must be a link to `/history/:id`.

---

### M3 — Tournament Detail

#### RF-23 Historical tournament view
The `/history/:id` page must display the rounds of the selected tournament in read-only mode. It must include the tournament name, the date, and all rounds with their respective matches.

#### RF-24 Back navigation
The detail page must include a back link to `/history`.

#### RF-25 Tournament not found
If the ID does not correspond to any tournament in the history, an error message must be displayed.

---

### M4 — Printing

#### RF-26 Printed content
When printing, only the results panel must be visible: tournament name, date, and rounds with their respective matches. The form, header, print button, and all navigation elements must be hidden.

#### RF-27 Printed page format
Printing must use A4 format with 2 cm margins (`@page { size: A4; margin: 2cm }`).

#### RF-28 Score space
Each match card must include an area with a writing line for the organiser to manually record the result on court.

#### RF-29 Print layout
When printing, match cards must occupy the full page width (single column), regardless of the on-screen layout.

---

### General

---

### M5 — Localisation

#### RF-34 Language selection
The application must support Portuguese (PT) and English (EN). On first visit, the language must be detected from `navigator.language`. The user must be able to switch language via a PT/EN toggle in the header. The selected language must be persisted in `localStorage` under the key `padel-lang` and applied on subsequent visits. All UI strings, validation messages, and notifications must respect the active language.

---

### M6 — Notifications

#### RF-35 Toast notifications
The application must display non-blocking slide-in toast notifications in the bottom-right corner of the viewport. Three variants must be supported: `success` (green, auto-dismiss after 4 s), `info` (blue, auto-dismiss after 2 s), and `error` (red, persistent until dismissed). Toasts must be announced by screen readers via `aria-live`. They must not be visible when printing. The following events must trigger a toast:

| Event | Variant |
|-------|---------|
| Tournament generated | success |
| Court name updated | info |
| Tournament deleted | info |
| Schedule copied to clipboard | success |
| Share or copy error | error |

---

### M7 — Share

#### RF-36 Share tournament
The application must allow the organiser to share the generated schedule. A share button must be present in the generator header (when a tournament is generated), on each history entry, and on the tournament detail page. On devices that support the Web Share API (`navigator.share`), the native share sheet must be invoked with the formatted schedule. On devices without Web Share API support, the formatted schedule must be copied to the clipboard and a success toast must be shown. The formatted text must include the tournament name, round count, match count, and the full list of matches with court names.

---

### General

#### RF-38 Responsive navigation — hamburger menu
Below 1024 px (`lg` breakpoint) the header navigation must collapse into a hamburger (☰) button. Tapping it must toggle a slide-down drawer containing: nav links (New Tournament, History, How It Works), Print and Share buttons (only when a tournament is generated), and the Ko-fi button. The drawer must be dismissed when a link or button inside it is activated. The desktop navigation (logo + full links + Print + Share + Ko-fi) must only be visible at 1024 px and above.

#### RF-39 Bottom navigation bar (mobile)
On the generator page, a fixed bottom navigation bar must be present and visible only below 1024 px (`lg:hidden`). It must contain two scroll shortcut buttons: one that scrolls to the configuration form ("Config") and one that scrolls to the results panel ("Results" / "Torneio"). The page root must have bottom padding (`pb-24 lg:pb-8`) so that content is not obscured by the bar.

#### RF-40 Results panel always visible on mobile
On the generator page, the results panel (EmptyState or RoundsPanel) must always be rendered below the form on mobile — it must not be hidden or require any interaction to appear. The two-column desktop layout (form | results) must apply at 1024 px and above only.

#### RF-41 Sticky generate button on mobile
On mobile and tablet (below 1024 px), the "Generate Tournament" button must be sticky (`sticky bottom-16`) so that it remains visible as the user scrolls through the form. On desktop (`lg`) the button must be in its normal static position.

#### RF-42 Responsive match card sizing
Match cards must adapt their padding, avatar size, and gap to the viewport width: compact on small screens (`p-3`, avatars `w-7 h-7`, gap `gap-2`) and larger on wider screens (`sm:p-5`, avatars `sm:w-8 sm:h-8`, `sm:gap-3`). The score area at the bottom of each card is a visual-only print element and must not be an interactive input.

#### RF-30 Dark mode
The application must support dark mode. The user's preference must be persisted in `localStorage` and applied on subsequent visits.

#### RF-31 History persistence
The tournament history must be persisted in `localStorage` under the key `padel-history`. Reading must be tolerant of corrupted data (returns an empty list in case of a parsing error).

#### RF-32 Global error handling
The application must have a global error boundary that captures React rendering errors, reports to Sentry (when configured), and presents the user with an error screen with an option to reload the page.

#### RF-33 Court name editing
After generating a tournament, the name of each court must be editable inline in the match cards. The user clicks the pencil icon next to the court name, types a custom name (e.g. "Padel Lisboa"), and confirms with Enter or by clicking elsewhere. The edited name must be visible in all cards for the same court across all rounds, in the print version, and in the history detail. Edited names are persisted automatically in `localStorage`. By default, each court is named "Court N".

---

## 5. Business Rules

| ID | Rule |
|----|------|
| RN-01 | A match involves exactly 4 players: 2 pairs of 2 |
| RN-02 | All matches in a round occur simultaneously — there is no waiting list |
| RN-03 | In Regular mode, the number of players must be a multiple of 4 |
| RN-04 | The number of courts is always `max(1, floor(numPairs / 2))` |
| RN-05 | In Seeded mode, if the tables are of different sizes, `min(\|A\|, \|B\|)` pairs are used and the user is warned |
| RN-06 | Tournament results are read-only — match outcomes cannot be edited. Court names can be edited inline and are persisted automatically. Tournaments can be deleted from the history with confirmation. |
| RN-07 | Each tournament is identified by a UUID generated at the moment of creation |

---

## 6. Non-Functional Requirements

| ID | Requirement |
|----|-------------|
| RNF-01 | The application must work without a backend — all logic is client-side |
| RNF-02 | The application must be responsive and usable on a smartphone (primary use case). The breakpoint for collapsing navigation and switching to the single-column layout is 1024 px (`lg`). Interactive touch targets must be at least 44 px tall. |
| RNF-03 | Text inputs must have `font-size` ≥ 16px on mobile to avoid automatic zoom on iOS |
| RNF-04 | All form labels must be associated with their respective inputs via `htmlFor`/`id` |
| RNF-05 | Dynamic messages (errors, success) must have `role="alert"` or `role="status"` with `aria-live` for screen readers |
| RNF-06 | Decorative icons must have `aria-hidden="true"` |
| RNF-07 | Unit test coverage must be ≥ 90% of lines and functions, ≥ 80% of branches, in the `src/utils/` and `src/hooks/useHistory.ts` layers (51 tests) |
| RNF-08 | The CI pipeline must run unit and E2E tests on every push to `main` and on every pull request |
| RNF-09 | The production deployment (Vercel) must be automatic on every push to `main` |
| RNF-10 | The application must send usage events to PostHog (when `VITE_POSTHOG_KEY` is configured) and page view / Web Vitals data to Vercel Analytics (when enabled in the Vercel dashboard). Both integrations must be no-ops when their configuration is absent — the app must work normally without them. The following custom PostHog events must be tracked: `tournament_generated` (properties: `mode`, `rounds`, `matches`, `courts`), `mode_selected` (`mode`), `share_clicked` (`source`: `header` / `drawer` / `history` / `detail`), `example_loaded`, `tournament_deleted`, and `language_changed` (`lang`). |
| RNF-11 | The application must be discoverable by search engines. `index.html` must include a descriptive `<title>`, `<meta name="description">` with relevant keywords, Open Graph tags for social previews (`og:type`, `og:url`, `og:title`, `og:description`, `og:locale`, `og:site_name`), and a `<link rel="canonical">` pointing to the production URL. `public/sitemap.xml` must list the homepage. `public/robots.txt` must allow all crawlers and reference the sitemap. Google Search Console ownership must be verified via a meta tag in `index.html`. |

---

## 7. Out of Scope

- Authentication or user accounts
- Backend or remote database
- Editing tournament results
- Export to PDF, CSV, or other formats
- Sharing tournament data between devices (share exports text only)
- Recording match results in the application
- Player management (persistent player database)
- Push notifications or real-time features
