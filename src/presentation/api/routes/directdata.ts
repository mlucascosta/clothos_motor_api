/**
 * @fileoverview Router de Rotas para API DirectData — Motor de Consultas Reduto Finder
 *
 * @module directdata
 *
 * ## Arquitetura DDD/SOLID
 *
 * Cada endpoint do marketplace DirectData é representado por uma **classe única**
 * que implementa `IDirectDataOperation` (port), estende `AbstractDirectDataOperation`
 * e define apenas seu `path`. O registry (`operations/registry.ts`) mapeia nome → factory.
 *
 * ### Estrutura
 * ```
 * src/infrastructure/providers/directdata/
 * ├── ports/IDirectDataOperation.ts       # Contrato (interface)
 * ├── operations/AbstractDirectDataOperation.ts  # Base com execute() genérico
 * ├── operations/CadastroPessoaFisica.ts  # Classe concreta (apenas path)
 * ├── operations/OFAC.ts                  # Classe concreta (apenas path)
 * ├── operations/registry.ts              # Factory map (128 entries)
 * ├── operations/validation-map.ts        # Params obrigatórios por endpoint
 * └── dtos/DirectDataResponseDto.ts       # Schema Zod de resposta
 * ```
 *
 * ### Pipeline
 * 1. `/:endpoint` resolve a operation via `resolveOperation()`
 * 2. Valida params obrigatórios contra `directDataRequiredParams`
 * 3. Executa `operation.execute()` (HTTP + validação Zod)
 * 4. Persiste em `rawStore` (MongoDB) para auditoria
 *
 * ## Autenticação
 * - Query param `TOKEN` via `DirectDataHttpClient`
 * - Env var `DIRECTDATA_TOKEN` ou `DIRECTDATA_APIKEY`
 */

import { Hono } from 'hono';
import { handleOp } from '../handleOp.js';
import { DirectDataHttpClient } from '@infrastructure/providers/directdata/DirectDataHttpClient.js';
import type { IDirectDataOperation } from '@infrastructure/providers/directdata/ports/IDirectDataOperation.js';
import { resolveOperation } from '@infrastructure/providers/directdata/operations/registry.js';
import { directDataRequiredParams } from '@infrastructure/providers/directdata/operations/validation-map.js';

const GW = 'directdata';
const BASE_URL = 'https://apiv3.directd.com.br';

function buildHttp(): DirectDataHttpClient {
  const token = process.env['DIRECTDATA_TOKEN'] ?? process.env['DIRECTDATA_APIKEY'] ?? '';
  return new DirectDataHttpClient(token, BASE_URL);
}

const directdata = new Hono();

/**
 * GET /api/directdata/:endpoint
 *
 * Rota dinâmica que resolve qualquer endpoint do marketplace DirectData
 * via registry de operations. Valida parâmetros obrigatórios e persiste
 * resultado em MongoDB.
 */
directdata.get('/:endpoint{.+}', async (c) => {
  const endpoint = c.req.param('endpoint');
  const query = c.req.query();

  // Normaliza nome do endpoint para o registry (remove barras)
  const registryKey = endpoint.replace(/\//g, '');

  // ─── Validação de parâmetros obrigatórios ───
  const required = directDataRequiredParams[registryKey];
  if (required) {
    for (const param of required) {
      if (!query[param]) {
        return c.json({ error: `Parâmetro ${param} obrigatório` }, 400);
      }
    }
  }

  // ─── Resolve operation via factory (DDD + Dependency Inversion) ───
  let operation: IDirectDataOperation<unknown>;
  try {
    operation = resolveOperation(registryKey, buildHttp());
  } catch {
    return c.json({ error: `Operação desconhecida: ${endpoint}` }, 400);
  }

  // ─── Identifica tipo_param / param para auditoria ───
  const priorityKeys = [
    'CPF',
    'CNPJ',
    'PLACA',
    'CHAVE',
    'NOME',
    'DOCUMENTO',
    'CURP',
    'DNI',
    'ConsultaUid',
  ];
  let tipoParam: string | null = null;
  let paramValue: string | null = null;
  for (const key of priorityKeys) {
    if (query[key]) {
      tipoParam = key.toLowerCase();
      paramValue = query[key];
      break;
    }
  }

  if ((tipoParam === 'cpf' || tipoParam === 'cnpj' || tipoParam === 'cpf_cnpj') && paramValue) {
    const digits = paramValue.replace(/\D/g, '');
    if (digits.length !== 11 && digits.length !== 14) {
      return c.json({ error: `Formato inválido para ${tipoParam.toUpperCase()}: deve ter 11 (CPF) ou 14 (CNPJ) dígitos` }, 422);
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
    () => operation.execute(query),
  );
});

export { directdata };
