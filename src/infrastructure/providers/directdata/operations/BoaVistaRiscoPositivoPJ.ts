/**
 * @fileoverview Operation BoaVistaRiscoPositivoPJ — DirectData Marketplace API.
 * Endpoint para realizar a consulta Boa Vista - Risco Positivo Pessoa Jurídica.
 * @module infrastructure/providers/directdata/operations/BoaVistaRiscoPositivoPJ
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BoaVistaRiscoPositivoPJ`.
 *
 * @class BoaVistaRiscoPositivoPJ
 * @extends {AbstractDirectDataOperation}
 */
export class BoaVistaRiscoPositivoPJ extends AbstractDirectDataOperation {
  readonly path = '/api/BoaVistaRiscoPositivoPJ';
}
