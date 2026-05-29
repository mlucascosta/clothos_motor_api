/**
 * @fileoverview DTO de VeiculosDocumentoPf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/VeiculosDocumentoPfDto
 */

import { z } from 'zod';

export const VeiculosDocumentoPfSchema = z.unknown();

export type VeiculosDocumentoPfDto = z.infer<typeof VeiculosDocumentoPfSchema>;
