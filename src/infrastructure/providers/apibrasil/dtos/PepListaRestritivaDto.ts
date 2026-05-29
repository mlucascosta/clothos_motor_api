/**
 * @fileoverview DTO de PepListaRestritiva — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/PepListaRestritivaDto
 */

import { z } from 'zod';

export const PepListaRestritivaSchema = z.unknown();

export type PepListaRestritivaDto = z.infer<typeof PepListaRestritivaSchema>;
