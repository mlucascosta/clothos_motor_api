/**
 * @fileoverview Operation Sintegra — DirectData Marketplace API.
 * Endpoint para realizar a consulta Sintegra - Cadastros Estaduais.
 * @module infrastructure/providers/directdata/operations/Sintegra
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `Sintegra`.
 *
 * @class Sintegra
 * @extends {AbstractDirectDataOperation}
 */
export class Sintegra extends AbstractDirectDataOperation {
  readonly path = '/api/Sintegra';
}
