/**
 * @fileoverview DTO de TribunalRegionalTrabalho — DirectData.
 * @module infrastructure/providers/directdata/dtos/TribunalRegionalTrabalhoDto
 */

import { z } from 'zod';

export const TribunalRegionalTrabalhoRetornoSchema = z.object({
  codigoAutenticidade: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  possuiProcesso: z.boolean().nullable().optional(),
  processos: z.array(z.record(z.unknown())).nullable().optional(),
  regiao: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
});

export type TribunalRegionalTrabalhoRetornoDto = z.infer<
  typeof TribunalRegionalTrabalhoRetornoSchema
>;
