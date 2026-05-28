/**
 * @fileoverview Operation CertidaoNegativaDebitosImovelRural — DirectData Marketplace API.
 * Endpoint para realizar a consulta CNDIR - Certidão Negativa de Débitos e Dívida Ativa da União de Imóvel Rural.
 * @module infrastructure/providers/directdata/operations/CertidaoNegativaDebitosImovelRural
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CertidaoNegativaDebitosImovelRural`.
 *
 * @class CertidaoNegativaDebitosImovelRural
 * @extends {AbstractDirectDataOperation}
 */
export class CertidaoNegativaDebitosImovelRural extends AbstractDirectDataOperation {
  readonly path = '/api/CertidaoNegativaDebitosImovelRural';
}
