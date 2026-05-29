/**
 * @fileoverview DTO de Gravame — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/GravameDto
 */

import { z } from 'zod';

export const GravameSchema = z.unknown();

export type GravameDto = z.infer<typeof GravameSchema>;
