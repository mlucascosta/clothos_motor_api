/**
 * @fileoverview DTO de Cnpj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CnpjDto
 */

import { z } from 'zod';

export const CnpjSchema = z.unknown();

export type CnpjDto = z.infer<typeof CnpjSchema>;
