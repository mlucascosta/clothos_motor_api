/**
 * @fileoverview DTO de DetalhamentoNegativo — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/DetalhamentoNegativoDto
 */

import { z } from 'zod';

export const DetalhamentoNegativoSchema = z.unknown();

export type DetalhamentoNegativoDto = z.infer<typeof DetalhamentoNegativoSchema>;
