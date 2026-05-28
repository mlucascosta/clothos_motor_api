/**
 * @fileoverview DTO de FBIMostWanted — DirectData.
 * @module infrastructure/providers/directdata/dtos/FBIMostWantedDto
 */

import { z } from 'zod';

export const FBIMostWantedRetornoSchema = z.object({
  nomeConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  pessoas: z.array(z.record(z.unknown())).nullable().optional(),
  resultadosEncontrados: z.number().int().optional()
});

export type FBIMostWantedRetornoDto = z.infer<typeof FBIMostWantedRetornoSchema>;
