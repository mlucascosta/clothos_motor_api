/**
 * @fileoverview DTO de ScrBacenScore — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ScrBacenScoreDto
 */

import { z } from 'zod';

export const ScrBacenScoreSchema = z.unknown();

export type ScrBacenScoreDto = z.infer<typeof ScrBacenScoreSchema>;
