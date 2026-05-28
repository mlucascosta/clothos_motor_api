/**
 * @fileoverview DTO de TSTCertidaoNegativaDebitosTrabalhistas — DirectData.
 * @module infrastructure/providers/directdata/dtos/TSTCertidaoNegativaDebitosTrabalhistasDto
 */

import { z } from 'zod';

export const TSTCertidaoNegativaDebitosTrabalhistasRetornoSchema = z.object({
  dataExpedicao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  possuiProcesso: z.boolean().nullable().optional(),
  processos: z.array(z.record(z.unknown())).nullable().optional(),
  status: z.string().nullable().optional(),
  totalProcessos: z.number().int().nullable().optional()
});

export type TSTCertidaoNegativaDebitosTrabalhistasRetornoDto = z.infer<typeof TSTCertidaoNegativaDebitosTrabalhistasRetornoSchema>;
