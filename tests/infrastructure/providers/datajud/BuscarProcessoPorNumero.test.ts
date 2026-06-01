import { BuscarProcessoPorNumero } from '../../../../src/infrastructure/providers/datajud/operations/BuscarProcessoPorNumero';
import { isLeft, isRight, left, right } from '../../../../src/shared/domain/Either';
import { SourceError } from '../../../../src/shared/domain/errors/SourceError';
import type { IHttpClient } from '../../../../src/shared/infrastructure/IHttpClient';

function makeHttp(mockFn: jest.Mock): IHttpClient {
  return { request: mockFn } as unknown as IHttpClient;
}

describe('BuscarProcessoPorNumero', () => {
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

  it('monta query match por numeroProcesso', async () => {
    const mockFn = jest.fn().mockResolvedValue(right(validResponse));
    const http = makeHttp(mockFn);
    const op = new BuscarProcessoPorNumero(http);

    const result = await op.execute({
      sigla: 'tjsp',
      numeroProcesso: '1004634-81.2023.8.26.0045',
    });

    expect(isRight(result)).toBe(true);
    expect(mockFn).toHaveBeenCalledWith('/api_publica_tjsp/_search', {
      method: 'POST',
      body: {
        query: {
          match: {
            numeroProcesso: '10046348120238260045',
          },
        },
        size: 1,
      },
    });
  });

  it('aceita size customizado', async () => {
    const mockFn = jest.fn().mockResolvedValue(right(validResponse));
    const http = makeHttp(mockFn);
    const op = new BuscarProcessoPorNumero(http);

    await op.execute({
      sigla: 'tjsp',
      numeroProcesso: '1004634-81.2023.8.26.0045',
      size: 10,
    });

    const body = mockFn.mock.calls[0][1].body as Record<string, unknown>;
    expect(body.size).toBe(10);
  });

  it('retorna NOT_FOUND para tribunal inválido', async () => {
    const http = makeHttp(jest.fn());
    const op = new BuscarProcessoPorNumero(http);

    const result = await op.execute({
      sigla: 'invalido',
      numeroProcesso: '1004634-81.2023.8.26.0045',
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('NOT_FOUND');
    }
  });

  it('propaga erro do http client', async () => {
    const http = makeHttp(
      jest.fn().mockResolvedValue(left(new SourceError('AUTH_FAILED', 'datajud'))),
    );
    const op = new BuscarProcessoPorNumero(http);

    const result = await op.execute({
      sigla: 'tjsp',
      numeroProcesso: '1004634-81.2023.8.26.0045',
    });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('AUTH_FAILED');
    }
  });
});
