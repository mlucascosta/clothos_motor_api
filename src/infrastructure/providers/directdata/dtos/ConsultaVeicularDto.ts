/**
 * @fileoverview DTO de ConsultaVeicular — DirectData.
 * @module infrastructure/providers/directdata/dtos/ConsultaVeicularDto
 */

import { z } from 'zod';

export const ConsultaVeicularRetornoSchema = z.object({
  anoExercicio: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  proprietario: z.string().nullable().optional(),
  veiculo: z.record(z.unknown())
});

export type ConsultaVeicularRetornoDto = z.infer<typeof ConsultaVeicularRetornoSchema>;
