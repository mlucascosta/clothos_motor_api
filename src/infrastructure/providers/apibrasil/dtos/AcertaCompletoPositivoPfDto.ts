/**
 * @fileoverview DTO de AcertaCompletoPositivoPf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AcertaCompletoPositivoPfDto
 */

import { z } from 'zod';

export const AcertaCompletoPositivoPfSchema = z.unknown();

export type AcertaCompletoPositivoPfDto = z.infer<typeof AcertaCompletoPositivoPfSchema>;
