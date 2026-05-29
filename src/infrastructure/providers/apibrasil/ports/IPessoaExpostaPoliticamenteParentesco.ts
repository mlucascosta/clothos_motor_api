/**
 * @fileoverview Port para operation PessoaExpostaPoliticamenteParentesco.
 * @module infrastructure/providers/apibrasil/ports/IPessoaExpostaPoliticamenteParentesco
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { PessoaExpostaPoliticamenteParentescoDto } from '../dtos/PessoaExpostaPoliticamenteParentescoDto.js';

export interface IPessoaExpostaPoliticamenteParentesco {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, PessoaExpostaPoliticamenteParentescoDto>>;
}
