/**
 * @fileoverview DTO de BeneficiosSociais — DirectData.
 * @module infrastructure/providers/directdata/dtos/BeneficiosSociaisDto
 */

import { z } from 'zod';

export const BeneficiosSociaisRetornoSchema = z.object({
  auxilioEmergencial: z.boolean().nullable().optional(),
  auxilioReconstrucao: z.boolean().nullable().optional(),
  bolsaFamilia: z.boolean().nullable().optional(),
  bpc: z.boolean().nullable().optional(),
  cpf: z.string().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  garantiaSafra: z.boolean().nullable().optional(),
  nis: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  nomeMae: z.string().nullable().optional(),
  obito: z.boolean().nullable().optional(),
  seguroDefeso: z.boolean().nullable().optional()
});

export type BeneficiosSociaisRetornoDto = z.infer<typeof BeneficiosSociaisRetornoSchema>;
