/**
 * @fileoverview DTO de Cro — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CroDto
 */

import { z } from 'zod';

export const CroSchema = z.unknown();

export type CroDto = z.infer<typeof CroSchema>;
