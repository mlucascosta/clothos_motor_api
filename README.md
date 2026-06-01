# Clothos Motor API

**Serviço de Consultas Node.js/TypeScript para Reduto Finder**

Serviço interno responsável por **duas tarefas**: (1) executar consultas em provedores externos de dados e (2) persistir os resultados brutos. O app Laravel busca esses resultados posteriormente e os entrega ao cliente final.

> **O motor não é multi-tenant.** Ele não isola dados por tenant nem orquestra cotas/billing — isso é responsabilidade do app (PostgreSQL multi-tenant). O motor apenas consulta e salva; o campo `tenantId` gravado em `query_refs` é só rótulo de correlação para auditoria, não isolamento.

Provedores suportados: **Escavador** (V1+V2, judicial), **DataJud/CNJ**, **DirectData**, **ApiBrasil**, **Infosimples** e **BrasilAPI**.

---

## 📋 Requisitos

- **Node.js**: ≥ 22.0.0
- **pnpm**: Gerenciador de pacotes (ver `pnpm-lock.yaml`)
- **MongoDB**: Para persistência dos resultados (`raw_results`) e referências de consulta (`query_refs`)
- **Variáveis de Ambiente**: ver `.env.example` (segredo interno, credenciais por provedor e string do MongoDB)

---

## 🚀 Instalação & Setup

### 1. Clone e instale dependências

```bash
cd clothos_motor_api
pnpm install
```

### 2. Configure variáveis de ambiente

Copie `.env.example` para `.env` e preencha os valores:

```bash
cp .env.example .env
```

Variáveis principais:

- `MOTOR_INTERNAL_SECRET` — token exigido em todas as rotas `/api/*` (auth interna)
- `MONGODB_CLOUD_STRING` — conexão MongoDB (resultados + referências de consulta)
- Credenciais por provedor: `ESCAVADOR_API_KEY`, `DATAJUD_APIKEY`, `DIRECTDATA_TOKEN`, `APIBRASIL_API_KEY` + `APIBRASIL_DEVICE_TOKEN`, `INFOSIMPLES_TOKEN`
- `PORT` (padrão 3001), `NODE_ENV`, `LOG_LEVEL`

> BrasilAPI não exige autenticação (`BRASILAPI_BASE_URL` só para staging/testes).

### 3. Desenvolvimento

```bash
pnpm dev          # servidor em modo watch
pnpm typecheck    # checagem de tipos
pnpm lint:fix     # lint + format (Biome)
```

### 4. Produção

```bash
pnpm build        # swc + tsc-alias → dist/
pnpm start        # node dist/presentation/server.js
```

---

## 📂 Estrutura do Projeto

```
src/
├── application/
│   └── queries/ports/            # ISourceExecutor (porta de execução de fonte)
├── infrastructure/
│   ├── persistence/              # MongoRawResultStore, MongoQueryRefStore + interfaces
│   └── providers/                # Integrações (cada um: dtos/ operations/ ports/ + HttpClient)
│       ├── apibrasil/
│       ├── brasilapi/
│       ├── datajud/
│       ├── directdata/
│       ├── escavador/
│       └── infosimples/
├── presentation/
│   ├── api/
│   │   ├── routes/               # Rotas HTTP (Hono): escavador, datajud, directdata,
│   │   │                         #   apibrasil, infosimples, brasilapi
│   │   ├── middlewares/          # bearerAuth (auth interna)
│   │   └── handleOp.ts           # Wrapper genérico: executa, salva resultado e responde
│   └── server.ts                 # Entry point
└── shared/
    ├── domain/                   # Either, SourceError, hashCpf
    └── infrastructure/           # FetchHttpClient, logger
```

> **Scaffolding reservado (ainda vazio — só `.gitkeep`):** `domain/queries/`,
> `infrastructure/{blocks,bullmq,redis,workers,database,http}/` e
> `application/queries/use-cases/`. São diretórios preparados para o **motor
> assíncrono futuro** (fila BullMQ + workers + pipeline em blocos), descrito em
> `docs/architecture/MOTOR.md` no repositório raiz. Hoje o motor é um gateway HTTP
> síncrono — esses diretórios não contêm código.

---

## 🔌 API Endpoints

### Base Path
```
http://localhost:3001/api/escavador
```

### V1 Endpoints (42 rotas)

**Saldo e Créditos**
- `GET /v1/quantidade-creditos` — Consultar saldo de créditos

**Buscas Assíncronas**
- `GET /v1/buscas-assincronas` — Listar buscas iniciadas
- `GET /v1/buscas-assincronas/:id` — Obter resultado de busca

**Processos — Iniciar Buscas**
- `POST /v1/processos/tribunal/cpf-cnpj` — Buscar por CPF/CNPJ
- `POST /v1/processos/tribunal/envolvido` — Buscar por envolvido
- `POST /v1/processos/tribunal/oab` — Buscar por OAB
- `POST /v1/processos/administrativo/nup` — Buscar por NUP
- `POST /v1/processos/pesquisar` — Buscar processo por número
- `POST /v1/processos/tribunal/lote` — Busca em lote

**Processos — Detalhes e Movimentações**
- `GET /v1/processos/:numero_cnj` — Obter processo por CNJ
- `GET /v1/processos/:numero_cnj/movimentacoes` — Listar movimentações
- `GET /v1/processos/diarios-oficiais/numero` — Buscar em diários (número)
- `GET /v1/processos/diarios-oficiais/oab` — Buscar em diários (OAB)

**Pessoas e Instituições**
- `GET /v1/pessoas/:id` — Obter pessoa
- `GET /v1/pessoas/:id/processos` — Processos de uma pessoa
- `GET /v1/instituicoes/:id` — Obter instituição
- `GET /v1/instituicoes/:id/processos` — Processos de instituição

**Monitoramentos**
- `GET /v1/monitoramentos` — Listar monitoramentos (diários)
- `POST /v1/monitoramentos` — Criar monitoramento
- `GET /v1/monitoramentos/tribunal` — Listar monitoramentos (tribunal)
- `POST /v1/monitoramentos/tribunal` — Criar monitoramento (tribunal)

**Callbacks e Auxiliares**
- `GET /v1/callbacks` — Listar callbacks
- `POST /v1/callbacks/marcar-recebidos` — Marcar callbacks como recebidos
- `POST /v1/callbacks/:id/reenviar` — Reenviar callback específico
- `GET /v1/tribunais` — Listar tribunais
- `GET /v1/orgaos-administrativos` — Órgãos administrativos

### V2 Endpoints (24 rotas documentadas)

**Consulta de Processos V2**
- `GET /v2/processos/numero_cnj/{numero}` — Obter processo por CNJ
- `GET /v2/processos/numero_cnj/{numero}/movimentacoes` — Movimentações
- `GET /v2/processos/envolvido` — Buscar por envolvido
- `GET /v2/processos/advogado/{oab}` — Buscar por advogado
- `GET /v2/processos/numero_cnj/{numero}/documentos/{key}` — Documentos
- `GET /v2/processos/numero_cnj/{numero}/documentos-publicos` — Docs públicos
- `GET /v2/processos/numero_cnj/{numero}/autos` — Autos (volumes)
- `GET /v2/processos/numero_cnj/{numero}/envolvidos` — Partes envolvidas

**Atualização e Resumo V2**
- `POST /v2/processos/numero_cnj/{numero}/solicitar-atualizacao` — Atualizar processo
- `GET /v2/processos/numero_cnj/{numero}/status-atualizacao` — Status de atualização
- `POST /v2/processos/lote/solicitar-atualizacao` — Atualizar lote
- `GET /v2/processos/lote/{id}/status` — Status de lote
- `POST /v2/processos/numero_cnj/{numero}/ia/resumo/solicitar-atualizacao` — Solicitar resumo IA
- `GET /v2/processos/numero_cnj/{numero}/ia/resumo` — Obter resumo IA
- `GET /v2/processos/numero_cnj/{numero}/ia/resumo/status` — Status de resumo

**Certificados e Tribunais V2**
- `GET /v2/certificados` — Listar certificados digitais
- `POST /v2/certificados` — Cadastrar certificado
- `GET /v2/certificados/{id}` — Obter certificado
- `DELETE /v2/certificados/{id}` — Remover certificado
- `POST /v2/certificados/{id}/autenticacoes` — Configurar autenticações
- `DELETE /v2/certificados/{id}/autenticacoes/{autenticacaoId}` — Remover autenticação
- `GET /v2/tribunais/sistemas` — Sistemas de tribunais
- `GET /v2/tribunais` — Listar tribunais
- `GET /v2/documentos/:id/download` — Download de PDF

Para documentação detalhada de cada endpoint (parâmetros, responses, exemplos), veja `src/presentation/api/routes/escavador.ts`.

### DataJud Endpoints (6 rotas)

**Base Path:** `http://localhost:3001/api/datajud`

**Tribunais**
- `GET /tribunais` — Listar 91 tribunais disponíveis (sigla + nome)

**Buscas**
- `POST /buscar?tribunal={sigla}` — Busca genérica com DSL Elasticsearch
- `POST /processo?tribunal={sigla}` — Buscar por número de processo
- `POST /classe?tribunal={sigla}` — Buscar por classe processual
- `POST /orgao-julgador?tribunal={sigla}` — Buscar por órgão julgador
- `POST /envolvido?tribunal={sigla}` — Buscar por nome ou CPF/CNPJ de envolvido

**Exemplo:**
```bash
curl -X POST "http://localhost:3001/api/datajud/processo?tribunal=tjsp" \
  -H "Content-Type: application/json" \
  -d '{"numeroProcesso": "1002297-51.2024.8.26.0576"}'
```

Para documentação detalhada, veja `src/presentation/api/routes/datajud.ts`.

### Demais provedores

Montados em `src/presentation/api/app.ts` (todos sob `/api`, protegidos por `bearerAuth`):

| Provedor | Base Path | Rota (detalhe) |
|---|---|---|
| ApiBrasil | `/api/apibrasil` | `routes/apibrasil.ts` |
| BrasilAPI | `/api/brasilapi` | `routes/brasilapi.ts` |
| DirectData | `/api/directdata` | `routes/directdata.ts` |
| Infosimples | `/api/infosimples/:endpoint` (dinâmica) | `routes/infosimples.ts` |

Health check (sem auth): `GET /health`.

---

## 🏗️ Arquitetura

### Padrão de Erro: Either<L, R>

Todas as operações retornam `Either<SourceError, T>`:

```typescript
// Sucesso: Right
const result: Either<SourceError, SaldoDto> = right({ saldo: 1000 });

// Erro: Left
const error: Either<SourceError, SaldoDto> = left(
  new SourceError('TIMEOUT', 'escavador', 'Requisição expirou')
);

// Verificar
if (isLeft(result)) {
  console.log(result.value.message); // Mensagem de erro
} else {
  console.log(result.value.saldo);   // Dados
}
```

### Tipos de Erro (SourceErrorKind)

- `TIMEOUT` — Requisição expirou
- `SCHEMA_MISMATCH` — Resposta não valida schema esperado
- `AUTH_FAILED` — Falha de autenticação
- `CIRCUIT_OPEN` — Circuit breaker ativado
- `RATE_LIMITED` — Rate limit excedido
- `NOT_FOUND` — Recurso não encontrado
- `UPSTREAM_ERROR` — Erro no upstream

### Fluxo de Requisição

1. O app bate em `/api/{provedor}/{endpoint}` com o header de auth interna (`bearerAuth`)
2. Handler Hono extrai parâmetros e valida com Zod
3. Instancia a Operation apropriada (ex.: `new ObterSaldo(buildHttp())`)
4. A Operation executa a chamada ao provedor externo (credencial via env) e mapeia para DTO
5. `handleOp` persiste o resultado bruto em `raw_results` e a referência em `query_refs` (MongoDB)
6. JSON retornado com status HTTP apropriado

O app consome esses resultados depois (busca por `correlationId`/referência) e os entrega ao cliente final.

---

## 🧪 Testes

```bash
pnpm test            # rodar suite de testes
pnpm test:watch      # modo watch
pnpm test:coverage   # coverage
```

---

## 🔧 Troubleshooting

### "MOTOR_INTERNAL_SECRET / credencial não configurada"
Verifique se `.env` contém o segredo interno e a credencial do provedor usado.

### "MongoDB connection failed"
Confira `MONGODB_CLOUD_STRING` no `.env`. Para rodar local:
```bash
docker run -d -p 27017:27017 mongo:latest
# MONGODB_CLOUD_STRING=mongodb://localhost:27017/clothos_motor
```

### "swc: not found"
Reinstale dependências:
```bash
rm -rf node_modules
pnpm install
```

---

## 📝 Versionamento

- **Versão atual**: 0.1.0
- **Node.js mínimo**: 22.0.0

---

## 📚 Documentação Adicional

- **Especificação técnica**: Ver `docs/` no repositório raiz
- **JSDoc/TSDOC**: Todos os arquivos TypeScript contêm documentação completa
- **Escavador API oficial**: https://api.escavador.com/

---

## 🤝 Contribuindo

1. Crie uma branch: `git checkout -b feat/sua-feature`
2. Commit com Conventional Commits: `git commit -m "feat: descrição"`
3. Push: `git push origin feat/sua-feature`
4. Abra PR para `develop`

Antes de submeter:
```bash
pnpm typecheck    # TypeScript
pnpm lint:fix     # Biome
pnpm test         # Jest
```

---

## 📄 Licença

Proprietary — Reduto Finder

---

**Desenvolvido com ❤️ para Reduto Finder**
