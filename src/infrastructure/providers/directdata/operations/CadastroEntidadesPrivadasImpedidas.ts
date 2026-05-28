/**
 * @fileoverview Operation CadastroEntidadesPrivadasImpedidas — DirectData Marketplace API.
 * Endpoint para realizar a consulta CEPIM - Cadastro de Entidades Privadas Sem Fins Lucrativos Impedidas. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CadastroEntidadesPrivadasImpedidas
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroEntidadesPrivadasImpedidas`.
 *
 * @class CadastroEntidadesPrivadasImpedidas
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroEntidadesPrivadasImpedidas extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroEntidadesPrivadasImpedidas';
}
