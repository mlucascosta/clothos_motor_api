/**
 * @fileoverview Operation CVMComissaodeValoresMobiliarios — DirectData Marketplace API.
 * Endpoint para realizar a consulta CVM - Comissão de Valores Mobiliários. Obs: esta consulta não possui comprovante.
 * @module infrastructure/providers/directdata/operations/CVMComissaodeValoresMobiliarios
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CVMComissaodeValoresMobiliarios`.
 *
 * @class CVMComissaodeValoresMobiliarios
 * @extends {AbstractDirectDataOperation}
 */
export class CVMComissaodeValoresMobiliarios extends AbstractDirectDataOperation {
  readonly path = '/api/CVMComissaodeValoresMobiliarios';
}
