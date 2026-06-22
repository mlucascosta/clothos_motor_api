/**
 * @fileoverview Testes unitários para InfosimplesCodeHandler.
 * Cobre classificação de todos os grupos de código e o comportamento
 * de parseInfosimplesResponse como substituto de parseOrSchemaError.
 * @module tests/infrastructure/providers/infosimples/InfosimplesCodeHandler.test
 */

import { z } from 'zod';
import {
  classifyInfosimplesCode,
  parseInfosimplesResponse,
} from '../../../../src/infrastructure/providers/infosimples/InfosimplesCodeHandler';
import { isLeft, isRight } from '../../../../src/shared/domain/Either';

// ---------------------------------------------------------------------------
// Schema auxiliar utilizado nos testes de parseInfosimplesResponse.
// Representa a estrutura mínima de uma resposta real de operation Infosimples.
// ---------------------------------------------------------------------------
const TestResponseSchema = z.object({
  code: z.number(),
  code_message: z.string().optional(),
  header: z.object({}).passthrough(),
  data: z.array(z.record(z.unknown())).nullable(),
  errors: z.array(z.string()),
  data_count: z.number(),
});

type TestResponse = z.infer<typeof TestResponseSchema>;

function makeResponse(overrides: Partial<TestResponse> = {}): TestResponse {
  return {
    code: 200,
    code_message: 'OK',
    header: {},
    data: [],
    errors: [],
    data_count: 0,
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// classifyInfosimplesCode
// ---------------------------------------------------------------------------

describe('classifyInfosimplesCode', () => {
  describe('códigos de sucesso', () => {
    it('code 200 (single_result) retorna outcome success', () => {
      expect(classifyInfosimplesCode(200)).toEqual({ outcome: 'success' });
    });

    it('code 201 (multiple_results) retorna outcome success', () => {
      expect(classifyInfosimplesCode(201)).toEqual({ outcome: 'success' });
    });

    it('code 612 (inexistent / nada consta) retorna outcome success — invariante de crédito', () => {
      // 612 é resposta legítima e faturável; não deve gerar Left nem retentativas.
      expect(classifyInfosimplesCode(612)).toEqual({ outcome: 'success' });
    });

    it('code 619 (converted_parameters) retorna outcome success', () => {
      expect(classifyInfosimplesCode(619)).toEqual({ outcome: 'success' });
    });
  });

  describe('erros transitórios — TIMEOUT', () => {
    it('code 605 (timeout) retorna kind TIMEOUT', () => {
      expect(classifyInfosimplesCode(605)).toEqual({ outcome: 'error', kind: 'TIMEOUT' });
    });

    it('code 614 (try_again) retorna kind TIMEOUT', () => {
      expect(classifyInfosimplesCode(614)).toEqual({ outcome: 'error', kind: 'TIMEOUT' });
    });
  });

  describe('erros transitórios — RATE_LIMITED', () => {
    it('code 617 (service_overloaded) retorna kind RATE_LIMITED', () => {
      expect(classifyInfosimplesCode(617)).toEqual({ outcome: 'error', kind: 'RATE_LIMITED' });
    });

    it('code 618 (rate_limit_exceeded) retorna kind RATE_LIMITED', () => {
      expect(classifyInfosimplesCode(618)).toEqual({ outcome: 'error', kind: 'RATE_LIMITED' });
    });
  });

  describe('erros transitórios — UPSTREAM_ERROR', () => {
    it('code 609 (attempts_exceeded) retorna kind UPSTREAM_ERROR', () => {
      expect(classifyInfosimplesCode(609)).toEqual({ outcome: 'error', kind: 'UPSTREAM_ERROR' });
    });

    it('code 610 (failed_captcha) retorna kind UPSTREAM_ERROR', () => {
      expect(classifyInfosimplesCode(610)).toEqual({ outcome: 'error', kind: 'UPSTREAM_ERROR' });
    });

    it('code 613 (blocked_request) retorna kind UPSTREAM_ERROR', () => {
      expect(classifyInfosimplesCode(613)).toEqual({ outcome: 'error', kind: 'UPSTREAM_ERROR' });
    });

    it('code 615 (source_unavailable) retorna kind UPSTREAM_ERROR', () => {
      expect(classifyInfosimplesCode(615)).toEqual({ outcome: 'error', kind: 'UPSTREAM_ERROR' });
    });

    it('code 616 (source_error) retorna kind UPSTREAM_ERROR', () => {
      expect(classifyInfosimplesCode(616)).toEqual({ outcome: 'error', kind: 'UPSTREAM_ERROR' });
    });
  });

  describe('erros de autenticação — AUTH_FAILED', () => {
    it('code 601 (unauthorized) retorna kind AUTH_FAILED', () => {
      expect(classifyInfosimplesCode(601)).toEqual({ outcome: 'error', kind: 'AUTH_FAILED' });
    });

    it('code 603 (forbidden) retorna kind AUTH_FAILED', () => {
      expect(classifyInfosimplesCode(603)).toEqual({ outcome: 'error', kind: 'AUTH_FAILED' });
    });
  });

  describe('erros permanentes e de configuração — UPSTREAM_ERROR', () => {
    it('code 600 (unexpected_error) retorna kind UPSTREAM_ERROR', () => {
      expect(classifyInfosimplesCode(600)).toEqual({ outcome: 'error', kind: 'UPSTREAM_ERROR' });
    });

    it('code 604 (invalid_request) retorna kind UPSTREAM_ERROR', () => {
      expect(classifyInfosimplesCode(604)).toEqual({ outcome: 'error', kind: 'UPSTREAM_ERROR' });
    });

    it('code 620 (permanent_error) retorna kind UPSTREAM_ERROR', () => {
      expect(classifyInfosimplesCode(620)).toEqual({ outcome: 'error', kind: 'UPSTREAM_ERROR' });
    });
  });

  describe('código desconhecido', () => {
    it('code 999 (não listado) retorna kind UPSTREAM_ERROR por conservadorismo', () => {
      expect(classifyInfosimplesCode(999)).toEqual({ outcome: 'error', kind: 'UPSTREAM_ERROR' });
    });

    it('code 0 (nunca emitido pela API real) retorna kind UPSTREAM_ERROR', () => {
      expect(classifyInfosimplesCode(0)).toEqual({ outcome: 'error', kind: 'UPSTREAM_ERROR' });
    });
  });
});

// ---------------------------------------------------------------------------
// parseInfosimplesResponse
// ---------------------------------------------------------------------------

describe('parseInfosimplesResponse', () => {
  describe('respostas de sucesso', () => {
    it('body com code 200 retorna Right com os dados completos', () => {
      // Arrange
      const body = makeResponse({ code: 200, data_count: 1, data: [{ cpf: '12345678901' }] });

      // Act
      const result = parseInfosimplesResponse(TestResponseSchema, body);

      // Assert
      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.value.code).toBe(200);
        expect(result.value.data).toEqual([{ cpf: '12345678901' }]);
      }
    });

    it('body com code 612 (nada consta) retorna Right — não é erro, não desperdiça crédito', () => {
      // Arrange — simula consulta onde a fonte retornou "sem registros" (billable)
      const body = makeResponse({
        code: 612,
        code_message: 'Inexistent',
        data: null,
        data_count: 0,
      });

      // Act
      const result = parseInfosimplesResponse(TestResponseSchema, body);

      // Assert — DEVE ser Right; retornar Left aqui geraria retentativas indevidas
      expect(isRight(result)).toBe(true);
      if (isRight(result)) {
        expect(result.value.code).toBe(612);
        expect(result.value.data).toBeNull();
      }
    });
  });

  describe('respostas de erro', () => {
    it('body com code 616 (source_error) retorna Left UPSTREAM_ERROR com detalhe contendo code=616 e texto de errors[]', () => {
      // Arrange
      const body = makeResponse({
        code: 616,
        code_message: 'Source error',
        errors: ['Falha na consulta ao órgão', 'Timeout interno'],
      });

      // Act
      const result = parseInfosimplesResponse(TestResponseSchema, body);

      // Assert
      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.value.kind).toBe('UPSTREAM_ERROR');
        expect(result.value.message).toContain('code=616');
        expect(result.value.message).toContain('Falha na consulta ao órgão');
        expect(result.value.message).toContain('Timeout interno');
      }
    });

    it('body com code 601 (unauthorized) retorna Left AUTH_FAILED', () => {
      // Arrange
      const body = makeResponse({
        code: 601,
        code_message: 'Unauthorized',
        errors: ['Token inválido'],
      });

      // Act
      const result = parseInfosimplesResponse(TestResponseSchema, body);

      // Assert
      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.value.kind).toBe('AUTH_FAILED');
        expect(result.value.source).toBe('infosimples');
      }
    });
  });

  describe('falha de validação de schema', () => {
    it('body que não bate com o schema retorna Left SCHEMA_MISMATCH', () => {
      // Arrange — objeto totalmente inválido (falta campo obrigatório `code`)
      const invalidBody = { apenas_campo_errado: true };

      // Act
      const result = parseInfosimplesResponse(TestResponseSchema, invalidBody);

      // Assert
      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.value.kind).toBe('SCHEMA_MISMATCH');
        expect(result.value.source).toBe('infosimples');
      }
    });

    it('body null retorna Left SCHEMA_MISMATCH', () => {
      const result = parseInfosimplesResponse(TestResponseSchema, null);

      expect(isLeft(result)).toBe(true);
      if (isLeft(result)) {
        expect(result.value.kind).toBe('SCHEMA_MISMATCH');
      }
    });
  });
});
