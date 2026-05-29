/**
 * @fileoverview DTO de RelatorioVeicular — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/RelatorioVeicularDto
 */

import { z } from 'zod';

export const RelatorioVeicularSchema = z.unknown();

export type RelatorioVeicularDto = z.infer<typeof RelatorioVeicularSchema>;
