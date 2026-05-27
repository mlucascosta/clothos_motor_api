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
  /** Saldo disponível em créditos (número inteiro positivo) */
  saldo: z.number().int().min(0),
  /** Saldo já utilizado neste período de renovação (opcional) */
  saldo_utilizado: z.number().int().min(0).optional(),
  /** Limite máximo de créditos por período (opcional) */
  limite: z.number().int().min(0).optional(),
  /** Data de renovação do saldo (ISO 8601 ou local) (opcional) */
  renovacao_em: z.string().optional(),
});

/**
 * DTO de saldo de créditos da API Escavador.
 * Contém informações de disponibilidade e renovação de créditos.
 *
 * **Exemplo:**
 * ```typescript
 * const saldo: SaldoDto = {
 *   saldo: 950,
 *   saldo_utilizado: 50,
 *   limite: 1000,
 *   renovacao_em: "2026-06-01T00:00:00Z"
 * };
 * ```
 *
 * @typedef {Object} SaldoDto
 * @property {number} saldo - Créditos disponíveis
 * @property {number} [saldo_utilizado] - Créditos consumidos
 * @property {number} [limite] - Limite máximo do período
 * @property {string} [renovacao_em] - Data de renovação
 */
export type SaldoDto = z.infer<typeof SaldoDtoSchema>;
