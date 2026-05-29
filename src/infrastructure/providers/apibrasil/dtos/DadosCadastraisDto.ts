/**
 * @fileoverview DTO de DadosCadastrais — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/DadosCadastraisDto
 */

import { z } from 'zod';

export const DadosCadastraisSchema = z.unknown();

export type DadosCadastraisDto = z.infer<typeof DadosCadastraisSchema>;
