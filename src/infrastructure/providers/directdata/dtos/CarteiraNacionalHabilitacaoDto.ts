/**
 * @fileoverview DTO de CarteiraNacionalHabilitacao — DirectData.
 * @module infrastructure/providers/directdata/dtos/CarteiraNacionalHabilitacaoDto
 */

import { z } from 'zod';

export const CarteiraNacionalHabilitacaoRetornoSchema = z.object({
  cnh: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  dataPrimeiraCNH: z.string().nullable().optional(),
  nacionalidade: z.string().nullable().optional(),
  nome: z.string().nullable().optional(),
  permissionario: z.boolean().nullable().optional(),
  uf: z.string().nullable().optional(),
});

export type CarteiraNacionalHabilitacaoRetornoDto = z.infer<
  typeof CarteiraNacionalHabilitacaoRetornoSchema
>;
