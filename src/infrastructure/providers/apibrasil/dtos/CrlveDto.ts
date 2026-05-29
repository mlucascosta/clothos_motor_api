/**
 * @fileoverview DTO de Crlve — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CrlveDto
 */

import { z } from 'zod';

export const CrlveSchema = z.unknown();

export type CrlveDto = z.infer<typeof CrlveSchema>;
