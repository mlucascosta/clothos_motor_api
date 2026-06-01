/**
 * @fileoverview DTO de AuxilioReconstrucao — DirectData.
 * @module infrastructure/providers/directdata/dtos/AuxilioReconstrucaoDto
 */

import { z } from 'zod';

export const AuxilioReconstrucaoRetornoSchema = z.object({
  beneficios: z.array(z.record(z.unknown())).nullable().optional(),
  cpf: z.string().nullable().optional(),
  nis: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  quantidadePessoasFamilia: z.number().int().nullable().optional(),
});

export type AuxilioReconstrucaoRetornoDto = z.infer<typeof AuxilioReconstrucaoRetornoSchema>;
