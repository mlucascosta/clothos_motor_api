/**
 * @fileoverview Operation BeneficiarioFinal — DirectData Marketplace API.
 * Endpoint para realizar a consulta Beneficiário Final. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/BeneficiarioFinal
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BeneficiarioFinal`.
 *
 * @class BeneficiarioFinal
 * @extends {AbstractDirectDataOperation}
 */
export class BeneficiarioFinal extends AbstractDirectDataOperation {
  readonly path = '/api/BeneficiarioFinal';
}
