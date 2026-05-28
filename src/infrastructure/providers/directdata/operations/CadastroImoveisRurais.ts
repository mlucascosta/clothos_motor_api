/**
 * @fileoverview Operation CadastroImoveisRurais — DirectData Marketplace API.
 * Endpoint para realizar a consulta CAFIR - Cadastros de Imóveis Rurais.
 * @module infrastructure/providers/directdata/operations/CadastroImoveisRurais
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CadastroImoveisRurais`.
 *
 * @class CadastroImoveisRurais
 * @extends {AbstractDirectDataOperation}
 */
export class CadastroImoveisRurais extends AbstractDirectDataOperation {
  readonly path = '/api/CadastroImoveisRurais';
}
