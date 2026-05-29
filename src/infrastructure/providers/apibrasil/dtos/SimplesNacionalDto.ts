/**
 * @fileoverview DTO de SimplesNacional — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/SimplesNacionalDto
 */

import { z } from 'zod';

export const SimplesNacionalSchema = z.unknown();

export type SimplesNacionalDto = z.infer<typeof SimplesNacionalSchema>;
