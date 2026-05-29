/**
 * @fileoverview DTO de AntifraudeChavePix — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AntifraudeChavePixDto
 */

import { z } from 'zod';

export const AntifraudeChavePixSchema = z.unknown();

export type AntifraudeChavePixDto = z.infer<typeof AntifraudeChavePixSchema>;
