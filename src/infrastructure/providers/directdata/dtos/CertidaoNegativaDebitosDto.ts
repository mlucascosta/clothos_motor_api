/**
 * @fileoverview DTO de CertidaoNegativaDebitos — DirectData.
 * @module infrastructure/providers/directdata/dtos/CertidaoNegativaDebitosDto
 */

import { z } from 'zod';

export const CertidaoNegativaDebitosRetornoSchema = z.object({
  codigoValidacao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  debitos: z.array(z.record(z.unknown())).nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  efeitoNegativa: z.boolean().nullable().optional(),
  inscricaoEstadual: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  observacao: z.string().nullable().optional(),
  possuiDebito: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
  uf: z.string().nullable().optional()
});

export type CertidaoNegativaDebitosRetornoDto = z.infer<typeof CertidaoNegativaDebitosRetornoSchema>;
