/**
 * @fileoverview DTO de CnhCriminals — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CnhCriminalsDto
 */

import { z } from 'zod';

export const CnhCriminalsSchema = z.unknown();

export type CnhCriminalsDto = z.infer<typeof CnhCriminalsSchema>;
