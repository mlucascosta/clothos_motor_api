/**
 * @fileoverview Testes de retry/backoff do FetchHttpClient.
 * Valida que apenas UPSTREAM_ERROR e TIMEOUT disparam retry.
 * @module tests/shared/infrastructure/FetchHttpClient.retry
 */

import { isLeft, isRight } from '../../../src/shared/domain/Either';
import { FetchHttpClient } from '../../../src/shared/infrastructure/FetchHttpClient';

function makeClient(overrides?: { maxRetries?: number; retryBaseDelayMs?: number }) {
  return new FetchHttpClient({
    baseUrl: 'https://api.test.com',
    sourceName: 'test-source',
    maxRetries: overrides?.maxRetries ?? 3, // 3 é explícito aqui para testar retry
    retryBaseDelayMs: overrides?.retryBaseDelayMs ?? 1, // 1ms para testes rápidos
  });
}

describe('FetchHttpClient — retry/backoff', () => {
  let fetchSpy: jest.SpyInstance;

  afterEach(() => {
    fetchSpy?.mockRestore();
  });

  it('não faz retry em 401 AUTH_FAILED (erro não-transitório)', async () => {
    fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response('Unauthorized', { status: 401 }));

    const result = await makeClient().request('/endpoint');

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('AUTH_FAILED');
    expect(fetchSpy).toHaveBeenCalledTimes(1); // sem retry
  });

  it('não faz retry em 404 NOT_FOUND', async () => {
    fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response('Not Found', { status: 404 }));

    const result = await makeClient().request('/endpoint');

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('NOT_FOUND');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('não faz retry em 429 RATE_LIMITED', async () => {
    fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response('Too Many Requests', { status: 429 }));

    const result = await makeClient().request('/endpoint');

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('RATE_LIMITED');
    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });

  it('faz retry em 500 UPSTREAM_ERROR e retorna sucesso na 2ª tentativa', async () => {
    const successBody = JSON.stringify({ ok: true });
    fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response('Server Error', { status: 500 }))
      .mockResolvedValueOnce(
        new Response(successBody, {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    const result = await makeClient().request<{ ok: boolean }>('/endpoint');

    expect(isRight(result)).toBe(true);
    if (isRight(result)) expect(result.value.ok).toBe(true);
    expect(fetchSpy).toHaveBeenCalledTimes(2);
  });

  it('faz retry em TIMEOUT e retorna sucesso na 3ª tentativa', async () => {
    const successBody = JSON.stringify({ data: 'found' });
    const timeoutError = new DOMException('The operation timed out.', 'TimeoutError');

    fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockRejectedValueOnce(timeoutError)
      .mockRejectedValueOnce(timeoutError)
      .mockResolvedValueOnce(
        new Response(successBody, {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }),
      );

    const result = await makeClient().request<{ data: string }>('/endpoint');

    expect(isRight(result)).toBe(true);
    if (isRight(result)) expect(result.value.data).toBe('found');
    expect(fetchSpy).toHaveBeenCalledTimes(3);
  });

  it('retorna último erro após esgotar maxRetries', async () => {
    fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response('Internal Error', { status: 503 }));

    const result = await makeClient({ maxRetries: 3 }).request('/endpoint');

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('UPSTREAM_ERROR');
    expect(fetchSpy).toHaveBeenCalledTimes(3); // 1 + 2 retries
  });

  it('maxRetries=1 (padrão) não faz retry em UPSTREAM_ERROR', async () => {
    fetchSpy = jest
      .spyOn(global, 'fetch')
      .mockResolvedValue(new Response('Error', { status: 500 }));

    await makeClient({ maxRetries: 1 }).request('/endpoint');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
  });
});
