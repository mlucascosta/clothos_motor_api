/**
 * @fileoverview DTO de RiscoPositivoPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RiscoPositivoPjDto
 */

import { z } from 'zod';

export const RiscoPositivoPjSchema = z.unknown();

export type RiscoPositivoPjDto = z.infer<typeof RiscoPositivoPjSchema>;
