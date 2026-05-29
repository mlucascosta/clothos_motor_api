/**
 * @fileoverview Port base para todas as operations da BrasilAPI.
 * Define o contrato mínimo que qualquer operation deve satisfazer para ser
 * registrada em `brasilapiRegistry` e despachada pela rota do motor.
 * @module infrastructure/providers/brasilapi/ports/IBrasilApiOperation
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';

/**
 * Contrato para uma operation da BrasilAPI.
 *
 * Cada operation encapsula um endpoint específico da BrasilAPI (ex.: CNPJ,
 * Registro.br, CVM). O `path` serve como documentação do endpoint subjacente
 * e pode conter placeholders no formato `{nome}` (ex.: `{cnpj}`, `{domain}`).
 *
 * @example
 * // Implementação mínima
 * class MeuEndpoint implements IBrasilApiOperation {
 *   readonly path = '/meu-endpoint/v1/{id}';
 *   async execute(params) {
 *     const id = params['id'];
 *     // ...
 *   }
 * }
 */
export interface IBrasilApiOperation<T = unknown> {
  /**
   * Path relativo do endpoint na BrasilAPI, podendo conter placeholders.
   * Exemplos: `'/cnpj/v1/{cnpj}'`, `'/registrobr/v1/{domain}'`.
   * Usado como referência; a interpolação dos placeholders é feita dentro de `execute`.
   */
  readonly path: string;

  /**
   * Executa a consulta ao endpoint da BrasilAPI com os parâmetros fornecidos.
   *
   * @param params - Mapa de parâmetros dinâmicos (ex.: `{ cnpj: '00000000000191' }`).
   *   Valores ausentes chegam como `undefined`; a implementation deve validar
   *   os parâmetros obrigatórios e retornar `left(SourceError)` se faltar algo.
   * @returns `Either` com {@link SourceError} em falha ou o payload tipado em sucesso.
   */
  execute(params: Record<string, string | undefined>): Promise<Either<SourceError, T>>;
}
