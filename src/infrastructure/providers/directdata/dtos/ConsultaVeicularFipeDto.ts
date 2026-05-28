/**
 * @fileoverview DTO de ConsultaVeicularFipe — DirectData.
 * @module infrastructure/providers/directdata/dtos/ConsultaVeicularFipeDto
 */

import { z } from 'zod';

export const ConsultaVeicularFipeRetornoSchema = z.object({
  anoExercicio: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  proprietario: z.string().nullable().optional(),
  veiculo: z.record(z.unknown())
});

export type ConsultaVeicularFipeRetornoDto = z.infer<typeof ConsultaVeicularFipeRetornoSchema>;
