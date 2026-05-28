/**
 * @fileoverview Operation PoliciaFederalAntecedentesCriminais — DirectData Marketplace API.
 * Endpoint para realizar a consulta Polícia Federal - Antecedentes Criminais.
 * @module infrastructure/providers/directdata/operations/PoliciaFederalAntecedentesCriminais
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `PoliciaFederalAntecedentesCriminais`.
 *
 * @class PoliciaFederalAntecedentesCriminais
 * @extends {AbstractDirectDataOperation}
 */
export class PoliciaFederalAntecedentesCriminais extends AbstractDirectDataOperation {
  readonly path = '/api/PoliciaFederalAntecedentesCriminais';
}
