/**
 * @fileoverview DTO de ProcessosJudiciaisSimplificada — DirectData.
 * @module infrastructure/providers/directdata/dtos/ProcessosJudiciaisSimplificadaDto
 */

import { z } from 'zod';

export const ProcessosJudiciaisSimplificadaRetornoSchema = z.object({
  documentoConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  processos: z.array(z.record(z.unknown())).nullable().optional(),
  totalProcessos: z.number().int().nullable().optional()
});

export type ProcessosJudiciaisSimplificadaRetornoDto = z.infer<typeof ProcessosJudiciaisSimplificadaRetornoSchema>;
