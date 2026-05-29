/**
 * @fileoverview DTO de CreditosSimplesPf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CreditosSimplesPfDto
 */

import { z } from 'zod';

export const CreditosSimplesPfSchema = z.unknown();

export type CreditosSimplesPfDto = z.infer<typeof CreditosSimplesPfSchema>;
