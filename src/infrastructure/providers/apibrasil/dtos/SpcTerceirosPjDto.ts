/**
 * @fileoverview DTO de SpcTerceirosPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/SpcTerceirosPjDto
 */

import { z } from 'zod';

export const SpcTerceirosPjSchema = z.unknown();

export type SpcTerceirosPjDto = z.infer<typeof SpcTerceirosPjSchema>;
