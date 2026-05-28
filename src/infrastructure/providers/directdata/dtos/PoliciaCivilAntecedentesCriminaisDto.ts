/**
 * @fileoverview DTO de PoliciaCivilAntecedentesCriminais — DirectData.
 * @module infrastructure/providers/directdata/dtos/PoliciaCivilAntecedentesCriminaisDto
 */

import { z } from 'zod';

export const PoliciaCivilAntecedentesCriminaisRetornoSchema = z.object({
  cpf: z.string().nullable().optional(),
  dataConsulta: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  dataNascimento: z.string().nullable().optional(),
  dataValidade: z.string().nullable().optional(),
  genero: z.string().nullable().optional(),
  idade: z.number().int().nullable().optional(),
  nacionalidade: z.string().nullable().optional(),
  naturalidade: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  nomeMae: z.string().nullable().optional(),
  nomePai: z.string().nullable().optional(),
  numeroCertidao: z.string().nullable().optional(),
  possuiAntecedentesCriminais: z.boolean().nullable().optional(),
  rg: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  uf: z.string().nullable().optional()
});

export type PoliciaCivilAntecedentesCriminaisRetornoDto = z.infer<typeof PoliciaCivilAntecedentesCriminaisRetornoSchema>;
