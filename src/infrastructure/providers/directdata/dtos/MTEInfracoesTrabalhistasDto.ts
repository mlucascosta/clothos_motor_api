/**
 * @fileoverview DTO de MTEInfracoesTrabalhistas — DirectData.
 * @module infrastructure/providers/directdata/dtos/MTEInfracoesTrabalhistasDto
 */

import { z } from 'zod';

export const MTEInfracoesTrabalhistasRetornoSchema = z.object({
  constamProcessos: z.boolean().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  infracoesTrabalhistas: z.array(z.record(z.unknown())).nullable().optional(),
  status: z.string().nullable().optional(),
  tipoConsultado: z.string().nullable().optional(),
  totalProcessos: z.string().nullable().optional(),
});

export type MTEInfracoesTrabalhistasRetornoDto = z.infer<
  typeof MTEInfracoesTrabalhistasRetornoSchema
>;
