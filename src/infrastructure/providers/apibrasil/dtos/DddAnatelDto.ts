/**
 * @fileoverview DTO de DddAnatel — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/DddAnatelDto
 */

import { z } from 'zod';

export const DddAnatelSchema = z.unknown();

export type DddAnatelDto = z.infer<typeof DddAnatelSchema>;
