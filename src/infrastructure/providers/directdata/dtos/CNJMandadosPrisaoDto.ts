/**
 * @fileoverview DTO de CNJMandadosPrisao — DirectData.
 * @module infrastructure/providers/directdata/dtos/CNJMandadosPrisaoDto
 */

import { z } from 'zod';

export const CNJMandadosPrisaoRetornoSchema = z.object({
  cpf: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  mandadosPrisao: z.array(z.record(z.unknown())).nullable().optional(),
  possuiMandado: z.boolean().nullable().optional(),
  status: z.string().nullable().optional()
});

export type CNJMandadosPrisaoRetornoDto = z.infer<typeof CNJMandadosPrisaoRetornoSchema>;
