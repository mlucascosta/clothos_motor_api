/**
 * @fileoverview DTO de EnriquecimentoDeLead — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/EnriquecimentoDeLeadDto
 */

import { z } from 'zod';

export const EnriquecimentoDeLeadSchema = z.unknown();

export type EnriquecimentoDeLeadDto = z.infer<typeof EnriquecimentoDeLeadSchema>;
