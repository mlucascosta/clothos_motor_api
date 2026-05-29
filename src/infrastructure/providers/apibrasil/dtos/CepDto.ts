/**
 * @fileoverview DTO de Cep — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CepDto
 */

import { z } from 'zod';

export const CepSchema = z.unknown();

export type CepDto = z.infer<typeof CepSchema>;
