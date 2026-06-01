/**
 * @fileoverview DTO de IBAMACertidaoNegativaEmbargos — DirectData.
 * @module infrastructure/providers/directdata/dtos/IBAMACertidaoNegativaEmbargosDto
 */

import { z } from 'zod';

export const IBAMACertidaoNegativaEmbargosRetornoSchema = z.object({
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  embargos: z.array(z.record(z.unknown())).nullable().optional(),
  endereco: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  observacoes: z.array(z.record(z.unknown())).nullable().optional(),
  possuiEmbargo: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
});

export type IBAMACertidaoNegativaEmbargosRetornoDto = z.infer<
  typeof IBAMACertidaoNegativaEmbargosRetornoSchema
>;
