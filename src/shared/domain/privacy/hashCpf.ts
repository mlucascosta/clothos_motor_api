/**
 * @fileoverview Utilitário de privacidade — hash SHA-256 de CPF.
 * CPF nunca armazenado em texto claro (requisito LGPD).
 * CNPJ armazenado em claro (dado público).
 * @module shared/domain/privacy/hashCpf
 */

import { createHash } from 'node:crypto';
import { cleanDocument } from '../identifiers.js';

/**
 * Retorna hash SHA-256 do param quando ele é um CPF (11 dígitos numéricos), senão o param original.
 *
 * A decisão é pelo **valor**, não pelo rótulo: qualquer valor que, após remover a máscara, seja
 * exatamente 11 dígitos numéricos é tratado como CPF e hasheado — independente de `tipoParam`.
 * O rótulo não é confiável como porteiro de PII (P16: o Finder envia `tipo_param='cpf'`, não
 * `'cpf_cnpj'`; presa a `'cpf_cnpj'`, a versão antiga deixava TODO CPF do Finder em texto claro).
 * Ancorar a garantia no formato faz com que nenhum caminho futuro vaze CPF por rotular errado.
 *
 * Seguro para o domínio: os outros identificadores nunca têm 11 dígitos — CNPJ numérico tem 14,
 * CNPJ **alfanumérico** preserva letras em {@link cleanDocument} (14 chars, não 11 dígitos), e o
 * número CNJ tem 20. Assim nenhum dado público é confundido com PII.
 *
 * @param {string | null} tipoParam - Tipo do parâmetro (informativo; não decide o hash)
 * @param {string | null} param - Valor a avaliar
 * @returns {string | null} Hash SHA-256 se CPF, original caso contrário, null se null
 */
export function hashCpfIfNeeded(_tipoParam: string | null, param: string | null): string | null {
  if (param !== null) {
    const cleaned = cleanDocument(param);
    if (/^\d{11}$/.test(cleaned)) {
      return createHash('sha256').update(cleaned).digest('hex');
    }
  }
  return param;
}
