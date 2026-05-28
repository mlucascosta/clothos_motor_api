/**
 * @fileoverview DTO de MPMTMinisterioPublicoMatoGrosso — DirectData.
 * @module infrastructure/providers/directdata/dtos/MPMTMinisterioPublicoMatoGrossoDto
 */

import { z } from 'zod';

export const MPMTMinisterioPublicoMatoGrossoRetornoSchema = z.object({
  codigoValidacao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  possuiProcedimentoExtrajudicial: z.boolean().nullable().optional(),
  procedimentosInvestigatoriosExtrajudiciais: z.array(z.record(z.unknown())).nullable().optional(),
  status: z.string().nullable().optional()
});

export type MPMTMinisterioPublicoMatoGrossoRetornoDto = z.infer<typeof MPMTMinisterioPublicoMatoGrossoRetornoSchema>;
