/**
 * @fileoverview DTO de Var — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/VarDto
 */

import { z } from 'zod';

export const VarSchema = z.unknown();

export type VarDto = z.infer<typeof VarSchema>;
