# Clothos Motor API

**Pipeline de Consultas Node.js/TypeScript para Reduto Finder**

Motor de processamento e orquestração de requisições ao Escavador (provedor de dados judiciais brasileiros) com suporte a múltiplos endpoints V1 e V2, monitoramentos, callbacks e geração de resumos por IA.

---

## 📋 Requisitos

- **Node.js**: ≥ 22.0.0
- **npm/pnpm**: Gerenciador de pacotes
- **MongoDB**: Para persistência de auditoria (rawStore)
- **Variáveis de Ambiente**: `ESCAVADOR_API_KEY`, `ESCAVADOR_BASE_URL`, `MONGODB_URI`

---

## 🚀 Instalação & Setup

### 1. Clone e instale dependências

```bash
cd clothos_motor_api
npm install  # ou pnpm install
```

### 2. Configure variáveis de ambiente

Crie um arquivo `.env.local`:

```bash
# Escavador API
ESCAVADOR_API_KEY=seu_token_aqui
ESCAVADOR_BASE_URL=https://api.escavador.com

# MongoDB para auditoria
MONGODB_URI=mongodb://localhost:27017/clothos_motor

# Servidor
NODE_ENV=development
PORT=3000
```

### 3. Desenvolvimento

```bash
# Iniciar servidor em modo watch
npm run dev

# Compilar TypeScript
npm run typecheck

# Formatar e lint
npm run lint:fix
npm run format
```

### 4. Produção

```bash
# Build
npm run build

# Start
npm start
```

---

## 📂 Estrutura do Projeto

```
src/
├── application/              # Lógica de aplicação (queries, use cases)
│   └── queries/ports/        # Interfaces de execução
├── domain/                   # Regras de negócio (entidades, agregados)
│   └── queries/              # Domínio de queries
├── infrastructure/           # Implementação técnica
│   ├── blocks/               # Processamento em blocos
│   ├── bullmq/               # Fila de jobs (BullMQ)
│   ├── database/             # Conexão MongoDB
│   ├── http/                 # Cliente HTTP abstrato
│   ├── persistence/          # Armazenamento (rawStore)
│   ├── providers/            # Provedores (Escavador)
│   │   ├── escavador/        # Integração Escavador
│   │   │   ├── dtos/         # Data Transfer Objects
│   │   │   ├── operations/   # Operações (ObterSaldo, BuscarProcessos, etc)
│   │   │   ├── mappers/      # Mapeadores de domínio
│   │   │   └── EscavadorHttpClient.ts
│   │   └── ...               # Outros provedores
│   ├── redis/                # Cache e pub/sub (Redis)
│   └── workers/              # Workers de background
├── presentation/             # Camada de apresentação
│   ├── api/
│   │   └── routes/           # Rotas HTTP (Hono)
│   │       └── escavador.ts  # Router Escavador (92 endpoints V1+V2)
│   └── server.ts             # Configuração do servidor
├── shared/                   # Código compartilhado
│   ├── domain/               # Either, Errors, tipos
│   └── infrastructure/       # HTTP client abstrato, utilitários
└── main.ts                   # Entry point
```

---

## 🔌 API Endpoints

### Base Path
```
http://localhost:3000/api/escavador
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

1. Cliente HTTP bate em `/api/escavador/v1/{endpoint}`
2. Handler Hono extrai parâmetros e valida com Zod
3. Instancia Operation apropriada (ex: `new ObterSaldo(buildHttpV1())`)
4. Operation executa chamada para Escavador (com bearer token)
5. Resposta mapeada para DTO e retornada
6. Resultado salvo em `rawStore` (MongoDB) para auditoria
7. JSON retornado ao cliente com status HTTP apropriado

---

## 🧪 Testes

```bash
# Rodar suite de testes
npm test

# Modo watch
npm test:watch

# Coverage
npm test:coverage
```

---

## 🔧 Troubleshooting

### "ESCAVADOR_API_KEY not found"
Verifique se `.env.local` (ou `.env`) contém a variável.

### "MongoDB connection failed"
Certifique-se de que MongoDB está rodando:
```bash
docker run -d -p 27017:27017 mongo:latest
```

### "swc: not found"
Reinstale dependências:
```bash
rm -rf node_modules package-lock.json
npm install
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
npm run typecheck    # TypeScript
npm run lint:fix     # Biome
npm test             # Jest
```

---

## 📄 Licença

Proprietary — Reduto Finder

---

**Desenvolvido com ❤️ para Reduto Finder**
