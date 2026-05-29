/**
 * @fileoverview DTO de CertidaoNegativaDeDebitos — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CertidaoNegativaDeDebitosDto
 */

import { z } from 'zod';

export const CertidaoNegativaDeDebitosSchema = z.unknown();

export type CertidaoNegativaDeDebitosDto = z.infer<typeof CertidaoNegativaDeDebitosSchema>;
