/**
 * @fileoverview DTO de QuodPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/QuodPjDto
 */

import { z } from 'zod';

export const QuodPjSchema = z.unknown();

export type QuodPjDto = z.infer<typeof QuodPjSchema>;
