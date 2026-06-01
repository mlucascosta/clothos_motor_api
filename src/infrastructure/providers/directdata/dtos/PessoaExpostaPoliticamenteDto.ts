/**
 * @fileoverview DTO de PessoaExpostaPoliticamente — DirectData.
 * @module infrastructure/providers/directdata/dtos/PessoaExpostaPoliticamenteDto
 */

import { z } from 'zod';

export const PessoaExpostaPoliticamenteRetornoSchema = z.object({
  cpf: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  funcao: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  orgao: z.string().nullable().optional(),
  parentescosPEP: z.array(z.record(z.unknown())).nullable().optional(),
  pep: z.boolean().nullable().optional(),
  relacionadoComPEP: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
});

export type PessoaExpostaPoliticamenteRetornoDto = z.infer<
  typeof PessoaExpostaPoliticamenteRetornoSchema
>;
