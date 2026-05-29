/**
 * @fileoverview DTO de CpfLite — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CpfLiteDto
 */

import { z } from 'zod';

export const CpfLiteSchema = z.unknown();

export type CpfLiteDto = z.infer<typeof CpfLiteSchema>;
