/**
 * @fileoverview DTO de Sms — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/SmsDto
 */

import { z } from 'zod';

export const SmsSchema = z.unknown();

export type SmsDto = z.infer<typeof SmsSchema>;
