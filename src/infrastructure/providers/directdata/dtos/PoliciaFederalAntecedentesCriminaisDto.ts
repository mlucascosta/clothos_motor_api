/**
 * @fileoverview DTO de PoliciaFederalAntecedentesCriminais — DirectData.
 * @module infrastructure/providers/directdata/dtos/PoliciaFederalAntecedentesCriminaisDto
 */

import { z } from 'zod';

export const PoliciaFederalAntecedentesCriminaisRetornoSchema = z.object({
  cpf: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  nomeMae: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  possuiAntecedentesCriminais: z.boolean().nullable().optional(),
  status: z.string().nullable().optional(),
});

export type PoliciaFederalAntecedentesCriminaisRetornoDto = z.infer<
  typeof PoliciaFederalAntecedentesCriminaisRetornoSchema
>;
