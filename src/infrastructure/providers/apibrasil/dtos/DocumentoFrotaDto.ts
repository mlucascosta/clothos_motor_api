/**
 * @fileoverview DTO de DocumentoFrota — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/DocumentoFrotaDto
 */

import { z } from 'zod';

export const DocumentoFrotaSchema = z.unknown();

export type DocumentoFrotaDto = z.infer<typeof DocumentoFrotaSchema>;
