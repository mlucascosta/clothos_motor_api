/**
 * @fileoverview DTO de HistoricoProprietario — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/HistoricoProprietarioDto
 */

import { z } from 'zod';

export const HistoricoProprietarioSchema = z.unknown();

export type HistoricoProprietarioDto = z.infer<typeof HistoricoProprietarioSchema>;
