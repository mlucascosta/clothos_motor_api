import { app } from '../../../src/presentation/api/app';

describe('GET /health', () => {
  it('retorna 200 com status ok', async () => {
    const res = await app.request('/health');
    expect(res.status).toBe(200);
    const body = await res.json() as Record<string, unknown>;
    expect(body['status']).toBe('ok');
    expect(body['service']).toBe('clothos-motor');
    expect(typeof body['timestamp']).toBe('string');
  });

  it('retorna 404 para rota inexistente', async () => {
    const res = await app.request('/nao-existe');
    expect(res.status).toBe(404);
  });
});
