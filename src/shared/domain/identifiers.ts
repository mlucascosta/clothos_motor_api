/**
 * @fileoverview Utilitários de identificadores brasileiros (CPF e CNPJ).
 *
 * **CNPJ alfanumérico** (Receita Federal — IN RFB nº 2.229/2024, vigente a partir de jul/2026):
 * 14 posições no total — as **12 primeiras são alfanuméricas** (`0-9`, `A-Z`) e os **2 últimos
 * dígitos verificadores (DV) permanecem numéricos**. O formato legado 100% numérico continua válido
 * (é um caso particular do alfanumérico). Máscara: `XX.XXX.XXX/XXXX-XX`.
 *
 * **CPF** permanece 11 dígitos numéricos.
 *
 * @module shared/domain/identifiers
 */

/** CPF: 11 dígitos numéricos (após remover máscara). */
const CPF_REGEX = /^\d{11}$/;

/** CNPJ: 12 posições alfanuméricas (0-9, A-Z) + 2 DV numéricos. Cobre o formato legado numérico. */
const CNPJ_REGEX = /^[0-9A-Z]{12}\d{2}$/;

/**
 * Remove a máscara (pontos, traços, barra, espaços e demais separadores) e normaliza para maiúsculas.
 * **Mantém letras** — essencial para o CNPJ alfanumérico, onde `replace(/\D/g, '')` corromperia o valor.
 *
 * @param {string} raw - Identificador com ou sem formatação
 * @returns {string} Identificador limpo em maiúsculas
 */
export function cleanDocument(raw: string): string {
  return raw.replace(/[^0-9A-Za-z]/g, '').toUpperCase();
}

/**
 * @param {string} raw - Valor a avaliar
 * @returns {boolean} `true` se for um CPF (11 dígitos numéricos) após remover máscara
 */
export function isCpf(raw: string): boolean {
  return CPF_REGEX.test(cleanDocument(raw));
}

/**
 * @param {string} raw - Valor a avaliar
 * @returns {boolean} `true` se for um CNPJ (12 alfanuméricos + 2 DV numéricos) após remover máscara
 */
export function isCnpj(raw: string): boolean {
  return CNPJ_REGEX.test(cleanDocument(raw));
}

/**
 * @param {string} raw - Valor a avaliar
 * @returns {boolean} `true` se for um CPF **ou** CNPJ válido em formato
 */
export function isCpfOrCnpj(raw: string): boolean {
  const cleaned = cleanDocument(raw);
  return CPF_REGEX.test(cleaned) || CNPJ_REGEX.test(cleaned);
}
