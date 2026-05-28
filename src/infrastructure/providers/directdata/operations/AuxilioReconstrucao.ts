/**
 * @fileoverview Operation AuxilioReconstrucao — DirectData Marketplace API.
 * Endpoint para realizar a consulta Auxílio Reconstrução. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/AuxilioReconstrucao
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `AuxilioReconstrucao`.
 *
 * @class AuxilioReconstrucao
 * @extends {AbstractDirectDataOperation}
 */
export class AuxilioReconstrucao extends AbstractDirectDataOperation {
  readonly path = '/api/AuxilioReconstrucao';
}
