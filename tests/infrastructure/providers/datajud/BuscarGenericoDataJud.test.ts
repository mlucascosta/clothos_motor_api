import { DataJudSearchResponseSchema } from '../../../../src/infrastructure/providers/datajud/dtos/DataJudSearchResponseDto';
import { BuscarGenericoDataJud } from '../../../../src/infrastructure/providers/datajud/operations/BuscarGenericoDataJud';
import { isLeft, isRight, left, right } from '../../../../src/shared/domain/Either';
import { SourceError } from '../../../../src/shared/domain/errors/SourceError';
import type { IHttpClient } from '../../../../src/shared/infrastructure/IHttpClient';

function makeHttp(mockFn: jest.Mock): IHttpClient {
  return { request: mockFn } as unknown as IHttpClient;
}

describe('BuscarGenericoDataJud', () => {
  const validResponse = {
    took: 45,
    timed_out: false,
    hits: {
      total: { value: 1, relation: 'eq' },
      hits: [
        {
          _index: 'api_publica_tjsp',
          _id: 'abc',
          _source: { numeroProcesso: '123' },
        },
      ],
    },
  };

  it('retorna Right com resposta parseada', async () => {
    const http = makeHttp(jest.fn().mockResolvedValue(right(validResponse)));
    const op = new BuscarGenericoDataJud(http);

    const result = await op.execute({
      sigla: 'tjsp',
      body: { query: { match_all: {} }, size: 1 },
    });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value.took).toBe(45);
      expect(result.value.hits.total.value).toBe(1);
    }
  });

  it('retorna NOT_FOUND para tribunal inválido', async () => {
    const http = makeHttp(jest.fn());
    const op = new BuscarGenericoDataJud(http);

    const result = await op.execute({
      sigla: 'invalido',
      body: { query: { match_all: {} } },
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('NOT_FOUND');
      expect(result.value.message).toContain('invalido');
    }
  });

  it('propaga erro do http client', async () => {
    const http = makeHttp(jest.fn().mockResolvedValue(left(new SourceError('TIMEOUT', 'datajud'))));
    const op = new BuscarGenericoDataJud(http);

    const result = await op.execute({
      sigla: 'tjsp',
      body: { query: { match_all: {} } },
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('TIMEOUT');
    }
  });

  it('retorna SCHEMA_MISMATCH para resposta inválida', async () => {
    const http = makeHttp(jest.fn().mockResolvedValue(right({ invalid: true })));
    const op = new BuscarGenericoDataJud(http);

    const result = await op.execute({
      sigla: 'tjsp',
      body: { query: { match_all: {} } },
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('SCHEMA_MISMATCH');
    }
  });

  it('chama http.request com path correto', async () => {
    const mockFn = jest.fn().mockResolvedValue(right(validResponse));
    const http = makeHttp(mockFn);
    const op = new BuscarGenericoDataJud(http);

    await op.execute({
      sigla: 'tjsp',
      body: { query: { match_all: {} }, size: 5 },
    });

    expect(mockFn).toHaveBeenCalledWith('/api_publica_tjsp/_search', {
      method: 'POST',
      body: { query: { match_all: {} }, size: 5 },
    });
  });
});

describe('DataJudSearchResponseSchema', () => {
  it('valida resposta correta', () => {
    const parsed = DataJudSearchResponseSchema.safeParse({
      took: 10,
      timed_out: false,
      hits: {
        total: { value: 0, relation: 'eq' },
        hits: [],
      },
    });

    expect(parsed.success).toBe(true);
  });

  it('rejeita resposta sem campo took', () => {
    const parsed = DataJudSearchResponseSchema.safeParse({
      timed_out: false,
      hits: {
        total: { value: 0, relation: 'eq' },
        hits: [],
      },
    });

    expect(parsed.success).toBe(false);
  });

  it('rejeita resposta sem campo hits', () => {
    const parsed = DataJudSearchResponseSchema.safeParse({
      took: 10,
      timed_out: false,
    });

    expect(parsed.success).toBe(false);
  });
});
