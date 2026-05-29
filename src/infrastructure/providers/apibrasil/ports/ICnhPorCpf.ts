/**
 * @fileoverview Port para operation CnhPorCpf.
 * @module infrastructure/providers/apibrasil/ports/ICnhPorCpf
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { CnhPorCpfDto } from '../dtos/CnhPorCpfDto.js';

export interface ICnhPorCpf {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, CnhPorCpfDto>>;
}
