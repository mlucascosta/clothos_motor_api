/**
 * @fileoverview DTO de Farol — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/FarolDto
 */

import { z } from 'zod';

export const FarolSchema = z.unknown();

export type FarolDto = z.infer<typeof FarolSchema>;
