/**
 * @fileoverview DTO de EmissaoNotas — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/EmissaoNotasDto
 */

import { z } from 'zod';

export const EmissaoNotasSchema = z.unknown();

export type EmissaoNotasDto = z.infer<typeof EmissaoNotasSchema>;
