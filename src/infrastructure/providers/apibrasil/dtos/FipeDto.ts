/**
 * @fileoverview DTO de Fipe — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/FipeDto
 */

import { z } from 'zod';

export const FipeSchema = z.unknown();

export type FipeDto = z.infer<typeof FipeSchema>;
