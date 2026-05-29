/**
 * @fileoverview DTO de VeiculosTotal — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/VeiculosTotalDto
 */

import { z } from 'zod';

export const VeiculosTotalSchema = z.unknown();

export type VeiculosTotalDto = z.infer<typeof VeiculosTotalSchema>;
