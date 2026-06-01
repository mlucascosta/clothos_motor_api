/**
 * @fileoverview DTO de TJCertidaoCivelCriminalFiscal — DirectData.
 * @module infrastructure/providers/directdata/dtos/TJCertidaoCivelCriminalFiscalDto
 */

import { z } from 'zod';

export const TJCertidaoCivelCriminalFiscalRetornoSchema = z.object({
  codigoValidacao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  observacao: z.string().nullable().optional(),
  possuiOcorrencia: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  tipoCertidao: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
});

export type TJCertidaoCivelCriminalFiscalRetornoDto = z.infer<
  typeof TJCertidaoCivelCriminalFiscalRetornoSchema
>;
