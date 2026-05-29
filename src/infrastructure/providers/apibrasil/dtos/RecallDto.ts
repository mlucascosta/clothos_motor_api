/**
 * @fileoverview DTO de Recall — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RecallDto
 */

import { z } from 'zod';

export const RecallSchema = z.unknown();

export type RecallDto = z.infer<typeof RecallSchema>;
