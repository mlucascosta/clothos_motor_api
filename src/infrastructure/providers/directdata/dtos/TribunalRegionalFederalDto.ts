/**
 * @fileoverview DTO de TribunalRegionalFederal — DirectData.
 * @module infrastructure/providers/directdata/dtos/TribunalRegionalFederalDto
 */

import { z } from 'zod';

export const TribunalRegionalFederalRetornoSchema = z.object({
  codigoValidacao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  possuiProcesso: z.boolean().nullable().optional(),
  processos: z.array(z.record(z.unknown())).nullable().optional(),
  status: z.string().nullable().optional(),
  tipoCertidao: z.string().nullable().optional(),
});

export type TribunalRegionalFederalRetornoDto = z.infer<
  typeof TribunalRegionalFederalRetornoSchema
>;
