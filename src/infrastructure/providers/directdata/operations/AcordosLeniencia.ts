/**
 * @fileoverview Operation AcordosLeniencia — DirectData Marketplace API.
 * Endpoint para realizar a consulta Acordos de Leniência. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/AcordosLeniencia
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `AcordosLeniencia`.
 *
 * @class AcordosLeniencia
 * @extends {AbstractDirectDataOperation}
 */
export class AcordosLeniencia extends AbstractDirectDataOperation {
  readonly path = '/api/AcordosLeniencia';
}
