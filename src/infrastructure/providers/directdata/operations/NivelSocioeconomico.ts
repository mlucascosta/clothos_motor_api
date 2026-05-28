/**
 * @fileoverview Operation NivelSocioeconomico — DirectData Marketplace API.
 * Endpoint para realizar a consulta Nível Socioeconômico e Renda Estimada. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/NivelSocioeconomico
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `NivelSocioeconomico`.
 *
 * @class NivelSocioeconomico
 * @extends {AbstractDirectDataOperation}
 */
export class NivelSocioeconomico extends AbstractDirectDataOperation {
  readonly path = '/api/NivelSocioeconomico';
}
