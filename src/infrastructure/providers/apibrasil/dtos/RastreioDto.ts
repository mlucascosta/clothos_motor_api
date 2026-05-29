/**
 * @fileoverview DTO de Rastreio — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RastreioDto
 */

import { z } from 'zod';

export const RastreioSchema = z.unknown();

export type RastreioDto = z.infer<typeof RastreioSchema>;
