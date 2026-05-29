/**
 * @fileoverview DTO de AnaliticoVeicular — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AnaliticoVeicularDto
 */

import { z } from 'zod';

export const AnaliticoVeicularSchema = z.unknown();

export type AnaliticoVeicularDto = z.infer<typeof AnaliticoVeicularSchema>;
