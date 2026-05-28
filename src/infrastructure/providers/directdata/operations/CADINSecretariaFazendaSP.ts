/**
 * @fileoverview Operation CADINSecretariaFazendaSP — DirectData Marketplace API.
 * Endpoint para realizar a consulta CADIN - Secretaria da Fazenda - São Paulo.
 * @module infrastructure/providers/directdata/operations/CADINSecretariaFazendaSP
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CADINSecretariaFazendaSP`.
 *
 * @class CADINSecretariaFazendaSP
 * @extends {AbstractDirectDataOperation}
 */
export class CADINSecretariaFazendaSP extends AbstractDirectDataOperation {
  readonly path = '/api/CADINSecretariaFazendaSP';
}
