/**
 * @fileoverview Operation BoaVistaDefineLimitePositivoPJ — DirectData Marketplace API.
 * Endpoint para realizar a consulta Boa Vista - Define Limite Positivo Pessoa Jurídica.
 * @module infrastructure/providers/directdata/operations/BoaVistaDefineLimitePositivoPJ
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BoaVistaDefineLimitePositivoPJ`.
 *
 * @class BoaVistaDefineLimitePositivoPJ
 * @extends {AbstractDirectDataOperation}
 */
export class BoaVistaDefineLimitePositivoPJ extends AbstractDirectDataOperation {
  readonly path = '/api/BoaVistaDefineLimitePositivoPJ';
}
