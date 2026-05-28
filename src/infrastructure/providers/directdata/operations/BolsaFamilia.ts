/**
 * @fileoverview Operation BolsaFamilia — DirectData Marketplace API.
 * Endpoint para realizar a consulta Bolsa Família. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/BolsaFamilia
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BolsaFamilia`.
 *
 * @class BolsaFamilia
 * @extends {AbstractDirectDataOperation}
 */
export class BolsaFamilia extends AbstractDirectDataOperation {
  readonly path = '/api/BolsaFamilia';
}
