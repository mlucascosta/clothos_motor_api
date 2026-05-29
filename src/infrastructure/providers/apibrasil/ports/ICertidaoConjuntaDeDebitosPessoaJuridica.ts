/**
 * @fileoverview Port para operation CertidaoConjuntaDeDebitosPessoaJuridica.
 * @module infrastructure/providers/apibrasil/ports/ICertidaoConjuntaDeDebitosPessoaJuridica
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CertidaoConjuntaDeDebitosPessoaJuridicaDto } from '../dtos/CertidaoConjuntaDeDebitosPessoaJuridicaDto.js';

export interface ICertidaoConjuntaDeDebitosPessoaJuridica {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CertidaoConjuntaDeDebitosPessoaJuridicaDto>>;
}
