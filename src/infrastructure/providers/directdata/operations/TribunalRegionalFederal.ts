/**
 * @fileoverview Operation TribunalRegionalFederal — DirectData Marketplace API.
 * Endpoint para realizar a consulta TRF - Tribunal Regional Federal (Certidão Cível, Eleitoral ou Criminal).
 * @module infrastructure/providers/directdata/operations/TribunalRegionalFederal
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `TribunalRegionalFederal`.
 *
 * @class TribunalRegionalFederal
 * @extends {AbstractDirectDataOperation}
 */
export class TribunalRegionalFederal extends AbstractDirectDataOperation {
  readonly path = '/api/TribunalRegionalFederal';
}
