/**
 * @fileoverview DTO de RelatorioPositivoPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RelatorioPositivoPjDto
 */

import { z } from 'zod';

export const RelatorioPositivoPjSchema = z.unknown();

export type RelatorioPositivoPjDto = z.infer<typeof RelatorioPositivoPjSchema>;
