/**
 * @fileoverview DTO de CnhPorCpf — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CnhPorCpfDto
 */

import { z } from 'zod';

export const CnhPorCpfSchema = z.unknown();

export type CnhPorCpfDto = z.infer<typeof CnhPorCpfSchema>;
