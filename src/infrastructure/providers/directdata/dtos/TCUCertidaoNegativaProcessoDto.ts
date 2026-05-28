/**
 * @fileoverview DTO de TCUCertidaoNegativaProcesso — DirectData.
 * @module infrastructure/providers/directdata/dtos/TCUCertidaoNegativaProcessoDto
 */

import { z } from 'zod';

export const TCUCertidaoNegativaProcessoRetornoSchema = z.object({
  codigoCertidao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  possuiProcesso: z.boolean().nullable().optional(),
  processos: z.array(z.record(z.unknown())).nullable().optional(),
  status: z.string().nullable().optional()
});

export type TCUCertidaoNegativaProcessoRetornoDto = z.infer<typeof TCUCertidaoNegativaProcessoRetornoSchema>;
