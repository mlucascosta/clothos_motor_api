/**
 * @fileoverview Operation TJCertidaoCivelCriminalFiscal — DirectData Marketplace API.
 * Endpoint para realizar a consulta TJ - Certidão Cível, Criminal e Fiscal - Tribunal de Justiça.
 * @module infrastructure/providers/directdata/operations/TJCertidaoCivelCriminalFiscal
 */

import { AbstractDirectDataOperation } from './AbstractDirectDataOperation.js';

/**
 * Operation para endpoint `TJCertidaoCivelCriminalFiscal`.
 *
 * @class TJCertidaoCivelCriminalFiscal
 * @extends {AbstractDirectDataOperation}
 */
export class TJCertidaoCivelCriminalFiscal extends AbstractDirectDataOperation {
  readonly path = '/api/TJCertidaoCivelCriminalFiscal';
}
