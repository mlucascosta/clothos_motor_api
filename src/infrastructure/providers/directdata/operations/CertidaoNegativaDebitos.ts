/**
 * @fileoverview Operation CertidaoNegativaDebitos — DirectData Marketplace API.
 * Endpoint para realizar a consulta CND - Certidão Negativa de Débitos.
 * @module infrastructure/providers/directdata/operations/CertidaoNegativaDebitos
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CertidaoNegativaDebitos`.
 *
 * @class CertidaoNegativaDebitos
 * @extends {AbstractDirectDataOperation}
 */
export class CertidaoNegativaDebitos extends AbstractDirectDataOperation {
  readonly path = '/api/CertidaoNegativaDebitos';
}
