/**
 * @fileoverview Port para operation Sms.
 * @module infrastructure/providers/apibrasil/ports/ISms
 */

import type { Either } from '@shared/domain/Either.js';
import type { SourceError } from '@shared/domain/errors/SourceError.js';
import type { SmsDto } from '../dtos/SmsDto.js';

export interface ISms {
  readonly path: string;
  readonly creditValue: number;
  readonly type: string;
  execute(
    params: Record<string, string | undefined>,
  ): Promise<Either<SourceError, SmsDto>>;
}
