/**
 * @fileoverview DTO de Crm — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CrmDto
 */

import { z } from 'zod';

export const CrmSchema = z.unknown();

export type CrmDto = z.infer<typeof CrmSchema>;
