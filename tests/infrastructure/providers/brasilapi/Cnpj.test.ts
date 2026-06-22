import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Cnpj } from '../../../../src/infrastructure/providers/brasilapi/operations/Cnpj';
import { isLeft, isRight, left, right } from '../../../../src/shared/domain/Either';
import { SourceError } from '../../../../src/shared/domain/errors/SourceError';
import type { IHttpClient } from '../../../../src/shared/infrastructure/IHttpClient';

/**
 * Fixture = resposta REAL da BrasilAPI (`/cnpj/v1/55760212000169`, M COSTA TECNOLOGIA
 * LTDA — CNPJ do Reduto), capturada em produção. Garante que o DTO valide o contrato
 * vigente da API — e não um shape imaginário (o schema anterior dava SCHEMA_MISMATCH
 * contra a API real).
 */
const REDUTO_CNPJ = '55760212000169';
const realResponse = JSON.parse(
  readFileSync(join(__dirname, '../../../fixtures/brasilapi/cnpj-55760212000169.json'), 'utf-8'),
) as Record<string, unknown>;

function makeHttp(mockFn: jest.Mock): IHttpClient {
  return { request: mockFn } as unknown as IHttpClient;
}

describe('Cnpj (BrasilAPI)', () => {
  it('valida a resposta REAL da BrasilAPI e retorna Right tipado (regressão de drift)', async () => {
    const mockFn = jest.fn().mockResolvedValue(right(realResponse));
    const op = new Cnpj(makeHttp(mockFn));

    const result = await op.execute({ cnpj: REDUTO_CNPJ });

    expect(isRight(result)).toBe(true);
    if (isRight(result)) {
      const dto = result.value;
      expect(dto.cnpj).toBe(REDUTO_CNPJ);
      expect(dto.razao_social).toBe('M COSTA TECNOLOGIA LTDA');
      // Campos que causaram o drift: números, não strings
      expect(typeof dto.situacao_cadastral).toBe('number');
      expect(typeof dto.capital_social).toBe('number');
      expect(typeof dto.codigo_porte).toBe('number');
      // QSA com chaves reais
      expect(Array.isArray(dto.qsa)).toBe(true);
      expect(dto.qsa.length).toBeGreaterThan(0);
      expect(dto.qsa[0]).toHaveProperty('nome_socio');
    }
  });

  it('remove a máscara do CNPJ antes de montar o path', async () => {
    const mockFn = jest.fn().mockResolvedValue(right(realResponse));
    const op = new Cnpj(makeHttp(mockFn));

    await op.execute({ cnpj: '55.760.212/0001-69' });

    expect(mockFn).toHaveBeenCalledWith('/cnpj/v1/55760212000169');
  });

  it('retorna erro quando o parâmetro cnpj está ausente', async () => {
    const mockFn = jest.fn();
    const op = new Cnpj(makeHttp(mockFn));

    const result = await op.execute({});

    expect(isLeft(result)).toBe(true);
    expect(mockFn).not.toHaveBeenCalled();
  });

  it('propaga o Left do cliente HTTP (erro de upstream)', async () => {
    const upstream = left(new SourceError('UPSTREAM_ERROR', 'brasilapi', 'HTTP 500'));
    const mockFn = jest.fn().mockResolvedValue(upstream);
    const op = new Cnpj(makeHttp(mockFn));

    const result = await op.execute({ cnpj: REDUTO_CNPJ });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('UPSTREAM_ERROR');
  });

  it('retorna SCHEMA_MISMATCH quando a resposta não bate com o schema', async () => {
    const mockFn = jest.fn().mockResolvedValue(right({ cnpj: 12345 }));
    const op = new Cnpj(makeHttp(mockFn));

    const result = await op.execute({ cnpj: REDUTO_CNPJ });

    expect(isLeft(result)).toBe(true);
    if (isLeft(result)) expect(result.value.kind).toBe('SCHEMA_MISMATCH');
  });
});
