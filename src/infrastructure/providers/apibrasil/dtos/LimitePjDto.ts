/**
 * @fileoverview DTO de LimitePj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/LimitePjDto
 */

import { z } from 'zod';

export const LimitePjSchema = z.unknown();

export type LimitePjDto = z.infer<typeof LimitePjSchema>;
