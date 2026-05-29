/**
 * @fileoverview DTO de RelatorioPositivo — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RelatorioPositivoDto
 */

import { z } from 'zod';

export const RelatorioPositivoSchema = z.unknown();

export type RelatorioPositivoDto = z.infer<typeof RelatorioPositivoSchema>;
