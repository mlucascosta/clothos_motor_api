/**
 * @fileoverview Operation MPFCertidaoNegativa — DirectData Marketplace API.
 * Endpoint para realizar a consulta Ministério Público Federal - Certidão Negativa.
 * @module infrastructure/providers/directdata/operations/MPFCertidaoNegativa
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `MPFCertidaoNegativa`.
 *
 * @class MPFCertidaoNegativa
 * @extends {AbstractDirectDataOperation}
 */
export class MPFCertidaoNegativa extends AbstractDirectDataOperation {
  readonly path = '/api/MPFCertidaoNegativa';
}
