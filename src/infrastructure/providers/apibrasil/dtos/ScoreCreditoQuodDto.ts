/**
 * @fileoverview DTO de ScoreCreditoQuod — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ScoreCreditoQuodDto
 */

import { z } from 'zod';

export const ScoreCreditoQuodSchema = z.unknown();

export type ScoreCreditoQuodDto = z.infer<typeof ScoreCreditoQuodSchema>;
