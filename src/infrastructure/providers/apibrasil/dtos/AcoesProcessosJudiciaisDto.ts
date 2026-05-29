/**
 * @fileoverview DTO de AcoesProcessosJudiciais — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/AcoesProcessosJudiciaisDto
 */

import { z } from 'zod';

export const AcoesProcessosJudiciaisSchema = z.unknown();

export type AcoesProcessosJudiciaisDto = z.infer<typeof AcoesProcessosJudiciaisSchema>;
