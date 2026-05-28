/**
 * @fileoverview DTO de NivelSocioeconomico — DirectData.
 * @module infrastructure/providers/directdata/dtos/NivelSocioeconomicoDto
 */

import { z } from 'zod';

export const NivelSocioeconomicoRetornoSchema = z.object({
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
  rendaMinimaCBO: z.string().nullable().optional()
});

export type NivelSocioeconomicoRetornoDto = z.infer<typeof NivelSocioeconomicoRetornoSchema>;
