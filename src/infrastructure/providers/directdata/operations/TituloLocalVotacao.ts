/**
 * @fileoverview Operation TituloLocalVotacao — DirectData Marketplace API.
 * Endpoint para realizar a consulta TSE - Título e Local de Votação. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/TituloLocalVotacao
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `TituloLocalVotacao`.
 *
 * @class TituloLocalVotacao
 * @extends {AbstractDirectDataOperation}
 */
export class TituloLocalVotacao extends AbstractDirectDataOperation {
  readonly path = '/api/TituloLocalVotacao';
}
