/**
 * @fileoverview Operation DAPPessoaJuridica — DirectData Marketplace API.
 * Endpoint para realizar a consulta DAP - Declaração de Aptidão ao Pronaf - Pessoa Jurídica.
 * @module infrastructure/providers/directdata/operations/DAPPessoaJuridica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `DAPPessoaJuridica`.
 *
 * @class DAPPessoaJuridica
 * @extends {AbstractDirectDataOperation}
 */
export class DAPPessoaJuridica extends AbstractDirectDataOperation {
  readonly path = '/api/DAPPessoaJuridica';
}
