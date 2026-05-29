/**
 * @fileoverview DTO de AnaliseCreditoBusiness — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AnaliseCreditoBusinessDto
 */

import { z } from 'zod';

export const AnaliseCreditoBusinessSchema = z.unknown();

export type AnaliseCreditoBusinessDto = z.infer<typeof AnaliseCreditoBusinessSchema>;
