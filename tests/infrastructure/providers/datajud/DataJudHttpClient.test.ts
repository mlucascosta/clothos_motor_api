import { DataJudHttpClient } from '../../../../src/infrastructure/providers/datajud/DataJudHttpClient';
import { isLeft, isRight } from '../../../../src/shared/domain/Either';

describe('DataJudHttpClient', () => {
  const client = new DataJudHttpClient('test-api-key', 'https://api-publica.datajud.cnj.jus.br');

  it('configura Authorization com APIKey', async () => {
    const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          took: 1,
          timed_out: false,
          hits: { total: { value: 0, relation: 'eq' }, hits: [] },
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        },
      ),
    );

    const result = await client.request('/api_publica_tjsp/_search', {
      method: 'POST',
      body: { query: { match_all: {} } },
    });

    expect(isRight(result)).toBe(true);

    const call = fetchSpy.mock.calls[0];
    const init = call[1] as RequestInit;
    const headers = init.headers as Record<string, string>;

    expect(headers.Authorization).toBe('APIKey test-api-key');
    expect(headers['Content-Type']).toBe('application/json');

    fetchSpy.mockRestore();
  });

  it('retorna AUTH_FAILED em 401', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response('Unauthorized', { status: 401 }));

    const result = await client.request('/api_publica_tjsp/_search');

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('AUTH_FAILED');
      expect(result.value.source).toBe('datajud');
    }

    jest.restoreAllMocks();
  });

  it('retorna NOT_FOUND em 404', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(new Response('Not Found', { status: 404 }));

    const result = await client.request('/api_publica_invalid/_search');

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

    const result = await client.request('/api_publica_tjsp/_search');

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

    const result = await client.request('/api_publica_tjsp/_search');

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

    const result = await client.request('/api_publica_tjsp/_search', { timeoutMs: 1 });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('TIMEOUT');
    }

    jest.restoreAllMocks();
  });
});
