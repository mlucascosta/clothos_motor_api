import { DataJudExecutor } from '../../../../src/infrastructure/providers/datajud/DataJudExecutor';
import { isLeft, isRight, left, right } from '../../../../src/shared/domain/Either';
import { SourceError } from '../../../../src/shared/domain/errors/SourceError';
import type { IHttpClient } from '../../../../src/shared/infrastructure/IHttpClient';

function makeHttp(mockFn: jest.Mock): IHttpClient {
  return { request: mockFn } as unknown as IHttpClient;
}

describe('DataJudExecutor', () => {
  const validResponse = {
    took: 20,
    timed_out: false,
    hits: {
      total: { value: 1, relation: 'eq' },
      hits: [
        {
          _index: 'api_publica_tjsp',
          _id: 'abc',
          _source: { numeroProcesso: '1004634-81.2023.8.26.0045' },
        },
      ],
    },
  };

  const baseContext = {
    tenantSlug: 'acme',
    correlationId: '00000000-0000-0000-0000-000000000001',
    timeoutMs: 30_000,
  };

  it('busca processo TJSP por CNJ', async () => {
    const mockFn = jest.fn().mockResolvedValue(right(validResponse));
    const executor = new DataJudExecutor(makeHttp(mockFn));

    const result = await executor.execute({
      ...baseContext,
      identifier: '1004634-81.2023.8.26.0045',
      identifierKind: 'PROCESSO',
    });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value.source).toBe('datajud');
      expect(result.value.data.numeroProcesso).toBe('1004634-81.2023.8.26.0045');
      expect(result.value.data.tribunal).toBe('tjsp');
      expect(result.value.data.totalHits).toBe(1);
    }

    expect(mockFn).toHaveBeenCalledWith('/api_publica_tjsp/_search', {
      method: 'POST',
      body: {
        query: { match: { numeroProcesso: '1004634-81.2023.8.26.0045' } },
        size: 1,
      },
    });
  });

  it('busca processo TJMS por CNJ', async () => {
    const mockFn = jest.fn().mockResolvedValue(
      right({
        took: 10,
        timed_out: false,
        hits: { total: { value: 0, relation: 'eq' }, hits: [] },
      }),
    );
    const executor = new DataJudExecutor(makeHttp(mockFn));

    const result = await executor.execute({
      ...baseContext,
      identifier: '0931245-20.2025.8.12.0001',
      identifierKind: 'PROCESSO',
    });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value.data.tribunal).toBe('tjms');
      expect(result.value.data.totalHits).toBe(0);
    }
  });

  it('retorna erro se identifierKind não for PROCESSO', async () => {
    const executor = new DataJudExecutor(makeHttp(jest.fn()));

    const result = await executor.execute({
      ...baseContext,
      identifier: '12345678901',
      identifierKind: 'CPF',
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('UPSTREAM_ERROR');
    }
  });

  it('retorna SCHEMA_MISMATCH para CNJ inválido', async () => {
    const executor = new DataJudExecutor(makeHttp(jest.fn()));

    const result = await executor.execute({
      ...baseContext,
      identifier: 'invalido',
      identifierKind: 'PROCESSO',
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('SCHEMA_MISMATCH');
    }
  });

  it('propaga erro do http client', async () => {
    const mockFn = jest.fn().mockResolvedValue(left(new SourceError('TIMEOUT', 'datajud')));
    const executor = new DataJudExecutor(makeHttp(mockFn));

    const result = await executor.execute({
      ...baseContext,
      identifier: '1004634-81.2023.8.26.0045',
      identifierKind: 'PROCESSO',
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('TIMEOUT');
    }
  });

  it('sourceName é "datajud"', () => {
    const executor = new DataJudExecutor(makeHttp(jest.fn()));
    expect(executor.sourceName).toBe('datajud');
  });
});
