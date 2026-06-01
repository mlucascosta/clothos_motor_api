/**
 * @fileoverview DTO de APFRural — DirectData.
 * @module infrastructure/providers/directdata/dtos/APFRuralDto
 */

import { z } from 'zod';

export const APFRuralRetornoSchema = z.object({
  autorizacoes: z.array(z.record(z.unknown())).nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  quantidadeAutorizacoes: z.number().int().nullable().optional(),
});

export type APFRuralRetornoDto = z.infer<typeof APFRuralRetornoSchema>;
