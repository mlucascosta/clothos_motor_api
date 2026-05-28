/**
 * @fileoverview Operation EnriquecimentoLead — DirectData Marketplace API.
 * Endpoint para realizar a consulta Enriquecimento de Lead. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/EnriquecimentoLead
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `EnriquecimentoLead`.
 *
 * @class EnriquecimentoLead
 * @extends {AbstractDirectDataOperation}
 */
export class EnriquecimentoLead extends AbstractDirectDataOperation {
  readonly path = '/api/EnriquecimentoLead';
}
