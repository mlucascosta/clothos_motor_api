/**
 * @fileoverview DTO de ComplianceBasic — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ComplianceBasicDto
 */

import { z } from 'zod';

export const ComplianceBasicSchema = z.unknown();

export type ComplianceBasicDto = z.infer<typeof ComplianceBasicSchema>;
