/**
 * @fileoverview DTO de AntecedentesCriminais — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AntecedentesCriminaisDto
 */

import { z } from 'zod';

export const AntecedentesCriminaisSchema = z.unknown();

export type AntecedentesCriminaisDto = z.infer<typeof AntecedentesCriminaisSchema>;
