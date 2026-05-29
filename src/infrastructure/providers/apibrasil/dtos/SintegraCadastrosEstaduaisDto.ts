/**
 * @fileoverview DTO de SintegraCadastrosEstaduais — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/SintegraCadastrosEstaduaisDto
 */

import { z } from 'zod';

export const SintegraCadastrosEstaduaisSchema = z.unknown();

export type SintegraCadastrosEstaduaisDto = z.infer<typeof SintegraCadastrosEstaduaisSchema>;
