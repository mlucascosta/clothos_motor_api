/**
 * @fileoverview DTO de UKHmTreasury — DirectData.
 * @module infrastructure/providers/directdata/dtos/UKHmTreasuryDto
 */

import { z } from 'zod';

export const UKHmTreasuryRetornoSchema = z.object({
  nomeConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  resultadosEncontrados: z.number().int().optional(),
  sancoes: z.array(z.record(z.unknown())).nullable().optional(),
});

export type UKHmTreasuryRetornoDto = z.infer<typeof UKHmTreasuryRetornoSchema>;
