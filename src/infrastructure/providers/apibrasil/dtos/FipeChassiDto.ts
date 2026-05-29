/**
 * @fileoverview DTO de FipeChassi — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/FipeChassiDto
 */

import { z } from 'zod';

export const FipeChassiSchema = z.unknown();

export type FipeChassiDto = z.infer<typeof FipeChassiSchema>;
