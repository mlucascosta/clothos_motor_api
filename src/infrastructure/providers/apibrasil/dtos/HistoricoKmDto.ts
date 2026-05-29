/**
 * @fileoverview DTO de HistoricoKm — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/HistoricoKmDto
 */

import { z } from 'zod';

export const HistoricoKmSchema = z.unknown();

export type HistoricoKmDto = z.infer<typeof HistoricoKmSchema>;
