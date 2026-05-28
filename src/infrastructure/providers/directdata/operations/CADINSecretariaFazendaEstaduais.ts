/**
 * @fileoverview Operation CADINSecretariaFazendaEstaduais — DirectData Marketplace API.
 * Endpoint para realizar a consulta CADIN - Secretaria da Fazenda .
 * @module infrastructure/providers/directdata/operations/CADINSecretariaFazendaEstaduais
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CADINSecretariaFazendaEstaduais`.
 *
 * @class CADINSecretariaFazendaEstaduais
 * @extends {AbstractDirectDataOperation}
 */
export class CADINSecretariaFazendaEstaduais extends AbstractDirectDataOperation {
  readonly path = '/api/CADINSecretariaFazendaEstaduais';
}
