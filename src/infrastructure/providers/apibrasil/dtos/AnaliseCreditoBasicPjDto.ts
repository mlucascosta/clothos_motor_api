/**
 * @fileoverview DTO de AnaliseCreditoBasicPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AnaliseCreditoBasicPjDto
 */

import { z } from 'zod';

export const AnaliseCreditoBasicPjSchema = z.unknown();

export type AnaliseCreditoBasicPjDto = z.infer<typeof AnaliseCreditoBasicPjSchema>;
