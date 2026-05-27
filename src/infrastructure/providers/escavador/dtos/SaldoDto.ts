/**
 * @fileoverview DTO de saldo de créditos do Escavador.
 * Representa informações de limite de uso e renovação de créditos.
 * @module infrastructure/providers/escavador/dtos/SaldoDto
 */

import { z } from 'zod';

/**
 * Schema de DTO de saldo de créditos.
 * Retornado por ObterSaldo.
 *
 * @type {ZodSchema}
 */
export const SaldoDtoSchema = z.object({
  /** Créditos disponíveis (inteiro) */
  quantidade_creditos: z.number().int().min(0),
  /** Saldo em R$ (float, ex: 590.7) */
  saldo: z.number().min(0),
  /** Saldo formatado para exibição */
  saldo_descricao: z.string().optional(),
});

/**
 * DTO de saldo de créditos da API Escavador.
 * Contém informações de disponibilidade e renovação de créditos.
 *
 * **Exemplo:**
 * ```typescript
 * const saldo: SaldoDto = {
 *   quantidade_creditos: 59070,
 *   saldo: 590.7,
 *   saldo_descricao: "R$ 590,70"
 * };
 * ```
 *
 * @typedef {Object} SaldoDto
 * @property {number} quantidade_creditos - Total de créditos disponíveis
 * @property {number} saldo - Saldo em R$ (float)
 * @property {string} [saldo_descricao] - Saldo formatado para exibição
 */
export type SaldoDto = z.infer<typeof SaldoDtoSchema>;
