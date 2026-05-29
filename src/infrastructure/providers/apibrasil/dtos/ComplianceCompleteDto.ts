/**
 * @fileoverview DTO de ComplianceComplete — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ComplianceCompleteDto
 */

import { z } from 'zod';

export const ComplianceCompleteSchema = z.unknown();

export type ComplianceCompleteDto = z.infer<typeof ComplianceCompleteSchema>;
