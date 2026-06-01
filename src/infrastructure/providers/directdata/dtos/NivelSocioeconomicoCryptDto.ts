/**
 * @fileoverview DTO de NivelSocioeconomico/Crypt — DirectData.
 * @module infrastructure/providers/directdata/dtos/NivelSocioeconomicoCryptDto
 */

import { z } from 'zod';

export const NivelSocioeconomicoCryptRetornoSchema = z.object({
  cbo: z.string().nullable().optional(),
  classeSocial: z.string().nullable().optional(),
  codigoCBO: z.string().nullable().optional(),
  cpf: z.string().nullable().optional(),
  escolaridade: z.string().nullable().optional(),
  rendaEstimada: z.string().nullable().optional(),
  rendaFaixaSalarial: z.string().nullable().optional(),
  rendaIBGE: z.string().nullable().optional(),
  rendaMaximaCBO: z.string().nullable().optional(),
  rendaMediaCBO: z.string().nullable().optional(),
  rendaMinimaCBO: z.string().nullable().optional(),
});

export type NivelSocioeconomicoCryptRetornoDto = z.infer<
  typeof NivelSocioeconomicoCryptRetornoSchema
>;
