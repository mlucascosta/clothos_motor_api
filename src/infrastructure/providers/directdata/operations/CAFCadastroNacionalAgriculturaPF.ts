/**
 * @fileoverview Operation CAFCadastroNacionalAgriculturaPF — DirectData Marketplace API.
 * Endpoint para realizar a consulta CAF - Cadastro Nacional de Agricultura Familiar - PF.
 * @module infrastructure/providers/directdata/operations/CAFCadastroNacionalAgriculturaPF
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `CAFCadastroNacionalAgriculturaPF`.
 *
 * @class CAFCadastroNacionalAgriculturaPF
 * @extends {AbstractDirectDataOperation}
 */
export class CAFCadastroNacionalAgriculturaPF extends AbstractDirectDataOperation {
  readonly path = '/api/CAFCadastroNacionalAgriculturaPF';
}
