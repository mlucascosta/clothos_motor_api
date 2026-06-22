/**
 * @fileoverview Mapa de parâmetros obrigatórios por operation da BrasilAPI.
 * Consultado pela rota antes de despachar a requisição para garantir que
 * os parâmetros necessários estejam presentes no body/query string.
 * Operations ausentes neste mapa não exigem parâmetros (ex.: `cvm_corretoras`).
 * @module infrastructure/providers/brasilapi/operations/validation-map
 */

/**
 * Mapa de validação: nome da operation → lista de parâmetros obrigatórios.
 *
 * - `cnpj` requer `cnpj` (14 caracteres alfanuméricos, formatado ou não)
 * - `registrobr` requer `domain` (ex.: `'exemplo.com.br'`)
 * - `cvm_corretora` requer `cnpj` (CNPJ da corretora)
 *
 * Operations sem entrada aqui aceitam requisições sem parâmetros obrigatórios.
 */
export const brasilapiRequiredParams: Record<string, string[]> = {
  cnpj: ['cnpj'],
  registrobr: ['domain'],
  cvm_corretora: ['cnpj'],
};
