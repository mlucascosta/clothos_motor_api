/**
 * @fileoverview DTO de MPFCertidaoNegativa — DirectData.
 * @module infrastructure/providers/directdata/dtos/MPFCertidaoNegativaDto
 */

import { z } from 'zod';

export const MPFCertidaoNegativaRetornoSchema = z.object({
  codigoValidacao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  possuiProcedimentoExtrajudicial: z.boolean().nullable().optional(),
  procedimentosExtrajudiciais: z.array(z.record(z.unknown())).nullable().optional(),
  status: z.string().nullable().optional()
});

export type MPFCertidaoNegativaRetornoDto = z.infer<typeof MPFCertidaoNegativaRetornoSchema>;
