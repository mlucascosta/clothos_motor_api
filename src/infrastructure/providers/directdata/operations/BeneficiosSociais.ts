/**
 * @fileoverview Operation BeneficiosSociais — DirectData Marketplace API.
 * Endpoint para realizar a consulta Benefícios Sociais - Pessoa Física. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/BeneficiosSociais
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `BeneficiosSociais`.
 *
 * @class BeneficiosSociais
 * @extends {AbstractDirectDataOperation}
 */
export class BeneficiosSociais extends AbstractDirectDataOperation {
  readonly path = '/api/BeneficiosSociais';
}
