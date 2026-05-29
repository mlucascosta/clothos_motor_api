/**
 * @fileoverview DTO de AnaliseCreditoBasicPf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AnaliseCreditoBasicPfDto
 */

import { z } from 'zod';

export const AnaliseCreditoBasicPfSchema = z.unknown();

export type AnaliseCreditoBasicPfDto = z.infer<typeof AnaliseCreditoBasicPfSchema>;
