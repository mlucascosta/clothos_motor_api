/**
 * @fileoverview DTO de ProcessosJudiciaisAgrupada — DirectData.
 * @module infrastructure/providers/directdata/dtos/ProcessosJudiciaisAgrupadaDto
 */

import { z } from 'zod';

export const ProcessosJudiciaisAgrupadaRetornoSchema = z.object({
  areasDireito: z.array(z.record(z.unknown())).nullable().optional(),
  distribuicaoPorAno: z.array(z.record(z.unknown())).nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  segmentos: z.array(z.record(z.unknown())).nullable().optional(),
  totalProcessos: z.number().int().nullable().optional(),
  tribunais: z.array(z.record(z.unknown())).nullable().optional()
});

export type ProcessosJudiciaisAgrupadaRetornoDto = z.infer<typeof ProcessosJudiciaisAgrupadaRetornoSchema>;
