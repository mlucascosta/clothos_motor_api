/**
 * @fileoverview Operation BancoCentralInabilitados — DirectData Marketplace API.
 * Endpoint para realizar a consulta Banco Central - Quadro Geral de Inabilitados. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/BancoCentralInabilitados
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BancoCentralInabilitados`.
 *
 * @class BancoCentralInabilitados
 * @extends {AbstractDirectDataOperation}
 */
export class BancoCentralInabilitados extends AbstractDirectDataOperation {
  readonly path = '/api/BancoCentralInabilitados';
}
