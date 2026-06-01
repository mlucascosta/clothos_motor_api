/**
 * @fileoverview DTO de VinculoEmpregaticio — DirectData.
 * @module infrastructure/providers/directdata/dtos/VinculoEmpregaticioDto
 */

import { z } from 'zod';

export const VinculoEmpregaticioRetornoSchema = z.object({
  cnpj: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  funcionarios: z.array(z.record(z.unknown())).nullable().optional(),
  quantidadeFuncionarios: z.number().int().nullable().optional(),
  razaoSocial: z.string().nullable().optional(),
});

export type VinculoEmpregaticioRetornoDto = z.infer<typeof VinculoEmpregaticioRetornoSchema>;
