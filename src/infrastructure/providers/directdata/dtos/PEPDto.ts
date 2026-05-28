/**
 * @fileoverview DTOs de PEP (Pessoa Exposta Politicamente) — DirectData.
 * @module infrastructure/providers/directdata/dtos/PEPDto
 */

import { z } from 'zod';

export const ParentescoPEPSchema = z.object({
  grauParentesco: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  genero: z.string().nullable().optional(),
  obito: z.boolean().nullable().optional(),
  dataObito: z.string().nullable().optional(),
  codigoGrauParentesco: z.number().int().nullable().optional(),
});

export const PEPRetornoSchema = z.object({
  cpf: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  pep: z.boolean().nullable().optional(),
  relacionadoComPEP: z.boolean().nullable().optional(),
  funcao: z.string().nullable().optional(),
  orgao: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  parentescosPEP: z.array(ParentescoPEPSchema).nullable().optional(),
});

export type ParentescoPEPDto = z.infer<typeof ParentescoPEPSchema>;
export type PEPRetornoDto = z.infer<typeof PEPRetornoSchema>;
