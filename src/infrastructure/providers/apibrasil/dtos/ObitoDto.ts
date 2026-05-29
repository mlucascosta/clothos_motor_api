/**
 * @fileoverview DTO de Obito — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ObitoDto
 */

import { z } from 'zod';

export const ObitoSchema = z.unknown();

export type ObitoDto = z.infer<typeof ObitoSchema>;
