/**
 * @fileoverview DTO de CertidaoNegativaDeLicitanteInidoneo — APIBrasil.
 * @module infrastructure/providers/apibrasil/dtos/CertidaoNegativaDeLicitanteInidoneoDto
 */

import { z } from 'zod';

export const CertidaoNegativaDeLicitanteInidoneoSchema = z.unknown();

export type CertidaoNegativaDeLicitanteInidoneoDto = z.infer<
  typeof CertidaoNegativaDeLicitanteInidoneoSchema
>;
