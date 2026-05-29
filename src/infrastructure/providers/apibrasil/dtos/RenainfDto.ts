/**
 * @fileoverview DTO de Renainf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RenainfDto
 */

import { z } from 'zod';

export const RenainfSchema = z.unknown();

export type RenainfDto = z.infer<typeof RenainfSchema>;
