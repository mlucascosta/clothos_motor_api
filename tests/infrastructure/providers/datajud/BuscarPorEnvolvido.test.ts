import { BuscarPorEnvolvido } from '../../../../src/infrastructure/providers/datajud/operations/BuscarPorEnvolvido';
import { isLeft } from '../../../../src/shared/domain/Either';
import type { IHttpClient } from '../../../../src/shared/infrastructure/IHttpClient';

/**
 * A API pública do DataJud (CNJ) não expõe dados de partes — verificado contra
 * resposta real (api_publica_tjsp, 2026-06): `_source` não tem `partes`. Buscar
 * por nome/CPF/CNPJ retornaria 0 hits silenciosamente, fazendo o dossiê tratar
 * "sem resultados" como "sem processos". A operação deve falhar explicitamente.
 */
describe('BuscarPorEnvolvido (DataJud)', () => {
  const httpSpy = jest.fn();
  const http = { request: httpSpy } as unknown as IHttpClient;

  it('retorna erro explícito (não suportado) e NÃO faz chamada HTTP', async () => {
    const op = new BuscarPorEnvolvido(http);

    const result = await op.execute({ sigla: 'tjsp', cpfCnpj: '55760212000169' });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) {
      expect(result.value.kind).toBe('UPSTREAM_ERROR');
      expect(result.value.message).toMatch(/não expõe dados de partes|não é suportada/i);
    }
    // nunca emite query inútil (não desperdiça chamada)
    expect(httpSpy).not.toHaveBeenCalled();
  });
});
