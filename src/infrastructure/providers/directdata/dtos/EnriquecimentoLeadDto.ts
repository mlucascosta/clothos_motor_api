/**
 * @fileoverview DTO de EnriquecimentoLead — DirectData.
 * @module infrastructure/providers/directdata/dtos/EnriquecimentoLeadDto
 */

import { z } from 'zod';

export const EnriquecimentoLeadRetornoSchema = z.object({
  cpf: z.string().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  emails: z.array(z.record(z.unknown())).nullable().optional(),
  enderecos: z.array(z.record(z.unknown())).nullable().optional(),
  idade: z.number().int().nullable().optional(),
  nome: z.string().nullable().optional(),
  nomeMae: z.string().nullable().optional(),
  rendaEstimada: z.string().nullable().optional(),
  rendaFaixaSalarial: z.string().nullable().optional(),
  sexo: z.string().nullable().optional(),
  signo: z.string().nullable().optional(),
  telefones: z.array(z.record(z.unknown())).nullable().optional(),
});

export type EnriquecimentoLeadRetornoDto = z.infer<typeof EnriquecimentoLeadRetornoSchema>;
