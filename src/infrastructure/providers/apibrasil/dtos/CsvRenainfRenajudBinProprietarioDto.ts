/**
 * @fileoverview DTO de CsvRenainfRenajudBinProprietario — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CsvRenainfRenajudBinProprietarioDto
 */

import { z } from 'zod';

export const CsvRenainfRenajudBinProprietarioSchema = z.unknown();

export type CsvRenainfRenajudBinProprietarioDto = z.infer<typeof CsvRenainfRenajudBinProprietarioSchema>;
