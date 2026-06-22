import { ApiBrasilHttpClient } from '../../../../src/infrastructure/providers/apibrasil/ApiBrasilHttpClient';
import { isLeft, isRight } from '../../../../src/shared/domain/Either';

/**
 * A ApiBrasil sinaliza erro com `error: true` no corpo, mantendo HTTP 200.
 * Sem o guard, a consulta PAGA que falhou na origem seria tratada como sucesso
 * (crédito gasto à toa). O guard converte `error: true` em SourceError.
 */
describe('ApiBrasilHttpClient — guard de falso-sucesso (error=true em HTTP 200)', () => {
  function clientWithFetch(jsonBody: unknown) {
    const client = new ApiBrasilHttpClient('k', 'd');
    // injeta um fetch falso que devolve HTTP 200 com o corpo informado
    global.fetch = jest.fn().mockResolvedValue({
      status: 200,
      ok: true,
      json: async () => jsonBody,
    }) as unknown as typeof fetch;
    return client;
  }

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('converte { error: true, message } em Left(UPSTREAM_ERROR)', async () => {
    const client = clientWithFetch({ error: true, message: 'CPF inválido' });

    const result = await client.request('/cpf-dados', { body: { cpf: '123' } });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('UPSTREAM_ERROR');
      expect(result.value.message).toContain('CPF inválido');
    }
  });

  it('mantém Right quando { error: false }', async () => {
    const client = clientWithFetch({ error: false, response: { nome: 'Fulano' } });

    const result = await client.request('/cpf-dados', { body: { cpf: '123' } });

    expect(isRight(result)).toBe(true);
  });
});
