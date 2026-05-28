/**
 * @fileoverview DTO de Historico — DirectData.
 * @module infrastructure/providers/directdata/dtos/HistoricoDto
 */

import { z } from 'zod';

export const HistoricoRetornoSchema = z.object({}).passthrough();

export type HistoricoRetornoDto = z.infer<typeof HistoricoRetornoSchema>;
