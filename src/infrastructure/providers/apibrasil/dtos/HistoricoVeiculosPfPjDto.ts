/**
 * @fileoverview DTO de HistoricoVeiculosPfPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/HistoricoVeiculosPfPjDto
 */

import { z } from 'zod';

export const HistoricoVeiculosPfPjSchema = z.unknown();

export type HistoricoVeiculosPfPjDto = z.infer<typeof HistoricoVeiculosPfPjSchema>;
