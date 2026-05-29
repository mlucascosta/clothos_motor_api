/**
 * @fileoverview DTO de AcertaEssencial — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AcertaEssencialDto
 */

import { z } from 'zod';

export const AcertaEssencialSchema = z.unknown();

export type AcertaEssencialDto = z.infer<typeof AcertaEssencialSchema>;
