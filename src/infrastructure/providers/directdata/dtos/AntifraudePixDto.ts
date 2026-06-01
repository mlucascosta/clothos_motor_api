/**
 * @fileoverview DTO de AntifraudePix — DirectData.
 * @module infrastructure/providers/directdata/dtos/AntifraudePixDto
 */

import { z } from 'zod';

export const AntifraudePixRetornoSchema = z.object({
  chavePix: z.string().nullable().optional(),
  documento: z.string().nullable().optional(),
  nomeEntidade: z.string().nullable().optional(),
  probabilidadeTitularidade: z.string().nullable().optional(),
  riscoFraude: z.string().nullable().optional(),
  riscoLaranja: z.string().nullable().optional(),
  status: z.string().nullable().optional(),
  tipo: z.string().nullable().optional(),
});

export type AntifraudePixRetornoDto = z.infer<typeof AntifraudePixRetornoSchema>;
