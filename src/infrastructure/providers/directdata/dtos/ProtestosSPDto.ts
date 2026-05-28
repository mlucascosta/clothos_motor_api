/**
 * @fileoverview DTO de ProtestosSP — DirectData.
 * @module infrastructure/providers/directdata/dtos/ProtestosSPDto
 */

import { z } from 'zod';

export const ProtestosSPRetornoSchema = z.object({
  constamProtestos: z.boolean().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  protestos: z.array(z.record(z.unknown())).nullable().optional(),
  totalNumProtestos: z.number().int().nullable().optional(),
  valorTotalProtestos: z.string().nullable().optional()
});

export type ProtestosSPRetornoDto = z.infer<typeof ProtestosSPRetornoSchema>;
