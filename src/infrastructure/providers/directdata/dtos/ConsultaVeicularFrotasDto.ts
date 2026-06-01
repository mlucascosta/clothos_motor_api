/**
 * @fileoverview DTO de ConsultaVeicularFrotas — DirectData.
 * @module infrastructure/providers/directdata/dtos/ConsultaVeicularFrotasDto
 */

import { z } from 'zod';

export const ConsultaVeicularFrotasRetornoSchema = z.object({
  documentoConsultado: z.string().nullable().optional(),
  nomeProprietario: z.string().nullable().optional(),
  observacoes: z.string().nullable().optional(),
  quantidadeVeiculos: z.number().int().optional(),
  veiculos: z.array(z.record(z.unknown())).nullable().optional(),
});

export type ConsultaVeicularFrotasRetornoDto = z.infer<typeof ConsultaVeicularFrotasRetornoSchema>;
