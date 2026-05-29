/**
 * @fileoverview Rotas do motor para o provider BrasilAPI.
 *
 * A BrasilAPI é uma API pública brasileira — não exige autenticação. O cliente
 * HTTP ({@link BrasilApiHttpClient}) força `GET` em todas as requisições, mas
 * o motor recebe `POST` para uniformizar o contrato interno (params via body JSON).
 *
 * O padrão registry/factory é idêntico ao directdata:
 * - `brasilapiRegistry` mapeia nomes de endpoints para factories de operations.
 * - `resolveOperation` instancia a operation sob demanda, sem estado compartilhado.
 * - `brasilapiRequiredParams` valida parâmetros obrigatórios antes do despacho.
 *
 * A base URL pode ser sobrescrita via env var `BRASILAPI_BASE_URL` (útil em testes).
 * @module presentation/api/routes/brasilapi
 */

import { BrasilApiHttpClient } from '@infrastructure/providers/brasilapi/BrasilApiHttpClient.js';
import {
  brasilapiRegistry,
  resolveOperation,
} from '@infrastructure/providers/brasilapi/operations/registry.js';
import { brasilapiRequiredParams } from '@infrastructure/providers/brasilapi/operations/validation-map.js';
import type { IBrasilApiOperation } from '@infrastructure/providers/brasilapi/ports/IBrasilApiOperation.js';
import { Hono } from 'hono';
import { handleOp } from '../handleOp.js';

const GW = 'brasilapi';
const BASE_URL = 'https://brasilapi.com.br/api';

/**
 * Instancia um {@link BrasilApiHttpClient} com a base URL do ambiente.
 * Criado por requisição para evitar estado compartilhado entre chamadas concorrentes.
 * Lê `BRASILAPI_BASE_URL` do ambiente; usa `BASE_URL` como fallback.
 *
 * @returns Nova instância de {@link BrasilApiHttpClient} pronta para uso.
 */
function buildHttp(): BrasilApiHttpClient {
  const baseUrl = process.env['BRASILAPI_BASE_URL'] ?? BASE_URL;
  return new BrasilApiHttpClient(baseUrl);
}

const brasilapi = new Hono();

/**
 * Rota universal POST para todas as operations da BrasilAPI.
 *
 * O segmento `:endpoint` aceita qualquer path (regex `.+`), permitindo nomes
 * com underscores como `cvm_corretora`. O body JSON é mesclado com query params;
 * body tem precedência em caso de colisão de chaves.
 *
 * Fluxo:
 * 1. Valida parâmetros obrigatórios via `brasilapiRequiredParams`.
 * 2. Verifica se o endpoint existe no `brasilapiRegistry` (400 se não encontrar).
 * 3. Resolve a operation via `resolveOperation` e executa com os params mesclados.
 * 4. Delega logging e formatação da resposta para `handleOp`.
 *
 * Parâmetros de identificação (`cnpj`, `domain`) são extraídos na ordem de
 * `priorityKeys` para popular `tipo_param` e `param` no contexto de rastreamento.
 */
brasilapi.post('/:endpoint{.+}', async (c) => {
  const endpoint = c.req.param('endpoint');
  let body: Record<string, string> = {};
  try {
    const rawBody = await c.req.json();
    body =
      typeof rawBody === 'object' && rawBody !== null ? (rawBody as Record<string, string>) : {};
  } catch {
    body = {};
  }

  const query = c.req.query();
  const mergedParams = { ...query, ...body };

  const required = brasilapiRequiredParams[endpoint];
  if (required) {
    for (const param of required) {
      if (!mergedParams[param]) {
        return c.json({ error: `Parâmetro ${param} obrigatório` }, 400);
      }
    }
  }

  if (!brasilapiRegistry[endpoint]) {
    return c.json({ error: `Operação desconhecida: ${endpoint}` }, 400);
  }

  let operation: IBrasilApiOperation;
  try {
    operation = resolveOperation(endpoint, buildHttp());
  } catch {
    return c.json({ error: `Erro ao resolver operação: ${endpoint}` }, 500);
  }

  const priorityKeys = ['cnpj', 'domain'];
  let tipoParam: string | null = null;
  let paramValue: string | null = null;
  for (const key of priorityKeys) {
    if (mergedParams[key]) {
      tipoParam = key;
      paramValue = mergedParams[key] ?? null;
      break;
    }
  }

  return handleOp(
    c,
    {
      gateway: GW,
      fonte: endpoint,
      tipo_param: tipoParam,
      param: paramValue,
    },
    () => operation.execute(mergedParams),
  );
});

export { brasilapi };
