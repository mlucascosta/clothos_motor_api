/**
 * @fileoverview DTO de AcertaEssencialPositivo — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AcertaEssencialPositivoDto
 */

import { z } from 'zod';

export const AcertaEssencialPositivoSchema = z.unknown();

export type AcertaEssencialPositivoDto = z.infer<typeof AcertaEssencialPositivoSchema>;
