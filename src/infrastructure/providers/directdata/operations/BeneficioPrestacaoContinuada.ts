/**
 * @fileoverview Operation BeneficioPrestacaoContinuada — DirectData Marketplace API.
 * Endpoint para realizar a consulta Benefício de Prestação Continuada - BPC. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/BeneficioPrestacaoContinuada
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BeneficioPrestacaoContinuada`.
 *
 * @class BeneficioPrestacaoContinuada
 * @extends {AbstractDirectDataOperation}
 */
export class BeneficioPrestacaoContinuada extends AbstractDirectDataOperation {
  readonly path = '/api/BeneficioPrestacaoContinuada';
}
