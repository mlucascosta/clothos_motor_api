/**
 * @fileoverview Operation SintegraCCC — DirectData Marketplace API.
 * Endpoint para realizar a consulta Sintegra - Cadastro Centralizado de Contribuinte - CCC.
 * @module infrastructure/providers/directdata/operations/SintegraCCC
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `SintegraCCC`.
 *
 * @class SintegraCCC
 * @extends {AbstractDirectDataOperation}
 */
export class SintegraCCC extends AbstractDirectDataOperation {
  readonly path = '/api/SintegraCCC';
}
