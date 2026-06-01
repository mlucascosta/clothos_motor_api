/**
 * @fileoverview Router Infosimples — Motor de Consultas Reduto Finder
 * @module infosimples
 *
 * Rota dinâmica POST /api/infosimples/:endpoint{.+}
 * Resolve qualquer path Infosimples via registry de operations.
 *
 * Autenticação: query param `token` via InfosimplesHttpClient (env INFOSIMPLES_TOKEN).
 */

import { InfosimplesHttpClient } from '@infrastructure/providers/infosimples/InfosimplesHttpClient.js';
import { resolveOperation } from '@infrastructure/providers/infosimples/operations/registry.js';
import type {
  OneOfGroup,
  ValidationRule,
} from '@infrastructure/providers/infosimples/operations/validation-map.js';
import { infosimplesRequiredParams } from '@infrastructure/providers/infosimples/operations/validation-map.js';
import type { IInfosimplesOperation } from '@infrastructure/providers/infosimples/ports/IInfosimplesOperation.js';
import { Hono } from 'hono';
import { handleOp } from '../handleOp.js';

const GW = 'infosimples';
const BASE_URL = 'https://api.infosimples.com/api/v2/';

function buildHttp(): InfosimplesHttpClient {
  const token = process.env['INFOSIMPLES_TOKEN'] ?? '';
  return new InfosimplesHttpClient(token, BASE_URL);
}

function isOneOfGroup(rule: string | OneOfGroup): rule is OneOfGroup {
  return typeof rule === 'object' && 'oneOf' in rule;
}

/**
 * Valida params de query contra as regras do validation-map.
 * Retorna mensagem de erro ou null se válido.
 */
function validateParams(rules: ValidationRule, query: Record<string, string>): string | null {
  for (const rule of rules) {
    if (isOneOfGroup(rule)) {
      const present = rule.oneOf.some((p) => query[p]);
      if (!present) {
        return `Pelo menos um dos parâmetros obrigatórios: ${rule.oneOf.join(', ')}`;
      }
    } else {
      if (!query[rule]) {
        return `Parâmetro ${rule} obrigatório`;
      }
    }
  }
  return null;
}

const infosimples = new Hono();

/**
 * POST /api/infosimples/:endpoint
 *
 * Aceita path completo (ex: consultas/cenprot-sp/protestos)
 * ou alias curto (ex: cpf, cnpj).
 */
infosimples.post('/:endpoint{.+}', async (c) => {
  const endpoint = c.req.param('endpoint');
  const query = c.req.query();

  const registryKey = endpoint.toLowerCase();

  // ─── Validação de parâmetros ───
  const rules = infosimplesRequiredParams[registryKey];
  if (rules) {
    const err = validateParams(rules, query);
    if (err) return c.json({ error: err }, 400);
  }

  // ─── Resolve operation ───
  let operation: IInfosimplesOperation;
  try {
    operation = resolveOperation(registryKey, buildHttp());
  } catch {
    return c.json({ error: `Operação desconhecida: ${endpoint}` }, 500);
  }

  // ─── Auditoria: identificar tipo_param/param ───
  const priorityKeys = ['cpf', 'cnpj', 'placa', 'renavam', 'nome'];
  let tipoParam: string | null = null;
  let paramValue: string | null = null;
  for (const key of priorityKeys) {
    if (query[key]) {
      tipoParam = key;
      paramValue = query[key];
      break;
    }
  }

  return handleOp(
    c,
    { gateway: GW, fonte: endpoint, tipo_param: tipoParam, param: paramValue },
    () => operation.execute(query),
  );
});

export { infosimples };
