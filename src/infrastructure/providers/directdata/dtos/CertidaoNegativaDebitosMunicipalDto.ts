/**
 * @fileoverview DTO de CertidaoNegativaDebitosMunicipal — DirectData.
 * @module infrastructure/providers/directdata/dtos/CertidaoNegativaDebitosMunicipalDto
 */

import { z } from 'zod';

export const CertidaoNegativaDebitosMunicipalRetornoSchema = z.object({
  cidade: z.string().nullable().optional(),
  codigoValidacao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  debitos: z.array(z.record(z.unknown())).nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  efeitoNegativa: z.boolean().nullable().optional(),
  inscricaoMunicipal: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  observacao: z.string().nullable().optional(),
  possuiDebito: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
});

export type CertidaoNegativaDebitosMunicipalRetornoDto = z.infer<
  typeof CertidaoNegativaDebitosMunicipalRetornoSchema
>;
