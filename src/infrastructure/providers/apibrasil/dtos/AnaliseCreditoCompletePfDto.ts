/**
 * @fileoverview DTO de AnaliseCreditoCompletePf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AnaliseCreditoCompletePfDto
 */

import { z } from 'zod';

export const AnaliseCreditoCompletePfSchema = z.unknown();

export type AnaliseCreditoCompletePfDto = z.infer<typeof AnaliseCreditoCompletePfSchema>;
