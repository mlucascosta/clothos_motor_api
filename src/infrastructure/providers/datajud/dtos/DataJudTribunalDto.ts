/**
 * @fileoverview DTO de tribunal para listagem pública.
 * @module infrastructure/providers/datajud/dtos/DataJudTribunalDto
 */

import { z } from 'zod';

/**
 * Schema de tribunal para listagem.
 *
 * @type {ZodSchema}
 */
export const DataJudTribunalSchema = z.object({
  sigla: z.string(),
  nome: z.string(),
  endpoint: z.string().url(),
});

export type DataJudTribunalDto = z.infer<typeof DataJudTribunalSchema>;
