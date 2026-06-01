/**
 * @fileoverview DTO de CertidaoNegativaDebitosImovelRural — DirectData.
 * @module infrastructure/providers/directdata/dtos/CertidaoNegativaDebitosImovelRuralDto
 */

import { z } from 'zod';

export const CertidaoNegativaDebitosImovelRuralRetornoSchema = z.object({
  areaTotal: z.string().nullable().optional(),
  cib: z.string().nullable().optional(),
  codigoControleCertidao: z.string().nullable().optional(),
  contribuinte: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  debitos: z.array(z.record(z.unknown())).nullable().optional(),
  efeitoNegativa: z.boolean().nullable().optional(),
  municipio: z.string().nullable().optional(),
  nomeImovel: z.string().nullable().optional(),
  possuiDebito: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
  uf: z.string().nullable().optional(),
});

export type CertidaoNegativaDebitosImovelRuralRetornoDto = z.infer<
  typeof CertidaoNegativaDebitosImovelRuralRetornoSchema
>;
