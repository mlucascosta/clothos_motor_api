/**
 * @fileoverview Router de rotas para API Gateway ApiBrasil — Motor de Consultas Reduto Finder.
 * @module presentation/api/routes/apibrasil
 *
 * ## Arquitetura
 *
 * Cada endpoint do marketplace ApiBrasil é representado por uma **classe única** que implementa
 * `IApiBrasilOperation`. O registry (`operations/registry.ts`) mapeia nome do endpoint → factory.
 *
 * ### Pipeline de Requisição
 * 1. `POST /api/apibrasil/:endpoint` recebe body JSON + query params
 * 2. Valida params obrigatórios contra `apibrasilRequiredParams`
 * 3. Valida formato de CPF (11 dígitos) ou CNPJ (14 caracteres alfanuméricos) quando presentes
 * 4. Resolve operation via `resolveOperation(endpoint, buildHttp())`
 * 5. Executa `operation.execute(mergedParams)` e persiste resultado em MongoDB
 *
 * ### Auditoria
 * O campo `tipo_param` é determinado por prioridade de chaves:
 * `cpf > cnpj > placa > chave > cep > celular > codigo_fipe > renavam`
 *
 * ### Autenticação ApiBrasil
 * - `Authorization: Bearer <APIBRASIL_API_KEY>`
 * - `DeviceToken: <APIBRASIL_DEVICE_TOKEN>`
 * - Ambas env vars obrigatórias — sem elas, a API retorna 401
 *
 * ### Método HTTP
 * Todas as chamadas usam `POST` (override automático no `ApiBrasilHttpClient`),
 * independente do endpoint consultado.
 */

import { ApiBrasilHttpClient } from '@infrastructure/providers/apibrasil/ApiBrasilHttpClient.js';
import {
  apibrasilRegistry,
  resolveOperation,
} from '@infrastructure/providers/apibrasil/operations/registry.js';
import { apibrasilRequiredParams } from '@infrastructure/providers/apibrasil/operations/validation-map.js';
import type { IApiBrasilOperation } from '@infrastructure/providers/apibrasil/ports/IApiBrasilOperation.js';
import { isCpfOrCnpj } from '@shared/domain/identifiers.js';
import { Hono } from 'hono';
import { handleOp } from '../handleOp.js';

const GW = 'apibrasil';
const BASE_URL = 'https://gateway.apibrasil.io/api/v2';

/**
 * Instancia um `ApiBrasilHttpClient` com credenciais das variáveis de ambiente.
 * Chamado a cada request para garantir que rotação de credenciais seja refletida.
 *
 * @returns {ApiBrasilHttpClient} Cliente HTTP configurado com apiKey e deviceToken
 */
function buildHttp(): ApiBrasilHttpClient {
  const apiKey = process.env['APIBRASIL_API_KEY'] ?? '';
  const deviceToken = process.env['APIBRASIL_DEVICE_TOKEN'] ?? '';
  return new ApiBrasilHttpClient(apiKey, deviceToken, BASE_URL);
}

const apibrasil = new Hono();

/**
 * POST /api/apibrasil/:endpoint
 *
 * Rota dinâmica que resolve qualquer endpoint do marketplace ApiBrasil via registry de operations.
 * Aceita path completo (ex: `cpf-dados`, `cnpj`, `acerta-completo-positivo-pf`).
 *
 * **Validações:**
 * - Parâmetros obrigatórios por endpoint (definidos em `validation-map.ts`)
 * - Formato CPF: exatamente 11 dígitos numéricos
 * - Formato CNPJ: exatamente 14 dígitos numéricos
 *
 * **Resposta de erro:**
 * - `400` — parâmetro obrigatório ausente ou endpoint desconhecido
 * - `422` — CPF/CNPJ com formato inválido
 * - `500` — falha ao resolver a operation (erro interno)
 */
apibrasil.post('/:endpoint{.+}', async (c) => {
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

  // ─── Validação de parâmetros obrigatórios ───
  const required = apibrasilRequiredParams[endpoint];
  if (required) {
    for (const param of required) {
      if (!mergedParams[param]) {
        return c.json({ error: `Parâmetro ${param} obrigatório` }, 400);
      }
    }
  }

  // ─── Verifica se endpoint existe no registry ───
  if (!apibrasilRegistry[endpoint]) {
    return c.json({ error: `Operação desconhecida: ${endpoint}` }, 400);
  }

  let operation: IApiBrasilOperation;
  try {
    operation = resolveOperation(endpoint, buildHttp());
  } catch {
    return c.json({ error: `Erro ao resolver operação: ${endpoint}` }, 500);
  }

  // ─── Identifica tipo_param / param para auditoria ───
  const priorityKeys = [
    'cpf',
    'cnpj',
    'placa',
    'chave',
    'cep',
    'celular',
    'codigo_fipe',
    'renavam',
  ];
  let tipoParam: string | null = null;
  let paramValue: string | null = null;
  for (const key of priorityKeys) {
    if (mergedParams[key]) {
      tipoParam = key;
      paramValue = mergedParams[key] ?? null;
      break;
    }
  }

  // ─── Validação de formato CPF/CNPJ (CNPJ alfanumérico — ver shared/domain/identifiers) ───
  if ((tipoParam === 'cpf' || tipoParam === 'cnpj') && paramValue) {
    if (!isCpfOrCnpj(paramValue)) {
      return c.json(
        {
          error: `Formato inválido para ${tipoParam.toUpperCase()}: CPF deve ter 11 dígitos; CNPJ, 14 caracteres (12 alfanuméricos + 2 DV)`,
        },
        422,
      );
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
