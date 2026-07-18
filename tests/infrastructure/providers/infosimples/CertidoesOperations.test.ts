import { PgfnCertidao } from '@infrastructure/providers/infosimples/operations/PgfnCertidao.js';
import { TstCndt } from '@infrastructure/providers/infosimples/operations/TstCndt.js';
import { isLeft, isRight, left, right } from '@shared/domain/Either.js';
import { SourceError } from '@shared/domain/errors/SourceError.js';
import type { IHttpClient } from '@shared/infrastructure/IHttpClient.js';

function httpReturning(value: unknown): IHttpClient {
  return { request: jest.fn().mockResolvedValue(right(value)) } as unknown as IHttpClient;
}

function envelope(overrides: Record<string, unknown> = {}): Record<string, unknown> {
  return {
    code: 200,
    code_message: 'OK',
    header: { billable: true, price: 0.5 },
    data: [{ cnpj: '55760212000169', situacao: 'negativa' }],
    errors: [],
    data_count: 1,
    ...overrides,
  };
}

describe.each([
  ['PgfnCertidao', (http: IHttpClient) => new PgfnCertidao(http), 'consultas/receita-federal/pgfn'],
  ['TstCndt', (http: IHttpClient) => new TstCndt(http), 'consultas/tst/cndt'],
] as const)('%s', (_name, factory, path) => {
  it('sucesso: parseia a resposta e envia POST com params limpos', async () => {
    const http = httpReturning(envelope());

    const result = await factory(http).execute({ cnpj: '55760212000169', cpf: undefined });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value.data).toEqual([{ cnpj: '55760212000169', situacao: 'negativa' }]);
    }
    expect(http.request).toHaveBeenCalledWith(path, {
      method: 'POST',
      params: { cnpj: '55760212000169' },
    });
  });

  it('erro do provedor: code de falha vira Left mesmo em HTTP 200', async () => {
    const http = httpReturning(
      envelope({ code: 615, code_message: 'source_unavailable', data: null, data_count: 0 }),
    );

    const result = await factory(http).execute({ cnpj: '55760212000169' });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('UPSTREAM_ERROR');
  });

  it('nada consta (code 612) é resposta válida, não erro', async () => {
    const http = httpReturning(
      envelope({ code: 612, code_message: 'inexistent', data: null, data_count: 0 }),
    );

    const result = await factory(http).execute({ cnpj: '55760212000169' });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) expect(result.value.data).toBeNull();
  });

  it('payload inesperado é SCHEMA_MISMATCH, nunca sucesso', async () => {
    const http = httpReturning({ foo: 'bar' });

    const result = await factory(http).execute({ cnpj: '55760212000169' });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('SCHEMA_MISMATCH');
  });

  it('propaga falhas de transporte do HTTP client', async () => {
    const http = {
      request: jest.fn().mockResolvedValue(left(new SourceError('TIMEOUT', 'infosimples'))),
    } as unknown as IHttpClient;

    const result = await factory(http).execute({ cnpj: '55760212000169' });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('TIMEOUT');
  });
});
