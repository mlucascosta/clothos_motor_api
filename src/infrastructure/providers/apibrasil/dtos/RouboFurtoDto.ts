/**
 * @fileoverview DTO de RouboFurto — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RouboFurtoDto
 */

import { z } from 'zod';

export const RouboFurtoSchema = z.unknown();

export type RouboFurtoDto = z.infer<typeof RouboFurtoSchema>;
