/**
 * @fileoverview Operation IBAMACertidaoNegativaEmbargos — DirectData Marketplace API.
 * Endpoint para realizar a consulta IBAMA - Certidão Negativa de Embargo.
 * @module infrastructure/providers/directdata/operations/IBAMACertidaoNegativaEmbargos
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `IBAMACertidaoNegativaEmbargos`.
 *
 * @class IBAMACertidaoNegativaEmbargos
 * @extends {AbstractDirectDataOperation}
 */
export class IBAMACertidaoNegativaEmbargos extends AbstractDirectDataOperation {
  readonly path = '/api/IBAMACertidaoNegativaEmbargos';
}
