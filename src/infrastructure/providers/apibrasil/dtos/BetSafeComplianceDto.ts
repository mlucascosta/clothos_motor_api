/**
 * @fileoverview DTO de BetSafeCompliance — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/BetSafeComplianceDto
 */

import { z } from 'zod';

export const BetSafeComplianceSchema = z.unknown();

export type BetSafeComplianceDto = z.infer<typeof BetSafeComplianceSchema>;
