/**
 * @fileoverview DTO de CreditosSimplesPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CreditosSimplesPjDto
 */

import { z } from 'zod';

export const CreditosSimplesPjSchema = z.unknown();

export type CreditosSimplesPjDto = z.infer<typeof CreditosSimplesPjSchema>;
