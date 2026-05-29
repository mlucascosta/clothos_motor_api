/**
 * @fileoverview DTO de CpfObitoGrupoCadastral — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CpfObitoGrupoCadastralDto
 */

import { z } from 'zod';

export const CpfObitoGrupoCadastralSchema = z.unknown();

export type CpfObitoGrupoCadastralDto = z.infer<typeof CpfObitoGrupoCadastralSchema>;
