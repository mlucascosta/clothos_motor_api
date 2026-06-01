/**
 * @fileoverview DTO de BancoCentralProibidos — DirectData.
 * @module infrastructure/providers/directdata/dtos/BancoCentralProibidosDto
 */

import { z } from 'zod';

export const BancoCentralProibidosRetornoSchema = z.object({
  constamPenalidades: z.boolean().nullable().optional(),
  documento: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  penalidades: z.array(z.record(z.unknown())).nullable().optional(),
});

export type BancoCentralProibidosRetornoDto = z.infer<typeof BancoCentralProibidosRetornoSchema>;
