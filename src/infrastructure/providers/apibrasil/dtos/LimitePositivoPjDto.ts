/**
 * @fileoverview DTO de LimitePositivoPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/LimitePositivoPjDto
 */

import { z } from 'zod';

export const LimitePositivoPjSchema = z.unknown();

export type LimitePositivoPjDto = z.infer<typeof LimitePositivoPjSchema>;
