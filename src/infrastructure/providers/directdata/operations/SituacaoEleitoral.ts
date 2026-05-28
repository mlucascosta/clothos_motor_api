/**
 * @fileoverview Operation SituacaoEleitoral — DirectData Marketplace API.
 * Endpoint para realizar a consulta TSE - Situação Eleitoral. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/SituacaoEleitoral
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `SituacaoEleitoral`.
 *
 * @class SituacaoEleitoral
 * @extends {AbstractDirectDataOperation}
 */
export class SituacaoEleitoral extends AbstractDirectDataOperation {
  readonly path = '/api/SituacaoEleitoral';
}
