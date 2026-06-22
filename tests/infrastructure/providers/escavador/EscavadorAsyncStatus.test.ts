/**
 * @fileoverview Testes do classificador de status assíncrono do Escavador.
 * @module tests/infrastructure/providers/escavador/EscavadorAsyncStatus.test
 */

import {
  classifyEscavadorStatus,
  normalizeEscavadorStatus,
} from '../../../../src/infrastructure/providers/escavador/EscavadorAsyncStatus';

describe('normalizeEscavadorStatus', () => {
  it('faz uppercase, trim e remove acentos', () => {
    expect(normalizeEscavadorStatus('concluído')).toBe('CONCLUIDO');
    expect(normalizeEscavadorStatus('  Em_Andamento  ')).toBe('EM_ANDAMENTO');
    expect(normalizeEscavadorStatus('SUCESSO')).toBe('SUCESSO');
  });
});

describe('classifyEscavadorStatus', () => {
  describe('success', () => {
    it.each(['SUCESSO', 'CONCLUIDO', 'concluido', 'concluído', 'PROCESSADO', 'disponivel'])(
      'classifica "%s" como success',
      (status) => {
        expect(classifyEscavadorStatus(status)).toBe('success');
      },
    );
  });

  describe('failed', () => {
    it.each(['ERRO', 'erro', 'FALHA', 'cancelado'])('classifica "%s" como failed', (status) => {
      expect(classifyEscavadorStatus(status)).toBe('failed');
    });
  });

  describe('not_found', () => {
    it.each(['NAO_ENCONTRADO', 'nao_encontrado', 'não_encontrado', 'SEM_RESULTADO'])(
      'classifica "%s" como not_found',
      (status) => {
        expect(classifyEscavadorStatus(status)).toBe('not_found');
      },
    );
  });

  describe('pending', () => {
    it.each(['PENDENTE', 'pendente', 'em_andamento', 'em_processamento', 'processando', 'enviado'])(
      'classifica "%s" como pending',
      (status) => {
        expect(classifyEscavadorStatus(status)).toBe('pending');
      },
    );
  });

  describe('unknown', () => {
    it.each(['', 'foo', 'qualquer_coisa', 'success'])(
      'classifica "%s" como unknown (nunca como success)',
      (status) => {
        const outcome = classifyEscavadorStatus(status);
        expect(outcome).toBe('unknown');
        expect(outcome).not.toBe('success');
      },
    );
  });
});
