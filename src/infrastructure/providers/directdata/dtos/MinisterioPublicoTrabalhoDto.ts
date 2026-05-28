/**
 * @fileoverview DTO de MinisterioPublicoTrabalho — DirectData.
 * @module infrastructure/providers/directdata/dtos/MinisterioPublicoTrabalhoDto
 */

import { z } from 'zod';

export const MinisterioPublicoTrabalhoRetornoSchema = z.object({
  codigoValidacao: z.string().nullable().optional(),
  dataEmissao: z.string().nullable().optional(),
  documentoConsultado: z.string().nullable().optional(),
  ocorrencias: z.array(z.record(z.unknown())).nullable().optional(),
  possuiOcorrencia: z.boolean().nullable().optional(),
  regiao: z.string().nullable().optional(),
  status: z.string().nullable().optional()
});

export type MinisterioPublicoTrabalhoRetornoDto = z.infer<typeof MinisterioPublicoTrabalhoRetornoSchema>;
