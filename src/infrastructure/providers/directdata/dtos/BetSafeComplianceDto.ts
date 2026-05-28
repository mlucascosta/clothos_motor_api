/**
 * @fileoverview DTO de BetSafeCompliance — DirectData.
 * @module infrastructure/providers/directdata/dtos/BetSafeComplianceDto
 */

import { z } from 'zod';

export const BetSafeComplianceRetornoSchema = z.object({
  beneficios: z.record(z.unknown()),
  cbo: z.string().nullable().optional(),
  codigoCBO: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  genero: z.string().nullable().optional(),
  idade: z.number().int().nullable().optional(),
  nome: z.string().nullable().optional(),
  obito: z.boolean().nullable().optional(),
  parentescos: z.array(z.record(z.unknown())).nullable().optional(),
  pep: z.boolean().nullable().optional(),
  personalidadePublica: z.boolean().nullable().optional(),
  relacionadoEsporte: z.boolean().nullable().optional()
});

export type BetSafeComplianceRetornoDto = z.infer<typeof BetSafeComplianceRetornoSchema>;
