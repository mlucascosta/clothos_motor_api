/**
 * @fileoverview Operation CertidaoConjuntaDebitosPessoaFisica — DirectData Marketplace API.
 * Endpoint para realizar a consulta CCD - Certidão Conjunta de Débitos - Pessoa Física.
 * @module infrastructure/providers/directdata/operations/CertidaoConjuntaDebitosPessoaFisica
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CertidaoConjuntaDebitosPessoaFisica`.
 *
 * @class CertidaoConjuntaDebitosPessoaFisica
 * @extends {AbstractDirectDataOperation}
 */
export class CertidaoConjuntaDebitosPessoaFisica extends AbstractDirectDataOperation {
  readonly path = '/api/CertidaoConjuntaDebitosPessoaFisica';
}
