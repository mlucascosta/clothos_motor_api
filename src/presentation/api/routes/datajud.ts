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
import type { Context } from 'hono';
import { rawStore } from '../../../infrastructure/persistence/index.js';
import { DataJudHttpClient } from '../../../infrastructure/providers/datajud/DataJudHttpClient.js';
import {
  DATAJUD_TRIBUNAIS,
  isValidTribunal,
} from '../../../infrastructure/providers/datajud/DataJudTribunais.js';
import {
  DataJudClasseRequestSchema,
  DataJudEnvolvidoRequestSchema,
  DataJudOrgaoRequestSchema,
  DataJudProcessoRequestSchema,
  DataJudSearchRequestSchema,
} from '../../../infrastructure/providers/datajud/dtos/DataJudSearchRequestDto.js';
import { BuscarGenericoDataJud } from '../../../infrastructure/providers/datajud/operations/BuscarGenericoDataJud.js';
import { BuscarProcessoPorNumero } from '../../../infrastructure/providers/datajud/operations/BuscarProcessoPorNumero.js';
import { isLeft } from '../../../shared/domain/Either.js';
import type { Either } from '../../../shared/domain/Either.js';
import type { SourceError } from '../../../shared/domain/errors/SourceError.js';

const GW = 'datajud';
const BASE_URL = 'https://api-publica.datajud.cnj.jus.br';

function buildHttp(): DataJudHttpClient {
  const apiKey = process.env['DATAJUD_APIKEY'] ?? 'APIKey cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==';
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

async function handleOp<T>(
  c: Context,
  opts: { gateway: string; fonte: string; tipo_param: string | null; param: string | null; statusCode?: number },
  execute: () => Promise<Either<SourceError, T>>,
): Promise<Response> {
  const result = await execute();
  const base = { gateway: opts.gateway, fonte: opts.fonte, tipo_param: opts.tipo_param, param: opts.param, created_at: new Date() };
  if (isLeft(result)) {
    rawStore.save({ ...base, result: { message: result.value.message }, status: 'error', error_kind: result.value.kind });
    return c.json({ error: result.value.message, kind: result.value.kind }, 500) as Response;
  }
  rawStore.save({ ...base, result: result.value, status: 'success' });
  return c.json(result.value, (opts.statusCode ?? 200) as import("hono/utils/http-status").ContentfulStatusCode) as Response;
}

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

  const parsed = DataJudSearchRequestSchema.safeParse(body);
  if (!parsed.success)
    return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

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

  const parsed = DataJudProcessoRequestSchema.safeParse(body);
  if (!parsed.success)
    return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

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

  const parsed = DataJudClasseRequestSchema.safeParse(body);
  if (!parsed.success)
    return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const query: Record<string, unknown> = parsed.data.classeCodigo !== undefined
    ? { term: { 'classe.codigo': parsed.data.classeCodigo } }
    : { match: { classe: parsed.data.classeNome } };

  const dslBody = {
    query,
    size: parsed.data.size,
  };

  const paramValue = String(parsed.data.classeCodigo ?? parsed.data.classeNome ?? '');
  const tipoParam = parsed.data.classeCodigo !== undefined ? 'classeCodigo' : 'classeNome';

  return handleOp(c, { gateway: GW, fonte: 'classe', tipo_param: tipoParam, param: paramValue }, () =>
    new BuscarGenericoDataJud(buildHttp()).execute({ sigla, body: dslBody }),
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

  const parsed = DataJudOrgaoRequestSchema.safeParse(body);
  if (!parsed.success)
    return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  const dslBody = {
    query: {
      match: {
        'orgaoJulgador.nome': parsed.data.orgaoJulgador,
      },
    },
    size: parsed.data.size,
  };

  return handleOp(c, { gateway: GW, fonte: 'orgao-julgador', tipo_param: 'orgaoJulgador', param: parsed.data.orgaoJulgador }, () =>
    new BuscarGenericoDataJud(buildHttp()).execute({ sigla, body: dslBody }),
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

  const parsed = DataJudEnvolvidoRequestSchema.safeParse(body);
  if (!parsed.success)
    return c.json({ error: 'Payload inválido', details: parsed.error.issues }, 422);

  if (!parsed.data.nome && !parsed.data.cpfCnpj) {
    return c.json({ error: 'Informe nome ou cpfCnpj' }, 422);
  }

  const must: Array<Record<string, unknown>> = [];
  if (parsed.data.nome) {
    must.push({ match: { 'partes.nome': parsed.data.nome } });
  }
  if (parsed.data.cpfCnpj) {
    must.push({ match: { 'partes.documento': parsed.data.cpfCnpj } });
  }

  const dslBody = {
    query: {
      bool: {
        must,
      },
    },
    size: parsed.data.size,
  };

  const tipoParam = parsed.data.cpfCnpj ? 'cpf_cnpj' : 'nome';
  const paramValue = parsed.data.nome ?? parsed.data.cpfCnpj ?? '';

  return handleOp(c, { gateway: GW, fonte: 'envolvido', tipo_param: tipoParam, param: paramValue }, () =>
    new BuscarGenericoDataJud(buildHttp()).execute({ sigla, body: dslBody }),
  );
});

export { datajud };
