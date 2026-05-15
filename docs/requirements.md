# Requisitos Funcionais — Padel Generator

**Versão:** 1.0  
**Data:** 2026-05-15  
**App:** https://padel-generator-three.vercel.app

---

## 1. Âmbito

Aplicação web client-side para geração de calendários de torneios de padel. Permite ao organizador inserir jogadores ou duplas, gerar rondas com distribuição automática por campos, consultar histórico de torneios passados e imprimir a tabela para uso em campo.

Não existe backend nem autenticação. Toda a persistência é feita em `localStorage` no dispositivo do utilizador.

---

## 2. Actores

| Actor | Descrição |
|-------|-----------|
| **Organizador** | Utilizador que cria e gere o torneio. Uso principal em smartphone no campo de padel. |

---

## 3. Módulos

| ID | Módulo |
|----|--------|
| M1 | Gerador de torneio |
| M2 | Histórico |
| M3 | Detalhe de torneio |
| M4 | Impressão |

---

## 4. Requisitos Funcionais

### M1 — Gerador de torneio

#### RF-01 Modos de jogo
O sistema deve suportar três modos de geração de torneio:

| Modo | Identificador | Descrição |
|------|---------------|-----------|
| Regular | `regular` | Duplas sorteadas aleatoriamente a partir de uma lista de jogadores individuais |
| Duplas Fixas | `fixed-pairs` | Duplas pré-definidas pelo utilizador; os pares não mudam entre rondas |
| Cabeças de Série | `seeded` | Tabela A vs Tabela B — cada tabela é baralhada independentemente e os jogadores são emparelhados por posição |

#### RF-02 Seleção de modo
O utilizador deve poder selecionar o modo de jogo através de um selector de tabs. O modo activo deve ter indicação visual clara. Cada tab deve mostrar uma descrição sumária do modo para orientar utilizadores novos.

#### RF-03 Preservação de dados ao mudar de modo
Ao mudar de modo, os dados introduzidos nos outros modos devem ser preservados em memória. O utilizador não deve precisar de reinserir dados se seleccionou o modo errado.

#### RF-04 Nome do clube
O utilizador deve poder introduzir o nome do clube. Este campo é opcional. Se não preenchido, o torneio é identificado como "Torneio" na visualização.

#### RF-05 Inserção de jogadores (modo Regular)
O utilizador deve poder inserir a lista de jogadores através de uma textarea, um nome por linha. A textarea deve aceitar paste directo de listas do WhatsApp.

#### RF-06 Inserção de duplas (modo Duplas Fixas)
O utilizador deve poder inserir as duplas através de uma textarea, uma dupla por linha, no formato `Jogador1 / Jogador2`.

#### RF-07 Inserção de tabelas (modo Cabeças de Série)
O utilizador deve poder inserir dois grupos de jogadores (Tabela A e Tabela B) em textareas separadas, um nome por linha.

#### RF-08 Limpar textarea
Cada textarea deve ter um botão "Apagar tudo" que limpa todo o conteúdo. Antes de apagar, o sistema deve pedir confirmação ao utilizador através de um diálogo inline (sem usar `window.confirm` do browser).

#### RF-09 Cálculo automático de campos
O número de campos deve ser calculado automaticamente a partir do número de duplas, pela fórmula `max(1, floor(numDuplas / 2))`. O valor calculado deve ser mostrado em tempo real conforme o utilizador insere nomes. O utilizador não deve poder alterar este valor manualmente.

#### RF-10 Validação de inputs

| Modo | Regra | Tipo | Mensagem |
|------|-------|------|----------|
| Regular | Mínimo 4 jogadores | Erro (bloqueia geração) | "Modo Regular requer pelo menos 4 jogadores" |
| Regular | Número de jogadores múltiplo de 4 | Erro (bloqueia geração) | "O número de jogadores deve ser múltiplo de 4 (4, 8, 12…)" |
| Duplas Fixas | Mínimo 2 duplas | Erro (bloqueia geração) | "Modo Duplas Fixas requer pelo menos 2 duplas" |
| Cabeças de Série | Mínimo 2 jogadores na Tabela A | Erro (bloqueia geração) | "A Tabela A requer pelo menos 2 jogadores" |
| Cabeças de Série | Mínimo 2 jogadores na Tabela B | Erro (bloqueia geração) | "A Tabela B requer pelo menos 2 jogadores" |
| Cabeças de Série | Tabelas com tamanhos diferentes | Aviso (não bloqueia) | Informa quantos pares serão usados |
| Todos | Mínimo 1 campo | Erro (bloqueia geração) | "É necessário pelo menos 1 campo" |

As mensagens de validação só devem aparecer após o utilizador começar a inserir dados no modo activo. Não devem aparecer imediatamente ao carregar a página ou ao mudar de modo sem dados.

#### RF-11 Botão de geração
O botão "Gerar Torneio" deve estar desactivado enquanto existirem erros de validação. Ao ser clicado com inputs válidos, deve gerar o torneio e mostrar uma mensagem de confirmação de sucesso por 3 segundos.

#### RF-12 Aviso de resultados desactualizados
Após gerar um torneio, se o utilizador alterar qualquer input (jogadores, modo, nome do clube), deve aparecer um aviso a indicar que os resultados apresentados podem não reflectir as alterações. Este aviso só deve aparecer se o modo activo tiver dados introduzidos. Desaparece ao gerar novamente.

#### RF-13 Algoritmo de geração — modo Regular
1. Baralhar a lista de jogadores (Fisher-Yates)
2. Agrupar em duplas consecutivas: `[j0,j1]`, `[j2,j3]`, etc.
3. Aplicar algoritmo round-robin sobre as duplas
4. Distribuir os jogos pelos campos disponíveis

#### RF-14 Algoritmo de geração — modo Duplas Fixas
1. Usar as duplas tal como definidas pelo utilizador
2. Aplicar algoritmo round-robin
3. Distribuir pelos campos

#### RF-15 Algoritmo de geração — modo Cabeças de Série
1. Baralhar a Tabela A independentemente
2. Baralhar a Tabela B independentemente
3. Emparelhar por posição: `[A[0],B[0]]`, `[A[1],B[1]]`, etc.
4. Se as tabelas tiverem tamanhos diferentes, usar os primeiros `min(|A|,|B|)` pares
5. Aplicar algoritmo round-robin
6. Distribuir pelos campos

#### RF-16 Algoritmo round-robin
Cada dupla deve jogar contra todas as outras duplas exactamente uma vez. Todos os jogos de uma ronda devem ocorrer em simultâneo (sem lista de espera). O número de rondas é `N-1` para `N` duplas.

#### RF-17 Distribuição por campos
Os jogos de cada ronda devem ser distribuídos pelos campos disponíveis de forma cíclica (campo 1, campo 2, …, campo N, campo 1, …).

#### RF-18 Scroll automático após geração (mobile)
Após gerar um torneio em dispositivo móvel, a página deve fazer scroll suave para o painel de resultados.

#### RF-19 Persistência do torneio no histórico
Cada torneio gerado deve ser guardado automaticamente no histórico (`localStorage`) sem necessidade de acção do utilizador.

---

### M2 — Histórico

#### RF-20 Lista de torneios
A página `/history` deve listar todos os torneios gerados, ordenados do mais recente para o mais antigo. Cada entrada deve mostrar: nome do clube, modo de jogo, número de campos, número de duplas e data.

#### RF-21 Estado vazio
Se não existirem torneios no histórico, deve ser apresentada uma mensagem a informar o utilizador.

#### RF-22 Navegação para detalhe
Cada entrada do histórico deve ser um link para `/history/:id`.

---

### M3 — Detalhe de torneio

#### RF-23 Visualização de torneio histórico
A página `/history/:id` deve mostrar as rondas do torneio seleccionado em modo de leitura. Deve incluir o nome do clube, a data e todas as rondas com os respectivos jogos.

#### RF-24 Navegação de regresso
A página de detalhe deve incluir um link de regresso para `/history`.

#### RF-25 Torneio não encontrado
Se o ID não corresponder a nenhum torneio no histórico, deve ser apresentada uma mensagem de erro.

---

### M4 — Impressão

#### RF-26 Conteúdo impresso
Ao imprimir, apenas deve ser visível o painel de resultados: nome do clube, data e rondas com os respectivos jogos. O formulário, o cabeçalho, o botão de impressão e todos os elementos de navegação devem estar ocultos.

#### RF-27 Formato da página impressa
A impressão deve usar formato A4 com margens de 2 cm (`@page { size: A4; margin: 2cm }`).

#### RF-28 Espaço para resultado
Cada card de jogo deve incluir uma área com linha de escrita para o organizador anotar o resultado manualmente em campo.

#### RF-29 Layout de impressão
Em impressão, os cards de jogo devem ocupar a largura total da página (coluna única), independentemente do layout em ecrã.

---

### Geral

#### RF-30 Dark mode
A aplicação deve suportar modo escuro. A preferência do utilizador deve ser persistida em `localStorage` e aplicada nas visitas seguintes.

#### RF-31 Persistência do histórico
O histórico de torneios deve ser persistido em `localStorage` sob a chave `padel-history`. A leitura deve ser tolerante a dados corrompidos (retorna lista vazia em caso de erro de parsing).

#### RF-32 Tratamento de erros global
A aplicação deve ter um error boundary global que captura erros de renderização React, reporta para Sentry (quando configurado) e apresenta ao utilizador um ecrã de erro com opção de recarregar a página.

#### RF-33 Edição de nomes de campos
Após gerar um torneio, o nome de cada campo deve ser editável inline nos cards de jogo. O utilizador clica no ícone de lápis junto ao nome do campo, escreve o nome personalizado (ex: "Padel Lisboa"), e confirma com Enter ou clicando noutro sítio. O nome editado deve ser visível em todos os cards do mesmo campo em todas as rondas, na versão de impressão e no detalhe do histórico. Os nomes editados são persistidos automaticamente no `localStorage`. Por omissão, cada campo é denominado "Campo N".

---

## 5. Regras de Negócio

| ID | Regra |
|----|-------|
| RN-01 | Um jogo envolve exactamente 4 jogadores: 2 duplas de 2 |
| RN-02 | Todos os jogos de uma ronda ocorrem em simultâneo — não existe lista de espera |
| RN-03 | Em modo Regular, o número de jogadores tem de ser múltiplo de 4 |
| RN-04 | O número de campos é sempre `max(1, floor(numDuplas / 2))` |
| RN-05 | Em modo Cabeças de Série, se as tabelas tiverem tamanhos diferentes, são usados `min(\|A\|, \|B\|)` pares e o utilizador é avisado |
| RN-06 | O histórico é apenas para leitura — não é possível editar ou apagar torneios passados; excepção: o nome dos campos pode ser editado inline e é persistido automaticamente |
| RN-07 | Cada torneio é identificado por um UUID gerado no momento da criação |

---

## 6. Requisitos Não Funcionais

| ID | Requisito |
|----|-----------|
| RNF-01 | A aplicação deve funcionar sem backend — toda a lógica é client-side |
| RNF-02 | A aplicação deve ser responsiva e utilizável em smartphone (caso de uso primário) |
| RNF-03 | Os inputs de texto devem ter `font-size` ≥ 16px em mobile para evitar zoom automático no iOS |
| RNF-04 | Todos os labels de formulário devem estar associados aos respectivos inputs via `htmlFor`/`id` |
| RNF-05 | Mensagens dinâmicas (erros, sucesso) devem ter `role="alert"` ou `role="status"` com `aria-live` para leitores de ecrã |
| RNF-06 | Ícones decorativos devem ter `aria-hidden="true"` |
| RNF-07 | A cobertura de testes unitários deve ser ≥ 90% de linhas e funções, ≥ 80% de branches, nas camadas `src/utils/` e `src/hooks/useHistory.ts` |
| RNF-08 | O pipeline de CI deve correr testes unitários e E2E em cada push para `main` e em cada pull request |
| RNF-09 | O deploy em produção (Vercel) deve ser automático em cada push para `main` |

---

## 7. Fora de Âmbito

- Autenticação ou contas de utilizador
- Backend ou base de dados remota
- Edição ou eliminação de torneios no histórico
- Exportação para PDF, CSV ou outros formatos
- Partilha de torneios entre dispositivos
- Registo de resultados de jogos na aplicação
- Gestão de jogadores (base de dados de jogadores persistente)
- Notificações push ou tempo real
