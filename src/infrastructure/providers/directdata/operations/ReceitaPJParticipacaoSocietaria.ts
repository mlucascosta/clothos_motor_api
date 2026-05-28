/**
 * @fileoverview Operation ReceitaPJParticipacaoSocietaria — DirectData Marketplace API.
 * Endpoint para realizar a consulta Receita Federal - Pessoa Jurídica - QSA + Participação Societária. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/ReceitaPJParticipacaoSocietaria
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `ReceitaPJParticipacaoSocietaria`.
 *
 * @class ReceitaPJParticipacaoSocietaria
 * @extends {AbstractDirectDataOperation}
 */
export class ReceitaPJParticipacaoSocietaria extends AbstractDirectDataOperation {
  readonly path = '/api/ReceitaPJParticipacaoSocietaria';
}
