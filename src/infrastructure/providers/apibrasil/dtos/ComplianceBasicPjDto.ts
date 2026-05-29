/**
 * @fileoverview DTO de ComplianceBasicPj — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ComplianceBasicPjDto
 */

import { z } from 'zod';

export const ComplianceBasicPjSchema = z.unknown();

export type ComplianceBasicPjDto = z.infer<typeof ComplianceBasicPjSchema>;
