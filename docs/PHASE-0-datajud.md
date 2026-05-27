# Phase 0 — Integração DataJud (CNJ) ao Clothos Motor API

## Checklist

- [x] **Objective**: O que resolve? Por quê? Resultado esperado?
- [x] **Contexto**: Stack afetada, dependências, integrações necessárias
- [x] **Arquitetura**: Diagrama, fluxo de dados, responsabilidades
- [x] **Contratos de API**: Endpoints, inputs, outputs, erros esperados
- [x] **Modelo de Dados**: Schemas, relacionamentos, constraints
- [x] **Decisões de ADR**: Por que esta abordagem? Alternativas? Tradeoffs?
- [x] **Edge Cases**: Casos limites, restrições, quando NÃO usar
- [x] **Estratégia de Testes**: Unit/integração/e2e, fixtures necessárias
- [x] **Performance**: Estimativas de latência, throughput, limites de escala
- [x] **Segurança**: Validação, autenticação, dados sensíveis

---

## 1. Objective

Adicionar o **DataJud** (API Pública do CNJ — Conselho Nacional de Justiça) como segundo provider de dados judiciais no Clothos Motor API, ao lado do Escavador.

### Resultado esperado

- Router `/api/datajud/*` exposto no Hono com rotas para consulta em qualquer tribunal brasileiro cadastrado no DataJud.
- Cliente HTTP autenticado via Basic Auth com a chave pública do CNJ.
- Suporte à Query DSL do Elasticsearch para buscas flexíveis.
- Auditoria via `rawStore` (MongoDB) para todas as consultas, igual ao Escavador.
- Type-safety com Zod schemas para request/response.

---

## 2. Contexto

### Stack afetada

- **Runtime**: Node.js ≥22 (Bun-ready)
- **Framework HTTP**: Hono (já usado)
- **Validação**: Zod (já usado)
- **HTTP Client**: `FetchHttpClient` custom (já usado)
- **Persistência**: MongoDB via `MongoRawResultStore` (já usado)
- **Linguagem**: TypeScript (ESM, `.js` extensions)

### Integrações necessárias

- **DataJud API**: `https://api-publica.datajud.cnj.jus.br/api_publica_{sigla}/_search`
- **Autenticação**: Header `Authorization: Basic <api_key>`
- **83 tribunais** mapeados (lista completa fornecida pelo usuário)

---

## 3. Arquitetura

```
┌──────────────────────────────────────────────────────────────┐
│                    Clothos Motor API                         │
│                                                              │
│  ┌──────────────┐         ┌──────────────────────────────┐   │
│  │   Hono App   │────────▶│  /api/datajud                │   │
│  └──────────────┘         │    ├── POST /buscar          │   │
│                           │    │      ?tribunal={sigla}  │   │
│                           │    ├── POST /processo         │   │
│                           │    ├── POST /classe           │   │
│                           │    ├── POST /orgao-julgador   │   │
│                           │    ├── POST /envolvido        │   │
│                           │    └── GET  /tribunais        │   │
│                           └──────────────────────────────┘   │
│                                      │                       │
│                                      ▼                       │
│                           ┌──────────────────────┐           │
│                           │  DataJudHttpClient   │           │
│                           │  (Basic Auth)        │           │
│                           └──────────────────────┘           │
│                                      │                       │
│                                      ▼                       │
│                           ┌──────────────────────┐           │
│                           │  DataJud Operations  │           │
│                           │  (Search DSL)        │           │
│                           └──────────────────────┘           │
│                                      │                       │
│                    ┌─────────────────┴─────────────────┐     │
│                    ▼                                   ▼     │
│         ┌─────────────────┐                 ┌──────────────┐ │
│         │  DataJud API    │                 │  rawStore    │ │
│         │  (CNJ)          │                 │  (MongoDB)   │ │
│         └─────────────────┘                 └──────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

### Responsabilidades

| Componente | Responsabilidade |
|---|---|
| `DataJudHttpClient` | Cliente HTTP com base URL e header `Authorization: Basic`. Implementa `IHttpClient`. |
| `TribunalDataJud` | Constante/record com todos os 83 tribunais: sigla, nome, endpoint. |
| `DataJudSearchOperation` | Operação genérica de `_search` que recebe sigla do tribunal + body DSL. |
| `DataJudRouter` | Rotas Hono que validam input (Zod), chamam operations e persistem em rawStore. |
| DTOs (Zod) | Schemas para: request de busca, hits do Elasticsearch, processo DataJud. |

---

## 4. Contratos de API

### Base Path

```
POST /api/datajud/buscar?tribunal={sigla}
```

### Endpoints

#### 4.1 Busca Genérica (Elasticsearch DSL)

```http
POST /api/datajud/buscar?tribunal=tjsp
Content-Type: application/json

{
  "query": {
    "match": { "numeroProcesso": "1002297-51.2024.8.26.0576" }
  },
  "size": 10
}
```

**Response 200**

```json
{
  "took": 45,
  "timed_out": false,
  "hits": {
    "total": { "value": 1, "relation": "eq" },
    "hits": [
      {
        "_source": {
          "numeroProcesso": "1002297-51.2024.8.26.0576",
          "classeProcessual": "...",
          "orgaoJulgador": "...",
          "dataAjuizamento": "...",
          "movimentacoes": [...]
        }
      }
    ]
  }
}
```

#### 4.2 Buscar por Número de Processo

```http
POST /api/datajud/processo?tribunal=tjsp
Content-Type: application/json

{ "numeroProcesso": "1002297-51.2024.8.26.0576", "size": 1 }
```

#### 4.3 Buscar por Classe Processual

```http
POST /api/datajud/classe?tribunal=tjsp
Content-Type: application/json

{ "classeProcessual": "Procedimento Comum Cível", "size": 20 }
```

#### 4.4 Buscar por Órgão Julgador

```http
POST /api/datajud/orgao-julgador?tribunal=tjsp
Content-Type: application/json

{ "orgaoJulgador": "1ª Vara Cível", "size": 20 }
```

#### 4.5 Buscar por Envolvido (nome ou CPF/CNPJ)

```http
POST /api/datajud/envolvido?tribunal=tjsp
Content-Type: application/json

{ "nome": "João Silva", "size": 20 }
```

#### 4.6 Listar Tribunais Disponíveis

```http
GET /api/datajud/tribunais
```

**Response 200**

```json
[
  { "sigla": "tjsp", "nome": "Tribunal de Justiça de São Paulo", "endpoint": "https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search" },
  ...
]
```

### Erros

| Status | Cenário |
|---|---|
| 400 | Tribunal não informado ou inválido |
| 422 | Body JSON inválido (falha Zod) |
| 500 | Erro no DataJud (TIMEOUT, AUTH_FAILED, UPSTREAM_ERROR) |

---

## 5. Modelo de Dados

### 5.1 Request DTOs

```typescript
// Busca genérica
const DataJudSearchRequestSchema = z.object({
  query: z.record(z.unknown()),           // Query DSL Elasticsearch
  size: z.number().int().min(1).max(100).optional().default(10),
  from: z.number().int().min(0).optional().default(0),
  sort: z.array(z.record(z.unknown())).optional(),
  _source: z.union([z.boolean(), z.array(z.string())]).optional(),
});

// Busca por número de processo
const DataJudProcessoRequestSchema = z.object({
  numeroProcesso: z.string().min(20).max(25),
  size: z.number().int().optional().default(1),
});

// Busca por classe
const DataJudClasseRequestSchema = z.object({
  classeProcessual: z.string().min(1),
  size: z.number().int().optional().default(20),
});

// Busca por órgão julgador
const DataJudOrgaoRequestSchema = z.object({
  orgaoJulgador: z.string().min(1),
  size: z.number().int().optional().default(20),
});

// Busca por envolvido
const DataJudEnvolvidoRequestSchema = z.object({
  nome: z.string().min(1).optional(),
  cpfCnpj: z.string().min(11).max(18).optional(),
  size: z.number().int().optional().default(20),
});
```

### 5.2 Response DTOs

```typescript
const DataJudHitSchema = z.object({
  _index: z.string(),
  _type: z.string().optional(),
  _id: z.string(),
  _score: z.number().optional(),
  _source: z.record(z.unknown()),         // Processo — flexível por tribunal
});

const DataJudSearchResponseSchema = z.object({
  took: z.number().int(),
  timed_out: z.boolean(),
  hits: z.object({
    total: z.object({
      value: z.number().int(),
      relation: z.string(),
    }),
    hits: z.array(DataJudHitSchema),
  }),
});
```

### 5.3 Tribunal Mapping

```typescript
export const DATAJUD_TRIBUNAIS = [
  // Superiores
  { sigla: 'tst', nome: 'Tribunal Superior do Trabalho' },
  { sigla: 'tse', nome: 'Tribunal Superior Eleitoral' },
  { sigla: 'stj', nome: 'Tribunal Superior de Justiça' },
  { sigla: 'stm', nome: 'Tribunal Superior Militar' },
  // TRFs
  { sigla: 'trf1', nome: 'Tribunal Regional Federal da 1ª Região' },
  ... // (lista completa de 83 tribunais)
] as const;
```

---

## 6. Decisões de ADR

### ADR-1: Um único endpoint `_search` vs múltiplos endpoints REST

**Decisão**: Criar rotas de conveniência (`/processo`, `/classe`, `/orgao-julgador`, `/envolvido`) que traduzem para a mesma operação `_search`, além da rota genérica `/buscar` que aceita DSL livre.

**Razão**: A API DataJud expõe apenas `POST /{tribunal}/_search`. Rotas de conveniência melhoram DX (developer experience) para casos comuns, enquanto `/buscar` dá flexibilidade total.

**Alternativa rejeitada**: Expor apenas `/buscar`. Rejeitada porque 90% dos casos de uso são buscas por número de processo, classe ou envolvido.

### ADR-2: Basic Auth vs Bearer Token

**Decisão**: Usar Basic Auth com a API Key fornecida pelo CNJ (`Authorization: Basic cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==`).

**Razão**: A documentação do DataJud especifica autenticação Basic Auth. O Escavador usa Bearer, mas cada provider deve usar o mecanismo exigido pela fonte.

### ADR-3: Schema flexível para `_source`

**Decisão**: `_source` é tipado como `z.record(z.unknown())` (genérico) ao invés de schema rígido de processo.

**Razão**: Cada tribunal pode retornar campos ligeiramente diferentes. Fixar um schema rígido causaria `SCHEMA_MISMATCH` frequentes. O valor é pass-through para o consumidor.

### ADR-4: Query param `tribunal` ao invés de path param

**Decisão**: Usar query param `?tribunal={sigla}` nas rotas de busca.

**Razão**: Simplifica a validação e permite fácil extensão para busca multi-tribunal no futuro (ex: `?tribunal=tjsp&?tribunal=tjrj`).

---

## 7. Edge Cases & Limitações

| Cenário | Comportamento |
|---|---|
| Tribunal inativo/offline no DataJud | Retorna `UPSTREAM_ERROR` com status 500 |
| Processo sigiloso | DataJud não retorna o documento (filtro do CNJ); response vem vazia |
| Rate limiting do CNJ | Retorna `RATE_LIMITED` (ainda não confirmado se CNJ aplica) |
| Timeout > 30s | AbortSignal timeout → `TIMEOUT` |
| Body DSL inválido | DataJud retorna 400 → mapeado para `UPSTREAM_ERROR` com mensagem |
| CPF em busca por envolvido | Hash SHA-256 no rawStore, igual ao Escavador |
| API Key inválida/expirada | `AUTH_FAILED` (401/403) |
| Busca sem resultados | HTTP 200 com `hits.total.value = 0` e array vazio (não é erro) |

### Quando NÃO usar

- Não substitui o Escavador; é complementar (Escavador tem features como monitoramentos, diários oficiais, resumo por IA).
- Não faz scraping de autos/documentos (DataJud é metadados apenas).

---

## 8. Estratégia de Testes

### Unitários

- `DataJudHttpClient`: mock do fetch, verificar header `Authorization: Basic ...`
- DTOs: validar schemas Zod com dados de exemplo (hits válidos e inválidos)
- `BuscarProcessoDataJud`: mock do IHttpClient, verificar body DSL gerado

### Integração

- Testar chamada real para `api_publica_tst/_search` com a API key pública (dados são públicos)
- Verificar persistência no rawStore (mock Mongo ou container de teste)

### Fixtures

- `datajud-processo-hit.json`: exemplo de `_source` de um processo
- `datajud-empty-response.json`: resposta com 0 hits
- `datajud-error-401.json`: resposta de auth failed

---

## 9. Performance

| Métrica | Estimativa | Nota |
|---|---|---|
| Latência p50 | 200–800ms | Varia por tribunal e complexidade da query DSL |
| Latência p99 | 3–5s | Tribunais com grande volume (ex: TJSP) |
| Throughput | 10 req/s | Limitado pela política do CNJ (não documentado) |
| Payload médio | 5–50 KB | Depende do número de movimentações |
| Timeout | 30s | Padrão do FetchHttpClient |

### Otimizações futuras

- Cache Redis para queries idênticas (TTL 1h) — fora do escopo inicial.
- Busca paralela multi-tribunal com `Promise.all` — fora do escopo inicial.

---

## 10. Segurança

| Item | Medida |
|---|---|
| Autenticação | Basic Auth via header `Authorization`. API key em env var `DATAJUD_APIKEY`. |
| CPF/CNPJ | Hash SHA-256 no `rawStore` se `tipo_param === 'cpf_cnpj'` (mesma regra do Escavador). |
| Validação | Zod schemas para todos os bodies e query params. |
| Log | Nunca logar API key completa (mascarar). |
| TLS | Sempre HTTPS (base URL do DataJud). |

---

## Arquivos a serem criados/modificados

### Novos arquivos

```
src/infrastructure/providers/datajud/
├── DataJudHttpClient.ts
├── DataJudTribunais.ts
├── dtos/
│   ├── DataJudSearchRequestDto.ts
│   ├── DataJudSearchResponseDto.ts
│   └── DataJudTribunalDto.ts
└── operations/
    ├── BuscarProcessoDataJud.ts
    ├── BuscarClasseProcessualDataJud.ts
    ├── BuscarOrgaoJulgadorDataJud.ts
    ├── BuscarEnvolvidoDataJud.ts
    └── BuscarGenericoDataJud.ts

src/presentation/api/routes/datajud.ts
```

### Arquivos modificados

```
src/presentation/api/app.ts          # adicionar app.route('/api/datajud', datajud)
.env.example                         # adicionar DATAJUD_APIKEY, DATAJUD_BASE_URL
README.md                            # documentar novos endpoints
```

---

## Critérios de sucesso

- [ ] `GET /api/datajud/tribunais` retorna lista completa de 83 tribunais.
- [ ] `POST /api/datajud/buscar?tribunal=tjsp` com body DSL retorna hits do DataJud.
- [ ] `POST /api/datajud/processo?tribunal=tjsp` converte para query de número de processo.
- [ ] Erros mapeados corretamente para `SourceError` (TIMEOUT, AUTH_FAILED, UPSTREAM_ERROR).
- [ ] Todas as requisições são auditadas no `rawStore` com gateway `datajud`.
- [ ] `npm run typecheck` passa sem erros.
- [ ] `npm run lint:fix` passa sem erros.

---

**Fase 0 completa. Aguardando aprovação do usuário para iniciar implementação.**
