/**
 * @fileoverview DTO de SecretariaDaFazendaSaoPaulo — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/SecretariaDaFazendaSaoPauloDto
 */

import { z } from 'zod';

export const SecretariaDaFazendaSaoPauloSchema = z.unknown();

export type SecretariaDaFazendaSaoPauloDto = z.infer<typeof SecretariaDaFazendaSaoPauloSchema>;
