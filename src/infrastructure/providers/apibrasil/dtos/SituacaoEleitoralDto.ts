/**
 * @fileoverview DTO de SituacaoEleitoral — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/SituacaoEleitoralDto
 */

import { z } from 'zod';

export const SituacaoEleitoralSchema = z.unknown();

export type SituacaoEleitoralDto = z.infer<typeof SituacaoEleitoralSchema>;
