/**
 * @fileoverview DTO de Nacional — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/NacionalDto
 */

import { z } from 'zod';

export const NacionalSchema = z.unknown();

export type NacionalDto = z.infer<typeof NacionalSchema>;
