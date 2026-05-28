/**
 * @fileoverview Testes unitários para DirectDataHttpClient.
 * @module tests/infrastructure/providers/directdata/DirectDataHttpClient.test
 */

import { DirectDataHttpClient } from '../../../../src/infrastructure/providers/directdata/DirectDataHttpClient';
import { isLeft, isRight } from '../../../../src/shared/domain/Either';

describe('DirectDataHttpClient', () => {
  const client = new DirectDataHttpClient('test-api-key', 'https://apiv3.directd.com.br');

  it('injeta TOKEN como query param em todas as requisições', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ metaDados: { resultado: 'SUCESSO' }, retorno: {} }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    );

    const result = await client.request('/api/CadastroPessoaFisica', {
      method: 'GET',
      params: { CPF: '455661039898' },
    });

    expect(isRight(result)).toBe(true);

    const call = fetchSpy.mock.calls[0];
    const url = call[0] as string;

    expect(url).toContain('TOKEN=test-api-key');
    expect(url).toContain('CPF=455661039898');

    const init = call[1] as RequestInit;
    const headers = init.headers as Record<string, string>;
    expect(headers.Authorization).toBeUndefined();
    expect(headers.Accept).toBe('application/json');

    fetchSpy.mockRestore();
  });

  it('retorna AUTH_FAILED em 401', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response('Unauthorized', { status: 401 }));

    const result = await client.request('/api/CadastroPessoaFisica');

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('AUTH_FAILED');
      expect(result.value.source).toBe('directdata');
    }

    jest.restoreAllMocks();
  });

  it('retorna NOT_FOUND em 404', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response('Not Found', { status: 404 }));

    const result = await client.request('/api/EndpointInexistente');

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('NOT_FOUND');
    }

    jest.restoreAllMocks();
  });

  it('retorna RATE_LIMITED em 429', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response('Too Many Requests', { status: 429 }));

    const result = await client.request('/api/CadastroPessoaFisica');

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('RATE_LIMITED');
    }

    jest.restoreAllMocks();
  });

  it('retorna UPSTREAM_ERROR em 500', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response('Internal Server Error', { status: 500 }));

    const result = await client.request('/api/CadastroPessoaFisica');

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('UPSTREAM_ERROR');
    }

    jest.restoreAllMocks();
  });

  it('retorna TIMEOUT em abort timeout', async () => {
    jest
      .spyOn(global, 'fetch')
      .mockRejectedValue(new DOMException('The operation timed out.', 'TimeoutError'));

    const result = await client.request('/api/CadastroPessoaFisica', { timeoutMs: 1 });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('TIMEOUT');
    }

    jest.restoreAllMocks();
  });
});
