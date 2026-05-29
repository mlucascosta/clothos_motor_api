/**
 * @fileoverview DTO de CpfRelatorio — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CpfRelatorioDto
 */

import { z } from 'zod';

export const CpfRelatorioSchema = z.unknown();

export type CpfRelatorioDto = z.infer<typeof CpfRelatorioSchema>;
