/**
 * @fileoverview DTO de EnderecoTelefonePorPlaca — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/EnderecoTelefonePorPlacaDto
 */

import { z } from 'zod';

export const EnderecoTelefonePorPlacaSchema = z.unknown();

export type EnderecoTelefonePorPlacaDto = z.infer<typeof EnderecoTelefonePorPlacaSchema>;
