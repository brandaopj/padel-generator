# Especificação de Software — Padel Generator

**Versão:** 1.0  
**Data:** 2026-05-15  
**Estado:** Produção  
**App:** https://padel-generator-three.vercel.app  
**Repositório:** https://github.com/brandaopj/padel-generator

---

## Índice

1. [Visão Geral](#1-visão-geral)
2. [Actores e Contexto de Uso](#2-actores-e-contexto-de-uso)
3. [Requisitos Funcionais](#3-requisitos-funcionais)
4. [Regras de Negócio](#4-regras-de-negócio)
5. [Requisitos Não Funcionais](#5-requisitos-não-funcionais)
6. [Modelo de Dados](#6-modelo-de-dados)
7. [Algoritmos](#7-algoritmos)
8. [Especificação de UI](#8-especificação-de-ui)
9. [Especificação de Testes](#9-especificação-de-testes)
10. [Arquitectura e Decisões Técnicas](#10-arquitectura-e-decisões-técnicas)
11. [Fora de Âmbito](#11-fora-de-âmbito)

---

## 1. Visão Geral

### 1.1 Propósito

O **Padel Generator** é uma aplicação web para geração de calendários de torneios de padel. O organizador insere os participantes, selecciona o modo de jogo, e a aplicação gera automaticamente um calendário round-robin com distribuição por campos, pronto a ser impresso ou consultado no ecrã.

### 1.2 Âmbito

A aplicação é client-side na totalidade. Não existe backend, autenticação, nem base de dados remota. A persistência limita-se ao histórico de torneios guardado em `localStorage` no dispositivo do utilizador.

### 1.3 Contexto de Uso

O caso de uso primário é um organizador de torneio a usar um smartphone no campo de padel imediatamente antes ou durante uma sessão. O fluxo típico dura menos de 60 segundos: inserir nomes (paste de lista de WhatsApp), gerar, imprimir ou mostrar no ecrã.

---

## 2. Actores e Contexto de Uso

### 2.1 Actores

| Actor | Descrição |
|-------|-----------|
| **Organizador** | Utilizador único. Cria torneios, consulta histórico, imprime tabelas. Usa principalmente smartphone. |

### 2.2 Casos de Uso Principais

| ID | Caso de Uso | Actor |
|----|-------------|-------|
| CU-01 | Gerar torneio em modo Regular | Organizador |
| CU-02 | Gerar torneio em modo Duplas Fixas | Organizador |
| CU-03 | Gerar torneio em modo Cabeças de Série | Organizador |
| CU-04 | Consultar histórico de torneios | Organizador |
| CU-05 | Ver detalhe de torneio passado | Organizador |
| CU-06 | Imprimir tabela de torneio | Organizador |

### 2.3 Fluxo Típico (CU-01)

```
1. Utilizador abre a app
2. Selecciona modo "Regular" (pré-seleccionado por omissão)
3. Insere nome do clube (opcional)
4. Cola lista de jogadores na textarea (um nome por linha)
5. App valida em tempo real e mostra número de campos calculado
6. Utilizador clica "Gerar Torneio"
7. App gera rondas e mostra resultados no painel direito
8. Torneio é automaticamente guardado no histórico
9. Utilizador clica "Imprimir" e entrega folha em campo
```

---

## 3. Requisitos Funcionais

### 3.1 Modos de Jogo

#### RF-01 — Três modos de geração de torneio

O sistema deve suportar exactamente três modos:

| Modo | Label | Descrição |
|------|-------|-----------|
| `regular` | Regular | Duplas sorteadas aleatoriamente a partir de lista de jogadores individuais |
| `fixed-pairs` | Duplas Fixas | Duplas pré-definidas pelo utilizador, usadas tal como estão |
| `seeded` | Cabeças de Série | Tabela A vs Tabela B — cada tabela baralhada independentemente, emparelhamento por posição |

#### RF-02 — Seleção de modo

- O modo activo deve ter indicação visual clara (fundo azul no tab)
- Cada modo deve ter uma descrição sumária visível abaixo do selector para orientar utilizadores novos
- O modo por omissão é `regular`

#### RF-03 — Preservação de dados ao mudar de modo

- Ao mudar de modo, os dados inseridos nos outros modos devem ser preservados em memória
- O utilizador não deve precisar de reinserir dados se seleccionou o modo errado

---

### 3.2 Formulário de Entrada

#### RF-04 — Nome do clube

- Campo de texto opcional
- Se vazio, o torneio é identificado como "Torneio" na visualização de resultados e no histórico

#### RF-05 — Inserção de jogadores (modo Regular)

- Textarea com um jogador por linha
- Deve aceitar paste directo de listas de WhatsApp
- O label deve mostrar o número de jogadores reconhecidos em tempo real: `Jogadores (N)`

#### RF-06 — Inserção de duplas (modo Duplas Fixas)

- Textarea com uma dupla por linha, formato: `Jogador1 / Jogador2`
- O separador é `/` com ou sem espaços
- O label deve mostrar o número de duplas reconhecidas: `Duplas (N)`

#### RF-07 — Inserção de tabelas (modo Cabeças de Série)

- Duas textareas lado a lado: Tabela A e Tabela B
- Um jogador por linha em cada textarea
- Cada label deve mostrar o número de jogadores reconhecidos: `Tabela A (N)` / `Tabela B (N)`

#### RF-08 — Limpar textarea

- Cada textarea deve ter um botão "Apagar tudo" (ou "Apagar") visível apenas quando existem dados
- Ao clicar, deve mostrar uma confirmação inline com dois botões: "Cancelar" e "Apagar"
- Não deve usar `window.confirm` do browser (incompatível com padrões de UX mobile)

#### RF-09 — Cálculo automático de campos

- O número de campos é calculado automaticamente: `max(1, floor(numDuplas / 2))`
- O valor deve ser mostrado em tempo real abaixo dos inputs: `Campos calculados automaticamente: N`
- Só é visível quando o modo activo tem dados inseridos (`hasInputs = true`)
- Não existe campo manual para o utilizador alterar este valor

---

### 3.3 Validação

#### RF-10 — Regras de validação

| Modo | Condição | Tipo | Mensagem |
|------|----------|------|----------|
| Regular | `players.length < 4` | Erro | "Modo Regular requer pelo menos 4 jogadores" |
| Regular | `players.length % 4 !== 0` | Erro | "O número de jogadores deve ser múltiplo de 4 (4, 8, 12…)" |
| Duplas Fixas | `pairs.length < 2` | Erro | "Modo Duplas Fixas requer pelo menos 2 duplas" |
| Cabeças de Série | `tableA.length < 2` | Erro | "A Tabela A requer pelo menos 2 jogadores" |
| Cabeças de Série | `tableB.length < 2` | Erro | "A Tabela B requer pelo menos 2 jogadores" |
| Cabeças de Série | `tableA.length !== tableB.length` (e ambas ≥ 2) | Aviso | "As tabelas têm tamanhos diferentes (A: X, B: Y). Serão usados Z pares." |
| Todos | `courts < 1` | Erro | "É necessário pelo menos 1 campo" |

#### RF-11 — Comportamento das mensagens de validação

- Erros bloqueiam o botão "Gerar Torneio" (fica desactivado)
- Avisos não bloqueiam a geração
- As mensagens só aparecem após o utilizador ter começado a inserir dados no modo activo (`hasInputs = true`)
- Ao mudar de modo sem dados inseridos no novo modo, nenhuma mensagem deve aparecer

---

### 3.4 Geração de Torneio

#### RF-12 — Botão de geração

- Label: "Gerar Torneio"
- Desactivado enquanto existirem erros de validação (`errors.length > 0`)
- Ao clicar com inputs válidos: gera torneio, guarda no histórico, mostra mensagem de sucesso

#### RF-13 — Mensagem de sucesso

- Após geração bem-sucedida, mostrar mensagem "Torneio gerado com sucesso!" durante 3 segundos
- Deve usar `role="status"` e `aria-live="polite"` para ser anunciada por leitores de ecrã

#### RF-14 — Aviso de resultados desactualizados

- Após gerar um torneio, se o utilizador alterar qualquer input (jogadores, duplas, tabelas, modo, nome do clube), deve aparecer um aviso: "Os resultados podem não refletir as alterações atuais."
- O aviso só aparece quando `hasInputs = true` no modo activo (não aparece ao trocar de modo para um sem dados)
- Desaparece ao gerar novamente

#### RF-15 — Scroll automático após geração (mobile)

- Em dispositivos móveis, após gerar, a página deve fazer scroll suave para o painel de resultados
- Deve usar `scrollIntoView({ behavior: 'smooth', block: 'nearest' })` para não afectar layouts desktop onde o painel já é visível

---

### 3.5 Visualização de Resultados

#### RF-16 — Painel de resultados

- Mostra o nome do clube e a data do torneio gerado
- Lista todas as rondas em sequência
- Em ecrã, as rondas mostram também o número de campos e o número de duplas
- Em impressão, apenas o nome do clube e a data são visíveis no cabeçalho

#### RF-17 — Card de jogo (MatchCard)

Cada jogo deve ser apresentado num card com:
- Nome do campo (ex: "Campo 1", editável após geração — ver RF-17a)
- Os dois jogadores de cada dupla com avatar (ícone de silhueta neutra) ao lado de cada nome
- Layout de duas colunas simétricas (`1fr auto 1fr`) com "vs" centrado
- Os nomes devem quebrar linha se forem longos (sem truncagem)
- Área de escrita para o organizador anotar o resultado manualmente

#### RF-17a — Edição do nome do campo

- Após gerar um torneio, o nome de cada campo deve ser editável inline
- Cada card mostra um ícone de lápis (oculto em impressão) junto ao nome do campo
- Ao clicar, o nome torna-se um campo de texto inline; ao sair (blur) ou premir Enter, guarda o nome
- Premir Escape cancela a edição sem guardar
- O nome editado aplica-se a todos os cards do mesmo campo em todas as rondas
- Os nomes editados são persistidos automaticamente no histórico (`localStorage`)
- Em impressão e no detalhe histórico, o nome editado é mostrado em vez de "Campo N"
- Por omissão (sem edição), o nome do campo é "Campo N" onde N é o número sequencial

#### RF-18 — Estado vazio do painel

Enquanto não existe torneio gerado, o painel deve mostrar a mensagem: "Preenche o formulário e clica em Gerar Torneio"

---

### 3.6 Histórico

#### RF-19 — Gravação automática

Cada torneio gerado deve ser guardado automaticamente em `localStorage` sem acção do utilizador.

#### RF-20 — Lista de histórico (`/history`)

- Lista todos os torneios ordenados do mais recente para o mais antigo
- Cada entrada mostra: nome do clube (ou "Sem nome"), modo de jogo, número de campos, número de duplas, data
- Cada entrada é um link para `/history/:id`
- Se o histórico estiver vazio, mostrar: "Nenhum torneio gerado ainda."

#### RF-21 — Detalhe de torneio (`/history/:id`)

- Mostra o torneio em modo de leitura (apenas visualização, sem edição)
- Inclui link de regresso "← Histórico"
- Inclui botão "Imprimir"
- Se o ID não existir no histórico, mostrar: "Torneio não encontrado."

---

### 3.7 Impressão

#### RF-22 — Conteúdo impresso

Em impressão devem estar visíveis apenas:
- Nome do clube e data
- Todas as rondas com os respectivos cards de jogo

Devem estar ocultos: formulário, cabeçalho da app, botão de impressão, avisos de validação, aviso de resultados desactualizados, mensagem de sucesso, metadados de campos/duplas.

#### RF-23 — Formato da página

- Tamanho: A4
- Margens: 2 cm
- Implementado via `@page { size: A4; margin: 2cm }`

#### RF-24 — Layout de impressão

- Cards de jogo em coluna única (largura total da página)
- Padding aumentado nos cards para melhor legibilidade
- Bordas dos cards mais visíveis em impressão

#### RF-25 — Área de resultado

- Cada card deve ter uma linha de escrita para anotação manual do resultado: `Resultado: ___________`

---

### 3.8 Navegação e Aparência

#### RF-26 — Navegação

Header fixo (sticky) com:
- Logo/link "Padel Generator" → `/`
- Link "Novo Torneio" → `/`
- Link "Histórico" → `/history`
- Toggle de dark mode
- Oculto em impressão

#### RF-27 — Dark mode

- Toggle visível no header com ícones ☀️ / 🌙
- Preferência persistida em `localStorage` sob a chave `padel-theme`
- Aplicada automaticamente nas visitas seguintes

---

## 4. Regras de Negócio

| ID | Regra |
|----|-------|
| RN-01 | Um jogo envolve exactamente 4 jogadores: 2 duplas de 2 |
| RN-02 | Todos os jogos de uma ronda ocorrem em simultâneo — não existe lista de espera |
| RN-03 | Em modo Regular, o número de jogadores tem de ser múltiplo de 4 |
| RN-04 | O número de campos é sempre `max(1, floor(numDuplas / 2))` |
| RN-05 | Em modo Cabeças de Série com tabelas de tamanhos diferentes, são usados `min(|A|, |B|)` pares |
| RN-06 | O histórico é de leitura — não é possível editar ou apagar torneios; excepção: o nome dos campos pode ser editado e é persistido automaticamente |
| RN-07 | Cada torneio tem um UUID único gerado no momento da criação |
| RN-08 | Um torneio com N duplas tem exactamente N−1 rondas (round-robin completo) |
| RN-09 | Cada dupla joga contra todas as outras exactamente uma vez |
| RN-10 | Nenhuma dupla aparece em mais do que um jogo por ronda |

---

## 5. Requisitos Não Funcionais

### 5.1 Disponibilidade e Deploy

| ID | Requisito |
|----|-----------|
| RNF-01 | A aplicação deve funcionar inteiramente no browser, sem backend |
| RNF-02 | O deploy em produção deve ser automático em cada push para `main` (Vercel) |
| RNF-03 | O pipeline de CI deve correr testes unitários e E2E em cada push e pull request |

### 5.2 Performance

| ID | Requisito |
|----|-----------|
| RNF-04 | A geração de torneio deve ser instantânea (< 100ms) — lógica pura sem I/O |
| RNF-05 | O bundle JS gzipado não deve exceder 200KB |

### 5.3 Usabilidade

| ID | Requisito |
|----|-----------|
| RNF-06 | A aplicação deve ser totalmente utilizável em smartphone (caso de uso primário) |
| RNF-07 | O fluxo completo (inserir jogadores → gerar → ver resultados) deve ser executável em menos de 60 segundos |
| RNF-08 | Os inputs de texto devem ter `font-size` ≥ 16px em mobile para evitar zoom automático no iOS |

### 5.4 Acessibilidade (WCAG 2.1 AA)

| ID | Requisito |
|----|-----------|
| RNF-09 | Todos os labels de formulário devem estar associados aos inputs via `htmlFor`/`id` |
| RNF-10 | Mensagens dinâmicas devem usar `role="alert"` ou `role="status"` com `aria-live` |
| RNF-11 | Ícones decorativos devem ter `aria-hidden="true"` |
| RNF-12 | Todos os elementos interactivos devem ter área de toque mínima adequada |
| RNF-13 | Contraste de texto: mínimo 4.5:1 para texto normal (WCAG AA) |
| RNF-14 | Navegação por teclado deve ser possível em toda a aplicação |

### 5.5 Qualidade de Código

| ID | Requisito |
|----|-----------|
| RNF-15 | Cobertura de testes unitários ≥ 90% de linhas e funções nas camadas `src/utils/` e `src/hooks/useHistory.ts` |
| RNF-16 | Cobertura de branches ≥ 80% nas mesmas camadas |
| RNF-17 | Build TypeScript sem erros de compilação |

---

## 6. Modelo de Dados

### 6.1 Tipos Principais

```typescript
type GameMode = 'regular' | 'fixed-pairs' | 'seeded'

type Pair = [string, string]           // exactamente 2 jogadores

type Match = {
  pair1: Pair
  pair2: Pair
  court: number                        // >= 1
}

type Round = {
  number: number                       // >= 1, sequencial
  matches: Match[]
}

type Tournament = {
  id: string                           // UUID (nanoid)
  date: string                         // ISO 8601, gerado no momento
  clubName: string                     // pode ser vazio
  mode: GameMode
  courts: number                       // >= 1
  players: string[]                    // Regular: jogadores inseridos; vazio noutros modos
  pairs: Pair[]                        // todos os modos: duplas finais geradas
  tableA?: string[]                    // Cabeças de Série: Tabela A original
  tableB?: string[]                    // Cabeças de Série: Tabela B original
  rounds: Round[]
  seededWarning?: boolean              // true se |tableA| ≠ |tableB|
  courtNames?: Record<number, string>  // nomes personalizados por número de campo
}
```

### 6.2 Estado da Aplicação

```typescript
type AppState = {
  mode: GameMode
  courts: number                       // calculado automaticamente
  clubName: string
  players: string[]                    // modo Regular
  pairs: Pair[]                        // modo Duplas Fixas
  tableA: string[]                     // modo Cabeças de Série
  tableB: string[]                     // modo Cabeças de Série
  generated: Tournament | null         // último torneio gerado
}
```

### 6.3 Persistência

| Chave localStorage | Tipo | Descrição |
|--------------------|------|-----------|
| `padel-history` | `Tournament[]` (JSON) | Histórico de torneios, ordem decrescente |
| `padel-theme` | `'dark' \| 'light'` | Preferência de dark mode |

### 6.4 Cálculo de Campos (derivado)

O campo `courts` em `AppState` é sempre calculado automaticamente pelo reducer a partir dos inputs:

| Modo | Fórmula |
|------|---------|
| Regular | `max(1, floor(players.length / 2))` → converte jogadores em duplas primeiro |
| Duplas Fixas | `max(1, floor(pairs.length / 2))` |
| Cabeças de Série | `max(1, floor(min(tableA.length, tableB.length) / 2))` |

---

## 7. Algoritmos

### 7.1 Geração de Duplas — modo Regular

```
1. shuffle(players)           → Fisher-Yates sobre cópia
2. Agrupar em pares: [[p0,p1], [p2,p3], ...]
```

### 7.2 Geração de Duplas — modo Cabeças de Série

```
1. shuffledA = shuffle(tableA)
2. shuffledB = shuffle(tableB)
3. n = min(|shuffledA|, |shuffledB|)
4. pairs = [[shuffledA[0], shuffledB[0]], ..., [shuffledA[n-1], shuffledB[n-1]]]
5. Se |tableA| ≠ |tableB|: seededWarning = true
```

### 7.3 Round-Robin

Implementação do algoritmo de rotação circular para N duplas:

```
Para i = 0 até N-2:
  Fixar dupla[0], rodar as restantes N-1 uma posição
  Gerar matches: [dupla[0] vs dupla[N-1]], [dupla[1] vs dupla[N-2]], ...
Resultado: N-1 rondas, cada dupla joga contra todas as outras exactamente uma vez
```

### 7.4 Distribuição por Campos

```
Para cada ronda, para cada match (índice i):
  court = (i % courts) + 1
```

---

## 8. Especificação de UI

### 8.1 Rotas

| Rota | Componente | Descrição |
|------|------------|-----------|
| `/` | `GeneratorPage` | Formulário + painel de resultados |
| `/history` | `HistoryPage` | Lista de torneios guardados |
| `/history/:id` | `TournamentDetailPage` | Detalhe de torneio em leitura |

### 8.2 Layout — GeneratorPage

**Desktop (≥ 1024px):** dois painéis lado a lado  
- Painel esquerdo (fixo, 384px): formulário  
- Painel direito (flex-1): resultados  

**Mobile (< 1024px):** coluna única  
- Formulário no topo  
- Resultados abaixo (scroll automático após geração)

**Impressão:** apenas o painel de resultados

### 8.3 Hierarquia de Componentes

```
App
└── Shell
    ├── Header (sticky, print:hidden)
    │   ├── Logo/link "Padel Generator"
    │   ├── NavLink "Novo Torneio" (/)
    │   ├── NavLink "Histórico" (/history)
    │   └── DarkModeToggle
    └── main
        ├── GeneratorPage (/)
        │   ├── [form panel — print:hidden]
        │   │   ├── club-name input
        │   │   ├── ModeSelector (tablist)
        │   │   ├── PlayerInput | PairInput | SeededInput
        │   │   ├── courts preview
        │   │   ├── ValidationBanner
        │   │   ├── stale warning
        │   │   ├── success banner
        │   │   └── "Gerar Torneio" button
        │   └── [rounds panel]
        │       ├── PrintButton (print:hidden)
        │       └── RoundsPanel
        │           └── RoundCard[]
        │               └── MatchCard[]
        ├── HistoryPage (/history)
        │   └── HistoryList
        │       └── HistoryEntry[]
        └── TournamentDetailPage (/history/:id)
            ├── "← Histórico" link (print:hidden)
            ├── PrintButton (print:hidden)
            └── RoundsPanel
```

### 8.4 Estados de UI

| Componente | Estados |
|------------|---------|
| Botão "Gerar Torneio" | enabled / disabled (erros presentes) |
| ValidationBanner | oculto / erros / avisos |
| Success banner | visível 3s após geração / oculto |
| Stale warning | visível (gerado + inputs alterados + hasInputs) / oculto |
| Painel de resultados | vazio (mensagem) / com torneio |
| ClearButton | normal / confirmação inline |
| HistoryList | vazio / com entradas |

### 8.5 Convenções de data-testid

Todos os elementos interactivos e contêineres de output usam `data-testid`. Não são usadas classes CSS como selectores em testes.

| data-testid | Elemento |
|-------------|---------|
| `club-name-input` | Input do nome do clube |
| `mode-regular` / `mode-fixed-pairs` / `mode-seeded` | Tabs do ModeSelector |
| `player-input` | Textarea de jogadores |
| `pair-input` | Textarea de duplas |
| `table-a-input` / `table-b-input` | Textareas Cabeças de Série |
| `validation-error` / `validation-warning` | Mensagens de validação |
| `generate-button` | Botão de geração |
| `success-banner` | Mensagem de sucesso |
| `rounds-panel` / `rounds-empty` | Painel de resultados |
| `round-{N}` | Card de ronda N |
| `match-card` | Card de jogo |
| `print-button` | Botão de impressão |
| `history-list` / `history-empty` | Lista de histórico |
| `history-entry-{id}` | Entrada de histórico |
| `tournament-not-found` | Mensagem de torneio não encontrado |
| `seeded-warning` | Aviso de tabelas com tamanhos diferentes |
| `dark-mode-toggle` | Toggle de dark mode |

---

## 9. Especificação de Testes

### 9.1 Testes Unitários (Vitest + jsdom)

**Localização:** `tests/unit/`

| Ficheiro | Cobertura |
|----------|-----------|
| `gameLogic.test.ts` | `shuffle`, `makePairs`, `makeSeededPairs`, `roundRobin`, `distribute`, `generateTournament`, `generateId` |
| `validation.test.ts` | Todos os modos, todos os casos de erro e aviso |
| `history.test.ts` | `getAll`, `save`, `getById`, dados corrompidos |

**Thresholds de cobertura** (aplicados a `src/utils/` e `src/hooks/useHistory.ts`):

| Métrica | Mínimo |
|---------|--------|
| Lines | 90% |
| Functions | 90% |
| Branches | 80% |

### 9.2 Testes E2E (Playwright + Chromium)

**Localização:** `tests/e2e/`

| Ficheiro | Cenários |
|----------|----------|
| `regular.spec.ts` | Gerar com 8 jogadores, validação < 4, validação não-múltiplo-4, guardar no histórico, link para detalhe |
| `fixed-pairs.spec.ts` | Gerar com 4 duplas, validação < 2 duplas, adicionar/remover duplas |
| `seeded.spec.ts` | Tabelas iguais, aviso tabelas diferentes, validação mínima |

**Configuração:**
- `context.addInitScript(() => localStorage.clear())` em cada `beforeEach` para isolamento
- Screenshots em falha, traces no primeiro retry
- Artifacts publicados como GitHub Actions artifacts

### 9.3 Relatório de Testes

- Allure Report publicado em GitHub Pages após cada push para `main`
- URL: https://brandaopj.github.io/padel-generator

---

## 10. Arquitectura e Decisões Técnicas

### 10.1 Stack

| Camada | Tecnologia | Versão |
|--------|------------|--------|
| Framework | React | 19 |
| Linguagem | TypeScript | — |
| Build | Vite | 8 |
| Routing | React Router | v7 |
| Estado | Context + useReducer | (sem biblioteca externa) |
| Estilos | Tailwind CSS | v4 |
| Monitoring | Sentry (`@sentry/react`) | v8 |
| Testes unitários | Vitest + jsdom | 4 |
| Testes E2E | Playwright + Chromium | — |
| Relatórios | Allure | — |
| CI/CD | GitHub Actions + Vercel | — |

### 10.2 Gestão de Estado

`AppContext` com `useReducer` gere o estado global da aplicação. O reducer calcula `courts` automaticamente em cada acção de input, mantendo consistência sem lógica nos componentes.

Acções do reducer:

| Acção | Efeito |
|-------|--------|
| `SET_MODE` | Muda modo; limpa `generated`; preserva todos os inputs |
| `SET_CLUB_NAME` | Actualiza nome do clube |
| `SET_PLAYERS` | Actualiza jogadores; recalcula `courts` |
| `SET_PAIRS` | Actualiza duplas; recalcula `courts` |
| `SET_TABLE_A` | Actualiza Tabela A; recalcula `courts` |
| `SET_TABLE_B` | Actualiza Tabela B; recalcula `courts` |
| `SET_GENERATED` | Guarda torneio gerado em estado |
| `RESET` | Volta ao estado inicial |

### 10.3 Persistência

`useHistory` é um hook que encapsula operações em `localStorage`. Leitura com `useState(() => getAll())` (lazy init) para evitar renders extra. Escrita síncrona na geração.

### 10.4 Monitorização

Sentry inicializado condicionalmente em `main.tsx` — apenas quando `VITE_SENTRY_DSN` está definido. `ErrorBoundary` global captura erros de renderização React e reporta para Sentry. Em desenvolvimento ou sem DSN, a app funciona normalmente.

### 10.5 Pipeline CI/CD

```
push/PR → main
│
├── unit-tests
│   └── vitest run --coverage → artifacts (allure-results, coverage)
│
├── e2e-tests
│   └── build → preview server → playwright test → artifacts
│
├── publish-report [apenas push, não PRs]
│   └── allure generate → deploy GitHub Pages
│
├── report-failure [apenas push, apenas se falhou]
│   └── abre/comenta issue com label ci-failure
│
└── resolve-failure [apenas push, apenas se passou]
    └── fecha issue ci-failure se existir
```

**Protecção de branch `main`:** merge requer `unit-tests` e `e2e-tests` verdes. Push directo bloqueado.

**Dependências:** Dependabot abre PRs semanais para actualizações npm. `publish-report` é skipped em PRs para evitar conflito com environment protection do GitHub Pages.

---

## 11. Fora de Âmbito

Os seguintes requisitos estão explicitamente fora do âmbito actual:

- Autenticação ou contas de utilizador
- Backend ou base de dados remota
- Edição ou eliminação de torneios no histórico
- Exportação para PDF, CSV ou outros formatos
- Partilha de torneios entre dispositivos
- Registo de resultados de jogos na aplicação
- Gestão de jogadores (base de dados persistente)
- Notificações ou funcionalidades em tempo real
- Suporte offline (PWA / service worker)
- Internacionalização (a app está em Português)
