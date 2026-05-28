/**
 * @fileoverview DTO de IBAMACertidaoNegativaDebitos — DirectData.
 * @module infrastructure/providers/directdata/dtos/IBAMACertidaoNegativaDebitosDto
 */

import { z } from 'zod';

export const IBAMACertidaoNegativaDebitosRetornoSchema = z.object({
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  debitos: z.array(z.record(z.unknown())).nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  efeitoNegativo: z.boolean().nullable().optional(),
  nome: z.string().nullable().optional(),
  numero: z.number().int().nullable().optional(),
  possuiDebito: z.boolean().nullable().optional(),
  status: z.string().nullable().optional()
});

export type IBAMACertidaoNegativaDebitosRetornoDto = z.infer<typeof IBAMACertidaoNegativaDebitosRetornoSchema>;
