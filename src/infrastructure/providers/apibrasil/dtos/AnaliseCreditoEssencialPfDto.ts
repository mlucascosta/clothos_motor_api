/**
 * @fileoverview DTO de AnaliseCreditoEssencialPf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AnaliseCreditoEssencialPfDto
 */

import { z } from 'zod';

export const AnaliseCreditoEssencialPfSchema = z.unknown();

export type AnaliseCreditoEssencialPfDto = z.infer<typeof AnaliseCreditoEssencialPfSchema>;
