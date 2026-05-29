/**
 * @fileoverview DTO de SpcTerceirosPf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/SpcTerceirosPfDto
 */

import { z } from 'zod';

export const SpcTerceirosPfSchema = z.unknown();

export type SpcTerceirosPfDto = z.infer<typeof SpcTerceirosPfSchema>;
