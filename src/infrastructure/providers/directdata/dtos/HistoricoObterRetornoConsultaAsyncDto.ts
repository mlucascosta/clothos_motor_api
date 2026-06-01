/**
 * @fileoverview DTO de HistoricoObterRetornoConsultaAsync — DirectData.
 * @module infrastructure/providers/directdata/dtos/HistoricoObterRetornoConsultaAsyncDto
 */

import { z } from 'zod';

export const HistoricoObterRetornoConsultaAsyncRetornoSchema = z.object({}).passthrough();

export type HistoricoObterRetornoConsultaAsyncRetornoDto = z.infer<
  typeof HistoricoObterRetornoConsultaAsyncRetornoSchema
>;
