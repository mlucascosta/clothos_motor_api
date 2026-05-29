/**
 * @fileoverview DTO de CertidaoNegativaDeDebitosPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CertidaoNegativaDeDebitosPjDto
 */

import { z } from 'zod';

export const CertidaoNegativaDeDebitosPjSchema = z.unknown();

export type CertidaoNegativaDeDebitosPjDto = z.infer<typeof CertidaoNegativaDeDebitosPjSchema>;
