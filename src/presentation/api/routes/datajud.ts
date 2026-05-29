/**
 * @fileoverview Router de rotas para API Pública DataJud (CNJ).
 *
 * @module datajud
 *
 * ## Contexto
 * Expõe endpoints para consulta à API Pública do DataJud,
 * autenticada via APIKey, com suporte a busca DSL Elasticsearch.
 *
 * ## Endpoints
 * - `GET  /tribunais` — Lista todos os 91 tribunais disponíveis
 * - `POST /buscar?tribunal={sigla}` — Busca genérica com DSL livre
 * - `POST /processo?tribunal={sigla}` — Busca por número de processo
 * - `POST /classe?tribunal={sigla}` — Busca por classe processual
 * - `POST /orgao-julgador?tribunal={sigla}` — Busca por órgão julgador
 * - `POST /envolvido?tribunal={sigla}` — Busca por nome ou CPF/CNPJ de envolvido
 *
 * ## Autenticação
 * APIKey via env var `DATAJUD_APIKEY`. Header injetado automaticamente.
 */

import { Hono } from 'hono';
import { handleOp } from '../handleOp.js';
import { parseInput } from '../parseInput.js';
import { DataJudHttpClient } from '../../../infrastructure/providers/datajud/DataJudHttpClient.js';
import {
  DATAJUD_TRIBUNAIS,
  isValidTribunal,
} from '../../../infrastructure/providers/datajud/DataJudTribunais.js';
import {
  DataJudEnvolvidoRequestSchema,
  DataJudOrgaoRequestSchema,
  DataJudClasseRequestSchema,
  DataJudProcessoRequestSchema,
  DataJudSearchRequestSchema,
} from '../../../infrastructure/providers/datajud/dtos/DataJudSearchRequestDto.js';
import { BuscarGenericoDataJud } from '../../../infrastructure/providers/datajud/operations/BuscarGenericoDataJud.js';
import { BuscarProcessoPorNumero } from '../../../infrastructure/providers/datajud/operations/BuscarProcessoPorNumero.js';
import { BuscarPorClasse } from '../../../infrastructure/providers/datajud/operations/BuscarPorClasse.js';
import { BuscarPorOrgaoJulgador } from '../../../infrastructure/providers/datajud/operations/BuscarPorOrgaoJulgador.js';
import { BuscarPorEnvolvido } from '../../../infrastructure/providers/datajud/operations/BuscarPorEnvolvido.js';

const GW = 'datajud';
const BASE_URL = 'https://api-publica.datajud.cnj.jus.br';

function buildHttp(): DataJudHttpClient {
  const apiKey = process.env['DATAJUD_APIKEY'] ?? '';
  return new DataJudHttpClient(apiKey, BASE_URL);
}

function validateTribunal(c: { req: { query: (key: string) => string | undefined } }):
  | string
  | null {
  const sigla = c.req.query('tribunal') ?? '';
  if (!sigla || !isValidTribunal(sigla)) return null;
  return sigla.toLowerCase();
}

const datajud = new Hono();

/**
 * GET /tribunais
 * Lista todos os tribunais disponíveis no DataJud.
 */
datajud.get('/tribunais', (c) => {
  return c.json(
    DATAJUD_TRIBUNAIS.map((t) => ({ sigla: t.sigla, nome: t.nome })),
    200,
  );
});

/**
 * POST /buscar?tribunal={sigla}
 * Busca genérica com DSL Elasticsearch livre.
 */
datajud.post('/buscar', async (c) => {
  const sigla = validateTribunal(c);
  if (!sigla) return c.json({ error: 'Parâmetro tribunal obrigatório e válido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(DataJudSearchRequestSchema, body);
  if (!parsed.ok)
    return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOp(c, { gateway: GW, fonte: 'buscar', tipo_param: 'tribunal_dsl', param: sigla }, () =>
    new BuscarGenericoDataJud(buildHttp()).execute({ sigla, body: parsed.data }),
  );
});

/**
 * POST /processo?tribunal={sigla}
 * Busca por número de processo (match exato).
 */
datajud.post('/processo', async (c) => {
  const sigla = validateTribunal(c);
  if (!sigla) return c.json({ error: 'Parâmetro tribunal obrigatório e válido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(DataJudProcessoRequestSchema, body);
  if (!parsed.ok)
    return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOp(c, { gateway: GW, fonte: 'processo', tipo_param: 'numeroProcesso', param: parsed.data.numeroProcesso }, () =>
    new BuscarProcessoPorNumero(buildHttp()).execute({
      sigla,
      numeroProcesso: parsed.data.numeroProcesso,
      size: parsed.data.size,
    }),
  );
});

/**
 * POST /classe?tribunal={sigla}
 * Busca por classe processual (nome ou código TPU).
 */
datajud.post('/classe', async (c) => {
  const sigla = validateTribunal(c);
  if (!sigla) return c.json({ error: 'Parâmetro tribunal obrigatório e válido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(DataJudClasseRequestSchema, body);
  if (!parsed.ok)
    return c.json({ error: parsed.error, details: parsed.details }, 422);

  const paramValue = String(parsed.data.classeCodigo ?? parsed.data.classeNome ?? '');
  const tipoParam = parsed.data.classeCodigo !== undefined ? 'classeCodigo' : 'classeNome';

  return handleOp(c, { gateway: GW, fonte: 'classe', tipo_param: tipoParam, param: paramValue }, () =>
    new BuscarPorClasse(buildHttp()).execute({
      sigla,
      classeNome: parsed.data.classeNome,
      classeCodigo: parsed.data.classeCodigo,
      size: parsed.data.size,
    }),
  );
});

/**
 * POST /orgao-julgador?tribunal={sigla}
 * Busca por órgão julgador.
 */
datajud.post('/orgao-julgador', async (c) => {
  const sigla = validateTribunal(c);
  if (!sigla) return c.json({ error: 'Parâmetro tribunal obrigatório e válido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(DataJudOrgaoRequestSchema, body);
  if (!parsed.ok)
    return c.json({ error: parsed.error, details: parsed.details }, 422);

  return handleOp(c, { gateway: GW, fonte: 'orgao-julgador', tipo_param: 'orgaoJulgador', param: parsed.data.orgaoJulgador }, () =>
    new BuscarPorOrgaoJulgador(buildHttp()).execute({
      sigla,
      orgaoJulgador: parsed.data.orgaoJulgador,
      size: parsed.data.size,
    }),
  );
});

/**
 * POST /envolvido?tribunal={sigla}
 * Busca por nome ou CPF/CNPJ de envolvido.
 */
datajud.post('/envolvido', async (c) => {
  const sigla = validateTribunal(c);
  if (!sigla) return c.json({ error: 'Parâmetro tribunal obrigatório e válido' }, 400);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: 'Body inválido' }, 400);

  const parsed = parseInput(DataJudEnvolvidoRequestSchema, body);
  if (!parsed.ok)
    return c.json({ error: parsed.error, details: parsed.details }, 422);

  if (!parsed.data.nome && !parsed.data.cpfCnpj) {
    return c.json({ error: 'Informe nome ou cpfCnpj' }, 422);
  }

  const tipoParam = parsed.data.cpfCnpj ? 'cpf_cnpj' : 'nome';
  const paramValue = parsed.data.nome ?? parsed.data.cpfCnpj ?? '';

  return handleOp(c, { gateway: GW, fonte: 'envolvido', tipo_param: tipoParam, param: paramValue }, () =>
    new BuscarPorEnvolvido(buildHttp()).execute({
      sigla,
      nome: parsed.data.nome,
      cpfCnpj: parsed.data.cpfCnpj,
      size: parsed.data.size,
    }),
  );
});

export { datajud };
