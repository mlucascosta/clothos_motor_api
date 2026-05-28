/**
 * @fileoverview Testes unitários para DirectData registry e operations.
 * @module tests/infrastructure/providers/directdata/registry.test
 */

import { CadastroPessoaFisica } from '../../../../src/infrastructure/providers/directdata/operations/CadastroPessoaFisica';
import { OFAC } from '../../../../src/infrastructure/providers/directdata/operations/OFAC';
import {
  directDataRegistry,
  resolveOperation,
} from '../../../../src/infrastructure/providers/directdata/operations/registry';

describe('directDataRegistry', () => {
  it('contém 128 operations registradas', () => {
    expect(Object.keys(directDataRegistry).length).toBe(128);
  });

  it('CadastroPessoaFisica está registrada', () => {
    expect(directDataRegistry.CadastroPessoaFisica).toBeDefined();
  });

  it('OFAC está registrada', () => {
    expect(directDataRegistry.OFAC).toBeDefined();
  });

  it('HistoricoObterRetornoConsultaAsync está registrada', () => {
    expect(directDataRegistry.HistoricoObterRetornoConsultaAsync).toBeDefined();
  });
});

describe('resolveOperation', () => {
  const mockHttp = { request: jest.fn() } as unknown as import(
    '../../../../src/shared/infrastructure/IHttpClient',
  ).IHttpClient;

  it('resolve CadastroPessoaFisica para classe concreta', () => {
    const op = resolveOperation('CadastroPessoaFisica', mockHttp);
    expect(op).toBeInstanceOf(CadastroPessoaFisica);
    expect(op.path).toBe('/api/CadastroPessoaFisica');
  });

  it('resolve OFAC para classe concreta', () => {
    const op = resolveOperation('OFAC', mockHttp);
    expect(op).toBeInstanceOf(OFAC);
    expect(op.path).toBe('/api/OFAC');
  });

  it('resolve Historico/ObterRetornoConsultaAsync para classe concreta', () => {
    const op = resolveOperation('HistoricoObterRetornoConsultaAsync', mockHttp);
    expect(op.path).toBe('/api/Historico/ObterRetornoConsultaAsync');
  });

  it('lança erro quando endpoint não está registrado', () => {
    expect(() => resolveOperation('EndpointDesconhecido', mockHttp)).toThrow(
      "Operation 'EndpointDesconhecido' não encontrada no registry",
    );
  });
});
