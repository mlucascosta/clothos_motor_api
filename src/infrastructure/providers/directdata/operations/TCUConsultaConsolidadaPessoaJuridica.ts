/**
 * @fileoverview Operation TCUConsultaConsolidadaPessoaJuridica — DirectData Marketplace API.
 * Endpoint para realizar a consulta TCU - Consulta Consolidada de Pessoa Jurídica - APF.
 * @module infrastructure/providers/directdata/operations/TCUConsultaConsolidadaPessoaJuridica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `TCUConsultaConsolidadaPessoaJuridica`.
 *
 * @class TCUConsultaConsolidadaPessoaJuridica
 * @extends {AbstractDirectDataOperation}
 */
export class TCUConsultaConsolidadaPessoaJuridica extends AbstractDirectDataOperation {
  readonly path = '/api/TCUConsultaConsolidadaPessoaJuridica';
}
