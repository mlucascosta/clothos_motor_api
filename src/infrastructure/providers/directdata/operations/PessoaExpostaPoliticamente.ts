/**
 * @fileoverview Operation PessoaExpostaPoliticamente — DirectData Marketplace API.
 * Endpoint para realizar a consulta PEP - Pessoa Exposta Politicamente. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/PessoaExpostaPoliticamente
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `PessoaExpostaPoliticamente`.
 *
 * @class PessoaExpostaPoliticamente
 * @extends {AbstractDirectDataOperation}
 */
export class PessoaExpostaPoliticamente extends AbstractDirectDataOperation {
  readonly path = '/api/PessoaExpostaPoliticamente';
}
