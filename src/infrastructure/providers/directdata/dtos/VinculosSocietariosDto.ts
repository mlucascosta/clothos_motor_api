/**
 * @fileoverview DTO de VinculosSocietarios — DirectData.
 * @module infrastructure/providers/directdata/dtos/VinculosSocietariosDto
 */

import { z } from 'zod';

export const VinculosSocietariosRetornoSchema = z.object({
  detalhesPessoaFisica: z.record(z.unknown()),
  detalhesPessoaJuridica: z.record(z.unknown()),
  documentoConsultado: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  relacionamentos: z.array(z.record(z.unknown())).nullable().optional()
});

export type VinculosSocietariosRetornoDto = z.infer<typeof VinculosSocietariosRetornoSchema>;
