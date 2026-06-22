/**
 * @fileoverview Utilitário de privacidade — hash SHA-256 de CPF.
 * CPF nunca armazenado em texto claro (requisito LGPD).
 * CNPJ armazenado em claro (dado público).
 * @module shared/domain/privacy/hashCpf
 */

import { createHash } from 'node:crypto';
import { cleanDocument } from '../identifiers.js';

/**
 * Retorna hash SHA-256 do CPF se o param for um CPF válido (11 dígitos numéricos).
 * Para CNPJ (numérico ou alfanumérico) ou outros valores, retorna o param original sem modificação.
 *
 * Regra: apenas `tipo_param === 'cpf_cnpj'` + valor que, após remover a máscara, seja exatamente
 * 11 dígitos numéricos. Um CNPJ **alfanumérico** preserva suas letras em {@link cleanDocument},
 * então nunca é confundido com CPF (evita hashear dado público como se fosse PII).
 *
 * @param {string | null} tipoParam - Tipo do parâmetro (ex: 'cpf_cnpj', 'cnpj', 'tribunal')
 * @param {string | null} param - Valor a avaliar
 * @returns {string | null} Hash SHA-256 se CPF, original caso contrário, null se null
 */
export function hashCpfIfNeeded(tipoParam: string | null, param: string | null): string | null {
  if (tipoParam === 'cpf_cnpj' && param !== null) {
    const cleaned = cleanDocument(param);
    if (/^\d{11}$/.test(cleaned)) {
      return createHash('sha256').update(cleaned).digest('hex');
    }
  }
  return param;
}
