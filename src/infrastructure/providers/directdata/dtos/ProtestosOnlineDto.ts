/**
 * @fileoverview DTO de ProtestosOnline — DirectData.
 * @module infrastructure/providers/directdata/dtos/ProtestosOnlineDto
 */

import { z } from 'zod';

export const ProtestosOnlineRetornoSchema = z.object({
  constamProtestos: z.boolean().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  numeroTotalProtestos: z.number().int().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  protestos: z.array(z.record(z.unknown())).nullable().optional(),
  valorTotalProtestos: z.string().nullable().optional()
});

export type ProtestosOnlineRetornoDto = z.infer<typeof ProtestosOnlineRetornoSchema>;
