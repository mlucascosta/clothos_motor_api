/**
 * @fileoverview DTO de BancoCentralInabilitados — DirectData.
 * @module infrastructure/providers/directdata/dtos/BancoCentralInabilitadosDto
 */

import { z } from 'zod';

export const BancoCentralInabilitadosRetornoSchema = z.object({
  constamPenalidades: z.boolean().nullable().optional(),
  cpf: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  penalidades: z.array(z.record(z.unknown())).nullable().optional()
});

export type BancoCentralInabilitadosRetornoDto = z.infer<typeof BancoCentralInabilitadosRetornoSchema>;
