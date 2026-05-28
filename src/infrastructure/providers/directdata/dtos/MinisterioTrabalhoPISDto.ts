/**
 * @fileoverview DTO de MinisterioTrabalhoPIS — DirectData.
 * @module infrastructure/providers/directdata/dtos/MinisterioTrabalhoPISDto
 */

import { z } from 'zod';

export const MinisterioTrabalhoPISRetornoSchema = z.object({
  cpf: z.string().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  nomeMae: z.string().nullable().optional(),
  pis: z.string().nullable().optional()
});

export type MinisterioTrabalhoPISRetornoDto = z.infer<typeof MinisterioTrabalhoPISRetornoSchema>;
