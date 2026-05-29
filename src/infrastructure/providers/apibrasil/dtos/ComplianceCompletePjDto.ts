/**
 * @fileoverview DTO de ComplianceCompletePj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ComplianceCompletePjDto
 */

import { z } from 'zod';

export const ComplianceCompletePjSchema = z.unknown();

export type ComplianceCompletePjDto = z.infer<typeof ComplianceCompletePjSchema>;
