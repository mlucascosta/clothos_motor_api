/**
 * @fileoverview Operation CadastroAmbientalRural — DirectData Marketplace API.
 * Endpoint para realizar a consulta CAR - Cadastro Ambiental Rural.
 * @module infrastructure/providers/directdata/operations/CadastroAmbientalRural
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroAmbientalRural`.
 *
 * @class CadastroAmbientalRural
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroAmbientalRural extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroAmbientalRural';
}
