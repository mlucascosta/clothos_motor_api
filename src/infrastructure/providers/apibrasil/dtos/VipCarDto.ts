/**
 * @fileoverview DTO de VipCar — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/VipCarDto
 */

import { z } from 'zod';

export const VipCarSchema = z.unknown();

export type VipCarDto = z.infer<typeof VipCarSchema>;
