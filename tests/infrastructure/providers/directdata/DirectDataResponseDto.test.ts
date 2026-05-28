/**
 * @fileoverview Testes de schema para DirectDataResponseDto.
 * @module tests/infrastructure/providers/directdata/DirectDataResponseDto.test
 */

import { DirectDataResponseSchema } from '../../../../src/infrastructure/providers/directdata/dtos/DirectDataResponseDto';

describe('DirectDataResponseSchema', () => {
  it('valida resposta completa corretamente', () => {
    const valid = {
      metaDados: {
        apiVersao: '1.0',
        assincrono: false,
        chave: 'test-key',
        consultaNome: 'CadastroPessoaFisica',
        consultaUid: 'uid-123',
        data: '2025-05-28T14:00:00',
        enviarCallback: false,
        gerarComprovante: false,
        ip: '127.0.0.1',
        mensagem: 'Sucesso',
        resultado: 'SUCESSO',
        resultadoId: 1,
        tempoExecucaoMs: 150,
        urlComprovante: null,
        usuario: null,
      },
      retorno: { nome: 'Teste' },
    };

    const result = DirectDataResponseSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('valida resposta mínima com apenas campos obrigatórios', () => {
    const minimal = {
      metaDados: {},
      retorno: null,
    };

    const result = DirectDataResponseSchema.safeParse(minimal);
    expect(result.success).toBe(true);
  });

  it('rejeita quando metaDados está ausente', () => {
    const invalid = {
      retorno: {},
    };

    const result = DirectDataResponseSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('rejeita quando o valor não é um objeto', () => {
    const invalid = 'not-an-object';

    const result = DirectDataResponseSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it('aceita retorno como objeto complexo', () => {
    const complex = {
      metaDados: { resultado: 'SUCESSO' },
      retorno: {
        pessoa: {
          nome: 'JOAO',
          endereco: { rua: 'Rua A', numero: 123 },
        },
        empresas: [{ cnpj: '00000000000191' }],
      },
    };

    const result = DirectDataResponseSchema.safeParse(complex);
    expect(result.success).toBe(true);
  });
});
