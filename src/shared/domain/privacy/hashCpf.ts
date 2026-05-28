/**
 * @fileoverview Utilitário de privacidade — hash SHA-256 de CPF.
 * CPF nunca armazenado em texto claro (requisito LGPD).
 * CNPJ armazenado em claro (dado público).
 * @module shared/domain/privacy/hashCpf
 */

import { createHash } from 'node:crypto';

/**
 * Retorna hash SHA-256 do CPF se o param for um CPF válido (11 dígitos numéricos).
 * Para CNPJ (14 dígitos) ou outros valores, retorna o param original sem modificação.
 *
 * Regra: apenas `tipo_param === 'cpf_cnpj'` + param com 11 dígitos após strip de não-numéricos.
 *
 * @param {string | null} tipoParam - Tipo do parâmetro (ex: 'cpf_cnpj', 'cnpj', 'tribunal')
 * @param {string | null} param - Valor a avaliar
 * @returns {string | null} Hash SHA-256 se CPF, original caso contrário, null se null
 */
export function hashCpfIfNeeded(tipoParam: string | null, param: string | null): string | null {
  if (tipoParam === 'cpf_cnpj' && param !== null && /^\d{11}$/.test(param.replace(/\D/g, ''))) {
    return createHash('sha256').update(param.replace(/\D/g, '')).digest('hex');
  }
  return param;
}
