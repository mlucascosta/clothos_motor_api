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

function buildHttp(): BrasilApiHttpClient {
  const baseUrl = process.env['BRASILAPI_BASE_URL'] ?? BASE_URL;
  return new BrasilApiHttpClient(baseUrl);
}

const brasilapi = new Hono();

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
