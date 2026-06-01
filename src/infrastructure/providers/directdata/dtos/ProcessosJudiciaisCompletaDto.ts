/**
 * @fileoverview DTO de ProcessosJudiciaisCompleta — DirectData.
 * @module infrastructure/providers/directdata/dtos/ProcessosJudiciaisCompletaDto
 */

import { z } from 'zod';

export const ProcessosJudiciaisCompletaRetornoSchema = z.object({
  documentoConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  processos: z.array(z.record(z.unknown())).nullable().optional(),
  totalProcessos: z.number().int().nullable().optional(),
});

export type ProcessosJudiciaisCompletaRetornoDto = z.infer<
  typeof ProcessosJudiciaisCompletaRetornoSchema
>;
