import {
  EscavadorExecutor,
  type EscavadorExecutorDeps,
} from '../../../src/infrastructure/providers/escavador/EscavadorExecutor';
import type { IBuscarGeral } from '../../../src/infrastructure/providers/escavador/ports/IBuscarGeral';
import type { IIniciarBuscaLote } from '../../../src/infrastructure/providers/escavador/ports/IIniciarBuscaLote';
import type { IObterBuscaAssincrona } from '../../../src/infrastructure/providers/escavador/ports/IObterBuscaAssincrona';
import type { IObterInstituicao } from '../../../src/infrastructure/providers/escavador/ports/IObterInstituicao';
import type { IObterProcessosInstituicao } from '../../../src/infrastructure/providers/escavador/ports/IObterProcessosInstituicao';
import { isLeft, isRight, left, right } from '../../../src/shared/domain/Either';
import { SourceError } from '../../../src/shared/domain/errors/SourceError';

const CNPJ = '11222333000181';
const CPF = '12345678900';

function makeDeps(overrides: Partial<EscavadorExecutorDeps> = {}): EscavadorExecutorDeps {
  return {
    buscarGeral: {
      execute: jest.fn().mockResolvedValue(
        right({
          items: [{ id: 1, nome: 'Acme Ltda', tipo: 'instituicao', cnpj: CNPJ }],
          total: 1,
        }),
      ),
    } as unknown as IBuscarGeral,
    obterPessoa: { execute: jest.fn().mockResolvedValue(right({ id: 1, nome: 'João' })) } as never,
    obterProcessosPessoa: {
      execute: jest.fn().mockResolvedValue(right({ items: [], total: 0 })),
    } as never,
    obterInstituicao: {
      execute: jest.fn().mockResolvedValue(right({ id: 1, nome: 'Acme Ltda', cnpj: CNPJ })),
    } as unknown as IObterInstituicao,
    obterProcessosInstituicao: {
      execute: jest.fn().mockResolvedValue(right({ items: [], total: 0 })),
    } as unknown as IObterProcessosInstituicao,
    iniciarBuscaLote: {
      execute: jest.fn().mockResolvedValue(right({ items: [{ id: 42 }], status: 'pendente' })),
    } as unknown as IIniciarBuscaLote,
    obterBuscaAssincrona: {
      execute: jest
        .fn()
        .mockResolvedValue(
          right({ id: 42, status: 'concluido', tipo: 'cpf', resultado: { processos: [] } }),
        ),
    } as unknown as IObterBuscaAssincrona,
    ...overrides,
  };
}

const baseContext = {
  tenantSlug: 'acme',
  correlationId: '00000000-0000-0000-0000-000000000001',
  timeoutMs: 30_000,
};

describe('EscavadorExecutor', () => {
  describe('CNPJ', () => {
    it('retorna Right com dados da instituição', async () => {
      const executor = new EscavadorExecutor(makeDeps());
      const result = await executor.execute({
        ...baseContext,
        identifier: CNPJ,
        identifierKind: 'CNPJ',
      });

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.value.source).toBe('escavador');
        expect(result.value.data.tipo).toBe('instituicao');
      }
    });

    it('retorna NOT_FOUND quando busca não encontra entidade', async () => {
      const deps = makeDeps({
        buscarGeral: {
          execute: jest.fn().mockResolvedValue(right({ items: [], total: 0 })),
        } as unknown as IBuscarGeral,
      });
      const executor = new EscavadorExecutor(deps);
      const result = await executor.execute({
        ...baseContext,
        identifier: CNPJ,
        identifierKind: 'CNPJ',
      });

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) expect(result.value.kind).toBe('NOT_FOUND');
    });

    it('propaga erro de buscarGeral', async () => {
      const deps = makeDeps({
        buscarGeral: {
          execute: jest.fn().mockResolvedValue(left(new SourceError('AUTH_FAILED', 'escavador'))),
        } as unknown as IBuscarGeral,
      });
      const executor = new EscavadorExecutor(deps);
      const result = await executor.execute({
        ...baseContext,
        identifier: CNPJ,
        identifierKind: 'CNPJ',
      });

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) expect(result.value.kind).toBe('AUTH_FAILED');
    });
  });

  describe('CPF', () => {
    it('retorna Right após polling concluído', async () => {
      const executor = new EscavadorExecutor(makeDeps());
      const result = await executor.execute({
        ...baseContext,
        identifier: CPF,
        identifierKind: 'CPF',
      });

      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.value.source).toBe('escavador');
        expect(result.value.data.tipo).toBe('pessoa');
        expect(result.value.data.busca_assincrona_ids).toEqual([42]);
      }
    });

    it('retorna Left(TIMEOUT) quando polling não conclui dentro do budget', async () => {
      const deps = makeDeps({
        obterBuscaAssincrona: {
          execute: jest
            .fn()
            .mockResolvedValue(right({ id: 42, status: 'em_andamento', tipo: 'cpf' })),
        } as unknown as IObterBuscaAssincrona,
      });
      const executor = new EscavadorExecutor(deps);
      const result = await executor.execute({
        ...baseContext,
        identifier: CPF,
        identifierKind: 'CPF',
        timeoutMs: 1,
      });

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.value.kind).toBe('UPSTREAM_ERROR');
      }
    });

    it('retorna Left(UPSTREAM_ERROR) quando busca assíncrona retorna erro', async () => {
      const deps = makeDeps({
        obterBuscaAssincrona: {
          execute: jest.fn().mockResolvedValue(right({ id: 42, status: 'erro', tipo: 'cpf' })),
        } as unknown as IObterBuscaAssincrona,
      });
      const executor = new EscavadorExecutor(deps);
      const result = await executor.execute({
        ...baseContext,
        identifier: CPF,
        identifierKind: 'CPF',
      });

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.value.kind).toBe('UPSTREAM_ERROR');
      }
    });
  });

  it('sourceName é "escavador"', () => {
    const executor = new EscavadorExecutor(makeDeps());
    expect(executor.sourceName).toBe('escavador');
  });
});
