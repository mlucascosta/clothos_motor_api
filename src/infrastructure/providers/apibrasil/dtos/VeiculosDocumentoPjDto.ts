/**
 * @fileoverview DTO de VeiculosDocumentoPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/VeiculosDocumentoPjDto
 */

import { z } from 'zod';

export const VeiculosDocumentoPjSchema = z.unknown();

export type VeiculosDocumentoPjDto = z.infer<typeof VeiculosDocumentoPjSchema>;
