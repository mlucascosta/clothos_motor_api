/**
 * @fileoverview DTO de LeilaoCompletoScore — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/LeilaoCompletoScoreDto
 */

import { z } from 'zod';

export const LeilaoCompletoScoreSchema = z.unknown();

export type LeilaoCompletoScoreDto = z.infer<typeof LeilaoCompletoScoreSchema>;
