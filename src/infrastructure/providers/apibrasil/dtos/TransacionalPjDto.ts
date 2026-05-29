/**
 * @fileoverview DTO de TransacionalPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/TransacionalPjDto
 */

import { z } from 'zod';

export const TransacionalPjSchema = z.unknown();

export type TransacionalPjDto = z.infer<typeof TransacionalPjSchema>;
