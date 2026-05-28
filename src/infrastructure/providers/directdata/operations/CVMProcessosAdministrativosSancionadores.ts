/**
 * @fileoverview Operation CVMProcessosAdministrativosSancionadores — DirectData Marketplace API.
 * Endpoint para realizar a consulta CVM - Processos Administrativos Sancionadores. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CVMProcessosAdministrativosSancionadores
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CVMProcessosAdministrativosSancionadores`.
 *
 * @class CVMProcessosAdministrativosSancionadores
 * @extends {AbstractDirectDataOperation}
 */
export class CVMProcessosAdministrativosSancionadores extends AbstractDirectDataOperation {
  readonly path = '/api/CVMProcessosAdministrativosSancionadores';
}
