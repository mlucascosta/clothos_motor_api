import { Hono } from 'hono';
import { handleOp } from '../handleOp.js';
import { ApiBrasilHttpClient } from '../../../infrastructure/providers/apibrasil/ApiBrasilHttpClient.js';
import type { IApiBrasilOperation } from '../../../infrastructure/providers/apibrasil/ports/IApiBrasilOperation.js';
import { apibrasilEndpoints, resolveOperation } from '../../../infrastructure/providers/apibrasil/operations/registry.js';
import { apibrasilRequiredParams } from '../../../infrastructure/providers/apibrasil/operations/validation-map.js';

const GW = 'apibrasil';
const BASE_URL = 'https://gateway.apibrasil.io/api/v2';

function buildHttp(): ApiBrasilHttpClient {
  const apiKey = process.env['APIBRASIL_API_KEY'] ?? '';
  const deviceToken = process.env['APIBRASIL_DEVICE_TOKEN'] ?? '';
  return new ApiBrasilHttpClient(apiKey, deviceToken, BASE_URL);
}

const apibrasil = new Hono();

apibrasil.post('/:endpoint{.+}', async (c) => {
  const endpoint = c.req.param('endpoint');
  let body: Record<string, string> = {};
  try {
    const rawBody = await c.req.json();
    body = typeof rawBody === 'object' && rawBody !== null ? rawBody as Record<string, string> : {};
  } catch {
    body = {};
  }

  const query = c.req.query();
  const mergedParams = { ...query, ...body };

  // Validate required params
  const required = apibrasilRequiredParams[endpoint];
  if (required) {
    for (const param of required) {
      if (!mergedParams[param]) {
        return c.json({ error: `Parâmetro ${param} obrigatório` }, 400);
      }
    }
  }

  // Check if endpoint exists in registry
  if (!apibrasilEndpoints[endpoint]) {
    return c.json({ error: `Operação desconhecida: ${endpoint}` }, 400);
  }

  const config = apibrasilEndpoints[endpoint]!;

  let operation: IApiBrasilOperation;
  try {
    operation = resolveOperation(endpoint, buildHttp());
  } catch {
    return c.json({ error: `Erro ao resolver operação: ${endpoint}` }, 500);
  }

  const priorityKeys = ['cpf', 'cnpj', 'placa', 'chave', 'cep', 'celular', 'codigo_fipe', 'renavam'];
  let tipoParam: string | null = null;
  let paramValue: string | null = null;
  for (const key of priorityKeys) {
    if (mergedParams[key]) {
      tipoParam = key;
      paramValue = mergedParams[key];
      break;
    }
  }

  if ((tipoParam === 'cpf' || tipoParam === 'cnpj') && paramValue) {
    const digits = paramValue.replace(/\D/g, '');
    if (digits.length !== 11 && digits.length !== 14) {
      return c.json({
        error: `Formato inválido para ${tipoParam.toUpperCase()}: deve ter 11 (CPF) ou 14 (CNPJ) dígitos`,
      }, 422);
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

export { apibrasil };
