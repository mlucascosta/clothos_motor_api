/**
 * @fileoverview DTO de EUFinancialList — DirectData.
 * @module infrastructure/providers/directdata/dtos/EUFinancialListDto
 */

import { z } from 'zod';

export const EUFinancialListRetornoSchema = z.object({
  nomeConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  resultadosEncontrados: z.number().int().optional(),
  sancoes: z.array(z.record(z.unknown())).nullable().optional(),
});

export type EUFinancialListRetornoDto = z.infer<typeof EUFinancialListRetornoSchema>;
