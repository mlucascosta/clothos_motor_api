/**
 * @fileoverview DTO de Crbm — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CrbmDto
 */

import { z } from 'zod';

export const CrbmSchema = z.unknown();

export type CrbmDto = z.infer<typeof CrbmSchema>;
