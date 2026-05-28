/**
 * @fileoverview Operation RestituicaoIRPF — DirectData Marketplace API.
 * Endpoint para realizar a consulta Restituição Imposto de Renda - IRPF. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/RestituicaoIRPF
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `RestituicaoIRPF`.
 *
 * @class RestituicaoIRPF
 * @extends {AbstractDirectDataOperation}
 */
export class RestituicaoIRPF extends AbstractDirectDataOperation {
  readonly path = '/api/RestituicaoIRPF';
}
