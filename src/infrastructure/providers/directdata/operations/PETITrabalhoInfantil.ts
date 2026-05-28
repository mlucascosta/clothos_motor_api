/**
 * @fileoverview Operation PETITrabalhoInfantil — DirectData Marketplace API.
 * Endpoint para realizar a consulta PETI -  Programa de Erradicação do Trabalho Infantil. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/PETITrabalhoInfantil
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `PETITrabalhoInfantil`.
 *
 * @class PETITrabalhoInfantil
 * @extends {AbstractDirectDataOperation}
 */
export class PETITrabalhoInfantil extends AbstractDirectDataOperation {
  readonly path = '/api/PETITrabalhoInfantil';
}
