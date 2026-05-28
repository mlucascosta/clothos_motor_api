/**
 * @fileoverview Operation PoliciaCivilAntecedentesCriminais — DirectData Marketplace API.
 * Endpoint para realizar a consulta Polícia Civil - Antecedentes Criminais.
 * @module infrastructure/providers/directdata/operations/PoliciaCivilAntecedentesCriminais
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `PoliciaCivilAntecedentesCriminais`.
 *
 * @class PoliciaCivilAntecedentesCriminais
 * @extends {AbstractDirectDataOperation}
 */
export class PoliciaCivilAntecedentesCriminais extends AbstractDirectDataOperation {
  readonly path = '/api/PoliciaCivilAntecedentesCriminais';
}
