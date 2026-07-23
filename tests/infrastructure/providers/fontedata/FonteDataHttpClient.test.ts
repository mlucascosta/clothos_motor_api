import { FonteDataHttpClient } from '@infrastructure/providers/fontedata/FonteDataHttpClient.js';
import { FonteDataObjectSchema } from '@infrastructure/providers/fontedata/dtos/FonteDataDtos.js';
import { FonteDataQuery } from '@infrastructure/providers/fontedata/operations/FonteDataQuery.js';
import { isLeft, isRight } from '@shared/domain/Either.js';

function mockFetchOnce(status: number, body: unknown, headers: Record<string, string> = {}): void {
  (global.fetch as jest.Mock).mockResolvedValueOnce(
    new Response(body === undefined ? null : JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json', ...headers },
    }),
  );
}

describe('FonteDataHttpClient', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('captura X-Request-Cost (BRL) como centavos e envia X-API-Key', async () => {
    mockFetchOnce(200, { ok: true }, { 'X-Request-Cost': '1.99', 'X-Balance-Remaining': '50.00' });

    const client = new FonteDataHttpClient('fd_live_test', 'https://fake.local/api/v1');
    const result = await client.query<{ ok: boolean }>('consulta-cnpj-receita', { cnpj: '123' });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value.costCents).toBe(199);
      expect(result.value.balanceRemainingCents).toBe(5000);
      expect(result.value.body).toEqual({ ok: true });
    }

    const [url, init] = (global.fetch as jest.Mock).mock.calls[0] as [string, RequestInit];
    expect(url).toContain('/consulta/consulta-cnpj-receita');
    expect(url).toContain('cnpj=123');
    expect((init.headers as Record<string, string>)['X-API-Key']).toBe('fd_live_test');
  });

  it('header de custo ausente vira costCents 0 (nunca NaN)', async () => {
    mockFetchOnce(200, { ok: true });

    const client = new FonteDataHttpClient('fd_live_test', 'https://fake.local/api/v1');
    const result = await client.query('slug', {});

    expect(isRight(result)).toBe(true);
    if (isRight(result)) expect(result.value.costCents).toBe(0);
  });

  it('402 saldo insuficiente vira UPSTREAM_ERROR (falha técnica, não consome)', async () => {
    mockFetchOnce(402, { error: 'insufficient_balance' });

    const client = new FonteDataHttpClient('fd_live_test', 'https://fake.local/api/v1');
    const result = await client.query('slug', {});

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('UPSTREAM_ERROR');
  });
});

describe('FonteDataQuery (RB-13)', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  it('payload que não é objeto JSON vira SCHEMA_MISMATCH — nunca sucesso', async () => {
    mockFetchOnce(200, 'uma string qualquer', { 'X-Request-Cost': '0.16' });

    const client = new FonteDataHttpClient('fd_live_test', 'https://fake.local/api/v1');
    const query = new FonteDataQuery(client, 'consulta-cnpj-receita', FonteDataObjectSchema);
    const result = await query.execute({ cnpj: '123' });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('SCHEMA_MISMATCH');
  });

  it('payload objeto passa o schema e preserva o custo medido', async () => {
    mockFetchOnce(200, { razao_social: 'Acme' }, { 'X-Request-Cost': '0.16' });

    const client = new FonteDataHttpClient('fd_live_test', 'https://fake.local/api/v1');
    const query = new FonteDataQuery(client, 'consulta-cnpj-receita', FonteDataObjectSchema);
    const result = await query.execute({ cnpj: '123' });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      expect(result.value.body).toEqual({ razao_social: 'Acme' });
      expect(result.value.costCents).toBe(16);
    }
  });
});
