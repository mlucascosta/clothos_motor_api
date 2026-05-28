/**
 * @fileoverview DTO de DossieCreditoCompleto — DirectData.
 * @module infrastructure/providers/directdata/dtos/DossieCreditoCompletoDto
 */

import { z } from 'zod';

export const DossieCreditoCompletoRetornoSchema = z.object({
  documentoConsultado: z.string().nullable().optional(),
  entidadeFisica: z.record(z.unknown()),
  entidadeJuridica: z.record(z.unknown()),
  observacao: z.string().nullable().optional()
});

export type DossieCreditoCompletoRetornoDto = z.infer<typeof DossieCreditoCompletoRetornoSchema>;
