/**
 * @fileoverview DTO de ProprietarioAtual — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/ProprietarioAtualDto
 */

import { z } from 'zod';

export const ProprietarioAtualSchema = z.unknown();

export type ProprietarioAtualDto = z.infer<typeof ProprietarioAtualSchema>;
