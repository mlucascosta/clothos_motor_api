/**
 * @fileoverview DTO de AnaliseCreditoPlusPf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AnaliseCreditoPlusPfDto
 */

import { z } from 'zod';

export const AnaliseCreditoPlusPfSchema = z.unknown();

export type AnaliseCreditoPlusPfDto = z.infer<typeof AnaliseCreditoPlusPfSchema>;
