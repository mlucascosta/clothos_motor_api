/**
 * @fileoverview DTO de CalculaDistanciaCep — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CalculaDistanciaCepDto
 */

import { z } from 'zod';

export const CalculaDistanciaCepSchema = z.unknown();

export type CalculaDistanciaCepDto = z.infer<typeof CalculaDistanciaCepSchema>;
