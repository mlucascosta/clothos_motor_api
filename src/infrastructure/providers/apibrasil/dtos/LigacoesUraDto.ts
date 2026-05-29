/**
 * @fileoverview DTO de LigacoesUra — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/LigacoesUraDto
 */

import { z } from 'zod';

export const LigacoesUraSchema = z.unknown();

export type LigacoesUraDto = z.infer<typeof LigacoesUraSchema>;
